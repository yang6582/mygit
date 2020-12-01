<template>
  <div>
    <Table border :columns="columns" :data="row.collectionMessages" align="center" key="tableData">
      <template slot-scope="{ row }" slot="costTotal">
          <span>{{numberFormat(row.costTotal)}}</span>
        </template>
        <template slot-scope="{ row }" slot="benefitTotal">
          <span>{{numberFormat(row.benefitTotal)}}</span>
        </template>
        <template slot-scope="{ row }" slot="realTotal">
          <span>{{numberFormat(row.realTotal)}}</span>
        </template>
        <template slot-scope="{ row }" slot="collectionTotal">
          <span>{{numberFormat(row.collectionTotal)}}</span>
        </template>
        <template slot-scope="{ row }" slot="debtTotal">
          <span>{{numberFormat(row.debtTotal)}}</span>
        </template>
    </Table>
  </div>
</template>
<script>
import moment from "moment";
import config from "../config";
import numberFormat from '@/utils/numberFormat'
moment.locale("zh-cn");

export default {
  props: {
    row: Object
  },
  data() {
    return {
      columns: config.productDimension
    };
  },
  watch: {
      'row.collectionMessages': (newValue, oldValue) => {
         debugger 
      }
  },
  computed: {
  },
  filters: {
    formatDate(value) {
      return moment(value).format("YYYY-MM-DD HH:mm:ss");
    },
    formatDate2(value) {
      return moment(value).format("YYYY-MM-DD");
    }
  },
  methods: {
      numberFormat: numberFormat.milliFormat
  },
};
</script>