<template>
	<view class="login-wrapper">
			<view class="logo">
				<rf-image :preview="false" :src="logo || errorImage"></rf-image>
			</view>
			<button openType="getUserInfo" lang="zh_CN" @getuserinfo="wxLogin" :disabled="btnLoading" class="confirm-btn confirm-btn-bg"
				:class="'text-' + themeColor.name">微信授权登录</button>
			<view class="cancel-btn">
				<text  @tap="navBack">取消</text>
			</view>
	</view>
</template>
<script>
import { mpWechatLogin } from '@/api/login';
import moment from '@/common/moment';
export default {
	data() {
		return {
			logo: this.$mSettingConfig.appLogo,
			errorImage: this.$mAssetsPath.errorImage,
			btnLoading: false,
			reqBody: {},
			loginByPass: true,
			smsCodeBtnDisabled: true,
			userInfo: null,
			loginBg: this.$mAssetsPath.loginBg,
			loginPic: this.$mAssetsPath.loginPic,
			appName: this.$mSettingConfig.appName,
			styleLoginType: this.$mSettingConfig.styleLoginType,
		};
	},
	onShow() {
		if (this.$mStore.getters.hasLogin) {
			this.$mRouter.reLaunch({ route: '/pages/index/index' });
		}
	},
	onLoad(options) {
	},
	methods: {
		loginTest(mobile, password) {
			this.loginParams.mobile = mobile;
			this.loginParams.password = password;
		},
		// 返回上一页
		navBack() {
			this.$mRouter.back();
		},
		// 统一跳转路由
		navTo(route) {
			this.$mRouter.push({ route });
		},
		// 返回主页
		toHome() {
			this.$mRouter.reLaunch({ route: '/pages/index/index' });
		},
		wxLogin(e){
			debugger;
			this.btnLoading = true;
			const _this = this;
			let userInfo = e.detail.userInfo;
			uni.login({
				provider:"weixin",
				success:(login_res => {
					let code = login_res.code;
					uni.getUserInfo({
						success(info_res) {
							console.log(info_res)
							uni.request({
								url: mpWechatLogin,
								method:"POST",
								header: {'content-type': 'application/x-www-form-urlencoded'},
								data:{
									code : code,
									rawData : info_res.rawData
								},
								success(res) {
									debugger;
									_this.$mHelper.toast('登录成功!');
									if(res.data.status == 200){
										that.$store.commit('login',userInfo);
									}else{
										console.log('服务器异常')
									}
								},
								fail(error) {
									console.log(error)
									_this.$mHelper.toast('登录失败!');
									/* setTimeout(() => {
										uni.navigateBack();
									}, 300); */
								}
							})
						}
					})
					
            })
            })


		},
		// 提交表单
		async toLogin() {
			this.handleLogin(this.reqBody, loginApi);
		},
		// 登录
		async handleLogin(params, loginApi) {
			this.btnLoading = true;
			await this.$http
				.post(loginApi, params)
				.then(r => {
					this.$mHelper.toast('登录成功！');
					this.$mStore.commit('login', r.data);
					if (this.userInfo) {
						this.btnLoading = false;
						const oauthClientParams = {};
						/*  #ifdef MP-WEIXIN */
						oauthClientParams.oauth_client = 'wechatMp';
						/*  #endif  */
						/*  #ifndef MP-WEIXIN */
						oauthClientParams.oauth_client = 'wechat';
						/*  #endif  */
						const userInfo = JSON.parse(this.userInfo);
						this.$http.post(authLogin, {
							...userInfo,
							...oauthClientParams,
							gender: userInfo.sex || userInfo.gender,
							oauth_client_user_id: userInfo.openid || userInfo.openId,
							head_portrait: userInfo.headimgurl || userInfo.avatarUrl
						});
					}
					uni.removeStorageSync('wechatUserInfo');
					const backToPage = uni.getStorageSync('backToPage');
					uni.removeStorageSync('backToPage');
					if (backToPage) {
						if (
							backToPage.indexOf('/pages/profile/profile') !== -1 ||
							backToPage.indexOf('/pages/cart/cart') !== -1 ||
							backToPage.indexOf('/pages/index/index') !== -1 ||
							backToPage.indexOf('/pages/notify/notify') !== -1 ||
							backToPage.indexOf('/pages/category/category') !== -1
						) {
							this.$mRouter.reLaunch(JSON.parse(backToPage));
						} else {
							this.$mRouter.redirectTo(JSON.parse(backToPage));
						}
					} else {
						this.$mRouter.reLaunch({ route: '/pages/profile/profile' });
					}
				})
				.catch(() => {
					this.btnLoading = false;
				});
		}
	}
};
</script>
<style lang="scss">
page {
	background: $color-white;
	height: calc(100% - 88upx);
}
.login-wrapper{
	padding-top: 100upx;
	.logo {
		text-align: center;
		margin-bottom: 80upx;
		image {
			width: 180upx;
			height: 180upx;
			border-radius: 28upx;
		}
	}
	.cancel-btn{
		text-align: center;
		color: $font-color-light
	}
	.confirm-btn {
		background-color:#fff;
			width: 84%;
			margin: 0 7% 50upx;
			height: 84upx;
			line-height: 84upx;
			font-size: $font-lg;
			border: 1upx solid;
		}

}
</style>
