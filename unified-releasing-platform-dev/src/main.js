// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
// import iView from 'iview'

import config from '@/config'
import importDirective from '@/directive'
import { directive as clickOutside } from 'v-click-outside-x'
import installPlugin from '@/plugin'
import './index.less'
import '@/assets/icons/iconfont.css'
import TreeTable from 'tree-table-vue'
import VOrgTree from 'v-org-tree'
import 'v-org-tree/dist/v-org-tree.css'
import Observer from '@/utils/observer.js'
import Viewer from 'v-viewer'
import '@/components/viewer/dist/viewer.css'
import JSONView from 'vue-json-viewer'
import 'vue-json-viewer/style.css'
import ViewUI from 'view-design';
import { DatePicker } from 'element-ui';

// import style
// import 'view-design/dist/styles/iview.css';

Vue.use(ViewUI,{transfer: true});
Vue.use(JSONView)
Vue.use(Viewer);
Vue.use(DatePicker)
Viewer.setDefaults({
  Options: { "inline": true, "button": true, "navbar": true, "title": true, "toolbar": true, "tooltip": true, "movable": true, "zoomable": true, "rotatable": true, "scalable": true, "transition": true, "fullscreen": true, "keyboard": true, "url": "data-source" }
});
// 实际打包时应该不引入mock
/* eslint-disable */
// if (process.env.NODE_ENV !== 'production') require('@/mock')


Vue.use(ViewUI)
Vue.use(TreeTable)
Vue.use(VOrgTree)
/**
 * @description 注册admin内置插件
 */
installPlugin(Vue)
/**
 * @description 生产环境关掉提示
 */
Vue.config.productionTip = false
/**
 * @description 全局注册应用配置
 */
Vue.prototype.$config = config
/**
 * 全局绑定--父子组件之间传值$on,$emit,$off
 */
Vue.prototype.Observer = Observer
/**
 * 注册指令
 */
importDirective(Vue)
Vue.directive('clickOutside', clickOutside)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  // i18n,
  store,
  render: h => h(App)
})
