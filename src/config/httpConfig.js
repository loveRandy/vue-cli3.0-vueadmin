import axios from 'axios'
import store from '@/store/index.js'
import baseURL from './baseUrl'
import { Message } from 'element-ui'
const http = {}

var instance = axios.create({
    timeout: 5000,
    baseURL,
    validateStatus(status) {
        switch (status) {
        case 400:
            Message.error('请求出错')
            break
        case 401:
            Message.warning({
                message: '授权失败，请重新登录'
            })
            store.commit('LOGIN_OUT')
            setTimeout(() => {
                window.location.reload()
            }, 1000)
            return
        case 403:
            Message.warning({
                message: '拒绝访问'
            })
            break
        case 404:
            Message.warning({
                message: '请求错误,未找到该资源'
            })
            break
        case 500:
            Message.warning({
                message: '服务端错误'
            })
            break
        }
        return status >= 200 && status < 300
    }
})

// 添加请求拦截器
instance.interceptors.request.use(
    function(config) {
        // 请求头添加token
        if (store.state.UserToken) {
            config.headers.Authorization = `Bearer ${store.state.UserToken}`
        }
        return config
    },
    function(error) {
        return Promise.reject(error)
    }
)

// 响应拦截器即异常处理
instance.interceptors.response.use(
    response => {
        return response.data
    },
    err => {
        if (err && err.response) {
        } else {
            err.message = '连接服务器失败'
        }
        // Message.error({
        //     message: err.message
        // })
        return Promise.reject(err.response)
    }
)

http.get = function(url, options) {
    let loading
    if (!options || options.isShowLoading !== false) {
        loading = document.getElementById('ajaxLoading')
        loading.style.display = 'block'
    }
    return new Promise((resolve, reject) => {
        instance
            .get(url, options)
            .then(response => {
                if (!options || options.isShowLoading !== false) {
                    loading = document.getElementById('ajaxLoading')
                    loading.style.display = 'none'
                }
                if (response.code === 1) {
                    resolve(response.data)
                } else {
                    Message.error({
                        message: response.msg
                    })
                    reject(response.msg)
                }
            })
            .catch(e => {
                console.log(e)
            })
    })
}

http.post = function(url, data, options) {
    let loading
    if (!options || options.isShowLoading !== false) {
        loading = document.getElementById('ajaxLoading')
        loading.style.display = 'block'
    }
    return new Promise((resolve, reject) => {
        instance
            .post(url, data, options)
            .then(response => {
                if (!options || options.isShowLoading !== false) {
                    loading = document.getElementById('ajaxLoading')
                    loading.style.display = 'none'
                }
                if (response.code === 1) {
                    resolve(response.data)
                } else {
                    Message.error({
                        message: response.msg
                    })
                    reject(response.message)
                }
            })
            .catch(e => {
                console.log(e)
            })
    })
}

export default http
