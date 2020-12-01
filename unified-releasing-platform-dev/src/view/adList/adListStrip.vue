<template>
  <div>
    <!-- 测试用style -->
    <div class="layout-search">
      <Form :model="searchForm" inline :label-width="100">
        <FormItem label="广告名称:">
          <Input
            v-model="searchForm.adName"
            placeholder="广告名称"
            @on-enter="searchData(true)"
            clearable
          />
        </FormItem>
        <FormItem label="客户名称:">
          <Input
            v-model="searchForm.customerName"
            placeholder="客户名称"
            @on-enter="searchData(true)"
            clearable
          />
        </FormItem>
        <FormItem label="计划名称:">
          <Input
            v-model="searchForm.planName"
            placeholder="计划名称"
            @on-enter="searchData(true)"
            clearable
          />
        </FormItem>
        <FormItem label="厂商:">
          <Select
            v-model="searchForm.partnerName"
            style="width:140px"
            @on-change="searchData(true)"
          >
            <Option :value="-1">全部</Option>
            <Option
              v-for="(item,key) in partnerNames"
              :value="item.index"
              :key="key"
            >{{ item.value }}</Option>
          </Select>
        </FormItem>
        <FormItem label="状态:">
          <Select
            v-model="searchForm.approvalStatus"
            style="width:140px"
            @on-change="searchData(true)"
          >
            <Option :value="-1">全部</Option>
            <Option :value="2">已上线</Option>
            <Option :value="98">已下线</Option>
            <!-- <Option :value="3">已拒绝</Option> -->
            <Option :value="99">已删除</Option>
          </Select>
        </FormItem>
        <FormItem label="提交时间:">
          <Date-picker
            :value="searchForm.submitTime"
            format="yyyy-MM-dd"
            @on-change="submitTimeChange"
            type="daterange"
            placement="bottom-end"
            placeholder="选择日期"
            style="width: 180px"
            transfer
          ></Date-picker>
        </FormItem>
        <FormItem :label-width="50">
          <Button
            type="primary"
            @click="searchData(true)"
            icon="ios-search"
            style="margin-left:10px"
          >查询</Button>
          <Button type="primary" @click="reset" style="margin-left:10px">重置</Button>
        </FormItem>
      </Form>
    </div>
    <div class="layout-table">
      <!-- 自定义列 -->
      <columnsSelect
        :columns="selectColumns"
        :columnsNum="adTypeSearch"
        @columns-change="columnsChange"
      ></columnsSelect>
      <Table
        border
        :columns="columnsSelection"
        :data="rowData"
        :loading="tableLoading"
        style="min-width:1100px;overflow-x:scroll;margin-top: 20px;"
      >
        <template slot-scope="{row, index}" slot="short_url_data">
          <template>
            <Tooltip
              transfer
              placement="top"
              v-for="(item,index) in row.short_url_data"
              style="margin:5px 0 ;"
              :key="index"
            >
              <div
                slot="content"
                style="width: 220px; white-space: normal;word-break: break-all;"
              >{{item.short_url}}</div>
              <Button
                size="small"
                style="color:#59afed"
                @click="copyShortUrl(item.short_url)"
              >{{item.code}}</Button>
              <br />
            </Tooltip>
          </template>
        </template>
        <template slot-scope="{row, index}" slot="url">
          <Tooltip placement="top" transfer>
            <div
              slot="content"
              style="width: 220px; white-space: normal;word-break: break-all;"
            >{{row.url}}</div>
            <Button size="small" style="color:#59afed" @click="open(row.url)" v-if="row.url">查看</Button>
          </Tooltip>
        </template>
        <template slot-scope="{row, index}" slot="positionNames">
          <span>{{row.adPositionTypeName}}</span>
        </template>
        <!-- <template slot-scope="{row, index}" slot="adChargedType">
          <span>{{row.adChargedTypeName}}</span>
        </template>-->
        <!-- <template slot-scope="{row, index}" slot="createTime">
          <span v-if="row.createTime">{{row.createTime | formatDate}}</span>
          <span v-else></span>
        </template>-->
        <template slot-scope="{row, index}" slot="company_id">
          <span>{{selectCompany(row.company_id)}}</span>
        </template>
        <template slot-scope="{row, index}" slot="status">
          <span>{{selectStatus(row.status)}}</span>
        </template>
        <template slot-scope="{row, index}" slot="update_time">
          <span>{{row.update_time}}</span>
          <!-- <span v-if="row.updateTime">{{row.updateTime | formatDate}}</span>
          <span v-else></span>-->
        </template>
        <template slot-scope="{ row, index }" slot="action">
          <div style="padding:10px 0;display:flex;">
            <Button
              type="primary"
              size="small"
              @click="editCurrentAd(row)"
              v-if="row.status != 99 && showAccess('广告管理_广告列表_按条_编辑')"
            >编辑</Button>
            <Button
              style="margin-left: 10px;"
              size="small"
              type="success"
              v-if="row.status == 98 && showAccess('广告管理_广告列表_按条_上线')"
              @click="handleStatus('onl',row)"
            >上线</Button>
            <Button
              style="margin-left: 10px;"
              size="small"
              type="warning"
              v-if="row.status == 2 && showAccess('广告管理_广告列表_按条_下线')"
              @click="handleStatus('ins',row)"
            >下线</Button>
            <Button
              style="margin-left: 10px;"
              type="error"
              v-if="row.status != 99 && showAccess('广告管理_广告列表_按条_删除')"
              @click="handleStatus('del',row)"
              size="small"
            >删除</Button>
            <Button
              type="success"
              v-if="row.status == 99 && showAccess('广告管理_广告列表_按条_恢复')"
              @click="handleStatus('rec',row)"
              size="small"
            >恢复</Button>
          </div>
        </template>
      </Table>
      <Page
        :total="total_count"
        size="small"
        :current="pageIndex"
        @on-change="pageChange"
        :page-size="pageSize"
        show-total
        show-elevator
        style="margin-top:10px;float:right"
      ></Page>
    </div>
    <Modal title="编辑广告" v-model="showEditAd">
      <div style="padding:0 30px 0 20px;">
        <Form :model="adFormData" :rules="validateEditAd" :label-width="80" ref="editFormValidate">
          <FormItem label="广告名称:" prop="adName">
            <Input v-model="adFormData.adName" clearable />
          </FormItem>
          <FormItem label="商户名:" prop="shop_name">
            <Select
              v-model="adFormData.shop_name"
              clearable
              filterable
              remote
              :remote-method="remoteMethod1"
              :loading="loading1"
            >
              <Option v-for="item in shopNames" :value="item.name" :key="item.id">{{item.name}}</Option>
            </Select>
          </FormItem>
          <FormItem label="厂商:" prop="partnerName">
            <Select v-model="adFormData.partnerName" multiple disabled>
              <Option
                v-for="(item,key) in partnerNames"
                :value="item.index"
                :key="key"
              >{{ item.value }}</Option>
            </Select>
          </FormItem>
          <FormItem label="链接(原链):" prop="url">
            <Input v-model="adFormData.url" type="textarea" disabled :autosize="true" />
            <!-- <span>{{adFormData.url}}</span> -->
          </FormItem>
          <!-- <FormItem label="结算方式" prop="adChargedType">
            <Select v-model="adFormData.adChargedType" style="width: 100px;">
              <Option
                v-for="item in adChargedTypes"
                :value="item.key"
                :key="item.index"
              >{{ item.value }}</Option>
            </Select>
          </FormItem>-->
          <FormItem label="单价:" prop="adPrice">
            <Input v-model="adFormData.adPrice" clearable>
              <span slot="append">元</span>
            </Input>
          </FormItem>
          <!--          <FormItem label="备注:" prop="remark">-->
          <!--            <Input v-model="adFormData.remark" type="textarea" :autosize="{minRows: 2}" />-->
          <!--          </FormItem>-->
        </Form>
      </div>
      <div slot="footer">
        <Button :loading="ad_edit_loading" @click="closeEditAd">取消</Button>
        <Button type="primary" :loading="ad_edit_loading" @click="confirmEditAd">确定</Button>
      </div>
    </Modal>
    <Modal title="删除" v-model="delModal" :mask-closable="false">
      <div style="padding:0 40px;">
        <h4 style="color:red;font-size:18px;margin-bottom:10px;">确定是否删除该广告?</h4>
        <div style="display:flex;">
          <h5 style="line-height:28px;margin-right:10px;font-size:14px;">请选择原因:</h5>
          <RadioGroup v-model="delRadio" vertical>
            <Radio :label="item.label" v-for="item in delOptions" :key="item.label">
              <span>{{item.title}}</span>
            </Radio>
          </RadioGroup>
        </div>
        <Input
          v-model="delCause"
          type="textarea"
          placeholder="选择其他时,请填写原因"
          :maxlength="30"
          style="margin-left:85px;width:250px;"
          v-if="delRadio == 3"
        />
      </div>
      <div slot="footer">
        <Button @click="delModal = false">取消</Button>
        <Button type="primary" @click="delModalOk" :disabled="delRadio == 3 && !delCause">确定</Button>
      </div>
    </Modal>
    <Modal title="下线" v-model="insModal" :mask-closable="false">
      <div style="padding:0 40px;">
        <h4 style="color:red;font-size:18px;margin-bottom:10px;">确定是否下线该广告?</h4>
        <div style="display:flex;">
          <h5 style="line-height:28px;margin-right:10px;font-size:14px;">请选择原因:</h5>
          <RadioGroup v-model="insRadio" vertical>
            <Radio :label="item.label" v-for="item in insOptions" :key="item.label">
              <span>{{item.title}}</span>
            </Radio>
          </RadioGroup>
        </div>
        <Input
          v-model="insCause"
          type="textarea"
          placeholder="选择其他时,请填写原因"
          :maxlength="30"
          style="margin-left:85px;width:250px;"
          v-if="insRadio == 7"
        />
      </div>
      <div slot="footer">
        <Button @click="insModal = false">取消</Button>
        <Button type="primary" @click="insModalOk" :disabled="insRadio == 7 && !insCause">确定</Button>
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
moment.locale("zh-cn");
export default {
  name: "adListStrip",
  components: {
    columnsSelect: () => import("@/components/columns-select")
    // MenuTable: () => import('./components/MenuTable.vue')
  },
  data() {
    const validateAdPrice = (rule, value, callback) => {
      if (isNaN(this.adFormData.adPrice)) {
        callback(new Error("单价必须为数字！"));
      }
      // if (this.adFormData.adPrice < 0 || this.adFormData.adPrice > 100) {
      //   callback(new Error("单价范围 0 ~ 100"));
      // }
      if (
        !/^(([^0-][0-9]{0,7}|0)\.([0-9]{1,4})$)|^([^0-]([0-9]{0,7})?|0)$/.test(
          value
        )
      ) {
        callback(new Error("单价只支持小数点前最多8位，小数点后最多4位"));
      }
      callback();
    };
    return {
      mapId: null,
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
      loading1: false,
      shopNames: [],
      searchForm: {
        adName: "",
        planName: "",
        submitTime: [],
        adPositionType: 1,
        customerName: "",
        adShortUrl: "",
        url: "",
        approvalStatus: -1,
        partnerName: -1
        // oppoApprovalStatus: -1
      },
      pay_per_view: true,
      // oppoApprovalStatus: [],
      senModal: false, //送审
      senRemark: "", //送审备注
      delRadio: "0",
      insRadio: "0",
      insCause: "",
      delCause: "",
      tableLoading: false,
      delOptions: [
        {
          label: "0",
          title: "广告名称有误"
        },
        {
          label: "1",
          title: "广告链接配置错误"
        },
        {
          label: "2",
          title: "渠道选择有误"
        },
        {
          label: "3",
          title: "其他"
        }
      ],
      insOptions: [
        {
          label: "0",
          title: "button名称与投放内容无关"
        },
        {
          label: "1",
          title: "button名称不能含有敏感词"
        },
        {
          label: "2",
          title: "推广链接与公司主体无关"
        },
        {
          label: "3",
          title: "链接页面功能异常"
        },
        {
          label: "4",
          title: "链接页面404"
        },
        {
          label: "5",
          title: "链接页面不能含有其他APP的推广"
        },
        {
          label: "6",
          title: "页面不能有超过屏幕50%比例的明显悬浮窗"
        },
        {
          label: "7",
          title: "其他"
        }
      ],
      // adOnlineStatusOptions: {
      //   3: "已删除",
      //   0: "已下线",
      //   99: "已上线"
      // },
      delModal: false, //下线弹窗
      insModal: false,
      adName: "",
      adTypeSearch: "strip",
      total_count: 0,
      pageIndex: 1,
      pageSize: 10,
      adTypes: [
        {
          type: 1,
          value: "菜单广告"
        }
      ],
      columnsSelection: [],
      columns: config.stripColumns, // 菜单的自定义列配置
      rowData: [],
      rowBalanceType: "",
      showEditAd: false,
      adFormData: {
        adName: "",
        adPrice: "",
        shop_name: "",
        partnerName: []
      }, // 编辑广告拉取的广告详情
      //adChargedTypes: [],
      //adPositionTypes: [],
      ad_edit_loading: false,
      validateEditAd: {
        adPrice: [
          { required: true, message: "请填写单价", trigger: "blur" },
          { validator: validateAdPrice, trigger: "blur" }
        ],
        adName: [
          { required: true, message: "请填写广告名称", trigger: "blur" }
        ],
        shop_name: [
          { required: true, message: "请填写商户名", trigger: "change" }
        ]
      },
      actionRow: {}
    };
  },
  computed: {
    showAccess() {
      return el => {
        return hasShowAccess(el);
      };
    },
    selectColumns() {
      return this.columns;
    },
    shortUrlSplit(urlStr) {
      return urlStr => {
        return urlStr.split(";");
      };
    },
    selectCompany() {
      return company_id => {
        let arr = [];
        company_id.forEach(item => {
          this.partnerNames.forEach(pitem => {
            if (pitem.key == item) {
              arr.push(pitem.value);
            }
          });
        });
        return arr.join("/");
      };
    },
    selectStatus() {
      return state => {
        if (state == 2) {
          return "已上线";
        } else if (state == 98) {
          return "已下线";
        } else if (state == 99) {
          return "已删除";
        }
      };
    },
    shopIdComputed() {
      let id = "";
      this.shopNames.forEach(item => {
        if (item.name == this.adFormData.shop_name) {
          id = item.id;
        }
      });
      return id;
    }
  },
  methods: {
    copyShortUrl(url) {
      var oInput = document.createElement("input");
      oInput.value = url;
      document.body.appendChild(oInput);
      oInput.select();
      document.execCommand("Copy"); // 执行浏览器复制命令
      this.$Message.success("复制成功");
      oInput.remove();
    },
    // getBasicInfo() {
    //   var _this = this;
    //   axios
    //     .request({
    //       url: "sys/utils/all",
    //       method: "get"
    //     })
    //     .then(
    //       d => {
    //         if (d.data.code === 0) {
    //_this.adChargedTypes = d.data.data.sysConfig.adChargedType;
    //_this.adPositionTypes = d.data.data.sysConfig.adPositionType;
    //_this.partnerNames = d.data.data.sysConfig.partnerName;
    // _this.oppoApprovalStatus =
    //   d.data.data.sysConfig.oppoApprovalStatus;
    //         } else {
    //           _this.$Message.error(d.data.msg);
    //         }
    //       },
    //       err => {
    //         _this.$Message.error("请求失败，" + err + "，请稍后再试!");
    //       }
    //     );
    // },
    /**
     * 编辑广告--拉取广告详情
     */
    editCurrentAd(row) {
      this.adFormData.adName = row.ad_name;
      this.adFormData.shop_name = row.shop_name;
      this.adFormData.partnerName = row.company_id;
      this.adFormData.url = row.url;
      this.adFormData.adPrice = row.price;
      this.adFormData.remarks = row.remarks;
      this.adFormData.adId = row.ad_id;
      this.adFormData.customId = row.custom_id;
      this.showEditAd = true;
    },
    searchData(isfirst) {
      // 广告审核 查询
      this.tableLoading = true;
      //this.adTypeSearch = this.searchForm.adPositionType;
      if (isfirst) {
        this.pageIndex = 1;
      }
      var postData = {
        ad_plan_name: this.searchForm.planName,
        ad_name: this.searchForm.adName,
        page: this.pageIndex,
        limit: this.pageSize,
        custom_name: this.searchForm.customerName,
        create_time_begin:
          typeof this.searchForm.submitTime[0] === "object"
            ? datefmt(this.searchForm.submitTime[0], "00:00:00")
            : this.searchForm.submitTime[0],
        create_time_end:
          typeof this.searchForm.submitTime[1] === "object"
            ? datefmt(this.searchForm.submitTime[1], "23:59:59")
            : this.searchForm.submitTime[1],
        company_id: this.searchForm.partnerName,
        status: this.searchForm.approvalStatus
      };
      let _this = this;
      axios
        .request({
          url: "/ad/line/management/list",
          method: "post",
          data: postData
        })
        .then(d => {
          if (d.data.code == 0) {
            _this.rowData = d.data.data.info;
            _this.total_count = Number(d.data.data.total_count);
            this.tableLoading = false;
          } else {
            this.$Message.error(d.data.msg);
          }
        })
        .catch(err => {
          this.tableLoading = false;
          this.$Message.error("网络错误");
        });
    },
    columnsChange(columns) {
      this.columnsSelection = columns;
    },
    reset() {
      this.searchForm = Object.assign({}, this.searchForm, {
        adName: "",
        planName: "",
        submitTime: [],
        adPositionType: 1,
        customerName: "",
        approvalStatus: -1
      });
      this.searchData(true);
    },
    submitTimeChange(data) {
      this.searchForm.submitTime = data;
    },
    open(url) {
      window.open(url);
    },
    pageChange(page) {
      this.pageIndex = page;
      this.searchData();
    },
    closeEditAd() {
      this.$refs["editFormValidate"].resetFields();
      this.showEditAd = false;
    },
    confirmEditAd() {
      this.$refs["editFormValidate"].validate(valid => {
        if (valid) {
          this.ad_edit_loading = true;
          let postData = {
            adName: this.adFormData.adName,
            shopId: this.shopIdComputed,
            companyId: this.adFormData.partnerName,
            url: this.adFormData.url,
            price: this.adFormData.adPrice
              ? parseFloat(this.adFormData.adPrice)
              : null,
            remarks: this.adFormData.remarks,
            adId: this.adFormData.adId,
            customId: this.adFormData.customId,
            shopName: this.adFormData.shop_name
          };
          axios
            .request({
              url: "/ad/line/management/edit",
              method: "post",
              data: postData
            })
            .then(res => {
              this.ad_edit_loading = false;
              if (res.data.code === 0) {
                this.showEditAd = false;
                this.searchData();
                this.$Message.success("修改成功");
              } else {
                this.showEditAd = true;
                this.$Message.error(res.data.msg);
              }
            })
            .catch(err => {
              this.ad_edit_loading = false;
              this.showEditAd = true;
              this.$Message.error("请求失败，" + err + "，请稍后再试！");
            });
        } else {
          this.$Message.error("请填写完整信息!");
        }
      });
    },
    handleStatus(type, row) {
      this.actionRow = row;
      switch (type) {
        case "onl":
          this.onl();
          break;
        case "ins":
          this.ins();
          break;
        case "rec":
          this.rec();
          break;
        case "del":
          this.del();
          break;
        default:
          return;
      }
    },
    onl() {
      //上线
      let postData = {
        adId: this.actionRow.ad_id,
        customId: this.actionRow.custom_id
      };
      axios
        .request({
          url: "/ad/line/management/online",
          method: "post",
          data: postData
        })
        .then(d => {
          if (d.data.code == 0) {
            this.$Message.success("上线成功");
            this.searchData();
          } else {
            this.$Message.error(d.data.msg);
          }
        })
        .catch(() => {
          this.$Message.error("网络错误");
        });
    },
    ins() {
      //下线
      this.insModal = true;
    },
    rec() {
      //恢复
      let postData = {
        adId: this.actionRow.ad_id,
        customId: this.actionRow.custom_id
      };
      axios
        .request({
          url: "/ad/line/management/recovery",
          method: "post",
          data: postData
        })
        .then(d => {
          if (d.data.code == 0) {
            this.$Message.success("恢复成功");
            this.searchData();
          } else {
            this.$Message.error(d.data.msg);
          }
        })
        .catch(() => {
          this.$Message.error("网络错误");
        });
    },
    del() {
      //删除
      this.delModal = true;
    },
    delModalOk() {
      this.delModal = false;
      var postData = {
        reason:
          this.delRadio == 3
            ? this.delCause
            : this.delOptions[this.delRadio].title,
        adId: this.actionRow.ad_id,
        customId: this.actionRow.custom_id
      };
      axios
        .request({
          url: "/ad/line/management/del",
          method: "post",
          data: postData
        })
        .then(d => {
          if (d.data.code == 0) {
            this.$Message.success("删除成功");
            this.searchData();
          } else {
            this.$Message.error(d.data.msg);
          }
        })
        .catch(() => {
          this.$Message.error("网络错误");
        });
    },
    insModalOk() {
      this.insModal = false;
      let postData = {
        reason:
          this.insRadio == 7
            ? this.insCause
            : this.insOptions[this.insRadio].title,
        adId: this.actionRow.ad_id,
        customId: this.actionRow.custom_id
      };
      axios
        .request({
          url: "/ad/line/management/offline",
          method: "post",
          data: postData
        })
        .then(d => {
          if (d.data.code == 0) {
            this.$Message.success("下线成功");
            this.searchData();
          } else {
            this.$Message.error(d.data.msg);
          }
        })
        .catch(() => {
          this.$Message.error("网络错误");
        });
    },
    remoteMethod1(query) {
      if (!query) {
        return;
      }
      this.loading1 = true;
      let params = { shopName: query };
      axios
        .request({
          url: "/ad/shops/names",
          method: "post",
          data: params
        })
        .then(d => {
          if (d.data.code === 0) {
            this.shopNames = d.data.data;
            this.loading1 = false;
          } else {
            this.$Message.error("请求异常，请稍后再试！");
          }
        }),
        err => {
          this.$Message.error("请求失败，" + err + "，请稍后再试！");
          this.loading1 = false;
        };
    }
  },
  created() {
    this.searchData(true);
    //this.getBasicInfo();
  },
  filters: {
    formatDate(value) {
      return moment(value).format("YYYY-MM-DD HH:mm:ss");
    }
  }
};
</script>
<style scoped lang="less">
.layout-table {
  padding-right: 10px;
}

.layout-search {
  width: 100%;
  margin-top: 10px;
  .label-type,
  .label-submitTime,
  .autograph,
  .usernamelabel {
    margin-left: 10px;
    margin-right: 10px;
  }
  .layout-datepicker {
    width: 180px;
    display: inline-block;
  }
  .layout-select {
    display: inline-block;
  }
}

.custom_table > table {
  margin: auto;
  &:nth-child(1) {
    padding-bottom: 15px;
  }
  td {
    word-break: break-all;
    padding: 5px;
  }
}

.custom_table > table > tr > td:nth-child(odd) {
  width: 120px;
  text-align: right;
}

.custom_table > table > tr > td:nth-child(even) {
  width: 210px;
}
</style>
