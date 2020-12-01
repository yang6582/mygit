<template>
  <div class="layout-search">
    <Tabs>
      <Tab-pane label="制单" name="refundOpt" v-if="showAccess('财务管理_充值_制单页面')">
        <RefundOpt></RefundOpt>
      </Tab-pane>
      <Tab-pane label="审批" name="approve" v-if="showAccess('财务管理_充值_审批页面')">
        <Approve></Approve>
      </Tab-pane>
      <Tab-pane label="流水查询" name="tradingInquiry" v-if="showAccess('财务管理_充值_流水查询页面')">
        <TradingInquiry></TradingInquiry>
      </Tab-pane>
    </Tabs>
  </div>
</template>
<script>
  import hasShowAccess from "@/libs/hasShowAccess";

  export default {
    name: "recharge",
    components: {
      RefundOpt: () => import("./components/refundOpt"),
      Approve: () => import("./components/approve"),
      TradingInquiry: ()=> import("./components/tradingInquiry"),
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
/deep/ .ivu-tabs-bar {
  font-weight:bold
}
</style>
