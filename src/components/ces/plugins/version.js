import JSBridge from '../core/ces.jsbridge.js';

let Version = (function () {

  return {
    read: function (callback) {
      JSBridge.callHandler('version', [], function (rets) {
        callback && callback(rets);
      });
    }
  }
})();

export default Version;
