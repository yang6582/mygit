<template>
  <div>
    <Form :model="formItem" :label-width="80" :inline="true" style="margin-top: 20px">
      <FormItem label="操作日期:">
        <Date-picker
          type="daterange"
          format="yyyy-MM-dd"
          placeholder="请选择日期"
          style="width:180px;"
          v-model="formItem.yyyymm"
          :options="pickerOptions"
          @on-change="changeReportTime"
          :clearable="false"
        ></Date-picker>
      </FormItem>
      <FormItem label="操作人:">
        <Input
          v-model="formItem.userName"
          placeholder="操作人"
          clearable
          style="width:180px;"
          @on-enter="searchData(true)"
        />
      </FormItem>
      <FormItem label="厂商:">
        <Select v-model="formItem.partnerId" style="width:180px" @on-change="searchData(true)">
          <Option :value="-1">全部</Option>
          <Option v-for="(item,key) in partnerNames" :value="item.index" :key="key">{{ item.value }}</Option>
        </Select>
      </FormItem>

      <FormItem label="操作类型:">
        <Select v-model="formItem.operateType" style="width:180px" @on-change="searchData(true)">
          <Option v-for="(item,key) in operateTypes" :value="item.key" :key="key">{{ item.value }}</Option>
        </Select>
      </FormItem>
      <FormItem label="关键内容:">
        <Input
          clearable
          v-model="formItem.content"
          placeholder="关键字，例如：广告名称"
          style="width:180px"
          @on-enter="searchData(true)"
        />
      </FormItem>
      <FormItem label="客户名称:">
        <Input
          v-model="formItem.customName"
          placeholder="客户名称"
          @on-enter="searchData(true)"
          style="width:180px"
          clearable
        />
      </FormItem>
      <FormItem label="投放方式:">
        <Select v-model="formItem.adType" style="width:180px" @on-change="searchData(true)">
          <Option v-for="(item,key) in adTypes" :value="item.index" :key="key">{{ item.value }}</Option>
        </Select>
      </FormItem>
      <FormItem label="广告渠道:" v-if="formItem.adType == 1">
        <Select v-model="formItem.adPositionType" style="width:180px" @on-change="searchData(true)">
          <Option
            v-for="(item,key) in adPositionTypes"
            :value="item.index"
            :key="key"
          >{{ item.value }}</Option>
        </Select>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="searchData(true)">查询</Button>
        <Button
          type="primary"
          @click="exportData"
          style="margin-left:10px"
          v-if="showAccess('日志管理_广告操作日志_导出')"
        >导出</Button>
      </FormItem>
    </Form>
    <div class="layout-table">
      <Table
        border
        :columns="formItem.adType == 1 ?columnsSelection:columnsSelectionStrips"
        :data="rowData"
        align="center"
        key="rowData"
        :loading="tableLoading"
      >
        <template slot-scope="{ row }" slot="createTime">
          <span>{{row.createTime | formatDate}}</span>
        </template>
        <template slot-scope="{row}" slot="operReason">
          <Tooltip placement="top" max-width="200" transfer theme="light">
            <div slot="content" style="word-wrap:break-word">{{row.operReason}}</div>
            <div
              style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;"
            >{{row.operReason}}</div>
          </Tooltip>
        </template>
        <template slot-scope="{ row }" slot="partnerId">{{tableMatching(0,row.partnerId)}}</template>
        <!-- <template slot-scope="{ row }" slot="dataOld">{{row.operType=='编辑' ? '请从详情查看':row.dataOld}}</template>
        <template slot-scope="{ row }" slot="dataNew">{{row.operType=='编辑'  ? '请从详情查看':row.dataNew}}</template>-->
        <template slot-scope="{ row }" slot="operResult">
          <span>{{operateResult(row.operResultCode)}}</span>
        </template>
        <template slot-scope="{ row }" slot="adPositionType">{{tableMatching(1,row.adPositionType)}}</template>
        <template slot-scope="{ row }" slot="info">
          <Button
            type="primary"
            size="small"
            @click="showDataInfo(row.dataBefore, row.dataAfter)"
          >查看详情</Button>
        </template>
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
    <Modal title="详情" v-model="showInfo" width="80%" :styles="{top:'20px'}">
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
import hasShowAccess from "@/libs/hasShowAccess.js";
export default {
  name: "operation",
  data() {
    return {
      partnerNames: [
        {
          index: 5,
          value: "VIVO"
        },
        {
          index: 1,
          value: "OPPO"
        },
        {
          index: 2,
          value: "金立"
        },
        {
          index: 3,
          value: "乐视"
        },
        {
          index: 4,
          value: "ZUK"
        },
        {
          index: 9,
          value: "NEX3"
        },
        {
          index: 6,
          value: "一加"
        }
      ],
      adTypes: [
        {
          index: 1,
          value: "按次投放"
        },
        {
          index: 2,
          value: "按条投放"
        }
      ],
      adPositionTypes: [
        {
          index: -1,
          value: "全部"
        },
        {
          index: 1,
          value: "菜单"
        },
        {
          index: 2,
          value: "下一步"
        },
        {
          index: 3,
          value: "中间页"
        }
      ],
      operateTypes: [
        {
          key: "全部",
          value: "全部"
        },
        {
          key: "编辑单价",
          value: "编辑单价"
        },
        {
          key: "编辑",
          value: "编辑"
        },
        // {
        //   key: "添加",
        //   value: "添加"
        // },
        // {
        //   key: "导入添加",
        //   value: "导入添加"
        // },
        {
          key: "上线",
          value: "上线"
        },
        {
          key: "下线",
          value: "下线"
        },
        {
          key: "删除",
          value: "删除"
        }
      ],
      formItem: {
        adPositionType: -1,
        operateType: "全部",
        customName: "",
        partnerId: -1,
        userName: "",
        // dataBase: "ads",
        content: "",
        result: "",
        yyyymm: [],
        adType: 1
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      tableLoading: false,
      columnsSelection: [
        {
          type: "index",
          width: 65,
          title: "序号",
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
          title: "客户名称",
          key: "customUsername",
          align: "center"
        },
        {
          title: "厂商",
          key: "partnerId",
          slot: "partnerId",
          align: "center"
        },
        {
          title: "广告渠道",
          key: "adPositionType",
          slot: "adPositionType",

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
        {
          title: "操作结果",
          key: "operResult",
          slot: "operResult",
          align: "center"
        },
        // {
        //   title: "旧数据",
        //   slot: "dataOld",
        //   align: "center"
        // },
        // {
        //   title: "新数据",
        //   slot: "dataNew",
        //   align: "center"
        // },
        {
          title: "操作原因",
          key: "operReason",
          slot: "operReason",
          align: "center",
          minWidth: 120
        },
        {
          title: "详情",
          key: "info",
          slot: "info",
          align: "center",
          width: 120
        }
      ],
      columnsSelectionStrips: [
        {
          type: "index",
          width: 65,
          title: "序号",
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
          title: "客户名称",
          key: "customUsername",
          align: "center"
        },
        {
          title: "厂商",
          key: "partnerName",
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
        {
          title: "操作结果",
          key: "operResult",
          slot: "operResult",
          align: "center"
        },
        // {
        //   title: "旧数据",
        //   slot: "dataOld",
        //   align: "center"
        // },
        // {
        //   title: "新数据",
        //   slot: "dataNew",
        //   align: "center"
        // },
        {
          title: "操作原因",
          key: "operReason",
          slot: "operReason",
          align: "center",
          minWidth: 120
        },
        {
          title: "详情",
          key: "info",
          slot: "info",
          align: "center",
          width: 120
        }
      ],
      rowData: [],
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
        userName: this.formItem.userName,
        startTime: this.formItem.yyyymm[0]
          ? this.formItem.yyyymm[0] + " 00:00:00"
          : "",
        endTime: this.formItem.yyyymm[1]
          ? this.formItem.yyyymm[1] + " 23:59:59"
          : "",
        operCode: this.formItem.result,
        keyword: this.formItem.content,
        pageSize: this.pageSize,
        pageIndex: this.pageIndex - 1,
        partnerId: this.formItem.partnerId,
        customName: this.formItem.customName,
        operType:
          this.formItem.operateType === "全部" ? "" : this.formItem.operateType,
        adPositionType:
          this.formItem.adType === 1 ? this.formItem.adPositionType : -1,
        adType: this.formItem.adType
      };

      axios
        .request({
          url: "/sys/utils/operation/adLogs",
          method: "post",
          data: postData
        })
        .then(d => {
          if (d.data.code == 0) {
            let dataArr = d.data.data;
            this.rowData = dataArr.data;
            this.total = d.data.data.total;
            this.tableLoading = false;
          } else {
            this.$Message.error(d.data.msg);
          }
        })
        .catch(err => {
          this.$Message.error("网络错误" + err);
          this.tableLoading = false;
        });
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
    },
    changeReportTime(data) {
      this.formItem.yyyymm = data;
      this.searchData(true);
    },
    exportData() {
      axios
        .request({
          url: "/sys/utils/operation/adLogs/export",
          method: "post",
          headers: {
            "Content-Type": "application/json"
          },
          responseType: "blob",
          data: {
            userName: this.formItem.userName,
            startTime: this.formItem.yyyymm[0]
              ? this.formItem.yyyymm[0] + " 00:00:00"
              : "",
            endTime: this.formItem.yyyymm[1]
              ? this.formItem.yyyymm[1] + " 23:59:59"
              : "",
            operCode: this.formItem.result,
            keyword: this.formItem.content,
            pageSize: this.pageSize,
            pageIndex: this.pageIndex - 1,
            partnerId: this.formItem.partnerId,
            customName: this.formItem.customName,
            operType:
              this.formItem.operateType === "全部"
                ? ""
                : this.formItem.operateType,
            adPositionType: this.formItem.adPositionType,
            adType: this.formItem.adType
          }
        })
        .then(res => {
          const link = document.createElement("a");
          let blob = new Blob([res.data], { type: "application/vnd.ms-excel" });
          link.style.display = "none";
          link.href = URL.createObjectURL(blob);
          link.setAttribute("download", "广告操作日志.xls");
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        })
        .catch(err => {
          this.$Message.error("导出失败");
        });
    }
  },
  created() {
    this.searchData(true);
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
    showAccess() {
      return el => {
        return hasShowAccess(el);
      };
    },
    operateResult() {
      return reason => {
        if (reason == 0) {
          return "成功";
        } else {
          return "失败";
        }
      };
    },
    tableMatching() {
      return (type, index) => {
        let arr = type ? this.adPositionTypes : this.partnerNames;
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].index == index) {
            return arr[i].value;
          }
        }
      };
    }
  }
};
</script>

<style lang="less">
pre {
  outline: 1px solid #ccc;
}
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
