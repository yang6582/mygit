<template>
  <div>
    <Form :model="formItem" :label-width="80" :inline="true" style="margin-top: 20px">
      <FormItem label="商户名称:">
        <Input v-model="formItem.shopName" placeholder="商户名称" style="width: 180px" @on-enter="searchData(true)" clearable />
      </FormItem>
      <FormItem label="投诉日期:">
        <Date-picker 
            :value="formItem.complaintTime"
            format="yyyy-MM-dd"
            type="daterange"
            placeholder="选择日期"
            style="width: 180px"
            @on-change="dateTimeChange"
        ></Date-picker>
        </FormItem>
      <FormItem label="处理投诉人:">
        <Select
          v-model="formItem.optUser"
          style="width:180px"
          @on-change="searchData(true)"
          filterable
          clearable
        >
          <Option
            v-for="(item,key) in complainants"
            :value="item.userName"
            :key="key"
          >{{ item.userName }}</Option>
        </Select>
      </FormItem>
      <FormItem :label-width="30">
        <Button type="primary" style="margin-left:10px" @click="searchData(true)">查询</Button>
        <Button type="primary" style="margin-left:10px" v-if="showAccess('黑名单管理_黑名单_导出')" @click="exportPackageData">导出</Button>
        <Button type="primary" style="margin-left:10px" @click="addBlacklist = true" v-if="showAccess('黑名单管理_黑名单_新增')">新增</Button>
        <Button type="primary" style="margin-left: 10px" @click="openImportModal" v-if="showAccess('黑名单管理_黑名单_批量导入')">批量导入</Button>
      </FormItem>
    </Form>
    <Table
      border
      :columns="columnsTop"
      :data="rowDataTop"
      :loading="listLoadingTop"
      style="overflow-x:scroll;"
    >
    <template slot-scope="{row, index}" slot="complaintTime">
      <div>{{row.complaintTime | formatDateShort}}</div>
    </template>
    <template slot-scope="{row, index}" slot="complaintSource">
      <div>{{sourceList[row.complaintSource]}}</div>
    </template>
    <template slot-scope="{row, index}" slot="createTime">
      <div>{{row.createTime | formatDate}}</div>
    </template>
    <template slot-scope="{row, index}" slot="partnerNameList">
      <div>{{row.partnerNameList.join(',')}}</div>
    </template>
    <template slot-scope="{row, index}" slot="complaintReason">
      <Tooltip placement="top" max-width="120" transfer theme="light">
        <div slot="content" style="word-wrap:break-word">{{row.complaintReason}}</div>
        <div style="max-width:120px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">{{row.complaintReason}}</div>
      </Tooltip>
    </template>
    <template slot-scope="{row, index}" slot="action">
      <Button
        type="error"
        @click="deleteHandler(row)"
        size="small"
        v-if="showAccess('黑名单管理_黑名单_删除')"
      >删除</Button>
    </template>
    </Table>
    <div style="display:flex;justify-content:flex-end;margin-top:10px;">
      <Page
        :total="totalCountTop"
        size="small"
        :current="formItem.page"
        @on-change="pageChange"
        :page-size="formItem.pageSize"
        @on-page-size-change="pageSizeChange"
        show-sizer
        show-total
        show-elevator
      ></Page>
    </div>
    <Modal
      title="新增黑名单"
      v-model="addBlacklist"
      :mask-closable="false"
      @on-visible-change="closeAddModal"
      class="blackForm"
      width="470"
    >
      <Form
        :model="blackForm"
        :label-width="90"
        :rules="blackRuleValidate"
        ref="blackForm"
        style="padding-left:20px;"
      >
        <FormItem label="商户名称:" prop="shopId">
          <Select
            ref="shopSelect"
            v-model="blackForm.shopId"
            placeholder="商户名称"
            filterable
            clearable
            remote
            style="width:300px;"
            :remote-method="getAllShops"
            :loading="getShopsLoading"
          >
            <Option v-for="(item,index) in allShops" :value="item.id" :key="index">{{item.name}}</Option>
          </Select>
        </FormItem>
        <FormItem label="厂商:" prop="partnerIds">
          <Select v-model="blackForm.partnerIds" style="width:300px" multiple>
            <Option
                v-for="(item,key) in partnerNames"
                :value="item.index"
                :key="key"
              >{{ item.value }}</Option>
          </Select>
        </FormItem>
        <FormItem label="投诉日期:" prop="complaintTime">
          <Date-picker
            type="date"
            format="yyyy-MM-dd"
            placeholder="请选择日期"
            :options="pickerOptions"
            v-model="blackForm.complaintTime"
            style="width:300px;"
            transfer
          ></Date-picker>
        </FormItem>
        <FormItem label="投诉来源:" prop="complaintSource">
          <Select v-model="blackForm.complaintSource" style="width:300px;">
            <Option v-for="(value, key) in sourceList" :value="key" :key="key">{{ value }}</Option>
          </Select>
        </FormItem>
        <FormItem label="投诉人:" prop="complaintPerson">
          <Input
            clearable
            v-model="blackForm.complaintPerson"
            placeholder="请填写投诉人"
            style="width:300px"
            maxlength="10"
            show-word-limit
          />
        </FormItem>

        <FormItem label="投诉原因:" prop="complaintReason">
          <Input
            v-model="blackForm.complaintReason"
            placeholder="请填写投诉原因,不超过30字"
            style="width:300px"
            maxlength="30"
            show-word-limit
            type="textarea"
          />
        </FormItem>
        <FormItem label="接收投诉人:" prop="complaintReceiptPerson">
          <Input
            clearable
            v-model="blackForm.complaintReceiptPerson"
            placeholder="请填写接收投诉人"
            style="width:300px"
            maxlength="10"
            show-word-limit
          />
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" style="margin-left:10px;" @click="addSubmit('blackForm')">确定</Button>
        <Button @click="addBlacklist = false">取消</Button>
      </div>
    </Modal>
    <Modal
      title="批量导入黑名单"
      v-model="batchImportModal"
      :mask-closable="false"
      @on-visible-change="importBatchImportClose"
    >
      <div class="importContent">
        <Upload
          ref="uploadBatch"
          action="/ad/shops/black/import"
          accept=".xls, .xlsx"
          :headers="headers"
          :show-upload-list="false"
          :before-upload="beforeUploadImport"
          :on-success="uploadSuccessImport"
          :on-error="uploadErrorImport"
        >
          <Button>选择文件</Button>
        </Upload>
        <a
          :href="onloadUrl + '商户黑名单导入模板.xlsx'"
          download="商户黑名单导入模板.xlsx"
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
    <Modal title="删除黑名单"
      v-model="deleteModal"
      :mask-closable="false" 
      @on-ok="deleteBlackList"
      @on-cancel="deleteModal=false">
      <div>
        确定删除该商户，将该商户变更为白名单吗？
      </div>
    </Modal>
  </div>
</template>
<script>
import axios from "@/libs/api.request";
import { datefmt } from "@/utils/dateFormat";
import { getToken, uuid } from "@/libs/util";
import moment from "moment";
import hasShowAccess from "@/libs/hasShowAccess.js";
import config from "./options/columns";
moment.locale("zh-cn");
export default {
  name: "dataEntering",
  components: {},
  data() {
    const validatePartner = (rule, value, callback) => {
        if (!value.length) {
            callback(new Error('厂商为必填项'));
        } else {
            return callback();
        }
    };
    const dateNow = new Date()
    return {
       pickerOptions: {
        disabledDate(time) {
          return (
            time.getTime() > Date.now() 
          );
        }
      },
      allShops: [],
      getShopsLoading: false,
      uploadLoadingImport: false,
      batchImportModal: false,
      onloadUrl:
        process.env.NODE_ENV === "production" ? "/page/static/" : "/static/",
      headers: {
        // "X-Client-Token": 'eyJpc0VuYWJsZSI6MSwibGFzdExvZ2luIjoxNTg1NzkyNDQxMjEyLCJuaWNrTmFtZSI6Imxpc2hhbnNoYW4iLCJ0b2tlbiI6IjgwX2xpc2hhbnNoYW5fMTU4NTc5MjQ0MTIxMiIsInVzZXJFbWFpbCI6Imxpc2hhbnNoYW5AdGVkZHltb2JpbGUuY24iLCJ1c2VySWQiOjgwLCJ1c2VyTmFtZSI6Imxpc2hhbnNoYW4ifQ==',
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
      rowDataTop: [],
      listLoadingTop: false,
      totalCountTop: 0,
      columnsTop: config.columnsTop,
      versions: [],
      complainants: [],
      formItem: {
        shopName: '',
        complaintTime: [moment(dateNow - 1000 * 60 * 60 * 24 * 30).format("YYYY-MM-DD"), moment(dateNow).format("YYYY-MM-DD")],
        optUser: '',
        page: 1,
        pageSize: 10
      },

      reqFilesBatch: {
        fileName: ""
      },
      addBlacklist: false,
      blackForm: {
        complaintTime: "",
        shopId: "",
        complaintSource: "",
        complaintPerson: "",
        complaintReason: '',
        complaintReceiptPerson: '',
        partnerIds: []
      },
      blackRuleValidate: {
        shopId: [
          {
            required: true,
            message: "商户名称为必填项",
            trigger: "change"
          }
        ],
        partnerIds: [{
          required: true,
          trigger: "change",
          validator: validatePartner
        }],
        complaintSource: [
          {
            required: true,
            message: "请选择投诉来源",
            trigger: "change"
          }
        ],
        complaintTime: [
          {
            required: true,
            type: "date",
            message: "请选择投诉时间",
            trigger: "change"
          }
        ],
        complaintReason: [
          {
            required: true,
            message: "请填写投诉原因",
            trigger: "blur"
          }
        ],
        complaintReceiptPerson: [
          {
            required: true,
            message: "请填写接收投诉人",
            trigger: "blur"
          }
        ]
      },
      sourceList: {
        '1': '销售',
        '2': '邮件',
        '3': '客服',
        '4': '厂商',
        '5': 'AE',
        '6': '其他'
      },
      partnerNames: [
        {
          index: 5,
          key: "5",
          value: "VIVO"
        },
        {
          index: 1,
          key: "1",
          value: "OPPO"
        },
        {
          index: 2,
          key: "2",
          value: "金立"
        },
        {
          index: 3,
          key: "3",
          value: "乐视"
        },
        {
          index: 4,
          key: "4",
          value: "ZUK"
        },
        {
          index: 9,
          key: "9",
          value: "NEX3"
        },
        {
          index: 6,
          key: "6",
          value: "一加"
        }
      ],
      uploadResponse: {
        result_excel: ""
      },
      deleteModal: false,
      deleteId: ''
    };
  },
  computed: {
    showAccess() {
      return el => {
        return hasShowAccess(el);
      };
    },
  },
  filters: {
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
  },
  mounted() {
    this.getComplaintPersonList();
    this.searchData(true);
  },
  methods: {
    getComplaintPersonList() {
      axios.request({
        url: '/ad/shops/black/getComplaintPersonList',
        method: 'post'
      }).then(res => {
        if (res.data.code === 0) {
          this.complainants = res.data.data
        } else {
          this.$Message.error("请求异常，请稍后再试！");
        }
      }).catch(err => {
        this.$Message.error("请求失败，" + err + "，请稍后再试！");
      })
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
    dateTimeChange(date) {
      this.formItem.complaintTime = date;
      this.searchData(true);
    },
    exportPackageData() {
      let {complaintTime, ...postData} = this.formItem
      axios
        .request({
          url: "/ad/shops/black/export",
          method: "post",
          data: {
            ...postData, 
            startDate: complaintTime[0] ? moment(complaintTime[0]).format("YYYY-MM-DD") : '',
            endDate: complaintTime[1] ? moment(complaintTime[1]).format("YYYY-MM-DD") : ''
          },
          responseType: "blob"
        })
        .then(res => {
          if (!res) {
            this.$Message.error("导出失败");
            return;
          }
          var elink = document.createElement("a");
          elink.download = "商户黑名单.xls";
          elink.style.display = "none";
          var blob = new Blob([res.data], { type: "application/vnd.ms-excel" });
          elink.href = URL.createObjectURL(blob);
          document.body.appendChild(elink);
          elink.click();
          document.body.removeChild(elink);
        })
        .catch(err => {
          this.$Message.error("导出错误" + err);
        });
    },
    openImportModal() {
      this.batchImportModal = true;
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
    fileTagCloseBatch() {
      this.reqFilesBatch = {
        files: null,
        fileName: ""
      };
      this.uploadResponse.result_excel = "";
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
          url: "/common/getImportTask?taskId=" + taskId,
          method: "get"
        })
        .then(res => {
          if (res.data.code === 0) {
            if (res.data.data.status === 1) {
              this.requestUploadAgain(res.data.data.taskId);
            } else if (res.data.data.status === 2) {
              this.$Message.success("上传成功,请查看结果");
              this.searchData(true)
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
          link.setAttribute("download", "批量导入商户黑名单结果.xlsx");
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        })
        .catch(err => {
          this.$Message.error("导出失败");
        });
    },
    searchData(isfirst) {
      this.listLoadingTop = true;
      if (isfirst) {
        this.formItem.page = 1;
      }
      let {complaintTime, ...postData} = this.formItem
      axios
        .request({
          url: "/ad/shops/black/find",
          method: "post",
          data: {
            ...postData, 
            startDate: complaintTime[0] ? moment(complaintTime[0]).format("YYYY-MM-DD") : '',
            endDate: complaintTime[1] ? moment(complaintTime[1]).format("YYYY-MM-DD") : ''
          }
        })
        .then(d => {
          if (d.data.code == 0) {
            this.rowDataTop = d.data.data.rows;
            this.totalCountTop = d.data.data.total;
          }
          this.listLoadingTop = false;
        })
        .catch(() => {
          this.listLoadingTop = false;
        });
    },

    pageChange(val) {
      this.formItem.page = val;
      this.searchData();
    },
    pageSizeChange(val) {
      this.formItem.pageSize = val;
      this.searchData();
    },
    addSubmit(name) {
      let _this = this
        this.$refs[name].validate(valid => {
            if (valid) {
                let param = {}
                let url = '/ad/shops/black/add'
                axios
                  .request({
                    url,
                    method: "post",
                    data: {..._this.blackForm, complaintTime: moment(this.blackForm.complaintTime).format("YYYY-MM-DD")}
                  })
                  .then(d => {
                    if (d.data.code == 0) {
                      _this.addBlacklist = false
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
    closeAddModal(flag) {
      if (!flag) {
        this.$refs.blackForm.resetFields()
      }
    },
    deleteHandler(row) {
      this.deleteModal = true
      this.deleteId = row.id
    },
    deleteBlackList() {
      axios.request({
        url: '/ad/shops/black/delete',
        method: 'post',
        data: {ids: [this.deleteId]}
      }).then(d => {
        if (d.data.code == 0) {
          this.searchData(true)
        } else {
          this.$Message.error(d.data.msg);
        }
      }).catch(err => {
        this.$Message.error("操作失败，请刷新重试")
      })
    }
  }
};
</script>
<style scoped lang="less">
.echart {
  width: 100%;
  height: 300px;
}
.importContent {
  padding: 0 20px;
  position: relative;
  .sampleBtn {
    position: absolute;
    top: 4px;
    left: 120px;
  }
}
.blackForm /deep/ .ivu-input-type-textarea .ivu-input-word-count {
  align-items: flex-end;
  top: auto;
}
.blackForm /deep/ .ivu-input-word-count {
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
</style>

