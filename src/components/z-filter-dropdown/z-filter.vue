<template>
  <!-- <view class="z-filter-dowpdown" :class="{'is-fixed': isFixed}"  :style="{'top': isFixed ? menuTop+'rpx':''}"> -->
  <view
    class="z-filter-dowpdown"
    @touchmove.stop.prevent="discard"
    @tap.stop="discard"
  >
    <view class="nav">
      <block v-for="(item, index) in titleList" :key="index">
        <view
          class="first-menu"
          :class="{ on: selectedIndex == index }"
          @tap="showMenuClick(index, item.type, item.key)"
        >
          <text class="name">{{ item.title }}</text>
          <text
            class="iconfont iconxia"
            v-show="item.type !== 'filter'"
            :class="{ up: statusList[index].isActive }"
          ></text>
        </view>
      </block>
    </view>

    <view
      v-if="isFixed"
      :style="{ top: isFixed ? menuTop + 'rpx' : '' }"
      class="mask"
      :class="{ show: isShowMask, hide: maskVisibility != true }"
      @tap="maskClick()"
    ></view>
    <!-- <view :style="{'top':  menuTop+'rpx'}" class="mask" :class="{'show':isShowMask,'hide':maskVisibility!=true}" @tap="togglePage(showPage, item.type)"></view> -->

    <block v-for="(page, p_index) in menuListTemp" :key="p_index">
      <view v-if="page.type == 'radio'">
        <view
          class="sub-menu-class"
          :class="{
            issure: false,
            show: selectedIndex == p_index,
            hide: statusList[p_index].isActive != true,
          }"
        >
          <block v-if="page.submenu.length > 0">
            <view>
              <scroll-view
                class="sub-menu-list alone"
                :scroll-y="true"
                :scroll-into-view="'first_id' + firstScrollInto"
              >
                <block v-for="(subMenu, index) in page.submenu" :key="index">
                  <view
                    class="sub-menu"
                    :id="'first_id' + index"
                    :class="{ on: subMenu.isSelected }"
                    @tap="sortTap(index, page.submenu, page.key)"
                  >
                    <view class="menu-name">
                      <text>{{ subMenu.name }}</text>
                      <text class="iconfont icongouxuan"></text>
                    </view>
                  </view>
                </block>
              </scroll-view>
            </view>
          </block>
        </view>
      </view>
      <view v-if="page.type == 'hierarchy'">
        <view
          class="sub-menu-class"
          :class="{
            issure: true,
            show: selectedIndex == p_index,
            hide: statusList[p_index].isActive != true,
          }"
        >
          <block v-if="page.submenu.length > 0">
            <view>
              <scroll-view
                class="sub-menu-list alone"
                :scroll-y="true"
                :scroll-into-view="'first_id' + firstScrollInto"
              >
                <block v-for="(subMenu, index) in page.submenu" :key="index">
                  <view
                    class="sub-menu"
                    :id="'first_id' + index"
                    :class="{ on: subMenu.isSelected }"
                    @tap="
                      itemTap(
                        index,
                        page.submenu,
                        page.key,
                        page.isMutiple,
                        p_index
                      )
                    "
                  >
                    <view class="menu-name">
                      <text>{{ subMenu.name }}</text>
                      <text class="iconfont icongouxuan"></text>
                    </view>
                  </view>
                </block>
              </scroll-view>
            </view>
            <view class="filter-content-footer">
              <view
                class="filter-content-footer-item rf-drawer-btn rf-drawerbtn-black"
                :class="'text-' + themeColor.name"
                hover-class="rf-white-hover"
                :hover-stay-time="150"
                @tap="resetClick(page.submenu, page.key)"
              >
                重置
              </view>
              <view
                class="filter-content-footer-item rf-drawer-btn rf-drawerbtn-primary"
                :class="'bg-' + themeColor.name"
                hover-class="rf-red-hover"
                :hover-stay-time="150"
                @tap="sureClick(p_index, page.key)"
              >
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
export default {
  components: {},
  props: {
    isFixed: Boolean,
    menuTop: {
      value: Number,
      default: false,
    },
    menuList: {
      type: Array,
      default() {
        return [];
      },
    },
    independence: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    menuListTemp: {
      get() {
        return this.getMenuListTemp();
      },
      set(newObj) {
        return newObj;
      },
    },
    selectedObj: {
      get() {
        return this.getSelectedObj();
      },
      set(newObj) {
        return newObj;
      },
    },
  },
  data() {
    return {
      tabHeight: 50,
      statusList: [], // 记录菜单选中状态
      selectedIndex: -1, // 当前选中的菜单索引
      titleList: [], // 一级菜单列表
      tempTitleObj: {}, // 临时保存菜单显示的title
      showPage: -1, //
      isShowMask: false,
      maskVisibility: false,
      firstScrollInto: 0, //滚动区域定位
      selectDetailList: [],
      selectedKey: '',
      result: {}, // 收集结果
      independenceObj: {},
      selectedTitleObj: {},
      activeMenuArr: [],
      historyMap: {},
      historyMapTemp: {},
      activeListIndex: {},
    };
  },
  watch: {
    menuList: {
      handler() {
        this.initMenu();
      },
      immediate: true,
    },
  },
  methods: {
    getMenuListTemp() {
      let arr = this.menuList;
      for (let i = 0; i < arr.length; i++) {
        let item = arr[i];
        for (let j = 0; j < item.submenu.length; j++) {
          let d_item = item.submenu[j];
          if (j == 0) {
            d_item.isSelected = true;
          } else {
            d_item.isSelected = false;
          }
        }
      }
      return arr;
    },
    getSelectedObj() {
      let obj = {};
      for (let i = 0; i < this.titleList.length; i++) {
        let item = this.titleList[i];
        if (
          !this.independence &&
          item.defaultSelectedIndex != null &&
          item.defaultSelectedIndex.toString().length > 0
        ) {
          if (item.isMutiple) {
            obj[item.key] = [];
            item.submenu[0].isSelected = false;
            if (!Array.isArray(item.defaultSelectedIndex)) {
              // 如果默认值不是数组
              item.defaultSelectedIndex = [item.defaultSelectedIndex];
            }
            for (let j = 0; j < item.defaultSelectedIndex.length; j++) {
              // 将默认选中的值放入selectedObj
              item.submenu[item.defaultSelectedIndex[j]].isSelected = true;
              obj[item.key].push(
                item.submenu[item.defaultSelectedIndex[j]].value
              );
            }
          } else {
            obj[item.key] = item.submenu[item.defaultSelectedIndex].value;
            this.selectedTitleObj[item.key] =
              item.submenu[item.defaultSelectedIndex].title;
            this.defaultSelectedTitleObj[item.key] =
              item.submenu[item.defaultSelectedIndex].title;
            item.submenu[0].isSelected = false;
            item.submenu[item.defaultSelectedIndex].isSelected = true;
          }
        } else {
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
     * 设置值--》提供外部使用，修改菜单的选中
     */
    setValueByCode(obj) {
      for (let _key in obj) {
        if (
          !Array.isArray(this.tempTitleObj[_key]) &&
          this.tempTitleObj.hasOwnProperty(_key)
        ) {
          for (let i = 0; i < this.menuListTemp.length; i++) {
            let { key, submenu, isMutiple = false } = this.menuListTemp[i];
            if (key == _key && Array.isArray(submenu)) {
              let selIndex = submenu.findIndex((m) => m.value == obj[_key]);
              if (selIndex > -1) {
                this.selectedIndex = i;
                this.selectDetailList = this.menuListTemp[i].submenu;
                this.selectedKey = this.menuListTemp[i].key;

                this.historyMap[key] = submenu[selIndex].value || '';
                this.historyMapTemp[key] = {
                  value: submenu[selIndex].value || '',
                  title: submenu[selIndex].name,
                };
                this.selectOne(selIndex, submenu, key, isMutiple);
              }
            }
          }
        }
      }
      this.updateSelectedTitle();
      this.close();
      this.hideMask();
    },

    filterResult(obj) {
      let val = obj.result;
      let titlesObj = obj.titles;
      // 处理选项映射到菜单title
      if (this.independence) {
        if (
          !this.menuListTemp[this.selectedIndex].isMutiple ||
          this.menuListTemp[this.selectedIndex].isSort
        ) {
          let tempTitle = '';
          for (
            let i = 0;
            i < this.menuListTemp[this.selectedIndex].submenu.length;
            i++
          ) {
            let item = this.menuListTemp[this.selectedIndex].submenu[i];
            if (item.value == val[this.menuListTemp[this.selectedIndex].key]) {
              tempTitle = item.title;
            }
          }
          // if (this.menuListTemp[this.selectedIndex].reflexTitle) {
          this.titleList[this.selectedIndex].title = tempTitle;
          // }
        }
      } else {
        for (let key in titlesObj) {
          if (!Array.isArray(titlesObj[key])) {
            this.tempTitleObj[key] = titlesObj[key];
          }
        }
        for (let key in this.tempTitleObj) {
          for (let i = 0; i < this.titleList.length; i++) {
            if (this.titleList[i].key == key) {
              this.titleList[i].title = this.tempTitleObj[key];
            }
          }
        }
      }

      if (obj.isReset) {
      } else {
        this.$emit('result', val);
      }
    },

    /**
     * 单条
     */
    sortTap(index, list, key) {
      this.selectOne(index, list, key);
      let obj = {
        result: this.result,
        titles: this.selectedTitleObj,
        isReset: false,
      };

      // this.$emit("confirm", obj);
      this.filterResult(obj);
      this.close();
      this.hideMask();
    },

    selectOne(index, list, key) {
      // 是否单独返回结果
      if (this.independence) {
        this.independenceObj[this.selectedKey] = list[index].value;
        this.result = this.independenceObj;
      } else {
        this.historyMapTemp[key] = {
          value: list[index].value,
          title: list[index].title || list[index].name,
        };

        this.selectedObj[key] = list[index].value;
        this.result = this.selectedObj;
        this.selectedTitleObj[key] = list[index].title || list[index].name;
        this.activeListIndex[key] = index;
      }

      for (let i = 0; i < list.length; i++) {
        if (index == i) {
          list[i].isSelected = true;
        } else {
          list[i].isSelected = false;
        }
      }

      // #ifdef H5
      this.$forceUpdate();
      // #endif
    },

    itemTap(index, list, key, isMutiple, rootIndex) {
      if (isMutiple) {
      } else {
        this.selectOne(index, list, key);

        if (rootIndex != null) {
          // this.activeMenuArr[rootIndex][index][0] = index;
          this.selectRadioLabel(rootIndex, index, index);
        }
      }
    },

    //选中单选类label-UI状态
    selectRadioLabel(page_index, box_index, label_index) {
      if (page_index != null) {
        // if(page_index != null && box_index == null && label_index == null){
        // this.activeMenuArr[page_index][box_index][0] = label_index;
        this.activeMenuArr.splice(page_index, 1, label_index);
      }
      this.$forceUpdate();
    },
    resetClick(list, key) {
      this.resetSelected(list, key);
    },

    updateSelectedTitle() {
      for (let key in this.selectedTitleObj) {
        for (let i = 0; i < this.titleList.length; i++) {
          if (this.titleList[i].key == key) {
            this.titleList[i].title = this.selectedTitleObj[key];
          }
        }
      }
    },

    sureClick(index, key) {
      this.updateSelectedTitle();
      let obj = {
        result: this.result,
        titles: this.selectedTitleObj,
        isReset: false,
      };
      // this.processPage(index, key);
      // this.activeListIndex[key] = index;
      this.$emit('result', obj.result);
      this.close();
      this.hideMask();
    },

    maskClick(type, key) {
      this.close();
      this.hideMask();
      // if(type==='hierarchy'){

      if (
        this.historyMapTemp[this.selectedKey] &&
        this.historyMap[this.selectedKey] !==
          this.historyMapTemp[this.selectedKey].value
      ) {
        this.cancelSelected(
          this.selectDetailList,
          this.selectedKey,
          this.historyMap[this.selectedKey]
        );
      }
      // }
    },

    showMenuClick(index, type, key) {
      this.selectedIndex = index;
      this.selectDetailList = this.menuListTemp[index].submenu;
      this.selectedKey = this.menuListTemp[index].key;

      // 1、隐藏
      if (this.statusList[index].isActive == true) {
        // this.$refs.popupRef.close();
        // this.selectedIndex = -1;
        this.statusList[index].isActive = false;
        this.hideMask();
        if (type === 'hierarchy') {
          this.firstScrollInto = 0;
          if (
            this.historyMapTemp[key] &&
            this.historyMap[key] !== this.historyMapTemp[key].value
          ) {
            this.cancelSelected(
              this.selectDetailList,
              key,
              this.historyMap[key]
            );
          }
        }
      } else {
        ///2、显示
        if (type === 'hierarchy') {
          // this.activeMenuArr[index]
          this.historyMap[key] = this.result[key] || '';
        }
        this.menuTabClick(index);
        // this.$refs.popupRef.show()
        this.showPageLayer(index, key);
        this.showMask();
      }
      if (type && type == 'filter') {
        this.$emit('menuClick', index);
        return;
      }
    },
    menuTabClick(index) {
      for (let i = 0; i < this.statusList.length; i++) {
        if (index == i) {
          this.statusList[i].isActive = true;
        } else {
          this.statusList[i].isActive = false;
        }
      }
    },
    showPageLayer(index, key) {
      this.processPage(index, key);
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
      });
    },

    /**
     * 初始化菜单
     */
    initMenu() {
      let arr = [];
      let titleArr = [];
      // let tmpMenuActiveArr=[];
      let activeIndex = {};
      let r = {}; // 保存第一级的菜单key + name
      for (let i = 0; i < this.menuList.length; i++) {
        const _item = this.menuList[i];
        activeIndex[_item.key] = '';

        arr.push({
          isActive: false,
        });

        // 收集第一级菜单信息
        let { key, name, type, submenu, isSort = false } = this.menuList[i];
        if (key) {
          r[key] = name;
          /* if(Array.isArray(submenu) && submenu.length){
						submenu.forEach(item=>{
							item.isSelected = false
						})
					} */
          titleArr.push({
            title: name,
            key: key,
            type: type,
            // 'submenu': submenu,
            isSort: isSort,
          });
        }
      }
      this.activeListIndex = activeIndex;
      // this.activeMenuArr =  tmpMenuActiveArr;

      this.statusList = arr;
      this.titleList = titleArr;
      this.tempTitleObj = r;
    },
    cancelSelected(list, key, code) {
      if (!code) {
        this.resetSelected(list, key);
        return;
      } else {
        for (let i = 0; i < list.length; i++) {
          const item = list[i];
          if (item.value === code) {
            this.selectedObj[key] = item.value;
            this.selectedTitleObj[key] = item.name;
            this.result = this.selectedObj;
            this.activeListIndex[key] = i;
          } else {
            item.isSelected = false;
          }
        }
      }

      // #ifdef H5
      this.$forceUpdate();
      // #endif
    },
    resetSelected(list, key) {
      // selectedTitleObj
      // if(this.selectedIndex != -1) {

      let title = ''; //this.menuListTemp[this.selectedIndex]['name']

      for (let i = 0; i < this.menuListTemp.length; i++) {
        if (this.menuListTemp[i].key == key) {
          title = this.menuListTemp[i].name;
          this.activeMenuArr.splice(i, 1, 0);
          break;
        }
      }

      for (let i = 0; i < list.length; i++) {
        if (!list[i].value) {
          list[i].isSelected = true;
          this.activeListIndex[key] = i;
        } else {
          list[i].isSelected = false;
        }
        // if (i == 0) {
        // 	list[i].isSelected = true;
        // } else {
        // }
      }

      if (typeof this.result[key] == 'object') {
        this.result[key] = [];
        this.selectedTitleObj[key] = title;
      } else {
        this.result[key] = '';
        this.selectedTitleObj[key] = title;
      }

      // this.sureClick()
      // }

      /* if (typeof this.result[key] == 'object') {
					this.result[key] = [];
					this.selectedTitleObj[key] = title;
				} else {
					this.result[key] = '';
					this.selectedTitleObj[key] = title;
				} */
      /* for (let i = 0; i < list.length; i++) {
					if (i == 0) {
						list[i].isSelected = true;
					} else {
						list[i].isSelected = false;
					}
				} */
      // #ifdef H5
      this.$forceUpdate();
      // #endif
    },
    resetSelected2(list, key, title = '') {
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
      let obj = {};
      if (this.selectedIndex != -1) {
        let titles = [];
        for (let i = 0; i < this.menuListTemp.length; i++) {
          let { key, title, submenu } = this.menuListTemp[i];
          if (Array.isArray(submenu) && submenu.length) {
            this.resetSelected(submenu, key);
            titles[this.menuListTemp[i].key] = this.menuListTemp[i].title;
          }
        }
        let obj = {
          result: this.result,
          titles: titles,
          isReset: true,
        };
      }
      this.selectedIndex = -1;
      this.updateSelectedTitle();
      // this.$emit("confirm", obj);
      this.emitConfirm(obj);
      callback(this.result);
    },
    /**
     * confirm 事件
     */
    emitConfirm(obj) {
      this.$emit('confirm', obj);
    },
    /**
     * 将已选择的显示到可视范围内
     */
    processPage(index, key) {
      this.firstScrollInto = -1;
      // if(this.menuListTemp[index].type == 'hierarchy') {
      this.$nextTick(() => {
        setTimeout(() => {
          //滚动到选中项
          // this.firstScrollInto = parseInt(this.activeMenuArr[index]);
          this.firstScrollInto = parseInt(this.activeListIndex[key] || 0);
        }, 10);
      });

      // }
    },
    close() {
      // this.selectedIndex = -1
      for (let i = 0; i < this.statusList.length; i++) {
        this.statusList[i].isActive = false;
      }
      this.firstScrollInto = 0;
    },
    discard() {
      return;
    },
  },
};
</script>

<style lang="scss" scoped>
.z-filter-dowpdown {
  flex-shrink: 0;
  width: 100%;
  // position: fixed;
  position: relative;
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
    left: 0;
    right: 0;
    .mask {
      display: none;
      &.hide {
        display: none;
      }
      &.show {
        display: flex;
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
    transition: background-color 0.15s linear;
    display: none;
    &.show {
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
    }
    &.hide {
      display: none;
    }
  }

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
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      transition: color 0.2s linear;

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
        transition: transform 0.2s linear, color 0.2s linear;
        &.iconxia {
          transform: rotate(0deg);
        }
        &.up {
          transform: rotate(-180deg);
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
    &.issure {
      padding-bottom: 90rpx;
    }
    background-color: #ffffff;
    z-index: 9;
    box-shadow: 0 5px 5px rgba(0, 0, 0, 0.1);
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
      height: 500rpx;
      max-height: 500rpx;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      .sub-menu {
        min-height: 88rpx;
        font-size: 28rpx;
        display: flex;
        flex-direction: column;
        padding-right: 20rpx;
        > .menu-name {
          height: 88rpx;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          > .iconfont {
            display: none;
            font-size: 18px;
            color: #b52e25;
          }
        }
      }
      &.alone {
        // max-height: 300px;
        min-height: 120px;
        height: auto;
        .sub-menu {
          min-height: calc(88rpx - 1rpx);
          margin-left: 30rpx;
          margin-right: 30rpx;
          &:not(:last-child) {
            border-bottom: solid 1rpx #e5e5e5;
          }

          &.on {
            color: #b52e25;

            > .menu-name {
              > .iconfont {
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
          > .menu-name {
            height: calc(88rpx - 1rpx);
            > .iconfont {
              display: none;
              font-size: 18px;
              color: #b52e25;
            }
          }
          &.on {
            color: #b52e25;
            > .menu-name {
              > .iconfont {
                display: block;
              }
            }
          }
          .more-sub-menu {
            flex-direction: row;
            flex-wrap: wrap;
            padding-bottom: 9px;
            > text {
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
  position: absolute;
  bottom: 0;
  background-color: #fff;
  box-shadow: 0upx -4upx 6upx rgba(114, 130, 138, 0.2);
}

.filter-content-footer-item {
  width: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
}
</style>
