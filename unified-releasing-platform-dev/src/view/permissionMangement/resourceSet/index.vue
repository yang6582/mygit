<template>
  <div>
    <Button type="primary" style="margin-bottom:10px;" @click="addPage(0,0)">新建菜单</Button>
    <div class="layout-table">
      <Table
        border
        :columns="columns"
        :data="rowData"
        align="center"
        key="rowData"
        :loading="tableLoading"
      >
        <template slot-scope="{ row }" slot="sonResources">
          <ul>
            <li v-for="(item,index) in row.sonResources" :key="index" style="margin:5px 0;">
              <a
                href="javascript:;"
                style="text-decoration:underline;"
                @click="addPage(1,1,item,row.resourceName)"
              >{{item.resourceName}}</a>
            </li>
          </ul>
        </template>
        <template slot-scope="{ row }" slot="operator">
          <div>
            <Button
              @click="addPage(0,1,row)"
              style="margin-left:10px"
              size="small"
              type="primary"
            >编辑</Button>
            <Button @click="addPage(1,0,row)" style="margin-left:10px" size="small" type="info">增加页面</Button>
            <Poptip confirm title="确定删除当前菜单?" @on-ok="delMenu(row.id)" transfer>
              <Button style="margin-left:10px" size="small" type="error">删除</Button>
            </Poptip>
          </div>
        </template>
      </Table>
    </div>
    <Modal
      :title="pageModalInfo.title"
      v-model="pageModal"
      :mask-closable="false"
      :width="pageForm.type === 1 && pageForm.edit == 1 ? 80 : 500"
      @on-visible-change="closePageModal"
    >
      <div style="padding:0 30px 0 20px;">
        <Form :label-width="80" :model="pageForm" :rules="validateEdit" ref="pageForm">
          <FormItem label="所属菜单:" v-if="pageForm.type === 1">
            <span>{{pageForm.parentName}}</span>
            <!-- <Input v-model="pageForm.parentName" type="text" disabled/> -->
          </FormItem>
          <FormItem :label="pageModalInfo.name" prop="resourceName">
            <Input v-model.trim="pageForm.resourceName" clearable type="text" style="width:330px;" />
          </FormItem>
          <FormItem
            :label="pageForm.type === 0 ?'菜单路径':pageForm.type === 1 ? '页面路径':'按钮资源'"
            prop="resourceUrl"
          >
            <Input v-model.trim="pageForm.resourceUrl" clearable type="text" style="width:330px;" />
          </FormItem>
          <FormItem label="限制接口" prop="requestUrl" v-show="pageForm.type !== 0">
            <Input
              v-model.trim="pageForm.requestUrl"
              type="textarea"
              style="width:330px;"
              autosize
            />
          </FormItem>
          <FormItem label="描述:" prop="resourceDesc">
            <Input v-model.trim="pageForm.resourceDesc" clearable type="text" style="width:330px;" />
          </FormItem>
        </Form>
        <div style="position:relative" v-if="pageForm.type === 1 && pageForm.edit == 1">
          <Button style="position:absolute;top:-40px;right:0;" type="primary" @click="addBtn">增加按钮</Button>
        </div>
        <Table
          border
          :columns="columnsBtn"
          :data="rowDataBtn"
          align="center"
          key="rowDataBtn"
          v-if="pageForm.type === 1 && pageForm.edit == 1"
        >
          <template slot-scope="{ row }" slot="resourceName">
            <Input v-model="row.resourceName" type="textarea" v-if="row.isEdit" autosize />
            <span v-else>{{row.resourceName}}</span>
          </template>
          <template slot-scope="{ row }" slot="resourceDesc">
            <Input v-model="row.resourceDesc" type="textarea" v-if="row.isEdit" autosize />

            <span v-else>{{row.resourceDesc}}</span>
          </template>
          <template slot-scope="{ row }" slot="resourceUrl">
            <Input v-model="row.resourceUrl" type="textarea" v-if="row.isEdit" autosize />

            <span v-else>{{row.resourceUrl}}</span>
          </template>
          <template slot-scope="{ row }" slot="requestUrl">
            <Input v-model="row.requestUrl" type="textarea" v-if="row.isEdit" autosize />

            <span v-else>{{row.requestUrl}}</span>
          </template>
          <template slot-scope="{ row ,index}" slot="operator">
            <div>
              <Button
                @click="editBtn(row,index)"
                style="margin-left:10px"
                size="small"
                type="primary"
                v-if="!row.isEdit"
              >编辑</Button>
              <Button
                style="margin-left:10px"
                size="small"
                v-else-if="row.isEdit"
                @click="saveEdit(row,index)"
              >完成</Button>
              <Poptip confirm title="确定删除当前按钮?" @on-ok="delBtn(row.id)" transfer>
                <Button style="margin-left:10px" size="small" type="error" v-if="!row.isEdit">删除</Button>
              </Poptip>
            </div>
          </template>
        </Table>
      </div>
      <div slot="footer">
        <Button @click="pageModal = false" style="margin-right:10px;">取消</Button>
        <Poptip confirm title="确定删除当前页面?" @on-ok="delSecPage" transfer>
          <Button type="error" v-if="pageForm.type === 1 && pageForm.edit === 1">删除</Button>
        </Poptip>
        <Button @click="pageModalSubmit" type="primary" style="margin-left:10px;">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import axios from "@/libs/api.request";
import moment from "moment";
moment.locale("zh-cn");

export default {
  name: "resourceSet",
  data() {
    return {
      pageModal: false,
      pageForm: {
        type: 0,
        resourceName: "",
        resourceUrl: "",
        requestUrl: "",
        resourceDesc: "",
        parentId: 0,
        parentName: "",
        edit: 0
      },
      validateEdit: {
        resourceName: [
          { required: true, message: "请填写页面名称", trigger: "blur" }
        ],
        resourceUrl: [
          { required: true, message: "请填写页面路径", trigger: "blur" }
        ],
        resourceDesc: [
          { required: true, message: "请填写描述", trigger: "blur" }
        ]
      },
      tableLoading: false,
      rowDataBtn: [],
      columnsBtn: [
        {
          key: "index",
          title: "序号",
          align: "center",
          width: 100
        },
        {
          key: "id",
          title: "ID",
          align: "center",
          width: 100
        },

        {
          slot: "resourceName",
          title: "资源名称",
          align: "center"
        },
        {
          slot: "resourceUrl",
          title: "资源路径",
          align: "center"
        },
        {
          slot: "requestUrl",
          title: "限制接口",
          align: "center"
        },
        {
          slot: "resourceDesc",
          title: "描述",
          align: "center"
        },

        {
          slot: "operator",
          title: "操作",
          align: "center",
          width: 160
        }
      ],
      columns: [
        {
          key: "index",
          title: "序号",
          align: "center",
          width: 100
        },
        {
          key: "id",
          title: "ID",
          align: "center",
          width: 100
        },

        {
          key: "resourceName",
          title: "资源名称",
          align: "center"
        },
        {
          key: "resourceDesc",
          title: "描述",
          align: "center"
        },
        {
          key: "resourceUrl",
          title: "资源路径",
          align: "center"
        },
        {
          slot: "sonResources",
          title: "二级页面",
          align: "center"
        },
        {
          slot: "operator",
          title: "操作",
          align: "center",
          width: 220
        }
      ],
      rowData: [],
      presentParentId: 0
    };
  },
  methods: {
    addBtn() {
      let lt = this.rowDataBtn.length;
      for (let i = 0; i < lt; i++) {
        if (this.rowDataBtn[i].isEdit) {
          this.$Message.error("请先保存");
          return;
        }
      }
      let obj = {
        index: this.indexFormat(this.rowDataBtn),
        isMenu: 2,
        parentId: this.pageForm.parentId,
        requestUrl: "",
        resourceAttr: "",
        resourceDesc: "",
        resourceName: "",
        resourceType: 2,
        resourceUrl: "",
        sonResources: [],
        isEdit: true
      };
      this.rowDataBtn.unshift(obj);
    },
    saveEdit(row, index) {
      if (
        !row.resourceDesc ||
        !row.resourceName ||
        !row.resourceUrl ||
        !row.requestUrl
      ) {
        this.$Message.error("输入不完整");
        return;
      }
      row.parentId = this.presentParentId;
      let url = row.id ? "/sys/auth/resource/update" : "/sys/auth/resource/add";
      let postData = row;
      axios
        .request({
          url,
          method: "post",
          data: postData
        })
        .then(d => {
          if (d.data.code == 0) {
            row.id
              ? this.$Message.success("修改成功")
              : this.$Message.success("添加成功");
            this.tableLoading = true;
            axios
              .request({
                url: "/sys/auth/resource/allmgr",
                method: "get"
              })
              .then(d => {
                this.rowData = d.data.data;
                this.rowData.forEach(item => {
                  item.sonResources.forEach(stem => {
                    if (stem.id === this.presentParentId) {
                      this.rowDataBtn = JSON.parse(
                        JSON.stringify(stem.sonResources)
                      );
                      this.rowDataBtn.forEach(item => {
                        item.isEdit = false;
                      });
                    }
                  });
                });
                this.tableLoading = false;
              })
              .catch(() => {
                this.tableLoading = false;
              });
          } else {
            this.$Message.error(d.data.msg);
          }
        })
        .catch(err => {
          this.$Message.error("网络错误" + err);
        });
    },
    editBtn(row, index) {
      let lt = this.rowDataBtn.length;
      for (let i = 0; i < lt; i++) {
        if (this.rowDataBtn[i].isEdit) {
          this.$Message.error("请先保存");
          return;
        }
      }
      this.$set(this.rowDataBtn[index], "isEdit", true);
      let arr = JSON.parse(JSON.stringify(this.rowDataBtn));
      this.rowDataBtn = [];
      this.rowDataBtn = arr;
      console.log(this.rowDataBtn);
    },
    indexFormat(arr) {
      if (!arr.length) {
        return 0;
      }
      let index = arr.map(item => {
        return item.index;
      });
      index.sort((a, b) => {
        return a - b;
      });
      return index[index.length - 1] + 1;
    },
    searchData() {
      this.tableLoading = true;
      axios
        .request({
          url: "/sys/auth/resource/allmgr",
          method: "get"
        })
        .then(d => {
          this.rowData = d.data.data;
          this.tableLoading = false;
        })
        .catch(() => {
          this.tableLoading = false;
        });
    },
    addPage(type, edit, row, resourceName) {
      console.log(type, edit, row);
      if (edit === 0) {
        if (type === 1) {
          this.pageForm.parentId = row.id;
          this.pageForm.parentName = row.resourceName;
          this.pageForm.index = this.indexFormat(row.sonResources);
        } else if (type === 0) {
          this.pageForm.index = this.indexFormat(this.rowData);
        }
      } else {
        this.pageForm = JSON.parse(JSON.stringify(row));
        this.pageForm.parentName = resourceName;
        if (type === 1) {
          this.presentParentId = row.id;
          this.rowDataBtn = JSON.parse(JSON.stringify(row.sonResources));
          this.rowDataBtn.forEach(item => {
            item.isEdit = false;
          });
          console.log(this.rowDataBtn);
        }
      }
      this.pageForm.type = type;
      this.pageForm.edit = edit;
      this.$nextTick(() => {
        this.pageModal = true;
      });
    },
    closePageModal(flag) {
      if (!flag) {
        // this.pageForm = {
        //   type: 0,
        //   resourceName: "",
        //   resourceUrl: "",
        //   requestUrl: "",
        //   resourceDesc: "",
        //   parentId: 0,
        //   parentName: "",
        //   edit: 0
        // };
        this.$refs.pageForm.resetFields();
      }
    },
    pageModalSubmit() {
      if (this.pageForm.type === 0) {
        this.pageForm.requestUrl = " ";
      }
      this.$refs.pageForm.validate(valid => {
        if (valid) {
          let postData = {
            requestUrl: this.pageForm.requestUrl.trim(),
            resourceUrl: this.pageForm.resourceUrl,
            resourceName: this.pageForm.resourceName,
            resourceDesc: this.pageForm.resourceDesc,
            index: this.pageForm.index,
            resourceAttr: ""
          };
          let url;
          if (this.pageForm.edit === 0) {
            postData.resourceType = this.pageForm.type;
            postData.isMenu = this.pageForm.type === 0 ? 1 : 0;
            postData.parentId =
              this.pageForm.type === 0 ? 0 : this.pageForm.parentId;
            url = "/sys/auth/resource/add";
          } else {
            postData.resourceType = this.pageForm.type;
            postData.isMenu = this.pageForm.type === 0 ? 1 : 0;
            postData.parentId =
              this.pageForm.type === 0 ? 0 : this.pageForm.parentId;
            postData.id = this.pageForm.id;
            url = "/sys/auth/resource/update";
          }
          console.log(postData);

          axios
            .request({
              url,
              method: "post",
              data: postData
            })
            .then(d => {
              if (d.data.code == 0) {
                this.pageForm.edit === 0
                  ? this.$Message.success("添加成功")
                  : this.$Message.success("修改成功");
                this.pageModal = false;
                this.searchData();
              } else {
                this.$Message.error(d.data.msg);
              }
            })
            .catch(err => {
              this.$Message.error("网络错误" + err);
            });
        } else {
        }
      });
    },
    delMenu(id) {
      axios
        .request({
          url: "/sys/auth/resource/delete/" + id,
          method: "get"
        })
        .then(d => {
          if (d.data.code == 0) {
            this.$Message.success("删除成功");
            this.searchData();
          } else {
            this.$Message.error(d.data.msg);
          }
        })
        .catch(err => {
          this.$Message.error("网络错误" + err);
        });
    },
    delBtn(id) {
      axios
        .request({
          url: "/sys/auth/resource/delete/" + id,
          method: "get"
        })
        .then(d => {
          if (d.data.code == 0) {
            this.$Message.success("删除成功");
            axios
              .request({
                url: "/sys/auth/resource/allmgr",
                method: "get"
              })
              .then(d => {
                this.rowData = d.data.data;
                this.rowData.forEach(item => {
                  item.sonResources.forEach(stem => {
                    if (stem.id === this.presentParentId) {
                      this.rowDataBtn = JSON.parse(
                        JSON.stringify(stem.sonResources)
                      );
                      this.rowDataBtn.forEach(item => {
                        item.isEdit = false;
                      });
                    }
                  });
                });
                this.tableLoading = false;
              })
              .catch(() => {
                this.tableLoading = false;
              });
          } else {
            this.$Message.error(d.data.msg);
          }
        })
        .catch(err => {
          this.$Message.error("网络错误" + err);
        });
    },
    delSecPage() {
      axios
        .request({
          url: "/sys/auth/resource/delete/" + this.pageForm.id,
          method: "get"
        })
        .then(d => {
          if (d.data.code == 0) {
            this.$Message.success("删除成功");
            this.pageModal = false;
            this.searchData();
          } else {
            this.$Message.error(d.data.msg);
          }
        })
        .catch(err => {
          this.$Message.error("网络错误" + err);
        });
    }
  },
  created() {
    this.searchData();
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
  computed: {
    pageModalInfo() {
      if (this.pageForm.type === 0 && this.pageForm.edit === 0) {
        return {
          title: "新增菜单",
          name: "菜单名称"
        };
      } else if (this.pageForm.type === 0 && this.pageForm.edit === 1) {
        return {
          title: "菜单编辑",
          name: "菜单名称"
        };
      } else if (this.pageForm.type === 1 && this.pageForm.edit === 0) {
        return {
          title: "新增页面",
          name: "页面名称"
        };
      } else if (this.pageForm.type === 1 && this.pageForm.edit === 1) {
        return {
          title: "页面编辑",
          name: "页面名称"
        };
      }
    }
  }
};
</script>

<style scoped>
ul,
li {
  list-style: none;
}
</style>
