<template>
  <div class="data-detail">
    <Header :text="'数据中心'" :handle="true"  @back="backPage" >
    </Header>
    <div class="content" >
      <div class="tab-content">
        <div class="tab">
          <div class="item" :class="tabActive === 1 ? 'active':''" @click="tabItem(1)">技师项目汇总</div>
          <div class="item" :class="tabActive === 2 ? 'active':''" @click="tabItem(2)">技师项目明细</div>
        </div>
      </div>
      <div class="search-content">
      <!--  <div class="date-pick">
          <div class="date-item" :class="pickerActive === 1 ? 'date-active' : ''" @click="datePicker(1)">按日选</div>
          <div class="date-item" :class="pickerActive === 2 ? 'date-active' : ''"  @click="datePicker(2)">按选月</div>
          <div class="date-item" :class="pickerActive === 3 ? 'date-active' : ''"  @click="datePicker(3)">按年选</div>
        </div>-->
        <div class="date-content">
          <div class="start-date" @click="startDateOpen()" >起 <span v-text="startPickerValue"></span></div>
          <div class="end-date" @click="endDateOpen()">止 <span v-text="endPickerValue"></span></div>
        </div>
        <div class="date-shortcut">
          <div class="shortcut-item" @click="datePicker(1)">今日</div>
          <div class="shortcut-item" @click="datePicker(2)">本月</div>
          <div class="shortcut-item" @click="datePicker(3)">上月</div>
          <div class="shortcut-item" @click="datePicker(4)">今年</div>
        </div>
        <div class="search" v-show="isSearchShow">
          <label class="search-label">技师号</label>
          <input @focus="showClear"
                 @blur="showClear"
                 v-model="TechnicianNo"
                 placeholder="请输入技师号查询">
          <div class="mint-field-clear"
               v-show="searchActive"
               @click="clear">
            <i class="mintui mintui-field-error"></i>
          </div>
          <div><mt-button size="small" class="search-btn" @click="searchList">搜索</mt-button></div>
        </div>
      </div>
      <div class="list-wrap">
        <div class="list-content" v-show="isShow" >
          <div class="table-head">
            <div class="table-head-item">项目</div>
            <div class="table-head-item">单价</div>
            <div class="table-head-item">钟数</div>
            <div class="table-head-item">金额</div>
            <div class="table-head-item">提成</div>
          </div>
          <div class="table-body"  :style="{height:techBodyHeight+'px'}">
            <cui-loadmore :top-method="loadTop1"
                          @top-status-change="handleTopChange1"
                          :bottom-method="loadBottom1"
                          @bottom-status-change="handleBottomChange1"
                          :bottom-all-loaded="allLoaded1"
                          :autoFill="false"
                          ref="loadmore1">
              <div class="row" v-for="item in listArr">
                <div class="table-body-item">{{item.ItemName}}</div>
                <div class="table-body-item">{{item.ItemPrice | fmtMoney}}</div>
                <div class="table-body-item">{{item.ItemCount}}</div>
                <div class="table-body-item red">{{item.SumItemPrice | fmtMoney}}</div>
                <div class="table-body-item yellow">{{item.BonusMoney | fmtMoney}}</div>
              </div>
              <div class="empty_message_con" v-if="empty">
                <div class="empty_icon"></div>
                <div class="empty_message">暂无数据</div>
              </div>
            </cui-loadmore>
          </div>
        </div>
        <div class="list-content"  :style="{height:techDetailHeigh+'px'}"  v-show="!isShow">
          <cui-loadmore :top-method="loadTop"
                        @top-status-change="handleTopChange"
                        :bottom-method="loadBottom"
                        @bottom-status-change="handleBottomChange"
                        :bottom-all-loaded="allLoaded"
                        :autoFill="false"
                        ref="loadmore">

            <div class="table-content" v-for="item in technicianArr">
              <div class="tech-head">
                <div class="head-item">手牌号</div>
                <div class="head-item">项目</div>
                <div class="head-item">单价</div>
                <div class="head-item">钟数</div>
                <div class="head-item">金额</div>
                <div class="head-item">房号</div>
              </div>
              <div class="list-row">
                <div class="cell">{{item.SDINo}}</div>
                <div class="cell blue over-hide">{{item.ItemName}}</div>
                <div class="cell">{{item.ItemPrice}}</div>
                <div class="cell">{{item.ItemCount}}</div>
                <div class="cell red">{{item.FinalTotalPriceShare}}</div>
                <div class="cell">{{item.RoomNo || "-"}}</div>
              </div>
              <div class="list-detail-content">
                <div class="list-detail">
                  <div class="detail-item"><label>技师号:</label><span>{{item.TechnicianNo}}</span></div>
                  <div class="detail-item"><label>钟数时长:</label><span>{{item.ServiceClocks}}</span></div>
                  <div class="detail-item"><label>上钟时长:</label><span>{{item.TechnicianOnTime}}</span></div>
                </div>
                <div class="list-detail-time">
                  <div class="detail-item"><label>起钟时间:</label><span>{{item.OnServiceTime}}</span></div>
                  <div class="detail-item"><label>落钟时间:</label><span>{{item.OffServiceTime}}</span></div>
                </div>
              </div>
            </div>
            <div class="empty_message_con" v-if="empty">
              <div class="empty_icon"></div>
              <div class="empty_message">暂无数据</div>
            </div>
          </cui-loadmore>
        </div>
      </div>
      <div class="statistics-detail">
        <span class="totals">全部:     {{totals}}</span>
        <div class="type-items" v-for="item in serviceCount">
          <span>{{item.ServiceTypeName}}:</span>
          <span>{{item.Count}}</span>
        </div>
      </div>
    </div>

    <mt-datetime-picker
      ref="startDatePicker"
      type="datetime"
      year-format="{value}"
      month-format="{value}"
      date-format="{value}"
      hour-format="{value}"
      minute-format="{value}"
      :endDate="endDate"
      @confirm="startHandleConfirm"
      :class="[{'ClassMonth':isMonth,'ClassYear':isYear}]"
    >
    </mt-datetime-picker>

    <mt-datetime-picker
      ref="endDatePicker"
      type="datetime"
      year-format="{value}"
      month-format="{value}"
      date-format="{value}"
      hour-format="{value}"
      minute-format="{value}"
      :endDate="endDate"
      @confirm="endHandleConfirm"
      :class="{'ClassMonth':isMonth,'ClassYear':isYear}">
    </mt-datetime-picker>
  </div>
</template>
<style lang="scss">
  @import "../styles/style";
  .data-detail{
    position: relative;
    height: 100vh;
   /* .picker-items{
      .picker-slot{
        -webkit-box-flex:1 !important;
        flex: 1 !important;
      }
    }*/
    .ClassMonth{
      .picker-items .picker-slot:nth-child(4),
      .picker-items .picker-slot:nth-child(5){
          display: none !important;
        }
    }
    .ClassYear{
      .picker-items .picker-slot:nth-child(3),
      .picker-items .picker-slot:nth-child(4),
      .picker-items .picker-slot:nth-child(5){
          display: none !important;
      }
  }

  .red{
      color: $redColor !important;
    }
    .yellow{
      color: #F7BA2A !important;
    }
    .mint-field-clear {
      opacity: .2;
      right: 180px;
      top: 20px;
      position: absolute;
    }
    .tab-content{
      background: #fff;
      padding: 10px;
      margin: 0 auto 20px;

     /* margin: 20px 30px;
      background: #fff;*/
    /*  border-top:2px solid #99C5F6;*/
      border-radius: 8px;
      .tab{
        display: flex;
        border-radius: 5px;
        border: 1px solid #2980E0;/*no*/
        margin: 10px 30px;
        height: 58px;
        line-height: 58px;
        color:#2980E0 ;
        box-sizing: border-box;
        .item{
          flex: 1;
          text-align: center;
          box-sizing: border-box;
        }
        .active{
          color: #fff;
          background:#2980E0;
        }
      }
  }
    .search-content{
      background: #fff;
      padding-bottom: 20px;
      margin-bottom: 20px;
      .date-shortcut{
        padding:0 20px;
        display: flex;
        .shortcut-item{
          flex: 1;
          align-items: center;
          justify-content: space-between;
          color: #333;
          margin: 0 10px 0 0;
          text-align: center;
          height: 55px;
          line-height: 55px;
          border-radius: 5px;
          border: 1px solid $grayColor;/*no*/
        }
        .shortcut-item:active{
          background: rgba(0,0,0,.5);
          color: #fff;
        }
      }
      .date-pick{
        display: flex;
        margin: 30px;
        height: 80px;
        line-height: 80px;
        box-sizing: border-box;
        .date-item{
          text-align: center;
          flex: 1;
          color: #999999;
          font-size: 13px;/*no*/
          box-sizing: border-box;
          position: relative;
          transition: 0.5s all linear;
          border-bottom: 1px solid #E0E0E0;/*no*/
        }
        .date-active{
          color: #333333;
          border-bottom: 1px solid #333333;/*no*/
          transition: 0.5s all linear;
          :after{
            border-bottom:1px solid #333333;/*no*/
            content:'';
            bottom: 0;
            left:0;
            right: 0;
            transition-delay: 1s;
            width: 100%;
            height: 1px;/*no*/
            position: absolute;
          }
        }
      }
      .date-content{
        font-size: 12px;/*no*/
        color: #666666;
        display: flex;
        padding: 30px 0;
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
            right: 20px;
          }
        }
      }
      .search{
        height: 88px;
        line-height: 88px;
        padding: 20px 30px;
        font-size: 14px;/*no*/
        color: #333333;
        display: flex;
        position: relative;
        .search-label{
          width: 110px;
          font-size: 12px;/*no*/
        }
        input{
          border:1px solid #999999;/*no*/
          height: 58px;
          line-height: 58px;
          border-radius: 8px;
          padding: 20px;
          margin: 15px 20px;
          box-sizing: border-box;
          flex:1;
        }
        .search-btn{
          border-radius:8px;
          background: $blueColor;
          color: #fff;
          height: 58px;
          line-height: 58px;
          width: 120px;
          font-size: 12px;/*no*/
        }
      }
    }
    .list-wrap{
      .list-content{
        overflow-y: scroll;
        padding-bottom: 164px;
        box-sizing: border-box;
        .table-head{
          background: #99C5F6;
          height: 88px;
          line-height: 88px;
          color: #fff;
          display: flex;
          padding: 0 30px;
          .table-head-item{
            flex: 1;
            text-align: center;
          }
        }
        .table-body{
          overflow-y: scroll;
          padding-bottom: 164px;
          box-sizing: border-box;
          .row{
            text-align: center;
            height: 88px;
            line-height: 88px;
            padding: 0 30px;
            display: flex;
            background: #fff;
            border-bottom: 1px solid #e0e0e0;/*no*/
            .table-body-item{
              flex: 1;
              text-align: center;
              overflow:hidden;
              white-space:nowrap;
              text-overflow:ellipsis;
            }
          }
        }
        .table-content{
          margin:0 30px;
          background: #fff;
          border-top:2px solid #99C5F6;/*no*/
          border-radius: 8px;
          box-sizing: border-box;
          .tech-head{
            display: flex;
            text-align: center;
            height: 88px;
            line-height: 88px;
            color: #333333;
            font-weight: 600;
            margin: 0 30px;
            border-bottom: 1px solid #E0E0E0;/*no*/
            .head-item{
              flex: 1;
            }
          }
          .list-row{
            display: flex;
            height: 88px;
            line-height: 88px;
            margin: 0 30px;
            border-bottom: 1px solid #E0E0E0;/*no*/
            .cell{
              flex:1;
              text-align: center;
              color: #999999;
            }
            .over-hide{
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
            .blue{
              color: #2980E0;
              min-width: 120px;
            }
          }
          .list-detail-content{
             margin: 20px 30px;
            .list-detail{
              display: flex;
              flex-wrap: wrap;
              justify-content: flex-start;
              padding-bottom: 10px;
              .detail-item{
                flex:1;
                -webkit-box-flex:1;
                -webkit-flex:1;
              }
            }
            .list-detail-time{
              .detail-item{
                height: 35px;
                padding-bottom: 10px;
                label{
                  text-align: center;
                  min-width: 120px;
                  color: #333333;
                  font-weight: 600;
                  height: 35px;
                  line-height: 35px;
                }
                span{
                  color: #999999;
                  padding-left: 20px;
                  height: 35px;
                  line-height: 35px;
                }
              }
            }
          }
        }
      }
    }
    .statistics-detail{
      display: flex;
      flex-wrap:wrap;
      justify-content: flex-start;
      background: #fff;
      height: 144px;
      line-height: 35px;
      position: absolute;
      bottom: 0;
      right: 10px;
      left: 10px;
      box-sizing: border-box;
      color: #999999;
      text-align: center;
      padding: 0 30px;
      box-shadow: 0px -20px 20px #F4F4F4;
      .type-items,.totals{
        margin-right: 10px;
        padding: 10px 0;
        width: 130px;
        box-sizing: border-box;
      }
    }
  }
</style>
<script>
  import  moment from 'moment';
  import  accountJs from  'accounting-js'
  export default ({
    data:function () {
      return {
        tabActive:1,
        pickerActive:1,
        searchActive:false,
        TechnicianNo:'',
        pickerValue:'',
        techBodyHeight:0,
        techDetailHeigh:0,
        isShow:true,
        startPickerValue:moment().subtract(7, 'days').format('YYYY/MM/DD HH:mm'),
        endPickerValue:moment().format('YYYY/MM/DD HH:mm'),
        endDate:new Date(moment().endOf('year')),
        formatStyle:'YYYY/MM/DD HH:mm',
        listArr:[],
        technicianArr:[],
        serviceCount:[],
        isSearchShow:true,
        pageNumber:1,
        pageSize:5,
        empty:false,
        loading: false,

        allLoaded: false,
        topStatus: '',
        bottomStatus: '',

        allLoaded1: false,
        topStatus1: '',
        bottomStatus1: '',
        checkDateFlag:true,
        isDay:true,
        isMonth:false,
        isYear:false,
        flag:''

      }
    },
    filters:{
      fmtMoney:function (item) {
        return accountJs.formatMoney(item,{ symbol: "¥",  format: "%s %v" });
      }
    },
    computed:{
      totals:function () {
        let total =0;
        for(let i=0; i<this.serviceCount.length;i++){
           total += this.serviceCount[i].Count;
        }
        return total;
      }
    },
    methods:{
      backPage:function () {
        let LoginData = this.$api.getLocalData('loginData');
        if(LoginData.AuthType === 1){
          this.$router.push({'path':'/manage'})
        }else{
          this.$router.push({'path':'/technicianIndex'})
        }
      },
      checkDate:function () {
       /* let isBeforeFlag = true;
        let isBefore = true;
           if(this.formatStyle === 'YYYY/MM'){
             isBefore = moment(_tempStartMonth).isBefore(_tempEndMonth);
           }else if(this.formatStyle === 'YYYY'){
              isBefore = moment(_tempStartYear).isBefore(_tempEndYear);
           }else{
             isBefore = moment(this.startPickerValue).isBefore(this.endPickerValue);
           }
         console.log(isBefore)
        if(!isBefore){
          this.$mint.Toast({
            position:'center',
            message:'结束日期不能小于开始日期'
          });
          isBeforeFlag = false;
        }else{
          isBeforeFlag = true;
        }
        this.checkDateFlag = isBeforeFlag; */
        return this.checkDateFlag
      },
      tabItem:function (active) {
        this.tabActive = active;
          if(this.tabActive === 1){
            this.isShow= true;
            this.loadData('refresh')
          }else{
            this.isShow = false;
            this.loadTechData('refresh');
        }
      },
      datePicker:function (flag) {
        this.flag  =  flag;
          switch(flag){
            case 1://今日
              this.$refs.startDatePicker.currentValue =moment().startOf('days').format('YYYY/MM/DD HH:mm:ss');
              this.$refs.endDatePicker.currentValue =moment().endOf('days').format('YYYY/MM/DD HH:mm:ss');
              break;
            case 2://本月
              this.$refs.startDatePicker.currentValue =moment().startOf('month').format('YYYY/MM/DD HH:mm:ss');
              this.$refs.endDatePicker.currentValue =moment().endOf('month').format('YYYY/MM/DD HH:mm:ss');
              break;
            case 3://上月
              let _tempMonth = moment().subtract(1,'month').format('YYYY/MM/DD HH:mm:ss');
              console.log('_tempMonth-----',_tempMonth)
              this.$refs.startDatePicker.currentValue =moment(_tempMonth).startOf('month').format('YYYY/MM/DD HH:mm:ss');
              this.$refs.endDatePicker.currentValue =moment(_tempMonth).endOf('month').format('YYYY/MM/DD HH:mm:ss');
              console.log(this.$refs.startDatePicker.currentValue,this.$refs.endDatePicker.currentValue)
              break;
            case 4://今年
              this.$refs.startDatePicker.currentValue =moment().startOf('year').format('YYYY/MM/DD HH:mm:ss');
              this.$refs.endDatePicker.currentValue =moment().endOf('year').format('YYYY/MM/DD HH:mm:ss');
              break;
            default:
              this.$refs.startDatePicker.currentValue =moment(this.startPickerValue).format('YYYY/MM/DD HH:mm:ss');
              this.$refs.endDatePicker.currentValue =moment(this.endPickerValue).format('YYYY/MM/DD HH:mm:ss');
          }

          this.startPickerValue = moment(this.$refs.startDatePicker.currentValue).format(this.formatStyle);
          this.endPickerValue = moment(this.$refs.endDatePicker.currentValue).format(this.formatStyle);

          if(this.tabActive === 1){
            this.isShow= true;
            this.loadData('refresh')
          }else{
            this.isShow = false;
            this.loadTechData('refresh');
          }
      },
      clear:function () {
        this.TechnicianNo = ''
      },
      showClear:function () {
        if(this.TechnicianNo){
          this.searchActive = true;
        }else{
          this.searchActive = false;
        }
      },
      startDateOpen:function (flag) {
        let _tempStartValue= '';
        flag = this.flag;
        if(!flag){
          _tempStartValue =moment().subtract(7, 'days').format('YYYY/MM/DD HH:mm');
        }else{
            _tempStartValue = this.startPickerValue;
        }
        this.$refs.startDatePicker.currentValue = moment(_tempStartValue).format('YYYY/MM/DD HH:mm');
        this.$refs.startDatePicker.open();
      },
      endDateOpen:function (flag) {
        let _tempEndValue ='';

        flag = this.flag;
        if(!flag){
          _tempEndValue=moment().format('YYYY/MM/DD HH:mm');
        }else{
          _tempEndValue = this.endPickerValue;
        }
        this.$refs.endDatePicker.currentValue = moment(_tempEndValue).format('YYYY/MM/DD HH:mm');
        this.$refs.endDatePicker.open();
      },
      startHandleConfirm:function (startDate) {
       /* if(!moment.isDate(startDate)){
          startDate =moment().format('YYYY/MM/DD HH:mm')
        }else{
          startDate =moment(startDate).format('YYYY/MM/DD HH:mm');
        }*/
        this.$refs.startDatePicker.currentValue =startDate;

        this.startPickerValue =moment(startDate).format(this.formatStyle);
        if(this.checkDate()){
          if(this.tabActive === 1){
            this.isShow= true;
            this.loadData('refresh')
          }else{
            this.isShow = false;
            this.loadTechData('refresh');
          }
        }

      },
      endHandleConfirm:function (endDate) {
      /*  if(!moment.isDate(endDate)){
          endDate =moment().format('YYYY/MM/DD HH:mm')
        }else{
          endDate =moment(endDate).format('YYYY/MM/DD HH:mm')
        }*/
        this.$refs.endDatePicker.currentValue =endDate;

        this.endPickerValue =moment(endDate).format(this.formatStyle);
          if(this.tabActive === 1){
            this.isShow= true;
            this.loadData('refresh')
          }else{
            this.isShow = false;
            this.loadTechData('refresh');
          }
      },
      getServiceCount:function(){
        let  ths = this;
        let LoginData = ths.$api.getLocalData('loginData');
        let secreParams = ths.SecreUtil.getParams(LoginData.PmsID,LoginData.UserId);

        let dealDate=ths.handleDate();
        let  params ={
          "Begin": dealDate.begin,
          "End": dealDate.end,
          "TechnicianNo":ths.TechnicianNo||LoginData.TechnicianNo,
          "PmsID": LoginData.PmsID,
          "CustomerNo": LoginData.CustomerNo,
          "UserId":LoginData.UserID ,
          "Signature":secreParams.signature,
          "Timestamp":secreParams.timestamp,
          "IgnoreSignatrue": secreParams.ignoreSignatrue
        }

        if(this.checkDate()){
        ths.$api.post('GetServiceTypeCount',params).then((rets)=>{
          if(rets.code === 0){
            ths.serviceCount = rets.data;
          }
        })
        }
      },
      handleDate:function(){
        let beginDate = moment(this.startPickerValue).format('YYYY/MM/DD HH:mm:ss');
        let endDate = moment(this.endPickerValue).format('YYYY/MM/DD HH:mm:ss');
        let _tempDate = {begin:beginDate,end:endDate}
        console.log('_tempDate',_tempDate)
        return _tempDate;
      },
      searchList:function () {
          if(this.tabActive === 1){
            this.isShow= true;
            this.loadData('refresh')
          }else{
            this.isShow = false;
            this.loadTechData('refresh');
        }
      },
      loadData:function (action,id,loading) {
        let ths = this;
        let LoginData = ths.$api.getLocalData('loginData');
        let secreParams = ths.SecreUtil.getParams(LoginData.PmsID,LoginData.UserId);
        if ('refresh' === action) {
          ths.listArr = [];
          ths.allLoaded1=false;
          ths.pageNumber = 1;
        }
        let dealDate=ths.handleDate();
        let localParams = {
          "Begin":dealDate.begin,
          "End": dealDate.end,
          "TechnicianNo":ths.TechnicianNo||LoginData.TechnicianNo,
          "ServiceStatus": [2,3,4],
          "PageIndex": ths.pageNumber,
          "PageSize": ths.pageSize,
          "PmsID": LoginData.PmsID,
          "CustomerNo": LoginData.CustomerNo,
          "UserId":LoginData.UserID ,
          "Signature":secreParams.signature,
          "Timestamp":secreParams.timestamp,
          "IgnoreSignatrue": secreParams.ignoreSignatrue
        };

        if(ths.checkDate()){
          ths.$api.post('GetTechnicianItemBonus', localParams).then(function (rets) {
          if(rets.code === 0){
            console.log( rets.data)
            ths.getServiceCount();
            let data = rets.data.data;
            if (data && data.length > 0) {
              ths.listArr= ths.listArr.concat(data);
              ths.empty = false;
              if( rets.data.curpage < rets.data.pages){
                ths.allLoaded1 =false;
                ths.pageNumber = ths.pageNumber + 1;
              }else{
                ths.allLoaded1 =true;
              }
            } else {
              ths.allLoaded1 = true;
              if(ths.listArr.length<=0){
                ths.empty = true;
              }
            }
          }

        },loading);
        }
      },
      loadTechData:function (action,id,loading) {
        let ths = this;
        let LoginData = ths.$api.getLocalData('loginData');
        let secreParams = ths.SecreUtil.getParams(LoginData.PmsID,LoginData.UserId);
        if ('refresh' === action) {
          ths.technicianArr=[];
          ths.allLoaded=false;
          ths.pageNumber = 1;
        }
        let dealDate=ths.handleDate();
        let localParams = {
          "Begin":dealDate.begin,
          "End": dealDate.end,
          "TechnicianNo":ths.TechnicianNo||LoginData.TechnicianNo,
          "ServiceStatus": [4],
          "PageIndex": ths.pageNumber,
          "PageSize": ths.pageSize,
          "PmsID": LoginData.PmsID,
          "CustomerNo": LoginData.CustomerNo,
          "UserId":LoginData.UserID ,
          "Signature":secreParams.signature,
          "Timestamp":secreParams.timestamp,
          "IgnoreSignatrue": secreParams.ignoreSignatrue
        }

        if(ths.checkDate()){
          ths.$api.post('GetTechnicianItemDetails', localParams).then(function (rets) {
          console.log('GetTechnicianItemDetails',rets);
          if(rets.code === 0){
            ths.getServiceCount();
            let data = rets.data.data;
            if (data && data.length > 0) {
              ths.technicianArr= ths.technicianArr.concat(data);
              ths.empty = false;
              if( rets.data.curpage < rets.data.pages){
                ths.allLoaded =false;
                ths.pageNumber = ths.pageNumber + 1;
              }else{
                ths.allLoaded =true;
              }
            } else {
              ths.allLoaded = true;
              if(ths.technicianArr.length<=0){
                ths.empty = true;
              }
            }
          }

        },loading);
        }
      },
      handleTopChange: function (status) {
        this.topStatus = status;
      },
      loadTop: function (id) {
        let _this = this;
        setTimeout(function () {
            _this.loadTechData('refresh');
          _this.$refs.loadmore.onTopLoaded(id);
        }, 200);
      },
      handleBottomChange: function (status) {
        this.bottomStatus = status;
      },
      loadBottom: function (id) {
        let _this = this;
        setTimeout(function () {
            _this.loadTechData('load', id, false);
          _this.$refs.loadmore.onBottomLoaded(id);
        },200);
      },
      handleTopChange1: function (status) {
        this.topStatus1 = status;
      },
      loadTop1: function (id) {
        let _this = this;
        setTimeout(function () {
            _this.loadData('refresh')
          _this.$refs.loadmore1.onTopLoaded(id);
        }, 200);
      },
      handleBottomChange1: function (status) {
        this.bottomStatus1 = status;
      },
      loadBottom1: function (id) {
        let _this = this;
        setTimeout(function () {
            _this.loadData('load', id, false);
          _this.$refs.loadmore1.onBottomLoaded(id);
        },200);
      },
    },
    created:function () {
      let ths = this;
        let LoginData = ths.$api.getLocalData('loginData');
      ths.isSearchShow = LoginData.AuthType === 1 ? true : false;
      ths.techBodyHeight =  document.body.clientHeight - 335 * window.dpr;
      ths.techDetailHeigh = document.body.clientHeight - 275 * window.dpr;
      ths.loadData('refresh')
    }
  })
</script>
