<template>
  <div class="technicianIndex">
    <Header
      :text="'首页'"
      :menuable = "true"
      :backable = false
      :handle="true"
      @listMenu = "showList"
      :actionable = "true"
      @action = "toMsg">
    </Header>
    <div class="head">
      <div v-if="loginData.PhotoUrl">
        <img class="avator" :src="loginData.PhotoUrl" />
      </div>
      <div v-else >
        <img class="avator" src="../assets/img/avator.png"/>
      </div>
      <div class="technicianName">{{loginData.TechnicianName}}</div>
      <div class="technicianNo">编号：{{loginData.TechnicianNo}}</div>
    </div>
    <div class="main">
      <div class="mainHead clearfix">
        <div class="left" :class="select == 1 ? 'active':''" @click.prevent="selectVal(1)">
          <div>未完成</div>
          <i class="extra"></i>
        </div>
        <div class="right" :class="select == 2 ? 'active':''" @click.prevent="selectVal(2)">
          <div>已完成</div>
          <i class="extra"></i>
        </div>
      </div>

      <div class="date-content">
        <div class="start-date" @click="startDateOpen">起 <span v-text="startPickerValue"></span></div>
        <div class="end-date" @click="endDateOpen">止 <span v-text="endPickerValue"></span></div>
      </div>
      <div class="mainBox" :style="{height:listHeight+'px'}">

        <cui-loadmore :top-method="loadTop"
                      @top-status-change="handleTopChange"
                      :bottom-method="loadBottom"
                      @bottom-status-change="handleBottomChange"
                      :bottom-all-loaded="allLoaded"
                      :autoFill="false"
                      ref="loadmore">
        <div class="item" v-for ="item in techList">
          <table border="0">
            <tr>
              <th >手牌</th>
              <th>项目</th>
              <th>钟数</th>
              <th>上钟方式</th>
              <th>房号</th>
              <th>状态</th>
            </tr>
            <tr>
              <td>{{item.SDINo || '-'}}</td>
              <td>{{item.ItemName || '-'}}</td>
              <td>{{item.ServiceClocks || '-'}}</td>
              <td>{{item.ServiceTypeName || '-'}}</td>
              <td>{{item.RoomNo || '-'}}</td>
              <td :class="item.ServiceStatus ==2 ||item.ServiceStatus ==3? 'markedness':'' ">{{item.ServiceStatusName || '-'}}</td>
            </tr>
          </table>
          <mt-cell
            title="查看详情"
            is-link
            @click.native="toDetail(item)"
            value="">
          </mt-cell>
          <div class="item_footer"></div>
        </div>
        <div class="empty_message_con" v-if="empty">
          <div class="empty_icon"></div>
          <div class="empty_message">暂无数据</div>
        </div>
        </cui-loadmore>
      </div>
    </div>
    <div class="copyright">Copyright ©2016-2018 上海逸达电子科技有限公司</div>
    <div class="footer">
      <div class="xflr" @click="toPage('appTechBuy')"><i class="icon_1"></i>消费录入</div>
      <div class="sjzx" @click="toPage('appTechData')"><i class="icon_2"></i>数据中心</div>
    </div>
    <mt-popup v-model="listShow"
              position="left">
      <div class="menu-content" :style="{height:menuHeight+'px'}">
        <div class="left-back" @click="leftLeave"></div>
        <div class="login-module">
          <img v-if="loginData.PhotoUrl" :src="loginData.PhotoUrl" alt="">
          <img  src="../assets/img/icon-login.png" v-else>
          <div>
            <div class="login-name">{{loginData.TechnicianName}}</div>
            <div class="login-tips">{{loginData.TechnicianNo}}</div>
          </div>
        </div>
        <div class="modules">
          <div class="modules-item" @click="toOrderList">
            <i class="my-order"></i>
            <span>我的订单</span>
          </div>
          <div class="modules-item" @click="toChangeData">
            <i class="modify-data"></i>
            <span>修改资料</span>
          </div>
          <div class="modules-item" @click="toMsg">
            <i class="notify"></i>
            <span>系统通知</span>
          </div>
        </div>
        <div class="login-out" @click="loginOut">
          <i class="icon-login-out"></i>
          <span>退出登录</span>
        </div>
      </div>
    </mt-popup>
    <mt-datetime-picker
      ref="startDatePicker"
      type="date"
      year-format="{value}年"
      month-format="{value}月"
      date-format="{value}日"
      :endDate="endDate"
      @confirm="startHandleConfirm">
    </mt-datetime-picker>

    <mt-datetime-picker
      ref="endDatePicker"
      type="date"
      year-format="{value}年"
      month-format="{value}月"
      date-format="{value}日"
      :endDate="endDate"
      @confirm="endHandleConfirm">
    </mt-datetime-picker>

  </div>
</template>

<script>
  import Ces  from '../components/ces/ces.js'
  import  moment from 'moment'
  export default {
    data() {
      return {
        listShow: false,
        menuHeight: 0,
        select:1,

        counted:0,
        loading: false,
        allLoaded: false,
        topStatus: '',
        bottomStatus: '',
        listHeight:0,
        pageNumber: 1,
        pageSize: 10,
        empty:false,
        techList:[],
        loginData:{},
        secreParams:{},
        tempServiceStatus:[2,3],
        startPickerValue:moment().subtract(7, 'days').format('YYYY/MM/DD'),
        endPickerValue:moment().format('YYYY/MM/DD'),
        endDate:new Date(),
        formatStyle:'YYYY/MM/DD',
        checkDateFlag:true

      };
    },
    methods: {
      loginOut:function () {
        this.$router.push({path:'/'})
      },
      toMsg: function () {
        this.$router.push({'path': '/message'});
      },
      showList: function () {
        this.listShow = true;
      },
      leftLeave: function () {
        this.listShow = false;
      },
      selectVal:function (val) {
        this.select = val;
          this.loadData('refresh')
      },
      toDetail:function (item) {
        this.$router.push({path:"/technicianDetail",query:item})
      },
      toChangeData:function () {
        this.$router.push("/changeData")
      },
      toOrderList:function () {
        this.$router.push('/myOrder')
      },
      toPage:function (flag) {
        if(flag === 'appTechBuy'){
          this.$router.push('/buyRecord')
        }else{
          this.$router.push('/dataDetail')
        }
      },
      getServiceStatus:function () {
        let _temp = [];
        switch(this.select){
          case 1:
            _temp =[2,3];
            break;
          case 2:
            _temp =[4];
            break;
        }
        return _temp;
      },

      startDateOpen:function () {
        console.log('this---startDatePicker',this.$refs.startDatePicker.dateSlots);
        this.$refs.startDatePicker.currentValue = this.startPickerValue;
        this.$refs.startDatePicker.open();

      },
      endDateOpen:function () {
        console.log('this---endDatePicker',this.$refs.endDatePicker.dateSlots);
        this.$refs.endDatePicker.open();
        this.$refs.endDatePicker.currentValue = this.endPickerValue
      },
      startHandleConfirm:function (startDate) {
        this.startPickerValue = moment(startDate).format(this.formatStyle);
        let LoginData = this.$api.getLocalData('loginData');
        // LoginData.AuthType === 1 ?   this.loadUserData("refresh", null) :   this.loadData("refresh", null);
         this.loadData("refresh", null);
      },
      endHandleConfirm:function (endDate) {
        console.log(endDate)
        this.endPickerValue =moment(endDate).format(this.formatStyle);
           this.loadData("refresh", null);
      },
      checkDate:function () {
        let isBeforeFlag = moment(this.startPickerValue).isBefore(this.endPickerValue) || moment(this.startPickerValue).isSame(this.endPickerValue);
        if(!isBeforeFlag){
          this.$mint.Toast({
            position:'center',
            message:'结束日期不能小于开始日期'
          })
        }
        let is3MFlag =moment(moment(this.startPickerValue).add(3,'M')).isAfter(this.endPickerValue)||moment(moment(this.startPickerValue).add(3,'M')).isSame(this.endPickerValue);
        if(!is3MFlag){
          this.$mint.Toast({
            position:'center',
            message:'只能查询三个月内数据'
          })
        }
        this.checkDateFlag = isBeforeFlag && is3MFlag;
        console.log(' this.checkDateFlag-----', this.checkDateFlag)
        return this.checkDateFlag
      },
      loadData:function (action,id,loading) {
        let ts = this;

        if ('refresh' === action) {
          ts.techList = [];
          ts.pageNumber = 1;
          ts.allLoaded=false;
        }

        let LoginData = ts.$api.getLocalData('loginData');
        let secreParams = ts.SecreUtil.getParams(LoginData.PmsID,LoginData.UserID);

        //ts.isShow = LoginData.AuthType === 1 ? false : true;

          ts.tempServiceStatus =ts.getServiceStatus();

        console.log("ts.tempServiceStatus---",ts.tempServiceStatus)

        let params={
          "Begin": moment(ts.startPickerValue).startOf('day').format('YYYY-MM-DD HH:mm:ss'),
          "End":moment(ts.endPickerValue).endOf('day').format('YYYY-MM-DD HH:mm:ss'),
          "TechnicianID":LoginData.AuthType === 1 ? '':LoginData.TechnicianID,
          "TechnicianNo": LoginData.AuthType === 1 ? '':LoginData.TechnicianNo,
          "IsMyOrder": LoginData.AuthType === 1 ? false : true,
          "ServiceStatus": ts.tempServiceStatus,
          "PageIndex": ts.pageNumber,
          "PageSize": ts.pageSize,
          "PmsID": LoginData.PmsID,
          "CustomerNo": LoginData.CustomerNo,
          "UserId":LoginData.UserID ,
          "Signature":secreParams.signature,
          "Timestamp":secreParams.timestamp,
          "IgnoreSignatrue": secreParams.ignoreSignatrue,
        }
        console.log(JSON.stringify(params))
        if(ts.checkDate()){
          ts.$api.post('GetTechnicianItemDetails', params).then(function (rets) {
          let data = rets.data.data;
          console.log('data----',data);
          if (data && data.length > 0) {
            ts.techList= ts.techList.concat(data);
            ts.empty = false;
            if( rets.data.curpage < rets.data.pages){
              ts.allLoaded =false;
              ts.pageNumber = ts.pageNumber + 1;
            }else{
              ts.allLoaded =true;
            }
          } else {
            ts.allLoaded = true;

            if(ts.techList.length<=0){
              ts.empty = true;
            }
          }
        },loading);
        }
      },
      handleTopChange: function (status) {
        this.topStatus = status;
      },
      loadTop: function (id) {
        console.log('loadTop------',status)
        let _this = this;
        setTimeout(function () {
          _this.loadData("refresh", null);
          _this.$refs.loadmore.onTopLoaded(id);
        }, 200);
      },
      handleBottomChange: function (status) {
        console.log('handleBottomChange------',status)
        this.bottomStatus = status;
      },
      loadBottom: function (id) {
        console.log('loadBottom------',id)
        let _this = this;
        setTimeout(function () {
          _this.loadData("load", null);
          _this.$refs.loadmore.onBottomLoaded(id);
        },200);
      },
      toMsg:function () {
        this.$router.push({path:'/message'})
      }

    },
    created: function () {
    //  Object.assign(this.$data, this.$options.data())

      this.menuHeight = document.body.clientHeight;
      this.listHeight = document.body.clientHeight - 365 * window.dpr;

       Object.assign(this.loginData,this.$api.getLocalData('loginData'))

      this.baseUrl = JSON.parse(localStorage.getItem("url"));
      if(this.loginData.PhotoUrl){
        this.loginData.PhotoUrl = this.baseUrl.address+"/"+this.loginData.PhotoUrl
      }
      this.loadData('refresh')
    }

  }

</script>

<style lang="scss">
  @import "../styles/style";

  .technicianIndex {
    background: rgba(248,248,248,1);
    min-height: 100vh;
    .header {
      height: $headerPx;
      line-height: $headerPx;
      text-align: center;
      color: $pageTxtColor;
      font-size: $headerTextFontSize; /*no*/
      background: $headerBgColor;
      position: relative;
      z-index: 200;
    }
    .header:after {
      content: "  ";
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 1px; /*no*/
      background-color: #e0e0e0;
      /* 如果不用 background-color, 使用 border-top:1px solid #e0e0e0; */
      -webkit-transform: scaleY(.5);
      transform: scaleY(.5);
    }
    .list-menu {
      display: block;
      background: url("../assets/img/icon-menu.png");
      background-size: 100% 100%;
      width: 42px;
      height: 36px;
      position: absolute;
      left: 40px;
      top: 30px;
    }
    .message {
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
    .menu-content {
      background: #fff;
      width: 560px;
      height: 100%;
      position: relative;
    }
    .menu-content .login-module {
      margin-top: 180px;
      background: #F8F8F8;
      width: 560px;
      height: 208px;
      padding: 60px 40px;
      display: flex;
      box-sizing: border-box;

    }
    .menu-content .login-module img {
      width: 88px;
      height: 88px;
      border-radius: 50%;
    }
    .menu-content .left-back {
      background: url("../assets/img/icon-left-back.png") no-repeat;
      background-size: 100% 100%;
      height: 42px;
      width: 42px;
      position: absolute;
      top: -65px;
      left: 20px;
    }
    .menu-content .login-module .login-name {
      font-size: 16px; /*no*/
      height: 58px;
      line-height: 58px;
      padding-left: 30px;
      color: #333333;
    }
    .menu-content .login-module .login-tips {
      font-size: 14px; /*no*/
      height: 40px;
      line-height: 40px;
      padding-left: 30px;
      color: #999999;
    }
    .menu-content .modules {
      margin: 80px 0;
    }
    .menu-content .modules .modules-item {
      padding: 20px 40px;
      color: #333333;
      font-size: 13px; /*no*/
      display: flex;
    }
    .menu-content .modules .modules-item:active {
      background-color: rgba(0, 0, 0, 0.1);
    }

    .menu-content .modules .modules-item .my-order {
      background: url("../assets/img/icon-order.png");
      background-size: 42px 42px;
      width: 42px;
      height: 42px;
      display: block;
    }
    .menu-content .modules .modules-item .modify-data {
      background: url("../assets/img/icon-modify-data.png");
      background-size: 42px 42px;
      width: 42px;
      height: 42px;
      display: block;
    }
    .menu-content .modules .modules-item .notify {
      background: url("../assets/img/icon-notify.png");
      background-size: 42px 42px;
      width: 42px;
      height: 42px;
      display: block;
    }
    .menu-content .modules .modules-item span {
      display: block;
      height: 42px;
      line-height: 42px;
      padding-left: 20px;
    }
    .menu-content .login-out {
      display: flex;
      position: absolute;
      padding: 40px 0;
      bottom: 88px;
      left: 30px;
      right: 30px;
      border-top: 1px solid rgba(224, 224, 224, 1); /*no*/
    }
    .menu-content .icon-login-out {
      width: 42px;
      height: 42px;
      background: url("../assets/img/icon-login-out.png");
      background-size: 42px 42px;
      display: block;
    }
    .menu-content .login-out span {
      display: block;
      height: 42px;
      line-height: 42px;
      padding-left: 30px;
    }
    .head {
      width: 750px;
      height: 280px;
      background: url(../assets/img/technicianIndex.png) no-repeat center / 100% 100%;
      .avator {
        width: 120px;
        height: 120px;
        margin: 40px 315px 0;
        border-radius: 50%;
      }
      .technicianName{
        text-align: center;
        font-size: 28px;/*px*/
        margin-top: 20px;
        color: #fff;
      }
      .technicianNo{
        text-align: center;
        font-size: 24px;/*px*/
        margin-top: 14px;
        color: #fff;
      }
    }
    .main{
      margin-top: 20px;

      .mainHead{
        width:690px;
        height:88px;
        padding: 0 30px;
        background:rgba(255,255,255,1);
        color: #999999;
        .left{
          float: left;
          width: 50%;
          text-align: center;
          position: relative;
          border-bottom: 1px solid rgba(192,192,192,1);
          div{
            width: 142px;
            height: 88px;
            line-height: 88px;
            margin-left: 103px;
          }
        }
        .right{
          float: left;
          width: 50%;
          text-align: center;
          position: relative;
          border-bottom: 1px solid rgba(192,192,192,1);
          div{
            width: 142px;
            height: 88px;
            line-height: 88px;
            margin-left: 103px;
          }
        }
        .extra{
          display: none;
        }
        .active{
          color: #333333;
          .extra{
            width:142px;
            height:5px;
            background:rgba(51,51,51,1);
            border-radius:3px;
            display: block;
            position: absolute;
            left: 50%;
            margin-left: -71px;
            bottom:-2px;
          }
        }
      }

      .date-content{
        font-size: 12px;/*no*/
        color: #666666;
        display: flex;
        background: #fff;
        width: 100%;
        padding: 15px 0;
        .start-date{
          border-right: 1px solid #333333;/*no*/
        }
        .start-date,.end-date{
          flex: 1;
          text-align: center;
          height: 40px;
          line-height: 40px;
          position: relative;
          padding: 0 30px;
          box-sizing: border-box;
          span{
            margin-left: 10px;
          }
          :after{
            background: url("../assets/img/icon-select.png") no-repeat;
            background-size: 14px 9px;
            background-position: right center;
            position: absolute;
            content: '';
            width: 14px;
            height: 9px;
            top:15px;
            right: 50px;
          }
        }
      }
      .mainBox{
        background: rgba(248,248,248,1);
        padding: 0 30px;
        width: 690px;
        height: 650px;
        overflow: scroll;
        .item{
          margin-top: 20px;
          width: 690px;
          min-height:276px;
          border-radius:8px;
          box-shadow:0 10px 10px 0 rgba(0,0,0,0.06);
          background:rgba(255,255,255,1);
          table{
            width: 90%;
            margin: 0 5%;
            font-size: 24px;/*px*/
            tr{
              height: 90px;
              line-height: 90px;
              text-align: left;
              border-bottom: 1px solid rgba(248,248,248,1);/*no*/
            }
            th{
              font-weight: normal;
            }
            td{
              color: #999999;
            }
            .markedness{
              color: #F33131;
            }
          }
          .mint-cell{
            padding: 0 5%;
            height: 98px;
            line-height: 98px;
            .mint-cell-wrapper{
              height: 98px;
              padding: 0;
              font-size: 24px;/*px*/
            }
            .mint-cell-allow-right::after{
              width: 12px;
              height: 12px;
              right:50px;
              border: solid 1px rgba(51,51,51,1);/*no*/
              border-bottom-width: 0;
              border-left-width: 0;
            }
          }
        }
      }
    }
    .footer{
      position: fixed;
      bottom: 0;
      width: 750px;
      left:0;
      i{
        display: inline-block;
        width: 40px;
        height: 40px;
        vertical-align: sub;
        margin-right: 24px;
      }
      .xflr{
        width: 375px;
        height: 120px;
        background:rgba(56,146,246,1);
        float: left;
        text-align: center;
        line-height: 120px;
        font-size: 28px;/*px*/
        color: #fff;
        i{
          background: url(../assets/img/icon_1.png) no-repeat center / 100% 100%;
        }
      }
      .sjzx{
        width: 375px;
        height:120px;
        background:rgba(15,113,221,1);
        float: left;
        text-align: center;
        line-height: 120px;
        font-size: 28px;/*px*/
        color: #fff;
        i{
          background: url(../assets/img/icon_2.png) no-repeat center / 100% 100%;
        }
      }
    }

  }
</style>
