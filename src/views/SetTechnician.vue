<template>
  <div class="setter">
    <Header :text="'输入技师号'" :handle="true"  @back="backPage" >
    </Header>
    <div class="content">
      <div class="technician">
        <div>技师号:</div>
        <input v-model="TechnicianNo" class="class-input" placeholder="输入技师编号">
      </div>
      <div class="project">
        <div>项目:</div>
        <input class="select-input class-input"
               @click="changeFun"
               @blur="hideFun"
               v-model="ItemName"
               placeholder="选择或输入项目">
      </div>
      <div class="btn-content">
        <mt-button size="large" class="sub-btn" @click.native="subTechnician">提交</mt-button>
      </div>
    </div>

    <cui-attr-picker ref="changeAttrPicker"
                     @confirm="attrChange"
                     :listArr="projectArr"> </cui-attr-picker>
  </div>
</template>
<style lang="scss">
  @import "../styles/style";
  .setter .content{
    position: relative;
    height: 100vh;
  }
  .setter .content .btn-content{
    margin: 60px 20px;
  }
  .setter .content .btn-content .sub-btn{
    background: #F33131;
    border-radius: 8px;
    color: #fff;
    height: 88px;
    font-size: 14px;/*no*/
  }
  .setter .technician,
  .setter .project{
    background-color: #fff;
    margin: 20px 0;
    padding: 40px 30px;
    color: #333333;
    font-size: 14px;/*no*/
    box-sizing: border-box;
  }
  .setter .technician .class-input,
  .setter .project .class-input{
    margin-top: 20px;
    border-radius: 8px;
    border:1px solid #999999;/*no*/
    width: 100%;
    height: 88px;
    padding: 5px 40px 5px 20px ;
    font-size: 13px;/*no*/
    box-sizing: border-box;
  }
  .setter  .select-input{
    background: url("../assets/img/icon-select.png") no-repeat;
    background-position: 97% center;
    background-size: 15px 12px;
  }
  .setter .v-modal{
    display: none;
  }
</style>
<script>
  export default ({
    data:function () {
      return {
        projectArr:[],
        ItemName:'',
        ItemID:'',
        queryParams:{},
        TechnicianNo:''
      }
    },
    methods:{
      backPage:function () {
        this.$router.push({'path':'/manage'})
      },
      changeFun:function (idx) {
        this.projectIdx = idx;
        this.$refs.changeAttrPicker.open();
      },
      hideFun:function () {
        this.$refs.changeAttrPicker.close();
      },
      attrChange:function (picker,value)  {
        console.log(picker,value)
        this.ItemName= picker;
        this.ItemID = value;
      },
      subTechnician:function () {
        /**
         * 遍历提交参数是否有必填项
         * 服务类型
         * 0 不涉及 、1 轮钟、2 点钟、3 加钟、  4 加班、5 选钟、 6 推荐
         * TechnicianNo 点钟、推荐、选钟 加钟必填
         * TechnicianCount 轮钟 加班必填
         * TechnicianType 轮钟 加班必填
         * */
        let _ths = this;
        let LoginData = _ths.$api.getLocalData('loginData');
        let secreParams = _ths.SecreUtil.getParams(LoginData.PmsID,LoginData.UserId);
        let subParams={
          "Assigns":[{
            "RoomNo": _ths.queryParams.RoomNo||_ths.queryParams.No,//房间号
            "ServiceType": _ths.queryParams.ServiceType,//服务类型
            "TechnicianNo": _ths.TechnicianNo,//技师号 -- 点钟、推荐、选钟 加钟必填
            "TechnicianType": "",//技师类型 轮钟、加班必填
            "ItemID": _ths.ItemID,//项目ID
            "NewServiceClocks": 1,//钟数
            "TechnicianCount": 0, //技师人数 轮种 加班必填,
            "TechnicianName":'',
            "ItemName":''
          }],
          "Shift": LoginData.Shift,
          "PmsID": LoginData.PmsID,
          "CustomerNo": LoginData.CustomerNo,
          "UserId": LoginData.UserID,
          "Signature": secreParams.signature,
          "Timestamp": secreParams.timestamp,
          "IgnoreSignature": true
        }
        let flag = true;
        if(subParams.Assigns[0].TechnicianNo === ""){
          _ths.$mint.Toast({
            "position":'bottom',
            "message":'技师号必填'
          });
          flag = false;
        }

        console.log('sub------',subParams)
        if(flag){
          _ths.$api.post('TechnicianAssignTask',subParams).then(function (rets) {
            if(rets.code === 0){
              _ths.$router.push({path:'/roomStatus'})
            }else{
              _ths.$mint.Toast({
                "position":'bottom',
                "message":rets.message
              });
            }
          })
        }
      }
    },
    mounted:function () {
      let ths = this;
      let LoginData = ths.$api.getLocalData('loginData');
      let secreParams = ths.SecreUtil.getParams(LoginData.PmsID,LoginData.UserId);
      let itemParams ={
        "PageIndex": 1,
        "PageSize": 100,
        "PmsID": LoginData.PmsID,
        "CustomerNo": LoginData.CustomerNo,
        "UserId":LoginData.UserID ,
        "Signature":secreParams.signature,
        "Timestamp":secreParams.Timestamp,
        "IgnoreSignatrue":  secreParams.ignoreSignatrue
      }
      ths.$api.post('GetTechnicianItems',itemParams).then(function (rets) {
        if(rets.code === 0 ){
          let datas = rets.data.data;
          for(let i=0; i<datas.length;i++){
            let obj = {};
            obj.name=datas[i].ItemName;
            obj.code=datas[i].ItemID;
            ths.projectArr.push(obj);
            console.log(ths.projectArr)
          }
          console.log('ths.projectArr---------',ths.projectArr)

        }else{
          ths.$mint.$toast({
            position:'bottom',
            message:rets.message
          })
        }
      });
    },
    created:function () {
     // Object.assign(ths.$data, ths.$options.data());
      this.queryParams = this.$route.query;
      this.ItemName='';
      this.ItemID='';
      this.TechnicianNo='';

    }
  })
</script>
