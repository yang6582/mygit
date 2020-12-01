<template>
  <div>
    <Form
      :model="formItem"
      :label-width="80"
      :inline="true"
      style="margin-top: 20px"
      ref="formItem"
    >
      <FormItem label="code:" prop="code">
        <Input v-model.trim="formItem.code" placeholder="code" clearable @on-enter="search(true)" />
      </FormItem>
      <FormItem label="广告名称:" prop="adName">
        <Input
          v-model.trim="formItem.adName"
          placeholder="广告名称"
          clearable
          @on-enter="search(true)"
        />
      </FormItem>
      <FormItem label="广告ID:" prop="adId">
        <Input v-model.trim="formItem.adId" placeholder="广告ID" clearable @on-enter="search(true)" />
      </FormItem>
      <FormItem label="原链:" prop="fullUrl">
        <Input v-model.trim="formItem.fullUrl" placeholder="原链" clearable @on-enter="search(true)" />
      </FormItem>
      <FormItem label="更新时间:" prop="submitTime">
        <Date-picker
          :value="formItem.submitTime"
          format="yyyy-MM-dd"
          @on-change="submitTimeChange"
          type="daterange"
          placement="bottom-end"
          placeholder="选择日期"
          style="width: 180px"
          transfer
        ></Date-picker>
      </FormItem>
      <FormItem :label-width="30">
        <Button type="primary" style="margin-left:10px" @click="search(true)">查询</Button>
        <Button type="primary" style="margin-left: 10px" @click="resetFormItem">重置</Button>
      </FormItem>
    </Form>
    <div style="margin-bottom:20px;">
      <Button
        type="primary"
        style="margin-left: 10px"
        @click="add('add')"
        v-if="showAccess('短链管理_短链定制_添加')"
      >添加</Button>
      <Button
        type="primary"
        style="margin-left: 10px"
        @click="importExcel"
        v-if="showAccess('短链管理_短链定制_批量添加')"
      >批量添加</Button>
      <Button
        type="primary"
        style="margin-left: 10px"
        @click="exportSearch"
        v-if="showAccess('短链管理_短链定制_导出')"
      >导出</Button>
    </div>
    <div>
      <Table
        border
        :columns="columns"
        :data="rowData"
        align="center"
        key="rowData"
        :loading="rowDataLoading"
      >
        <template slot-scope="{row}" slot="fullUrl">
          <Tooltip placement="top" max-width="200">
            <div slot="content" style=" white-space: normal;word-break: break-all;">{{row.fullUrl}}</div>
            <a :href="row.fullUrl" target="_blank">
              <Button size="small" style="color:#59afed">查看</Button>
            </a>
          </Tooltip>
        </template>
        <template slot-scope="{ row, index }" slot="shortUrl">
          <Tooltip placement="top" transfer>
            <div 
              slot="content" 
              style="width: 220px; white-space: normal;word-break: break-all;"
            >{{row.shortUrl}}</div>
            <div class="textOverFlow" v-if="row.shortUrl"
            >{{row.shortUrl}}</div>
          </Tooltip>
        </template>
        <template slot-scope="{row}" slot="isRelevance">
          <div>{{row.adId > 0 ? '是' : '否'}}</div>
        </template>
        <template slot-scope="{row}" slot="urlDesc">
          <Tooltip placement="top" max-width="200" transfer theme="light">
            <div slot="content" style="word-wrap:break-word">{{row.urlDesc}}</div>
            <div
              style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;"
            >{{row.urlDesc}}</div>
          </Tooltip>
        </template>
        <template slot-scope="{row}" slot="isRelevance">
          <div>{{row.adId > 0 ? '是' : '否'}}</div>
        </template>
        <template slot-scope="{row}" slot="adId">
          <div>{{row.adId > 0 ? row.adId : ''}}</div>
        </template>
        <template slot-scope="{ row }" slot="replaceTime">
          <span>{{row.replaceTime | formatDate}}</span>
        </template>
        <template slot-scope="{ row }" slot="createTime">
          <span>{{row.createTime | formatDate}}</span>
        </template>
        <template slot-scope="{ row }" slot="updateTime">
          <span>{{row.updateTime | formatDate}}</span>
        </template>
        <template slot-scope="{ row }" slot="operation">
          <div style="padding:10px 0;display:flex;">
            <Button
              type="primary"
              size="small"
              @click="add('update',row)"
              v-if="showAccess('短链管理_短链定制_编辑')"
            >{{row.replaceStatus=='1' ?'编辑':'更改定时'}}</Button>
            <Button
              type="primary"
              size="small"
              v-if="row.adId <= 0 && showAccess('短链管理_短链定制_关联广告') && row.replaceStatus != '0'"
              style="margin-left:10px"
              @click="openAdModal(row)"
            >关联广告</Button>
            <Button
              type="primary"
              size="small"
              v-if="row.adId > 0 && showAccess('短链管理_短链定制_关联广告')"
              style="margin-left:10px"
              @click="openAdModal(row)"
            >更改关联</Button>
            <Button
              type="warning"
              size="small"
              v-if="row.adId > 0 && showAccess('短链管理_短链定制_取消关联')"
              style="margin-left:10px"
              @click="cancelAdModal(row)"
            >取消关联</Button>
            <Poptip confirm title="是否确定取消该短链定时功能?取消后将会立即生效" @on-ok="cancelTiming(row)" transfer>
              <Button
                style="margin-left: 10px;"
                size="small"
                type="success"
                v-if="row.replaceStatus == '0'"
              >取消定时</Button>
            </Poptip>
          </div>
        </template>
      </Table>
      <Page
        :total="page.totalCount"
        :current="page.pageIndex"
        @on-change="pageChange"
        :page-size="page.pageSize"
        @on-page-size-change="pageSizeChange"
        show-sizer
        show-total
        show-elevator
        style="margin-top:10px;float:right"
      ></Page>
    </div>
    <Modal
      v-model="addModal"
      :title="addType == 'add' ? '新增' :'修改'"
      :mask-closable="false"
      @on-visible-change="closeAddModal"
    >
      <div style="padding:0 40px 0 0;">
        <Form ref="addForm" :model="addForm" :rules="addRuleValidate" :label-width="110">
          <FormItem label="code:" prop="code">
            <div v-if="addType == 'add'">
              <Input v-model.trim="addForm.code" placeholder="请填写code" clearable style="width:90%;"></Input>
              <Tooltip
                placement="right"
                max-width="250"
                transfer
                content="代表字符
菜单-N1；下一步-N2；中间页-N3
CPC链接-BC，CPS链接-BS，CPT链接-BT；其它-BO
示例：
Oppo菜单渠道CPC链接
https://j.tdbear.cn/N1BC-O-dvdHl8"
              >
                <!-- <img
                  src="../../../../public/help.svg"
                  style="height: 20px; width:20px; padding-top: 5px;  margin-left: 5px;"
                />-->
                <Icon
                  type="ios-bulb"
                  size="20"
                  color="#f3aa3a"
                  style="margin-left:10px;cursor:pointer"
                />
                <!-- <span style="margin-left: 5px; justify-content: center; align-items: center;">填写帮助</span> -->
              </Tooltip>
            </div>
            <span v-else>{{addForm.code}}</span>
          </FormItem>
          <FormItem label="短链名称:" prop="name">
            <Input v-model.trim="addForm.name" placeholder="请填写短链名称" clearable></Input>
          </FormItem>
          <FormItem label="描述:" prop="urlDesc">
            <Input v-model.trim="addForm.urlDesc" placeholder="请填写描述" clearable></Input>
          </FormItem>
          <FormItem label="原链:" prop="fullUrl">
            <Input v-model.trim="addForm.fullUrl" placeholder="请填写URL" clearable></Input>
          </FormItem>
          <FormItem
            label="生效时间:"
            prop="replaceStatus"
            v-if="addType == 'add' || (addType == 'update' && addForm.replaceStatusFixed === '0')"
          >
            <RadioGroup v-model="addForm.replaceStatus">
              <Radio label="1">立即生效</Radio>
              <Radio label="0">定时生效</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="时间:" prop="replaceTime" v-if="addForm.replaceStatus === '0'">
            <DatePicker
              type="datetime"
              v-model="addForm.replaceTime"
              format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择生效时间"
              style="width:200px"
              :options="timingOptions"
            ></DatePicker>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button @click="addModal = false">取消</Button>
        <Button
          type="primary"
          style="margin-left:10px;"
          @click="handleSubmit('addForm')"
          :loading="handleSubmitLoading"
        >确定</Button>
      </div>
    </Modal>

    <Modal title="导入完成" v-model="importModal" :mask-closable="false">
      <div style="padding:40px;text-align:center;font-size:14px;">
        <p
          style="margin-bottom:20px;"
        >本次上传{{uploadResponse.success_count +uploadResponse.error_count}}条，其中{{uploadResponse.success_count}}条导入成功，{{uploadResponse.error_count}}条导入失败</p>
        <p
          v-for="(item,index) in uploadResponse.errorDetail"
          :key="index"
          style="padding:5px 0;text-align:left;"
        >{{item}}</p>
      </div>
      <div slot="footer">
        <Button type="primary" @click="checkResult" v-if="false">查看结果</Button>
        <Button @click="closeModal" style="margin-left:10px;">返回</Button>
      </div>
    </Modal>
    <Modal
      title="批量添加"
      v-model="importM"
      :mask-closable="false"
      @on-visible-change="importBatchImportClose"
    >
      <div class="importContent">
        <Upload
          ref="uploadBatch"
          action="/ad/shorturl/batchadd"
          accept=".xls, .xlsx"
          :headers="headers"
          :show-upload-list="false"
          :before-upload="beforeUpload"
          :on-success="uploadSuccess"
          :on-error="uploadError"
        >
          <Button>选择文件</Button>
        </Upload>
        <a :href="onloadUrl+'短链导入模板.xlsx'" download="短链导入模板.xlsx">
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
        <Button @click="importM = false" style>取消</Button>
      </div>
    </Modal>
    <Modal
      title="关联广告"
      v-model="relevanceAd"
      :mask-closable="false"
      width="80"
      :styles="{top: '40px'}"
    >
      <relevanceAd-com :id="handleId" @closeAdModal="closeAdModal" ref="relevanceAd"></relevanceAd-com>
    </Modal>
  </div>
</template>
<script>
import axios from "@/libs/api.request";
import { getToken, uuid } from "@/libs/util";
import { columns } from "./options/option";
import moment from "moment";
import hasShowAccess from "@/libs/hasShowAccess.js";
moment.locale("zh-cn");
export default {
  name: "shortUrlCustom",
  components: {
    "relevanceAd-com": () => import("./components/adList.vue")
  },
  data() {
    const validateUrl = (rule, value, callback) => {
      let reg = /(http|https):\/\/([\w.]+\/?)\S*/;
      if (!reg.test(value)) {
        callback(new Error("url格式不正确"));
      } else {
        callback();
      }
    };
    return {
      handleSubmitLoading: false,
      timingOptions: {
        disabledDate(date) {
          return date && date.valueOf() < Date.now() - 86400000;
        }
      },
      headers: {
        "X-Client-Token": getToken(),
        "X-Client-Sdk": 2,
        "X-App-Id": "sdt_back_manager",
        "X-App-Version": 1,
        "X-Client-Time": Date.now(),
        "X-Request-Id": uuid(),
        "X-Request-Type": "",
        "X-Tdbear-Id": "",
        "X-Client-Unique": ""
      },
      relevanceAd: false,
      columns,
      onloadUrl:
        process.env.NODE_ENV === "production" ? "/page/static/" : "/static/",
      importM: false,
      uploadLoading: false,
      importModal: false,
      addModal: false,
      formItem: {
        code: "",
        adName: "",
        adId: "",
        fullUrl: "",
        submitTime: []
      },
      page: {
        totalCount: 0,
        pageIndex: 1,
        pageSize: 10
      },
      rowDataLoading: false,
      vendorOptions: [
        { value: 5, label: "VIVO" },
        { value: 1, label: "OPPO" },
        { value: 2, label: "金立" },
        { value: 3, label: "乐视" },
        { value: 4, label: "ZUK" },
        { value: 9, label: "NEX3" },
        { value: 6, label: "一加" }
      ],
      rowData: [],
      addForm: {
        code: "",
        name: "",
        urlDesc: "",
        fullUrl: "",
        replaceStatus: "1",
        replaceTime: ""
      },
      addRuleValidate: {
        replaceStatus: [
          {
            required: true,
            message: "选择生效时间",
            trigger: "change"
          }
        ],
        code: [
          {
            required: true,
            message: "code为必填项",
            trigger: "blur"
          }
        ],
        name: [
          {
            required: true,
            message: "短链名称必填",
            trigger: "blur"
          }
        ],
        fullUrl: [
          {
            required: true,
            message: "url必填",
            trigger: "blur"
          },
          {
            required: true,
            validator: validateUrl,
            trigger: "blur"
          }
        ],
        replaceTime: [
          {
            type: "date",
            required: true,
            message: "请选择生效时间",
            trigger: "change"
          }
        ]
      },
      addType: "add",
      uploadResponse: {
        success_count: 0,
        error_count: 0,
        result_excel: ""
      },
      reqFiles: {
        files: null,
        fileName: ""
      },
      handleId: 0
    };
  },
  computed: {
    showAccess() {
      return el => {
        return hasShowAccess(el);
      };
    },
    timingDateMoment() {
      if (this.timingDate) {
        return moment(this.timingDate.getTime()).format("YYYY-MM-DD HH:mm:ss");
      } else {
        return "";
      }
    }
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
  created() {
    this.search(true);
  },

  methods: {
    exportSearch() {
      axios
        .request({
          url: "/ad/shorturl/export",
          method: "post",
          data: {
            code: this.formItem.code,
            fullUrl: this.formItem.fullUrl,
            adId: this.formItem.adId,
            adName: this.formItem.adName,
            startTime: this.formItem.submitTime[0],
            endTime: this.formItem.submitTime[1]
          },
          headers: {
            "Content-Type": "application/json"
          },
          responseType: "blob"
        })
        .then(res => {
          const link = document.createElement("a");
          let blob = new Blob([res.data], { type: "application/vnd.ms-excel" });
          link.style.display = "none";
          link.href = URL.createObjectURL(blob);
          link.setAttribute(
            "download",
            "短链定制" +
              (this.formItem.submitTime[0]
                ? this.formItem.submitTime[0] +
                  "-" +
                  this.formItem.submitTime[1]
                : "") +
              ".xlsx"
          );
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        })
        .catch(err => {
          console.log(err);
          this.$Message.error("导出失败");
        });
    },
    openAdModal(row) {
      this.relevanceAd = true;
      this.handleId = row.id;
      this.$refs.relevanceAd.uploadData();
    },
    closeAdModal() {
      this.relevanceAd = false;
      this.search();
    },
    submitTimeChange(data) {
      this.formItem.submitTime = data;
    },
    resetFormItem() {
      this.$refs.formItem.resetFields();
    },
    closeModal() {
      this.importModal = false;
      this.importM = false;
    },
    search(flag) {
      this.rowDataLoading = true;
      if (flag) {
        this.page.pageIndex = 1;
      }
      axios
        .request({
          url: "/ad/shorturl/query",
          method: "post",
          data: {
            pageSize: this.page.pageSize,
            pageIndex: this.page.pageIndex - 1,
            code: this.formItem.code,
            fullUrl: this.formItem.fullUrl,
            adId: this.formItem.adId,
            adName: this.formItem.adName,
            startTime: this.formItem.submitTime[0],
            endTime: this.formItem.submitTime[1]
          }
        })
        .then(res => {
          if (res.data.code == 0) {
            this.rowData = res.data.data.data;
            this.page.totalCount = res.data.data.total;
          } else {
            this.$Message.error(res.data.msg);
          }
          this.rowDataLoading = false;
        })
        .catch(err => {
          this.$Message.error("网络错误");
          this.rowDataLoading = false;
        });
    },
    pageChange(index) {
      this.page.pageIndex = index;
      this.search();
    },
    pageSizeChange(size) {
      this.page.pageSize = size;
      this.search();
    },
    add(type, row) {
      this.addType = type;
      if (row) {
        this.addForm = JSON.parse(JSON.stringify(row));
        this.addForm.replaceStatusFixed = this.addForm.replaceStatus = this.addForm.replaceStatus.toString();
        this.addForm.replaceTime = moment(this.addForm.replaceTime).format(
          "YYYY-MM-DD HH:mm:ss"
        );
      }
      this.addModal = true;
    },
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          let postData = {
            replaceStatus: this.addForm.replaceStatus,
            replaceTime: this.addForm.replaceTime
              ? moment(this.addForm.replaceTime).format("YYYY-MM-DD HH:mm:ss")
              : "",
            fullUrl: this.addForm.fullUrl,
            name: this.addForm.name,
            urlDesc: this.addForm.urlDesc
          };
          if (this.addType == "update") {
            postData.id = this.addForm.id;
          } else {
            postData.code = this.addForm.code;
          }
          let url =
            this.addType == "update"
              ? "/ad/shorturl/update"
              : "/ad/shorturl/add";
          this.handleSubmitLoading = true;
          axios
            .request({
              url,
              method: "post",
              data: postData
            })
            .then(res => {
              if (res.data.code === 0) {
                if (this.addType == "update") {
                  this.$Message.success("修改成功");
                } else {
                  this.$Message.success("添加成功");
                }
                this.addModal = false;
                this.handleSubmitLoading = false;
                this.search();
              } else {
                this.handleSubmitLoading = false;
                this.$Message.error(res.data.msg);
              }
            })
            .catch(err => {
              this.handleSubmitLoading = false;
              this.$Message.error("请求异常，请稍后再试！");
            });
        }
      });
    },
    closeAddModal(flag) {
      if (!flag) {
        this.handleReset("addForm");
      }
    },
    handleReset(name) {
      this.addForm = {
        code: "",
        name: "",
        urlDesc: "",
        url: "",
        replaceStatus: "1",
        replaceTime: ""
      };
      this.$refs.addForm.resetFields();
    },
    beforeUpload(file) {
      //console.log(file);
      this.reqFiles.files = file;
      this.reqFiles.fileName = file.name;
      return false;
      //return false
    },
    handleUpload() {
      if (this.reqFiles.files == null) {
        this.$Message.error("请选择导入文件！");
        return;
      } else {
        this.uploadLoading = true;
        this.$refs.uploadBatch.post(this.reqFiles.files);
      }
    },
    uploadSuccess(response, file, fileList) {
      this.uploadLoading = false;
      //console.log(response);
      if (response.code == 0) {
        console.log(response);
        this.importModal = true;
        this.uploadResponse.success_count = response.data.successCount;
        this.uploadResponse.error_count = response.data.errorCount;
        this.uploadResponse.errorDetail = response.data.errorDetail;
        this.uploadResponse.result_excel = response.data.result_excel;
        this.reqFiles = {
          files: null,
          fileName: ""
        };
      } else {
        this.$Message.error("接口异常");
      }
    },
    fileTagClose() {
      this.reqFiles = {
        files: null,
        fileName: ""
      };
    },
    uploadError(error, file, fileList) {
      this.uploadLoading = false;
      this.$Message.error("导入失败");
    },
    importExcel() {
      this.importM = true;
    },
    checkResult() {
      window.open(this.uploadResponse.result_excel);
    },
    importBatchImportClose(type) {
      if (!type) {
        this.reqFiles = {
          files: null,
          fileName: ""
        };
      }
    },
    cancelAdModal(row) {
      axios
        .request({
          url: "/ad/shorturl/cancelad",
          method: "post",
          data: {
            id: row.id
          }
        })
        .then(d => {
          if (d.data.code == 0) {
            this.$Message.success("已取消关联!");
            this.search();
          } else {
            this.$Message.error(d.data.msg);
          }
        })
        .catch(() => {
          this.$Message.error("请求失败!");
        });
    },
    cancelTiming(row) {
      let postData = {
        replaceStatus: 1,
        replaceTime: "",
        fullUrl: row.fullUrl,
        name: row.name,
        urlDesc: row.urlDesc,
        id: row.id
      };
      let url = "/ad/shorturl/update";
      axios
        .request({
          url,
          method: "post",
          data: postData
        })
        .then(res => {
          if (res.data.code === 0) {
            this.$Message.success("取消成功");
            this.search();
          } else {
            this.$Message.error(res.data.msg);
          }
        })
        .catch(err => {
          this.$Message.error("请求异常，请稍后再试！");
        });
    }
  }
};
</script>
<style scoped lang="less">
.textOverFlow {
  overflow : hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
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
