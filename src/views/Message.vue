<template>
  <div class="message">
    <Header :text="'系统通知'"
            :handle="true"
            @back="backPage"
            @refresh = "clearMsg"
            :refreshable = "true"
            :explain="'清空'"
    > </Header>
    <div class="content" >
      <div class="list-wrap" :style="'height:'+msgHeight+'px'">
        <cui-loadmore :top-method="loadTop"
                      @top-status-change="handleTopChange"
                      :bottom-method="loadBottom"
                      @bottom-status-change="handleBottomChange"
                      :bottom-all-loaded="allLoaded"
                      :autoFill="false"
                      ref="loadmore">
          <div class="item" :class="item.readStatus === 0 ? 'active-read':'' "
             v-for="(item,index) in msgList" >
          <div class="title">{{item.Title}}</div>
          <div class="text-content">
            {{item.Text}}
          </div>
          <div class="create-time">{{item.CreateTime | formatDate}}</div>
        </div>
          <div class="empty"   v-if="empty">暂无数据</div>
        </cui-loadmore>
      </div>
    </div>
  </div>
</template>
<style lang="scss">
  @import "../styles/style";
  .message {
    .content{
      .list-wrap{
        overflow-y: scroll;
        .empty{
          text-align: center;
          margin: 20px;
          padding: 20px;
          font-size: 14px;/*no*/
        }
        .item{
          background: #fff;
          padding:40px 30px 20px;
          border-radius: 8px;
          margin: 20px;
          min-height: 188px;
          position: relative;
          .title{
            font-size: 14px;/*no*/
            color: #333333;
            border-bottom:1px solid #E0E0E0;/*no*/
            height: 45px;
            font-weight: bold;
            margin-bottom: 20px;
          }
          .text-content{
            color: #999999;
            font-size: 12px;/*no*/
            text-indent: 30px;
            min-height: 88px;
          }
          .create-time{
            text-align: right;
            color: #999999;
          }
        }
        .active-read:after{
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #5ACC82;
          position: absolute;
          right: 30px;
          top:20px;
          content: "";
        }
      }
    }
  }
</style>
<script>
  import moment from 'moment'
  import Ces from '../components/ces/ces'
  export default ({
    data:function () {
      return {
        msgHeight:0,
        msgList:[],
        empty:true,
        loading: false,
        allLoaded: true,
        topStatus: '',
        bottomStatus: '',
        listHeight:0,
        pageNumber: 1,
        pageSize: 1000000000000,
      }
    },
    watch:{
      msgList:{
        handler:function () {
        },
        deep:true
      }
    },
    filters:{
      formatDate:function (createTime) {
          return moment(createTime).format('YYYY-MM-DD HH:mm:ss')
      }
    },
    methods:{
      backPage:function () {
        let ths = this;
        let LoginData = this.$api.getLocalData('loginData');
        let msgKey = LoginData.AuthType === 1 ?'_msg_'+LoginData.UserID:'_msg_'+LoginData.TechnicianNo;
        let _tempNewData =[];
        Ces.Plugins.EasyCache.getCache(msgKey,function (rets) {
          debugger
          if(rets.status !== 0){
            _tempNewData = JSON.parse(rets.data);
            console.log('_tempNewData----',_tempNewData);
            if(ths.msgList.length>0){
              for(let j=0; j<_tempNewData.length;j++){
                for(let i=0;i < ths.msgList.length;i++){
                  if(_tempNewData[i].CreateTime === ths.msgList[i].CreateTime ){
                    ths.msgList[i]["readStatus"] = 1;
                    _tempNewData[i]["readStatus"]= 1;
                  }else{
                    _tempNewData[i]["readStatus"] = 0;
                  }
                }
              }
              Ces.Plugins.EasyCache.saveCache(msgKey,_tempNewData,function (res) {
                if(res.status !==0){

                }
              })
            }
          }else{

          }
        });
        if(LoginData.AuthType === 1){
          this.$router.push({'path':'/manage'});
        }else{
          this.$router.push({'path':'/technicianIndex'});
        }
     },
      clearMsg:function () {
        let ths = this;
        let LoginData = ths.$api.getLocalData('loginData');
        let msgKey = LoginData.AuthType === 1 ?'_msg_'+LoginData.UserID:'_msg_'+LoginData.TechnicianNo;
        ths.$mint.MessageBox.confirm('确认清空通知消息?').then(function () {
          if(ths.msgList.length>0){
            Ces.Plugins.EasyCache.delCache(msgKey,function (rets) {
              if(rets.status !==0){
                ths.getList('refresh');
                ths.msgList=[];
                ths.empty = true;
              }
              ths.$mint.Toast({
                message:rets.message,
                position:'center'
              })
            })
          }
        })

      },
     getList:function (action,id,loading) {
       let _ths= this;
       if ('refresh' === action) {
         _ths.listArr = [];
         _ths.pageNumber = 1;
         _ths.allLoaded=true;
       }
       let LoginData = _ths.$api.getLocalData('loginData');
       let msgKey ='';
       if(LoginData.AuthType === 1){
          msgKey = '_msg_'+LoginData.UserID;
       }else{
          msgKey = '_msg_'+LoginData.TechnicianNo;
       }
       Ces.Plugins.EasyCache.getCache(msgKey,function (rets) {
         if(rets.status !== 0 ){
           let _tempData = JSON.parse(rets.data);
           console.log('_tempData----',_tempData);
           _ths.msgList=_tempData;
          // _ths.msgList=  _ths.msgList.concat(_tempData);
           if(_ths.msgList.length<=0){
             _ths.empty = true;
           }else{
             _ths.empty =false;
           }
         }
        /* else{
           _ths.$mint.Toast({
             message:rets.message,
             position:'center'
           })
         }*/
       })
      },
      handleTopChange: function (status) {
        this.topStatus = status;
      },
      loadTop: function (id) {
        console.log('loadTop------',status)
        let _this = this;
        setTimeout(function () {
          _this.getList("refresh", null);
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
          _this.getList('load', id, false);
          _this.$refs.loadmore.onBottomLoaded(id);
        },200);
      },
    },
    created:function () {
      this.msgList=[];
      this.getList('refresh');
      console.log("message  getList---")
      this.msgHeight = document.body.clientHeight -45 * window.dpr;
    }
  })
</script>
