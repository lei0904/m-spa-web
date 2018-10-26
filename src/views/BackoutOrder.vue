<template>
  <div class="backout-order">
    <Header :text="'撤单'" :handle="true"  @back="backPage" >
    </Header>
    <div class="content">
      <div class="infos">
        <div class="tips">是否确认对{{updateData.TechnicianNo}}技师进行撤单?</div>
      </div>
      <div class="btn-group">
        <mt-button size="large" class="btn confirm-btn"  @click.native="cancelClock" >确定</mt-button>
        <mt-button size="large" class="btn"  @click.native="backPage" >取消</mt-button>
      </div>
    </div>
  </div>
</template>
<style lang="scss">
  @import "../styles/style";
  .backout-order .content{
    position: relative;
    height: 100vh;
    background: #F8F8F8;
    .infos{
      background: url("../assets/img/icon-point.png") no-repeat;
      background-size: 130px 120px;
      background-position: center center;
      height: 320px;
      box-sizing: border-box;
      .tips{
        color: #999999;
        font-size: 13px;/*no*/
        text-align: center;
        padding-top: 240px;
      }

    }
    .btn-group{
      margin: 20px 40px;
      .btn{
        border: 1px solid #000000;
        color: #333333;
      }
      .confirm-btn{
        margin-bottom: 20px;
        background: #000000;
        color: #fff;
      }
    }
  }

</style>
<script>
  export default ({
    data:function () {
      return {
        updateData:{}
      }
    },
    methods:{
      backPage:function () {
        this.$router.push({'path':'/manageTechDetail',query:this.updateData})
      },
      cancelClock:function () {
        let ts = this;
        let LoginData = ts.$api.getLocalData('loginData');
        let secreParams = ts.SecreUtil.getParams(LoginData.PmsID,LoginData.UserId);
        let params ={
          "TechnicianNo": ts.updateData.TechnicianNo,
          "Shift": LoginData.Shift,
          "PmsID": LoginData.PmsID,
          "CustomerNo": LoginData.CustomerNo,
          "UserId": LoginData.UserID,
          "Signature": secreParams.signature,
          "Timestamp": secreParams.timestamp,
          "IgnoreSignature": secreParams.ignoreSignatrue
        }
        console.log(JSON.stringify(params))
        ts.$api.post('CancelTask',params).then(function (rets) {
          console.log(rets)
          if(rets.code === 0){
            ts.$router.push({'path':'/manageTech',query:ts.updateData})
          }else{
            ts.$mint.Toast({
              position:'center',
              message:rets.message
            })
          }
        })
      }
    },
    created:function () {
      this.updateData = this.$route.query;
      console.log(this.updateData);
    }
  })
</script>
