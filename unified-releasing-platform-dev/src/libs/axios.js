import axios from 'axios'
import store from '@/store'
import CryptoJS from 'crypto-js'

import { getToken, setToken, uuid } from '@/libs/util'
import { Stats, stat } from 'fs'
const PROCESS_ENV = process.env.NODE_ENV === 'production'

const addErrorLog = errorInfo => {
  const { statusText, status, request: { responseURL } } = errorInfo
  let info = {
    type: 'ajax',
    code: status,
    mes: statusText,
    url: responseURL
  }
  // if (!responseURL.includes('save_error_logger')) store.dispatch('addErrorLog', info)
}

class HttpRequest {
  constructor(baseUrl = baseURL) {
    this.baseUrl = baseUrl
    this.queue = {}
  }
  getInsideConfig() {
    let clientToken = ''
    if (process.env.NODE_ENV !== 'development') {
      // const test = 'eyJsYXN0TG9naW4iOjE1NjU2ODI0NDQyMjgsIm5pY2tOYW1lIjoiIiwidG9rZW4iOiIwX2xpc2hhbnNoYW4iLCJ1c2VyRW1haWwiOiJsaXNoYW5zaGFuQHRlZGR5bW9iaWxlLmNuIiwidXNlcklkIjowLCJ1c2VyTmFtZSI6Imxpc2hhbnNoYW4ifQ=='
      // !getToken() && setToken(test)
      if (getToken()) {
        clientToken = getToken()
        let parsedWordArray = CryptoJS.enc.Base64.parse(getToken());
        localStorage.userName = JSON.parse(parsedWordArray.toString(CryptoJS.enc.Utf8)).userName;
        //  clientToken = JSON.parse(parsedWordArray.toString(CryptoJS.enc.Utf8)).token
      }
    }
    const config = {
      baseURL: this.baseUrl,
      headers: {
        'X-Client-Sdk': 2,
        'X-App-Id': 'sdt_back_manager',
        'X-App-Version': 1,
        'X-Client-Time': Date.now(),
        'X-Request-Id': uuid(),
        'X-Client-Token': clientToken,
        //  'X-Client-Token': 'eyJpc0VuYWJsZSI6MSwibGFzdExvZ2luIjoxNjAzMTU5MjQ4NDk3LCJuaWNrTmFtZSI6InlvdWJpbmdrdW4iLCJ0b2tlbiI6IjYwX3lvdWJpbmdrdW5fMTYwMzE1OTI0ODQ5NyIsInVzZXJFbWFpbCI6InlvdWJpbmdrdW5AdGVkZHltb2JpbGUuY24iLCJ1c2VySWQiOjYwLCJ1c2VyTmFtZSI6InlvdWJpbmdrdW4ifQ==',
        'X-Request-Type': '',
        'X-Tdbear-Id': '',
        'X-Client-Unique': ''
      }
    }
    return config
  }
  destroy(url) {
    delete this.queue[url]
    if (!Object.keys(this.queue).length) {
      // Spin.hide()
    }
  }
  interceptors(instance, url) {
    // 请求拦截
    instance.interceptors.request.use(config => {
      // 添加全局的loading...
      if (!Object.keys(this.queue).length) {
        // Spin.show() // 不建议开启，因为界面不友好
      }
      this.queue[url] = true
      return config
    }, error => {
      return Promise.reject(error)
    })
    // 响应拦截
    instance.interceptors.response.use(res => {
      let { status, data, headers} = res;
      this.destroy(url)
      if (PROCESS_ENV) {
        if (status == 200 && data && data.code == 401) {
          location.href = data.msg;
        } else if (status == 200 && data && data.code == 403) {
          store.commit('openPermissionModal')
        }
      }
      return { data, status, headers}
    }, error => {
      this.destroy(url)
      return Promise.reject(error)
    })
  }
  request(options) {
    const instance = axios.create()
    // 合并headers
    options.headers = Object.assign(this.getInsideConfig().headers, options.headers)
    options = Object.assign(this.getInsideConfig(), options)
    this.interceptors(instance, options.url)
    return instance(options)
  }
  // 部分请求不需要携带那一堆请求头
  commonRequset(options) {
    const instance = axios.create()
    this.interceptors(instance, options.url)
    return instance(options)
  }
}
export default HttpRequest
