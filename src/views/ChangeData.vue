<template>
    <div class="resetIndex changeData">
      <Header :text="'修改资料'" :handle="true"  @back="backPage"  >
      </Header>
      <div class="avator clearfix">
        <div class="left">头像</div>
        <div class="right" v-if="picName">
          <img :src="picName" @click="select_method"/>
        </div>
        <div  class="right" v-else>
          <img src="../assets/img/avator.png" @click="select_method"/>
        </div>
        <i class="arrow_right"></i>
      </div>
      <div class="normal_cell" @click="updateFun">
        <div class="arrow_right"><i class="password"></i>修改密码</div>
      </div>

      <mt-actionsheet :actions="actions"

                      v-model="sheetVisible"
                      ref="take_photo" ></mt-actionsheet>
    </div>
</template>

<script>
  import Ces  from '../components/ces/ces.js'
    export default {
        data() {
            return {
              actions:[],
              pic:'',
              picName:'',
              baseUrl:{},
              sheetVisible:true
            };
        },
        methods: {
          toMsg: function () {
            this.$router.push({'path': '/message'});
          },
          backPage:function () {
            let ths = this;
            let LoginData = ths.$api.getLocalData('loginData');
            if(LoginData.AuthType === 1){
              ths.$router.push('/manage')
            }else{
              ths.$router.push('/technicianIndex')
            }
          },
          updateFun:function () {
            this.$router.push({'path':'/changePassword'})
          },
          select_method:function () {
            console.log("select_method------")
            let LoginData = this.$api.getLocalData('loginData');
            if(LoginData.AuthType !== 1 ){
              this.$refs.take_photo.currentValue = true;
            }
          },
          take_id_pic: function () {
            let _this = this;
            Ces.Plugins.Camera.take(function (rets) {
              if (rets.status == 1) {
                _this.pic = 'data:image/png;base64,' + rets.data.thumbnail;
                _this.pic_name = rets.data.original;
                console.log("take_id_pic----",rets.data);
                _this.confirmPhoto()
              } else {
                _this.$mint.Toast({
                  message: rets.message,
                  position: 'bottom'
                });
              }

            })
          },
          selectPhoto:function () {
            let _this = this;
            Ces.JSBridge.callHandler('selectphoto', [] ,function (rets) {
              if (rets.status == 1) {
                _this.pic = 'data:image/png;base64,' + rets.data.thumbnail;
                _this.pic_name = rets.data.original;
                console.log("selectPhoto----",rets.data);
                  _this.confirmPhoto()
              } else {
                _this.$mint.Toast({
                  message: rets.message,
                  position: 'bottom'
                });
              }
            });
          },
          confirmPhoto:function () {
              let  ts = this;
            let LoginData = ts.$api.getLocalData('loginData');
            let secreParams = ts.SecreUtil.getParams(LoginData.PmsID,LoginData.UserId);
            console.log(LoginData,ts.historyInfo)
              let params = {
                "TechnicianID":LoginData.TechnicianID,
                "ImageContent": ts.pic,
                "PmsID": LoginData.PmsID,
                "CustomerNo":LoginData.CustomerNo ,
                "UserId": LoginData.UserID,
                "Signature": secreParams.signature,
                "Timestamp": secreParams.timestamp,
                "IgnoreSignature": secreParams.ignoreSignatrue
              };
              ts.$mint.MessageBox.confirm("确认修改头像",'提示').then(function () {
                ts.$api.post('UploadTechnicianHead',params).then(function(rets){
                  console.log('UploadTechnicianHead---',rets)
                  if(rets.code === 0){
                    ts.picName = ts.pic
                  }else{
                    ts.$mint.Toast({
                      position:'center',
                      message:rets.message
                    })
                  }
                })
              })
          }
        },
      created:function(){
       // Object.assign(this.$data, this.$options.data());
        this.actions = [
          {
            name: '拍照',
            method: this.take_id_pic
          },
          {
            name:'从相册选择',
            method:this.selectPhoto

          }
        ];
        let LoginData = this.$api.getLocalData('loginData');
        this.baseUrl = JSON.parse(localStorage.getItem("url"));
        console.log('baseUrl',this.baseUrl)
        if(LoginData.PhotoUrl){
          this.picName =Ces.baseAddress+"/"+LoginData.PhotoUrl;
        }
      }
    }

</script>

<style lang="scss">
  .changeData{
    font-size: 28px;/*px*/
    .mint-actionsheet-listitem,
    .mint-actionsheet-button{
      text-align: center;
    }
    .avator{
      height:160px;
      padding: 0 30px;
      background:rgba(255,255,255,1);
      position: relative;
      margin-top: 20px;
      .left{
        height: 160px;
        line-height: 160px;
        width: 50%;
        float: left;
      }
      .right{
        width: 40%;
        float: left;
        text-align: right;
        height: 160px;
        line-height: 160px;
        img{
          width: 80px;
          height: 80px;
          border-radius: 50%;
          vertical-align: middle;
        }
      }
      i{
        display: inline-block;
        float: left;
      }
    }
    .normal_cell{
      position: relative;
      margin-top: 10px;
      height: 88px;
      line-height: 88px;
      padding: 0 30px;
      background:rgba(255,255,255,1);
      .password{
        display: inline-block;
        width: 35px;
        height: 35px;
        background: url(../assets/img/password_icon.png) no-repeat center / 100% 100%;
        margin-right:41px;
        vertical-align: sub;
      }
    }
    .arrow_right::after{
      width: 12px;
      height: 12px;
      right:50px;
      border: solid 1px rgba(51,51,51,1);/*no*/
      border-bottom-width: 0;
      border-left-width: 0;
      content: " ";
      top:50%;
      position: absolute;
      -webkit-transform: translateY(-50%) rotate(45deg);
      transform: translateY(-50%) rotate(45deg);
    }
  }
</style>
