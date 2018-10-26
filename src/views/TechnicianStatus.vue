<template>
  <div class="technician-status">
    <Header :text="'技师状态'" :handle="true"  @back="backPage" >
    </Header>
    <div class="content">
        <div class="search-content">
          <input placeholder="技师查询"
                 v-model='Keyword'
                 @focus="searchFocus"
                 @blur="searchBlur"
                 class="search-text">
          <div class="mint-field-clear"
               v-show="numActive"
               @click="clear('shopNum')">
            <i class="mintui mintui-field-error"></i>
          </div>
          <mt-button class="search" @click="search">搜索</mt-button>
        </div>

    </div>
    <div class="tab">
      <div class="tab-item"
           :class="isActive === idx ? 'active':''"
           @click="filtrate(idx,item)"
           v-for="(item,idx) in totalsStatus">
        <span>
          {{item.OnlineStatusName}}:{{item.Count}}
        </span>
      </div>
    </div>

    <div class="load-content" :style="{height:listHeight+'px'}">
      <cui-loadmore :top-method="loadTop"
                    @top-status-change="handleTopChange"
                    :bottom-method="loadBottom"
                    @bottom-status-change="handleBottomChange"
                    :bottom-all-loaded="allLoaded"
                    :autoFill="false"
                    ref="loadmore">
        <div class="item" v-for ="item in listArr">
          <div class="avatar">{{baseUrl.address}}
            <img v-if="item.PhotoUrl" :src="baseUrl+'/'+item.PhotoUrl" />
            <img src="../assets/img/icon-product.png" v-else >
          </div>
          <div class="info">
            <div class="technician"><div class="name">{{item.Name}}</div><div class="yellow">({{item.No||'-'}})</div></div>
            <span v-for ='ol in Online'>
            <div class="status "  v-if="ol.EnumCode === item.OnlineStatus">
              <span class="red" v-if="item.OnlineStatus === 20">
              {{ol.EnumName}}
              </span>
              <span  class="green"  v-if="item.OnlineStatus === 0 || item.OnlineStatus === 2">
              {{ol.EnumName}}
              </span>
              <div v-if="item.PlanOffServiceTime">
                <span>上钟:</span>
                <span class="black">{{item.PlanOffServiceTime}}</span>
              </div>
              <div v-if="item.RemainingTime">
                <span>结余:</span>
                <span class="black">{{item.RemainingTime}}</span>
              </div>
            </div>
           </span>
          </div>
        </div>
        <div class="empty_message_con" v-if="empty">
          <div class="empty_icon"></div>
          <div class="empty_message">暂无数据</div>
        </div>
      </cui-loadmore>
    </div>
  </div>
</template>
<style lang="scss">
  @import "../styles/style";
  .technician-status{
    .yellow{
      color: #F47B2B !important;
    }
    .green{
      color: #5ACC82 !important;
    }
    .red{
      color:#F33131 !important;
    }
    .black{
      color: #333333 !important;
    }
    .search-content{
      width: 100%;
      padding: 30px;
      background: #fff;
      display: flex;
      box-sizing: border-box;
      position: relative;
      .search{
        border-radius:20px;
        background: $blueColor;
        color: #fff;
        height: 58px;
        line-height: 58px;
        width: 120px;
        margin-left: 20px;
        font-size: 12px;/*no*/
      }
      .search-text{
        border: 1px solid #999999;/*no*/
        border-radius: 29px;
        text-align: center;
        height: 58px;
        line-height: 58px;
        width: 100%;
        padding: 30px 60px;
        background-position: 20px 5px;
        box-sizing: border-box;
      }
      .mint-field-clear {
        opacity: .2;
        top: 46px;
        right: 180px;
        position: absolute;
        color: #999999;
      }
    }
    .tab{
      display: flex;
      align-items: center;
      justify-content: space-between;
      text-align: center;
      overflow-x: scroll;
      background: #fff;
      height: 88px;
      line-height: 88px;
      padding: 0 30px;
      font-size: 13px;/*no*/
      margin: 20px 0 0 0;
      box-sizing: border-box;
      .tab-item{
        text-align: center;
        color: #999999;
        width: 140px;
        min-width: 140px;
      }
      .active{
        color: #333333;
      }
    }
    .load-content{
      overflow-y: scroll;
      -webkit-overflow-scrolling: touch;
        .item{
          display: flex;
          padding: 20px 30px;
          height: 180px;
          background: #fff;
          margin: 20px 30px;
          border-radius: 8px;
          box-shadow: 5px 10px 20px rgba(0,0,0,.2);
          box-sizing: border-box;
          .avatar{
            width: 120px;
            height: 116px;
            img{
              width: 100%;
              height: 100%;
              border-radius: 50%;
            }
          }
          .info{
            margin-left: 30px;
            height: 116px;
            .other{
              display: flex;
              justify-content: space-between;
              div{
                width: 240px;
              }
              .gray{
                color: #333333;
                margin-left: 10px;
              }
            }
            .status{
              height: 58px;
              line-height: 58px;
              color: #999999;
              display: flex;
              div{
               padding-right: 20px;
              }
            }
            .technician{
              font-size: 16px; /*no*/
              box-sizing: border-box;
              display: flex;
              height: 58px;
              line-height: 58px;
              color: #999999;
              .name{
                margin-right: 20px;
                color: #333333;
              }
            }
          }
        }
    }
  }
</style>
<script>
  import Ces from '../components/ces/ces'
  export default ({
    data:function () {
      return {
        numActive:false,
        Keyword:'',
        isActive:0,
        listArr:[],
        Online:[],
        technicianStatus:[],
        WorkType:[],

        counted:0,
        loading: false,
        allLoaded: false,
        topStatus: '',
        bottomStatus: '',
        listHeight:0,
        pageNumber: 1,
        pageSize: 10,
        empty:false,
        LoginData:{},
        secreParams:{},
        OnlineStatus:'',
        baseUrl:'',
        scrollMode:'auto',
        Constants :{
        ServiceStatus:[],//"技师任务上钟状态"
          ServiceType:[],//"上钟类型"
          OnlineStatus:[],//"技师上钟状态"
          WorkType:[],//"工作报到"
          RoomStatus:[],//"房间状态"
          ItemProperty:[],//"项目属性"
      }
      }
    },
    computed: {
      totalsStatus: function () {//技师状态统计
       let totals=[];
        for(let i=0;i<this.Online.length;i++){
          for(let j=0; j<this.technicianStatus.length;j++){
            if(this.Online[i].EnumCode === this.technicianStatus[j].OnlineStatus){
              totals.push(this.technicianStatus[j]);
              break;
            }
          }
        }
        let all={
          OnlineStatus:'',
          OnlineStatusName:'全部',
          Count:0
        };
        for(let k=0; k< totals.length;k++ ){
          all.Count += totals[k].Count;
        }
        totals.splice(0,0,all);
        return totals;
      }
    },
    methods:{
      backPage:function () {
        this.$router.push({'path':'/manage'})
      },
      clear:function () {
        this.Keyword = '';
      },
      searchFocus:function () {
          this.numActive =true;
      },
      searchBlur:function () {
        this.numActive =false;
      },
      filtrate:function (isActive,item) {
        this.isActive = isActive;
        this.OnlineStatus = item.OnlineStatus;
        this.loadData('refresh')
      },
      search:function () {
        this.loadData('refresh');
      },
      loadData:function (action,id,loading) {
        let ts = this;
        if ('refresh' === action) {
          ts.listArr = [];
          ts.allLoaded=false;
          ts.pageNumber = 1;
        }
        let roomParams = {
          "Keyword": ts.Keyword,
          "OnlineStatus":ts.OnlineStatus ,
          "PmsID": ts.LoginData.PmsID,
          "CustomerNo": ts.LoginData.CustomerNo,
          "UserId":ts.LoginData.UserID ,
          "Signature":ts.secreParams.signature,
          "Timestamp":ts.secreParams.timestamp,
          "IgnoreSignatrue": ts.secreParams.ignoreSignatrue,
          "PageIndex": ts.pageNumber,
          "PageSize": ts.pageSize,
        };

        ts.$api.post('GetTechnicianStatusList', roomParams).then(function (rets) {
          let data = rets.data.data;
          console.log(rets.data)
          if(rets.code === 0){
            if (data && data.length > 0) {
              ts.listArr= ts.listArr.concat(data);

              ts.empty = false;
              if( rets.data.curpage < rets.data.pages){
                ts.allLoaded =false;
                ts.pageNumber = ts.pageNumber + 1;
              }else{
                ts.allLoaded =true;
              }
            } else {
              ts.allLoaded = true;
              if(ts.listArr.length<=0){
                ts.empty = true;
              }
            }
          }else{
            ts.$mint.Toast({
              position:'center',
              message:rets.message
            })
          }

        },loading);
      },
      handleTopChange: function (status) {
        this.topStatus = status;
      },
      loadTop: function (id) {
        let _this = this;
        setTimeout(function () {
          _this.loadData("refresh", null);
          _this.$refs.loadmore.onTopLoaded(id);
        }, 200);
      },
      handleBottomChange: function (status) {
        this.bottomStatus = status;
      },
      loadBottom: function (id) {
        let _this = this;
        setTimeout(function () {
          _this.loadData('load', id, false);
          _this.$refs.loadmore.onBottomLoaded(id);
        },200);
      },
      initConstants:function () {
        let ts = this;
        ts.$api.post('GetAppEnum',{}).then(function (rets) {
          if(rets.code === 0){
            let data = rets.data;
            for(let i=0; i<data.length;i++){
              switch (data[i].ParamCode){
                case "ServiceStatus":
                  Object.assign(ts.Constants.ServiceStatus,data[i].Match);
                  break;
                case "ServiceType":
                  Object.assign(ts.Constants.ServiceType,data[i].Match);
                  break;
                case "OnlineStatus":
                  Object.assign(ts.Constants.OnlineStatus,data[i].Match);
                  break;
                case "WorkType":
                  Object.assign(ts.Constants.WorkType,data[i].Match);
                  break;
                case "RoomStatus":
                  Object.assign(ts.Constants.RoomStatus,data[i].Match);
                  break;
                case "ItemProperty":
                  Object.assign(ts.Constants.ItemProperty,data[i].Match);
                  break;
              }
            }

            Object.assign( ts.Online, ts.Constants.OnlineStatus);
            Object.assign( ts.WorkType, ts.Constants.WorkType);
            console.log(ts.Online,ts.WorkType)
            ts.Online.splice(0,0,{EnumCode:'',EnumName:"全部"});
            console.log(ts.Constants)
          }else{
            ts.$mint.Toast({
              position:'bottom',
              message:'请求常量接口'
            })
          }
        });
      },
     /* getBaseUrl:function () {
        let _root = '';
        let  ts = this;
        let _baseUrlRoot = {
          address:'',
          serviceName:'/api/TechnicianApp'
        };
        if(Ces.Config.plugin){
          Ces.Plugins.EasyCache.getCache('_tempUrl',function (rets) {
            if(rets.status !== 0){
              let _tempUrl  = JSON.parse(rets.data)
              _baseUrlRoot.address = _tempUrl.address;
              _baseUrlRoot.PmsId = _tempUrl.PmsId;
              ts.baseUrl = _baseUrlRoot.address;
              alert('ts.baseUrl ='+ts.baseUrl )
            }else{
              ts.$mint.Toast({
                message:rets.message,
                position:'center'
              })
            }
          })
        }
        else{
          if(localStorage.hasOwnProperty('_tempUrl')){
            let _tempUrl = JSON.parse(decodeURIComponent(localStorage.getItem('_tempUrl')));
            _baseUrlRoot.address = _tempUrl.address;
            _baseUrlRoot.PmsId = _tempUrl.PmsId;
          }else{
            _baseUrlRoot.address = 'http://dev.spa.ryhub.com';
          }

          alert('ts.baseUrl===='+ts.baseUrl )
          ts.baseUrl  = _baseUrlRoot.address;
        }
      }*/
    },
    created:function () {
      let ts = this;

      //Object.assign(ts.$data, ts.$options.data())
       ts.LoginData = ts.$api.getLocalData('loginData');
       ts.secreParams = ts.SecreUtil.getParams(ts.LoginData.PmsID,ts.LoginData.UserId);
      let params = {
        "PmsID": ts.LoginData.PmsID,
        "CustomerNo": ts.LoginData.CustomerNo,
        "UserId":ts.LoginData.UserID ,
        "Signature":ts.secreParams.signature,
        "Timestamp":ts.secreParams.Timestamp,
        "IgnoreSignatrue": true
      };

      ts.Online.length=0;
      this.initConstants();
      ts.baseUrl = Ces.baseAddress;
      ts.listHeight = document.body.clientHeight - 186 * window.dpr;
      // ts.getBaseUrl();
      ts.$api.post('GetTechnicianCount',params).then((rets)=>{
        if(rets.code === 0){
          ts.technicianStatus = rets.data;
        }
      })
      ts.loadData('refresh')
    }
  })
</script>
