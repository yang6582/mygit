export default {
    VIVOFields: [
      { 
        title: '序号',
        type: 'index',
        width: 65,
        align: 'center'
      },
      {
        title: '应用名称',
        key: 'appName',
        align: "center"
      },
      {
        title: '包名',
        align: "center",
        key: 'packageName'
      },
      {
        title: '状态',
        align: "center",
        width: 100,
        key: 'state',
        slot: 'state'
      }
    ]
  }
