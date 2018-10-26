<template>
  <div class="manage">
    <Header
      :text="'控制台'"
      :menuable = "true"
      :backable = false
      :handle="true"
      @listMenu = "showList"
      :actionable = "true"
      @action = "toMsg">
    </Header>
    <div class="manage-content" :style="'height:'+menuHeight+'px'">
      <div class="img-content roomCenter" @click="toPage(1)">
        <div class="title">房态中心</div>
        <div class="icon"></div>
      </div>
      <div class="img-content artificerStatus"  @click="toPage(2)">
        <div class="title">技师状态</div>
        <div class="icon"></div>
      </div>
      <div class="img-content dataCenter"  @click="toPage(3)">
        <div class="title">数据中心</div>
        <div class="icon"></div>
      </div>
    </div>
    <mt-popup v-model="listShow"
              position="left">
      <div class="menu-content" :style="{height:menuHeight+'px'}">
        <div class="left-back" @click="leftLeave"></div>
        <div class="login-module">
          <img src="../assets/img/icon-login.png"/>
          <div>
            <div class="login-name">{{loginData.UserName}}</div>
            <div class="login-tips">{{loginData.PmsName}}</div>
          </div>
        </div>
        <div class="modules">
          <router-link to="/myOrder">
            <div class="modules-item">
              <i class="my-order"></i>
              <span>我的订单</span>
            </div>
          </router-link>
          <router-link to="/changeData">
            <div class="modules-item">
              <i class="modify-data"></i>
              <span>修改资料</span>
            </div>
          </router-link>
          <router-link to="/message">
            <div class="modules-item">
              <i class="notify"></i>
              <span>系统通知</span>
            </div>
          </router-link>
        </div>
        <div class="login-out" @click="loginOut">
          <i class="icon-login-out"></i>
          <span>退出登录</span>
        </div>
      </div>
    </mt-popup>
  </div>
</template>
<style lang="scss">
  @import "../styles/style";
  .manage .manage-content{
    overflow-y: scroll;
  }
  .manage .img-content{
    margin:20px 20px  30px;
    height: 340px;
    position: relative;
  }
  .manage .roomCenter{
    background: url("../assets/img/room_bg.png");
    background-size: 100% 100%;
  }
  .manage .artificerStatus{
    background: url("../assets/img/artificer_bg.png");
    background-size: 100% 100%;
  }
  .manage .dataCenter{
    background: url("../assets/img/data_bg.png");
    background-size: 100% 100%;
  }
  .manage .title{
    position: absolute;
    bottom: 0;
    height: 80px;
    line-height: 80px;
    padding:0 41px;
    color: #fff;
    background-color: rgba(0,0,0,0.5);
    text-align: left;
    width: 100%;
    font-size: $fontSize13;/*no*/
    box-sizing: border-box;
  }
  .manage .icon{
    position: absolute;
    right: 22px;
    background: url("../assets/img/icon-back.png");
    background-size:12px 22px;
    width: 12px;
    height: 22px;
    bottom: 30px;
  }
  .manage .img-content:active{
    opacity: 0.7;
  }

  .manage .header.transparent + .container {
    top: 0 !important;
  }
  .manage .header.transparent {
    background: transparent;
  }
  .manage .header.transparent:after {
    display: none;
  }

  .manage .header {
    height: $headerPx;
    line-height: $headerPx;
    text-align: center;
    color: $pageTxtColor;
    font-size: $headerTextFontSize; /*no*/
    background: $headerBgColor;
    position: relative;
    z-index: 200;
  }
  .manage .header:after {
    content: "  ";
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 1px;/*no*/
    background-color: #e0e0e0;
    /* 如果不用 background-color, 使用 border-top:1px solid #e0e0e0; */
    -webkit-transform: scaleY(.5);
    transform:scaleY(.5);
  }
/*
  .manage .list-menu{
    display: block;
    background: url("../assets/img/icon-menu.png");
    background-size: 100% 100%;
    width: 42px;
    height: 36px;
    position: absolute;
    left: 40px;
    top: 30px;
  }*/
  .manage .menu-content{
    background: #fff;
    width: 560px;
    height: 100%;
    position: relative;
  }
  .manage .menu-content .login-module{
    margin-top: 180px;
    background: #F8F8F8;
    width:560px;
    height:208px;
    padding:60px 40px;
    display: flex;
    box-sizing: border-box;

  }
  .manage .menu-content .login-module img{
    width: 88px;
    height: 88px;
    border-radius: 50%;
  }
  .manage .menu-content .left-back{
    background: url("../assets/img/icon-left-back.png") no-repeat;
    background-size: 100% 100%;
    height: 42px;
    width: 42px;
    position: absolute;
    top:-65px;
    left: 20px;
  }
  .manage .menu-content .login-module .login-name{
    font-size: 16px;/*no*/
    height: 58px;
    line-height: 58px;
    padding-left: 30px;
    color: #333333;
  }
  .manage .menu-content .login-module .login-tips{
    font-size: 14px;/*no*/
    height: 40px;
    line-height: 40px;
    padding-left: 30px;
    color: #999999;
  }
  .manage .menu-content .modules{
    margin: 80px 0;
  }
  .manage .menu-content .modules .modules-item{
    padding: 20px 40px;
    color:#333333;
    font-size: 13px;/*no*/
    display: flex;
  }
  .manage .menu-content .modules .modules-item:active {
    background-color: rgba(0,0,0,0.1);
  }

  .manage .menu-content .modules .modules-item .my-order{
    background:url("../assets/img/icon-order.png");
    background-size: 42px 42px;
    width: 42px;
    height: 42px;
    display: block;
  }
  .manage .menu-content .modules .modules-item .modify-data{
    background:url("../assets/img/icon-modify-data.png");
    background-size: 42px 42px;
    width: 42px;
    height: 42px;
    display: block;
  }
  .manage .menu-content .modules .modules-item .notify{
    background:url("../assets/img/icon-notify.png");
    background-size: 42px 42px;
    width: 42px;
    height: 42px;
    display: block;
  }
  .manage .menu-content .modules .modules-item span{
    display: block;
    height: 42px;
    line-height: 42px;
    padding-left: 20px;
  }
  .manage .menu-content .login-out{
    display: flex;
    position: absolute;
    padding: 40px 0;
    bottom: 88px;
    left:30px;
    right:30px;
    border-top:1px solid rgba(224,224,224,1);/*no*/
  }
  .manage .menu-content .icon-login-out{
    width: 42px;
    height: 42px;
    background: url("../assets/img/icon-login-out.png");
    background-size: 42px 42px;
    display: block;
  }
  .manage .menu-content .login-out span{
     display: block;
     height: 42px;
     line-height: 42px;
     padding-left: 30px;
   }
  .manage .header .message{
    position: absolute;
    height: 100%;
    top: 0;
    right: 0;
    font-size: 30px; /*no*/
    color: #434343;
    padding-left: 34px;
    padding-right: 34px;
    background: url("../assets/img/icon-message.png") no-repeat;
    background-position: center center;
    background-size: 42px 42px;
  }
</style>
<script>
  import Ces from '../components/ces/ces'
  export  default ({
    data:function(){
      return {
        listShow:false,
        menuHeight:0,
        loginData:{},
        baseUrl:''
      }
    },
    methods:{
      showList:function(){
        this.listShow =true;
      },
      leftLeave:function () {
        this.listShow =false;
      },
      toPage:function (flag) {
        switch (flag){
          case 1 :
            this.$router.push({'path':'/roomStatus'});
            break;
          case 2:
            this.$router.push({'path':'/technicianStatus'});
            break;
          case 3:
            this.$router.push({'path':'/DataDetail'});
            break;
        }

      },
      toMsg:function () {
        this.$router.push({'path':'/message'});
      },
      loginOut:function(){
        this.$router.push({'path':'/'});
      }
    },
    created:function () {
     // this.baseUrl = JSON.parse(localStorage.getItem("url"));
      this.baseUrl = Ces.baseAddress;
      Object.assign(this.loginData,this.$api.getLocalData('loginData'));
      this.menuHeight =document.body.clientHeight - 40 * window.dpr;
    }
  })
</script>
