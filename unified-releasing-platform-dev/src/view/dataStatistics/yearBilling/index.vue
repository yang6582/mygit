<template>
  <div>
    <Form :model="formItem" :label-width="80" :inline="true" style="">
      <FormItem label="上线日期:">
        <Date-picker 
            :value="formItem.time"
            format="yyyy-MM-dd"
            type="daterange"
            placeholder="选择日期"
            style="width: 180px"
            @on-change="changeReportTime"
        ></Date-picker>
      </FormItem>
      <FormItem label="客户名称:">
        <Input
          v-model.trim="formItem.customerName"
          placeholder="客户名称"
          @on-enter="searchData(true)"
          clearable
        />
      </FormItem>
      <FormItem label="商户名称:">
        <Input
          v-model.trim="formItem.shopName"
          placeholder="商户名称"
          @on-enter="searchData(true)"
          clearable
        />
      </FormItem>
      <FormItem :label-width="30">
        <Button type="primary" @click="searchData(true)" style="margin-left:10px">查询</Button>
        <Button type="primary" @click="downloadReport" style="margin-left: 10px" v-if="showAccess('数据统计_包年计费表_批量导出')">批量导出</Button>
        <Button type="primary" @click="batchImportModal = true" style="margin-left:10px" v-if="showAccess('数据统计_包年计费表_批量导入')">批量导入</Button>
        <Button type="primary" @click="addNewHandler" style="margin-left:10px" v-if="showAccess('数据统计_包年计费表_新增')">新增</Button>
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
        <template slot-scope="{row, index}" slot="onlineDate">
            <div>{{formatDate(row.onlineDate)}}</div>
        </template>
        <template slot-scope="{row, index}" slot="offlineDate">
            <div>{{formatDate(row.offlineDate)}}</div>
        </template>
        <template slot-scope="{row, index}" slot="operateTime">
            <div>{{row.operateTime | formatDateToMin}}</div>
        </template>
        <template slot-scope="{row, index}" slot="status">
            <div>{{row.status == 1 ? '在线' : '下线'}}</div>
        </template>
        <template slot-scope="{row, index}" slot="content">
            <div>{{formatContent(row.content)}}</div>
        </template>
      </Table>
      <Page
        :total="total_count"
        size="small"
        :current="formItem.page"
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
      title="批量导入"
      v-model="batchImportModal"
      :mask-closable="false"
      @on-visible-change="importBatchImportClose"
    >
      <div class="importContent">
        <Upload
          action="/statistic/yearpackage/import"
          accept=".xls, .xlsx"
          ref="uploadBatch"
          :headers="headers"
          :show-upload-list="false"
          :before-upload="beforeUploadImport"
          :on-success="uploadSuccessImport"
          :on-error="uploadErrorImport"
        >
          <Button>选择文件</Button>
        </Upload>
        <a
          :href="onloadUrl + '包年计费表导入模板.xlsx'"
          download="包年计费表导入模板.xlsx"
        >
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
          v-if="reqFilesBatch.fileName"
          @on-close="fileTagCloseBatch"
        >{{reqFilesBatch.fileName}}</Tag>
      </div>
      <div slot="footer">
        <Button type="primary" @click="checkResult" v-if="uploadResponse.result_excel">查看结果</Button>
        <Button
          type="primary"
          @click="handleUploadBatch"
          :loading="uploadLoadingImport"
          style
        >{{uploadLoadingImport ? '导入中' :'导入文件'}}</Button>
        <Button @click="batchImportModal = false" :disabled="uploadLoadingImport">取消</Button>
      </div>
    </Modal>
    <Modal
      title="新增"
      v-model="addModel" width="600"
      :mask-closable="false"
      @on-visible-change="closeAddModal"
    >
    <div style="padding:0 40px 0 0;">
        <Form ref="addForm" :model="addForm" :rules="addValidate" :label-width="110">
          <FormItem label="客户名称：" prop="customerName">            
            <Select
                ref="shopSelect"
                v-model="addForm.customerName"
                filterable
                clearable
                remote
                placeholder="请输入客户名称"
                :remote-method="remoteSearchCustom"
                :loading="loadingCustoms"
                >
                <Option v-for="(option, index) in customList" :value="option.custom_username" :key="index" :label="option.custom_username">{{option.custom_username}}</Option>
            </Select>
        </FormItem>
          <FormItem label="商户名称：" prop="shopName">
            <Select
                ref="shopSelect"
                v-model="addForm.shopName"
                filterable
                clearable
                remote
                placeholder="请输入商户名称"
                :remote-method="remoteSearchShop"
                :loading="loadingShops"
                >
                <!-- @on-query-change="compshopChange"
                @on-change="changeSelectCustom" -->
                <Option v-for="(option, index) in shopList" :value="option.name" :key="index" :label="option.name">{{option.name}}</Option>
            </Select>
          </FormItem>
          <FormItem label="合作内容：" prop="contents">
            <CheckboxGroup v-model="addForm.contents">
                <Checkbox label="1">品宣认证</Checkbox>
                <Checkbox label="2">短信菜单</Checkbox>
                <Checkbox label="3">下一步按钮</Checkbox>
                <Checkbox label="4">卡片定制</Checkbox>
            </CheckboxGroup>
          </FormItem>
          <FormItem label="上线日期：" prop="onlineDate" >
            <DatePicker v-model="addForm.onlineDate" type="date" format="yyyy-MM-dd" placeholder="请选择上线日期" style="width: 418px"
              @on-change="changeSelectTime"></DatePicker>
          </FormItem>
          <FormItem label="下线日期：" prop="offlineDate" >
            <DatePicker 
                v-model="addForm.offlineDate" 
                type="date" 
                format="yyyy-MM-dd" 
                placeholder="请选择下线日期" 
                style="width: 418px"
                :options="offlineDateOptions"
                @on-change="addForm.offlineDate=$event"
               >
            </DatePicker>
          </FormItem>
          <FormItem label="当前状态：" prop="status">
            <RadioGroup v-model="addForm.status">
              <Radio label="1">在线</Radio>
              <Radio label="0">下线</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="价格：" prop="price">
            <Input v-model="addForm.price" placeholder="请填写包月价格"><span slot="append">元</span></Input>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button type="primary" style="margin-left:10px;" @click="addSubmit('addForm')">确定</Button>
        <Button @click="addModel = false">取消</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import axios from "@/libs/api.request";
import { datefmt } from "@/utils/dateFormat";
import config from "./config.js";
import moment from "moment";
import hasShowAccess from "@/libs/hasShowAccess.js";
import { getToken, uuid } from "@/libs/util";

moment.locale("zh-cn");

export default {
  name: "yearBilling",
  components: {
  },
  data() {
    const validatePrice = function(type){
        return (rule, value, callback) => {
            if (!value) {
                return callback(new Error('价格为必填项'));
            }
            if (!/^(([^0-][0-9]{0,7}|0)\.([0-9]{1,4})$)|^([^0-]([0-9]{0,7})?|0)$/.test(value)) {
                callback(new Error(type + '支持小数点前8位，后4位'));
            } else {
                callback();
            }
        }
    };
    const validateContent = (rule, value, callback) => {
        if (value.length) {
            return callback();
        } else {
            callback(new Error('合作内容为必填项'));
        }
    };
    const validateTime = (rule, value, callback) => {
        if (value) {
            return callback();
        } else {
            callback(new Error('日期为必填项'));
        }
    };
    const dateNow = new Date()
    return {
      formItem: {
        startDate: this.formatDate(dateNow - 1000 * 60 * 60 * 24 * 30),
        endDate: this.formatDate(dateNow - 1000 * 60 * 60 * 24 * 1),
        customerName: '',
        shopName: '',
        time: [this.formatDate(dateNow - 1000 * 60 * 60 * 24 * 30), this.formatDate(dateNow - 1000 * 60 * 60 * 24 * 1)],
        pageSize: 10,
        page: 1
      },
      total_count: 0,
      dialogVisible: false,
      columns: config.yearOptTable,
      rowData: [],
      listLoading: false,
      addModel: false,
      addForm: {
        customerName: '',
        shopName: '',
        contents: [],
        onlineDate: '',
        offlineDate: '',
        price: '',
        status: '1'
      },
      addValidate: {
        onlineDate: [{
            required: true,
            trigger: 'blur',
            message: "日期为必填项"
        }],
        offlineDate:  [{
            required: true,
            trigger: 'blur',
            // message: "日期为必填项"
            validator: validateTime
        }],
        contents: [{
            required: true,
            trigger: 'change',
            validator: validateContent
        }],
        customerName: [{
            required: true,
            message: "客户名称为必填项",
            trigger: "change"
        }],
        shopName: [{
            required: true,
            trigger: 'change',
            message: "商户名称为必填项"
        }],
        price: [{
            required: true,
            trigger: 'change',
            validator: validatePrice('包年价格')
        }],
        status: [{
            required: true,
            trigger: 'blur',
            message: "当前状态为必填项"
        }],
      },
      loadingCustoms: false,
      loadingShops: false,
      customList: [],
      shopList: [],
      loadingAds: false,
      adsList: [],
      batchImportModal: false,
      reqFilesBatch: {
        files: null,
        fileName: ""
      },
      headers: {
        "X-Client-Token": getToken(),
        // "X-Client-Token":
        //   "eyJpc0VuYWJsZSI6MSwibGFzdExvZ2luIjoxNTgyODkzNjgwODczLCJuaWNrTmFtZSI6Imxpc2hhbnNoYW4iLCJ0b2tlbiI6IjgwX2xpc2hhbnNoYW5fMTU4Mjg5MzY4MDg3MyIsInVzZXJFbWFpbCI6Imxpc2hhbnNoYW5AdGVkZHltb2JpbGUuY24iLCJ1c2VySWQiOjgwLCJ1c2VyTmFtZSI6Imxpc2hhbnNoYW4ifQ==",

        "X-Client-Sdk": 2,
        "X-App-Id": "sdt_back_manager",
        "X-App-Version": 1,
        "X-Client-Time": Date.now(),
        "X-Request-Id": uuid(),
        "X-Request-Type": "",
        "X-Tdbear-Id": "",
        "X-Client-Unique": ""
      },
      uploadSuccessBatchMsg: "",
      uploadSuccessBatchMsgNum: "",
      uploadSuccessBatchList: [],
      uploadResponse: {
        result_excel: ""
      },
      uploadLoadingImport: false,
      onloadUrl:
        process.env.NODE_ENV === "production" ? "/page/static/" : "/static/",
      addContents: {
        '1': '品宣认证',
        '2': '短信菜单',
        '3': '下一步按钮',
        '4': '卡片定制'
      }
    };
  },
  created() {
    this.searchData(true)
  },
  filters: {
    formatDateToMin(value) {
      return moment(value).format("YYYY-MM-DD HH:mm:ss");
    }
  },
  computed: {
    showAccess() {
        return el => {
            return hasShowAccess(el);
        };
    },
    offlineDateOptions() {
        let _this = this
        return {
            disabledDate (date) {
                return date && date.valueOf() <= Date.parse(_this.addForm.onlineDate) - 1000 * 60 * 60 * 24 * 1;
            }
        }
    }
  },
  methods: {
    formatDate(value) {
      if (value) {
        return moment(value).format("YYYY-MM-DD");
      } else {
        return "";
      }
    },
    formatContent(content) {
        let copyContent = content.split(',')
        return copyContent.reduce((cur, next) => {
            cur.push(this.addContents[next])
            return cur
        }, []).join(',')
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
    searchData(isfirst) {
      this.listLoading = true;
      if (isfirst) {
        this.formItem.page = 1;
      }
      let postData = this.pick(this.formItem, ['startDate', 'endDate', 'customerName', 'shopName', 'page', 'pageSize'])
      let _this = this;
      axios
        .request({
          url: "statistic/yearpackage/find",
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
    addNewHandler() {
      this.addModel = true
    },
    downloadReport() {
      let postData = this.pick(this.formItem, 
        ['startDate', 'endDate', 'customerName', 'shopName', 'page', 'pageSize'])
      axios
        .request({
          url: "statistic/yearpackage/export",
          method: "post",
          data: postData,
          responseType: 'blob'
        }).then(res => {
          if (res.status == 200) {
              const content = res.data;
              const blob = new Blob([content]);
              const fileName = "包年计费表导出" + ".xls";
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
      this.formItem.pageSize = val;
      this.searchData();
    },
    closeAddModal(flag) {
      if (!flag) {
        this.$refs.addForm.resetFields()
      }
    },
    changeSelectTime(time) {
        this.addForm.onlineDate = time
        let copyTime = time.split('-')
        copyTime[0] = Number(copyTime[0]) + 1
        this.addForm.offlineDate = copyTime.join('-')
    },
    remoteSearchCustom(query) {
        if (!query) {
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
                if (!data.length) {
                    _this.$Message.warning('请填写正确的客户名称！')
                } else {
                    _this.customList = data ? data : [] 
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
    remoteSearchShop(query) {
        if (!query) {
            return
        }
        this.loadingShops = true
        let _this = this
        axios.request({
            url: 'ad/shops/findByName',
            method: "post",
            data: {shopName: query}
        })
        .then(res => {
            if (res.data.code === 0) {
                let data = res.data.data
                if (!data.length) {
                    _this.$Message.warning('请填写正确的商户名称！')
                } else {
                    _this.shopList = data ? data : [] 
                }
            } else {
                this.$Message.error(res.data.msg)
            }
            _this.loadingShops = false
        })
        .catch(err => {
            this.$Message.error("请求异常，请稍后再试！")
            this.loadingShops = false
        });
    },
    remoteSearchAds(query) {
        if (!query) {
            return
        }
        let _this = this
        this.loadingAds = true
    },
    addSubmit(name) {
      let _this = this
        this.$refs[name].validate(valid => {
            if (valid) {
                let param = {}
                let url = 'statistic/yearpackage/add'
                axios
                  .request({
                    url,
                    method: "post",
                    data: _this.addForm
                  })
                  .then(d => {
                    if (d.data.code == 0) {
                      _this.addModel = false
                      _this.searchData(true)
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
    importBatchImportClose(type) {
      if (!type) {
        this.reqFilesBatch = {
          files: null,
          fileName: ""
        };
        this.uploadResponse.result_excel = "";
      }
    },
    beforeUploadImport(file) {
      this.reqFilesBatch.files = file;
      this.reqFilesBatch.fileName = file.name;
      return false;
    },
    uploadSuccessImport(response, file, fileList) {
        if (response.code == 0) {
            this.requestUploadAgain(response.data);
            // }
            // //this.uploadSuccessBatchList = response.data.data.error_list;
            this.reqFilesBatch = {
                files: null,
                fileName: ""
            };
        } else {
            this.$Message.error(response.msg);
            this.uploadLoadingImport = false;
            this.batchImportModal = false;
        }
    },
    requestUploadAgain(taskId) {
      axios
        .request({
          url: "/statistic/yearpackage/getImportResult",
          method: "post",
          data: {
            taskId: taskId
          }
        })
        .then(res => {
          if (res.data.code === 0) {
            if (res.data.data.status === 1) {
              this.requestUploadAgain(res.data.data.taskId);
            } else if (res.data.data.status === 2) {
              this.$Message.success("上传成功,请查看结果");
              this.uploadResponse.result_excel = res.data.data.data;
              this.uploadLoadingImport = false;
            } else if (res.data.data.status === 0) {
              this.uploadLoadingImport = false;

              this.$Message.error("操作失败,服务器错误");
            }
          } else {
            this.$Message.error(res.data.msg);
          }
        })
        .catch(err => {
          this.$Message.error("网络错误" + err);
        });
    },
    uploadErrorImport(error, file, fileList) {
      this.uploadLoadingImport = false;
      this.$Message.error("导入失败");
    },
    fileTagCloseBatch() {
      this.reqFilesBatch = {
        files: null,
        fileName: ""
      };
      this.uploadResponse.result_excel = "";
    },
    handleUploadBatch() {
      if (this.reqFilesBatch.files == null) {
        this.$Message.error("请选择导入文件！");
        return;
      } else {
        this.uploadLoadingImport = true;
        this.$refs.uploadBatch.post(this.reqFilesBatch.files);
      }
    },
    checkResult() {
      axios
        .request({
          url: this.uploadResponse.result_excel,
          method: "post",
          headers: {
            "Content-Type": "application/json"
          },
          responseType: "blob"
        })
        .then(res => {
          const link = document.createElement("a");
          let blob = new Blob([res.data], { type: "application/vnd.ms-excel" });
          link.style.display = "none";
          link.href = URL.createObjectURL(blob);
          link.setAttribute("download", "包年导入结果.xlsx");
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        })
        .catch(err => {
          this.$Message.error("导出失败");
        });
    },
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
// .ivu-btn-primary .margin-15 {
//   margin: 0 10px;
// }

// /deep/ .subCol ul li {
//   list-style: none;
//   text-align: center;
//   border-bottom: 1px solid #e8eaec;
//   overflow: hidden;
// }

// /deep/ .subCol ul li:last-child {
//   border-bottom: none;
// }

// /deep/ .ivu-table-cell {
//   padding: 0px;
// }

// .layout-table {
//   padding-right: 10px;
//   //padding-top: 20px;
// }
</style>

