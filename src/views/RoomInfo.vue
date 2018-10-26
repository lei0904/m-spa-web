<template>
  <div class="room-info">
    <Header :text="'房间信息'" :handle="true"  @back="backPage" >
    </Header>
    <div class="content" :style="'height:'+contentHeight+'px'">
      <div class="panel-info">
        <div class="cell">
          <div>开房手牌</div>
          <div class="info"><span v-for="item in roomInfo.CheckInSDIs">{{item.SDINo||"-"}}</span> </div>
        </div>
        <div class="cell">
          <div>开房时间</div>
          <div class="info">{{roomInfo.RoomCheckInCreateTime||"-"}}</div>
        </div>
        <div class="cell">
          <div>退房时间</div>
          <div class="info">{{checkOutTime||"-"}}</div>
        </div>
        <div class="cell">
          <div>开房时长</div>
          <div class="info">{{roomInfo.TimeMinu||"-"}}</div>
        </div>
        <div class="cell">
          <div>房型</div>
          <div class="info">{{roomInfo.RoomTypeName||"-"}}</div>
        </div>
        <div class="cell">
          <div>房费项目</div>
          <div class="info">
            <span>{{roomInfo.RoomAccountItemName || "-"}} </span></div>
        </div>
      </div>
      <div class="technician-panel">
        <div class="technician-label">技师列表:</div>
        <div class="technician-table">
          <div class="table-header">
            <div class="item">手牌</div>
            <div class="item">技师号</div>
            <div class="item">项目</div>
            <div class="item">钟数</div>
            <div class="item">剩余时长</div>
          </div>
          <div class="table-body">
            <div class="table-row"
                 v-for="item in roomInfo.CheckInSDIs"
                 v-if="item.ServiceStatusInt === 3">
              <div class="item">{{item.SDINo}}</div>
              <div class="item">{{item.TechnicianNo}}</div>
              <div class="item">{{item.ItemName}}</div>
              <div class="item">{{item.ServiceClocks}}</div>
              <div class="item">{{item.ServiceMinu}}</div>
            </div>
            <div class="empty" v-if="empty">暂无数据</div>
          </div>
        </div>
      </div>
      <div class="btn-content">
        <mt-button size="large" class="sub-btn" @click="backPage">关闭</mt-button>
      </div>
    </div>
  </div>
</template>
<style lang="scss">
  @import "../styles/style";

  .room-info{
    position: relative;
    height: 100vh;
    .content{
      overflow-y: scroll;
      .panel-info{
        margin: 20px 0;
        background: #fff;
        .cell{
          display: flex;
          justify-content: space-between;
          padding:0  30px ;
          height: 88px;
          line-height: 88px;
          font-size: 13px;/*no*/
          border-bottom: 1px solid #e0e0e0;/*no*/
          .info {
            color: $grayColor;
            span{
              padding-left:15px; ;
            }
          }
        }
      }
      .technician-panel{
        background: #fff;
        .technician-label{
          padding: 30px;
          font-size: 14px;/*no*/
          color: #333333;
        }
        .technician-table{
          .table-header{
            background: #99C5F6;
            color: #fff;
          }
          .table-body{
            overflow-y: scroll;
          }
          .table-header,.table-row{
            height: 88px;
            line-height: 88px;
            display: flex;
            justify-content: space-between;
            .item{
              min-width: 88px;
              text-align: center;
              margin: auto;
            }
          }
          .table-row{
            color: #999999;
          }
          .empty{
            text-align: center;
            color: #333;
            height: 88px;
            line-height: 88px;
          }
        }
    }
    }
    .btn-content{
      margin:  40px 20px;
      .sub-btn{
        background: #F33131;
        border-radius: 8px;
        color: #fff;
        height: 88px;
        font-size: 14px;/*no*/
        margin: 10px;
      }
    }
  }

</style>
<script>

  import  Moment from 'moment';
  export default ({
    data:function () {
      return {
        contentHeight:0,
        roomInfo:{},
        roomNo:'',
        empty:false
      }
    },
    computed:{
      checkOutTime:function () {
        console.log(this.roomInfo.TimeHour);
        console.log(this.roomInfo.TimeMinu);
        console.log(this.roomInfo.RoomCheckInTime);
       // this.roomInfo.RoomCheckInCreateTime
      }
    },
    methods:{
      backPage:function () {
        this.$router.push({'path':'/roomStatus'})
      },
      initData:function () {
        let  ths = this;
        let LoginData = ths.$api.getLocalData('loginData');
        let secreParams = ths.SecreUtil.getParams(LoginData.PmsID,LoginData.UserId);

        let  params ={
          "RoomNo":ths.roomNo,
          "PmsID": LoginData.PmsID,
          "CustomerNo": LoginData.CustomerNo,
          "UserId":LoginData.UserID ,
          "Signature":secreParams.signature,
          "Timestamp":secreParams.timestamp,
          "IgnoreSignatrue": secreParams.ignoreSignatrue
        }

          ths.$api.post('GetRoomInfo',params).then((rets)=>{
            if(rets.code === 0){
              console.log(rets)
              ths.roomInfo = rets.data;
              if(rets.data.CheckInSDIs.length > 0){
                for(let i = 0; i <rets.data.CheckInSDIs.length;i++){
                  if(rets.data.CheckInSDIs[i].ServiceStatusInt === 3){
                    ths.empty = false;
                    break;
                  }else{
                    ths.empty = true;
                  }
                }
              }else{
                ths.empty = true;
              }
            }else{
              ths.$mint.Toast({
                message:rets.message,
                position:'bottom'
              })
            }
          })
      }
    },
    created:function () {
      this.roomNo = this.$route.query.RoomNo;
      this.contentHeight  = document.body.clientHeight - 45 * window.dpr;
      console.log( this.roomInfo);
      this.initData()

    }
  })
</script>
