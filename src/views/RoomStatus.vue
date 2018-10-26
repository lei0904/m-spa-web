<template>
  <div class="resetIndex room-status">
    <Header
      :text="'房态中心'"
      :handle="true"
      @back="backPage"
      :actionable="true"
      @action ="toMsg">
    </Header>
    <div class="search-wrap">
        <input placeholder="房号搜索"
               v-model="SDINo"
               @focus="showIcon"
               @blur="showIcon"
               @input="showIcon"
        >
        <i class="mintui mintui-field-error search-clear" v-show="clearShow" @click="clearInput"></i>
        <mt-button @click="search" size="small" class="search-btn" >搜索</mt-button>
    </div>
    <div class="search-content">
      <!--<div class="type"><label>房间类型:</label></div>-->
      <div class="search-text">
      <!--  <div class="floor" >
          <span :class="activeFloor === idx ? 'active':''"
                v-for="(floor,idx) in floors"
                :key="floor.ID"
                @click="searchFloorActive(idx,floor)">{{floor.Name}}</span>
        </div>-->
        <div class="room-type">
          <span :class="activeRoom === index ? 'active':''"
                v-for="(room,index) in rooms"
                :key="room.ID"
                @click="searchRoomTypeActive(index,room)">{{room.Name}}</span>
        </div>
      </div>
    </div>
    <div class="wrap" :style="{height:listHeight+'px'}">
      <cui-loadmore :top-method="loadTop"
                    @top-status-change="handleTopChange"
                    :bottom-method="loadBottom"
                    @bottom-status-change="handleBottomChange"
                    :bottom-all-loaded="allLoaded"
                    :autoFill="false"
                    ref="loadmore">
        <div class="list-room-content" >
          <div class="item"
               v-for="(item,index) in room"
               @click="actionPage(item)"
               :style="'background-color:#'+item.RoomColor">
            <div class="room-title">{{item.RoomTypeName}}({{item.No}})</div>
            <div class="room-items" v-for = 'checkID in item.CheckInSDIs'>
              <div>{{checkID.SDINo}}</div>
              <div>{{checkID.TechnicianNo}}</div>
              <div class="service-minu">{{checkID.ServiceMinu}}</div>
            </div>
            <div class="room-items" v-for = '(techId,idx) in item.AssignTechnicians'
                 v-if="(item.CheckInSDIs.length<3 && (item.CheckInSDIs.length+idx<3))">
              <div class="icon-tech">&#9785</div>
              <div>{{techId.TechnicianNo}}</div>
              <div class="icon"><img src="../assets/img/icon-time.png" alt=""></div></div>
          </div>
          <div class="empty_message_con" v-if="empty">
            <div class="empty_icon"></div>
            <div class="empty_message">暂无数据</div>
          </div>
        </div>
      </cui-loadmore>
    </div>
    <div class="tips">
      <div @click="searchRoom()"><label >全部房数:</label><span>{{total}}</span></div>
      <div class="characteristic" >
        <div class="characteristic" v-for="room in roomTotals"  @click="searchRoom(room)">
          <i class="icon" :style="'background-color:#'+room.RoomColor"></i>
          <span>{{room.RoomStatusName}}({{room.RoomCount||0}})</span>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss">
  @import "../styles/style";
  .room-status{
    .wrap{
      overflow-y: scroll;
      .list-room-content{
        display: flex;
        justify-content: flex-start;
        align-items:center;
        align-content:flex-start;
        flex-wrap:wrap;
        padding: 30px;
        overflow: scroll;
        font-size: 13px;/*no*/
        box-sizing: border-box;
        .item{
          width:216px;
          height:146px;
          border-radius: 8px;
          margin: 10px 7px 20px;
          text-align: center;
          color: #fff;
          padding: 10px 5px;
          box-sizing: border-box;
          overflow-y: scroll;
          .room-title{
            text-align: center;
            margin-bottom: 10px;
          }
          .room-items{
            margin: 0 10px;
            padding-bottom: 5px;
            display: flex;
            flex-wrap: nowrap;
            justify-content: space-between;
            text-align: center;
            box-sizing: border-box;
            .service-minu{
              color: $redColor;
              text-align: right;
            }
            div{
              width: 75px;
            }
            .icon-tech{
              text-align: left;
            }
            .icon{
              text-align: right;
              img{
                /*width: 100% ;
                height: 100%;*/
                width: 25px;
                height: 25px
              }
            }
          }

        }
        .item:active{
          opacity: 0.6;
        }
      }
    }
    .search-content{
      height: 137px;
      background-color: #fff;
      padding: 20px 30px 10px;
      box-sizing: border-box;
      position: relative;
      .search-text{
        margin: 20px 0;
      }
      .type{
        color: #333333;
        font-size: 14px;/*no*/
      }
      .floor,.room-type{
        display: flex;
        align-items: center;
        justify-content:flex-start;
        text-align: center;
        overflow-y:scroll ;
        .active{
          background-color: #666666;
          border:1px solid #666666;/*no*/
          color: #fff;
        }
        span{
          border: 1px solid #999999;/*no*/
          border-radius: 10px;
          min-width: 150px;
          width: 180px;
          height: 50px;
          line-height: 50px;
          display: block;
          margin: 10px;
          padding: 0 10px;
          font-size: 12px;/*no*/
        }
      }
    }
    .tips{
      padding: 30px;
      height: 200px;
      box-sizing: border-box;
      background-color: #fff;
      box-shadow: 0 -11px 30px #c0c0c0;
      margin-top: 20px;
      position: absolute;
      bottom: 0;
      left:0;
      right: 0;
      .characteristic{
        display: flex;
        align-items:center;
        flex-wrap:wrap;
        margin-top: 20px;
        padding-right: 20px;
        text-align: center;
        .icon{
          display: inline-block;
          width:30px;
          height:24px;
          border-radius: 4px;
          margin-right: 15px;
        }
      }
    }
    .search-wrap{
      background-color: #fff;
      padding: 30px 30px 0;
      box-sizing: border-box;
      display: flex;
      position: relative;
      .search{
        position: absolute;
        right:45px;
        top:40px;
        width: 42px;
        height: 42px;
        background: url("../assets/img/icon-search.png") no-repeat;
        background-size: 42px 42px;
      }
      input{
        background-color: rgba(0,0,0,0);
        height: 58px;
        line-height: 58px;
        border: 1px solid #999999;/*no*/
        border-radius: 29px;
        margin: auto;
        flex: 1;
        box-sizing: border-box;
        padding: 20px 50px;
        text-align: center;
      }
      .search-clear{
        top: 41px;
        right: 190px;
        position: absolute;
        color: #999999;
      }
      .search-btn{
        border-radius:20px;
        background: $blueColor;
        color: #fff;
        height: 58px;
        line-height: 58px;
        width: 120px;
        margin-left: 20px;
        font-size: 12px;/*no*/
      }
    }
  }
</style>
<script>
  export default ({
    data:function () {
      return {
        activeFloor:'',
        activeRoom:'',
        clearShow:false,
        SDINo:'',
        emptyActions:[{name:'安排技师',code:'0',method:this.toPage}],
        rooms:[],
        floors:[],
        room:[],
        actionRoom:{},
        roomTotals:[],
        roomstatus:'',
        floorLayer:'',
        roomType:'',

        counted:0,
        loading: false,
        allLoaded: false,
        topStatus: '',
        bottomStatus: '',
        listHeight:0,
        pageNumber: 1,
        pageSize: 100000000,
        empty:false,
        localParams:{}
      }
    },
    computed:{
      total:function () {
        let total=0;
          for(let i=0; i< this.roomTotals.length;i++){
             total += this.roomTotals[i].RoomCount;
          }
          return total;
      }
    },
    methods:{
      backPage:function () {
          this.$router.push('/manage')
      },
      toMsg:function () {
        this.$router.push({'path':'/message'});
      },

      search:function () {
        this.loadData('refresh');
      },
      searchFloorActive:function (idx,item) {
        console.log(item)
        if( idx === this.activeFloor){
          this.activeFloor = '';
          this.floorLayer=''
        }else{
          this.activeFloor = idx;
          this.floorLayer=item.Code;
        }
          this.loadData('refresh')
      },
      searchRoomTypeActive:function (idx,item) {
        console.log(item)
        if( idx === this.activeRoom){
          this.activeRoom = '';
          this.roomType='';
        }else{
          this.activeRoom = idx;
          this.roomType = item.Code;
        }
        this.loadData('refresh')
      },
      searchRoom:function (item) {
        if(item){
          this.roomstatus= item.RoomStatus.toString();
        }else{
          this.roomstatus='';
        }
        this.loadData('refresh')
      },
      actionPage:function (items) {
        switch (items.RoomStatus){
          case 2:
            this.$mint.MessageBox.alert('脏房不可操作');
            break;
          case 3:
            this.$mint.MessageBox.alert('维修房不可操作');
            break;
          case 4:
            this.$mint.MessageBox.alert('占用房不可操作');
            break;
          default:
            this.actionRoom = items;
            this.actionRoom.RoomID = items.ID;
            this.actionRoom.RoomNo = items.No;
            console.log('this.actionRoom',this.actionRoom)
            this.$router.push({path:'/manageTech',query:this.actionRoom})

        }
      },
      showIcon:function () {
        if(this.SDINo){
          this.clearShow=true;
        }else{
          this.clearShow=false;
        }
      },
      clearInput:function () {
        this.SDINo=''
      },
      toPage:function (selected) {
        let ts = this;
        switch (selected.code){
          case "1"://修改信息
            console.log(1)
            ts.$router.push({'path':'/changeInfo',query:this.actionRoom});
            break;
          case "2"://房间信息
            console.log(2)
            ts.$router.push({'path':'/roomInfo',query:this.actionRoom});
            break;
          case "3"://退钟
            console.log(3)
            ts.$router.push({'path':'/retreatRoom',query:this.actionRoom});
            break;
          case "4"://撤单
            console.log(4)
            ts.$router.push({'path':'/backoutOrder',query:this.actionRoom});
            break;
          case "5"://消费录入
            console.log(5)
            ts.$router.push({'path':'/buyRecord',query:this.actionRoom});
            break;
          case "6"://换技师
            console.log(6)
            ts.$router.push({'path':'/changeTechnician',query:this.actionRoom});
            break;
        }
      },
      loadData:function (action,id,loading) {
        let ts = this;
          console.log("loadData",ts.localParams)

        if ('refresh' === action) {
          ts.room = [];
          ts.pageNumber = 1;
          ts.allLoaded=false;
        }
        let roomParams = {
          "PmsID": ts.localParams.PmsID,
          "CustomerNo": ts.localParams.CustomerNo,
          "UserId":ts.localParams.UserId ,
          "Signature":ts.localParams.Signature,
          "Timestamp":ts.localParams.Timestamp,
          "IgnoreSignatrue": true,
          "SDINo":ts.SDINo,
          "RoomStatus":ts.roomstatus,
          "FloorLayer": ts.floorLayer,
          "RoomType": ts.roomType,
          "PageIndex": ts.pageNumber,
          "PageSize": ts.pageSize,
        }
        ts.$api.post('GetRooms', roomParams).then(function (rets) {
          let data = rets.data.data;
          console.log('GetRooms rets----',rets);
          if (data && data.length > 0) {
              ts.room= ts.room.concat(data);
              ts.empty = false;

            if( rets.data.curpage < rets.data.pages){
              ts.allLoaded =false;
              ts.pageNumber = ts.pageNumber + 1;
            }else{
              ts.allLoaded =true;
            }

          } else {
            ts.allLoaded = true;
            if(ts.room.length<=0){
              ts.empty = true;
            }
          }
          ts.getInitData();
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
      getInitData:function () {
        let ths = this;

        ths.$api.post('GetRoomStatusCount',ths.localParams).then(function (rets) {
          if(rets.code === 0 ){
            ths.roomTotals= rets.data;
            console.log('ths.roomTotals',ths.roomTotals)
          }else{
            ths.$vue.$toast({
              position:'bottom',
              message:rets.message
            })
          }
        });
      }
    },

    created:function () {
      let ths = this;
      let LoginData = ths.$api.getLocalData('loginData');
      let secreParams = ths.SecreUtil.getParams(LoginData.PmsID,LoginData.UserId);
       ths.localParams = {
        "PmsID": LoginData.PmsID,
        "CustomerNo": LoginData.CustomerNo,
        "UserId":LoginData.UserID ,
        "Signature":secreParams.signature,
        "Timestamp":secreParams.timestamp,
        "IgnoreSignatrue": true
      }
      ths.$api.post('GetRoomType',ths.localParams).then(function (rets) {
        if(rets.code === 0 ){
          ths.rooms = rets.data;
        }else{
          ths.$vue.$toast({
            position:'bottom',
            message:rets.message
          })
        }
      });
      ths.$api.post('GetRoomFloor',ths.localParams).then(function (rets) {
        if(rets.code === 0 ){
          ths.floors = rets.data;
        }else{
          ths.$vue.$toast({
            position:'bottom',
            message:rets.message
          })
        }
      });
      ths.listHeight =  document.body.clientHeight - 305 * window.dpr;
      ths.getInitData();
      ths.loadData('refresh');
    }
  })
</script>
