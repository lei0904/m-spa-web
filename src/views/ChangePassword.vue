<template>
  <div class="resetIndex changePassword">
    <Header :text="'修改密码'" :handle="true" @back="backPage"></Header>
    <div class="title">旧密码</div>
    <div class="show_hide_input">
      <input class="password_input" autocomplete="false" :type="showType1" placeholder="输入旧密码" v-model="oldPassword"/>
      <i class="hide_icon" v-show="oldPassword && showType1 == 'password'" @click="changeShowType('showType1','text')"></i>
      <i class="show_icon" v-show="oldPassword && showType1 == 'text'" @click="changeShowType('showType1','password')"></i>
    </div>

    <div class="title">新密码</div>
    <div class="show_hide_input">
      <input class="password_input" autocomplete="false" :type="showType2" placeholder="输入新密码" v-model="newPassword"/>
      <i class="hide_icon" v-show="newPassword && showType2 == 'password'" @click="changeShowType('showType2','text')"></i>
      <i class="show_icon" v-show="newPassword && showType2 == 'text'" @click="changeShowType('showType2','password')"></i>
    </div>
    <div class="show_hide_input mart30">
      <input class="password_input" autocomplete="false" :type="showType3" placeholder="请确认密码一致" v-model="confirmPassword"/>
      <i class="hide_icon" v-show="confirmPassword && showType3 == 'password'" @click="changeShowType('showType3','text')"></i>
      <i class="show_icon" v-show="confirmPassword && showType3 == 'text'" @click="changeShowType('showType3','password')"></i>
    </div>
    <mt-button type="primary" class="confirm_button" @click.native="changePass">确认</mt-button>
  </div>
</template>

<script>
  export default {
    data() {
      return {
          showType1:'password',
          showType2:'password',
          showType3:'password',
          oldPassword:'',
          newPassword:'',
          confirmPassword:''
      };
    },
    methods: {
      backPage: function () {
        let LoginData = this.$api.getLocalData('loginData');
        if(LoginData.AuthType === 1){
          this.$router.push('/manage')

        }else{
          this.$router.push('/technicianIndex')
        }
      },
      changeShowType:function (num,val) {
        this[num] = val
      },
      changePass:function () {
        let ths = this;
        if(!ths.oldPassword){
          ths.$mint.Toast({
            message:'旧密码不能为空',
            position:'center'
          })
          return false;
        }
        if(!ths.newPassword ){
          ths.$mint.Toast({
            message:'新密码不能为空',
            position:'center'
          })
          return false;
        }
        if(!ths.confirmPassword ){
          ths.$mint.Toast({
            message:'确认密码不能为空',
            position:'center'
          });
          return false;
        }
        if(ths.newPassword === ths.oldPassword){
          ths.$mint.Toast({
            message:'新密码与旧密码不能相同',
            position:'center'
          })
          return false;
        }
        if(ths.newPassword !== ths.confirmPassword){
          ths.$mint.Toast({
            message:'新密码与确认密码不一致',
            position:'center'
          });
          return false;
        }

          let LoginData = this.$api.getLocalData('loginData');
          let secreParams = this.SecreUtil.getParams(LoginData.PmsID,LoginData.UserId);
          let params = {
            "OldPassword": ths.oldPassword,
            "NewPassword": ths.newPassword,
            "Shift": LoginData.Shift,
            "PmsID": LoginData.PmsID,
            "CustomerNo": LoginData.CustomerNo,
            "UserId": LoginData.UserID,
            "Signature": secreParams.signature,
            "Timestamp": secreParams.timestamp,
            "IgnoreSignature": secreParams.ignoreSignatrue
          };
          ths.$mint.MessageBox.confirm('确认修改密码?').then(function () {
              ths.$api.post('UpdatePassword',params).then(function(rets){
                console.log('UpdatePassword-----',rets)
                if(rets.code === 0){
                  console.log(rets.data)
                  ths.$mint.MessageBox.alert('密码修改成功').then( function () {
                      ths.$router.push('/changeData')
                    }
                  )
                }else{
                  ths.$mint.Toast({
                    message:rets.message,
                    position:'center'
                  })
                }
              })
            }
          )}
      },
    created:function () {
      //Object.assign(this.$data,this.$options.data())
    }
  }

</script>

<style lang="scss">
  .changePassword {
    font-size: 28px; /*px*/
    .title {
      margin: 51px 0 31px 63px;
    }
    .password_input {
      width: 690px;
      height: 88px;
      border-radius: 8px;
      border: 1px solid #333333; /*no*/
      margin: 0 30px;
      line-height: 88px;
      text-indent: 32px;
    }
    .mart30 {
      margin-top: 30px;
    }
    .confirm_button {
      width: 690px;
      height: 88px;
      background: rgba(243, 49, 49, 1);
      border-radius: 8px;
      font-size: 28px; /*px*/
      margin: 120px 30px 0 30px;
    }
    .show_hide_input {
      position: relative;
      i {
        display: inline-block;
        width: 32px;
        height: 32px;
        position: absolute;
        right: 60px;
        top: 50%;
        margin-top: -16px;
      }
      .show_icon {
        background: url(../assets/img/show_status.png) no-repeat center / 100% 100%;
      }
      .hide_icon {
        background: url(../assets/img/hide_status.png) no-repeat center / 100% 100%;
      }
    }
  }
</style>
