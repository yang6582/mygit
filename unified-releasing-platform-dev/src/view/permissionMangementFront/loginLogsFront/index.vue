<template>
  <div>
    <Form
      :model="formItem"
      :label-width="100"
      :inline="true"
      style="margin-top: 20px"
      @submit.native.prevent
    >
      <FormItem label="登录人:">
        <Input v-model="formItem.userName" placeholder="登录人" @on-enter="searchData(true)" clearable/>
      </FormItem>
      <FormItem :label-width="30">
        <Button type="primary" @click="searchData(true)" style="margin-left:10px">查询</Button>
      </FormItem>
    </Form>
    <div class="layout-table">
      <Table
        border
        :columns="columnsSelection"
        :data="rowData"
        align="center"
        key="rowData"
        :loading="tableLoading"
      >
        <template slot-scope="{ row, index }" slot="createTime">
          <span>{{row.createTime | formatDate}}</span>
        </template>
        <template slot-scope="{ row, index }" slot="logType">
          <span>{{loginState(row.logType)}}</span>
        </template>
      </Table>
      <Page
        :total="total_count"
        size="small"
        :current="pageIndex"
        @on-change="pageChange"
        show-total
        show-elevator
        style="margin-top:10px;float:right"
      ></Page>
    </div>
  </div>
</template>

<script>
import axios from "@/libs/api.request";
import moment from "moment";
moment.locale("zh-cn");

export default {
  name: "loginLog",
  data() {
    return {
      tableLoading: false,
      formItem: {
        userName: "",
        logType: "-1",
        startTime: "",
        endTime: ""
      },
      columnsSelection: [
        {
          type: "index",
          width: 60,
          title: "序号",
          align: "center"
        },
        {
          title: "登录人",
          key: "userName",
          align: "center"
        },
        {
          title: "登录时间",
          key: "createTime",
          slot: "createTime",
          align: "center"
        },
        {
          title: "登录IP",
          key: "ip",
          align: "center"
        },
        {
          title: "登录状态",
          key: "logType",
          slot: "logType",
          align: "center"
        }
      ],
      rowData: [],
      pageSize: 10,
      pageIndex: 1,
      total_count: 0
    };
  },
  filters: {
    formatDate(value) {
      if (value) {
        return moment(value).format("YYYY-MM-DD HH:mm:ss");
      } else {
        return "";
      }
    }
  },
  computed: {
    loginState() {
      return state => {
        if (state == 1) {
          return "登录";
        } else {
          return "登出";
        }
      };
    }
  },
  methods: {
    searchData(isfirst) {
      this.tableLoading = true;
      if (isfirst) {
        this.pageIndex = 1;
      }
      let postData = {
        userName: this.formItem.userName,
        logType: this.formItem.logType,
        startTime: this.formItem.startTime,
        endTime: this.formItem.endTime,
        pageSize: this.pageSize,
        pageIndex: this.pageIndex - 1,
        sysType: 1
      };
      let _this = this;
      axios
        .request({
          url: "/sys/utils/integrate/logslogin",
          method: "post",
          data: postData
        })
        .then(d => {
          let dataArr = d.data.data;
          _this.rowData = dataArr.data;
          //console.log(_this.rowData)
          _this.total_count = d.data.data.total;
          this.tableLoading = false;
        })
        .catch(() => {
          this.tableLoading = false;

          //console.log('the error')
        });
    },
    pageChange(val) {
      this.pageIndex = val;
      this.searchData();
    }
  },
  created() {
    this.searchData();
  }
};
</script>

<style scoped>
</style>
