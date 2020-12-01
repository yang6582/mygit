export default {
    limitOptions: [{
        value: '$IMEIFID()',
        label: "$IMEIFID()=='xxx'->判断IMEI文件ID"
    }, {
        value: '$M()',
        label: "$M()=='iphone6s'->判断手机型号"
    }, {
        value: '$CITY()',
        label: "$CITY()=='北京'->判断城市"
    }, {
        value: '$V()',
        label: "$V()>='13.8.0'->TeddySDK版本号" 
    }, {
        value: '$SDK()',
        label: "$SDK()>=23->Android系统版本,数值型"
    }, {
        value: '$H()',
        label: "$H()==23->设备百分比"
    }, {
        value: '$HF()',
        label: "参数定制，仅支持VIVO，参数取值范围0/1"
    }, {
        value: '&&',
        label: '&&->并且'
    }, {
        value: '||',
        label: '||->或'
    }],
    adDetailsFields: {
        adName: '广告名称',
        adPrice: '单价',
        adChargedTypeName: '结算方式',
        adShortUrl: '链接（短链）',
        adUrl: '链接（原链）',
        adBudget: '预算',
        positionNames: '广告位',
        adPutonTypeName: '投放类型',
        customerName: '客户名称'
    },
    adTableFields: [
        {
            // type: 'selection',
            title: '选择',
            width: 65,
            align: 'center',
            key: 'id',
            slot: 'id'
        },{
            title: '序号',
            type: 'index',
            width: 65,
            align: 'center',
            key: 'index'
        },{
            title: '客户名称',
            align: 'center',
            key: 'customerName',
        },{
            title: '计划名称',
            align: 'center',
            key: 'planName',
        },{
            title: '广告名称',
            align: 'center',
            key: 'adName',
        },{
            title: '原链',
            align: 'center',
            key: 'adUrl',
            slot: 'adUrl'
        },{
            title: '结算方式',
            align: 'center',
            key: 'adChargedType',
            slot: 'adChargedType'
        },{
            title: '广告单价',
            align: 'center',
            key: 'adPrice',
        },{
            title: '行业',
            align: 'center',
            key: 'adIndustryName',
        },{
            title: '广告渠道',
            align: 'center',
            key: 'positionNames',
            slot: 'positionNames'
        },{
            title: '广告状态',
            align: 'center',
            key: 'approvalStatusName',
            slot: 'approvalStatusName'
        }
    ]    
}