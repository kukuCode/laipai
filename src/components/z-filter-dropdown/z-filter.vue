<template>
	<!-- <view class="z-filter-dowpdown" :class="{'is-fixed': isFixed}"  :style="{'top': isFixed ? menuTop+'rpx':''}"> -->
	<view class="z-filter-dowpdown"  @touchmove.stop.prevent="discard" @tap.stop="discard">
		<view class="nav">
			<block v-for="(item,index) in titleList" :key="index">
				<view class="first-menu" :class="{'on':selectedIndex==index}" @tap="showMenuClick(index, item.type)">
					<text class="name">{{item.title}}</text>
					<text class="iconfont iconxia" v-show="item.type !=='filter'" :class="{'up':statusList[index].isActive}"></text>
				</view>
			</block>
		</view>
        <!-- <view v-show="isFixed" class="mask" :class="{'show':isShowMask,'hide':maskVisibility!=true}" @tap="togglePage(showPage, item.type)"></view> -->

		<block v-for="(page, p_index) in titleList" :key="p_index">

			<view v-if="page.type=='redio'">
				<view class="sub-menu-class" :class="{'issure': false, 'show':selectedIndex == p_index,'hide': statusList[p_index].isActive!=true}">
					<block v-if="page.submenu.length>0">
						<view >
							<scroll-view class="sub-menu-list" :class="[titleList[p_index].length>1?'first':'alone']"
							:scroll-y="true" :scroll-into-view="'first_id'+firstScrollInto">
								<block v-for="(subMenu, index) in page.submenu" :key="index">
									<view class="sub-menu" :id="'first_id'+index" :class="{'on': subMenu.isSelected}" @tap="sortTap(index, page.submenu , page.key)">
										<view class="menu-name">
											<text>{{subMenu.name}}</text>
											<text class="iconfont icongouxuan"></text>
										</view>
									</view>
								</block>
							</scroll-view>
						</view>
						<!-- <view class="filter-content-footer">
							<view class="filter-content-footer-item rf-drawer-btn rf-drawerbtn-black" :class="'text-' + themeColor.name" hover-class="rf-white-hover" :hover-stay-time="150" @tap="resetClick(page.submenu, page.key)">
								重置
							</view>
							<view class="filter-content-footer-item rf-drawer-btn rf-drawerbtn-primary" :class="'bg-' + themeColor.name" hover-class="rf-red-hover" :hover-stay-time="150" @tap="sureClick">
								确定
							</view>
						</view> -->
					</block>
				</view>
			</view>
			<view v-if="page.type=='hierarchy'">
				<view class="sub-menu-class" :class="{'issure': true, 'show':selectedIndex == p_index,'hide': statusList[p_index].isActive!=true}">
					<block v-if="page.submenu.length>0">
						<view >
							<scroll-view class="sub-menu-list" :class="[titleList[p_index].length>1?'first':'alone']"
							:scroll-y="true" :scroll-into-view="'first_id'+firstScrollInto">
								<block v-for="(subMenu,index) in page.submenu" :key="index">
									<view class="sub-menu" :id="'first_id'+index" :class="{'on':subMenu.isSelected}" @tap="itemTap(index, page.submenu , page.key , page.isMutiple)">
										<view class="menu-name">
											<text>{{subMenu.name}}</text>
											<text class="iconfont icongouxuan"></text>
										</view>
									</view>
								</block>
							</scroll-view>
						</view>
						<view class="filter-content-footer">
							<view class="filter-content-footer-item rf-drawer-btn rf-drawerbtn-black" :class="'text-' + themeColor.name" hover-class="rf-white-hover" :hover-stay-time="150" @tap="resetClick(page.submenu, page.key)">
								重置
							</view>
							<view class="filter-content-footer-item rf-drawer-btn rf-drawerbtn-primary" :class="'bg-' + themeColor.name" hover-class="rf-red-hover" :hover-stay-time="150" @tap="sureClick">
								确定
							</view>
						</view>
					</block>
				</view>
			</view>
		</block>

	</view>

</template>

<script>
	// import popupLayer from '@/components/z-filter/popup-layer.vue';
	// import slFilterView from '@/components/z-filter/filter-view.vue';
	export default {
		components: {
			// popupLayer,
			// slFilterView
		},
		props: {
             isFixed: Boolean,
             menuTop:{
				value: Number,
				default: false
			},
			menuList: {
				type: Array,
				default () {
					return []
				}
			},
			color: {
				type: String,
				default () {
					return '#666666'
				}
			},
			independence: {
				type: Boolean,
				default: false
			},
			isTransNav: {
				type: Boolean,
				default: false
			},
			navHeight: {
				type: Number,
				default: 0
			},
			topFixed: {
				type: Boolean,
				default: false
			}
		},

		computed: {
			selectedObj: {
				get() {
					return this.getSelectedObj()
				},
				set(newObj) {
					return newObj;
				}

			}
		},
		data() {
			return {
				down: 'sl-down',
				up: 'sl-up',
				tabHeight: 50,
				statusList: [],
				selectedIndex: -1,
				titleList: [],
                tempTitleObj: {},
                showPage:-1,
                isShowMask:false,
				maskVisibility: false,
				firstScrollInto: 0,//滚动区域定位
				selectDetailList:[],
				selectedKey:'',
				result:{}, // 收集结果
				independenceObj:{},
				selectedTitleObj:{}

			};
        },
        watch: {
            menuList:{
				handler() {
					this.initMenu();
				},
				immediate: true
			},
        },
		methods: {
			getSelectedObj() {
				let obj = {}
				for (let i = 0; i < this.titleList.length; i++) {
					let item = this.titleList[i];
					if (!this.independence && item.defaultSelectedIndex != null && item.defaultSelectedIndex.toString().length > 0) { // 处理并列菜单默认值

						if (item.isMutiple) {
							obj[item.key] = [];
							item.detailList[0].isSelected = false;
							if (!Array.isArray(item.defaultSelectedIndex)) { // 如果默认值不是数组
								item.defaultSelectedIndex = [item.defaultSelectedIndex];
							}
							for (let j = 0; j < item.defaultSelectedIndex.length; j++) { // 将默认选中的值放入selectedObj
								item.detailList[item.defaultSelectedIndex[j]].isSelected = true;
								obj[item.key].push(item.detailList[item.defaultSelectedIndex[j]].value)
							}

						} else {
							obj[item.key] = item.detailList[item.defaultSelectedIndex].value;
							this.selectedTitleObj[item.key] = item.detailList[item.defaultSelectedIndex].title;
							this.defaultSelectedTitleObj[item.key] = item.detailList[item.defaultSelectedIndex].title;
							item.detailList[0].isSelected = false;
							item.detailList[item.defaultSelectedIndex].isSelected = true;
						}
					} else {
						debugger;
						if (item.isMutiple) {
							obj[item.key] = [];
						} else {
							obj[item.key] = '';
						}
					}
				}
				this.result = obj;
				return obj;
			},
			/**
			 * 选中/取消选中
			 */
			selectHierarchyMenu(page_index, level1_index, level2_index, level3_index) {

			},

			/**
			 * 单条
			 */
			sortTap(index, list, key) {
				this.selectOne(index, list, key)
				let obj = {
					'result': this.result,
					'titles': this.selectedTitleObj,
					'isReset': false
				}
				this.$emit("confirm", obj);
			},

			selectOne(index, list, key){
				debugger;
				if (this.independence) {
					this.independenceObj[this.selectedKey] = list[index].value;
					this.result = this.independenceObj;
				} else {
					this.selectedObj[key] = list[index].value;
					this.result = this.selectedObj;
					this.selectedTitleObj[key] = list[index].title || list[index].name;
				}

				for (let i = 0; i < list.length; i++) {
					if (index == i) {
						list[i].isSelected = true;
					} else {
						list[i].isSelected = false;
					}
				}
			},


			itemTap(index, list, key, isMutiple) {
				debugger;
				if(isMutiple){

				} else {
					this.selectOne(index, list, key);
				}

			},
			sureClick() {
				let obj = {
					'result': this.result,
					'titles': this.selectedTitleObj,
					'isReset': false
				}
				// this.$emit("confirm", obj);
				this.emitOk()
			},
            showMenuClick(index, type) {
                debugger;
				this.selectedIndex = index;
				this.selectDetailList = this.statusList[index].submenu;
				this.selectedKey = this.statusList[index].key;

				if (this.statusList[index].isActive == true) {
					// this.$refs.popupRef.close();
					this.selectedIndex = -1;
					this.statusList[index].isActive = false
				} else {
					this.menuTabClick(index);
                    // this.$refs.popupRef.show()
                    this.showPageLayer(index)
                   
                }
                if(type&&type == "filter"){
					this.$emit('menuClick', index)
					return;
				}
            },
            menuTabClick(index){
                for (let i = 0; i < this.statusList.length; i++) {
                    if (index == i) {
                        this.statusList[i].isActive = true;
                    } else {
                        this.statusList[i].isActive = false;
                    }
                }
            },
            showPageLayer(index){

			},
			/**
			 * 初始化菜单
			 */
            initMenu() {

                let arr = []; 
			let titleArr = [];
			let r = {}; // 保存第一级的菜单key + name
			for (let i = 0; i < this.menuList.length; i++) {
				arr.push({
					'isActive': false
                });

                // 收集第一级菜单信息
                let {key, name, type, submenu, isSort=false} = this.menuList[i]
                if(key){
                    r[key] = name
                    titleArr.push({
                        'title': name,
                        'key': key,
                        'type': type,
						'submenu': submenu,
						"isSort":isSort
                    })
                }


			}
			this.statusList = arr;
			this.titleList = titleArr;
			this.tempTitleObj = r;
			},

			resetSelected(list, key, title = '') {
				debugger;
				if (typeof this.result[key] == 'object') {
					this.result[key] = [];
					this.selectedTitleObj[key] = title;
				} else {
					this.result[key] = '';
					this.selectedTitleObj[key] = title;
				}
				for (let i = 0; i < list.length; i++) {
					if (i == 0) {
						list[i].isSelected = true;
					} else {
						list[i].isSelected = false;
					}
				}
				// #ifdef H5
				this.$forceUpdate();
				// #endif
			},

			/**
			 * 重置所有选项
			 */
			resetAllSelect(callback) {
				let titles = [];
				for (let i = 0; i < this.titleList.length; i++) {
					let {key, title, submenu} = this.titleList[i]
					this.resetSelected(submenu, key, title);
					titles[this.titleList[i].key] = this.titleList[i].title;
				}
				let obj = {
					'result': this.result,
					'titles': titles,
					'isReset': true
				}
				// this.$emit("confirm", obj);
				this.emitOk(obj)
				callback(this.result);
			},

			emitOk(obj){
				/* let obj = {
					'result': this.result,
					'titles': this.selectedTitleObj,
					'isReset': false
				} */
				this.$emit("confirm", obj);

			},
			close() {
				for (let i = 0; i < this.statusList.length; i++) {
					this.statusList[i].isActive = false;
				}
			},
			discard() {
			}
		},
	}
</script>

<style lang="scss" scoped>

	.z-filter-dowpdown {
		flex-shrink: 0;
		width: 100%;
		// position: fixed;
        position:relative;
		// position: sticky;

		flex-wrap: nowrap;
		display: flex;
		flex-direction: row;
		top: var(--window-top);

        &.is-fixed {
		    width: 100%;
		    z-index: 9;
		    position: fixed;
		    top: var(--window-top);
		    left:0;
		    right:0;
			.mask {
					display:none;
					&.hide{
						display:none;
					}
					&.show{
						display:flex;
					}
				}
		}

    .mask {
			z-index: 9;
			position: fixed;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			background-color: rgba(0, 0, 0, 0);
			transition: background-color .15s linear;
			display:none;
			&.show {
				background-color: rgba(0, 0, 0, 0.5);
			}
			&.hide {
				display: none;
			}
		}

		// top:100px;
		// overflow-y: hidden;

        .nav {
		width: 100%;
		height: 88rpx;
        display: flex;
		border-bottom: solid 1rpx #eee;
		z-index: 12;
		background-color: #ffffff;
		flex-direction: row;
		.first-menu {
			width: 100%;
			font-size: 28rpx;
			color: #757575;
            display:flex;
			flex-direction: row;
			align-items: center;
			justify-content: center;
			transition: color .2s linear;

			&.on {
				color: #b52e25;

				.iconfont {
					color: #b52e25;
				}
			}
			.name {
				height: 20px;
				text-align: center;
				text-overflow: clip;
				overflow: hidden;
			}
			.iconfont {
				width: 16px;
				height: 20px;
				align-items: center;
				justify-content: center;
				transition: transform .2s linear, color .2s linear;
                &.iconxia{
                    transform:rotate(0deg)
                }
                &.up {
                    transform:rotate(-180deg)
                }
			}
		}
	}

	// 子菜单
	.sub-menu-class {
		width: 100%;
		position: absolute;
		left: 0;

		// transform: translate3d(0, - 100%, 0);
		// max-height: 345px;
		&.issure{
			padding-bottom: 90rpx;
		}
		background-color: #ffffff;
		z-index: 9;
		box-shadow: 0 5px 5px rgba(0, 0, 0, .1);
		overflow: hidden;
		flex-direction: row;
		// transition: transform .15s linear;
		transition: all 0.2s ease-in-out;
		// visibility: hidden;
			opacity: 0;
		top: 88rpx;
		&.hide {
			display: none;
		}

		&.show {
				opacity: 1;
			// visibility: visible;
			// transform: translate3d(0, calc(88rpx + 1rpx), 0);
		}

		// 菜单item
		.sub-menu-list {
			width: 100%;
			height: 300px;
			max-height: 300px;
			overflow: hidden;
			display:flex;
			flex-direction: column;
			.sub-menu {
				min-height: 88rpx;
				font-size: 28rpx;
				display:flex;
				flex-direction: column;
				padding-right: 15px;
				>.menu-name {
					height: 88rpx;
					display:flex;
					flex-direction: row;
					align-items: center;
					justify-content: space-between;
					>.iconfont {
						display: none;
						font-size: 18px;
						color: #b52e25;
					}
				}
			}
			&.first {
				flex-shrink: 0;
				width: 236rpx;
				background-color: #f0f0f0;
				.sub-menu {
					padding-left: 15px;

					&.on {
						background-color: #fff;
					}
				}
			}
			&.alone {
				// max-height: 300px;
				min-height: 120px;
				height: auto;
				.sub-menu {
					min-height: calc(88rpx - 1rpx);
					margin-left: 15px;
					&:not(:last-child){
					border-bottom: solid 1rpx #e5e5e5;
					}

					&.on {
						color: #b52e25;

						>.menu-name {
							>.iconfont {
								display: block;
							}
						}
					}
				}
			}
			&.not-first {
				.sub-menu {
					min-height: calc(88rpx - 1rpx);
					margin-left: 15px;
					border-bottom: solid 1rpx #e5e5e5;
					>.menu-name {
						height: calc(88rpx - 1rpx);
						>.iconfont {
							display: none;
							font-size: 18px;
							color: #b52e25;
						}
					}
					&.on {
						color: #b52e25;
						>.menu-name {
							>.iconfont {
								display: block;
							}
						}
					}
					.more-sub-menu {
						flex-direction: row;
						flex-wrap: wrap;
						padding-bottom: 9px;
						>text {
							height: 60rpx;
							border-radius: 3px;
							background-color: #f5f5f5;
							color: #9b9b9b;
							margin-bottom: 6px;
							margin-right: 6px;
							text-align: center;
							line-height: 60rpx;
							border: solid #f5f5f5 1rpx;
							flex: 0 0 calc(33.33% - 6px);
							overflow: hidden;
							font-size: 12px;
							&:nth-child(3n) {
								margin-right: 0;
							}
							&.on {
								border-color: #f6c8ac;
								color: #b52e25;
							}
							.iconfont {
								color: #9b9b9b;
							}
						}
					}
				}
			}
		}
	}


	}


	.filter-content-footer {
		display: flex;
		justify-content: space-between;
		width: 100%;
		height: 90rpx;
		margin-top: 20rpx;
		position:absolute;
		bottom:0;
		background-color:#fff;
	}

	.filter-content-footer-item {
		width: 50%;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 16px;
	}
	
</style>
