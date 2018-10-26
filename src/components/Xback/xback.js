
const XBack = {};
(function(XBack) {
  XBack.STATE = 'x - back';
  XBack.element;
  XBack.onPopState = function(event) {
    console.log('1111---',XBack.STATE)
    event.state === XBack.STATE && XBack.fire();
    XBack.record(XBack.STATE); //初始化事件时，push一下
  };

  XBack.record = function(state) {
    console.log('2222---',state);
    console.log('location.href---',location.href);
    history.pushState(state, null, location.href);
    XBack.element.addEventListener(XBack.STATE,  XBack.listener, false);
  };

  XBack.fire = function() {
    let event = document.createEvent('Events');
    event.initEvent(XBack.STATE, false, false);
    XBack.element.dispatchEvent(event);
    console.log('3333---',XBack.STATE)

  };

  XBack.listen = function(listener) {
    XBack.listener = listener;
    console.log('XBack.STATE---',XBack.STATE);
    console.log('4444---',listener);
    XBack.element.addEventListener(XBack.STATE, listener, false);
  };

  XBack.init = function() {
    console.log('5555---',XBack.STATE);
    XBack.element = document.createElement('span');
    window.addEventListener('popstate', XBack.onPopState);
    //XBack.listen=XBack.listen;
    XBack.record(XBack.STATE);
  };
})(XBack);

XBack.init();

export default XBack;
