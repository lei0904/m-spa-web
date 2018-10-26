// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import FastClick from 'fastclick'
FastClick.attach(document.body);

import Mint from 'mint-ui'
import 'mint-ui/lib/style.css'
Vue.use(Mint);
Vue.prototype.$mint = Mint;

import Vue from 'vue'

Vue.prototype.$vue = Vue;

import App from './App'
import router from './router'
import store from './store/index.js'


import Header from './components/Header/index'
Vue.component('Header', Header);

/*import AddressPicker from './components/AddressPicker/address-picker'
Vue.component('cui-address-picker', AddressPicker);*/
import AddressChild from './components/AddressPicker/address-child'
Vue.component('cui-address-child', AddressChild);

import  AttrPicker from './components/AttrPicker/index'
Vue.component('cui-attr-picker',AttrPicker)

import  CuiLoadmore from './components/LoadMore/loadMore'
Vue.component('cui-loadmore',CuiLoadmore)



import 'lib-flexible'

Vue.config.productionTip = false;

import Api from './api/index.js';
Vue.prototype.$api = Api;

import Ces from './components/ces/ces.js'
Vue.prototype.$ces = Ces;

import  SecreUtil from './components/ces/utils/secretUtil.js'
Vue.prototype.SecreUtil = SecreUtil;
/*

import  Constants from './Constants.js'
Vue.prototype.Constants = Constants;
*/

Ces.ready(function () {
  /* eslint-disable no-new */
  let app = new Vue({
    router,
    store,
    components: { App },
    template: '<App/>',
    mounted:function () {
      const ts = this;
      let backAble= false;
      let backPath = '';
      let _tempQuery ={};
      router.beforeEach(function (to,from,next) {
        backAble = from.meta.backAble;
        _tempQuery = from.query;

      if(localStorage.hasOwnProperty('loginData')){
        let loingData = ts.$api.getLocalData('loginData');
        if(loingData.AuthType === 1){
          backPath = from .meta.backPath
        }else{
          backPath = from.meta.techBackPath;
        }
      }
        next();
      });
      window.addEventListener("popstate",function(e){ //监听原生物理返回按键
          ts.$router.push({"path":backPath,query:_tempQuery});
      });

      window.addEventListener('resize', () => {//解决输入框被遮挡问题
        if (document.activeElement.tagName === 'INPUT'
          || document.activeElement.tagName === 'TEXTAREA') {
          //延迟出现是因为有些 Android 手机键盘出现的比较慢
          window.setTimeout(() => {
            document.activeElement.scrollIntoViewIfNeeded();
          }, 100);
        }
      });
      if(Ces.Config.plugin){
        Ces.Plugins.RabbitMq.registerRabbitMq.call(app);
      }
    }
  }).$mount('#app');

});

