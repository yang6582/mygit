<template>
  <div class="rolePermission">
    <Form
      :model="searchForm"
      :label-width="80"
      :inline="true"
      style="margin-top: 20px"
      @submit.native.prevent
    >
      <FormItem label="角色名称:">
        <Input v-model="searchForm.roleName" placeholder="角色名称" clearable @on-enter="search(true)" />
      </FormItem>
      <FormItem label="状态:">
        <Select
          v-model="searchForm.status"
          style="width:150px"
          placeholder="请选择"
          @on-change="search(true)"
        >
          <Option :value="-1">全部</Option>
          <Option :value="1">启用</Option>
          <Option :value="0">禁用</Option>
        </Select>
      </FormItem>
      <FormItem :label-width="30">
        <Button type="primary" style="margin-left:10px" @click="search(true)">查询</Button>
        <Button type="primary" style="margin-left: 10px" @click="edit('add')">新增</Button>
      </FormItem>
    </Form>
    <div>
      <Table
        border
        :columns="columns"
        :data="tableData"
        align="center"
        key="tableData"
        :loading="tableDataLoading"
      >
        <template slot-scope="{row, index}" slot="status">
          <Tag color="red" v-if="row.status == '0'" size="medium">禁用</Tag>

          <Tag color="green" v-else size="medium">启用</Tag>
        </template>
        <template slot-scope="{row, index}" slot="createTime">
          <!-- <span v-for="(item.index) in roleFormat(row.userRoles)" :key="index"></span> -->
          <span>{{row.createTime | formatDate}}</span>
        </template>
        <template slot-scope="{row, index}" slot="operate">
          <Button type="primary" @click="edit('update',row,'top')" size="small">基本信息</Button>
          <Button
            type="info"
            style="margin-left: 15px"
            @click="edit('update',row,'bottom')"
            size="small"
          >权限信息</Button>
          <Poptip confirm title="确认删除当前角色?" width="200" class="poptipClass" @on-ok="delRoleOk(row)">
            <Button type="error" style="margin-left: 15px" size="small">删除角色</Button>
          </Poptip>
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
      :title="addModalType == 'add' ? '新增角色': editType == 'top' ?'基本信息':'权限信息-'+editForm.title"
      :mask-closable="false"
      :width="addModalType == 'add' ? '70' :editType == 'top' ?'40':'70'"
      :styles="{top: '30px'}"
      @on-visible-change="addModalClose"
    >
      <Card
        style="margin-bottom:10px;"
        v-if="(addModalType == 'add') || (addModalType == 'update' && editType == 'top')"
      >
        <p slot="title">{{addModalType == 'add' ? '基本信息' : '设置'}}</p>
        <Form ref="editForm" :model="editForm" :rules="addRuleValidate" :label-width="110">
          <FormItem label="角色名称:" prop="roleName">
            <Input v-model="editForm.roleName" style="width:300px;" :maxlength='20' clearable></Input>
          </FormItem>
          <FormItem label="状态:" prop="status">
            <Select v-model="editForm.status" style="width:300px;">
              <Option value="1">启用</Option>
              <Option value="0">禁用</Option>
            </Select>
          </FormItem>
          <FormItem label="描述:" prop="roleDesc">
            <Input v-model="editForm.roleDesc" type="textarea" style="width:300px;" clearable></Input>
          </FormItem>
        </Form>
      </Card>
      <Card v-if="addModalType == 'add' || (addModalType == 'update' && editType == 'bottom')">
        <p slot="title">权限设置</p>
        <Tabs :animated="false">
          <TabPane label="操作权限">
            <choiceListCom
              :permissionList="permissionList"
              :rowPermission="rowPermission"
              ref="choiceListCom"
            ></choiceListCom>
          </TabPane>
          <TabPane label="数据权限" disabled>标签二的内容</TabPane>
        </Tabs>
      </Card>
      <div slot="footer">
        <Button @click="addModal = false" style>取消</Button>
        <Button @click="confirmEdit" type="primary">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import axios from "@/libs/api.request";
import config from "../config";
import moment from "moment";
moment.locale("zh-cn");
export default {
  name: "rolePermission",
  props: [],
  components: {
    choiceListCom: () => import("../components/choiceListCom")
  },
  data() {
    const validateName = (rule, value, callback) => {
     if (value.trim() === "") {
        callback(new Error("请填写姓名"));
      } else if (value.trim().length > 20) {
        callback(new Error("最多不超过20个字符"));
      } else {
        callback();
      }
    };
    return {
      indeterminate1: false,
      indeterminate2: false,
      indeterminate3: false,
      checkAll1: false,
      checkAll2: false,
      checkAll3: false,
      checkAllGroup1: [],
      checkAllGroup2: [],
      checkAllGroup3: [],
      addModalType: "add",
      editType: "top",
      addModal: false,
      editForm: {
        status: "1",
        roleDesc: "",
        roleName: ""
      },
      addRuleValidate: {
        status: [
          {
            required: true,
            message: "请选择状态",
            trigger: "change"
          }
        ],
        roleDesc: [
          {
            required: true,
            message: "请填写描述",
            trigger: "blur"
          }
        ],
        roleName: [
          {
            required: true,
            message: "请填写角色名称",
            trigger: "blur"
          },
          { validator: validateName, trigger: "blur" }
        ]
      },
      tableDataLoading: false,
      searchForm: {
        roleName: "",
        status: -1
      },
      page: {
        totalCount: 0,
        pageIndex: 1,
        pageSize: 10
      },
      tableData: [],
      columns: config.roleColumns,
      permissionList: [],
      rowPermission: {}
    };
  },
  computed: {
    getComPermission() {
      return [
        ...this.$refs.choiceListCom.checkAllGroup2,
        ...this.$refs.choiceListCom.checkAllGroup3
      ];
    }
  },
  created() {
    this.search(true);
    this.getAllPermission();
  },
  methods: {
    confirmEdit() {
      if (this.addModalType == "add") {
        this.$refs["editForm"].validate(valid => {
          if (valid) {
            let postData = {
              roleName: this.editForm.roleName,
              roleDesc: this.editForm.roleDesc,
              status: this.editForm.status,
              resources: this.getComPermission
            };
            axios
              .request({
                url: "/sys/auth/role/add",
                method: "post",
                data: postData
              })
              .then(res => {
                if (res.data.code == 0) {
                  this.$Message.success("添加成功!");
                  this.addModal = false;
                  this.search(true);
                } else {
                  this.$Message.error(res.data.msg);
                }
              })
              .catch(err => {
                this.$Message.error("网络错误");
              });
          }
        });
      } else {
        if (this.editType == "bottom") {
          let postData = {
            roleId: this.editForm.roleId,
            resources: this.getComPermission
          };
          axios
            .request({
              url: "/sys/auth/role/resource/permission/set",
              method: "post",
              data: postData
            })
            .then(res => {
              if (res.data.code == 0) {
                this.$Message.success("修改成功!");
                this.addModal = false;
                this.search();
              } else {
                this.$Message.error(res.data.msg);
              }
            })
            .catch(err => {
              this.$Message.error("网络错误");
            });
        } else {
          this.$refs["editForm"].validate(valid => {
            if (valid) {
              let postData = {
                roleName: this.editForm.roleName,
                roleDesc: this.editForm.roleDesc,
                status: this.editForm.status,
                roleId: this.editForm.roleId
              };
              axios
                .request({
                  url: "/sys/auth/role/update",
                  method: "post",
                  data: postData
                })
                .then(res => {
                  if (res.data.code == 0) {
                    this.$Message.success("修改成功!");
                    this.addModal = false;
                    this.search();
                  } else {
                    this.$Message.error(res.data.msg);
                  }
                })
                .catch(err => {
                  this.$Message.error("网络错误");
                });
            }
          });
        }
      }
    },

    search(flag) {
      this.tableDataLoading = true;
      if (flag) {
        this.page.pageIndex = 1;
      }
      let postData = {
        roleName: this.searchForm.roleName.trim(),
        status: this.searchForm.status,
        pageSize: this.page.pageSize,
        pageIndex: this.page.pageIndex - 1
      };
      axios
        .request({
          url: "/sys/auth/role/query",
          method: "post",
          data: postData
        })
        .then(res => {
          if (res.data.code == 0) {
            this.tableData = res.data.data.data;
            this.page.totalCount = res.data.data.total;
          } else {
            this.$Message.error(res.data.msg);
          }
          this.tableDataLoading = false;
        })
        .catch(err => {
          this.tableDataLoading = false;
          this.$Message.error("网络错误");
        });
    },
    edit(type, row, editType) {
      this.addModalType = type;
      this.addModal = true;
      if (type == "add") {
        this.editForm.status = "1";
        this.editForm.roleDesc = "";
        this.editForm.roleName = "";
      } else {
        this.editForm.roleId = row.roleId;
        this.editForm.title = row.roleName;
        this.editType = editType;
        if (this.editType == "top") {
          this.editForm.status = row.status + "";
          this.editForm.roleDesc = row.roleDesc;
          this.editForm.roleName = row.roleName;
        } else if (this.editType == "bottom") {
          this.getRowPermission(row);
        }
      }
    },
    addModalClose(flag) {
      if (!flag) {
        this.rowPermission = {
          first: [],
          second: [],
          third: []
        };
        if (this.addModalType == "add") {
          this.$refs.choiceListCom.clearData();
          this.$refs.editForm.resetFields();
        } else if (this.editType == "bottom" && this.addModalType == "update") {
          this.$refs.choiceListCom.clearData();
        } else if (this.editType == "top" && this.addModalType == "update") {
          this.$refs.editForm.resetFields();
        }
      }
    },
    getRowPermission(row) {
      axios
        .request({
          url: "/sys/auth/role/resource/permission/get/" + row.roleId,
          method: "get"
        })
        .then(res => {
          if (res.data.code === 0) {
            let first = [];
            let second = [];
            let third = [];
            if (!res.data.data || !res.data.data.length) {
              this.rowPermission = {
                first,
                second,
                third
              };
              return;
            }
            res.data.data.forEach(item => {
              first.push(item.id);
              item.sonResources.forEach(stem => {
                second.push(stem.id);
                stem.sonResources.forEach(ttem => {
                  third.push(ttem.id);
                });
              });
            });
            this.rowPermission = {
              first,
              second,
              third
            };
          } else {
            this.$Message.error(res.data.msg);
          }
        })
        .catch(err => {
          this.$Message.error("请求失败，" + err + "，请稍后再试！");
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
    delRoleOk(row) {
      axios
        .request({
          url: "/sys/auth/role/delete/" + row.roleId,
          method: "get"
        })
        .then(res => {
          if (res.data.code === 0) {
            this.$Message.success("删除成功!");
            this.search();
          } else {
            this.$Message.error(res.data.msg);
          }
        })
        .catch(err => {
          this.$Message.error("请求失败，" + err + "，请稍后再试！");
        });
    },
    getAllPermission() {
      axios
        .request({
          url: "/sys/auth/resource/all",
          method: "get"
        })
        .then(res => {
          if (res.data.code === 0) {
            this.permissionList = res.data.data;
          } else {
            this.$Message.error(res.data.msg);
          }
        })
        .catch(err => {
          this.$Message.error("请求失败，" + err + "，请稍后再试！");
        });
    }
  },
  filters: {
    formatDate(value) {
      return moment(value).format("YYYY-MM-DD HH:mm:ss");
    }
  }
};
</script>

<style lang="less" scoped>
.choiceListCom {
  display: flex;
  border: 1px solid rgb(215, 217, 222);

  > div {
    width: 33.3%;
    border-right: 1px solid rgb(215, 217, 222);
    height: 300px;
    display: flex;
    flex-direction: column;
    .checkbox {
      width: 100%;
      height: 40px;
      padding-left: 20px;
      display: flex;
      align-items: center;
    }
  }
}
.poptipClass /deep/ .ivu-icon {
  left: 40px;
}
/deep/.ivu-input {
  font-size: 12px !important;
}
</style>
