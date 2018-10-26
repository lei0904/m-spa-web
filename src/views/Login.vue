<template>
    <div class="login" :style="'height:'+pageHeight+'px'">
      <div class="config">
        <img @click="configService" class="config-img" src="../assets/img/icon-config.png">
      </div>
      <div class="img-content">
        <img src="../assets/img/logo@2x.png" alt="">
      </div>
      <div class="form">
        <div class="item">
          <input class="shop-num"
                 v-model="form.PmsId"
                 placeholder="门店编号" readonly>
        </div>
        <div class="item">
          <input class="shop-account"
                 @focus="shopAccountActive()"
                 @blur="shopAccountBlur()"
                 v-model="form.Account"
                 placeholder="输入账号">
          <div class="mint-field-clear"
               v-show="accountActive"
               @click="clear('Account')">
            <i class="mintui mintui-field-error"></i>
          </div>
        </div>
        <div class="item">
          <input class="shop-password" type="password"
                 @focus="shopPassActive()"
                 @blur="shopPassBlur()"
                 v-model="form.Password"
                 placeholder="输入密码">
          <div class="mint-field-clear"
               v-show="passActive"
               @click="clear('Password')">
            <i class="mintui mintui-field-error"></i>
          </div>
        </div>
        <div class='radio-check' @click="handlePass">
          <input type='radio' name='getPass' id='getPass' :checked='isChecked' />
          <label for='getPass' class>记住密码</label>
        </div>
        <div class="btn-content">
          <mt-button @click.native="login" size="large">登录</mt-button>
        </div>
      </div>
      <div class="copyright">
        <div>CopyRight ©2016-2018上海逸达电子科技有限公司</div>
        <div>Version {{ver}}</div>
      </div>
    </div>
</template>
<style lang="scss">
    @import "../styles/style";
    .login input::placeholder{
      color: #A9D7FC;
    }
    .login{
      height: 100vh;
      position: relative;
      overflow-y: scroll;
    }
    .login .config .config-img{
      width: 45px;
      height: 45px;
      position: absolute;
      right:30px;
      top:30px;
    }
  .login{
    background: url("../assets/img/login-bg.jpg") no-repeat;
    background-size: 100% 100%;
    box-sizing: border-box;
  }
  .login .img-content{
    width:249px;
    height: 249px;
    margin:auto;
    padding-top: 100px;
  }
  .login .img-content img{
    width: 100%;
    height: 100%;
  }

  .login .form{
    margin:80px 60px;
  }
    .login .form .item{
      display: flex;
      position: relative;
      border-bottom: 1px solid #fff;/*no*/
    }
    .login .form .item input{
    background-color: rgba(0,0,0,0);
    height: 90px;
    width: 100%;
    padding:0 44px ;
    border: 0;
    box-sizing: border-box;
    color: #fff;
    font-size: 14px;/*no*/
    position: relative;
  }
  .login .form .item .shop-num{
    background-image: url("../assets/img/shop_num@2x.png");
    background-position: center right;
    background-repeat: no-repeat;
    background-size: 40px 36px;
  }
  .login .form .item .shop-account{
    background-image: url("../assets/img/shop_no.png");
    background-position: center right;
    background-repeat: no-repeat;
    background-size: 40px 36px;
    }
  .login .form .item .shop-password{
    background-image: url("../assets/img/shop_password.png");
    background-position: center right;
    background-repeat: no-repeat;
    background-size: 40px 36px;
    }
  .login .form .btn-content{
    margin: 20px auto;
    font-size: 16px;/*no*/
  }
  .login .form .btn-content .mint-button{
    border-radius: 44px;
    color: #1B52B2;
  }
  .login .form .mint-cell{
    background-color: rgba(0,0,0,0);
    background-image:none;
  }
  .login .form .mint-cell-wrapper{
    background-image: none;
  }
  .login .form .mint-checkbox-label{
    color: #fff;
  }

   .mint-msgbox-input input{
    box-sizing: border-box !important;
    height: 88px;
  }
  .login .radio-check { position: relative; margin: 0 50px; height: 98px; font-size: 14px;/*no*/ }
  .login .radio-check > input { position: absolute; left: 0; top: 39px; width: 20px; height:20px; opacity: 0; }
  .login .radio-check > label { line-height: 98px; color: #fff;padding-left:40px; }
  .login .radio-check > label:before { content: ''; position: absolute; left: -10px; top: 35px; display: inline-block; width: 20px; height: 20px; border-radius: 50%; border: 1px solid #ddd; transition: all 0.3s ease; -webkit-transition: all 0.3s ease; -moz-transition: all 0.3s ease; }
  .login .radio-check > label:after { content: ''; position: absolute; left: -9px; top: 35px; display: inline-block; width: 10px; height: 10px; border-radius: 50%; margin-top: 6px; margin-left: 6px; transition: all 0.3s ease; -webkit-transition: all 0.3s ease; -moz-transition: all 0.3s ease; }
  .login .radio-check input[type='radio']:checked + label:before { border-color: #fff; }
  .login .radio-check input[type='radio']:checked + label:after { background: #fff; }
  .login .mint-field-clear {
    opacity: .2;
    right: 50px;
    top: 30px;
    position: absolute;
  }
</style>
<script>

  import Vue from 'vue';
  import Ces from '../components/ces/ces'
    export default ({
        data:function () {
            return {
              isChecked:true,
              numActive:false,
              accountActive:false,
              passActive:false,
              pageHeight:0,
              ver:'1.0.0',
              form:{
                Account:'',
                PmsId:'',
                UserId:'',
                Password:'',
                IgnoreSignatrue: true
              }
            }
        },
        methods:{
          login:function(){
            let ts = this;
            if(!ts.form.Account){
              ts.$mint.Toast({
                message:'请输入账号'
              })
              return  false;
            }
            if(!ts.form.Password){
              ts.$mint.Toast({
                message:'请输入密码'
              })
              return  false;
            }
            let secreParams = ts.SecreUtil.getParams(ts.form.Account);
            if(ts.isChecked){
              localStorage.setItem('getLoginInfo',JSON.stringify(ts.form));
            }else{
              localStorage.clear();
            }

            let isiOS = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
            console.log('isiOS---',isiOS)
            let _IOSToken ='';
            console.log("isiOS---",isiOS);
            if(isiOS && Ces.Config.plugin){
           Ces.Plugins.GetToken.get(function (rets) {
              _IOSToken = rets.data;
               let iosParams = {
                 Account:ts.form.Account,
                 PmsId:ts.form.PmsId,
                 Password:ts.form.Password,
                 UserId:'',
                 Timestamp:secreParams.timestamp,
                 Signature:secreParams.signature,
                 IgnoreSignatrue:secreParams.ignoreSignatrue,
                 IOSToken:_IOSToken
               };
           ts.$api.post('Login',iosParams).then(function (ret) {
             if(ret.code === 0){
               localStorage.setItem('loginData',JSON.stringify(ret.data));
               ts.$router.push('/scheduling');
               if(Ces.Config.plugin){
                 Ces.Plugins.RabbitMq.callRabbitMq.call(ts);
               }
             }else{
               Vue.$toast({
                 position:'bottom',
                 message:ret.message
               })
             }
           })
            });
            }else{
              _IOSToken="";
              let androidParams = {
                Account:ts.form.Account,
                PmsId:ts.form.PmsId,
                Password:ts.form.Password,
                UserId:'',
                Timestamp:secreParams.timestamp,
                Signature:secreParams.signature,
                IgnoreSignatrue:secreParams.ignoreSignatrue,
                IOSToken:_IOSToken
              };

              ts.$api.post('Login',androidParams).then(function (ret) {
                if(ret.code === 0){
                  localStorage.setItem('loginData',JSON.stringify(ret.data));
                  ts.$router.push('/scheduling');
                  if(Ces.Config.plugin && !isiOS){
                    Ces.Plugins.RabbitMq.callRabbitMq.call(ts);
                  }
                }else{
                  ts.$mint.Toast({
                    position:'bottom',
                    message:ret.message
                  })
                }
              })
            }
            //this.$router.push('/scheduling')
          },
          handlePass:function(){
            if(this.isChecked){
               this.isChecked =false;
            }else{
              this.isChecked =true;
            }
            console.log("---this.isChecked",this.isChecked)
          },
          shopNumActive:function () {
              this.numActive =true;
          },
          shopNumBlur:function () {
            this.numActive =false;
          },
          shopAccountActive:function () {
            this.accountActive =true;
          },
          shopAccountBlur:function () {
            this.accountActive =false;
          },
          shopPassActive:function () {
            this.passActive =true;
          },
          shopPassBlur:function () {
            this.passActive =false;
          },
          clear:function (params) {
            console.log("-----",params)
            if(params === 'PmsId'){
               this.form.PmsId = '';
            }else if(params === 'Password'){
              this.form.Password = '';
            }else{
              this.form.Account = '';
            }

          },
          configService:function () {
            this.$router.push('autoConfig')
          }
        },
      created:function () {
          let ts  =this;
        if(Ces.Config.plugin){
          Ces.Plugins.Version.read(function (rets) {
            if(rets.status === 1){
              ts.ver  = rets.data;
            }else{
              ts.$mint.Toast({
                message:rets.message,
                position:'bottom'
              })
            }
          })
          Ces.Plugins.EasyCache.getCache('_tempUrl',function (rets) {
            let temp = JSON.parse(rets.data);
            if(rets.status !==0){
              ts.form.PmsId = temp.PmsId;
              Ces.root = temp.address+'/api/TechnicianApp';
              Ces.baseAddress = temp.address;
            }else{
              ts.$mint.Toast(
                {
                  message:rets.message,
                  position:'center'
                }
              )
            }
            if(!ts.form.PmsId){
              ts.$mint.MessageBox.alert('请先配置门店编号').then(function () {
                ts.$router.push('/autoConfig')
              })
            }
          })
        }else{
          if(localStorage.hasOwnProperty('_tempUrl')){
            let autoConfig = JSON.parse(localStorage.getItem("_tempUrl"));
            ts.form.PmsId = autoConfig.PmsId;
          }
          if(!ts.form.PmsId){
            ts.$mint.MessageBox.alert('请先配置门店编号').then(function () {
              ts.$router.push('/autoConfig')
            })
          }
        }
        ts.pageHeight = document.body.clientHeight;
          if(localStorage.hasOwnProperty('getLoginInfo')){
            let loginData = JSON.parse(localStorage.getItem('getLoginInfo'));
            console.log(loginData)
            ts.form.Account = loginData.Account;
            ts.form.Password = loginData.Password;
          }

      }
    })
</script>
