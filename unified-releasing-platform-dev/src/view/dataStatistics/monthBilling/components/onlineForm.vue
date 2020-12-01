<template>
  <div>
    <Form :model="formItem" :label-width="80" :inline="true">
      <FormItem label="上线日期:">
        <Date-picker
          type="date"
          format="yyyy-MM-dd"
          placeholder="请选择日期"
          v-model="formItem.yyyymm"
          @on-change="searchData(true)"
          transfer
        ></Date-picker>
      </FormItem>
      <FormItem label="客户名称:">
        <!-- <Select
          ref="customSelect"
          v-model="formItem.customName"
          placeholder="客户名称"
          @on-change="customSelectChange"
          filterable
          clearable
          remote
          :remote-method="getAllCustomUserName"
          :loading="getCustomLoading"
        >
          <Option
            v-for="(item,index) in allCustomUserName"
            :value="item.name"
            :key="index"
          >{{item.name}}</Option>
          
        </Select>-->
        <Input
          v-model="formItem.customName"
          placeholder="客户名称"
          @on-enter="searchData(true)"
          clearable
        />
      </FormItem>
      <FormItem label="商户名称:">
        <Input
          v-model="formItem.shopName"
          placeholder="商户名称"
          @on-enter="searchData(true)"
          clearable
        />
        <!-- <Select
          ref="shopSelect"
          v-model="formItem.shopName"
          placeholder="商户名称"
          @on-change="shopSelectChange"
          filterable
          clearable
          remote
          :remote-method="getAllShops"
          :loading="getShopsLoading"
        >
          <Option v-for="(item,index) in allShops" :value="item.name" :key="index">{{item.name}}</Option>
        </Select>-->
      </FormItem>
      <FormItem :label-width="30">
        <Button type="primary" style="margin-left:10px" @click="searchData(true)">查询</Button>
        <Button
          type="primary"
          style="margin-left: 10px"
          @click="addDataModal = true"
          v-if="showAccess('数据统计_包月计费表_在线表_新增')"
        >新增</Button>
        <Button
          type="primary"
          style="margin-left: 10px"
          @click="importModal = true"
          v-if="showAccess('数据统计_包月计费表_在线表_批量导入')"
        >批量导入</Button>
        <Button
          type="primary"
          style="margin-left: 10px"
          @click="exportBatch"
          v-if="showAccess('数据统计_包月计费表_在线表_批量导出')"
        >批量导出</Button>
      </FormItem>
    </Form>
    <div>
      <Table
        border
        :columns="columns"
        :data="rowData"
        :loading="listLoading"
        style="overflow-x:scroll;"
      >
        <!-- <template slot-scope="{ row, index }" slot="reportTime">
          <span v-html="formatDateComputed(row.createTime)"></span>
        </template>-->
      </Table>
      <Page
        :total="totalCount"
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
    <Modal
      title="新增"
      v-model="addDataModal"
      :mask-closable="false"
      width="450"
      :styles="{top:'80px'}"
      @on-visible-change="closeAddDataModal"
    >
      <Form
        :model="addForm"
        :label-width="80"
        :rules="addRuleValidate"
        style="padding-left:10px;"
        ref="addForm"
      >
        <FormItem label="客户名称:" prop="customName">
          <Select
            ref="customSelect"
            v-model="addForm.customName"
            placeholder="客户名称"
            filterable
            clearable
            remote
            :remote-method="getAllCustomUserName"
            :loading="getCustomLoading"
            style="width:300px;"
          >
            <Option
              v-for="(item,index) in allCustomUserName"
              :value="item.name"
              :key="index"
            >{{item.name}}</Option>
          </Select>
        </FormItem>
        <FormItem label="商户名称:" prop="shopName">
          <Select
            ref="shopSelect"
            v-model="addForm.shopName"
            placeholder="商户名称"
            filterable
            clearable
            remote
            style="width:300px;"
            :remote-method="getAllShops"
            :loading="getShopsLoading"
          >
            <Option v-for="(item,index) in allShops" :value="item.name" :key="index">{{item.name}}</Option>
          </Select>
        </FormItem>
        <FormItem label="合作内容:" prop="cooperationContent">
          <CheckboxGroup v-model="addForm.cooperationContent">
            <Checkbox label="品宣认证">品宣认证</Checkbox>
            <Checkbox label="短信菜单">短信菜单</Checkbox>
            <Checkbox label="下一步按钮">下一步按钮</Checkbox>
            <Checkbox label="卡片定制">卡片定制</Checkbox>
          </CheckboxGroup>
        </FormItem>
        <FormItem label="上线日期:" prop="onlineTime">
          <Date-picker
            type="date"
            format="yyyy-MM-dd"
            placeholder="请选择上线日期"
            v-model="addForm.onlineTime"
            style="width:300px;"
            @on-change="onlineTimeChange"
            transfer
          ></Date-picker>
        </FormItem>
        <FormItem label="下线日期:" prop="offlineTime">
          <Date-picker
            type="date"
            :options="pickerOptions"
            format="yyyy-MM-dd"
            placeholder="请选择下线日期(默认为上线日期的一年后)"
            v-model="addForm.offlineTime"
            style="width:300px;"
            transfer
          ></Date-picker>
        </FormItem>
        <FormItem label="价格:" prop="price">
          <Input clearable v-model="addForm.price" placeholder="价格" style="width:300px">
            <span slot="append">元</span>
          </Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button style="margin-left:10px;" @click="addDataModal = false">取消</Button>
        <Button type="primary" style="margin-left:10px;" @click="handleSubmit">确定</Button>
      </div>
    </Modal>
    <Modal
      title="批量导入"
      v-model="importModal"
      :mask-closable="false"
      @on-visible-change="importBatchImportClose"
    >
      <div class="importContent">
        <Upload
          ref="uploadBatch"
          action="/adMonthly/import"
          accept=".xls, .xlsx"
          :headers="headers"
          :show-upload-list="false"
          :before-upload="beforeUpload"
          :on-success="uploadSuccess"
          :on-error="uploadError"
        >
          <Button>选择文件</Button>
        </Upload>
        <a :href="onloadUrl+'包月批量导入模板.xlsx'" download="包月批量导入模板.xlsx">
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
        <Button @click="importModal = false" :disabled="uploadLoading">取消</Button>
      </div>
    </Modal>
    <Modal title="查看结果" v-model="resultModal" :mask-closable="false">
      <div
        style="font-size:14px;"
      >成功导入{{importResult.success.length}}条,失败{{importResult.error.length}}条</div>
      <div key="successList">
        <Divider>成功数据</Divider>
        <Tag color="green" v-for="(item,index) in importResult.success" :key="index">{{item}}</Tag>
      </div>
      <div key="errList">
        <Divider>失败数据</Divider>
        <Tag color="red" v-for="(item,index) in importResult.error" :key="index">{{item}}</Tag>
      </div>
    </Modal>
  </div>
</template>
<script>
import axios from "@/libs/api.request";
import { datefmt } from "@/utils/dateFormat";
import { getToken, uuid } from "@/libs/util";

// import config from "./config.js";
import moment from "moment";
import hasShowAccess from "@/libs/hasShowAccess.js";
import config from "../options/columns";
moment.locale("zh-cn");
export default {
  name: "onlineForm",
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
      if (!/^\d{0,8}(\.\d{0,4})?$/.test(value)) {
        callback(new Error("单价只支持小数点前最多8位，小数点后最多4位"));
      }
      callback();
    };

    return {
      resultModal: false,
      importResult: {
        success: [],
        error: []
      },
      pickerOptions: {
        disabledDate(time) {
          return false;
        }
      },
      uploadLoading: false,
      importModal: false,
      onloadUrl:
        process.env.NODE_ENV === "production" ? "/page/static/" : "/static/",
      headers: {
        "X-Client-Token": getToken(),
        // "X-Client-Token":
          // "eyJpc0VuYWJsZSI6MSwibGFzdExvZ2luIjoxNTgxOTA1MjA4NDM2LCJuaWNrTmFtZSI6InlvdWJpbmdrdW4iLCJ0b2tlbiI6IjYwX3lvdWJpbmdrdW5fMTU4MTkwNTIwODQzNiIsInVzZXJFbWFpbCI6InlvdWJpbmdrdW5AdGVkZHltb2JpbGUuY24iLCJ1c2VySWQiOjYwLCJ1c2VyTmFtZSI6InlvdWJpbmdrdW4ifQ==",
        "X-Client-Sdk": 2,
        "X-App-Id": "sdt_back_manager",
        "X-App-Version": 1,
        "X-Client-Time": Date.now(),
        "X-Request-Id": uuid(),
        "X-Request-Type": "",
        "X-Tdbear-Id": "",
        "X-Client-Unique": ""
      },
      addForm: {
        customName: "",
        shopName: "",
        onlineTime: "",
        offlineTime: "",
        cooperationContent: [],
        price: ""
      },
      rowData: [],
      listLoading: false,
      totalCount: 0,
      columns: config.onlineColumns,
      formItem: {
        yyyymm: "",
        customName: "",
        shopName: "",
        pageIndex: 1,
        pageSize: 10
      },
      getShopsLoading: false,
      getCustomLoading: false,
      allShops: [],
      allCustomUserName: [],
      addDataModal: false,
      addRuleValidate: {
        customName: [
          {
            required: true,
            message: "客户名称为必填项",
            trigger: "change"
          }
        ],
        shopName: [
          {
            required: true,
            message: "商户名称为必填项",
            trigger: "change"
          }
        ],
        onlineTime: [
          {
            required: true,
            type: "date",
            message: "请选择上线时间",
            trigger: "change"
          }
        ],
        cooperationContent: [
          {
            required: true,
            type: "array",
            min: 1,
            message: "至少选择一个合作内容",
            trigger: "change"
          }
        ],
        price: [
          {
            required: true,
            validator: validPricePass,
            trigger: "blur"
          }
        ]
      },
      reqFiles: {
        fileName: ""
      }
    };
  },
  computed: {
    showAccess() {
      return el => {
        return hasShowAccess(el);
      };
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
  filters: {},
  mounted() {
    this.searchData(true);
  },
  methods: {
    onlineTimeChange(day) {
      this.addForm.offlineTime = "";
      let _this = this;
      this.pickerOptions = {
        disabledDate(time) {
          return _this.addForm.onlineTime
            ? time.getTime() < _this.addForm.onlineTime.getTime()
            : false;
        }
      };
    },
    beforeUpload(file) {
      this.reqFiles.files = file;
      this.reqFiles.fileName = file.name;
      return false;
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
    fileTagClose() {
      this.reqFiles = {
        files: null,
        fileName: ""
      };
    },
    importBatchImportClose() {
      this.uploadLoading = false;
      this.reqFiles.files = null;
      this.reqFiles.fileName = "";
    },
    uploadSuccess(res) {
      if (res.code === 0) {
        this.$Message.success("导入成功");
        this.uploadLoading = false;
        this.reqFiles.files = null;
        this.reqFiles.fileName = "";
        this.importModal = false;
        this.resultModal = true;
        this.importResult.success = res.data.successList;
        let arr = [];
        for (let key in res.data.errorList) {
          let str = key + ":" + res.data.errorList[key];
          arr.push(str);
        }
        this.importResult.error = arr;
        setTimeout(() => {
          this.searchData(true);
        }, 300);
      } else {
        this.$Message.err(res.mag);
      }
    },
    uploadError(err) {
      this.$Message.success("网络错误" + err);
      this.uploadLoading = false;
    },
    formatDate(value) {
      if (value) {
        return moment(value).format("YYYY-MM-DD");
      } else {
        return "";
      }
    },
    searchData(isfirst) {
      this.listLoading = true;
      if (isfirst) {
        this.formItem.pageIndex = 1;
      }
      let yyyymm =
        typeof this.formItem.yyyymm == "string"
          ? this.formItem.yyyymm.split("-").join("")
          : this.formatDate(this.formItem.yyyymm)
              .split("-")
              .join("");
      let postData = {
        onlineTime: yyyymm,
        customName: this.formItem.customName,
        shopName: this.formItem.shopName,
        pageSize: this.formItem.pageSize,
        pageIndex: this.formItem.pageIndex - 1
      };

      axios
        .request({
          url: "/adMonthly/onlineList",
          method: "post",
          data: postData
        })
        .then(d => {
          if (d.data.code == 0) {
            this.rowData = d.data.data.data;
            this.totalCount = d.data.data.total;
          }
          this.listLoading = false;
        })
        .catch(() => {
          this.listLoading = false;
        });
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
    getAllCustomUserName(query) {
      this.getCustomLoading = true;
      let param = { name: query };
      axios
        .request({
          url: "/ad/customer/searchByCustomUserName",
          method: "post",
          data: param
        })
        .then(res => {
          if (res.data.code === 0) {
            this.allCustomUserName = res.data.data;
            this.getCustomLoading = false;
          } else {
            this.$Message.error("请求异常，请稍后再试！");
          }
        })
        .catch(err => {
          this.$Message.error("请求失败，" + err + "，请稍后再试！");
          this.getCustomLoading = false;
        });
    },
    shopSelectChange() {
      this.searchData(true);
    },
    customSelectChange() {
      this.searchData(true);
    },
    handleSubmit() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          let postData = JSON.parse(JSON.stringify(this.addForm));
          postData.cooperationContent = postData.cooperationContent.join(",");
          postData.onlineTime = moment(postData.onlineTime).format(
            "YYYY-MM-DD"
          );
          postData.offlineTime
            ? (postData.offlineTime = moment(postData.offlineTime).format(
                "YYYY-MM-DD"
              ))
            : (postData.offlineTime = moment(postData.onlineTime)
                .add({ years: 1 })
                .format("YYYY-MM-DD"));

          axios
            .request({
              url: "/adMonthly/add",
              method: "post",
              data: postData
            })
            .then(d => {
              if (d.data.code == 0) {
                this.$Message.success("添加成功");
                this.searchData(true);
                this.addDataModal = false;
              } else {
                this.$Message.error(d.data.msg);
              }
            })
            .catch(err => {
              this.$Message.error("网络错误" + err);
            });
        }
      });
    },

    closeAddDataModal(flag) {
      if (!flag) {
        this.$refs.addForm.resetFields();
      }
    },
    exportBatch() {
      let yyyymm =
        typeof this.formItem.yyyymm == "string"
          ? this.formItem.yyyymm.split("-").join("")
          : this.formatDate(this.formItem.yyyymm)
              .split("-")
              .join("");
      let postData = {
        onlineTime: yyyymm,
        customName: this.formItem.customName,
        shopName: this.formItem.shopName
      };
      axios
        .request({
          url: "/adMonthly/onlineList/export",
          method: "post",
          responseType: "blob",
          data: postData
        })
        .then(res => {
          if (!res) {
            this.$Message.error("导出失败");
            return;
          }
          var elink = document.createElement("a");
          elink.download = "在线表" + yyyymm + ".xls";
          elink.style.display = "none";
          var blob = new Blob([res.data], { type: "application/vnd.ms-excel" });
          elink.href = URL.createObjectURL(blob);
          document.body.appendChild(elink);
          elink.click();
          document.body.removeChild(elink);
        })
        .catch(err => {
          this.$Message.error("网络错误" + err);
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

