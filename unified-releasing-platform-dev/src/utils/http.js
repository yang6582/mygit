import axios from 'axios'
export default {
  get: (url, options) => {
    let abort = null
    const abortPromise = new Promise((resolve, reject) => {
      abort = () => {
        reject('http abort')
      }
    })
    const httpPromise = axios.get(url, options)
    const promise = Promise.race([abortPromise, httpPromise])
    promise.abort = abort
    promise.catch((d) => {

    })
    return promise
  },
  post: (url, options) => {
    if (options) {
      var params = new (URLSearchParams || FormData)()
      params.append('param', JSON.stringify(options))
      return axios.post(url, params)
    } else {
      return axios.post(url)
    }
  },
  post2: (url, options) => {
    if (options) {
      var params = new URLSearchParams()
      for (let x in options) {
        params.append(x, options[x])
      }
      return axios.post(url, params)
    } else {
      return axios.post(url)
    }
  },
  // 自定义post方法以符合后台固定的传参方式
  // ted_post: (url, options) => {
  //     return axios.post(url, {
  //         param: JSON.stringify(options)
  //     })
  // },
  ted_get: (url, options) => {
    let abort = null
    const abortPromise = new Promise((resolve, reject) => {
      abort = () => {
        reject('http abort')
      }
    })
    let httpPromise
    if (options) {
      httpPromise = axios.get(url + '?param=' + JSON.stringify(options))
    } else {
      httpPromise = axios.get(url)
    }
    const promise = Promise.race([abortPromise, httpPromise])
    promise.abort = abort
    promise.catch((d) => {
      if (d.response.status === 403) {
        window.$router.push('/login')
      }
    })
    return promise
  }
}
