<template>
  <div class="uploadTips" v-if="showBtn">
    <Button type="success" @click="openVisible">查看批量上传结果</Button>
    <Drawer title="上传结果" v-model="drawerValue" width="720" :mask-closable="false" :styles="styles">
      <div style="position:relative;" v-if="uploadShopExist">
        <h2 style="margin-bottom:20px;">添加/移除送审vivo商户结果</h2>
        <div
          v-if="uploadShopCount"
          style="margin-bottom:10px;font-size:14px;"
        >{{'共计'+(uploadShopCount.success+uploadShopCount.error)+'条,操作成功'+uploadShopCount.success+'条,操作失败'+uploadShopCount.error+'条'}}</div>
        <div v-if="endResult.length" style="max-height:300px;overflow:auto;">
          <Alert type="warning" v-for="item in endResult" :key="item">{{item}}</Alert>
        </div>
        <div v-else style="font-size:14px;">{{msg1}}</div>
        <Spin size="large" fix v-if="loading1">
          <Icon type="ios-loading" size="18" class="demo-spin-icon-load"></Icon>
          <div>添加/移除送审vivo商户操作中</div>
        </Spin>
      </div>
      <Divider v-if="uploadShopExist" />
      <div style="position:relative;" v-if="assignOnlineExist">
        <h2 style="margin-bottom:10px;">指定上线结果</h2>
        <div
          v-if="assignOnlineCount"
          style="margin-bottom:10px;font-size:14px;"
        >{{'共计'+(assignOnlineCount.success+assignOnlineCount.error)+'条,操作成功'+assignOnlineCount.success+'条,操作失败'+assignOnlineCount.error+'条'}}</div>
        <div v-if="endResult2.length" style="max-height:300px;overflow:auto;">
          <Alert type="warning" v-for="item in endResult2" :key="item">{{item}}</Alert>
        </div>
        <div v-else style="font-size:14px;">{{msg2}}</div>
        <Spin size="large" fix v-if="loading2">
          <Icon type="ios-loading" size="18" class="demo-spin-icon-load"></Icon>
          <div>指定上线操作中</div>
        </Spin>
      </div>
      <Divider v-if="assignOnlineExist" />
      <div class="demo-drawer-footer">
        <Button type="primary" @click="closeDrawerValue">确定</Button>
      </div>
    </Drawer>
  </div>
</template>

<script>
import axios from "@/libs/api.request";
export default {
  name: "uploadTips",
  props: [],
  data() {
    return {
      showBtn: false,
      loading1: true,
      loading2: true,
      endResult: [],
      endResult2: [],
      uploadShopExist: false,
      assignOnlineExist: false,
      taskId: "",
      requestId: "",
      drawerValue: false,
      styles: {
        height: "calc(100% - 55px)",
        overflow: "auto",
        paddingBottom: "53px",
        position: "static"
      },
      msg1: "",
      msg2: "",
      assignOnlineCount: null,
      uploadShopCount: null
    };
  },
  mounted() {
    this.Observer.$on("uploadShop", (taskId, type) => {
      if (this.taskId && this.taskId != taskId) {
        this.$Message.error("上次操作未完成");
      } else {
        this.showBtn = true;
        this.endResult = [];
        this.uploadShopExist = true;
        this.loading1 = true;
        this.taskId = taskId;
        this.$Message.success("文件上传成功,请等待处理结果");
        this.loadingPost(taskId, type);
      }
    });
    this.Observer.$on("assignOnline", requestId => {
      if (this.requestId && this.requestId != requestId) {
        this.$Message.error("上次操作未完成");
      } else {
        this.showBtn = true;
        this.endResult2 = [];
        this.loading2 = true;
        this.assignOnlineExist = true;
        this.requestId = requestId;
        this.$Message.success("文件上传成功,请等待处理结果");
        this.loadingPost2(requestId);
      }
    });
  },
  methods: {
    openVisible() {
      this.drawerValue = true;
    },
    closeDrawerValue() {
      this.drawerValue = false;
    },
    loadingPost(taskId) {
      axios
        .request({
          url: "/ad/customizedshops/getSmsMenuSetVivoApprovalStatusResult",
          method: "post",
          data: {
            taskId
          }
        })
        .then(res => {
          if (res.data.code == 0) {
            if (res.data.data.status == 2) {
              this.$Message.success("送审商户设置完成,请查看结果");
              this.taskId = "";
              this.endResult = res.data.data.data.errList;
              this.loading1 = false;
              this.msg1 = "全部成功";
              this.uploadShopCount = {};
              this.uploadShopCount.success = res.data.data.data.successCount;
              this.uploadShopCount.error = res.data.data.data.errCount;
              if (this.$route.name == "shopCustom") {
                this.Observer.$emit("refreshShopCustom");
              }
            } else if (res.data.data.status == 1) {
              setTimeout(() => {
                this.loadingPost(taskId);
              }, 2000);
            } else {
              this.$Message.error(res.data.msg);
              this.msg1 = "操作失败 " + res.data.msg;
              this.loading1 = false;
            }
          } else {
            this.$Message.error(res.data.msg);
            this.msg1 = "操作失败 " + res.data.msg;
            this.loading1 = false;
          }
        })
        .catch(err => {
          this.$Message.error("请求异常");
          this.msg1 = "请求异常";
          this.loading1 = false;
        });
    },
    loadingPost2(requestId) {
      axios
        .request({
          url: "/ad/customizedshops/online/batch/file/result",
          method: "post",
          data: {
            requestId
          }
        })
        .then(res => {
          if (res.data.code == 0) {
            if (res.data.data.status) {
              this.$Message.success("指定上线完成,请查看结果");
              this.requestId = "";
              this.endResult2 = res.data.data.errorDetail;
              this.assignOnlineCount = {};
              this.assignOnlineCount.success = res.data.data.successCount;
              this.assignOnlineCount.error = res.data.data.errorCount;
              this.loading2 = false;
              this.msg2 = "全部成功";
              if (this.$route.name == "shopCustom") {
                this.Observer.$emit("refreshShopCustom");
              }
            } else {
              setTimeout(() => {
                this.loadingPost2(requestId);
              }, 2000);
            }
          } else {
            this.msg2 = "操作失败 " + res.data.msg;
            this.loading2 = false;
            this.$Message.error(res.data.msg);
          }
        })
        .catch(err => {
          this.msg2 = "请求异常";
          this.$Message.error("请求异常");
          this.loading2 = false;
        });
    }
  }
};
</script>
<style scoped>
.uploadTips {
  width: 200px;
  float: left;
  margin-right: 30px;
  height: 68px;
  display: flex;
  align-items: center;
}
.demo-drawer-footer {
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  border-top: 1px solid #e8e8e8;
  padding: 10px 16px;
  text-align: right;
  background: #fff;
}
.demo-spin-icon-load {
  animation: ani-demo-spin 1s linear infinite;
}
@keyframes ani-demo-spin {
  from {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(180deg);
  }
  to {
    transform: rotate(360deg);
  }
}
.demo-spin-col {
  height: 100px;
  position: relative;
  border: 1px solid #eee;
}
</style>
