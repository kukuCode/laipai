<template>
	<view class="z-filter-dowpdown" :class="{'setDropdownBottom':maskVisibility,'is-fixed': isFixed}" :style="{'top': isFixed ? menuTop+'rpx':''}" @touchmove.stop.prevent="discard" @tap.stop="discard">
		<view class="nav">
			<block v-for="(item,index) in menu" :key="index">
				<view class="first-menu" :class="{'on':showPage==index}" @tap="choosePage(index, item.type)">
					<text class="name">{{item.name}}</text>
					<text class="iconfont iconxia" v-show="item.type !=='filter'" :style="'transform:rotate('+triangleDeg[index]+'deg);'"></text>
				</view>
			</block>
		</view>
		<view v-show="isFixed" class="mask" :class="{'show':isShowMask,'hide':maskVisibility!=true}" @tap="togglePage(showPage, item.type)"></view>
		<block v-for="(page,page_index) in subData" :key="page_index">
			<view class="sub-menu-class" :class="{'show':showPage==page_index,'hide':pageState[page_index]!=true}">
				<block v-if="page.type=='hierarchy'&& page.submenu.length>0">
					<scroll-view class="sub-menu-list" :class="[activeMenuArr[page_index].length>1?'first':'alone']"
					 :scroll-y="true" :scroll-into-view="'first_id'+firstScrollInto">
						<block v-for="(sub,index) in page.submenu" :key="index">
							<view class="sub-menu" :id="'first_id'+index" :class="{'on':activeMenuArr[page_index][0]==index}" @tap="selectHierarchyMenu(page_index,index,null,null)">
								<view class="menu-name">
									<text>{{sub.name}}</text>
									<text class="iconfont icongouxuan"></text>
								</view>
							</view>
						</block>
					</scroll-view>
					<block v-for="(sub,index) in page.submenu" :key="index">
						<scroll-view class="sub-menu-list not-first" :scroll-y="true" v-if="activeMenuArr[page_index][0]==index&&sub.submenu.length>0"
						 :scroll-into-view="'second_id'+secondScrollInto">
							<block v-for="(sub_second,second_index) in sub.submenu" :key="second_index">
								<view class="sub-menu" :id="'second_id'+second_index" :class="{'on':activeMenuArr[page_index][1]==second_index}">
									<view class="menu-name" @tap="selectHierarchyMenu(page_index,activeMenuArr[page_index][0],second_index,null)">
										<text>{{sub_second.name}}</text>
										<text class="iconfont icongouxuan"></text>
									</view>
									<view class="more-sub-menu" v-if="sub_second.submenu&&sub.submenu.length>0&&sub_second.submenu.length>0">
										<block v-for="(sub2,sub2_index) in sub_second.submenu" :key="sub2_index">
											<text v-if="sub_second.showAllSub || (sub2_index<8)" :class="{'on':activeMenuArr[page_index][1]==second_index&&activeMenuArr[page_index][2]==sub2_index}"
											 @tap="selectHierarchyMenu(page_index,activeMenuArr[page_index][0],second_index,sub2_index)">{{sub2.name}}</text>
											<text v-if="sub_second.showAllSub!=true && sub2_index==8 && sub_second.submenu.length>9" @tap="showMoreSub(second_index)">更多<text
												 class="iconfont iconxia"></text></text>
										</block>
									</view>
								</view>
							</block>
						</scroll-view>
					</block>
				</block>
				<block v-if="page.type=='filter'">
					<view class="filter">
						<scroll-view class="menu-box" :scroll-y="true">
							<view class="box" v-for="(box,box_index) in page.submenu" :key="box_index">
								<view class="title">{{box.name}}</view>
								<view class="labels">
									<view v-for="(label,label_index) in box.submenu" :key="label_index" @tap="selectFilterLabel(page_index,box_index,label_index)"
									 :class="{'on':label.selected}">{{label.name}}</view>
								</view>
							</view>
						</scroll-view>
						<view class="btn-box">
							<view class="reset" @tap="resetFilterData(page_index)">重置</view>
							<view class="submit" @tap="setFilterData(page_index)">确定</view>
						</view>
					</view>
				</block>
				<block v-if="page.type=='radio'">
					<view class="filter">
						<scroll-view class="menu-box" :scroll-y="true">
							<view class="box" v-for="(box,box_index) in page.submenu" :key="box_index">
								<view class="title">{{box.name}}</view>
								<view class="labels">
									<view v-for="(label,label_index) in box.submenu" :key="label_index" @tap="selectRadioLabel(page_index,box_index,label_index)"
									 :class="{'on':label.selected}">{{label.name}}</view>
								</view>
							</view>
						</scroll-view>
						<view class="btn-box">
							<view class="reset" @tap="resetFilterData(page_index)">重置</view>
							<view class="submit" @tap="setFilterData(page_index)">确定</view>
						</view>
					</view>
				</block>
			</view>
		</block>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				subData: [], //菜单数据
				menu: [], //顶部横条数据
				showPage: -1, //菜单页面显示/隐藏动画控制
				pageState: [], //页面的状态
				activeMenuArr: [], //UI状态
				shadowActiveMenuArr: [], //记录选中
				defaultActive:[],
				triangleDeg: [], //小三角形的翻转动画控制
				isShowMask: false, //遮罩层显示/隐藏动画控制
				maskVisibility: false, //遮罩层显示/隐藏状态
				//滚动区域定位
				firstScrollInto: 0,
				secondScrollInto: 0,
				componentTop:0	,//组件top
				isReadNewSelect:false
			}
		},
		props: {
            isFixed: Boolean,
			menuTop:{
				value: Number,
				default: false
			},
			filterData: {
				value: Array,
				default: []
			},
			defaultSelected:{
				value: Array,
				default: []
			},
			updateMenuName:{
				value: Boolean,
				default: true
			},
			dataFormat:{
				value: String,
				default: 'Array'
			}
		},
		watch: {
			filterData: {
				handler() {
					this.initMenu(); //filterData重新赋值初始化菜单
				},
				immediate: true
			},
			defaultSelected(newVal) {

				if(newVal.length==0){
					return;
				}
				this.defaultActive = JSON.parse(JSON.stringify(newVal));
				this.activeMenuArr = JSON.parse(JSON.stringify(newVal));
				this.shadowActiveMenuArr = JSON.parse(JSON.stringify(newVal));
				if(this.updateMenuName){
					this.setMenuName();
				}
			}
		},
		methods: {
			initMenu() {

				let tmpMenuActiveArr=[];
				let tmpMenu=[];
				for (let i = 0; i < this.filterData.length; i++) {
					let tmpitem = this.filterData[i];
					tmpMenu.push({
						//如果没有设置name，则取第一个菜单作为menu.name,filter类型则将"筛选"作为menu.name
						name: tmpitem.name || (tmpitem.type == "filter" ? "筛选" : tmpitem.submenu[0].name),
						type: tmpitem.type
					});
					//初始化选中项数组-ui状态
					tmpMenuActiveArr.push(this.processActive(tmpitem));
					//初始化角度数组
					this.triangleDeg.push(0);
					//初始化控制显示状态数组
					this.pageState.push(false);
					//递归处理子菜单数据
					tmpitem = this.processSubMenu(tmpitem);
					this.filterData[i] = tmpitem;
				}
				this.menu = tmpMenu;
				//初始化选中项数组
				tmpMenuActiveArr = this.defaultActive.length>0?this.defaultActive:this.activeMenuArr.length>0?this.activeMenuArr:tmpMenuActiveArr;
				this.defaultActive = [];
				this.activeMenuArr = JSON.parse(JSON.stringify(tmpMenuActiveArr));
				this.shadowActiveMenuArr = JSON.parse(JSON.stringify(tmpMenuActiveArr));
				//加载菜单数据
				this.subData = this.filterData;
				//设定顶部菜单名字
				if(this.updateMenuName){
					this.setMenuName();
				}
			},
			setMenuName(){
				for(var i=0;i<this.activeMenuArr.length;i++){
					let row = this.activeMenuArr[i];
					if(this.subData[i].type=='hierarchy'){
						if (typeof(row[0]) == 'number'){
							let tmpsub = this.subData[i].submenu[row[0]];
							if(row.length>1){
								tmpsub = tmpsub.submenu[row[1]];
								if(row.length>2){
									tmpsub = tmpsub.submenu[row[2]];
								}
							}
							this.menu[i].name = tmpsub.name;
						}else{
							this.menu[i].name = this.subData[i].name;
						}
					}
				}
			},
			//展开更多
			showMoreSub(index) {
				this.subData[this.showPage].submenu[this.activeMenuArr[this.showPage][0]].submenu[index].showAllSub = true;
				this.$forceUpdate();
			},
			//选中
			selectHierarchyMenu(page_index, level1_index, level2_index, level3_index) {
				debugger;
				//读取记录
				if (level1_index != null && level2_index == null && level3_index == null && this.shadowActiveMenuArr[page_index][0] ==
					level1_index) {
					this.activeMenuArr.splice(page_index, 1, JSON.parse(JSON.stringify(this.shadowActiveMenuArr[page_index])));
				} else {
					this.activeMenuArr[page_index].splice(0, 1, level1_index);
					(level2_index!=null||this.activeMenuArr[page_index].length>=2)&&this.activeMenuArr[page_index].splice(1, 1, level2_index) || this.activeMenuArr[page_index].splice(1, 1);
					(level3_index!=null||this.activeMenuArr[page_index].length>=3)&&this.activeMenuArr[page_index].splice(2, 1, level3_index) || this.activeMenuArr[page_index].splice(2, 1);
				}
				//写入结果
				if (level3_index != null || level2_index != null || (level1_index != null && this.subData[page_index].submenu[level1_index].submenu.length == 0)
				) {
					let sub = this.subData[page_index].submenu[level1_index].submenu[level2_index];
					if(this.updateMenuName){
						this.menu[page_index].name = (level3_index != null && sub.submenu[level3_index].name) || (level2_index != null && sub.name) || this.subData[page_index].submenu[level1_index].name;
					}
					this.shadowActiveMenuArr[page_index] = JSON.parse(JSON.stringify(this.activeMenuArr[page_index]));
					this.togglePage(this.showPage);
				}
			},
			//写入结果，筛选
			setFilterData(page_index) {
				this.shadowActiveMenuArr[page_index] = JSON.parse(JSON.stringify(this.activeMenuArr[page_index]));
				this.togglePage(this.showPage);
			},
			//重置结果和ui，筛选
			resetFilterData(page_index) {
				let tmpArr = [];
				let level = this.shadowActiveMenuArr[page_index].length;
				while (level > 0) {
					tmpArr.push([]);
					let box = this.subData[page_index].submenu[level - 1].submenu;
					for (let i = 0; i < box.length; i++) {
						this.subData[page_index].submenu[level - 1].submenu[i].selected = false;
					}
					level--;
				}
				this.activeMenuArr[page_index] = JSON.parse(JSON.stringify(tmpArr));
				this.$forceUpdate();
			},
			//选中筛选类label-UI状态
			selectFilterLabel(page_index, box_index, label_index) {
				let find_index = this.activeMenuArr[page_index][box_index].indexOf(label_index);
				if (find_index > -1) {
					this.activeMenuArr[page_index][box_index].splice(find_index, 1);
					this.subData[page_index].submenu[box_index].submenu[label_index].selected = false;
				} else {
					this.activeMenuArr[page_index][box_index].push(label_index);
					this.subData[page_index].submenu[box_index].submenu[label_index].selected = true;
				}
				this.$forceUpdate();
			},
			//选中单选类label-UI状态
			selectRadioLabel(page_index, box_index, label_index) {
				debugger;
				let activeIndex = this.activeMenuArr[page_index][box_index][0];
				if(activeIndex == label_index){
					this.subData[page_index].submenu[box_index].submenu[activeIndex].selected = false;
					this.activeMenuArr[page_index][box_index][0] = null;
				}else{
					if(activeIndex!=null && activeIndex<this.subData[page_index].submenu[box_index].submenu.length){
						this.subData[page_index].submenu[box_index].submenu[activeIndex].selected = false;
					}

					this.subData[page_index].submenu[box_index].submenu[label_index].selected = true;
					this.activeMenuArr[page_index][box_index][0] = label_index;
				}
				this.$forceUpdate();
			},
			choosePage(index, type) {
				/* if (index == this.showPage) {
					this.hidePageLayer(false);
					this.hideMask();
					return;
				} else {
					this.showPage = -1;
				} */

				if(type&&type == "filter"){
					this.$emit('menuClick', index)
					return;
				}
				if (index == this.showPage) {
					this.hidePageLayer(false);
					this.hideMask();
					this.showPage = -1;
				} else {
					if (this.showPage > -1) {
						this.hidePageLayer(false);
					}
					this.showPageLayer(index);
					this.showMask();
				}
			},
			//菜单开关
			togglePage(index,type) {
				debugger;
				if(type&&type == "filter"){
					this.$emit('menuClick', index)
					return;
				}
				if (index == this.showPage) {
					this.hidePageLayer(true);
					this.hideMask();
					this.showPage = -1;
				} else {
					if (this.showPage > -1) {
						this.hidePageLayer(false);
					}
					this.showPageLayer(index);
					this.showMask();
				}
			},
			//hide遮罩层
			hideMask() {
				this.isShowMask = false;
				setTimeout(() => {
					this.maskVisibility = false;
				}, 200);
			},
			//show遮罩层
			showMask() {
				this.maskVisibility = true;
				this.$nextTick(() => {
					setTimeout(() => {
						this.isShowMask = true;
					}, 0);
				})
			},
			//hide菜单页
			hidePageLayer(isAnimation) {
				this.triangleDeg[this.showPage] = 0;
				let tmpIndex = this.showPage;
				if (isAnimation) {
					setTimeout(() => {
						this.pageState.splice(tmpIndex, 1, false);
					}, 200);
					this.confirm();
				} else {
					this.pageState.splice(tmpIndex, 1, false)
				}
				this.firstScrollInto = null;
				this.secondScrollInto = null;
			},
			confirm() {
				let index = JSON.parse(JSON.stringify(this.shadowActiveMenuArr));
				let value = JSON.parse(JSON.stringify(this.shadowActiveMenuArr));

				//对结果做一下处理
				index.forEach((item, i) => {
					if (typeof(item[0]) == 'object') {
						//针对筛选结果过一个排序
						item.forEach((s, j) => {
							if(s!=null){
								s.sort((val1, val2) => {
									return val1 - val2;
								});
								item[j] = s;
								s.forEach((v, k) => {
									value[i][j][k] = (v==null||v>=this.subData[i].submenu[j].submenu.length)?null:this.subData[i].submenu[j].submenu[v].value;
									if(this.subData[i].type == 'radio' && value[i][j][k] == null){
										value[i][j] = [];
										index[i][j] = [];
									}
								});
							}
						});
					}else{
						let submenu = this.subData[i].submenu[item[0]];
						if(submenu){
						value[i][0] = submenu && submenu.value;
						if(value[i].length>=2  && item[1]!=null){
							if(submenu.submenu.length>0){
								submenu = submenu.submenu[item[1]];
								value[i][1] = submenu.hasOwnProperty('value')?submenu.value:null;
							}else{
								value[i][1] = null
							}
							if(value[i].length>=3 && item[2]!=null){
								if(submenu.submenu.length>0){
									submenu = submenu.submenu[item[2]];
									value[i][2] = submenu.hasOwnProperty('value')?submenu.value:null;
								}else{
									value[i][2] = null;
								}
							}
						}

						}
					}
					index[i] = item;

				});
				// 输出
				this.$emit('confirm', {
					index: index,
					value: value
				});
			},
			//show菜单页
			showPageLayer(index) {
				this.processPage(index);
				this.pageState.splice(index, 1, true);
				this.$nextTick(() => {
					setTimeout(() => {
						this.showPage = index;
					}, 0);
				})
				this.triangleDeg[index] = -180;
			},
			reloadActiveMenuArr(){
				for (let i = 0; i < this.filterData.length; i++) {
					let tmpitem = this.filterData[i];
					let tmpArr = this.processActive(tmpitem);
					tmpitem = this.processSubMenu(tmpitem);
					if(this.activeMenuArr[i].length!=tmpArr.length){
						this.filterData[i] = tmpitem;
						this.activeMenuArr.splice(i, 1, JSON.parse(JSON.stringify(tmpArr)));
						this.shadowActiveMenuArr.splice(i, 1, JSON.parse(JSON.stringify(tmpArr)));
					}
				}
				this.subData = this.filterData;
				this.$forceUpdate();
			},
			processPage(index) {
				//check UI控制数组，结果数组,防止传入数据层级和UI控制数组不同步
				this.reloadActiveMenuArr();
				//重置UI控制数组
				this.activeMenuArr.splice(index, 1, JSON.parse(JSON.stringify(this.shadowActiveMenuArr[index])));
				if (this.menu[index].type == 'filter') {
					//重载筛选页选中状态
					let level = this.shadowActiveMenuArr[index].length;
					for (let i = 0; i < level; i++) {
						let box = this.subData[index].submenu[i].submenu;
						for (let j = 0; j < box.length; j++) {
							if (this.shadowActiveMenuArr[index][i].indexOf(j) > -1) {
								this.subData[index].submenu[i].submenu[j].selected = true;
							} else {
								this.subData[index].submenu[i].submenu[j].selected = false;
							}
						}
					}
				} else if (this.menu[index].type == 'hierarchy') {
					this.$nextTick(() => {
						setTimeout(() => {
							//滚动到选中项
							debugger;
							this.firstScrollInto = parseInt(this.activeMenuArr[index][0]);
							this.secondScrollInto = parseInt(this.activeMenuArr[index][1]);
						}, 0);
					})
				} else if (this.menu[index].type == 'radio') {
					//重载筛选页选中状态
					let level = this.shadowActiveMenuArr[index].length;
					for (let i = 0; i < level; i++) {
						let box = this.subData[index].submenu[i].submenu;
						for (let j = 0; j < box.length; j++) {
							if (this.shadowActiveMenuArr[index][i].indexOf(j) > -1) {
								this.subData[index].submenu[i].submenu[j].selected = true;
							} else {
								this.subData[index].submenu[i].submenu[j].selected = false;
							}
						}
					}
				}
			},
			processActive(tmpitem) {
				let tmpArr = []
				if (tmpitem.type == 'hierarchy'&&tmpitem.hasOwnProperty('submenu')&&tmpitem.submenu.length>0) {
					let level = this.getMaxFloor(tmpitem.submenu);
					while (level > 0) {
						tmpArr.push(null);
						level--;
					}
				} else if (tmpitem.type == 'filter') {
					let level = tmpitem.hasOwnProperty('submenu') && tmpitem.submenu.length;
					while (level > 0) {
						tmpArr.push([]);
						level--;
					}
				} else if (tmpitem.type == 'radio') {
					let level = tmpitem.submenu.length;
					while (level > 0) {
						tmpArr.push([]);
						level--;
					}
				}
				return tmpArr;
			},
			processSubMenu(menu) {
				if (menu.hasOwnProperty('submenu') && menu.submenu.length > 0) {
					for (let i = 0; i < menu.submenu.length; i++) {
						menu.submenu[i] = this.processSubMenu(menu.submenu[i]);
					}
				} else {
					menu.submenu = [];
				}
				return menu;
			},
			//计算菜单层级
			getMaxFloor(treeData) {
				let floor = 0
				let max = 0
				function each(data, floor) {
					data.forEach(e => {
						max = floor > max ? floor : max;
						if (e.hasOwnProperty('submenu') && e.submenu.length > 0) {
							each(e.submenu, floor + 1)
						}
					})
				}
				each(treeData, 1)
				return max;
			},
			discard() {

			}
		}
	}
</script>
<style lang="scss">
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

		// top:100px;
		// overflow-y: hidden;
		&.setDropdownBottom{
			// height: 345px;
			bottom: 0;
		}
		view {
			display: flex;
			flex-wrap: nowrap;
		}
	}
	.region {
		flex: 1;
		height: 88rpx;
	}
	.nav {
		width: 100%;
		height: 88rpx;
		border-bottom: solid 1rpx #eee;
		z-index: 12;
		background-color: #ffffff;
		flex-direction: row;
		.first-menu {
			width: 100%;
			font-size: 28rpx;
			color: #757575;
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
			}
		}
	}
	.sub-menu-class {
		width: 100%;
		position: absolute;
		left: 0;


		// transform: translate3d(0, - 100%, 0);
		max-height: 345px;
		background-color: #ffffff;
		z-index: 11;
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
	}
	.sub-menu-list {
		width: 100%;
		height: 345px;
		flex-direction: column;
		.sub-menu {
			min-height: 88rpx;
			font-size: 28rpx;
			flex-direction: column;
			padding-right: 15px;
			>.menu-name {
				height: 88rpx;
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
			max-height: 345px;
			min-height: 170px;
			height: auto;
			.sub-menu {
				min-height: calc(88rpx - 1rpx);
				margin-left: 15px;
				border-bottom: solid 1rpx #e5e5e5;

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
	.filter {
		width: 100%;
		height: 345px;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;
		.menu-box {
			width: 698rpx;
			height: calc(345px - 75px);
			flex-shrink: 1;
			.box {
				width: 100%;
				margin-top: 16px;
				flex-direction: column;
				.title {
					width: 100%;
					font-size: 28rpx;
					color: #888;
				}
				.labels {
					flex-direction: row;
					flex-wrap: wrap;
					.on {
						border-color: #b52e25;
						background-color: #b52e25;
						color: #fff;
					}
					>view {
						width: 148rpx;
						height: 60rpx;
						border: solid 1rpx #adadad;
						border-radius: 60rpx;
						margin-right: 15px;
						margin-top: 8px;
						font-size: 12px;
						flex-direction: row;
						justify-content: center;
						align-items: center;
						&:nth-child(4n) {
							margin-right: 0;
						}
					}
				}
			}
		}
		.btn-box {
			flex-shrink: 0;
			width: 698rpx;
			height: 75px;
			flex-direction: row !important;
			align-items: center;
			justify-content: space-between;
			>view {
				width: 320rpx;
				height: 40px;
				border-radius: 40px;
				border: solid 1rpx #b52e25;
				align-items: center;
				justify-content: center;
			}
			.reset {
				color: #b52e25;
			}
			.submit {
				color: #fff;
				background-color: #b52e25;
			}
		}
	}
	.z-filter-dowpdown {
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
			z-index: 8;
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
	}



</style>
