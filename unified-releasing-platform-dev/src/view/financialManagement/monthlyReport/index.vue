<template>
  <div class="layout-search">
    <Tabs style="overflow:visible">
      <Tab-pane label="CPC月度客户报表" name="cpc" v-if="showAccess('财务管理_月度客户报表_CPC月度客户报表页面')">
        <CPCReport></CPCReport>
      </Tab-pane>
      <Tab-pane label="包月月度客户报表" name="month" v-if="showAccess('财务管理_月度客户报表_包月月度客户报表页面')">
        <monthReport></monthReport>
      </Tab-pane>
    </Tabs>
  </div>
</template>

<script>
  import hasShowAccess from "@/libs/hasShowAccess.js";
  export default {
    name: "monthlyReport",
    components: {
      CPCReport: () => import("./cpcMonth"),
      monthReport: () => import("./monthReport"),
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
