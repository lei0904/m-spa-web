let Plugins = (function () {
    return {
        module: 'Plugins'
    }
})();

import Http from './http.js';
import Camera from './camera.js';
import Cache from './cache.js';
import Scan from './scan.js';
import RabbitMq from './rabbitMq.js';
import ExitApp from './exitApp.js';
import GetToken from './GetToken.js';
import Version from './version.js';
import EasyCache from './easyCache.js'

Plugins.Http = Http;
Plugins.Camera = Camera;
Plugins.Cache = Cache;
Plugins.Scan = Scan;
Plugins.RabbitMq = RabbitMq;
Plugins.ExitApp = ExitApp;
Plugins.GetToken = GetToken;
Plugins.Version = Version;
Plugins.EasyCache = EasyCache;



export default Plugins;
