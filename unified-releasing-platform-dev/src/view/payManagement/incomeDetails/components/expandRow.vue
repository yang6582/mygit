<template>
  <div>
    <Table
      border
      :columns="columns"
      :data="row.collectionMessages"
      align="center"
      key="tableData"
    >
      <template slot-scope="{row}" slot="returnProof">
        <Tooltip placement="top" transfer>
          <div
            slot="content"
            style="width: 220px; white-space: normal;word-break: break-all;"
          >{{row.returnProof}}</div>
          <viewer :images="imgUrlComputed(row.returnProof)">
            <img
              v-for="(src,index) in imgUrlComputed(row.returnProof)"
              :src="src"
              :key="index"
              style="max-width:40px;margin:10px 0 5px;cursor:pointer;"
            />
          </viewer>
        </Tooltip>
      </template>
       <template slot-scope="{row}" slot="entryDate">
        <span v-if="row.entryDate">{{row.entryDate | formatDate2}}</span>
        <span v-else></span>
      </template>
      <template slot-scope="{row}" slot="updateTime">
        <span v-if="row.updateTime">{{row.updateTime | formatDate}}</span>
        <span v-else></span>
      </template>
    </Table>
  </div>
</template>
<script>
import moment from "moment";
moment.locale("zh-cn");

export default {
  props: {
    row: Object
  },
  data() {
    return {
      columns: [
        {
          title: "回款金额",
          align: "center",
          key: "amount"
        },
        {
          title: "回款日期",
          align: "center",
          key: "entryDate",
          slot: "entryDate"
        },
        // {
        //   title: "回款凭证",
        //   align: "center",
        //   slot: "returnProof"
        // },
        {
          title: "备注",
          align: "center",
          key: "remark"
        },
        {
          title: "操作人",
          align: "center",
          key: "user"
        },
        // {
        //   title: "更新时间",
        //   align: "center",
        //   slot: "updateTime"
        // }
      ]
    };
  },
  computed: {
    imgUrlComputed() {
      return url => {
        if (!url) {
          return [];
        } else {
          let arr = [url];
          return arr;
        }
      };
    }
  },
  filters: {
    formatDate(value) {
      return moment(value).format("YYYY-MM-DD HH:mm:ss");
    },
    formatDate2(value) {
      return moment(value).format("YYYY-MM-DD");
    }
  }
};
</script>