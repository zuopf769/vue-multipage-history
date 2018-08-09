import axios from 'axios'
import util from '@/util/utils'

//参数对象
let _param = {};

//返回值处理
axios.interceptors.response.use((res) => {
    return res;
}, (error) => {
    console.log("服务器出错啦，请您稍后再试");
    return Promise.reject(error);
});

/**
 * 统一请求接口
 * @param {*} url 请求的接口路径
 * @param {*} params 请求的参数，参数格式以json对象形式
 * @param {*} flag  true：不需要token和source参数， false：默认需要token和source参数
 */
export function fetch(url, params, flag) {
    let formData = new FormData();
    if (!flag) {
        if (params) {
            if (!params['token']) {
                formData.append('token', _param['token']);
            }
            if (!params['source']) {
                formData.append('source', _param['source']);
            }
        } else {
            formData.append('token', _param['token']);
            formData.append('source', _param['source']);
        }
    }

    for (let key in params) {
        formData.append(key, params[key]);
    }
    if (params) { //添加了get请求的处理
        if (params.send == 'get') {
            return new Promise((resolve, reject) => {
                axios.get(url, formData)
                    .then(response => {
                        resolve(response.data)
                    }, err => {
                        reject(err);
                    })
                    .catch((error) => {
                        reject(error)
                    })
            })
        } else {
            return new Promise((resolve, reject) => {
                axios.post(url, formData)
                    .then(response => {
                        resolve(response.data)
                    }, err => {
                        reject(err);
                    })
                    .catch((error) => {
                        reject(error)
                    })
            })
        }
    } else { //如果不传params
        return new Promise((resolve, reject) => {
            axios.post(url, formData)
                .then(response => {
                    resolve(response.data)
                }, err => {
                    reject(err);
                })
                .catch((error) => {
                    reject(error)
                })
        })
    }
}

export function axiosConfig(config) {
    // axios 配置
    axios.defaults.timeout = 5000;
    _param['token'] = config['token'];
    _param['source'] = config['source'];
    //axios.defaults.baseURL = "//"+config['base_url'];
}
