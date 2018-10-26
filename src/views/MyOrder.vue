<template>
  <div class="resetIndex myOrder">
    <Header :text="'我的订单'" :handle="true" @back="backPage"></Header>
    <div class="mainHead clearfix">
      <div class="left" :class="select == 1 ? 'active':''" @click="selectVal(1)">
        <div>全部</div>
        <i class="extra"></i>
      </div>
      <div class="center" :class="select == 2 ? 'active':''" @click="selectVal(2)">
        <div>未完成</div>
        <i class="extra"></i>
      </div>
      <div class="right" :class="select == 3 ? 'active':''" @click="selectVal(3)">
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
            <th>手牌</th>
            <th>项目</th>
            <th>钟数</th>
            <th>上钟方式</th>
            <th>房号</th>
            <th>状态</th>
          </tr>
          <tr>
            <td>{{item.SDINo || '-'}}</td>
            <td>{{item.ItemName || '-'}} </td>
            <td>{{item.ServiceClocks ||'-'}}</td>
            <td>{{item.ServiceTypeName ||'-'}}</td>
            <td>{{item.RoomNo ||'-' }}</td>
            <td :class="item.ServiceStatus === 2 || item.ServiceStatus === 3 ? 'markedness':''">{{item.ServiceStatusName}}</td>
          </tr>
        </table>
        <div class="normal_cell"  v-show="item.ServiceStatus !== 2">上钟时间:<span>{{item.OnServiceTime}}</span></div>
        <div class="normal_cell"  v-show="item.ServiceStatus !== 2 && item.ServiceStatus !== 3">下钟时间:<span>{{item.OffServiceTime}}</span></div>
        <div class="normal_cell" v-show="item.ServiceStatus !== 4 && item.ServiceStatus !== 3">安排时间:<span>{{item.AssignEditTime}}</span></div>
        <div class="normal_cell" v-show="LoginData.AuthType === 1">技师:<span>{{item.TechnicianNo}}</span></div>
        <div class="normal_cell" v-show="LoginData.AuthType !== 1">安排人员:<span>{{item.AssignEditName}}</span></div>
        <div class="normal_cell">钟长时数:<span>{{item.TechnicianOnTime}}</span></div>
        <div class="tech-operation" v-show="isShow">
          <div class="item_button" v-show="item.ServiceStatus === 2" @click="onClock(item)">上钟</div>
          <div class="item_button" v-show="item.ServiceStatus === 3" @click="updateClock(item)">修改</div>
          <div class="item_button" v-show="item.ServiceStatus === 3" @click="addClock(item)">加钟</div>
          <div class="item_button" v-show="item.ServiceStatus === 3" @click="offClock(item)">下钟</div>
        </div>
      </div>
        <div class="empty_message_con" v-if="empty">
          <div class="empty_icon"></div>
          <div class="empty_message">暂无数据</div>
        </div>
      </cui-loadmore>
    </div>
    <div class="count-tech" v-show="!isShow">
          <div class="item"
               v-show="select === 1"
               :class="activeStatus === -1 ?'active':''"
               @click="totalsByStatus('',-1)">全部({{count}})</div>
          <div class="item"
               v-show="select === 2 || select === 1  "
               :class="activeStatus === idx2?'active':''"
               @click="totalsByStatus(items,idx2)"
               v-for = "(items,idx2) in orderTotals"
               v-if='items.ServiceStatus=== 2'>未上钟({{items.Count || 0}})</div>
          <div class="item"  v-show="select === 2 || select === 1 "  :class="activeStatus === idx3 ?'active':''"
               @click="totalsByStatus(items,idx3)"
               v-for = "(items,idx3) in orderTotals"
               v-if='items.ServiceStatus=== 3'>上钟({{items.Count || 0}})</div>
        <div class="item" v-show="select === 3 || select === 1 "  :class="activeStatus === idx4 ?'active':''"
             @click="totalsByStatus(items,idx4)"
             v-for = "(items,idx4) in orderTotals"
             v-if='items.ServiceStatus=== 4'>下钟({{items.Count || 0}})</div>
      </div>

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
  import  moment from 'moment';
  export default {
    data() {
      return {
        select: 1,
        techList:[],
        counted:0,
        loading: false,
        allLoaded: false,
        topStatus: '',
        bottomStatus: '',
        listHeight:0,
        pageNumber: 1,
        pageSize: 10,
        empty:false,
        isShow:false,
        orderTotals:{},
        activeStatus:-1,
        tempServiceStatus:[2,3,4],
        LoginData:{},
        startPickerValue:moment().subtract(7, 'days').format('YYYY/MM/DD'),
        endPickerValue:moment().format('YYYY/MM/DD'),
        endDate:new Date(),
        formatStyle:'YYYY/MM/DD',
        checkDateFlag:true
      };
    },
    computed:{
      count:function () {
        let count =0;
        for(let i=0; i< this.orderTotals.length;i++){
          if(this.orderTotals[i].ServiceStatus === 2 ||
              this.orderTotals[i].ServiceStatus === 3 ||
              this.orderTotals[i].ServiceStatus === 4){
            count += this.orderTotals[i].Count;

          }
        }
        console.log("count-------",count)
          return count;
      }
    },
    methods: {
      backPage: function () {
        let ths = this;
        let LoginData = ths.$api.getLocalData('loginData');
        if(LoginData.AuthType === 1){
          ths.$router.push('/manage')
        }else{
          ths.$router.push('/technicianIndex')
        }
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
          LoginData.AuthType === 1 ?   this.loadUserData("refresh", null) :   this.loadData("refresh", null);
      },
      endHandleConfirm:function (endDate) {
        console.log(endDate)
        this.endPickerValue =moment(endDate).format(this.formatStyle);
        let LoginData = this.$api.getLocalData('loginData');
          LoginData.AuthType === 1 ?   this.loadUserData("refresh", null) :   this.loadData("refresh", null);
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
      selectVal: function (val) {
        this.select = val;
        if(this.select === 1){
          this.activeStatus = -1;
        }
        let LoginData = this.$api.getLocalData('loginData');
          LoginData.AuthType === 1 ?  this.loadUserData('refresh') :  this.loadData('refresh');
      },
      getServiceStatus:function () {
        let _temp = [];
        switch(this.select){
          case 1:
            _temp =[2,3,4];
            break;
          case 2:
            _temp =[2,3];
            break;
          case 3:
            _temp =[4];
            break;
        }
        return _temp;
      },
      totalsByStatus:function (item,idx) {
        console.log('-----',item.ServiceStatus)
        console.log('-----',idx)
        this.activeStatus = idx;
        this.tempServiceStatus=[];
        if(idx === -1){
          this.tempServiceStatus = [2,3,4]
        }else{
          this.tempServiceStatus = [item.ServiceStatus]
        }
        let LoginData = this.$api.getLocalData('loginData');
        LoginData.AuthType === 1 ?    this.loadUserData('refresh') :  this.loadData('refresh');
      },
      loadUserData:function(action,id,loading){
        let ts = this;

        if ('refresh' === action) {
          ts.techList = [];
          ts.pageNumber = 1;
          ts.allLoaded=false;
        }

       // let LoginData = ts.$api.getLocalData('loginData');
        let secreParams = ts.SecreUtil.getParams(ts.LoginData.PmsID,ts.LoginData.UserID);

        ts.isShow = false;

        if((ts.activeStatus === -1 && ts.select === 1)|| ts.select !== 1){
          ts.tempServiceStatus =ts.getServiceStatus();
        }

        console.log("ts.tempServiceStatus---",ts.tempServiceStatus)

        let params={
          "Begin": moment(ts.startPickerValue).startOf('day').format('YYYY-MM-DD HH:mm'),
          "End":moment(ts.endPickerValue).endOf('day').format('YYYY-MM-DD HH:mm'),
          "ServiceStatus":ts.tempServiceStatus,
          "PageIndex": ts.pageNumber,
          "PageSize": ts.pageSize,
          "PmsID":ts.LoginData.PmsID,
          "CustomerNo": ts.LoginData.CustomerNo,
          "UserId": ts.LoginData.UserID,
          "Signature": secreParams.signature,
          "Timestamp": secreParams.timestamp,
          "IgnoreSignature": secreParams.ignoreSignatrue
        }
        if(ts.checkDate()){
          ts.$api.post('GetUserOrder', params).then(function (rets) {
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
          ts.getTotals();
        }
      },
      loadData:function (action,id,loading) {
        let ts = this;

        if ('refresh' === action) {
          ts.techList = [];
          ts.pageNumber = 1;
          ts.allLoaded=false;
        }

        let secreParams = ts.SecreUtil.getParams(ts.LoginData.PmsID,ts.LoginData.UserID);
        ts.isShow = true;
       if((ts.activeStatus === -1 && ts.select === 1)|| ts.select !== 1){
         ts.tempServiceStatus =ts.getServiceStatus();
       }

        let params={
          "Begin": moment(ts.startPickerValue).startOf('day').format('YYYY-MM-DD HH:mm:ss'),
          "End":moment(ts.endPickerValue).endOf('day').format('YYYY-MM-DD HH:mm:ss'),
          "TechnicianID":ts.LoginData.TechnicianID,
          "TechnicianNo":ts.LoginData.TechnicianNo,
          //"IsMyOrder":true,
          "ServiceStatus": ts.tempServiceStatus,
          "PageIndex": ts.pageNumber,
          "PageSize": ts.pageSize,
          "PmsID": ts.LoginData.PmsID,
          "CustomerNo": ts.LoginData.CustomerNo,
          "UserId":ts.LoginData.UserID ,
          "Signature":secreParams.signature,
          "Timestamp":secreParams.timestamp,
          "IgnoreSignatrue": secreParams.ignoreSignatrue,
        }
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
      getTotals:function(){
        let ts = this;
       // let LoginData = ts.$api.getLocalData('loginData');
        let secreParams = ts.SecreUtil.getParams(ts.LoginData.PmsID,ts.LoginData.UserID);
        ts.isShow = ts.LoginData.AuthType === 1 ? false : true;
        let params ={
          "Begin": moment(ts.startPickerValue).startOf('day').format('YYYY-MM-DD HH:mm:ss'),
          "End":moment(ts.endPickerValue).endOf('day').format('YYYY-MM-DD HH:mm:ss'),
          "TechnicianID":ts.LoginData.AuthType === 1 ? '':ts.LoginData.TechnicianID,
          //"IsMyOrder": LoginData.AuthType === 1 ? false : true,
          "PmsID": ts.LoginData.PmsID,
          "CustomerNo": ts.LoginData.CustomerNo,
          "UserId":ts.LoginData.UserID ,
          "Signature":secreParams.signature,
          "Timestamp":secreParams.timestamp,
          "IgnoreSignatrue": secreParams.ignoreSignatrue,
        }

        ts.$api.post('GetUserOrderCount',params).then(function (rets) {
          console.log('GetUserOrderCount---',rets)
          if(rets.code === 0){
            ts.orderTotals = rets.data ;
          }else{
            ts.$mint.Toast({
              message:rets.message,
              position:'bottom'
            })
          }
        })
      },
      handleTopChange: function (status) {
        this.topStatus = status;
      },
      loadTop: function (id) {
        console.log('loadTop------',status)
        let _this = this;
        setTimeout(function () {
          let LoginData = _this.$api.getLocalData('loginData');
            LoginData.AuthType === 1 ?  _this.loadUserData('refresh') :  _this.loadData('refresh');
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
          let LoginData = _this.$api.getLocalData('loginData');
            LoginData.AuthType === 1 ?  _this.loadUserData('load', id, false) :  _this.loadData('load', id, false);
          _this.$refs.loadmore.onBottomLoaded(id);
        },200);
      },
      onClock:function (item) {
        item.title='上钟';
        item.flag=0;
       this.$router.push({path:'/updateService',query:item})
      },
      updateClock:function (item) {
        console.log('updateClock----',item);
        item.title='修改信息';
        item.flag=1;
        this.$router.push({path:'/updateService',query:item})
      },
      addClock:function (item) {
        console.log('addClock----',item);
        item.title='加钟';
        item.flag=2;
        this.$router.push({path:'/updateService',query:item})
      },
      offClock:function (item) {
        console.log('offClock----',item);
        item.title='下钟';
        item.flag=3;
        this.$router.push({path:'/updateService',query:item})
      }
    },
    created: function () {

      this.LoginData = this.$api.getLocalData('loginData');

      if(this.LoginData.AuthType === 1){
        this.listHeight = document.body.clientHeight - 158 * window.dpr;
      }else{
        this.listHeight = document.body.clientHeight - 128 * window.dpr;
      }

      if(this.LoginData.AuthType === 1){
        this.loadUserData('refresh')
      } else{
        this.loadData('refresh')
      }
    }
  }

</script>

<style lang="scss">
  .myOrder {
    .mainHead {
      width: 690px;
      height: 88px;
      padding: 0 30px;
      background: rgba(255, 255, 255, 1);
      font-size: 28px; /*px*/
      color: #999999;
      .left {
        float: left;
        width: 33%;
        text-align: center;
        position: relative;
        border-bottom: 1px solid rgba(192, 192, 192, 1);
        div {
          width: 100%;
          height: 88px;
          line-height: 88px;
        }
      }
      .center {
        float: left;
        width: 33%;
        text-align: center;
        position: relative;
        border-bottom: 1px solid rgba(192, 192, 192, 1);
        div {
          width: 100%;
          height: 88px;
          line-height: 88px;
        }
      }
      .right {
        float: left;
        width: 33%;
        text-align: center;
        position: relative;
        border-bottom: 1px solid rgba(192, 192, 192, 1);
        div {
          width: 100%;
          height: 88px;
          line-height: 88px;
        }
      }
      .extra {
        display: none;
      }
      .active {
        color: #000000;
        .extra {
          width: 112px;
          height: 5px;
          background: rgba(51, 51, 51, 1);
          border-radius: 3px;
          display: block;
          position: absolute;
          left: 50%;
          margin-left: -56px;
          bottom: -2px;
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
    .mainBox {
      background: rgba(248, 248, 248, 1);
      padding: 0 30px;
      overflow: scroll;
      -webkit-overflow-scrolling: touch;
      .item {
        margin-top: 20px;
        min-height: 404px;
        border-radius: 8px;
        padding-bottom: 20px;
        box-shadow: 0 10px 10px 0 rgba(0, 0, 0, 0.06);
        background: rgba(255, 255, 255, 1);
        table {
          width: 90%;
          margin: 0 5%;
          font-size: 24px; /*px*/
          tr {
            height: 90px;
            line-height: 90px;
            text-align: left;
            border-bottom: 1px solid rgba(248, 248, 248, 1); /*no*/
          }
          th {
            font-weight: normal;
          }
          td {
            color: #999999;
          }
          .markedness {
            color: #F33131;
          }
        }
        .normal_cell {
          width: 90%;
          margin: 0 5%;
          font-size: 24px; /*px*/
          margin-top: 32px;
          span {
            color: rgba(153, 153, 153, 1);
            margin-left: 29px;
          }
        }
        .normal_cell:nth-last-child(2) {
         padding-bottom: 20px;
          /* border-bottom: 1px solid rgba(248, 248, 248, 1); !*no*!*/
        }
        .tech-operation{
          display: flex;
          justify-content: flex-end;
          border-top: 1px solid rgba(248, 248, 248, 1); /*no*/
          box-sizing: border-box;
          .item_button {
            width: 126px;
            height: 50px;
            margin: 20px 10px 0;
            border: 1px solid rgba(51, 51, 51, 1); /*no*/
            text-align: center;
            line-height: 50px;
            border-radius: 25px;
            position: relative;
          }
        }
      }
    }
    .count-tech{
      display: flex;
      justify-content: flex-start;
      background: #fff;
      color: #999;
      height: 99px;
      line-height:99px;
      position: fixed;
      left:0;
      bottom: 0;
      right: 0;
      .item{
        width: 120px;
        padding-left: 30px;
        margin: 10px;
        text-align: center;
      }
      .active{
        color: #333;
      }
    }
  }
</style>
