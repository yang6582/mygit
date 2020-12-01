<template>
  <div>
    <Tabs>
        <TabPane label="在线表" v-if="showAccess('数据统计_包月计费表_在线表页面')"><onlineForm></onlineForm></TabPane>
        <TabPane label="在线记录表" v-if="showAccess('数据统计_包月计费表_在线记录表页面')"><onlineRecordForm></onlineRecordForm></TabPane>
        <TabPane label="月度计费明细表" v-if="showAccess('数据统计_包月计费表_月度计费明细表页面')"><monthDetailForm></monthDetailForm></TabPane>
    </Tabs>
  </div>
</template>
<script>
import axios from "@/libs/api.request";
import { datefmt } from "@/utils/dateFormat";
import moment from "moment";
import hasShowAccess from "@/libs/hasShowAccess.js";
moment.locale("zh-cn");
export default {
  name: "monthBilling",
  components: {
    'onlineForm':()=>import('./components/onlineForm'),
    'onlineRecordForm':()=>import('./components/onlineRecordForm'),
    'monthDetailForm':()=>import('./components/monthDetailForm')
  },
  data() {
    return {
     
    };
  },
  computed: {
  showAccess() {
      return el => {
        return hasShowAccess(el);
      };
    }
  },
  filters: {
    
  },
  mounted() {
  },
  methods: {
  }
};
</script>
<style scoped lang="less">

</style>

