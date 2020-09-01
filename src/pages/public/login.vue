<template>
	<view>
		<view>
			 <view>
				
					<view class='header'>
						<rf-image :preview="false" :src="logo"></rf-image>
					</view>
					 <!-- #ifdef MP-WEIXIN -->
					<view class='content' v-if="!loginStatus">
						<view>申请获取以下权限</view>
						<text>获得你的公开信息(昵称，头像、地区等)</text>
						<!-- <text>获得你微信绑定的手机号</text> -->
					</view>
					<button class='bottom' v-if="!loginStatus" type='primary' open-type="getUserInfo" withCredentials="true" lang="zh_CN" @getuserinfo="wxGetUserInfo">
						允许
					</button>

					<button class='bottom' v-if="loginStatus" style="margin-top:140rpx" type='primary' open-type="getPhoneNumber"  @getphonenumber="getPhoneNumber">
						微信授权登录
					</button>
					<view class="cancel-btn">
						<text  @tap="navBack">取消</text>
					</view>
					<!-- #endif -->
					<!-- #ifndef MP-WEIXIN -->
					<view>
						<view style="margin-top:100rpx;text-align: center;font-size:36rpx">请使用微信小程序登录</view>
					</view>
					<!-- #endif -->
			</view>
		</view>
	</view>
</template>

<script>
	import { mpWechatLogin, getPhone } from '@/api/login';
	import { wxlogin, wxUserInfo} from "./wxlogin.js"
	export default {
		data() {
			return {
				logo: this.$mSettingConfig.appLogo,
				appid: this.$mConfig.weixinAppId,
				secret: this.$mConfig.weixinSecretId,
				btnLoading:false,
				type:0,
				phone:"",
				phoneParams:{
					sessionkey:"",
					ivdata:"",
					encrypdata:""
				},
				loginStatus:false,
				phoneStatus:false
			}
		},
		onShow() {
			if (this.$mStore.getters.hasLogin) {
				this.$mRouter.reLaunch({ route: '/pages/index/index' });
			}
		},
		onLoad() {
			try{
				// #ifdef MP-WEIXIN
				this.loginStatus = uni.getStorageSync('loginStatus') || false
				this.init()
				// #endif
			}catch(e){
				console.log("init错误信息：",e)
			}
		},
		methods: {
			async init(){
				var code = await wxlogin()
				// 获取sessionkey
				debugger;
				var key = await this.getSessionKey(this.appid,this.secret,code)
				this.phoneParams.sessionkey = key.data.session_key;
			},

		/*
		 * 获取手机号
		 *
		 * 参数:obj{
		 *	sessionkey,
		 *	ivdata,
		 *	encrypdata
		 *  }
		 * */
			getphone (obj){
				return new Promise((resolve, reject)=>{
					getPhone(obj).then(res=>{
						resolve(JSON.parse(res.data.data.phone))
					},err=>{
						reject(err)
					})
				})
			},
			/* 获取sessionkey */
			getSessionKey (appid, secret, code) {
				return new Promise((resolve, reject)=>{
					// !! 注意 !!
					// 这里需要后端调用: https://api.weixin.qq.com无法加入白名单
					let url = "https://api.weixin.qq.com/sns/jscode2session?appid="+appid+"&secret="+secret+"&js_code="+code+"&grant_type=authorization_code"
					this.$http.post(url).then(res=>{
						resolve(res)
					},err=>{
						reject(err)
					})
				})
				},

			async getPhoneNumber(e){
				try{
					this.phoneParams.encrypdata = e.detail.encryptedData
					this.phoneParams.ivdata = e.detail.iv
					debugger;
					var phone = await getphone(this.phoneParams)
					this.phone = phone.purePhoneNumber
					console.log("phone:",this.phone)

					if(this.phone){
						this.phoneStatus = true
						this.reLaunch()
					}
				}catch(e){
					this.$mHelper.toast('发生了点小错误,请重试!');
				}
			},
			async wxGetUserInfo(res){
				debugger;
				uni.setStorageSync('loginStatus', true);
				var info = await wxUserInfo()
				console.log('info=',info)
				debugger;
				this.loginStatus = true
				// this.reLaunch()
			},
			// 返回上一页
			navBack() {
				this.$mRouter.back();
			},
			reLaunch(){
				if(this.loginStatus && this.phoneStatus){
					uni.setStorageSync("tongfang-phone",this.phone)
					// 后续业务代码
					this.$mRouter.reLaunch({ route: '/pages/profile/profile' });
					/* uni.reLaunch({//信息更新成功后跳转到小程序首页
						url: '/pages/index/index'
					}); */
				}
			}
		}
	}
</script>

<style>
	.header {
	    margin: 100rpx 0 70rpx 50rpx;
	    /* border-bottom: 1px solid #ccc; */
	    text-align: center;
	    width: 650rpx;
	    height: 300rpx;
	    line-height: 450rpx;
	}
	.header image {
	    width: 200rpx;
	    height: 200rpx;
	}
	.content {
	    margin-left: 50rpx;
	    margin-bottom: 50rpx;
	}
	.content text {
	    display: block;
	    color: #9d9d9d;
	    margin-top: 40rpx;
	}
	.bottom {
	    border-radius: 80rpx;
	    margin: 35rpx 50rpx;
	    font-size: 35rpx;
	}
	.bottom:first-child{
		margin-top: 50rpx;
	}

	.view_input{
		margin: 0 50rpx;
		background-color: white;
		padding: 10px;
		height: 1rem;
		line-height: 1rem;
	}

	.cancel-btn{
		text-align: center;
		color: $font-color-light
	}
</style>
