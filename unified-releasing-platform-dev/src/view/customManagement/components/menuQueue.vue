<template>
  <div>
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
              disabled
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
              <Radio label="fastapp" v-if="partner_id == 5 || partner_id == 9">fastapp</Radio>
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
              @on-keyup="addForm.sms_menu.data=addForm.sms_menu.data.replace(/^(0+)|[^\d]+/g,'')"
              placeholder="请填写电话号码"
              clearable
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
            :label="addForm.sms_menu.type == 'app' ? '直达链接' : '快应用链接'"
            prop="sms_menu.extendData.deeplink"
            v-if="addForm.sms_menu.type == 'app' || addForm.sms_menu.type == 'fastapp'"
            key="deepLink"
          >
            <Input v-model="addForm.sms_menu.extendData.deeplink" placeholder clearable></Input>
          </FormItem>
          <FormItem
            label="快应用最低版本"
            prop="sms_menu.extendData.fastAppVer"
            v-if="addForm.sms_menu.type == 'fastapp'"
            key="fastAppVer"
          >
            <Input v-model="addForm.sms_menu.extendData.fastAppVer" placeholder="请填写快应用最低版本" clearable></Input>
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
  </div>
</template>
<script>
import axios from "@/libs/api.request";

export default {
  props: [
    "editModalInfo",
    "editModal",
    "editModalType",
    "partner_id",
    "merchant_name"
  ],
  components: {},
  data() {
    const validateMenuName = (rule, value, callback) => {
      if (value == "" || value.trim() == "") {
        callback(new Error("菜单名称不能为空"));
      } else {
        callback();
      }
    };
         const validateWeight = (rule, value, callback) => {
      if ( isNaN(value) || value < 0 || value > 6) {
        callback(new Error("权重为0-6"));
      } else {
        callback();
      }
    };
    return {
      addModal: false,
      getShopsLoading: false,
      allShops: [],
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
          browser_type: "3",
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
      addType: "add"
    };
  },
  computed: {},
  created() {},
  methods: {
    add(type, row) {
      this.addType = type;
      if (row) {
        this.menu_id = row.menu_id;
        this.addForm = JSON.parse(JSON.stringify(row));
        // this.addForm.sms_menu.extendData.menuAdType = this.addForm.sms_menu.extendData.menuAdType + ''
      } else {
        this.addForm.merchant_name = this.merchant_name;
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
          param.sms_menu.extendData.menuAdType = this.addForm.sms_menu.extendData.menuAdType
          param.sms_menu.name = param.ad_name;
          param.partner_id = this.partner_id;
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
                this.$emit("updateMenuQueue");
              } else {
                this.$Message.error(res.data.msg);
              }
            })
            .catch(err => {
              this.$Message.error("请求异常，请稍后再试！");
            });
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
    handleReset(name) {
      //this.$refs[name].resetFields();
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
          browser_type: "3",
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
    }
  },
  watch: {
    editModal(newVal, oldVal) {
      if (newVal) {
        let row = {};
        if (this.editModalType == "update") {
          row = JSON.parse(JSON.stringify(this.editModalInfo));
          this.add(this.editModalType, row);
        } else {
          this.add(this.editModalType);
        }
      }
    },
    addModal(newVal) {
      if (!newVal) {
        this.$emit("closeEditMenu");
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
