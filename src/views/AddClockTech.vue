<template>
  <div class="add-clock">
    <Header :text="'加钟'" :handle="true"  @back="backPage" >
    </Header>
    <div class="content">
      <div class="title">项目信息:</div>
      <div class="info-panel">
        <div class="cell">
          <div class="label-name">手牌</div>
          <div class="item">
            <span>{{updateData.SDINo}}</span>
          </div>
        </div>
        <div class="cell"  @click="roomOpen()">
          <div class="label-name">房号</div>
          <div class="item select-item">{{updateData.RoomNo}}</div>
        </div>
        <div class="cell">
          <div class="label-name">项目</div>
          <div class="item ">
            <span>{{updateData.ItemName}}</span>
          </div>
        </div>
        <div class="cell">
          <div class="label-name">钟数</div>
          <div  class="item">
            <span>{{updateData.ServiceClocks}}</span>
          </div>
        </div>
        <div class="cell"  @click="changeProject">
          <div class="label-name">新项目</div>
          <div class="item select-item project-color">{{newItemName}}</div>
        </div>
        <div class="cell" @click="clockOpen">
          <div class="label-name">加钟数</div>
          <div class="item select-item">
            <input v-model="NewServiceClocks">
          </div>
        </div>
        <div class="cell">
          <div class="label-name">点单方式</div>
          <div class="item">{{updateData.ServiceTypeName}}</div>
        </div>
      </div>
      <div class="btn-content">
        <mt-button size="large" class="sub-btn" @click="subInfo">提交</mt-button>
      </div>
    </div>
    <cui-attr-picker ref="changeProjectPicker"
                     @confirm="attrChange"
                     :listArr="projectArr"> </cui-attr-picker>
    <cui-attr-picker ref="clockAttrPicker"
                     @confirm="clockAttrChange"
                     :listArr="clockArr"> </cui-attr-picker>
    <cui-attr-picker ref="roomAttrPicker"
                     @confirm="roomAttrChange"
                     :listArr="roomArr"> </cui-attr-picker>
  </div>
</template>
<style lang="scss">
  @import "../styles/style";
  .add-clock .content{
    position: relative;
    height: 100vh;
  }
  .add-clock .content .btn-content{
    margin: 40px 20px;
  }
  .add-clock .content .btn-content .sub-btn{
    background: #F33131;
    border-radius: 8px;
    color: #fff;
    height: 88px;
    font-size: 14px;/*no*/
  }
  .add-clock .title{
    color: #000000;
    font-size: 14px;/*no*/
    height: 88px;
    line-height: 88px;
    padding-left: 30px;
  }
  .add-clock .info-panel{
    background: #fff;
  }
  .add-clock .info-panel .cell{
    padding:0 30px;
    display: flex;
    justify-content: space-between;
    height: 88px;
    line-height: 88px;
    color: #333333;
    font-size: 13px;/*no*/
    border-bottom: 1px solid #e0e0e0;/*no*/
  }
  .add-clock .info-panel .item{
    padding-right: 50px;
    color: #999999;
  }
  .add-clock .info-panel .item input{
    text-align: right;
  }
  .add-clock .info-panel .cell .select-item{
    background: url("../assets/img/icon-select.png") no-repeat;
    background-size: 13px 9px;
    background-position: right center;
    color: #333333;
  }

  .add-clock .info-panel .cell .project-color{
    color: $blueColor;
  }
  .add-clock .info-panel .qrcode-item{
    background: url("../assets/img/icon-qrcode.png") no-repeat;
    background-size: 42px 42px;
    background-position: right center;
  }

  .add-clock .ces-mt-popup{
    width: 100%;
  }
  .add-clock .ces-mt-popup .mint-actionsheet{
    color: #999999;
    font-size: 13px;/*no*/
  }
  .add-clock .ces-mt-popup .popup-title{
    background: #fff;
    font-size: 16px;/*no*/
  }
  .add-clock .ces-mt-popup .mint-actionsheet-list{
    margin-bottom: 5px;
    background: #fff;
  }
  .add-clock .ces-mt-popup .popup-title{
    height: 90px;
    line-height: 90px;
    text-align: left;
    padding: 0 30px;
    color: #333333;
    font-weight: bold;
    font-size:32px;
    border-bottom: 1px solid #e0e0e0;/*no*/
  }

</style>
<script>
  export default ({
    data:function () {
      return {
        projectArr:[],
        updateData:{},
        newItemName:'',
        newItem:{
          ItemName:'',
          ItemID:''
        },
        historyInfo:{},
        clockArr:[
          {name:'1',code:1},
          {name:'2',code:2},
          {name:'3',code:3},
          {name:'4',code:4},
          {name:'5',code:5}],// 钟数
        NewServiceClocks:'1',
        roomArr:[],//所有房间
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
      attrChange:function (picker,value)  {
        console.log(picker,value)
        this.newItem.ItemName = picker;
        this.newItem.ItemID = value;
        this.newItemName =picker;

      },
      clockOpen:function () {
          this.$refs.clockAttrPicker.open();
      },
      clockAttrChange:function (picker,value) {
          this.NewServiceClocks = value;
      },

      roomOpen:function () {
          this.$refs.roomAttrPicker.open();
      },

      roomAttrChange:function (picker,value) {
         /* this.updateData.RoomNo= picker;
          this.updateData.ServiceLocationCode = value;*/
         this.$forceUpdate();
        this.$set(this.updateData,'RoomNo',picker);
        this.$set(this.updateData,'RoomNoId',value);
          console.log('this.updateData',this.updateData)
      },
      subInfo:function () {
        let ths = this;
        let LoginData = ths.$api.getLocalData('loginData');
        let secreParams = ths.SecreUtil.getParams(LoginData.PmsID,LoginData.UserId);
        let params={
          "SDINo": ths.updateData.SDINo,
          "ItemID":ths.newItem.ItemID,
          "TechnicianNo":ths.updateData.TechnicianNo,
          "AutoOffService": false,
          "ServiceLocationCode":ths.updateData.RoomID||ths.updateData.ID,
          "ServiceLocationNo":ths.updateData.RoomNo||ths.updateData.No,
          "NewServiceClocks":ths.NewServiceClocks,
          "Shift": LoginData.Shift,
          "PmsID":LoginData.PmsID,
          "CustomerNo": LoginData.CustomerNo,
          "UserId": LoginData.UserID,
          "Signature": secreParams.signature,
          "Timestamp": secreParams.timestamp,
          "IgnoreSignature": secreParams.ignoreSignatrue
        }
        console.log('add clock subInfo---',params)
        if(!params.ServiceLocationNo){
          ths.$mint.Toast({
            position:'center',
            message:'请选择房号'
          });
          return false;
        }
        if(!params.ItemID){
          ths.$mint.Toast({
            position:'center',
            message:'请选择项目'
          });
          return false;
        }
        if(!params.ItemID){
          ths.$mint.Toast({
            position:'center',
            message:'请选择新项目'
          });
          return false;
        }
        if(!params.NewServiceClocks){
          ths.$mint.Toast({
            position:'center',
            message:'请选择加钟数'
          });
          return false;
        }
        ths.$api.post('AddClockService',params).then(function (rets) {
          console.log('AddClockService---',rets)
          if(rets.code === 0 ){
            ths.$router.push({path:'/roomStatus'})
          }else{
            ths.$mint.Toast({
              message:rets.message,
              position:'center'
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
        }else{
          ths.$mint.$toast({
            position:'bottom',
            message:rets.message
          })
        }
      });

      let localParams = {
        "PmsID": LoginData.PmsID,
        "CustomerNo": LoginData.CustomerNo,
        "UserId":LoginData.UserID ,
        "Signature":secreParams.signature,
        "Timestamp":secreParams.timestamp,
        "IgnoreSignatrue": true
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

      ths.historyInfo = ths.$route.query;
      Object.assign(ths.updateData,ths.historyInfo);
      ths.newItem.ItemName =ths.updateData.ItemName;
      ths.newItem.ItemID =ths.updateData.ItemID;
      ths.newItemName = ths.updateData.ItemName;
    }
  })
</script>
