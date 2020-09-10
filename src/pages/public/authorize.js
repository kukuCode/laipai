//验证授权状态 2未操作 1已经授权  0拒绝授权
const getSetting = function () {
    const promise = new Promise((resolve, reject) => {
        uni.getSetting({
            success(res) {
                let authSetting = res.authSetting
                //授权成功
                if (authSetting['scope.userInfo']) {
                    resolve(1)
                    return
                }
                //拒绝授权
                if (authSetting['scope.userInfo'] === false) {
                    resolve(0)
                    return
                }

                resolve(2)
            },
            fail(res) {
                reject(res)
            }
        })
    }).catch(res => {
        uni.showToast({
            icon: 'none',
            title: res.errMsg || '获取授权状态失败',
            duration: 2000
        });
    })

    return promise
}


export {
    getSetting
}
