<template>
  <div>
    <h2 style="margin-bottom: 10px;margin-left:20px;">公司信息</h2>
    <Form
      ref="formValidate"
      :model="custom_info"
      :rules="ruleValidate"
      :label-width="250"
      style="width:610px;"
      class="margin-right-10"
    >
      <FormItem label="公司名称：" prop="company_name">
        <div style="display: inline-flex;width:100%;">
          <Select
            ref="shopSelect"
            v-model="custom_info.company_name"
            filterable
            clearable
            remote
            :remote-method="getAllShops"
            :loading="getShopsLoading"
            style="width:100%;"
            @on-query-change="companyNameChange"
          >
            <Option v-for="(item,index) in allShops" :value="item.name" :key="index">{{item.name}}</Option>
          </Select>
          <div style="position: absolute; margin-left: 350px; width: 100px;">
            <Poptip trigger="hover" title content="请填写营业执照上完整的公司名称" style="display: flex;">
              <img
                src="../../../public/help.svg"
                style="height: 20px; width:20px; padding-top: 5px; margin-left: 5px"
              />
              <span style="margin-left: 5px; justify-content: center; align-items: center;">填写帮助</span>
            </Poptip>
          </div>
        </div>
      </FormItem>
        <FormItem label="公司地址：" prop="company_address">
        <Input v-model="custom_info.company_address" placeholder="请输入公司地址" clearable />
      </FormItem>
      <FormItem label="行业类型：" prop="select_industry">
        <Select
          v-model="custom_info.select_industry"
          @on-change="select_industry_change"
          style="width: 50%"
        >
          <Option
            v-for="item in industry_first_list"
            :value="item.industryId"
            :key="item.industryId"
          >{{ item.industryName }}</Option>
        </Select>
        <Select
          v-model="custom_info.select_industry_second"
          @on-change="select_industry_second_change_handle"
          style="width: 50%"
        >
          <Option
            v-for="item in select_industry_second_list"
            :value="item.industryIndex"
            :key="item.industryIndex"
          >{{ item.industryName }}</Option>
        </Select>
      </FormItem>
      <FormItem label="联系人：" prop="contact_name">
        <Input v-model="custom_info.contact_name" placeholder="请输入联系人" clearable />
      </FormItem>
      <FormItem label="联系电话：" prop="contact_number">
        <Input v-model="custom_info.contact_number" placeholder="请输入联系人电话" clearable />
      </FormItem>
      <FormItem label="邮箱：" prop="custom_email">
        <Input v-model="custom_info.custom_email" placeholder="请设置联系人邮箱" clearable />
      </FormItem>
      <FormItem label="营业执照：" prop="license_img" style="height: 120px">
        <div v-if="imgLoaded" style="overflow:hidden">
          <div
            v-for="(imgBase64, index) in imgBase64_all"
            :key="index"
            style="float:left;width:60px;text-align:center"
          >
            <img :src="imgBase64" alt width="60" height="70" />
            <Button type="error" size="small" @click="del(index)">删除</Button>
          </div>
        </div>
        <Upload
          :before-upload="handleUpload"
          :action="axisoUrl+'/admin/public/uploadimage'"
          accept="image/*"
          v-if="isEdit"
        >
          <div style="overflow:hidden;width:100%">
            <Button type="primary" icon="ios-cloud-upload-outline" overflow="hidden">点击上传营业执照</Button>
          </div>
        </Upload>
      </FormItem>
      <h2 style="margin-bottom: 10px;margin-left:20px;">账户信息</h2>
      <FormItem label="结算方式：" prop="order_type">
        <RadioGroup v-model="custom_info.order_type">
          <Radio v-for="item in Settlements" :label="item.key" :key="item.key">{{item.value}}</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="分账厂商：" prop="partner_list">
        <CheckboxGroup v-model="custom_info.partner_list" @on-change="checkTest">
          <Checkbox
            v-for="item in companys_all"
            :label="item.key"
            :key="item.key"
            :disabled="!isEdit"
          >{{item.value}}</Checkbox>
        </CheckboxGroup>
      </FormItem>
      <FormItem label="账户类型：" prop="roles_id">
        <RadioGroup v-model="custom_info.roles_id">
          <Radio v-for="item in accountTypes" :label="item.key" :key="item.key">{{ item.value }}</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="返点比例：" prop="benefit_percent">
        <div style="display: inline-flex">
          <Input v-model="custom_info.benefit_percent" style="width: 350px" clearable>
            <span slot="append">%</span>
          </Input>
          <div style="position: absolute; margin-left: 350px; width: 100px;">
            <Poptip trigger="hover" title content="填写整数，例如：20，即表示20%" style="display: flex;">
              <img
                src="../../../public/help.svg"
                style="height: 20px; width:20px; padding-top: 5px;  margin-left: 5px"
              />
              <span style="margin-left: 5px; justify-content: center; align-items: center;">填写帮助</span>
            </Poptip>
          </div>
        </div>
      </FormItem>
      <FormItem label="客户名称：" prop="custom_username">
        <div style="display: inline-flex">
          <Input v-model="custom_info.custom_username" placeholder="请设置客户名称" style="width: 350px" clearable/>
          <div style="position: absolute; margin-left: 350px; width: 100px;">
            <Poptip trigger="hover" title content="公司名称简称，用于做登录账号" style="display: flex;">
              <img
                src="../../../public/help.svg"
                style="height: 20px; width:20px; padding-top: 5px;  margin-left: 5px"
              />
              <span style="margin-left: 5px; justify-content: center; align-items: center;">填写帮助</span>
            </Poptip>
          </div>
        </div>
      </FormItem>
      <FormItem label="销售对接：" prop="sales_id">
        <div style="display: inline-flex">
          <Select
            v-model="custom_info.sales_id"
            placeholder="请设置销售人员名称"
            style="width: 350px"
            filterable
            clearable
          >
            <Option v-for="item in salesmens" :value="item.id" :key="item.id">{{ item.name }}</Option>
          </Select>
          <div style="position: absolute; margin-left: 350px; width: 100px;">
            <Poptip trigger="hover" title content="客户对接人员或创建客户的人员名称" style="display: flex;">
              <img
                src="../../../public/help.svg"
                style="height: 20px; width:20px; padding-top: 5px;  margin-left: 5px"
              />
              <span style="margin-left: 5px; justify-content: center; align-items: center;">填写帮助</span>
            </Poptip>
          </div>
        </div>
      </FormItem>
      <FormItem label="日均消耗：" prop="day_cost">
        <Input v-model.trim="custom_info.day_cost" placeholder="请输入日均消耗" clearable />
      </FormItem>
      
      <FormItem label="回款周期：" prop="collect_money_days">
        <Input v-model.trim="custom_info.collect_money_days" placeholder="请输入回款周期" clearable>
          <span slot="append">天</span>
        </Input>
      </FormItem>
      <h2 style="margin-bottom: 10px;margin-left:20px;">财务信息</h2>
      <FormItem label="纳税人识别号：" prop="taxNo">
        <Input v-model.trim="custom_info.taxNo" placeholder="请输入纳税人识别号" clearable />
      </FormItem>
      <FormItem label="开户银行：" prop="bankName">
        <Input v-model.trim="custom_info.bankName" placeholder="请输入开户银行" clearable />
      </FormItem>
      <FormItem label="银行账号：" prop="bankNo">
        <Input v-model.trim="custom_info.bankNo" placeholder="请输入银行账号" clearable />
      </FormItem>
      <FormItem style="text-align: center">
        <Button
          type="primary"
          @click="submitAll"
          :loading="submitAllBtn"
          v-if="showAccess('客户管理_新建客户_提交')"
        >提交</Button>
      </FormItem>
    </Form>
    <!--    <Modal-->
    <!--        v-model="modal1Show"-->
    <!--        title="确认新建客户信息">-->
    <!--        <p>公司名称：{{custom_info.company_name}}</p>-->
    <!--        <p>更多流量：{{custom_info.is_is_other === '1' ? '有' : '没有'}}</p>-->
    <!--        <p>联系电话：{{custom_info.contact_number}}</p>-->
    <!--        <p>用户名：{{custom_info.custom_username}}</p>-->
    <!--        <div slot="footer">-->
    <!--          <Button @click="modal1Show=false">取消</Button>-->
    <!--          <Button @click="submitAll" type="primary">确定</Button>-->
    <!--        </div>-->
    <!--      </Modal>-->
  </div>
</template>
<script>
import axios from "@/libs/api.request";
import { getToken, uuid } from "@/libs/util";
import hasShowAccess from "@/libs/hasShowAccess.js";
export default {
  name: "newClient",
  data() {
    const validatorCompanyName = (rule, value, callback) => {
      //  中文 英文 中文括号
      if (!/^[\u4e00-\u9fa5A-Za-z（）]*$/.test(this.custom_info.company_name)) {
        callback(new Error("公司名称只能包含中英文和中文半角的括号"));
      }
      if (this.custom_info.company_name.length > 30) {
        callback(new Error("公司名称不能超过30个字符"));
      }
      callback();
    };
    const validatorCustomEmail = (rule, value, callback) => {
      //  中文 英文 中文括号
      if (!this.custom_info.custom_email) {
      } else if (
        !/^[A-Za-z0-9]+([_\.][A-Za-z0-9]+)*@([A-Za-z0-9\-]+\.)+[A-Za-z]{2,6}$/.test(
          this.custom_info.custom_email
        )
      ) {
        callback(new Error("不符合邮箱规则"));
      }
      if (this.custom_info.custom_email.length > 30) {
        callback(new Error("公司邮箱不能超过30个字符"));
      }
      callback();
    };
    const validatorIndustry = (rule, value, callback) => {
      if (this.custom_info.select_industry === "") {
        callback(new Error("一级行业未选择,请选择一级行业"));
      } else {
        if (this.custom_info.select_industry_second === "") {
          callback(new Error("二级行业未选择,请选择二级行业"));
        }
        callback();
      }
    };
    const validatorContactNumber = (rule, value, callback) => {
      if (
        5 > this.custom_info.contact_number.length ||
        this.custom_info.contact_number.length > 12
      ) {
        callback(new Error("联系人电话不能小于5位、大于12位"));
      }
      if (isNaN(this.custom_info.contact_number)) {
        callback(new Error("联系人电话必须为数字"));
      }
      callback();
    };

    const validatorContactName = (rule, value, callback) => {
      //  中文 英文 中文括号
      if (this.custom_info.contact_name.length > 30) {
        callback(new Error("联系人不能超过30个字符"));
      }
      callback();
    };
    const validateLicense = (rule, value, callback) => {
      if (!this.custom_info.license_img_all.length) {
        callback(new Error("营业执照没有上传,请上传"));
      }
      callback();
    };
    const validateUserName = (rule, value, callback) => {
      if (!/^[\u4e00-\u9fa5A-Za-z]*$/.test(this.custom_info.custom_username)) {
        callback(new Error("用户名只能包含中英文"));
      }
      if (this.custom_info.custom_username.length > 30) {
        callback(new Error("用户名不能超过30个字符"));
      }
      callback();
    };
    const validateMoneyDays = (rule, value, callback) => {
      if (!Number.isInteger(Number(value)) || /^-/.test(value)) {
        callback(new Error("请输入正确天数"))
      }
      callback()
    }
    const validateDayCost = ( rule, value, callback) => {
      if (value != '' && !/^(([^0-][0-9]{0,5}|0)\.([0-9]{1,2})$)|^([^0-]([0-9]{0,5})?|0)$/.test(value)) {
          callback(new Error("日均消耗只支持小数点前最多6位，小数点后最多2位"));
          return;
      }
      callback()
    }
    const validateBenefitPercent = (rule, value, callback) => {
      if (this.custom_info.benefit_percent % 1 !== 0) {
        callback(new Error("返点比例必须为整数"));
      }
      if (
        this.custom_info.benefit_percent < 0 ||
        this.custom_info.benefit_percent > 100
      ) {
        callback(new Error("返点比例范围在0和100之间"));
      }
      callback();
    };
    const validateTaxpayer = (rule, value, callback) => {
      let reg = /^[0-9a-zA-Z]{15,18}$/;
      if (value == "" || (value && reg.test(value))) {
        callback();
      } else {
        callback(new Error("纳税人识别号由15-18位数字和字母构成"));
      }
    };
    const validateBankNumber = (rule, value, callback) => {
      let reg = /^\d{12,}$/;
      if (value == "" || (value && reg.test(value))) {
        callback();
      } else {
        callback(new Error("银行账号由数字构成,不少于12位"));
      }
    };
    return {
      submitAllBtn: false,
      axisoUrl:
        location.href.indexOf("back-manager.teddymobile.net") > -1
          ? "https://m.teddymobile.cn"
          : "https://m-test.teddymobile.cn",
      modal1Show: false,
      headers: {
        "X-Client-Token": getToken(),
        "X-Client-Sdk": 2,
        // 'X-App-Id': 'sdt_back_manager',
        "X-App-Version": 1,
        "X-Client-Time": Date.now(),
        "X-Request-Id": uuid(),
        "X-Request-Type": "",
        "X-Tdbear-Id": "",
        "X-Client-Unique": ""
      },
      salesmens: [],
      companys_all: [],
      Settlements: [], // 结算方式
      accountTypes: [], // 账户类型
      custom_info: {
        custom_email: "",
        company_name: "",
        license_img_all: [], // 资质url 零时修改 周一复原 //'201709/1505450073809.jpg'
        partner_list: ["1", "2", "5"],
        roles_id: "2",
        order_type: "1", // 1:月付费 2:月结
        benefit_percent: 0,
        custom_username: "", // 客户名称
        day_cost: '',
        collect_money_days: '',
        sales_id: "", //默认传 1
        select_industry: "",
        select_industry_second: "",
        taxNo: "",
        bankNo: "",
        company_address:''
      },
      allShops: [],
      isEdit: true,
      ruleValidate: {
        taxNo: [{ validator: validateTaxpayer, trigger: "blur" }],
        bankNo: [{ validator: validateBankNumber, trigger: "blur" }],
        company_name: [
          {
            required: true,
            message: "公司名称未填写,请填写公司名称",
            trigger: "blur"
          }
          // { validator: validatorCompanyName, trigger: "blur" }
        ],
        select_industry: [
          {
            required: true,
            message: "请选择行业",
            trigger: "change"
          },
          { validator: validatorIndustry, trigger: "change" }
        ],
        custom_email: [
          {
            required: true,
            message: "请填写邮箱",
            trigger: "blur"
          },
          { validator: validatorCustomEmail, trigger: "blur" }
        ],
        contact_name: [
          { required: true, message: "联系人没有填写,请填写", trigger: "blur" },
          { validator: validatorContactName, trigger: "blur" }
        ],
        contact_number: [
          {
            required: true,
            message: "联系电话未填写，请填写",
            trigger: "blur"
          },
          { validator: validatorContactNumber, trigger: "blur" }
        ],
        license_img: [
          // { required: true, message: '营业执照未上传,请上传', trigger: 'blur' },
          { validator: validateLicense, trigger: "blur", required: true }
        ],
        order_type: [
          {
            required: true,
            message: "结算方式未选择,请选择结算方式",
            trigger: "change"
          }
        ],
        partner_list: [
          {
            required: true,
            type: "array",
            min: 1,
            message: "厂商ID未选择,请选择厂商ID",
            trigger: "change"
          }
        ],
        roles_id: [
          {
            required: true,
            message: "账户类型未选择,请选择账户类型",
            trigger: "change"
          }
        ],
        custom_username: [
          {
            required: true,
            message: "客户名称未填写，请填写",
            trigger: "blur"
          },
          { validator: validateUserName, trigger: "blur" }
        ],
        day_cost: [{ validator: validateDayCost, trigger: "blur" }],
        collect_money_days: [{
          required: true,
          message: "回款周期未填写，请填写",
          trigger: "blur"
        }, {validator: validateMoneyDays, trigger: "blur"}],
        sales_id: [
          {
            required: true,
            message: "销售对接未填写，请填写",
            trigger: "change",
            type: "number"
          }
        ],
        benefit_percent: [
          { validator: validateBenefitPercent, trigger: "blur" }
        ]
      },
      industry_first_list: {}, // 对象一级行业
      select_industry_second_list: {},
      imgLoaded: false,
      imgBase64_all: [],
      getShopsLoading: false,
      customQuery: {}
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
    // 行业选项用到公共信息
    this.getPublicInfo();
    this.getSalesman();
  },
  activated() {
    this.getSalesman();
  },
  methods: {
    getPublicInfo() {
      let _this = this;
      axios
        .request({
          url: "/sys/utils/all",
          method: "get"
        })
        .then(res => {
          if (res.data.code === 0) {
            _this.industry_first_list = res.data.data.industrys;
            for (let key in _this.industry_first_list) {
              _this.industry_first_list[key].industryId =
                _this.industry_first_list[key].industryId + "";
            }
            _this.companys_all = res.data.data.sysConfig.partnerName;
            _this.Settlements = res.data.data.sysConfig.orderType;
            _this.accountTypes = res.data.data.sysConfig.customerRole;
          } else {
            this.$Message.error(res.data.msg);
          }
        })
        .catch(err => {
          this.$Message.error("请求失败，" + err + "，请稍后再试！");
        });
    },
    select_industry_change(value) {
      if (this.custom_info.select_industry) {
        this.select_industry_second_list = this.industry_first_list[
          +this.custom_info.select_industry
        ].subIndustry;
        this.custom_info.select_industry_second = "";
      }
    },
    select_industry_second_change_handle(value) {
      //   this.second_ids = value
    },
    checkTest(value) {},
    del(index) {
      this.imgBase64_all.splice(index, 1);
      this.custom_info.license_img_all.splice(index, 1);
    },
    handleUpload(file) {
      // 上传文件之前的钩子
      if (this.custom_info.license_img_all.length >= 5) {
        this.$Notice.error({
          title: "失败",
          desc: "最多上传5张执照"
        });
        return false;
      }
      let reader = new FileReader();
      reader.readAsDataURL(file);
      let _this = this;
      reader.onload = ev => {
        this.imgLoaded = true;
        let formData = new URLSearchParams();
        formData.append("imgbase64", ev.target.result);
        formData.append("saveDB", 1);
        let url =
          location.href.indexOf("back-manager.teddymobile.net") > -1
            ? "https://m.teddymobile.cn"
            : "https://m-test.teddymobile.cn";
        axios
          .commonRequset({
            url: url + "/admin/public/uploadimage",
            method: "post",
            data: formData
          })
          .then(d => {
            if (d.data.boo) {
              _this.custom_info.license_img_all.push(d.data.data.url);
              _this.imgBase64_all.push(ev.target.result);
              _this.$Notice.success({
                title: "文件上传成功",
                desc: "文件上传成功"
              });
            } else {
              _this.$Notice.error({
                title: "文件上传失败",
                desc: "文件上传失败请检查网络"
              });
            }
          })
          .catch(e => {
            _this.$Notice.error({
              title: "文件上传失败",
              desc: "文件上传失败请检查网络"
            });
          });
      };
      return false;
    },
    submit() {
      this.$refs["formValidate"].validate(valid => {
        if (valid) {
          this.modal1Show = true;
        }
      });
    },
    submitAll() {
      this.$refs["formValidate"].validate(valid => {
        if (valid) {
          var sale_info = this.salesmens.filter(item => {
            return item.id == this.custom_info.sales_id;
          });
          var postData = {
            company_name: this.custom_info.company_name,
            industry_first_id: this.custom_info.select_industry,
            industry_second_id:
              this.custom_info.select_industry_second - 1 + "",
            contact_name: this.custom_info.contact_name,
            contact_number: this.custom_info.contact_number,
            custom_email: this.custom_info.custom_email,
            order_type: this.custom_info.order_type,
            partner_list: this.custom_info.partner_list.toString(),
            roles_id: this.custom_info.roles_id,
            benefit_percent: this.custom_info.benefit_percent,
            custom_username: this.custom_info.custom_username,
            day_cost: this.custom_info.day_cost,
            collect_money_days: Number(this.custom_info.collect_money_days),
            license_img: this.custom_info.license_img_all.join(","),
            sales_id: this.custom_info.sales_id,
            sales_name: sale_info[0].username,
            company_url: "test.test.com",
            company_domain: "test.test.com",
            menu_price: "8",
            next_price: "8",
            is_other: "1",
            custom_password: this.custom_info.contact_number,
            taxNo:this.custom_info.taxNo,
            bankName:this.custom_info.bankName,
            bankNo:this.custom_info.bankNo,
            company_address:this.custom_info.company_address
          };

          // 此时验证通过发送
          this.submitAllBtn = true;
          axios
            .request({
              url: "/ad/customer/add",
              method: "post",
              data: postData
            })
            .then(d => {
              if (d.data.code === 0) {
                this.modal1Show = false;
                this.$Notice.success({
                  title: "新建成功",
                  desc: "客户信息新建成功"
                });
                this.$Notice.info({
                  title: "新建账户信息",
                  desc: `用户名:${postData.custom_username}<br>密码:${postData.custom_password}<br>20s后关闭`,
                  duration: 20
                });
                this.submitAllBtn = false;

                this.$router.push({ path: "/clientManagement/clientList" });
                this.reset();
              } else {
                this.$Notice.error({
                  title: "创建失败",
                  desc: d.data.msg,
                  duration: 20
                });
                this.submitAllBtn = false;
              }
            })
            .catch(() => {
              this.$Notice.error({
                title: "创建失败",
                desc: "网络错误",
                duration: 20
              });
              this.submitAllBtn = false;
            });
        }
      });
    },
    getSalesman() {
      // 此时验证通过发送
      axios
        .request({
          url: "/ad/management/ads/getAllSaleInfo",
          method: "post"
        })
        .then(
          d => {
            if (d.data.code === 0) {
              this.salesmens = d.data.data;
            } else {
              this.$Message.error(d.data.msg);
            }
          },
          err => {
            this.$Message.error("请求失败，" + err + "，请稍后再试！");
          }
        );
    },
    reset() {
      this.custom_info.select_industry_second = "";
      this.$nextTick(() => {
        this.$refs["formValidate"].resetFields();
      });
      // this.custom_info.select_industry = "";
      this.custom_info.license_img_all = [];
      this.imgBase64_all = [];
    },
    getAllShops(query) {
      this.getShopsLoading = true;
      let param = { name: query };
      axios
        .request({
          url: "/ad/customer/search",
          method: "post",
          data: param
        })
        .then(res => {
          if (res.data.code === 0) {
            this.allShops = res.data.data.data.data;
            if (this.customQuery.name) {
              this.allShops.unshift(this.customQuery);
            }
            this.getShopsLoading = false;
          } else {
            this.$Message.error("请求异常，请稍后再试！");
          }
        })
        .catch(err => {
          this.$Message.error("请求失败，" + err + "，请稍后再试！");
          this.getShopsLoading = false;
        });
    },
    companyNameChange(query) {
      if (this.allShops.length && this.allShops[0].customQuery) {
        this.allShops.shift();
      }
      if (query.trim()) {
        this.customQuery = {
          name: query,
          customQuery: true
        };
      } else {
        this.customQuery = {};
      }
    }
  }
};
</script>
<style lang="less" scoped>
.margin-right-10 {
  /deep/ .ivu-form-item-label {
    margin-right: 10px;
  }
  /deep/ .ivu-form-item-content {
    margin-left: 260px !important;
  }
}
</style>
