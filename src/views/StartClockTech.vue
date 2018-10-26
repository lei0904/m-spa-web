<template>
  <div class="start-clock">
    <Header :text="'上钟'" :handle="true"  @back="backPage" >
    </Header>
    <div class="content">
      <div class="title">项目信息:</div>
      <div class="info-panel">
        <div class="cell">
          <div class="label-name">房号</div>
          <div class="item read-only">{{subObj.RoomNo}}</div>
        </div>
        <div class="cell">
          <div class="label-name">手牌</div>
          <div class="item read-only">
            <input  v-model="subObj.SDINo" class="sdi-input">
            <i class=" qrcode-item"  @click="qrCode"></i>
          </div>
        </div>
        <div class="cell" @click="changeProject">
          <div class="label-name">项目</div>
          <div class="item project-color select-item">
            <span>{{ItemName}}</span>
          </div>
        </div>
        <div class="cell">
          <div class="label-name">钟数</div>
          <div  class="item read-only">
            <span>{{subObj.ServiceClocks}}</span>
          </div>
        </div>
        <div class="cell">
          <div class="label-name">点单方式</div>
          <div class="item read-only">{{subObj.ServiceTypeName}}</div>
        </div>
        <div class="cell">
          <div class="label-name">安排时间</div>
          <div class="item read-only">{{subObj.AssignEditTime}}</div>
        </div>
      </div>

      <div class="btn-content">
        <mt-button size="large" class="sub-btn" @click="subInfo">提交</mt-button>
      </div>
    </div>
    <cui-attr-picker ref="changeProjectPicker"
                     @confirm="attrChange"
                     :listArr="projectArr"> </cui-attr-picker>
  </div>
</template>
<style lang="scss">
  @import "../styles/style";
  .start-clock {
    .content{
      position: relative;
      height: 100vh;
    .btn-content{
      margin: 40px 20px;
      .sub-btn{
        background: #F33131;
        border-radius: 8px;
        color: #fff;
        height: 88px;
        font-size: 14px;/*no*/
      }
    }
    .read-only{
      color: #999999;
    }
    .info-panel{
      background: #fff;
      .cell{
        padding:0 30px;
        display: flex;
        justify-content: space-between;
        height: 88px;
        line-height: 88px;
        color: #333333;
        font-size: 13px;/*no*/
        border-bottom: 1px solid #e0e0e0;/*no*/
      }
      .project-color{
        color: $blueColor !important;
      }
      .item{
        flex: 1;
        text-align: right;
        box-sizing: border-box;
        position: relative;
        .sdi-input{
          margin-right: 60px;
        }
        input{
          height: 88px;
          line-height: 88px;
          flex: 1;
          text-align: right;
          box-sizing: border-box;
        }
      }
      .select-item{
        background: url("../assets/img/icon-select.png") no-repeat;
        background-size: 13px 9px;
        background-position: right center;
        padding-right: 50px;
      }
      .qrcode-item{
        background: url("../assets/img/icon-qrcode.png") no-repeat;
        background-size: 60px 60px;
        background-position: right center;
        width: 60px;
        height: 60px;
        margin-top: 11px;
        position: absolute;
        right: 0;
      }
    }

    .ces-mt-popup{
      width: 100%;
      .mint-actionsheet{
        color: #999999;
        font-size: 13px;/*no*/
      }
      .popup-title{
        background: #fff;
        font-size: 16px;/*no*/
      }
      .mint-actionsheet-list{
        margin-bottom: 5px;
        background: #fff;
      }
      .popup-title{
        height: 90px;
        line-height: 90px;
        text-align: left;
        padding: 0 30px;
        color: #333333;
        font-weight: bold;
        font-size:32px;
        border-bottom: 1px solid #e0e0e0;/*no*/
      }
    }
  }
    .title{
      color: #000000;
      font-size: 14px;/*no*/
      height: 88px;
      line-height: 88px;
      padding-left: 30px;
      background: #fff;
      margin-top: 20px;
      font-weight: bold;
      border-bottom: 1px solid #e0e0e0;/*no*/
    }
  }


  .start-clock .title{
    color: #000000;
    font-size: 14px;/*no*/
    height: 88px;
    line-height: 88px;
    padding-left: 30px;
    background: #fff;
    margin-top: 20px;
    font-weight: bold;
    border-bottom: 1px solid #e0e0e0;/*no*/
  }

</style>
<script>
  import Ces from '../components/ces/ces.js'
  export default ({
    data:function () {
      return {
        historyInfo:{},
        subObj:{
          RoomNo:'',
          SDINo:'',
          ServiceClocks:'',
          ServiceTypeName:'',
          AssignEditTime:''
        },
        ItemName:'',
        projectArr:[],

      }
    },
    methods:{
      backPage:function () {
        this.$router.push({'path':'/manageTechDetail',query:this.historyInfo})
      },
      changeProject:function (idx) {
        this.projectIdx = idx;
        this.$refs.changeProjectPicker.open();
      },

      qrCode:function () {
        console.log('qrCode-----')
        if(Ces.Config.plugin){
          Ces.Plugins.Scan.call(this.getQrCode)
        }else{
          console.log('web测试未调用插件')
        }
      },
      getQrCode:function (rets) {
        console.log('getQrCode----',rets)
        let ts = this;

        let LoginData = ts.$api.getLocalData('loginData');
        let secreParams = ts.SecreUtil.getParams(LoginData.PmsID,LoginData.UserId);
        if(rets.status === 1){
          console.log(rets.data.url)
          let params = {
            "SDIId": rets.data.url,
            "PmsID":LoginData.PmsID,
            "CustomerNo": LoginData.CustomerNo,
            "UserId": LoginData.UserID,
            "Signature": secreParams.signature,
            "Timestamp": secreParams.timestamp,
            "IgnoreSignature": secreParams.ignoreSignatrue
          }
          ts.$api.post('GetSDINoByID',params).then(function(rets){
            console.log('GetSDINoByID',rets)
            if(rets.code === 0){
              //
              ts.$nextTick(function () {
                ts.subObj.SDINo = rets.data;
               // ts.$set(ts.subObj,'SDINo',rets.data)
              })
            }else{
              ts.$mint.Toast({
                position:'center',
                message:rets.message
              })
            }
          })
        }else{
          this.$mint.Toast({
            position:'center',
            message:rets.message
          })
        }
      },
      attrChange:function (picker,value)  {
        console.log(picker,value)
        this.subObj.ItemName= picker;
        this.subObj.ItemID = value;
        this.ItemName = picker;
        console.log('===subObj',this.subObj)
      },
      subInfo:function () {
        let ths = this;
        let LoginData = ths.$api.getLocalData('loginData');
        let secreParams = ths.SecreUtil.getParams(LoginData.PmsID,LoginData.UserId);
        let params ={
          "SDINo": ths.subObj.SDINo,//'"string",
          "ServiceLocationCode": ths.subObj.RoomID ||ths.subObj.ID,
          "ItemID": ths.subObj.ItemID,
          "OnServiceTime": "",
          "ServiceClocks": ths.subObj.ServiceClocks,
          "ServiceType":ths.subObj.ServiceType,
          "AutoOffService": false,
          "TechnicianNo":ths.subObj.TechnicianNo,
          "Shift": LoginData.Shift,
          "PmsID": LoginData.PmsID,
          "CustomerNo": LoginData.CustomerNo,
          "UserId": LoginData.UserID,
          "Signature": secreParams.signature,
          "Timestamp": secreParams.timestamp,
          "IgnoreSignature": secreParams.ignoreSignatrue
        }

        if(!ths.subObj.SDINo){
          ths.$mint.Toast({
            position:'center',
            message:'请输入手牌'
          });
          return false;
        }
        if(!ths.subObj.ItemID){
          ths.$mint.Toast({
            position:'center',
            message:'请输入项目名称'
          });
          return false;
        }
        ths.$api.post('OnService',params).then(function (rets) {
          console.log('OnService---',rets)
          if(rets.code === 0 ){
            ths.$router.push({path:'/manageTech',query:ths.historyInfo})
          }else{
            ths.$mint.Toast({
              position:'center',
              message:rets.message
            })
          }
        })
      }
    },
    created:function () {
      let ths = this;
      let LoginData = ths.$api.getLocalData('loginData');
      let secreParams = ths.SecreUtil.getParams(LoginData.PmsID,LoginData.UserId);
      let params ={
        "PageIndex": 1,
        "PageSize": 100,
        "PmsID": LoginData.PmsID,
        "CustomerNo": LoginData.CustomerNo,
        "UserId":LoginData.UserID ,
        "Signature":secreParams.signature,
        "Timestamp":secreParams.Timestamp,
        "IgnoreSignatrue": secreParams.ignoreSignatrue
      }
      ths.$api.post('GetTechnicianItems',params).then(function (rets) {
        if(rets.code === 0 ){
          let datas = rets.data.data;
          for(let i=0; i<datas.length;i++){
            let obj = {};
            obj.name=datas[i].ItemName;
            obj.code=datas[i].ItemID;
            ths.projectArr.push(obj)
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

      ths.historyInfo = ths.$route.query;
      Object.assign(ths.subObj,ths.$route.query);
      ths.ItemName = ths.subObj.ItemName;
      console.log("ths.subObj---",ths.subObj)
      console.log("ths.historyInfo---",ths.historyInfo)
    }
  })
</script>
