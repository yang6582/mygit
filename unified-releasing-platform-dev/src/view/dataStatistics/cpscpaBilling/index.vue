<template>
  <div>
    <Form :model="formItem" :label-width="80" :inline="true" style="">
      <FormItem label="操作日期:">
        <Date-picker 
            :value="formItem.time"
            format="yyyy-MM-dd"
            type="daterange"
            placeholder="选择日期"
            style="width: 180px"
            @on-change="changeReportTime"
        ></Date-picker>
      </FormItem>
      <FormItem label="客户名称:">
        <Input
          v-model.trim="formItem.customerName"
          placeholder="客户名称"
          @on-enter="searchData(true)"
          clearable
        />
      </FormItem>
      <FormItem label="广告名称:">
        <Input
          v-model.trim="formItem.adName"
          placeholder="广告名称"
          @on-enter="searchData(true)"
          clearable
        />
      </FormItem>
      <FormItem :label-width="30">
        <Button type="primary" @click="searchData(true)" style="margin-left:10px">查询</Button>
        <Button type="primary" @click="downloadReport" style="margin-left: 10px" v-if="showAccess('数据统计_CPS/CPA分润表_批量导出')">批量导出</Button>
        <Button type="primary" @click="batchImportModal = true" style="margin-left:10px" v-if="showAccess('数据统计_CPS/CPA分润表_批量导入')">批量导入</Button>
        <Button type="primary" @click="addNewHandler" style="margin-left:10px" v-if="showAccess('数据统计_CPS/CPA分润表_新增')">新增</Button>
      </FormItem>
    </Form>
    <div class="layout-table">
      <Table
        border
        :columns="columns"
        :data="rowData"
        :loading="listLoading"
        style="overflow-x:scroll;"
      >
        <template slot-scope="{row, index}" slot="statisticDate">
            <div>{{moment(row.startDate).format("YYYYMMDD") + '-' + moment(row.endDate).format('YYYYMMDD')}}</div>
        </template>
        <template slot-scope="{row, index}" slot="operateTime">
            <div>{{formatDate(row.operateTime)}}</div>
        </template>
        <template slot-scope="{row, index}" slot="totalIncome">
            <div>{{parseNumber(row.totalIncome)}}</div>
        </template>
        <template slot-scope="{row, index}" slot="clickCount">
            <div>{{parseNumber(row.clickCount)}}</div>
        </template>
        <template slot-scope="{row, index}" slot="balanceCount">
            <div>{{parseNumber(row.balanceCount)}}</div>
        </template>
        <template slot-scope="{row, index}" slot="chargedType">
            <div>{{row.chargedType == '1' ? 'CPA' : 'CPS'}}</div>
        </template>
      </Table>
      <Page
        :total="total_count"
        size="small"
        :current="formItem.page"
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
      title="批量导入"
      v-model="batchImportModal"
      :mask-closable="false"
      @on-visible-change="importBatchImportClose"
    >
      <div class="importContent">
        <Upload
          action="/statistic/cpacps/import"
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
          :href="onloadUrl + 'CPS_CPA分润表导入模板.xlsx'"
          download="CPS_CPA分润表导入模板.xlsx"
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
      title="新增"
      v-model="addModel" width="600"
      :mask-closable="false"
      @on-visible-change="closeAddModal"
    >
    <div style="padding:0 40px 0 0;">
        <Form ref="addForm" :model="addForm" :rules="addValidate" :label-width="110">
          <FormItem label="日期：" prop="statisticDate" >
            <DatePicker v-model="addForm.statisticDate" type="daterange" placeholder="请选择日期" style="width: 418px"
              @on-change="changeSelectTime"></DatePicker>
          </FormItem>
          <FormItem label="客户名称：" prop="customerName">            
            <Select
                ref="shopSelect"
                v-model="addForm.customerName"
                filterable
                clearable
                remote
                placeholder="请输入客户名称"
                :remote-method="remoteSearchCustom"
                :loading="loadingCustoms"
                @on-query-change="companyNameChange"
                @on-change="changeSelectCustom"
                >
                <Option v-for="(option, index) in customList" :value="option.custom_username" :key="index" :label="option.custom_username">{{option.custom_username}}</Option>
            </Select>
          </FormItem>
          <FormItem label="公司名称：" prop="companyName">
            <Input v-model="addForm.companyName" placeholder="" disabled></Input>
          </FormItem>
          <FormItem label="广告名称：" prop="adName">
            <Input v-model="addForm.adName" placeholder="请填写广告名称"></Input>
          </FormItem>
          <FormItem label="广告原链：" prop="adUrl">
            <Input v-model="addForm.adUrl" placeholder="请填写广告原链"></Input>
          </FormItem>
          <FormItem label="结算数据：" prop="balanceCount">
            <Input v-model="addForm.balanceCount" placeholder="请填写结算数据"><span slot="append">元</span></Input>
          </FormItem>
          <FormItem label="结算单价：" prop="payUnitPrice">
            <Input v-model="addForm.payUnitPrice" placeholder="请填写结算单价"><span slot="append">元</span></Input>
          </FormItem>
          <FormItem label="总营收" prop="totalIncome">
            <Input v-model="addForm.totalIncome" placeholder="请填写总营收"><span slot="append">元</span></Input>
          </FormItem>
          <FormItem label="点击量：" prop="clickCount">
            <Input v-model="addForm.clickCount" placeholder="请填写点击量"></Input>
          </FormItem>
          <FormItem label="平均单价：" prop="avgUnitPrice">
            <Input v-model="addForm.avgUnitPrice" placeholder="请填写平均单价"><span slot="append">元</span></Input>
          </FormItem>
          <FormItem label="结算方式：" prop="chargedType">
            <RadioGroup v-model="addForm.chargedType">
              <Radio label="1">CPA</Radio>
              <Radio label="2">CPS</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="vivo返款金额：" prop="returnMoneyVivo">
            <Input v-model="addForm.returnMoneyVivo" placeholder="请填写vivo返款金额"><span slot="append">元</span></Input>
          </FormItem>
          <FormItem label="oppo返款金额：" prop="returnMoneyOppo">
            <Input v-model="addForm.returnMoneyOppo" placeholder="请填写oppo返款金额"><span slot="append">元</span></Input>
          </FormItem>
          <FormItem label="金立返款金额：" prop="returnMoneyJinli">
            <Input v-model="addForm.returnMoneyJinli" placeholder="请填写金立返款金额"><span slot="append">元</span></Input>
          </FormItem>
          <FormItem label="快应用返款金额：" prop="returnMoneyFastapp">
            <Input v-model="addForm.returnMoneyFastapp" placeholder="请填写快应用返款金额"><span slot="append">元</span></Input>
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
import moment from "moment";
import hasShowAccess from "@/libs/hasShowAccess.js";
import { getToken, uuid } from "@/libs/util";

moment.locale("zh-cn");

export default {
  name: "cpscpaBilling",
  components: {
  },
  data() {
    const validateStatementSum = function(type){
        return (rule, value, callback) => {
            if (!value) {
                return callback(new Error(type + '为必填项'));
            }
            if (!/^\d{1,8}$/.test(value)) {
                callback(new Error(type + '只支持8位数字'));
            } else {
                callback();
            }
        }
    };
    const validateUnitPrice = function(type){
        return (rule, value, callback) => {
            if (!value) {
                return callback(new Error(type + '为必填项'));
            }
            if (!/^(([^0][0-9]{0,1}|0)\.([0-9]{1,4})$)|^([^0]([0-9]{0,1})?|0)$/.test(value)) {
                callback(new Error(type + '支持小数点前2位，后4位'));
            } else {
                callback();
            }
        }
    };
    const validateStatementPrice = function(type){
        return (rule, value, callback) => {
            if (!value) {
                return callback(new Error(type + '为必填项'));
            }
            if (!/^(([^0][0-9]{0,7}|0)\.([0-9]{1,4})$)|^([^0]([0-9]{0,7})?|0)$/.test(value)) {
                callback(new Error(type + '支持小数点前8位，后4位'));
            } else {
                callback();
            }
        }
    };
    const validateReturnMoney = function(type){
        return (rule, value, callback) => {
            if (!value) {
                return callback();
            }
            if (!/^(([^0][0-9]{0,7}|0)\.([0-9]{1,4})$)|^([^0]([0-9]{0,7})?|0)$/.test(value)) {
                callback(new Error(type + '支持小数点前8位，后4位'));
            } else {
                callback();
            }
        }
    };
    const validateTotalRevenue = (rule, value, callback) => {
        if (!value) {
            return callback(new Error('总营收为必填项'));
        }
        if (!/^(([^0][0-9]{0,7}|0)\.([0-9]{1,4})$)|^([^0]([0-9]{0,7})?|0)$/.test(value)) {
            callback(new Error('总营收支持小数点前8位，后4位'));
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
    const customerName = [{
        required: true,
        message: "客户名称为必填项",
        trigger: "blur"
    }];
    const validateTime = (rule, value, callback) => {
        if (!value.length || !value[0] || !value[1]) {
            callback(new Error('日期为必填项'));
        } else {
            return callback();
        }
    };
    const dateNow = new Date()
    return {
      moment: moment,
      formItem: {
        optStartDate: this.formatDate(dateNow - 1000 * 60 * 60 * 24 * 8),
        optEndDate: this.formatDate(dateNow - 1000 * 60 * 60 * 24 * 1),
        // vendorType: '-1',
        customerName: '',
        adName: '',
        time: [this.formatDate(dateNow - 1000 * 60 * 60 * 24 * 8), this.formatDate(dateNow - 1000 * 60 * 60 * 24 * 1)],
        pageSize: 10,
        page: 1
      },
      total_count: 0,
      dialogVisible: false,
      columns: config.refundOptTable,
      rowData: [],
      listLoading: false,
      addModel: false,
      addForm: {
        statisticDate: [],
        customerName: '',
        companyName: '',
        adName: '',
        adUrl: '',
        balanceCount: '',
        payUnitPrice: '',
        totalIncome: '',
        clickCount: '',
        avgUnitPrice: '',
        chargedType: '1',
      },
      addValidate: {
        statisticDate: [{
            required: true,
            trigger: 'change',
            validator: validateTime
        }],
        customerName,
        companyName: [{
            required: true,
            trigger: 'change',
            message: "公司名称为必填项"
        }],
        adName: [{
            required: true,
            trigger: 'change',
            message: "广告名称为必填项"
        }],
        adUrl: [{
            required: true,
            trigger: 'change',
            validator: validUrlPass
        }],
        balanceCount: [{
            required: true,
            trigger: 'change',
            validator: validateStatementSum('结算数据')
        }],
        payUnitPrice: [{
            required: true,
            trigger: 'change',
            validator: validateUnitPrice('结算单价')
        }],
        totalIncome: [{
            required: true,
            trigger: 'change',
            validator: validateTotalRevenue
        }],
        clickCount: [{
            required: true,
            trigger: 'change',
            validator: validateStatementSum('点击量')
        }],
        avgUnitPrice: [{
            required: true,
            trigger: 'change',
            validator: validateUnitPrice('平均单价')
        }],
        chargedType: [{
            required: true,
            trigger: 'blur',
            message: "结算方式为必填项"
        }],
        returnMoneyVivo: [{
            trigger: 'change',
            validator: validateReturnMoney('返款金额')
        }],
        returnMoneyOppo: [{
            trigger: 'change',
            validator: validateReturnMoney('返款金额')
        }],
        returnMoneyJinli: [{
            trigger: 'change',
            validator: validateReturnMoney('返款金额')
        }],
        returnMoneyFastapp: [{
            trigger: 'change',
            validator: validateReturnMoney('返款金额')
        }]
      },
      loadingCustoms: false,
      customList: [],
      loadingAds: false,
      adsList: [],
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
      uploadSuccessBatchMsg: "",
      uploadSuccessBatchMsgNum: "",
      uploadSuccessBatchList: [],
      uploadResponse: {
        result_excel: ""
      },
      uploadLoadingImport: false,
      onloadUrl:
        process.env.NODE_ENV === "production" ? "/page/static/" : "/static/",
    };
  },
  created() {
    this.searchData(true)
  },
  computed: {
    showAccess() {
        return el => {
            return hasShowAccess(el);
        };
    },
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
        return str && str.toString().replace(/^\d+/g, (m) => m.replace(/\d{1,3}(?=(\d{3})+$)/g, '$&,'))
    },
    pick(obj, arr) {
      return arr.reduce((iter, val) => {
        val in obj && (iter[val] = obj[val])
        return iter
      }, {})
    },
    changeReportTime (data) {
      this.formItem.optStartDate = data[0]
      this.formItem.optEndDate = data[1]
    },
    searchData(isfirst) {
      this.listLoading = true;
      if (isfirst) {
        this.formItem.page = 1;
      }
      let postData = this.pick(this.formItem, ['optStartDate', 'optEndDate', 'customerName', 'adName', 'page', 'pageSize'])
      let _this = this;
      axios
        .request({
          url: "statistic/cpacps/find",
          method: "post",
          data: postData
        })
        .then(d => {
          if (d.data.code == 0) {
            _this.rowData = d.data.data.data
            _this.total_count = d.data.data.total
          } else {
            this.$Message.error(d.data.msg);
          }
          this.listLoading = false;
        })
        .catch(() => {
          this.listLoading = false;
          this.$Message.error("操作失败，请刷新重试")
        });
    },
    chargeHandler() {
        this.chargeModal = true
    },
    addNewHandler() {
      this.addModel = true
    },
    downloadReport() {
      let postData = this.pick(this.formItem, 
        ['optStartDate', 'optEndDate', 'customerName', 'vendorType', 'adName', 'page', 'pageSize'])
      axios
        .request({
          url: "statistic/cpacps/export",
          method: "post",
          data: postData,
          responseType: 'blob'
        }).then(res => {
          if (res.status == 200) {
              const content = res.data;
              const blob = new Blob([content]);
              const fileName = "CPS/CPA分润表导出" + ".xls";
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
            this.$Message.error("导出失败,请刷新重试")
          }
        })
        .catch(() => {
          this.$Message.error("导出失败")
        });
    },
    pageChange(val) {
      this.formItem.page = val;
      this.searchData();
    },
    pageSizeChange(val) {
      this.formItem.page = 1;
      this.formItem.pageSize = val;
      this.searchData();
    },
    closeAddModal(flag) {
      if (!flag) {
        this.$refs.addForm.resetFields()
      }
    },
    changeSelectTime(time) {
        this.addForm.statisticDate = time
    },
    remoteSearchCustom(query) {
        if (!query) {
            return
        }
        let _this = this
        this.loadingCustoms = true
        axios.request({
            url: 'ad/customer/searchTaxInfoByCustomerName',
            method: "post",
            data: {name: query}
        })
        .then(res => {
            if (res.data.code === 0) {
                let data = res.data.data
                if (!data.length) {
                    _this.$Message.warning('请填写正确的客户名称！')
                } else {
                    _this.customList = data ? data : [] 
                }
            } else {
                this.$Message.error(res.data.msg)
            }
            _this.loadingCustoms = false
        })
        .catch(err => {
            this.$Message.error("请求异常，请稍后再试！")
            this.loadingCustoms = false
        });
    },
    companyNameChange(query) {
    },
    changeSelectCustom(val) {
      if (!val) {
        return
      }
      let filterCustom = this.customList.filter(item => {return item.custom_username == val})
      if (filterCustom.length) {
        this.addForm.customerId = filterCustom[0].id
        this.$set(this.addForm, 'companyName', filterCustom[0].company_name ? filterCustom[0].company_name : '')
      }
    },
    remoteSearchAds(query) {
        if (!query) {
            return
        }
        let _this = this
        this.loadingAds = true
    },
    addSubmit(name) {
      let _this = this
        this.$refs[name].validate(valid => {
            if (valid) {
                let param = {}
                let url = 'statistic/cpacps/add'
                let {statisticDate, ...postData} = _this.addForm
                axios
                  .request({
                    url,
                    method: "post",
                    data: {...postData, startDate: _this.addForm.statisticDate[0], endDate: _this.addForm.statisticDate[1]}
                  })
                  .then(d => {
                    if (d.data.code == 0) {
                      _this.addModel = false
                      _this.searchData(true)
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
          url: "/statistic/cpacps/getImportResult",
          method: "post",
          data: {
            taskId: taskId
          }
        })
        .then(res => {
          if (res.data.code === 0) {
            if (res.data.data.status === 1) {
              this.requestUploadAgain(res.data.data.taskId);
            } else if (res.data.data.status === 2) {
              this.$Message.success("上传成功,请查看结果");
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
          link.setAttribute("download", "批量导入cps/cpa分润表结果.xlsx");
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        })
        .catch(err => {
          this.$Message.error("导出失败");
        });
    },
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

