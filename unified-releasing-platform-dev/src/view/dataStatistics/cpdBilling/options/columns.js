export default {
    columns: [
        {
            title: '序号',
            // type: 'index',
            width: 65,
            align: 'center',
            key: 'index',
            slot: 'index'
        },
        {
            title: '日期',
            align: 'center',
            key: 'date'
        },
        {
            title: '当日营收',
            align: 'center',
            key: 'total_cost'
        },
        {
            title: '应用数',
            align: 'center',
            key: 'total_apps'
        },
        {
            title: '下载总量',
            align: 'center',
            key: 'download_num'
        },
        {
            title: '单个均价',
            align: 'center',
            key: 'price'
        },
        {
            title: '厂商',
            align: 'center',
            slot: 'firm'
        }
    ]
}
