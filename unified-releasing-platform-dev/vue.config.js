const path = require('path')

const resolve = dir => {
  return path.join(__dirname, dir)
}

// 项目部署基础
// 默认情况下，我们假设你的应用将被部署在域的根目录下,
// 例如：https://www.my-app.com/
// 默认：'/'
// 如果您的应用程序部署在子路径中，则需要在这指定子路径
// 例如：https://www.foobar.com/my-app/
// 需要将它改为'/my-app/'
// iview-admin线上演示打包路径： https://file.iviewui.com/admin-dist/
const BASE_URL = process.env.NODE_ENV === 'production'
  ? '/page/'
  : '/'
module.exports = {
  // publicPath: BASE_URL,
  // Project deployment base
  // By default we assume your app will be deployed at the root of a domain,
  // e.g. https://www.my-app.com/
  // If your app is deployed at a sub-path, you will need to specify that
  // sub-path here. For example, if your app is deployed at
  // https://www.foobar.com/my-app/
  // then change this to '/my-app/'
  baseUrl: BASE_URL,
  assetsDir: 'static',
  // tweak internal webpack configuration.
  // see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
  // 如果你不需要使用eslint，把lintOnSave设为false即可
  lintOnSave: false,
  chainWebpack: config => {
    config.resolve.alias
      .set('@', resolve('src')) // key,value自行定义，比如.set('@@', resolve('src/components'))
      .set('_c', resolve('src/components'))
      .set('viewerjs', resolve('src/components/viewer/dist/viewer.esm.js'))
  },
  // 打包时不生成.map文件
  productionSourceMap: false,
  // 这里写你调用接口的基础路径，来解决跨域，如果设置了代理，那你本地开发环境的axios的baseUrl要写为 '' ，即空字符串
  // devServer: {
  //   proxy: 'localhost:3000'
  // }
  // back-manager-test.teddymobile.net
  devServer: {
    port: 9090,
    proxy: {
      // '/ad/menus': {
      //   target: 'http://192.168.1.71:9090',
      //   changeOrigin: true
      // },
      '/login': {
        target: 'http://test.e.teddymobile.cn',
        changeOrigin: true
      },
      '/logout': {
        target: 'http://test.e.teddymobile.cn',
        changeOrigin: true
      },
      '/auth': {
        target: 'https://back-manager-test.teddymobile.net',
        changeOrigin: true
      },
      '/ad/customer/salesman': { // 销售人员列表
        target: 'https://back-manager-test.teddymobile.net',
        changeOrigin: true
      },
      '/sys/utils/': {
        target: 'https://back-manager-test.teddymobile.net',
        changeOrigin: true
      },
      '/ad': {
        target: 'https://back-manager-test.teddymobile.net',
        changeOrigin: true
      },
      '/adMonthly': {
        target: 'https://back-manager-test.teddymobile.net',
        changeOrigin: true
      },
      '/cpd': {
        target: 'https://back-manager-test.teddymobile.net',
        changeOrigin: true
      },
      '/third/vivo/menu/approval': {
        target: 'https://back-manager-test.teddymobile.net',
        changeOrigin: true
      },
      '/finance': {
        target: 'https://back-manager-test.teddymobile.net',//http://192.168.1.118:9090
        changeOrigin: true
      },
      '/toolCase':{
        target: 'https://back-manager-test.teddymobile.net',
        changeOrigin: true
      },
      '/statistic': {
        target: 'https://back-manager-test.teddymobile.net',
        // target: 'http://172.29.3.145:8111',
        changeOrigin: true
      },
      '/common': {
        target: 'https://back-manager-test.teddymobile.net',
        // target: 'http://172.29.3.145:8111',
        changeOrigin: true
      }
    }
  }
}
