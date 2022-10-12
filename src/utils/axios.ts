import Axios from 'axios'

let statusCode = [200, 803]

// const baseURL: string = 'https://netease-cloud-music-api-one-amber.vercel.app/'
const baseURL: string = 'https://192.168.3.3:3000/'

let option = {
    baseURL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json; charset=UTF-8;"
    },
}

const service = Axios.create(option)

// 前置拦截器（发起请求之前的拦截）
service.interceptors.request.use(
    (response) => {
        /**
         * 根据你的项目实际情况来对 config 做处理
         * 这里对 config 不做任何处理，直接返回
         */
        return response
    },
    (error) => {
        return Promise.reject(error)
    }
)

// 后置拦截器（获取到响应时的拦截）
service.interceptors.response.use(
    (response) => {
        /**
         * 根据你的项目实际情况来对 response 和 error 做处理
         * 这里对 response 和 error 不做任何处理，直接返回
         */
        //这里需要code review
        if (statusCode.includes(response?.data?.code || response?.data?.body?.code || response?.data?.data?.code) || response?.data?.success === true) {
            return Promise.resolve(response.data)
        } else {
            return Promise.reject(response)
        }
        // Promise.resolve(response?.data || response)
    },
    (error) => {
        return Promise.reject(error?.response?.data)
    }
)

export default service
