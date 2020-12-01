<template>
  <div class="adOnceCom">
    <div class="adOnce">
      <Card :bordered="false" style="margin-bottom:10px;">
        <p slot="title">编辑广告基础内容</p>
        <div style="width:50%;padding-left:80px;">
          <Form ref="adOnceCom" :model="formData1" :rules="ruleValidate1" :label-width="130">
            <FormItem label="广告名称:" prop="adName">
              <Input v-model="formData1.adName" placeholder="请填写广告名称" clearable :maxlength="30"></Input>
              <Button
                type="primary"
                @click="copyAdHandler"
                style="position: absolute;margin-left: 50px;"
                v-if="showAccess('推广计划_新建广告_按次_复制广告')"
              >复制广告</Button>
            </FormItem>
            <FormItem label="原链:" prop="url">
              <Input v-model="formData1.url" placeholder="请填写链接" clearable></Input>
            </FormItem>
            <FormItem label="厂商:" prop="vendor">
              <Select v-model="formData1.vendor">
                <Option
                  v-for="item in vendorOptions"
                  :value="item.value"
                  :key="item.value"
                >{{ item.label }}</Option>
              </Select>
            </FormItem>
            <FormItem label="订单名称:" prop="orderName">
              <Col span="12" style="width: 100%">
                <Select
                  v-model="formData1.orderName"
                  @on-change="searchNum('menu', 'formData1')"
                  @on-clear="clearOrderName"
                  filterable
                  clearable
                  remote
                  :remote-method="(value) => {searchOrder(value, 'menu')}"
                  :loading="menuOrderLoading"
                  placeholder="请输入订单名称"
                >
                  <Option
                    v-for="(item, index) in menuOrderList"
                    :key="index"
                    :value="item.orderName"
                  >{{ item.orderName }}</Option>
                </Select>
              </Col>
            </FormItem>
            <FormItem label="订单编号:" prop="orderNo">
              <Input v-model="formData1.orderNo" disabled></Input>
            </FormItem>
            <FormItem label="总预算:" prop="channelBudget">
              <Input v-model="formData1.channelBudget" placeholder="请填写预算" clearable>
                <span slot="append">元</span>
              </Input>
            </FormItem>
            <FormItem label="行业:" prop="industry">
              <Select v-model="formData1.industry">
                <Option
                  v-for="item in adIndustry"
                  :value="item.key"
                  :key="item.key"
                >{{ item.value }}</Option>
              </Select>
            </FormItem>
            <FormItem label="版图:" prop="adTerritory">
              <Select v-model="formData1.adTerritory">
                <Option
                  v-for="item in territoryList"
                  :value="item.key"
                  :key="item.key"
                >{{ item.value }}</Option>
              </Select>
            </FormItem>
            <FormItem label="销售人员:" prop="salesId">
              <Select v-model="formData1.salesId" filterable>
                <!-- <Option :value="0">全部</Option> -->
                <Option v-for="item in marketList" :value="item.id" :key="item.id">{{ item.name }}</Option>
              </Select>
            </FormItem>
          </Form>
        </div>
      </Card>
      <Card :bordered="false">
        <p slot="title">选择广告投放渠道</p>
        <div style="padding-left:20px;">
          <div style="margin-bottom:10px;">
            <Checkbox v-model="menuCheckbox" size="large">菜单</Checkbox>
            <transition name="my">
              <div v-show="menuCheckbox" class="box1">
                <Form
                  ref="adOnceComMenu"
                  :model="formDataMenu"
                  :rules="ruleValidateMenu"
                  :label-width="130"
                >
                  <FormItem label="菜单渠道广告名称:" prop="adName">
                    <Input
                      v-model="formDataMenu.adName"
                      placeholder="请填写广告名称"
                      clearable
                      :maxlength="30"
                    ></Input>
                  </FormItem>
                  <FormItem label="结算方式:" prop="balanceType">
                    <Select v-model="formDataMenu.balanceType">
                      <Option
                        v-for="item in closeTypes"
                        :value="item.value"
                        :key="item.value"
                      >{{ item.label }}</Option>
                    </Select>
                  </FormItem>
                  <FormItem label="单价:" prop="price">
                    <Input v-model="formDataMenu.price" placeholder="请填写单价" clearable>
                      <span slot="append">元</span>
                    </Input>
                  </FormItem>
                  <FormItem label="预算:" prop="channelBudget">
                    <Input v-model="formDataMenu.channelBudget" placeholder="请填写预算" clearable>
                      <span slot="append">元</span>
                    </Input>
                  </FormItem>
                </Form>
              </div>
            </transition>
          </div>
          <div style="margin-bottom:10px;">
            <Checkbox v-model="nextCheckbox" size="large">下一步</Checkbox>
            <transition name="my">
              <div v-show="nextCheckbox" class="box2">
                <Form
                  ref="adOnceComNext"
                  :model="formDataNext"
                  :rules="ruleValidateNext"
                  :label-width="130"
                >
                  <FormItem label="下一步渠道广告名称:" prop="adName">
                    <Input
                      v-model="formDataNext.adName"
                      placeholder="请填写广告名称"
                      clearable
                      :maxlength="30"
                    ></Input>
                  </FormItem>
                  <!-- <FormItem label="订单名称:" prop="orderName">
                    <Col span="12" style="width: 100%">
                      <Select
                        v-model="formDataNext.orderName"
                        @on-change="searchNum('next', 'formDataNext')"
                        filterable
                        remote
                        :remote-method="(value) => {searchOrder(value, 'next')}"
                        :loading="nextOrderLoading"
                        placeholder="请输入订单名称"
                      >
                        <Option
                          v-for="(item, index) in nextOrderList"
                          :key="index"
                          :value="item.orderName"
                        >{{ item.orderName }}</Option>
                      </Select>
                    </Col>
                  </FormItem>
                  <FormItem label="订单编号:" prop="orderNo">
                    <Input v-model="formDataNext.orderNo" disabled></Input>
                  </FormItem>-->
                  <FormItem label="结算方式:" prop="balanceType">
                    <Select v-model="formDataNext.balanceType">
                      <Option
                        v-for="item in closeTypes"
                        :value="item.value"
                        :key="item.value"
                      >{{ item.label }}</Option>
                    </Select>
                  </FormItem>
                  <FormItem label="单价:" prop="price">
                    <Input v-model="formDataNext.price" placeholder="请填写单价" clearable>
                      <span slot="append">元</span>
                    </Input>
                  </FormItem>
                  <FormItem label="预算:" prop="channelBudget">
                    <Input v-model="formDataNext.channelBudget" placeholder="请填写预算" clearable>
                      <span slot="append">元</span>
                    </Input>
                  </FormItem>
                </Form>
              </div>
            </transition>
          </div>
          <div>
            <Checkbox size="large" v-model="middleCheckbox">中间页</Checkbox>
            <transition name="my">
              <div v-show="middleCheckbox" class="box3" style="display:flex;">
                <div style="width:50%;">
                  <Form
                    ref="adOnceComMiddle1"
                    :model="formDataMiddle1"
                    :rules="ruleValidateMiddle"
                    :label-width="130"
                  >
                    <FormItem label="中间页渠道广告名称:" prop="adName">
                      <Input
                        v-model="formDataMiddle1.adName"
                        placeholder="请填写广告名称"
                        clearable
                        :maxlength="30"
                      ></Input>
                    </FormItem>
                    <!-- <FormItem label="订单名称:" prop="orderName">
                      <Col span="12" style="width: 100%">
                        <Select
                          v-model="formDataMiddle1.orderName"
                          @on-change="searchNum('middle', 'formDataNext')"
                          filterable
                          remote
                          :remote-method="(value) => {searchOrder(value, 'middle')}"
                          :loading="middleOrderLoading"
                          placeholder="请输入订单名称"
                        >
                          <Option
                            v-for="(item, index) in middleOrderList"
                            :key="index"
                            :value="item.orderName"
                          >{{ item.orderName }}</Option>
                        </Select>
                      </Col>
                    </FormItem>
                    <FormItem label="订单编号:" prop="orderNo">
                      <Input v-model="formDataMiddle1.orderNo" disabled></Input>
                    </FormItem>-->
                    <FormItem label="结算方式:" prop="balanceType">
                      <Select v-model="formDataMiddle1.balanceType">
                        <Option
                          v-for="item in closeTypes"
                          :value="item.value"
                          :key="item.value"
                        >{{ item.label }}</Option>
                      </Select>
                    </FormItem>
                    <FormItem label="单价:" prop="price">
                      <Input v-model="formDataMiddle1.price" placeholder="请填写单价" clearable>
                        <span slot="append">元</span>
                      </Input>
                    </FormItem>
                    <FormItem label="预算:" prop="channelBudget">
                      <Input v-model="formDataMiddle1.channelBudget" placeholder="请填写预算" clearable>
                        <span slot="append">元</span>
                      </Input>
                    </FormItem>
                    <FormItem label="广告类型:" prop="positionType">
                      <div style="display:flex;align-items:center;">
                        <Select
                          v-model="formDataMiddle1.positionType"
                          style="float:left;"
                          @on-change="positionTypeChange"
                        >
                          <Option value="1">icon</Option>
                          <Option value="2">banner</Option>
                          <Option value="3">天幕</Option>
                          <Option value="4">撕角</Option>
                          <Option value="5">长条banner</Option>
                          <Option value="6">拼图banner1</Option>
                          <Option value="7">拼图banner2</Option>
                          <Option value="8">文字链广告</Option>
                          <Option value="9">轮播banner</Option>
                        </Select>
                        <Poptip
                          trigger="hover"
                          placement="top"
                          v-if="formDataMiddle1.positionType == 5 || formDataMiddle1.positionType == 8"
                        >
                          <div slot="content">
                            <img
                              src="../../../../public/wordlink.png"
                              alt
                              v-if="formDataMiddle1.positionType == 8"
                            />
                            <img
                              src="../../../../public/swiper.png"
                              alt
                              v-if="formDataMiddle1.positionType == 5"
                            />
                          </div>
                          <Button style="margin-left:20px;">样例</Button>
                        </Poptip>
                      </div>
                    </FormItem>
                    <FormItem
                      label="banner类型:"
                      prop="positionType"
                      v-if="formDataMiddle1.positionType == 6 || formDataMiddle1.positionType == 7"
                    >
                      <div style="display:flex;">
                        <Select
                          v-model="formDataMiddle1.bannerSizeType"
                          style="width:200px"
                          @on-change="bannerSizeTypeChange"
                        >
                          <Option value="1">类型1</Option>
                          <Option value="2">类型2</Option>
                          <Option value="3" v-if="formDataMiddle1.positionType == 6">类型3</Option>
                        </Select>
                        <Poptip trigger="hover" placement="top">
                          <div slot="content">
                            <img
                              src="../../../../public/banner1.png"
                              alt
                              v-if="formDataMiddle1.positionType == 6"
                            />
                            <img
                              src="../../../../public/banner2.png"
                              alt
                              v-if="formDataMiddle1.positionType == 7"
                            />
                          </div>
                          <Button style="margin-left:20px;">样例</Button>
                        </Poptip>
                      </div>
                    </FormItem>
                    <FormItem
                      label="标题:"
                      prop="textTitle"
                      key="textTitle"
                      v-if="formDataMiddle1.positionType == 8"
                    >
                      <Input
                        v-model="formDataMiddle1.textTitle"
                        type="textarea"
                        placeholder="最少5个字，最多30个字"
                        :rows="2"
                        :maxlength="30"
                      ></Input>
                    </FormItem>
                    <FormItem label="业务标识:" prop="businessType">
                      <Select v-model="formDataMiddle1.businessType">
                        <Option value="1">H5</Option>
                        <Option value="2">deeplink</Option>
                        <Option value="3">快应用</Option>
                      </Select>
                    </FormItem>
                    <FormItem
                      label="应用名称:"
                      prop="appName"
                      v-if="formDataMiddle1.positionType == 1"
                      key="appName"
                    >
                      <Input
                        v-model="formDataMiddle1.appName"
                        placeholder="请填写应用名称"
                        :maxlength="15"
                        clearable
                      ></Input>
                    </FormItem>
                    <FormItem
                      label="应用描述:"
                      prop="appDescribe"
                      v-if="formDataMiddle1.positionType == 1"
                      key="appDescribe"
                    >
                      <Input
                        v-model="formDataMiddle1.appDescribe"
                        type="textarea"
                        placeholder="最少5个字，最多30个字"
                        :rows="2"
                        :maxlength="30"
                      ></Input>
                    </FormItem>
                  </Form>
                </div>
                <div style="width:50%;">
                  <Form
                    ref="adOnceComMiddle2"
                    :model="formDataMiddle2"
                    :rules="ruleValidateMiddle"
                    :label-width="150"
                  >
                    <FormItem label="按钮文案:" prop="btnName" v-if="formDataMiddle1.positionType == 1">
                      <Input v-model="formDataMiddle2.btnName" clearable></Input>
                    </FormItem>
                    <FormItem label="频次控制:" prop="frequency">
                      <RadioGroup v-model="formDataMiddle2.frequency">
                        <Radio label="0">
                          <span>不限</span>
                        </Radio>
                        <Radio label="1">
                          <span>单用户设置频次</span>
                        </Radio>
                      </RadioGroup>
                      <div
                        v-if="formDataMiddle2.frequency == 1"
                        style="display: flex;flex-direction: row;justify-items: center;margin-bottom: 10px;"
                      >
                        <span
                          style="display:flex;height:22px;align-items:center;width: 140px;align-self: center;margin-right: 5px"
                        >单用户</span>
                        <Select value="每天" disabled style="margin-right: 5px" size="small">
                          <Option value="每天">每天</Option>
                        </Select>
                        <Select value="点击" disabled style="margin-right: 5px" size="small">
                          <Option value="点击">点击</Option>
                        </Select>
                        <Input
                          v-model="formDataMiddle2.frequencyNum"
                          type="text"
                          size="small"
                          clearable
                        />
                      </div>
                    </FormItem>
                    <FormItem
                      :label="uploadParams.title"
                      prop="imgUrl"
                      v-if="formDataMiddle1.positionType != 8"
                    >
                      <Upload
                        action="https://admin-apsaras.teddymobile.net/api/v3/admin/upload/image"
                        ref="uploadImg"
                        :on-remove="imgRemove"
                        accept="image/*"
                        :before-upload="imgBeforeUpload"
                        :on-success="imgUploadSuccess"
                        :on-error="imgUploadError"
                      >
                        <div
                          v-if="formDataMiddle2.imgUrl"
                          style="position:relative;border-raduis:4px;line-height: 0;"
                          class="mask-wrap"
                        >
                          <img
                            :src="formDataMiddle2.imgUrl"
                            style="max-height:150px;max-width:260px;"
                          />
                          <div class="mask">重新上传</div>
                        </div>
                        <Icon
                          v-else
                          type="ios-cloud-upload-outline"
                          size="60"
                          style="border-radius:5px;border: 2px dotted gray;cursor:pointer;"
                        />
                      </Upload>
                      <span style="color:#aaa;">{{uploadParams.tips}}</span>
                    </FormItem>
                  </Form>
                </div>
              </div>
            </transition>
          </div>
        </div>
      </Card>
    </div>
    <div class="adOnceBtn">
      <Button @click="cancel" style="margin-right:20px;">取消</Button>
      <Button
        type="primary"
        @click="formSubmit"
        v-if="showAccess('推广计划_新建广告_按次_提交审核')"
        :loading="formSubmitLoading"
      >提交审核</Button>
    </div>
    <Modal
      title="复制广告"
      v-model="copyAdModal"
      width="80"
      :mask-closable="false"
      @on-visible-change="closeAddModal"
    >
      <div>
        <Form ref="copyAdForm" :model="copyAdForm" :label-width="80" :inline="true">
          <FormItem label="广告渠道：">
            <RadioGroup
              v-model="copyAdForm.adPositionType"
              type="button"
              @on-change="searchAdData(true)"
            >
              <Radio :label="item.type" v-for="(item,key) in adTypes" :key="key">{{ item.value }}</Radio>
            </RadioGroup>
          </FormItem>
          <br />
          <FormItem label="广告名称：" prop="adName">
            <Input v-model="copyAdForm.adName" placeholder="请填写广告名称" clearable></Input>
          </FormItem>
          <FormItem label="原链：" prop="adUrl">
            <Input v-model="copyAdForm.adUrl" placeholder="请填写原链" clearable></Input>
          </FormItem>
          <FormItem label="计划名称：" prop="planName">
            <Input v-model="copyAdForm.planName" placeholder="请填写计划名称" clearable></Input>
          </FormItem>
          <FormItem :label-width="30">
            <Button type="primary" @click="searchAdData(true)" style="margin-left:10px">查询</Button>
          </FormItem>
        </Form>
        <Table
          border
          :columns="columns"
          :data="rowData"
          :loading="listLoading"
          style="overflow-x:scroll;"
          @on-selection-change="selectAdHandler"
        >
          <!-- <template slot-scope="{ row, index }" slot="reportTime">
            <span v-html="formatDateComputed(row.createTime)"></span>
          </template>-->
          <template slot-scope="{row, index}" slot="id">
            <Radio
              @on-change="(value) => {selectedRadioStatus(row, value)}"
              v-model="row.selectedStatus"
              :disabled="row._disabled"
            ></Radio>
          </template>
          <template slot-scope="{row, index}" slot="adChargedType">
            <span>{{row.adChargedTypeName}}</span>
          </template>
          <template slot-scope="{row, index}" slot="positionNames">
            <span>{{row.adPositionTypeName}}</span>
          </template>
          <template slot-scope="{row, index}" slot="approvalStatusName">
            <span
              :style="{'color':row.approvalStatus ==2 ? '#42c565' : row.approvalStatus ==99 ? 'red' : row.approvalStatus == 98 ?'#fea135':'black'}"
            >{{row.approvalStatusName}}</span>
          </template>
          <template slot-scope="{row, index}" slot="adUrl">
            <Tooltip placement="top" transfer>
              <div
                slot="content"
                style="width: 220px; white-space: normal;word-break: break-all;"
              >{{row.adUrl}}</div>
              <Button
                size="small"
                style="color:#59afed"
                @click="open(row.adUrl)"
                v-if="row.adUrl"
              >查看</Button>
            </Tooltip>
          </template>
        </Table>
        <div style="display:flex;justify-content:flex-end;">
          <Page
            :total="total_count"
            size="small"
            :current="copyAdForm.pageIndex"
            @on-change="pageChange"
            :page-size="copyAdForm.pageSize"
            @on-page-size-change="pageSizeChange"
            show-sizer
            show-total
            show-elevator
            style="margin-top:10px;"
          ></Page>
        </div>
      </div>
      <div slot="footer">
        <Button type="primary" style="margin-left:10px;" @click="copyAdSubmit">确定</Button>
        <Button @click="cancelCopyHandler">取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import axios from "@/libs/api.request";
import { getToken, uuid } from "@/libs/util";
import hasShowAccess from "@/libs/hasShowAccess.js";
import config from "../config.js";
const formDataMenu = {
  adName: "",
  balanceType: "1",
  price: "",
  channelBudget: ""
  // orderNo: "",
  // orderName: ""
};
const formDataNext = {
  adName: "",
  balanceType: "1",
  price: "",
  channelBudget: ""
  // orderNo: "",
  // orderName: ""
};
const formDataMiddle1 = {
  adName: "",
  balanceType: "1",
  price: "",
  channelBudget: "99999999",
  positionType: "1",
  businessType: "1",
  bannerSizeType: "1",
  appName: "", //应用名称
  appDescribe: "", //应用描述
  textTitle: ""
  // orderNo: "",
  // orderName: ""
};
const formDataMiddle2 = {
  imgUrl: "", //icon图片地址
  resImgUrl: "",
  btnName: "", //按钮文案
  frequency: "0", //频次控制
  frequencyNum: ""
};
export default {
  name: "adOnceCom",
  props: ["customerId", "planId", "adIndustry"],
  components: {},
  data() {
    const validBudgetPass = function(type) {
      return (rule, value, callback) => {
        if (type == "middle" && !value) {
          callback(new Error("请填写预算"));
        }
        if (0 > value || value > 100000000) {
          // 99999999
          callback(new Error("预算范围0-100000000"));
        } else if (!/^\d{0,8}(\.\d{0,4})?$/.test(value)) {
          callback(new Error("预算只支持小数点前最多8位，小数点后最多4位"));
        } else {
          callback();
        }
      };
    };
    const validPricePass = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请填写单价！"));
      } else if (isNaN(value)) {
        callback(new Error("单价必须为数字！"));
      }
      // if (value < 0 || value > 100) {
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
    const validUrlPass = (rule, value, callback) => {
      if (!value) {
        callback(new Error("链接不能为空"));
      } else if (value && !/(http|https):\/\/([\w.]+\/?)\S*/.test(value)) {
        callback(new Error("链接格式不正确"));
      } else {
        callback();
      }
    };
    return {
      marketList: [],
      formSubmitLoading: false,
      // approvalStatus: 99   删除
      copyAdModal: false,
      copyAdForm: {
        adPositionType: 1,
        planName: "",
        adUrl: "",
        adName: "",
        pageSize: 10,
        pageIndex: 1
      },
      listLoading: false,
      columns: config.adTableFields,
      rowData: [],
      total_count: 0,
      adTypes: [
        {
          type: 1,
          value: "菜单广告"
        },
        {
          type: 2,
          value: "下一步广告"
        },
        {
          type: 3,
          value: "中间页广告"
        }
      ],
      selectedAds: [],
      selectedAdId: "",
      axisoUrl:
        location.href.indexOf("back-manager.teddymobile.net") > -1
          ? "https://m.teddymobile.cn"
          : "https://m-test.teddymobile.cn",
      headers: {
        "X-Client-Token": getToken(),
        "X-Client-Sdk": 2,
        //"X-App-Id": "sdt_back_manager",
        "X-App-Version": 1,
        "X-Client-Time": Date.now(),
        "X-Request-Id": uuid(),
        "X-Request-Type": "",
        "X-Tdbear-Id": "",
        "X-Client-Unique": ""
      },
      nextOrderList: [],
      nextOrderLoading: false,
      menuOrderList: [],
      menuOrderLoading: false,
      middleOrderList: [],
      middleOrderLoading: false,
      menuCheckbox: false,
      nextCheckbox: false,
      middleCheckbox: false,
      formData1: {
        adName: "",
        vendor: "5",
        url: "",
        channelBudget: "",
        industry: "",
        adTerritory: '',
        orderNo: "",
        orderName: "",
        salesId: ''
      },
      formDataMenu: formDataMenu,
      formDataNext: formDataNext,
      formDataMiddle1: formDataMiddle1,
      formDataMiddle2: formDataMiddle2,
      ruleValidate1: {
        vendor: [
          {
            required: true,
            message: "请选择厂商",
            trigger: "change"
          }
        ],
        industry: [
          {
            required: true,
            message: "请选择行业",
            trigger: "change"
          }
        ],
        adTerritory: [{
          required: true,
          message:'请选择版图',
          trigger: 'change'
        }],
        salesId: [{
          required: true,
          type: 'number',
          message: "请选择销售人员",
          trigger: "change"
        }],
        adName: [
          {
            required: true,
            message: "广告名称不能为空",
            trigger: "blur"
          },
          {
            type: "string",
            max: 30,
            message: "广告名称不能超过30个字符",
            trigger: "blur"
          }
        ],
        channelBudget: [
          {
            validator: validBudgetPass(),
            trigger: "blur"
          }
        ],
        url: [
          {
            required: true,
            validator: validUrlPass,
            trigger: "blur"
          }
        ],
        balanceType: {
          required: true,
          message: "请选择结算方式",
          trigger: "change"
        }
      },
      ruleValidateMenu: {
        channelBudget: [
          {
            validator: validBudgetPass(),
            trigger: "blur"
          }
        ],
        price: [
          {
            required: true,
            validator: validPricePass,
            trigger: "blur"
          }
        ],
        balanceType: {
          required: true,
          message: "请选择结算方式",
          trigger: "change"
        }
      },
      ruleValidateNext: {
        channelBudget: [
          {
            validator: validBudgetPass(),
            trigger: "blur"
          }
        ],
        price: [
          {
            required: true,
            validator: validPricePass,
            trigger: "blur"
          }
        ],
        balanceType: {
          required: true,
          message: "请选择结算方式",
          trigger: "change"
        }
      },
      ruleValidateMiddle: {
        // channelBudget: [
        //   {
        //     validator: validBudgetPass,
        //     trigger: "blur"
        //   }
        // ],
        channelBudget: [
          {
            required: true,
            trigger: "blur",
            validator: validBudgetPass("middle")
          }
        ],
        textTitle: [
          {
            required: true,
            message: "请填写标题",
            trigger: "blur"
          },
          {
            type: "string",
            message: "标题在5-30个字之间",
            min: 5,
            max: 30
          }
        ],
        price: [
          {
            required: true,
            validator: validPricePass,
            trigger: "blur"
          }
        ],
        balanceType: [
          {
            required: true,
            message: "请选择结算方式",
            trigger: "change"
          }
        ],
        positionType: [
          {
            required: true,
            message: "请选择广告类型",
            trigger: "change"
          }
        ],
        positionType: [
          {
            required: true,
            message: "请选择广告类型",
            trigger: "change"
          }
        ],
        bannerSizeType: [
          {
            required: true,
            message: "请选择banner类型",
            trigger: "change"
          }
        ],
        appName: [
          {
            required: true,
            message: "请填写应用名称",
            trigger: "blur"
          }
        ],
        imgUrl: [
          {
            required: true,
            message: "请上传图片",
            trigger: "blur"
          }
        ],
        appDescribe: [
          {
            required: true,
            message: "请填写应用描述",
            trigger: "blur"
          },
          {
            type: "string",
            message: "应用描述在5-30个字之间",
            min: 5,
            max: 30
          }
        ],
        // btnName: [
        //   {
        //     required: true,
        //     message: "请填写按钮文案",
        //     trigger: "blur"
        //   }
        // ],
        frequency: [
          {
            required: true,
            message: "请选择频次",
            trigger: "change"
          }
        ]
      },
      vendorOptions: [
        { value: "5", label: "VIVO" },
        { value: "1", label: "OPPO" },
        { value: "2", label: "金立" },
        { value: "3", label: "乐视" },
        { value: "4", label: "ZUK" },
        { value: "9", label: "NEX3" },
        { value: "6", label: "一加" },
        { value: "19", label: "快应用" }
      ],
      industryOptions: [],
      closeTypes: [
        { value: "1", label: "CPC" },
        { value: "2", label: "CPS" },
        { value: "3", label: "服务" },
        { value: "4", label: "厂商广告" },
        { value: "5", label: "CPT" }
      ],
      submitValidate: true,
      territoryList: [] // 版图
    };
  },
  computed: {
    showAccess() {
      return el => {
        return hasShowAccess(el);
      };
    },
    uploadParams() {
      let params = {};
      switch (this.formDataMiddle1.positionType) {
        case "1":
          params = {
            title: "icon素材:",
            tips: "大小限制为2M"
          };
          break;
        case "2":
          params = {
            title: "banner素材:",
            tips: "建议尺寸1040*400，大小限制为2M"
          };
          break;
        case "3":
          params = {
            title: "天幕素材:",
            tips: "大小限制为2M"
          };
          break;
        case "4":
          params = {
            title: "撕角素材:",
            tips: "大小限制为2M"
          };
          break;
        case "5":
          params = {
            title: "长条banner素材:",
            tips: "建议尺寸1040*259，大小限制为2M"
          };
          break;
        case "6":
          params = {
            title: "拼图banner1素材:",
            tips:
              this.formDataMiddle1.bannerSizeType == 1
                ? "类型1: 建议尺寸416*592，大小限制为2M"
                : this.formDataMiddle1.bannerSizeType == 2
                ? "类型2: 建议尺寸589*289，大小限制为2M"
                : "类型3: 建议尺寸289*289，大小限制为2M"
          };
          break;
        case "7":
          params = {
            title: "拼图banner2素材:",
            tips:
              this.formDataMiddle1.bannerSizeType == 1
                ? "类型1: 建议尺寸416*592，大小限制为2M"
                : this.formDataMiddle1.bannerSizeType == 2
                ? "类型2: 建议尺寸589*289，大小限制为2M"
                : "类型3: 建议尺寸289*289，大小限制为2M"
          };
          break;
        case "9":
          params = {
            title: "轮播banner:",
            tips: "建议尺寸1020*392，大小限制为2M"
          };
          break;
        default:
          break;
      }
      return params;
    }
  },
  methods: {
    pageChange(val) {
      this.copyAdForm.pageIndex = val;
      this.searchAdData();
    },
    pageSizeChange(val) {
      this.copyAdForm.pageIndex = 1;
      this.copyAdForm.pageSize = val;
      this.searchAdData();
    },
    // 点击复制广告按钮
    copyAdHandler() {
      // 请求数据
      this.searchAdData(true);
      this.copyAdModal = true;
    },
    closeAddModal() {},
    /** 点击原链链接跳转 */
    open(url) {
      window.open(url);
    },
    selectAdHandler(selection) {
      this.selectedAds = selection;
    },
    selectedRadioStatus(row, value) {
      this.selectedAds = [row];
      this.rowData.forEach(item => {
        this.$set(item, "selectedStatus", item.adId == row.adId ? true : false);
      });
    },
    cancelCopyHandler() {
      this.$refs.copyAdForm.resetFields();
      this.selectedAds = [];
      this.copyAdForm.pageSize = 10;
      this.copyAdForm.pageIndex = 1;
      this.copyAdModal = false;
    },
    copyAdSubmit() {
      const selectedAd = this.selectedAds;
      if (selectedAd.length == 0) {
        this.cancelCopyHandler();
        return;
      }
      if (selectedAd.length > 1) {
        this.$Message.warning("每次只能复制一条广告！");
        return;
      } else {
        axios
          .request({
            url: "/ad/management/ads/getAdGroupAndAdByAdId",
            method: "post",
            data: { adId: selectedAd[0].adId }
          })
          .then(d => {
            if (d.data.code == 0) {
              const adGroup = d.data.data.adGroup;
              this.formData1.adName = adGroup.adName;
              this.formData1.url = adGroup.adUrl;
              this.formData1.vendor = adGroup.partnerId + "";
              this.formData1.channelBudget = adGroup.adBudget;
              this.formData1.industry = adGroup.adIndustry + "";
              this.formData1.orderNo = adGroup.orderNo;
              this.formData1.orderName = adGroup.orderName;
              this.copyChannelAd(d.data.data.ad);
              this.cancelCopyHandler();
            } else {
              this.$Message.error(d.data.msg);
            }
          })
          .catch(err => {
            this.$Message.error("网络错误");
          });
      }
    },
    /**
     * 广告复制的时候复制过来的分渠道信息
     * */
    copyChannelAd(data) {
      let currentTypeForm = {};
      this.$refs.adOnceComMenu && this.$refs.adOnceComMenu.resetFields();
      this.$refs.adOnceComNext && this.$refs.adOnceComNext.resetFields();
      this.$refs.adOnceComMiddle1 && this.$refs.adOnceComMiddle1.resetFields();
      this.$refs.adOnceComMiddle2 && this.$refs.adOnceComMiddle2.resetFields();
      this.menuCheckbox = false;
      this.nextCheckbox = false;
      this.middleCheckbox = false;
      switch (data.adPositionType) {
        case 1: //菜单
          currentTypeForm = this.formDataMenu;
          this.menuCheckbox = true;
          break;
        case 2:
          currentTypeForm = this.formDataNext;
          this.nextCheckbox = true;
          break;
        case 3:
          this.middleCheckbox = true;
          currentTypeForm = this.formDataMiddle1;
          currentTypeForm.positionType = data.middlePageType + ""; //广告类型
          currentTypeForm.businessType = data.businessType + ""; // 业务标识
          if (currentTypeForm.positionType == 1) {
            currentTypeForm.appName = data.appName; // 应用名称
          }
          currentTypeForm.appDescribe = data.appDesc; // 应用描述
          this.formDataMiddle2.btnName = data.btnName; // 按钮文案
          this.formDataMiddle2.imgUrl =
            "http://apsaras-static.teddymobile.cn/" + data.imgUrl; // 素材url
          this.formDataMiddle2.resImgUrl = data.imgUrl;
          this.formDataMiddle2.frequency = data.frequencyNum == "0" ? "0" : "1"; // 频次控制--不限
          this.formDataMiddle2.frequencyNum =
            data.frequencyNum == "0" ? "" : data.frequencyNum; // 频次控制--单用户设置频次
          currentTypeForm.textTitle = data.textTitle; //标题   广告类型是8的时候
          currentTypeForm.bannerSizeType = data.sizeType + ""; // banner类型
          break;
      }
      currentTypeForm.adName = data.adName;
      currentTypeForm.balanceType = data.adChargedType + "";
      currentTypeForm.price = data.adPrice;
      currentTypeForm.channelBudget = data.adPositionBudget
        ? data.adPositionBudget
        : "";
    },
    searchAdData(isfirst) {
      this.listLoading = true;
      //this.adTypeSearch = this.searchForm.adPositionType;
      if (isfirst) {
        this.pageIndex = 1;
      }
      var postData = {
        adPositionType: this.copyAdForm.adPositionType,
        planName: this.copyAdForm.planName,
        adUrl: this.copyAdForm.adUrl,
        adName: this.copyAdForm.adName,
        pageIndex: this.copyAdForm.pageIndex,
        pageSize: this.copyAdForm.pageSize
      };
      let _this = this;
      axios
        .request({
          url: "/ad/management/ads/findAdsPrepareWithPlan",
          method: "post",
          data: postData
        })
        .then(d => {
          if (d.data.code == 0) {
            let dataArr = d.data.data.data;
            dataArr.forEach((item, index, array) => {
              if (item.approvalStatus == 99) {
                item._disabled = true;
              }
            });
            _this.rowData = dataArr;
            _this.total_count = d.data.data.total;
          } else {
            this.$Message.error(d.data.msg);
          }
          this.listLoading = false;
        })
        .catch(err => {
          this.listLoading = false;
          this.$Message.error("网络错误");
        });
    },
    formSubmit() {
      if (!this.menuCheckbox && !this.nextCheckbox && !this.middleCheckbox) {
        this.$Message.error("至少选择一项广告投放渠道");
        return;
      }
      //基础表单验证
      this.$refs["adOnceCom"].validate(valid => {
        if (valid) {
          this.submitValidate = true;
        } else {
          this.submitValidate = false;
          this.$Message.error("广告基础内容填写错误");
        }
      });
      //菜单表单验证
      if (this.menuCheckbox && this.submitValidate) {
        this.$refs["adOnceComMenu"].validate(valid => {
          if (valid) {
            this.submitValidate = true;
          } else {
            this.submitValidate = false;
            this.$Message.error("菜单渠道填写错误");
          }
        });
      }
      //下一步表单验证
      if (this.nextCheckbox && this.submitValidate) {
        this.$refs["adOnceComNext"].validate(valid => {
          if (valid) {
            this.submitValidate = true;
          } else {
            this.submitValidate = false;
            this.$Message.error("下一步渠道填写错误");
          }
        });
      }
      //中间页表单验证
      if (this.middleCheckbox && this.submitValidate) {
        this.$refs["adOnceComMiddle1"].validate(valid => {
          if (valid) {
            this.submitValidate = true;
            this.$refs["adOnceComMiddle2"].validate(valid => {
              if (valid) {
                this.submitValidate = true;
                if (this.formDataMiddle2.frequency == "1") {
                  if (!this.formDataMiddle2.frequencyNum) {
                    this.$Message.error("请填写频次");
                    this.submitValidate = false;
                  }
                }
              } else {
                this.submitValidate = false;
                this.$Message.error("中间页渠道填写错误");
              }
            });
          } else {
            this.submitValidate = false;
            this.$Message.error("中间页渠道填写错误");
          }
        });
      }
      if (this.submitValidate) {
        let params = {
          planId: this.planId,
          customerId: this.customerId,
          adName: this.formData1.adName,
          adUrl: this.formData1.url,
          partnerId: this.formData1.vendor,
          adBudget: this.formData1.channelBudget,
          adIndustry: this.formData1.industry,
          adTerritory: this.formData1.adTerritory,
          orderName: this.formData1.orderName,
          orderNo: this.formData1.orderNo,
          salesId: this.formData1.salesId
        };
        if (this.menuCheckbox) {
          params.menu = {
            adName: this.formDataMenu.adName,
            adChargedType: this.formDataMenu.balanceType,
            adPrice: this.formDataMenu.price,
            adPositionBudget: this.formDataMenu.channelBudget
            // orderName: this.formDataMenu.orderName,
            // orderNo: this.formDataMenu.orderNo
          };
        }
        if (this.nextCheckbox) {
          params.next = {
            adName: this.formDataNext.adName,
            adChargedType: this.formDataNext.balanceType,
            adPrice: this.formDataNext.price,
            adPositionBudget: this.formDataNext.channelBudget
            // orderName: this.formDataNext.orderName,
            // orderNo: this.formDataNext.orderNo
          };
        }
        if (this.middleCheckbox) {
          params.middlePage = {
            adName: this.formDataMiddle1.adName,
            adChargedType: this.formDataMiddle1.balanceType,
            adPrice: this.formDataMiddle1.price,
            adPositionBudget: this.formDataMiddle1.channelBudget,
            middlePageType: this.formDataMiddle1.positionType,
            businessType: this.formDataMiddle1.businessType,
            appName:
              this.formDataMiddle1.positionType == 1
                ? this.formDataMiddle1.appName
                : "",
            appDesc: this.formDataMiddle1.appDescribe,
            btnName: this.formDataMiddle2.btnName,
            imgUrl: this.formDataMiddle2.resImgUrl,
            frequencyNum:
              this.formDataMiddle2.frequency == "0"
                ? 0
                : this.formDataMiddle2.frequencyNum,
            textTitle: this.formDataMiddle1.textTitle,
            sizeType: this.formDataMiddle1.bannerSizeType
            // orderName: this.formDataMiddle1.orderName,
            // orderNo: this.formDataMiddle1.orderNo
          };
        }
        this.formSubmitLoading = true;
        axios
          .request({
            url: "ad/management/ads/add",
            method: "post",
            data: params
          })
          .then(
            d => {
              if (d.data.code === 0) {
                this.$Message.success("创建成功");
                this.$router.push({ name: "AdAduit" });
                this.formSubmitLoading = false;
              } else {
                this.$Message.error(d.data.msg);
                this.formSubmitLoading = false;
              }
            },
            err => {
              this.formSubmitLoading = false;
              this.$Message.error("请求失败，" + err + "，请稍后再试！");
            }
          );
      }
    },
    imgRemove() {
      this.$refs.uploadImg.clearFiles();
      this.formDataMiddle2.imgUrl = "";
      this.formDataMiddle2.resImgUrl = "";
    },
    imgBeforeUpload(file) {
      if (file.size > 2048000) {
        this.$Message.error("图片大小限制为2M");
        return false;
      }
      this.$refs.uploadImg.clearFiles();
      // let reader = new FileReader();
      // reader.readAsDataURL(file);
      // reader.onload = ev => {
      //   let formData = new URLSearchParams();
      //   formData.append("imgbase64", ev.target.result);
      //   formData.append("saveDB", 1);
      //   let url =
      //     location.href.indexOf("back-manager.teddymobile.net") > -1
      //       ? "https://m.teddymobile.cn"
      //       : "https://m-test.teddymobile.cn";
      //   axios
      //     .commonRequset({
      //       url: url + "/admin/public/uploadimage",
      //       method: "post",
      //       data: formData
      //     })
      //     .then(d => {
      //       if (d.data.boo) {
      //         this.formDataMiddle2.imgUrl = d.data.data.url;
      //         this.$Notice.success({
      //           title: "图片上传成功",
      //           desc: "图片上传成功"
      //         });
      //       } else {
      //         this.$Notice.error({
      //           title: "图片上传失败",
      //           desc: "图片上传失败请检查网络"
      //         });
      //       }
      //     })
      //     .catch(e => {
      //       this.$Notice.error({
      //         title: "图片上传失败",
      //         desc: "图片上传失败请检查网络"
      //       });
      //     });
      // };
      // return false;
    },
    positionTypeChange(type) {
      this.formDataMiddle2.imgUrl = "";
      this.formDataMiddle2.resImgUrl = "";
      this.$refs.uploadImg.clearFiles();
      if (type == 7) {
        this.formDataMiddle1.bannerSizeType = "1";
      }
    },
    bannerSizeTypeChange() {
      this.formDataMiddle2.imgUrl = "";
      this.formDataMiddle2.resImgUrl = "";
      this.$refs.uploadImg.clearFiles();
    },
    cancel() {
      this.$router.back();
    },
    imgUploadSuccess(res, file) {
      if (res.code === 200) {
        this.formDataMiddle2.imgUrl = res.data.originUrl;
        this.formDataMiddle2.resImgUrl = res.data.path;

        this.$Notice.success({
          title: "图片上传成功",
          desc: "图片上传成功"
        });
      }
    },
    imgUploadError() {
      this.$Notice.error({
        title: "图片上传失败",
        desc: "图片上传失败请检查网络"
      });
    },
    searchOrder(query, type) {
      if (query !== "") {
        this[type + "OrderLoading"] = true;
        setTimeout(() => {
          this[type + "OrderLoading"] = false;
          let params = { name: query };
          axios
            .request({
              url: "/ad/customer/searchOrder",
              method: "post",
              data: params
            })
            .then(
              d => {
                if (d.data.code === 0) {
                  this[type + "OrderList"] = d.data.data;
                } else {
                  this.$Message.error(d.data.msg);
                }
              },
              err => {
                this.$Message.error("请求失败，" + err + "，请稍后再试！");
              }
            );
        }, 200);
      } else {
        this[type + "OrderList"] = [];
      }
    },
    searchNum(type, form) {
      let item;
      debugger;
      let list = this[type + "OrderList"];
      for (item in list) {
        if (list[item].orderName == this[form].orderName) {
          return (this[form].orderNo = list[item].orderNo);
        }
      }
    },
    clearOrderName() {
      this.formData1.orderNo = "";
    },
    getAllSaleInfo() {
      axios
        .request({
          url: "/ad/management/ads/getAllSaleInfo",
          method: "post"
        })
        .then(res => {
          if (res.data.code === 0) {
            this.marketList = res.data.data;
          } else {
            this.$Message.error(res.data.msg);
          }
        })
        .catch(err => {
          this.$Message.error("请求异常，请稍后再试！");
        });
    },
    getAdTerritoryList() {
      axios
          .request({
            url: "/common/getAdTerritoryList",
            method: "get"
          })
          .then(res => {
            if (res.data.code === 0) {
              this.territoryList = res.data.data;
            } else {
              this.$Message.error(res.data.msg);
            }
          })
          .catch(err => {
            this.$Message.error("请求异常，请稍后再试！");
          });
    }
  },
  created() {
    this.getAllSaleInfo();
    this.getAdTerritoryList()
  }
};
</script>

<style lang="less" scoped>
.adOnceCom {
  padding: 0 0 40px;
}
.adOnceCom /deep/ .ivu-form-item-error-tip {
  white-space: nowrap;
}
.adOnce {
  padding: 0 2px;
}
.adOnceBtn {
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.mask {
  display: none;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  color: #fff;
  font-weight: bold;
  text-align: center;
  line-height: 50px;
  cursor: pointer;
  overflow: hidden;
}
.mask-wrap:hover .mask {
  display: block;
}
.box1 {
  height: 240px;
  overflow: hidden;
  padding-left: 60px;
  padding-right: 10px;
  width: 50%;
}
.box2 {
  height: 240px;
  overflow: hidden;
  padding-left: 60px;
  padding-right: 10px;
  width: 50%;
}
.box3 {
  height: 480px;
  overflow: hidden;
  padding-left: 60px;
  padding-right: 10px;
  width: 100%;
}
.my-enter-active,
.my-leave-active {
  transition: all 0.5s ease;
}
.my-enter, .my-leave-to /* .fade-leave-active below version 2.1.8 */ {
  height: 0;
}
</style>
