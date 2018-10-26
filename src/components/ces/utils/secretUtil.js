import MD5 from 'md5';
let timestamp = '';
let IgnoreSignatrueFlag = true;
let createSecret ={
      creatTimestamp:function () {
         timestamp='';
         timestamp = new Date().getTime();
        return timestamp
      },
      getParams:function (pmsid,userid,secret) {
        let  signature = "";
             secret = secret||"shyd";
             userid = userid ||"";
             timestamp =  createSecret.creatTimestamp();
        if(pmsid){
          let key = "pmsid="+pmsid+"&secret="+secret+"& timestamp="+timestamp+"&userid="+userid;
          key = key.toLowerCase();
            signature = MD5(key).substring(0,20);
        }
        return {signature:signature,timestamp:timestamp,ignoreSignatrue:IgnoreSignatrueFlag};
      }
      /*,
      getSecret:function (userId,pmsId,debug) {
        debug = debug || true;
        let params = {
          UserId:userId,
          PmsId:pmsId,
          Timestamp:timestamp,
          Debug:debug
        };
      }*/

};
export default createSecret;
