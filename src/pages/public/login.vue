<template>
  <view>
    <view>
      <view>
        <view class="header">
          <rf-image :preview="false" :src="logo"></rf-image>
        </view>
        <!-- #ifdef MP-WEIXIN -->
        <view class="content" v-if="status!=1">
          <view>申请获取以下权限</view>
          <text>获得你的公开信息(昵称，头像、地区等)</text>
          <!-- <text>获得你微信绑定的手机号</text> -->
        </view>
        <!-- <button class='bottom' v-if="!loginStatus" type='primary' open-type="getUserInfo" withCredentials="true" lang="zh_CN" @getuserinfo="wxGetUserInfo">
						允许
					</button>
					<button class='bottom' v-if="loginStatus" style="margin-top:140rpx" type='primary' open-type="getPhoneNumber"  @getphonenumber="getPhoneNumber">
						微信授权登录
					</button>
        -->
        <button class="login-button" type="primary" @click="openSetting" v-if="status==0">允许</button>
        <button
          class="login-button"
          type="primary"
          open-type="getUserInfo"
          @getuserinfo="wxGetUserInfo"
          lang="zh_CN"
          withCredentials="true"
          v-if="status==2"
        >允许</button>

        <button
          class="login-button"
          v-if="status == 1"
          type="primary"
          open-type="getPhoneNumber"
          @getphonenumber="getPhoneNumber"
        >微信授权登录</button>

        <view class="cancel-btn">
          <text @tap="navBack">取消</text>
        </view>
        <!-- #endif -->
        <!-- #ifndef MP-WEIXIN -->
        <view>
          <view style="margin-top:100rpx;text-align: center;font-size:36rpx">请使用微信小程序</view>
        </view>
        <!-- #endif -->
      </view>
    </view>
  </view>
</template>

<script>
import { getTokenUrl, mpWechatLogin, getPhoneAction } from '@/api/login';
import { getSetting } from './authorize.js';
import { wxlogin, wxUserInfo } from './wxlogin.js';
export default {
  data() {
    return {
      logo: this.$mSettingConfig.appLogo,
      appid: this.$mConfig.weixinAppId,
      secret: this.$mConfig.weixinSecretId,
      btnLoading: false,
      status: 0, //2未操作 1已经授权  0拒绝授权
      code: '',
			token:'',
      userInfo: null,
      type: 0,
      phone: '',
      // 获取手机号参数
      phoneParams: {
        sessionkey: '',
        ivdata: '',
        encrypdata: '',
      },
      phoneStatus: false,
    };
  },
  onShow() {
    // #ifdef MP-WEIXIN
    (async () => {
      //获取授权状态
      this.status = await getSetting();
      console.log('status:', this.status);
      debugger;
			if(this.status ==1){
				debugger;
				this.userInfo = await wxUserInfo();
			}

      /*  //获取服务商信息
                let provider = await getProvider();

                //获取code
				this.code = await getCode(provider[0]) */
    })();
    // #endif

    // 如果登录,跳转首页
    if (this.$mStore.getters.hasLogin) {
      this.$mRouter.reLaunch({ route: '/pages/index/index' });
    }
  },
  onLoad() {
    try {
      // #ifdef MP-WEIXIN
      this.init();
      // #endif
    } catch (e) {
      console.log('init错误信息：', e);
    }
  },
  methods: {
    async init() {
      this.code = await wxlogin();
			console.log('code=',this.code)
      // 获取sessionkey
      debugger;

      // !!!-----设置token ----!!!
      // 获取token
      // let res = await this.getToken(this.code);
			// console.log('res--->',res)
			// this.token = res.token
			debugger;
      // uni.setStorageSync('accessToken', token);
      // !!!

      /*
		// 获取sessionKey
		var key = await this.getSessionKey(this.appid, this.secret, this.code)
		console.log('key=',key);
		this.phoneParams.sessionkey = key;
		*/
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
    getphone(obj) {
     /* return new Promise((resolve, reject) => {
				debugger;
        getPhoneAction(obj).then(
          (res) => {
						debugger;
            resolve(JSON.parse(res.data.data.phone));
          },
          (err) => {
            reject(err);
          }
        );
      }); */

			return this.$http.post(getPhoneAction, obj).then(
			  (res) => {
			    resolve(res.data);
			  },
			  (err) => {
			    reject(err);
			  }
			);
    },
    getToken(code) {
      return new Promise((resolve, reject) => {
        this.$http.post(getTokenUrl, { code }).then(
          (res) => {
            resolve(res.data);
          },
          (err) => {
            reject(err);
          }
        );
      });
    },

		login4PhoneNum(obj){
			return new Promise((resolve, reject) => {
			  this.$http.post(getTokenUrl, obj).then(
			    (res) => {
			      resolve(res.data);
			    },
			    (err) => {
			      reject(err);
			    }
			  );
			});
		},
    /* 获取sessionkey */
    getSessionKey(appid, secret, code) {
      return new Promise((resolve, reject) => {
        this.$http.post(mpWechatLogin, { code }).then(
          (res) => {
            resolve(res.data);
          },
          (err) => {
            reject(err);
          }
        );
      });
    },

    async getPhoneNumber(e) {
      debugger;
      try {
				if (e.detail.errMsg == "getPhoneNumber:ok") {
					let param = {code:this.code, encrypdata:e.detail.encryptedData, ivdata:e.detail.iv}
					let result = await this.login4PhoneNum(param)
					console.log('---->>>>>',result)

					// this.phoneParams.encrypdata = e.detail.encryptedData;
					// this.phoneParams.ivdata = e.detail.iv;
					// var res = await this.getphone(this.phoneParams);
					debugger;
					let {userInfo} = this.userInfo
					let member = {...userInfo, ...result.obj}
					let provider = {
						member: member,
						access_token: result.token,
						phonenum: member.phonenum
					}

					await this.$mStore.commit('login', provider);


					// 获取手机号成功--->登录成功
					// await this.$mStore.commit('login', res.data.user_info);

					// this.phone = phone.purePhoneNumber;
					console.log('phone:', this.phone);
					this.reLaunch();
				} else {
					this.$mHelper.toast('获取手机号失败!');
				}
      } catch (e) {
        this.$mHelper.toast('发生了点小错误,请重试!');
      }
    },
    async wxGetUserInfo(e) {
      debugger;
      if (!this.code) {
        uni.showToast({
          icon: 'none',
          title: '正在加载中，稍等一下',
          duration: 2000,
        });
        return;
      }

      if (e.detail && e.detail.errMsg == 'getUserInfo:ok') {

        // 待优化,手机号获取完成后才算登录成功,并存store
        this.userInfo = await wxUserInfo();
				console.log('this.userInfo=',this.userInfo)

        // this.$mStore.commit('login', this.userInfo);
        // this.$mRouter.switchTab({ route: '/pages/profile/profile' });
				this.status = 1


      } else {
        //用户拒绝授权
        this.status = 0;
      }
      debugger;
      // this.reLaunch()
    },
    // 返回上一页
    navBack() {
      this.$mRouter.back();
    },
    reLaunch() {
        uni.setStorageSync('tongfang-phone', this.phone);
        // 后续业务代码
        this.$mRouter.reLaunch({ route: '/pages/profile/profile' });
        /* uni.reLaunch({//信息更新成功后跳转到小程序首页
						url: '/pages/index/index'
					}); */
    },
    /**
     * 打开设置开启授权
     */
    openSetting() {
      uni.showModal({
        title: '提示',
        content: '你已经取消过授权，需设置授权权限',
        confirmText: '设置',
        success: function (res) {
          if (res.confirm) {
            uni.openSetting({
              success(res) {
                debugger;
              },
            });
          } else if (res.cancel) {
          }
        },
      });
    },
  },
};
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
.login-button {
  border-radius: 80rpx;
  margin: 35rpx 50rpx;
  font-size: 35rpx;
}
.login-button:first-child {
  margin-top: 50rpx;
}

.view_input {
  margin: 0 50rpx;
  background-color: white;
  padding: 10px;
  height: 1rem;
  line-height: 1rem;
}

.cancel-btn {
  text-align: center;
  color: $font-color-light;
}
</style>
