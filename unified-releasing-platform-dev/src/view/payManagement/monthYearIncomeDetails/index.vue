<template>
  <div class="expendTableClass">
    <Form :model="formItem" :label-width="80" :inline="true" style="margin-top:20px;">
      <FormItem label="账期:">
        <el-date-picker
          style="width:200px"
          v-model="formItem.time"
          size="small"
          type="monthrange"
          format="yyyy-MM"
          value-format="yyyy-MM"
          range-separator="-"
          start-placeholder="开始月份"
          end-placeholder="结束月份"
          @change="dateTimeChange"
          :clearable="false"
        ></el-date-picker>
      </FormItem>
      <FormItem label="客户名称:">
        <Input
          v-model="formItem.customName"
          placeholder="客户名称"
          clearable
          @on-enter="searchData(true)"
        />
      </FormItem>
      <FormItem label="账单编号:">
        <Input
          style="width:190px"
          v-model="formItem.statementNo"
          placeholder="账单编号"
          clearable
          @on-change="changeStatementNo"
          @on-enter="searchData(true)"
        />
      </FormItem>

      <FormItem label="状态:">
        <Select v-model="formItem.type" style="width:180px" @on-change="searchData(true)">
          <Option :value="-1">全部</Option>
          <Option :value="4">全部回款</Option>
          <Option :value="1">未回款</Option>
          <Option :value="2">逾期</Option>
          <Option :value="3">部分回款</Option>
        </Select>
      </FormItem>
      <FormItem :label-width="30">
        <Button type="primary" @click="searchData(true)" style="margin-left:10px">查询</Button>
        <Button type="primary" @click="exportData" style="margin-left: 10px" 
        v-if="showAccess('应收管理_包月/包年应收管理明细表_导出')">导出</Button>
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
        <!-- <template slot-scope="{row}" slot="invoiceStatus">
          <span>{{invoiceStatus[row.invoiceStatus]}}</span>
        </template>-->
        <template slot-scope="{row}" slot="updateTime">
          <span v-if="row.updateTime">{{row.updateTime | formatDate}}</span>
          <span v-else></span>
        </template>
        <template slot-scope="{ row,index }" slot="remark">
          <div
            style="display:flex;align-items:center;justify-content:space-between;"
            v-if="!row.isEdit"
          >
            <span style="text-align:center;flex:1;">{{row.remark}}</span>
            <Icon
              type="ios-create-outline"
              size="24"
              style="cursor: pointer;"
              @click="editDecrease(row,index)"
            />
          </div>
          <div v-else style="display:flex;align-items:center;justify-content:space-between;">
            <Input v-model="row.remark" />
            <Icon
              type="md-checkmark"
              size="20"
              style="cursor: pointer;margin-left:10px;"
              color="red"
              @click="editCpcStatementTotal(row,index)"
            />
            <Icon
              type="md-close"
              size="20"
              style="cursor: pointer;margin-left:5px;"
              color="green"
              @click="cancelEditDecrease"
            />
          </div>
        </template>
        <template slot-scope="{ row }" slot="operator">
          <Button type="success" size="small" @click="openMaintainReback(row)" v-if="showAccess('应收管理_包月/包年应收管理明细表_回款维护')">回款维护</Button>
          <Button type="primary" size="small" @click="openReceipt(row)" style="margin-left: 10px" 
          v-if="showAccess('应收管理_包月/包年应收管理明细表_回款')">回款</Button>
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
      title="回款"
      v-model="maintainModal"
      :mask-closable="false"
      @on-visible-change="closeMaintainModal"
      width="1000"
      :styles="{top: '100px'}"
    >
      <div style="padding:0 40px 0 20px">
        <!-- <Input
          v-model="formItem2.companyName"
          placeholder="公司名称"
          style="width:150px"
          clearable
          @on-enter="companyNameSearchData(true)"
        />-->
        <Form ref="form-inline" :model="formItem2" inline :label-width="80" @submit.native.prevent>
            <FormItem label="公司名称:" prop="companyName">
                <Input
                    v-model="formItem2.companyName"
                    placeholder="公司名称"
                    maxlength="30"
                    type="text"
                    clearable
                    style="width: 200px"
                    @on-enter="companyNameSearchData(true)"
                />
            </FormItem>
            <FormItem :label-width="10">
                <Button type="primary" @click="companyNameSearchData(true)">查询</Button>
            </FormItem>
        </Form>
        <Table
          border
          :columns="columns2"
          :data="tableData2"
          align="center"
          key="tableData"
          :loading="tableDataLoading2"
        >
          <template slot-scope="{row}" slot="choice">
            <Checkbox v-model="row.choice" @on-change="(params)=>{tableData2Choice(params,row)}"></Checkbox>
          </template>
          <template slot-scope="{row}" slot="entryDate">
            <span v-if="row.entryDate">{{row.entryDate | formatDate2}}</span>
            <span v-else></span>
          </template>
          <template slot-scope="{ row,index }" slot="collectionAmount">
            <Input v-model="row.collectionAmount" @on-change="(params)=>{changeCollectionAmount(params,row)}"/>
          </template>
        </Table>
        <div style="display:flex;justify-content:flex-end;margin-top:10px;">
          <Page
            :total="page2.totalCount"
            :current="page2.pageIndex"
            @on-change="pageChange2"
            :page-size="page2.pageSize"
            @on-page-size-change="pageSizeChange2"
            show-sizer
            show-total
            show-elevator
          ></Page>
        </div>
      </div>
      <div slot="footer">
        <Button @click="maintainModal = false">取消</Button>
        <Button @click="submitMaintain" type="primary">确定</Button>
      </div>
    </Modal>
    <MaintainModal :formData="maintainModalData" :visiableModal="visiableMaintainModal" @closeModal="closeMaintainModalHandler"></MaintainModal>
  </div>
</template>
<script>
import axios from "@/libs/api.request";
import { getToken, uuid } from "@/libs/util";
import { datefmt } from "@/utils/dateFormat";
import moment from "moment";
import hasShowAccess from "@/libs/hasShowAccess.js";
import expandRow from "./components/expandRow";
moment.locale("zh-cn");
const defaultMaintainData = {
  customName: "",
  companyName: "",
  remainDebt: "", //欠款金额
  returnAmount: "", //回款金额
  returnMemo: "", //备注
  returnProof: "", //回款凭证
  returnDate: "" //回款日期
}
export default {
  name: "monthYearIncomeDetails",
  components: {
    MaintainModal: () => import('../incomeDetails/components/maintainModal')
  },
  data() {
    const validPricePass = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请填写回款金额！"));
      } else if (isNaN(value)) {
        callback(new Error("回款金额必须为数字！"));
      }
      if (
        !/^(([^0-][0-9]{0,7}|0)\.([0-9]{1,4})$)|^([^0-]([0-9]{0,7})?|0)$/.test(
          value
        )
      ) {
        callback(new Error("回款金额只支持小数点前最多8位，小数点后最多4位"));
      }
      callback();
    };
    const validateLicense = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请上传回款凭证"));
      }
      callback();
    };
    const statementNo = this.$route.params.statementNo || ''
    return {
      headers: {
        "X-Client-Token": getToken(),
        // "X-Client-Token":
        //   "eyJpc0VuYWJsZSI6MSwibGFzdExvZ2luIjoxNTg3Nzc5NjM3MDE1LCJuaWNrTmFtZSI6InlvdWJpbmdrdW4iLCJ0b2tlbiI6IjYwX3lvdWJpbmdrdW5fMTU4Nzc3OTYzNzAxNSIsInVzZXJFbWFpbCI6InlvdWJpbmdrdW5AdGVkZHltb2JpbGUuY24iLCJ1c2VySWQiOjYwLCJ1c2VyTmFtZSI6InlvdWJpbmdrdW4ifQ==",

        "X-Client-Sdk": 2,
        "X-App-Id": "sdt_back_manager",
        "X-App-Version": 1,
        "X-Client-Time": Date.now(),
        "X-Request-Id": uuid(),
        "X-Request-Type": "",
        "X-Tdbear-Id": "",
        "X-Client-Unique": ""
      },
      page: {
        totalCount: 0,
        pageIndex: 1,
        pageSize: 10
      },
      page2: {
        totalCount: 0,
        pageIndex: 1,
        pageSize: 10
      },
      formItem: {
        time: [
          statementNo 
          ? statementNo.match(/[A-Za-z]*([0-9]{6})/)[1].replace(/(\d{4})/, '$1' + '-')
          : moment().subtract(2, "months").format("YYYY-MM"),
          statementNo 
          ? statementNo.match(/[A-Za-z]*([0-9]{6})/)[1].replace(/(\d{4})/, '$1' + '-')
          : moment().subtract(1, "months").format("YYYY-MM")
        ],
        customName: "",
        type: -1,
        statementNo: statementNo,
      },
      invoiceStatus: {
        0: "未开",
        1: "部分开票",
        2: "全部开票"
      },
      columns2: [
        {
          title: "选择",
          width: 60,
          align: "center",
          slot: "choice"
        },
        {
          title: "流水编号",
          // minWidth: 150,
          align: "center",
          key: "serialNumber"
        },{
          title: "回款主体",
          align: "center",
          key: "collectionSubject",
        },
        {
          title: "公司名称",
          // width: 150,
          align: "center",
          key: "companyName"
        },
        {
          title: "入账金额",
          // width: 120,
          align: "center",
          key: "entryAmount"
        },
        {
          title: "入账日期",
          // width: 120,
          align: "center",
          slot: "entryDate"
        },
        {
          title: "类型",
          // width: 120,
          align: "center",
          key: "entryType"
        },
        {
          title: "可用金额",
          // width: 120,
          align: "center",
          key: "availableDeductionAmount"
        }, {
          title: "抵扣金额",
          width: 120,
          align: "center",
          key: "collectionAmount",
          slot: 'collectionAmount'
        }
      ],
      formItem2: {
        companyName: ""
      },
      columns: [
        // {
        //   type: "selection",
        //   width: 60,
        //   align: "center",
        //   fixed: "left"
        // },
        {
          type: "expand",
          width: 50,
          // fixed: 'left',
          render: (h, params) => {
            return h(expandRow, {
              props: {
                row: params.row
              }
            });
          }
        },
        {
          title: "序号",
          type: "index",
          width: 65,
          align: "center",
          key: "index"
        },
        {
          title: "账期",
          align: "center",
          key: "statisticsMonth",
          width: 80
        },
        {
          title: "客户名称",
          align: "center",
          key: "customName",
          width: 120
        },
        {
          title: "公司名称",
          align: "center",
          key: "companyName",
          minWidth: 120
        },
        {
          title: "账单编号",
          align: "center",
          key: "statementNo",
          minWidth: 150
        },
        {
          title: "应收金额",
          align: "center",
          key: "settlementAmount",
          width: 100
        },{
          title: "应收日期",
          align: "center",
          key: "shouldReceiveMoneyDate",
          width: 100
        },
        {
          title: "回款金额",
          align: "center",
          key: "collectionTotal",
          width: 100
        },
        {
          title: "回款日期",
          align: "center",
          key: "collectionDate",
          width: 100
        },
        {
          title: "回款状态",
          align: "center",
          key: "collectionStatusName",
          width: 100
        },
        {
          title: "账龄",
          align: "center",
          key: "billAge",
          width: 80
        },
        {
          title: "操作时间",
          align: "center",
          slot: "updateTime",
          width: 100
        },
        {
          title: "操作人",
          align: "center",
          key: "operationUser",
          width: 100
        },
        {
          title: "操作",
          align: "center",
          slot: "operator",
          width: 160,
          fixed: "right"
        }
      ],
      tableData: [],
      tableData2: [],

      tableDataLoading: false,
      tableDataLoading2: false,

      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 1000 * 60 * 60 * 24;
        }
      },
      maintainModal: false,
      visiableMaintainModal: false,
      maintainModalData: defaultMaintainData,
      catchTableDataTotal: []
    };
  },
  computed: {
    showAccess() {
      return el => {
        return hasShowAccess(el);
      };
    }
  },
  created() {
    this.searchData(true);
  },
  methods: {
    closeMaintainModal(flag) {
      if (!flag) {
        this.$refs['form-inline'].resetFields();
      }
    },
    changeStatementNo(value) {
      this.$route.params.statementNo = ''
    },
    datePickerChange(date) {
      this.formItem.time = date.split("-").join("");
      this.searchData(true);
    },
    getLastMonth(d) {
      //获取上个月日期
      let date = d ? d : new Date();
      let year = date.getFullYear();
      let month = date.getMonth();
      if (month == 0) {
        year = year - 1;
        month = 12;
      }
      return year + (month.toString().length == 1 ? "0" + month : month);
    },
    searchData(flag) {
      this.tableDataLoading = true;
      if (flag) {
        this.page.pageIndex = 1;
      }
      let postData = {
        startStatisticsMonth: this.formItem.time[0].split("-").join(""),
        endStatisticsMonth: this.formItem.time[1].split("-").join(""),
        // statisticsMonthEnd:'',
        customName: this.formItem.customName.trim(),
        collectionStatus: this.formItem.type,
        pageIndex: this.page.pageIndex,
        pageSize: this.page.pageSize,
        statementNo: this.formItem.statementNo
      };
      axios
        .request({
          url: "/finance/cpt/arDocument/detailList",
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
          this.$Message.error("网络错误" + err);
        });
    },
    exportData() {
      let postData = {
        startStatisticsMonth: this.formItem.time[0].split("-").join(""),
        endStatisticsMonth: this.formItem.time[1].split("-").join(""),
        customName: this.formItem.customName.trim(),
        collectionStatus: this.formItem.type,
        // statementNo: this.formItem.statementNo,
      };
      axios
        .request({
          url: "/finance/cpt/arDocument/export",
          method: "post",
          data: postData,
          responseType: "blob"
        })
        .then(res => {
          if (res.status == 200) {
            const content = res.data;
            const blob = new Blob([content]);
            const fileName =
              "包年/包月应收管理明细表" +
              this.formItem.time[0].split("-").join("") +
              "-" +
              this.formItem.time[1].split("-").join("") +
              ".xls";
            if ("download" in document.createElement("a")) {
              // 非IE下载
              const elink = document.createElement("a");
              elink.download = fileName;
              elink.style.display = "none";
              elink.href = URL.createObjectURL(blob);
              document.body.appendChild(elink);
              elink.click();
              URL.revokeObjectURL(elink.href); // 释放URL 对象
              document.body.removeChild(elink);
            } else {
              // IE10+下载
              navigator.msSaveBlob(blob, fileName);
            }
          } else {
            this.$Message.error("导出失败,请刷新重试");
          }
        })
        .catch(() => {
          this.$Message.error("导出失败");
        });
    },
    pageSizeChange(size) {
      this.page.pageSize = size;
      this.searchData();
    },

    pageChange(index) {
      this.page.pageIndex = index;
      this.searchData();
    },
    dateTimeChange(date) {
      this.formItem.time = date;
      this.searchData();
    },
    openMaintainReback(row) {
 // this.$refs.uploadVoucher.clearFiles();
      // this.$refs.maintainForm.resetFields();     
      this.maintainModalData.returnMemo = "";
      this.maintainModalData.id = row.id;
      this.maintainModalData.companyName = row.companyName;
      this.maintainModalData.customName = row.customName;
      this.maintainModalData.returnProof = '';
      this.maintainModalData.returnAmount = ''
      this.maintainModalData.remainDebt = row.settlementAmount - row.collectionTotal;
      this.visiableMaintainModal = true
    },
    closeMaintainModalHandler(data) {
      if (!data) {
        this.visiableMaintainModal = false
        return
      }
      let postData = {
        consumeMonthBillId: data.id,
        returnProof: data.returnProof,
        returnDate: moment(data.returnDate).format("YYYY-MM-DD"),
        returnAmount: data.returnAmount,
        returnMemo: data.returnMemo
      };
      axios
        .request({
          url: "/finance/addAdCptConsumeBillReturnMoneyRecord",
          method: "post",
          data: postData
        })
        .then(res => {
          if (res.data.code == 0) {
            this.$Message.success("操作成功");
            this.visiableMaintainModal = false;
            this.searchData(true);
          } else {
            this.$Message.error(res.data.msg);
          }
        })
        .catch(err => {
          this.$Message.error("网络错误" + err);
        });
      
    },
    openReceipt(row) {
      this.maintainModal = true;
      this.formItem2.companyName = row.companyName;
      this.formItem2.consumeMonthBillId = row.id;
      this.formItem2.statementNo = row.statementNo;

      this.companyNameSearchData(true);
    },
    companyNameSearchData(flag) {
      this.tableDataLoading2 = true;
      if (flag) {
        this.page2.pageIndex = 1;
      }
      let postData = {
        // consumeMonthBillId: this.formItem2.consumeMonthBillId,
        companyName: this.formItem2.companyName,
        type: 2,
        pageIndex: this.page2.pageIndex,
        pageSize: this.page2.pageSize
      };
      axios
        .request({
          url: "/finance/canCollectionList",
          method: "post",
          data: postData
        })
        .then(res => {
          if (res.data.code == 0) {
            this.tableData2 = res.data.data.data;
            this.tableData2.forEach(item => {
              item.choice = false;
              item.collectionAmount = '';
            });
            this.page2.totalCount = res.data.data.total;
          } else {
            this.$Message.error(res.data.msg);
          }
          this.tableDataLoading2 = false;
        })
        .catch(err => {
          this.tableDataLoading2 = false;
          this.$Message.error("网络错误" + err);
        });
    },
    pageSizeChange2(size) {
      this.page2.pageSize = size;
      this.companyNameSearchData();
    },

    pageChange2(index) {
      this.page2.pageIndex = index;
      this.companyNameSearchData();
    },
    changeCollectionAmount(event, row) {
      this.tableData2[row._index].collectionAmount = event.currentTarget.value;
    },
    tableData2Choice(params, row) {
      this.tableData2[row._index].choice = params;
      // if (params) {
      //   this.tableData2 = this.tableData2.map((item, index) => {
      //     if (index != row._index) {
      //       item.choice = false;
      //     }
      //     return item;
      //   });
      // }
    },
    submitMaintain() {
      let arr = [];
      this.tableData2.forEach(item => {
        if (item.choice) {
          arr.push({collectionId: item.id, collectionAmount: item.collectionAmount});
        }
      });
      if (arr.length) {
        let data = {
          consumeMonthBillId: this.formItem2.consumeMonthBillId,
          collectionInfos: arr
        }

        axios
          .request({
            url: "/finance/cpt/arDocument/batchSelectCollection",
            method: "post",
            data
          })
          .then(res => {
            if (res.data.code == 0) {
              this.$Message.success("回款成功");
              this.maintainModal = false;
              this.searchData();
            } else {
              this.$Message.error(res.data.msg);
            }
          })
          .catch(err => {
            this.$Message.error("网络错误" + err);
          });
      } else {
        this.$Message.error("请选择回款项");
        return;
      }
    },
    editCpcStatementTotal(row, index) {
      if (row.remark.length > 20) {
        this.$Message.error('不能超过20个字符！')
        return
      }
      let data = new FormData();
      data.append("id", row.id);
      data.append("remark", row.remark);

      axios
        .request({
          url: "/finance/cpscpanew/editRemark",
          method: "post",
          data
        })
        .then(res => {
          if (res.data.code == 0) {
            this.$Message.success("修改成功");
            this.searchData();
          } else {
            this.$Message.error(res.data.msg);
          }
        })
        .catch(err => {
          this.$Message.error("网络错误" + err);
        });
    },
    editDecrease(row, index) {
      this.tableData.forEach((item,_index)=>{
        if(_index != index && item.isEdit){
          item.isEdit = false;
        }
      })
      this.catchTableDataTotal = JSON.parse(JSON.stringify(this.tableData));
      let list = JSON.parse(JSON.stringify(this.tableData));
      list[index].isEdit = true;
      this.tableData = list;
    },
    cancelEditDecrease() {
      this.tableData = JSON.parse(JSON.stringify(this.catchTableDataTotal));
    }
  },
  filters: {
    formatDate(value) {
      return moment(value).format("YYYY-MM-DD HH:mm:ss");
    },
    formatDate2(value) {
      return moment(value).format("YYYY-MM-DD");
    }
  }
};
</script>
<style lang="less" scoped>
.expendTableClass /deep/ td.ivu-table-expanded-cell {
  padding: 0;
}

.mask-wrap:hover .mask {
  display: block;
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
</style>