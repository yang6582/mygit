<template>
  <div class="adStripCom">
    <div class="adStrip">
      <Card :bordered="false" style="margin-bottom:10px;">
        <p slot="title">编辑广告内容</p>
        <div style="width:50%;padding-left:80px;">
          <Form ref="adStripCom" :model="formData" :rules="ruleValidate" :label-width="130">
            <FormItem label="广告名称:" prop="adName">
              <Input v-model="formData.adName" placeholder="请填写广告名称" clearable :maxlength="30"></Input>
            </FormItem>
            <FormItem label="商户名:" prop="shopId">
              <Select
                ref="shopSelect"
                v-model="formData.shopId"
                clearable
                filterable
                remote
                :remote-method="getAllShops"
                :loading="getShopsLoading"
              >
                <Option v-for="item in allShops" :value="item.id" :key="item.id">{{item.name}}</Option>
              </Select>
              <!-- <Input v-model="formData.shopId" placeholder="请填写商户名" clearable></Input> -->
            </FormItem>
            <FormItem label="厂商:" prop="vendor">
              <Select v-model="formData.vendor" multiple>
                <Option
                  v-for="item in vendorOptions"
                  :value="item.value"
                  :key="item.value"
                >{{ item.label }}</Option>
              </Select>
            </FormItem>
            <FormItem label="链接:" prop="url">
              <Input v-model="formData.url" placeholder="请填写链接" clearable></Input>
            </FormItem>
            <FormItem label="单价:" prop="price" class="star">
              <Input v-model="formData.price" placeholder="请填写单价" clearable>
                <span slot="append">元</span>
              </Input>
            </FormItem>
          </Form>
        </div>
      </Card>
    </div>
    <div class="adStripBtn">
      <Button @click="cancel" style="margin-right:20px;">取消</Button>
      <Button type="primary" @click="formSubmit('adStripCom')" v-if="showAccess('推广计划_新建广告_按条_提交审核')">提交审核</Button>
    </div>
  </div>
</template>

<script>
import axios from "@/libs/api.request";
import hasShowAccess from "@/libs/hasShowAccess.js";

export default {
  name: "adStripCom",
  props: ["customerId", "planId"],
  components: {},
  data() {
    const validPricePass = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请填写单价！"));
      } else if (isNaN(value)) {
        callback(new Error("单价必须为数字！"));
      }
      // if (value < 0 || value > 100) {
      //   callback(new Error("单价范围 0 ~ 100"));
      // }
      if (!/^(([^0-][0-9]{0,7}|0)\.([0-9]{1,4})$)|^([^0-]([0-9]{0,7})?|0)$/.test(value)) {
          callback(new Error('单价只支持小数点前最多8位，小数点后最多4位'));
      }
      callback();
    };
    const validVendorPass = (rule, value, callback) => {
      if (!value.length) {
        callback(new Error("厂商必选一个"));
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
    return {
      getShopsLoading: false,
      formData: {
        adName: "",
        shopId: "",
        vendor: [],
        url: "",
        price: ""
      },
      allShops: [],
      ruleValidate: {
        url: [
          {
            required: true,
            validator: validUrlPass,
            trigger: "blur"
          }
        ],
        adName: [
          {
            required: true,
            message: "广告名称不能为空",
            trigger: "blur"
          },
          {
            type: "string",
            max: 30,
            message: "广告名称不能超过30个字符",
            trigger: "blur"
          }
        ],
        shopId: [
          {
            required: true,
            message: "商户名不能为空",
            trigger: "change"
          }
        ],
        price: [
          {
            required: true,
            validator: validPricePass,
            trigger: "blur"
          }
        ],
        vendor: [
          {
            required: true,
            validator: validVendorPass,
            trigger: "change"
          }
        ]
      },
      vendorOptions: [
        { value: "5", label: "VIVO" },
        { value: "1", label: "OPPO" },
        { value: "2", label: "金立" },
        { value: "3", label: "乐视" },
        { value: "4", label: "ZUK" },
        { value: "9", label: "NEX3" },
        { value: "6", label: "一加" }
      ]
    };
  },
  computed: {
     showAccess() {
      return el => {
        return hasShowAccess(el);
      };
    },
  },
  methods: {
    shopNameComputed(shopId) {
      let shopName = "";
      this.allShops.forEach(item => {
        if (item.id == shopId) {
          shopName = item.name;
        }
      });
      return shopName;
    },
    formSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          let { adName, shopId, vendor, url, price } = this.formData;
          let params = {
            ad_name: adName,
            shop_info: [
              { shop_id: shopId, shop_name: this.shopNameComputed(shopId) }
            ],
            custom_id: this.customerId,
            ad_plan_id: this.planId,
            price,
            url,
            company_id: vendor
          };
          axios
            .request({
              url: "/ad/line/management/add",
              method: "post",
              data: params
            })
            .then(res => {
              if (res.data.code == 0) {
                this.$Message.success("创建成功!");
                this.$router.push({
                  name: "AdAllList",
                  params: { strip: true }
                });
              } else {
                this.$Message.error(res.data.msg);
              }
            })
            .catch(err => {
              this.$Message.error("请求失败，" + err + "，请稍后再试！");
            });
        } else {
          // this.$Message.error("请填写正确数据!");
        }
      });
    },
    cancel() {
      this.$router.back();
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
    }
  },
  created() {
  }
};
</script>

<style lang="less" scoped>
.adStripCom {
  padding: 0 0 40px;
}
.adStrip {
  width: 100%;
}
.adStripBtn {
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
