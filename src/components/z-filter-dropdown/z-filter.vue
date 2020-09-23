<template>
	<!-- <view class="z-filter-dowpdown" :class="{'is-fixed': isFixed}"  :style="{'top': isFixed ? menuTop+'rpx':''}"> -->
	<view class="z-filter-dowpdown">
		<view class="nav">
			<block v-for="(item,index) in titleList" :key="index">
				<view class="first-menu" :class="{'on':selectedIndex==index}" @tap="showMenuClick(index, item.type)">
					<text class="name">{{item.title}}</text>
					<text class="iconfont iconxia" v-show="item.type !=='filter'" :class="{'up':statusList[index].isActive}"></text>
				</view>
			</block>
		</view>
        <!-- <view v-show="isFixed" class="mask" :class="{'show':isShowMask,'hide':maskVisibility!=true}" @tap="togglePage(showPage, item.type)"></view> -->

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
			itemWidth() {
				return 'calc(100%/2)'
			},
			/* menuListTemp: {
				get() {
					return this.getMenuListTemp();
				},
				set(newObj) {
					return newObj;
				}
			} */
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
            showMenuClick(index, type) {
                debugger;
				this.selectedIndex = index;
				if (this.statusList[index].isActive == true) {
					// this.$refs.popupRef.close();
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
            initMenu() {

                let arr = []; 
			let titleArr = [];
			let r = {}; // 保存第一级的菜单key + name
			for (let i = 0; i < this.menuList.length; i++) {
				arr.push({
					'isActive': false
                });

                // 收集第一级菜单信息
                let {key, name, type, submenu} = this.menuList[i]
                if(key){
                    r[key] = name
                    titleArr.push({
                        'title': name,
                        'key': key,
                        'type': type,
                        'submenu': submenu
                    })
                }


			}
			this.statusList = arr;
			this.titleList = titleArr;
			this.tempTitleObj = r;
			},
			
			close() {
				for (let i = 0; i < this.statusList.length; i++) {
					this.statusList[i].isActive = false;
				}
			}
		}
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
	}

	
</style>
