
import Vue from 'vue'
import axios from 'axios'
import Qs from 'qs'
import Ces from '../components/ces/ces.js'
// import Mint from 'mint-ui'

const service = axios.create({
  timeout: 5000 // 超时时间
})
function api (method, url, params, loading) {
  if (params) {
    let qs = Qs.stringify(params);
    if (method === 'GET') {
      if (url.indexOf('?') > -1) {
        url = url + '&' + qs
      } else {
        url = url + '?' + qs
      }
    }
  }

  return new Promise(function (resolve) {
    return service({
      _loading: loading,
      method: method,
      url: url,
      data: method === 'POST' || method === 'PUT' ? params : null,//Qs.stringify(params) : null,
      baseURL: Ces.root,
      withCredentials: false,
      headers: {
       // 'Content-Type': 'application/x-www-form-urlencoded'
         'Content-Type': 'application/json'
      }
    }).then(function (response) {
      resolve(response.data)
    }).catch(function(error){
      console.log(error)
      if(error){
        Vue.$toast({
          message: '网络请求失败'
        });
        Vue['$indicator'].close();
      }
    })
  });
}

service.interceptors.request.use(function (config) {
  let loading = config['_loading'];
  if (loading) {
    if (typeof loading === 'object') {
      Vue['$indicator'].open(loading.tip)
    } else {
      Vue['$indicator'].open('加载中...')
    }
  }
  return config
});

service.interceptors.response.use(function (response) {
  let config = response.config;
  let _tempUrl = response.config.url;
  let urlLen = _tempUrl.lastIndexOf("\/")+1;
  let requestUrl =_tempUrl.substr(urlLen);

  if(requestUrl === 'GetShift'){

  }

  let loading = config['_loading'];
  if (loading) {
    Vue['$indicator'].close()
  }
  return response
});



export default {
  get: function (url, params, loading) {
    return api('GET', url, params, typeof loading === 'undefined' ? true : loading)
  },
  post: function (url, params, loading) {
    return api('POST', url, params, typeof loading === 'undefined' ? true : loading)
  },
  put: function (url, params, loading) {
    return api('PUT', url, params, typeof loading === 'undefined' ? true : loading)
  },
  delete: function (url, params, loading) {
    return api('DELETE', url, params, typeof loading === 'undefined' ? true : loading)
  },
  setLocalData:function (key,value) {
    value = encodeURIComponent(JSON.stringify(value))
    localStorage.setItem(key,value);
  },
  getLocalData:function (key) {
     let value = JSON.parse(decodeURIComponent(localStorage.getItem(key)));
    return value;
  }
}
