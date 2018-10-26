<template>
  <div class="config">
    <Header :text="'配置地址'" :handle="true"  @back="backPage" ></Header>
    <mt-field label="门店编号" placeholder="请输入门店编号" v-model="form.PmsId"></mt-field>
    <mt-field label="地址" placeholder="请输入地址" v-model="form.address"></mt-field>
    <div class="mt-btn-group">
      <mt-button size="large" class="sub-btn" @click.native="commitConfig">提交</mt-button>
    </div>
  </div>
</template>
<style lang="scss">
  @import "../styles/style";
  .config {
    .mt-btn-group{
      margin: 40px 30px;
      .sub-btn{
        color: #fff;
        background: $redColor;
      }
    }
  }
</style>
<script>
  import Ces from  '../components/ces/ces'
  export default ({
    data:function () {
      return {
        form:{
          address:'',
          PmsId:''
        }
      }
    },
    methods:{
      backPage:function () {
        this.$router.push('/');
      },
      commitConfig:function () {
        let ts = this;
        if(!ts.form.address){
          ts.$mint.Toast({
            message:'请输入地址',
            position:'center'
          })
          return false;
        }
        if(!ts.form.PmsId){
          ts.$mint.Toast({
            message:'请输入门店号',
            position:'center'
          })
          return false;
        }
        ts.$mint.MessageBox.confirm('确认修改配置地址?').then(function(){
          ts.form.address = ts.form.address.trim();
          ts.form.PmsId = ts.form.PmsId.trim();
          if(Ces.Config.plugin){
            Ces.Plugins.EasyCache.saveCache('_tempUrl',ts.form,function (rets) {
              if(rets.status !== 0){
                ts.$mint.MessageBox.alert('配置地址修改成功').then(function () {
                  ts.$router.push('/')
                })
              }else{
                ts.$mint.Toast({
                  message:rets.message,
                  position:'center'
                })
              }
            })
          }else{
            localStorage.setItem("_tempUrl",JSON.stringify(ts.form));
            ts.$mint.MessageBox.alert('配置地址修改成功').then(function () {
              ts.$router.push('/')
            })
          }

        });
      }
    },
    created:function () {

      let temp = {};
      let ts = this;
      if(Ces.Config.plugin){
        Ces.Plugins.EasyCache.getCache('_tempUrl',function (rets) {
          temp = JSON.parse(rets.data);
          if(rets.status !== 0){
            ts.form.address = temp.address;
            ts.form.PmsId = temp.PmsId;
          }else{
            ts.$mint.Toast({
              message:rets.message,
              position:'center'
            })
          }
        })
      }else{
        if(localStorage.hasOwnProperty("_tempUrl")){
          temp = JSON.parse(localStorage.getItem("_tempUrl"));
          ts.form.address = temp.address;
          ts.form.PmsId = temp.PmsId;
          console.log("url---",ts.form)
        }
      }
    }
  })
</script>
