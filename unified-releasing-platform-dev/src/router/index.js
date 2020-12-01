import Vue from 'vue'
import Router from 'vue-router'
import routes from './routers'
import store from '@/store'
import iView from 'view-design'
import { setToken, getToken, canTurnTo, setTitle } from '@/libs/util'
// import { setToken, getToken, canTurnTo, setTitle } from '@/libs/util'
// import config from '@/config'
// const { homeName } = config


Vue.use(Router)
const BASE = process.env.NODE_ENV === 'production'
  ? '/page'
  : '/'
const router = new Router({
  routes,
  mode: 'history',
  base: BASE
  // base: '/page'
})
const errList = {
  401: '登陆错误，请重录后重试！',
  404: '资源未找到！',
  1: '请求失败，原因未知！'
}
// const LOGIN_PAGE_NAME = 'login'

const turnTo = (to, access, next) => {
  if (canTurnTo(to.name, access, routes)) next() // 有权限，可访问
  else next({ replace: true, name: 'error_401' }) // 无权限，重定向到401页面
}

router.beforeEach((to, from, next) => {
  iView.LoadingBar.start()
  if (store.state.app.getPermissionFinish) {
    turnTo(to, store.state.user.access, next)
  } else {
    store.dispatch('getMenuRouterAccess', routes).then(res => {
      turnTo(to, store.state.user.access, next)
    }).catch((err) => {
      next({
        name: 'error_500'
      })
    })
  }
  // }
})

router.afterEach(to => {
  setTitle(to, router.app)
  iView.LoadingBar.finish()
  window.scrollTo(0, 0)
})

export default router
