<template>
	<view class="rf-index">
		<!--搜索导航栏-->
		<z-header-search  class="head-Search-input-box"
			:mode="2"
			button="inside"
			:placeholder="hotSearchDefault || '请输入关键字'"
			@search="doSearch(false)"
			@confirm="doSearch(false)"
			v-model="keyword" />

		<!-- 推荐分类 -->
		<block>
			<view v-if="recommendCenterList.length>0">
				<view class="category-list-wrapper" style="height:324upx" ref='refCategory'>
					<view class="category-list">
					<view class="category" v-for="(nav, ii) in recommendCenterList" :key="ii"
					@tap="navToCategory(nav.name, nav.name)">
							<view class="img">
								<!-- <image :src="sItem.cover || errorImage" mode="aspectFill"></image> -->
								<image lazy-load='true' fade-show='true' src="http://shegnqx.oss-cn-beijing.aliyuncs.com/1592358296803.png" mode="widthFix" style="height: 90upx;width: 90upx" ></image>
							</view>
							<view class="text in1line">{{ nav['name'] }}</view>
					</view>
					</view>
				</view>
			</view>
		
			
		</block>

		<!-- 商品栏目 -->
		<block>
			<view v-if="commodityList.length>0" style="margin-top:16upx;" class="commodity-wrapper">
				<!-- 过滤条件 -->
				<!-- <view class="rf-header-screen" :style="{top:height+'px'}" :class="{isFixed:isFixed}"> -->
				<view class="rf-header-screen solid-bottom" :class="{'is-fixed':isFixed}">
					<view class="">

					</view>
					<view class="rf-screen-top">
						<view class="rf-top-item rf-icon-ml" :class="[tabIndex==0? `text-${themeColor.name} rf-bold`:'']" data-index="0" @tap="screen">
							<text>{{selectedName}}</text>
							<text class="iconfont" :class="tabIndex==0 && selectH>0?'iconshang':'iconxia'" :style="{color: tabIndex==0? themeColor.color:'#444'}"></text>
						</view>
						<view class="rf-top-item" :class="[tabIndex == 1?`text-${themeColor.name} rf-bold`:'']" @tap="screen" data-index="1">
							区域
							<text class="iconfont" :class="tabIndex ==1 && selectH>0?'iconshang':'iconxia'" :style="{color: tabIndex==1? themeColor.color:'#444'}"></text>
						</view>
						<view class="rf-top-item" :class="[tabIndex == 2?`text-${themeColor.name} rf-bold`:'']" @tap="screen" data-index="2">
							状态
							<text class="iconfont" :class="tabIndex ==2 && selectH>0?'iconshang':'iconxia'" :style="{color: tabIndex==2? themeColor.color:'#444'}"></text>
						</view>
						<view class="rf-top-item" :class="[tabIndex == 3?`text-${themeColor.name} rf-bold`:'']" @tap="screen" data-index="3">
							类型
							<text class="iconfont" :class="tabIndex ==3 && selectH>0?'iconshang':'iconxia'" :style="{color: tabIndex==3? themeColor.color:'#444'}"></text>
						</view>
						<view class="rf-top-item rf-icon-ml" @tap="screen" data-index="4">
							<text>筛选</text>
							<!--<rf-icon name="screen" :size="12" color="#333" rf-icon-class="rf-ml" :bold="true"></rf-icon>-->
						</view>
						<!--下拉选择列表--综合-->
						<view class="rf-dropdownlist" :class="[selectH>0?'rf-dropdownlist-show':'']" :style="{height:selectH+'px'}">
							<scroll-view scroll-y @touchmove.stop.prevent style="height: 90%;position: absolute;left: 0px;overflow: hidden;">
							<view class="rf-dropdownlist-item rf-icon-middle" :class="[item.selected?'rf-bold':'']" v-for="(item,index) in dropdownList" :key="index" @tap.stop="dropdownItem" :data-index="index">
								<text class="rf-ml rf-middle">{{item.name}}</text>
								<text class="iconfont icongouxuan" :class="'text-' + themeColor.name" v-if="item.selected"></text>
							</view>
							</scroll-view>
						</view>
						<view class="rf-dropdownlist-mask" :class="[selectH>0?'rf-mask-show':'']" @tap.stop="hideDropdownList"></view>
						<!--下拉选择列表--综合-->
					</view>
				</view>
					<view :class="{'fixed-show':isFixed}">
					</view>
					<view class="rf-screen-bottom">
						<!-- <block v-for="(item,index) in attrArr" :key="index">
							<view class="rf-bottom-item rf-icon-ml" :class="[item.isActive ? `bg-${themeColor.name} rf-btmItem-active` : 'rf-btmItem-normal',attrIndex==index?'rf-btmItem-tap':'']" :data-index="index" @tap="btnDropChange">
								<view class="rf-bottom-text" :class="[attrIndex==index?'rf-active':'']">{{item.isActive?item.selectedName:item.name}}</view>
								<text class="iconfont" :class="attrIndex==index?'iconshang':'iconxia'" :size="14" :color="attrIndex==index || item.isActive?'$base-color':'#444'" rf-icon-class="rf-ml" v-if="item.list.length>0"></text>
							</view>
						</block> -->
					</view>
				
				<!-- 商品列表 -->
				<!-- <z-filter :ref="'slFilter'" :topFixed="true" :isTransNav="true" :navHeight="50" :menuList="menuList"
		 			@result="result"></z-filter> -->
				<z-product-list style="padding:0 20upx" v-if="commodityList.length>0" :isList="true" :bottom="bottom" :list="commodityList.length > 0 ? commodityList : [0, 0]"></z-product-list>
			</view>
			<view v-else class="index-cate-product-list">
				<rf-empty
					:bottom="bottom"
					:info="'暂无相关的物~'"
					:isRecommendShow="false"
					v-if="recommendCenterList.length === 0"
				></rf-empty>
			</view>
			<!-- 加载更多 -->
			<rf-load-more
				:status="loadingType"
				v-if="recommendCenterList.length > 0"
			></rf-load-more>
		</block>

		<!--页面加载动画-->
		<rfLoading isFullScreen :active="loading"></rfLoading>
		<!-- <rf-back-home></rf-back-home> -->
		<rf-back-top :scrollTop="scrollTop"></rf-back-top>
	</view>
</template>
<script>
/**
 * 首页
 * @date 2020-8-13 23:02:53
 */
import {
	indexList,
	productList
} from '@/api/product';
// import rfSwipeDot from '@/components/rf-swipe-dot';
// import rfFloorIndex from '@/components/rf-floor-index';
// import rfSearchBar from '@/components/rf-search-bar';
// import rfSwiperSlide from '@/components/rf-swiper-slide';
// import rfProductList from '@/components/rf-product-list';

import zHeaderSearch from '@/components/z-header-search';
import zFloorIndex from '@/components/z-floor-index';
import zProductList from '@/components/z-product-list';
import {commodityList, addressList, menuList} from "@/Json.js"
// import zFilter from '@/components/z-filter/z-filter.vue';

import { mapMutations } from 'vuex';
export default {
	components: {
		// rfFloorIndex,
		// rfSwipeDot,
		// rfProductList,
		// rfSearchBar,
		// rfSwiperSlide,
		zHeaderSearch,
		zFloorIndex,
		zProductList,
		// zFilter
	},
	data() {
		return {
			menuList:menuList,
			hotProductList: [], // 热门商品列表
			newProductList: [], // 新品上市商品列表
			productCateList: [], // 商品栏目
			config: {}, // 商户配置
			announceList: [], // 公告列表
			share: {},
			loading: true,
			scrollTop: 0,
			loadingType: 'more', // 标识加载状态
			hotSearchDefault: '请输入关键字',
			errorImage: this.$mAssetsPath.errorImage,
			appName: this.$mSettingConfig.appName,
			tabCurrentIndex: 0,
			categoryList: [], // 分类列表
			categoryProductList: [], // 分类列表
			currentCate: 0,
			productLoading: true,
			page: 1,
			isOpenIndexCate: this.$mSettingConfig.isOpenIndexCate,
			moneySymbol: this.moneySymbol, // 金额符号
			keyword:'',
			appCenterList: [{ name: "住宅用房", second_class: "residence" }, { name: "车辆", second_class: "vehicle" }, { name: "建筑用地", second_class: "buildland" }, { name: "一般动产", second_class: "property" }, { name: "股权", second_class: "equity" }, { name: "商业用房", second_class: "commercial" }, { name: "工业用房", second_class: "industrial" }, { name: "其他用房", second_class: "otherhouse" }, { name: "其他交通运输工具", second_class: "traffic" }, { name: "其他用地", second_class: "otherland" }, { name: "土地承包经营权", second_class: "contractland" }, { name: "宅基地使用权", second_class: "homestead" }, { name: "海域使用权", second_class: "sea" }, { name: "船舶", second_class: "ship" }, { name: "渔船", second_class: "fishboat" }, { name: "航空器", second_class: "aircraft" }, { name: "其他财产", second_class: "otherassets" }, { name: "股票", second_class: "stock" }, { name: "基金", second_class: "fund" }, { name: "债券", second_class: "bond" }, { name: "债权", second_class: "debt" }, { name: "机器设备", second_class: "equipment" }, { name: "产品原材料", second_class: "material" }, { name: "知识产权", second_class: "knowledge" }, { name: "古玩字画", second_class: "artwork" }, { name: "森林、林木所有权", second_class: "forest" }, { name: "集体土地所有权", second_class: "collective" }, { name: "珠宝玉石首饰", second_class: "gems" }, { name: "探矿/采矿权", second_class: "mine" }],
			commodityList:[], // 商品列表
			isFixed:false, // 筛选栏是否固定

			selectedName:'价格',
			selectH: 0,
			tabIndex: 0,
			dropdownList:[],
			paimaiState:[{
				name: "即将开始",
				param: {v:0}
			},{
				name: "正在进行",
				param: {v:1}
			},{
				name: "已成交",
				param: {v:2}
			}],
			priceDropdownList:[{
					name: "综合",
					selected: true,
					param: {}
				}, {
					name: "价格升序",
					selected: false,
					param: { price: 'asc' }
				}, {
					name: "价格降序",
					selected: false,
					param: { price: 'desc' }
				}]
		};
	},
	onPageScroll(e) {
		this.scrollTop = e.scrollTop;

		if(this.scrollTop > 170){
		// if(this.scrollTop >= 162){
			this.isFixed = true
		} else {
			this.isFixed = false
		}
	},
	onShow() {
		// 初始化购物车数量
		// this.setCartNum(uni.getStorageSync('cartNum'));
	},
	onLoad() {
		// 获取高度顶部菜单高/宽
		let obj = {};
		// #ifdef MP-WEIXIN
		obj = wx.getMenuButtonBoundingClientRect();
		// #endif
		// #ifdef MP-BAIDU
		obj = swan.getMenuButtonBoundingClientRect();
		// #endif
		// #ifdef MP-ALIPAY
		my.hideAddToDesktopMenu();
		// #endif
		uni.getSystemInfo({
			success: (res) => {
				this.width = obj.left || res.windowWidth;
				this.height = obj.top ? (obj.top + obj.height + 8) : (res.statusBarHeight + 44);
				this.inputTop = obj.top ? (obj.top + (obj.height - 30) / 2) : (res.statusBarHeight + 7);
				this.arrowTop = obj.top ? (obj.top + (obj.height - 32) / 2) : (res.statusBarHeight + 6);
				this.searchKey = options.searchKey || "";
				//略小，避免误差带来的影响
				this.dropScreenH = this.height * 750 / res.windowWidth + 186;
				this.drawerH = res.windowHeight - uni.upx2px(100) - this.height
			}
		});
		// 初始化数据
		this.initData();
	},
	mounted(){
		/* const query = uni.createSelectorQuery().in(this);
		query.select('#scrollView').boundingClientRect(data => {
		console.log("得到布局位置信息" + JSON.stringify(data));
		console.log("节点离页面顶部的距离为" + data.top);
		data.top
		}).exec(); */

	},
	computed: {
		recommendCenterList() {
			return this.appCenterList.slice(0,10)
		},
		bottom () {
			let bottom = 0;
			/*  #ifdef H5  */
      bottom = 90;
			/*  #endif */
			return bottom;
		},
		swipeCateList() {
			const list = this.productCateList;
			let result = [];
			for (let i = 0, len = list.length; i < len; i += 10) {
				result.push(list.slice(i, i + 10));
			}
			return result;
		}
	},
	onShareAppMessage() {
    let shareParams = { title: this.share.share_title || `欢迎来到${this.appName}`, path: '/pages/index/index' };
    return shareParams;
	},
	filters: {
		filterDiscountPrice(val) {
			const price = val.product && (val.product.price * val.discount) / 100;
			switch (val.decimal_reservation_number) {
				case 0:
					return (Math.floor(price * 100) / 100).toFixed(2);
				case 1:
					return (Math.floor(price * 100) / 100).toFixed(0);
				case 2:
					return (Math.floor(price * 100) / 100).toFixed(1);
				default:
					return (Math.floor(price * 100) / 100).toFixed(2);
			}
		},
		filterTotalSales(val) {
			if (val > 10000) {
				val = `${(val / 10000).toFixed(2)}万`;
			}
			return val;
		}
	},
	// 下拉刷新
	onPullDownRefresh() {
		this.getIndexList('refresh');
	},
	// 加载更多
	onReachBottom() {
		if (this.loadingType === 'nomore') return;
		this.page++;
		this.getCommodityList()
	},
	methods: {
		screen(e) {
			let index = parseInt(e.currentTarget.dataset.index, 10);
			
			if (index === 0) {
				
				if(this.tabIndex==0 && this.selectH != 0){
					this.selectH = 0;
					this.tabIndex = null;
				} else {
					this.tabIndex = index
					this.selectH = 123;
					this.dropdownList = this.priceDropdownList;
				}
			} else if (index === 1) {
				// this.tabIndex = index
				this.selectH = 200
				let params = {}
				if (this.tabIndex == 1) {
					this.tabIndex = null;
					this.selectH = 0;
					// this.showDropdownList()
				} else {
					this.dropdownList = addressList;
					this.tabIndex = index
				}
			} else if (index === 2) {
				if (this.tabIndex === 2) {
					this.tabIndex = null;
					this.selectH = 0
				} else {
					this.tabIndex = 2;
					this.selectH = 150
					this.dropdownList = this.paimaiState;
				}
				// this.isList = !this.isList
			} else if (index === 3) {
				if (this.tabIndex === 3) {
					this.tabIndex = null;
					this.selectH = 0
				} else {
					this.tabIndex = 3;
					this.selectH = 240
					this.dropdownList = this.appCenterList;
				}
			} else if(index === 4){
				// 这里不是下拉选择了,,待优化
			}
		},
		hideDropdownList(){
			this.selectH = 0;
			this.tabIndex = null;
		},
		dropdownItem(e) {
			let index = parseInt(e.currentTarget.dataset.index, 10);
			let arr = this.dropdownList;
			for (let i = 0; i < arr.length; i++) {
				if (i === index) {
					arr[i].selected = true;
				} else {
					arr[i].selected = false;
				}
			}
			this.dropdownList = arr;
			switch (index) {
				case 0:
					this.selectedName = index === 0 ? '综合' : index === 1 ? '价格升序' : '价格降序';
				break;
				case 1:
				
				break;
				case 2:
				
				break;
				case 3:
				
				break;
			
				default:
					break;
			}

			
			this.selectH = 0;
			this.page = 1;
			// this.productList = [];
			this.loading = true;
			// this.productParams = this.dropdownList[index].param;
			setTimeout(() => {
				this.loading = false
			}, 2e3);
			// this.getProductList();
		},
		toggleDropdownShow(e){
			let index = parseInt(e.currentTarget.dataset.index, 10);
			if(this.selectH == 0){
				this.showDropdownList()
			} else {
				this.selectH = 0;
			}

		},
		showDropdownList() {
			this.selectH = 150;
			// this.tabIndex = 0;
		},
		// 顶部tab点击
		tabClick(index, id) {
			this.currentCate = id;
			this.tabCurrentIndex = index;
			if (id === 0) return;
			this.loading = true;
			this.page = 1;
			this.productLoading = true;
			this.categoryProductList = [];
			this.getProductList(id);
		},
		getCommodityList(){
			// 请求服务加载更多
			// !!目前是模拟的数据!!
			this.loadingType =this.page != 5 ? 'more' : 'nomore';
			setTimeout(() => {
				this.commodityList = [...this.commodityList, ...commodityList];
				this.loading = false;
			}, 1500);

		},
		// 获取产品列表
		async getProductList(id) {
			await this.$http
				.get(`${productList}`, {
					cate_id: id,
					page: this.page
				})
				.then(async r => {
					this.loading = false;
					this.productLoading = false;
					this.loadingType = r.data.length === 10 ? 'more' : 'nomore';
					this.categoryProductList = [...this.categoryProductList, ...r.data];
				}).catch(() => {
					this.loading = false;
					this.productLoading = false;
				});
		},
		// ...mapMutations(['setCartNum']),
		// 监听轮播图切换
		handleDotChange(e) {
			this.current = e.detail.current;
		},
		// 数据初始化
		initData() {
			this.getIndexList();
		},
		// 通用跳转
		navTo(route) {
			this.$mRouter.push({ route });
		},
		// 跳转至分类模块
		navToCategory(id) {
			debugger;
			if (this.$mSettingConfig.appCateType === '2') {
				uni.setStorageSync('indexToCateId', id);
				this.$mRouter.reLaunch({ route: '/pages/category/category' });
					} else {
				this.navTo(`/pages/product/list?cate_id=${id}`);
			}
		},
		// 通用跳转
		navToSearch() {
			this.$mRouter.push({
				route: `/pages/index/search/search?data=${JSON.stringify(this.keyword)}`
			});
		},
		// 获取主页数据
		async getIndexList(type) {
			// !待联调服务!
			let p = '?page=1&limit=15&title=&status=&typeCode=&addressDistrictCode=&addressCityCode=&disposalUnit=&initialprices=&initialpricee=&startdate=&enddate='
			/* await this.$http
				.get(`${indexList}${p}`, {})
				.then(async r => {
					uni.setNavigationBarTitle({ title: this.appName });
					if (type === 'refresh') {
						uni.stopPullDownRefresh();
					}
					// 首页参数赋值
					// this.initIndexData(r.data);
					this.loading = false;
				})
				.catch(() => {
					this.loading = false;
					if (type === 'refresh') {
						uni.stopPullDownRefresh();
					}
				}); */
				
				setTimeout(() => {
					if (type === 'refresh') {
						this.page = 1;
						uni.stopPullDownRefresh();
					}
					this.commodityList = commodityList
					// 假数据
					// this.initIndexData(r.data);
					this.loading = false;
				}, 2000);

		},
		// 首页参数赋值
		initIndexData(data) {
			uni.setStorageSync('search', this.keyword);
			this.guessYouLikeProductList = data.guess_you_like;
			this.newProductList = data.product_new;
			this.config = data.config;
			// this.$mHelper.handleWxH5Share(this.share.share_title || this.appName, this.share.share_desc || `欢迎来到${this.appName}商城`, this.share.share_link || this.$mConfig.hostUrl, this.share.share_cover || this.$mSettingConfig.appLogo);
		},
		// 跳转至商品详情页
		navToDetailPage(data) {
			const { id } = data;
			if (!id) return;
			this.$mRouter.push({ route: `/pages/product/product?id=${id}` });
		},
		// 跳转至分类页
		toCategory() {
			this.$mRouter.switchTab({ route: '/pages/category/category' });
		}
	}
};
</script>
<style lang="scss">
page {
	background-color: $page-color-base;
}
.rf-index {
	background-color: $color-white;
	/*分类列表*/
	.category-list-wrapper {
		.category-list {
			width: 100%;
			padding: 0 $spacing-base;
			display: flex;
			justify-content: space-between;
			flex-wrap: wrap;
			.category {
				margin: 10upx 0 20upx 0;
				width: calc(20% - 20upx);
				height: 132upx;
				display: flex;
				text-align: center;
				flex-wrap: wrap;
				.img {
					width: 100%;
					display: flex;
					justify-content: center;
					image {
						width: 12vw;
						height: 12vw;
						border-radius: 50%;
					}
				}
				.text {
					margin-top: 16upx;
					width: 100%;
					display: flex;
					justify-content: center;
					font-size: 24upx;
					color: #3c3c3c;
				}
			}
		}
	}
	.main-wrapper {
		margin-top: 85upx;
		/*#ifdef MP*/
		margin-top: 0;
		/*#endif*/
	}


	.index-cate-product-list {
		padding-top: $spacing-sm;
		background-color: $page-color-base;
		.no-data {
			margin: 48upx 0;
			color: $font-color-light;
			display: flex;
			justify-content: center;
			align-items: center;
			.iconfont {
				margin-right: 20upx;
			font-size: $font-lg + 16upx;
			}
		}
	}
}

// 商品栏
.commodity-wrapper{
	// 过滤条件
	.rf-header-screen {
			width: 100%;
			background: $color-white;
			&.is-fixed{
				top:100upx;
				z-index: 9;
				position: fixed;
			}
			.rf-screen-top,
			.rf-screen-bottom {
				border: none;
				display: flex;
				align-items: center;
				justify-content: space-between;
				font-size: 28upx;
				color: #333;
			}
			.rf-screen-top {
				height: 88upx;
				line-height: 88upx;
				position: relative;
				// background: $color-white;
				background: #f5f5f5;
				
				.rf-dropdownlist {
						width: 100%;
						position: absolute;
						background: $color-white;
						border-bottom-left-radius: 24upx;
						border-bottom-right-radius: 24upx;
						overflow: hidden;
						box-sizing: border-box;
						padding-top: 10upx;
						padding-bottom: 26upx;
						left: 0;
						top: 88upx;
						visibility: hidden;
						transition: all 0.2s ease-in-out;
						z-index: 99;
						.icongouxuan {
							font-size: $font-lg;
							line-height: 88upx;
						}
					}
					.rf-dropdownlist-show {
						visibility: visible;
					}
					.rf-dropdownlist-mask {
						position: fixed;
						top: 0;
						left: 0;
						right: 0;
						bottom: 0;
						background: rgba(0, 0, 0, 0.6);
						z-index: -1;
						transition: all 0.2s ease-in-out;
						opacity: 0;
						visibility: hidden;
					}
					.rf-mask-show {
						opacity: 1;
						visibility: visible;
					}
					.rf-dropdownlist-item {
						color: #333;
						height: 70upx;
						font-size: 28upx;
						padding: 0 40upx;
						box-sizing: border-box;
						display: flex;
						align-items: center;
						justify-content: space-between;
					}
					
			}
			.rf-top-item {
				height: 28upx;
				line-height: 28upx;
				flex: 1;
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: $font-base;
				.iconfont {
					font-size: $font-lg + 4upx;
					font-weight: 600;
				}
			}
			.rf-screen-bottom {
				height: 100upx;
				padding: 0 30upx;
				box-sizing: border-box;
				font-size: 24upx;
				align-items: center;
				overflow: hidden;
			}
			.rf-bottom-text {
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}
			.rf-bottom-item {
				flex: 1;
				width: 0;
				display: flex;
				align-items: center;
				justify-content: center;
				padding: 0 12upx;
				box-sizing: border-box;
				margin-right: 20upx;
				white-space: nowrap;
				height: 60upx;
				border-radius: 40upx;
			}
			.rf-bottom-item:last-child {
				margin-right: 0;
			}
			.rf-bold {
				font-weight: bold;
			}
			.rf-active {
				color: $base-color;
			}
			.rf-icon-ml .rf-icon-class {
				margin-left: 6upx;
			}
			.rf-ml {
				margin-left: 6upx;
			}
			.rf-seizeaseat-20 {
				height: 20upx;
			}
			.rf-seizeaseat-30 {
				height: 30upx;
			}
			.rf-icon-middle .rf-icon-class {
				vertical-align: middle;
			}
			.rf-middle {
				vertical-align: middle;
			}
		}
		.fixed-show {
			background-color: #ffffff;
			height: 88upx;
			/*  #ifdef  APP-PLUS  */
			margin-top: var(--status-bar-height);
			/*  #endif  */
		}
		/*screen*/
		.rf-btmItem-active {
			border-radius: 32upx;
			font-weight: bold;
			position: relative;
		}
		.rf-btmItem-normal {
			border: 1upx solid rgba(0, 0, 0, 0.12);
			position: relative;
		}
		.rf-btmItem-active::after {
			content: "";
			position: absolute;
			width: 100%;
			height: 100%;
			border-radius: 40upx;
			left: 0;
			top: 0;
		}
		.rf-btmItem-tap {
			position: relative;
			border-bottom-left-radius: 0;
			border-bottom-right-radius: 0;
		}
		.rf-btmItem-tap::after {
			content: "";
			position: absolute;
			width: 100%;
			height: 22upx;
			background: #f7f7f7;
			left: 0;
			top: 58upx;
		}

}
</style>
