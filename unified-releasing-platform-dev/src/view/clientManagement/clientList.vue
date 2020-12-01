<template>
  <div>
    <div class="layout-search">
      <Form :model="searchForm" inline :label-width="80">
        <FormItem label="客户名称:">
          <Input
            v-model="searchForm.username"
            placeholder="请输入客户名称"
            @on-enter="searchData(true)"
            clearable
          />
        </FormItem>
        <FormItem label="销售对接:">
          <Select
            v-model="searchForm.salesmen"
            style="width:120px"
            clearable
            placeholder="请选择分配销售"
            filterable
            @on-change="searchData(true)"
          >
            <Option v-for="item in salesmens" :value="item.id" :key="item.id">{{ item.name }}</Option>
          </Select>
        </FormItem>
        <FormItem label="创建人:">
          <Input
            v-model="searchForm.creator_name"
            placeholder="请输入创建人"
            @on-enter="searchData(true)"
            clearable
          />
        </FormItem>
        <!--        <FormItem label="账户状态:">-->
        <!--          <Select v-model="searchForm.accountState" style="width:120px" clearable placeholder="请选择账户状态">-->
        <!--            <Option v-for="item in accountStates" :value="item.key" :key="item.key" >{{ item.value }}</Option>-->
        <!--          </Select>-->
        <!--        </FormItem>-->
        <!--        <FormItem label="分配销售:">-->
        <!--          <Select v-model="searchForm.salesmen" style="width:120px" clearable placeholder="请选择分配销售">-->
        <!--            <Option v-for="item in salesmens" :value="item.uid" :key="item.uid" >{{ item.username }}</Option>-->
        <!--          </Select>-->
        <!--        </FormItem>-->
        <FormItem>
          <Button type="primary" @click="searchData(true)" style="margin-left:20px">查询</Button>
          <Button type="info" @click="reset" style="margin-left:20px">重置</Button>
          <Button
            type="success"
            @click="jump2customAdd"
            style="margin-left:20px;"
            v-if="showAccess('客户管理_客户列表_新建客户')"
          >新建客户</Button>
          <Button
            type="warning"
            @click="exportFile"
            style="margin-left:20px;"
            v-if="showAccess('客户管理_客户列表_导出')"
          >导出</Button>
        </FormItem>
      </Form>
    </div>
    <div class="layout-table">
      <Table border :columns="columns" :data="rowData" :loading="tableLoading">
        <template slot-scope="{ row, index }" slot="total_balance">
          <span>{{numberF.milliFormat(+row.total_balance)}}</span>
        </template>
        <template slot-scope="{ row, index }" slot="role_name">
          <span>{{selectRolesID(row.roles_id)}}</span>
        </template>
        <!--            <template slot-scope="{ row, index }" slot="status">-->
        <!--              <Tag type="dot" :color="+row.status ? 'success' : 'error'">{{+row.status ? '正常' : '禁用'}}</Tag>-->
        <!--            </template>-->
        <template slot-scope="{ row, index }" slot="action">
          <Button type="primary" size="small" @click="showOreditInfo(row.id,'show')">详情</Button>&nbsp;
          <Button
            type="success"
            size="small"
            @click="showOreditInfo(row.id,'edit')"
            v-if="showAccess('客户管理_客户列表_编辑')"
          >编辑</Button>
          <Button
            type="warning"
            size="small"
            @click="jump2frontEnd(row)"
            style="margin-left: 5px"
            v-if="showAccess('客户管理_客户列表_跳转前台')"
          >跳转前台</Button>
          <Button
            type="error"
            size="small"
            style="margin-left: 5px"
            @click="createPlan(row.id)"
            v-if="showAccess('客户管理_客户列表_创建计划')"
          >创建计划</Button>
          <Button type="info" size="small" @click="jumpAdFront(row)" style="margin-left: 5px">跳转新前台</Button>
        </template>
      </Table>
      <Page
        :total="total_count"
        size="small"
        :current="page+1"
        @on-change="pageChange"
        :page-size="10"
        show-total
        show-elevator
        style="margin-top:10px;float:right"
      ></Page>
    </div>
    <Modal
      v-model="customer_infoShow"
      :title="info_title"
      :closable="false"
      @on-cancel="visibleChange"
      width="1000"
      class-name="vertical-center-modal"
    >
      <div class="custom_table">
        <div>
          <div style="width: 100%; display: flex;">
            <div style="width: 25%;display: flex;align-items: center">
              <span style="width: 25%">客户名称</span>
              <Input style="width: 70%" v-model="custom_info.custom_username" disabled />
            </div>

            <div style="width: 25%;display: flex;align-items: center">
              <span style="width: 25%">*账户类型</span>
              <Input
                style="width: 70%"
                v-model="custom_info._roles_id"
                :disabled="!isEdit"
                v-if="!isEdit"
                clearable
              />
              <Select style="width: 70%" v-model="custom_info.roles_id" v-else>
                <Option
                  v-for="item in accountTypes"
                  :value="item.key"
                  :key="item.key"
                >{{ item.value }}</Option>
              </Select>
            </div>

            <div style="width: 25%;display: flex;align-items: center">
              <span style="width: 25%">返点比例</span>
              <Input
                style="width: 70%"
                v-model="custom_info.benefit_percent"
                :disabled="!isEdit"
                clearable
              >
                <span slot="append">%</span>
              </Input>
            </div>

            <div style="width: 25%;display: flex;align-items: center">
              <span style="width: 25%">销售对接</span>
              <Select :disabled="!isEdit" v-model="custom_info.sales_id" style="width:120px">
                <Option v-for="item in salesmens" :value="item.id" :key="item.id">{{ item.name }}</Option>
              </Select>
            </div>
          </div>

          <div
            style="width: 100%; display: flex; margin-top: 20px;"
          >
            <div style="width: 50%;display: flex;align-items: center">
              <span style="width: 13%">分账厂商</span>
              <CheckboxGroup v-model="custom_info.partner_list" style="width: 87%">
                <Checkbox
                  v-for="item in custom_info.companys_all"
                  :label="item.key"
                  :key="item.key"
                  :disabled="!isEdit"
                >{{item.value}}</Checkbox>
              </CheckboxGroup>
            </div>

            <div style="width: 50%;display: flex;align-items: center">
              <span style="width: 13%">结算方式</span>
              <RadioGroup style="width: 87%" v-model="custom_info.order_type">
                <Radio v-for="item in Settlements" :label="item.key" :key="item.key">{{item.value}}</Radio>
              </RadioGroup>
            </div>
          </div>
        </div>

        <div
            style="width: 100%; display: flex; margin-top: 20px; border-bottom: #BFBFBF dashed 2px; padding-bottom: 10px"
          >
            <div style="width: 25%;display: flex;align-items: center">
              <span style="width: 25%">日均消耗</span>
              <Input
                style="width: 70%"
                v-model="custom_info.day_cost"
                clearable
                :disabled="!isEdit"
              />
            </div>
            <div style="width: 25%;display: flex;align-items: center">
              <span style="width: 25%">回款周期</span>
              <Input
                style="width: 70%"
                v-model.trim="custom_info.collect_money_days"
                :disabled="!isEdit"
                clearable
              >
                <span slot="append">天</span>
              </Input>
            </div>
        </div>

        <div style="width: 100%; display: flex; margin-top: 20px">
          <div style="width: 30%;display: flex;align-items: center">
            <span style="min-width:85px;text-align:center;">公司名称</span>
            <Input v-model="custom_info.company_name" disabled />
          </div>

          <div style="width: 30%;display: flex;align-items: center">
            <span style="min-width:85px;text-align:center;">联系电话</span>
            <Input v-model="custom_info.contact_number" :disabled="!isEdit" clearable />
          </div>

          <div style="width: 30%;display: flex;align-items: center">
            <span style="min-width:85px;text-align:center;">邮箱</span>
            <Input v-model="custom_info.custom_email" :disabled="!isEdit" clearable />
          </div>
        </div>

        <div style="width: 100%; display: flex; margin-top: 20px">
          <div style="width:30%;display: flex;align-items: center">
            <span style="min-width:85px;text-align:center;">联系人</span>
            <Input style v-model="custom_info.contact_name" :disabled="!isEdit" clearable />
          </div>

          <div style="width: 60%;display: flex;align-items: center">
            <span style="min-width:85px;text-align:center;">所属行业</span>
            <div style=" display: flex;" v-if="!isEdit">
              <Select
                disabled
                v-model="select_industry"
                style=";width: 50%"
                @on-change="select_industry_change"
              >
                <Option
                  v-for="item in industrys"
                  :value="item.industryId"
                  :key="item.industryId"
                >{{ item.industryName }}</Option>
              </Select>
              <Select
                disabled
                v-model="select_industry_second"
                style="width: 50%; margin-left: 4%"
                @on-change="select_industry_second_change_handle"
                v-if="select_industry && select_industry.length != 0"
              >
                <Option
                  v-for="item in industrys[select_industry].subIndustry"
                  :value="item.industryIndex"
                  :key="item.industryIndex"
                >{{ item.industryName }}</Option>
              </Select>
            </div>

            <div v-else style="width: 85%; display: flex;">
              <Select
                v-model="select_industry"
                style="width: 48%"
                @on-change="select_industry_change"
              >
                <Option
                  v-for="item in industrys"
                  :value="item.industryId"
                  :key="item.industryId"
                >{{ item.industryName }}</Option>
              </Select>
              <Select
                v-model="select_industry_second"
                style="width: 48%; margin-left: 4%"
                @on-change="select_industry_second_change_handle"
                v-if="select_industry && select_industry.length != 0"
              >
                <Option
                  v-for="item in industrys[select_industry].subIndustry"
                  :value="item.industryIndex"
                  :key="item.industryIndex"
                >{{ item.industryName }}</Option>
              </Select>
            </div>
          </div>
        </div>
        <div style="width: 100%; display: flex; margin-top: 20px">
          <div style="width: 30%;display: flex;align-items: center">
            <span style="min-width:85px;;text-align:center">纳税人识别号</span>
            <Input style v-model="custom_info.taxNo" :disabled="!isEdit" clearable />
          </div>

          <div style="width: 30%;display: flex;align-items: center">
            <span style="min-width:85px;text-align:center">开户银行</span>
            <Input style v-model="custom_info.bankName" :disabled="!isEdit" clearable />
          </div>

          <div style="width: 30%;display: flex;align-items: center">
            <span style="min-width:85px;text-align:center">银行账号</span>
            <Input style v-model="custom_info.bankNo" :disabled="!isEdit" clearable />
          </div>
        </div>
        <div style="width: 100%; display: flex; margin-top: 20px">
          <div style="width: 90%;display: flex;align-items: center">
            <span style="min-width:85px;text-align:center">公司地址</span>
            <Input style v-model="custom_info.company_address" :disabled="!isEdit" clearable />
          </div>
        </div>
        <div style="width: 100%; display: flex; margin-top: 20px">
          <div style="width: 100%;display: flex;align-items: center">
            <div style="width:58px;">营业执照</div>

            <!-- <div v-for="(item,index) in businessLicense_all" :key="index" v-if="!isEdit" style="float:left;width:60px;height:100px;text-align:center">
                <img :src="imgPrePath + '/storage/image/' + item" alt="" style="width:40px;height:55px; border:1px solid; display: inline-block;">
                <Button type="primary" @click="businessLicenseShow(index)" shape="circle" size="small">查看</Button>
            </div>-->
            <viewer :images="businessLicense_all" v-if="!isEdit">
              <img
                v-for="(item,index) in businessLicense_all"
                :src="imgPrePath + '/storage/image/' + item"
                :key="index"
                style="width:40px;height:55px; border:1px solid; display: inline-block;cursor:pointer;margin-right:10px;"
              />
            </viewer>
            <div v-if="isEdit">
              <viewer :images="imgBase64_all" style="display:flex;">
                <div
                  v-for="(imgBase64,index) in imgBase64_all"
                  style="margin-right:10px;display:flex;flex-direction: column"
                >
                  <img
                    :src="imgPrePath + '/storage/image/' + imgBase64"
                    style="width:40px;height:55px; border:1px solid; display: inline-block;cursor:pointer;margin-bottom:5px;"
                  />
                  <Button type="error" size="small" @click="del(index)">删除</Button>
                </div>
              </viewer>
              <!-- <div v-for="(imgBase64,index) in imgBase64_all" :key="index" style="float:left;width:60px;height:100px;text-align:center">
                  <img :src="imgPrePath + '/storage/image/' + imgBase64" alt="" width="60" height="70" style="width:40px;height:55px; border:1px solid; display: inline-block;">
                  <Button type="error" size="small" @click="del(index)">删除</Button>
              </div>-->
            </div>
            <Upload
              :before-upload="handleUpload"
              :action="uploadAction"
              :headers="headers"
              accept="image/*"
              v-if="isEdit"
              style="overflow:hidden;"
            >
              <div>
                <Button type="primary" icon="ios-cloud-upload-outline">点击上传营业执照</Button>
              </div>
            </Upload>
          </div>
        </div>
      </div>
      <div slot="footer">
        <Button type="primary" size="large" @click="back">返回</Button>
        <Button type="primary" size="large" @click="submit" v-if="isEdit">提交</Button>
      </div>
    </Modal>
    <!-- 营业执照模态框 -->
    <Modal v-model="modalImage">
      <p slot="header" style="color:#39f;text-align:center">
        <span>营业执照</span>
      </p>
      <div style="text-align:center">
        <img
          v-if="modalImage"
          :src="imgPrePath + '/storage/image/' + businessLicense"
          style="width:100%"
          alt="营业执照"
        />
        <!-- 测试地址 -->
      </div>
      <div slot="footer">
        <Button type="primary" size="large" long @click="modalImage = false">返回</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import numberF from "@/utils/numberFormat";
import axios from "@/libs/api.request";
import { getToken, uuid } from "@/libs/util";
import hasShowAccess from "@/libs/hasShowAccess.js";
export default {
  name: "clientList",
  data() {
    return {
      imgPrePath:
        location.href.indexOf("back-manager.teddymobile.net") > -1
          ? "https://m.teddymobile.cn"
          : "https://m-test.teddymobile.cn",
      numberF: numberF,
      searchForm: {
        username: "",
        accountType: 0,
        industry: 0,
        SettlementSearch: "",
        accountState: "",
        salesmen: "",
        creator_name: ""
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
      tableLoading: false,
      industrys: {}, // 数组一级行业
      industry_first_list: [], // 对象一级行业 industry_first_list[custom_info.industry_first_list]
      industry_first: "",
      select_industry: "",
      select_industry_second: "",
      select_industry_second_list: [],
      industry_second: 0,
      info_title: "客户详情",

      businessLicense: "",
      industry_second_list: [],
      company_list: {},
      // username: '',
      imgBase64_all: [],
      imgLoaded: false,
      uploadAction: "/admin/public/uploadimage", //
      businessLicense_all: [],
      customer_infoShow: false, // 详情模态框
      modalImage: false,
      isEdit: true,
      imgBase64: "",
      companys: [], // 厂商
      custom_info: {
        company_name: "",
        companys_all: [], // 分账厂商
        partner_list: [],
        menu_price: 0, // 点击单价
        next_price: 0,
        _roles_id: "",
        roles_id: 0,
        is_other: "0", // 更多流量
        sales_id: ""
      },
      accountTypes: [], // 账户类型

      Settlements: [], // 结算方式

      accountStates: [
        { key: 1, value: "正常" },
        { key: 0, value: "停用" }
      ], // 账户状态

      salesmens: [],
      total_count: 0,
      page: 0,
      pageSize: 10,
      columns: [
        {
          title: "序号",
          type: "index",
          width: 60,
          align: "center",
          key: "index"
        },
        {
          title: "客户名称",
          key: "custom_username",
          width: 150,
          align: "center"
        },
        {
          title: "公司名称",
          key: "company_name",
          align: "center"
        },
        {
          title: "账户类型",
          key: "role_name",
          align: "center",
          slot: "role_name"
        },
        {
          title: "结算方式",
          key: "_order_type",
          align: "center"
        },
        {
          title: "账户余额",
          slot: "total_balance",
          align: "center"
        },
        {
          title: "销售对接",
          key: "username",
          align: "center"
        },
        {
          title: "创建人",
          key: "creator_name",
          align: "center"
        },
        {
          title: "创建日期",
          key: "create_time",
          align: "center",
          width: 150
        },
        {
          title: "操作",
          slot: "action",
          width: 350,
          align: "center"
        }
      ],
      rowData: []
    };
  },
  created() {
    // 销售人员
    this.getSalesmens();
    // 获取公共信息
    this.getPublicInfo();
  },
  methods: {
    reset() {
      this.searchForm.username = "";
      this.searchForm.accountType = 0;
      this.searchForm.industry = 0;
      this.searchForm.SettlementSearch = "";
      this.searchForm.accountState = "";
      this.searchForm.salesmen = "";
      this.searchForm.creator_name = "";
    },
    getPublicInfo() {
      axios
        .request({
          url: "/sys/utils/all",
          method: "get"
        })
        .then(res => {
          if (res.data.code === 0) {
            this.industrys = res.data.data.industrys;
            this.company_list = res.data.data.sysConfig.partnerName;
            this.accountTypes = res.data.data.sysConfig.customerRole;
            this.Settlements = res.data.data.sysConfig.orderType;
            this.searchData();
          } else {
            this.$Message.error(res.data.msg);
          }
        })
        .catch(err => {
          this.$Message.error("请求失败，" + err + "，请稍后再试！");
        });
    },
    getSalesmens() {
      axios
        .request({
          url: "/ad/management/ads/getAllSaleInfo",
          method: "post"
        })
        .then(d => {
          if (d.data.code === 0) {
            this.salesmens = d.data.data;
          } else {
            this.$Message.error(d.data.msg);
          }
        })
        .catch(err => {
          this.$Message.error("请求失败，" + err + "，请稍后再试！");
        });
    },
    searchData(bool) {
      this.tableLoading = true;
      // 查询数据
      var postData = {
        pageIndex: bool ? 0 : this.page,
        pageSize: this.pageSize
      };
      //      客户名称
      postData.queryKey = this.searchForm.username;
      //      分配销售
      postData.salesId = this.searchForm.salesmen;
      //      创建人
      postData.creatorName = this.searchForm.creator_name;
      let _this = this;
      axios
        .request({
          url: "/ad/customer/list",
          method: "post",
          data: { ...postData }
        })
        .then(d => {
          if (d.data.code === 0) {
            this.page = d.data.data.pageIndex;
            this.pageSize = d.data.data.pageSize;
            this.total_count = d.data.data.total;
            let rowData = d.data.data.data;
            rowData.forEach(i => {
              // i._industry_first_id =
              //   _this.industrys[+i.industry_first_id].industryName;
              i._order_type = this.Settlements.filter(item => {
                return item.key === i.order_type;
              })[0].value;
            });
            _this.rowData = rowData;
            this.tableLoading = false;
          } else {
            this.$Message.error(d.data.msg);
          }
        })
        .catch(err => {
          this.$Message.error("网络错误" + err);
        });
    },
    handleUpload(file) {
      // 上传文件之前的钩子
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = ev => {
        if (this.imgBase64_all.length === 5) {
          this.$Notice.error({
            title: "失败",
            desc: "最多上传5张执照"
          });
          return false;
        }
        this.imgLoaded = true;
        let _this = this;
        let formData = new URLSearchParams();
        formData.append("imgbase64", ev.target.result);
        formData.append("saveDB", 1);
        axios
          .commonRequset({
            url: _this.imgPrePath + "/admin/public/uploadimage",
            method: "post",
            data: formData
          })
          .then(d => {
            if (d.data.boo) {
              this.imgBase64_all.push(d.data.data.url);
              this.$Notice.success({
                title: "文件上传成功",
                desc: "文件上传成功"
              });
            } else {
              this.$Notice.error({
                title: "文件上传失败",
                desc: "文件上传失败请检查网络"
              });
            }
          })
          .catch(e => {
            this.$Notice.error({
              title: "文件上传失败",
              desc: "文件上传失败请检查网络"
            });
          });
      };
      return false;
    },
    pageChange(page) {
      this.page = page - 1;
      this.searchData();
    },
    createPlan(id) {
      this.$router.push({
        path: "/AdManagement/promotionPlan",
        query: { customId: id, Current: 0 }
      });
    },
    jump2frontEnd(row) {
      let env = {
        test: "http://test.e.teddymobile.cn",
        prod: "https://e.teddymobile.cn"
      };
      let prefix =
        location.href.indexOf("back-manager.teddymobile.net") > -1
          ? env.prod
          : env.test;
      window.open(
        prefix +
          `/login/json_login_by_admin?param=` +
          JSON.stringify({ u: row.custom_username, p: row.p })
      );
    },
    jumpAdFront(row) {
      let url =
        location.href.indexOf("back-manager.teddymobile.net") > -1
          ? "https://ad.teddymobile.net"
          : "https://ad-front-test.teddymobile.net";
      window.open(
        url +
          "/#/jump?customUsername=" +
          row.custom_username +
          "&tk=" +
          getToken()
        //  'http://ad-front-test.teddymobile.net/#/jump?customUsername=' +row.custom_username+'&tk=' +'eyJpc0VuYWJsZSI6MSwibGFzdExvZ2luIjoxNTgwODcxOTI3NTA5LCJuaWNrTmFtZSI6InlvdWJpbmdrdW4iLCJ0b2tlbiI6IjYwX3lvdWJpbmdrdW5fMTU4MDg3MTkyNzUwOSIsInVzZXJFbWFpbCI6InlvdWJpbmdrdW5AdGVkZHltb2JpbGUuY24iLCJ1c2VySWQiOjYwLCJ1c2VyTmFtZSI6InlvdWJpbmdrdW4ifQ=='
      );
    },
    submit() {
      if (this.custom_info.roles_id === 0) {
        this.$Notice.error({
          title: "无法提交",
          desc: "账户类型未选择,请选择账户类型"
        });
        return;
      }
      if (!this.custom_info.benefit_percent) {
        this.$Message.error("请输入返点比例！");
        return;
      }
      if (this.custom_info.benefit_percent % 1 !== 0) {
        this.$Message.error("返点比例必须为整数！");
        return;
      }
      if (!/^(([^0-][0-9]{0,5}|0)\.([0-9]{1,2})$)|^([^0-]([0-9]{0,5})?|0)$/.test(this.custom_info.day_cost)) {
          this.$Message.error("日均消耗只支持小数点前最多6位，小数点后最多2位");
          return;
      }
      if (!this.custom_info.collect_money_days || this.custom_info.collect_money_days % 1 !== 0 || /^-/.test(this.custom_info.collect_money_days)) {
        this.$Message.error("回款周期必须为必填项且为正整数！");
        return;
      }
      if (
        this.custom_info.benefit_percent < 0 ||
        this.custom_info.benefit_percent > 100
      ) {
        this.$Message.error("返点比例范围在0和100之间");
        return;
      }
      if (!this.custom_info.sales_id) {
        this.$Message.error("销售不能为空！");
        return;
      }
      if (this.custom_info.partner_list.length == 0) {
        this.$Message.error("分账厂商不能为空！");
        return;
      }
      if (isNaN(this.custom_info.contact_number)) {
        this.$Message.error("联系电话必须为数字！");
        return;
      }
      if (
        5 > this.custom_info.contact_number.length ||
        this.custom_info.contact_number.length > 12
      ) {
        this.$Message.error("联系电话不能小于5位、大于12位");
        return;
      }
      if (!this.custom_info.custom_email) {
      } else if (
        !/^[A-Za-z0-9]+([_\.][A-Za-z0-9]+)*@([A-Za-z0-9\-]+\.)+[A-Za-z]{2,6}$/.test(
          this.custom_info.custom_email
        )
      ) {
        this.$Message.error("不符合邮箱规则");
        return;
      }
      if (
        this.custom_info.custom_email &&
        this.custom_info.custom_email.length > 30
      ) {
        this.$Message.error("邮箱不能超过30个字符");
        return;
      }
      if (!this.custom_info.contact_name) {
        this.$Message.error("联系人不能为空！");
        return;
      }
      if (this.custom_info.contact_name.length > 30) {
        this.$Message.error("联系人不能超过30个字符");
        return;
      }
      if (this.businessLicense_all.length == 0) {
        this.$Message.error("营业执照没有上传,请上传");
        return;
      }
      if (
        this.custom_info.taxNo &&
        !/^[0-9a-zA-Z]{15,18}$/.test(this.custom_info.taxNo)
      ) {
        this.$Message.error("纳税人识别号由15-18位数字和字母构成");
        return;
      }
      if (
        this.custom_info.bankNo &&
        !/^\d{12,}$/.test(this.custom_info.bankNo)
      ) {
        this.$Message.error("银行账号由数字构成,不少于12位");
        return;
      }
      let postData = {};
      let postDataKey = [
        "custom_id",
        "company_name",
        "roles_id",
        "company_url",
        /* 'industry_first_id', */ "industry_second_id",
        "partner_list",
        "order_type",
        "benefit_percent",
        "collect_money_days",
        "day_cost",
        "menu_price",
        "next_price",
        "license_img",
        "contact_name",
        "contact_number",
        "company_domain",
        "custom_email",
        "parent_id",
        "is_other",
        "sales_id",
        "bankNo",
        "bankName",
        "taxNo",
        "company_address"
      ];
      for (let x in this.custom_info) {
        if (postDataKey.indexOf(x) > -1) {
          postData[x] = this.custom_info[x];
        }
      }
      postData.industry_first_id = this.select_industry + "";
      postData.industry_second_id = +this.select_industry_second - 1 + "";
      postData.partner_list = this.custom_info.partner_list.join(",");
      postData.custom_id = this.custom_info.id;
      postData.custom_password = this.custom_info.contact_number;
      // postData.benefit_percent = this.custom_info.benefit_percent
      postData.license_img = this.imgBase64_all.join(",");

      axios
        .request({
          url: "/ad/customer/edit",
          method: "post",
          data: postData
        })
        .then(d => {
          if (d.data.code === 0) {
            this.$Notice.success({
              title: "修改成功",
              desc: "客户信息修改成功"
            });
            this.searchData();
            this.back();
          } else {
            this.$Notice.error({
              title: "修改失败",
              desc: d.data.msg
            });
          }
        });
    },
    showOreditInfo(custom_id, action) {
      if (action === "show") {
        this.info_title = "客户详情";
        this.isEdit = false;
      } else if (action === "edit") {
        this.info_title = "客户编辑";
        this.isEdit = true;
      }
      let _this = this;
      axios
        .request({
          url: "/ad/customer/detail/" + custom_id,
          method: "get"
        })
        .then(d => {
          if (d.data.code === 0) {
            _this.custom_info = d.data.data;
            _this.custom_info.companys_all = _this.company_list;
            _this.industry_first =
              _this.industrys[
                +_this.custom_info.industry_first_id
              ].industryName;
            _this.select_industry = +_this.custom_info.industry_first_id;

            let secondIndustry =
              _this.industrys[+_this.custom_info.industry_first_id].subIndustry[
                +_this.custom_info.industry_second_id + 1
              ];
            _this.industry_second = secondIndustry
              ? secondIndustry.industryName
              : "";
            _this.custom_info.partner_list = _this.custom_info.partner_list.split(
              ","
            );
            _this.imgBase64_all = _this.businessLicense_all = _this.custom_info.license_img
              .split(",")
              .filter(i => i !== "");

            _this.custom_info._roles_id = _this.accountTypes.filter(
              item => +item.key === +_this.custom_info.roles_id
            )[0].value;
            this.custom_info.sales_id = Number(this.custom_info.sales_id);
            let haveSales = this.salesmens.some(item => {
              return item.id === this.custom_info.sales_id;
            });
            haveSales ? false : (this.custom_info.sales_id = "");
            _this.$nextTick(() => {
              _this.select_industry_second =
                +_this.custom_info.industry_second_id + 1;
            });
            _this.customer_infoShow = true;
          } else {
            _this.$Message.error(res.data.msg);
          }
        });
    },
    edit(custom_id) {
      // 编辑点击 废弃ing
      axios
        .request({
          url: "/admin/custom/json_info",
          method: "post",
          data: { custom_id }
        })
        .then(d => {
          this.custom_info = d.data.data.custom_info;
          this.custom_info.companys_all = (() => {
            let arr = [];
            for (let x in this.company_list) {
              arr.push(this.company_list[x]);
            }
            return arr;
          })();
        });
    },
    // stop (custom_id) {
    //   this.$Notice.error({
    //     title: '暂未开通 ',
    //     desc: '此功能暂未开放'
    //   })
    // },
    back() {
      this.customer_infoShow = false;
      this.visibleChange();
    },
    jump2customAdd() {
      this.$router.push({ path: "/clientManagement/newClient" });
    },
    visibleChange(bool) {
      this.select_industry = "";
      this.select_industry_second = "";
      this.imgLoaded = false;
    },
    del(index) {
      this.imgBase64_all.splice(index, 1);
    },
    businessLicenseShow(index) {
      this.businessLicense = this.businessLicense_all[index];
      this.modalImage = true;
    },
    select_industry_change(value) {
      this.select_industry_second_list = this.industry_second_list[
        this.industry_first_list[value]
      ];
      this.select_industry_second = "";
    },
    select_industry_second_change_handle(value) {},
    exportFile() {
      let url =
        location.href.indexOf("back-manager.teddymobile.net") > -1
          ? "https://m.teddymobile.cn"
          : "https://m-test.teddymobile.cn";
      window.open(url + "/admin//custom/json_export_custom");
    }
  },
  computed: {
    selectRolesID() {
      return roleId => {
        let roleName = "";
        // let arr = JSON.parse(JSON.stringify(this.accountTypes))
        this.accountTypes.forEach(item => {
          if (item.key == roleId) {
            roleName = item.value;
          }
        });
        return roleName;
      };
    },
    showAccess() {
      return el => {
        return hasShowAccess(el);
      };
    }
  }
};
</script>
<style lang="less" scoped>
.layout-checkbox {
  margin-left: 55px;
}
.layout-table {
  padding-right: 10px;
}
.layout-search {
  width: 100%;
  margin-top: 10px;
  .label-type,
  .label-submitTime,
  .autograph,
  .usernamelabel {
    margin-left: 10px;
    margin-right: 10px;
  }
  .layout-datepicker {
    width: 200px;
    display: inline-block;
  }
  .layout-select {
    display: inline-block;
    margin-left: 6px;
  }
}
.layout-hasSuffix {
  line-height: 47px;
  width: 209px;
}
.custom_table {
  padding: 0 0 0 40px;
}
.custom_table > table {
  margin: auto;
  &:nth-child(1) {
    padding-bottom: 15px;
  }
  td {
    padding: 5px;
  }
}

.custom_table > table > tr > td:nth-child(odd) {
  width: 120px;
  text-align: right;
}
.custom_table > table > tr > td:nth-child(even) {
  width: 210px;
}
</style>
