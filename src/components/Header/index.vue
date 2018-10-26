<template>
  <div class="header" :class="transparent ? 'transparent' : ''">
    <div class="transparent" v-if="transparent">
      <a href="#" @click.stop.prevent="listMenu" class="list-menu" v-if="menuable"></a>
      <a href="#" @click.stop.prevent="back" class="back" v-if="backable"></a>
      <slot v-if="show == 'slot'"></slot>
      <a href="#" @click.stop.prevent="action" class="action" v-if="actionable">{{explain}}</a>
    </div>
    <div v-else>
      <a href="#" @click.stop.prevent="listMenu" class="list-menu" v-if="menuable"></a>
      <a href="#" @click.stop.prevent="back" class="back" v-if="backable"></a>
      <span class="header-text" v-if="show == 'title'">{{text}}</span>
      <slot v-if="show == 'slot'"></slot>
      <a href="#" @click.stop.prevent="action" class="action" v-if="actionable">{{explain}}</a>

      <a href="#" @click.stop.prevent="refresh" class="refresh" v-if="refreshable">{{explain}}</a>
    </div>
  </div>
</template>
<script>

  export default {
    name: 'Header',
    props: {
      type: {
        type: String,
        'default': 'text'
      },
      placeholder: {
        type: String,
        'default': '搜索'
      },
      readonly: Boolean,
      disabled: Boolean,

      handle: {
        type: Boolean,
        'default': false
      },
      backable: {
        type: Boolean,
        'default': true
      },
      menuable:{
        type: Boolean,
        'default': false
      },
      actionable: {
        type: Boolean,
        'default': false
      },
      shareable: {
        type: Boolean,
        'default': false
      },
      refreshable: {
        type: Boolean,
        'default': false
      },
      text: {
        type: String,
        'default': '页面标题'
      },
      explain: {
        type: String,
        'default': ''
      },
      show: {
        type: String,
        'default': 'title' //title|search
      },
      transparent: {
        type: Boolean,
        'default': false
      },
      value: {},
    },
    data: function () {
      return {
        active: false,
        currentValue: this.value
      }
    },
    watch: {
      value(val) {
        this.currentValue = val;
      },

      currentValue(val) {
        this.$emit('input', val);
      }
    },
    methods: {
      back () {
        if (this.handle) {
          console.log('header this.handle',this.handle);
          this.$emit('back')
        } else {
          this.$router.back();
        }
      },
      listMenu(){
          console.log('header this.handle',this.handle);
          this.$emit('listMenu')
      },
      action () {
        this.$emit('action')
      },
      refresh () {
        this.$emit('refresh')
      },
      handleInput(evt) {
        this.currentValue = evt.target.value;
      },
      handleClear() {
        if (this.disabled || this.readonly) return;
        this.currentValue = '';
      }
    }
  }
</script>
<style lang="scss">

  @import '../../styles/style';

  #app .header.transparent + .container {
    top: 0 !important;
  }
  .header.transparent {
    background: transparent;
  }
  .header.transparent:after {
    display: none;
  }

  .header.transparent .back {
    background: url("../../assets/img/back.png") no-repeat center;
    background-size: 66px 66px;
  }
  .header {
    height: $headerPx;
    line-height: $headerPx;
    text-align: center;
    color: $pageTxtColor;
    font-size: $headerTextFontSize; /*no*/
    background: $headerBgColor;
    position: relative;
    z-index: 200;
  }
  .header:after {
    content: "  ";
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 1px;/*no*/
    background-color: #e0e0e0;
    /* 如果不用 background-color, 使用 border-top:1px solid #e0e0e0; */
    -webkit-transform: scaleY(.5);
    transform:scaleY(.5);
  }

  .header .back {
    display: block;
    width: 88px;
    height: 100%;
    background: url("../../assets/img/back.png") no-repeat center;
    background-size: 20px 34px;
    position: absolute;
    left: 0px;
    top: 0px;
  }
  .header .action,
  .header .share,
  .header .refresh {
    position: absolute;
    height: 100%;
    top: 0;
    right: 0;
    font-size: 15px; /*no*/
    color: #434343;
    padding-left: 34px;
    padding-right: 34px;
  }
 .header .action {
    background: url("../../../static/image/icon_msg.png") no-repeat center;
    background-size: 36px 38px;
    width: 102px;
    box-sizing: border-box;
    padding: 0;
  }
  .header  .list-menu{
    display: block;
    background: url("../../../static/image/icon-menu.png");
    background-size: 100% 100%;
    width: 42px;
    height: 36px;
    position: absolute;
    left: 40px;
    top: 30px;
  }
  /*   .header .refresh {
     background: url("../../../static/image/refresh.png") no-repeat center;
     background-size: 36px 38px;
     width: 102px;
     box-sizing: border-box;
     padding: 0;
   }*/
</style>
