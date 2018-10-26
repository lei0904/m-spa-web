/**
 * Created by lei on 2017/3/13.
 */
import JSBridge from '../core/ces.jsbridge.js';
import Ces from '../ces.js'
let RabbitMq = (function () {
  let _registerRabbitMq = function () {
    JSBridge.registerHandler('rabbitMq',function (rets) {
      let loginData = JSON.parse(decodeURIComponent(localStorage.getItem('loginData')));
      let data =JSON.parse(rets.data);
          data["readStatus"]=0;// 0 未读 1 已读
          let _tempData ={};
          Object.assign(_tempData,data);

        let msgKey = '';
        if(loginData.AuthType === 1){
           msgKey = '_msg_'+loginData.UserID;
        }else{
          msgKey = '_msg_'+loginData.TechnicianNo;
        }
        let msgArr=[];
        debugger
        Ces.Plugins.EasyCache.getCache(msgKey,function (rets) {
          let _tempArr=[];
          if(rets.status !==0){
            msgArr = JSON.parse(rets.data);
            console.log('rets.data',_tempData)
            _tempArr.push(_tempData);
            for(let i=0; i<msgArr.length;i++){
              _tempArr.push(msgArr[i])
            }
            Ces.Plugins.EasyCache.saveCache(msgKey,_tempArr,function (res) {
              if(res.status !==0){

              }
            })
          }else{
            _tempArr.push(_tempData);
            Ces.Plugins.EasyCache.saveCache(msgKey,_tempArr,function (res) {
              if(res.status !==0){

              }
            })
          }
        })
    });
  };

  let _callRabbitMq = function () {
    let  ts =  this;
    let LoginData = ts.$api.getLocalData('loginData');
    let secreParams = ts.SecreUtil.getParams(LoginData.PmsID,LoginData.UserID);
    let params ={
      "PmsID": LoginData.PmsID,
      "CustomerNo":LoginData.CustomerNo ,
      "UserId": LoginData.UserID,
      "Signature":secreParams.signature ,
      "Timestamp": secreParams.timestamp,
      "IgnoreSignature": secreParams.ignoreSignatrue
    };
    ts.$api.post('GetMQSetting',params).then(function (rets) {
      if(rets.code === 0){
        console.log(JSON.stringify(rets.data));
        let setData = rets.data;
        let setParams = [
          setData.HostName,
          '5672',
          setData.UserName,
          setData.Password,
          "direct.spa."+LoginData.PmsID,
          "techapp."+ (LoginData.AuthType === 1 ? LoginData.UserID : LoginData.TechnicianID),
          "queue."+LoginData.PmsID+".techapp."+(LoginData.AuthType === 1 ? LoginData.UserID : LoginData.TechnicianID),
          setData.VirtualHost,
        ]
        console.log("-------------setParams--------",setParams);
        JSBridge.callHandler('rabbitMq',setParams,function(rets){
          console.log(rets);
        })
      }else{
        ts.$mint.Toast({
          position:'center',
          message:rets.message
        })
      }
    });
  }

  return {
    name: "Ces.Plugins.rabbitMq",
    registerRabbitMq: _registerRabbitMq,
    callRabbitMq:_callRabbitMq
  }
})();

export  default RabbitMq;
