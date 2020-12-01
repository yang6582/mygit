<template>
  <div style="width:100%;height:100%;">
    <div v-if="haveAccess || haveHome" style="display:flex;">
      <img
        src="../../../../public/timg.gif"
        alt
        class="imgClass"
        title="Click me ~ ~"
        @click="imgModal = true"
      />
      <div style="width:60%" v-if="haveHome">
        <Card style="width:100%;margin-bottom:20px;">
          <p slot="title">今日新增广告：(CPC/CPS)</p>
          <div>
            <Table border :columns="columns" :data="newAddData" :loading="newAddDataLoading">
              <template slot-scope="{row, index}" slot="adUrl">
                <Tooltip placement="top" transfer>
                  <div
                    slot="content"
                    style="width: 220px; white-space: normal;word-break: break-all;"
                  >{{row.adUrl}}</div>
                  <Button size="small" style="color:#59afed">查看</Button>
                </Tooltip>
              </template>
            </Table>
            <div style="display:flex;justify-content: flex-end;">
              <Page
                :total="pageNewAdd.totalCount"
                size="small"
                :current="pageNewAdd.pageIndex"
                @on-change="pageChangeNewAdd"
                :page-size="pageNewAdd.pageSize"
                show-total
                style="margin-top:10px"
              ></Page>
            </div>
          </div>
        </Card>
        <Card style="width:100%;margin-bottom:20px;">
          <p slot="title">今日下线广告：(CPC/CPS)</p>
          <div>
            <Table border :columns="columns" :data="offlineData" :loading="OfflineLoading">
              <template slot-scope="{row, index}" slot="adUrl">
                <Tooltip placement="top" transfer>
                  <div
                    slot="content"
                    style="width: 220px; white-space: normal;word-break: break-all;"
                  >{{row.adUrl}}</div>
                  <Button size="small" style="color:#59afed">查看</Button>
                </Tooltip>
              </template>
            </Table>
            <div style="display:flex;justify-content: flex-end;">
              <Page
                :total="pageOffline.totalCount"
                size="small"
                :current="pageOffline.pageIndex"
                @on-change="pageChangeOffline"
                :page-size="pageOffline.pageSize"
                show-total
                style="margin-top:10px;"
              ></Page>
            </div>
          </div>
        </Card>
        <Card style="width:100%;">
          <p slot="title">广告调价记录:</p>
          <div>
            <Table border :columns="adjustColumns" :data="adjustData" :loading="AdjustLoading">
              <template slot-scope="{row, index}" slot="adUrl">
                <Tooltip placement="top" transfer>
                  <div
                    slot="content"
                    style="width: 220px; white-space: normal;word-break: break-all;"
                  >{{row.adUrl}}</div>
                  <Button size="small" style="color:#59afed">查看</Button>
                </Tooltip>
              </template>
              <template slot-scope="{row, index}" slot="optTime">
                <span>{{row.optTime | formatDate}}</span>
              </template>
            </Table>
            <div style="display:flex;justify-content: flex-end;">
              <Page
                :total="pageAdjust.totalCount"
                size="small"
                :current="pageAdjust.pageIndex"
                @on-change="pageChangeAdjust"
                :page-size="pageAdjust.pageSize"
                show-total
                style="margin-top:10px;"
              ></Page>
            </div>
          </div>
        </Card>
      </div>
      <div style="margin-left:20px;width:calc( 40% - 20px );">
        <div>
          <!-- <img src="../../../../public/calendar.png" alt style="widht:100%;"/> -->
          <CalendarCom class="CalendarCom"></CalendarCom>
        </div>
        <Card style="margin-bottom:20px;">
          <p slot="title">个人记事本</p>
          <div @click="openEditMoadl('add')" slot="extra">
            <Icon type="md-add-circle" size="22" style="cursor: pointer;" />
          </div>
          <div style="min-height:200px;max-height:300px;overflow:auto;">
            <!-- <div
              style="height:30px;display:flex;justify-content:space-between;border-bottom:1px solid black"
            >
              <div style="line-height:30px;font-weight:bold;">任务</div>
              <div style="line-height:30px;cursor: pointer;" @click="openEditMoadl('add')">
                <Icon type="md-add-circle" size="22" />
              </div>
            </div>-->
            <ul>
              <li
                v-for="(item,index) in notepad"
                :key="index"
                style="height:70px;padding:10px 0;display:flex;justify-content:space-between;border-bottom:1px solid #ccc"
              >
                <div style="width:70%">
                  <Poptip placement="left" trigger="hover" transfer style="width:100%;" word-wrap>
                    <div
                      slot="title"
                      style="max-width: 300px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;font-weight:bold;font-size:14px;"
                    >{{item.taskName}}</div>
                    <div
                      slot="content"
                      style="width:300px; white-space: normal;word-break: break-all;"
                      class="taskClass"
                      v-html="item.taskDetail"
                    ></div>
                    <h4
                      style="height:30px;line-height:30px;font-size:14px;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;cursor: pointer;max-width:200px;"
                    >{{item.taskName}}</h4>
                  </Poptip>

                  <h5
                    style="height:20px;line-height:20px;font-size:12px;font-weight:normal"
                  >{{item.updateTime | formatDate}}</h5>
                </div>
                <div style="widht:30px;display:flex;align-items:center;">
                  <Icon
                    type="md-create"
                    size="22"
                    title="编辑"
                    style="margin-right:10px;cursor: pointer;"
                    @click="openEditMoadl('update',item)"
                  />
                  <Icon
                    type="md-trash"
                    size="22"
                    title="删除"
                    style="cursor: pointer;"
                    @click="delEdit(item.id)"
                  />
                </div>
              </li>
            </ul>
          </div>
        </Card>
      </div>
    </div>
    <!-- <div style="padding: 0 40px; display: block" v-if="false">
      <div style="width: 50%; margin-top: 64.5px">
        <div style="color:#666666; font-size: 50px; margin-top: 30px;padding-left:40px;">统一投放平台</div>
        <div
          style="font-size: 60px; font-weight:bold; color:#222d39; margin-top: 10px;padding-left:40px;"
        >让工作更高效</div>
        <div
          style="line-height: 30px; color: rgb(103, 114, 148); font-size: 14px; margin-top: 20px;padding-left:40px;"
        >欢迎访问统一投放平台！ 统一投放平台，让工作更高效</div>
      </div>
      <div style="margin-top: 64.5px">
        <img style="max-width: 50%" src="../../../../public/home.png" />
      </div>
    </div>-->
    <div v-else>
      <section class="page_404">
        <div class="container">
          <div class="row">
            <div class="col-sm-12">
              <div class="col-sm-10 col-sm-offset-1 text-center">
                <div class="four_zero_four_bg">
                  <h1
                    class="text-center"
                    style="font-size:40px;padding-left:50px;color:black;"
                  >您没有相关权限,请联系管理员!</h1>
                </div>

                <!-- <div class="contant_box_404">
                  <h3 class="h2">Look like you're lost</h3>

                  <p>the page you are looking for not avaible!</p>

                  <a href class="link_404">Go to Home</a>
                </div>-->
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
    <Modal v-model="editModal" width="800" title="写点什么">
      <div>
        <div style="margin-bottom:20px;font-weight:bold;">
          <!-- <span style="margin-right:10px;font-size:14px;">标题:</span> -->
          <Input v-model="editTitle" placeholder="请输入标题" style="width: 300px" clearable />
        </div>
        <div id="editor"></div>
        <editor ref="editor" :value="editConte" @on-change="handleChangeEdit" />
      </div>
      <div slot="footer">
        <Button @click="editModal = false" style>取消</Button>
        <Button @click="confirmEdit" type="primary">确定</Button>
      </div>
    </Modal>
    <Modal v-model="imgModal" width="550" title="日历" footer-hide :styles="{top: '20px'}">
      <div style="text-align:center;">
        <img src="../../../../public/calendar.png" alt style="height:800px;" />
      </div>
    </Modal>
  </div>
</template>

<script>
import InforCard from "_c/info-card";
import CountTo from "_c/count-to";
import { ChartPie, ChartBar } from "_c/charts";
import Example from "./example.vue";
import config from "./config";
import Swiper from "swiper";
import "swiper/css/swiper.min.css";
import store from "@/store";
import Editor from "_c/editor";
import axios from "@/libs/api.request";
import moment from "moment";
moment.locale("zh-cn");
export default {
  name: "home",
  components: {
    InforCard,
    CountTo,
    ChartPie,
    ChartBar,
    Example,
    Editor,
    CalendarCom: () => import("@/components/Calendar/index.vue")
  },
  computed: {
    haveAccess() {
      return store.state.app.menuListFormat &&
        store.state.app.menuListFormat.length
        ? true
        : false;
    },
    haveHome() {
      return store.state.app.haveHome;
    }
  },
  data() {
    return {
      imgModal: false,
      editId: 0,
      editTitle: "",
      editConte: "",
      editModal: false,
      split: 0.5,
      columns: config.columns,
      adjustColumns: config.adjustColumns,
      newAddData: [],
      offlineData: [],
      adjustData: [],
      pageNewAdd: {
        pageSize: 3,
        pageIndex: 1,
        totalCount: 0
      },
      pageAdjust: {
        pageSize: 3,
        pageIndex: 1,
        totalCount: 0
      },
      pageOffline: {
        pageSize: 3,
        pageIndex: 1,
        totalCount: 0
      },
      OfflineLoading: false,
      AdjustLoading: false,
      notepad: [
        // {
        //   updateTime: "2019/1/2",
        //   taskName: "我是标题",
        //   taskDetail: "我是内用"
        // }
      ],
      editType: "add",
      newAddDataLoading: false
    };
  },
  created() {
    this.getNote();
    if (this.haveHome) {
      this.searchNewAdd(true);
      this.searchOffline(true);
      this.searchAdjust(true);
    }
  },
  methods: {
    searchAdjust(flag) {
      this.AdjustLoading = true;
      if (flag) {
        this.pageAdjust.pageIndex = 1;
      }
      axios
        .request({
          url: "/ad/management/ads/getTodayModifyRecords",
          method: "post",
          data: {
            pageSize: this.pageAdjust.pageSize,
            pageIndex: this.pageAdjust.pageIndex
          }
        })
        .then(res => {
          if (res.data.code == 0) {
            this.adjustData = res.data.data.data;
            this.pageAdjust.totalCount = res.data.data.total;
          } else {
            this.$Message.error(res.data.msg);
          }
          this.AdjustLoading = false;
        })
        .catch(err => {
          this.$Message.error("网络错误");
          this.AdjustLoading = false;
        });
    },
    searchNewAdd(flag) {
      this.newAddDataLoading = true;
      if (flag) {
        this.pageNewAdd.pageIndex = 1;
      }
      axios
        .request({
          url: "/ad/management/ads/getTodayAddedAds",
          method: "post",
          data: {
            pageSize: this.pageNewAdd.pageSize,
            pageIndex: this.pageNewAdd.pageIndex
          }
        })
        .then(res => {
          if (res.data.code == 0) {
            this.newAddData = res.data.data.data;
            this.pageNewAdd.totalCount = res.data.data.total;
          } else {
            this.$Message.error(res.data.msg);
          }
          this.newAddDataLoading = false;
        })
        .catch(err => {
          this.$Message.error("网络错误");
          this.newAddDataLoading = false;
        });
    },
    searchOffline(flag) {
      this.OfflineLoading = true;
      if (flag) {
        this.pageOffline.pageIndex = 1;
      }
      axios
        .request({
          url: "/ad/management/ads/getTodayOfflineAds",
          method: "post",
          data: {
            pageSize: this.pageOffline.pageSize,
            pageIndex: this.pageOffline.pageIndex
          }
        })
        .then(res => {
          if (res.data.code == 0) {
            this.offlineData = res.data.data.data;
            this.pageOffline.totalCount = res.data.data.total;
          } else {
            this.$Message.error(res.data.msg);
          }
          this.OfflineLoading = false;
        })
        .catch(err => {
          this.$Message.error("网络错误");
          this.OfflineLoading = false;
        });
    },
    handleChangeEdit(html, text) {
      this.editConte = html;
    },
    pageChangeOffline(index) {
      this.pageOffline.pageIndex = index;
      this.searchOffline();
    },
    pageChangeNewAdd(index) {
      this.pageNewAdd.pageIndex = index;
      this.searchNewAdd();
    },
    pageChangeAdjust(index) {
      this.pageAdjust.pageIndex = index;
      this.searchAdjust();
    },
    openEditMoadl(editType, row) {
      this.editType = editType;
      this.editModal = true;
      if (row) {
        this.$refs.editor.setHtml(row.taskDetail);
        this.editId = row.id;
        this.editTitle = row.taskName;
      } else {
        this.editTitle = "";
        this.$refs.editor.setHtml(" ");
      }
    },
    confirmEdit() {
      let url =
        this.editType == "add"
          ? "/sys/auth/user/scheduletasks/add"
          : "/sys/auth/user/scheduletasks/update";
      let postData = {
        taskName: this.editTitle,
        taskDetail: this.editConte
      };
      this.editType == "update" ? (postData.id = this.editId) : false;
      axios
        .request({
          url,
          method: "post",
          data: postData
        })
        .then(res => {
          if (res.data.code == 0) {
            this.$Message.success(
              this.editType == "add" ? "添加成功!" : "更新成功!"
            );
            this.editModal = false;
            this.getNote();
          } else {
            this.$Message.error(res.data.msg);
          }
          this.tableLoading = false;
        })
        .catch(err => {
          this.$Message.error("网络错误");
          this.tableLoading = false;
        });
    },
    getNote() {
      axios
        .request({
          url: "/sys/auth/user/scheduletasks/list",
          method: "get"
        })
        .then(res => {
          if (res.data.code == 0) {
            this.notepad = res.data.data;
          } else {
            this.$Message.error(res.data.msg);
          }
          this.tableLoading = false;
        })
        .catch(err => {
          this.$Message.error("网络错误");
          this.tableLoading = false;
        });
    },
    delEdit(id) {
      axios
        .request({
          url: "/sys/auth/user/scheduletasks/delete/" + id,
          method: "get"
        })
        .then(res => {
          if (res.data.code == 0) {
            this.$Message.success("删掉啦~");
            this.getNote();
          } else {
            this.$Message.error(res.data.msg);
          }
        })
        .catch(err => {
          this.$Message.error(err);
        });
    }
  },
  mounted() {},
  filters: {
    formatDate(value) {
      return moment(value).format("YYYY-MM-DD HH:mm:ss");
    }
  }
};
</script>

<style lang="less">
.count-style {
  font-size: 50px;
}
.swiper-container {
  width: 100%;
  height: 60px;
}
.melodyPrice {
  display: flex;
  > div {
    width: 20%;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
.melodyPriceItem {
  height: 100%;
  display: flex;
  align-items: center;
}
.melodyPriceTitle {
  border-bottom: 1px solid #e5e7e9;
  padding-bottom: 16px;
  > div {
    border-right: 1px solid #e5e7e9;
    font-weight: bold;
  }
  > div:nth-of-type(1) {
    border-left: 1px solid #e5e7e9;
  }
}

/*======================
    404 page
=======================*/

.page_404 {
  padding: 40px 0 0;
  background: #fff;
  font-family: "Arvo", serif;
}

.page_404 img {
  width: 100%;
}

.four_zero_four_bg {
  background: url(https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif)
    50% no-repeat;
  height: 400px;
  background-position: center;
}

.four_zero_four_bg h1 {
  font-size: 80px;
}

.four_zero_four_bg h3 {
  font-size: 80px;
}

.link_404 {
  color: #fff !important;
  padding: 10px 20px;
  background: #39ac31;
  margin: 20px 0;
  display: inline-block;
}
.contant_box_404 {
  margin-top: -50px;
}
.taskClass /deep/ table {
  border-top: 1px solid black !important;
  border-left: 1px solid #999 !important;
  border-spacing: 0 !important;
}
.taskClass /deep/ table td {
  border-bottom: 1px solid black !important;
  border-right: 1px solid #999 !important;
}
.taskClass /deep/ table th {
  border-bottom: 1px solid black !important;
  border-right: 1px solid #999 !important;
}
.CalendarCom {
  margin-bottom: 20px;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid #e5e7e9;
}
.imgClass {
  width: 50px;
  position: fixed;
  top: 200px;
  right: 30px;
  cursor: pointer;
}
</style>
