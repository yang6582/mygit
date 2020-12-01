import axios from 'axios'
import crypto from 'crypto'

const KEY = 'NGIxY2UwMm'

axios.interceptors.request.use(function (config) {
  Object.assign(config.headers, createSign())
  // 在发送请求之前做些什么
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

function createSign () {
  const now = Date.now() / 1000 | 0
  const sign = md5(now + KEY)
  return {
    timeStamp: now,
    sign
  }
}

function md5 (str) {
  return crypto.createHash('md5').update(str).digest('hex')
}

const openFn = window.open

window.open = function (...args) {
  let url = args[0]
  url = setQuery(url, createSign())
  args[0] = url
  openFn.apply(window, args)
}

function setQuery (url, objOrKey, value) {
  let options = null
  if (typeof objOrKey === 'object') {
    options = objOrKey
  } else {
    options = {
      [objOrKey]: value
    }
  }
  url = url.toString()
  if (url.indexOf('?') < 0) url += '?'
  return Object.keys(options).reduce((path, key) => {
    const reg = new RegExp(`(.*?(?:\\?|\\&)${key}\=)(.*?)($|\&.*)`, 'g')
    if (reg.test(path)) {
      return path.replace(reg, ($0, $1, $2, $3) => $1 + options[key] + $3)
    } else {
      return path + (path[path.length - 1] === '?' ? '' : '&') + key + '=' + options[key]
    }
  }, url)
}

export default createSign
