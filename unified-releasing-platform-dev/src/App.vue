<template>
  <div id="app">
    <router-view />
     <Modal v-model="permissionModal" title="提示" :mask-closable="false" transfer :closable="false">
        <div style="text-align:center;font-size:14px;">
            <p>无相关权限,请刷新页面或联系管理员</p>
            <!-- <p>Will you delete it?</p> -->
        </div>
        <div slot="footer">
            <Button @click="toHome">返回首页</Button>
            <Button type="primary" @click="toReload">确定</Button>
        </div>
    </Modal>
  </div>
</template>

<script>

export default {
  name: "App",
  data(){
    return {
      permissionModal:false
    }
  },
  methods:{
    toHome(){
      this.$store.commit('closePermissionModal');
      this.$router.push({name: "home"})
    },
    toReload(){
      this.$store.commit('closePermissionModal');
      this.$router.go(-1)
    }
  },
  created() {
    localStorage.tagNaveList = JSON.stringify([
      {
        meta: {
          hideInMenu: true,
          title: "首页",
          notCache: true,
          icon: "md-home"
        },
        name: "home",
        params: {},
        path: "/home",
        query: {}
      }
    ]);
  },
  watch:{
    "$store.state.app.permissionModal"(newVal,oldVal){
      this.permissionModal = newVal;
    }
  }
};
</script>

<style lang="less">
.size {
  width: 100%;
  height: 100%;
}
html,
body {
  .size;
  overflow: hidden;
  margin: 0;
  padding: 0;
}
#app {
  .size;
}
</style>
