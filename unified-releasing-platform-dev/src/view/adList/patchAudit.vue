<template>
  <div>
    <Form
      :model="formItem"
      :label-width="80"
      :inline="true"
      style="margin-top: 20px"
      @submit.native.prevent
    >
      <FormItem label="广告名称:" prop="adName">
        <Input v-model="formItem.adName" @on-enter="searchData(true)" placeholder="广告名称" clearable />
      </FormItem>
      <FormItem label="审核状态:" prop="auditType">
        <Select v-model="formItem.auditType" style="width:140px" @on-change="searchData(true)">
          <Option
            v-for="(item,index) in auditTypeList"
            :value="item.type"
            :key="index"
          >{{ item.value }}</Option>
        </Select>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="searchData(true)" icon="ios-search">查询</Button>
        <Button
          type="primary"
          @click="createPatch"
          style="margin-left:10px"
          v-if="showAccess('广告管理_patch审核_新建Patch')"
        >新建Patch</Button>
      </FormItem>
    </Form>
    <columnsSelect
      :columns="selectColumns"
      :columnsNum="formItem.adType"
      @columns-change="columnsChange"
    ></columnsSelect>
    <br />
    <Table
      border
      :columns="columnsSelection"
      :data="rowData"
      align="center"
      key="rowData"
      :loading="listLoading"
    >
      <template slot-scope="{ row, index }" slot="action">
        <div style="display: flex">
          <div style="margin: 10px 15px 10px 15px">
            <Button
              type="primary"
              size="small"
              :disabled="row.oppo_status !== 90"
              @click="send(row)"
              v-if="showAccess('广告管理_patch审核_送审')"
            >送审</Button>
          </div>
          <div style="margin: 10px 0">
            <Button
              type="success"
              size="small"
              @click="openDownloadPatch(row)"
              :disabled="row.oppo_status !== 1"
              v-if="showAccess('广告管理_patch审核_下载Patch')"
            >下载Patch</Button>
          </div>
        </div>
      </template>
      <template slot-scope="{row, index}" slot="url">
        <Tooltip placement="top" transfer>
          <div
            slot="content"
            style="width: 220px; white-space: normal;word-break: break-all;"
          >{{row.url}}</div>
          <Button
            size="small"
            style="color:#59afed"
            @click="copyShortUrl(row.url)"
            v-if="row.url"
          >查看</Button>
        </Tooltip>
      </template>
    </Table>
    <Page
      :total="total_count"
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
    <Modal
      title="新建Patch"
      v-model="showCreatePatch"
      :mask-closable="false"
      @on-visible-change="formVisibleChange"
    >
      <div style="padding:0 30px 0 20px;">
        <Form
          :model="patchFormData"
          :rules="validateEditAd"
          :label-width="100"
          ref="patchFormValidate"
        >
          <FormItem label="广告名称:" prop="adName">
            <Input v-model="patchFormData.adName" clearable />
          </FormItem>
          <FormItem label="上传文件类型:" prop="uploadType">
            <Select v-model="patchFormData.uploadType">
              <Option
                v-for="(item,index) in uploadTypeList"
                :value="item.key"
                :key="index"
              >{{ item.value }}</Option>
            </Select>
          </FormItem>
          <FormItem label="品牌类型:" prop="brandType">
            <Select v-model="patchFormData.brandType">
              <Option
                v-for="(item,index) in brandTypeList"
                :value="item.key"
                :key="index"
              >{{ item.value }}</Option>
            </Select>
          </FormItem>
          <FormItem label="文件:" prop="fileUrl">
            <Upload
              type="drag"
              :action="axisoUrl+'/admin/verify/json_patch_upload'"
              ref="uploaPatch"
              :before-upload="beforeUpload"
              :on-success="uploadSuccess"
              :on-error="uploadError"
              :on-remove="uploadRemove"
            >
              <div style="padding: 20px 0">
                <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                <p>请选择或拖拽文件</p>
              </div>
            </Upload>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button @click="showCreatePatch = false">取消</Button>
        <Button type="primary" @click="handleSubmit('patchFormValidate')">确定</Button>
      </div>
    </Modal>
    <Modal
      title="下载Patch"
      v-model="showDownloadPatch"
      :mask-closable="false"
      width="650"
      @on-visible-change="showDownloadPatchClose"
    >
      <div style="padding:0 20px;">
        <div style="border-bottom: 1px solid #e9e9e9;padding-bottom:6px;margin-bottom:6px;">
          <Checkbox
            :indeterminate="indeterminate"
            :value="checkAll"
            @click.prevent.native="handleCheckAll"
          >全选</Checkbox>
        </div>
        <CheckboxGroup v-model="checkAllGroup" @on-change="checkAllGroupChange">
          <template v-for="(item,index) in fileAddress">
            <Checkbox :label="index">
              <p>MD5: {{item.fileMd5}}</p>
              <a :href="item.fileUrl" download="true" target="_blank">{{item.fileUrl}}</a>
            </Checkbox>
            <br />
          </template>
        </CheckboxGroup>
      </div>
      <div slot="footer">
        <Button @click="showDownloadPatch = false">取消</Button>
        <Button type="primary" @click="downloadPatch">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import axios from "@/libs/api.request";
import { datefmt } from "@/utils/dateFormat";
import config from "./config.js";
import moment from "moment";
import { getToken, uuid } from "@/libs/util";
import hasShowAccess from "@/libs/hasShowAccess.js";

moment.locale("zh-cn");

export default {
  name: "patchAudit",
  components: {
    columnsSelect: () => import("@/components/columns-select")
  },
  data() {
    return {
      fileAddress: [],
      axisoUrl:
        location.href.indexOf("back-manager.teddymobile.net") > -1
          ? "https://m.teddymobile.cn"
          : "https://m-test.teddymobile.cn",
      indeterminate: false,
      checkAll: false,
      checkAllGroup: [],
      showDownloadPatch: false,
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
      showCreatePatch: false,
      patchFormData: {
        adName: "",
        uploadType: "0",
        brandType: "1",
        fileUrl: "",
        fileSize: ""
      },
      uploadTypeList: [
        {
          key: "0",
          value: "非广告类型文件"
        },
        {
          key: "1",
          value: "商业化下一步按钮patch原明文文件"
        },
        {
          key: "2",
          value: "商业化下一步按钮sms.cfg文件"
        }
      ],
      brandTypeList: [
        {
          key: "1",
          value: "OPPO"
        },
        {
          key: "2",
          value: "ONEPLUS"
        },
        {
          key: "3",
          value: "REALME"
        }
      ],
      validateEditAd: {
        adName: [
          { required: true, message: "请输入广告名称", trigger: "blur" }
        ],
        uploadType: [
          { required: true, message: "请选择上传文件类型", trigger: "change" }
        ],
        brandType: [
          { required: true, message: "请选择品牌类型", trigger: "change" }
        ],
        fileUrl: [{ required: true, message: "请上传文件", trigger: "blur" }]
      },
      formItem: {
        adType: 1,
        auditType: -99,
        pageSize: 10,
        pageIndex: 1,
        adName: ""
      },
      total_count: 0,
      columnsSelection: [],
      columns: config.patchColumns, // 菜单的自定义列配置
      rowData: [],
      listLoading: false,
      auditTypeList: [
        {
          type: -99,
          value: "全部"
        },
        {
          type: 1,
          value: "通过"
        },
        {
          type: 2,
          value: "未通过"
        },
        {
          type: 3,
          value: "文件下载失败"
        },
        {
          type: 4,
          value: "子文件生成错误"
        },
        {
          type: 90,
          value: "待同步"
        },
        {
          type: 91,
          value: "待审核"
        }
      ]
    };
  },
  computed: {
    showAccess() {
      return el => {
        return hasShowAccess(el);
      };
    },
    selectColumns() {
      switch (this.formItem.adType) {
        case 1:
          return this.columns;
      }
    },
    fileAddressMd5() {
      return this.fileAddress.map((item, index) => {
        return index;
      });
    }
  },
  filters: {
    formatDate(value) {
      if (value) {
        return moment(value).format("YYYY-MM-DD HH:mm:ss");
      } else {
        return "";
      }
    },
    formatDateShort(value) {
      if (value) {
        return moment(value).format("YYYY-MM-DD");
      } else {
        return "";
      }
    }
  },
  methods: {
    searchData(isfirst) {
      this.listLoading = true;
      if (isfirst) {
        this.formItem.pageIndex = 1;
      }
      var postData = {
        pageSize: this.formItem.pageSize,
        pageIndex: this.formItem.pageIndex - 1,
        adName: this.formItem.adName.trim()
      };
      this.formItem.auditType != -99
        ? (postData.status = this.formItem.auditType)
        : false;
      let _this = this;
      axios
        .request({
          url: "ad/patch/approval/list/query",
          method: "post",
          data: postData
        })
        .then(d => {
          if (d.data.code === 0) {
            this.rowData = d.data.data.list_info;
            this.page = d.data.data.current_page;
            this.total_count = d.data.data.total_count;
          }
          this.listLoading = false;
        })
        .catch(() => {
          this.listLoading = false;
        });
    },
    columnsChange(columns) {
      this.columnsSelection = columns;
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
    createPatch() {
      this.showCreatePatch = true;
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
    emptyForm(name) {
      this.$refs[name].resetFields();
      this.showCreatePatch = false;
    },
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          let postData = {
            fileUrl: this.patchFormData.fileUrl,
            fileSize: this.patchFormData.fileSize,
            adName: this.patchFormData.adName,
            type: this.patchFormData.uploadType,
            brandType: this.patchFormData.brandType
          };
          axios
            .request({
              url: "/ad/patch/approval/add",
              method: "post",
              data: postData
            })
            .then(d => {
              if (d.data.code == 0) {
                this.$Message.success("添加成功");
                this.searchData();
                this.showCreatePatch = false;
              } else {
                this.$Message.error(d.data.msg);
              }
            })
            .catch(() => {
              this.$Message.error("网络错误");
            });
        } else {
          this.$Message.error("请填写完整信息!");
        }
      });
    },
    beforeUpload(file) {
      this.$refs.uploaPatch.clearFiles();
      this.patchFormData.fileUrl = "";
      this.patchFormData.fileSize = 0;
    },
    uploadSuccess(res, { size }) {
      if (res.code == 0) {
        this.patchFormData.fileUrl = res.url;
        this.patchFormData.fileSize = size;
      } else {
        this.$Message.error(res.msg);
      }
    },
    uploadError(err) {
      this.$Message.error("网络错误,上传失败!");
    },
    openDownloadPatch(row) {
      this.fileAddress = row.file_address;
      this.showDownloadPatch = true;
    },
    downloadPatch() {
      let open = this.checkAllGroup.map(item => {
        return this.fileAddress[item].fileUrl;
      });
      open.forEach(item => {
        window.open(item);
      });
    },
    handleCheckAll() {
      if (this.indeterminate) {
        this.checkAll = false;
      } else {
        this.checkAll = !this.checkAll;
      }
      this.indeterminate = false;

      if (this.checkAll) {
        this.checkAllGroup = this.fileAddressMd5;
      } else {
        this.checkAllGroup = [];
      }
    },
    checkAllGroupChange(data) {
      if (data.length === this.fileAddressMd5.length) {
        this.indeterminate = false;
        this.checkAll = true;
      } else if (data.length > 0) {
        this.indeterminate = true;
        this.checkAll = false;
      } else {
        this.indeterminate = false;
        this.checkAll = false;
      }
    },
    formVisibleChange(state) {
      if (!state) {
        this.emptyForm("patchFormValidate");
      }
    },
    showDownloadPatchClose(flag) {
      if (!flag) {
        this.indeterminate = false;
        this.checkAll = false;
        this.checkAllGroup = [];
      }
    },
    send(row) {
      let postData = {
        adId: row.ad_id
      };
      axios
        .request({
          url: "/ad/patch/approval/send",
          method: "post",
          data: postData
        })
        .then(d => {
          if (d.data.code == 0) {
            this.$Message.success("送审成功");
            this.searchData();
          } else {
            this.$Message.error(d.data.msg);
          }
        })
        .catch(() => {
          this.$Message.error("网络错误");
        });
    },
    uploadRemove(file, fileList) {
      this.patchFormData.fileUrl = "";
      this.patchFormData.fileSize = 0;
    }
  },
  created() {
    this.searchData(true);
  }
};
</script>
<style scoped lang="less">
.ivu-btn-primary .margin-15 {
  margin: 0 10px;
}

/deep/ .menuName {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  ul {
    box-sizing: border-box;
    width: 33.33%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    border-right: 1px solid #e8eaec;
    &:last-child {
      border-right: none;
    }
  }
}

/deep/ .otherTitle {
  ul {
    width: 100%;
  }
}

/deep/ .subCol ul li {
  list-style: none;
  text-align: center;
  border-bottom: 1px solid #e8eaec;
  overflow: hidden;
}

/deep/ .subCol ul li:last-child {
  border-bottom: none;
}

/deep/ .ivu-table-cell {
  padding: 0px;
}

.layout-table {
  padding-right: 10px;
  //padding-top: 20px;
}
</style>
