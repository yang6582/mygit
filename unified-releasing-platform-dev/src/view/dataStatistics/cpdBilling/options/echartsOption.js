export const echartsOption = {
    title: {
        text: 'CPD总数据',
       left:'center'

    },
    tooltip: {
        trigger: 'axis'
    },
    color:['#faaf9a','#fbdd86','#8be2e4','#6bb4dc'],
    legend: {
        data: ['oppo当日营收','oppo下载总量','vivo当日营收','vivo下载总量'],
        bottom:'0'
    },
    grid: {
        top: '40',
        left: '3%',
        right: '4%',
        bottom: '40',
        containLabel: true
    },
    toolbox: {
        feature: {
            saveAsImage: {}
        },
        showTitle:false
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: []
    },
    yAxis: {
        type: 'value'
    },
    series: [
        {
            name: 'oppo当日营收',
            type: 'line',
            lineStyle:{
                normal:{
                    color:'#faaf9a'
                }
            },
            data: []
        },
        {
            name: 'oppo下载总量',
            type: 'line',
            lineStyle:{
                normal:{
                    color:'#fbdd86'
                }
            },
            data: []
        },
        {
            name: 'vivo当日营收',
            type: 'line',
            lineStyle:{
                normal:{
                    color:'#8be2e4'
                }
            },
            data: []
        },
        {
            name: 'vivo下载总量',
            type: 'line',
            lineStyle:{
                normal:{
                    color:'#6bb4dc'
                }
            },
            data: []
        }
    ]
};