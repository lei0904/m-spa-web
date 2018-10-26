<template>
  <div class="buy-record">
    <Header :text="'消费录入'" :handle="true"  @back="backPage" ></Header>
    <div class="content">
        <div class="search-content">
          <i class="search" @click="search"></i>
          <input type="text"
                 placeholder="菜品搜索"
                 v-model='Keyword'
                 @focus="searchFocus"
                 @blur="searchBlur"
                 class="search-text">
          <div class="mint-field-clear"
               v-show="numActive"
               @click="clear('shopNum')">
            <i class="mintui mintui-field-error"></i>
          </div>
        </div>
      <div class="list-content">
        <div class="menu" :style="{height:listHeight+'px'}">
          <div class="menu-item"
               :class="isActive === idx ? 'active':''"
               v-for="(item,idx) in menuArr"
               @click="clickActive(item,idx)" >{{item.Name}}
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
          <div class="list" >
            <div class="item" v-for="(items,idx) in listArr">
              <div v-if="items.ImagePath">
                <img  :src="baseUrl+'/'+items.ImagePath" />
              </div>
              <div v-else>
                <img src="../assets/img/icon-product.png" alt="">
              </div>

              <div class="info">
                <div class="title">{{items.ItemName}}</div>
                <div class="tips">{{items.Remark}}</div>
                <div class="buy">
                  <div class="price"><span>{{items.UnitPrice | fmtMoney}}/{{items.UnitName}}</span></div>
                  <div class="account">
                    <div class="subtract" @click="subtractCount(items.count,idx,1)">-</div>
                    <input type="number"  class="count" v-model="items.count">
                    <div class="add"  @click="addCount(items.count,idx,1)">+</div></div>
                </div>
              </div>
            </div>
            <div class="empty_message_con" v-if="empty">
              <div class="empty_icon"></div>
              <div class="empty_message">暂无数据</div>
            </div>
          </div>
        </cui-loadmore>

      </div>
      </div>
      <div class="buy-product" :class="totals >0 ? 'red':'gray'" @click="subProduct">
        <span>已选 ( {{totals}} )</span>
      </div>
    </div>
    <mt-popup
      v-model="popupVisible"
      :closeOnClickModal="true"
      popup-transition="popup-fade">
      <div class="alert-popup">
        <div class="title">客人手牌</div>
        <div class="input-content">
          <input class="sdi-input" placeholder="输入手牌号" v-model="SDINo">
          <i class="qr-code" @click="qrCode">
            <img src="../assets/img/icon-qrcode.png" alt="">
          </i>
        </div>
        <div class="btn-content">
          <mt-button size="large" class="sub-btn" @click="subInfo">提交</mt-button>
        </div>
      </div>
    </mt-popup>
    <mt-popup
      v-model="buyProductedVisible"
      position="bottom" class="buy-content">
      <div class="producted-content">
        <div class="producted-head"><span>已选菜</span><span class="clear-buyCar" @click="clearBuyCar">清空购物车</span></div>
        <div class="producted-body">

          <div v-if="buyProductList.length<=0"  class="empty">
            空空如也
          </div>
          <div class="producted-item" v-for=" (item,index) in buyProductList">
            <div class="price"> {{item.UnitPrice | fmtMoney}}</div>
            <div class="producted-name"> {{item.ItemName}}</div>
            <div class="account">
              <div class="subtract" @click="subtractCount(item.count,index,2)">-</div>
              <input type="number"  class="count" v-model="item.count">
              <div class="add"  @click="addCount(item.count,index,2)">+</div></div>
          </div>
        </div>
        <div class="producted-foot">
          <div>
            <label class="totals">统计:</label>
            <span class="price"> {{ totalPrice | fmtMoney}}</span>
          </div>
          <mt-button class="buy-button" size="small" @click="buy">已选好</mt-button>
        </div>
      </div>
    </mt-popup>
  </div>
</template>
<style lang="scss">
  @import "../styles/style";
   .buy-record .alert-popup{
     width: 540px;
     height: 443px;
     margin: auto;
     background: #fff;
   }
  .buy-record .alert-popup .title{
    height: 88px;
    line-height: 88px;
    color:#333333;
    padding: 0 30px;
    font-size: 14px;/*no*/
  }
  .buy-record .alert-popup .input-content{
    height: 188px;
    background: #F8F8F8;
    position: relative;
    display: flex;
  }
  .buy-record .alert-popup .input-content .sdi-input{
    height: 58px;
    line-height: 58px;
    border: 1px solid #C0C0C0;/*no*/
    border-radius: 8px;
    width: 370px;
    margin:50px 30px;
    padding: 0 20px;
  }
  .buy-record .btn-content{
    margin: 40px auto;
    width: 80%;
  }
  .buy-record .btn-content .sub-btn{
    background: $redColor;
    color: #fff;
    height: 68px;
    line-height: 68px;
    font-size: 14px;/*no*/
  }
  .buy-record .alert-popup .qr-code img{
    width: 104px;
    height: 104px;
    position: absolute;
    top:30px;
    right: 0;
  }

  .buy-record .search-content{
    margin: 20px 30px;
    display: flex;
    box-sizing: border-box;
    position: relative;
  }
  .buy-record .search-content .search{
    position: absolute;
    left:30px;
    top:8px;
    width: 42px;
    height: 42px;
    background: url("../assets/img/icon-search.png") no-repeat;
    background-size: 42px 42px;
  }

  .buy-record .search-content .search-text{
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
  .buy-record .search-content .mint-field-clear {
    opacity: .2;
    right: 30px;
    top: 15px;
    position: absolute;
  }

  .buy-record .content .list-content{
    display: flex;
    background: #fff;
    margin-top: 10px;
  }
  .buy-record .content .list-content .menu{
    width: 180px;
    overflow-y: scroll;
  }
  .buy-record .content .list-content .menu .menu-item{
    height: 88px;
    line-height: 88px;
    padding:0 30px;
    background: #f8f8f8;
    text-align: left;
    margin: 1px 0;/*no*/
    box-sizing: border-box;
  }
  .buy-record .content .list-content .menu .active{
    border-left:4px solid $redColor ;
    color:$redColor;
  }

  .buy-record .content .list-content .menu .active:before{
    position: absolute;
    height: 88px;
    width: 2px;
    left:0;
    top:0;
    bottom: 0;
    background: $redColor;
  }

  .buy-record .content .list-content .wrap {
    overflow-y: scroll;
    flex: 1;
  }
  .buy-record .content .list-content .list .item{
    display: flex;
    padding:10px 20px ;
  }
  .buy-record .content .list-content .list .item img{
    width: 122px;
    height: 122px;
    border-radius: 8px;
  }
  .buy-record .content .list-content .list .item .info{
    padding: 10px 20px;
  }
  .buy-record .content .list-content .list .item .info .title{
    color: #FF000000;
    font-size: 14px;/*no*/
    padding:0 0 10px 0;
  }

  .buy-record .content .list-content .list .item .info .tips{
    color: #999999;
    padding: 10px 0;
  }

  .buy-record .content .list-content .list .item .info .buy{
    display: flex;
    height: 58px;
    width: 100%;
  }
  .buy-record .content .list-content .list .item .info .price,
  .buy-record  .producted-body .producted-item .price,
  .buy-record  .producted-foot .price{
    color: #F33131;
    width: 180px;
    font-size: 12px;/*no*/
  }
  .buy-record .content .list-content .list .item .info .price span{
    font-size: 16px;/*no*/
    padding-left: 10px;
  }
  .buy-record .content .list-content .list .item .info .account,
  .buy-record  .producted-body .producted-item .account {
    display: flex;
    height: 40px;
    line-height: 40px;
    border-radius: 20px;
    width: 180px;
    border: 1px solid #333333;
  }
  .buy-record .content .list-content .list .item .info .count,
  .buy-record  .producted-body .producted-item .count{
    width: 100px;
  }

  .buy-record .content .list-content .list .item .info input,
  .buy-record  .producted-body .producted-item input{
    text-align: center;
    height: 40px;
    box-sizing: border-box;
    color: $redColor;
  }
  .buy-record .content .list-content .list .item .info .subtract,
  .buy-record .content .list-content .list .item .info .add,
  .buy-record  .producted-body .producted-item .add,
  .buy-record  .producted-body .producted-item .subtract{
    width: 40px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    color: #333333;
    font-size: 16px;/*no*/
    box-sizing: border-box;
  }
  .buy-record .buy-product{
    height: 120px;
    line-height: 120px;
    color: #fff;
    font-size: 14px;/*no*/
    text-align: center;
    position: fixed;
    left:0;
    right: 0;
    bottom: 0;
  }
  .buy-record .gray{
    background:#999999;
  }
  .buy-record .red{
    background:$redColor;
  }
  .buy-record .producted-content{
    text-align: left;
    font-size: 13px;/*no*/
    position: relative;
    overflow-y: scroll;
  }
  .buy-record .producted-head{
     height: 88px;
     line-height: 88px;
     color: #999999;
     background: #F8F8F8;
     padding: 0 30px;
  }
  .buy-record  .producted-body{
    max-height: 600px;
    overflow-y: scroll;
  }
  .buy-record  .producted-body .producted-item{
    height: 88px;
    line-height: 88px;
    width: 100%;
    display: flex;
    padding: 0 30px;
    box-sizing: border-box;
    text-align: left;
    justify-content: space-between;
  }
  .buy-record  .producted-body .empty{
     color: #999999;
     padding: 40px ;
     text-align: center;
  }
  .buy-record .buy-content{
    width: 100%;
  }

  .buy-record  .producted-body .producted-item .price{
    padding:0 30px;
    width: 100px;
  }
  .buy-record  .producted-body .producted-item .account{
    margin-top: 24px;
  }

  .buy-record .producted-content .producted-foot{
    display: flex;
    justify-content: space-between;
    padding: 20px 50px;
    background: #F8F8F8;
    height: 98px;
    line-height: 58px;
    box-sizing: border-box;
  }
  .buy-record .producted-content .producted-foot .totals{
    color: #333333;
    padding: 0 50px 0 0;
    display: inline-block;
  }
  .buy-record .producted-foot .buy-button{
    background: $redColor;
    color: #fff;
    border-radius: 30px;
    height: 58px;
    line-height: 58px;
    font-size: 14px;/*no*/
    width: 178px;
  }
  .buy-record .clear-buyCar{
    float:right;
  }
</style>
<script>
  import  accountJs from  'accounting-js'
  import Ces from '../components/ces/ces.js'
  export default ({
    data:function () {
      return {
        popupVisible:true,
        buyProductedVisible:false,
        count:0,
        technicianId:'',
        isActive:0,
        productNum:0,
        _tempBuyNum:0,
        productPriceTotal:0,
        menuArr:[],
        listArr:[],
        buyProductList:[],
        SDINo:'',
        ItemId:'',
        ItemTypeNo:'',
        baseUrl:'',


        counted:0,
        loading: false,
        allLoaded: false,
        topStatus: '',
        bottomStatus: '',
        listHeight:0,
        pageNumber: 1,
        pageSize: 10,
        empty:false,
        numActive:false,
        Keyword:'',
        historyInfo:{}
      }
    },
    computed:{
      totals:function () {
        this.productNum = 0;
        for(let i =0; i<this.listArr.length;i++){
          let isExist = false;
          if(this.listArr[i].count>0){
            if(this.buyProductList.length >0){
              for(let j=0;j<this.buyProductList.length;j++){
                if(this.listArr[i].ItemID ===  this.buyProductList[j].ItemID){
                  this.buyProductList.splice(j,1,this.listArr[i]);
                  isExist =true;
                  break;
                }
              }
              if(!isExist){
                this.buyProductList.push(this.listArr[i]);
              }
            }else{
              this.buyProductList.push(this.listArr[i]);
            }
          }
        }
        for(let i =0; i<this.buyProductList.length;i++){
          console.log(this.buyProductList[i].count,this.buyProductList[i])
          if(this.buyProductList[i]){
            if(this.buyProductList[i].count<=0){
              this.buyProductList.splice(i,1);
          }else{
              this.productNum = this.productNum  + this.buyProductList[i].count;
              console.log(this.productNum, this.buyProductList[i].count )
              console.log('-----this.productNum----',this.productNum )
            }
          }
        }
        this._tempBuyNum = this.productNum;
        return this.productNum
      },
      totalPrice:function () {
        this.productPriceTotal=0;
        if(this.buyProductList.length<=0){
          this.productPriceTotal = 0;
           return false;
        }
        for(let i = 0 ;i< this.buyProductList.length; i++ ){
          this.productPriceTotal = this.productPriceTotal + (this.buyProductList[i].UnitPrice * this.buyProductList[i].count);
        }

        return this.productPriceTotal;
      }
    },
    filters:{
      fmtMoney:function (item) {
        return accountJs.formatMoney(item,{ symbol: "",  format: "%s %v" });
      }
    },
    methods:{
      backPage:function () {
        let LoginData = this.$api.getLocalData('loginData');
        if(LoginData.AuthType === 1){
          this.$router.push({'path':'/manageTech',query:this.historyInfo})
        }else{
          this.$router.push({'path':'/technicianIndex',query:this.historyInfo})
        }
      },
      qrCode:function () {
        console.log('qrCode-----')
        if(Ces.Config.plugin){
          Ces.Plugins.Scan.call(this.getQrCode)
        }else{
          console.log('web测试未调用插件')
        }
      },
      getQrCode:function (rets) {
        console.log('getQrCode----',rets)
        let ts = this;
        let LoginData = ts.$api.getLocalData('loginData');
        let secreParams = ts.SecreUtil.getParams(LoginData.PmsID,LoginData.UserId);
        if(rets.status === 1){
            console.log(rets.data.url)
          let params = {
            "SDIId": rets.data.url,
            "PmsID":LoginData.PmsID,
            "CustomerNo": LoginData.CustomerNo,
            "UserId": LoginData.UserID,
            "Signature": secreParams.signature,
            "Timestamp": secreParams.timestamp,
            "IgnoreSignature": secreParams.ignoreSignatrue
          }
          ts.$api.post('GetSDINoByID',params).then(function(rets){
                console.log('GetSDINoByID',rets)
            if(rets.code === 0){
                  ts.SDINo = rets.data;
            }else{
              ts.$mint.MessageBox.alert(rets.message)
            }
          })
        }else{
          ts.$mint.Toast({
            position:'center',
            message:rets.message
          })
          t
        }
      },
      subInfo:function () {
        let  _ths  = this;
        _ths.$forceUpdate();
        if(_ths.SDINo){

          let LoginData = _ths.$api.getLocalData('loginData');
          let secreParams = _ths.SecreUtil.getParams(LoginData.PmsID,LoginData.UserId);
          let validParams = {
            "SDINo": _ths.SDINo,
            "Shift": LoginData.Shift,
            "PmsID": LoginData.PmsID,
            "CustomerNo": LoginData.CustomerNo,
            "UserId": LoginData.UserID,
            "Signature": secreParams.signature,
            "Timestamp": secreParams.timestamp,
            "IgnoreSignature": secreParams.ignoreSignatrue
          }
          _ths.$api.post('IsValidSDI',validParams).then(function (rets) {
            if(rets.code === 0){
              _ths.popupVisible = false;
            }else{
              _ths.$mint.MessageBox.alert(rets.message)
            }
          });



        }else{
          console.log("----------SDINo");
          _ths.$mint.MessageBox.alert('客户手牌不能为空')
        }
      },
      subtractCount:function (count,idx,flag) {
        console.log('subtractCount---count',count)
        let temp=[];
        if(flag === 1){
          temp=this.listArr[idx];
          if(temp.count > 0){
            temp.count = temp.count - 1;
            this.listArr.splice(idx,1,temp);
          }
        }
        if(flag === 2){
          temp=this.buyProductList[idx];
          if(temp.count > 0){
            temp.count = temp.count - 1;
            this.buyProductList.splice(idx,1,temp);
          }
        }


      },
      addCount:function (count,idx,flag){
        console.log('addCount---',count)
          let temp=[];
          if(flag === 1){
            temp=this.listArr[idx]
            temp.count = temp.count + 1;
            this.listArr.splice(idx,1,temp);
          }
          console.log(this.listArr[idx])
          if( flag === 2){
            temp=this.buyProductList[idx]
            temp = temp.count + 1;
            this.buyProductList.splice(idx,1,temp);
          }
      },

      clickActive:function (item,idx) {
        console.log(item,idx);
        this.isActive = idx;
        this.ItemTypeNo = item.Code;
        this.loadData('refresh');
      },
      subProduct:function () {
        if(this.productNum > 0){
          this.buyProductedVisible= true;
        }else{
          this.$mint.MessageBox.alert('请选择需要购买的商品')
        }
      },
      buy:function () {
        console.log("---buy 选好了",this.buyProductList)
        let ts = this;

        let LoginData = ts.$api.getLocalData('loginData');
        let secreParams = ts.SecreUtil.getParams(LoginData.PmsID,LoginData.UserId);
        let itemsArr=[];
        for(let i=0; i< ts.buyProductList.length;i++){
          let obj = {};
              obj.ItemID = ts.buyProductList[i].ItemID;
              obj.ItemNo =  ts.buyProductList[i].ItemNo;
              obj.ItemName =  ts.buyProductList[i].ItemName;
              obj.ItemCount =  ts.buyProductList[i].count;
              itemsArr.push(obj);
        }
        console.log(LoginData)
        let params={
          "SDINo": ts.SDINo,
          "Items":itemsArr,
          "From": 6,
          "Shift": LoginData.Shift,
          "PmsID": LoginData.PmsID,
          "CustomerNo": LoginData.CustomerNo,
          "UserId": LoginData.UserID,
          "Signature": secreParams.signature,
          "Timestamp": secreParams.timestamp,
          "IgnoreSignature": secreParams.ignoreSignatrue
        }
        console.log('buy params---',JSON.stringify(params))
        ts.$api.post('SubmitItem',params).then(function (rets) {
          console.log('SubmitItem---',rets);
          if(rets.code ===0){
            ts.$mint.Toast({
              position:'center',
              message:'商品已购买成功'
            });
            ts.buyProductedVisible =false;
            for(let i=0;i< ts.listArr.length;i++){
              ts.listArr[i].count=0;
            }

            if(LoginData.AuthType === 1){
              ts.$router.push('/manage')
            }else{
              ts.$router.push('/technicianIndex')
            }
          }else{
            ts.$mint.Toast({
              position:'center',
              message:rets.message
            })
          }

        })
      },
      getProductType:function () {
        let ths = this;
        let LoginData = ths.$api.getLocalData('loginData');
        let secreParams = ths.SecreUtil.getParams(LoginData.PmsID,LoginData.UserId);
        let params = {
          "PmsID": LoginData.PmsID,
          "CustomerNo":  LoginData.CustomerNo,
          "UserId": LoginData.UserID,
          "Signature":secreParams.signature,
          "Timestamp": secreParams.timestamp,
          "IgnoreSignatrue": secreParams.ignoreSignatrue
        }
        console.log(JSON.stringify(params))
        ths.$api.post('GetConsumeItemType',params).then(function (rets) {
          console.log('rets-----',rets)
          if(rets.code === 0){
            ths.menuArr = rets.data;
            ths.ItemTypeNo = ths.menuArr[0].Code;
            //ths.getProductList(ths.menuArr[0].Code)
            ths.loadData('refresh')
          }else{
            ths.$mint.Toast({
              message:rets.message,
              position:'center'
            })
          }
        })
      },
      loadData:function (action,id,loading) {
        let ts = this;

        if ('refresh' === action) {
          ts.listArr = [];
          ts.pageNumber = 1;
          ts.allLoaded=false;
        }
        let LoginData = ts.$api.getLocalData('loginData');
        let secreParams = ts.SecreUtil.getParams(LoginData.PmsID,LoginData.UserId);
        let params ={
          "ItemTypeNo": ts.ItemTypeNo,
          "ItemId": ts.ItemId,
          "Keyword": ts.Keyword,
          "PageIndex": ts.pageNumber,
          "PageSize": ts.pageSize,
          "PmsID": LoginData.PmsID,
          "CustomerNo": LoginData.CustomerNo,
          "UserId":  LoginData.UserID,
          "Signature": secreParams.signature,
          "Timestamp": secreParams.timestamp,
          "IgnoreSignature": secreParams.ignoreSignatrue
        }

        console.log(JSON.stringify(params))
        ts.$api.post('GetConsumeItems', params).then(function (rets) {
          console.log('rets----',rets);
          let data = rets.data.data;
          if (data && data.length > 0) {
            for(let i=0; i< data.length;i++){
              data[i].count = 0;
              for(let j=0; j< ts.buyProductList.length;j++){
                if(data[i].ItemID === ts.buyProductList[j].ItemID){
                  data.splice(i,1,ts.buyProductList[j]);
                }
              }
            }

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
        },loading);
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
          _this.loadData('load', id, false);
          _this.$refs.loadmore.onBottomLoaded(id);
        },200);
      },
      clearBuyCar:function () {
        this.buyProductList =[];
        this.productNum = 0;
        for(let i=0;i<this.listArr.length;i++){
          let temp= this.listArr[i];
          temp.count=0;
          this.listArr.splice(i,1,temp);
        }
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
      search:function () {
        this.loadData('refresh');
      },
    },
    created:function(){
     // Object.assign(this.$data, this.$options.data());
      this.getProductType();
      console.log('this.data---',this.data)
      this.historyInfo = this.$route.query;

      this.baseUrl = Ces.baseAddress;
      //this.baseUrl = JSON.parse(localStorage.getItem("url"));
      this.listHeight = document.body.clientHeight - 170 * window.dpr;
    }
  })
</script>
