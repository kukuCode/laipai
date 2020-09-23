<template>
	<view class="rf-index">
		<!--搜索导航栏-->
		<z-header-search  class="head-Search-input-box"
			:mode="2"
			button="inside"
			:placeholder="hotSearchDefault || '请输入关键字'"
			@search="doSearch(false)"
			@confirm="doSearch(false)"
			v-model="queryParam.title">
			<template slot="headerLeft">
				<view style="display:flex;align-items: center;    max-width: 120px;    white-space: nowrap;" class="left-region">
					<!-- <text>成都</text> -->
					<z-pick-regions :defaultLevel="2" customFirstName="不限" @selecteRegion="handleSelecteRegion" ref="refRegion" />
					<text class="downIcon cuIcon-triangledownfill"></text>
				</view>
			</template>
		</z-header-search>

		<!-- 推荐分类 -->
		<block>
			<view v-if="recommendCenterList.length>0">
				<view class="category-list-wrapper" style="height:324rpx" ref='refCategory'>
					<view class="category-list">
					<view class="category" v-for="(nav, ii) in recommendCenterList" :key="ii"
					@tap="handleTapCategory(nav.code)">
							<view class="img">
								<!-- <image :src="sItem.cover || errorImage" mode="aspectFill"></image> -->
								<image lazy-load='true' fade-show='true' :src="nav.icon" mode="widthFix" style="height: 80upx;width: 80upx" ></image>
							</view>
							<view class="text in1line">{{ nav['name'] }}</view>
					</view>
					</view>
				</view>
			</view>
		</block>

		<!-- 商品栏目 -->
		<block>
			<view  v-if="recommendCenterList.length>0"  class="commodity-wrapper">
				<!-- 过滤条件 -->
				<!-- <view class="rf-header-screen" :style="{top:height+'px'}" :class="{isFixed:isFixed}"> -->
					<view v-if="false">
						<z-sticky :scrollTop="scrollTop" stickyHeight="88rpx" :stickyTop="44" :isNativeHeader="true">
							<template v-slot:header>
								<view class="rf-header-screen solid-bottom" :class="{'is-fixed':isFixed}">
									<view class="rf-screen-top">
										<!-- <view class="rf-top-item" :class="[tabIndex == 0?`text-${themeColor.name} rf-bold`:'']" @tap="screen" data-index="0">
											价格
										</view> -->

										<!-- <view class="rf-top-item rf-icon-ml" :class="[tabIndex==0? `text-${themeColor.name} rf-bold`:'']" data-index="0" @tap="screen">
											<text>价格</text>
											<text class="iconfont" :class="selectH>0?'iconshang':'iconxia'" :style="{color: tabIndex==0? themeColor.color:'#b52e25'}"></text>
										</view> -->

										<view class="rf-top-item rf-icon-ml" :class="[tabIndex==0? `text-${themeColor.name} rf-bold`:'']" data-index="0" @tap="screen">
											<text>{{selectedName}}</text>
											<text class="iconfont" :class="tabIndex==0 && selectH>0?'iconshang':'iconxia'" :style="{color: tabIndex==0? themeColor.color:'#b52e25'}"></text>
										</view>
										<!-- <view class="rf-top-item" :class="[tabIndex == 1?`text-${themeColor.name} rf-bold`:'']" @tap="screen" data-index="1">
											区域
											<text class="iconfont" :class="tabIndex ==1 && selectH>0?'iconshang':'iconxia'" :style="{color: tabIndex==1? themeColor.color:'#b52e25'}"></text>
										</view> -->
										<view class="rf-top-item" :class="[tabIndex == 1?`text-${themeColor.name} rf-bold`:'']" @tap="screen" data-index="1">
											状态
											<text class="iconfont" :class="tabIndex ==1 && selectH>0?'iconshang':'iconxia'" :style="{color: tabIndex==1? themeColor.color:'#b52e25'}"></text>
										</view>
										<view class="rf-top-item" :class="[tabIndex == 2?`text-${themeColor.name} rf-bold`:'']" @tap="screen" data-index="2">
											类型
											<text class="iconfont" :class="tabIndex ==2 && selectH>0?'iconshang':'iconxia'" :style="{color: tabIndex==2? themeColor.color:'#b52e25'}"></text>
										</view>
										<view class="rf-top-item rf-icon-ml" @tap="filterMenuClick" data-index="3">
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
							</template>
				</z-sticky>
					<!-- <view :class="{'fixed-show':isFixed}"></view> -->
				</view>
				<!-- 商品列表 -->
				<!-- <z-filter-dropdown class="zd-filter-wrapper"   :menuTop="100" :isFixed ="isFixed"  :filterData="filterData" :defaultSelected ="defaultSelected"  :updateMenuName="true" @confirm="handleConfirm"></z-filter-dropdown> -->
				<!-- <view v-if="true"> -->
				<z-sticky v-if="true" :scrollTop="scrollTop" stickyHeight="88rpx" :stickyTop="44" :isNativeHeader="true">
					<template v-slot:header>
						<view style="height:88rpx">
						<z-filter-dropdown v-if="isReload" class="zd-filter-wrapper"   :menuTop="100" :isFixed ="isFixed"  :filterData="filterData" :defaultSelected ="defaultSelected"  :updateMenuName="true" @confirm="handleConfirm" @menuClick="filterMenuClick"></z-filter-dropdown>
						</view>
					</template>
				</z-sticky>


				<view :class="{'fixed-show':isFixed}"></view>

				<z-product-list v-if="commodityList.length>0" :isList="true" :bottom="bottom" :list="commodityList.length > 0 ? commodityList : [0, 0]"></z-product-list>
				<view v-else class="index-cate-product-list">
					<rf-empty
						:bottom="bottom"
						class="empty-container"
						:info="'暂无相关的物~'"
						:isRecommendShow="true"
						v-if="commodityList.length === 0"
					></rf-empty>
				</view>
			</view>
			<!-- 加载更多 -->
			<rf-load-more
				:status="loadingType"
				v-if="commodityList.length > 0"
			></rf-load-more>
		</block>


		<uni-drawer
			class="rf-drawer"
			:visible="drawer"
			mode="right"
			@close="closeDrawer()"
		>
			<view class="z-drawer-box" :style="{paddingTop:drawerTop+'px'}">
				<scroll-view class="rf-drawer-scroll" scroll-y :style="{height:drawerH+'px'}">
					<view class="rf-drawer-title">
						<text class="rf-title-bold">价格区间（万元）</text>
						<view class="rf-attr-right" :class="'text-' + themeColor.name">
							<text>请输入价格区间</text>
						</view>
					</view>
					<view class="rf-drawer-content">
						<input placeholder-class="rf-phcolor" v-model="minPrice" class="rf-input" placeholder="最低价" maxlength="11" type='number' />
						<text>-</text>
						<input placeholder-class="rf-phcolor" v-model="maxPrice"  class="rf-input" placeholder="最高价" maxlength="11" type='number' />
					</view>
					<!-- <view class="rf-drawer-title">
						<text class="rf-title-bold">全部分类</text>
						<view class="rf-all-box rf-icon-ml">
							<view class="rf-attr-right" :class="'text-' + themeColor.name">{{ currentCateStr }}</view>
						</view>
					</view> -->
					<view class="rf-drawer-content rf-flex-attr">
						<view class="rf-attr-item" :class="[item.isActive ? `bg-${themeColor.name} rf-btmItem-active` : 'rf-btmItem-normal']" v-for="(item, index) in productCateList" :key="item.id" @tap.stop="cateBtnSelected(index)">
							<view class="rf-attr-ellipsis">{{ item.title }}</view>
						</view>
					</view>

					<view class="rf-safearea-bottom"></view>
				</scroll-view>
				<view class="rf-attr-btnbox">
					<view class="rf-attr-safearea">
						<view class="rf-drawer-btn rf-drawerbtn-black" :class="'text-' + themeColor.name" hover-class="rf-white-hover" :hover-stay-time="150" @tap="reset">重置</view>
						<view class="rf-drawer-btn rf-drawerbtn-primary" :class="'bg-' + themeColor.name" hover-class="rf-red-hover" :hover-stay-time="150" @tap="closeDrawer">确定</view>
					</view>
				</view>
			</view>
		</uni-drawer>

		<!--页面加载动画-->
		<rfLoading isFullScreen :active="loading"></rfLoading>
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
	productList,
	recommendCateList
} from '@/api/product';

import zHeaderSearch from '@/components/z-header-search';
import zFloorIndex from '@/components/z-floor-index';
import zProductList from '@/components/z-product-list';
import { filterDataList} from "@/Json.js"
import zFilterDropdown from '@/components/z-filter-dropdown';
import zSticky from '@/components/z-sticky/z-sticky';
import zPickRegions from '@/components/z-pick-regions';

import { mapMutations } from 'vuex';
export default {
	components: {
		zHeaderSearch,
		zFloorIndex,
		zProductList,
		zFilterDropdown,
		zSticky,
		zPickRegions
	},
	data() {
		return {
			page:1,
			pageSize:20,
			hotProductList: [], // 热门商品列表
			newProductList: [], // 新品上市商品列表
			productCateList: [], // 商品栏目
			config: {}, // 商户配置
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
			isOpenIndexCate: this.$mSettingConfig.isOpenIndexCate,
			moneySymbol: this.moneySymbol, // 金额符号
			keyword:'',
			queryParam: {},
			appCenterList: [],
			recommendCenterList:[],
			commodityList:[], // 商品列表
			isFixed:false, // 筛选栏是否固定

			// 筛选START
			drawer:false,
			drawerTop:0,
			drawerH:0,
			productCateList:[],
			currentCateStr:"",
			minPrice:null,
			maxPrice:null,
			// 筛选END

			isReload: true,

			selectedName:'价格',
			selectH: 0,
			tabIndex: 0,
			//  过滤数据BEBIN
			filterData: filterDataList,
			defaultSelected: [],
			// 过滤数据END
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

		/* if(this.scrollTop > 170){
		// if(this.scrollTop >= 162){
			this.isFixed = true
		} else {
			this.isFixed = false
		} */
	},
	onShow() {
		// 初始化购物车数量
		// this.setCartNum(uni.getStorageSync('cartNum'));
	},
	onLoad(options) {
		// 初始化数据
		this.initData();
		// 填充区域模拟数据
		// this.filterData[0].submenu = this.priceDropdownList
		// this.filterData[1].submenu = addressList
		// this.filterData[2].submenu = this.appCenterList

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
			success: res => {
				this.width = obj.left || res.windowWidth;
				// this.drawerTop = obj.top ? obj.top + obj.height + 8 : res.statusBarHeight + 44;
				this.drawerTop = 22;
				this.inputTop = obj.top ? obj.top + (obj.height - 30) / 2 : res.statusBarHeight + 7;
				this.arrowTop = obj.top ? obj.top + (obj.height - 32) / 2 : res.statusBarHeight + 6;
				this.searchKey = options.searchKey || '';
				//略小，避免误差带来的影响
				// this.dropScreenH = (this.drawerTop * 750) / res.windowWidth + 186;
				this.drawerH = res.windowHeight - uni.upx2px(100) - this.drawerTop;
			}
		});

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
		/* recommendCenterList() {
			return this.appCenterList.slice(0,10)
		}, */
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
		this.isReload = false;
		this.$refs.refRegion && this.$refs.refRegion.resetData();
		this.$nextTick(() => {
			this.isReload = true
			this.getIndexList('refresh');
		})
	},
	// 加载更多
	onReachBottom() {
		if (this.loadingType === 'nomore') return;
		this.page++;
		this.getProductList('more')
	},
	methods: {
		/**
		 * 选择市区后
		 */
		handleSelecteRegion(regionArr, str){
			// this.queryParam.addressCityCode = null
			// this.queryParam.addressDistrictCode = null
			let len = regionArr.length
			let params = {addressCityCode:null, addressDistrictCode:null}
			if(regionArr[0] === '-1'){
				params.addressCityCode=null;
				params.addressDistrictCode=null;
			} else if (regionArr[len-1] === '') {
				params.addressCityCode = regionArr[0]
			} else {
				params.addressDistrictCode = regionArr[1]
			}
			this.region = params;
			this.queryParam = {...this.queryParam, ...params}
			this.page = 1;
			this.getProductList('query')
			this.handleScrollTop(0)
		},
		handleConfirm(e){
			// this.indexArr = e.index;
			// this.valueArr = e.value;
			let params = {sortvalue:null, status:null, typeCode:null,fieldsort:null, sortvalue:null}

			let sort = e.value[0]
			if(sort.length && sort[0]) {
				params.sortvalue = sort[0] || null
				params.fieldsort = 'initial_price'
			}

			let status = e.value[1]
			if(status.length) params.status = status[0] || null

			let typeCode = e.value[2]
			if(typeCode.length) params.typeCode = typeCode[0] || null

			this.queryParam = {...this.queryParam,...params}
			debugger;
			this.loading = true;
			setTimeout(() => {
				this.page = 1;
				this.getProductList('query')
			}, 300);

		},

		filterMenuClick(){
			this.drawer = true;
		},
		reset() {

			this.minPrice = '';
			this.maxPrice = '';

			// this.queryParam = {}
			// this.page = 1;
			// this.getProductList('query')
		},
		closeDrawer(){
			debugger;
			this.drawer = false;
			const params = {};

			// if (this.maxPrice) {
				params.initialpricee = this.maxPrice;
			// }
			// if (this.minPrice) {
				params.initialprices = this.minPrice;
			// }
			/* const cateArr = [];
			this.productCateList.forEach(item => {
				if (item.isActive) {
					cateArr.push(item.id);
				}
			});
			if (cateArr.join(',')) {
				params.cate_id = cateArr.join(',');
			} */

			this.page = 1;
			this.productList = [];
			this.loading = true;
			this.queryParam = {...this.queryParam, ...params};
			/* setTimeout(() => {
				this.loading = false;
			}, 1500); */
			// this.getProductList();
			this.getProductList('query')
			// this.handleScrollTop()
		},
		screen(e) {
			let index = parseInt(e.currentTarget.dataset.index, 10);

			if (index === 0) {

				let params = {}
				if (this.tabIndex === 0) {
					this.tabIndex = null;
					params.total_sales = 'asc';
				} else {
					this.tabIndex = 0;
					params.total_sales = 'desc';
				}
				/* this.page = 1;
				this.productList = [];
				this.loading = true; */

			/* 	if(this.tabIndex==0 && this.selectH != 0){
					this.selectH = 0;
					this.tabIndex = null;
				} else {
					this.tabIndex = index
					this.selectH = 123;
					this.dropdownList = this.priceDropdownList;
				} */
			} else if (index === 1) {
				if (this.tabIndex === 1) {
					this.tabIndex = null;
					this.selectH = 0
				} else {
					this.tabIndex = 1;
					this.selectH = 150
					this.dropdownList = this.paimaiState;
				}
				// this.isList = !this.isList
			} else if (index === 2) {
				if (this.tabIndex === 2) {
					this.tabIndex = null;
					this.selectH = 0
				} else {
					this.tabIndex = 2;
					this.selectH = 240
					this.dropdownList = this.appCenterList;
				}
			} else if(index === 3){
				// 这里不是下拉选择了,,待优化
			}
		},
		hideDropdownList(){
			this.selectH = 0;
			this.tabIndex = null;
		},
		dropdownItem(e) {
			this.tabIndex = null;
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
			/* setTimeout(() => {
				this.loading = false
			}, 2e3); */
			// this.getProductList();
			this.getProductList('query')
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
		doSearch(){
			// if(this.queryParam.title){
				this.loading = true;
				console.log("keyword=", this.queryParam.title);
			/* 	setTimeout(() => {
					this.loading = false;
				}, 2e3); */
				this.page = 1;
				this.getProductList('query')

				this.handleScrollTop()

			// }
		},
		/**
		 * 滚动到指定位置
		 */
		handleScrollTop (top=176) {
			uni.pageScrollTo({
				scrollTop: top,
				duration: 300
			});
		},
		/* getCommodityList(){
			this.getProductList('more')
		}, */
		async getProductList(loadType='more',) {
			if(loadType !== 'more') this.loading  = true;
			let params = Object.assign({page:this.page, limit:this.pageSize}, this.$mHelper.filterObj(this.queryParam))
			await this.$http
				.get(`${productList}`, params)
				.then(async r => {
					this.loading = false;
					this.productLoading = false;
					this.loadingType = r.data.length >= 20 ? 'more' : 'nomore';
					if(loadType == 'more'){
						this.commodityList = [...this.commodityList, ...r.data];
					} else {
						this.commodityList = [...r.data]
					}
				}).catch(() => {
					this.loading = false;
					this.productLoading = false;
				});
		},
		// 获取产品列表
		async getProductList2(id) {
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
			// 查询分类
			this.getRecommendCenter()
			// 首页商品
			this.getIndexList();

		},
		// 通用跳转
		navTo(route) {
			this.$mRouter.push({ route });
		},
		// 类模块
		handleTapCategory(code) {
			this.queryParam.typeCode = code
			this.page = 1;
			this.getProductList('query')
		},
		// 通用跳转
		navToSearch() {
			this.$mRouter.push({
				route: `/pages/index/search/search?data=${JSON.stringify(this.keyword)}`
			});
		},
		// 查询分类
		async getRecommendCenter(){
			// this.recommendCenterList
			let params={}
			await this.$http
				.get(`${recommendCateList}`, params)
				.then(async r => {
					console.log('getRecommendCenter---->',r)
					if( r.data.length) {
						this.appCenterList = r.data.map(item=>{
							return {...item,value:item.code}
						})

						this.filterData[2].submenu = [{name:'不限',value:''}, ...this.appCenterList]

						this.recommendCenterList = r.data.slice(0,10)
					}
				})
				.catch(() => {
				});
		},
		// 获取主页数据
		async getIndexList(type) {
			if(type === 'refresh'){
				this.page = 1;
				this.loadingType = 'more';
				this.queryParam = {}
			}
			let params={page:this.page,limit:this.pageSize}
			await this.$http
				.get(`${indexList}`, params)
				.then(async r => {
					uni.setNavigationBarTitle({ title: this.appName });
					if (type === 'refresh') {
						uni.stopPullDownRefresh();
					}
					this.commodityList = r.data
					this.loading = false;
				})
				.catch(() => {
					this.loading = false;
					if (type === 'refresh') {
						uni.stopPullDownRefresh();
					}
				});
		},
		// 首页参数赋值
		initIndexData(data) {
			// uni.setStorageSync('search', this.keyword);
			// this.guessYouLikeProductList = data.guess_you_like;
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

.head-Search-input-box{
	.addr {
		height: 60rpx;
		flex-shrink: 0;
		display: flex;
		align-items: center;
		margin-right: 20rpx;
		.downIcon{
			font-size:36rpx
		}
	}
	.left-region{
		display:flex;
		align-items: center;
		max-width: 220rpx;
		white-space: nowrap;
	}
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
.zd-filter-wrapper{
// .z-filter-dowpdown {
/* 	&.is-fixed{
		top:100upx !important;
		z-index: 9;
		position: fixed;
		left:0;
        right:0;
	} */

}

// 商品栏
.commodity-wrapper{
	// 过滤条件
	.rf-header-screen {
			width: 100%;
			background: $color-white;
			&.is-fixed{
				top:100upx !important;
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
				background: #fff;

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
					font-weight: 500;
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
				font-weight: 700;
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
.z-drawer-box{
		width: 686upx;
		font-size: 24upx;
		overflow: hidden;
		position: relative;
		padding-bottom: 100upx;
	.rf-drawer-title {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 30upx;
		box-sizing: border-box;
		height: 80upx;
	}
	.rf-title-bold {
		font-size: 26upx;
		font-weight: bold;
		flex-shrink: 0;
	}
	.rf-location {
		margin-right: 6upx;
	}
	.rf-attr-right {
		width: 70%;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		text-align: right;
	}
	.rf-all-box {
		width: 90%;
		white-space: nowrap;
		display: flex;
		align-items: center;
		justify-content: flex-end;
	}
	.rf-drawer-content {
		padding: 16upx 30upx 30upx 30upx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		box-sizing: border-box;
	}
	.rf-input {
		border: 0;
		height: 64upx;
		border-radius: 32upx;
		width: 45%;
		background: #f7f7f7;
		text-align: center;
		font-size: $font-base;
		color: #333;
	}
	.rf-phcolor {
		text-align: center;
		color: #b2b2b2;
		font-size: 24upx;
	}
	.rf-flex-attr {
		flex-wrap: wrap;
		justify-content: flex-start;
	}
	.rf-attr-item {
		width: 30%;
		height: 64upx;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0 4upx;
		box-sizing: border-box;
		border-radius: 32upx;
		margin-right: 5%;
		margin-bottom: 5%;
	}
	.rf-attr-ellipsis {
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
		width: 96%;
		text-align: center;
	}
	.rf-attr-item:nth-of-type(3n) {
		margin-right: 0%;
	}
	.rf-attr-btnbox {
		width: 100%;
		position: absolute;
		left: 0;
		bottom: 0;
		box-sizing: border-box;
		padding: 0 30upx;
		background: $color-white;
	}
	.rf-attr-safearea {
		height: 100upx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		/*padding-bottom: env(safe-area-inset-bottom);*/
	}
	.rf-safearea-bottom {
		width: 100%;
		height: env(safe-area-inset-bottom);
	}
	.rf-attr-btnbox::before {
		content: '';
		position: absolute;
		top: 0;
		right: 0;
		left: 0;
		border-top: 1upx solid #eaeef1;
		-webkit-transform: scaleY(0.5);
		transform: scaleY(0.5);
	}
	.rf-drawer-btn {
		width: 47%;
		text-align: center;
		height: 60upx;
		border-radius: 30upx;
		flex-shrink: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		box-sizing: border-box;
	}
	.rf-drawerbtn-black {
		border: 1upx solid;
	}
}

.empty-container{
	.emptyOnly{

	}

}
</style>
