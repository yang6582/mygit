<template>
    <Modal
        title="核减审批"
        :value="approvalModal"
        :mask-closable="false"
        class="auditProcessModal"
        width="800"
        @on-visible-change="closeAuditModal"
        draggable
      >
        <Form
          :model="approvalData"
          :label-width="80"
          :inline="true"
          ref="auditForm"
          style="margin-top:20px;border-bottom: 1px dotted #b3b1b1"
        >
            <FormItem label="客户名称:">
                <Input v-model="approvalData.customName" style="width: 160px" readonly />
            </FormItem>
            <FormItem label="账户余额:">
                <Input v-model="approvalData.totalBalance" style="width: 160px" readonly><span slot="append">元</span></Input>
            </FormItem>
            <FormItem label="消费金额:">
                <Input v-model="approvalData.costTotal" style="width: 160px" readonly><span slot="append">元</span></Input>
            </FormItem>
            <FormItem label="核减金额:">
                <Input v-model="approvalData.benefitTotal" style="width: 160px" readonly><span slot="append">元</span></Input>
            </FormItem>
            <FormItem label="应收金额:">
                <Input v-model="approvalData.realTotal" style="width: 160px" readonly><span slot="append">元</span></Input>
            </FormItem>
        </Form>
        <div style="display:flex;flex-direction:row;justify-content: space-around;margin-top: 20px;">
            <div v-for="(process, index) in processList" :key="index" style="display:flex;flex-direction: row;align-items: center;">
                <div :class="['processBox', {currentProcessBox: process.key == currentRole}]" @click="clickRole(process.key)"
                    :style="{backgroundColor: process[process.key + 'AuditResult'] === 3 ? '#009688' : (process[process.key + 'AuditResult'] === 4 ? '#f35f54' : '#ffffff')}">
                    {{process.department}}<br v-if="process.department"/>
                </div>
                <div :key="index + '11'" style="margin-left: 20px;" :class="{showButton: process.key == 'cfo'}">
                    <button v-if="isEditable && process.key == 'cfo' && currentRole === 'cfo'
                        && (approvalData.benefitTotal/approvalData.realTotal <= 0.1 && approvalData.benefitTotal < 5000)" 
                        :class="{choicedButton: cooIsAudit}" @click="choiceButton('coo')">COO</button>
                    ----------
                    <button v-if="isEditable && process.key == 'cfo' && currentRole === 'cfo' 
                        && (approvalData.benefitTotal/approvalData.realTotal <= 0.1 && approvalData.benefitTotal < 5000)"  
                        :class="{choicedButton: ctoIsAudit}" @click="choiceButton('cto')">CTO</button>
                </div>
            </div>
            <div style="cursor: pointer;display:flex;">
                <div :class="['semiCircle', 'leftCircle', {currentProcessBox: currentRole == 'coo'}]"  @click="clickRole('coo')" :style="{backgroundColor: approvalData.approvalProcessNowData 
                    && approvalData.approvalProcessNowData['cooAuditResult'] === 3 
                    ? '#009688' 
                    : (approvalData.approvalProcessNowData && approvalData.approvalProcessNowData['cooAuditResult'] === 4 ? '#f35f54' : '#ffffff')}">
                    COO
                </div>
                <div :class="['semiCircle', 'rightCircle', {currentProcessBox: currentRole == 'cto'}]" @click="clickRole('cto')" :style="{backgroundColor: approvalData.approvalProcessNowData && approvalData.approvalProcessNowData['ctoAuditResult'] === 3 ? '#009688' : (approvalData.approvalProcessNowData && approvalData.approvalProcessNowData['ctoAuditResult'] === 4 ? '#f35f54' : '#ffffff')}">
                    CTO
                </div>
            </div>
        </div>
        <Input style="" class="processRemark"
            v-model="roleRemark"
            type="textarea"
            :placeholder="isEditable && !ifEditable ? '请填写审批意见' : ''"
            @on-change="changeInputRemark"
            :readonly="ifEditable" 
            maxlength="300"/> 
        <Table
            border
            :columns="columns"
            :data="tableData"
            align="center"
            key="tableData"
            :loading="tableDataLoading"
        >
        <template slot-scope="{row}" slot="auditTime">
          <span v-if="row.auditTime">{{row.auditTime | formatDate}}</span>
          <span v-else></span>
        </template>
        <template slot-scope="{ row }" slot="auditRemark">
          <Tooltip placement="top" transfer>
            <div 
              slot="content" 
              style="width: 220px; white-space: normal;word-break: break-all;"
            >{{row.auditRemark}}</div>
            <div class="textOverFlow" v-if="row.auditRemark"
            >{{row.auditRemark}}</div>
          </Tooltip>
        </template>
        <template slot-scope="{ row }" slot="priviousRemark">
          <Tooltip placement="top" transfer>
            <div 
              slot="content" 
              style="width: 220px; white-space: normal;word-break: break-all;"
            >{{row.priviousRemark}}</div>
            <div class="textOverFlow" v-if="row.priviousRemark"
            >{{row.priviousRemark}}</div>
          </Tooltip>
        </template>
        </Table>
        <div slot="footer">
          <Button @click="closeModal">取消</Button>
          <Button v-if="isEditable" type="primary" style="margin-left:10px;" @click="auditHandler('reject')">拒绝</Button>
          <Button v-if="isEditable" type="primary" style="margin-left:10px;" @click="auditHandler('agree')">同意</Button>
        </div>
      </Modal>
</template>

<script>
    import config from './config'
    import moment from "moment";
    const defaultProcessList = [{ // cfoIsAudit:2无需审批，1需要审批
        department: 'AE',
        // name: 'AE',
        key: 'ae',
        aeAuditRemark: "",
        aeAuditResult: 2,
        aeIsAudit: 1,
        aeAuditTime: null,
	    aeOptUser: "",
    }, {
        department: '销售',
        // name: '谷兴芳',
        key: 'saleLeader',
        saleLeaderAuditRemark: "销售",
        saleLeaderAuditResult: 3,
        saleLeaderIsAudit: 1,
        saleLeaderAuditTime: null,
	    saleLeaderOptUser: "",
    },{
        department: '运营',
        // name: '谷兴芳',
        key: 'omLeader',
        omLeaderAuditRemark: "语音",
        omLeaderAuditResult: 3,
        omLeaderIsAudit: 1,
        omLeaderAuditTime: null,
	    omLeaderOptUser: "",
    },{
        department: '风控',
        // name: '柴利国',
        key: 'cfo',
        cfoAuditRemark: "风控",
        cfoAuditResult: 3,
        cfoIsAudit: 1,
        cfoAuditTime: null,
	    cfoOptUser: "",
    },
    // {
    //     department: 'COO',
    //     // name: '叶松',
    //     key: 'coo',
    //     cooAuditRemark: "",
    //     cooAuditResult: 4,
    //     cooIsAudit: 1
    // }, {
    //     department: 'CTO',
    //     // name: '欧文',
    //     key: 'cto',
    //     ctoAuditRemark: "",
    //     ctoAuditResult: 3, // 通过
    //     ctoIsAudit: 1
    // }
    ]
    const roleOrderList = {'核减审核-销售-LEADER': 1, '核减审核-OM-LEADER': 2, '核减审核-CFO': 3, '核减审核-COO': 4, '核减审核-CTO': 5}
    const roleMap = {'核减审核-销售-LEADER': 'saleLeader', '核减审核-OM-LEADER': 'omLeader', '核减审核-CFO': 'cfo', '核减审核-COO': 'coo', '核减审核-CTO': 'cto'}
    export default {
        name: 'approvalBill',
        props: ['approvalModal', 'approvalData', 'isEditable'],
        data() {
            return {
                roleRemark: '',
                tableDataLoading: false,
                cooIsAudit: false,
                ctoIsAudit: false,
                ifEditable: false,
                currentRole: '', //用户当前处于的角色
                circleRole: 'ae', //用户点圆圈的角色
                tableData: []
            }
        },
        filters: {
            formatDate(value) {
                return moment(value).format("YYYY-MM-DD HH:mm:ss");
            },
            formatDate2(value) {
                return moment(value).format("YYYY-MM-DD");
            }
        },
        created () {
        },
        computed: {
            processList() {
                const copyData = this.approvalData.approvalProcessNowData
                if (!copyData) return defaultProcessList
                defaultProcessList.map(process => {
                    process[process.key + 'AuditRemark'] = copyData[process.key + 'AuditRemark'] ? copyData[process.key + 'AuditRemark'] : ''
                    process[process.key + 'AuditResult'] = copyData[process.key + 'AuditResult'] ? copyData[process.key + 'AuditResult'] : 2
                    process[process.key + 'IsAudit'] = copyData[process.key + 'IsAudit'] ? copyData[process.key + 'IsAudit'] : 2
                })
                return defaultProcessList
            },
            columns() {
                if (this.approvalData.approvalProcessPreviousData == null ) {
                    return config.approvalTables 
                } else {
                    let columns = [...config.approvalTables]
                    columns.splice(4, 0, {title: '审批意见',
                        align: 'center',
                        key: 'priviousRemark',
                        slot: 'priviousRemark',
                    })
                    return columns
                }
                    
            },
        },
        watch: {
            'approvalModal'(newValue, oldValue) {
                if (newValue) {
                    let data = []
                    const tableFields = config.approvalTableData
                    const processData = Object.assign({}, this.approvalData.approvalProcessNowData || defaultProcessList)
                    const previousData = Object.assign({}, this.approvalData.approvalProcessPreviousData)
                    Object.keys(tableFields).map(field => {
                        let item = {
                            name: tableFields[field].name, 
                            optUser: processData[field + 'OptUser'] || '',
                            auditTime: processData[field + 'AuditTime'] || '',
                            auditRemark: processData[field + 'AuditRemark'] || '',
                        }
                        if (previousData != null) {
                            item.priviousRemark = previousData[field + 'AuditRemark'] || ''
                        }
                        data.push(item)
                    })
                    this.tableData = data
                }
            },
            'approvalData.approvalProcessNowData'(newValue, oldValue) {
                if (newValue && newValue !== oldValue) {
                     // 获取用户的角色
                    const userRoles = this.$store.state.user.userBasicInfo.userRoles
                    // 判断当前用户以什么样的角色去审批
                    let currentRoles = []
                    userRoles.map(item => {
                        Object.keys(roleOrderList).includes(item.roleName) && currentRoles.push(item.roleName)
                    })
                    const roleNeedAudit = currentRoles.filter((role, index) => {
                        return newValue[roleMap[role] + 'AuditResult'] == 2
                        // if (newValue[roleMap[role] + 'AuditResult'] == 2 //2是待审批
                        // ) {
                        //     this.currentRole = this.circleRole = roleMap[role]
                        // }
                    })
                    // 按照角色优先级，选择需要审核的角色
                    roleNeedAudit.sort((a, b) => {
                        return roleOrderList[a] - roleOrderList[b]
                    })
                    this.currentRole = this.circleRole = roleMap[roleNeedAudit[0]]
                }
            }
        },
        methods: {
            clickRole(role) {
                const copyData = this.approvalData.approvalProcessNowData
                this.circleRole = role
                this.roleRemark = copyData[role + 'AuditRemark'] || ''
                if (role === this.currentRole) {
                    this.ifEditable = false
                } else {
                    this.ifEditable = true
                }
            },
            choiceButton(role) {
                this[role + 'IsAudit'] = !this[role + 'IsAudit']
            },
            changeInputRemark(event) {
                this.approvalData.approvalProcessNowData[this.currentRole + 'AuditRemark'] = event.target.value
            },
            closeModal() {
                this.$emit('close')
            },
            auditHandler(type) {
                const reason = this.approvalData.approvalProcessNowData[this.currentRole + 'AuditRemark'] || ''
                if (!reason) {
                    this.$Message.error("请填写" + (type === 'reject' ? '拒绝' : '通过') + "理由！")
                    return
                }
                let param = {type: type, reason: reason}
                if (type === 'agree') {
                    if ( this.approvalData.benefitTotal/this.approvalData.realTotal > 0.1 
                        || this.approvalData.benefitTotal >= 5000) {
                            param.cooIsAudit = 1
                            param.ctoIsAudit = 1
                    } else {
                        param.cooIsAudit = Number(this.cooIsAudit)
                        param.ctoIsAudit = Number(this.ctoIsAudit)
                    }
                }
                this.$emit('close', param)
            },
            closeAuditModal(flag) {
                if (!flag) {
                    this.roleRemark = ''
                    this.closeModal()
                }
            },
        },
    }
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
    .semiCircle {
        width: 35px;
        height: 70px;
        align-items: center;
        display: flex;
        justify-content: center;
        border: 1px solid #5c5d5e;
    }
    .leftCircle {
        border-radius: 50px 0px 0px 50px;
    }
    .rightCircle {
        border-radius: 0 50px 50px 0px;
    }
    .showButton {
        display: flex;
        flex-direction: column;
    }
    .choicedButton {
        background-color: #2d8cf0;
        border-color: #2d8cf0;
        border-radius: 3px;
    }
  .processRemark{
      margin-top: 20px;
      margin-bottom: 20px;
    // display: flex;
    // justify-content: center;
  }
  div.currentProcessBox {
    border: 3px solid #fbe104;
  }
  .processBox {
    display: flex;
    text-align: center;
    justify-content: center;
    align-items: center;
    width: 70px;
    height: 70px;
    border: 1px solid #5c5d5e;
    border-radius: 50%;
    flex-direction: column;
    position: relative;
    cursor: pointer;
    i {
      position: absolute;
      right: -30px;
    }
  }
}
</style>