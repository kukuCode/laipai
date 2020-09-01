<template>
	<view class="user">
		<!--头部-->
		<view class="user-section" :class="'bg-' + themeColor.name">
			<image class="bg" :src="userBg"></image>
			<!--用户信息-->
			<view class="user-info-box">
				<view
					class="portrait-box"
					@tap="navTo(userInfo ? '/pages/user/userinfo/userinfo' : 'login')"
				>
					<image
						class="portrait"
						:src="userInfo.head_portrait || headImg"
					></image>
					<text class="username">
						{{
							userInfo.nickname ||
							userInfo.realname ||
								'登录/注册'
						}}
					</text>
				</view>
			</view>
		</view>
		<!-- 个人中心 内容区-->
		<view
			class="cover-container"
			:style="[
				{
					transform: coverTransform,
					transition: coverTransition
				}
			]"
			@touchstart="coverTouchstart"
			@touchmove="coverTouchmove"
			@touchend="coverTouchend"
		>
			<image class="arc" :src="arc"></image>
			<!--我的工具-->
			<view class="promotion-center">
				<!-- <list-cell
					icon="iconfuwu"
					:iconColor="themeColor.color"
					@eventClick="navTo('/pages/set/set')"
					title="我的服务"
				></list-cell> -->
				<view class="tj-sction">
					<view class="category-list">
						<view
							class="category"
							v-for="(item, index) in settingList"
							:key="index"
							@tap.stop="navTo(item.url)"
						>
							<view v-if="item.title !== '分享'">
								<view class="img">
									<text
										class="iconfont"
										:class="[item.icon, 'text-'+themeColor.name]"
									></text>
								</view>
								<view class="text">{{ item.title }}</view>
							</view>
							<button
								class="share-btn"
								open-type="share"
								@tap="share"
								v-else
							>
								<view class="img">
									<text
										class="iconfont"
										:class="[item.icon, 'text-'+themeColor.name]"
									></text>
								</view>
								<view class="text">{{ item.title }}</view>
							</button>
						</view>
					</view>
				</view>
			</view>
			<view class="log-out-btn"  @click="toLogout" v-if="hasLogin">
				<text :class="['text-'+themeColor.name]">退出登录</text>
			</view>
		</view>
		<!--页面加载动画-->
		<rfLoading isFullScreen :active="loading"></rfLoading>
	</view>
</template>
<script>
/**
 * 个人中心
 */
import { footPrintList, memberInfo, notifyUnRreadCount } from '@/api/userInfo';
import { mpWechatLogin} from '@/api/login';

// import listCell from '@/components/rf-list-cell';
// import { mapMutations } from 'vuex';
import rfBadge from '@/components/rf-badge/rf-badge';
import $mAssetsPath from '@/config/assets.config';
let startY = 0, moveY = 0, pageAtTop = true;
export default {
	components: {
		// listCell,
		rfBadge
	},
	data() {
		return {
			settingList: this.$mConstDataConfig.settingList,
			isOpenLiveStreaming: this.$mSettingConfig.isOpenLiveStreaming,
			headImg: this.$mAssetsPath.headImg,
			vipCardBg: this.$mAssetsPath.vipCardBg,
			arc: this.$mAssetsPath.arc,
			userBg: this.$mAssetsPath.userBg,
			coverTransform: 'translateY(0px)',
			coverTransition: '0s',
			moving: false,
			userInfo: {
				// 用户信息
				promoter: null
			},
			footPrintList: [], // 足迹列表
			loading: true,
			appName: this.$mSettingConfig.appName,
			hasLogin: false
		};
	},
	filters: {
	},
  computed: {
  },
	// 小程序分享
	onShareAppMessage() {
		return {
			title: `欢迎来到${this.appName}`,
			path: '/pages/index/index'
		};
	},
	async onShow() {
		// 初始化数据
		await this.initData();
	},
	// #ifndef MP
	onNavigationBarButtonTap(e) {
		debugger;
		const index = e.index;
		if (index === 0) {
			this.navTo('/pages/set/set');
		} else if (index === 1) {
			// #ifdef APP-PLUS
			// eslint-disable-next-line
			const pages = getCurrentPages();
			const page = pages[pages.length - 1];
			const currentWebview = page.$getAppWebview();
			currentWebview.hideTitleNViewButtonRedDot({
				index
			});
			// #endif
			this.$mRouter.switchTab({ route: '/pages/notify/notify' });
		}
	},
	// #endif
	methods: {
		// 分享
    share() {
			const url = `${this.$mConfig.hostUrl}/pages/index/index`;
      // #ifdef H5
			this.$mHelper.h5Copy(url);
			// #endif
      // #ifdef APP-PLUS
			const shareImg = `${this.$mSettingConfig.appLogo}`;
			this.$mHelper.handleAppShare(url, this.appName, `欢迎来到${this.appName}`, shareImg);
			// #endif
		},
		// 数据初始化
		async initData() {
			this.hasLogin = this.$mStore.getters.hasLogin;
			uni.setTabBarStyle({
				selectedColor: this.themeColor.color,
				borderStyle: 'white'
			});
			/* this.themeColor.tabList && this.themeColor.tabList.forEach((selectedIconPath, index) => {
				uni.setTabBarItem({
					index,
					selectedIconPath
				});
			}); */
			if (this.hasLogin) {
				await this.getMemberInfo();
			} else {
				this.loading = false;
				this.resetSectionData();
			}
		},
		// 获取用户信息
		async getMemberInfo() {
			await this.$http
				.get(memberInfo)
				.then(async r => {
					this.loading = false;
					this.userInfo = r.data;
				})
				.catch(() => {
					this.hasLogin = false;
					this.userInfo = {};
					this.resetSectionData();
					this.loading = false;
				});
		},
		// 清空个人中心的各模块状态
		resetSectionData() {
			this.userInfo = {};
		},
		// 统一跳转接口,拦截未登录路由
		navTo(route) {
			if (!route) return;
			if (!this.hasLogin) {
				// uni.removeStorageSync('backToPage');
				this.$mRouter.push({ route: '/pages/public/login' });
				// this.weixinLogin('weixin')
			} else {
				this.$mRouter.push({ route });
			}
		},
		weixinLogin(provider = 'weixin'){
			/*  #ifdef MP-WEIXIN */
			uni.showLoading();
			uni.login({
				provider: provider,
				success: (loginRes)=>{
					console.log("success: "+JSON.stringify(loginRes));
					debugger;
					if(loginRes.errMsg === "login:ok")
					// 获取一个code，传递给后端，后端再去请求微信服务器获取用户信息
					uni.getUserInfo({
						provider: provider,
						success: (infoRes)=>{
							debugger;
							
							console.log('用户信息：' + JSON.stringify(infoRes.userInfo));
							let userInfo = {
									nickname: infoRes.userInfo.nickName,
									head_portrait: infoRes.userInfo.avatarUrl,
									signature:'个性签名',
									integral:0,
									balance:0,
									envelope:0
								}

							this.userInfo = userInfo;

							debugger;
							// !调用后台接口......
							let params = {};
							let authApi = mpWechatLogin;
								params = { ...infoRes, ...params };
								params.code = loginRes.code;
							this.thirdPartyAuthLogin(authApi, params);

						/* 	uni.setStorage({
								key: 'UserInfo',
								data: userInfo,
								success: function () {
									uni.hideLoading()
									uni.showToast({title: '登录成功',icon:"success"});
									setTimeout(function(){
										uni.navigateBack();
									},300)
								}
							}); */
						}
					});
				},
				fail:(e)=>{
					console.log("fail: "+JSON.stringify(e));
				}
			});
			/*  #endif  */
		},

		thirdPartyAuthLogin(authApi, params = {}) {
			if(!authApi) return;
			const _this = this;
			_this.$http
				.post(authApi, params)
				.then(async r => {
					_this.btnLoading = false;
					if (!r.data.login) {
					/* 	_this.user_info = r.data.user_info;
						uni.showModal({
							content: '您尚未绑定账号，是否跳转登录页面？',
							success: confirmRes => {
								if (confirmRes.confirm) {
									uni.setStorageSync(
										'wechatUserInfo',
										JSON.stringify(_this.user_info)
									);
									_this.$mRouter.push({
										route: '/pages/public/login'
									});
								}
							}
						}); */
						_this.$mRouter.reLaunch({
							route: '/pages/profile/profile'
						});
					} else {
						await _this.$mStore.commit('login', r.data.user_info);
						_this.$mHelper.toast('登录成功!');
						const backToPage = uni.getStorageSync('backToPage');
						if (backToPage) {
							if (
								backToPage.indexOf('/pages/profile/profile') !== -1 ||
								backToPage.indexOf('/pages/index/index') !== -1 
							) {
								_this.$mRouter.reLaunch(JSON.parse(backToPage));
							} else {
								_this.$mRouter.redirectTo(JSON.parse(backToPage));
							}
							uni.removeStorageSync('backToPage');
							uni.removeStorageSync('wechatUserInfo');
						} else {
							_this.$mRouter.reLaunch({
								route: '/pages/profile/profile'
							});
						}
					}
				}).catch(() => {
				_this.btnLoading = false;
			});
		},
		toLogout(){
			uni.showModal({
				content: '确定要退出登录么',
				success: (e)=>{
					if(e.confirm){
						// this.logout();
						this.$mStore.commit('logout');
						setTimeout(()=>{
							this.$mRouter.reLaunch({
									route: '/pages/profile/profile'
								});
						}, 200)
					}
				}
			});
		},
		
		/**
		 *  会员卡下拉和回弹
		 *  1.关闭bounce避免ios端下拉冲突
		 *  2.由于touchmove事件的缺陷（以前做小程序就遇到，比如20跳到40，h5反而好很多），下拉的时候会有掉帧的感觉
		 *    transition设置0.1秒延迟，让css来过渡这段空窗期
		 *  3.回弹效果可修改曲线值来调整效果，推荐一个好用的bezier生成工具 http://cubic-bezier.com/
		 */
		coverTouchstart(e) {
			if (pageAtTop === false) {
				return;
			}
			this.coverTransition = 'transform .1s linear';
			startY = e.touches[0].clientY;
		},
		coverTouchmove(e) {
			moveY = e.touches[0].clientY;
			let moveDistance = moveY - startY;
			if (moveDistance < 0) {
				this.moving = false;
				return;
			}
			this.moving = true;
			if (moveDistance >= 80 && moveDistance < 100) {
				moveDistance = 80;
			}
			if (moveDistance > 0 && moveDistance <= 80) {
				this.coverTransform = `translateY(${moveDistance}px)`;
			}
		},
		coverTouchend() {
			if (this.moving === false) {
				return;
			}
			this.moving = false;
			this.coverTransition = 'transform 0.3s cubic-bezier(.21,1.93,.53,.64)';
			this.coverTransform = 'translateY(0px)';
		}
	}
};
</script>
<style lang="scss" scoped>
page {
	background-color: $page-color-base;
}
.user {
	.user-section {
		height: 520upx;
		padding: 100upx 30upx 0;
		position: relative;

		.bg {
			position: absolute;
			left: 0;
			top: 0;
			width: 100vw;
			height: 60vw;
			opacity: 0.84;
		}
		.user-info-box {
			height: 180upx;
			display: flex;
			align-items: center;
			position: relative;
			z-index: 1;
			justify-content: space-between;

			.portrait-box {
				display: flex;
				align-items: center;

				.portrait {
					width: 130upx;
					height: 130upx;
					border: 5upx solid #fff;
					border-radius: 50%;
				}

				.username {
					font-size: $font-lg + 6upx;
					color: $color-white;
					margin-left: 20upx;
				}

				button {
					background-color: transparent;
					font-size: $font-lg + 6upx;
					color: $font-color-dark;
					border: none;
				}

				button::after {
					border: none;
				}
			}
		}

	}

	.cover-container {
		margin-top: -150upx;
		padding: 0 30upx 20upx;
		position: relative;
		background-color: $page-color-base;

		.arc {
			position: absolute;
			left: 0;
			top: -34upx;
			width: 100%;
			height: 36upx;
		}

		.promotion-center {
			background: #fff;
			margin-bottom: 20upx;
			/*分类列表*/
			.category-list {
				width: 100%;
				padding: 0 0 30upx 0;
				border-bottom: solid 2upx #f6f6f6;
				display: flex;
				flex-wrap: wrap;
				.category {
					width: 33.3%;
					margin-top: 50upx;
					display: flex;
					justify-content: center;
					flex-wrap: wrap;
					.img {
						width: 100%;
						display: flex;
						justify-content: center;

						.iconfont {
							font-size: $font-lg + 24upx;
						}
					}

					.text {
						width: 100%;
						display: flex;
						justify-content: center;
						font-size: 24upx;
						color: #3c3c3c;
					}
					.share-btn {
						height: 142upx;
						text-align: left;
						background: none;
						padding: 0;
						margin: 0;
					}

					.share-btn:after {
						border: none;
						border-radius: none;
					}
				}
			}
		}

		.tj-sction {
			@extend %section;
			display: flex;

			.tj-item {
				@extend %flex-center;
				flex: 1;
				flex-direction: column;
				margin: 30upx 0;
				font-size: $font-sm;
				color: #75787d;
				/*border-right: 2upx solid rgba(0, 0, 0, 0.2);*/
			}

			/*.tj-item:last-child {*/
			/*border-right: none;*/
			/*}*/
			.num {
				font-size: $font-base;
			}

			.red {
				color: $base-color;
			}
		}
	}
}
.log-out-btn{
	text-align: center;
	margin-top: 40upx;
	background: #fff;    
	align-items: baseline;
    padding: 10px 15px;
    // line-height: 30px;
	
}
%flex-center {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}
%section {
	justify-content: space-around;
	display: flex;
	align-content: center;
	background: #fff;
	border-radius: 10upx;
}
</style>
