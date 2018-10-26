
import JSBridge from '../core/ces.jsbridge.js';

let ExitApp = (function () {

    let _exit = function () {
        JSBridge.callHandler('exitApp',[]);
    };
    return {
        name: "Ces.Plugins.ExitApp",
        exitApp: _exit
    }
})();

export  default ExitApp;
