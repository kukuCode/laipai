export default {
	// app应用名称
	appName: '中环来拍',

	// 验证码发送间隔
	sendCodeTime: 60,

	// 金额符号
	moneySymbol: '￥',

	// 单商品替代词
	singleSkuText: '基础款',

	// 顶部导航菜单
	menuTop: [
		{
			icon: 'iconxiaoxi1',
			text: '消息',
			urlType: 'tab',
			url: '/pages/notify/notify'
		},
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
		{ icon: 'iconshoucang3', url: '/pages/user/profile/myinfo', title: '个人信息', color: '#ff6b81' },
		{ icon: 'iconshoucang3', url: '/pages/user/service/myservice', title: '我的服务', color: '#ff6b81' },
		{ icon: 'iconshoucang3', url: '/pages/user/appointment/list', title: '预约记录', color: '#ff6b81' },
		{ icon: 'iconshoucang3', url: '/pages/user/bind/unbind', title: '解除绑定', color: '#ff6b81' },
		{ icon: 'iconfenxiang', url: '', title: '退出登录', color: '#ff6b81' },
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

	// 个人中心-我的订单
	orderSectionList: [
		{
			title: '待付款',
			icon: 'iconfont icondaifukuan',
			url: '/pages/order/order?state=0',
			num: null
		},
		{
			title: '待发货',
			icon: 'iconfont iconshouye',
			url: '/pages/order/order?state=1',
			num: null
		},
		{
			title: '待收货',
			icon: 'iconfont iconyishouhuo',
			url: '/pages/order/order?state=2',
			num: null
		},
		{
			title: '评价',
			icon: 'iconfont iconpingjia',
			url: '/pages/order/order?state=3',
			num: null
		},
		{
			title: '退款/售后',
			icon: 'iconfont iconshouhoutuikuan',
			url: '/pages/order/refund',
			num: null
		}
	],

	// 消息类型 1:公告;2:提醒;3:私信
	notifyTypeList: [
		{ type: 0, content: '' },
		{ type: 1, content: '公告' },
		{ type: 2, content: '提醒' },
		{ type: 3, content: '私信' }
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
			color: '#e54d42',
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
