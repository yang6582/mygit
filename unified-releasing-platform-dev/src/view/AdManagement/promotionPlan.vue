<template>
  <div style="width: 1000px;padding-top:20px;" class="promotionPlan">
    <div class="step">
      <Steps :current="current">
        <Step title="推广计划"></Step>
        <Step title="新建广告"></Step>
        <!--        <Step title="广告配置"></Step>-->
      </Steps>
    </div>

    <div class="step1" v-if="current === 0">
      <!--step1的头部-->
      <div class="step1-header clearfix">
        <div class="step1-newPlan">推广计划：</div>
        <div class="step1-tab">
          <RadioGroup v-model="tabChecked" type="button">
            <Radio label="新建推广计划"></Radio>
            <Radio label="选择已有推广计划"></Radio>
          </RadioGroup>
        </div>
      </div>

      <!--step1的内容区-->
      <div class="step1-con">
        <div class="step1-newPlanCon clearfix step1-newPlanConN" v-show="tabChecked == '新建推广计划'">
          <div>
            <div class="step1-title">
              <span class="necessity">*</span>推广计划名称：
            </div>
            <div class="step1-newPlanName">
              <i-input v-model="newPlanName" style="width:200px;"></i-input>
            </div>
          </div>
          <div>
            <div class="step1-title"><span class="necessity">*</span>计划预算：</div>
            <div class="step1-budget">
              <i-input v-model="newBudget" style="width:200px;"></i-input>
            </div>
          </div>
          <div>
            <div class="step1-title">
              <span class="necessity">*</span>推广目的：
            </div>
            <div class="step1-budget">
              <Select v-model="newPlanExt" style="width:200px">
                <Option value="1">应用下载</Option>
                <Option value="2">应用唤起</Option>
                <Option value="3">落地页访问</Option>
                <Option value="4">按条投放</Option>
              </Select>
            </div>
          </div>
          <div>
            <div class="step1-title">投放日期：</div>
            <div class="step1-budget">
              <DatePicker
                type="daterange"
                :options="disabledDate"
                placement="bottom-end"
                placeholder="请选择日期范围"
                v-model="DateRange"
                style="width: 200px"
              ></DatePicker>
            </div>
          </div>
        </div>

        <div class="step1-newPlanCon clearfix step1-newPlanConN" v-show="tabChecked == '选择已有推广计划'">
          <div>
            <div class="step1-title">
              <span class="necessity">*</span>选择已有计划：
            </div>
            <div class="step1-checkPlans">
              <Select v-model="checkedPlanId" style="width:200px" @on-change="changeBudget">
                <Option
                  v-for="item in planList"
                  :value="item.planId"
                  :key="item.planId"
                >{{ item.planName }}</Option>
              </Select>
            </div>
          </div>

          <div>
            <div class="step1-title"><span class="necessity">*</span>计划预算：</div>
            <div class="step1-budget">
              <i-input v-model="checkedBudget" style="width:200px;" disabled></i-input>
            </div>
          </div>

          <div>
            <div class="step1-title">
              <span class="necessity">*</span>推广目的：
            </div>
            <div class="step1-budget">
              <Select v-model="checkedPlanExt" style="width:200px" placeholder disabled>
                <Option value="1">应用下载</Option>
                <Option value="2">应用唤起</Option>
                <Option value="3">落地页访问</Option>
                <Option value="4">按条投放</Option>
              </Select>
            </div>
          </div>

          <div>
            <div class="step1-title">投放日期：</div>
            <div class="step1-budget">
              <DatePicker
                disabled
                type="daterange"
                placement="bottom-end"
                placeholder
                v-model="checkedDateRange"
                style="width: 200px"
              ></DatePicker>
            </div>
          </div>
        </div>
      </div>
      <div class="nextButtonWrap">
        <i-button
          v-show="tabChecked == '新建推广计划'"
          type="primary"
          @click="step1Next(true)"
          size="large"
          v-if="showAccess('推广计划_创建计划_保存计划')"
        >保存计划</i-button>
        <i-button
          type="primary"
          @click="step1Next(false)"
          size="large"
          style="margin-left: 50px"
          v-if="showAccess('推广计划_创建计划_下一步')"

        >下一步</i-button>
      </div>
    </div>

    <div class="step2" v-else-if="current === 1" style="padding-left:40px;margin-top:20px;">
      <!--step2的头部-->
      <!--      <div class="step2-header clearfix" style="padding-left: 40px;">-->
      <!--        <div class="step2-newPlan">新建广告：</div>-->
      <!--      </div>-->
      <!-- <div style="margin-bottom:20px;display:flex;align-items:center;">
        <RadioGroup v-model="launchType">
          <Radio label="按次投放"></Radio>
          <Radio label="按条投放"></Radio>
        </RadioGroup>
      </div>-->
      <!--step2的内容区-->
      <!-- <div>
        <RadioGroup v-model="adType" type="button" v-if="launchType == '按次投放'">
          <Radio label="菜单"></Radio>
          <Radio label="下一步"></Radio>
          <Radio label="中间页"></Radio>
        </RadioGroup>
      </div>-->
      <div v-if="true">
        <Tabs value="name1">
          <TabPane label="按次投放" name="name1">
            <adOnceCom :planId="planId" :customerId='customerId' :adIndustry='adIndustry'></adOnceCom>
          </TabPane>
          <TabPane label="按条投放" name="name2">
            <adStripCom :planId="planId" :customerId='customerId'></adStripCom>
          </TabPane>
        </Tabs>
      </div>
      <!-- <div class="step2-con">
        <div class="clearfix step2-class">
          <div class="step2-title">
            <span class="necessity">*</span> 广告名称：
          </div>
          <div class="step2-key">
            <i-input v-model="step2.adName"></i-input>
          </div>
        </div>
        <div class="step2-header clearfix step2-class">
          <div class="step2-title">
            <span class="necessity">*</span> 链接：
          </div>
          <div>
            <i-input v-model="step2.link" style="width:550px;"></i-input>
          </div>
        </div>
        <div class="step2-header clearfix step2-class">
          <div class="step2-title">
            <span class="necessity">*</span> 结算方式：
          </div>
          <div>
            <Select v-model="step2.adChargedType" style="width: 100px;">
              <Option
                v-for="item in adChargedTypes"
                :value="item.key"
                :key="item.index"
              >{{ item.value }}</Option>
            </Select>
          </div>
        </div>
        <div class="step2-header clearfix step2-class">
          <div class="step2-title">
            <span class="necessity">*</span>单价：
          </div>
          <div>
            <i-input v-model="step2.adPrice" style="width:227px;">
              <span slot="append">元</span>
            </i-input>
          </div>
        </div>

        <div class="step2-header clearfix step2-class" style="display:flex;align-items:center;">
          <div class="step2-title">
            <span class="necessity">*</span> 广告位：
          </div>
          <div class="step2-tab">
            <RadioGroup v-model="step2.adPositionType" size="large">
              <Radio
                v-for="item in adPositionTypes"
                :key="item.index"
                :label="item.key"
                v-if="item.value === '菜单'"
              >{{item.value}}</Radio>
              <Radio
                v-for="item in adPositionTypes"
                :key="item.index"
                :label="item.key"
                v-if="item.value !== '菜单'"
                disabled
              >{{item.value}}</Radio>
            </RadioGroup>
          </div>
        </div>
        <div class="step1-newPlanCon clearfix step2-class" v-show="menuIsShow">
          <div class="step2-title">预算：</div>
          <div class="step2-key">
            <i-input v-model="step2.adBudget" :maxlength="25"></i-input>
          </div>
        </div>
        <div class="nextButtonWrap">
          <i-button
            type="primary"
            @click="step2Submit(true)"
            :loading="page_loading"
            size="large"
          >提交审核</i-button>
        </div>
      </div> -->
    </div>
    <!-- <div v-show="current === 2" style="margin-top: 26px;">
      <MenuSet @pre-step="stepLast"></MenuSet>
    </div> -->
  </div>
</template>

<script>
import axios from "@/libs/api.request";
import moment from "moment";
import hasShowAccess from "@/libs/hasShowAccess.js";

export default {
  name: "promotionPlan",
  props: ["customId", "planid", "Current"],
  components: {
    MenuSet: () => import("./menuSet.vue"),
    adStripCom:()=>import("./components/adStrip"),
    adOnceCom:()=>import("./components/adOnce")
  },
  data() {
    return {
      disabledDate: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 86400000;
        }
      },
      DateRange: [],
      page_loading: false,
      current: isNaN(this.$route.query.Current)
        ? this.$route.query.Current
        : parseInt(this.$route.query.Current),
      tabChecked: "新建推广计划",
      newPlanName: "",
      newBudget: "0",
      planName: "",
      checkedPlanId: "",
      checkedBudget: "",
      checkedPlanExt: "",
      checkedDateRange: "",
      checkedPlanName: "",
      planList: [],
      adIndustry:[],
      budget: "",
      planId: isNaN(this.$route.query.planid)
        ? this.$route.query.planid
        : parseInt(this.$route.query.planid),
      adGroupId: "",
      customerId: this.$route.query.customId,
      // customerId: 99,
      planIsShow: true,
      adIsShow: false,
      adFromChange: "",
      adPositionTypes: [],
      adChargedTypes: [],
      budgetIsShow: true,
      budgetDefault: "有",
      menuIsShow: true,
      step2: {
        protocol: "http://",
        adName: "",
        adBudget: "",
        link: "",
        adPositionType: "1",
        adChargedType: "",
        adPrice: ""
      },
      newPlanExt: "",
      launchType: "按次投放",
      adType: "菜单"
    };
  },
  computed:{
     showAccess() {
      return el => {
        return hasShowAccess(el);
      };
    },
  },
  methods: {
    step1Next(state) {
      var _this = this;
      if (_this.tabChecked === "新建推广计划") {
        if (!_this.newPlanName) {
          _this.$Modal.warning({
            title: "注意",
            content: "请输入新建计划的名称"
          });
          return;
        }
        if (_this.newPlanName.length > 30) {
          _this.$Modal.warning({
            title: "注意",
            content: "新建计划的名称不能大于30字符"
          });
          return;
        }
        if (this.newBudget) {
          if (0 > this.newBudget || this.newBudget > 100000000) {
            _this.$Modal.warning({
              title: "注意",
              content: "预算范围0-100000000"
            });
            return;
          }
          if (!/^\d{0,8}(\.\d{0,4})?$/.test(this.newBudget)) {
            _this.$Modal.warning({
              title: "注意",
              content: "预算只支持小数点前最多8位，小数点后最多4位"
            });
            return;
          }
        }
        if (!_this.newPlanExt) {
          _this.$Modal.warning({
            title: "注意",
            content: "请选择推广目的"
          });
          return;
        }
        var beginTime =
          this.DateRange[0] !== 0
            ? moment(
                moment(this.DateRange[0]).format("YYYY-MM-DD 00:00:00")
              ).valueOf()
            : "";
        var endTime =
          this.DateRange[1] !== 0
            ? moment(
                moment(this.DateRange[1]).format("YYYY-MM-DD 23:59:59")
              ).valueOf()
            : "";

        var postData = {
          customerId: this.customerId,
          planName: _this.newPlanName,
          beginTime: beginTime,
          endTime: endTime,
          planBudget: _this.newBudget ? parseFloat(_this.newBudget) : null,
          planExt: this.newPlanExt,
          rules: []
        };
        axios
          .request({
            url: "ad/management/plan/add",
            method: "post",
            data: postData
          })
          .then(
            d => {
              if (d.data.code === 0) {
                _this.planId = d.data.data;
                if (state) {
                  this.$router.push({ path: "/adList/adPlanList" });
                } else {
                  _this.current = 1;
                }
              } else {
                this.$Message.error(d.data.msg);
              }
            },
            err => {
              this.$Message.error("请求失败，" + err + "，请稍后再试！");
            }
          );
      } else {
        if (!_this.checkedPlanId) {
          _this.$Modal.warning({
            title: "注意",
            content: "没有选择推广计划"
          });
          return;
        }
        _this.current = 1;
        _this.planId = _this.checkedPlanId;
      }
    },
    getPlanList() {
      var _this = this;
      axios
        .request({
          url: "ad/management/plan/list/" + _this.customerId,
          method: "get"
        })
        .then(
          d => {
            if (d.data.code === 0) {
              _this.planList = d.data.data;
            } else {
              this.$Message.error(d.data.msg);
            }
          },
          err => {
            this.$Message.error("请求失败，" + err + "，请稍后再试!");
          }
        );
    },
    changeBudget(val) {
      this.checkedPlanId = val;
      let selecteditem = this.planList.filter(item => +item.planId === +val);
      this.checkedBudget = selecteditem[0].planBudget;
      this.checkedPlanName = selecteditem[0].planName;
      this.checkedPlanExt = selecteditem[0].planExt;
      this.checkedDateRange = [
        moment.unix(selecteditem[0].beginTime) / 1000,
        moment.unix(selecteditem[0].endTime) / 1000
      ];
      // this.checkedDateRange = [moment.unix(1569686400000),moment.unix(1572019200000)]
    },
    getBasicInfo() {
      var _this = this;
      axios
        .request({
          url: "sys/utils/all",
          method: "get"
        })
        .then(
          d => {
            if (d.data.code === 0) {
              _this.adChargedTypes = d.data.data.sysConfig.adChargedType;
              _this.adPositionTypes = d.data.data.sysConfig.adPositionType;
              this.adIndustry = d.data.data.sysConfig.adIndustry;
            } else {
              this.$Message.error(d.data.msg);
            }
          },
          err => {
            this.$Message.error("请求失败，" + err + "，请稍后再试!");
          }
        );
    },
    changeBudgetState() {
      this.budgetIsShow = !this.budgetIsShow;
    },
    step2Submit(state) {
      if (!this.step2.adName) {
        this.$Modal.warning({
          title: "注意",
          content: "请输入广告名称"
        });
        return;
      }

      if (this.step2.adName.length > 30) {
        this.$Modal.warning({
          title: "注意",
          content: "新建广告名称字符不能超过30个字符"
        });
        return;
      }
      if (!this.step2.link) {
        this.$Modal.warning({
          title: "注意",
          content: "请填写链接"
        });
        return;
      }
      if (
        !/(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/.test(
          this.step2.link
        )
      ) {
        this.$Modal.warning({
          title: "注意",
          content: "请正确填写网址"
        });
        return;
      }
      if (!this.step2.adChargedType) {
        this.$Modal.warning({
          title: "注意",
          content: "请选择结算方式"
        });
        return;
      }
      if (!this.step2.adPrice) {
        this.$Modal.warning({
          title: "注意",
          content: "请填写广告单价"
        });
        return;
      }
      if (this.step2.adPrice < 0 || this.step2.adPrice > 100) {
        this.$Modal.warning({
          title: "注意",
          content: "广告单价范围 0 ~ 100"
        });
        return;
      }
      if (!/^\d{0,3}(\.\d{0,4})?$/.test(this.step2.adPrice)) {
        this.$Modal.warning({
          title: "注意",
          content: "广告单价只支持小数点前最多3位，小数点后最多4位"
        });
        return;
      }
      if (!this.step2.adPositionType) {
        this.$Modal.warning({
          title: "注意",
          content: "请勾选广告位类型"
        });
        return;
      }
      // if (!this.step2.adBudget) {
      //   this.$Modal.warning({
      //     title: "注意",
      //     content: "请填写预算"
      //   });
      //   return;
      // }
      if (!this.step2.link.includes(".")) {
        this.$Modal.warning({
          title: "注意",
          content: "链接必须包含一个."
        });
        return;
      }
      if (this.step2.adBudget) {
        if (this.step2.adBudget < 0 || this.step2.adBudget > 100000000) {
          this.$Modal.warning({
            title: "注意",
            content: "预算范围 0 ~ 100000000"
          });
          return;
        }
      }
      if (this.step2.adBudget) {
        if (!/^\d{0,8}(\.\d{0,4})?$/.test(this.step2.adBudget)) {
          this.$Modal.warning({
            title: "注意",
            content: "预算只支持小数点前最多8位，小数点后最多4位"
          });
          return;
        }
      }

      this.page_loading = true;
      var postData = {
        adName: this.step2.adName,
        adUrl: this.step2.link,
        customizedCode: "",
        planId: this.planId,
        customerId: this.customerId,
        adBudget: parseFloat(Number(this.step2.adBudget)),
        adChargedType: Number(this.step2.adChargedType),
        adPositionTypes: Array(this.step2.adPositionType.toString()),
        adPutonType: 1,
        adPrice: parseFloat(this.step2.adPrice),
        beginTime: "",
        endTime: "",
        adExt: "",
        approvalStatus: 2,
        rules: [],
        adGroupId: this.adGroupId
      };
      var _this = this;
      axios
        .request({
          url: "ad/management/ads/add",
          method: "post",
          data: postData
        })
        .then(
          d => {
            if (d.data.code === 0) {
              _this.adGroupId = d.data.data;
              if (state) {
                _this.$router.push({ path: "/adList/AdAduit" });
                _this.page_loading = false;
              } else {
                _this.current = this.current + 1;
                _this.page_loading = false;
              }
            } else {
              _this.$Message.error(d.data.msg);
              _this.page_loading = false;
            }
          },
          err => {
            _this.$Message.error("请求失败，" + err + "，请稍后再试！");
            _this.page_loading = false;
          }
        );
    },
    stepLast() {
      this.current -= 1;
    },
  },
  created() {
    this.getPlanList();
    this.getBasicInfo();
  }
};
</script>

<style lang="less" scoped>
@media (max-width: 600px) {
  .step1-con {
    width: 700px;
  }
}
.necessity {
  color: red;
}

.promotionPlan {
  .step1,
  .step2,
  .step3 {
    width: 1000px;
    margin-top: 40px;
  }
  .step {
    padding-left: 40px;
    background-color: rgb(243, 246, 248);
  }
  /deep/ .ivu-steps .ivu-steps-head {
    background-color: rgb(243, 246, 248);
  }
  /deep/ .ivu-steps .ivu-steps-title {
    background-color: rgb(243, 246, 248);
  }
  .step,
  .nextButtonWrap {
    width: 1000px;
    /*margin: 0 auto;*/
  }
  .nextButtonWrap {
    text-align: center;
    /*margin: 0 0 0 -150px;*/
  }
  .step1-header {
    padding-left: 80px;
    .step1-newPlan,
    .step1-tab {
      float: left;
    }
    .step1-newPlan {
      padding-top: 5px;
      height: 32px;
      font: bold 16px "微软雅黑";
    }
  }
  .step1 {
    display: flex;
    flex-direction: column;
    .step1-header {
      .step1-newPlan,
      .step1-tab {
        float: left;
      }
      .step1-newPlan {
        padding-top: 5px;
        height: 32px;
        font: bold 16px "微软雅黑";
      }
    }
    .step1-con {
      width: 1000px;
      margin: 24px 0 50px 0;
      background-color: rgb(243, 246, 248);

      padding: 10px 30px;
      div {
        float: left;
      }
      .step1-title {
        height: 32px;
        line-height: 32px;
        text-align: right;
        width: 150px;
      }
    }
  }

  .step2 {
    display: flex;
    flex-direction: column;
    .step2-header {
      .step2-newPlan,
      .step2-tab {
        float: left;
      }
      .step2-newPlan {
        padding-top: 5px;
        height: 32px;
        font: bold 16px "微软雅黑";
      }
    }
    .step2-con {
      display: flex;
      flex-direction: column;
      width: 1000px;
      margin: 24px 0 50px 0;
      ///padding: 30px;
      div {
        float: left;
      }
      .step2-title {
        height: 32px;
        line-height: 32px;
        text-align: right;
        width: 80px;
      }
      .step2-key {
        width: 200px;
      }
    }
    .step2-class {
      margin-bottom: 20px;
    }
  }
  .step1-newPlanConN {
    display: flex;
    flex-direction: column;
    > div {
      margin-bottom: 20px;
    }
  }
}
</style>
