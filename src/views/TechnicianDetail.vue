<template>
  <div class="technicianDetail">
    <Header :text="'详情'" :handle="true"  @back="backPage"  >
    </Header>
    <div class="main">
      <div class="mainBox">
        <div class="item">
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
              <td>{{detailData.SDINo || '-'}}</td>
              <td>{{detailData.ItemName || '-'}} </td>
              <td>{{detailData.ServiceClocks ||'-'}}</td>
              <td>{{detailData.ServiceTypeName ||'-'}}</td>
              <td>{{detailData.RoomNo ||'-' }}</td>
              <td :class="detailData.ServiceStatus === 2 || detailData.ServiceStatus === 3 ? 'markedness':''">{{detailData.ServiceStatusName}}</td>
            </tr>
          </table>
          <div class="normal_cell"  v-show="detailData.ServiceStatus !== 2">上钟时间:<span>{{detailData.OnServiceTime}}</span></div>
          <div class="normal_cell"  v-show="detailData.ServiceStatus !== 2 && detailData.ServiceStatus !== 3">下钟时间:<span>{{detailData.OffServiceTime}}</span></div>
          <div class="normal_cell" v-show="detailData.ServiceStatus !== 4 && detailData.ServiceStatus !== 3">安排时间:<span>{{detailData.AssignEditTime}}</span></div>
          <div class="normal_cell" v-show="detailData.ServiceStatus === 3">技师:<span>{{detailData.TechnicianNo}}</span></div>
          <div class="normal_cell" v-show="detailData.ServiceStatus !== 3">安排人员:<span>{{detailData.AssignEditName}}</span></div>
          <div class="normal_cell">钟长时数:<span>{{detailData.TechnicianOnTime}}</span></div>
          <div class="tech-operation" v-show="detailData.ServiceStatus === 2 || detailData.ServiceStatus === 3">
            <div class="item_button" v-show="detailData.ServiceStatus === 2" @click="onClock(detailData)">上钟</div>
            <div class="item_button" v-show="detailData.ServiceStatus === 3" @click="updateClock(detailData)">修改</div>
            <div class="item_button" v-show="detailData.ServiceStatus === 3" @click="addClock(detailData)">加钟</div>
            <div class="item_button" v-show="detailData.ServiceStatus === 3" @click="offClock(detailData)">下钟</div>
          </div>
        </div>
      </div>
    </div>
    <div class="copyright">Copyright ©2016-2018 上海逸达电子科技有限公司</div>

  </div>
</template>

<script>
  export default {
    data() {
      return {
        detailData:{}
      };
    },
    methods: {
      toMsg: function () {
        this.$router.push({'path': '/message'});
      },
      backPage:function () {
        this.$router.push('/technicianIndex')
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
      this.detailData =this.$route.query;
      console.log('detailData----',this.detailData )
    }

  }

</script>

<style lang="scss">
  @import "../styles/style";

  .technicianDetail {
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

    .main{
      margin-top: 20px;
      .mainBox{
        background: rgba(248,248,248,1);
        padding: 0 30px;
        width: 690px;
        height: 650px;
        overflow: scroll;
        .item{
          margin-top: 20px;
          width: 690px;
          height:464px;
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
          .normal_cell{
            width: 90%;
            margin: 0 5%;
            font-size: 24px;/*px*/
            margin-top: 32px;
            span{
              color:rgba(153,153,153,1);
              margin-left: 29px;
            }
          }
          .normal_cell:nth-last-child(2){
            padding-bottom: 20px;
           /* border-bottom: 1px solid rgba(248,248,248,1);!*no*!*/
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
    }
    .copyright{
      width:750px;
      text-align: center;
      height:85px;
      font-size:24px;/*px*/
      color:rgba(153,153,153,1);
      line-height:85px;
      position: fixed;
      bottom: 0;
    }
  }
</style>
