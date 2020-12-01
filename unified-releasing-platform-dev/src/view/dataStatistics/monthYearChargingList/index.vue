<template>
  <div>
      <Form :model="formItem" :label-width="80" :inline="true" style="margin-top: 20px">
        <FormItem label="客户名称:">
          <Input
            v-model="formItem.customName"
            placeholder="客户名称"
            @on-enter="searchAllData(true)"
            clearable
          />
        </FormItem>
        <FormItem label="账期:">
          <!-- <Date-picker
            type="daterange"
            placeholder="请选择账期"
            style="width:180px;"
            v-model="formItem.yyyymm"
            @on-change="changeReportTime"
            :clearable="true"
          ></Date-picker> -->
          <el-date-picker
          style="width:200px"
          v-model="formItem.yyyymm"
          size="small"
          type="monthrange"
          format="yyyy-MM"
          value-format="yyyy-MM"
          range-separator="-"
          start-placeholder="开始月份"
          end-placeholder="结束月份"
          @change="changeReportTime"
          :clearable="false"
        ></el-date-picker>
        </FormItem>
        <br>
        <FormItem :label-width="30">
          <Button type="primary" @click="searchAllData(true)">查询</Button>
          <Button
            type="primary"
            @click="exportPackageData"
            style="margin-left: 10px"
            v-if="showAccess('数据统计_包月/包年计费表_导出')"
          >导出</Button>
          <Button
            type="primary"
            style="margin-left:10px"
            @click="addCPSCPAList = true"
            v-if="showAccess('数据统计_包月/包年计费表_新增')"
          >新增</Button>
          <Button
            type="primary"
            style="margin-left: 10px"
            @click="openImportModal"
            v-if="showAccess('数据统计_包月/包年计费表_批量导入')"
          >批量导入</Button>
          <Button type="primary" style="margin-left:10px" @click="openIncomeList"
          v-if="showAccess('数据统计_包月/包年计费表_生成应收单')">生成应收单</Button>
        </FormItem>
      </Form>
      <div class="layout-table">
        <Table
          border
          :columns="columns"
          :data="rowDataDetail"
          :loading="listLoadingDetail"
          style="overflow-x:scroll;"
        >
          <!-- <template slot-scope="{ row }" slot="estimatedAmount">
            <div
              v-if="row.edit"
              style="display: flex;align-items: center;justify-content: space-between;"
            >
              <Input :value="row.estimatedAmount" size="small" @on-change="changeEstimatAmount"></Input>
              <div style="display: flex;flex-direction: column;">
                <Icon type="ios-checkmark" size="20" @click="submitChangeHandler(row)" />
                <Icon type="ios-close" size="20" @click="cancelChangeHandler(row)" />
              </div>
            </div>
            <div
              v-if="!row.edit"
              @click="clickCurrentRow(row)"
              style="display: flex;align-items: center; justify-content: space-between;"
            >
              <span>{{row.estimatedAmount | parseNumber}}</span>
              <Icon
                type="ios-create-outline"
                size="20"
                v-if="showAccess('数据统计_包月/包年计费表_编辑预估金额') && row.collectStatus !== 1"
              />
            </div>
          </template> -->
          <template slot-scope="{row, index}" slot="content">
            <Tooltip placement="top" max-width="120" transfer theme="light">
              <div slot="content" style="word-wrap:break-word">{{row.content}}</div>
              <div
                style="max-width:110px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;"
              >{{row.content}}</div>
            </Tooltip>
          </template>
          <template slot-scope="{ row }" slot="settlementAmount">
            <span>{{row.settlementAmount | parseNumber}}</span>
          </template>
          <template slot-scope="{ row }" slot="updateTime">
            <span>{{row.updateTime | formatDate}}</span>
          </template>
          <template slot-scope="{ row }" slot="chargedType">
            <span>{{chargedTypes[row.chargedType]}}</span>
          </template>
          <template slot-scope="{ row }" slot="industry">
            <span>{{filterIndustry(row.industry)}}</span>
          </template>
          <template slot-scope="{row, index}" slot="action">
            <Button
              type="primary"
              @click="editCPSCPAList(row, 'update')"
              size="small"
              v-if="showAccess('数据统计_包月/包年计费表_编辑') && !row.hasStatement"
            >编辑</Button>
            <Button
              style="margin-left: 10px;"
              type="error"
              @click="deleteCPSCPAList(row)"
              size="small"
              v-if="showAccess('数据统计_包月/包年计费表_删除') && !row.hasStatement"
            >删除</Button>
          </template>
        </Table>
        <div style="display:flex;justify-content:flex-end;margin-top:10px;">
          <Page
            :total="total_count_Detail"
            size="small"
            :current="formItem.pageIndexDetail"
            @on-change="(val)=>{pageChange(val, 'Detail')}"
            :page-size="formItem.pageSizeDetail"
            @on-page-size-change="(val) => {pageSizeChange(val, 'Detail')}"
            show-sizer
            show-total
            show-elevator
          ></Page>
        </div>
      </div>
    <Modal
      :title="addType == 'update' ? '编辑包月/包年计费信息' : '新增包月/包年计费信息'"
      v-model="addCPSCPAList"
      :mask-closable="false"
      @on-visible-change="closeAddModal"
      class="cpscpaForm"
      width="840"
    >
      <Form
        :model="cpscpaForm"
        :label-width="100"
        :rules="cpscpaRuleValidate"
        ref="cpscpaForm"
      >
        <FormItem label="账期：" prop="statisticsMonth">
          <DatePicker v-model="cpscpaForm.statisticsMonth" type="month" placeholder="请选择账期" style="width:100%"
            @on-change="changeSelectTime" :disabled="addType=='update'"></DatePicker>
        </FormItem>
        <FormItem>
        </FormItem>
        <FormItem label="客户名称：" prop="customName">
          <Select
            ref="shopSelect"
            :disabled="addType=='update'"
            v-model="cpscpaForm.customName"
            filterable
            clearable
            remote
            placeholder="请输入客户名称"
            :remote-method="remoteSearchCustom"
            :loading="loadingCustoms"
            @on-change="changeSelectCustom"
          >
            <Option
              v-for="(option, index) in customList"
              :value="option.custom_username"
              :key="index"
              :label="option.custom_username"
            >{{option.custom_username}}</Option>
          </Select>
        </FormItem>
        <FormItem label="公司名称：" prop="companyName">
          <Input v-model="cpscpaForm.companyName" placeholder disabled></Input>
        </FormItem>
        <!-- <FormItem label="订单名称：" prop="orderName">
          <Col span="12" style="width: 100%">
            <Select
              v-model="cpscpaForm.orderName"
              @on-change="searchNum"
              @on-clear="clearOrderName"
              filterable
              clearable
              remote
              :remote-method="searchOrder"
              :loading="orderLoading"
              placeholder="请输入订单名称"
            >
              <Option
                v-for="(item, index) in orderList"
                :key="index"
                :value="item.orderName"
              >{{ item.orderName }}</Option>
            </Select>
          </Col>
        </FormItem>
        <FormItem label="订单编号：" prop="orderNo">
          <Input v-model="cpscpaForm.orderNo" disabled></Input>
        </FormItem> -->
        <FormItem label="推广产品：" prop="product">
          <Input
            v-model="cpscpaForm.product"
            placeholder="请填写推广产品"
            clearable
            maxlength="15"
          ></Input>
        </FormItem>
        <FormItem label="合作内容：" prop="content">
          <Select v-model="cpscpaForm.content" multiple>
            <Option value="1">号码认证</Option>
            <Option value="2">短信菜单</Option>
            <Option value="3">下一步按钮</Option>
            <Option value="4">卡片定制</Option>
          </Select>
        </FormItem>
        <FormItem label="AE负责人：" prop="aeManager">
          <Input
            v-model="cpscpaForm.aeManager"
            placeholder="请填写AE负责人"
            clearable
          ></Input>
        </FormItem>
        <FormItem label="销售人员:" prop="salesId">
          <Select
            v-model="cpscpaForm.salesId"
            filterable
            clearable
          >
            <Option v-for="item in marketList" :value="item.id" :key="item.id">{{ item.name }}</Option>
          </Select>
        </FormItem>
        <FormItem label="计费方式：" prop="chargedType" style="width: 100%">
          <RadioGroup v-model="cpscpaForm.chargedType">
            <Radio label="1">包月</Radio>
            <Radio label="2">包年</Radio>
            <Radio label="3">按条</Radio>
            <Radio label="4">按商户</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="订单编号：" prop="orderNo">
          <Input v-model="cpscpaForm.orderNo" maxlength="30" placeholder="请填写订单编号" ></Input>
        </FormItem>
        <FormItem label="所属版图：" prop="industry">
          <Select v-model="cpscpaForm.industry">
            <Option
              v-for="item in industrys"
              :value="item.key"
              :key="item.key"
            >{{ item.value }}</Option>
          </Select>
        </FormItem>
        <FormItem label="上线日期：" prop="onlineDate">
          <DatePicker v-model="cpscpaForm.onlineDate" type="date" placeholder="请选择上线日期" style="width:100%"
            ></DatePicker>
        </FormItem>
        <FormItem label="下线日期：" prop="offlineDate">
          <DatePicker v-model="cpscpaForm.offlineDate" type="date" placeholder="请选择下线日期" style="width:100%"
            :options="disabledOfflineDate"></DatePicker>
        </FormItem>
        <FormItem label="结算金额：" prop="settlementAmount">
            <Input v-model="cpscpaForm.settlementAmount" placeholder="请填写结算金额" clearable :disabled="addType=='update'"><span slot="append">元</span></Input>
          </FormItem>
          <FormItem label="年费总和：" prop="annualFee">
            <Input v-model="cpscpaForm.annualFee" placeholder="请填写年费总和" clearable :disabled="addType=='update'"><span slot="append">元</span></Input>
          </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" style="margin-left:10px;" @click="addSubmit('cpscpaForm')">确定</Button>
        <Button @click="addCPSCPAList = false">取消</Button>
      </div>
    </Modal>
    <Modal
      title="批量导入包月/包年计费表"
      v-model="batchImportModal"
      :mask-closable="false"
      @on-visible-change="importBatchImportClose"
    >
      <div class="importContent">
        <Upload
          ref="uploadBatch"
          action="/finance/cpt//import"
          accept=".xls, .xlsx"
          :headers="headers"
          :show-upload-list="false"
          :before-upload="beforeUploadImport"
          :on-success="uploadSuccessImport"
          :on-error="uploadErrorImport"
        >
          <Button>选择文件</Button>
        </Upload>
        <a :href="onloadUrl + '包年_包月计费表导入模板.xlsx'" download="包年_包月计费表导入模板.xlsx">
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
        <Button type="primary" @click="checkResult" v-if="uploadResponse.result_excel">查看结果</Button>
        <Button
          type="primary"
          @click="handleUploadBatch"
          :loading="uploadLoadingImport"
          style
        >{{uploadLoadingImport ? '导入中' :'导入文件'}}</Button>
        <Button @click="batchImportModal = false" :disabled="uploadLoadingImport">取消</Button>
      </div>
    </Modal>
    <Modal
      v-model="deleteModal"
      title="删除"
      :mask-closable="false"
      @on-ok="deleteHandler"
      @on-cancel="cancelDeleteHandler"
    >
      <p style="margin: 16px;">确认删除该数据？</p>
    </Modal>
    <Modal title="应收单列表" v-model="incomeListModal" :mask-closable="false" width="1200" @on-visible-change="closeIncomeListModal">
      <div>
        <div>
          <Form :model="incomeFormItem" :label-width="80" :inline="true" style="margin-top:20px;" ref="incomeForm">
            <FormItem label="客户名称:" prop="customName">
              <Input
                v-model="incomeFormItem.customName"
                placeholder="客户名称"
                clearable
                @on-enter="searchDataIncome(true)"
              />
            </FormItem>
            <FormItem label="账期:" prop="time">
              <el-date-picker
                style="width:200px"
                v-model="incomeFormItem.time"
                size="small"
                type="monthrange"
                format="yyyy-MM"
                value-format="yyyy-MM"
                range-separator="-"
                start-placeholder="开始月份"
                end-placeholder="结束月份"
                @change="dateTimeChange"
                :clearable="false"
              ></el-date-picker>
            </FormItem>
            <FormItem label="状态:" prop="status">
              <Select v-model="incomeFormItem.status" style="width:160px" @on-change="searchDataIncome(true)">
                <Option :value="0">全部</Option>
                <Option :value="1">待生成应收</Option>
                <Option :value="2">已生成应收</Option>
              </Select>
            </FormItem>
            <FormItem :label-width="30">
              <Button type="primary" @click="searchDataIncome(true)" style="margin-left:10px">查询</Button>
            </FormItem>
          </Form>
          <div style="display:flex;justify-content:flex-end;margin-bottom:20px;">
          <Button type="primary" @click="batchCreateIncome">批量生成应收</Button>

          </div>
          <Table
            border
            :columns="columnsIncome"
            :data="tableData"
            :loading="tableLoading"
            style="overflow-x:scroll;"
            @on-selection-change="incomeListSelectChange"
          >
            <template slot-scope="{row}" slot="collectStatus">
              <span v-if="row.statementNo" style="color: #007fff">已生成应收</span>
              <span v-else style="color: #e04a57">待生成应收</span>
            </template>
            <template slot-scope="{row}" slot="createStatementTime">
              <span>{{row.createStatementTime | formatDate}}</span>
            </template>
            <template slot-scope="{row}" slot="action">
              <Button type="dashed" size="small" v-if="row.statementNo">已生成应收</Button>
              <Button type="primary" size="small" v-if="row.statementNo && showAccess('数据统计_包月/包年计费表_重新生成应收')" @click="createIncome(row, 'again')" style="margin-left: 8px;">重新生成应收</Button>
              <Button type="primary" size="small" v-if="!row.statementNo"  @click="createIncome(row)">生成应收</Button>
            </template>
          </Table>
          <div style="display:flex;justify-content:flex-end;margin-top:10px;">
            <Page
              :total="incomeFormItem.total"
              size="small"
              :current="incomeFormItem.pageIndex"
              @on-change="pageChangeIncome"
              :page-size="incomeFormItem.pageSize"
              @on-page-size-change="pageSizeChangeIncome"
              show-sizer
              show-total
              show-elevator
            ></Page>
          </div>
        </div>
      </div>
      <div></div>
      <div slot="footer">
        <Button @click="incomeListModal = false">取消</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import axios from "@/libs/api.request";
import { datefmt } from "@/utils/dateFormat";
import { getToken, uuid } from "@/libs/util";
import config from "./config.js";
import moment from "moment";
import hasShowAccess from "@/libs/hasShowAccess.js";

moment.locale("zh-cn");
const defaultCpscpaData = {
  statisticsMonth: '',
  aeManager: '',
  customName: "",
  companyName: '',
  // orderName: '',
  orderNo: '',
  industry: '',
  product: '',
  content: [],
  chargedType: '1',
  onlineDate: '',
  offlineDate: '',
  settlementAmount: '',
  annualFee: '',
  salesId: '',
  aeManager: ''
}
export default {
  name: "monthYearChargingList",
  components: {
    columnsSelect: () => import("@/components/columns-select")
  },
  data() {
    const validatePartner = (rule, value, callback) => {
      if (!value.length) {
        callback(new Error("厂商为必填项"));
      } else {
        return callback();
      }
    };
    const validateTime = (rule, value, callback) => {
        if (!this.cpscpaForm.statisticsMonth) {
            callback(new Error('账期为必填项'));
        } else {
            return callback();
        }
    };
    const validateMoney = function(type) {
      return (rule, value, callback) => {
        if (!value) {
          return callback(new Error(type + '为必填项'));
        }
        if (
          !/^(([^0][0-9]{0,7}|0)\.([0-9]{1,2})$)|^([^0]([0-9]{0,7})?|0)$/.test(
            value
          )
        ) {
          callback(new Error(type + "支持小数点前8位，后2位"));
        } else {
          callback();
        }
      };
    };
    const customName = [
      {
        required: true,
        message: "客户名称为必填项",
        trigger: "change"
      }
    ];
    const validateContent = (rule, value, callback) => {
        if (!this.cpscpaForm.content.length) {
            callback(new Error('合作内容为必选项'));
        } else {
            return callback();
        }
    };
    return {
      chargedTypes: {
        1: '包月',
        2: '包年',
        3: '按条',
        4: '按商户'
      },
      batchCreate: [],
      tableData: [],
      tableLoading: false,
      incomeListModal: false,
      incomeFormItem: {
        customName: "",
        time: [
          moment()
            .subtract(2, "months")
            .format("YYYY-MM"),
          moment()
            .subtract(1, "months")
            .format("YYYY-MM")
        ],
        status: 0,
        pageSize: 10,
        pageIndex: 1,
        total: 0
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      costDataLoading: false,
      formItem: {
        yyyymm: [
          moment()
            .subtract(2, "months")
            .format("YYYY-MM"),
          moment()
            .subtract(1, "months")
            .format("YYYY-MM")],
        customName: "",
        // pageSize: 10,
        // page: 1
        // pageSizeTotal: 10,
        // pageIndexTotal: 1,
        pageSizeDetail: 10,
        pageIndexDetail: 1
      },
      // total_count_Total: 0,
      total_count_Detail: 0,
      dialogVisible: false,
      columns: config.enterpriseMenuColumns,
      columnsIncome: config.incomeColumns,
      listLoading: false,
      // columns6: config.tableFields,
      costData: [],
      uploadLoadingImport: false,
      batchImportModal: false,
      onloadUrl:
        process.env.NODE_ENV === "production" ? "/page/static/" : "/static/",
      headers: {
        // "X-Client-Token": 'eyJpc0VuYWJsZSI6MSwibGFzdExvZ2luIjoxNTg1NzkyNDQxMjEyLCJuaWNrTmFtZSI6Imxpc2hhbnNoYW4iLCJ0b2tlbiI6IjgwX2xpc2hhbnNoYW5fMTU4NTc5MjQ0MTIxMiIsInVzZXJFbWFpbCI6Imxpc2hhbnNoYW5AdGVkZHltb2JpbGUuY24iLCJ1c2VySWQiOjgwLCJ1c2VyTmFtZSI6Imxpc2hhbnNoYW4ifQ==',
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
      reqFilesBatch: {
        fileName: ""
      },
      addCPSCPAList: false,
      loadingCustoms: false,
      customList: [],
      cpscpaForm: defaultCpscpaData,
      industrys: [],
      cpscpaRuleValidate: {
        statisticsMonth: [{
          required: true,
          // message: '日期为必填项',
          trigger: "change",
          validator: validateTime
        }],
        customName,
        companyName: [
          {
            required: true,
            trigger: "change",
            message: "公司名称为必填项"
          }
        ],
        product: [
          {
            required: true,
            message: "推广产品为必填项",
            trigger: "change",
          }
        ],
        aeManager: [{
          required: true,
          message: "AE负责人为必填项",
          trigger: "change",
        }],
        content: [{
          required: true,
          // message: '合作内容为必选项',
          trigger: "change",
          validator: validateContent
        }],
        salesId: [{
          required: true,
          type: 'number',
          message: "请选择销售人员",
          trigger: "change"
        }],
        industry: [{
          required: true,
          message: '所属版图为必选项',
          trigger: 'change'
        }],
        onlineDate: [{
          required: true,
          type: 'date',
          message: '上线日期为必填项'
        }],
        chargedType: [
          {
            required: true,
            trigger: "blur",
            message: "计费方式为必填项"
        }],
        settlementAmount: [{
            required: true,
            trigger: 'change',
            validator: validateMoney('结算金额')
        }],
        annualFee: [{
            required: true,
            trigger: 'change',
            validator: validateMoney('年费总和')
        }],
      },
      uploadResponse: {
        result_excel: ""
      },
      orderLoading: false,
      orderList: [],
      // rowDataTotal: [],
      rowDataDetail: [],
      // listLoadingTotal: false,
      listLoadingDetail: false,
      addType: 'add',
      estimatedAmount: '',
      deleteModal: false,
      currentRow: {},
      disabledOfflineDate: {disabledDate: () => {}},
      marketList: []
    };
  },
  watch: {
    'cpscpaForm.onlineDate': function(newVal, oldVal) {
      if (this.addType === 'update' && typeof newVal === 'string') return
      if (!newVal) {
        this.cpscpaForm.offlineDate = ''
        return
      }
      let onlineDate = newVal
      let offlineDate = this.cpscpaForm.offlineDate
      typeof onlineDate === 'string' && (onlineDate = new Date(newVal))
      if (typeof this.cpscpaForm.offlineDate === 'string') {
        offlineDate = new Date(this.cpscpaForm.offlineDate)
      }
      if (offlineDate && onlineDate.getTime() > offlineDate.getTime()) {
        this.cpscpaForm.offlineDate = ''
      }
      this.disabledOfflineDate.disabledDate = function (date) {
        return date && date.valueOf() < onlineDate.getTime();
      }
    }
  },
  computed: {
    showAccess() {
      return el => {
        return hasShowAccess(el);
      };
    },
  },
  filters: {
    formatDate(value) {
      if (value) {
        return moment(value).format("YYYY-MM-DD HH:mm:ss");
      } else {
        return "";
      }
    },
    formatDateShort(value) {
      if (value) {
        return moment(value).format("YYYY-MM");
      } else {
        return "";
      }
    },
    parseNumber(str) {
      return (
        str &&
        str
          .toString()
          .replace(/^\d+/g, m => m.replace(/\d{1,3}(?=(\d{3})+$)/g, "$&,"))
      );
    }
  },
  mounted() {
    this.getAdTerritoryList();
    this.getAllSaleInfo()
    this.searchAllData(true);
  },
  methods: {
    filterIndustry(value) {
        const filterIndustry = this.industrys.length && this.industrys.filter(ind => ind.key == value)
        if (filterIndustry.length) {
          return filterIndustry[0].value
        } else {
          return ''
        }
    },
    getAllSaleInfo() {
      axios
        .request({
          url: "/ad/management/ads/getAllSaleInfo",
          method: "post"
        })
        .then(res => {
          if (res.data.code === 0) {
            this.marketList = res.data.data;
          } else {
            this.$Message.error(res.data.msg);
          }
        })
        .catch(err => {
          this.$Message.error("请求异常，请稍后再试！");
        });
    },
    getAdTerritoryList() {
      axios
          .request({
            url: "/common/getAdTerritoryList",
            method: "get"
          })
          .then(res => {
            if (res.data.code === 0) {
              this.industrys.push(...res.data.data)
            } else {
              this.$Message.error(res.data.msg);
            }
          })
          .catch(err => {
            this.$Message.error("请求异常，请稍后再试！");
          });
    },
    clickCurrentRow(row) {
        this.estimatedAmount = row.estimatedAmount
        this.rowDataDetail.forEach(data => {
          this.$set(data, 'edit', data.id == row.id)
        });
    },
    cancelChangeHandler(row) {
      this.rowDataDetail.some(data => {
        if (row.id == data.id) {
          this.$set(data, "edit", data.id != row.id);
          return true;
        }
      });
    },
    changeEstimatAmount(event) {
      this.estimatedAmount = event.target.value
    },
    submitChangeHandler(row) {
      if (this.estimatedAmount != '' && !/^(([^0][0-9]{0,7}|0)\.([0-9]{1,4})$)|^([^0]([0-9]{0,7})?|0)$/.test(this.estimatedAmount)) {
        this.$Message.error('预估金额整数部分最多为8位，小数部分最多为4位')
        return
      }
      let _this = this
      axios.request({
        url: '/finance/cpscpanew/updateEstimatAmount',
        method: "post", 
        data: {id: row.id, estimatedAmount: _this.estimatedAmount}
      }).then(d => {
        if (d.data.code == 0) {
          row.edit = false
          _this.searchAllData()
        } else {
          _this.$Message.error(d.data.msg);
        }
      })
      .catch(err => {
        _this.$Message.error("网络错误" + err);
      });
    },
    changeReportTime(data) {
      this.formItem.yyyymm = data;
      this.searchAllData(true);
    },
    searchAllData(isfirst) {
      // this.searchTotalData(isfirst, "Total");
      this.searchDetailData(isfirst, "Detail");
    },
    // searchTotalData(isfirst) {
    //   this.searchData(isfirst, "Total");
    // },
    searchDetailData(isfirst) {
      this.searchData(isfirst, "Detail");
    },
    searchData(isfirst, type) {
      this["listLoading" + type] = true;
      if (isfirst) {
        this.formItem["pageIndex" + type] = 1;
      }
      let postData = {
        endStatisticsMonth: this.formItem.yyyymm[1] ? moment(this.formItem.yyyymm[1]).format("YYYYMM") : '',
        startStatisticsMonth: this.formItem.yyyymm[0] ? moment(this.formItem.yyyymm[0]).format("YYYYMM") : '',
        customName: this.formItem.customName,
        pageSize: this.formItem["pageSize" + type],
        pageIndex: this.formItem["pageIndex" + type]
      };
      let _this = this;
      axios
        .request({
          url: "/finance/cpt/list",
          method: "post",
          data: postData
        })
        .then(d => {
          if (d.data.code == 0) {
            _this['rowData' + type] = d.data.data.data;
            _this['total_count_' + type] = Number(d.data.data.total);
          } else {
            _this.$Message.error(d.data.msg);
          }
          _this["listLoading" + type] = false;
        })
        .catch(err => {
          _this["listLoading" + type] = false;
          _this.$Message.error("网络错误" + err);
        });
    },
    editCPSCPAList(row, type) {
      this.addCPSCPAList = true
      axios.request({
        url: '/finance/cpt/getById',
        method: 'post',
        data: {
          id: row.id
        }
      }).then(res => {
        if (res.data.code == 0) {
          this.addType = type;
          this.cpscpaForm = res.data.data
          this.cpscpaForm.content = res.data.data.content.split(',')
          this.cpscpaForm.chargedType = res.data.data.chargedType + ''
          this.cpscpaForm.industry = res.data.data.industry + ''
          this.cpscpaForm.statisticsMonth = moment(res.data.data.statisticsMonth + '01').format("YYYY-MM");
        } else {
          this.$Message.error(d.data.msg);
        }
      }).catch(err => {
        this.$Message.error("操作失败，请刷新重试")
      })
    },
    exportPackageData() {
      axios
        .request({
          url: "/finance/cpt/export",
          method: "post",
          data: {
            endStatisticsMonth: this.formItem.yyyymm[1] ? moment(this.formItem.yyyymm[1]).format("YYYYMM") : '',
            startStatisticsMonth: this.formItem.yyyymm[0] ? moment(this.formItem.yyyymm[0]).format("YYYYMM") : '',
            customName: this.formItem.customName,
            pageSize: this.formItem.pageSizeDetail,
            pageIndex: this.formItem.pageIndexDetail
          },
          responseType: "blob"
        })
        .then(res => {
          if (!res) {
            this.$Message.error("导出失败");
            return;
          }
          var elink = document.createElement("a");
          elink.download = "包月/包年计费表.xls";
          elink.style.display = "none";
          var blob = new Blob([res.data], { type: "application/vnd.ms-excel" });
          elink.href = URL.createObjectURL(blob);
          document.body.appendChild(elink);
          elink.click();
          document.body.removeChild(elink);
        })
        .catch(err => {
          this.$Message.error("导出错误" + err);
        });
    },
    openImportModal() {
      this.batchImportModal = true;
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
    fileTagCloseBatch() {
      this.reqFilesBatch = {
        files: null,
        fileName: ""
      };
      this.uploadResponse.result_excel = "";
    },
    importBatchImportClose(type) {
      if (!type) {
        this.reqFilesBatch = {
          files: null,
          fileName: ""
        };
        this.uploadResponse.result_excel = "";
      }
    },
    beforeUploadImport(file) {
      this.reqFilesBatch.files = file;
      this.reqFilesBatch.fileName = file.name;
      return false;
    },
    uploadSuccessImport(response, file, fileList) {
      if (response.code == 0) {
        this.requestUploadAgain(response.data);
        // }
        // //this.uploadSuccessBatchList = response.data.data.error_list;
        this.reqFilesBatch = {
          files: null,
          fileName: ""
        };
      } else {
        this.$Message.error(response.msg);
        this.uploadLoadingImport = false;
        this.batchImportModal = false;
      }
    },
    requestUploadAgain(taskId) {
      axios
        .request({
          url: "/common/getImportTask?taskId=" + taskId,
          method: "get"
        })
        .then(res => {
          if (res.data.code === 0) {
            if (res.data.data.status === 1) {
              setTimeout(() => {
                this.requestUploadAgain(res.data.data.taskId);
              }, 2000);
            } else if (res.data.data.status === 2) {
              this.$Message.success("上传成功,请查看结果");
              this.searchAllData(true);
              this.uploadResponse.result_excel = res.data.data.data;
              this.uploadLoadingImport = false;
            } else if (res.data.data.status === 0) {
              this.uploadLoadingImport = false;

              this.$Message.error("操作失败,服务器错误");
            }
          } else {
            this.$Message.error(res.data.msg);
          }
        })
        .catch(err => {
          this.$Message.error("网络错误" + err);
        });
    },
    uploadErrorImport(error, file, fileList) {
      this.uploadLoadingImport = false;
      this.$Message.error("导入失败");
    },
    checkResult() {
      axios
        .request({
          url: this.uploadResponse.result_excel,
          method: "post",
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
          link.setAttribute("download", "批量导入包年/包月计费表结果.xlsx");
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        })
        .catch(err => {
          this.$Message.error("导出失败");
        });
    },
    remoteSearchCustom(query) {
      if (!query) {
        return;
      }
      let _this = this;
      this.loadingCustoms = true;
      axios
        .request({
          url: "ad/customer/searchTaxInfoByCustomerName",
          method: "post",
          data: { name: query }
        })
        .then(res => {
          if (res.data.code === 0) {
            let data = res.data.data;
            if (!data.length) {
              _this.$Message.warning("请填写正确的客户名称！");
            } else {
              _this.customList = data ? data : [];
            }
          } else {
            this.$Message.error(res.data.msg);
          }
          _this.loadingCustoms = false;
        })
        .catch(err => {
          this.$Message.error("请求异常，请稍后再试！");
          this.loadingCustoms = false;
        });
    },
    changeSelectCustom(val) {
      if (!val) {
        return;
      }
      let filterCustom = this.customList.filter(item => {
        return item.custom_username == val;
      });
      if (filterCustom.length) {
        this.cpscpaForm.customId = filterCustom[0].id;
        this.$set(
          this.cpscpaForm,
          "companyName",
          filterCustom[0].company_name ? filterCustom[0].company_name : ""
        );
      }
    },
    addSubmit(name) {
      let _this = this
        this.$refs[name].validate(valid => {
            if (valid) {
                let param = {}
                debugger
                let url = this.addType == 'update' ? '/finance/cpt/edit' : '/finance/cpt/add'
                let postData = {
                  ..._this.cpscpaForm, 
                  statisticsMonth: moment(this.cpscpaForm.statisticsMonth).format("YYYYMM"),
                  offlineDate: this.cpscpaForm.offlineDate ? moment(this.cpscpaForm.offlineDate).format("YYYY-MM-DD") : '',
                  onlineDate: moment(this.cpscpaForm.onlineDate).format("YYYY-MM-DD"),
                }
                axios
                  .request({
                    url,
                    method: "post",
                    data: postData
                  })
                  .then(d => {
                    if (d.data.code == 0) {
                      _this.addCPSCPAList = false
                      _this.addType = 'add'
                      _this.searchAllData(true)
                    } else {
                      this.$Message.error(d.data.msg);
                    }
                  })
                  .catch(() => {
                    this.$Message.error("操作失败，请刷新重试")
                  });

            }
        })
    },
    closeAddModal(flag) {
      if (!flag) {
        this.addType = "add";
        this.$refs.cpscpaForm.resetFields();
        this.cpscpaForm = defaultCpscpaData
        this.cpscpaForm.salesId = ''
      }
    },
    closeIncomeListModal(flag) {
      if (!flag) {
        this.$refs.incomeForm.resetFields();
      }
    },
    changeSelectTime(time) {
      this.cpscpaForm.statisticsMonth = time
    },
    pageChange(val, type) {
      this.formItem["pageIndex" + type] = val;
      type == "Total" ? this.searchTotalData() : this.searchDetailData();
    },
    pageSizeChange(val, type) {
      this.formItem["pageIndex" + type] = 1;
      this.formItem["pageSize" + type] = val;
      type == "Total" ? this.searchTotalData() : this.searchDetailData();
    },
    pageChangeIncome(page) {
      this.incomeFormItem.pageIndex = page;
      this.searchDataIncome();
    },
    pageSizeChangeIncome(size) {
      this.incomeFormItem.pageSize = size;
      this.searchDataIncome();
    },
    searchNum() {
      let item;
      let list = this.orderList;
      for (item in list) {
        if (list[item].orderName == this.cpscpaForm.orderName) {
          return (this.cpscpaForm.orderNo = list[item].orderNo);
        }
      }
    },
    clearOrderName() {
      this.cpscpaForm.orderNo = "";
    },
    searchOrder(query) {
      if (query !== "") {
        this.orderLoading = true;
        setTimeout(() => {
          this.orderLoading = false;
          let params = { name: query };
          axios
            .request({
              url: "/ad/customer/searchOrder",
              method: "post",
              data: params
            })
            .then(
              d => {
                if (d.data.code === 0) {
                  this.orderList = d.data.data;
                } else {
                  this.$Message.error(d.data.msg);
                }
              },
              err => {
                this.$Message.error("请求失败，" + err + "，请稍后再试！");
              }
            );
        }, 200);
      } else {
        this.orderList = [];
      }
    },
    deleteCPSCPAList(row) {
      this.currentRow = row;
      this.deleteModal = true;
    },
    deleteHandler() {
      // 发送删除请求
      axios
        .request({
          url: "/finance/cpt/delete",
          method: "post",
          data: { id: this.currentRow.id }
        })
        .then(d => {
          if (d.data.code == 0) {
            this.deleteModal = false;
            this.searchAllData(true);
          } else {
            this.$Message.error(d.data.msg);
          }
        })
        .catch(err => {
          this.$Message.error("操作失败，请刷新重试");
        });
    },
    cancelDeleteHandler() {
      this.deleteModal = false;
    },
    openIncomeList() {
      this.incomeListModal = true;
      this.searchDataIncome(true);
    },
    dateTimeChange(date) {
      this.incomeFormItem.time = date;
      this.searchDataIncome(true)
    },
    searchDataIncome(flag) {
      this.tableLoading = true;
      if (flag) {
        this.incomeFormItem.pageIndex = 1;
        this.batchCreate = []
      }
      let postData = {
        endStatisticsMonth: this.incomeFormItem.time[1]
          ? moment(this.incomeFormItem.time[1]).format("YYYYMM")
          : "",
        startStatisticsMonth: this.incomeFormItem.time[0]
          ? moment(this.incomeFormItem.time[0]).format("YYYYMM")
          : "",
        customName: this.incomeFormItem.customName,
        pageSize: this.incomeFormItem.pageSize,
        pageIndex: this.incomeFormItem.pageIndex,
        status: this.incomeFormItem.status
      };
      axios
        .request({
          url: "/finance/cpt/arDocumentList",
          method: "post",
          data: postData
        })
        .then(d => {
          if (d.data.code == 0) {
            this.tableData = d.data.data.data;
            this.tableData.forEach(item => {
              if (item.statementNo) {
                item._disabled = true;
              }
            });
            this.incomeFormItem.total = d.data.data.total;
          } else {
            this.$Message.error(d.data.msg);
          }
          this.tableLoading = false;
        })
        .catch(err => {
          this.tableLoading = false;

          this.$Message.error("网络错误" + err);
        });
    },
    incomeListSelectChange(sel) {
      this.batchCreate = sel.map(item => {
        return {customId: item.customId, statisticsMonth: item.statisticsMonth};
      });
    },
    createIncome(row, type) {
      this.batchCreateAxios([{customId: row.customId, statisticsMonth: row.statisticsMonth}], type);
    },
    batchCreateIncome() {
      if (!this.batchCreate.length) {
        this.$Message.error("请选择操作项");
        return;
      } else {
        this.batchCreateAxios(this.batchCreate);
      }
    },
    batchCreateAxios(ids, type) {
      let postData = type === 'again' ? ids[0] : {bills: ids}
      axios
        .request({
          url: type === 'again' ? '/finance/cpt/remakeArDocument' : "/finance/cpt/makeArDocument",
          method: "post",
          data: postData
        })
        .then(d => {
          if (d.data.code == 0) {
            this.$Message.success("已生成应收");
            this.searchDataIncome();
            this.batchCreate = []
          } else {
            this.$Message.error(d.data.msg);
          }
        })
        .catch(err => {
          this.$Message.error("网络错误" + err);
        });
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
.cpscpaForm form {
  padding: 30px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
.cpscpaForm /deep/ .ivu-form-item {
  width: 50%;
}
.cpscpaForm /deep/ .ivu-input-type-textarea .ivu-input-word-count {
  align-items: flex-end;
  top: auto;
}
.cpscpaForm /deep/ .ivu-input-word-count {
  text-align: center;
  position: absolute;
  right: 7px;
  top: 1px;
  bottom: 1px;
  padding-left: 7px;
  background: #fff;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  color: #808695;
  font-size: 12px;
}
.cpscpaForm /deep/ .ivu-select-input[disabled] {
    cursor: not-allowed;
    color: #ccc;
    background-color: #f3f3f3;
    border-radius: 4px;
    height: 30px;
    line-height: 30px;
}
</style>

