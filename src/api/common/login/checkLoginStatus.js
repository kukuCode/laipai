import check from "@/api/common/login/checkSession.js" //检验sessing是否过期 0未过期 1已过期
import {
    getCode,
    getProvider
} from "@/api/common/login/getCode.js"
/* import {
    wxLoginState
} from "@/api/mpLogin/home.js" */

//用户缓存信息
const user = (uni.getStorageSync('user'));

//跳转至小程序登录页
const toLogin = () => {
    setTimeout(() => {
        uni.redirectTo({
            url: '/pages/public/login'
        });
    }, 2000)
}

//小程序登录态刷新
const loadLoginState = async function() {
    let access3rdToken = user.access3rdToken //平台sessionId
    let provider = await getProvider() //获取服务商信息
    let code = await getCode(provider[0]) //获取code

    let param = {
        access3rdToken,
        code
    }
    // 刷新用户登录状态
   /*  let res = await wxLoginState(param);
    if (res.resultCode != '0000') {
        uni.showToast({
            icon: 'none',
            title: res.resultMessage,
            duration: 2000
        });
        return
    } */
}

//判断登录状态
const checkLoginStatus = async function() {
    if (user) {
        // 检查 session_key 是否过期
        let status = await check()
        //已过期
        if (status == 1) {
            //小程序登录态刷新
            loadLoginState()
        } else {
            //未过期
            console.log('执行下一步操作')
        }
    } else {
        // 无skey，作为首次登录
        // toLogin();
    }
}



export {
    checkLoginStatus, //判断登录状态
    toLogin, //跳转至小程序登录页
    loadLoginState //小程序登录态刷新
}