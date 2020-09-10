
/* 获取sessionkey */
/* export const getSessionKey = (appid, secret, code) => {
	return new Promise((resolve, reject)=>{
		let url = "https://api.weixin.qq.com/sns/jscode2session?appid="+appid+"&secret="+secret+"&js_code="+code+"&grant_type=authorization_code"
		this.$http.post(url).then(res=>{
			resolve(res)
		},err=>{
			reject(err)
		})
	})
} */


/*
微信登录
	返回 code
*/
export const wxlogin = ()=> {
	return new Promise((resolve, reject)=>{
		uni.showLoading({
		  title: '登录中...'
		});

		uni.login({
			provider: 'weixin',
			success: function(loginRes) {
				resolve(loginRes.code);
				uni.hideLoading();
			},
			fail(err) {
				reject(err)
				uni.hideLoading();
			}
		})
	}).catch(res => {
		uni.showToast({
			icon: 'none',
			title: res.errMsg || '获取code失败',
			duration: 2000
		});
	})
}

/*
获取微信用户信息 要先调用登录接口
	返回用户信息
*/
export const wxUserInfo = ()=>{
	return new Promise((resolve, reject)=>{
		uni.getUserInfo({
			provider: 'weixin',
			success: function(res) {
				resolve(res);
			},
			fail(err) {
				reject(err)
			}
		});
	})
}

/*
获取微信用户手机号 要先调用登录接口
	参数:obj{
		sessionkey,
		ivdata,
		encrypdata
	}
	返回手机号相关信息
*/
/* export const getphone = (obj)=>{
	return new Promise((resolve, reject)=>{
		getPhone(obj).then(res=>{
			resolve(JSON.parse(res.data.data.phone))
		},err=>{
			reject(err)
		})
	})
} */
