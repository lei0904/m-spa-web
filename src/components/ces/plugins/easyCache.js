import JSBridge from '../core/ces.jsbridge.js';
let EasyCache = (function () {

  let _saveCache = function (key,params,callback) {
    JSBridge.callHandler('cache',[0,key,params], function (rets) {
      callback && callback(rets);
    });
  };
  let _getCache = function (key,callback) {
    JSBridge.callHandler('cache',[1,key], function (rets) {
      callback && callback(rets);
    });
  };
  let _deleteCache = function (key,callback) {
    JSBridge.callHandler('cache',[2,key], function (rets) {
      callback && callback(rets);
    });
  };
  return {
    saveCache: _saveCache,
    getCache:_getCache,
    delCache:_deleteCache
  }
})();

export  default EasyCache;
