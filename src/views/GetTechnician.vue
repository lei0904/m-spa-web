<template>
  <div class="get-technician">
    <Header :text="'安排项目'" :handle="true"  @back="backPage" >
    </Header>
    <div class="content">
      <div class="list-wrap" :style="{height:listHeight+'px'}">
          <div class="row list-title">
            <div class="item">技师类型</div>
            <div class="item">项目</div>
            <div class="item">技师人数</div>
          </div>
          <div class="list-items">
            <div class="row" v-for="(item,idx) in Assigns">
              <div class="item" @click="kneadFun(idx)">
                <span>{{item.TechnicianName||'点击设置'}}</span>
              </div>
              <div class="item"  @click="changeFun(idx)">
                  <span>{{item.ItemName||'可选可不选'}}</span>
              </div>
              <div class="item"  @click="numFun(idx)">
                  <span>{{item.TechnicianCount||0}}</span>
              </div>
            </div>
          </div>
        </div>
      <div class="btn-content">
        <mt-button size="large" class="sub-btn" @click="subProject">提交</mt-button>
      </div>

      <cui-attr-picker ref="kneadAttrPicker"
                       @confirm="kneadAttrChange"
                       :listArr="listArr"> </cui-attr-picker>
      <cui-attr-picker ref="changeAttrPicker"
                       @confirm="attrChange"
                       :listArr="projectArr"> </cui-attr-picker>
      <cui-attr-picker ref="numAttrPicker"
                       @confirm="numAttrChange"
                       :listArr="numArr"> </cui-attr-picker>
    </div>

    </div>
</template>
<style lang="scss">
  @import "../styles/style";
  .get-technician .content{
    .list-wrap{
    margin: 40px 0 0;
    overflow-y: scroll;
      .row{
        display: flex;
        flex-direction: row;
        align-items: stretch;
        justify-content: space-between;
        background-color: #fff;
        text-align: center;
        column-count: 3;
        position: relative;
        :before{
          content: "";
          position: absolute;
          height: 1px;/*no*/
          left:0;
          right: 0;
          bottom: 0;
          background-color:#E0E0E0;
        }
        .item{
          text-align: center;
          width: 250px;
          height: 110px;
          box-sizing: border-box;
          position: relative;
          span{
            background: url("../assets/img/icon-select.png") no-repeat;
            background-size: 13px 9px ;
            background-position: 200px center;

            padding: 40px 20px;
            height: 30px;
            line-height: 30px;
            display: block;
          }
        }
      }
      .list-title{
        height: 88px;
        line-height: 88px;
        font-size: 24px;
        color: #333333;
      }
      .list-items{
        margin-top: 20px;
        background-color: #fff;
        position: relative;
      }
    }
    .btn-content{
      margin: 20px 30px;
      .sub-btn{
        background: #F33131;
        border-radius: 8px;
        color: #fff;
        height: 88px;
        font-size: 14px;/*no*/
      }
    }
  }
</style>
<script>
  export default ({
    data:function () {
      return {
        listHeight:0,
        Assigns:[
          {
            "RoomNo": "",//房间号
            "ServiceType": 1,//服务类型
            "TechnicianNo": "",//技师号 -- 点钟、推荐、选钟 加钟必填
            "TechnicianType": "",//技师类型 轮钟、加班必填
            "ItemID": "",//项目ID
            "NewServiceClocks": 1,//钟数
            "TechnicianCount": 0, //技师人数 轮种 加班必填,
            "TechnicianName":'',
            "ItemName":''
          },
          {
            "RoomNo": "",
            "ServiceType": 1,
            "TechnicianNo": "",
            "TechnicianType": "",
            "ItemID": "",
            "NewServiceClocks": 1,
            "TechnicianCount": 0,
            "TechnicianName":'',
            "ItemName":''
          },
          {
            "RoomNo": "",
            "ServiceType": 1,
            "TechnicianNo": "",
            "TechnicianType": "",
            "ItemID": "",
            "NewServiceClocks": 1,
            "TechnicianCount": 0,
            "TechnicianName":'',
            "ItemName":''
          },
        ],
        listArr:[],
        projectArr:[],
        numArr:[
          {name:'1',code:1},
          {name:'2',code:2},
          {name:'3',code:3},
          {name:'4',code:4},
          {name:'5',code:5},
          {name:'6',code:6},
          {name:'7',code:7},
          {name:'8',code:8},
        ],
        kneadIdx:'',
        projectIdx:'',
        numIdx:'',
        queryParams:{},
        localParams:{
          PmsID:'',
          CustomerNo:'',
          UserId:'',
          Signature:'',
          Timestamp:'',
          IgnoreSignatrue:''
        }
      }
    },
    methods:{
      backPage:function () {
        this.$router.push({'path':'/roomStatus'})
      },
      kneadFun:function (idx) {
        this.kneadIdx = idx;
        this.$refs.kneadAttrPicker.open();
      },
      changeFun:function (idx) {
        this.projectIdx = idx;
        this.$refs.changeAttrPicker.open();
      },
      numFun:function (idx) {
        this.numIdx = idx;
        this.$refs.numAttrPicker.open();
      },
      kneadAttrChange:function (picker,value,visible) {
        console.log('kneadAttrChange',visible)
        this.$set(this.Assigns[this.kneadIdx],'TechnicianName',picker)
        this.$set(this.Assigns[this.kneadIdx],'TechnicianType',value)

        console.log(this.Assigns)
      },
      attrChange:function (picker,value)  {
        console.log('attrChange',value)
        this.$set(this.Assigns[this.projectIdx],'ItemName',picker)
        this.$set(this.Assigns[this.projectIdx],'ItemID',value)
        console.log(this.Assigns)

      },
      numAttrChange:function (picker,value)  {
        console.log('numAttrChange',value)
        this.$set(this.Assigns[this.numIdx],'TechnicianCount',value)
      },
      subProject:function () {
        let _ths = this;

        let LoginData = _ths.$api.getLocalData('loginData');
        let secreParams = _ths.SecreUtil.getParams(LoginData.PmsID,LoginData.UserId);

        let subParams={
          "Assigns":[],
          "Shift": LoginData.Shift,
          "PmsID": LoginData.PmsID,
          "CustomerNo": LoginData.CustomerNo,
          "UserId": LoginData.UserID,
          "Signature": secreParams.signature,
          "Timestamp": secreParams.timestamp,
          "IgnoreSignature": secreParams.ignoreSignatrue
        };

        /**
         * 遍历提交参数是否有必填项
         * 服务类型
         * 0 不涉及 、1 轮钟、2 点钟、3 加钟、  4 加班、5 选钟、 6 推荐
         * TechnicianNo 点钟、推荐、选钟 加钟必填
         * TechnicianCount 轮钟 加班必填
         * TechnicianType 轮钟 加班必填
         * */

        let flag= true;

        for(let i=0; i<_ths.Assigns.length;i++){
          if(_ths.Assigns[i].TechnicianCount <=0 && _ths.Assigns[i].TechnicianType !==""){
            _ths.$mint.Toast({
              "position":'bottom',
              "message":'技师人数必填'
            });
            flag = false;
            break;
          }
          if(_ths.Assigns[i].TechnicianCount >0 && _ths.Assigns[i].TechnicianType ===""){
            _ths.$mint.Toast({
              "position":'center',
              "message":'技师类型必填'
            });
            flag = false;
            break;
          }

          if(_ths.Assigns[i].TechnicianType !=="" && _ths.Assigns[i].TechnicianCount > 0){
            _ths.Assigns[i].RoomNo = _ths.queryParams.RoomNo ||_ths.queryParams.No;
            _ths.Assigns[i].ServiceType = _ths.queryParams.ServiceType;
            subParams.Assigns.push(_ths.Assigns[i]);
          }
          if( subParams.Assigns.length<=0){
            flag = false;
            _ths.$mint.Toast({
              "position":'center',
              "message":'技师人数和技师类型必填'
            });
          }
        }

        if(flag){
          _ths.$api.post('TechnicianAssignTask',subParams).then(function (rets) {
            if(rets.code === 0){
            _ths.$router.push({path:'/manageTech',query:_ths.queryParams})
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
    created:function () {
      let ths = this;
      let LoginData = ths.$api.getLocalData('loginData');
      let secreParams = ths.SecreUtil.getParams(LoginData.PmsID,LoginData.UserId);
      ths.localParams = {
        "PmsID": LoginData.PmsID,
        "CustomerNo": LoginData.CustomerNo,
        "UserId":LoginData.UserID ,
        "Signature":secreParams.signature,
        "Timestamp":secreParams.Timestamp,
        "IgnoreSignatrue": secreParams.ignoreSignatrue
      };
      let techParams ={
        "PageIndex": 1,
        "PageSize": 100,
        "PmsID": LoginData.PmsID,
        "CustomerNo": LoginData.CustomerNo,
        "UserId":LoginData.UserID ,
        "Signature":secreParams.signature,
        "Timestamp":secreParams.Timestamp,
        "IgnoreSignatrue":  secreParams.ignoreSignatrue
      }
      ths.$api.post('GetTechnicianItems',techParams).then(function (rets) {
        if(rets.code === 0 ){
          let datas = rets.data.data;
          for(let i=0; i<datas.length;i++){
            let obj = {};
            obj.name=datas[i].ItemName;
            obj.code=datas[i].ItemID;
            ths.projectArr.push(obj);
            console.log(ths.projectArr)
          }
        }else{
          ths.$mint.$toast({
            position:'bottom',
            message:rets.message
          })
        }
      });
      ths.$api.post('GetTechnicianType',ths.localParams).then(function (rets) {
        if(rets.code === 0 ){
          //ths.listArr = rets.data;
          for(let i=0; i<rets.data.length;i++){
            let obj = {};
            obj.name=rets.data[i].Name;
            obj.code=rets.data[i].Code;
            obj.id=rets.data[i].ID;
            ths.listArr.push(obj);
          }
          console.log('listArr--',ths.listArr)
        }else{
          ths.$vue.$toast({
            position:'bottom',
            message:rets.message
          })
        }
      });
      ths.queryParams = ths.$route.query;
      ths.listHeight = document.body.clientHeight - 150 * window.dpr;

    }
  })
</script>
