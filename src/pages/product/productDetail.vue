<template>
  <view class="container">
    <!--#ifdef MP-WEIXIN-->
    <!-- <text class="back-btn iconfont iconzuo" @tap="navBack"></text> -->
    <!--#endif-->
    <!-- header -->
    <view
      class="zui-header-box"
      :style="{ height: height + 'px', background: 'rgba(255,255,255,' + opcity + ')' }"
    >
      <view class="zui-header" :style="{ paddingTop: top + 'px', opacity: opcity }">商品详情</view>
      <view class="zui-header-icon" :style="{ marginTop: top + 'px' }">
        <!--#ifdef MP-WEIXIN-->
        <view
          v-if="!isshare"
          class="zui-icon-box"
          :style="{ backgroundColor: 'rgba(0, 0, 0,' + iconOpcity + ')' }"
          @tap="navBack"
        >
          <zui-icon name="arrowleft" :size="30" :color="opcity >= 1 ? '#000' : '#fff'"></zui-icon>
        </view>
        <view
          v-else
          class="zui-icon-box"
          :style="{ backgroundColor: 'rgba(0, 0, 0,' + iconOpcity + ')' }"
          @tap="backHome"
        >
          <zui-icon name="arrowleft" :size="30" :color="opcity >= 1 ? '#000' : '#fff'"></zui-icon>
        </view>
        <!--#endif-->

        <!-- <view class="zui-icon-box zui-icon-ml" :style="{backgroundColor: 'rgba(0, 0, 0,' + iconOpcity + ')'}" @tap.stop="openMenu">
					<zui-icon name="more-fill" :size="20" :color="opcity >= 1 ? '#000' : '#fff'"></zui-icon>
					<zui-badge type="red" :scaleRatio="0.8" absolute top="0" right="-4rpx">5</zui-badge>
        </view>-->
      </view>
    </view>
    <!-- header -->
    <view v-if="proDetail.id">
      <!--banner-->
      <view class="zui-banner-swiper">
        <swiper
          indicator-dots
          :autoplay="true"
          :interval="5000"
          :duration="150"
          :circular="true"
          touchable
          :style="{ height: scrollH + 'px' }"
          @change="bannerChange"
        >
          <block v-for="(item, index) in bannerList" :key="index">
            <swiper-item :data-index="index" @tap.stop="previewImage">
              <image :src="item" class="zui-slide-image" :style="{ height: scrollH + 'px' }" />
            </swiper-item>
          </block>
        </swiper>
        <!-- <view class="zui-banner-tag">
                {{ bannerIndex + 1 }}/{{ banner.length }}
        </view>-->
      </view>
      <!--banner-->

      <!-- detail -->
      <view class="p-progress" v-if="proDetail.start">
        <view class="p-status-info" :class="proDetail.status">
          <!-- <view class="p-about">{{statusTxt}}</view> -->
          <view class="p-about" :class="proDetail.status">{{statusTxt}}</view>
          <view class="p-start-time">开拍时间: {{proDetail.start || ''}}</view>
        </view>
      </view>
      <view class="z-p-detail zui-border-radius">
        <view>
          <view class="p-flex introduce-line" style="align-items: flex-start;">
            <view class="z-title">{{proDetail.title}}</view>
            <view class="z-share">
              <button
                open-type="share"
                class="zui-share-btn"
                :class="'text-' + themeColor.name"
                @tap.stop="share()"
              >
                <text class="iconfont iconfenxiang"></text>
                <text class="tui-share-text tui-gray">分享</text>
              </button>
            </view>
          </view>
          <view class="p-flex">
            <view class="gray-title">起&nbsp;&nbsp;拍&nbsp;&nbsp;价</view>
            <view class="price1 text-red">{{ moneySymbol }}{{proDetail.initialPrice | filterAmount}}</view>
          </view>
          <view class="p-flex">
            <view class="gray-title">评&nbsp;&nbsp;估&nbsp;&nbsp;价</view>
            <view class="price1 text-red">{{ moneySymbol }}{{proDetail.consultPrice | filterAmount}}</view>
          </view>

          <view class="p-flex flex-col">
            <view class="p-flex2">
              <view class="gray-title">保&nbsp;&nbsp;证&nbsp;&nbsp;金</view>
              <view class="price2">{{ moneySymbol }}{{proDetail.bail | filterAmount}}</view>
            </view>
            <view class="p-flex2">
              <view class="gray-title">加价幅度</view>
              <view class="price2">{{ moneySymbol }}{{proDetail.markUp | filterAmount}}</view>
            </view>
          </view>
          <view class="p-flex flex-col">
            <view class="p-flex2">
              <view class="gray-title">竞价周期</view>
              <view class="price2">{{proDetail.saleCycle || ''}}</view>
            </view>
            <view class="p-flex2">
              <view class="gray-title">标的物编号</view>
              <view class="price2">{{proDetail.idOfAuction || ''}}</view>
            </view>
          </view>
          <view class="p-flex">
            <view class="gray-title">开拍时间</view>
            <view class="price1">{{proDetail.start || ''}}</view>
          </view>

          <view></view>
        </view>
      </view>
      <!-- detail -->

      <!--底部操作栏-->

      <view class="page-bottom">
        <view class="page-bottom-bth-wrapper">
          <button open-type="contact" class="action-btn" style="background-color: #fff;">
            <view class="zui-operation-item" hover-class="tui-opcity" :hover-stay-time="150">
              <i class="iconfont iconkefu2 text-red"></i>
              <view class="tui-operation-text tui-scale-small">咨询</view>
            </view>
          </button>
          <!-- <view class="zui-operation-item" hover-class="tui-opcity" :hover-stay-time="150" @tap="hanldeAdvisory">
                        <i class="iconfont iconkefu2"></i>
                        <view class="tui-operation-text tui-scale-small">咨询</view>
          </view>-->
        </view>
        <view class="apply-action-btn" style="flex:1">
          <button
            class="action-btn"
            :class="'bg-' + themeColor.name"
            :disabled="proDetail.isLook != 1 "
            @tap="applySubmit"
          >申请预约</button>
        </view>
      </view>

      <view class="z-box">
        <block>
          <view style="margin-bottom:10px;font-size:16px;">拍卖服务</view>
        </block>
        <view class="paimaiService">
          <view class="item disFlexCol">
            <i class="iconfont iconkefu2"></i>
            <text>全程服务</text>
          </view>
          <view class="item disFlexCol">
            <i class="iconfont iconkefu2"></i>
            <text>过户办证</text>
          </view>
          <view class="item disFlexCol">
            <i class="iconfont iconkefu2"></i>
            <text>风险评估</text>
          </view>
          <view class="item disFlexCol">
            <i class="iconfont iconkefu2"></i>
            <text>税费测算</text>
          </view>
          <view class="item disFlexCol">
            <i class="iconfont iconkefu2"></i>
            <text>专属顾问</text>
          </view>
        </view>
      </view>

      <view class="z-box">
        <!-- <block>
                <view style="margin-bottom:10px;font-size:16px;">重要提示</view>
        </block>-->
        <!-- <view v-html="htmlCode"></view> -->

        <view class="detail-wrapper" :class="{'detail-warming-readall':isExpand}">
          <view style="margin-bottom:10px;font-size:16px;">重要提示</view>
          <view class="detail-warming-cover">
            <view class="detail-cover-btn">
              <text class="more-txt" @click="isExpand = !isExpand">{{isExpand ? '点击收起': '点击展开'}}</text>
            </view>
          </view>
          <view class="detail-desc">
            <rich-text :nodes="htmlCode"></rich-text>
          </view>
        </view>
      </view>

      <view class="zui-nomore-box" v-if="proDetail.introductionOfItem">
        <view class="zui-nomore-class">
          <view class="zui-nomore">
            <view class="zui-txt">标的物介绍</view>
          </view>
        </view>
        <block>
          <!-- <view v-html="proDetail.introductionOfItem"></view> -->
          <rich-text :nodes="proDetail.introductionOfItem"></rich-text>
        </block>
      </view>
      <view class="zui-nomore-box" v-if="proDetail.saleAnnouncement">
        <view class="zui-nomore-class">
          <view class="zui-nomore">
            <view class="zui-txt">拍卖公告</view>
          </view>
        </view>
        <block>
          <!-- <view v-html="proDetail.saleAnnouncement"></view> -->
          <rich-text :nodes="proDetail.saleAnnouncement"></rich-text>
        </block>
      </view>
      <view class="zui-nomore-box" v-if="proDetail.saleNotice">
        <view class="zui-nomore-class">
          <view class="zui-nomore">
            <view class="zui-txt">拍卖须知</view>
          </view>
        </view>
        <block>
          <!-- <view v-html="proDetail.saleNotice"></view> -->
          <rich-text :nodes="proDetail.saleNotice"></rich-text>
        </block>
      </view>
    </view>
    <view v-else>
      <view v-if="!proDetail.id && !loading">
        <rf-no-data class="rf-no-data" :custom="true">
          <view class="title" @tap="getOrderDetail">{{ '商品不存在' }}</view>
          <view @tap="getOrderDetail" slot="refresh" class="spec-color">重新加载</view>
        </rf-no-data>
      </view>
    </view>

    <!--页面加载动画-->
    <rfLoading isFullScreen :active="loading"></rfLoading>
    <rf-back-top :scrollTop="scrollTop"></rf-back-top>
  </view>
</template>

<script>
import { productDetailUrl } from '@/api/product';
import rfNoData from '@/components/rf-no-data';

export default {
  props: {},
  components: {
    rfNoData,
  },
  data() {
    return {
      hasLogin: this.$mStore.getters.hasLogin,
      moneySymbol: this.moneySymbol,
      productId: '', // 商品id
      isshare: false,
      isExpand: false, // 展开收齐
      proDetail: {},
      loading: true,
      errInfo: '',
      userInfo: {},
      scrollTop: 0,
      currentUrl: '',
      navDetailShow: false,
      bannerIndex: 0,
      appName: this.$mSettingConfig.appName,
      height: 64, //header高度
      top: 26, //标题图标距离顶部距离
      scrollH: 0, //滚动总高度
      opcity: 0,
      iconOpcity: 0.5,
      disabledApplyBtn: false,
      htmlCode: `<div class="container detail-important-warming-text color-grey"><p>来拍法服平台受<span class="color-red">柘城县人民法院</span>委托，承担本标的物情况调查、看样管理等工作，并提供标的物相关信息咨询服务。现将相关事务告知如下：</p> <p>一、竞买人在参拍前，须仔细阅读法院发布的《竞买公告》、《竞买须知》和《标的物情况》。</p> <p>二、本平台向您提供的一切增值信息均不代表处置法院的意见，与处置法院无关，处置法院提供的信息均以法院发布的公告为准。</p> <p>三、本平台所提供的增值信息均系本平台从公开渠道收集并整理所得，本平台将尽力维护信息的准确性和及时性，但本平台仅能确保本平台未对所收集的信息作过任何的伪造或变造，而并不能保证其为完全准确和最新的信息，本平台不对信息内容作任何形式的担保。</p> <p>四、竞买人在预约及看样过程中，请认准本平台及工作人员的工作证件，在看样现场服从带看样人员管理，在服务过程中遇各种情况，都可向4001-571-060建议或投诉。</p></div>`,
    };
  },
  onShareAppMessage() {
    return {
      title: `${this.proDetail.title}`,
      path: `pages/product/productDetail?id=${this.productId}&isshare=1`,
    };
  },
  filters: {
    filterAmount(val) {
      if (!val) return 0;
      return ('' + val).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },
  },
  computed: {
    bannerList() {
      let { infoPics } = this.proDetail;
      if (Array.isArray(infoPics) && infoPics.length) {
        return infoPics;
      } else {
        return [];
      }
    },
    status() {
      return this.proDetail.status;
    },
    statusTxt() {
      //  todo:即将开始 doing:正在进行  done:已结束
      let _status = '';
      switch (this.status) {
        case 'todo':
          _status = '即将开始';
          break;
        case 'doing':
          _status = '正在进行';
          break;
        case 'done':
          _status = '已结束';
          break;
        default:
          break;
      }
      return _status;
    },
  },
  created() {},
  mounted() {},
  watch: {},
  methods: {
    /**
     * 回到首页(分享的时候)
     */
    backHome: function () {
      this.$mRouter.reLaunch({
        route: '/pages/index/index',
      });
    },
    navBack() {
      this.$mRouter.back();
    },
    applySubmit() {
      /*  if (!this.hasLogin) {
				     this.$mHelper.backToLogin();
				     return;
				 } */
      debugger;
      const { title = '' } = this.proDetail;
      this.navTo(
        `/pages/appointment/application?title=${title}&pid=${this.productId}`
      );
    },
    navTo(route) {
      if (!route) return;
      /* if (!this.hasLogin) {
				    this.$mHelper.backToLogin();
				    return;
				} */
      this.$mRouter.push({
        route,
      });
    },
    hanldeAdvisory() {
      if (!this.hasLogin) {
        this.$mHelper.backToLogin();
        return;
      }
    },
    /**
     * 预览
     */
    previewImage: function (e) {
      let index = e.currentTarget.dataset.index;
      uni.previewImage({
        current: this.bannerList[index],
        urls: this.bannerList,
      });
    },
    bannerChange: function (e) {
      this.bannerIndex = e.detail.current;
    },

    // 分享
    share() {
      // #ifdef H5
      this.$mHelper.h5Copy(
        `${this.$mConfig.hostUrl}/pages/product/proDetail?id=${this.productId}`
      );
      // #endif

      // #ifdef APP-PLUS
      // this.$mHelper.handleAppShare(this.url, this.appName, this.product.name, this.product.picture); // url,引用名,商品名,图片
      // url,引用名,商品名,图片
      /* this.$mHelper.handleAppShare(this.url + '&isshare=1', this.appName, "分享示例",
					"https://laipai-img.oss-cn-hangzhou.aliyuncs.com/upload/d0bdb07e71fb3612ff14c9fd8078fb95.jpeg?x-oss-process=image/resize,m_lfit,h_600,w_800"
				);  */
      // #endif
    },
    initData() {
      this.getOrderDetail();
    },
    async getOrderDetail() {
      debugger;
      await this.$http
        .get(`${productDetailUrl}${this.productId}`)
        .then((r) => {
          this.loading = false;
          this.proDetail = r.data;
          debugger;
        })
        .catch((err) => {
          this.loading = false;
          this.errInfo = err;
        });
    },
  },
  onShow() {
    this.initData();
  },
  async onLoad(options) {
    console.log('detail-onload-options', options);
    // 是否是分享链接进入
    if (options.isshare == 1) {
      console.log('分享进入详情');
      this.isshare = true;
    }

    this.productId = options.id;

    this.userInfo = uni.getStorageSync('userInfo') || {};
    // await this.initData();

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

    setTimeout(() => {
      uni.getSystemInfo({
        success: (res) => {
          this.width = obj.left || res.windowWidth;
          this.height = obj.top
            ? obj.top + obj.height + 8
            : res.statusBarHeight + 44;
          this.top = obj.top
            ? obj.top + (obj.height - 32) / 2
            : res.statusBarHeight + 6;
          this.scrollH = res.windowWidth;
        },
      });
    }, 0);
  },
  onPageScroll(e) {
    this.scrollTop = e.scrollTop;
    let scroll = e.scrollTop <= 0 ? 0 : e.scrollTop;
    let opcity = scroll / this.scrollH;
    if (this.opcity >= 1 && opcity >= 1) {
      return;
    }
    this.opcity = opcity;
    this.iconOpcity = 0.5 * (1 - opcity < 0 ? 0 : 1 - opcity);
  },
};
</script>

<style scoped lang="scss">
.container {
  padding-bottom: 110rpx;

  // header
  .zui-header-box {
    width: 100%;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 990;
  }

  .zui-header {
    width: 100%;
    font-size: 18px;
    line-height: 18px;
    font-weight: 500;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: content-box;
  }

  .zui-header-icon {
    position: fixed;
    top: 0;
    left: 10px;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    height: 32px;
    transform: translateZ(0);
    z-index: 9999;

    .zui-icon-box {
      position: relative;
      height: 20px !important;
      width: 20px !important;
      padding: 14px !important;

      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  // banner
  .zui-banner-swiper {
    position: relative;

    .zui-slide-image {
      width: 100%;
      display: block;
    }

    .zui-banner-tag {
      position: absolute;
      color: #fff;
      bottom: 30rpx;
      right: 0;
    }
  }

  // detail
  .p-progress {
    .p-status-info {
      height: 60rpx;
      display: flex;
      align-items: center;
      background-color: #e7e7e7;
      &.todo {
        background-color: #c3dcd2;
      }
      &.doing {
        background-color: #f7d3d0;
      }
      &.orderenable {
        background-color: #2b8651;
      }
      &.done {
        background-color: #e7e7e7;
      }
      &.booking {
        background-color: #f5dec8;
      }

      .p-about {
        height: 60rpx;
        line-height: 60rpx;
        border-top-right-radius: 30px;
        border-bottom-right-radius: 30px;
        padding: 0 10px;
        color: #fff;
        font-size: $font-sm;
        background: green;
        &.todo {
          background-color: #2b8651;
        }
        &.doing {
          background-color: #d74b4b;
        }
        &.orderenable {
          background-color: #2b8651;
        }
        &.done {
          background-color: #bbbbbb;
        }
        &.booking {
          background-color: #ff9933;
        }
      }

      .p-start-time {
        flex: 1 1 auto;
        text-align: center;
      }
    }
  }

  .z-p-detail {
    box-sizing: border-box;
    color: #333;
    padding: 20rpx 0px 8rpx 24rpx;
    background: #fff;

    .z-share {
      line-height: 22rpx;
      width: 104rpx;
      margin-left: 18rpx;
      font-size: 22rpx;
      flex: 0 0 104rpx;

      .zui-share-btn {
        border-radius: 24px 0 0 24px;
        padding: 4px 7px;
        font-size: 22rpx;
        height: 23px;
        background: #ededed !important;
        flex: 1;
        text-align: right;
        line-height: 17px;
      }

      .iconfenxiang {
        font-size: 22rpx;
      }
    }

    .p-flex {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
    }

    .p-flex2 {
      display: flex;
      align-items: center;
      flex: 1 1 auto;
      width: 50%;
    }

    .flex1 {
      flex: 1 1 auto;
    }

    .z-title {
      font-size: 32rpx;
    }

    .gray-title {
      color: #a0a0a0;

      &:after {
        content: ':';
        position: relative;
        top: -0.5px;
        margin: 0 8px 0 2px;
      }
    }

    .price1 {
      font-size: 32rpx;
      font-weight: 500;
    }

    .price2 {
    }
  }

  .zui-border-radius {
    border-bottom-left-radius: 12px;
    border-bottom-right-radius: 12px;
    overflow: hidden;
  }

  .introduce-line {
    // padding: 9px 0px 4px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .page-bottom {
    height: 90rpx;
    box-shadow: 0px -2px 8px 0px rgba(0, 0, 0, 0.3);

    .action-btn {
      height: 90rpx;
      line-height: 90rpx;
      text-align: center;
      padding: 0;
      display: block;
      line-height: 1;
      margin: 0;
      overflow: initial;
      width: 100%;
      border-radius: 0;
    }

    .page-bottom-bth-wrapper {
      height: 100%;
      width: 180rpx;
      justify-content: center;
      margin: 0;

      .zui-operation-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        .iconkefu2 {
          font-size: 34rpx;
        }
      }
    }

    .apply-action-btn {
      flex: 1;
      button {
        height: 100%;
        line-height: 90rpx;
        border-radius: 0 !important;
      }
    }
  }
}

.back-btn {
  position: fixed;
  left: 40upx;
  z-index: 9999;
  padding-top: var(--status-bar-height);
  top: 40upx;
  font-size: 40upx;
  color: $font-color-dark;
}

.paimaiService {
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;

  .item {
    // width:120rpx;
    // height:80rpx;
    // flex:1;
    font-size: $font-sm;
    background-color: #f3f5f9;
    border-radius: 6px;
    // margin:0 20rpx;
    // margin-bottom: 10px;
    padding: 10rpx;
  }

  .disFlexCol {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}

.z-box {
  // margin:40rpx 10rpx 0;
  margin-bottom: 20rpx;
  padding: 40rpx;
  background-color: #fff;
  border-radius: 6px;
}

.zui-nomore-box {
  padding: 20rpx 30rpx;
  background-color: #fff;

  .zui-nomore-class {
    width: 50%;
    margin: 1.5em auto;
    line-height: 1.5em;
    font-size: 12px;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-pack: center;
    -webkit-justify-content: center;
    justify-content: center;

    .zui-nomore {
      width: 100%;
      height: 100%;
      position: relative;
      display: -webkit-box;
      display: -webkit-flex;
      display: flex;
      -webkit-box-pack: center;
      -webkit-justify-content: center;
      justify-content: center;
      margin-top: 5px;
      padding-bottom: 3px;

      &::before {
        content: ' ';
        position: absolute;
        border-bottom: 0.5px solid #e5e5e5;
        -webkit-transform: scaleY(0.5);
        transform: scaleY(0.5);
        width: 100%;
        top: 9px;
        left: 0;
      }

      .zui-txt {
        background-color: #fff;
        color: #999;
        font-size: 48rpx;
        text-align: center;
        padding: 0 9px;
        height: 18px;
        line-height: 18px;
        position: relative;
        z-index: 1;
      }
    }
  }
}

.rf-no-data {
  height: calc(100vh - 90upx);
}

.spec-color {
  color: $font-color-spec;
}

.tui-scale-small {
  font-size: 24rpx;
}

// 重要提示
.detail-wrapper {
  position: relative;
  position: relative;
  height: 500rpx;
  overflow: hidden;
  transition: all 0.3s;

  &.detail-warming-readall {
    .detail-warming-cover {
      background: transparent;
    }

    height: 920rpx;
  }

  .detail-warming-cover {
    font-size: 24rpx;
    position: absolute;
    bottom: 0px;
    height: 200rpx;
    width: 100%;
    background: linear-gradient(to top, white, rgba(255, 255, 255, 0));

    .detail-cover-btn {
      text-align: center;
      position: absolute;
      bottom: 20rpx;
      width: 100%;
      font-size: 14px;
      color: #b52e25;

      .more-txt {
        border-bottom: 4rpx solid #b52e25;
        color: #b52e25;
        padding-bottom: 10rpx;
      }
    }
  }
}
</style>
