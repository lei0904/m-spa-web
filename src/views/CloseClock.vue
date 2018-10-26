<template>
  <div class="close-clock">
    <Header :text="'下钟'" :handle="true"  @back="backPage" >
    </Header>
    <div class="content">
      <div class="title">项目信息:</div>
      <div class="info-panel">
        <div class="cell">
          <div class="label-name">手牌</div>
          <div class="item">{{subObj.SDINo}}</div>
        </div>
        <div class="cell">
          <div class="label-name">房号</div>
          <div class="item">{{subObj.RoomNo}}</div>
        </div>
        <div class="cell">
          <div class="label-name">项目</div>
          <div class="item">
            <span>{{subObj.ItemName}}</span>
          </div>
        </div>
        <div class="cell">
          <div class="label-name">钟数</div>
          <div  class="item">
            <span>{{subObj.ServiceClocks}}</span>
          </div>
        </div>
        <div class="cell">
          <div class="label-name">点单方式</div>
          <div class="item">{{subObj.ServiceTypeName}}</div>
        </div>
        <div class="cell">
          <div class="label-name">落钟时间</div>
          <div class="item">{{currentDate}}</div>
        </div>
      </div>

      <div class="btn-content">
        <mt-button size="large" class="sub-btn" @click="subClockInfo">提交</mt-button>
      </div>
    </div>
  </div>
</template>
<style lang="scss">
  @import "../styles/style";
  .close-clock .content{
    position: relative;
    height: 100vh;
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
    .btn-content{
      position: absolute;
      bottom: 150px;
      left: 30px;
      right: 30px;
      .sub-btn{
        background: #F33131;
        border-radius: 8px;
        color: #fff;
        height: 88px;
        font-size: 14px;/*no*/
      }
    }
    .info-panel{
      background: #fff;
      .cell{
      padding:0 30px;
      display: flex;
      justify-content: space-between;
      height: 88px;
      line-height: 88px;
      color: #333;
      font-size: 13px;/*no*/
      border-bottom: 1px solid #e0e0e0;/*no*/
      }
      .item{
        padding-right: 50px;
        color: #999999;
        input{
          text-align: right;
          border: none;
          outline: medium;
        }
        .select-item{
          background: url("../assets/img/icon-select.png") no-repeat;
          background-size: 13px 9px;
          background-position: right center;
          color: #999;
        }
        .qrcode-item{
          background: url("../assets/img/icon-qrcode.png") no-repeat;
          background-size: 42px 42px;
          background-position: right center;
        }
        .project-color{
          color: $blueColor;
        }
        .item{
          padding-right: 50px;
          color: #999999;
          input{
            text-align: right;
          }
          .select-item{
            background: url("../assets/img/icon-select.png") no-repeat;
            background-size: 13px 9px;
            background-position: right center;
            color: #999;
          }
          .qrcode-item{
            background: url("../assets/img/icon-qrcode.png") no-repeat;
            background-size: 42px 42px;
            background-position: right center;
          }
          .project-color{
            color: $blueColor;
          }
        }
      }
    }
  }
</style>
<script>
  import moment from 'moment'
  export default ({
    data:function () {
      return {
        subObj:{},
        ItemName:'',
        projectArr:[],
        currentDate:''

      }
    },
    methods:{
      backPage:function () {
        this.$router.push({'path':'/manageTechDetail',query:this.subObj})
      },
      getCurrentDate:function(){
        this.currentDate = moment(this.currentDate).add(1,'s').format('YYYY-MM-DD HH:mm:ss');
      },
      subClockInfo:function () {
        let ths = this;
        let LoginData = ths.$api.getLocalData('loginData');
        let secreParams = ths.SecreUtil.getParams(LoginData.PmsID,LoginData.UserId);
        let params ={
          "TechnicianNo":ths.subObj.TechnicianNo,
          "OffServiceTime":ths.currentDate,
          "SDINo": ths.subObj.SDINo,
          "Shift": LoginData.Shift,
          "PmsID": LoginData.PmsID,
          "CustomerNo": LoginData.CustomerNo,
          "UserId": LoginData.UserID,
          "Signature": secreParams.signature,
          "Timestamp": secreParams.timestamp,
          "IgnoreSignature": secreParams.ignoreSignatrue
        }
        ths.$api.post('TechnicianOffService',params).then(function (rets) {
          if(rets.code === 0 ){
            ths.$router.push({path:'/roomStatus',query:ths.historyInfo})
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
        "IgnoreSignatrue": true
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
      Object.assign(ths.subObj,ths.$route.query);
      console.log('ths.subObj---',ths.subObj);
      let systemTimeParams ={
        "Shift": LoginData.Shift,
        "PmsID": LoginData.PmsID,
        "CustomerNo":LoginData.CustomerNo,
        "UserId": LoginData.UserID,
        "Signature": secreParams.signature,
        "Timestamp": secreParams.timestamp,
        "IgnoreSignature": secreParams.ignoreSignatrue
      }
      ths.$api.post('GetSystemTime',systemTimeParams).then(function(rets){
        console.log(rets)
        if(rets.code === 0){
          window.clearInterval(ths.getDate);
          ths.currentDate =moment(rets.data).format('YYYY-MM-DD HH:mm:ss');
          ths.getDate = setInterval(ths.getCurrentDate,1000)
        }else{
          ths.$mint.Toast({
            position:'center',
            message:rets.message
          });
        }
      })
    }
  })
</script>
