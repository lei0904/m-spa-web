<template>
  <div class="scheduling">
    <div class="img-content">
      <img src="../assets/img/logo@2x.png" alt="">
    </div>
    <div class="schedu-content">
      <div class="schedu-item" :class="active === idx ? 'active':''"
           v-for="(item,idx) in shiftArr"
           @click="isActive(idx,item)">{{item.ShiftCode}} {{item.ShiftName}}:{{item.Time}}</div>
    </div>
    <div class="login-out" @click="loginOut">退出登录</div>
  </div>
</template>
<style lang="scss">
  @import "../styles/style";
  .scheduling{
    background: url("../assets/img/login-bg.jpg") no-repeat;
    background-size: 100% 100%;
    height: 100vh;
    box-sizing: border-box;
  }
  .scheduling .img-content{
    width: 249px;
    height: 249px;
    margin:0 auto 140px ;
    padding-top: 100px;
  }
  .scheduling .img-content img{
    width: 100%;
    height: 100%;
  }
  .scheduling .schedu-content{
    margin-bottom: 120px;
  }
  .scheduling .schedu-item{
    color: $grayColor;
    background: rgba(0,0,0,0);
    border-radius: 44px;
    border: 1px solid $grayColor;/*no*/
    font-size: 18px;/*no*/
    text-align: center;
    height: 88px;
    line-height: 88px;
    width: 590px;
    margin: 44px auto;
  }
  .scheduling .active{
    border: 1px solid #fff;/*no*/
    color: #fff;
  }
  .scheduling .login-out{
    text-align: center;
    color: #fff;
    font-size: 14px;/*no*/
  }
</style>
<script>
  import  Vue from 'vue'
  export  default ({
    data:function(){
      return {
        active:0,
        shiftArr:[]
      }
    },
    methods:{
      loginOut:function () {
        let ts = this;
        ts.$mint.MessageBox.confirm('确认退出登录吗？','系统提示').then(function(){
          let LoginData = ts.$api.getLocalData('loginData');
          let secreParams = ts.SecreUtil.getParams(LoginData.PmsID,LoginData.UserId);

          let localParams = {
            "PmsID": LoginData.PmsID,
            "CustomerNo": LoginData.CustomerNo,
            "UserId":LoginData.UserID ,
            "Signature":secreParams.signature,
            "Timestamp":secreParams.timestamp,
            "IgnoreSignatrue": secreParams.ignoreSignatrue
          };
          ts.$router.push('/')
        /*  ts.$api.post('Logout',localParams).then(function (rets) {
          if(rets.code === 0){
            ts.$router.push('/')
          }else{
            ts.$mint.toast({
              message:rets.message,
              position:'bottom'
            })
          }
          })*/
        })
      },
      isActive:function(idx,item){

        this.active = idx;
        console.log(item)
       // let  loginData=ts.$api.getLocalData('loginData');
       let loginData= this.$api.getLocalData('loginData');
        loginData.Shift = item.ShiftCode;
        console.log('loginData',loginData)
        console.log(JSON.stringify(loginData));
        this.$api.setLocalData('loginData',loginData);
        if(loginData.AuthType === 1){
          this.$router.push('/manage')
        }else{
          this.$router.push('/technicianIndex')
        }
      }
    },
    mounted:function () {
      let ts = this;
      let LoginData = this.$api.getLocalData('loginData');

      let secreParams = this.SecreUtil.getParams(LoginData.PmsID,LoginData.UserId);

      let params = {
        "PmsID": LoginData.PmsID,
        "CustomerNo": LoginData.CustomerNo,
        "UserId":LoginData.UserID ,
        "Signature":secreParams.signature,
        "Timestamp":secreParams.Timestamp,
        "IgnoreSignatrue": secreParams.ignoreSignatrue
      }
      ts.$api.post('GetShift',params).then(function (rets) {
        console.log(rets,LoginData);
        if(rets.code === 0 ){
          ts.shiftArr = rets.data;
          for(let i=0; i< ts.shiftArr.length;i++){
           if(LoginData.Shift === ts.shiftArr[i].ShiftCode){
             ts.active = i;
             break;
           }else{
             ts.active = 0;
           }
          }
        }else{
          Vue.$toast({
            position:'bottom',
            message:ret.message
          })
        }
      })
    }
  })
</script>
