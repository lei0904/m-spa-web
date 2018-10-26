import JSBridge from '../core/ces.jsbridge.js';

let GetToken = (function () {

  return {
    get: function (callback) {
      JSBridge.callHandler('devicetoken', [], function (rets) {
        callback && callback(rets);
      });
    }
  }
})();

export default GetToken;
