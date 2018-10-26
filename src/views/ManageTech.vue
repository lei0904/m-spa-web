<template>
  <div class="manage-tech">
    <Header :text="title" :handle="true"  @back="backPage" ></Header>
    <div class="content" :style="'height:'+pageHeight+'px'">
      <div class="list-content" :style="'height:'+listHeight+'px'">
        <div class="item" v-for ="item in techList"
             @click="toDetail(item)">
          <table border="0">
            <tr>
              <th>手牌</th>
              <th>技师号</th>
              <th>项目</th>
              <th>钟数</th>
              <th>状态</th>
            </tr>
            <tr>
              <td>{{item.SDINo || '-'}}</td>
              <td>{{item.TechnicianNo || '-'}}</td>
              <td>{{item.ItemName || '-'}}</td>
              <td>{{item.ServiceClocks || '-'}}</td>
              <td :class="item.ServiceStatus ==2 ||item.ServiceStatus ==3? 'markedness':'' ">{{item.ServiceStatusName || '-'}}</td>
            </tr>
          </table>
          <mt-cell
            title="查看详情"
            is-link
            value="">
          </mt-cell>
          <div class="item_footer"></div>
        </div>
        <div class="empty_message_con" v-if="empty">
          <div class="empty_icon"></div>
          <div class="empty_message">暂未安排技师</div>
        </div>
      </div>
      <div class="foot-operation">
        <div class="item" :class="optActive === 1 ? 'opt-acitve':''" @click="toPage(1)">安排技师</div>
        <div class="item" :class="optActive === 2 ? 'opt-acitve':''" v-show="!empty" @click="toPage(2)">房间信息</div>
        <div class="item" :class="optActive === 3 ? 'opt-acitve':''" v-show="!empty" @click="toPage(3)">消费录入</div>
        <div class="item" :class="optActive === 4 ? 'opt-acitve':''" v-show="empty" @click="toPage(4)">取消</div>
      </div>
      <mt-popup v-model="orderSheetVisible"
                position="bottom"
                class="ces-mt-popup">
        <div class="mint-actionsheet">
          <div class="popup-title"><span>点单方式</span></div>
          <ul class="mint-actionsheet-list">
            <li class="mint-actionsheet-listitem"
                v-for = "item in orderActions"
                @click="selectedOption(item)"
            >{{item.Name}}</li>
          </ul>
          <!--<a class="mint-actionsheet-button" href="#" @click="cancelAction">取消</a>-->
        </div>
      </mt-popup>
    </div>
  </div>
</template>
<style lang="scss">
  @import "../styles/style";
.manage-tech{
  .content{
    background: #f8f8f8;
    .list-content{
      background: rgba(248,248,248,1);
      overflow: scroll;
      .item{
        margin:20px 20px  0 ;
        min-height:276px;
        border-radius:8px;
        box-shadow:0 10px 10px 0 rgba(0,0,0,0.06);
        background:rgba(255,255,255,1);
        border-top:8px solid #99C5F6;
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
            font-weight: bold;
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
      .empty_message_con{
        margin-top: 180px;
        .empty_icon{
          background: url("../assets/img/icon-empty.png") no-repeat;
          background-size:100% 100% ;
          background-position: center center;
          width: 226px;
          height: 186px;
          margin: auto;
        }
        .empty_message{
          text-align: center;
          font-size: 13px;/*no*/
          color: #999999;
          margin:40px auto;
        }
      }
    }
    .foot-operation{
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: fixed;
      left:0;
      right: 0;
      bottom: 0;
      text-align: center;
      height: 88px;
      color: #999;
      background: #fff;
      .item{
        flex: 1;
        text-align: center;
        height: 88px;
        line-height: 88px;
      }
      .opt-acitve{
        background: #0F71DE;
        color: #fff;
      }
    }

     .ces-mt-popup{
       width: 100%;
       .mint-actionsheet{
         color: #999999;
         font-size: 13px;/*no*/
       }
       .mint-actionsheet-list{
         margin-bottom: 5px;
         background: #fff;
         padding: 0 20px;
         .mint-actionsheet-listitem{
           font-size: 13px;/*no*/
         }
       }

       .popup-title{
         background: #fff;
         font-size: 16px;/*no*/
       }
       .popup-title{
         height: 90px;
         line-height: 90px;
         text-align: left;
         padding: 0 30px;
         color: #333333;
         font-weight: bold;
         font-size:32px;
         border-bottom: 1px solid #e0e0e0;/*no*/
       }
     }
  }
}
</style>
<script>
  export default ({
     data:function(){
       return {
         title:'',
         TechnicianNo:[],
         roomInfo:{},
         techList:[],
         empty:false,
         optActive:1,
         listHeight:0,
         pageHeight:0,
         orderSheetVisible:false,
         orderActions:[],
        }
     },
    methods:{
      backPage:function () {
        this.$router.push('/roomStatus')
      },
      getRoomTask:function(){
        let loginData = this.$api.getLocalData('loginData');
        let secreParams = this.SecreUtil.getParams(loginData.PmsID,loginData.UserId);
        console.log()
        let ts = this;
             let GetRoomParam = {
              "RoomID":ts.roomInfo.RoomID,
              "PageIndex": 1,
              "PageSize": 100,
              "PmsID": loginData.PmsID,
              "CustomerNo": loginData.CustomerNo,
              "UserId": loginData.UserID,
              "Signature":secreParams.signature,
              "Timestamp":secreParams.timestamp,
              "IgnoreSignature": secreParams.ignoreSignatrue,
            }
            console.log(JSON.stringify(GetRoomParam))
              ts.$api.post('GetRoomTask',GetRoomParam).then(function (rets) {
                console.log('----',rets);
                if(rets.code === 0){
                  ts.techList= rets.data.data;
                 // ts.techList.ID = ts.roomInfo.ID;
                  if(ts.techList.length<=0){
                    ts.empty =true;
                  }
                }else{
                  ts.$mint.Toast({
                    position:'center',
                    message:rets.message
                  });
                }
              })
      },
      toDetail:function (item) {
       let ObjAssign= Object.assign({},this.roomInfo,item);
       console.log(ObjAssign);
        this.$router.push({path:"/manageTechDetail",query:ObjAssign})
      },
      toPage:function (flag) {
        switch(flag){
          case 1://安排技师
            this.optActive =1;
            this.orderSheetVisible = true;
           // this.$router.push({'path':'/roomInfo',query:this.roomInfo});
            break;
          case 2://房间信息
            this.optActive =2;
            this.$router.push({'path':'/roomInfo',query:this.roomInfo});
            break;
          case 3://消费录入
            this.optActive =3;
            this.$router.push({'path':'/buyRecord',query:this.roomInfo});
            break;
          case 4://

            this.optActive =4;
            this.backPage();
            break
        }
      },
      selectedOption:function (item) {
        this.roomInfo.ServiceType = item.Code
        if(item.Code === 1 ||item.Code === 4){
          this.$router.push({'path':'/getTechnicians',query:this.roomInfo});
        }else{
          this.$router.push({'path':'/setTechnician',query:this.roomInfo});
        }
      }
    },
    created:function () {
      let ths = this;
      this.pageHeight = document.body.clientHeight -45 * window.dpr;
      this.listHeight = document.body.clientHeight - 108 * window.dpr;
      this.roomInfo = this.$route.query;
      console.log("点单方式-----",this.roomInfo)

      this.title = (this.roomInfo.No||this.roomInfo.RoomNo)+'房间技师列表';

      let LoginData = ths.$api.getLocalData('loginData');
      let secreParams = ths.SecreUtil.getParams(LoginData.PmsID,LoginData.UserId);
      let params ={
        "PmsID": LoginData.PmsID,
        "CustomerNo": LoginData.CustomerNo,
        "UserId":LoginData.UserID ,
        "Signature":secreParams.signature,
        "Timestamp":secreParams.timestamp,
        "IgnoreSignatrue": secreParams.ignoreSignatrue
      }
      ths.$api.post('GetTechnicianOrderMode',params).then(function (rets) {
        if(rets.code === 0){
          ths.orderActions = rets.data;
        }
      });
      this.getRoomTask();
    },
    mounted:function () {

    }
  })
</script>
