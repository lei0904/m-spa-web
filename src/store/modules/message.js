
const  state ={
  MSG_DATA:{},
  LOGIN_DATA:{}
};

const getters={
  submit () {
    return state.submit
  },
  getMsg(){
    if(Object.hasOwnProperty('loginData')){
      state['LOGIN_DATA'] = JSON.parse(decodeURIComponent(localStorage.getItem('loginData')));
    }
  }
};
const  actions={

};

const mutations = {

};


export default {
  state,
  getters,
  actions,
  mutations
}
