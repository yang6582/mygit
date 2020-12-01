<template>
  <div>
    <Form :model="formItem" :label-width="80" :inline="true" style="margin-top:20px;">
      <FormItem label="账期:">
        <!-- <Date-picker
          :value="formItem.time"
          format="yyyy-MM"
          type="month"
          placeholder="选择账期"
          style="width: 140px"
          @on-change="datePickerChange"
          :clearable="false"
        ></Date-picker> -->
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
          @change="datePickerChange"
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
      <FormItem label="公司名称:">
        <Input
          v-model="formItem.companyName"
          placeholder="公司名称"
          clearable
          @on-enter="searchData(true)"
        />
      </FormItem>
      <FormItem label="账单编号:">
        <Input
          v-model="formItem.statementNo"
          placeholder="账单编号"
          clearable
          @on-enter="searchData(true)"
        />
      </FormItem>
      <FormItem label="状态:">
        <Select v-model="formItem.type" style="width:140px" @on-change="searchData(true)">
          <Option :value="-1">全部</Option>
          <Option :value="0">待审批</Option>
          <Option :value="1">已审批</Option>
          <Option :value="2">拒绝</Option>
          <Option :value="3">完成</Option>
          <Option :value="4">待核对</Option>
        </Select>
      </FormItem>
      <FormItem :label-width="30">
        <Button type="primary" @click="searchData(true)" style="margin-left:10px">查询</Button>
        <Button type="primary" @click="exportData" style="margin-left: 10px" v-if="showAccess('对账管理_CPC对账列表_导出')">导出</Button>
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
        <template slot-scope="{ row }" slot="statementNo">
          <a
            href="javascript:;"
            style="text-decoration:underline"
            @click="pushPillDetails(row)"
          >{{row.statementNo}}</a>
        </template>
        <template slot-scope="{ row }" slot="remark">
          <Tooltip placement="top" transfer>
            <div 
              slot="content" 
              style="width: 220px; white-space: normal;word-break: break-all;"
            >{{row.remark}}</div>
            <div class="textOverFlow" v-if="row.remark"
            >{{row.remark}}</div>
          </Tooltip>
        </template>
        <template slot-scope="{ row }" slot="status">
          <Tag color="orange" v-if="row.status === 0" class="tag-class">待审批</Tag>
          <Tag color="blue" v-else-if="row.status === 1" class="tag-class">已审批</Tag>
          <Tag color="red" v-else-if="row.status === 2" class="tag-class">拒绝</Tag>
          <Tag color="green" v-else-if="row.status === 3" class="tag-class">完成</Tag>
          <Tag color="green" v-else-if="row.status === 4" class="tag-class">待核对</Tag>
        </template>
        <template slot-scope="{ row }" slot="sendMailFlag">
          <span>{{row.sendMailFlag == '1' ? '已发送' : '未发送'}}</span>
        </template>
        <template slot-scope="{ row }" slot="action">
          <!-- <div style="padding:10px 0;display:flex;"> -->
            <!-- v-if="row.status === 0" -->
            <Button
              v-if="row.isShowAuditStatus && (row.status === 0 || row.status === 1 || row.status === 2)"
              type="primary"
              size="small"
              @click="showAuditProcess(row.id)"
            >查看审批进度</Button>
          <!-- </div> -->
        </template>
        <!-- <template slot-scope="{row, index}" slot="remark">
          <Tooltip placement="top" transfer>
            <div
              slot="content"
              style="width: 220px; white-space: normal;word-break: break-all;"
            >{{row.remark}}</div>
            <Button
              size="small"
              style="color:#59afed"
              v-if="row.remark"
            >查看</Button>
          </Tooltip>
        </template> -->
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
      <Modal
        title="查看审批进度"
        v-model="auditProcessModal"
        :mask-closable="false"
        @on-visible-change="closeProcessModal"
        class="auditProcessModal"
        width="640"
        draggable
      >
        <div>
          <div v-for="(process, index) in filterProcessList" :key="index" style="display:flex;flex-direction: column;">
            <div style="display:flex;flex-direction: row;justify-content: space-around;">
              <div class="processBox" :style="{backgroundColor: process[process.key + 'AuditResult'] === 3 ? '#009688' : (process[process.key + 'AuditResult'] === 4 ? '#f35f54' : '#ffffff')}">
                {{process.department}}<br v-if="process.department"/>

                <Icon type="md-checkmark" color="#009688" v-if="process[process.key + 'AuditResult'] === 3" size="28" />
                <Icon type="md-close" color="#f35f54"  v-if="process[process.key + 'AuditResult'] === 4" size="28"/>

              </div>
              <Input style="" class="processRemark"
                  :value="process[process.key + 'AuditRemark']"
                  type="textarea"
                  readonly
                />              
            </div>
            <div :key="index + '11'" style="padding-left: 85px;">
                <Icon type="md-arrow-down" size="28" v-if="index!=filterProcessList.length-1" style="margin: 10px 10px;"/>
              </div>
          </div>
        </div>
        <div slot="footer">
          <!-- <Button type="primary" style="margin-left:10px;" @click="addSubmit('cpscpaForm')">确定</Button> -->
          <Button @click="auditProcessModal = false">取消</Button>
        </div>
      </Modal>
      <approvalBill 
        :approvalModal="approvalModal"
        :approvalData="processList"
        @close="closeProcessModal"
        :isEditable="false">
      </approvalBill>
    </div>
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
  name: "cpcReconciliationList",
  components: {
    approvalBill: () => import('./billDetails/approvalBill')
  },
  data() {
    return {
      page: {
        totalCount: 0,
        pageIndex: 1,
        pageSize: 10
      },
      formItem: {
        // time: this.getLastMonth(),
        time: [
          moment()
            .subtract(1, "months")
            .format("YYYY-MM"),
          moment()
            .subtract(1, "months")
            .format("YYYY-MM")],
        customName: "",
        companyName: '',
        statementNo: '',
        type: -1
      },
      columns: config.cpcColumns,
      tableData: [],
      tableDataLoading: false,
      auditProcessModal: false,
      approvalModal: false,
      filterProcessList: [],
      processList: {}
      // processList: [{ // cfoIsAudit:2无需审批，1需要审批
      //   department: 'AE',
      //   // name: 'AE',
      //   key: 'ae',
      //   aeAuditRemark: "",
      //   aeAuditResult: 2,
      //   aeIsAudit: 1
      // }, {
      //   department: '运营',
      //   // name: '谷兴芳',
      //   key: 'omLeader',
      //   omLeaderAuditRemark: "",
      //   omLeaderAuditResult: 3,
      //   omLeaderIsAudit: 1
      // },{
      //   department: '风控',
      //   // name: '柴利国',
      //   key: 'cfo',
      //   cfoAuditRemark: "",
      //   cfoAuditResult: 3,
      //   cfoIsAudit: 1
      // },{
      //   department: 'COO',
      //   // name: '叶松',
      //   key: 'coo',
      //   cooAuditRemark: "",
      //   cooAuditResult: 4,
      //   cooIsAudit: 1
      // },{
      //   department: 'CTO',
      //   // name: '欧文',
      //   key: 'cto',
      //   ctoAuditRemark: "",
      //   ctoAuditResult: 3, // 通过
      //   ctoIsAudit: 1
      // },]
    };
  },
  computed:{
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
    async showAuditProcess(id) {
      try {
        let data = new FormData();
        data.append("statementId", id);
        const res = await axios.request({
          url: "/finance/queryCpcStatementAuditConfig",
          method: "post",
          data: data
        })
        if (res.data.code === 0) {
          this.processList = res.data.data
          // this.processList.map(process => {
          //   process[process.key + 'AuditRemark'] = copyData[process.key + 'AuditRemark']
          //   process[process.key + 'AuditResult'] = copyData[process.key + 'AuditResult']
          //   process[process.key + 'IsAudit'] = copyData[process.key + 'IsAudit']
          // })
          // this.filterProcessList = this.processList.filter(item => {
          //   return item[item.key + 'IsAudit'] != 2
          // })
          this.approvalModal = true
        } else {
          this.$Message.error("查看出错：" + res.data.msg);
        }
      } catch (error) {
        this.$Message.error("网络错误" + error);
      }


      
    },
    closeProcessModal() {
      this.approvalModal = false
    },
    datePickerChange(date) {
      this.formItem.time = date;
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
        // date: this.formItem.time,
        startDate: this.formItem.time[0].split('-').join(''),
        endDate: this.formItem.time[1].split('-').join(''),
        customName: this.formItem.customName,
        companyName: this.formItem.companyName,
        statementNo: this.formItem.statementNo,
        pageIndex: this.page.pageIndex - 1,
        pageSize: this.page.pageSize,
        status: this.formItem.type
      };
      axios
        .request({
          url: "/finance/queryCpcStatement",
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
    exportData() {
      let postData = {
        startDate: this.formItem.time[0].split('-').join(''),
        endDate: this.formItem.time[1].split('-').join(''),
        customName: this.formItem.customName,
        status: this.formItem.type
      };
      axios
        .request({
          url: "/finance/exportCpcStatement",
          method: "post",
          data: postData,
          responseType: "blob"
        })
        .then(res => {
          if (res.status == 200) {
            const content = res.data;
            const blob = new Blob([content]);
            const fileName = "CPC对账列表" + this.formItem.time + ".xls";
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
    pushPillDetails(row) {
      // this.$router.push({path: '/reconciliationMangenment/billDetails', query: {statementNo: row.statementNo}})
      this.$router.push({ name: "billDetails", params: row });
    }
  }
};
</script>
<style lang="less" scoped>
.textOverFlow {
  overflow : hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.auditProcessModal {
  .processRemark{
    width: 250px;
    display: flex;
    justify-content: center;
  }
  .processRemark:last-child {
    margin-right: 0px;
  }
  .processBox {
    display: flex;
    text-align: center;
    justify-content: center;
    align-items: center;
    width: 80px;
    height: 80px;
    border: 1px solid #5c5d5e;
    border-radius: 50%;
    flex-direction: column;
    position: relative;
    i {
      position: absolute;
      right: -30px;
    }
  }
}
</style>