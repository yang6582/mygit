<template>
  <div>
    <Form :model="formItem" :label-width="100" :inline="true" style="margin-top: 20px">
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
      <FormItem label="商户名称:">
        <Input
          v-model="formItem.merchant_name"
          placeholder="商户名称"
          clearable
          @on-enter="search(true)"
        />
      </FormItem>
      <FormItem label="菜单名称:">
        <Input v-model="formItem.ad_name" placeholder="菜单名称" clearable @on-enter="search(true)" />
      </FormItem>
      <FormItem :label-width="30">
        <Button type="primary" style="margin-left:10px" @click="search(true)">查询</Button>
        <Button
          type="primary"
          style="margin-left: 10px"
          @click="add('add')"
          v-if="showAccess('队列管理_菜单队列_新增')"
        >新增</Button>
        <Button
          type="primary"
          style="margin-left: 10px"
          @click="importExcel"
          v-if="showAccess('队列管理_菜单队列_批量导入')"
        >批量导入</Button>
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
        <template slot-scope="{row}" slot="menuType">
          <span>{{row.sms_menu ? row.sms_menu.type : ''}}</span>
        </template>
        <template slot-scope="{row}" slot="menuDetails">
          <Tooltip placement="top" max-width="200">
            <div
              slot="content"
            >{{row.sms_menu ? ((row.sms_menu.type == 'app' || row.sms_menu.type == 'fastapp' )? (row.sms_menu.extendData.deeplink || row.sms_menu.extendData.packageName) : row.sms_menu.data) : ''}}</div>
            <Button size="small" style="color:#59afed">查看</Button>
          </Tooltip>
        </template>
        <template slot-scope="{row}" slot="menuLocation">
          <span>{{row.index == 0 ? '不固定' : (row.index == 1 ? '左' : (row.index == 2 ? '中' : '右'))}}</span>
        </template>
        <template slot-scope="{ row }" slot="operator">
          <div style="padding:10px 0;">
            <Button
              type="primary"
              size="small"
              @click="add('update',row)"
              v-if="showAccess('队列管理_菜单队列_修改') && !row.blackShopFlag"
            >修改</Button>
            <Button
              type="error"
              size="small"
              style="margin-left:10px;"
              @click="delModalOpen(row)"
              v-if="showAccess('队列管理_菜单队列_删除')"
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
      <div style="padding:0 40px 0 0;">
        <Form ref="addForm" :model="addForm" :rules="addRuleValidate" :label-width="110">
          <FormItem label="商户名称" prop="merchant_name">
            <Select
              :disabled="addType == 'update'"
              ref="shopSelect"
              v-model="addForm.merchant_name"
              filterable
              clearable
              remote
              :remote-method="getAllShops"
              :loading="getShopsLoading"
            >
              <Option v-for="item in allShops" :value="item.name" :key="item.id">{{item.name}}</Option>
            </Select>
          </FormItem>
          <FormItem label="规则" prop="guide_value">
            <Input v-model="addForm.guide_value" placeholder="请填写规则" clearable></Input>
          </FormItem>
          <FormItem label="菜单名称" prop="ad_name">
            <Input v-model="addForm.ad_name" placeholder="请填写菜单名称" clearable></Input>
          </FormItem>
          <FormItem label="位置" prop="index">
            <RadioGroup v-model="addForm.index">
              <Radio label="0">不固定</Radio>
              <Radio label="1">左</Radio>
              <Radio label="2">中</Radio>
              <Radio label="3">右</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="权重" prop="weight">
            <Input v-model="addForm.weight" placeholder="请填写权重" clearable></Input>
          </FormItem>
          <FormItem label="商业化菜单" prop="sms_menu.isCommercial">
            <RadioGroup v-model="addForm.sms_menu.isCommercial">
              <Radio label="0">非商业化菜单</Radio>
              <Radio label="1">商业化菜单</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="类型" prop="sms_menu.type">
            <RadioGroup v-model="addForm.sms_menu.type">
              <Radio label="url">url</Radio>
              <Radio label="app">app</Radio>
              <Radio label="phone">phone</Radio>
              <Radio label="fastapp" v-if="partnerId == 5 || partnerId == 9">fastapp</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem
            label="链接"
            prop="sms_menu.data"
            v-if="addForm.sms_menu.type == 'url'"
            key="dataUrl"
          >
            <Input v-model="addForm.sms_menu.data" placeholder="请填写链接" clearable></Input>
          </FormItem>
          <FormItem
            label="电话号码"
            prop="sms_menu.data"
            v-if="addForm.sms_menu.type == 'phone'"
            key="dataPhone"
          >
            <Input
              v-model="addForm.sms_menu.data"
              :maxlength="15"
              clearable
              @on-keyup="addForm.sms_menu.data=addForm.sms_menu.data.replace(/^(0+)|[^\d]+/g,'')"
              placeholder="电话号码"
            ></Input>
          </FormItem>
          <FormItem
            label="打开方式"
            prop="sms_menu.browser_type"
            v-if="addForm.sms_menu.type == 'url'"
            key="browser_type"
          >
            <RadioGroup v-model="addForm.sms_menu.browser_type">
              <Radio label="1">小窗预览</Radio>
              <Radio label="2">全屏</Radio>
              <Radio label="3">浏览器</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem
            label="应用名称"
            prop="sms_menu.extendData.appName"
            v-if="addForm.sms_menu.type == 'app'"
            key="appName"
          >
            <Input v-model="addForm.sms_menu.extendData.appName" placeholder="请填写应用名称" clearable></Input>
          </FormItem>
          <FormItem
            :label="addForm.sms_menu.type == 'app' ? '包名' :'快应用包名'"
            prop="sms_menu.extendData.packageName"
            v-if="addForm.sms_menu.type == 'app' || addForm.sms_menu.type == 'fastapp'"
            key="packageName"
          >
            <Input v-model="addForm.sms_menu.extendData.packageName" placeholder="请填写包名" clearable></Input>
          </FormItem>
          <FormItem
            :label="addForm.sms_menu.type == 'app' ? '页面直达' : '快应用链接'"
            prop="sms_menu.extendData.deeplink"
            v-if="addForm.sms_menu.type == 'app' || addForm.sms_menu.type == 'fastapp'"
            key="deepLink"
          >
            <Input v-model="addForm.sms_menu.extendData.deeplink" placeholder clearable></Input>
          </FormItem>
          <!-- <FormItem label="快应用包名" prop="fastApp" v-if="addForm.sms_menu.type == 'fastapp'" key="fastApp">
            <Input v-model="addForm.fastApp" placeholder="请填写快应用包名"></Input>
          </FormItem>-->
          <!-- <FormItem label="快应用链接" prop="fastLink" v-if="addForm.sms_menu.type == 'fastapp'" key="fastLink">
            <Input v-model="addForm.fastLink" placeholder="请填写快应用链接"></Input>
          </FormItem>-->
          <FormItem
            label="快应用最低版本"
            prop="sms_menu.extendData.fastAppVer"
            v-if="addForm.sms_menu.type == 'fastapp'"
            key="fastAppVer"
          >
            <Input
              v-model="addForm.sms_menu.extendData.fastAppVer"
              placeholder="请填写快应用最低版本"
              clearable
            ></Input>
          </FormItem>
          <FormItem
            label="备用链接"
            prop="sms_menu.extendData.html_link"
            v-if="addForm.sms_menu.type == 'app'"
            key="html_link"
          >
            <Input v-model="addForm.sms_menu.extendData.html_link" placeholder="请填写备用链接" clearable></Input>
          </FormItem>
          <FormItem
            label="备用链接"
            prop="sms_menu.extendData.htmlLink"
            v-if="addForm.sms_menu.type == 'fastapp'"
            key="htmlLink"
          >
            <Input v-model="addForm.sms_menu.extendData.htmlLink" placeholder="请填写备用链接" clearable></Input>
          </FormItem>
          <FormItem
              label="菜单类型:"
              prop="sms_menu.extendData.menuAdType"
            >
              <RadioGroup v-model="addForm.sms_menu.extendData.menuAdType">
                <Radio :label="0">非商业化菜单</Radio>
                <Radio :label="1">CPD菜单</Radio>
                <Radio :label="2">vivo品牌广告菜单</Radio>
                <Radio :label="3">vivo其他广告菜单</Radio>
                <Radio :label="4">泰迪CPC广告菜单</Radio>
                <Radio :label="5">泰迪其他广告菜单</Radio>
                <Radio :label="6">vivo内部导流菜单</Radio>
              </RadioGroup>
            </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button @click="addModal = false">取消</Button>
        <Button type="primary" style="margin-left:10px;" @click="handleSubmit('addForm')">确定</Button>
      </div>
    </Modal>
    <Modal
      title="删除"
      v-model="delModal"
      @on-ok="delOk"
      @on-cancel="delCancel"
      :mask-closable="false"
    >
      <div style="padding:40px;text-align:center;font-size:18px;">确认删除该菜单</div>
    </Modal>
    <Modal title="导入完成" v-model="importModal" :mask-closable="false">
      <div style="padding:40px;text-align:center;font-size:14px;">
        <p
          style="margin-bottom:20px;"
        >本次上传{{uploadResponse.success_count +uploadResponse.error_count}}条，其中{{uploadResponse.success_count}}条导入成功，{{uploadResponse.error_count}}条导入失败</p>
      </div>
      <div slot="footer">
        <Button type="primary" @click="checkResult">查看结果</Button>
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
          action="/ad/menusqueue/upload"
          accept=".xls, .xlsx"
          :headers="headers"
          :show-upload-list="false"
          :before-upload="beforeUpload"
          :on-success="uploadSuccess"
          :on-error="uploadError"
        >
          <Button>选择文件</Button>
        </Upload>
        <a :href="onloadUrl+'菜单队列导入模板.xlsx'" download="菜单队列导入模板.xlsx">
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
import moment from "moment";
import hasShowAccess from "@/libs/hasShowAccess.js";
moment.locale("zh-cn");
export default {
  name: "menuQue",
  components: {
    columnsSelect: () => import("@/components/columns-select")
  },
  data() {
    const validateMenuName = (rule, value, callback) => {
      if (value == "" || value.trim() == "") {
        callback(new Error("菜单名称不能为空"));
      } else {
        callback();
      }
    };
    const validateWeight = (rule, value, callback) => {
      if (isNaN(value) || value < 0 || value > 6) {
        callback(new Error("权重为0-6"));
      } else {
        callback();
      }
    };
    return {
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
      getShopsLoading: false,
      allShops: [],
      uploadLoading: false,
      importModal: false,
      addModal: false,
      delModal: false,
      formItem: {
        vendor: 5,
        merchant_name: "",
        ad_name: ""
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
      partner_id: 0,
      del_id: 0,
      rowData: [
        // {
        //   menu_id: "31",
        //   merchant_name: "立即贷APP",
        //   ad_name: "贷款测试中",
        //   guide_type: "0",
        //   guide_value: "322121",
        //   sms_menu: {
        //     sum: "贷款测试中",
        //     logo: "",
        //     type: "url",
        //     isCommercial: "0",
        //     data: "www.taobao.com",
        //     browser_type: "1",
        //     extendData: {
        //       menuType: "menuType",
        //       appName: "appName",
        //       packageName: "packageName",
        //       icon: "icon",
        //       id: "id",
        //       star: "star",
        //       apk: "apk",
        //       size: "size",
        //       intro: "intro",
        //       describe: "describe",
        //       fee: "fee",
        //       deepLink: "deepLink",
        //       html_link: "html_link",
        //       pic: "pic"
        //     },
        //     type_name: "type_name",
        //     type_val: "type_val",
        //     submenu: [],
        //     name: "贷款测试中"
        //   },
        //   index: "2",
        //   weight: "100"
        // }
      ],
      menu_id: 0,
      addForm: {
        // partner_id: 5,
        merchant_name: "", //商户名称
        ad_name: "", //菜单名称
        guide_type: 0,
        index: "0", //位置
        weight: "", //权重
        guide_value: "", //规则
        sms_menu: {
          name: "",
          sum: "",
          logo: "",
          type: "url", //类型
          isCommercial: "0", //是否商业化
          data: "", //链接
          browser_type: "1",
          extendData: {
            menuType: "",
            appName: "", //应用名称,
            packageName: "", //包名
            icon: "",
            id: "",
            star: "",
            apk: "",
            size: "",
            intro: "",
            describe: "",
            fee: "",
            deeplink: "", //直达页面和快应用链接
            html_link: "", //备用链接
            htmlLink: "", //备用链接
            pic: "",
            fastAppVer: "" //最低版本号
          },
          type_name: "",
          type_val: "",
          menuAdType: 0
        }
      },
      addRuleValidate: {
        // "sms_menu.extendData.fastAppVer": [
        //   {
        //     required: true,
        //     message: "快应用最低版本为必填项",
        //     trigger: "blur"
        //   }
        // ],
        // "sms_menu.extendData.html_link": [
        //   {
        //     required: true,
        //     message: "备用链接为必填项",
        //     trigger: "blur"
        //   }
        // ],
        merchant_name: [
          {
            required: true,
            message: "商户名称为必填项",
            trigger: "blur"
          }
        ],
        "sms_menu.extendData.appName": [
          {
            required: true,
            message: "应用名称为必填项",
            trigger: "blur"
          }
        ],
        ad_name: [
          {
            required: true,
            validator: validateMenuName,
            trigger: "blur"
          }
        ],
        // "sms_menu.extendData.deeplink": [
        //   {
        //     required: true,
        //     message: "页面直达为必填项",
        //     trigger: "blur"
        //   }
        // ],
        "sms_menu.extendData.packageName": [
          {
            required: true,
            message: "包名为必填项",
            trigger: "blur"
          }
        ],
        weight: [
          {
            required: true,
            message: "权重为必填项",
            trigger: "blur"
          },
          {
            required: true,
            validator: validateWeight,
            trigger: "blur"
          }
        ],
        index: [
          { required: true, message: "请选择菜单位置", trigger: "change" }
        ],
        "sms_menu.type": [
          { required: true, message: "请选择类型", trigger: "change" }
        ],
        "sms_menu.data": [
          {
            required: true,
            message: "请输入data",
            trigger: "blur"
          }
        ],
        "sms_menu.browser_type": [
          { required: true, message: "请选择浏览器打开方式", trigger: "change" }
        ],
        "sms_menu.extendData.menuAdType": [
          {required: true, message: "请选择菜单类型", trigger: "change", type: 'number'}
        ]
      },
      addType: "add",
      uploadResponse: {
        success_count: 0,
        error_count: 0,
        result_excel: ""
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
          url: "ad/menusqueue/list/query",
          method: "post",
          data: {
            pageIndex: this.page.pageIndex,
            pageSize: this.page.pageSize,
            partnerId: this.formItem.vendor,
            shopName: this.formItem.merchant_name.trim(),
            menuName: this.formItem.ad_name.trim()
          }
        })
        .then(res => {
          if (res.data.code == 0) {
            this.rowData = res.data.data.info;
            this.rowData.forEach(item => {
              if (!item.hasOwnProperty("sms_menu")) {
                item.sms_menu = {};
              }
              if (!item.sms_menu.hasOwnProperty("extendData")) {
                item.sms_menu.extendData = {};
              }
            });
            //console.log(this.rowData);
            this.page.totalCount = Number(res.data.data.total_count);
            this.partner_id = this.formItem.vendor;
          } else {
            this.$Message.error(res.data.msg);
          }
          this.rowDataLoading = false;
        })
        .catch(err => {
          this.$Message.error("网络错误" + err);
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
        this.menu_id = row.menu_id;
        this.addForm = JSON.parse(JSON.stringify(row));
        // this.addForm.sms_menu.extendData.menuAdType = this.addForm.sms_menu.extendData.menuAdType + ''
      }
      this.addModal = true;
    },
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (this.addForm.sms_menu.type == "url") {
          let url = this.addForm.sms_menu.data;
          let reg = /(http|https):\/\/([\w.]+\/?)\S*/;
          if (url && !reg.test(url)) {
            this.$Message.error("url格式不正确");
            return;
          }
        } else if (this.addForm.sms_menu.type == "phone") {
          if (
            this.addForm.sms_menu.data &&
            this.addForm.sms_menu.data.length > 15
          ) {
            this.$Message.error("请输入正确号码,电话号码长度不能大于15位");
            return;
          }
          if (!/^\d+$/.test(this.addForm.sms_menu.data)) {
            this.$Message.error("phone只能为数字");
            return;
          }
        }
        if (valid) {
          let param = JSON.parse(JSON.stringify(this.addForm));

          if (!param.sms_menu.hasOwnProperty("extendData")) {
            param.sms_menu.extendData = {};
          }
          if (param.sms_menu.type == "url" || param.sms_menu.type == "phone") {
            param.sms_menu.extendData = {};
          } else if (param.sms_menu.type == "app") {
            param.sms_menu.data = "";
            param.sms_menu.extendData.fastAppVer = "";
          } else if (param.sms_menu.type == "fastapp") {
            param.sms_menu.data = "";
            param.sms_menu.extendData.appName = "";
          }

          param.sms_menu.name = param.ad_name;
          param.partner_id = this.formItem.vendor;
          param.sms_menu.extendData.menuAdType = this.addForm.sms_menu.extendData.menuAdType
          //  console.log(param)
          // return
          // this.addType == "update" ? (param.menu_id = this.menu_id) : false;
          let url =
            this.addType == "update"
              ? "/ad/menusqueue/edit"
              : "/ad/menusqueue/add";
          axios
            .request({
              url,
              method: "post",
              data: param
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
        this.handleReset("addForm");
      }
    },
    handleReset(name) {
      this.addForm = {
        // partner_id: 5,
        merchant_name: "", //商户名称
        ad_name: "", //菜单名称
        guide_type: 0,
        index: "0", //位置
        weight: "", //权重
        guide_value: "", //规则
        sms_menu: {
          name: "",
          sum: "",
          logo: "",
          type: "url", //类型
          isCommercial: "0", //是否商业化
          data: "", //链接
          browser_type: "1",
          extendData: {
            menuType: "",
            appName: "", //应用名称,
            packageName: "", //包名
            icon: "",
            id: "",
            star: "",
            apk: "",
            size: "",
            intro: "",
            describe: "",
            fee: "",
            deeplink: "", //直达页面和快应用链接
            html_link: "", //备用链接
            htmlLink: "", //备用链接
            pic: "",
            fastAppVer: "", //最低版本号
            menuAdType: 0
          },
          type_name: "",
          type_val: ""
        }
      };
    },
    delOk() {
      //console.log(this.partner_id, this.del_id);
      let param = {
        partner_id: this.partner_id,
        menu_id: this.del_id
      };
      axios
        .request({
          url: "/ad/menusqueue/delete",
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
      this.del_id = row.menu_id;
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
        this.uploadResponse.success_count = response.data.data.success_count;
        this.uploadResponse.error_count = response.data.data.error_count;
        this.uploadResponse.result_excel = response.data.data.result_excel;
        this.reqFiles = {
          files: null,
          fileName: ""
        };
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
    getAllShops(query) {
      this.getShopsLoading = true;
      let param = { shopName: query };
      axios
        .request({
          url: "/ad/shops/names",
          method: "post",
          data: param
        })
        .then(res => {
          if (res.data.code === 0) {
            this.allShops = res.data.data;
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
    importExcel() {
      this.importM = true;
    },
    checkResult() {
      window.open(this.uploadResponse.result_excel);
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
