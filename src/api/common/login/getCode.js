//login.js

//获取服务商信息
const getProvider = () => {
    const promise = new Promise((resolve, reject) => {
        uni.getProvider({
            service: 'oauth', //服务类型  登录授权
            success: function(res) {
                resolve(res.provider)
            },
            fail(res) {
                reject(res)
            }
        });
    }).catch(res => {
        uni.showToast({
            icon: 'none',
            title: res.errMsg || '获取服务商信息失败',
            duration: 2000
        });
    })

    return promise
}


//获取code
const getCode = provider => {
    if (!provider) {
        uni.showToast({
            icon: 'none',
            title: '获取服务商信息失败',
            duration: 2000
        });
        return
    }

    const promise = new Promise((resolve, reject) => {
        uni.login({
            provider: provider,
            success: function(loginRes) {
                if (loginRes && loginRes.code) {
                    resolve(loginRes.code)
                } else {
                    reject(loginRes)
                }
            }
        });
    }).catch(res => {
        uni.showToast({
            icon: 'none',
            title: res.errMsg || '获取code失败',
            duration: 2000
        });
    })

    return promise
}


export {
    getCode,//获取code
    getProvider//获取服务商信息
}