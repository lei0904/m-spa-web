import Vue from 'vue'
import Https from './api/index'
const Constants ={
  ServiceStatus:[],//"技师任务上钟状态"
  ServiceType:[],//"上钟类型"
  OnlineStatus:[],//"技师上钟状态"
  WorkType:[],//"工作报到"
  RoomStatus:[],//"房间状态"
  ItemProperty:[],//"项目属性"
  Version:'1.0.0'  //版本号
};
//常量接口
!function () {
  Https.post('GetAppEnum',{}).then(function (rets) {
    if(rets.code === 0){
      let data = rets.data;
      for(let i=0; i<data.length;i++){
        switch (data[i].ParamCode){
          case "ServiceStatus":
            Object.assign(Constants.ServiceStatus,data[i].Match);
            break;
          case "ServiceType":
            Object.assign(Constants.ServiceType,data[i].Match);
            break;
          case "OnlineStatus":
            Object.assign(Constants.OnlineStatus,data[i].Match);
            break;
          case "WorkType":
            Object.assign(Constants.WorkType,data[i].Match);
            break;
          case "RoomStatus":
            Object.assign(Constants.RoomStatus,data[i].Match);
            break;
          case "ItemProperty":
            Object.assign(Constants.ItemProperty,data[i].Match);
            break;
        }
      }
      console.log(Constants)
      return Constants;
    }else{
      Vue.$toast({
        position:'bottom',
        message:'请求常量接口'
      })
    }
  });

}();
export default Constants;
