<template>
  <div>
    <Form :model="formItem" :label-width="80" :inline="true" style="margin-top: 20px">
      <FormItem label="开票时间:">
        <Date-picker
          :value="formItem.applyTime"
          format="yyyy-MM-dd"
          @on-change="applyTimeChange"
          type="daterange"
          placeholder="选择日期"
          style="width: 180px"
        ></Date-picker>
      </FormItem>
      <FormItem label="开票主体:">
        <Input
          v-model.trim="formItem.serviceName"
          placeholder="开票主体"
          @on-enter="searchData(true)"
          clearable
          style="width: 180px"
        />
      </FormItem>
      <FormItem label="公司名称:">
        <Input
          v-model.trim="formItem.companyName"
          placeholder="公司名称"
          @on-enter="searchData(true)"
          clearable
          style="width: 180px"
        />
      </FormItem>
      <FormItem label="业务类型:">
        <Select
          v-model="formItem.invoiceBussinessType"
          style="width:180px"
          @on-change="searchData(true)"
        >
          <Option value="-1">全部</Option>
          <Option v-for="(item, index) in invoiceBussinessType" :key="item" :value="item">{{item}}</Option>
        </Select>
      </FormItem>
      <FormItem label="状态:">
        <Select
          v-model="formItem.invoiceStatus"
          style="width:180px"
          @on-change="searchData(true)"
        >
          <Option :value="-1">全部</Option>
          <Option v-for="(value, key) in invoiceStatus" :key="key" :value="key">{{value}}</Option>
        </Select>
      </FormItem>
      <FormItem :label-width="30">
        <Button type="primary" @click="searchData(true)" style="margin-left:10px">查询</Button>
        <Button type="primary" @click="addNewReceipt('add')" style="margin-left: 10px" v-if="showAccess('财务管理_开票_开票申请')">开票申请</Button>
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
        <template slot-scope="{ row, index }" slot="invoiceStatus">
          <span>{{invoiceStatus[row.invoiceStatus]}}</span>
        </template>
        <template slot-scope="{ row, index }" slot="serviceName">
          <span>{{formatServiceName(row.serviceName)}}</span>
        </template>
        <template slot-scope="{ row, index }" slot="billDate">
          <span v-if="row.billDate.length">{{row.billDate.join(',')}}</span>
        </template>
        <template slot-scope="{ row, index }" slot="invoiceMoney">
          <span>{{row.invoiceMoney | parseNumber}}</span>
        </template>
        <template slot-scope="{ row, index }" slot="realIncome">
          <span>{{row.realIncome | parseNumber}}</span>
        </template>
        <template slot-scope="{row, index}" slot="rejectedReason">
          <Tooltip placement="top" max-width="120" transfer theme="light" v-if="row.rejectedReason">
            <div slot="content" style="word-wrap:break-word">{{row.rejectedReason}}</div>
            <div style="max-width:120px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">{{row.rejectedReason}}</div>
          </Tooltip>
          <div v-else>-</div>
        </template>
        <template slot-scope="{row, index}" slot="invoiceNos">
          <Tooltip placement="top" max-width="120" transfer theme="light" v-if="row.invoiceNos">
            <div slot="content" style="word-wrap:break-word">{{row.invoiceNos.join(',')}}</div>
            <div style="max-width:120px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">{{row.invoiceNos.join(',')}}</div>
          </Tooltip>
        </template>
        <template slot-scope="{ row, index }" slot="createTime">
          <span v-html="formatDate(row.createTime)"></span>
        </template>
        <template slot-scope="{ row, index }" slot="statusOperTime">
          <span v-html="formatDate(row.statusOperTime)"></span>
        </template>
        <template slot-scope="{ row, index }" slot="action">
          <div style="display:flex;padding:0 15px;">
            <Button
              type="warning"
              size="small"
              @click="reviewReceipt(row, 'review')"
              v-if="row.invoiceStatus == 0 && showAccess('财务管理_开票_审核开票')"
            >审核开票</Button>
            <Button
              type="info"
              @click="reviewReceipt(row, 'detail')"
              size="small"
              v-if="(row.invoiceStatus == 1 || row.invoiceStatus == 2) && showAccess('财务管理_开票_查看详情')"
            >查看详情</Button> 
            <Button
              type="primary"
              size="small"
              style="margin-left: 6px;"
              @click="editReceipt(row, 'update')"
              v-if="(row.invoiceStatus == 0 || row.invoiceStatus == 2) && showAccess('财务管理_开票_编辑')"
            >编辑</Button>
            <Button
              type="error"
              style="margin-left: 6px;"
              @click="deleteReceipt(row)"
              size="small"
              v-if="(row.invoiceStatus == 0) && showAccess('财务管理_开票_作废')"
            >作废</Button>
          </div>
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
    <makeReceipt :addModal="addModal" :addType="addType" :formData="addForm" @close="closeModalHandler"/>
    <!-- <Modal
      v-model="addModal" width="1000"
      :title="addType == 'add' ? '新增' :(addType == 'update' ? '重新编辑' : '开票')"
      :mask-closable="false"
      @on-visible-change="closeAddModal"
    >
      <div style="padding:0 0px 0 0;">
        <Form ref="addForm" :model="addForm" :rules="addRuleValidate" :label-width="80" class="addReceiptForm">
          <div class="receiptTip" style="padding-top: 124px;border-bottom: none;">发<br><br>票<br><br>抬<br><br>头</div>
          <div class="receiptBox" style="padding-right: 28px;border-bottom: none;">
          <FormItem label="客户名称" prop="customerName" style="width:254px">            
            <div style="display: inline-flex; width:254px">
            <Input v-model="addForm.customerName" placeholder="请填写客户名称"
            clearable v-if="addType=='review'"
            :disabled="addType!='add'"></Input>
              <Select
                ref="shopSelect"
                v-if="addType!='review'"
                v-model="addForm.customerName"
                filterable
                clearable
                remote
                :remote-method="autoFillReceipt"
                :loading="loadingCustoms"
                @on-query-change="companyNameChange"
                @on-change="changeSelectCustom"
              >
                <Option v-for="(option, index) in receiptCustoms" :value="option.custom_username" :key="index" :label="option.custom_username">{{option.custom_username}}</Option>
              </Select>
            <div style="position: absolute; margin-left: 254px; width: 100px;">
              <Poptip trigger="hover" title content="请填写完整的客户名称" style="display: flex;">
                <img
                  src="../../../../public/help.svg"
                  style="height: 20px; width:20px; padding-top: 5px;  margin-left: 5px"
                />
                <span style="margin-left: 5px; justify-content: center; align-items: center;">填写帮助</span>
              </Poptip>
            </div>
            </div>
          </FormItem>
          <FormItem label="公司名称" prop="companyName">
            <Input v-model="addForm.companyName" placeholder="请填写公司名称" :disabled="addType!='add'" clearable></Input>
          </FormItem>
          <FormItem label="纳税人识别号" prop="companyIdentifier">
            <Input v-model="addForm.companyIdentifier" placeholder="请填写纳税人识别号" :disabled="addType=='review'" clearable></Input>
          </FormItem>
          <FormItem label="开户银行" prop="bankName">
            <Input v-model="addForm.bankName" placeholder="请填写开户银行" :disabled="addType=='review'" clearable></Input>
          </FormItem>
          <FormItem label="银行账号" prop="bankCardNo">
            <Input v-model="addForm.bankCardNo" placeholder="请填写银行号码" :disabled="addType=='review'" clearable></Input>
          </FormItem>
          <FormItem label="单位地址" prop="companyAddress">
            <Input v-model="addForm.companyAddress" type="textarea" :rows="1" placeholder="请填写单位地址" :disabled="addType=='review'" clearable></Input>
          </FormItem>
          <FormItem label="联系电话" prop="companyContractPhone">
            <Input v-model="addForm.companyContractPhone" placeholder="请填写联系电话" :disabled="addType=='review'" clearable></Input>
          </FormItem>
          </div>
          <div style="display:flex;flex-direction: column;">
            <div style="display:flex;">
            <div class="receiptTip" style="padding-top: 65px;">发<br><br>票<br><br>内<br><br>容</div>
            <div class="receiptBox">
              <div class="receiptContent">
                <FormItem label="业务类型" prop="invoiceBussinessType">
                  <Select v-model="addForm.invoiceBussinessType" :disabled="addType=='review'">
                    <Option v-for="(item, index) in invoiceBussinessType" :key="item" :value="item">{{item}}</Option>
                  </Select>
                </FormItem>
                <FormItem label="税前开票金额" prop="invoiceMoney">
                  <Input v-model="addForm.invoiceMoney" placeholder="请填写开票金额" :disabled="addType=='review'" clearable>
                    <span slot="append">元</span>
                  </Input>
                </FormItem>
              </div>
              <FormItem label="开具内容" prop="invoiceContent">
                <Input v-model="addForm.invoiceContent" placeholder="请填写发票开具内容" :disabled="addType=='review'" clearable maxlength="10"></Input>
              </FormItem>
              <FormItem label="开具类型" prop="invoiceType">
                <RadioGroup v-model="addForm.invoiceType">
                  <Radio label="1" :disabled="addType=='review'">增值税专用发票</Radio>
                  <Radio label="0" :disabled="addType=='review'">专用发票</Radio>
                </RadioGroup>
              </FormItem>
              <FormItem label="申请人" prop="applyUser">
                <Input v-model="addForm.applyUser" placeholder="请填写申请人" :disabled="addType=='review'" clearable maxlength="10"></Input>
              </FormItem>
              <FormItem label="邮箱" prop="notifyEmail">
                <div style="display: inline-flex">
                  <Input v-model="addForm.notifyEmail" type="textarea" :rows="1" placeholder="请填写正确邮箱地址" style="width:254px" :disabled="addType=='review'" clearable></Input>
                  <div style="position: absolute; margin-left: 254px; width: 100px;">
                    <Poptip trigger="hover" title content="如需填写多个邮箱，请用英文分号隔开，最大限制为10个" style="display: flex;">
                      <img
                        src="../../../../public/help.svg"
                        style="height: 20px; width:20px; padding-top: 5px;  margin-left: 5px"
                      />
                      <span style="margin-left: 5px; justify-content: center; align-items: center;">填写帮助</span>
                    </Poptip>
                  </div>
                </div>
              </FormItem>
            </div>
            </div>
            <div style="display:flex;">
            <div class="receiptTip" style="border-bottom: none;">其<br><br>他<br><br>信<br><br>息</div>
            <div class="receiptBox" style="border-bottom: none;">
            <div class="receiptContent">
              <FormItem label="款项是否收到" prop="moneyReceived">
                <RadioGroup v-model="addForm.moneyReceived">
                  <Radio label="1" :disabled="addType=='review'">是</Radio>
                  <Radio label="0" :disabled="addType=='review'">否</Radio>
                </RadioGroup>
              </FormItem>
              <FormItem :label="addForm.moneyReceived == 1 ? '收款日期' : '回款日期'" prop="receivedTime">
                <Date-picker
                  v-model="addForm.receivedTime"
                  :disabled="addType=='review'"
                  format="yyyy-MM-dd"
                  type="date"
                  placeholder="选择日期"
                  @on-change="changeReceivedTime"
                ></Date-picker>
              </FormItem>
            </div>
          <FormItem label="备注说明" prop="remark">
            <Input v-model="addForm.remark" type="textarea" :rows="2" placeholder="如需备注，请填写(50字以内）" :disabled="addType=='review'" clearable></Input>
          </FormItem>
          </div>
          </div>
          </div>
        </Form>
      </div>
      <div slot="footer">
        <template v-if="addType!='review'">
          <Button type="primary" style="margin-left:10px;" @click="handleSubmit('addForm')" :loading="buttonLoading">确定</Button>
        </template>
        <template v-else>
          <Button type="primary" style="margin-left:10px;" @click="passHandler" v-if="showAccess('财务管理_开票_同意')">通过</Button>
          <Button type="error" style="margin-left:10px;" @click="rejectHandler" v-if="showAccess('财务管理_开票_拒绝')">拒绝</Button>
        </template>
        <Button @click="addModal = false">取消</Button>
      </div>
    </Modal>
    <Modal v-model="rejectReason" title="拒绝">
      <Form :model="rejectForm" style="width:420px;margin-left: 34px;" ref="rejectForm">
        <FormItem label="请选择原因：" style="margin-left: -20px;font-weight:bold;font-size:14px;"></FormItem>
        <FormItem>
          <CheckboxGroup v-model="rejectForm.reasonList" style="display:flex;flex-direction: column;" @on-change="changeRejectReason">
            <Checkbox label="公司名称错误"></Checkbox>
            <Checkbox label="纳税人识别号错误"></Checkbox>
            <Checkbox label="开户银行错误"></Checkbox>
            <Checkbox label="银行账号错误"></Checkbox>
            <Checkbox label="业务类型错误"></Checkbox>
            <Checkbox label="开票金额错误"></Checkbox>
            <Checkbox label="历史欠款未回收"></Checkbox>
            <Checkbox label="其他"></Checkbox>
          </CheckboxGroup>
        </FormItem>
        <FormItem>
          <Input v-model="rejectForm.reason" type="textarea" :rows="3" placeholder="请填写原因（5-30字）" v-if="showRejectOthers" clearable></Input>
        </FormItem>
      </Form>
      <div style="color:#f54141;margin-left: 35px;" v-if="showRejectReasonTip">请选择拒绝原因！</div>
      <div style="color:#f54141;margin-left: 35px;" v-if="showRejectOthersTip">选择“其他”时，请填写原因（5-30字）</div>
      <div slot="footer">
        <Button type="primary" style="margin-left:10px;" @click="submitReject">确定</Button>
        <Button @click="cancelReject">取消</Button>
      </div>
    </Modal>-->
    <Modal v-model="deleteReceiptModal" title="删除" :mask-closable="false"
      @on-ok="deleteHandler" @on-cancel="cancelDeleteHandler">
      <p style="margin: 16px;">确认删除该数据？</p>
    </Modal> 
  </div>
</template>
<script>
import axios from "@/libs/api.request";
import { datefmt } from "@/utils/dateFormat";
import config from "./config.js";
import moment from "moment";
import hasShowAccess from "@/libs/hasShowAccess";

moment.locale("zh-cn");

export default {
  name: "receipt",
  components: {
    columnsSelect: () => import("@/components/columns-select"),
    makeReceipt: () => import('@/view/financialManagement/receipt/components/makeReceipt.vue')
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      // 如果之前打开过，切换面包屑不会再打开
      if (vm.$data.jumpFromEmail) {
        return
      }
      // 从邮件直接跳转到开票详情
      const receiptId = vm.$route.query.id
      if (receiptId) {
        let data = vm.$data
        vm.reviewReceipt({id: vm.$route.query.id}, 'review').then(res => {
          data.addModal = true
          data.jumpFromEmail = true
        })   
      }
    })
  },
  data() {
    const validateBankNum = (rule, value, callback) => {
        if (!value) {
            return callback(new Error('银行账号为必填项'));
        }
        if (!/^\d+$/.test(value)) {
            callback(new Error('银行账号只支持数字'));
        } else {
            // if (value.toString().length != 12) {
            //     callback(new Error('银行账号只支持12位数字'));
            // } else {
                callback();
            // }
        }
    };
    const validateSum = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('开票金额为必填项'))
      }
      if (/^(([^0][0-9]{0,7}|0)\.([0-9]{1,4})$)|^([^0]([0-9]{0,7})?|0)$/.test(value)) {
        callback()
      } else {
        callback(new Error('开票金额支持小数点前8位，后四位'))
      }
    };
    const validateIdentifier = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('纳税人识别号为必填项'))
      }
      if (/^[a-zA-Z0-9]{15,18}$/.test(value)) {
        callback()
      } else {
        callback(new Error('纳税人识别号支持字母和数字，15-18位'))
      }
    };
    const validatePhone =  (rule, value, callback) => {
      if (!value) {
        return callback(new Error('联系电话为必填项'))
      }
      if (!/[^0-9-]+/.test(value)) {
        callback()
      } else {
        callback(new Error('联系电话只支持数字和“—”'))
      }
    };
    const validateTime = (rule, value, callback) => {
      if (!this.addForm.receivedTime) {
        let msg = this.addForm.moneyReceived == 1 ? '收款日期' : '回款日期'
        return callback(new Error(msg + '为必填项'))
      } else {
        callback()
      }
    };
    const validateOthersReason = (rule, value, callback) => {
      if (this.showRejectOthers) {
        return callback(new Error('选择“其他”时，必须填写原因'))
      } else {
        callback()
      }
    };
    const validateEmail = (rule, value, callback) => {
      let emails = value.split(';')
      let reg = /^[A-Za-z0-9]+([_\.][A-Za-z0-9]+)*@([A-Za-z0-9\-]+\.)+[A-Za-z]{2,6}$/;
      if (emails.length > 10) {
        callback(new Error('多邮箱最大限制为10个'))
      }
      if (emails.length && value != '') {
        emails.some(email => {
          if(!reg.test(email)) {
            callback(new Error('邮箱格式错误，多邮箱地址填写时，用英文分号隔开!'))
            return true
          }
        })
      }
      callback()
    };
    return {
      jumpFromEmail: false, // 是否从邮箱跳转过来的
      disabledDate: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 86400000;
        }
      },
      invoiceBussinessType: ['智能短信-CPC', '智能短信-CPA', '智能短信-CPS', '智能短信-CPD', '智能短信-包月', '智能短信-包年', "智能短信-按条付费", "智能短信-按商户", "号码认证"],
      invoiceStatus: {
        0: '待审核',
        1: '开票成功',
        2: '开票失败'
      },
      formItem: {
        applyTime: [],
        serviceName: '',
        startTime: '',
        endTime: '',
        invoiceStatus: -1,
        invoiceBussinessType: '-1',
        companyName: "",
        pageSize: 10,
        pageIndex: 1
      },
      total_count: 0,
      dialogVisible: false,
      columns: config.enterpriseMenuColumns,
      rowData: [],
      listLoading: false,
      addModal: false,
      addType: "add",
      addForm: {
        customerName: '',
        companyName: '',
        companyIdentifier: '',
        bankName: '',
        bankCardNo: '',
        companyAddress: '',
        companyContractPhone: '',
        invoiceBussinessType: 'CPC',
        invoiceMoney: '',
        invoiceContent: '',
        moneyReceived: "1",
        invoiceType: "1",
        applyUser: '',
        notifyEmail: '',
        receivedTime: ''
      },
      addRuleValidate: {
        customerName: [{
          required: true,
          message: "客户名称为必填项",
          trigger: "blur"
        }],
        companyName: [{
          required: true,
          message: "公司名称为必填项",
          trigger: "change"
        }],
        companyIdentifier: [{
          required: true,
          trigger: "change",
          validator: validateIdentifier
        }],
        bankName: [{
          required: true,
          message: "开户银行为必填项",
          trigger: "change"
        }],
        bankCardNo: [{
          required: true,
          trigger: "change",
          validator: validateBankNum
        }],
        companyContractPhone: [{
          required: true,
          trigger: "change",
          validator: validatePhone
        }],
        companyAddress: [{
          required: true,
          message: "单位地址为必填项",
          trigger: "change"
        }],
        invoiceBussinessType: [{
          required: true,
          message: "业务类型为必填项",
          trigger: "blur"
        }],
        invoiceMoney: [{ 
          required: true,
          trigger: "change",
          type: 'number',
          validator: validateSum
        }],
        invoiceContent: [{
          required: true,
          message: "发票开具内容为必填项，字数限制为10",
          trigger: "change"
        }],
        invoiceType: [{
          required: true,
          message: "发票开具类型为必填项",
          trigger: "blur"
        }],
        notifyEmail: [{
          trigger: 'blur',
          validator: validateEmail
        }],
        moneyReceived: [{
          required: true,
          message: "款项是否收到为必填项",
          trigger: "blur"
        }],
        receivedTime: [{
          required: true,
          trigger: "blur",
          validator: validateTime
        }],
        applyUser: [{
          required: true,
          message: "申请人为必填项，字数限制为10",
          trigger: "change"
        }],
        remark: [{
          type: 'string', max: 50, message: '如需备注，请填写(50字以内）', trigger: 'change'
        }]
      },
      rejectReason: false, // 拒绝开票原因窗口
      rejectForm: {
        reasonList: [],
        reason: ''
      },
      rejectRuleValidate: {
        reasonList: [{
          required: true,
          trigger: "change",
          validator: validateOthersReason,
        }],
        reason: [{
          validator: validateOthersReason, 
          trigger: 'change'
        }]
      },
      deleteReceiptModal: false,
      currentReceipt: {},
      showRejectOthers:  false, //拒绝理由选择其他时展示的输入框
      loadingCustoms: false,
      receiptCustoms: [],
      customQuery: {},
      buttonLoading: false,
      serviceNames: ['泰迪熊', '中讯']
    };
  },
  computed: {
    showAccess() {
        return el => {
            return hasShowAccess(el);
        };
    },
    showRejectReasonTip() {
      return !this.rejectForm.reasonList.length
    },
    showRejectOthersTip() {
      return this.rejectForm.reasonList.includes('其他') 
        && (this.rejectForm.reason.length < 5 || this.rejectForm.reason.length > 30)
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
    formatDate(value) {
      if (value) {
        return moment(value).format("YYYY-MM-DD HH:mm:ss");
      } else {
        return "";
      }
    },
          /** 千位符号，小数点后不加千位符 */
    parseNumber(str) {
      return str && str.toString().replace(/^\d+/g, (m) => m.replace(/\d{1,3}(?=(\d{3})+$)/g, '$&,'))
    },
  },
  created() {
    this.searchData(true)
  },
  methods: {
    applyTimeChange (data) {
      this.formItem.startTime = data[0]
      this.formItem.endTime = data[1]
    },
    formatDateShort(value) {
      if (value) {
        return moment(value).format("YYYY-MM-DD");
      } else {
        return "";
      }
    },
    formatDate(value) {
      if (value) {
        return moment(value).format("YYYY-MM-DD HH:mm:ss");
      } else {
        return "";
      }
    },
    formatServiceName(name) {
      if (name == 1 || name == 2) return this.serviceNames[Number(name) -1]
      else return name
    },
    searchData(isfirst) {
      this.listLoading = true;
      if (isfirst) {
        this.formItem.pageIndex = 1;
      }
      let {applyTime, ...postData} = this.formItem
      postData.pageIndex--
      if (postData.invoiceBussinessType == -1) {
        postData.invoiceBussinessType = ''
      }
      let _this = this;
      axios
        .request({
          url: "finance/invoice/query",
          method: "post",
          data: postData
        })
        .then(d => {
          if (d.data.code == 0) {
            _this.listLoading = false;
            _this.total_count = d.data.data.total;
            _this.rowData = d.data.data.data
          }
        })
        .catch(() => {
          this.listLoading = false;
        });
    },
    columnsChange(columns) {
      this.columns = columns;
    },
    addNewReceipt(type, row) {
      this.addType = type;
      if (row) {
        this.addForm = JSON.parse(JSON.stringify(row));
      }
      this.addModal = true;
      this.buttonLoading = false
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
    closeModalHandler(data) {
      this.addModal = false
      if (data && data.update) {
        this.searchData()
      }
    },
    reviewReceipt(row, type) {
      let _this  = this
      this.buttonLoading = false
      return axios.request({
        url: 'finance/invoice/info/' + row.id,
        method: "get"
      })
      .then(res => {
        if (res.data.code === 0) {
          _this.addForm = JSON.parse(JSON.stringify(res.data.data))
          // _this.addForm.invoiceType = Number(_this.addForm.invoiceType)
          _this.addForm.moneyReceived = _this.addForm.moneyReceived ? '1' : '0' 
          _this.addForm.receivedTime = _this.addForm.moneyReceived == 1
            ? _this.formatDateShort(_this.addForm.receivedTime)
            : _this.formatDateShort(_this.addForm.estimatedReceivedTime)
          _this.addForm.industry =  _this.addForm.industry == 0 ? '1' : _this.addForm.industry + ''
          _this.addForm.contentType =  _this.addForm.contentType == 0 ? '1' : _this.addForm.contentType + ''
          _this.addType = type;
          _this.addModal = true;
        } else {
          _this.$Message.error(res.data.msg);
        }
      })
      .catch(err => {
        this.$Message.error("请求异常，请稍后再试！");
      });
    },
    /** 编辑开票信息 */
    editReceipt(row, type) {
      this.reviewReceipt(row, 'update')
    },
    closeAddModal(flag) {
      if (!flag) {
        this.$refs.addForm.resetFields()
        this.receiptCustoms = []
        this.$set(this.customQuery, 'custom_username', ' ')
        this.$set(this.customQuery, 'customQuery', false)
        this.$set(this.addForm, 'customerName', ' ')
        
      }
    },
    changeReceivedTime(time) {
      this.addForm.receivedTime = time
    },
    passHandler() {
      axios.request({
        url: '/finance/invoice/set/passsed/' + this.addForm.id,
        method: "get"
      })
      .then(res => {
        if (res.data.code === 0) {
          this.addModal = false
          this.searchData(true)
        } else {
          this.$Message.error(res.data.msg);
        }
      })
      .catch(err => {
        this.$Message.error("请求异常，请稍后再试！");
      });
    },
    /** 拒绝开票 */
    rejectHandler() {
      this.addModal = false
      this.rejectReason = true
    },
    handleSubmit(name) {
      if (this.buttonLoading) {
        return
      }
      this.$refs[name].validate(valid => {
        if (valid) {
          this.buttonLoading = true
          let param = JSON.parse(JSON.stringify(this.addForm));
          param.moneyReceived = param.moneyReceived == 1 ? true : false
          param.receivedTime = param.moneyReceived == 1 ? this.formatDate(this.addForm.receivedTime) : ''
          param.estimatedReceivedTime = param.moneyReceived ? '' : this.formatDate(this.addForm.receivedTime)
          let url = this.addType == 'add' ? 'finance/invoice/add' : 'finance/invoice/update'
          axios.request({
            url: url,
            method: "post",
            data: param
          })
          .then(res => {
            if (res.data.code === 0) {
              this.addModal = false
              this.searchData(true)
            } else {
              this.$Message.error(res.data.msg);
            }
          })
          .catch(err => {
            this.$Message.error("请求异常，请稍后再试！");
            this.buttonLoading = false
          });
        } else {
          this.$Message.error("请填写完整信息!");
          this.buttonLoading = false
        }
      });
    },
    deleteReceipt(row) {
      this.currentReceipt = row
      this.deleteReceiptModal = true
    },
    /** 删除开票 */
    deleteHandler() {
      // 发送删除请求
      axios.request({
        url: '/finance/invoice/delete/' + this.currentReceipt.id,
        method: "get"
      })
      .then(res => {
        if (res.data.code === 0) {
          this.deleteReceiptModal = false
          this.searchData(true)
        } else {
          this.$Message.error(res.data.msg);
        }
      })
      .catch(err => {
        this.$Message.error("请求异常，请稍后再试！");
      });
    },
    /** 取消删除 */
    cancelDeleteHandler() {
      this.deleteReceiptModal = false
    },
    /** 根据输入的客户名称自动填充其他信息 */
    autoFillReceipt(query) {
      // this.receiptCustoms.push
      if (!query.trim()) {
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
            _this.receiptCustoms = data ? data : [] 
            if (!_this.receiptCustoms.length && _this.customQuery.custom_username) {
              _this.receiptCustoms.unshift(this.customQuery);
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
      if (this.receiptCustoms.length && this.receiptCustoms[0].customQuery) {
        this.receiptCustoms.shift();
      }
      if (query.trim()) {
        this.$set(this.customQuery, 'custom_username', query)
        this.$set(this.customQuery, 'customQuery', true)
      } else {
        this.customQuery = {};
      }
    },
    changeSelectCustom(val) {
      if (!val) {
        return
      }
      let filterCustom = this.receiptCustoms.filter(item => {return item.custom_username == val})
      if (!filterCustom.length) {
        return
      }
      this.$set(this.addForm, 'companyName', filterCustom[0].company_name ? filterCustom[0].company_name : '')
      this.$set(this.addForm, 'companyIdentifier', filterCustom[0].taxNo ? filterCustom[0].taxNo : '')
      this.$set(this.addForm, 'bankName', filterCustom[0].bankName ? filterCustom[0].bankName : '')
      this.$set(this.addForm, 'bankCardNo', filterCustom[0].bankNo ? filterCustom[0].bankNo : '')
      this.$set(this.addForm, 'companyContractPhone', filterCustom[0].contact_number ? filterCustom[0].contact_number : '')
      this.$set(this.addForm, 'companyAddress', filterCustom[0].company_address ? filterCustom[0].company_address: '')
    },
    changeRejectReason(data) {
      this.showRejectOthers = data.includes('其他') ? true : false
    },
    submitReject() {
      // 发送请求
      // this.$refs.rejectForm.validate(valid => {
      //   if (valid) {
      let _this = this
      if (this.showRejectReasonTip || this.showRejectOthersTip) {
        return
      }
      if (this.rejectForm.reasonList.includes('其他')) {
        this.rejectForm.reasonList.splice(this.rejectForm.reasonList.length-1, 1, this.rejectForm.reason)
      }
      // rejectedReason = this.rejectForm.reasonList.join(';')
      let param = {
        id: _this.addForm.id,
        rejectedReason: this.rejectForm.reasonList.join(';')
      }
      axios.request({
        url: '/finance/invoice/set/rejected',
        method: "post",
        data: param
      })
      .then(res => {
        if (res.data.code === 0) {
          this.rejectForm.reasonList = []
          this.rejectForm.reason = ''
          this.showRejectOthers = false
          this.rejectReason = false
          this.searchData(true)
        } else {
          this.$Message.error(res.data.msg);
        }
      })
      .catch(err => {
        this.$Message.error("请求异常，请稍后再试！");
      });
        // }
      // })
    },
    cancelReject() {
      this.rejectForm.reasonList = []
      this.showRejectOthers = false
      this.rejectReason = false
    }
  }
};
</script>
<style scoped lang="less">
.addReceiptForm {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  .receiptTip {
    font-weight: bold;
    font-size: 14px;
    width: 38px;
    padding: 6px 35px 0px 20px;
    border-left: 1px solid #d4d3d3;
    border-right: 1px solid #d4d3d3;
    border-bottom: 1px solid #d4d3d3;
  }
  .receiptBox {
    margin-top: 10px;
    border-bottom: 1px solid #d4d3d3;
  }
  .receiptContent {
    display: flex;
    width: 416px;
    flex-direction: row;
    flex-wrap: wrap;
    /deep/ .ivu-form-item {
      width: 50%;
    }
  }
}
.addReceiptForm /deep/ .ivu-input-type-textarea .ivu-input-word-count {
  align-items: flex-end;
  top: auto;
}
.addReceiptForm /deep/ .ivu-input-word-count {
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
/deep/ .ivu-modal-body {
  padding: 0px
}
/deep/ .addReceiptForm .ivu-form-item {
      width: 416px;
}
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
/deep/ .ivu-form-item {
  margin-bottom: 20px;
}
.layout-table {
  padding-right: 10px;
  //padding-top: 20px;
}
</style>

