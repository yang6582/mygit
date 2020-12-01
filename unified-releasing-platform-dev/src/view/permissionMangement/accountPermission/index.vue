<template>
  <div class="accountPermission">
    <Form
      :model="searchForm"
      :label-width="80"
      :inline="true"
      style="margin-top: 20px"
      @submit.native.prevent
    >
      <FormItem label="姓名:">
        <Input v-model="searchForm.nickName" placeholder="姓名" clearable @on-enter="search(true)" />
      </FormItem>
      <FormItem label="状态:">
        <Select
          v-model="searchForm.isEnable"
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
        <Button type="primary" style="margin-left: 10px" @click="openEdit('add')">新增</Button>
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
        <template slot-scope="{row, index}" slot="isEnable">
          <Tag color="red" v-if="row.isEnable == '0'" size="medium">禁用</Tag>

          <Tag color="green" v-else size="medium">启用</Tag>

          <!-- <span>{{row.isEnable == '0' ? '禁用' : '启用'}}</span> -->
        </template>
        <template slot-scope="{row, index}" slot="userRoles">
          <!-- <span v-for="(item.index) in roleFormat(row.userRoles)" :key="index"></span> -->
          <span>{{roleFormat(row.userRoles)}}</span>
        </template>
        <template slot-scope="{row, index}" slot="createTime">
          <!-- <span v-for="(item.index) in roleFormat(row.userRoles)" :key="index"></span> -->
          <span>{{row.createTime | formatDate}}</span>
        </template>
        <template slot-scope="{row, index}" slot="operate">
          <Button type="primary" size="small" @click="openEdit('update',row)">编辑</Button>
          <!-- <Button type="success" v-if="row.isEnable == '2'" size="small" style="margin-left:15px;">启用</Button>
          <Button type="warning" v-if="row.isEnable == '1'" size="small" style="margin-left:15px;">禁用</Button>-->
          <Poptip confirm title="确认删除当前账号?" width="200" class="poptipClass" @on-ok="delRoleOk(row)">
            <Button type="error" size="small" style="margin-left:15px;">删除</Button>
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
    <Modal v-model="editModal" :title="editType == 'add' ? '新增': '编辑'" :mask-closable="false">
      <Form ref="editForm" :model="editForm" :rules="addRuleValidate" :label-width="110">
        <FormItem label="姓名:" prop="nickName">
          <Input v-model="editForm.nickName" style="width:300px;" :maxlength="20" clearable>
            <Icon type="ios-person-outline" slot="prepend"></Icon>
          </Input>
        </FormItem>
        <FormItem label="所属角色:" prop="userRoles">
          <Select v-model="editForm.userRoles" style="width:300px;" multiple placeholder="请选择">
            <Option
              :value="item.roleId"
              v-for="item in roleNameList"
              :key="item.roleId"
            >{{item.roleName}}</Option>
          </Select>
        </FormItem>
        <FormItem label="邮箱:" prop="userEmail">
          <Input v-model="editForm.userEmail" style="width:300px;" :disabled="editType != 'add'" clearable>
            <Icon type="ios-mail-outline" slot="prepend" />
          </Input>
        </FormItem>
        <FormItem label="是否启用:" prop="isEnable">
          <Select v-model="editForm.isEnable" style="width:300px;">
            <Option value="1">启用</Option>
            <Option value="0">禁用</Option>
          </Select>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="editModal = false" style>取消</Button>
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
  name: "accountPermission",
  props: [],
  components: {},
  data() {
    const validateEmail = (rule, value, callback) => {
      let reg = /^[A-Za-z0-9]+([_\.][A-Za-z0-9]+)*@([A-Za-z0-9\-]+\.)+[A-Za-z]{2,6}$/;
      if (value === "") {
        callback(new Error("请输入邮箱!"));
      } else if (reg.test(value)) {
        callback();
      } else {
        callback(new Error("邮箱格式错误!"));
      }
    };
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
      editForm: {
        nickName: "",
        userRoles: [],
        userEmail: "",
        isEnable: "1",
        userId: 0
      },
      addRuleValidate: {
        isEnable: [
          {
            required: true,
            message: "请选择状态",
            trigger: "change"
          }
        ],
        nickName: [
          {
            required: true,
            message: "请填写姓名",
            trigger: "blur"
          },
          { validator: validateName, trigger: "blur" }
        ],
        userRoles: [
          {
            required: true,
            type: "array",
            min: 1,
            max: 15,
            message: "至少选择1个所属角色,最多不超过15个",
            trigger: "change"
          }
        ],
        userEmail: [
          {
            required: true,
            message: "请填写邮箱",
            trigger: "blur"
          },
          { validator: validateEmail, trigger: "blur" }
        ]
      },
      editType: "add",
      editModal: false,
      tableDataLoading: false,
      searchForm: {
        nickName: "",
        isEnable: -1
      },
      page: {
        totalCount: 0,
        pageIndex: 1,
        pageSize: 10
      },
      tableData: [],
      columns: config.accountColumns,
      roleNameList: []
    };
  },
  created() {
    this.search(true);
  },
  computed: {
    roleFormat() {
      return userRoles => {
        if (!userRoles || !userRoles.length) {
          return "";
        }
        let arr = [];
        userRoles.forEach(item => {
          arr.push(item.roleName);
        });
        return arr.join("，");
      };
    }
  },
  methods: {
    search(flag) {
      this.tableDataLoading = true;
      if (flag) {
        this.page.pageIndex = 1;
      }
      let postData = {
        nickName: this.searchForm.nickName.trim(),
        status: this.searchForm.isEnable,
        pageSize: this.page.pageSize,
        pageIndex: this.page.pageIndex - 1
      };
      axios
        .request({
          url: "/sys/auth/user/query",
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
    openEdit(type, row) {
      this.$refs.editForm.resetFields();
      this.getRoleNameList();
      this.editType = type;
      this.editModal = true;
      if (this.editType == "update") {
        this.editForm.nickName = row.nickName;
        this.editForm.userRoles = row.userRoles.map(item => {
          return item.roleId;
        });
        this.editForm.userEmail = row.userEmail;
        this.editForm.isEnable = row.isEnable + "";
        this.editForm.userId = row.userId;
      }
    },
    confirmEdit() {
      this.$refs["editForm"].validate(valid => {
        if (valid) {
          let postData = {
            nickName: this.editForm.nickName,
            userEmail: this.editForm.userEmail,
            isEnable: this.editForm.isEnable,
            roleIds: this.editForm.userRoles
          };
          let url =
            this.editType == "add"
              ? "/sys/auth/user/add"
              : "/sys/auth/user/update";
          this.editType != "add"
            ? (postData.userId = this.editForm.userId)
            : false;
          axios
            .request({
              url,
              method: "post",
              data: postData
            })
            .then(res => {
              if (res.data.code === 0) {
                this.$Message.success(
                  this.editType == "add" ? "添加成功" : "修改成功"
                );
                this.editModal = false;
                this.search();
              } else {
                this.$Message.error(res.data.msg);
              }
            })
            .catch(err => {
              this.$Message.error("请求失败，" + err + "，请稍后再试！");
            });
        }
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
          url: "/sys/auth/user/delete/" + row.userId,
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
    getRoleNameList() {
      axios
        .request({
          url: "/sys/auth/role/list",
          method: "get"
        })
        .then(res => {
          if (res.data.code === 0) {
            this.roleNameList = res.data.data;
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
.poptipClass /deep/ .ivu-icon {
  left: 40px;
}
</style>
