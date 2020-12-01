import HttpRequest from '@/libs/axios'
import config from '@/config'

let baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro
function setBaseURL () {
    // let _baseURL = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro
    const webHost = localStorage.getItem('webHost') // 获取浏览器本地存储中Key为webHost那一项的值
    if (location.origin === 'http://back-manager-test.teddymobile.net' && webHost) { // 判断当前的环境以及是否存在webHost
        baseUrl = 'http://' + webHost // 将_baseURL重新赋值
    }
    return baseUrl
}
const axios = new HttpRequest(setBaseURL())
export default axios
