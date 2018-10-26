<template>
  <div class="manage-tech-detail">
    <Header :text="title" :handle="true"  @back="backPage" ></Header>
    <div class="info">
      <div class="techInfo">
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
            <td>{{techInfo.SDINo || '-'}}</td>
            <td>{{techInfo.ItemName || '-'}} </td>
            <td>{{techInfo.ServiceClocks ||'-'}}</td>
            <td>{{techInfo.ServiceTypeName ||'-'}}</td>
            <td>{{techInfo.RoomNo ||'-' }}</td>
            <td :class="techInfo.ServiceStatus === 2 || techInfo.ServiceStatus === 3 ? 'markedness':''">{{techInfo.ServiceStatusName}}</td>
          </tr>
        </table>
        <div class="normal_cell" v-show="techInfo.ServiceStatus !== 2">上钟时间:<span>{{techInfo.OnServiceTime}}</span></div>
        <div class="normal_cell" v-show="techInfo.ServiceStatus !== 2 && techInfo.ServiceStatus !== 3">下钟时间:<span>{{techInfo.OffServiceTime}}</span></div>
        <div class="normal_cell" v-show="techInfo.ServiceStatus !== 4 && techInfo.ServiceStatus !== 3">安排时间:<span>{{techInfo.AssignEditTime}}</span></div>
        <div class="normal_cell" v-show="techInfo.ServiceStatus === 3">技师:<span>{{techInfo.TechnicianNo}}</span></div>
        <div class="normal_cell" v-show="techInfo.ServiceStatus !== 3">安排人员:<span>{{techInfo.AssignEditName}}</span></div>
        <div class="normal_cell">钟长时数:<span>{{techInfo.PlanServiceMinu}}</span></div>
        <div class="tech-operation">
          <div class="item_button" v-if="techInfo.ServiceStatus == 2 " @click="toOperationPage(techInfo,1)">上钟</div>
          <div class="item_button" v-if="techInfo.ServiceStatus == 3 " @click="toOperationPage(techInfo,2)">加钟</div>
          <div class="item_button" v-if="techInfo.ServiceStatus == 3 " @click="toOperationPage(techInfo,3)">下钟</div>
          <div class="item_button" v-if="techInfo.ServiceStatus != 4 " @click="toOperationPage(techInfo,4)">修改</div>
          <div class="item_button" v-if="techInfo.ServiceStatus == 2 " @click="toOperationPage(techInfo,5)">撤单</div>
          <div class="item_button" v-if="techInfo.ServiceStatus == 3 " @click="toOperationPage(techInfo,6)">退钟</div>
          <div class="item_button" v-if="techInfo.ServiceStatus != 4 " @click="toOperationPage(techInfo,7)">换技师</div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss">
  @import "../styles/style";
  .manage-tech-detail{
    .techInfo {
      margin: 20px 30px 0;
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
</style>
<script>
  export default ({
    data:function () {
      return {
        title:'',
        techInfo:{},
        isShow:false
      }
    },
    methods:{
      backPage:function () {
        this.$router.push({'path':'/manageTech',query:this.techInfo})
      },
      toOperationPage(item,flag){
        switch (flag){
          case 1://上钟
            this.$router.push({path:'/startClockTech',query:item})
            break;
          case 2://加钟
            this.$router.push({'path':'/addClockTech',query:item});
            break;
          case 3://下钟
            this.$router.push({'path':'/closeClock',query:item});
            break;
          case 4://修改
            this.$router.push({'path':'/changeInfo',query:item});
            break;
          case 5://撤单
            this.$router.push({'path':'/backoutOrder',query:item});
            break;
          case 6://退钟
            this.$router.push({'path':'/retreatRoom',query:item});
            break;
          case 7 ://换技师
            this.$router.push({'path':'/changeTechnician',query:item});
            break;
        }
      }
    },
    created:function(){
      this.$forceUpdate();
      this.techInfo = this.$route.query;
      this.title =this.techInfo.TechnicianNo +"技师信息";
      console.log("---techInfo",this.techInfo )
    }
  })
</script>
