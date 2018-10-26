<template>
  <div class="change-technician">
    <Header :text="'更换技师'" :handle="true"  @back="backPage" >
    </Header>
    <div class="content">
      <div class="info-panel">
        <div class="cell">
          <div class="label-name">房号</div>
          <div class="item">{{techInfo.RoomNo}}</div>
        </div>
        <div class="cell">
          <div class="label-name">手牌号</div>
          <div class="item">{{techInfo.SDINo}}</div>
        </div>
        <div class="cell">
          <div class="label-name">原技师</div>
          <div class="item">{{techInfo.TechnicianNo}}</div>
        </div>
        <div class="cell">
          <div class="label-name">原项目</div>
          <div class="item">{{techInfo.ItemName}}</div>
        </div>
        <div class="cell">
          <div class="label-name">新项目</div>
          <div class="item select-item" @click="itemOpen">
            <input v-model="newProjectName" placeholder="点击设置新项目"  readonly></div>
        </div>
        <div class="cell">
          <div class="label-name">点单方式</div>
          <div class="item select-item" @click="serviceTypeOpen">
            <input  v-model="orderTypeName" placeholder="点击设置点单方式" readonly>
          </div>
        </div>
        <div class="cell">
          <div class="label-name">新技师</div>
          <div class="item">
            <input v-model="newTechnicianNo"
                   placeholder="请输入新技师编号"
            >
           <!-- <span v-else>{{newTechnicianNo}}</span>-->
          </div>
        </div>
      </div>

      <div class="btn-content">
        <mt-button size="large" class="sub-btn" @click="subChangeBtn">提交</mt-button>
      </div>
    </div>

     <cui-attr-picker ref="serviceTypePicker"
                      @confirm="serviceTypeAttrChange"
                      :listArr="serviceTypeArr"> </cui-attr-picker>

    <cui-attr-picker ref="itemAttrPicker"
                     @confirm="itemAttrChange"
                     :listArr="itemArr"> </cui-attr-picker>
  </div>
</template>
<style lang="scss">
  @import "../styles/style";
  .change-technician {
    .content{
      position: relative;
      .title{
        color: #000000;
        font-size: 14px;/*no*/
        height: 88px;
        line-height: 88px;
        padding-left: 30px;
      }
      .btn-content{
        margin: 20px;
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
        margin-top: 20px;
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
            color: $grayColor;
            input{
              text-align: right;
              height: 100%;
              box-sizing: border-box;
            }
          }
          .select-item{
            background: url("../assets/img/icon-select.png") no-repeat;
            background-size: 13px 9px;
            background-position: right center;
            color: #333333;
          }
          .qrcode-item{
            background: url("../assets/img/icon-qrcode.png") no-repeat;
            background-size: 42px 42px;
            background-position: right center;
            color: #333333;
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
  export default ({
    data:function () {
      return {
        newTechnicianNo:'',
        newProjectName:'',
        newProjectID:'',
        orderTypeName:'',
        orderTypeID:'',
        techInfo:{},
        serviceTypeArr:[],
        itemArr:[],
        newTechNoFlag:true
      }
    },
    methods:{
      backPage:function () {
        this.$router.push({'path':'/roomStatus'})
      },
      serviceTypeAttrChange:function (picker,value) {
        console.log(picker,value);
       /* this.serviceObj.ServiceTypeName=picker;
        this.serviceObj.ServiceType=value;*/
       let _ts = this;
        _ts.orderTypeName = picker;
        _ts.orderTypeID= value;
        _ts.newTechnicianNo = "";
        _ts.changeTech()
      },
      serviceTypeOpen:function () {
        this.$refs.serviceTypePicker.open()
      },
      changeTech:function () {
        let _ts = this;
        if( _ts.orderTypeID === 1 ||  _ts.orderTypeID === 4){
          _ts.newTechNoFlag = false;

          let LoginData = _ts.$api.getLocalData('loginData');
          let secreParams = _ts.SecreUtil.getParams(LoginData.PmsID,LoginData.UserId);
          let params ={
            "TechnicianNo": _ts.techInfo.TechnicianNo,
            "ServiceType": _ts.orderTypeID,
            "ItemID": _ts.newProjectID||_ts.techInfo.ItemID,
            "PmsID": LoginData.PmsID,
            "CustomerNo": LoginData.CustomerNo,
            "UserId": LoginData.UserID,
            "Signature": secreParams.signature,
            "Timestamp": secreParams.timestamp,
            "IgnoreSignature": secreParams.ignoreSignatrue
          };
          _ts.$api.post('GetNextTechnicianNo',params).then(function (rets) {
            console.log("GetNextTechnicianNo----",rets)
            if(rets.code === 0){
              _ts.newTechnicianNo = rets.data;
            }else{
              _ts.$mint.Toast({
                message:rets.message,
                position:'bottom'
              })
            }
          })
        } else{
          _ts.newTechNoFlag = true;
        }
      },
      itemOpen:function () {
          this.$refs.itemAttrPicker.open();
      },
      itemAttrChange:function (picker,value) {
        let _ths = this;
        _ths.newProjectName  = picker;
        _ths.newProjectID  = value;
        _ths.newTechnicianNo = "";
        _ths.changeTech();
      },
      subChangeBtn:function () {
        let _ts = this;

        let LoginData = _ts.$api.getLocalData('loginData');
        let secreParams = _ts.SecreUtil.getParams(LoginData.PmsID,LoginData.UserId);
        let params ={
          "OldTechnicianNo":_ts.techInfo.TechnicianNo,
          "ServiceType": _ts.orderTypeID,
          "SDINo": _ts.techInfo.SDINo,
          "ItemID": _ts.newProjectID,
          "TechnicianNo": _ts.newTechnicianNo,
          "ServiceLocationCode": _ts.techInfo.RoomID,
          "ServiceLocationNo": _ts.techInfo.RoomNo,
          "NewServiceClocks":_ts.techInfo.ServiceClocks,
          "Shift": LoginData.Shift,
          "PmsID":LoginData.PmsID,
          "CustomerNo":LoginData.CustomerNo,
          "UserId": LoginData.UserID,
          "Signature":secreParams.signature,
          "Timestamp": secreParams.timestamp,
          "IgnoreSignature": secreParams.ignoreSignatrue
        }

        if(!params.ServiceType){
          _ts.$mint.Toast({
            position:'center',
            message:'请选择点单方式'
          });
          return false;
        }

        if(!params.TechnicianNo){
          _ts.$mint.Toast({
            position:'center',
            message:'请输入技师号'
          });
          return false;
        }

        if(!params.ItemID){
          _ts.$mint.Toast({
            position:'center',
            message:'请选择新项目'
          });
          return false;
        }
        _ts.$api.post('TechnicianChanges',params).then(function(rets){
          console.log('TechnicianChanges---',rets)
          if(rets.code === 0){
            _ts.$router.push({path:'/manageTech',query:_ts.techInfo})
          }else{
            _ts.$mint.Toast({
              position:'center',
              message:rets.message
            });
          }
        })
      }
    },
    created:function () {
     let ths  = this;
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
      ths.$api.post('GetTechnicianItems',params).then(function (rets) {//项目
        if(rets.code === 0){
          //ts.itemArr= rets.code
          let data = rets.data.data;
          for(let i=0; i< data.length;i++){
            let obj = {};
            obj.name = data[i].ItemName;
            obj.code = data[i].ItemID;
            ths.itemArr.push(obj);
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
      ths.$api.post('GetTechnicianOrderMode',serviceTypeParams).then(function (rets) {//点单方式
        //  ts.serviceTypeArr = rets.data;
        for(let i=0; i< rets.data.length;i++){
          let obj={};
          obj.name = rets.data[i].Name;
          obj.code = rets.data[i].Code;
          ths.serviceTypeArr.push(obj);
        }
      })

    },
    mounted:function () {
      this.$forceUpdate();
      Object.assign(this.techInfo, this.$route.query);
      console.log("-----------",this.techInfo);
      this.newProjectID =this.techInfo.ItemID;
      this.newProjectName=this.techInfo.ItemName;
    }
  })
</script>
