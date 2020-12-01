<template>
  <div class="payManagement">
    <div class="summaryTables">
        <Card class="summaryBox" v-for="(value, key) in summaryTables" :key="key">
            <div class="summaryTitle">{{value}}</div>
            <div class="summaryContent">
                <Icon type="logo-yen" style="margin-top: -4px;"/>
                <span :style="{color: summaryColors[key]}">
                  {{numberFormat(summaryData[key])}}
                </span>
            </div>
        </Card>
    </div>
    <Form ref="form-inline" :model="formItem" inline :label-width="90" @submit.native.prevent>
      <FormItem label="账期:">
          <el-date-picker
          style="width:200px"
          v-model="formItem.yyyymm"
          size="small"
          type="monthrange"
          format="yyyy-MM"
          value-format="yyyy-MM"
          range-separator="-"
          start-placeholder="开始月份"
          end-placeholder="结束月份"
          @change="changeReportTime"
          :clearable="false"
        ></el-date-picker>
      </FormItem>
      <FormItem label="公司名称:">
        <Input v-model.trim="formItem.companyName" placeholder="公司名称" style="width: 200px" clearable @on-enter='searchData(true, true)'>
        </Input>
      </FormItem>
      <FormItem label="计费方式:">
        <Select v-model="formItem.chargeType" style="width:200px" @on-change='searchData(true, true)'>
          <Option v-for="item in chargeStatus" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </FormItem>
      <FormItem label="回款状态:">
        <Select v-model="formItem.status" style="width:200px" @on-change='searchData(true, true)'>
          <Option v-for="item in allStatus" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </FormItem>
      <FormItem label="是否有结算单:">
        <Select v-model="formItem.hasBalanceBill" style="width:200px" @on-change='searchData(true, true)'>
          <Option :value="-1" key="-1">全部</Option>
          <Option :value="1" key="1">是</Option>
          <Option :value="0" key="0">否</Option>
        </Select>
      </FormItem>
      <FormItem :label-width="10">
        <Button type="primary" @click="searchData(true, true)">查询</Button>
        <Button type="primary" @click="dataExport('company')" style="margin-left: 10px;" v-if="showAccess('应收管理_应收管理总表_导出汇总表')">导出汇总表</Button>
        <Button type="primary" @click="dataExport" style="margin-left: 10px;" v-if="showAccess('应收管理_应收管理总表_导出明细表')">导出明细表</Button>
      </FormItem>
      <br>
      <!-- <FormItem :label-width="0">
        <RadioGroup v-model="formItem.dimension">
          <Radio label="1">按公司维度查询</Radio>
          <Radio label="2">按产品维度查询</Radio>
        </RadioGroup>
      </FormItem> -->
    </Form>
    <!-- 自定义列 -->
      <columnsSelect
        :columns="selectColumns"
        :columnsNum="adTypeSearch"
        @columns-change="columnsChange"
      ></columnsSelect>
    <Table border
        :columns="columnsSelection"
        :data="rowData"
        :loading="listLoading"
        @on-sort-change="sortColumnHandler"
        @on-expand="expandRowHandler"
        style="overflow-x:scroll; margin-top: 10px;">
        <template slot-scope="{ row }" slot="costTotal">
          <span>{{numberFormat(row.costTotal)}}</span>
        </template>
        <template slot-scope="{ row }" slot="benefitTotal">
          <span>{{numberFormat(row.benefitTotal)}}</span>
        </template>
        <template slot-scope="{ row }" slot="realTotal">
          <span>{{numberFormat(row.realTotal)}}</span>
        </template>
        <template slot-scope="{ row }" slot="collectionTotal">
          <span>{{numberFormat(row.collectionTotal)}}</span>
        </template>
        <template slot-scope="{ row }" slot="debtTotal">
          <span>{{numberFormat(row.debtTotal)}}</span>
        </template>
        <template slot-scope="{ row }" slot="hasBalanceBill">
          <span>{{row.hasBalanceBill ? '是' : '否'}}</span>
        </template>
        <template slot-scope="{ row }" slot="overdueFlag">
          <span>{{row.overdueFlag ? '是' : '否'}}</span>
        </template>
        <!-- <template slot-scope="{ row }" slot="returnRatio">
          <Progress :percent="row.returnRatio" />
        </template> -->
        <template slot-scope="{ row }" slot="notCollectionMoney">
          <span>{{numberFormat(row.notCollectionMoney)}}</span>
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
  </div>
</template>
<script>
  import axios from "@/libs/api.request";
  import config from "./config"
  import moment from "moment"
  import hasShowAccess from "@/libs/hasShowAccess";
  import numberFormat from '@/utils/numberFormat'
  import expandRow from './components/expandRow'
  export default {
    name: "summaryTables",
    components: {
      columnsSelect: () => import("@/components/columns-select")
    },
    data(){
      const dateNow = new Date()
      return{
        summaryTables: {'costTotal': '消耗金额', 'benefitTotal': '核减金额', 'realTotal': '应收金额', 'collectionTotal': '回款金额', 'notCollectionMoney': '未回款金额'},
        summaryColors: {'costTotal': 'black', 'benefitTotal': '#3E8F3E', 'realTotal': '#EE6911', 'collectionTotal': '#DD2222', 'notCollectionMoney': '#DD2222'},
        summaryData: {},
        formItem: {
          // dimension: '1',
          status: -1,
          chargeType: -1,
          hasBalanceBill: -1,
          pageSize: 10,
          page: 1,
          companyName: '',
          yyyymm: [
            moment()
              .subtract(1, "months")
              .format("YYYY-MM"),
            moment()
              .subtract(1, "months")
              .format("YYYY-MM")],
        },
        allStatus: config.allStatus,
        chargeStatus: config.chargeStatus,
        rowData: [],
        listLoading: false,
        total_count: 0,
        columnsSelection: [],
        selectColumns: config.companyDimension,
        adTypeSearch: 'summaryTables',
        orderData: {
          orderColumn: '',
          orderType: ''
        }
      }
    },
    computed: {
      showAccess() {
          return el => {
              return hasShowAccess(el);
          };
      },
      formatDateRange(){
        return (begin, end) => {
          if (begin && end) {
            let beginTime = moment(begin).format('YYYY-MM-DD HH:mm:ss')
            let endTime = moment(end).format('YYYY-MM-DD HH:mm:ss')
            return beginTime + '<br>'+ endTime;
          }else {
            return ""
          }
        }
      },
    },
    created() {
      this.searchData(true, true)
    },
    methods: {
      numberFormat: numberFormat.milliFormat,
      formatDate(value) {
        if (value) {
          return moment(value).format("YYYY-MM-DD");
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
      getSummaryData() {
        let postData = {
          startStatisticsMonth: this.formItem.yyyymm[0].split('-').join(''),
          endStatisticsMonth: this.formItem.yyyymm[1].split('-').join(''),
          companyName: this.formItem.companyName,
          status: this.formItem.status,
          chargeType: this.formItem.chargeType,
          hasBalanceBill: this.formItem.hasBalanceBill
        }
        axios.request({
          url: '/finance/queryAllTypeCollectionTotal',
          method: 'post',
          data: postData
        }).then(res => {
          if (res.data.code == 0) {
            this.summaryData = res.data.data
          }
        }).catch(err => {
          this.$Message.error("数据获取失败，请刷新后再试！")
        })
      },
      changeReportTime(data) {
        this.formItem.yyyymm = data;
        this.searchData(true, true);
      },
      columnsChange(columns) {

        let _this = this
        this.columnsSelection = Array.prototype.concat(
        //   {
        //     type: 'selection',
        //     width: 60,
        //     align: 'center',
        //     fixed: 'left'
        // },
        {
          type: "expand",
          width: 50,
          fixed: 'left',
          render(h, params) {
            return h(expandRow, {
              props: {
                row: _this.rowData[params.index]
              }
            });
          }
        }, columns);
      },
      /** 排序的时候是全部数据排序，非当前页； asc 或 desc*/
      sortColumnHandler({column, key, order}) {
        this.orderData.orderColumn = key
        this.orderData.orderType = order
        this.searchData(true)
      },
      /** 点击展开的时候再去拉数据 */
      expandRowHandler(row, status) {
        let postData = {
          "chargeType": row.chargeType,  
          "customId": row.customId,
          "statisticsMonth": row.statisticsMonth
        }
        status && axios.request({
          url: "/finance/queryAllTypeByCustomIdAndPlanNameAndStatisticMonth",
          method: "post",
          data: postData,
        }).then(res => {
          if (res.data.code == 0) {
            this.rowData.forEach((item, index) => {
              item._expanded = false
              if (item.customId === row.customId && item.chargeType === row.chargeType && item.statisticsMonth === row.statisticsMonth) {
                this.rowData[index].collectionMessages = res.data.data
                status && (this.rowData[index]._expanded = true)
              }
            })
          }
        })
      },
      dataExport(type){
        // 表名：账期+财务表-X维度
        let postData = {
          startStatisticsMonth: this.formItem.yyyymm[0].split('-').join(''),
          endStatisticsMonth: this.formItem.yyyymm[1].split('-').join(''),
          companyName: this.formItem.companyName,
          status: this.formItem.status,
          chargeType: this.formItem.chargeType,
          hasBalanceBill: this.formItem.hasBalanceBill
        }
       axios.request({
          url: type === 'company' ? "/finance/exportQueryAllTypeCollectionMoney" : "/finance/exportQueryAllTypeByPlanNameDimension",
          method: "post",
          data: postData,
          responseType: 'blob'
        }).then(res => {
          if (res.status == 200) {
              const content = res.data;
              const blob = new Blob([content]);
              const fileName = postData.startStatisticsMonth + '-' + postData.endStatisticsMonth + '财务表-' + (type ==='company' ? '公司维度' : '产品维度') + ".xls";
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
            // } else {
              // let _this = this;
            //   let errorMessage = new Blob([res.data]);
            //   let errorFileReader = new FileReader();
            //   errorFileReader.readAsText(errorMessage, "utf-8");
            //   errorFileReader.onload = function() {
            //     _this.$Message.error(JSON.parse(errorFileReader.result).message);
            //   };
            // }
          } else {
            this.$Message.error("导出失败,请刷新重试")
          }
        })
        .catch(() => {
          this.$Message.error("导出失败")
        });
      },
      /** 查询数据
       * @isfirst 是否第一页
       * @total 是否拉取总计数据
       * sortable是false时,不排序，把排序信息清空；是undefined时是翻页，有排序信息则携带
       */
      searchData(isfirst, total) {
        this.listLoading = true;
        if (isfirst) {
          this.formItem.page = 1;
        }
        let postData = {
          startStatisticsMonth: this.formItem.yyyymm[0].split('-').join(''),
          endStatisticsMonth: this.formItem.yyyymm[1].split('-').join(''),
          companyName: this.formItem.companyName,
          status: this.formItem.status,
          hasBalanceBill: this.formItem.hasBalanceBill,
          chargeType: this.formItem.chargeType,
          pageIndex: this.formItem.page,
          pageSize: this.formItem.pageSize
        }
        if (this.orderData.orderType && this.orderData.orderType !== 'normal') {
          postData.orderColumn = this.orderData.orderColumn
          postData.orderType = this.orderData.orderType
        }
        total && this.getSummaryData()
        let _this = this;
        axios
          .request({
            url: "/finance/queryAllTypeCollectionMoney",
            method: "post",
            data: postData
          })
          .then(d => {
            if (d.data.code == 0) {
              d.data.data.data.map(row => {
                row.collectionMessages = []
              })
              _this.rowData = d.data.data.data
              _this.total_count = d.data.data.total
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
      handleChange(data){
        this.formItem.startDate = data[0]
        this.formItem.endDate = data[1]
      },
      pageChange(page){
        this.formItem.page = page
        this.searchData()
      },
      pageSizeChange(size){
        this.formItem.pageSize = size
        this.searchData()
      }
    }
  }
</script>

<style scoped lang="less">
/deep/ td.ivu-table-expanded-cell {
  padding: 0;
}
.payManagement {
    .summaryTables {
        display: flex;
        padding: 40px 20px 40px;
        justify-content: space-between;
        flex-wrap: wrap;
        .summaryBox {
            width: 19%;
            min-width: 150px;
            /deep/ .ivu-card-body {
              padding: 10px;
            }
            .summaryTitle {
                font-size: 18px;
            }
            .summaryContent {
                text-align: center;
                font-size: 20px;
                margin: 20px 0px;
            }
        }
    }
}
</style>
