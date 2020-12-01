<template>
  <div>
    <Card :bordered="false" style="margin-bottom:20px;">
      <p slot="title">{{billData.statementNo+'-详情'}}</p>
      <div>
        <div>
          <Button
            type="primary"
            class="btn-left"
            @click="handleEdit"
            v-if="!openEdit && showAccess('对账管理_账单详情_修改')"
            :disabled="billData.status === 3 || billData.status === 0"
          >修改</Button>
          <Button type="error" class="btn-left" @click="finishEdit('billData')" v-if="openEdit">完成</Button>

          <Button class="btn-left" v-if="openEdit" @click="cancelEdit">取消</Button>
          
          <div class="btn-download-all" @mouseover="showDownloadList = true" @mouseout="showDownloadList = false" @click="showDownloadList = true">
            <Button
              type="primary"
              class="btn-left"
              v-if="!openEdit && showAccess('对账管理_账单详情_导出')"
            >导出</Button>
            <transition name="fade">
              <div class="btn-download" v-show="showDownloadList" @mouseover="showDownloadList = true"  @mouseout="showDownloadList = false">
                <div @click="exportBillData('detail')" style="color: #2D8cF0;">导出对账明细</div>
                <div @click="exportBillData('proof')" style="color: #2D8cF0;">导出对账凭证</div>
              </div>
            </transition>
          </div>
          <!-- <Button
            type="primary"
            class="btn-left"
            :disabled="!approvalAuthority || !billData.statementUser || !billData.serviceName"
            v-if="!openEdit && showAccess('对账管理_账单详情_确认')"
            @click="confirmModal = true"
          >确认</Button> -->
          <!-- :disabled="approvalAuthority && (billData.status === 4 || billData.status === 3 || billData.status == 1 || billData.status == 2 || !billData.statementUser || !billData.serviceName)" -->
          <!-- <Button
            type="primary"
            class="btn-left"
            :disabled="!approvalAuthority"
            v-if="!openEdit && showAccess('对账管理_账单详情_拒绝')"
            @click="refuseClick"
          >拒绝</Button> -->
          <Button
            type="primary"
            class="btn-left"
            v-if="!openEdit && showAccess('对账管理_账单详情_核减审批')"
            :disabled="!approvalAuthority"
            @click="showAuditProcess(billData.id)"
          >核减审批</Button>
          <!-- :disabled="!approvalAuthority" -->
           <!-- :disabled="approvalAuthority && (billData.status === 4 || billData.status === 3 || billData.status == 1 || billData.status == 2)" -->
          <Button
            type="primary"
            class="btn-left"
            :disabled="billData.status === 4 || billData.status === 0 || billData.status === 2"
            v-if="!openEdit && showAccess('对账管理_账单详情_发送')"
            @click="sendEmail"
          >发送</Button>
          <Button
            type="primary"
            class="btn-left"
            v-if="showAccess('对账管理_账单详情_凭证')"
            @click="proofModal = true"
          >凭证</Button>
          <Button
            type="primary"
            class="btn-left"
            :disabled="billData.status === 4 || billData.status === 3 || billData.status === 0 || billData.status === 2"
            v-if="!openEdit && showAccess('对账管理_账单详情_完成对账')"
            @click="completeModal = true"
          >完成对账</Button>
        </div>
      </div>
      <Form
        :model="billData"
        :label-width="100"
        :inline="true"
        style="margin-top:20px;"
        ref="billData"
        :rules="ruleValidate"
        class="billData"
      >
        <FormItem label="对账单编号:" style="width:30%;">
          <Input v-model="billData.statementNo" style="width: 100%" readonly disabled />
        </FormItem>
        <FormItem label="客户名称:" style="width:30%;">
          <Input v-model="billData.customName" style="width: 100%" readonly disabled />
        </FormItem>
        <FormItem label="公司名称:" style="width:30%;">
          <Input v-model="billData.companyName" style="width: 100%" readonly disabled />
        </FormItem>
        <br />
        <FormItem label="消费金额:" style="width:30%;">
          <Input v-model="billData.costTotal" style="width: 100%" readonly disabled />
        </FormItem>
        <FormItem label="核减金额:" style="width:30%;">
          <Input v-model="billData.benefitTotal" style="width: 100%" readonly disabled />
        </FormItem>
        <FormItem label="应收金额:" style="width:30%;">
          <Input v-model="billData.realTotal" style="width: 100%" readonly disabled />
        </FormItem>
        <br />
        <FormItem label="账单日期:" style="width:30%;">
          <DatePicker
            type="daterange"
            :value="billData.formatDate"
            style="width: 100%"
            :readonly="true"
            separator="至"
            disabled
          ></DatePicker>
        </FormItem>
        <FormItem label="账单状态:" style="width:30%;">
          <div style="width:100%;">
            <Tag color="orange" v-if="billData.status === 0" class="tag-class">待审批</Tag>
            <Tag color="blue" v-else-if="billData.status === 1" class="tag-class">已审批</Tag>
            <Tag color="red" v-else-if="billData.status === 2" class="tag-class">拒绝</Tag>
            <Tag color="green" v-else-if="billData.status === 3" class="tag-class">完成</Tag>
            <Tag color="green" v-else-if="billData.status === 4" class="tag-class">待核对</Tag>
          </div>
        </FormItem>
        <FormItem label="销售:" prop="salesId" style="width:30%;">
           <Select
            v-model="billData.salesId"
            style="width:100%"
            filterable
            :disabled="!openEdit"
            
          >
            <Option v-for="item in marketList" :value="item.id" :key="item.id">{{ item.name }}</Option>
          </Select>
          <!-- <Input
            v-model="billData.rejectReason"
            style="width: 100%"
            readonly
            disabled
            type="textarea"
            :autosize="true"
          /> -->
        </FormItem>
        <br />

        <FormItem label="备注:" style="width:30%;">
          <Input
            v-model.trim="billData.remark"
            style="width: 100%"
            type="textarea"
            maxlength="2000"
            :disabled="!openEdit"
            :rows="1"
            :autosize="true"
          />
        </FormItem>
        <FormItem label="对账人:" prop="statementUser" style="width: 30%">
          <Input
            v-model.trim="billData.statementUser"
            :disabled="!openEdit"
            placeholder="请填写对账人"
            maxlength="10"
          />
        </FormItem>
        <FormItem label="服务方:" style="width:30%;" prop="serviceName">
          <Input
            v-model="billData.serviceName"
            :disabled="!openEdit"
            placeholder="请填写服务方"
            maxlength="20"
          />
        </FormItem>
      </Form>
    </Card>
    <Tabs>
      <TabPane label="对账单汇总">
        <div>
          <Form
            :model="formItem"
            :label-width="80"
            :inline="true"
            style="margin-top:20px;"
            @submit.native.prevent
          >
            <FormItem label="推广链接:">
              <Input
                v-model="formItem.url"
                placeholder="推广链接"
                clearable
                style="width:200px"
                @on-enter="searchDataTotal(true)"
              />
            </FormItem>
            <FormItem>
              <Button type="primary" @click="searchDataTotal(true)">查询</Button>
              <Button
                type="primary"
                @click="exportDataTotal"
                style="margin-left:20px;"
                v-if="showAccess('对账管理_账单详情_导出汇总')"
              >导出汇总</Button>
            </FormItem>
          </Form>

          <Table
            border
            :columns="columnsTotal"
            :data="tableDataTotal"
            align="center"
            key="tableData"
            :loading="tableDataLoadingTotal"
          >
            <template slot-scope="{ row,index }" slot="benefitTotal">
              <div
                style="display:flex;align-items:center;justify-content:space-between;"
                v-if="!row.isEdit"
              >
                <span style="text-align:center;flex:1;">{{row.benefitTotal | parseNumber}}</span>
                <Icon
                  type="ios-create-outline"
                  size="24"
                  style="cursor: pointer;"
                  @click="editDecrease(row,index)"
                  v-if="openEdit && row.statisticsMonth !== '汇总'"
                />
              </div>
              <div v-else style="display:flex;align-items:center;justify-content:space-between;">
                <Input v-model="row.benefitTotal" />
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
            <template slot-scope="{row}" slot="fullUrl">
              <Tooltip placement="top" transfer>
                <div 
                  slot="content" 
                  style="width: 220px; white-space: normal;word-break: break-all;"
                >{{row.fullUrl}}</div>
                <div class="textOverFlow" v-if="row.fullUrl"
                >{{row.fullUrl}}</div>
              </Tooltip>
            </template>
            <template slot-scope="{row}" slot="costTotal">
              <span>{{row.costTotal | parseNumber}}</span>
            </template>
            <template slot-scope="{row}" slot="realTotal">
              <span>{{row.realTotal | parseNumber}}</span>
            </template>
            
          </Table>
          <Page
            :total="pageTotal.totalCount"
            :current="pageTotal.pageIndex"
            @on-change="pageChangeTotal"
            :page-size="pageTotal.pageSize"
            @on-page-size-change="pageSizeChangeTotal"
            show-sizer
            show-total
            show-elevator
            style="margin-top:10px;float:right"
          ></Page>
        </div>
      </TabPane>
      <TabPane label="对账单明细">
        <div>
          <Button
            type="primary"
            style="margin-bottom:16px;"
            @click="exportDataDetails"
            v-if="showAccess('对账管理_账单详情_导出明细')"
          >导出明细</Button>
          <Table
            border
            :columns="columnsDetails"
            :data="tableDataDetails"
            align="center"
            key="tableData"
            :loading="tableDataLoadingDetails"
          >
            <template slot-scope="{row}" slot="fullUrl">
              <Tooltip placement="top" transfer>
                <div 
                  slot="content" 
                  style="width: 220px; white-space: normal;word-break: break-all;"
                >{{row.fullUrl}}</div>
                <div class="textOverFlow" v-if="row.fullUrl"
                >{{row.fullUrl}}</div>
              </Tooltip>
            </template>
            <template slot-scope="{row}" slot="costTotal">
              <span>{{row.costTotal | parseNumber}}</span>
            </template>
            <template slot-scope="{row}" slot="costClickCount">
              <span>{{row.costClickCount | parseNumber}}</span>
            </template>
            <template slot-scope="{row}" slot="price">
              <span>{{row.price | parseNumber}}</span>
            </template>
          </Table>
          <Page
            :total="pageDetails.totalCount"
            :current="pageDetails.pageIndex"
            @on-change="pageChangeDetails"
            :page-size="pageDetails.pageSize"
            @on-page-size-change="pageSizeChangeDetails"
            show-sizer
            show-total
            show-elevator
            style="margin-top:10px;float:right"
          ></Page>
        </div>
      </TabPane>
    </Tabs>
    <Modal v-model="confirmModal" title="确认提示" width="600" :mask-closable="false">
      <div>
        <span style="font-size:14px;font-weight:bold;margin-left:15px;">确认通过该账单核对信息？</span>
        <Form
          :model="billData"
          :label-width="80"
          :inline="true"
          style="margin-top:20px;"
          :rules="ruleValidate"
        >
          <!-- <FormItem label="对账单编号:">
            <Input v-model="billData.statementNo" style="width: 180px" readonly />
          </FormItem> -->
          <FormItem label="账单日期:">
            <DatePicker
              type="daterange"
              :value="billData.formatDate"
              style="width: 180px"
              :readonly="true"
              separator="至"
            ></DatePicker>
          </FormItem>
          <FormItem label="客户名称:">
            <Input v-model="billData.customName" style="width: 180px" readonly />
          </FormItem>
          <FormItem label="公司名称:">
            <Input v-model="billData.companyName" style="width: 180px" readonly />
          </FormItem>

          <FormItem label="消费金额:">
            <Input v-model="billData.costTotal" style="width: 180px" readonly><span slot="append">元</span></Input>
          </FormItem>
          <FormItem label="核减金额:">
            <Input v-model="billData.benefitTotal" style="width: 180px" readonly><span slot="append">元</span></Input>
          </FormItem>
          <!-- <FormItem label="应收金额:">
            <Input v-model="billData.realTotal" style="width: 180px" readonly />
          </FormItem> -->
          <!-- <FormItem label="账单状态:">
            <div style="width:180px;">
              <Tag color="orange" v-if="billData.status === 0" class="tag-class">待审批</Tag>
              <Tag color="blue" v-else-if="billData.status === 1" class="tag-class">已审批</Tag>
              <Tag color="red" v-else-if="billData.status === 2" class="tag-class">拒绝</Tag>
              <Tag color="green" v-else-if="billData.status === 3" class="tag-class">完成</Tag>
            </div>
          </FormItem>-->
          <!-- <FormItem label="原因:">
            <Input v-model="billData.rejectReason" style="width: 180px" readonly />
          </FormItem> -->
          <FormItem label="备注:">
            <Input
              v-model="billData.remark"
              style="width: 180px"
              type="textarea"
              :rows="1"
              :autosize="true"
              readonly
            />
          </FormItem>
          <div style="border-top: 1px solid #1111;margin-bottom: 20px;"></div>
          <!-- <FormItem label="对账人:" prop="statementUser">
            <Input v-model="billData.statementUser" style="width: 180px" readonly />
          </FormItem>
          <FormItem label="服务方:" prop="serviceName">
            <Input v-model="billData.serviceName" style="width: 180px" readonly />
          </FormItem> -->
          <FormItem label="审批节点:" v-if="isCFORole">
              <Checkbox v-model="billData.cooIsAudit" :true-value='1' :false-value='0' :disabled="billData.benefitTotal/billData.realTotal >= 0.3">COO</Checkbox>
              <Checkbox v-model="billData.ctoIsAudit" :true-value='1' :false-value='0' :disabled="billData.benefitTotal/billData.realTotal >= 0.3">CTO</Checkbox>
          </FormItem>
          <FormItem label="审批说明:">
            <Input
              v-model="billData.synopsis"
              style="width: 280px"
              type="textarea"
              :rows="2"
              :autosize="true"
              maxlength="300"
              show-word-limit
              placeholder="如有需要请填写，300字之内"
            />
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button @click="confirmModal = false">取消</Button>
        <Button type="primary" style="margin-left:20px;" @click="handleConfim">确定</Button>
      </div>
    </Modal>
    <Modal v-model="completeModal" title="完成对账提示" width="600" :mask-closable="false">
      <div>
        <span
          style="font-size:14px;font-weight:bold;margin-left:15px;color:red;"
        >完成对账单后，不能进行再次修改，请确定是否确定完成对账？</span>
        <Form
          :model="billData"
          :label-width="80"
          :inline="true"
          style="margin-top:20px;"
          :rules="ruleValidate"
        >
          <FormItem label="对账单编号:">
            <Input v-model="billData.statementNo" style="width: 180px" readonly />
          </FormItem>
          <FormItem label="客户名称:">
            <Input v-model="billData.customName" style="width: 180px" readonly />
          </FormItem>
          <FormItem label="公司名称:">
            <Input v-model="billData.companyName" style="width: 180px" readonly />
          </FormItem>

          <FormItem label="消费金额:">
            <Input v-model="billData.costTotal" style="width: 180px" readonly><span slot="append">元</span></Input>
          </FormItem>
          <FormItem label="核减金额:">
            <Input v-model="billData.benefitTotal" style="width: 180px" readonly><span slot="append">元</span></Input>
          </FormItem>
          <FormItem label="应收金额:">
            <Input v-model="billData.realTotal" style="width: 180px" readonly><span slot="append">元</span></Input>
          </FormItem>

          <FormItem label="账单日期:">
            <DatePicker
              type="daterange"
              :value="billData.formatDate"
              style="width: 180px"
              :readonly="true"
              separator="至"
            ></DatePicker>
          </FormItem>
          <!-- <FormItem label="原因:">
            <Input v-model="billData.rejectReason" style="width: 180px" readonly />
          </FormItem>-->

          <FormItem label="备注:">
            <Input
              v-model="billData.remark"
              style="width: 180px"
              type="textarea"
              :rows="1"
              :autosize="true"
              readonly
            />
          </FormItem>
          <FormItem label="对账人:" prop="statementUser">
            <Input v-model="billData.statementUser" style="width: 180px" readonly />
          </FormItem>
          <FormItem label="服务方:" prop="serviceName">
            <Input v-model="billData.serviceName" style="width: 180px" readonly />
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button @click="completeModal = false">取消</Button>
        <Button type="primary" style="margin-left:20px;" @click="finishReconciliation">确定</Button>
      </div>
    </Modal>
    <Modal
      v-model="refuseModal"
      title="拒绝提示"
      width="400"
      class="refuseReason"
      :mask-closable="false"
    >
      <Form
        :model="refuseReason"
        :label-width="140"
        :inline="true"
        ref="refuseReason"
        :rules="ruleValidateRefuseReason"
        style="margin-top:10px;"
      >
        <FormItem label="请填写拒绝原因:" prop="value">
          <Input
            v-model.trim="refuseReason.value"
            style="width: 180px"
            :rows="2"
            type="textarea"
            maxlength="300"
            show-word-limit
          />
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="refuseModal = false">取消</Button>
        <Button type="primary" style="margin-left:20px;" @click="handleRefuse('refuseReason')">确定</Button>
      </div>
    </Modal>
    <Modal v-model="sendModal" title="发送对账单" width="600" :mask-closable="false">
      <div class="blackForm">
        <Form
          :model="sendForm"
          :label-width="120"
          style="margin-top:20px;"
          ref="sendForm"
          :rules="ruleValidateSendForm"
        >
          <FormItem label="收件人姓名:" prop="name">
            <Input v-model.trim="sendForm.name" style="width: 200px" />
          </FormItem>
          <FormItem label="收件人邮箱:" prop="email">
            <Input v-model.trim="sendForm.email" style="width: 200px" type="textarea" autosize />
            <Tooltip placement="right" max-width="220" content="若填写多个邮箱，请用英文分号';'进行隔开，最多支持填写10个邮箱">
              <img
                src="../../../../../public/help.svg"
                style="height: 20px; width:20px; padding-top: 5px;  margin-left: 5px;"
              />
              <span style="margin-left: 5px; justify-content: center; align-items: center;">填写帮助</span>
            </Tooltip>
          </FormItem>
          <!-- <FormItem label="服务方:" prop="serviceName">
            <Input v-model.trim="sendForm.serviceName" style="width: 200px" maxlength="20" show-word-limit/>
          </FormItem>-->
        </Form>
        <div style="padding:0 30px;">
          <h6>账单详情:</h6>
          <table border="1" style="border-spacing:0;  border-collapse:collapse;" class="tableClass">
            <tr>
              <th colspan="2">广告消费对账单</th>
            </tr>
            <tr>
              <td>账单月份</td>
              <td>{{billData.statisticsMonth}}</td>
            </tr>
            <tr>
              <td>公司名称</td>
              <td>{{billData.companyName}}</td>
            </tr>
            <tr>
              <td>结算周期</td>
              <td>{{billData.date}}</td>
            </tr>
            <tr>
              <td>消费金额</td>
              <td>{{billData.costTotal}}</td>
            </tr>
            <tr>
              <td>核减金额</td>
              <td>{{billData.benefitTotal}}</td>
            </tr>
            <tr>
              <td>应付金额</td>
              <td>{{billData.realTotal}}</td>
            </tr>
            <tr>
              <td>服务方</td>
              <td>{{billData.serviceName}}</td>
            </tr>
            <tr>
              <td>附件(明细表)</td>
              <td>详情请查看邮箱附件</td>
            </tr>
          </table>
        </div>
      </div>
      <div slot="footer">
        <Button @click="sendModal = false">取消</Button>
        <Button type="primary" style="margin-left:20px;" @click="handleSend">确定</Button>
      </div>
    </Modal>
    <Modal
      v-model="proofModal"
      title="对账凭证"
      width="600"
      class="reconciliationProof"
      :mask-closable="false"
      @on-visible-change="importProofModalClose"
    >
      <div style="display: flex;align-items: center;margin:20px;">
        <span>请上传对账凭证：</span>
        <Upload 
          ref="uploadProof"
          action="/finance/updateCPCVoucherFile"
          accept=".png, .jpg, .zip, .eml, .tar, .rar"
          :headers="headers"
          :show-upload-list="false"
          :before-upload="beforeUploadImport"
          :on-success="uploadSuccessImport"
          :on-error="uploadErrorImport">
            <Button icon="ios-cloud-upload-outline">选择文件</Button>
        </Upload>
        <span style="margin-left: 20px;">可导入mail格式，图片PNG、JPG格式<br>
          限制不超过10M</span>
      </div>
      <div>
        <Tag
          type="dot"
          closable
          color="success"
          style="margin-left:20px;margin-top:10px;"
          v-if="reqFilesBatch.fileName"
          @on-close="fileTagCloseBatch"
        >{{reqFilesBatch.fileName}}</Tag>
      </div>
      <div style="margin: 20px;">温馨提示：如需上传多个文件，可压缩为一个文件包进行上传；</div>
      <div slot="footer">
        <Button
          type="primary"
          @click="handleUploadBatch"
          :loading="uploadLoadingImport"
          style
        >{{uploadLoadingImport ? '导入中' :'导入'}}</Button>
        <Button @click="proofModal = false" :disabled="uploadLoadingImport">取消</Button>
        <!-- <Button @click="proofModal = false">取消</Button> -->
      </div>
    </Modal>
    <approvalBill 
      :approvalModal="approvalModal" 
      :approvalData="processList"
      @close="closeApprovalModal"
      :isEditable="true">
    </approvalBill>
  </div>
</template>
<script>
import axios from "@/libs/api.request";
import { datefmt } from "@/utils/dateFormat";
import config from "./config.js";
import moment from "moment";
import { getToken, uuid } from "@/libs/util";
import hasShowAccess from "@/libs/hasShowAccess.js";

moment.locale("zh-cn");

export default {
  name: "cpcReconciliationList",
  components: {
    approvalBill: () => import('./approvalBill')
  },
  data() {
    // 349794053@qq.com;349794053@qq.com
    const validateEmail = (rule, value, callback) => {
      let emails = value.split(";").map(item => {
        return item.trim();
      });
      console.log(emails)
      let reg = /^[A-Za-z0-9\-]+([_\.][A-Za-z0-9\-]+)*@([A-Za-z0-9\-]+\.)+[A-Za-z]{2,6}$/;
      if (emails.length > 10) {
        callback(new Error("多邮箱最大限制为10个"));
      }
      let emailsFormat = [...new Set(emails)];
      if (emails.length !== emailsFormat.length) {
        callback(new Error("存在重复邮箱"));
      }
      if (emails.length) {
        emails.some(email => {
          if (!reg.test(email)) {
            callback(
              new Error("邮箱格式错误，多邮箱地址填写时，用英文分号隔开!")
            );
            return true;
          }
        });
      }
      callback();
    };
    return {
      headers: {
        "X-Client-Token": 'eyJpc0VuYWJsZSI6MSwibGFzdExvZ2luIjoxNTg1NzkyNDQxMjEyLCJuaWNrTmFtZSI6Imxpc2hhbnNoYW4iLCJ0b2tlbiI6IjgwX2xpc2hhbnNoYW5fMTU4NTc5MjQ0MTIxMiIsInVzZXJFbWFpbCI6Imxpc2hhbnNoYW5AdGVkZHltb2JpbGUuY24iLCJ1c2VySWQiOjgwLCJ1c2VyTmFtZSI6Imxpc2hhbnNoYW4ifQ==',
        // "X-Client-Token": getToken(),
        "X-Client-Sdk": 2,
        "X-App-Id": "sdt_back_manager",
        "X-App-Version": 1,
        "X-Client-Time": Date.now(),
        "X-Request-Id": uuid(),
        "X-Request-Type": "",
        "X-Tdbear-Id": "",
        "X-Client-Unique": ""
      },
      approvalAuthority: false, // 审批权限
      approvalModal: false,
      formItem: { url: "" },
      sendModal: false,
      sendForm: {
        name: "",
        email: ""
      },
      ruleValidateSendForm: {
        name: [
          { required: true, message: "请填写收件人姓名", trigger: "blur" }
        ],
        email: [
          { required: true, message: "请填写收件人邮箱", trigger: "blur" },
          {
            trigger: "blur",
            validator: validateEmail
          }
        ]
      },
      refuseReason: {
        value: ""
      },
      refuseModal: false,
      completeModal: false,
      proofModal: false,
      confirmModal: false,
      openEdit: false,

      pageTotal: {
        totalCount: 0,
        pageIndex: 1,
        pageSize: 10
      },
      pageDetails: {
        totalCount: 0,
        pageIndex: 1,
        pageSize: 10
      },
      columnsTotal: config.totalColumns,
      columnsDetails: config.detailsColumns,
      tableDataTotal: [{ benefitTotal: "1223333.2" }],
      catchTableDataTotal: [],
      tableDataDetails: [],
      tableDataLoadingTotal: false,
      tableDataLoadingDetails: false,
      billData: {
        synopsis: '',
        cooIsAudit: 0,
        ctoIsAudit: 0
      },
      cacheBillData: {},
      ruleValidate: {
        salesId: [
          { required: true, type: 'number', message: "请选择销售人员", trigger: "change"}
        ],
        statementUser: [
          { required: true, message: "请填写对账人", trigger: "blur" }
        ],
        serviceName: [
          { required: true, message: "请填写服务方", trigger: "blur" }
        ]
      },
      ruleValidateRefuseReason: {
        value: [{ required: true, message: "请填写拒绝原因", trigger: "blur" }]
      },
      isCFORole: false, //是否是cfo角色
      reqFilesBatch: {
        fileName: ""
      },
      uploadLoadingImport: false,
      showDownloadList: false,
      marketList: [],
      processList: {}
    };
  },
  computed: {
    showAccess() {
      return el => {
        return hasShowAccess(el);
      };
    }
  },
  filters: {
      /** 千位符号，小数点后不加千位符 */
    parseNumber(str) {
      return str && str.toString().replace(/^\d+/g, (m) => m.replace(/\d{1,3}(?=(\d{3})+$)/g, '$&,'))
    },
  },
  async created() {
    this.billData = this.$route.query.statementNo ? await this.getBIllData() : Object.assign({}, this.$route.params)
    // this.billData = await this.getBIllData()
    this.getApprovalAuthority(this.billData.id)
    this.getIfIsCFORole()
    this.getAllSaleInfo()
    if (!this.billData.statementNo) {
      this.$router.push({ name: "cpcReconciliationList" });
    } else {
      this.billData.formatDate = this.billData.date.split("至");
      this.searchDataTotal(true);
      this.searchDataDetails(true);
    }
    
  },
  methods: {
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
    /** 因为要改成从钉钉提醒直接跳转进入详情页，所以改成path+query的方式传递id,再去获取billData的信息 */
    async getBIllData() {
      try {
        const res = await axios.request({
          url: "/finance/queryCpcStatementByNo",
          method: "post",
          data: {
            statementNo: this.$route.query.statementNo
          }
        })
        if (res.data.code === 0) {
          return res.data.data
        } else {
          return {}
        }
      } catch (error) {
        this.$Message.error("网络错误" + error);
      }
    },
    /** 判断是否是CFO角色，是的话增加审批结点审核 */
    getIfIsCFORole() {
      const userRoles = this.$store.state.user.userBasicInfo.userRoles
      const CFORoles = userRoles.filter(role => {
        return role.roleName === '核减审核-CFO'
      })
      if (CFORoles.length) {
        this.isCFORole = true
        // 大于等于30%时都是审批节点勾选状态，并且用户不能再改变
        if (this.billData.benefitTotal/this.billData.realTotal >= 0.3) {
          this.billData.cooIsAudit = 1
          this.billData.ctoIsAudit = 1
        }
      }
    },
    /** 判断是否有审批权限 */
    getApprovalAuthority(statementId) {
      let data = new FormData();
      data.append("statementId", statementId);
      axios.request({
        url: '/finance/queryHaveApprovalAuthority',
        method: 'post',
        data: data
      }).then(res => {
        this.approvalAuthority = !!res.data.data
      }).catch(err => {
        this.$Message.error("网络错误" + err);
      })
    },
    searchDataTotal(flag) {
      if (flag) {
        this.pageTotal.pageIndex = 1;
      }
      this.tableDataLoadingTotal = true;
      axios
        .request({
          url: "/finance/queryCpcStatementTotal",
          method: "post",
          data: {
            date: this.billData.statisticsMonth,
            url: this.formItem.url,
            customName: this.billData.customName,
            pageIndex: this.pageTotal.pageIndex - 1,
            pageSize: this.pageTotal.pageSize
          }
        })
        .then(res => {
          if (res.data.code == 0) {
            this.tableDataTotal = res.data.data.data;
            if (this.tableDataTotal.length) {
              let total = {
                statisticsMonth: "汇总",
                costTotal: res.data.data.sumCostTotal,
                benefitTotal: res.data.data.sumBenefitTotal,
                realTotal: res.data.data.sumRealTotal
              };
              this.tableDataTotal.push(total);
            }
            this.pageTotal.totalCount = res.data.data.total;
            this.tableDataLoadingTotal = false;
          } else {
            this.$Message.error(res.data.msg);
          }
        })
        .catch(err => {
          this.$Message.error("网络错误" + err);
        });
    },
    searchDataDetails(flag) {
      if (flag) {
        this.pageDetails.pageIndex = 1;
      }
      this.tableDataLoadingDetails = true;
      axios
        .request({
          url: "/finance/queryCpcStatementStatistics",
          method: "post",
          data: {
            date: this.billData.statisticsMonth,
            customName: this.billData.customName,
            pageIndex: this.pageDetails.pageIndex - 1,
            pageSize: this.pageDetails.pageSize
          }
        })
        .then(res => {
          if (res.data.code == 0) {
            this.tableDataDetails = res.data.data.data;
            if (this.tableDataDetails.length) {
              let total = {
                statisticsDate: "汇总",
                costClickCount: res.data.data.sumCostClickCount,
                costTotal: res.data.data.sumCostTotal
              };
              this.tableDataDetails.push(total);
            }
            this.pageDetails.totalCount = res.data.data.total;
            this.tableDataLoadingDetails = false;
          } else {
            this.$Message.error(res.data.msg);
          }
        })
        .catch(err => {
          this.$Message.error("网络错误" + err);
        });
    },
    exportDataTotal() {
      let postData = {
        date: this.billData.statisticsMonth,
        customName: this.billData.customName
      };
      axios
        .request({
          url: "/finance/exportCpcStatementTotal",
          method: "post",
          data: postData,
          responseType: "blob"
        })
        .then(res => {
          if (res.status == 200) {
            const content = res.data;
            const blob = new Blob([content]);
            const fileName =
              "对账单汇总" +
              "(" +
              this.billData.customName +
              "-" +
              this.billData.statisticsMonth +
              ")" +
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
    open(url) {
      window.open(url);
    },
    exportDataDetails() {
      let postData = {
        date: this.billData.statisticsMonth,
        customName: this.billData.customName
      };
      axios
        .request({
          url: "/finance/exportCpcStatementStatistics",
          method: "post",
          data: postData,
          responseType: "blob"
        })
        .then(res => {
          if (res.status == 200) {
            const content = res.data;
            const blob = new Blob([content]);
            const fileName =
              "对账单明细" +
              "(" +
              this.billData.customName +
              "-" +
              this.billData.statisticsMonth +
              ")" +
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
    pageSizeChangeTotal(size) {
      this.pageTotal.pageSize = size;
      this.searchDataTotal();
    },
    pageChangeTotal(index) {
      this.pageTotal.pageIndex = index;
      this.searchDataTotal();
    },
    pageSizeChangeDetails(size) {
      this.pageDetails.pageSize = size;
      this.searchDataDetails();
    },
    pageChangeDetails(index) {
      this.pageDetails.pageIndex = index;
      this.searchDataDetails();
    },
    finishEdit(name) {
      if (this.editDecreasetType()) {
        this.$Message.error("请先保存核减金额");
        return;
      }
      this.$refs[name].validate(valid => {
        if (valid) {
          axios
            .request({
              url: "/finance/editCpcStatement",
              method: "post",
              data: {
                salesId: this.billData.salesId,
                statementNo: this.billData.statementNo,
                remark: this.billData.remark,
                statementUser: this.billData.statementUser,
                serviceName: this.billData.serviceName
              }
            })
            .then(res => {
              if (res.data.code == 0) {
                this.refreshBill();
                this.$Message.success("修改成功");
                this.openEdit = false;
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

    handleEdit() {
      this.cacheBillData = JSON.parse(JSON.stringify(this.billData));
      this.openEdit = true;
    },
    cancelEdit() {
      if (this.editDecreasetType()) {
        this.$Message.error("请先保存核减金额");
        return;
      }
      this.billData = JSON.parse(JSON.stringify(this.cacheBillData));
      this.$refs.billData.fields[0].resetField();
      this.$refs.billData.fields[1].resetField();

      this.openEdit = false;
    },
    editDecrease(row, index) {
      // if (this.openEdit) {
      //   this.$Message.error("请保存账单");
      //   return;
      // }
      this.catchTableDataTotal = JSON.parse(
        JSON.stringify(this.tableDataTotal)
      );
      let list = JSON.parse(JSON.stringify(this.tableDataTotal));
      list[index].isEdit = true;
      this.tableDataTotal = list;
    },
    editDecreasetType() {
      return this.tableDataTotal.some(item => {
        return item.isEdit;
      });
    },
    cancelEditDecrease() {
      this.tableDataTotal = JSON.parse(
        JSON.stringify(this.catchTableDataTotal)
      );
    },
    handleConfim() {
      const params = {}
      this.billData.synopsis ? params.synopsis = this.billData.synopsis : null
      this.billData.cooIsAudit ? params.cooIsAudit = this.billData.cooIsAudit : null
      this.billData.ctoIsAudit ? params.ctoIsAudit = this.billData.ctoIsAudit : null
      axios
        .request({
          url: "/finance/approvalCpcStatement",
          method: "post",
          data: {
            statementNo: this.billData.statementNo,
            ...params
          }
        })
        .then(res => {
          if (res.data.code == 0) {
            this.$Message.success("账单已确认");
            this.refreshBill();
          } else {
            this.$Message.error(res.data.msg);
          }
        })
        .catch(err => {
          this.$Message.error("网络错误" + err);
        });
    },
    refuseClick() {
      if (this.editDecreasetType()) {
        this.$Message.error("请先保存核减金额");
        return;
      } else {
        this.refuseModal = true;
      }
    },
    refreshBill(changeModel) {
      axios
        .request({
          url: "/finance/queryCpcStatementByNo",
          method: "post",
          data: {
            statementNo: this.billData.statementNo
          }
        })
        .then(res => {
          if (res.data.code == 0) {
            if (changeModel == "justChangPrice") {
              this.billData.benefitTotal = res.data.data.benefitTotal;
              this.billData.realTotal = res.data.data.realTotal;
              this.billData.status = res.data.data.status
            } else {
              this.billData = Object.assign({}, res.data.data);
              this.billData.formatDate = this.billData.date.split("至");
              this.getApprovalAuthority(this.billData.id)
            }

            this.confirmModal = false;
          } else {
            this.$Message.error(res.data.msg);
          }
        })
        .catch(err => {
          this.$Message.error("网络错误" + err);
        });
    },
    handleRefuse(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          axios
            .request({
              url: "/finance/rejectCpcStatement",
              method: "post",
              data: {
                statementNo: this.billData.statementNo,
                rejectReason: this.refuseReason.value
              }
            })
            .then(res => {
              if (res.data.code == 0) {
                this.refreshBill();
                this.refuseModal = false;
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
    finishReconciliation() {
      axios
        .request({
          url: "/finance/completeCpcStatement",
          method: "post",
          data: {
            statementNo: this.billData.statementNo
          }
        })
        .then(res => {
          if (res.data.code == 0) {
            this.$Message.success("账单已完成");
            this.completeModal = false;
            this.refreshBill();
          } else {
            this.$Message.error(res.data.msg);
          }
        })
        .catch(err => {
          this.$Message.error("网络错误" + err);
        });
    },
    editCpcStatementTotal(row, index) {
      if (!row.benefitTotal) {
        this.$Message.error("请填写核减金额");
        return;
      }
      if (
        !/^(([^0-][0-9]{0,7}|0)\.([0-9]{1,4})$)|^([^0-]([0-9]{0,7})?|0)$/.test(
          row.benefitTotal
        )
      ) {
        this.$Message.error("核减金额支持小数点前8位，后4位");
        return;
      }
      axios
        .request({
          url: "/finance/editCpcStatementTotal",
          method: "post",
          data: {
            id: row.id,
            benefitTotal: row.benefitTotal
          }
        })
        .then(res => {
          if (res.data.code == 0) {
            this.$Message.success("修改成功");
            this.searchDataTotal();
            this.refreshBill("justChangPrice");
          } else {
            this.$Message.error(res.data.msg);
          }
        })
        .catch(err => {
          this.$Message.error("网络错误" + err);
        });
    },
    sendEmail() {
      this.sendModal = true;
    },
    handleSend() {
      this.$refs.sendForm.validate(valid => {
        if (valid) {
          axios
            .request({
              url: "/finance/sendCpcStatementMail",
              method: "post",
              data: {
                statementNo: this.billData.statementNo,
                sendToName: this.sendForm.name,
                sendToEmail: this.sendForm.email
              }
            })
            .then(res => {
              if (res.data.code == 0) {
                this.$Message.success("邮件已发送");
                this.sendModal = false;
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
    exportBillData(flag) {
      let postData = { statementNo: this.billData.statementNo };
      let param = flag === 'proof' ? {
        url: "/finance/downloadCPCVoucherFile/" + this.billData.id,
        method: 'post',
        responseType: "blob"
      } : {
        url: "/finance/exportCpcStatementByNo",
        method: "post",
        data: postData,
        responseType: "blob"
      }
      axios
        .request(param)
        .then(res => {
          if (res.status == 200) {
            if (flag === 'proof' && res.headers.hasvoucher == 'false') {
                this.$Message.error("该账单下暂无凭证！");
                return;
            }
            const content = res.data;
            const blob = new Blob([content]);
            const fileName = flag === 'proof' ? '凭证' + res.headers.extname : "账单详情" + this.billData.statementNo + ".xls";
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
        .catch((err) => {
          console.log(err)
          this.$Message.error("导出失败" + err);
        });
    },
    importProofModalClose(type) {
      if (!type) {
        this.reqFilesBatch = {
          files: null,
          fileName: ""
        };
      }
    },
    uploadErrorImport(error, file, fileList) {
      this.$Message.error("导入失败");
      this.uploadLoadingImport = false;
    },
    beforeUploadImport(file) {
      const fileExt = file.name.split('.').pop().toLocaleLowerCase()
      if (file.size > 10240000) {
        this.$Message.error("大小限制为10M");
        return false;
      }
      // .png, .jpg, .zip, .eml
      if (fileExt === 'png' || fileExt === 'jpg' ||  fileExt === 'zip' || fileExt === 'eml' || fileExt === 'tar' || fileExt === 'rar') {
        this.reqFilesBatch.files = file;
        this.reqFilesBatch.fileName = file.name;
        return false;
      } else {
        this.$Message.warning('请选择后缀为.png, .jpg, .zip, .rar, .tar, .eml的文件')
        return false;
      }
      // his.$refs.uploadProof.clearFiles();
    },
    uploadSuccessImport(response, file, fileList) {
      if (response.code == 0) {
        this.$Message.success("上传成功");
        this.reqFilesBatch = {
          files: null,
          fileName: ""
        };
      } else {
        this.$Message.error(response.msg);
      }
      this.uploadLoadingImport = false;
      this.proofModal = false
    },
    fileTagCloseBatch() {
      this.reqFilesBatch = {
        files: null,
        fileName: ""
      };
    },
    handleUploadBatch() {
      if (this.reqFilesBatch.files == null) {
        this.$Message.error("请选择导入文件！");
        return;
      } else {
        this.uploadLoadingImport = true;
        let formData = new FormData()
        formData.append('id', this.billData.id)
        formData.append('voucherFile', this.reqFilesBatch.files)
        axios.request({
          url: '/finance/updateCPCVoucherFile',
          method: 'post',
          data: formData
        }).then(response => {
          if (response.data.code == 0) {
            this.$Message.success("上传成功");
            this.reqFilesBatch = {
              files: null,
              fileName: ""
            };
            this.proofModal = false
          } else {
            this.$Message.error(response.msg);
          }
          this.uploadLoadingImport = false;
        }).catch(error => {
          this.$Message.error("网络错误" + error);
          this.uploadLoadingImport = false;
        })
        // this.$refs.uploadProof.post({
        //   id: this.billData.id,
        //   voucherFile: this.reqFilesBatch.files
        // });
      }
    },
    async showAuditProcess(id) {
        try {
            let data = new FormData();
            data.append("statementId", id);
            const res = await axios.request({
                url: "/finance/queryCpcStatementAuditConfig",
                method: "post",
                data: data
            })
            // const copyData = res.data.data

            if (res.data.code === 0) {
              this.processList = res.data.data
              this.processList.approvalProcessNowData == null && (this.processList.approvalProcessNowData = {})
              this.processList.approvalProcessPreviousData == null && (this.processList.approvalProcessPreviousData = {})
              // this.processList.map(process => {
              //     process[process.key + 'AuditRemark'] = copyData[process.key + 'AuditRemark']
              //     process[process.key + 'AuditResult'] = copyData[process.key + 'AuditResult']
              //     process[process.key + 'IsAudit'] = copyData[process.key + 'IsAudit']
              // })
              // this.filterProcessList = this.processList.filter(item => {
              //     return item[item.key + 'IsAudit'] != 2
              // })
              this.approvalModal = true
            } else {
              this.$Message.error("查看出错：" + res.data.msg);
            }
        } catch (error) {
            this.$Message.error("网络错误" + error);
        }
    },
    closeApprovalModal(data) {
      if (!data) {
        this.approvalModal = false
        return
      }
      if (data.type === 'reject') {
        this.auditReject(data.reason)
      } else {
        this.auditAgree(data)
      }
    },
    auditReject(refuseReason) {
      axios
        .request({
          url: "/finance/rejectCpcStatement",
          method: "post",
          data: {
            statementNo: this.billData.statementNo,
            rejectReason: refuseReason
          }
        })
        .then(res => {
          if (res.data.code == 0) {
            this.$Message.success("审批拒绝！");
            this.approvalModal = false;
            this.refreshBill();
          } else {
            this.$Message.error(res.data.msg);
          }
        })
        .catch(err => {
          this.$Message.error("网络错误" + err);
        });
    },
    auditAgree(data) {
      const params = {}
      data.reason ? params.synopsis = data.reason : null
      data.cooIsAudit ? params.cooIsAudit = data.cooIsAudit : null
      data.ctoIsAudit ? params.ctoIsAudit = data.ctoIsAudit : null
      axios
        .request({
          url: "/finance/approvalCpcStatement",
          method: "post",
          data: {
            statementNo: this.billData.statementNo,
            ...params
          }
        })
        .then(res => {
          if (res.data.code == 0) {
            this.$Message.success("审批通过！");
            this.approvalModal = false;
            this.refreshBill();
          } else {
            this.$Message.error(res.data.msg);
          }
        })
        .catch(err => {
          this.$Message.error("网络错误" + err);
        });
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
.btn-left {
  margin-left: 20px;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.btn-download-all {
  display: inline-block;
  position: relative;
}
.btn-download {
    width: 100px;
    background-color: #fff;
    box-sizing: border-box;
    border-radius: 4px;
    box-shadow: 0 1px 6px rgba(0,0,0,.2);
    z-index: 900;
    position: absolute;
    cursor: pointer;
    div {
      padding: 5px;
    }
    div:hover {
      background: #f3f3f3;
    }
}
.btn-left:nth-of-type(1) {
  // margin: 0;
}
.tag-class {
  width: 100%;
  // height: 28px;
  text-align: center;
}
.refuseReason /deep/ .ivu-input-type-textarea .ivu-input-word-count {
  align-items: flex-end;
  top: auto;
}
.refuseReason /deep/ .ivu-input-word-count {
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
.tableClass {
  margin-top: 5px;
  width: 100%;
  font-size: 14px;
  th {
    padding: 5px 0;
  }
  tr {
    td:nth-child(1) {
      padding: 5px 25px;
      width: 130px;
      font-weight: bold;
    }
    td:nth-child(2) {
      padding: 5px 0;
      text-align: center;
    }
  }
}
/deep/ .ivu-input-type-textarea .ivu-input-word-count {
  align-items: flex-end;
  top: auto;
}
/deep/ .ivu-input-word-count {
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