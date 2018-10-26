<template>
  <div class="change-info">
    <Header :text="'修改信息'" :handle="true"  @back="backPage" >
    </Header>
    <div class="content">
      <div class="title">项目信息:</div>
      <div class="info-panel">
        <div class="cell">
          <div class="label-name">房号</div>
          <div class="item">{{roomInfo.RoomNo}}</div>
        </div>
        <div class="cell">
          <div class="label-name">技师号</div>
          <div class="item">
            <span >{{roomInfo.TechnicianNo}}</span>
          </div>
        </div>
        <div class="cell">
          <div class="label-name">手牌</div>
          <div class="item read-only">
            <span>{{roomInfo.SDINo}}</span>
          </div>
        </div>
        <div class="cell">
          <div class="label-name">项目</div>
          <div class="item">
            <span>{{roomInfo.ItemName}}</span>
          </div>
        </div>
        <div class="cell" @click="changeProject">
          <div class="label-name">新项目</div>
          <div class="item project-color select-item">
            <span>{{newItem.ItemName}}</span>
          </div>
        </div>
        <div class="cell">
          <div class="label-name">钟数</div>
          <div  class="item select-item" @click="clockOpen">
            <span>{{roomInfo.ServiceClocks}}</span>
          </div>
        </div>
        <div class="cell" @click="orderSheetOpen">
          <div class="label-name">点单方式</div>
          <div class="item select-item">{{roomInfo.ServiceTypeName}}</div>
        </div>
        <div class="cell" @click="roomSheetOpen">
          <div class="label-name">新房号</div>
          <div class="item select-item">{{newRoom.name}}</div>
        </div>
      </div>

      <div class="btn-content">
        <mt-button size="large" class="sub-btn" @click="subInfo">提交</mt-button>
      </div>
    </div>

    <cui-attr-picker ref="roomAttrPicker"
                     @confirm="roomInfoChange"
                     :listArr="roomArr"> </cui-attr-picker>
    <mt-popup v-model="orderSheetVisible"
              position="bottom"
              class="ces-mt-popup">
      <div class="mint-actionsheet">
        <div class="popup-title"><span>点单方式</span></div>
        <ul class="mint-actionsheet-list">
          <li class="mint-actionsheet-listitem"
              v-for = "item in orderActions"
              @click="orderSheet(item)"
          >{{item.Name}}</li>
        </ul>
        <!--<a class="mint-actionsheet-button" href="#" @click="cancelAction">取消</a>-->
      </div>
    </mt-popup>

    <cui-attr-picker ref="changeProjectPicker"
                     @confirm="attrChange"
                     :listArr="projectArr"> </cui-attr-picker>

  <!--  <cui-attr-picker ref="changeTechPicker"
                     @confirm="attrTechChange"
                     :listArr="techArr"> </cui-attr-picker>-->
    <cui-attr-picker ref="changeClockPicker"
                     @confirm="attrClockChange"
                     :listArr="clockArr"> </cui-attr-picker>
  </div>
</template>
<style lang="scss">
  @import "../styles/style";
  .change-info {
    .content {
    position: relative;
    height: 100vh;
    .title {
      color: #000000;
      font-size: 14px; /*no*/
      height: 88px;
      line-height: 88px;
      padding-left: 30px;
    }
    .btn-content {
      position: absolute;
      bottom: 150px;
      left: 30px;
      right: 30px;
      .sub-btn {
        background: #F33131;
        border-radius: 8px;
        color: #fff;
        height: 88px;
        font-size: 14px; /*no*/
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
        color: #333333;
        font-size: 13px;/*no*/
        border-bottom: 1px solid #e0e0e0;/*no*/
        .item{
          padding-right: 50px;
          color: #999999;
          input{
            text-align: right;
          }
        }
        .select-item{
           background: url("../assets/img/icon-select.png") no-repeat;
           background-size: 13px 9px;
           background-position: right center;
           color: #333;
         }
        .qrcode-item{
          background: url("../assets/img/icon-qrcode.png") no-repeat;
          background-size: 42px 42px;
          background-position: right center;
          color: #333;
        }
        .project-color{
          color: $blueColor;
        }
      }
    }
  }
    .ces-mt-popup{
      width: 100%;
      .mint-actionsheet{
        color: #999999;
        font-size: 13px;/*no*/
        .popup-title{
          background: #fff;
          font-size: 16px;/*no*/
          height: 90px;
          line-height: 90px;
          text-align: left;
          padding: 0 30px;
          color: #333333;
          font-weight: bold;
          border-bottom: 1px solid #e0e0e0;/*no*/
        }
        .mint-actionsheet-list{
          margin-bottom: 5px;
          background: #fff;
          .mint-actionsheet-listitem{
            padding: 0 30px;
            font-size: 13px;/*no*/
          }
        }
      }
    }
  }
</style>
<script>
  export default ({
    data:function () {
      return {
        roomInfo:{},
        roomArr:[],
        newRoom:{
          id:'',
          name:''
        },
        newItem:{
          ItemID:'',
          ItemName:''
        },
        orderSheetVisible:false,
        orderActions:[],
        projectArr:[],
        clockArr:[
          {name:1,code:1},
          {name:2,code:2},
          {name:3,code:3},
          {name:4,code:4},
          {name:5,code:5}],
        histroyRoomInfo:{},
      }
    },
    methods:{
      backPage:function () {
        this.$router.push({'path':'/manageTechDetail',query:this.histroyRoomInfo})
      },
      orderSheetOpen:function(){
        this.orderSheetVisible = true;
      },
      roomSheetOpen:function () {
        this.$refs.roomAttrPicker.open();
      },
      roomInfoChange:function (picker,value) {
        this.newRoom.id=value;
        this.newRoom.name=picker;
      },
      orderSheet:function (item) {
      /*  this.newOrder.id= item.EnumCode;
        this.newOrder.name = item.EnumName;*/
        this.roomInfo.ServiceTypeName = item.Name;
        this.roomInfo.ServiceType = item.Code;
        this.orderSheetVisible = false;
      },
      changeProject:function (idx) {
        this.projectIdx = idx;
        this.$refs.changeProjectPicker.open();
      },
      attrChange:function (picker,value)  {
        console.log(picker,value)
        this.newItem.ItemName= picker;
        this.newItem.ItemID = value;
      },
   /*   attrTechChange:function (picker,value) {
        console.log(picker,value)
        this.currentTechnicianNo = value;
      },*/
      clockOpen:function(){
        this.$refs.changeClockPicker.open();
       /* this.getTechnicianTask(this.currentTechnicianNo);*/
      },
      attrClockChange:function (picker,value) {
        console.log(picker,value)
        this.roomInfo.ServiceClocks = value;
      },
      subInfo:function () {
        let ths = this;
        let LoginData = ths.$api.getLocalData('loginData');
        let secreParams = ths.SecreUtil.getParams(LoginData.PmsID,LoginData.UserId);
        let params={
          "SDINo": ths.roomInfo.SDINo,
          "ItemID": ths.newItem.ItemID,
          "ServiceLocationCode":ths.newRoom.id|| ths.roomInfo.RoomID||ths.roomInfo.ID,
          "RoomNo": ths.newRoom.name || ths.roomInfo.RoomName,
          "ServiceClocks": ths.roomInfo.ServiceClocks,
          "ServiceType": ths.roomInfo.ServiceType,
          "TechnicianNo": ths.roomInfo.TechnicianNo,
          "AutoOffService": false,
          "Shift": LoginData.Shift,
          "PmsID":LoginData.PmsID,
          "CustomerNo": LoginData.CustomerNo,
          "UserId": LoginData.UserID,
          "Signature": secreParams.signature,
          "Timestamp": secreParams.timestamp,
          "IgnoreSignature": secreParams.ignoreSignatrue
        }
        if(!params.ItemID){
          ths.$mint.Toast({
            position:'center',
            message:'请选择新项目'
          });
          return false;
        }
        if(!params.ServiceClocks){
          ths.$mint.Toast({
            position:'center',
            message:'请选择钟数'
          });
          return false;
        }
        if(!params.ServiceType){
          ths.$mint.Toast({
            position:'center',
            message:'请选择点单方式'
          });
          return false;
        }
        if(!params.RoomNo){
          ths.$mint.Toast({
            position:'center',
            message:'请选择新房号'
          });
          return false;
        }
        ths.$api.post('UpdateServiceInfo',params).then(function (rets) {
          console.log('UpdateServiceInfo---',rets)
          if(rets.code === 0 ){
            //ths.$router.push({path:'/roomStatus'})
            ths.$router.push({'path':'/manageTech',query:ths.histroyRoomInfo})

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
      console.log('secreParams--',secreParams)
      let localParams = {
        "PmsID": LoginData.PmsID,
        "CustomerNo": LoginData.CustomerNo,
        "UserId":LoginData.UserID ,
        "Signature":secreParams.signature,
        "Timestamp":secreParams.timestamp,
        "IgnoreSignatrue": secreParams.ignoreSignatrue
      }

      ths.$api.post('GetAllRoom',localParams).then(function (rets) {
        console.log("-------------",rets);
        if(rets.code === 0){
          for(let i=0; i< rets.data.length;i++){
            let obj= {};
            obj.name = rets.data[i].RoomNo;
            obj.code = rets.data[i].RoomID;
            obj.status = rets.data[i].RoomStatus;
            ths.roomArr.push(obj);
          }
        }
      })
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
            ths.projectArr.push(obj)
          }
          console.log('ths.projectArr---------',ths.projectArr)

        }else{
          ths.$mint.Toast({
            position:'bottom',
            message:rets.message
          })
        }
      });

      ths.$api.post('GetTechnicianOrderMode',localParams).then(function (rets) {
        console.log("-------------GetTechnicianOrderMode",rets);
        if(rets.code === 0){
          for(let i=0; i< rets.data.length;i++){
            ths.orderActions.push(rets.data[i])
          }
          //ths.orderActions = rets.data;
        }
      })

      ths.histroyRoomInfo = ths.$route.query;
      ths.roomInfo = ths.$route.query;
      console.log('changeInfo', ths.roomInfo );
      ths.newRoom.id =ths.roomInfo.RoomID;
      ths.newRoom.name =ths.roomInfo.RoomNo;
      ths.newItem.ItemID =ths.roomInfo.ItemID;
      ths.newItem.ItemName =ths.roomInfo.ItemName;
    },
    mounted:function () {

    }
  })
</script>
