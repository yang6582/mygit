<template>
  <div>
    <!-- 测试用style -->
    <Tabs v-model="TabsName">
      <TabPane label="按次投放" class="onceClass" name="line" v-if="showAccess('广告管理_广告列表_按次投放页面')">
        <div class="layout-search">
          <Form :model="searchForm" inline :label-width="100">
            <FormItem label="广告渠道:">
              <RadioGroup
                v-model="searchForm.adPositionType"
                type="button"
                @on-change="searchData(true)"
              >
                <Radio :label="item.type" v-for="(item,key) in adTypes" :key="key">{{ item.value }}</Radio>
              </RadioGroup>
            </FormItem>
            <FormItem label="广告名称:">
              <Input
                style="width:180px"
                v-model="searchForm.adName"
                placeholder="广告名称"
                @on-enter="searchData(true)"
                clearable
              />
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
              ></Date-picker>
            </FormItem>
             <FormItem label="厂商:">
              <Select
                v-model="searchForm.partnerId"
                style="width:180px"
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
            <FormItem label="客户名称:">
              <Input
                v-model="searchForm.customerName"
                placeholder="客户名称"
                @on-enter="searchData(true)"
                style="width:180px"
                clearable
              />
            </FormItem>
            <FormItem label="计划名称:">
              <Input
                v-model="searchForm.planName"
                placeholder="计划名称"
                style="width:262px"
                @on-enter="searchData(true)"
                clearable
              />
            </FormItem>
           
            <FormItem label="状态:">
              <Select
                v-model="searchForm.approvalStatus"
                style="width:180px"
                @on-change="searchData(true)"
              >
                <Option :value="-1">全部</Option>
                <Option :value="2">已上线</Option>
                <Option :value="98">已下线</Option>
                <!-- <Option :value="3">已拒绝</Option> -->
                <Option :value="99">已删除</Option>
              </Select>
            </FormItem>
            <FormItem label="oppo状态:">
              <Select
                v-model="searchForm.oppoApprovalStatus"
                style="width:180px"
                @on-change="searchData(true)"
              >
                <Option :value="-99">全部</Option>
                <Option :value="-1">待推送</Option>
                <Option :value="0">审核拒绝</Option>
                <Option :value="1">审核通过</Option>
                <Option :value="90">待审核</Option>
                <Option :value="91">同步失败</Option>
              </Select>
            </FormItem>
            <FormItem label="行业:">
              <Select v-model="searchForm.industry" style="width:180px"
                @on-change="searchData(true)">
                <Option value="-1">全部</Option>
                <Option
                  v-for="item in adIndustry"
                  :value="item.key"
                  :key="item.key"
                >{{ item.value }}</Option>
              </Select>
            </FormItem>
            <FormItem :label-width="50">
              <Button
                type="primary"
                @click="searchData(true)"
                icon="ios-search"
                style="margin-left:10px"
              >查询</Button>
              <Button type="primary" @click="reset" style="margin-left:10px">重置</Button>
              <Button
                type="success"
                @click="openBatchCreateModal"
                v-if="showAccess('广告管理_广告列表_批量创建广告')"
                style="margin-left:10px;"
              >批量创建广告</Button>
            </FormItem>
          </Form>
        </div>
        <div class="layout-table">
          <!-- 自定义列 -->
          <div style="display:flex;">
            <Button
              type="primary"
              @click="batchSentOppo"
              style="margin-right:10px"
              v-if="showAccess('广告管理_广告列表_按次_批量送审oppo')"
            >批量送审oppo</Button>
            <columnsSelect
              :columns="selectColumns"
              :columnsNum="adTypeSearch"
              @columns-change="columnsChange"
              btnSize="default"
            ></columnsSelect>
          </div>
          <Table
            border
            :columns="columnsSelection"
            :data="rowData"
            :loading="tableLoading"
            @on-selection-change="selectionChange"
            style="min-width:1100px;overflow-x:scroll;margin-top: 20px;"
          >
            <template slot-scope="{row, index}" slot="adShortUrl">
              <template>
                <Tooltip
                  transfer
                  placement="top"
                  v-for="(item,sindex) in shortUrlSplit(row.adShortUrl)"
                  style="margin:5px 0 ;"
                  :key="sindex"
                >
                  <div
                    slot="content"
                    style="width: 220px; white-space: normal;word-break: break-all;"
                  >{{item}}</div>
                  <Button
                    size="small"
                    style="color:#59afed"
                    @click="copyShortUrl(item)"
                    v-if="row.adShortUrl"
                  >复制</Button>
                </Tooltip>
              </template>
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
            <template slot-scope="{row}" slot="positionNames">
              <span>{{row.adPositionTypeName}}</span>
            </template>
            <template slot-scope="{row}" slot="adChargedType">
              <span>{{row.adChargedTypeName}}</span>
            </template>
            <template slot-scope="{row}" slot="createTime">
              <span v-if="row.createTime">{{row.createTime | formatDate}}</span>
              <span v-else></span>
            </template>
            <template slot-scope="{row}" slot="updateTime">
              <span v-if="row.updateTime">{{row.updateTime | formatDate}}</span>
              <span v-else></span>
            </template>
            <template slot-scope="{ row }" slot="action">
              <div style="padding:10px 0;display:flex;">
                <Button
                  type="primary"
                  size="small"
                  @click="editCurrentAd(row)"
                  v-if="searchForm.adPositionType != 3 && row.approvalStatus != 99 && showAccess('广告管理_广告列表_按次_编辑')"
                >编辑</Button>
                <Button
                  type="primary"
                  size="small"
                  @click="editCurrentAd2(row)"
                  v-if="searchForm.adPositionType == 3 && row.approvalStatus != 99 && showAccess('广告管理_广告列表_按次_编辑')"
                >编辑</Button>
                <Button
                  style="margin-left: 10px;"
                  size="small"
                  type="success"
                  v-if="row.approvalStatus == 98 && showAccess('广告管理_广告列表_按次_上线')"
                  @click="handleStatus('onl',row.adId,row.adPositionType,row.customerId,row.adName, row.mapId)"
                >上线</Button>
                <Button
                  style="margin-left: 10px;"
                  size="small"
                  type="warning"
                  v-if="row.approvalStatus == 2 && showAccess('广告管理_广告列表_按次_下线')"
                  @click="handleStatus('ins',row.adId,row.adPositionType,row.customerId,row.adName, row.mapId)"
                >下线</Button>
                <Button
                  style="margin-left: 10px;"
                  type="error"
                  v-if="row.approvalStatus != 99 && showAccess('广告管理_广告列表_按次_删除')"
                  @click="handleStatus('del',row.adId,row.adPositionType,row.customerId,row.adName, row.mapId)"
                  size="small"
                >删除</Button>
                <Button
                  style="margin-left: 10px;"
                  size="small"
                  v-if="row.oppoApprovalStatus == -1 && row.approvalStatus == 2 && showAccess('广告管理_广告列表_按次_送审oppo') && row.partnerId === 1"
                  type="dashed"
                  @click="handleStatus('sen',row.adId,row.adPositionType,row.customerId,row.adName, row.mapId)"
                >送审oppo</Button>
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
            <Form
              :model="adFormData"
              :rules="validateEditAd"
              :label-width="80"
              ref="editFormValidate"
            >
              <FormItem label="广告名称:" prop="adName">
                <Input v-model="adFormData.adName" disabled />
              </FormItem>
              <FormItem label="链接(原链):" prop="adUrl">
                <Input
                  v-model="adFormData.adUrl"
                  type="textarea"
                  disabled
                  :autosize="true"
                  style=" white-space: normal;word-break: break-all;"
                  ref="adUrl"
                />
              </FormItem>
              <FormItem label="厂商:">
                <Select v-model="adFormData.partnerId" style="width:140px" disabled>
                  <Option
                    v-for="(item,key) in partnerNames"
                    :value="item.index"
                    :key="key"
                  >{{ item.value }}</Option>
                </Select>
              </FormItem>
              <FormItem label="结算方式:" prop="adChargedType" key="adChargedType">
                <Select v-model="adFormData.adChargedType" style="width: 140px;">
                  <Option
                    v-for="item in adChargedTypes"
                    :value="item.key"
                    :key="item.index"
                  >{{ item.value }}</Option>
                </Select>
              </FormItem>
              <FormItem label="单价:" prop="adPrice">
                <Input v-model="adFormData.adPrice" clearable>
                  <span slot="append">元</span>
                </Input>
              </FormItem>
              <FormItem label="预算:" prop="adBudget">
                <Input v-model="adFormData.adBudget" clearable />
              </FormItem>
              <FormItem label="行业:" prop="industry">
                <Select v-model="adFormData.industry">
                  <Option
                    v-for="item in adIndustry"
                    :value="item.key"
                    :key="item.key"
                  >{{ item.value }}</Option>
                </Select>
              </FormItem>
              <FormItem label="修改原因:" prop="reason">
                <Input
                  v-model="adFormData.reason"
                  type="textarea"
                  :autosize="{minRows: 2}"
                  placeholder="修改单价必须附上JIRA链接"
                  ref="reason"
                  clearable
                />
              </FormItem>
            </Form>
          </div>
          <div slot="footer">
            <Button :loading="ad_edit_loading" @click="closeEditAd">取消</Button>
            <Button type="primary" :loading="ad_edit_loading" @click="confirmEditAd">确定</Button>
          </div>
        </Modal>

        <Modal title="编辑广告" v-model="showEditAd2" width="700" class="showEditAd2">
          <div style="padding:0 80px 0 20px;">
            <Form
              :model="adFormData2"
              :rules="validateEditAd2"
              :label-width="120"
              inline
              ref="editFormValidate2"
            >
              <FormItem label="广告名称:" prop="adName">
                <Input v-model="adFormData2.adName" disabled style="width:150px" />
              </FormItem>
              <FormItem label="厂商:">
                <Select v-model="adFormData2.partnerId" style="width:150px" disabled>
                  <Option
                    v-for="(item,key) in partnerNames"
                    :value="item.index"
                    :key="key"
                  >{{ item.value }}</Option>
                </Select>
              </FormItem>
              <FormItem label="链接(原链):" prop="adUrl">
                <Input
                  v-model="adFormData2.adUrl"
                  type="textarea"
                  disabled
                  autosize
                  style=" white-space: normal;word-break: break-all;width:430px;"
                />
              </FormItem>
              <br />

              <FormItem label="结算方式:" prop="adChargedType">
                <Select v-model="adFormData2.adChargedType" style="width: 150px;">
                  <Option
                    v-for="item in adChargedTypes"
                    :value="item.key"
                    :key="item.index"
                  >{{ item.value }}</Option>
                </Select>
              </FormItem>
              <FormItem label="单价:" prop="adPrice">
                <Input v-model="adFormData2.adPrice" style="width: 150px;" clearable>
                  <span slot="append">元</span>
                </Input>
              </FormItem>
              <FormItem label="预算:" prop="adBudget">
                <Input v-model="adFormData2.adBudget" style="width: 150px;" clearable>
                  <span slot="append">元</span>
                </Input>
              </FormItem>
              <FormItem label="业务标识:" prop="businessType">
                <Select v-model="adFormData2.businessType" style="width:150px">
                  <Option value="1">H5</Option>
                  <Option value="2">deeplink</Option>
                  <Option value="3">快应用</Option>
                </Select>
              </FormItem>
              <FormItem label="广告类型:" prop="positionType">
                <Select
                  v-model="adFormData2.positionType"
                  style="width:150px"
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
                  placement="right"
                  style="margin-left: 20px"
                  v-if="adFormData2.positionType == 5 || adFormData2.positionType == 8"
                >
                  <div slot="content">
                    <img
                      src="../../../public/wordlink.png"
                      alt
                      v-if="adFormData2.positionType == 8"
                    />
                    <img src="../../../public/swiper.png" alt v-if="adFormData2.positionType == 5" />
                  </div>
                  <Button>样例</Button>
                </Poptip>
              </FormItem>
              <br />

              <FormItem
                label="标题:"
                v-if="adFormData2.positionType == 8"
                prop="wordlinkTitle"
                key="wordlinkTitle"
              >
                <Input
                  v-model="adFormData2.wordlinkTitle"
                  type="textarea"
                  placeholder="最少5个字，最多30个字"
                  autosize
                  clearable
                  style="width:430px;"
                  :maxlength="30"
                />
              </FormItem>

              <FormItem
                label="尺寸类型:"
                v-if="adFormData2.positionType == 6 || adFormData2.positionType == 7"
                prop="bannerSizeType"
                key="bannerSizeType"
              >
                <Select
                  v-model="adFormData2.bannerSizeType"
                  style="width:150px"
                  @on-change="bannerSizeTypeChange"
                >
                  <Option value="1">类型1</Option>
                  <Option value="2">类型2</Option>
                  <Option value="3" v-if="adFormData2.positionType == 6">类型3</Option>
                </Select>
                <Poptip trigger="hover" placement="right" style="margin-left: 20px">
                  <div slot="content">
                    <img src="../../../public/banner1.png" alt v-if="adFormData2.positionType == 6" />
                    <img src="../../../public/banner2.png" alt v-if="adFormData2.positionType == 7" />
                  </div>
                  <Button>样例</Button>
                </Poptip>
              </FormItem>

              <FormItem
                label="按钮文案:"
                prop="btnName"
                key="btnName"
                v-if="adFormData2.positionType == 1"
              >
                <div class="content">
                  <i-input v-model="adFormData2.btnName" style="width:150px;" :maxlength="3"></i-input>
                </div>
              </FormItem>

              <FormItem
                label="应用名称:"
                prop="appName"
                key="appName"
                v-if="adFormData2.positionType == 1"
              >
                <Input
                  v-model="adFormData2.appName"
                  type="text"
                  :maxlength="20"
                  style="width:150px;"
                  clearable
                />
              </FormItem>
              <br v-if="adFormData2.positionType == 1" />

              <FormItem
                label="应用描述:"
                prop="appDescribe"
                key="appDescribe"
                v-if="adFormData2.positionType == 1"
              >
                <Input
                  v-model="adFormData2.appDescribe"
                  type="textarea"
                  autosize
                  placeholder="最少5个字，最多30个字"
                  style="width:430px;"
                  :maxlength="30"
                  clearable
                />
              </FormItem>
              <br v-if="adFormData2.positionType == 1" />

              <FormItem
                :label="sourceMaterialType.iconTitle"
                v-if="adFormData2.positionType != 8"
                prop="newBannerUploadedPath"
              >
                <Upload
                  action="https://admin-apsaras.teddymobile.net/api/v3/admin/upload/image"
                  ref="uploadNewBanner"
                  :on-remove="newBannerRemove"
                  accept="image/*"
                  :before-upload="newBannerBeforeUpload"
                  :on-success="imgUploadSuccess"
                  :on-error="imgUploadError"
                >
                  <div
                    v-if="adFormData2.newBannerUploadedPath"
                    style="position:relative;border-raduis:4px;border: 2px dotted gray;line-height: 0;"
                    class="mask-wrap"
                  >
                    <img
                      :src="adFormData2.newBannerUploadedPath"
                      style="max-height:150px;max-width:400px;"
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
                <span>{{sourceMaterialType.iconSize}}</span>
              </FormItem>
              <br v-if="adFormData2.positionType != 8" />

              <FormItem label="频次控制:">
                <div class="content">
                  <RadioGroup v-model="frequency">
                    <Radio :label="0">
                      <span>不限</span>
                    </Radio>
                    <Radio :label="1">
                      <span>单用户设置频次</span>
                    </Radio>
                  </RadioGroup>
                  <div
                    v-if="!!frequency"
                    style="display: flex;flex-direction: row;justify-items: center;margin-bottom: 10px;"
                  >
                    <span style="width: 140px;align-self: center;margin-right: 5px">单用户</span>
                    <Select value="每天" disabled style="margin-right: 5px">
                      <Option value="每天">每天</Option>
                    </Select>
                    <Select value="点击" disabled style="margin-right: 5px">
                      <Option value="点击">点击</Option>
                    </Select>
                    <Input v-model="adFormData2.frequencyNum" type="text" clearable />
                  </div>
                </div>
              </FormItem>
              <br />
              <FormItem label="行业:" prop="industry">
                <Select v-model="adFormData2.industry" style="width:150px;">
                  <Option
                    v-for="item in adIndustry"
                    :value="item.key"
                    :key="item.key"
                  >{{ item.value }}</Option>
                </Select>
              </FormItem>
              <FormItem label="修改原因:" prop="reason">
                <Input
                  v-model="adFormData2.reason"
                  type="textarea"
                  style="width:430px;"
                  :rows="2"
                  clearable
                  :autosize="{minRows: 2}"
                  placeholder="修改单价必须附上JIRA链接"
                  ref="reason"
                />
              </FormItem>
            </Form>
          </div>
          <div slot="footer">
            <Button :loading="ad_edit_loading" @click="closeEditAd2">取消</Button>
            <Button type="primary" :loading="ad_edit_loading" @click="confirmEditAd2">确定</Button>
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
              clearable
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
              clearable
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
              clearable
              style="margin-left:85px;width:250px;"
              v-if="insRadio == 7"
            />
          </div>
          <div slot="footer">
            <Button @click="insModal = false">取消</Button>
            <Button type="primary" @click="insModalOk" :disabled="insRadio == 7 && !insCause">确定</Button>
          </div>
        </Modal>
        <Modal :title="'送审oppo:'+clickAdName" v-model="senModal" :mask-closable="false">
          <div style="padding:0 40px;">
            <h4 style="font-size:14px;margin-bottom:10px;">备注:</h4>
            <Input v-model="senRemark" type="textarea" placeholder="请填写备注" clearable />
          </div>
          <div slot="footer">
            <Button @click="senModal = false">取消</Button>
            <Button type="primary" @click="senModalOk">确定</Button>
          </div>
        </Modal>
      </TabPane>
      <TabPane label="按条投放" class="stripClass" name="strip" v-if="showAccess('广告管理_广告列表_按条投放页面')">
        <adListStrip-com></adListStrip-com>
      </TabPane>
      <TabPane
        label="在线记录表"
        class="stripClass"
        name="documentary"
        v-if="showAccess('广告管理_广告列表_在线记录表页面')"
      >
        <onlineDocumentary-com></onlineDocumentary-com>
      </TabPane>
    </Tabs>
    <Modal
      title="批量创建广告"
      v-model="batchCreateAdModal"
      :mask-closable="false"
      @on-visible-change="importBatchImportClose"
      :closable="false"
    >
      <div style="display:flex;padding-left:20px;margin-bottom:10px;">
        <span style="margin-right:20px;">是否送审OPPO</span>
        <RadioGroup v-model="isOppoApprovalFlag" @on-change="isOppoApprovalFlagChange">
          <Radio label="1">是</Radio>
          <Radio label="0">否</Radio>
        </RadioGroup>
      </div>
      <div class="importContent">
        <Upload
          action="/ad/management/ads/import"
          accept=".xls, .xlsx"
          ref="uploadBatch"
          :headers="headers"
          :show-upload-list="false"
          :before-upload="beforeUploadImport"
          :on-success="uploadSuccessImport"
          :on-error="uploadErrorImport"
          :data="uploadData"
        >
          <Button>选择文件</Button>
        </Upload>
        <a :href="onloadUrl+'广告批量导入模板.xlsx'" download="广告批量导入模板.xlsx">
          <Button
            style="color:#006699;border:none;border-bottom:1px solid #006699;border-radius:0;font-weight:bold;"
            size="small"
            class="sampleBtn"
          >下载示例文件</Button>
        </a>
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
      <div slot="footer">
        <Button type="primary" @click="checkResult" v-if="uploadResponse.result_excel">查看结果</Button>
        <Button
          type="primary"
          @click="handleUploadBatch"
          :loading="uploadLoadingImport"
          style
        >{{uploadLoadingImport ? '导入中' :'导入文件'}}</Button>
        <Button @click="batchCreateAdModal = false" :disabled="uploadLoadingImport">取消</Button>
      </div>
    </Modal>
    <Modal
      v-model="batchModel"
      title="批量送审oppo"
      :mask-closable="false"
      @on-visible-change="closeBatchModal"
    >
      <p style="color:red;text-align: center;">确定该{{batchPassIds.length}}条广告全部送审oppo么？</p>
      <Form
        :model="batchAuditForm"
        inline
        :label-width="100"
        ref="batchAuditForm"
        :rules="batchRuleValidate"
        style="text-align: center;margin-top:10px;"
      >
        <FormItem label="理由：" prop="reason">
          <Input
            v-model="batchAuditForm.reason"
            type="textarea"
            :rows="3"
            placeholder="请输入理由"
            clearable
          ></Input>
        </FormItem>
      </Form>
      <div
        v-if="importResult"
        style="color:red;text-align: center;"
      >成功送审{{batchPassIds.length - importResultFail}}条数据，失败{{importResultFail}}条数据</div>
      <div slot="footer">
        <Button
          type="primary"
          style="margin-left:10px;"
          @click="submitBatchHandler"
          :disabled="importResult"
          :loading="batchLoading"
        >确定</Button>
        <Button @click="batchModel=false">取消</Button>
      </div>
    </Modal>
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
  name: "AdAllList",
  components: {
    columnsSelect: () => import("@/components/columns-select"),
    "adListStrip-com": () => import("./adListStrip"),
    "onlineDocumentary-com": () => import("./onlineDocumentary")

    // MenuTable: () => import('./components/MenuTable.vue')
  },
  data() {
    const validateAdPrice2 = (rule, value, callback) => {
      if (isNaN(this.adFormData2.adPrice)) {
        callback(new Error("单价必须为数字！"));
      }
      // if (this.adFormData2.adPrice < 0 || this.adFormData2.adPrice > 100) {
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
    const validateAdBudget2 = (rule, value, callback) => {
      if (this.adFormData2.adBudget) {
        if (isNaN(this.adFormData2.adBudget)) {
          callback(new Error("预算必须为数字！"));
        }
        if (
          this.adFormData2.adBudget < 0 ||
          this.adFormData2.adBudget > 100000000
        ) {
          callback(new Error("预算范围 0 ~ 100000000"));
        }
        if (!/^\d{0,8}(\.\d{0,4})?$/.test(this.adFormData2.adBudget)) {
          callback(new Error("预算只支持小数点前最多8位，小数点后最多4位"));
        }
      }
      callback();
    };
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
    const validateAdBudget = (rule, value, callback) => {
      if (this.adFormData.adBudget) {
        if (isNaN(this.adFormData.adBudget)) {
          callback(new Error("预算必须为数字！"));
        }
        if (
          this.adFormData.adBudget < 0 ||
          this.adFormData.adBudget > 100000000
        ) {
          callback(new Error("预算范围 0 ~ 100000000"));
        }
        if (!/^\d{0,8}(\.\d{0,4})?$/.test(this.adFormData.adBudget)) {
          callback(new Error("预算只支持小数点前最多8位，小数点后最多4位"));
        }
      }
      callback();
    };
    return {
      uploadData: {
        isOppoApprovalFlag: true
      },
      isOppoApprovalFlag: "1",
      uploadLoadingImport: false,
      batchCreateAdModal: false,
      onloadUrl:
        process.env.NODE_ENV === "production" ? "/page/static/" : "/static/",
      reqFilesBatch: {
        files: null,
        fileName: ""
      },
      uploadResponse: {
        result_excel: ""
      },
      importModal: false,
      headers: {
        "X-Client-Token": getToken(),
        // "X-Client-Token":
        //   "eyJpc0VuYWJsZSI6MSwibGFzdExvZ2luIjoxNTgwODcxOTI3NTA5LCJuaWNrTmFtZSI6InlvdWJpbmdrdW4iLCJ0b2tlbiI6IjYwX3lvdWJpbmdrdW5fMTU4MDg3MTkyNzUwOSIsInVzZXJFbWFpbCI6InlvdWJpbmdrdW5AdGVkZHltb2JpbGUuY24iLCJ1c2VySWQiOjYwLCJ1c2VyTmFtZSI6InlvdWJpbmdrdW4ifQ==",

        "X-Client-Sdk": 2,
        "X-App-Id": "sdt_back_manager",
        "X-App-Version": 1,
        "X-Client-Time": Date.now(),
        "X-Request-Id": uuid(),
        "X-Request-Type": "",
        "X-Tdbear-Id": "",
        "X-Client-Unique": ""
      },
      axisoUrl:
        location.href.indexOf("back-manager.teddymobile.net") > -1
          ? "https://m.teddymobile.cn"
          : "https://m-test.teddymobile.cn",
      uploadHeaders: {
        "X-Client-Token": getToken(),
        "X-Client-Sdk": 2,
        "X-App-Id": "sdt_back_manager",
        "X-App-Version": 1,
        "X-Client-Time": Date.now(),
        "X-Request-Id": uuid(),
        "X-Request-Type": "",
        "X-Tdbear-Id": "",
        "X-Client-Unique": ""
      },
      mapId: null,
      searchForm: {
        adName: this.$route.params.adName || '',
        planName: "",
        submitTime: [],
        adPositionType: this.$route.params.adPositionType || 1,
        customerName: "",
        adShortUrl: "",
        adUrl: "",
        approvalStatus: -1,
        partnerId: -1,
        oppoApprovalStatus: -99,
        industry: "-1",
      },
      oppoApprovalStatus: [],
      operatorId: 0,
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
      frequency: 0,
      operatorCustomId: 0,
      operatorPostion: 0,
      clickAdName: "",
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
      toOppoSelection: "",
      adName: "",
      current_ad_type: 1,
      adTypeSearch: 1,
      total_count: 0,
      pageIndex: 1,
      pageSize: 10,
      TabsName: "",
      adIndustry: [],
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
      columnsSelection: [],
      columns: config.menuColumns, // 菜单的自定义列配置
      middleColumns: config.middleColumns, // 中间页的自定义列配置 adTypeSearch === 3
      rowData: [],
      rowBalanceType: "",
      showEditAd: false,
      showEditAd2: false,
      adFormData: {
        industry: "",
        adPrice: "",
        adBudget: "",
        reason: "31223132"
      }, // 编辑广告拉取的广告详情
      adFormData2: {
        newBannerUploadedPath: "",
        positionType: "1",
        bannerSizeType: "1",
        industry: "",
        adChargedType: "",
        adPrice: "",
        adBudget: "",
        appName: "",
        appDescribe: "",
        wordlinkTitle: "",
        reason: "",
        businessType: ""
      },
      adChargedTypes: [],
      adPositionTypes: [],
      ad_edit_loading: false,
      validateEditAd: {
        industry: [
          { required: true, message: "请选择行业", trigger: "change" }
        ],
        adPrice: [
          { required: true, message: "请填写单价", trigger: "blur" },
          { validator: validateAdPrice, trigger: "blur" }
        ],
        adBudget: [{ validator: validateAdBudget, trigger: "blur" }],
        reason: [{ required: true, message: "请填写修改原因", trigger: "blur" }]
      },
      validateEditAd2: {
        industry: [
          { required: true, message: "请选择行业", trigger: "change" }
        ],
        adChargedType: [
          { required: true, message: "请选择结算方式", trigger: "change" }
        ],
        adPrice: [
          { required: true, message: "请填写单价", trigger: "blur" },
          { validator: validateAdPrice2, trigger: "blur" }
        ],
        adBudget: [{ validator: validateAdBudget2, trigger: "blur" }],
        positionType: [
          { required: true, message: "请选择广告类型", trigger: "change" }
        ],
        businessType: [
          { required: true, message: "请选择业务标识", trigger: "change" }
        ],
        appName: [
          { required: true, message: "应用名称小于20个字", trigger: "blur" }
        ],
        appDescribe: [
          {
            required: true,
            message: "应用描述在5~30个字之间",
            trigger: "blur",
            min: 5,
            max: 30
          }
        ],
        newBannerUploadedPath: [
          { required: true, message: "请上传图片", trigger: "change" }
        ],
        wordlinkTitle: [
          {
            required: true,
            message: "标题在5~30个字之间",
            trigger: "blur",
            min: 5,
            max: 30
          }
        ],
        bannerSizeType: [
          { required: true, message: "请选择尺寸类型", trigger: "change" }
        ],
        reason: [{ required: true, message: "请填写修改原因", trigger: "blur" }]
      },
      batchshopIds: [],
      batchModel: false,
      batchAuditForm: {
        reason: ""
      },
      batchRuleValidate: {
        reason: [
          {
            required: true,
            message: "理由为必填项",
            trigger: "blur"
          }
        ]
      },
      importResult: false,
      importResultFail: 0,
      batchPassIds: [],
      batchLoading: false
    };
  },
  computed: {
    showAccess() {
      return el => {
        return hasShowAccess(el);
      };
    },
    selectColumns() {
      // return this.adTypeSearch === 3 ? this.middleColumns : this.columns;
      return this.columns;
    },
    shortUrlSplit(urlStr) {
      return urlStr => {
        return urlStr.split(";");
      };
    },
    sourceMaterialType() {
      let params = {};
      switch (this.adFormData2.positionType) {
        case "1":
          params = {
            iconTitle: "icon素材",
            iconSize: "大小限制为2M"
          };
          break;
        case "2":
          params = {
            iconTitle: "banner素材",
            iconSize: "建议尺寸1040*400，大小限制为2M"
          };
          break;
        case "3":
          params = {
            iconTitle: "天幕素材",
            iconSize: "大小限制为2M"
          };
          break;
        case "4":
          params = {
            iconTitle: "撕角素材",
            iconSize: "大小限制为2M"
          };
          break;
        case "5":
          params = {
            iconTitle: "长条banner素材",
            iconSize: "建议尺寸1040*259，大小限制为2M"
          };
          break;
        case "6":
          params = {
            iconTitle: "拼图banner1素材",
            iconSize:
              this.adFormData2.bannerSizeType == 1
                ? "类型1: 建议尺寸416*592，大小限制为2M"
                : this.adFormData2.bannerSizeType == 2
                ? "类型2: 建议尺寸589*289，大小限制为2M"
                : "类型3: 建议尺寸289*289，大小限制为2M"
          };
          break;
        case "7":
          params = {
            iconTitle: "拼图banner2素材",
            iconSize:
              this.adFormData2.bannerSizeType == 1
                ? "类型1: 建议尺寸416*592，大小限制为2M"
                : "类型2: 建议尺寸589*289，大小限制为2M"
          };
          break;
        case "9":
          params = {
            iconTitle: "轮播banner",
            iconSize: "建议尺寸1020*392，大小限制为2M"
          };
          break;
        default:
          break;
      }
      return params;
    }
  },
  methods: {
    isOppoApprovalFlagChange(value) {
      value === "1"
        ? (this.uploadData.isOppoApprovalFlag = true)
        : (this.uploadData.isOppoApprovalFlag = false);
    },
    checkResult() {
      axios
        .request({
          url: this.uploadResponse.result_excel,
          method: "post",
          headers: {
            "Content-Type": "application/json"
          },
          responseType: "blob"
        })
        .then(res => {
          const link = document.createElement("a");
          let blob = new Blob([res.data], { type: "application/vnd.ms-excel" });
          link.style.display = "none";
          link.href = URL.createObjectURL(blob);
          link.setAttribute("download", "批量导入广告结果.xlsx");
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        })
        .catch(err => {
          this.$Message.error("导出失败");
        });
    },
    handleUploadBatch() {
      if (this.reqFilesBatch.files == null) {
        this.$Message.error("请选择导入文件！");
        return;
      } else {
        this.uploadLoadingImport = true;
        this.$refs.uploadBatch.post(this.reqFilesBatch.files);
      }
    },
    openBatchCreateModal() {
      this.batchCreateAdModal = true;
    },
    importBatchImportClose(type) {
      if (!type) {
        this.reqFilesBatch = {
          files: null,
          fileName: ""
        };
        this.uploadResponse.result_excel = "";
      }
    },
    beforeUploadImport(file) {
      this.uploadResponse.result_excel = "";
      this.reqFilesBatch.files = file;
      this.reqFilesBatch.fileName = file.name;
      return false;
    },
    uploadSuccessImport(response, file, fileList) {
      if (response.code == 0) {
        this.requestUploadAgain(response.data);
        // }
        // //this.uploadSuccessBatchList = response.data.data.error_list;
        // this.importModal = true;
        this.reqFilesBatch = {
          files: null,
          fileName: ""
        };
      } else {
        this.$Message.error(response.msg);
        this.uploadLoadingImport = false;
        this.batchCreateAdModal = false;
      }
    },
    requestUploadAgain(taskId) {
      axios
        .request({
          url: "/ad/management/ads/getAdImportResult",
          method: "post",
          data: {
            taskId: taskId
          }
        })
        .then(res => {
          if (res.data.code === 0) {
            if (res.data.data.status === 1) {
              setTimeout(() => {
                this.requestUploadAgain(res.data.data.taskId);
              }, 1000);
            } else if (res.data.data.status === 2) {
              this.$Message.success("上传成功,请查看结果");
              this.uploadResponse.result_excel = res.data.data.data;
              this.uploadLoadingImport = false;
            } else if (res.data.data.status === 0) {
              this.uploadLoadingImport = false;

              this.$Message.error("操作失败,服务器错误");
            }
          } else {
            this.$Message.error(res.data.msg);
          }
        })
        .catch(err => {
          this.$Message.error("网络错误" + err);
        });
    },
    uploadErrorImport(error, file, fileList) {
      this.batchCreateAdModal = false;
      this.uploadLoadingImport = false;
      this.$Message.error("导入失败");
    },
    fileTagCloseBatch() {
      this.reqFilesBatch = {
        files: null,
        fileName: ""
      };
      this.uploadResponse.result_excel = "";
    },
    bannerSizeTypeChange() {
      this.adFormData2.newBannerUploadedPath = "";
      this.adFormData2.resImgUrl = "";
      this.$refs.uploadNewBanner.clearFiles();
    },
    positionTypeChange(type) {
      this.adFormData2.newBannerUploadedPath = "";
      this.adFormData2.resImgUrl = "";
      this.$refs.uploadNewBanner.clearFiles();
      if (type == 7) {
        this.adFormData2.bannerSizeType = "1";
      }
    },
    imgUploadError() {
      this.$Notice.error({
        title: "图片上传失败",
        desc: "图片上传失败请检查网络"
      });
    },
    imgUploadSuccess(res, file) {
      if (res.code === 200) {
        this.adFormData2.newBannerUploadedPath = res.data.originUrl;
        this.adFormData2.resImgUrl = res.data.path;

        this.$Notice.success({
          title: "图片上传成功",
          desc: "图片上传成功"
        });
      }
    },
    newBannerRemove() {
      this.$refs.uploadNewBanner.clearFiles();
      this.adFormData2.newBannerUploadedPath = "";
      this.adFormData2.resImgUrl = "";
    },
    newBannerBeforeUpload(file) {
      if (file.size > 2048000) {
        this.$Message.error("图片大小限制为2M");
        return false;
      }
      this.$refs.uploadNewBanner.clearFiles();
    },
    copyShortUrl(url) {
      var oInput = document.createElement("input");
      oInput.value = url;
      document.body.appendChild(oInput);
      oInput.select();
      document.execCommand("Copy"); // 执行浏览器复制命令
      this.$Message.success("复制成功");
      oInput.remove();
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
              this.adChargedTypes = d.data.data.sysConfig.adChargedType;
              // _this.adPositionTypes = d.data.data.sysConfig.adPositionType;
              // _this.partnerNames = d.data.data.sysConfig.partnerId;
              _this.oppoApprovalStatus =
                d.data.data.sysConfig.oppoApprovalStatus;
              this.adIndustry = d.data.data.sysConfig.adIndustry;
            } else {
              _this.$Message.error(d.data.msg);
            }
          },
          err => {
            _this.$Message.error("请求失败，" + err + "，请稍后再试!");
          }
        );
    },
    /**
     * 编辑广告--拉取广告详情
     */
    editCurrentAd(row) {
      axios
        .request({
          url: "/ad/management/ads/adsGroupDetailByGroupId",
          method: "post",
          data: {
            adId: row.adId
          }
        })
        .then(res => {
          if (res.data.code === 0) {
            this.adFormData = res.data.data;
            this.adFormData.planId = row.planId;
            this.adFormData.customerId = row.customerId;
            this.adFormData.positionTypes = [this.adFormData.adPositionType];
            this.adFormData.adChargedType = this.adFormData.adChargedType + "";
            this.adFormData.adPrice = this.adFormData.adPrice + "";
            this.adFormData.adBudget = this.adFormData.adPositionBudget + "";
            this.showEditAd = true;
            this.adFormData.reason = row.reason;
            this.adFormData.industry =
              row.adIndustry === 0 ? "" : row.adIndustry + "";
          }
        });
    },
    editCurrentAd2(row) {
      axios
        .request({
          url: "/ad/management/ads/adsGroupDetailByGroupId",
          method: "post",
          data: {
            adId: row.adId
          }
        })
        .then(res => {
          if (res.data.code === 0) {
            let data = res.data.data;
            this.adFormData2.adId = data.adId;
            this.adFormData2.adGroupId = data.adGroupId;
            this.adFormData2.planId = data.planId;
            this.adFormData2.customerId = data.customerId;
            this.adFormData2.adName = data.adName;
            this.adFormData2.adUrl = data.adUrl;
            this.adFormData2.partnerId = data.partnerId;
            this.adFormData2.adChargedType = data.adChargedType + "";
            this.adFormData2.adPrice = data.adPrice + "";
            this.adFormData2.adBudget = data.adPositionBudget + "";
            this.adFormData2.positionType = data.middlePageType + "";
            this.adFormData2.wordlinkTitle = data.textTitle;
            this.adFormData2.bannerSizeType = data.sizeType + "";
            this.adFormData2.businessType = data.businessType + "";
            this.adFormData2.btnName = data.btnName;
            this.adFormData2.appName = data.appName;
            this.adFormData2.appDescribe = data.appDesc;
            this.adFormData2.adPositionType = data.adPositionType;
            this.adFormData2.reason = data.reason;
            this.adFormData2.industry =
              data.adIndustry === 0 ? "" : data.adIndustry + "";
            if (data.frequencyNum === 0) {
              this.frequency = 0;
            } else {
              this.frequency = 1;
              this.adFormData2.frequencyNum = data.frequencyNum + "";
            }
            this.adFormData2.resImgUrl = data.imgUrl;
            data.imgUrl
              ? (this.adFormData2.newBannerUploadedPath =
                  "//apsaras-static.teddymobile.cn/" + data.imgUrl)
              : false;
            this.showEditAd2 = true;
          }
        });
    },
    searchData(isfirst) {
      // 广告审核 查询
      this.tableLoading = true;
      this.adTypeSearch = this.searchForm.adPositionType;
      if (isfirst) {
        this.pageIndex = 1;
      }
      this.toOppoSelection = "";
      this.current_ad_type = this.searchForm.adPositionType;
      var postData = {
        planName: this.searchForm.planName,
        adName: this.searchForm.adName,
        adPositionType: this.searchForm.adPositionType,
        oppoApprovalStatus: this.searchForm.oppoApprovalStatus,
        // putonStatus: this.searchForm.putonStatus,
        customerName: this.searchForm.customerName,
        createTimeBegin:
          typeof this.searchForm.submitTime[0] === "object"
            ? datefmt(this.searchForm.submitTime[0], "00:00:00")
            : this.searchForm.submitTime[0],
        createTimeEnd:
          typeof this.searchForm.submitTime[1] === "object"
            ? datefmt(this.searchForm.submitTime[1], "23:59:59")
            : this.searchForm.submitTime[1],
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        adShortUrl: this.searchForm.adShortUrl,
        adUrl: this.searchForm.adUrl,
        approvalStatus: this.searchForm.approvalStatus,
        partnerId: this.searchForm.partnerId,
        adIndustry: this.searchForm.industry
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
            dataArr.forEach((item)=>{
              if(item.partnerId !== 1 || item.oppoApprovalStatus != -1 || item.approvalStatus != 2 ){
                item._disabled = true;
              }
            })
            _this.rowData = dataArr;
            _this.total_count = d.data.data.total;
          } else {
            this.$Message.error(d.data.msg);
          }
          this.tableLoading = false;
        })
        .catch(() => {
          this.$Message.error("请求失败!");
          this.tableLoading = false;
        });
    },
    selectionChange(selection) {
      this.toOppoSelection = selection.map(i => i.ad_id).join(",");
      this.batchshopIds = selection.map(item => {
        return item.adId;
      });
      this.batchPassIds = this.batchshopIds;
    },
    columnsChange(columns) {
      columns.unshift({
        type: "selection",
        width: 60,
        align: "center",
        fixed: "left"
      });
      this.columnsSelection = columns;
    },
    reset() {
      this.searchForm = Object.assign({}, this.searchForm, {
        adName: "",
        planName: "",
        submitTime: [
          // new Date(Date.now() - 1000 * 60 * 60 * 24 * 90), new Date()
        ],
        adPositionType: 1,
        // approvalStatus: -1,
        oppoApprovalStatus: -99,
        // putonStatus: -1,
        customerName: "",
        approvalStatus: -1
      });
      this.searchData(true);
    },
    batchSentOppo() {
      if (!this.batchshopIds.length) {
        this.$Message.warning("未选择操作项");
      } else {
        this.batchModel = true;
      }
    },
    submitBatchHandler() {
      let _this = this;
      this.$refs.batchAuditForm.validate(valid => {
        if (valid) {
          let postData = {
            positionType: _this.searchForm.adPositionType,
            adIds: _this.batchshopIds,
            reason: _this.batchAuditForm.reason
          };
          _this.batchLoading = true;
          axios
            .request({
              url: "/ad/management/ads/oppo/approvalBatch",
              method: "post",
              data: postData
            })
            .then(
              d => {
                if (d.data.code === 0) {
                  _this.importResult = true;
                  _this.importResultFail = d.data.data.length;
                  _this.batchshopIds = [];
                  _this.searchData(true);
                } else {
                  _this.$Message.error(d.data.msg);
                }
                _this.batchLoading = false;
              },
              err => {
                _this.batchLoading = false;
                _this.$Message.error("请求失败，" + err + "，请稍后再试!");
              }
            );
        }
      });
    },
    closeBatchModal(flag) {
      if (!flag) {
        this.$refs.batchAuditForm.resetFields();
        this.importResult = false;
      }
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
    closeEditAd2() {
      this.$refs["editFormValidate2"].resetFields();
      this.showEditAd2 = false;
    },
    confirmEditAd() {
      this.$refs["editFormValidate"].validate(valid => {
        if (valid) {
          this.ad_edit_loading = true;
          let postData = {
            adId: this.adFormData.adId,
            adGroupId: this.adFormData.adGroupId,
            adName: this.adFormData.adName,
            adUrl: this.adFormData.adUrl,
            customizedCode: "",
            planId: this.adFormData.planId,
            customerId: this.adFormData.customerId,
            adPositionBudget: Number(this.adFormData.adBudget),
            adChargedType: Number(this.adFormData.adChargedType),
            adPositionType: Number(this.adFormData.positionTypes[0]),
            adPutonType: 1,
            adPrice: this.adFormData.adPrice,
            beginTime: "",
            endTime: "",
            adExt: "",
            approvalStatus: 2,
            rules: [],
            reason: this.adFormData.reason,
            adIndustry: this.adFormData.industry
          };
          axios
            .request({
              url: "/ad/management/ads/edit",
              method: "post",
              data: postData
            })
            .then(res => {
              this.ad_edit_loading = false;
              if (res.data.code === 0) {
                this.showEditAd = false;
                this.searchData();
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
        }
      });
    },
    confirmEditAd2() {
      this.$refs["editFormValidate2"].validate(valid => {
        if (valid) {
          if (this.frequency == 1 && !this.adFormData2.frequencyNum) {
            this.$Message.error("请输入频次");
            return;
          }
          // this.ad_edit_loading = true;
          let postData = {
            adName: this.adFormData2.adName,
            adChargedType: Number(this.adFormData2.adChargedType),
            adPrice: this.adFormData2.adPrice,
            adPositionBudget: this.adFormData2.adBudget,
            middlePageType: this.adFormData2.positionType,
            businessType: this.adFormData2.businessType,
            appName: this.adFormData2.appName,
            appDesc: this.adFormData2.appDescribe,
            btnName: this.adFormData2.btnName,
            textTitle: this.adFormData2.wordlinkTitle,
            imgUrl: this.adFormData2.resImgUrl,
            frequencyNum: this.frequency ? this.adFormData2.frequencyNum : 0,
            sizeType: this.adFormData2.bannerSizeType,
            adId: this.adFormData2.adId,
            adGroupId: this.adFormData2.adGroupId,
            planId: this.adFormData2.planId,
            customerId: this.adFormData2.customerId,
            adPositionType: this.adFormData2.adPositionType,
            reason: this.adFormData2.reason,
            adIndustry: this.adFormData2.industry
          };
          axios
            .request({
              url: "/ad/management/ads/edit",
              method: "post",
              data: postData
            })
            .then(res => {
              this.ad_edit_loading = false;
              if (res.data.code === 0) {
                this.showEditAd2 = false;
                this.searchData();
              } else {
                this.showEditAd2 = true;
                this.$Message.error(res.data.msg);
              }
            })
            .catch(err => {
              this.showEditAd2 = true;
              this.$Message.error("请求失败，" + err + "，请稍后再试！");
            });
        }
      });
    },
    handleStatus(type, id, postion, custom_id, adName, mapId) {
      this.operatorId = id;
      this.operatorCustomId = custom_id;
      this.operatorPostion = postion;
      this.clickAdName = adName;
      this.mapId = mapId;
      switch (type) {
        case "onl":
          this.onl(id);
          break;
        case "ins":
          this.ins(id);
          break;
        case "rec":
          this.rec(id);
          break;
        case "del":
          this.del(id);
          break;
        case "sen":
          this.sen(id);
          break;
        default:
          return;
      }
    },
    onl(id) {
      //上线
      let postData = {
        adId: id,
        mapId: this.mapId,
        adPositionType: this.operatorPostion
      };
      axios
        .request({
          url: "/ad/management/ads/online",
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
    ins(id) {
      //下线
      this.insModal = true;
    },
    rec(id) {
      //恢复
      let postData = {
        adId: id
      };
      axios
        .request({
          url: "/ad/management/ads/recover",
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
    del(id) {
      //删除
      this.delModal = true;
    },
    sen(id) {
      //送审oppo
      this.senModal = true;
      this.senRemark = "";
    },
    delModalOk() {
      this.delModal = false;
      var postData = {
        adId: this.operatorId,
        reason:
          this.delRadio == 3
            ? this.delCause
            : this.delOptions[this.delRadio].title,
        customerId: this.operatorCustomId,
        adPositionType: this.operatorPostion
      };
      axios
        .request({
          url: "/ad/management/ads/delete",
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
        adId: this.operatorId,
        adPositionType: this.operatorPostion,
        reason:
          this.insRadio == 7
            ? this.insCause
            : this.insOptions[this.insRadio].title,
        mapId: this.mapId
      };
      axios
        .request({
          url: "/ad/management/ads/offline",
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
    senModalOk() {
      if (!this.senRemark) {
        this.$Message.error("没有填写送审备注");
        return;
      }
      this.senModal = false;
      let postData = {
        adId: this.operatorId,
        adPositionType: this.operatorPostion,
        desc: this.senRemark
      };
      axios
        .request({
          url: "/ad/management/ads/oppo/approval",
          method: "post",
          data: postData
        })
        .then(d => {
          if (d.data.code == 0) {
            this.$Message.success("送审成功");
            this.searchData();
          } else {
            this.$Message.error(d.data.msg);
          }
        })
        .catch(() => {
          this.$Message.error("网络错误");
        });
    }
  },
  created() {
    if (this.$route.params.strip) {
      this.TabsName = "strip";
    }
    this.getBasicInfo();
    let _this = this
    this.Observer.$on("refreshAdList", (data) => {
      _this.searchForm.adName = data.adName
      _this.searchForm.adPositionType = data.adPositionType
      this.searchData(true);
      return
    });
    this.searchData(true);
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
.showEditAd2 /deep/ .ivu-form-item-error-tip {
  white-space: nowrap;
}
.importContent {
  padding: 0 20px;
  position: relative;
  .sampleBtn {
    position: absolute;
    top: 4px;
    left: 120px;
  }
}
</style>
