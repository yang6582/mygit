import axios from 'axios'
import crypto from 'crypto'
function getSign (method, salt, url, params) {
  let _method = method.toUpperCase()
  let _url = window.location.origin + url
  let queryString = Object.entries(params).sort((a, b) => a[0] > b[0]).reduce((a, b, c) => c ? a + '&' + b.join('=') : '?' + b.join('='), 0)
  return crypto.createHmac('sha1', salt)
    .update(_method + '=' + _url + queryString)
    .digest().toString('base64')
}

export default {
  get: (url, params) => {
    let abort = null
    if (!params) {
      params = {}
    }
    const abortPromise = new Promise((resolve, reject) => {
      abort = () => {
        reject('http abort')
      }
    })
    if (process.NODE_ENV === 'production') {
      params.timestamp = Date.now()
      params.sign = getSign('GET', 'teddy:mobile$UyuL57zIY6&HGlt', url, params)
    } else {
      params._d = 1
    }
    const httpPromise = axios.get(url, { params })
    const promise = Promise.race([abortPromise, httpPromise])
    promise.abort = abort
    promise.catch((d) => {
    })
    return promise
  },
  post: (url, params) => {
    if (!params) {
      params = {}
    }
    if (process.NODE_ENV === 'production') {
      params.timestamp = Date.now()
      params.sign = getSign('GET', 'teddy:mobile$UyuL57zIY6&HGlt', url, params)
    } else {
      params._d = 1
    }
    return axios.post(url, params)
  },
  upload: (url, options) => {
    if (!options) return
    let params = new URLSearchParams()
    for (let x in options) {
      params.append(x, options[x])
    }
    return axios.post(url, params)
  }
}
