import Vue from 'vue';
import Vuex from 'vuex';
import $mConstDataConfig from '@/config/constData.config';
import $mSettingConfig from '@/config/setting.config';

Vue.use(Vuex);
const ACCESSTOKEN = uni.getStorageSync('accessToken') || '';
const USER = uni.getStorageSync('user') || {};
const GLOBALCONFIG = uni.getStorageSync('globalConfig') || {};
const NOTIFYNUM = uni.getStorageSync('notifyNum') || 0;
const THEMECOLOR = uni.getStorageSync('themeColor');

const store = new Vuex.Store({
	state: {
		// 用户token
		accessToken: ACCESSTOKEN,
		// 用户信息
		userInfo: USER.member,
		// 小程序openid
		openId: '',
		globalConfig: GLOBALCONFIG,
		// 消息中心数字角标
		notifyNum: NOTIFYNUM,
		themeColor: THEMECOLOR,
		// 是否强制登录
		forcedLogin: false
	},
	getters: {
		// 全局风格
		themeColor: state => {
			let theme = state.themeColor;
			if (!theme) {
				theme = $mConstDataConfig.themeList.filter((item) => item.name === ($mSettingConfig.styleType || 'rf'))[0];
			}
			return theme;
		},
		// 全局配置
		globalConfig: state => {
			return state.globalConfig;
		},
		// 判断用户是否登录
		hasLogin: state => {
			return !!state.accessToken;
		}
	},
	mutations: {
		login(state, provider) {
			state.accessToken = provider.access_token;
			state.userInfo = provider.member;
			state.user = provider;
			uni.setStorageSync('user', provider);
			uni.setStorageSync('accessToken', provider.access_token);
			uni.setStorageSync('userInfo', provider.member);
		},
		logout(state) {
			state.accessToken = '';
			state.userInfo = {};
			uni.removeStorageSync('accessToken');
			uni.removeStorageSync('userInfo');
		},
		setOpenId(state, openId) {
			state.openId = openId;
			uni.setStorageSync('openId', openId);
		},
		setGlobalConfig(state, provider) {
			state.globalConfig = provider;
			uni.setStorageSync('globalConfig', provider);
		},
		setThemeColor(state, val) {
			state.themeColor = val;
			uni.setStorageSync('themeColor', val);
		}
	},
	actions: {
		globalConfigChange({ commit }, info) {
			commit('setGlobalConfig', info);
		},
		logout({ commit }) {
			commit('logout');
		}
	}
});

export default store;
