<template>
  <div class="update-service">
    <Header :text="title" :handle="true"  @back="backPage" >
    </Header>
    <div class="content">
      <div class="title">项目信息:</div>
      <div class="info-panel">
        <div class="cell" @click="roomOpen('room')">
          <div class="label-name">房号</div>
          <div class="item" :class="sourceFlag === 2 ? 'select-item':''">{{serviceObj.RoomNo}}</div>
        </div>

        <div class="cell">
          <div class="label-name">手牌</div>
         <!-- <div class="item" :class="sourceFlag === 0 ? 'qrcode-item':''" >-->
            <div class="item ">
              <input class="sdino-input" v-model="serviceObj.SDINo" :readonly="sourceFlag !== 0 " :class="sourceFlag === 0 ? 'mr':''"/>
              <i class="qrcode-item"  @click="qrCode" v-if="sourceFlag ===0 "></i>
            </div>
        </div>
        <div class="cell" v-show=" sourceFlag ===2 ">
          <div class="label-name">原项目</div>
          <div class="item">{{serviceObj.ItemName}}</div>
        </div>
        <div class="cell"  @click="itemOpen('newItem')"  v-show="sourceFlag ===2">
          <div class="label-name">新项目</div>
          <div class="item" :class=" sourceFlag ===2 ? 'select-item-blue':''">{{newItemName}}</div>
        </div>
        <div class="cell"  v-show="sourceFlag !==2" @click="itemOpen('item')">
          <div class="label-name">项目</div>
          <div class="item" :class="sourceFlag ===0 || sourceFlag ===1 ? 'select-item-blue':''">{{serviceObj.ItemName}}</div>
        </div>
        <div class="cell" @click="clockOpen('clock')">
          <div class="label-name">钟数</div>
          <div  class="item" :class="(sourceFlag ===1)? 'select-item':''" >
            <input  v-model="serviceObj.ServiceClocks" :style="sourceFlag !==1 ? 'color:#999999':''"  :readonly = 'sourceFlag !==1' /></div>
        </div>
        <div class="cell"
             @click="clockOpen('add')"
             v-show="sourceFlag ===2">
          <div class="label-name">加钟数</div>
          <div  class="item" :class=" sourceFlag === 2? 'select-item':''">
            <input  v-model="NewServiceClocks" />
          </div>
        </div>
        <div class="cell" >
          <div class="label-name">点单方式</div>
          <div class="item">{{serviceObj.ServiceTypeName}}</div>
        </div>
   <!--     <div class="cell" v-show="sourceFlag ===0 ">
          <div class="label-name">起钟时间</div>
          <div class="item">{{serviceObj.OnServiceTime}}</div>
        </div>-->
        <div class="cell" v-show="sourceFlag ===3 ">
          <div class="label-name">下钟时间</div>
          <div class="item">{{currentDate}}</div>
        </div>
        <div class="cell" v-show="sourceFlag ===0 ">
          <div class="label-name">安排时间</div>
          <div class="item">{{serviceObj.AssignEditTime}}</div>
        </div>
        <div class="cell" v-show="sourceFlag === 1" @click="roomOpen('newRoom')">
        <div class="label-name">新房号</div>
        <div class="item" :class="sourceFlag ===1 ? 'select-item':''">{{newRoomNo}}</div>
      </div>
      </div>

      <div class="btn-content">
        <mt-button size="large" class="sub-btn" @click="subService">提交</mt-button>
      </div>
    </div>

    <cui-attr-picker ref="itemAttrPicker"
                     @confirm="itemAttrChange"
                     :listArr="itemArr"> </cui-attr-picker>
    <cui-attr-picker ref="clockAttrPicker"
                     @confirm="clockAttrChange"
                     :listArr="clockArr"> </cui-attr-picker>
   <!-- <cui-attr-picker ref="serviceTypePicker"
                     @confirm="serviceTypeAttrChange"
                     :listArr="serviceTypeArr"> </cui-attr-picker>-->
    <cui-attr-picker ref="roomAttrPicker"
                     @confirm="roomAttrChange"
                     :listArr="roomArr"> </cui-attr-picker>
  </div>
</template>
<style lang="scss">
  @import "../styles/style";
  .update-service .content{
    position: relative;
    .title{
      font-weight: bold;
      color: #000000;
      font-size: 14px;/*no*/
      height: 88px;
      line-height: 88px;
      padding-left: 30px;
      background: #fff;
      border-bottom: 1px solid #e0e0e0;/*no*/
      margin-top: 20px;
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
        .label-name{
          width: 140px;
        }
      }
      .item{
        box-sizing: border-box;
        padding-right: 20px;
        color: $grayColor;
        text-align: right;
        position: relative;
        .sdino-input{
          color: $grayColor;
          width: calc(100% - 60px);
          height: 88px;
          line-height: 88px;
        }
        .mr{
          margin-right: 120px;
        }
      }
      .select-item{
        background: url("../assets/img/icon-select.png") no-repeat;
        background-size: 13px 9px;
        background-position: right center;
        color:#333;
      }
      .select-item-blue{
        background: url("../assets/img/icon-select.png") no-repeat;
        background-size: 13px 9px;
        background-position: right center;
        color:$blueColor;
      }
      .qrcode-item{
        background: url("../assets/img/icon-qrcode.png") no-repeat;
        background-size: 60px 60px;
        background-position: right center;
        width: 60px;
        height: 60px;
        position: absolute;
        top:10px;
        right: 0;
      }
    }
    .btn-content{
    margin: 60px 40px;
      .sub-btn{
        background: #F33131;
        border-radius: 8px;
        color: #fff;
        height: 88px;
        font-size: 14px;/*no*/
      }
  }
  }

  .update-service .info-panel .project-color{
    color: $blueColor;
  }
 /* .update-service .info-panel .item{
    display: flex;
    flex: 1;
    box-sizing: border-box;
    padding-right: 20px;
    color: $grayColor;
  }*/
  .update-service .info-panel .item input{
    text-align: right;
  }
 /* .update-service {
    .info-panel {
      .select-item{
        background: url("../assets/img/icon-select.png") no-repeat;
        background-size: 13px 9px;
        background-position: right center;
        color:#333;
      }
      .select-item-blue{
        background: url("../assets/img/icon-select.png") no-repeat;
        background-size: 13px 9px;
        background-position: right center;
        color:$blueColor;
      }
      .qrcode-item{
        background: url("../assets/img/icon-qrcode.png") no-repeat;
        background-size: 60px 60px;
        background-position: right center;
        width: 60px;
        height: 60px;
        margin-top: 11px;
        display: block;
      }
    }
    .sdino-input{
      color: $grayColor;
    }
  }*/

</style>
<script>
  import moment from 'moment'
  import Ces from '../components/ces/ces.js'
  export default ({
    data:function () {
      return {
        sdi:'',
        serviceObj:{},
        itemName:'',
        serviceType:'',
        createTime:'',
        techList:[],
        sdiList:[],
        title:'spa技师',
        sourceFlag:-1, //0上钟 、1修改信息 、2加钟 、3下钟
        itemArr:[],//项目数组
        clockArr:[
          {name:'1',code:1},
          {name:'2',code:2},
          {name:'3',code:3},
          {name:'4',code:4},
          {name:'5',code:5}],// 钟数
        serviceTypeArr:[],//点单方式
        roomArr:[],//所有房间
        newRoomNo:'',
        newRoomId:'',
        newItemName:'',
        newItemId:'',
        NewServiceClocks:1,
        ItemName:'',
        ItemId:'',
        currentDate:'',
        getDate:'',
        roomFlag:'',
        itemFlag:'',
        clockFlag:''

      }
    },
    methods:{
      backPage:function () {

        let LoginData = this.$api.getLocalData('loginData');
        let secreParams = this.SecreUtil.getParams(LoginData.PmsID,LoginData.UserID);
        if(LoginData.AuthType === 1){
          this.$router.push({'path':'/roomStatus'})
        }else{
          this.$router.push({'path':'/technicianDetail',query:this.serviceObj})
        }
       //this.$router.back();
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
                //ts.serviceObj.SDINo = rets.data;
                 ts.$set(ts.serviceObj,'SDINo',rets.data)
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
      subService:function () {
        console.log('this.serviceObj---',this.serviceObj)
        let LoginData = this.$api.getLocalData('loginData');
        let secreParams = this.SecreUtil.getParams(LoginData.PmsID,LoginData.UserID);
        let ts = this;

        switch(this.sourceFlag){
          case 0:
            let onParams = {
            "SDINo": ts.serviceObj.SDINo,
            "ServiceLocationCode":ts.serviceObj.ServiceLocationCode,
            "ItemID": ts.serviceObj.ItemID,
            "OnServiceTime": ts.currentDate,
            "ServiceClocks": ts.serviceObj.ServiceClocks,
            "ServiceType": ts.serviceObj.ServiceClocks,
            "TechnicianNo":  ts.serviceObj.TechnicianNo,
            "Shift": LoginData.Shift,
            "PmsID": LoginData.PmsID,
            "CustomerNo": LoginData.CustomerNo,
            "UserId":LoginData.UserID,
            "Signature":secreParams.signature,
            "Timestamp": secreParams.timestamp,
            "IgnoreSignature": secreParams.ignoreSignature
            };
            if(!onParams.SDINo){
              ts.$mint.Toast({
                position:'center',
                message:'请输入手牌'
              });
              return false;
            }
            if(!onParams.ItemID){
              ts.$mint.Toast({
                position:'center',
                message:'请选择项目'
              });
              return false;
            }
            ts.$api.post('OnService',onParams).then(function(rets){
              if(rets.code === 0){
                ts.$router.push({'path':'/technicianIndex'})
              }else{
                ts.$mint.Toast({
                  position:'center',
                  message:rets.message
                })
              }
            })
            break;
          case 1:
            let updateParams ={
              "SDINo": ts.serviceObj.SDINo,
              "ItemID": ts.serviceObj.ItemID,
              "ServiceLocationCode":ts.sourceFlag === 1 ? ts.newRoomId : ts.serviceObj.ServiceLocationCode,
              "RoomNo": ts.sourceFlag === 1? ts.newRoomNo : ts.serviceObj.RoomNo,
              "ServiceClocks": ts.serviceObj.ServiceClocks,
              "ServiceType": ts.serviceObj.ServiceType,
              "TechnicianNo": ts.serviceObj.TechnicianNo,
              "Shift": LoginData.Shift,
              "PmsID": LoginData.PmsID,
              "CustomerNo":LoginData.CustomerNo,
              "UserId": LoginData.UserID,
              "Signature": secreParams.signature,
              "Timestamp": secreParams.timestamp,
              "IgnoreSignature": secreParams.ignoreSignatrue
            };
            console.log(this.sourceFlag,updateParams);

            if(!updateParams.ItemID){
              ts.$mint.Toast({
                position:'center',
                message:'请选择项目'
              });
              return false;
            }
            if(!updateParams.ServiceClocks){
              ts.$mint.Toast({
                position:'center',
                message:'请选择钟数'
              });
              return false;
            }
            if(!updateParams.RoomNo){
              ts.$mint.Toast({
                position:'center',
                message:'请选择新房号'
              });
              return false;
            }
            ts.$api.post('UpdateServiceInfo',updateParams).then(function (rets) {
              if(rets.code ===0){
                console.log("=====",rets)
                ts.$router.push({'path':'/technicianIndex'})
              }else{
                ts.$mint.Toast({
                  position:'center',
                  message:rets.message
                })
              }
            });
            break;
          case 2://加钟
            let addParams ={
              "SDINo": ts.serviceObj.SDINo,
              "ItemID": ts.newItemId,
              "TechnicianNo": ts.serviceObj.TechnicianNo,
              "ServiceLocationCode": ts.serviceObj.ServiceLocationCode,
              "ServiceLocationNo": ts.serviceObj.RoomNo,
              "NewServiceClocks": ts.NewServiceClocks,
              "Shift": LoginData.Shift,
              "PmsID": LoginData.PmsID,
              "CustomerNo":LoginData.CustomerNo,
              "UserId": LoginData.UserID,
              "Signature": secreParams.signature,
              "Timestamp": secreParams.timestamp,
              "IgnoreSignature": secreParams.ignoreSignatrue
            };
            console.log(addParams,this.sourceFlag);

            if(!addParams.ItemID){
              ts.$mint.Toast({
                position:'center',
                message:'请选择新项目'
              });
              return false;
            }
            if(!addParams.NewServiceClocks){
              ts.$mint.Toast({
                position:'center',
                message:'请选择加钟数'
              });
              return false;
            }
            ts.$api.post('AddClockService',addParams).then(function (rets) {
              if(rets.code ===0){
                console.log("=====",rets)
                ts.$router.push({'path':'/technicianIndex'})
              }else{
                ts.$mint.Toast({
                  position:'center',
                  message:rets.message
                })
              }
            });
            break;
          case 3://下钟
            let offParams ={
                  "SDINo": ts.serviceObj.SDINo,
                  "OffServiceTime":ts.currentDate,
                  "TechnicianNo": ts.serviceObj.TechnicianNo,
                  "Shift": LoginData.Shift,
                  "PmsID": LoginData.PmsID,
                  "CustomerNo":LoginData.CustomerNo,
                  "UserId": LoginData.UserID,
                  "Signature": secreParams.signature,
                  "Timestamp": secreParams.timestamp,
                  "IgnoreSignature": secreParams.ignoreSignatrue
                };
            console.log(offParams,this.sourceFlag);
            ts.$api.post('TechnicianOffService',offParams).then(function (rets) {
              if(rets.code ===0){
                console.log("=====",rets)
                ts.$router.push({'path':'/technicianIndex'})
              }else{
                ts.$mint.Toast({
                  position:'center',
                  message:rets.message
                })
              }
            });
            break;
        }
      },
      itemAttrChange:function (picker,value) {
        console.log(this.sourceFlag,this.itemFlag)

        if(this.itemFlag !== 'item'){
          this.newItemName = picker;
          this.newItemId = value;
        }else{
          this.serviceObj.ItemName  = picker;
          this.serviceObj.ItemID  = value;
        }
      },
      clockAttrChange:function (picker,value) {
        console.log(this.sourceFlag);
        console.log(picker,value);
        if(this.clockFlag === 'add'){
          this.NewServiceClocks = value;
        }else{
          this.serviceObj.ServiceClocks = value;
        }
      },
      serviceTypeAttrChange:function (picker,value) {
        console.log(this.sourceFlag);
        console.log(picker,value);
        this.serviceObj.ServiceTypeName=picker;
        this.serviceObj.ServiceType=value;
      },
      roomAttrChange:function (picker,value) {
        console.log(this.sourceFlag, this.roomFlag);
        console.log(picker,value);
        if(this.roomFlag === 'room'){
          this.serviceObj.RoomNo=picker;
          this.serviceObj.ServiceLocationCode =value;
        }else{
          this.newRoomNo = picker;
          this.newRoomId = value;
        }
      },
      clockOpen:function (flag) {
        console.log(this.sourceFlag,flag)
        this.clockFlag =flag;
        if((this.sourceFlag ===2 && this.clockFlag === 'add')
          || (this.sourceFlag ===1 && this.clockFlag === 'clock')){

          this.$refs.clockAttrPicker.open();
        }
      },
      roomOpen:function (flag) {
        console.log(this.sourceFlag,flag)
        this.roomFlag = flag;
        if((this.sourceFlag===1 && flag !=='room')|| (this.sourceFlag===2 && flag ==='room')){
          this.$refs.roomAttrPicker.open();
        }
      },
      itemOpen:function (flag) {
        console.log(this.sourceFlag,flag)
        this.itemFlag = flag;
        if(this.sourceFlag !==3 ){
          this.$refs.itemAttrPicker.open();
        }
      },
      getCurrentDate:function(){
        this.currentDate = moment(this.currentDate).add(1,'s').format('YYYY-MM-DD HH:mm:ss');
      }
    },
    created:function(){
      let ts = this;
      let LoginData = ts.$api.getLocalData('loginData');
      let secreParams = ts.SecreUtil.getParams(LoginData.PmsID,LoginData.UserID);
      let params ={
        "ItemTypeNo": "",
        "ItemId": "",
        "Keyword": "",
        "PmsID": LoginData.PmsID,
        "CustomerNo":  LoginData.CustomerNo,
        "UserId":  LoginData.UserID,
        "Signature": secreParams.signature,
        "Timestamp":  secreParams.timestamp,
        "IgnoreSignature": secreParams.ignoreSignatrue,
        "PageIndex": 1,
        "PageSize": 100,
      }
      ts.$api.post('GetTechnicianItems',params).then(function (rets) {//项目
        if(rets.code === 0){
          //ts.itemArr= rets.code
          let data = rets.data.data;
          for(let i=0; i< data.length;i++){
            let obj = {};
            obj.name = data[i].ItemName;
            obj.code = data[i].ItemID;
            ts.itemArr.push(obj);
          }
        }
      })
      let serviceTypeParams ={
        "PmsID": LoginData.PmsID,
        "CustomerNo":  LoginData.CustomerNo,
        "UserId":  LoginData.UserID,
        "Signature": secreParams.signature,
        "Timestamp":  secreParams.timestamp,
        "IgnoreSignature": secreParams.ignoreSignatrue,
      }
      ts.$api.post('GetTechnicianOrderMode',serviceTypeParams).then(function (rets) {//点单方式
      //  ts.serviceTypeArr = rets.data;
        for(let i=0; i< rets.data.length;i++){
          let obj={};
          obj.name = rets.data[i].Name;
          obj.code = rets.data[i].Code;
          ts.serviceTypeArr.push(obj);
        }
      })
      ts.$api.post('GetAllRoom',serviceTypeParams).then(function(rets){//获得房间
        console.log('---rets---',rets)
        if(rets.code === 0){
          for(let i =0; i< rets.data.length;i++){
            let obj ={};
            obj.name = rets.data[i].RoomNo;
            obj.code = rets.data[i].RoomID;
            ts.roomArr.push(obj);
          }
          console.log('ts.roomArr---',ts.roomArr)
        }else{
          ts.$mint.Toast({
            position:'center',
            message:rets.message
          })
        }
      })
    },
    mounted:function () {
      let  ts  = this;
      ts.serviceObj = ts.$route.query;
      ts.title = ts.serviceObj.title;
      ts.sourceFlag = ts.serviceObj.flag;
      ts.newItemName = ts.serviceObj.ItemName;
      ts.newItemId = ts.serviceObj.ItemID;
      ts.newRoomNo = ts.serviceObj.RoomNo

      let LoginData = this.$api.getLocalData('loginData');
      let secreParams = this.SecreUtil.getParams(LoginData.PmsID,LoginData.UserID);
      let params ={
        "Shift": LoginData.Shift,
        "PmsID": LoginData.PmsID,
        "CustomerNo":LoginData.CustomerNo,
        "UserId": LoginData.UserID,
        "Signature": secreParams.signature,
        "Timestamp": secreParams.timestamp,
        "IgnoreSignature": secreParams.ignoreSignatrue
      }
    ts.$api.post('GetSystemTime',params).then(function(rets){
      console.log(rets)
      if(rets.code === 0){
        window.clearInterval(ts.getDate);
        ts.currentDate =moment(rets.data).format('YYYY-MM-DD HH:mm:ss');
        ts.getDate = setInterval(ts.getCurrentDate,1000)
      }
    })

    }
  })
</script>
