<template>
  <div>
    <Form :model="formItem" :label-width="60" :inline="true" style="margin-top: 20px">
      <FormItem label="版本号:">
        <Select
          v-model="formItem.version"
          style="width:180px"
          @on-change="search()"
          filterable
          clearable
        >
          <Option v-for="(item,key) in versions" :value="item.key" :key="key">{{ item.value }}</Option>
        </Select>
      </FormItem>
      <FormItem label="操作人:">
        <Select
          v-model="formItem.operator"
          style="width:180px"
          @on-change="searchData(true)"
          filterable
          clearable
        >
          <Option
            v-for="(item,key) in operators"
            :value="item.userId"
            :key="key"
          >{{ item.userName }}</Option>
        </Select>
      </FormItem>
      <FormItem :label-width="30">
        <Button type="primary" style="margin-left:10px" @click="search">查询</Button>
        <Button
          type="primary"
          style="margin-left: 10px"
          @click="openImportModal('note')"
          v-if="showAccess('工具箱_H5-Demo_批量导入-智能短信')"
        >批量导入-智能短信</Button>
        <Button
          type="primary"
          style="margin-left: 10px"
          @click="openImportModal('net')"
          v-if="showAccess('工具箱_H5-Demo_批量导入-网络消息')"
        >批量导入-网络消息</Button>
        <Dropdown style="margin-left: 10px" @on-click="downloadVersions">
          <Button type="primary" v-if="showAccess('工具箱_H5-Demo_版本数据导出')">
            版本数据导出
            <Icon type="ios-arrow-down"></Icon>
          </Button>
          <DropdownMenu slot="list">
            <DropdownItem
              v-for="(item,key) in versions"
              :name="item.key"
              :key="key"
            >{{ item.value }}</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </FormItem>
    </Form>
    <Card style="width:100%;margin-bottom:20px;">
      <p slot="title">版本管理</p>
      <div>
        <Table
          border
          :columns="columnsTop"
          :data="rowDataTop"
          :loading="listLoadingTop"
          style="overflow-x:scroll;"
        >
          <template slot-scope="{ row }" slot="msgFileName">
            <a href="javascript:;" @click="openEditModal(row,'note')">{{row.msgFileName}}</a>
          </template>
          <template slot-scope="{ row }" slot="networkFileName">
            <a href="javascript:;" @click="openEditModal(row,'net')">{{row.networkFileName}}</a>
          </template>
          <template slot-scope="{ row }" slot="linkUrl">
            <Tooltip placement="top" transfer>
              <div
                slot="content"
                style="width: 220px; white-space: normal;word-break: break-all;"
              >{{'https://apsaras-static.teddymobile.cn/sms/index.html#/list?version='+row.version+'&mode='+mode}}</div>
              <a
                :href="'https://apsaras-static.teddymobile.cn/sms/index.html#/list?version='+row.version+'&mode='+mode"
                target="_blank"
              >
                <Button size="small" style="color:#59afed">查看</Button>
              </a>
            </Tooltip>
          </template>
          <template slot-scope="{ row }" slot="linkUrl2">
            <Tooltip placement="top" transfer>
              <div
                slot="content"
                style="width: 220px; white-space: normal;word-break: break-all;"
              >{{'https://apsaras-static.teddymobile.cn/sms-demo/index.html#/list?version='+row.version+'&mode='+mode}}</div>
              <a
                :href="'https://apsaras-static.teddymobile.cn/sms-demo/index.html#/list?version='+row.version+'&mode='+mode"
                target="_blank"
              >
                <Button size="small" style="color:#59afed">查看</Button>
              </a>
            </Tooltip>
          </template>
          <template slot-scope="{ row }" slot="action">
            <Poptip
              transfer
              confirm
              :title="'确认删除版本'+row.versionName+'吗?'"
              @on-ok="delVersions(row)"
            >
              <Button type="error" size="small" v-if="showAccess('工具箱_H5-Demo_版本操作-删除')">删除</Button>
            </Poptip>
          </template>
        </Table>
        <div style="display:flex;justify-content:flex-end;margin-top:10px;">
          <Page
            :total="totalCountTop"
            size="small"
            :current="formItem.pageIndex"
            @on-change="pageChange"
            :page-size="formItem.pageSize"
            @on-page-size-change="pageSizeChange"
            show-sizer
            show-total
            show-elevator
          ></Page>
        </div>
      </div>
    </Card>
    <Card style="width:100%;margin-bottom:20px;">
      <p slot="title">导入记录</p>
      <div>
        <Table
          border
          :columns="columns"
          :data="rowData"
          :loading="listLoading"
          style="overflow-x:scroll;"
        ></Table>
        <div style="display:flex;justify-content:flex-end;margin-top:10px;">
          <Page
            :total="totalCount"
            size="small"
            :current="pageBottom.pageIndex"
            @on-change="pageChangeBottom"
            :page-size="pageBottom.pageSize"
            @on-page-size-change="pageSizeChangeBottom"
            show-sizer
            show-total
            show-elevator
            style="margin-top:10px;float:right"
          ></Page>
        </div>
      </div>
    </Card>
    <Modal
      v-model="editModal"
      :title="editModalForm.type == 'net' ? '网络消息数据包' : '智能短信数据包'"
      :mask-closable="false"
      @on-visible-change="closeEditModal"
    >
      <div
        style="text-align:center;font-size:14px;"
      >{{'请选择对版本'+editModalForm.row.versionName+(editModalForm.type == 'net' ? '网络消息数据包' : '智能短信数据包')+'的操作(导出/删除)'}}</div>
      <div slot="footer">
        <Button @click="editModal = false">取消</Button>
        <Button
          type="primary"
          style="margin-left:10px;"
          @click="exportPackageData"
          v-if="(showAccess('工具箱_H5-Demo_网络消息数据包-导出') && editModalForm.type == 'net') || (showAccess('工具箱_H5-Demo_智能短信数据包-导出') && editModalForm.type == 'note') "
        >导出</Button>
        <Poptip
          transfer
          confirm
          :title="'确定删除版本'+editModalForm.row.versionName+'中的所有'+(editModalForm.type == 'net' ? '网络消息数据' : '智能短信数据')+'吗?'"
          @on-ok="delDataPackage"
        >
          <Button
            style="margin-left:10px;"
            type="error"
            v-if="(showAccess('工具箱_H5-Demo_网络消息数据包-删除') && editModalForm.type == 'net') || (showAccess('工具箱_H5-Demo_智能短信数据包-删除') && editModalForm.type == 'note') "
          >删除</Button>
        </Poptip>
      </div>
    </Modal>
    <Modal
      :title="'批量导入-'+(importModalType == 'net' ? '网络消息' : '智能短信')"
      v-model="importModal"
      :mask-closable="false"
      @on-visible-change="importBatchImportClose"
    >
      <div>
        <Form :model="uploadData" :label-width="100" :inline="true">
          <FormItem label="选择版本号:">
            <Select v-model="uploadData.version" style="width:180px" filterable>
              <Option v-for="(item,key) in versions" :value="item.index" :key="key">{{ item.value }}</Option>
            </Select>
          </FormItem>
        </Form>
      </div>
      <div class="importContent">
        <Upload
          ref="uploadBatch"
          :action="importModalType == 'net' ? '/toolCase/networkMsg/import':'/toolCase/msg/import'"
          accept=".xls, .xlsx"
          :headers="headers"
          :show-upload-list="false"
          :before-upload="beforeUpload"
          :on-success="uploadSuccess"
          :on-error="uploadError"
          :data="uploadData"
        >
          <Button>选择文件</Button>
        </Upload>
        <a
          :href="onloadUrl+(importModalType == 'net' ? '网络消息示例文件.xlsx':'短信示例文件.xlsx')"
          :download="importModalType == 'net' ? '网络消息示例文件.xlsx':'短信示例文件.xlsx'"
        >
          <Button
            style="color:#006699;border:none;border-bottom:1px solid #006699;border-radius:0;font-weight:bold;"
            size="small"
            class="sampleBtn"
          >下载示例文件</Button>
        </a>
      </div>
      <div>
        <Tag
          type="dot"
          closable
          color="success"
          style="margin-left:20px;margin-top:10px;"
          v-if="reqFiles.fileName"
          @on-close="fileTagClose"
        >{{reqFiles.fileName}}</Tag>
      </div>
      <div slot="footer">
        <Button
          type="primary"
          @click="handleUpload"
          style
          :loading="uploadLoading"
        >{{uploadLoading ? '导入中' :'导入文件'}}</Button>
        <Button @click="importModal = false" :disabled="uploadLoading">取消</Button>
      </div>
    </Modal>
    <Modal title="查看结果" v-model="resultModal" :mask-closable="false">
      <div
        style="font-size:14px;"
      >成功导入{{importResult.success.length}}条,失败{{importResult.error.length}}条</div>
      <div key="successList">
        <Divider>成功数据</Divider>
        <Tag color="green" v-for="(item,index) in importResult.success" :key="index">{{item}}</Tag>
      </div>
      <div key="errList">
        <Divider>失败数据</Divider>
        <Tag color="red" v-for="(item,index) in importResult.error" :key="index">{{item}}</Tag>
      </div>
    </Modal>
  </div>
</template>
<script>
import axios from "@/libs/api.request";
import { datefmt } from "@/utils/dateFormat";
import { getToken, uuid } from "@/libs/util";
import moment from "moment";
import hasShowAccess from "@/libs/hasShowAccess.js";
import config from "./options/columns";
moment.locale("zh-cn");
export default {
  name: "dataEntering",
  components: {},
  data() {
    return {
      resultModal: false,
      importResult: {
        success: [],
        error: []
      },
      uploadLoading: false,
      importModal: false,
      onloadUrl:
        process.env.NODE_ENV === "production" ? "/page/static/" : "/static/",
      mode:
        location.href.indexOf("back-manager.teddymobile.net") > -1
          ? "prod"
          : "test",
      headers: {
        "X-Client-Token": getToken(),
        // "X-Client-Token":
        //   "eyJpc0VuYWJsZSI6MSwibGFzdExvZ2luIjoxNTgxOTA1MjA4NDM2LCJuaWNrTmFtZSI6InlvdWJpbmdrdW4iLCJ0b2tlbiI6IjYwX3lvdWJpbmdrdW5fMTU4MTkwNTIwODQzNiIsInVzZXJFbWFpbCI6InlvdWJpbmdrdW5AdGVkZHltb2JpbGUuY24iLCJ1c2VySWQiOjYwLCJ1c2VyTmFtZSI6InlvdWJpbmdrdW4ifQ==",
        "X-Client-Sdk": 2,
        "X-App-Id": "sdt_back_manager",
        "X-App-Version": 1,
        "X-Client-Time": Date.now(),
        "X-Request-Id": uuid(),
        "X-Request-Type": "",
        "X-Tdbear-Id": "",
        "X-Client-Unique": ""
      },
      editModal: false,
      rowData: [],
      rowDataTop: [],
      listLoading: false,
      listLoadingTop: false,
      totalCount: 0,
      totalCountTop: 0,
      columns: config.columns,
      columnsTop: config.columnsTop,
      versions: [],
      operators: [],
      formItem: {
        operator: 0,
        version: "",
        pageIndex: 1,
        pageSize: 10
      },
      pageBottom: {
        pageIndex: 1,
        pageSize: 10
      },
      editModalForm: {
        type: "",
        row: {}
      },
      reqFiles: {
        fileName: ""
      },
      importModalType: "note",
      uploadData: {
        version: ""
      }
    };
  },
  computed: {
    showAccess() {
      return el => {
        return hasShowAccess(el);
      };
    },
    formatDateComputed() {
      return value => {
        if (value) {
          let time = moment(value)
            .format("YYYY-MM-DD HH:mm:ss")
            .split(" ");
          return time[0] + "<br>" + time[1];
        } else {
          return "";
        }
      };
    }
  },
  filters: {
    formatDateShort(value) {
      if (value) {
        return moment(value).format("YYYY-MM-DD");
      } else {
        return "";
      }
    }
  },
  mounted() {
    this.getVersions();
    this.getOperators();
    this.searchData(true);
    this.searchDataBottom(true);
  },
  methods: {
    exportPackageData() {
      console.log(this.editModalForm);
      let url =
        (this.editModalForm.type == "net"
          ? "/toolCase/networkMsg/export/"
          : "/toolCase/msg/export/") + this.editModalForm.row.version;
      axios
        .request({
          url,
          method: "post",
          responseType: "blob"
        })
        .then(res => {
          console.log(res);
          if (!res) {
            this.$Message.error("导出失败");
            return;
          }
          var elink = document.createElement("a");
          elink.download =
            this.editModalForm.type == "net"
              ? "网络消息数据包"
              : "智能短信数据包" + this.editModalForm.row.versionName + ".xls";
          elink.style.display = "none";
          var blob = new Blob([res.data], { type: "application/vnd.ms-excel" });
          elink.href = URL.createObjectURL(blob);
          document.body.appendChild(elink);
          elink.click();
          document.body.removeChild(elink);
        })
        .catch(err => {
          this.$Message.error("网络错误" + err);
        });
    },
    downloadVersions(name) {
      axios
        .request({
          url: "/toolCase/version/export/" + name,
          method: "post",
          responseType: "blob"
        })
        .then(res => {
          console.log(res);
          if (!res) {
            this.$Message.error("导出失败");
            return;
          }
          var elink = document.createElement("a");
          elink.download = "版本数据" + ".xls";
          elink.style.display = "none";
          var blob = new Blob([res.data], { type: "application/vnd.ms-excel" });
          elink.href = URL.createObjectURL(blob);
          document.body.appendChild(elink);
          elink.click();
          document.body.removeChild(elink);
        })
        .catch(err => {
          this.$Message.error("网络错误" + err);
        });
    },
    search() {
      this.searchData(true);
      this.searchDataBottom(true);
    },
    getVersions() {
      axios
        .request({
          url: "/toolCase/version/list",
          method: "get"
        })
        .then(d => {
          if (d.data.code == 0) {
            this.versions = d.data.data;
          } else {
            this.$Message.error(d.data.msg);
          }
        })
        .catch(err => {
          this.$Message.error("网络错误" + err);
        });
    },
    getOperators() {
      axios
        .request({
          url: "/toolCase/operator/list",
          method: "get"
        })
        .then(d => {
          if (d.data.code == 0) {
            this.operators = d.data.data;
          } else {
            this.$Message.error(d.data.msg);
          }
        })
        .catch(err => {
          this.$Message.error("网络错误" + err);
        });
    },
    openImportModal(type) {
      this.importModalType = type;
      this.importModal = true;
    },
    handleUpload() {
      if (this.reqFiles.files == null) {
        this.$Message.error("请选择导入文件！");
        return;
      } else if (!this.uploadData.version) {
        this.$Message.error("请选择版本号!");
        return;
      } else {
        this.uploadLoading = true;
        this.$refs.uploadBatch.post(this.reqFiles.files);
      }
    },
    fileTagClose() {
      this.reqFiles = {
        files: null,
        fileName: ""
      };
    },
    importBatchImportClose() {
      this.uploadLoading = false;
      this.reqFiles.files = null;
      this.reqFiles.fileName = "";
      this.uploadData.version = "";
    },
    beforeUpload(file) {
      this.reqFiles.files = file;
      this.reqFiles.fileName = file.name;
      return false;
    },
    uploadSuccess(res) {
      if (res.code === 0) {
        setTimeout(() => {
          this.$Message.success("导入成功");
          this.uploadLoading = false;
          this.reqFiles.files = null;
          this.reqFiles.fileName = "";
          this.uploadData.version = "";
          this.searchData(true);
          this.searchDataBottom(true);
          this.importModal = false;
          this.resultModal = true;
          this.importResult.success = res.data.successList;
          let arr = [];
          for (let key in res.data.errorList) {
            let str = key + ":" + res.data.errorList[key];
            arr.push(str);
          }
          this.importResult.error = arr;
        }, 3000);
      } else {
        this.uploadLoading = false;

        this.$Message.error(res.msg);
      }
    },
    uploadError(err) {
      this.$Message.success("网络错误" + err);
      this.uploadLoading = false;
    },
    delVersions(row) {
      axios
        .request({
          url: "/toolCase/version/delete",
          method: "post",
          data: {
            version: row.version
          }
        })
        .then(d => {
          if (d.data.code == 0) {
            this.$Message.success("删除成功");
            this.searchData(true);
          } else {
            this.$Message.error(d.data.msg);
          }
        })
        .catch(err => {
          this.$Message.error("网络错误" + err);
        });
    },
    delDataPackage() {
      let url =
        this.editModalForm.type === "net"
          ? "/toolCase/network/delete"
          : "/toolCase/msg/delete";
      axios
        .request({
          url,
          method: "post",
          data: {
            version: this.editModalForm.row.version
          }
        })
        .then(d => {
          if (d.data.code == 0) {
            this.$Message.success("删除成功");
            this.searchData(true);
            this.editModal = false;
          } else {
            this.$Message.error(d.data.msg);
          }
        })
        .catch(err => {
          this.$Message.error("网络错误" + err);
        });
    },
    closeEditModal(flag) {
      if (!flag) {
        this.editModalForm = {
          type: "",
          row: {}
        };
      }
    },
    openEditModal(row, type) {
      this.editModalForm.type = type;
      this.editModalForm.row = row;
      this.editModal = true;
    },
    copyShortUrl(url) {
      var oInput = document.createElement("input");
      oInput.value = url;
      document.body.appendChild(oInput);
      oInput.select();
      document.execCommand("Copy"); // 执行浏览器复制命令
      this.$Message.success("复制成功");
      oInput.remove();
    },
    searchData(isfirst) {
      this.listLoadingTop = true;
      if (isfirst) {
        this.formItem.pageIndex = 1;
      }
      let postData = {
        pageIndex: this.formItem.pageIndex - 1,
        pageSize: this.formItem.pageSize,
        operatorId: this.formItem.operator,
        version: this.formItem.version
      };
      axios
        .request({
          url: "/toolCase/versionData/list",
          method: "post",
          data: postData
        })
        .then(d => {
          if (d.data.code == 0) {
            this.rowDataTop = d.data.data.data;
            this.totalCountTop = d.data.data.total;
          }
          this.listLoadingTop = false;
        })
        .catch(() => {
          this.listLoadingTop = false;
        });
    },
    searchDataBottom(isfirst) {
      this.listLoading = true;
      if (isfirst) {
        this.pageBottom.pageIndex = 1;
      }
      let postData = {
        pageIndex: this.pageBottom.pageIndex - 1,
        pageSize: this.pageBottom.pageSize,
        version: this.formItem.version
      };
      axios
        .request({
          url: "/toolCase/versionHistory/list",
          method: "post",
          data: postData
        })
        .then(d => {
          if (d.data.code == 0) {
            this.rowData = d.data.data.data;
            this.totalCount = d.data.data.total;
          }
          this.listLoading = false;
        })
        .catch(() => {
          this.listLoading = false;
        });
    },
    pageChange(val) {
      this.formItem.pageIndex = val;
      this.searchData();
    },
    pageSizeChange(val) {
      this.formItem.pageSize = val;
      this.searchData();
    },
    pageChangeBottom(val) {
      this.pageBottom.pageIndex = val;
      this.searchDataBottom();
    },
    pageSizeChangeBottom(val) {
      this.pageBottom.pageSize = val;
      this.searchDataBottom();
    }
  }
};
</script>
<style scoped lang="less">
.echart {
  width: 100%;
  height: 300px;
}
.importContent {
  padding: 0 20px;
  position: relative;
  .sampleBtn {
    position: absolute;
    top: 4px;
    left: 120px;
  }
}
</style>

