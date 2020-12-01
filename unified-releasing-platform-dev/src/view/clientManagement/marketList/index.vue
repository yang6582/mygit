<template>
  <div>
    <Form
      :model="formItem"
      :label-width="80"
      :inline="true"
      style="margin-top: 20px"
      ref="formItem"
    >
      <FormItem label="销售人员:" prop="fullUrl">
        <Select
          v-model="formItem.market"
          style="width:200px"
          @on-change="search(true)"
          filterable
          clearable
        >
          <!-- <Option :value="0">全部</Option> -->
          <Option v-for="item in marketList" :value="item.id" :key="item.id">{{ item.name }}</Option>
        </Select>
      </FormItem>
      <FormItem label="消费时间:" prop="submitTime">
        <Date-picker
          :value="formItem.submitTime"
          format="yyyy-MM-dd"
          @on-change="submitTimeChange"
          type="daterange"
          placement="bottom-end"
          placeholder="选择日期"
          style="width: 180px"
          :options="pickerOptions"
          transfer
        ></Date-picker>
      </FormItem>
      <FormItem :label-width="30">
        <Button type="primary" style="margin-left:10px" @click="search(true)">查询</Button>
        <Button type="primary" style="margin-left:10px" @click="exportSearch">导出</Button>
        <Button
          type="primary"
          style="margin-left:10px"
          @click="add"
          v-if="showAccess('客户管理_销售列表_新建销售')"
        >新建销售</Button>
        <Button
          type="primary"
          style="margin-left:10px"
          @click="delMarketModal = true"
          v-if="showAccess('客户管理_销售列表_删除销售')"
        >删除销售</Button>
      </FormItem>
    </Form>
    <div>
      <Table
        border
        :columns="columns"
        :data="showRowData"
        align="center"
        key="rowData"
        :loading="rowDataLoading"
      ></Table>
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
      title="新增销售"
      :mask-closable="false"
      @on-visible-change="closeAddModal"
    >
      <div style="padding:0 40px 0 0;">
        <Form ref="addForm" :model="addForm" :rules="addRuleValidate" :label-width="110">
          <FormItem label="销售姓名:" prop="marketName">
            <Input v-model.trim="addForm.marketName" placeholder="请填写销售姓名" clearable></Input>
          </FormItem>
          <FormItem label="联系电话:" prop="phoneNumber">
            <Input v-model.trim="addForm.phoneNumber" placeholder="请填写联系电话" clearable></Input>
          </FormItem>
          <FormItem label="邮箱:" prop="email">
            <Input v-model.trim="addForm.email" placeholder="请填写邮箱" clearable></Input>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button @click="addModal = false">取消</Button>
        <Button type="primary" style="margin-left:10px;" @click="handleSubmit('addForm')">确定</Button>
      </div>
    </Modal>
    <Modal v-model="delMarketModal" title="删除销售" :mask-closable="false" width="360">
      <div style="padding:0 20px">
        <span style="margin-right:20px;">销售姓名:</span>
        <Select v-model="delMarketId" style="width:200px" filterable clearable>
          <Option v-for="item in marketList" :value="item.id" :key="item.id">{{ item.name }}</Option>
        </Select>
      </div>
      <div slot="footer">
        <Button @click="delMarketModal = false">取消</Button>
        <Button type="primary" style="margin-left:10px;" @click="delMarketSubmit">确定</Button>
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
  name: "marketList",
  components: {},
  data() {
    const validatePhone = (rule, value, callback) => {
      let reg = /^1[3456789]\d{9}$/;
      if (value == "" || (value && reg.test(value))) {
        callback();
      } else {
        callback(new Error("手机号码格式错误"));
      }
    };
    const validateEmail = (rule, value, callback) => {
      let reg = /^[A-Za-z0-9]+([_\.][A-Za-z0-9]+)*@([A-Za-z0-9\-]+\.)+[A-Za-z]{2,6}$/;
      if (value && reg.test(value)) {
        callback();
      } else if (value == "") {
        callback();
      } else {
        callback(new Error("邮箱格式错误!"));
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
      pickerOptions: {
        disabledDate(time) {
          return (
            time.getTime() > Date.now() - 1000 * 60 * 60 * 24 ||
            time.getTime() < 1581696001000
          );
        }
      },
      columns,
      onloadUrl:
        process.env.NODE_ENV === "production" ? "/page/static/" : "/static/",
      addModal: false,
      delMarketModal: false,
      marketList: [],
      formItem: {
        market: "",
        submitTime: [
          moment()
            .subtract(1, "days")
            .format("YYYYMMDD"),
          moment()
            .subtract(1, "days")
            .format("YYYYMMDD")
        ]
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
      delMarketId: "",
      rowData: [],
      showRowData: [],
      addForm: {
        marketName: "",
        phoneNumber: "",
        email: ""
      },
      addRuleValidate: {
        marketName: [
          {
            required: true,
            message: "销售名称为必填项",
            trigger: "blur"
          }
        ],
        phoneNumber: [{ validator: validatePhone, trigger: "blur" }],
        email: [{ validator: validateEmail, trigger: "blur" }]
      }
    };
  },
  computed: {
    showAccess() {
      return el => {
        return hasShowAccess(el);
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
    }
  },
  created() {
    this.search(true);
    this.getAllSaleInfo();
  },

  methods: {
    exportSearch() {
      // let url =
      //   location.href.indexOf("back-manager.teddymobile.net") > -1
      //     ? "http://back-manager.teddymobile.net"
      //     : "http://back-manager-test.teddymobile.net";
      // window.open(
      //   url +
      //     "/finance/exportCustomDataBySalesId?salesId=" +
      //     this.formItem.market +
      //     "&date0=" +
      //     this.formItem.submitTime[0] +
      //     "&date1=" +
      //     this.formItem.submitTime[1]
      // );
      axios
        .request({
          url: "/finance/exportCustomDataBySalesId",
          method: "get",
          params: {
            salesId: this.formItem.market,
            date0: this.formItem.submitTime[0],
            date1: this.formItem.submitTime[1]
          },
          responseType: "blob"
        })
        .then(res => {
          if (!res) {
            return;
          }
          var elink = document.createElement("a");
          elink.download =
            "销售列表" +
            this.formItem.submitTime[0] +
            "-" +
            this.formItem.submitTime[1] +
            ".xls";
          elink.style.display = "none";
          var blob = new Blob([res.data], { type: "application/vnd.ms-excel" });

          elink.href = URL.createObjectURL(blob);
          document.body.appendChild(elink);
          elink.click();
          document.body.removeChild(elink);
        })
        .catch(err => {
          this.$Message.error("导出失败"+err);
        });
    },
    submitTimeChange(data) {
      this.formItem.submitTime = data.map(item => {
        return item.split("-").join("");
      });
    },
    search(flag) {
      this.rowDataLoading = true;
      if (flag) {
        this.page.pageIndex = 1;
      }
      axios
        .request({
          url: "/finance/queryCustomDataBySalesId",
          method: "post",
          data: {
            // pageSize: this.page.pageSize,
            // pageIndex: this.page.pageIndex,
            salesId: this.formItem.market,
            date0: this.formItem.submitTime[0],
            date1: this.formItem.submitTime[1]
          }
        })
        .then(res => {
          if (res.data.code == 0) {
            this.rowData = res.data.data;
            this.page.totalCount = res.data.data.length;
            this.showRowData = this.rowData.slice(
              (this.page.pageIndex - 1) * this.page.pageSize,
              this.page.pageIndex * this.page.pageSize
            );
          } else {
            this.$Message.error(res.data.msg);
          }
          this.rowDataLoading = false;
        })
        .catch(err => {
          this.$Message.error("网络错误");
          this.rowDataLoading = false;
        });
    },
    pageChange(index) {
      this.page.pageIndex = index;
      this.showRowData = this.rowData.slice(
        (this.page.pageIndex - 1) * this.page.pageSize,
        this.page.pageIndex * this.page.pageSize
      );
    },
    pageSizeChange(size) {
      this.page.pageSize = size;
      this.page.pageIndex = 1;
      this.showRowData = this.rowData.slice(
        (this.page.pageIndex - 1) * this.page.pageSize,
        this.page.pageIndex * this.page.pageSize
      );
    },
    add() {
      this.addModal = true;
    },
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          let postData = {
            name: this.addForm.marketName,
            email: this.addForm.email,
            phone: this.addForm.phoneNumber
          };
          axios
            .request({
              url: "/ad/management/ads/addSalesmanInfo",
              method: "post",
              data: postData
            })
            .then(res => {
              if (res.data.code === 0) {
                this.$Message.success("添加成功");
                this.addModal = false;
                this.getAllSaleInfo();
                this.formItem = {
                  market: "",
                  submitTime: [
                    moment()
                      .subtract(1, "days")
                      .format("YYYYMMDD"),
                    moment()
                      .subtract(1, "days")
                      .format("YYYYMMDD")
                  ]
                };
                this.search(true);
              } else {
                this.$Message.error(res.data.msg);
              }
            })
            .catch(err => {
              this.$Message.error("请求异常，请稍后再试！");
            });
        }
      });
    },
    closeAddModal(flag) {
      if (!flag) {
        this.handleReset("addForm");
        this.addForm = {
          marketName: "",
          phoneNumber: "",
          email: ""
        };
      }
    },
    handleReset(name) {
      this.addForm = {
        code: "",
        name: "",
        urlDesc: "",
        url: ""
      };
      this.$refs.addForm.resetFields();
    },
    delMarketSubmit() {
      if (!this.delMarketId) {
        this.$Message.warning("请选择销售");
        return;
      }
      axios
        .request({
          url: "/ad/management/ads/delSaleInfo",
          method: "post",
          data: { id: this.delMarketId }
        })
        .then(res => {
          if (res.data.code === 0) {
            this.$Message.success("删除成功");
            this.delMarketModal = false;
            this.getAllSaleInfo();
            this.delMarketId = "";
            this.formItem = {
              market: "",
              submitTime: [
                moment()
                  .subtract(1, "days")
                  .format("YYYYMMDD"),
                moment()
                  .subtract(1, "days")
                  .format("YYYYMMDD")
              ]
            };
            this.search(true);
          } else {
            this.$Message.error(res.data.msg);
          }
        })
        .catch(err => {
          this.$Message.error("请求异常，请稍后再试！");
        });
    },
    getAllSaleInfo() {
      axios
        .request({
          url: "/ad/management/ads/getAllSaleInfo",
          method: "post"
        })
        .then(res => {
          if (res.data.code === 0) {
            this.marketList = res.data.data;
          } else {
            this.$Message.error(res.data.msg);
          }
        })
        .catch(err => {
          this.$Message.error("请求异常，请稍后再试！");
        });
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
