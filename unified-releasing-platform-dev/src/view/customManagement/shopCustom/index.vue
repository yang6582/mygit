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
          v-model="formItem.vendor"
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
      <FormItem label="定制状态:">
        <Select
          v-model="formItem.custom"
          style="width:150px"
          placeholder="请选择"
          @on-change="customChange"
        >
          <Option
            v-for="item in customOptions"
            :value="item.value"
            :key="item.value"
          >{{ item.label }}</Option>
        </Select>
      </FormItem>
      <FormItem label="商户名称:">
        <Input
          v-model="formItem.merchant_name"
          placeholder="商户名称"
          clearable
          @on-enter="search(true)"
        />
      </FormItem>
      <FormItem label="可送审vivo:" v-if="formItem.vendor == 5">
        <Select
          v-model="formItem.smsMenuNeedVivoApproval"
          style="width:150px"
          placeholder="请选择"
          @on-change="search(true)"
        >
          <Option :value="-1">全部</Option>
          <Option :value="1">是</Option>
          <Option :value="0">否</Option>
        </Select>
      </FormItem>
      <FormItem label="vivo状态:" v-if="formItem.vendor == 5 && formItem.smsMenuNeedVivoApproval != 0">
        <Select
          v-model="formItem.vivoStatus"
          style="width:150px"
          placeholder="请选择"
          @on-change="search(true)"
        >
          <Option
            v-for="item in vivoStausOptions"
            :value="item.value"
            :key="item.value"
          >{{ item.label }}</Option>
        </Select>
      </FormItem>
      <FormItem :label-width="30">
        <Button type="primary" style="margin-left:10px" @click="search(true)">查询</Button>
        <Button type="primary" @click="reset" style="margin-left:10px">重置</Button>
      </FormItem>
    </Form>
    <div style="margin-bottom:10px;">
      <Button
        type="primary"
        style
        icon="md-arrow-round-up"
        @click="assignModal = true"
        v-if="showAccess('菜单管理_商户定制_指定上线')"
      >指定上线</Button>
      <Button
        type="primary"
        style="margin-left:30px"
        icon="md-arrow-round-up"
        @click="batchOnline"
        v-if="showAccess('菜单管理_商户定制_批量上线')"
      >批量上线</Button>
      <Button
        type="primary"
        style="margin-left:30px"
        icon="md-arrow-round-down"
        @click="openInsModal('batch')"
        v-if="showAccess('菜单管理_商户定制_批量下线')"
      >批量下线</Button>
      <Button
        type="primary"
        style="margin-left:30px"
        @click="batchImport"
        v-if="showAccess('菜单管理_商户定制_批量导出')"
      >批量导出</Button>
      <Button
        type="primary"
        style="margin-left:30px"
        @click="batchImportModal = true"
        v-if="showAccess('菜单管理_商户定制_批量导入')"
      >批量导入</Button>
      <Button
        type="primary"
        style="margin-left:30px"
        @click="importVivoShop = true"
        v-if="this.formItem.vendor == 5 && showAccess('菜单管理_商户定制_添加/移除送审vivo商户')"
      >添加/移除送审vivo商户</Button>
      <Button
        type="primary"
        style="margin-left:30px"
        @click="batchSendVivo"
        v-if="this.formItem.vendor == 5 && showAccess('菜单管理_商户定制_批量送审vivo')"
      >批量送审vivo</Button>
    </div>
    <div>
      <Table
        border
        :columns="vivoShowColumns"
        :data="rowData"
        align="center"
        key="rowData"
        :loading="rowDataLoading"
        @on-selection-change="onSelChange"
      >
        <template slot-scope="{row, index}" slot="logo">
          <img :src="row.logo" alt style="width:50px;height:50px;margin:10px 0;" v-if="row.logo" />
          <span v-else>无</span>
        </template>
        <template slot-scope="{row, index}" slot="customTime">
          <span>{{row.customTime ? formatDate(row.customTime) : ''}}</span>
        </template>
        <template slot-scope="{row, index}" slot="autoOnlineTime">
          <span v-html="formatAutoOnlineTime(row.autoOnlineTime)"></span>
        </template>
        <template slot-scope="{row, index}" slot="vivoApprovalDetail">
          <Poptip
            trigger="hover"
            title="回传结果"
            v-if="row.vivoApprovalStatus != 0 && row.vivoApprovalDetail"
          >
            <Button size="small">查看</Button>
            <div class="api" slot="content">
              <div v-html="vivoApprovalDetailFormat(row.vivoApprovalDetail)">
                <!-- {{}} -->
              </div>
            </div>
          </Poptip>
        </template>
        <template slot-scope="{row, index}" slot="vivoApprovalStatus">
          <span>{{row.smsMenuNeedVivoApproval ? vivoApprovalStatusName[row.vivoApprovalStatus] : '无需送审'}}</span>
          <!-- <span>{{ vivoApprovalStatusName[row.vivoApprovalStatus] }}</span> -->
        </template>
        <template slot-scope="{row, index}" slot="smsMenuNeedVivoApproval">
          <span>{{row.smsMenuNeedVivoApproval ? '是' :'否'}}</span>
        </template>
        <template slot-scope="{row, index}" slot="customStatus">
          <span>{{customOptions2[row.customStatus]}}</span>
        </template>
        <template slot-scope="{row, index}" slot="industry">
          <span>{{industryComputed(row)}}</span>
        </template>
        <template slot-scope="{row, index}" slot="manual_inteervention">
          <!-- <div style="display:flex;"> -->
          <Button
            style
            type="warning"
            size="small"
            v-if="row.manual_inteervention == 2 && showAccess('菜单管理_商户定制_人工干预')"
            icon="md-contacts"
            @click="handleIntervene(row)"
          >人工干预</Button>
          <Button
            style
            type="info"
            size="small"
            v-else-if="row.manual_inteervention == 1  && showAccess('菜单管理_商户定制_取消干预')"
            @click="handleIntervene(row)"
            icon="md-contacts"
          >取消干预</Button>
          <!-- </div> -->
        </template>
        <template slot-scope="{row, index}" slot="operator">
          <div style="display:flex;">
            <Button
              style
              type="primary"
              size="small"
              @click="openEdit(row)"
              v-if="showAccess('菜单管理_商户定制_编辑')"
            >编辑</Button>
            <Button
              style="margin-left: 10px;"
              size="small"
              @click="handleOnline(row)"
              type="info"
              v-if="showAccess('菜单管理_商户定制_上线') && ( row.customStatus == 2 || row.customStatus == 4) && !row.blackShopFlag"
            >上线</Button>
            <Button
              style="margin-left: 10px;"
              type="error"
              size="small"
              v-if="(row.customStatus == 1 || row.customStatus == 4) && showAccess('菜单管理_商户定制_下线')"
              @click="openInsModal('one',row)"
            >下线</Button>
            <Button
              style="margin-left: 10px;"
              size="small"
              type="dashed"
              v-if=" row.smsMenus && formItem.vendor == 5
                && showAccess('菜单管理_商户定制_送审vivo') && !row.blackShopFlag"
              @click="sendVivo(row)"
            >送审vivo</Button>
            <Button
              style="margin-left: 10px;"
              size="small"
              type="success"
              v-if="row.customStatus != 0 && showAccess('菜单管理_商户定制_定时上线')  && !row.blackShopFlag"
              @click="timingOnline(row)"
            >定时上线</Button>
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
    <Modal title="下线" v-model="insModal" :mask-closable="false">
      <div style="padding:0 40px;">
        <h4 style="color:red;font-size:18px;margin-bottom:10px;">确定是否要下线商户?下线后线上将没有菜单</h4>
        <div style="display:flex;">
          <h5 style="line-height:28px;margin-right:10px;font-size:14px;">请选择原因:</h5>
          <RadioGroup v-model="insRadio" vertical>
            <Radio :label="item.label" v-for="item in insOptions" :key="item.label">
              <span>{{item.title}}</span>
            </Radio>
          </RadioGroup>
        </div>
        <Input
          v-model="insCause"
          type="textarea"
          placeholder="选择其他时,请填写原因"
          :maxlength="30"
          style="margin-left:85px;width:250px;"
          v-if="insRadio == 5"
        />
      </div>
      <div slot="footer">
        <Button @click="insModal = false">取消</Button>
        <Button type="primary" @click="insModalOk" :disabled="insRadio == 5 && !insCause">确定</Button>
      </div>
    </Modal>
    <Modal
      title="指定上线"
      v-model="assignModal"
      :mask-closable="false"
      @on-visible-change="importAssignClose"
    >
      <div class="importContent">
        <Upload
          action="/ad/customizedshops/online/batch/file/async"
          accept=".xls, .xlsx"
          ref="uploadAssign"
          :headers="headers"
          :show-upload-list="false"
          :before-upload="beforeUpload"
          :on-success="uploadSuccess"
          :on-error="uploadError"
        >
          <Button>选择文件</Button>
        </Upload>
        <a :href="onloadUrl +'指定上线模板.xlsx'" download="指定上线模板.xlsx">
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
        <Button @click="assignModal = false" style>取消</Button>
      </div>
    </Modal>
    <Modal
      title="批量导入"
      v-model="batchImportModal"
      :mask-closable="false"
      @on-visible-change="importBatchImportClose"
    >
      <div class="importContent">
        <Upload
          :action="formItem.vendor == 2 ? '/ad/customizedshops/importJinLi': '/ad/customizedshops/import'"
          accept=".xls, .xlsx"
          ref="uploadBatch"
          :headers="headers"
          :show-upload-list="false"
          :before-upload="beforeUploadImport"
          :on-success="uploadSuccessImport"
          :on-error="uploadErrorImport"
        >
          <Button>选择文件</Button>
        </Upload>
        <a
          :href="onloadUrl+'商户导入示例.xlsx'"
          download="商户导入示例.xlsx"
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
          v-if="reqFilesBatch.fileName"
          @on-close="fileTagCloseBatch"
        >{{reqFilesBatch.fileName}}</Tag>
      </div>
      <div slot="footer">
        <Button
          type="primary"
          @click="handleUploadBatch"
          :loading="uploadLoadingImport"
          style
        >{{uploadLoadingImport ? '导入中' :'导入文件'}}</Button>
        <Button @click="batchImportModal = false" style>取消</Button>
      </div>
    </Modal>
    <Modal title="导入完成" v-model="importModal" :mask-closable="false">
      <div style="padding:20px;text-align:center;font-size:14px;">{{uploadSuccessBatchMsg}}</div>
      <!-- <div v-if="uploadSuccessBatchList.length">失败数据:</div>
      <div>
        <Tag
          color="volcano"
          v-for="(item,index) in uploadSuccessBatchList"
          :key="item+index"
        >{{item}}</Tag>
      </div>-->
      <div slot="footer">
        <Button type="primary" @click="checkResult" v-if="uploadResponse.result_excel">查看结果</Button>
        <Button @click="importModalBack" style="margin-left:10px;">返回</Button>
      </div>
    </Modal>
    <Modal title="导入完成" v-model="importModal2" :mask-closable="false" :width="800">
      <div style="padding:40px;text-align:left;font-size:14px;">
        <p style="margin-bottom:15px">{{uploadSuccessBatchMsgNum}}</p>
        <template v-for="item in uploadSuccessMsg">
          <Alert type="error" show-icon>{{item}}</Alert>
        </template>
      </div>
      <div slot="footer">
        <Button @click="importModal2Back" style="margin-left:10px;">返回</Button>
      </div>
    </Modal>
    <Modal
      title="添加/移除送审vivo商户"
      v-model="importVivoShop"
      :mask-closable="false"
      @on-visible-change="importVivoShopClose"
    >
      <RadioGroup v-model="importVivoShopRadio" style="margin-left:20px;margin-bottom:10px;">
        <Radio label="1" :disabled="uploadLoadingVivo">添加送审商户</Radio>
        <Radio label="2" :disabled="uploadLoadingVivo">移除送审商户</Radio>
      </RadioGroup>
      <div class="importContent">
        <Upload
          :action="sendVivoUrl"
          accept=".xls, .xlsx"
          name="file"
          :data="{'partnerId':formItem.vendor}"
          ref="uploadVivoShop"
          :headers="headers"
          :show-upload-list="false"
          :before-upload="beforeUploadImportVivo"
          :on-success="uploadSuccessImportVivo"
          :on-error="uploadErrorImportVivo"
        >
          <Button :disabled="uploadLoadingVivo">选择文件</Button>
        </Upload>
        <a :href="onloadUrl+'批量设置送审商户模板.xlsx'" download="批量设置送审商户模板.xlsx">
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
          :closable="!uploadLoadingVivo"
          color="success"
          style="margin-left:20px;margin-top:10px;"
          v-if="reqFilesVivo.fileName"
          @on-close="fileTagCloseVivo"
        >{{reqFilesVivo.fileName}}</Tag>
      </div>
      <div slot="footer">
        <!-- <Tooltip content="导入中,请勿操作页面" :disabled="!uploadLoadingVivo" always placement="top"> -->
        <Button
          type="primary"
          @click="handleUploadVivo"
          :loading="uploadLoadingVivo"
          style
        >{{uploadLoadingVivo ? '导入中' :'导入文件'}}</Button>
        <!-- </Tooltip> -->
        <Button
          @click="importVivoShop = false"
          :disabled="uploadLoadingVivo"
          style="margin-left:10px;"
        >取消</Button>
      </div>
    </Modal>
    <Modal :title="'定时上线-'+timingTitle" v-model="timingVisible" width="400px;">
      <div style="display:flex;">
        <span style="line-height:32px;margin-right:20px;">定时上线时间:</span>
        <DatePicker
          type="datetime"
          v-model="timingDate"
          placeholder="选择上线时间"
          style="width:200px"
          :options="timingOptions"
        ></DatePicker>
      </div>
      <p
        v-if="timingRow.smsMenuNeedVivoApproval  && formItem.vendor == 5 && timingRow.vivoApprovalStatus == 2"
        style="color:#aaa;margin-top:10px;padding-left:100px;"
      >未通过vivo送审的菜单不会定时上线</p>
      <div slot="footer">
        <Button type="error" @click="timingOffline" v-if="timingRow.autoOnlineTime">取消定时</Button>
        <Button @click="timingOk" style="margin-left:10px;" type="primary">确定</Button>
      </div>
    </Modal>
    <Modal v-model="batchVivoModel" title="批量送审vivo" :mask-closable="false" @on-visible-change="closeBatchModal">
        <p style="color:red;text-align: center;">确定该{{batchPassShops.length}}条广告全部送审vivo么？</p>
        <div v-if="importResult" style="color:red;text-align: center;margin-top: 10px;">成功送审{{batchPassShops.length - importResultFail}}条数据，失败{{importResultFail}}条数据</div>
        <div slot="footer">
          <Button type="primary" style="margin-left:10px;" @click="submitBatchHandler" :disabled="importResult" :loading="batchLoading">确定</Button>
          <Button @click="batchVivoModel=false">取消</Button>
        </div>
      </Modal>
  </div>
</template>
<script>
import axios from "@/libs/api.request";
import { getToken, uuid } from "@/libs/util";
import {
  columns,
  columnsNoVivo,
  customOptions2,
  vivoApprovalStatusName
} from "./options/option";
import { industry1Data, industry2Data } from "./options/industry";
import moment from "moment";
import hasShowAccess from "@/libs/hasShowAccess.js";
moment.locale("zh-cn");
export default {
  name: "shopCustom",
  data() {
    return {
      batchVivoModel: false,
      timingVisible: false,
      timingDate: "",
      timingOptions: {
        disabledDate(date) {
          return date && date.valueOf() < Date.now() - 86400000;
        }
      },
      uploadLoadingVivo: false,
      importVivoShop: false,
      importVivoShopRadio: "1",
      vivoApprovalStatusName,
      headers: {
        "X-Client-Token": getToken(),
        // "X-Client-Token":
        //   "eyJpc0VuYWJsZSI6MSwibGFzdExvZ2luIjoxNTgwODcxOTI3NTA5LCJuaWNrTmFtZSI6InlvdWJpbmdrdW4iLCJ0b2tlbiI6IjYwX3lvdWJpbmdrdW5fMTU4MDg3MTkyNzUwOSIsInVzZXJFbWFpbCI6InlvdWJpbmdrdW5AdGVkZHltb2JpbGUuY24iLCJ1c2VySWQiOjYwLCJ1c2VyTmFtZSI6InlvdWJpbmdrdW4ifQ==",

        "X-Client-Sdk": 2,
        "X-App-Id": "sdt_back_manager",
        "X-App-Version": 1,
        "X-Client-Time": Date.now(),
        "X-Request-Id": uuid(),
        "X-Request-Type": "",
        "X-Tdbear-Id": "",
        "X-Client-Unique": ""
      },
      onloadUrl:
        process.env.NODE_ENV === "production" ? "/page/static/" : "/static/",
      customOptions2,
      columns,
      columnsNoVivo,
      uploadSuccessMsg: [],
      uploadSuccessBatchMsg: "",
      uploadSuccessBatchMsgNum: "",
      uploadSuccessBatchList: [],
      insModal: false,
      importModal2: false,
      importModal: false, //批量导入
      batchImportModal: false,
      uploadLoadingImport: false,
      assignModal: false, //指定上线
      uploadLoading: false,
      partnerId: -1,
      shopId: "",
      insCause: "", //下线原因
      insRadio: "0",
      insOptions: [
        {
          label: "0",
          title: "厂商要求"
        },
        {
          label: "1",
          title: "广告下线"
        },
        {
          label: "2",
          title: "客户投诉"
        },
        {
          label: "3",
          title: "需修改内容"
        },
        {
          label: "4",
          title: "操作失误"
        },
        {
          label: "5",
          title: "其他"
        }
      ],
      formItem: {
        vendor: 5,
        merchant_name: "",
        // ad_name: "",
        custom: -1,
        vivoStatus: -1,
        smsMenuNeedVivoApproval: -1
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
      customOptions: [
        { value: -1, label: "全部" },
        { value: 0, label: "未定制线上无" },
        { value: 1, label: "已定制已上线" },
        { value: 2, label: "已定制未上线" },
        //  { value: 3, label: "未定制线上有" },
        { value: 4, label: "已定制未同步" }
      ],
      vivoStausOptions: [
        { value: -1, label: "全部" },
        { value: 2, label: "未送审" },
        { value: 3, label: "已送审" },
        { value: 0, label: "审核通过" },
        { value: 1, label: "审核拒绝" }
      ],
      rowData: [],
      batchshopIds: [],
      batchOfflineUrl: "",
      batchType: "",
      reqFiles: {
        files: null,
        fileName: ""
      },
      reqFilesBatch: {
        files: null,
        fileName: ""
      },
      uploadResponse: {
        result_excel: ""
      },
      reqFilesVivo: {
        files: null,
        fileName: ""
      },
      timingTitle: "",
      timingRow: {},
      batchVivoModel: false,
      importResult: false,
      importResultFail: 0,
      batchPassShops: [],
      batchLoading: false
    };
  },
  computed: {
    showAccess() {
      return el => {
        return hasShowAccess(el);
      };
    },
    sendVivoUrl() {
      return this.importVivoShopRadio == "1"
        ? "/ad/customizedshops/addSmsMenuToVivoApproval"
        : "/ad/customizedshops/removeSmsMenuToVivoApproval";
    },
    vivoApprovalDetailFormat() {
      return obj => {
        let result = "";
        let detail = JSON.parse(obj);
        for (let key in detail) {
          if (key != "shopId" && key != "time") {
            result +=
              "规则" +
              (key ? key : '""') +
              (detail[key].approvalStatus == 1 ? "未通过，" : "");
            detail[key].result.forEach(item => {
              if (item.code == 1) {
                result += "菜单名称不符合规则：";
                item.text.forEach(sitem => {
                  result += sitem + " ";
                });
                result += "；";
              } else {
                result += "菜单链接不符合规则：";
                item.text.forEach(sitem => {
                  result += sitem + " ";
                });
                result += "；";
              }
            });
            result += "<br>";
          }
        }
        return result;
      };
    },
    vivoShowColumns() {
      return this.formItem.vendor == 5 ? this.columns : this.columnsNoVivo;
    },
    industryComputed(row) {
      return row => {
        if (row.industry) {
          return row.industry;
        } else {
          let industry1 = "";
          let industry2 = "";
          if (row.industry1 && row.industry1 != 0) {
            industry1Data.forEach(item => {
              if (item.value == row.industry1) {
                industry1 = item.text;
              }
            });
            industry2Data[row.industry1].forEach((item, index) => {
              if (item.value == row.industry2) {
                industry2 = item.text;
              }
            });
            return industry1 + "-" + industry2;
          } else {
            return "未指定";
          }
        }
      };
    },
    formatDate() {
      return value => {
        if (value) {
          return moment(value * 1000).format("YYYY-MM-DD HH:mm:ss");
        } else {
          return "";
        }
      };
    },
    timingDateMoment() {
      if (this.timingDate) {
        return moment(this.timingDate.getTime()).format("YYYY-MM-DD HH:mm:ss");
      } else {
        return "";
      }
    },
    formatAutoOnlineTime() {
      return value => {
        if (value) {
          return value.split(" ")[0] + "<br>" + value.split(" ")[1];
        } else {
          return "";
        }
      };
    }
  },
  created() {
    this.search(true);
    this.Observer.$on("refreshShopCustom", () => {
      this.search(true);
    });
  },
  activated(){
    this.search()
  },
  methods: {
    importModal2Back() {
      this.importModal2 = false;
      this.assignModal = false;
    },
    importModalBack() {
      this.importModal = false;
      this.batchImportModal = false;
    },
    search(flag) {
      this.rowDataLoading = true;
      if (flag) {
        this.page.pageIndex = 1;
      }
      let params = {
        pageIndex: this.page.pageIndex - 1,
        pageSize: this.page.pageSize,
        partnerId: this.formItem.vendor,
        shopName: this.formItem.merchant_name.trim(),
        status: this.formItem.custom
      };
      if (this.formItem.vendor == 5) {
        params.smsMenuNeedVivoApproval = this.formItem.smsMenuNeedVivoApproval
        params.smsMenuNeedVivoApproval != 0 ? params.vivoStatus = this.formItem.vivoStatus : null
      } else {
        params.smsMenuNeedVivoApproval = -1
      }
      axios
        .request({
          url: "/ad/customizedshops/list",
          method: "post",
          data: params
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
    reset() {
      this.formItem = Object.assign({}, this.formItem, {
        vendor: 5,
        merchant_name: "",
        custom: -1
      });
    },
    onSelChange(sel) {
      this.partnerId = this.formItem.vendor;
      this.batchshopIds = sel.map(item => {
        return item.id;
      });
      this.batchPassShops = sel
    },
    batchSendVivo () {
      if (!this.batchshopIds.length) {
        this.$Message.warning("未选择操作项");
      } else {
        let noPassShops = this.batchPassShops.filter(row => {
          return !row.smsMenuNeedVivoApproval || !row.smsMenus || row.partnerId != 5 || row.vivoApprovalStatus != 2
        })
        if (noPassShops.length) {
          this.$Message.error(`所选商户数据中有${noPassShops.length}条数据不需要送审vivo,请重新选择！`)
        } else {
          this.batchVivoModel = true
        }  
      }
    },
    batchOnline() {
      if (!this.batchshopIds.length) {
        this.$Message.warning("未选择操作项");
      } else {
        axios
          .request({
            url: "/ad/customizedshops/online/batch/ids",
            method: "post",
            data: {
              partnerId: this.partnerId,
              shopIds: this.batchshopIds
            }
          })
          .then(res => {
            if (res.data.code == 0) {
              this.$Message.success("上线成功");
              this.batchshopIds = [];
              this.search();
            } else {
              this.$Message.error(res.data.msg);
            }
          })
          .catch(err => {
            this.$Message.error("网络错误");
          });
      }
    },
    openEdit(row) {
      this.$router.push({
        path: "/customManagement/menuEdit",
        query: { partnerId: row.partnerId, shopId: row.id }
      });
    },
    handleOnline(row) {
      axios
        .request({
          url: "/ad/customizedshops/online/single",
          method: "post",
          data: {
            partnerId: row.partnerId,
            shopId: row.id
          }
        })
        .then(res => {
          if (res.data.code == 0) {
            this.$Message.success("上线成功");
            this.search();
          } else {
            this.$Message.error(res.data.msg);
          }
        })
        .catch(err => {
          this.$Message.error("网络错误");
        });
    },
    openInsModal(type, row) {
      this.batchType = type;
      if (type == "one") {
        this.partnerId = row.partnerId;
        this.shopId = row.id;
        this.batchOfflineUrl = "/ad/customizedshops/offline/single";
        this.insModal = true;
      } else if (type == "batch") {
        if (!this.batchshopIds.length) {
          this.$Message.warning("未选择操作项");
        } else {
          this.partnerId = this.formItem.vendor;
          this.batchOfflineUrl = "/ad/customizedshops/offline/batch";
          this.insModal = true;
        }
      }
    },
    insModalOk() {
      let postData = {
        partnerId: this.partnerId,
        reason:
          this.insRadio == 5
            ? this.insCause
            : this.insOptions[this.insRadio].title
      };
      if (this.batchType == "one") {
        postData.shopId = this.shopId;
      } else if (this.batchType == "batch") {
        postData.shopIds = this.batchshopIds;
      }
      axios
        .request({
          url: this.batchOfflineUrl,
          method: "post",
          data: postData
        })
        .then(res => {
          if (res.data.code == 0) {
            this.$Message.success("下线成功");
            this.batchshopIds = [];
            this.search();
          } else {
            this.$Message.error(res.data.msg);
          }
        })
        .catch(err => {
          this.$Message.error("网络错误");
        });
      this.insModal = false;
    },
    beforeUpload(file) {
      //console.log(file);
      this.reqFiles.files = file;
      this.reqFiles.fileName = file.name;
      return false;
    },
    handleUpload() {
      if (this.reqFiles.files == null) {
        this.$Message.error("请选择导入文件！");
        return;
      } else {
        this.uploadLoading = true;
        this.$refs.uploadAssign.post(this.reqFiles.files);
      }
    },
    uploadSuccess(response, file, fileList) {
      this.uploadLoading = false;
      if (response.code == 0) {
        this.Observer.$emit("assignOnline", response.data);
        // this.uploadSuccessMsg = response.data.errorDetail;
        // this.uploadSuccessBatchMsgNum =
        //   "成功上传" +
        //   response.data.successCount +
        //   "条,失败" +
        //   response.data.errorCount +
        //   "条";
        // this.importModal2 = true;
        this.assignModal = false;
        this.reqFiles = {
          files: null,
          fileName: ""
        };
      } else {
        this.$Message.error(response.msg);
      }
    },
    fileTagClose() {
      this.reqFiles = {
        files: null,
        fileName: ""
      };
    },
    fileTagCloseBatch() {
      this.reqFilesBatch = {
        files: null,
        fileName: ""
      };
    },
    fileTagCloseVivo() {
      this.reqFilesVivo = {
        files: null,
        fileName: ""
      };
    },
    uploadError(error, file, fileList) {
      this.uploadLoading = false;
      this.$Message.error("上传失败");
    },
    beforeUploadImport(file) {
      this.reqFilesBatch.files = file;
      this.reqFilesBatch.fileName = file.name;
      return false;
    },
    beforeUploadImportVivo(file) {
      this.reqFilesVivo.files = file;
      this.reqFilesVivo.fileName = file.name;
      return false;
    },
    handleUploadBatch() {
      if (this.reqFilesBatch.files == null) {
        this.$Message.error("请选择导入文件！");
        return;
      } else {
        this.uploadLoadingImport = true;
        this.$refs.uploadBatch.post(this.reqFilesBatch.files);
      }
    },
    handleUploadVivo() {
      if (this.reqFilesVivo.files == null) {
        this.$Message.error("请选择导入文件！");
        return;
      } else {
        this.uploadLoadingVivo = true;
        this.$refs.uploadVivoShop.post(this.reqFilesVivo.files);
      }
    },
    uploadSuccessImport(response, file, fileList) {
      if (response.code == 0) {
        this.uploadSuccessBatchMsg = response.data.error_msg;
        if (response.data.data.result_excel) {
          this.uploadResponse.result_excel = response.data.data.result_excel;
        }
        //this.uploadSuccessBatchList = response.data.data.error_list;
        this.importModal = true;
        this.reqFilesBatch = {
          files: null,
          fileName: ""
        };
      } else {
        this.$Message.error(response.msg);
      }
      this.uploadLoadingImport = false;
    },
    importVivoShopClose(type) {
      if (!type) {
        this.reqFilesVivo = {
          files: null,
          fileName: ""
        };
        this.importVivoShopRadio = "1";
      }
    },
    importBatchImportClose(type) {
      if (!type) {
        this.reqFilesBatch = {
          files: null,
          fileName: ""
        };
      }
    },
    importAssignClose(type) {
      if (!type) {
        this.reqFiles = {
          files: null,
          fileName: ""
        };
      }
    },
    uploadSuccessImportVivo(response, file, fileList) {
      if (response.code == 0) {
        this.Observer.$emit("uploadShop", response.data);
        this.reqFilesVivo = {
          files: null,
          fileName: ""
        };
        this.importVivoShop = false;
        // this.search(true);
      } else {
        this.$Message.error(response.msg);
      }
      this.uploadLoadingVivo = false;
    },
    uploadErrorImport(error, file, fileList) {
      this.uploadLoadingImport = false;
      this.$Message.error("导入失败");
    },
    uploadErrorImportVivo(error, file, fileList) {
      this.uploadLoadingVivo = false;
      this.$Message.error("导入失败");
    },
    vendorChange(value) {
      this.search(true);
    },
    customChange(value) {
      this.search(true);
    },
    handleIntervene(row) {
      //人工干预
      //console.log(row);
      axios
        .request({
          url: "/ad/customizedshops/manualset",
          method: "post",
          data: {
            partnerId: row.partnerId,
            shopName: row.name,
            status: row.manual_inteervention == 2 ? 1 : 2
          }
        })
        .then(res => {
          if (res.data.code == 0) {
            this.$Message.success("操作成功");
            this.search();
          } else {
            this.$Message.error(res.data.msg);
          }
        })
        .catch(err => {
          this.$Message.error("网络错误");
        });
    },
    batchImport() {
      // //console.log(
      //   "https://m-test.teddymobile.cn/admin/tnt/json_export_custom?partner_id=" +
      //     this.formItem.vendor +
      //     "&merchant_name=" +
      //     this.formItem.merchant_name +
      //     "&status=" +
      //     this.formItem.custom
      // );
      let url =
        location.href.indexOf("back-manager.teddymobile.net") > -1
          ? "https://m.teddymobile.cn"
          : "https://m-test.teddymobile.cn";
      window.open(
        url +
          "/admin/tnt/json_export_custom_menu?partner_id=" +
          this.formItem.vendor +
          "&merchant_name=" +
          encodeURI(this.formItem.merchant_name) +
          "&status=" +
          this.formItem.custom+'&shop_ids='+this.batchshopIds.join(',')
      );
    },
    sendVivo(row) {
      axios
        .request({
          url: "/third/vivo/menu/approval",
          method: "post",
          data: {
            shopId: row.id,
            partnerId: row.partnerId
          }
        })
        .then(res => {
          if (res.data.code == 0) {
            this.$Message.success("送审成功");
            this.search();
          } else {
            this.$Message.error(res.data.msg);
          }
        })
        .catch(err => {
          this.$Message.error("网络错误");
        });
    },
    /** 批量送审vivo */
   submitBatchHandler() {
      let _this = this
      let postData = {
        shopIds: _this.batchshopIds,
        partnerId: _this.formItem.vendor
      }
      _this.batchLoading = true
      axios
        .request({
          url: "/third/vivo/menu/approvalBatch",
          method: "post",
          data: postData
        })
        .then(
          d => {
            if (d.data.code === 0) {
              _this.importResult = true
              _this.importResultFail = d.data.data.length
              _this.batchshopIds = []
              _this.search(true);
            } else {
              _this.$Message.error(d.data.msg);
            }
            _this.batchLoading = false
          },
          err => {
            _this.batchLoading = false
            _this.$Message.error("请求失败，" + err + "，请稍后再试!");
          }
        );
    },
    closeBatchModal(flag) {
      if (!flag) {
        this.importResult = false
      }
    },
    checkResult() {
      window.open(this.uploadResponse.result_excel);
    },
    timingOnline(row) {
      this.timingTitle = row.name;
      this.timingDate = row.autoOnlineTime ? row.autoOnlineTime : "";
      this.timingRow = row;
      this.timingVisible = true;
    },
    timingOffline() {
      axios
        .request({
          url: "/ad/customizedshops/cancelAutoOnline",
          method: "post",
          data: {
            partnerId: this.timingRow.partnerId,
            shopId: this.timingRow.id
          }
        })
        .then(res => {
          if (res.data.code == 0) {
            this.$Message.success("取消成功");
            this.search();
            this.timingVisible = false;
          } else {
            this.$Message.error(res.data.msg);
          }
        })
        .catch(err => {
          this.$Message.error("网络错误");
        });
    },
    timingOk() {
      if (!this.timingDateMoment) {
        this.$Message.error("请选择时间");
        return;
      }
      axios
        .request({
          url: "/ad/customizedshops/setAutoOnlineTime",
          method: "post",
          data: {
            partnerId: this.timingRow.partnerId,
            shopId: this.timingRow.id,
            onlineTime: this.timingDateMoment
          }
        })
        .then(res => {
          if (res.data.code == 0) {
            this.$Message.success("设置成功");
            this.search();
            this.timingVisible = false;
          } else {
            this.$Message.error(res.data.msg);
          }
        })
        .catch(err => {
          this.$Message.error("网络错误");
        });
    }
  },
  // activated() {
  //   this.search();
  // }
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
