<template>
  <div>
    <Form :model="formItem" :label-width="100" :inline="true" style="margin-top: 20px" @submit.native.prevent>
      <FormItem label="操作人:">
        <Input v-model="formItem.userName" placeholder="操作人" @on-enter="searchData(true)" clearable/>
      </FormItem>
      <FormItem label="数据库:">
        <Select v-model="formItem.dataBase" style="width:140px" @on-change="searchData(true)">
          <Option v-for="(item,key) in dataBase" :value="key" :key="key">{{ item }}</Option>
        </Select>
      </FormItem>
      <FormItem label="关键内容:">
        <Input
          v-model="formItem.content"
          placeholder="关键字，例如：广告名称"
          style="width:200px"
          clearable
          @on-enter="searchData(true)"
        />
      </FormItem>
      <!-- <FormItem label="操作结果:">
        <Select
          v-model="formItem.result"
          style="width:80px"
          clearable
          @on-change="searchData(true)"
        >
          <Option :value="0">成功</Option>
          <Option :value="1">失败</Option>
        </Select>
      </FormItem> -->
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
        <template slot-scope="{ row, index }" slot="info">
          <Button
            type="primary"
            size="small"
            @click="showDataInfo(row.dataBefore, row.dataAfter)"
          >查看详情</Button>&nbsp;
        </template>
        <template slot-scope="{ row, index }" slot="dataType">
          <span>{{dataBase[row.dataType]}}</span>
        </template>
        <!-- <template slot-scope="{ row, index }" slot="operResult">
          <span>{{operateResult(row.operResultCode)}}</span>
        </template> -->
      </Table>
      <Page
        :total="total"
        size="small"
        :current="pageIndex"
        @on-change="pageChange"
        show-total
        show-elevator
        style="margin-top:10px;float:right"
      ></Page>
    </div>
    <Modal title="详情" v-model="showInfo"  width="80%" :styles="{top:'20px'}">
     <div style>
        <div style="display:flex;font-weight:bold;">
          <div style="width:50%;">当前内容</div>
          <div style="width:50%;">修改前内容</div>
        </div>
        <div style="display:flex;">
          <json-viewer
            :value="textAfter"
            :expand-depth="5"
            copyable
            sort
            style="width:50%;overflow-x:auto;border:1px solid #ccc;"
            theme="my-awesome-json-theme"
          ></json-viewer>
          <json-viewer
            :value="textBefore"
            :expand-depth="5"
            copyable
            sort
            style="width:50%;overflow-x:auto;border:1px solid #ccc;border-left:none;"
            theme="my-awesome-json-theme"
          ></json-viewer>
        </div>
      </div>
      <div slot="footer">
        <Button @click="showInfo = false">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import axios from "@/libs/api.request";
import moment from "moment";
moment.locale("zh-cn");

export default {
  name: "historyRecord",
  data() {
    return {
      formItem: {
        userName: "",
        dataBase: "auth_user",
        content: "",
        // result: ""
      },
      tableLoading: false,
      columnsSelection: [
        {
          type: "index",
          width: 60,
          title:'序号',
          align: "center"
        },
        {
          title: "操作人",
          key: "operUser",
          align: "center"
        },
        {
          title: "操作时间",
          key: "createTime",
          slot: "createTime",
          width: 100,
          align: "center"
        },
        {
          title: "登录IP",
          key: "operIp",
          align: "center"
        },
        {
          title: "修改数据库",
          key: "dataType",
          slot: "dataType",
          align: "center"
        },
        {
          title: "关键内容",
          key: "dataKeyword",
          align: "center"
        },
        {
          title: "操作类型",
          key: "operType",
          align: "center"
        },
        // {
        //   title: "操作结果",
        //   key: "operResult",
        //   slot: "operResult",
        //   align: "center"
        // },
        // {
        //   title: "操作原因",
        //   key: "operReason",
        //   align: "center"
        // },
        {
          title: "详情",
          key: "info",
          slot: "info",
          align: "center"
        }
      ],
      rowData: [],
      dataBase: [],
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      showInfo: false,
      textBefore: "",
      textAfter: ""
    };
  },
  methods: {
    searchData(state) {
      this.tableLoading = true;
      if (state) {
        this.pageIndex = 1;
      }
      let postData = {
        userName: this.formItem.userName.trim(),
        dataType: this.formItem.dataBase,
        startTime: "",
        endTime: "",
        // operCode: this.formItem.result,
        keyword: this.formItem.content.trim(),
        pageSize: this.pageSize,
        pageIndex: this.pageIndex - 1
      };
      let _this = this;
      axios
        .request({
          url: "/sys/utils/auth/logs",
          method: "post",
          data: postData
        })
        .then(d => {
          let dataArr = d.data.data;
          _this.rowData = dataArr.data;
          //console.log(_this.rowData)
          _this.total = d.data.data.total;
          this.tableLoading = false;
        })
        .catch(() => {
          //console.log('the error')
          this.tableLoading = false;
        });
    },
    searchOperationTypes() {
      axios
        .request({
          url: "/sys/utils/operation/types?distype=1",
          method: "get"
        })
        .then(
          res => {
            if (res.data.code == 0) {
              this.dataBase = res.data.data;
              //console.log(this.formItem.dataBase)
            } else {
              this.$Message.error(res.data.msg);
            }
          },
          err => {
            this.$Message.error("请求失败，" + err + "，请稍后再试！");
          }
        );
    },
    pageChange(val) {
      this.pageIndex = val;
      this.searchData();
    },
    showDataInfo(before, after) {
     this.textBefore = this.jsonShowFn(before);
      this.textAfter = this.jsonShowFn(after);
      this.showInfo = true;
    },
    jsonShowFn(json) {
      if (!json.match("^{(.+:.+,*){1,}}$")) {
        return json; //判断是否是json数据，不是直接返回
      } else {
        return JSON.parse(json);
      }
    }
  },
  created() {
    this.searchOperationTypes();
    this.searchData();
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
    // operateResult() {
    //   return reason => {
    //     if (reason == 0) {
    //       return "成功";
    //     } else {
    //       return "失败";
    //     }
    //   };
    // }
  }
};
</script>

<style lang="less">
.my-awesome-json-theme {
  background: #fff;
  white-space: nowrap;
  color: #525252;
  font-size: 14px;
  font-family: Consolas, Menlo, Courier, monospace;

  .jv-ellipsis {
    color: #999;
    background-color: #eee;
    display: inline-block;
    line-height: 0.9;
    font-size: 0.9em;
    padding: 0px 4px 2px 4px;
    border-radius: 3px;
    vertical-align: 2px;
    cursor: pointer;
    user-select: none;
  }
  .jv-button {
    color: #49b3ff;
  }
  .jv-key {
    color: #111111;
  }
  .jv-item {
    &.jv-array {
      color: #111111;
    }
    &.jv-boolean {
      color: #fc1e70;
    }
    &.jv-function {
      color: #067bca;
    }
    &.jv-number {
      color: #fc1e70;
    }
    &.jv-object {
      color: #111111;
    }
    &.jv-undefined {
      color: #e08331;
    }
    &.jv-string {
      color: #42b983;
      word-break: break-word;
      white-space: normal;
    }
  }
  .jv-code {
    .jv-toggle {
      &:before {
        padding: 0px 2px;
        border-radius: 2px;
      }
      &:hover {
        &:before {
          background: #eee;
        }
      }
    }
  }
}
</style>
