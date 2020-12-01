<template>
  <div>
    <!-- 制单 -->
    <Form :model="formItem" :label-width="80" :inline="true" style="">
      <FormItem label="时间:">
        <Date-picker 
            :value="formItem.time"
            format="yyyy-MM-dd"
            type="daterange"
            placeholder="选择时间"
            style="width: 180px"
            @on-change="changeReportTime"
        ></Date-picker>
      </FormItem>
      <FormItem label="时间类型:">
        <Select
          v-model="formItem.dateType"
          style="width:180px"
          @on-change="searchData(true)"
        >
          <Option :value="1">制单时间</Option>
          <Option :value="2">审批时间</Option>
        </Select>
      </FormItem>
      <FormItem label="充值类型:">
        <Select
          v-model="formItem.type"
          style="width:180px"
          @on-change="searchData(true)"
        >
          <Option :value="0">全部</Option>
          <Option :value="1">现金充值</Option>
          <!-- <Option :value="2">信用充值</Option> -->
          <Option :value="128">退款</Option>
        </Select>
      </FormItem>
      <FormItem label="审批状态:">
        <Select
          v-model="formItem.status"
          style="width:180px"
          @on-change="searchData(true)"
        >
          <Option :value="0">全部</Option>
          <Option :value="1">待审批</Option>
          <Option :value="2">同意</Option>
          <Option :value="3">拒绝</Option>
        </Select>
      </FormItem>
      <FormItem :label-width="30">
        <Button type="primary" @click="chargeHandler" style="margin-left:10px" v-if="showAccess('财务管理_充值_充值')">充值</Button>
        <Button type="primary" @click="refundHandler" style="margin-left:10px" v-if="showAccess('财务管理_充值_退款')">退款</Button>
        <Button type="primary" @click="searchData(true)" style="margin-left:10px">查询</Button>
        <Button type="primary" @click="downloadReport" style="margin-left: 10px" v-if="showAccess('财务管理_充值_制单导出')">导出</Button>
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
        <template slot-scope="{row, index}" slot="fee">
          <span v-html="parseNumber(row.fee)"></span>
        </template>
        <template slot-scope="{row, index}" slot="receipt_date">
          <span v-if="row.receipt_date">{{row.receipt_date}}</span>
        </template>
        <!-- <template slot-scope="{row, index}" slot="memo">
            <Tooltip placement="top" transfer>
              <div
                slot="content"
                style="width: 220px; white-space: normal;word-break: break-all;"
              >{{row.memo}}</div>
              <Button
                size="small"
                style="color:#59afed"
                v-if="row.memo"
              >查看</Button>
            </Tooltip>
        </template> -->
      </Table>
      <Page
        :total="total_count"
        size="small"
        :current="formItem.page"
        @on-change="pageChange"
        :page-size="formItem.limit"
        @on-page-size-change="pageSizeChange"
        show-sizer
        show-total
        show-elevator
        style="margin-top:10px;float:right"
      ></Page>
    </div>
    <Modal
      title="充值"
      v-model="chargeModal" width="600"
      :mask-closable="false"
      @on-visible-change="closeAddModal"
    >
    <div style="padding:0 40px 0 0;">
        <Form ref="rechargeForm" :model="rechargeForm" :rules="rechargeValidate" :label-width="110">
          <FormItem label="客户名称：" prop="customUsername">
            <Input v-model="rechargeForm.customUsername" placeholder="请填写客户名称"
            @on-blur="searchUserInfo('rechargeForm')" clearable></Input>
          </FormItem>
          <FormItem label="公司名称：" prop="enterpriseName">
            <Input v-model="rechargeForm.enterpriseName" placeholder="" disabled></Input>
          </FormItem>
          <FormItem label="回款编号：" prop="serialNumber">
            <Input v-model="rechargeForm.serialNumber" placeholder="请填写回款编号"
            @on-blur="searchCollectionNumber" clearable></Input>
          </FormItem>
          <FormItem label="回款公司：" prop="collectionCompany">
            <Input v-model="rechargeForm.collectionCompany" placeholder="请填写回款公司" maxlength="20" disabled></Input>
          </FormItem>
          <FormItem label="到款日期：" prop="receiptDate">
            <DatePicker
              v-model="rechargeForm.receiptDate"
              type="date"
              @change="changeReceiptDate"
              placeholder="请选择日期"
              format="yyyy-MM-dd"
              disabled
            ></DatePicker>
          </FormItem>
          <FormItem label="充值类型：" prop="type">
            <RadioGroup v-model="rechargeForm.type">
              <Radio label="1">现金充值</Radio>
              <!-- <Radio label="2">信用充值</Radio> -->
            </RadioGroup>
          </FormItem>
          <FormItem label="充值金额：" prop="fee">
            <Input v-model="rechargeForm.fee" placeholder="请填写充值金额" clearable><span slot="append">元</span></Input>
          </FormItem>
          <FormItem label="备注：" prop="memo">
            <Input v-model="rechargeForm.memo" type="textarea" :row="2" placeholder="" clearable></Input>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button type="primary" style="margin-left:10px;" @click="rechargeSubmit('rechargeForm')">确定</Button>
        <Button @click="chargeModal = false">取消</Button>
      </div>
    </Modal>
    <Modal
      title="退款"
      v-model="refundModal" width="600"
      :mask-closable="false"
      @on-visible-change="closeRefundModal"
    >
    <div style="padding:0 40px 0 0;">
        <Form ref="refundForm" :model="refundForm" :rules="refundValidate" :label-width="110">
          <FormItem label="客户名称：" prop="customUsername">
            <Input v-model="refundForm.customUsername" placeholder="请填写客户名称"
            @on-blur="searchUserInfo('refundForm')" clearable></Input>
          </FormItem>
          <FormItem label="公司名称：" prop="enterpriseName">
            <Input v-model="refundForm.enterpriseName" placeholder="" disabled></Input>
          </FormItem>
          <FormItem label="可退金额：" prop="refundFee">
            <Input v-model="refundForm.refundFee" placeholder="" disabled>
            <span slot="append">元</span>
            </Input>
          </FormItem>
          <FormItem label="退款金额：" prop="fee">
            <Input v-model="refundForm.fee" placeholder="请填写退款金额" clearable>
            <span slot="append">元</span>
            </Input>
          </FormItem>
          <FormItem label="备注：" prop="memo">
            <Input v-model="refundForm.memo" type="textarea" :row="2" placeholder=""></Input>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button type="primary" style="margin-left:10px;" @click="rechargeSubmit('refundForm')">确定</Button>
        <Button @click="refundModal = false">取消</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import axios from "@/libs/api.request";
import { datefmt } from "@/utils/dateFormat";
import config from "../config.js";
import moment from "moment";
import hasShowAccess from "@/libs/hasShowAccess.js";

moment.locale("zh-cn");

export default {
  name: "refundOpt",
  components: {
    columnsSelect: () => import("@/components/columns-select")
  },
  data() {
    const validateSum = function (type) {
      return (rule, value, callback) => {
        if (!value) {
          return callback(new Error(type + '金额为必填项'))
        }
        if (/^(([^0][0-9]{0,7}|0)\.([0-9]{1,4})$)|^([^0]([0-9]{0,7})?|0)$/.test(value)) {
          callback()
        } else {
          callback(new Error(type + '金额支持小数点前8位，后四位'))
        }
      }
    }
    const validateCustom = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('客户名称为必填项'))
      }
      if (!this.rechargeForm.enterpriseName) {
        return callback(new Error('客户不存在，无法进行下一步操作'))
      } else {
        callback()
      }
    };
    const customUsername = [{
        required: true,
        message: "客户名称为必填项",
        trigger: "blur"
    }];
    const serialNumber = [{
      required: true,
      message: "回款编号为必填项",
      trigger: "blur"
    }];
    const fee = [{
        required: true,
        trigger: "change",
        type: 'number',
        validator: validateSum
    }];
    const type = [{
      required: true,
      message: "充值类型为必填项",
      trigger: "blur"
    }];
    const  memo = [{
      required: true,
      message: "备注为必填项",
      trigger: "change"
    }]
    const dateNow = new Date()
    return {
      disabledDate: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 86400000;
        }
      },
      formItem: {
        startDate: this.formatDate(dateNow - 1000 * 60 * 60 * 24 * 8),
        endDate: this.formatDate(dateNow),
        dateType: 1,
        type: 0,
        status: 0,
        time: [this.formatDate(dateNow - 1000 * 60 * 60 * 24 * 8), this.formatDate(dateNow)],
        // submitTime: [new Date(Date.now() - 1000 * 60 * 60 * 24 * 90), new Date()],
        limit: 10,
        page: 1
      },
      total_count: 0,
      dialogVisible: false,
      columns: config.refundOptTable,
      rowData: [],
      listLoading: false,
      chargeModal: false,
      refundModal: false,
      rechargeForm: {
        customUsername: '',
        serialNumber: '',
        type: '1',
        enterpriseName: '',
        fee: '',
        memo: '',
        collectionCompany: '',
        receiptDate: ''
      },
      refundForm: {
        customUsername: '',
        enterpriseName: '',
        refundFee: '',
        fee: '',
        memo: ''
      },
      refundValidate: {
        customUsername,
        fee: [{
          required: true,
          trigger: "change",
          type: 'number',
          validator: validateSum('退款')
      }],
        memo
      },
      rechargeValidate: {
        customUsername,
        serialNumber,
        collectionCompany: [{
          required: true,
          trigger: "change",
          message: '回款公司为必填项'
        }],
        receiptDate: [{
          required: true,
          type: 'date',
          trigger: 'change',
          message: '到款日期为必填项'
        }],
        fee: [{
          required: true,
          trigger: "change",
          type: 'number',
          validator: validateSum('充值')
      }],
        type,
        memo
      }
    };
  },
  created() {
    this.searchData(true)
    this.Observer.$on("updateBill", () => {
      this.searchData(true);
    });
  },
  computed: {
    showAccess() {
        return el => {
            return hasShowAccess(el);
        };
    },
  },
  methods: {
    parseNumber(str) {
        return str && str.toString().replace(/^\d+/g, (m) => m.replace(/\d{1,3}(?=(\d{3})+$)/g, '$&,'))
    },
    formatDate(value) {
      if (value) {
        return moment(value).format("YYYY-MM-DD");
      } else {
        return "";
      }
    },
    pick(obj, arr) {
      return arr.reduce((iter, val) => {
        val in obj && (iter[val] = obj[val])
        return iter
      }, {})
    },
    changeReportTime (data) {
      this.formItem.startDate = data[0]
      this.formItem.endDate = data[1]
    },
    changeReceiptDate(time) {
        this.rechargeForm.receiptDate = time;
    },
    searchData(isfirst) {
      this.listLoading = true;
      if (isfirst) {
        this.formItem.page = 1;
      }
      let postData = this.pick(this.formItem, ['startDate', 'endDate', 'status', 'dateType', 'type', 'page', 'limit'])
      let _this = this;
      axios
        .request({
          url: "finance/originatorList",
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
    refundHandler() {
      this.refundModal = true
    },
    downloadReport() {
      let postData = this.pick(this.formItem, 
        ['startDate', 'endDate', 'status', 'dateType', 'type', 'page', 'limit'])
      // 奇怪的传参
      postData.cols = ['制单时间','客户名称','公司名称','充值类型','充值金额','备注','制单人','审批状态','审批时间','审批人']
      axios
        .request({
          url: "finance/originatorExport",
          method: "post",
          data: postData,
          responseType: 'blob'
        }).then(res => {
          if (res.status == 200) {
              const content = res.data;
              const blob = new Blob([content]);
              const fileName = "制单报表导出" + ".xls";
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
      this.formItem.limit = val;
      this.searchData();
    },
    closeAddModal(flag) {
      if (!flag) {
        this.$refs.rechargeForm.resetFields()
      }
    },
    closeRefundModal(flag) {
      if (!flag) {
        this.$refs.refundForm.resetFields()
      }
    },
    rechargeSubmit(name) {
      let _this = this
        this.$refs[name].validate(valid => {
            if (valid) {
                let param = {}
                let url = 'finance/cashBack'
                if (_this[name].enterpriseName == '') {
                  this.$Message.error('用户不存在，无法进行下一步操作');
                  return
                }
                if (name == 'rechargeForm') {
                  param.type = _this.rechargeForm.type
                  param.collectionCompany = _this.rechargeForm.collectionCompany
                  param.serialNumber = _this.rechargeForm.serialNumber
                  param.receiptDate = moment(_this.rechargeForm.receiptDate.getTime()).format("YYYYMMDD")
                  url = 'finance/recharge'
                } else {
                  if (Number(_this.refundForm.fee) > Number(_this.refundForm.refundFee)) {
                    this.$Message.error('退款失败，退款金额应小于等于可退金额！');
                    return
                  }
                }
                param.customUsername = _this[name].customUsername
                param.fee = _this[name].fee
                param.memo = _this[name].memo
                axios
                  .request({
                    url,
                    method: "post",
                    data: param
                  })
                  .then(d => {
                    if (d.data.code == 0) {
                      if (name == 'rechargeForm') {
                        _this.chargeModal = false
                      } else {
                        _this.refundModal = false
                      }
                      _this.searchData(true)
                      _this.Observer.$emit('updateAudit')
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
    /** 
     * 根据输入的用户名获取用户的信息 
     * */
    searchUserInfo(type) {
      let _this = this
      if (!_this[type].customUsername) {
        return
      }
      axios
        .request({
          url: "finance/companyInfo/" + _this[type].customUsername,
          method: "get"
        })
        .then(d => {
          if (d.data.code == 0) {
            if (type == 'refundForm') {
              _this.$set(_this[type], 'refundFee', d.data.data.custom_info.financeInfoByID.cash_balance)
            }
            _this.$set(_this[type], 'enterpriseName', d.data.data.custom_info.company_name)
          } else {
            _this[type].enterpriseName = ''
            if (type == 'refundForm') {
              _this[type].refundFee = ''
            }
            this.$Message.error(d.data.msg);
          }
        })
        .catch(() => {
          this.$Message.error("操作失败，请刷新重试")
        });
    },
    searchCollectionNumber() {
      let _this = this
      let postData = new FormData()
      postData.append("serialNumber", this.rechargeForm.serialNumber);
      axios
        .request({
          url: "/finance/collectionGetBySerialNumber",
          method: "post",
          data: postData
        })
        .then(d => {
          if (d.data.code == 0 && d.data.data) {
            _this.$set(_this.rechargeForm, 'collectionCompany', d.data.data.companyName)
            _this.$set(_this.rechargeForm, 'receiptDate', _this.formatDate(d.data.data.entryDate))
            _this.$set(_this.rechargeForm, 'memo', d.data.data.remark)
          } else {
            // _this[type].enterpriseName = ''
            _this.$Message.error(d.data.msg);
          }
        })
        .catch(() => {
          this.$Message.error("操作失败，请刷新重试")
        });
    }
  }
};
</script>
<style scoped lang="less">
.ivu-btn-primary .margin-15 {
  margin: 0 10px;
}

/deep/ .subCol ul li {
  list-style: none;
  text-align: center;
  border-bottom: 1px solid #e8eaec;
  overflow: hidden;
}

/deep/ .subCol ul li:last-child {
  border-bottom: none;
}

/deep/ .ivu-table-cell {
  padding: 0px;
}

.layout-table {
  padding-right: 10px;
  //padding-top: 20px;
}
</style>

