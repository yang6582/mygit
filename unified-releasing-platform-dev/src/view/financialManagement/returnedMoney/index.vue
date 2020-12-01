<template>
  <div>
    <Form :model="formItem" :label-width="80" :inline="true" style>
      <FormItem label="录入日期:">
        <Date-picker
          :value="formItem.time"
          format="yyyy-MM-dd"
          type="daterange"
          placeholder="选择日期"
          style="width: 180px"
          @on-change="changeReportTime"
        ></Date-picker>
      </FormItem>
      <FormItem label="入账日期:">
        <Date-picker
          :value="formItem.incomeTime"
          format="yyyy-MM-dd"
          type="daterange"
          placeholder="选择日期"
          style="width: 180px"
          @on-change="changeIncomeTime"
        ></Date-picker>
      </FormItem>
      <FormItem label="公司名称:">
        <Input
          v-model.trim="formItem.companyName"
          placeholder="公司名称"
          @on-enter="searchData(true)"
          clearable
        />
      </FormItem>
      <FormItem :label-width="30">
        <Button type="primary" @click="searchData(true)" style="margin-left:10px">查询</Button>
        <Button
          type="primary"
          @click="addNewHandler"
          style="margin-left:10px"
          v-if="showAccess('财务管理_回款_回款录入')"
        >回款录入</Button>
        <Button
          type="primary"
          @click="downloadReport"
          style="margin-left: 10px"
          v-if="showAccess('财务管理_回款_批量导出')"
        >批量导出</Button>
        <Button
          type="primary"
          @click="batchImportHandler('normal')"
          style="margin-left:10px"
          v-if="showAccess('财务管理_回款_批量导入')"
        >批量导入</Button>
        <Button
          type="primary"
          @click="downloadReport('line')"
          style="margin-left: 10px"
          v-if="showAccess('财务管理_回款_回款拆分导出')"
        >回款拆分导出</Button>
        <Button
          type="primary"
          @click="batchImportHandler('line')"
          style="margin-left:10px"
          v-if="showAccess('财务管理_回款_回款拆分导入')"
        >回款拆分导入</Button>

        <!-- <Button type="primary" @click="batchLineImport" style="margin-left:10px" v-if="showAccess('财务管理_回款_批量处理业务线金额拆分')">批量处理业务线金额拆分</Button> -->
      </FormItem>
    </Form>
    <div class="layout-table">
      <!-- 自定义列 -->
      <columnsSelect
        :columns="columns"
        columnsNum="1"
        @columns-change="columnsChange"
      ></columnsSelect>
      <br />
      <Table
        border
        :columns="columnsSelection"
        :data="rowData"
        :loading="listLoading"
        @on-selection-change="onSelChange"
        style="overflow-x:scroll;"
      >
        <template slot-scope="{row, index}" slot="serialNumber">
          <span class="bidAdName" @click="editCurrentLine(row, 'edit')">{{row.serialNumber}}</span>
        </template>
        <template slot-scope="{row, index}" slot="entryDate">
          <div>{{formatDate(row.entryDate)}}</div>
        </template>
        <template slot-scope="{row, index}" slot="createTime">
          <div>{{moment(row.createTime).format("YYYY-MM-DD HH:mm:ss")}}</div>
        </template>
        <template slot-scope="{row, index}" slot="updateTime">
          <div>{{moment(row.updateTime).format("YYYY-MM-DD HH:mm:ss")}}</div>
        </template>
        <template slot-scope="{row, index}" slot="entryAmount">
          <div>{{parseNumber(row.entryAmount)}}</div>
        </template>
        <template slot-scope="{row, index}" slot="availableDeductionAmount">
          <div>{{parseNumber(row.availableDeductionAmount)}}</div>
        </template>
        <template slot-scope="{row, index}" slot="spAmount">
          <div>{{parseNumber(row.spAmount)}}</div>
        </template>
         <template slot-scope="{row, index}" slot="rechargeAmount">
          <div>{{parseNumber(row.rechargeAmount)}}</div>
        </template>
        <template slot-scope="{row, index}" slot="networkAmount">
          <div>{{parseNumber(row.networkAmount)}}</div>
        </template>
        <template slot-scope="{row, index}" slot="fastappAmount">
          <div>{{parseNumber(row.fastappAmount)}}</div>
        </template>
        <template slot-scope="{row, index}" slot="smsAmount">
          <div>{{parseNumber(row.smsAmount)}}</div>
        </template>
        <template slot-scope="{row, index}" slot="statementNo">
          <div v-if="row.statementNo.length">
             <div v-for="statement in row.statementNo" class="statementNo" @click="clickStatementNoHanlder(statement)">{{statement}}</div>
          </div>
        </template>
        <template slot-scope="{ row }" slot="action">
          <Button
            type="primary"
            size="small"
            @click="editCurrentLine(row, 'edit')"
            v-if="showAccess('财务管理_回款_编辑')"
          >编辑</Button>
          <Button
            style="margin-left:10px"
            type="warning"
            size="small"
            @click="deleteCurrentLine(row)"
            v-if="showAccess('财务管理_回款_删除')"
          >删除</Button>
        </template>
      </Table>
      <Page
        :total="total_count"
        size="small"
        :current="formItem.pageIndex"
        @on-change="pageChange"
        :page-size="formItem.pageSize"
        @on-page-size-change="pageSizeChange"
        show-sizer
        show-total
        show-elevator
        style="margin-top:10px;float:right"
      ></Page>
    </div>
    <Modal
      :title="batchImportType==='line' ? '回款拆分导入': '批量导入'"
      v-model="batchImportModal"
      :mask-closable="false"
      @on-visible-change="importBatchImportClose"
    >
      <div class="importContent">
        <Upload
          :action="batchImportType==='line' ? '/finance/collection/businessLineImport' : '/finance/collectionImport'"
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
          :href="onloadUrl + (batchImportType==='line' ? '入账明细回款拆分导入模板.xlsx' : '入账明细批量导入模板.xlsx')"
          :download="batchImportType==='line' ? '入账明细回款拆分导入模板.xls' : '入账明细批量导入模板.xlsx'"
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
      :title="addType=='add'? '回款录入': '业务线金额拆分'"
      v-model="addModel"
      width="500"
      :mask-closable="false"
      @on-visible-change="closeAddModal"
    >
      <div style="padding:0 40px 0 0;">
        <Form ref="addForm" :model="addForm" :rules="addValidate" :label-width="110">
          <FormItem label="公司名称：" prop="companyName">
            <Input
              v-model="addForm.companyName"
              placeholder="请填写公司名称"
              maxlength="50"
              :disabled="addType!='add'"
            ></Input>
          </FormItem>
          <FormItem label="回款主体：" prop="collectionSubject">
            <Input
              v-model="addForm.collectionSubject"
              placeholder="请填写回款主体"
              maxlength="30"
              :disabled="addType!='add'"></Input>
          </FormItem>
          <FormItem label="入账日期：" prop="entryDate">
            <DatePicker
              v-model="addForm.entryDate"
              type="date"
              placeholder="请选择日期"
              @on-change="changeSelectTime"
              :disabled="addType!='add'"
              :options="disabledDate"
            ></DatePicker>
          </FormItem>
          <FormItem :label="addType=='add'?'入账金额：' : '回款金额：'" prop="entryAmount">
            <Input
              v-model="addForm.entryAmount"
              :placeholder="'请填写'+(addType=='add'? '入账金额' : '回款金额')"
              :disabled="addType!='add'"
            >
              <span slot="append">元</span>
            </Input>
          </FormItem>
          <FormItem label="入账类型：" prop="entryType" v-if="addType=='add'">
            <Input v-model="addForm.entryType" placeholder="请填写入账类型" maxlength="50"></Input>
          </FormItem>
          <FormItem label="收款银行：" prop="bank" v-if="addType=='add'">
            <Input v-model="addForm.bank" placeholder="请填写收款银行" maxlength="20"></Input>
          </FormItem>
          <div style="display:flex;" v-if="addType!='add'">
            <span style="margin-left: 50px;margin-top: 7px;">业务线：</span>
            <div>
              <FormItem label="号码认证" prop="numberAuthAmount" :label-width="70">
                <Input v-model="addForm.numberAuthAmount" placeholder="号码认证">
                  <span slot="append">元</span>
                </Input>
              </FormItem>
              <FormItem label="DSP业务" prop="dspAmount" :label-width="70">
                <Input v-model="addForm.dspAmount" placeholder="DSP业务">
                  <span slot="append">元</span>
                </Input>
              </FormItem>
              <FormItem label="SP业务" prop="spAmount" :label-width="70">
                <Input v-model="addForm.spAmount" placeholder="SP业务">
                  <span slot="append">元</span>
                </Input>
              </FormItem>
              <FormItem label="网络消息" prop="networkAmount" :label-width="70">
                <Input v-model="addForm.networkAmount" placeholder="网络消息">
                  <span slot="append">元</span>
                </Input>
              </FormItem>
              <FormItem label="快应用" prop="fastappAmount" :label-width="70">
                <Input v-model="addForm.fastappAmount" placeholder="快应用">
                  <span slot="append">元</span>
                </Input>
              </FormItem>
              <FormItem label="智能短信" prop="smsAmount" :label-width="70">
                <Input v-model="addForm.smsAmount" placeholder="智能短信">
                  <span slot="append">元</span>
                </Input>
              </FormItem>
            </div>
          </div>
          <FormItem label="备注：" prop="remark" v-if="addType!='add'">
            <Input v-model="addForm.remark"
              placeholder="请填写备注(20字内)"
              maxlength="20"
              :rows="1"
              show-word-limit
              type="textarea"></Input>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button type="primary" style="margin-left:10px;" @click="addSubmit('addForm')">确定</Button>
        <Button @click="addModel = false">取消</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import axios from "@/libs/api.request";
import { datefmt } from "@/utils/dateFormat";
import config from "./config.js";
import moment, { months } from "moment";
import hasShowAccess from "@/libs/hasShowAccess.js";
import { getToken, uuid } from "@/libs/util";

moment.locale("zh-cn");
const defaultForm = {
  entryDate: "",
  companyName: "",
  collectionSubject: "",
  entryAmount: "",
  entryType: "",
  bank: "",
  numberAuthAmount: "",
  dspAmount: "",
  spAmount: "",
  networkAmount: "",
  fastappAmount: "",
  smsAmount: "",
  remark: ''
};
export default {
  name: "returnedMoney",
  components: {
    columnsSelect: () => import("@/components/columns-select")
  },
  data() {
    const validateUnitPrice = function(type, required) {
      return (rule, value, callback) => {
        if (!value && required) {
          return callback(new Error(type + "为必填项"));
        }
        if (
          !/^(([^0][0-9]{0,7}|0)\.([0-9]{1,2})$)|^([^0]([0-9]{0,7})?|0)$/.test(
            value
          )
        ) {
          callback(new Error(type + "限制小数点前8位，后2位"));
        } else {
          callback();
        }
      };
    };
    const validateTime = (rule, value, callback) => {
      if (!value) {
        callback(new Error("日期为必填项"));
      } else {
        return callback();
      }
    };
    const defaultTime = [moment().subtract(1, "months").format("YYYY-MM-DD"), moment().format("YYYY-MM-DD")]
    return {
      moment: moment,
      formItem: {
        startDate: moment()
          .subtract(1, "months")
          .format("YYYY-MM-DD"),
        endDate: moment().format("YYYY-MM-DD"),
        companyName: "",
        time: defaultTime,
        incomeTime: defaultTime,
        pageSize: 10,
        pageIndex: 1
      },
      total_count: 0,
      dialogVisible: false,
      columns: config.refundOptTable,
      columnsSelection: [],
      rowData: [],
      listLoading: false,
      addModel: false,
      addForm: defaultForm,
      addValidate: {
        entryDate: [
          {
            required: true,
            trigger: "change",
            validator: validateTime
          }
        ],
        companyName: [
          {
            required: true,
            trigger: "change",
            message: "公司名称为必填项"
          }
        ],
        collectionSubject: [{
          required: true,
          trigger: "change",
          message: "回款主体为必填项"
        }],
        entryAmount: [
          {
            required: true,
            trigger: "change",
            validator: validateUnitPrice("入账金额", true)
          }
        ],
        bank: [
          {
            required: true,
            trigger: "change",
            message: "收款银行为必填项"
          }
        ],
        numberAuthAmount: [{
          trigger: "change",
          validator: validateUnitPrice("")
        }],
        dspAmount: [{
          trigger: "change",
          validator: validateUnitPrice("")
        }],
        spAmount: [
          {
            trigger: "change",
            validator: validateUnitPrice("")
          }
        ],
        networkAmount: [
          {
            trigger: "change",
            validator: validateUnitPrice("")
          }
        ],
        fastappAmount: [
          {
            trigger: "change",
            validator: validateUnitPrice("")
          }
        ],
        smsAmount: [
          {
            trigger: "change",
            validator: validateUnitPrice("")
          }
        ]
      },
      batchImportModal: false,
      reqFilesBatch: {
        files: null,
        fileName: ""
      },
      headers: {
        "X-Client-Token": getToken(),
        // "X-Client-Token":
        //   "eyJpc0VuYWJsZSI6MSwibGFzdExvZ2luIjoxNTgyODkzNjgwODczLCJuaWNrTmFtZSI6Imxpc2hhbnNoYW4iLCJ0b2tlbiI6IjgwX2xpc2hhbnNoYW5fMTU4Mjg5MzY4MDg3MyIsInVzZXJFbWFpbCI6Imxpc2hhbnNoYW5AdGVkZHltb2JpbGUuY24iLCJ1c2VySWQiOjgwLCJ1c2VyTmFtZSI6Imxpc2hhbnNoYW4ifQ==",

        "X-Client-Sdk": 2,
        "X-App-Id": "sdt_back_manager",
        "X-App-Version": 1,
        "X-Client-Time": Date.now(),
        "X-Request-Id": uuid(),
        "X-Request-Type": "",
        "X-Tdbear-Id": "",
        "X-Client-Unique": ""
      },
      uploadResponse: {
        result_excel: ""
      },
      uploadLoadingImport: false,
      onloadUrl:
        process.env.NODE_ENV === "production" ? "/page/static/" : "/static/",
      addType: "add",
      batchImportType: "normal",
      batchSelected: [],
      disabledDate: {
        disabledDate(date) {
          return date && date.valueOf() > Date.now();
        }
      }
    };
  },
  created() {
    this.searchData(true);
  },
  computed: {
    showAccess() {
      return el => {
        return hasShowAccess(el);
      };
    }
  },
  methods: {
    formatDate(value) {
      if (value) {
        return moment(value).format("YYYY-MM-DD");
      } else {
        return "";
      }
    },
    parseNumber(str) {
      // 只有整数部分有千位符
      return (
        str &&
        str
          .toString()
          .replace(/^\d+/g, m => m.replace(/\d{1,3}(?=(\d{3})+$)/g, "$&,"))
      );
    },
    pick(obj, arr) {
      return arr.reduce((iter, val) => {
        val in obj && (iter[val] = obj[val]);
        return iter;
      }, {});
    },
    columnsChange(columns) {
      this.columnsSelection = Array.prototype.concat({
        type: 'selection',
        width: 60,
        align: 'center',
        fixed: 'left'
      }, columns);
    },
    /** 点击账单编号，跳转非c或者c明细表 */
    clickStatementNoHanlder(statementNo) {
      const isCPSCPA = statementNo.startsWith('TDXCPSCPA')
      this.$router.push({
        name: isCPSCPA ? 'unCIncomeDetails' : (statementNo.startsWith('TDXYN') ? 'monthYearIncomeDetails' : 'incomeDetails'),
        params: {statementNo: statementNo}
      })
    },
    changeReportTime(data) {
      this.formItem.startDate = data[0];
      this.formItem.endDate = data[1];
      this.searchData(true)
    },
    changeIncomeTime(date) {
      this.formItem.incomeTime = date;
      this.searchData(true)
    },
    searchData(isfirst) {
      this.listLoading = true;
      if (isfirst) {
        this.formItem.pageIndex = 1;
      }
      let postData = this.pick(this.formItem, [
        "startDate",
        "endDate",
        "companyName",
        "pageIndex",
        "pageSize"
      ]);
      postData.startEntryDate = this.formItem.incomeTime[0];
      postData.endEntryDate = this.formItem.incomeTime[1];
      let _this = this;
      axios
        .request({
          url: "/finance/collectionList",
          method: "post",
          data: postData
        })
        .then(d => {
          if (d.data.code == 0) {
            _this.rowData = d.data.data.data;
            _this.total_count = d.data.data.total;
          } else {
            this.$Message.error(d.data.msg);
          }
          this.listLoading = false;
        })
        .catch(() => {
          this.listLoading = false;
          this.$Message.error("操作失败，请刷新重试");
        });
    },
    addNewHandler() {
      this.addModel = true;
    },
    batchImportHandler(type) {
      this.batchImportType = type;
      this.batchImportModal = true;
    },
    downloadReport(type) {
      let postData;
      if (type === "line") {
        postData = new FormData();
        postData.append("ids", this.batchSelected);
      } else {
        postData = this.pick(this.formItem, [
          "startDate",
          "endDate",
          "companyName"
        ]);
      }
      postData.startEntryDate = this.formItem.incomeTime[0];
      postData.endEntryDate = this.formItem.incomeTime[1];
      axios
        .request({
          url:
            type === "line"
              ? "/finance/collection/businessLineExport"
              : "/finance/collectionExport",
          method: "post",
          data: postData,
          responseType: "blob"
        })
        .then(res => {
          if (res.status == 200) {
            const content = res.data;
            const blob = new Blob([content]);
            const fileName =
              (type === "line"
                ? "处理业务线金额划分批量导出明细表"
                : "回款表导出明细表") + ".xls";
            if ("download" in document.createElement("a")) {
              // 非IE下载
              const elink = document.createElement("a");
              elink.download = fileName;
              elink.style.display = "none";
              elink.href = URL.createObjectURL(blob);
              document.body.appendChild(elink);
              elink.click();
              URL.revokeObjectURL(elink.href); // 释放URL 对象
              document.body.removeChild(elink);
            } else {
              // IE10+下载
              navigator.msSaveBlob(blob, fileName);
            }
            // } else {
            // let _this = this;
            //   let errorMessage = new Blob([res.data]);
            //   let errorFileReader = new FileReader();
            //   errorFileReader.readAsText(errorMessage, "utf-8");
            //   errorFileReader.onload = function() {
            //     _this.$Message.error(JSON.parse(errorFileReader.result).message);
            //   };
            // }
          } else {
            this.$Message.error("导出失败,请刷新重试");
          }
        })
        .catch(() => {
          this.$Message.error("导出失败");
        });
    },
    pageChange(val) {
      this.formItem.pageIndex = val;
      this.searchData();
    },
    pageSizeChange(val) {
      this.formItem.pageIndex = 1;
      this.formItem.pageSize = val;
      this.searchData();
    },
    closeAddModal(flag) {
      if (!flag) {
        this.$refs.addForm.resetFields();
        this.addType = "add";
        this.addForm = defaultForm;
      }
    },
    changeSelectTime(time) {
      this.addForm.entryDate = time;
    },
    onSelChange(selection) {
      this.batchSelected = selection.map(item => {
        return item.id;
      });
    },
    addSubmit(name) {
      let _this = this;
      this.$refs[name].validate(valid => {
        if (valid) {
          let url =
            _this.addType === "add"
              ? "finance/collectionAdd"
              : "/finance/collection/businessLineSplit";
          let param =
            _this.addType === "add"
              ? this.pick(_this.addForm, [
                  "entryDate",
                  "companyName",
                  "collectionSubject",
                  "entryAmount",
                  "entryType",
                  "bank"
                ])
              : this.pick(_this.addForm, [
                  "id",
                  "numberAuthAmount",
                  "dspAmount",
                  "spAmount",
                  "networkAmount",
                  "fastappAmount",
                  "smsAmount",
                  "remark"
                ]);
          let {
            entryDate,
            companyName,
            entryAmount,
            entryType,
            bank
          } = _this.addForm;
          axios
            .request({
              url,
              method: "post",
              data: param
            })
            .then(d => {
              if (d.data.code == 0) {
                _this.addModel = false;
                _this.searchData(true);
              } else {
                this.$Message.error(d.data.msg);
              }
            })
            .catch(() => {
              this.$Message.error("操作失败，请刷新重试");
            });
        }
      });
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
        this.$Message.success("上传成功,请查看结果");
        debugger;
        this.uploadResponse.result_excel = response.data;
        this.uploadLoadingImport = false;
        // this.requestUploadAgain(response.data);
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
    uploadErrorImport(error, file, fileList) {
      this.uploadLoadingImport = false;
      this.$Message.error("导入失败");
    },
    fileTagCloseBatch() {
      this.reqFilesBatch = {
        files: null,
        fileName: ""
      };
      this.uploadResponse.result_excel = "";
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
    checkResult() {
      let isXls =
        this.uploadResponse.result_excel.indexOf(".xlsx") > -1 ? false : true;
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
          link.setAttribute(
            "download",
            (this.batchImportType === "line"
              ? "入账明细回款拆分导入结果"
              : "入账明细批量导入结果") + (isXls ? ".xls" : ".xlsx")
          );
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        })
        .catch(err => {
          this.$Message.error("导出失败");
        });
    },
    editCurrentLine(row, type) {
      const params = new FormData();
      params.append("id", row.id);
      axios
        .request({
          url: "/finance/collectionGet",
          method: "post",
          data: params
        })
        .then(res => {
          if (res.data.code == 0) {
            this.addType = type;
            let resData = res.data.data;
            this.addForm = {
              ...resData,
              entryDate: this.formatDate(resData.entryDate),
              id: row.id
            };
            this.addModel = true;
          } else {
            this.$Message.error(res.data.msg);
          }
        })
        .catch(err => {
          this.$Message.error("网络错误" + err);
        });
    },
    deleteCurrentLine(row) {
      this.$Modal.confirm({
        title: "删除",
        content: "<p>确定删除该条数据？</p>",
        onOk: () => {
          const params = new FormData();
          params.append("id", row.id);
          // params.append('age', 24)
          // params.append('someNumberString', '18')
          // xhr.send(params)
          axios
            .request({
              url: "/finance/collectionDel",
              method: "post",
              data: params
              // headers: { 'content-type': 'multipart/form-data' },
            })
            .then(res => {
              if (res.data.code == 0) {
                this.searchData();
              } else {
                this.$Message.error(res.data.msg);
              }
            })
            .catch(err => {
              this.$Message.error("网络错误" + err);
            });
        },
        onCancel: () => {}
      });
    },
    batchLineImport() {
      if (!this.batchSelected.length) {
        this.$Message.warning("请选择账单！");
        return;
      }
      this.batchImportModal = true;
    }
  }
};
</script>
<style scoped lang="less">
.bidAdName {
  cursor: pointer;
  color: #2d8cf0;
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
.businessLines {
  display: flex;
  margin-bottom: 24px;
  span {
    width: 80px;
  }
}
/deep/ .ivu-input-type-textarea .ivu-input-word-count {
  align-items: flex-end;
  top: auto;
}
/deep/ .ivu-input-word-count {
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
.layout-table {
  .statementNo {
    color: #515a6e;
    background-color: #fff;
    border: 1px dashed #dcdee2;
    border-radius: 3px;
    margin: 2px;
    padding: 2px;
  }
  .statementNo:hover {
    color:#94cef5;
    border-color: #94cef5;
    cursor: pointer;
  }
}
</style>

