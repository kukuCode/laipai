export default {
	// app应用名称
	appName: '中环来拍',

	// 验证码发送间隔
	sendCodeTime: 60,

	// 金额符号
	moneySymbol: '￥',


	// 顶部导航菜单
	menuTop: [
		{
			icon: 'iconzhuyedefuben',
			text: '首页',
			urlType: 'tab',
			url: '/pages/index/index'
		},
		{
			icon: 'iconwode-',
			text: '我的',
			urlType: 'tab',
			url: '/pages/profile/profile'
		}
	],

	// 个人中心-设置中心菜单
	settingList: [
		{ icon: 'icongerenxinxi', url: '/pages/user/userinfo/userinfo', title: '个人信息', color: '#ff6b81' },
		{ icon: 'iconfuwu_xuanzhong', url: '/pages/user/service/myservice', title: '我的服务', color: '#ff6b81' },
		{ icon: 'iconshoucang3', url: '/pages/appointment/appointmentlist', title: '预约记录', color: '#ff6b81' },
		{ icon: 'iconduankai', url: '/pages/user/bind/unbind', title: '解除绑定', color: '#ff6b81' }
	],

	// 设置-设置中心
	setList: [
		{
			title: '个人资料',
			url: '/pages/user/userinfo/userinfo',
			content: ''
		},
		{
			title: '修改密码',
			url: '/pages/public/password?type=1',
			content: ''
		},
		{
			title: '授权管理',
			url: '/pages/set/authorization/list',
			content: ''
		},
		{
			title: '发票管理',
			url: '/pages/set/invoice/invoice',
			content: '',
			class: 'mT'
		},
		{ title: '开票历史', url: '/pages/set/invoice/list', content: '' },
		{ title: '清除缓存', url: 'clearCache', content: '' },
		{
			title: '关于商城',
			url: '/pages/set/about/about',
			content: '',
			class: 'mT'
		},
		{
			title: '站点帮助',
			url: '/pages/set/helper/index',
			content: ''
		},
		/*  #ifdef APP-PLUS  */
		{ title: '检查更新', url: 'versionUpgrade', content: '' },
		/*  #endif  */
		{ title: '意见反馈', url: '/pages/set/feedback/list', content: '' }
	],

	// 主题列表
	themeList: [
		{
			title: '默认',
			name: 'def',
			color: '#b52e25',
			tabList: [
				'/static/tab-home-red.png',
				'/static/tab-cate-red.png',
				'/static/tab-notify-red.png',
				'/static/tab-cart-red.png',
				'/static/tab-my-red.png'
			]
		},
		{
			title: '官方',
			name: 'rf',
			color: '#fa436a',
			tabList: [
				'/static/tab-home-rf.png',
				'/static/tab-cate-rf.png',
				'/static/tab-notify-rf.png',
				'/static/tab-cart-rf.png',
				'/static/tab-my-rf.png'
			]
		},
		{
			title: '嫣红',
			name: 'red',
			color: '#b52e25',
			tabList: [
				'/static/tab-home-red.png',
				'/static/tab-cate-red.png',
				'/static/tab-notify-red.png',
				'/static/tab-cart-red.png',
				'/static/tab-my-red.png'
			]
		},
	]
};
