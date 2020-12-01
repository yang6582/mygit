<template>
  <div>
    <Modal
      v-model="modalSwitch"
      width="800"
      :title="addType == 'add' ? '新增' :(addType == 'update' ? '重新编辑' : '开票')"
      :mask-closable="false"
      @on-visible-change="closeAddModal"
    >
      <div style="padding:0 0px 0 0;">
        <Form
          ref="addForm"
          :model="addForm"
          :rules="addRuleValidate"
          :label-width="100"
          class="addReceiptForm"
        >
          <div class="receiptContent">
            <FormItem label="发票号" v-if="addType == 'detail' && addForm.invoiceNos">
              <div style="word-break: break-all;">{{addForm.invoiceNos}}</div>
            </FormItem>
            <FormItem label="开票主体" prop="serviceName">
              <Select v-model="addForm.serviceName" :disabled="addType!='add'" v-if="addForm.serviceName == '1' || addForm.serviceName == '2'">
                <Option
                  v-for="(item, index) in serviceNames"
                  :key="index"
                  :value="index"
                >{{item}}</Option>
              </Select>
              <Input v-else
                v-model="addForm.serviceName"
                placeholder="请填写开票主体"
                clearable
                :readonly="justShow"
              ></Input>
            </FormItem>
            <FormItem label="开票金额" prop="invoiceMoney" class="copyItem">
              <Input
                v-model="addForm.invoiceMoney"
                placeholder="请填写开票金额"
                :readonly="addType!='add'"
                clearable
                style="width:86%"
              >
                <span slot="append">元</span>
              </Input>
              <Button
                size="small" type="text"
                style="color:#59afed"
                v-if="justShow"
                @click="copyShortUrl(addForm.invoiceMoney)"
                >复制</Button>
            </FormItem>
            <FormItem label="业务类型" prop="invoiceBussinessType">
              <Select v-model="addForm.invoiceBussinessType" :disabled="addType!='add'">
                <Option
                  v-for="(item, index) in invoiceBussinessType"
                  :key="item"
                  :value="item"
                >{{item}}</Option>
              </Select>
            </FormItem>
            <FormItem label="所属版图" prop="industry">
              <Select v-model="addForm.industry" :disabled="justShow">
                <Option
                  v-for="item in industry"
                  :value="item.key"
                  :key="item.key"
                >{{ item.value }}</Option>
              </Select>
            </FormItem>
          </div>
          <div class="receiptContent" style="flex-direction: column">
            <FormItem label="客户名" prop="customerName" class="copyItem" style="width:55%">
              <Input
                v-model="addForm.customerName"
                placeholder="请填写客户名称"
                clearable
                v-if="addType!='add' || from=='CPC'"
                :readonly="addType!='add' || from=='CPC'"
              ></Input>
              <Select
                ref="shopSelect"
                v-else
                v-model.trim="addForm.customerName"
                filterable
                clearable
                remote
                :remote-method="autoFillReceipt"
                :loading="loadingCustoms"
                @on-query-change="companyNameChange"
                @on-change="changeSelectCustom"
              >
                <Option
                  v-for="(option, index) in receiptCustoms"
                  :value="option.custom_username"
                  :key="index"
                  :label="option.custom_username"
                >{{option.custom_username}}</Option>
              </Select>
              <Button
                size="small" type="text"
                style="color:#59afed"
                v-if="justShow"
                @click="copyShortUrl(addForm.customerName)"
                >复制</Button>
            </FormItem>
            <FormItem label="公司名称" prop="companyName" class="copyItem" style="width:55%">
              <Input
                v-model="addForm.companyName"
                placeholder="请填写公司名称"
                :readonly="addType!='add' || from=='CPC'"
                clearable
              ></Input>
              <Button
                size="small" type="text"
                style="color:#59afed"
                v-if="justShow"
                @click="copyShortUrl(addForm.companyName)"
                >复制</Button>
            </FormItem>
            <FormItem label="纳税人识别号" prop="companyIdentifier" class="copyItem" style="width:55%">
              <Input
                v-model="addForm.companyIdentifier"
                placeholder="请填写纳税人识别号"
                :readonly="justShow"
                clearable
              ></Input>
              <Button
                size="small" type="text"
                style="color:#59afed"
                v-if="justShow"
                @click="copyShortUrl(addForm.companyIdentifier)"
                >复制</Button>
            </FormItem>
            <FormItem label="地址，电话" prop="companyAddress" class="copyItem" style="width:70%">
              <Input
                v-model="addForm.companyAddress"
                type="textarea"
                :rows="1"
                placeholder="请填写单位地址，电话"
                :readonly="justShow"
                clearable
                style="width: 440px"
              ></Input>
              <Button
                size="small" type="text"
                style="color:#59afed"
                v-if="justShow"
                @click="copyShortUrl(addForm.companyAddress)"
                >复制</Button>
            </FormItem>
            <FormItem label="开户银行及账号" prop="bankName" class="copyItem" style="width:70%">
              <Input
                v-model="addForm.bankName"
                type="textarea"
                :rows="1"
                placeholder="请填写开户银行和账号"
                :readonly="justShow"
                clearable
                style="width: 440px"
              ></Input>
              <Button
                size="small" type="text"
                style="color:#59afed"
                v-if="justShow"
                @click="copyShortUrl(addForm.bankName)"
                >复制</Button>
            </FormItem>
            <FormItem label="发票开具内容" prop="contentType">
              <RadioGroup v-model="addForm.contentType">
                <Radio label="1" :disabled="justShow">信息服务费</Radio>
                <Radio label="2" :disabled="justShow">技术服务费</Radio>
              </RadioGroup>
            </FormItem>
            <FormItem label="发票开具类型" prop="invoiceType">
              <RadioGroup v-model="addForm.invoiceType">
                <Radio label="1" :disabled="justShow">增值税专用发票</Radio>
                <Radio label="0" :disabled="justShow">增值税普通发票</Radio>
              </RadioGroup>
            </FormItem>
          </div>
          <div class="receiptContent">
            <FormItem label="开票场景" prop="invoiceScene">
              <RadioGroup v-model="addForm.invoiceScene">
                <Radio :label="1" :disabled="justShow">预开票</Radio>
                <Radio :label="2" :disabled="justShow">非预开票</Radio>
              </RadioGroup>
            </FormItem>
            <FormItem label="消耗账期" prop="consumeBillDate" v-show="addForm.invoiceScene == 2">
               <el-date-picker
                  style="width:166px"
                  :disabled="justShow"
                  v-model="consumeBillDate"
                  size="small"
                  type="monthrange"
                  format="yyyy-MM"
                  value-format="yyyy-MM"
                  range-separator="-"
                  start-placeholder="开始月份"
                  end-placeholder="结束月份"
                  @change="changeConsumeBillDate"
                  :clearable="false"
                ></el-date-picker>
            </FormItem>
            <FormItem v-show="addForm.invoiceScene == 1"></FormItem>
            <FormItem label="款项是否收到" prop="moneyReceived">
              <RadioGroup v-model="addForm.moneyReceived" @on-change="changeMoneyReceived">
                <Radio label="1" :disabled="justShow">是</Radio>
                <Radio label="0" :disabled="justShow">否</Radio>
              </RadioGroup>
            </FormItem>
            <FormItem :label="addForm.moneyReceived == 1 ? '收款日期' : '回款日期'" prop="receivedTime">
              <Date-picker
                v-model="addForm.receivedTime"
                :disabled="justShow"
                format="yyyy-MM-dd"
                type="date"
                placeholder="选择日期"
                @on-change="changeReceivedTime"
                :options="disabledDate"
              ></Date-picker>
            </FormItem>
            <FormItem label="备注说明" prop="remark" class="copyItem" style="width:55%">
              <Input
                v-model="addForm.remark"
                type="textarea"
                :rows="2"
                placeholder="如需备注，请填写(50字以内）"
                :readonly="justShow"
                clearable
              ></Input>
              <Button
                size="small" type="text"
                style="color:#59afed"
                v-if="justShow"
                @click="copyShortUrl(addForm.remark)"
                >复制</Button>
            </FormItem>
          </div>

          <div class="receiptContent">
            <FormItem label="申请人" prop="applyUser">
              <Input
                v-model="addForm.applyUser"
                placeholder="请填写申请人"
                :readonly="justShow"
                clearable
                maxlength="10"
              ></Input>
            </FormItem>
            <FormItem label="邮箱" prop="notifyEmail">
              <Input
                v-model="addForm.notifyEmail"
                type="textarea"
                :rows="1"
                placeholder="请填写正确邮箱地址"
                style="width:254px"
                :readonly="justShow"
                clearable
              ></Input>
            </FormItem>
          </div>

          <FormItem label="营业执照" prop="" style="width:100%">
                <viewer :images="uploadList">
                  <img
                    v-for="(item,index) in uploadList"
                    :src="item.url"
                    :key="index"
                    style="width:40px;height:55px; border:1px solid; display: inline-block;cursor:pointer;margin-right:10px;"
                  />
                </viewer>
            </FormItem>
            <FormItem label="发票号" prop="invoiceNos" class="copyItem" style="width:70%" v-if="addType === 'review' ">
              <Input
                v-model="addForm.invoiceNos"
                type="textarea"
                :rows="1"
                placeholder="请填写发票号"
                :readonly="addType=='detail'"
                clearable
                style=""
                maxlength="1000"
              ></Input>
            </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <template v-if="addType=='update' || addType=='add'">
          <Button
            type="primary"
            style="margin-left:10px;"
            @click="handleSubmit('addForm')"
            :loading="buttonLoading"
          >确定</Button>
        </template>
        <template v-if="addType=='review'">
          <Button type="primary" style="margin-left:10px;" @click="passHandler" :loading="buttonLoadingPass">通过</Button>
          <Button type="error" style="margin-left:10px;" @click="rejectHandler">拒绝</Button>
        </template>
        <Button @click="cancelAddModal">取消</Button>
      </div>
    </Modal>
    <Modal v-model="rejectReason" title="拒绝">
      <Form :model="rejectForm" style="width:420px;margin-left: 34px;" ref="rejectForm">
        <FormItem label="请选择原因：" style="margin-left: -20px;font-weight:bold;font-size:14px;"></FormItem>
        <FormItem>
          <CheckboxGroup
            v-model="rejectForm.reasonList"
            style="display:flex;flex-direction: column;"
            @on-change="changeRejectReason"
          >
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
          <Input
            v-model="rejectForm.reason"
            type="textarea"
            :rows="3"
            placeholder="请填写原因（5-30字）"
            v-if="showRejectOthers"
            clearable
          ></Input>
        </FormItem>
      </Form>
      <div style="color:#f54141;margin-left: 35px;" v-if="showRejectReasonTip">请选择拒绝原因！</div>
      <div style="color:#f54141;margin-left: 35px;" v-if="showRejectOthersTip">选择“其他”时，请填写原因（5-30字）</div>
      <div slot="footer">
        <Button type="primary" style="margin-left:10px;" @click="submitReject">确定</Button>
        <Button @click="cancelReject">取消</Button>
      </div>
    </Modal>
    <!-- <Modal
      v-model="deleteReceiptModal"
      title="删除"
      :mask-closable="false"
      @on-ok="deleteHandler"
      @on-cancel="cancelDeleteHandler"
    >
      <p style="margin: 16px;">确认删除该数据？</p>
    </Modal> -->
  </div>
</template>
<script>
import axios from "@/libs/api.request";
import { datefmt } from "@/utils/dateFormat";
import config from "../config.js";
import moment from "moment";
import hasShowAccess from "@/libs/hasShowAccess";

const defaultAddForm = {
    serviceName: '1',
    customerName: "",
    contentType: "1",
    companyName: "",
    companyIdentifier: "",
    bankName: "",
    // bankCardNo: '',
    companyAddress: "",
    // companyContractPhone: '',
    invoiceBussinessType: "",
    invoiceMoney: "",
    industry: '',
    moneyReceived: "1",
    invoiceType: "1",
    applyUser: "",
    notifyEmail: "",
    invoiceNos: '',
    receivedTime: "",
    invoiceScene: 1,
}
export default {
  name: "makeReceipt",
  props: ["addModal", "addType", 'formData', 'from', 'ids'], //form = cpc应收管理明细表,ids有值说明是合并开票
  data() {
    const validateBankNum = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("银行账号为必填项"));
      }
      if (!/^\d+$/.test(value)) {
        callback(new Error("银行账号只支持数字"));
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
        return callback(new Error("开票金额为必填项"));
      }
      if (
        /^(([^0][0-9]{0,7}|0)\.([0-9]{1,4})$)|^([^0]([0-9]{0,7})?|0)$/.test(
          value
        )
      ) {
        callback();
      } else {
        callback(new Error("开票金额支持小数点前8位，后四位"));
      }
    };
    const validateIdentifier = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("纳税人识别号为必填项"));
      }
      if (/^[a-zA-Z0-9]{15,18}$/.test(value)) {
        callback();
      } else {
        callback(new Error("纳税人识别号支持字母和数字，15-18位"));
      }
    };
    const validatePhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("联系电话为必填项"));
      }
      if (!/[^0-9-]+/.test(value)) {
        callback();
      } else {
        callback(new Error("联系电话只支持数字和“—”"));
      }
    };
    const validateTime = (rule, value, callback) => {
      if (!this.addForm.receivedTime) {
        let msg = this.addForm.moneyReceived == 1 ? "收款日期" : "回款日期";
        return callback(new Error(msg + "为必填项"));
      } else {
        callback();
      }
    };
    const validateOthersReason = (rule, value, callback) => {
      if (this.showRejectOthers) {
        return callback(new Error("选择“其他”时，必须填写原因"));
      } else {
        callback();
      }
    };
    const validateEmail = (rule, value, callback) => {
      let emails = value.split(";");
      let reg = /^[A-Za-z0-9]+([_\.][A-Za-z0-9]+)*@([A-Za-z0-9\-]+\.)+[A-Za-z]{2,6}$/;
      if (emails.length > 10) {
        callback(new Error("多邮箱最大限制为10个"));
      }
      if (emails.length && value != "") {
        emails.some(email => {
          if (!reg.test(email)) {
            callback(
              new Error("邮箱格式错误，多邮箱地址填写时，用英文分号隔开!")
            );
            return true;
          }
        });
      }
      callback();
    };
    const validateMonthChose = (rule, value, callback) => {
      if (this.addForm.invoiceScene == 1) {
        return callback();
      }
      if (this.addForm.invoiceScene == 2 && !this.consumeBillDate[0]) { 
        return callback(new Error("消耗账期为必填项"));
      } else {
        callback();
      }
    };
    const validateInvoiceNos = (rule, value, callback) => {
      const redupValue = [...new Set(value.split(','))]
      if (!value || redupValue.length == 1 && redupValue[0] == '' || redupValue.length > 10) {
        return callback(new Error("发票号为必填项，最多支持填写10个，用英文,分割"));
      }
      callback();
    };
    return {
        invoiceStatus: ["智能短信-CPA", "智能短信-CPS", "智能短信-CPD", "智能短信-包月", "智能短信-包年", "智能短信-按条付费", "智能短信-按商户", "号码认证"],
        serviceNames: {
          '1': '泰迪熊',
          '2': '中讯'
        },
        modalSwitch: false,
      // addType: "add",
      addForm: defaultAddForm,
    //   invoiceBussinessType: ,
      addRuleValidate: {
        customerName: [
          {
            required: true,
            message: "客户名称为必填项",
            trigger: "blur"
          }
        ],
        companyName: [
          {
            required: true,
            message: "公司名称为必填项",
            trigger: "change"
          }
        ],
        companyIdentifier: [
          {
            required: true,
            trigger: "change",
            validator: validateIdentifier
          }
        ],
        bankName: [
          {
            required: true,
            message: "开户银行和账号为必填项，中间用逗号分隔",
            trigger: "change"
          }
        ],
        // bankCardNo: [{
        // required: true,
        // trigger: "change",
        // validator: validateBankNum
        // }],
        // companyContractPhone: [{
        // required: true,
        // trigger: "change",
        // validator: validatePhone
        // }],
        companyAddress: [
          {
            required: true,
            message: "地址、电话为必填项，中间用逗号分隔",
            trigger: "change"
          }
        ],
        invoiceBussinessType: [
          {
            required: true,
            message: "业务类型为必填项",
            trigger: "blur"
          }
        ],
        serviceName: [{
            required: true,
            message: "开票主体为必填项",
            trigger: "blur"
        }],
        invoiceMoney: [
          {
            required: true,
            trigger: "change",
            type: "number",
            validator: validateSum
          }
        ],
        contentType: [
          {
            required: true,
            message: "发票开具内容为必填项",
            trigger: "change"
          }
        ],
        invoiceType: [
          {
            required: true,
            message: "发票开具类型为必填项",
            trigger: "blur"
          }
        ],
        notifyEmail: [
          {
            trigger: "blur",
            validator: validateEmail
          }
        ],
        invoiceNos: [{
          required: true,
          trigger: "blur",
          validator: validateInvoiceNos
        }],
        moneyReceived: [
          {
            required: true,
            message: "款项是否收到为必填项",
            trigger: "blur"
          }
        ],
        invoiceScene: [
          {
            required: true,
            message: "开票场景为必填项",
            trigger: "blur",
            type: 'number',
          }
        ],
        consumeBillDate: [{
          required: true,
          trigger: 'blur',
          validator: validateMonthChose
        }],
        receivedTime: [
          {
            required: true,
            trigger: "blur",
            validator: validateTime
          }
        ],
        applyUser: [
          {
            required: true,
            message: "申请人为必填项，字数限制为10",
            trigger: "change"
          }
        ],
        remark: [
          {
            type: "string",
            max: 50,
            message: "如需备注，请填写(50字以内）",
            trigger: "change"
          }
        ]
      },
      rejectReason: false, // 拒绝开票原因窗口
      rejectForm: {
        reasonList: [],
        reason: ""
      },
      rejectRuleValidate: {
        reasonList: [
          {
            required: true,
            trigger: "change",
            validator: validateOthersReason
          }
        ],
        reason: [
          {
            validator: validateOthersReason,
            trigger: "change"
          }
        ]
      },
      currentReceipt: {},
      showRejectOthers: false, //拒绝理由选择其他时展示的输入框
      loadingCustoms: false,
      receiptCustoms: [],
      customQuery: {},
      buttonLoading: false,
      buttonLoadingPass: false,
      industry: [],
      imgUrl: '',
      visible: false,
      uploadList: [],
      baseUrl: 'https://m.teddymobile.cn/storage/image/',
      consumeBillDate: []
    };
  },
  created() {
    this.getAdTerritoryList();
  },
  mounted () {
      // this.uploadList = this.$refs.upload.fileList;
  },
  watch: {
    addModal(newVal, oldVal) {
        this.modalSwitch = newVal
    },
    formData(newVal, oldVal) {
        if (this.from === 'CPC') { //明细表开票时带入客户和公司名称
            this.addForm = defaultAddForm
            this.addForm.invoiceNos = newVal.invoiceNos ? newVal.invoiceNos.join(',') : ''
            this.addForm.id = newVal.id
            this.addForm.customerName = newVal.customName
            this.addForm.companyName = newVal.companyName
            this.addForm.serviceName = newVal.serviceName
            return
        }
        this.addForm = newVal
        this.addForm.invoiceNos = newVal.invoiceNos ? newVal.invoiceNos.join(',') : ''
        if (this.addForm.invoiceScene == 2) {
          this.$set(this.consumeBillDate, 0, this.addForm.billStartDate.toString().replace(/(\d{4})/, '$1'+ '-'))
          this.$set(this.consumeBillDate, 1, this.addForm.billEndDate.toString().replace(/(\d{4})/, '$1'+ '-'))
        }
        
        const images = newVal.license_img && newVal.license_img.split(',').map(img => {
          return {url: this.baseUrl + img}
        })
        this.uploadList.push(...images)
    }
  },
  computed: {
    disabledDate(){
      let moneyReceived = this.addForm.moneyReceived
      return {
        disabledDate(time) {
          if (moneyReceived == 1) {
            return time.getTime() > Date.now()
          } else {
            return time.getTime() < Date.now() - 86400000;
          }
        }
      }
    },
    invoiceBussinessType() {
      return this.from === 'CPC' ?  ['智能短信-CPC'] : ['智能短信-CPC'].concat(this.invoiceStatus)
    },
    justShow() {
        return this.addType === 'review' || this.addType === 'detail'
    },
    showAccess() {
      return el => {
        return hasShowAccess(el);
      };
    },
    showRejectReasonTip() {
      return !this.rejectForm.reasonList.length;
    },
    showRejectOthersTip() {
      return (
        this.rejectForm.reasonList.includes("其他") &&
        (this.rejectForm.reason.length < 5 ||
          this.rejectForm.reason.length > 30)
      );
    }
  },
  methods: {
    handleView (url) {
        this.imgUrl = url;
        this.visible = true;
    },
            handleRemove (file) {
                const fileList = this.$refs.upload.fileList;
                this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
            },
    changeConsumeBillDate(data) {
      this.consumeBillDate = data;
    },
    getAdTerritoryList() {
      axios
          .request({
            url: "/common/getAdTerritoryList",
            method: "get"
          })
          .then(res => {
            if (res.data.code === 0) {
              this.industry = res.data.data;
            } else {
              this.$Message.error(res.data.msg);
            }
          })
          .catch(err => {
            this.$Message.error("请求异常，请稍后再试！");
          });
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
    copyShortUrl(url) {
      var oInput = document.createElement("input");
      oInput.value = url;
      document.body.appendChild(oInput);
      oInput.select();
      document.execCommand("Copy"); // 执行浏览器复制命令
      this.$Message.success("复制成功");
      oInput.remove();
    },
    closeAddModal(flag) {
      if (!flag) {
        this.$refs.addForm.resetFields();
        this.receiptCustoms = [];
        this.$set(this.customQuery, "custom_username", "");
        this.$set(this.customQuery, "customQuery", false);
        this.uploadList.length = 0
        this.$set(this.consumeBillDate, 0, '');
        this.$set(this.consumeBillDate, 1, '');
        // this.$set(this.addForm, "customerName", " ");
        this.cancelAddModal()
      }
    },
    changeReceivedTime(time) {
      this.addForm.receivedTime = time;
    },
    changeMoneyReceived() {
      this.addForm.receivedTime = ''
    },
    passHandler() {
      if (this.buttonLoadingPass) {
        return;
      }
      this.$refs.addForm.validateField('invoiceNos', error => {
        if (!error) {
          this.buttonLoadingPass = true
          axios.request({
            url: "/finance/invoice/set/passsed/" + this.addForm.id,
            method: "post",
            data: {
              invoiceNos: [...new Set(this.addForm.invoiceNos.split(','))],
            }
          })
          .then(res => {
            this.buttonLoadingPass = false
            if (res.data.code === 0) {
              // this.modalSwitch = false;
              // this.searchData(true);
              this.cancelAddModal({update: true})
            } else {
              this.$Message.error(res.data.msg);
            }
          })
          .catch(err => {
            this.$Message.error("请求异常，请稍后再试！");
            this.buttonLoadingPass = false
          });
        } else {
          cab(!error)
        }
      })
    },
    /** 拒绝开票 */
    rejectHandler() {
      this.modalSwitch = false;
      this.rejectReason = true;
    },
    handleSubmit(name) {
      if (this.buttonLoading) {
        return;
      }
      this.$refs[name].validate(valid => {
        if (valid) {
          this.buttonLoading = true;
          let param = JSON.parse(JSON.stringify(this.addForm));
          param.moneyReceived = param.moneyReceived == 1 ? true : false;
          param.receivedTime =
            param.moneyReceived
              ? this.formatDate(this.addForm.receivedTime)
              : "";
          param.estimatedReceivedTime = param.moneyReceived
            ? ""
            : this.formatDate(this.addForm.receivedTime);
          if (this.addForm.invoiceScene == 2){
            param.billStartDate  = this.consumeBillDate[0].split('-').join('')
            param.billEndDate  = this.consumeBillDate[1].split('-').join('')
          }
          // delete param.consumeBillDate
          if (this.from === 'CPC') {
              param.billIds = this.ids
              delete param.id
          }
          let url =
            this.addType == "add"
              ? "finance/invoice/add"
              : "finance/invoice/update";
          axios.request({
              url: url,
              method: "post",
              data: param
            })
            .then(res => {
              this.buttonLoading = false;
              if (res.data.code === 0) {
                  
                this.cancelAddModal({update: true})
                // this.modalSwitch = false;
                // this.searchData(true);
              } else {
                this.$Message.error(res.data.msg);
              }
            })
            .catch(err => {
              this.$Message.error("请求异常，请稍后再试！");
              this.buttonLoading = false;
            });
        } else {
          this.$Message.error("请填写完整信息!");
          this.buttonLoading = false;
        }
      });
    },
    /** 根据输入的客户名称自动填充其他信息 */
    autoFillReceipt(query) {
      // this.receiptCustoms.push
      if (!query.trim()) {
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
            _this.receiptCustoms = data ? data : [];
            if (
              !_this.receiptCustoms.length &&
              _this.customQuery.custom_username
            ) {
              _this.receiptCustoms.unshift(this.customQuery);
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
    companyNameChange(query) {
      if (this.receiptCustoms.length && this.receiptCustoms[0].customQuery) {
        this.receiptCustoms.shift();
      }
      if (query.trim()) {
        this.$set(this.customQuery, "custom_username", query);
        this.$set(this.customQuery, "customQuery", true);
      } else {
        this.customQuery = {};
      }
    },
    changeSelectCustom(val) {
      if (!val) {
        return;
      }
      let filterCustom = this.receiptCustoms.filter(item => {
        return item.custom_username == val;
      });
      if (!filterCustom.length) {
        return;
      }
      this.$set(
        this.addForm,
        "companyName",
        filterCustom[0].company_name ? filterCustom[0].company_name : ""
      );
      this.$set(
        this.addForm,
        "companyIdentifier",
        filterCustom[0].taxNo ? filterCustom[0].taxNo : ""
      );
      this.$set(
        this.addForm,
        "bankName",
        filterCustom[0].bankName ? filterCustom[0].bankName : ""
      );
      //   this.$set(this.addForm, 'bankCardNo', filterCustom[0].bankNo ? filterCustom[0].bankNo : '')
      //   this.$set(this.addForm, 'companyContractPhone', filterCustom[0].contact_number ? filterCustom[0].contact_number : '')
      this.$set(
        this.addForm,
        "companyAddress",
        filterCustom[0].company_address ? filterCustom[0].company_address : ""
      );
      const license_imgs = filterCustom[0].license_img.split(',')
      if (license_imgs.length) {
        const images = license_imgs.map(img => {
          return {url: this.baseUrl + img}
        })
        this.uploadList.length = 0
        this.uploadList.push(...images)
      }
    },
    changeRejectReason(data) {
      this.showRejectOthers = data.includes("其他") ? true : false;
    },
    submitReject() {
      // 发送请求
      // this.$refs.rejectForm.validate(valid => {
      //   if (valid) {
      let _this = this;
      if (this.showRejectReasonTip || this.showRejectOthersTip) {
        return;
      }
      if (this.rejectForm.reasonList.includes("其他")) {
        this.rejectForm.reasonList.splice(
          this.rejectForm.reasonList.length - 1,
          1,
          this.rejectForm.reason
        );
      }
      // rejectedReason = this.rejectForm.reasonList.join(';')
      let param = {
        id: _this.addForm.id,
        rejectedReason: this.rejectForm.reasonList.join(";")
      };
      axios
        .request({
          url: "/finance/invoice/set/rejected",
          method: "post",
          data: param
        })
        .then(res => {
          if (res.data.code === 0) {
            this.rejectForm.reasonList = [];
            this.rejectForm.reason = "";
            this.showRejectOthers = false;
            this.rejectReason = false;
            // this.searchData(true);
            this.$emit('close', {update: true})
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
      this.rejectForm.reasonList = [];
      this.showRejectOthers = false;
      this.rejectReason = false;
      this.$emit('close')
    },
    cancelAddModal(data) {
      this.$emit("close", data);
    }
  }
};
</script>
<style scoped lang="less">
.addReceiptForm {
  //   display: flex;
  //   flex-direction: row;
  //   flex-wrap: wrap;
  padding: 20px;
  .receiptBox {
    margin-top: 10px;
    border-bottom: 1px solid #d4d3d3;
  }
  .receiptContent {
    display: flex;
    // width: 416px;
    flex-direction: row;
    flex-wrap: wrap;
    border-bottom: 1px dotted #a5a3a3;
    margin-bottom: 20px;
    /deep/ .ivu-form-item {
      width: 50%;
    }
  }
  .receiptContent:last-child {
    border-bottom: none;
    margin-bottom: 0px;
  }
  .copyItem /deep/ .ivu-form-item-content {
      display: flex;
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
  padding: 0px;
}
/deep/ .addReceiptForm .ivu-form-item {
  width: 416px;
}
</style>