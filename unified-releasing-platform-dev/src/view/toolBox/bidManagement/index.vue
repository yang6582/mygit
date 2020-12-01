<template>
  <div>
    <Form ref="form-inline" :model="formItem" inline :label-width="80">
      <FormItem label="竞价日期:">
        <Date-picker 
            :value="formItem.time"
            format="yyyy-MM-dd"
            type="daterange"
            placeholder="选择日期"
            style="width: 180px"
            @on-change="changeReportTime"
        ></Date-picker>
      </FormItem>
      <FormItem label="竞价广告:">
        <Input
          v-model.trim="formItem.adName"
          placeholder="竞价广告"
          @on-enter="searchData(true)"
          clearable
        />
      </FormItem>
      <FormItem label="状态:">
        <Select
          v-model="formItem.status"
          style="width:180px"
          @on-change="searchData(true)"
        >
          <Option :value="-1">全部</Option>
          <Option v-for="(value, key) in bidStatus" :key="key" :value="key">{{value}}</Option>
        </Select>
      </FormItem>
      <FormItem :label-width="10">
        <Button type="primary" @click="searchData(true)">查询</Button>
      </FormItem>
      <FormItem :label-width="10">
        <Button type="primary" @click="biddingHandler" v-if="showAccess('工具箱_广告竞价_发起竞价')">发起竞价</Button>
      </FormItem>
    </Form>
    <Table border
        :columns="columns"
        :data="rowData"
        :loading="listLoading"
        style="overflow-x:scroll;">
        <template slot-scope="{row, index}" slot="adName">
          <span class="bidAdName" @click="checkDetails(row)">{{row.adName}}</span>
        </template>
        <template slot-scope="{row, index}" slot="status">
          <span>{{bidStatus[row.status]}}</span>
        </template>
        <template slot-scope="{row, index}" slot="bidDate">
          <span>{{formatDate(row.bidDate)}}</span>
        </template>
        <template slot-scope="{row, index}" slot="updateTime">
          <span>{{formatTime(row.updateTime)}}</span>
        </template>
        <template slot-scope="{row, index}" slot="createTime">
          <span>{{formatTime(row.createTime)}}</span>
        </template>
        <template slot-scope="{row, index}" slot="successCustomerNames">
          <span>{{row.successCustomerNames.join(',')}}</span>
        </template>
        <template slot-scope="{ row }" slot="operator">
          <Button
            type="success" size='small'
            @click="editBid(row, 'details')"
            v-if="showAccess('工具箱_广告竞价_查看详情') && row.status"
          >查看详情</Button>
          <Button
            type="primary" size='small'
            @click="editBid(row, 'edit')"
            v-if="showAccess('工具箱_广告竞价_编辑竞价') && !row.status"
          >编辑竞价</Button>
          <Button style="margin-left:10px"
            type="warning" size='small'
            @click="cancelBid(row)"
            v-if="showAccess('工具箱_广告竞价_取消竞价') && !row.status"
          >取消竞价</Button>
        </template>
    </Table>
    <Page
        :total="total_count"
        size="small"
        :current="formItem.page"
        @on-change="pageChange"
        :page-size="formItem.pageSize"
        @on-page-size-change="pageSizeChange"
        show-sizer
        show-total
        show-elevator
        style="margin-top:10px;float:right"
      ></Page>
      <Modal
      :title="bidType=='add' ? '发起竞价' : (bidType=='edit' ? '编辑竞价' : '查看详情')"
      v-model="biddingModal"
      :mask-closable="false"
      @on-visible-change="closeAddModal"
      width="600"
      :styles="{top: '100px'}"
    >
      <div class="biddingForm">
        <Form
          ref="biddingForm"
          :model="biddingForm"
          :label-width="130"
          style="margin-top: 20px"
          :rules="ruleValidate"
        >
          <!-- <FormItem label="竞价日期:">
            <Input v-model="biddingForm.customName" placeholder="客户名称" disabled readonly />
          </FormItem> -->
          <FormItem label="竞价日期:" prop="bidDate">
            <DatePicker
              v-model="biddingForm.bidDate"
              type="date"
              placeholder="选择竞价日期"
              format="yyyy年MM月dd日"
              style="width: 350px"
              :options="disabledBidDate"
              @change="dateTimeChangeBidDate"
              clearable
              :disabled="bidType=='details'"
            ></DatePicker>
          </FormItem>
          <FormItem label="开始/结束时间:" prop="bidTime">
            <TimePicker style="width: 350px"
              type="timerange" 
              v-model="biddingForm.bidTime"
              placeholder="开始/结束时间" :disabled="bidType=='details'"></TimePicker>
          </FormItem>
          <FormItem label="竞价广告:" prop="adName">
            <Input v-model="biddingForm.adName" placeholder="竞价广告" style="width: 350px" clearable :disabled="bidType=='edit' || bidType=='details'">
            </Input>
          </FormItem>
          <FormItem label="起拍价格:" prop="initPrice">
            <Input v-model="biddingForm.initPrice" placeholder="起拍价格" style="width: 350px" clearable :disabled="bidType=='edit' || bidType=='details'">
              <span slot="append">元</span>
            </Input>
          </FormItem>
          <FormItem label="出价次数:" prop="bidTimes">
            <RadioGroup v-model="biddingForm.bidTimes">
              <Radio label="0" :disabled="bidType=='details'">无限制</Radio>
              <Radio label="1" style="margin-left: 30px;" :disabled="bidType=='details'">其他</Radio>
            </RadioGroup>
            <Input v-model="biddingForm.bidCountInput" v-show="biddingForm.bidTimes == '1'" size="small" 
              class="bidCheckoutInput" placeholder="请填写出价次数" clearable :disabled="bidType=='details'">
            <span slot="append">次</span>
            </Input>
            <!-- <InputNumber :max="10" :min="1" v-model="value1"></InputNumber> -->
          </FormItem>
          <FormItem label="最低加价:" prop="minAddPrice">
            <RadioGroup v-model="biddingForm.minAddPrice">
              <Radio label="0" :disabled="bidType=='details'">无限制</Radio>
              <Radio label="1" style="margin-left: 30px;" :disabled="bidType=='details'">其他</Radio>
            </RadioGroup>
            <Input v-model="biddingForm.bidAddPrice" v-show="biddingForm.minAddPrice == '1'" 
              size="small" class="bidCheckoutInput" placeholder="请输入最低加价" clearable :disabled="bidType=='details'">
            <span slot="append">元</span>
            </Input>
          </FormItem>
          <FormItem label="订阅邮件正文内容:" class="emailContent" prop="mailContent">
            <Input
              v-model="biddingForm.mailContent"
              placeholder="订阅邮件正文内容"
              maxlength="1000"
              show-word-limit
              type="textarea"
              :rows="4"
              style="width: 350px"
              :disabled="bidType=='details'"
            />
             <div>
              <Poptip trigger="hover" title content="通过客户订阅，通过邮件向客户发送竞价基本规则。系统分别在客户点击订阅时和在竞价开始前1小时进行邮件发送提醒" style="display: flex;" 
                word-wrap width="180">
                <img
                  src="../../../../public/help.svg"
                  style="height: 20px; width:20px; padding-top: 5px;  margin-left: 5px"
                />
                <span style="margin-left: 5px; justify-content: center; align-items: center;">填写帮助</span>
              </Poptip>
            </div>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button @click="biddingModal = false">取消</Button>
        <Button @click="biddingSubmit" style="margin-left:20px" type="primary" v-if="bidType!='details'">确定</Button>
      </div>
    </Modal>
    <BidDetails :switchModal="showDetails" :id="bidId" @close="closeBidDetails"></BidDetails>
  </div>
</template>
<script>
  import axios from "@/libs/api.request";
  import config from "./config"
  import moment from "moment"
  import hasShowAccess from "@/libs/hasShowAccess";

  export default {
    name: "bidManagement",
    data(){
      const dateNow = new Date()
      const currentMonth = moment().month()
      const validateSum = (rule, value, callback) => {
        if (value == '') {
          return callback(new Error("起拍价格为必填项"));
        }
        if (/^(([0-9])\.([0-9]{1,2})$)|^([0-9])$/.test(value)
        ) {
          callback();
        } else {
          callback(new Error("起拍价格支持小数点前1位，后2位"));
        }
      };
      const validateBidCount = (rule, value, callback) => {
        if (value == '1' && !this.biddingForm.bidCountInput) {
          return callback(new Error("选择其他时必须输入值！"));
        }
        if (value == '1' && !/^([0-9])*$/.test(this.biddingForm.bidCountInput)) {
          return callback(new Error("出价次数不能是小数！"))
        }
        callback();
      }
      const validateLessPrice = (rule, value, callback) => {
        if (value == '1' && !this.biddingForm.bidAddPrice) {
          return callback(new Error("选择其他时必须输入值！"));
        }
        if (value == '1' && !/^(([0-9])\.([0-9]{1,2})$)|^([0-9])$/.test(this.biddingForm.bidAddPrice)) {
          return callback(new Error("最低加价支持小数点前1位，后2位！"))
        }
        callback();
      }
      const validateBidTime = (rule, value, callback) => {
        if (!value || !value[0] || !value[1]) {
          return callback(new Error("开始/结束时间必须选择！"));
        }
        callback();
      }
      return{
        formItem: {
          startDate: '',
          endDate: '',
          adName: '',
          status: -1,
          time: [moment().format('YYYY-MM-01'), moment().format('YYYY-MM-' + moment().daysInMonth())],
          pageSize: 10,
          page: 1
        },
        columns: config.bidFields,
        rowData: [],
        listLoading: false,
        total_count: 0,
        moment: moment,
        biddingModal: false,
        disabledBidDate: {
          disabledDate (date) {
              return date && date.valueOf() < Date.now() - 86400000
          }
        },
        bidType: 'add',
        bidStatus: {
          0: '待竞价',
          1: '竞价中',
          2: '已结束',
          3: '已取消',
        },
        biddingForm: {
          bidDate: '',
          bidTime: ['', ''],
          adName: "",
          initPrice: "",
          mailContent: "",
          bidTimes: "0",
          bidCountInput: '',
          minAddPrice: '0',
          bidAddPrice: ''
        },
        ruleValidate: {
          bidDate: [
            {
              required: true,
              type: "date",
              message: "请选择回款日期",
              trigger: "change"
            }
          ],
          bidTime: [{
            required: true,
            message: '开始/结束时间为必填项！',
            trigger: "change",
            validator: validateBidTime
          }],
          adName: [{
            required: true,
            message: '竞价广告为必填项！',
            trigger: "change"
          }],
          initPrice: [
            {
            required: true,
            trigger: "change",
            type: "number",
            validator: validateSum
          }
            // { required: true, message: '营业执照未上传,请上传', trigger: 'blur' },
          //   { validator: validateLicense, trigger: "blur", required: true }
          ],
          bidTimes: [{
            required: true,
            trigger: "change",
            validator: validateBidCount
          }],
          minAddPrice: [{
            required: true,
            trigger: "change",
            validator: validateLessPrice
          }],
          mailContent: [{
            required: true,
            message: '订阅邮件正文内容为必填项！',
            trigger: "change"
          }]
        },
        showDetails: false,
        bidId: ''
      }
    },
    components: {
      BidDetails: () => import('./bidDetails')
    },
    computed: {
      showAccess() {
        return el => {
          return hasShowAccess(el);
        };
      }
    },
    created() {
      this.searchData(true)
    },
    methods: {
      formatDate(value) {
        if (value) {
          return moment(value).format("YYYY-MM-DD");
        } else {
          return "";
        }
      },
      formatTime(value) {
        if (value) {
          return moment(value).format("YYYY-MM-DD HH:mm:ss");
        } else {
          return "";
        }
      },
      pick(obj, arr) {
        return arr.reduce((iter, val) => {
          val in obj && (iter[val] = obj[val])
          return iter
        }, {})
      },
      changeReportTime (data) {
        this.formItem.time = data
        this.formItem.startDate = data[0]
        this.formItem.endDate = data[1]
        this.searchData(true)
      },
      biddingHandler(){
        this.biddingModal = true
      },
      searchData(isfirst) {
        this.listLoading = true;
        if (isfirst) {
          this.formItem.page = 1;
        }
        let postData = {
          date0: this.formItem.time[0],
          date1: this.formItem.time[1],
          adName: this.formItem.adName,
          status: this.formItem.status,
          pageIndex: this.formItem.page,
          pageSize: this.formItem.pageSize
        }
        let _this = this;
        axios
          .request({
            url: "/adBid/find",
            method: "post",
            data: postData
          })
          .then(d => {
            if (d.data.code == 0) {
              _this.rowData = d.data.data.data
              _this.total_count = Number(d.data.data.total)
            } else {
              this.$Message.error(d.data.msg);
            }
            this.listLoading = false;
          })
          .catch(() => {
            this.listLoading = false;
            this.$Message.error("操作失败，请刷新重试")
          });
      },
      dateTimeChangeBidDate(time) {
        this.biddingForm.bidDate = time;
      },
      biddingSubmit() {
        this.$refs["biddingForm"].validate(valid => {
          if (valid) {
            let postData = {
              bidDate: this.formatDate(this.biddingForm.bidDate),
              startTime: this.biddingForm.bidTime[0],
              endTime: this.biddingForm.bidTime[1],
              adName: this.biddingForm.adName,
              bidTimes: this.biddingForm.bidTimes != 0 ? this.biddingForm.bidCountInput : 0,
              initPrice: this.biddingForm.initPrice,
              minAddPrice: this.biddingForm.minAddPrice != 0 ? this.biddingForm.bidAddPrice : 0,
              mailContent: this.biddingForm.mailContent
            };
            if (this.bidType == 'edit') {
              postData.id = this.biddingForm.id
            }
            axios
              .request({
                url: "/adBid/" + (this.bidType == 'add' ? 'addBidAd' : 'updateBidAd'),
                method: "post",
                data: postData
              })
              .then(res => {
                if (res.data.code == 0) {
                  this.$Message.success("操作成功");
                  this.biddingModal = false;
                  this.searchData();
                } else {
                  this.$Message.error(res.data.msg);
                }
              })
              .catch(err => {
                this.$Message.error("网络错误" + err);
              });
          }
        });
      },
      handleChange(data){
        this.formItem.start_date = data[0]
        this.formItem.end_date = data[1]
      },
      pageChange(page){
        this.formItem.page = page
        this.formItem.pageSize = 10
        this.searchData()
      },
      pageSizeChange(size){
        this.formItem.page = 1
        this.formItem.pageSize = size
        this.searchData()
      },
      closeAddModal(flag) {
        if (!flag) {
          this.$refs.biddingForm.resetFields();
          this.bidType = 'add'
        }
      },
      cancelBid(row) {
        this.$Modal.confirm({
            title: '取消竞价',
            content: '<p>确定取消竞价？</p>',
            onOk: () => {
                axios.request({
                  url: "/adBid/cancel?id=" + row.id,
                  method: "post"
                }).then(res => {
                  if (res.data.code == 0) {
                    this.searchData()
                  } else {
                    this.$Message.error(res.data.msg);
                  }
                }).catch(err => {
                  this.$Message.error("网络错误" + err);
                });
            },
            onCancel: () => {
            }
        });
      },
      editBid(row, type) {
        axios
          .request({
            url: "/adBid/getById?id=" + row.id,
            method: "get"
          })
          .then(res => {
            if (res.data.code == 0) {
              this.bidType = type
              let resData = res.data.data
              this.biddingForm = {
                ...resData, bidDate: 
                this.formatDate(resData.bidDate), 
                bidTime: [resData.startTime, resData.endTime], 
                bidTimes: resData.bidTimes == 0 ? resData.bidTimes + '' : '1',
                bidCountInput: resData.bidTimes == 0 ? '' : resData.bidTimes,
                minAddPrice: resData.minAddPrice == 0 ? resData.minAddPrice + '' : '1',
                bidAddPrice: resData.minAddPrice == 0 ? '' : resData.minAddPrice + '',
                id: row.id
              }
              this.biddingModal = true;
              // this.searchData();
            } else {
              this.$Message.error(res.data.msg);
            }
          })
          .catch(err => {
            this.$Message.error("网络错误" + err);
          });
      },
      checkDetails(row) {
        if (!this.showAccess('工具箱_广告竞价_查看详情')) return
        this.bidId = row.id
        this.showDetails = true
      },
      closeBidDetails() {
        this.showDetails = false
        this.bidId = ''
      }
    }
  }
</script>

<style scoped lang="less">
.statusLogo {
  width: 12px;
  height: 12px;
  border-radius: 100%;
  display: inline-block;
  margin-right: 10px;
  vertical-align: text-bottom;
}
.bidAdName {
  cursor: pointer;
  color: #2d8cf0
}
.biddingForm .bidCheckoutInput {
  width: 140px;
  position: absolute;
  left: 150px;
  top: 4px;
}
.biddingForm .emailContent {
  padding-top: 30px;
  border-top: 1px dotted;
  /deep/ .ivu-form-item-content{
    display: flex;
  }
}
.biddingForm /deep/ .ivu-input-type-textarea .ivu-input-word-count {
  align-items: flex-end;
  top: auto;
}
.biddingForm /deep/ .ivu-input-word-count {
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
