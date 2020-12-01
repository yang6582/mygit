<template>
  <div>
    <Form
      :model="formItem"
      :label-width="100"
      :inline="true"
      style="margin-top: 20px"
      @submit.native.prevent
    >
      <FormItem label="厂商:">
        <Select
          v-model="formItem.partnerIds"
          style="width:150px"
          placeholder="请选择"
          @on-change="vendorChange"
        >
          <Option
            v-for="item in vendorOptions"
            :value="item.value"
            :key="item.value"
          >{{ item.label }}</Option>
        </Select>
      </FormItem>
      <FormItem label="规则ID:">
        <Input v-model="formItem.serviceId" placeholder="规则ID" clearable @on-enter="search(true)" />
      </FormItem>
      <FormItem label="按钮类型:">
        <Select
          clearable
          v-model="formItem.actionType"
          style="width:150px"
          placeholder="请选择"
          @on-change="search(true)"
        >
          <Option value="3">打开URL</Option>
          <Option value="28">打开快应用</Option>
          <Option value="6">打开APP</Option>
        </Select>
      </FormItem>
      <FormItem :label-width="30">
        <Button type="primary" style="margin-left:10px" @click="search(true)">查询</Button>
        <Button type="primary" style="margin-left: 10px" @click="add('add')" v-if="showAccess('队列管理_下一步队列_新增')">新增</Button>
        <Button type="primary" style="margin-left: 10px" @click="importExcel" v-if="showAccess('队列管理_下一步队列_批量导入')">批量导入</Button>
      </FormItem>
    </Form>
    <div>
      <Table
        border
        :columns="columns"
        :data="rowData"
        align="center"
        key="rowData"
        :loading="rowDataLoading"
      >
        <!-- <template slot-scope="{row, index}" slot="menuType">
          <span>{{row.sms_menu ? row.sms_menu.type : ''}}</span>
        </template>-->
        <!-- <template slot-scope="{row, index}" slot="menuDetails">
          <Tooltip placement="top" max-width="200">
            <div
              slot="content"
            >{{row.sms_menu ? ((row.sms_menu.type == 'app' || row.sms_menu.type == 'fastapp' )? (row.sms_menu.extendData.deeplink || row.sms_menu.extendData.packageName) : row.sms_menu.data) : ''}}</div>
            <Button size="small" style="color:#59afed">查看</Button>
          </Tooltip>
        </template>-->
        <template slot-scope="{row, index}" slot="actionType">
          <span>{{row.actionType == 3 ? '打开URL' : (row.actionType == 6 ? '打开APP' : (row.actionType == 28 ? '打开快应用' : ''))}}</span>
        </template>
        <template slot-scope="{row, index}" slot="buttonPosition">
          <span>{{row.buttonPosition == 0 ? '不固定' : (row.buttonPosition == 1000 ? '左' : (row.buttonPosition == 2000 ? '中' : '右'))}}</span>
        </template>
        <template slot-scope="{ row, index }" slot="operator">
          <div style="padding:10px 0;">
            <Button type="primary" size="small" @click="add('update',row)" v-if="showAccess('队列管理_下一步队列_修改')">修改</Button>
            <Button
              type="error"
              size="small"
              style="margin-left:10px;"
              @click="delModalOpen(row)"
               v-if="showAccess('队列管理_下一步队列_删除')"
            >删除</Button>
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
      <div style="padding-right:40px;">
        <Form
          ref="configurationRules"
          :model="configurationForm"
          :rules="configurationRules"
          :label-width="120"
        >
          <!-- <FormItem label="规则ID：" prop="serviceId">
            <Select
              :disabled="addType == 'update'"
              ref="shopSelect"
              v-model="configurationForm.serviceId"
              filterable
              clearable
              remote
              :remote-method="getAllRuleId"
              :loading="getRuleIdLoading"
            >
              <Option v-for="item in allRuleId" :value="item.name" :key="item.id">{{item.name}}</Option>
            </Select>
          </FormItem>-->
          <FormItem label="规则ID：" prop="serviceId">
            <Input
              v-model="configurationForm.serviceId"
              :disabled="addType == 'update'"
              @on-keyup="configurationForm.serviceId=configurationForm.serviceId.replace(/^(0+)|[^\d]+/g,'')"
              placeholder="请输入"
              clearable
            ></Input>
          </FormItem>
          <FormItem label="厂商:" prop="partnerIds">
            <Select
              v-model="configurationForm.partnerIds"
              placeholder="请选择"
              multiple
              :disabled="addType == 'update'"
            >
              <Option
                v-for="item in vendorOptions"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem label="按钮类型：">
            <RadioGroup v-model="configurationForm.actionType">
              <Radio label="3">打开URL</Radio>
              <Radio label="28">打开快应用</Radio>
              <Radio label="6">打开APP</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="button文字：" prop="buttonText">
            <Input v-model="configurationForm.buttonText" placeholder="请输入" clearable></Input>
          </FormItem>
          <FormItem
            label="快应用包名："
            v-if="configurationForm.actionType == 28"
            prop="packageName"
            key="quickPackageName"
          >
            <Input v-model="configurationForm.packageName" placeholder="请输入" clearable></Input>
          </FormItem>
          <FormItem label="版本号：" v-if="configurationForm.actionType == 28" prop="appVersion">
            <Input v-model="configurationForm.appVersion" placeholder="请输入" clearable></Input>
          </FormItem>
          <FormItem
            label="快应用链接："
            v-if="configurationForm.actionType == 28"
            prop="deepLink"
            key="quickLinkUrl"
          >
            <Input v-model="configurationForm.deepLink" placeholder="请输入" clearable></Input>
          </FormItem>
          <FormItem label="备用链接：" v-if="configurationForm.actionType == 28" prop="additionalAttr">
            <Input v-model="configurationForm.additionalAttr" placeholder="请输入" clearable></Input>
          </FormItem>
          <FormItem
            label="app包名："
            v-if="configurationForm.actionType == 6"
            prop="packageName"
            key="appPackageName"
          >
            <Input v-model="configurationForm.packageName" placeholder="请输入" clearable></Input>
          </FormItem>

          <FormItem
            label="app名称："
            v-if="configurationForm.actionType == 6"
            prop="appName"
            key="appName"
          >
            <Input v-model="configurationForm.appName" placeholder="请输入" clearable></Input>
          </FormItem>
          <FormItem
            label="应用链接："
            v-if="configurationForm.actionType == 6"
            prop="deepLink"
            key="appLinkUrl"
            :rules="[]"
          >
            <Input v-model="configurationForm.deepLink" placeholder="请输入" clearable></Input>
          </FormItem>
          <FormItem
            label="链接URL："
            v-if="configurationForm.actionType == 3"
            prop="linkUrl"
            key="webLinkUrl"
          >
            <Input v-model="configurationForm.linkUrl" placeholder="请输入" clearable></Input>
          </FormItem>
          <FormItem
            label="监控链接显示："
            v-if="configurationForm.actionType == 3 || configurationForm.actionType == 6"
            prop="monitorLinkShow"
            key="monitorLinkShow"
          >
            <Input v-model="configurationForm.monitorLinkShow" placeholder="请输入" clearable></Input>
          </FormItem>
          <FormItem
            label="监控链接点击："
            v-if="configurationForm.actionType == 3 || configurationForm.actionType == 6"
            prop="monitorLinkClick"
            key="monitorLinkClick"
          >
            <Input v-model="configurationForm.monitorLinkClick" placeholder="请输入" clearable></Input>
          </FormItem>
          <!-- <FormItem label="左图标URL：" prop="leftIconUrl">
            <Input v-model="configurationForm.leftIconUrl" placeholder="请输入"></Input>
          </FormItem>
          <FormItem label="右图标URL：" prop="rightIconUrl">
            <Input v-model="configurationForm.rightIconUrl" placeholder="请输入"></Input>
          </FormItem>-->
          <!-- <FormItem label="显示方式：">
            <RadioGroup v-model="configurationForm.display">
              <Radio :label="1">按钮</Radio>
            </RadioGroup>
          </FormItem>-->
          <FormItem label="顺序：" prop="queueIndex" key="queueIndex">
            <Input v-model="configurationForm.queueIndex" placeholder="请输入" clearable></Input>
          </FormItem>
          <FormItem label="位置：" prop="buttonPosition" key="buttonPosition">
            <RadioGroup v-model="configurationForm.buttonPosition">
              <Radio label="0">不固定</Radio>
              <Radio label="1000">左</Radio>
              <Radio label="2000">中</Radio>
              <Radio label="3000">右</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="显示类型：" prop="displayType" key="displayType">
            <Select v-model="configurationForm.displayType" placeholder="请选择">
              <Option label="1" value="1"></Option>
              <Option label="2" value="2"></Option>
            </Select>
          </FormItem>
          <!-- <FormItem label="position：">
            <Select v-model="configurationForm.position" placeholder="请选择">
              <Option label="1000" :value="1000"></Option>
              <Option label="2000" :value="2000"></Option>
              <Option label="3000" :value="3000"></Option>
            </Select>
          </FormItem>-->
        </Form>
      </div>
      <div slot="footer">
        <Button @click="addModal = false">取消</Button>
        <Button
          type="primary"
          style="margin-left:10px;"
          @click="handleSubmit('configurationRules')"
        >确定</Button>
      </div>
    </Modal>
    <Modal
      title="删除"
      v-model="delModal"
      @on-ok="delOk"
      @on-cancel="delCancel"
      :mask-closable="false"
    >
      <div style="padding:40px;text-align:center;font-size:18px;">确认删除当前内容</div>
    </Modal>
    <Modal title="导入完成" v-model="importModal" :mask-closable="false" width="700">
      <div style="text-align:center;font-size:14px;">
        <p
          style="margin-bottom:20px;"
        >本次上传{{uploadResponse.successCount +uploadResponse.errorCount}}条，其中{{uploadResponse.successCount}}条导入成功，{{uploadResponse.errorCount}}条导入失败</p>
        <div
          style="height:400px;overflow:auto;padding-left:40px;"
          v-if="uploadResponse.errorDetail.length"
        >
          <p v-for="(item,index) in uploadResponse.errorDetail" style="text-align:left;">{{item}}</p>
        </div>
      </div>
      <div slot="footer">
        <Button type="primary" @click="checkResult" v-if="false">查看结果</Button>
        <Button @click="closeModal" style="margin-left:10px;">返回</Button>
      </div>
    </Modal>
    <Modal
      title="批量导入"
      v-model="importM"
      :mask-closable="false"
      @on-visible-change="importBatchImportClose"
    >
      <div class="importContent">
        <Upload
          ref="uploadBatch"
          action="/ad/nextstep/queue/import"
          accept=".xls, .xlsx"
          :headers="headers"
          :show-upload-list="false"
          :before-upload="beforeUpload"
          :on-success="uploadSuccess"
          :on-error="uploadError"
        >
          <Button>选择文件</Button>
        </Upload>
        <a :href="onloadUrl+'下一步队列导入模板.xlsx'" download="下一步队列导入模板.xlsx">
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
  </div>
</template>
<script>
import axios from "@/libs/api.request";
import { getToken, uuid } from "@/libs/util";
import { columns } from "./options/option";
import hasShowAccess from "@/libs/hasShowAccess.js";
import moment from "moment";
moment.locale("zh-cn");
export default {
  name: "menuQue",
  components: {
    columnsSelect: () => import("@/components/columns-select")
  },
  data() {
    const validateWhite = (rule, value, callback) => {
      if (value.trim() == "") {
        callback(new Error("空格无效"));
      } else {
        callback();
      }
    };
    const validUrlPass = (rule, value, callback) => {
      if (!value) {
        callback(new Error("链接不能为空"));
      } else if (value && !/(http|https):\/\/([\w.]+\/?)\S*/.test(value)) {
        callback(new Error("链接格式不正确"));
      } else {
        callback();
      }
    };
    return {
      getRuleIdLoading: false,
      allRuleId: [],
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
      columns,
      onloadUrl:
        process.env.NODE_ENV === "production" ? "/page/static/" : "/static/",
      importM: false,
      getRuleIdLoading: false,
      allShops: [],
      uploadLoading: false,
      importModal: false,
      addModal: false,
      delModal: false,
      formItem: {
        partnerIds: "5",
        serviceId: "",
        actionType: ""
      },
      page: {
        totalCount: 0,
        pageIndex: 1,
        pageSize: 10
      },
      rowDataLoading: false,
      vendorOptions: [
        { value: "5", label: "VIVO" },
        { value: "1", label: "OPPO" },
        { value: "2", label: "金立" },
        { value: "3", label: "乐视" },
        { value: "4", label: "ZUK" },
        { value: "9", label: "NEX3" },
        { value: "6", label: "一加" }
      ],
      rowData: [{}],
      configurationForm: {
        serviceId: "",
        actionType: "3",
        buttonPosition: "0",
        displayType: "1",
        partnerIds: []
      },
      configurationRules: {
        deepLink: [
          { required: true, message: "请输入快应用链接", trigger: "blur" }
        ],
        serviceId: [
          { required: true, message: "请输入规则Id", trigger: "blur" },
          { validator: validateWhite, trigger: "blur" }
        ],
        buttonText: [
          { required: true, message: "请输入button文字", trigger: "blur" },
          { validator: validateWhite, trigger: "blur" }
        ],
        linkUrl: [
          { required: true, message: "请输入地址", trigger: "blur" },
          { validator: validateWhite, trigger: "blur" },
          {
            required: true,
            validator: validUrlPass,
            trigger: "blur"
          }
        ],
        appName: [
          { required: true, message: "请输入app名称", trigger: "blur" },
          { validator: validateWhite, trigger: "blur" }
        ],
        packageName: [
          { required: true, message: "请输入快应用包名", trigger: "blur" },
          { validator: validateWhite, trigger: "blur" }
        ],
        appVersion: [
          { required: true, message: "请输入快应用版本号", trigger: "blur" }
        ],
        buttonPosition: [
          { required: true, message: "请选择位置", trigger: "change" }
        ],
        displayType: [
          { required: true, message: "请选择类型", trigger: "change" }
        ],
        partnerIds: [
          {
            required: true,
            type: "array",
            min: 1,
            message: "至少选择一个厂商",
            trigger: "change"
          }
        ]
      },
      addType: "add",
      uploadResponse: {
        successCount: 0,
        errorCount: 0,
        result_excel: "",
        errorDetail: []
      },
      reqFiles: {
        files: null,
        fileName: ""
      },
      partnerId: 5
    };
  },
  computed: {
    showAccess() {
      return el => {
        return hasShowAccess(el);
      };
    }
  },
  created() {
    this.search(true);
  },
  methods: {
    closeModal() {
      this.importModal = false;
      this.importM = false;
    },
    vendorChange(value) {
      this.partnerId = value;
      this.search(true);
    },
    search(flag) {
      this.rowDataLoading = true;
      if (flag) {
        this.page.pageIndex = 1;
      }
      axios
        .request({
          url: "ad/nextstep/queue/query",
          method: "post",
          data: {
            pageIndex: this.page.pageIndex - 1,
            pageSize: this.page.pageSize,
            partnerId: this.formItem.partnerIds,
            serviceId: this.formItem.serviceId,
            actionType: this.formItem.actionType
          }
        })
        .then(res => {
          if (res.data.code == 0) {
            this.rowData = res.data.data.data;
            this.rowData.forEach((item, index) => {
              item.serviceId = item.serviceId + "";
              item.displayType = item.displayType + "";
              item.buttonPosition = item.buttonPosition + "";
              item.actionType = item.actionType + "";
              item.partnerIds = item.partnerIds.map(pitem => {
                return pitem + "";
              });
            });
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
        this.configurationForm = JSON.parse(JSON.stringify(row));
      } else {
        this.configurationForm = {
          serviceId: "",
          actionType: "3",
          buttonPosition: "0",
          displayType: "1",
          partnerIds: []
        };
      }
      this.addModal = true;
    },
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          let params = JSON.parse(JSON.stringify(this.configurationForm));
          if (this.addType == "update") {
            delete params.createTime;
            delete params.leftIconUrl;
            delete params.rightIconUrl;
            delete params.updateTime;
            delete params._index;
            delete params._rowKey;
          }
          for (let key in params) {
            if (typeof params[key] == "string") {
              params[key] = params[key].trim();
            }
          }
          let url =
            this.addType == "update"
              ? "/ad/nextstep/queue/update"
              : "/ad/nextstep/queue/add";
          axios
            .request({
              url,
              method: "post",
              data: params
            })
            .then(res => {
              if (res.data.code === 0) {
                if (this.addType == "update") {
                  this.$Message.success("修改成功");
                } else {
                  this.$Message.success("添加成功");
                }
                this.addModal = false;
                this.search();
              } else {
                this.$Message.error(res.data.msg);
              }
            })
            .catch(err => {
              this.$Message.error("请求异常，请稍后再试！");
            });
          //this.$Message.success("Success!");
        } else {
          this.$Message.error("请填写完整信息!");
        }
      });
    },
    closeAddModal(flag) {
      if (!flag) {
        this.handleReset("configurationRules");
      }
    },
    handleReset(name) {
      this.$refs[name].resetFields();
    },
    formReset() {
      this.configurationForm.packageName = "";
      this.configurationForm.appVersion = "";
      this.configurationForm.linkUrl = "";
      this.configurationForm.deepLink = "";
      this.configurationForm.additionalAttr = "";
      this.configurationForm.appName = "";
      this.configurationForm.monitorLinkShow = "";
      this.configurationForm.monitorLinkClick = "";
    },
    delOk() {
      let param = {
        id: this.id
      };
      axios
        .request({
          url: "/ad/nextstep/queue/delete",
          method: "post",
          data: param
        })
        .then(res => {
          if (res.data.code === 0) {
            this.$Message.success("删除成功");
            this.search();
          } else {
            this.$Message.error("请求异常，请稍后再试！");
          }
        })
        .catch(err => {
          this.$Message.error("请求异常，请稍后再试！");
        });
    },
    delCancel() {
      this.delModal = false;
    },
    delModalOpen(row) {
      this.id = row.id;
      this.delModal = true;
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
        this.importModal = true;
        this.uploadResponse.successCount = response.data.successCount;
        this.uploadResponse.errorCount = response.data.errorCount;
        this.uploadResponse.errorDetail = response.data.errorDetail;
        this.uploadResponse.result_excel = response.data.result_excel;
        this.reqFiles = {
          files: null,
          fileName: ""
        };
        this.search(true);
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
    getAllRuleId(query) {
      this.getRuleIdLoading = true;
      let param = { shopName: query };
      axios
        .request({
          url: "/ad/shops/names",
          method: "post",
          data: param
        })
        .then(res => {
          if (res.data.code === 0) {
            this.allRuleId = res.data.data;
            this.getRuleIdLoading = false;
          } else {
            this.$Message.error("请求异常，请稍后再试！");
          }
        })
        .catch(err => {
          this.$Message.error("请求失败，" + err + "，请稍后再试！");
          this.getRuleIdLoading = false;
        });
    },
    importBatchImportClose(type) {
      if (!type) {
        this.reqFiles = {
          files: null,
          fileName: ""
        };
      }
    }
  }
};
</script>
<style scoped lang="less">
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
