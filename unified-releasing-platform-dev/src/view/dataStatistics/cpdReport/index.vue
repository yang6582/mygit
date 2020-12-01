<template>
  <div class="layout-search">
    <Tabs>
      <Tab-pane label="OPPO-CPD" name="OPPO" v-if="showAccess('数据统计_CPD明细数据报表_OPPO-CPD查询页面')">
        <OPPOCPD></OPPOCPD>
      </Tab-pane>
      <Tab-pane label="VIVO-CPD" name="VIVO" v-if="showAccess('数据统计_CPD明细数据报表_VIVO-CPD查询页面')">
        <VIVOCPD></VIVOCPD>
      </Tab-pane>
    </Tabs>
  </div>
</template>

<script>
  import hasShowAccess from "@/libs/hasShowAccess.js";
  export default {
    name: "cpdReport",
    components: {
      OPPOCPD: () => import("./oppoCpd"),
      VIVOCPD: () => import("./vivoCpd"),
    },
    data() {
      return {
      }
    },
    computed: {
      showAccess() {
          return el => {
              return hasShowAccess(el);
          };
      },
    },
    methods: {
    }
  }
</script>

<style scoped lang="less">

</style>
