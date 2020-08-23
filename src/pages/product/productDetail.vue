<template>
    <view class="container">
        <!--#ifdef MP-WEIXIN-->
		<text class="back-btn iconfont iconzuo" @tap="navBack"></text>
		<!--#endif-->
        <!-- header -->
        <view class="zui-header-box" :style="{ height: height + 'px', background: 'rgba(255,255,255,' + opcity + ')' }">
			<view class="zui-header" :style="{ paddingTop: top + 'px', opacity: opcity }">商品详情</view>
			<!-- <view class="zui-header-icon" :style="{ marginTop: top + 'px' }">
				<view class="zui-icon-box" :style="{ backgroundColor: 'rgba(0, 0, 0,' + iconOpcity + ')' }" @tap="back">
					<zui-icon name="arrowleft" :size="30" :color="opcity >= 1 ? '#000' : '#fff'"></zui-icon>
				</view>

				<view class="zui-icon-box zui-icon-ml" :style="{backgroundColor: 'rgba(0, 0, 0,' + iconOpcity + ')'}" @tap.stop="openMenu">
					<zui-icon name="more-fill" :size="20" :color="opcity >= 1 ? '#000' : '#fff'"></zui-icon>
					<zui-badge type="red" :scaleRatio="0.8" absolute top="0" right="-4rpx">5</zui-badge>
				</view> 

			</view>
            -->
		</view>
        <!-- header -->
        <!--banner-->
		<view class="zui-banner-swiper">
			<swiper indicator-dots :autoplay="true" :interval="5000" :duration="150" :circular="true" touchable :style="{ height: scrollH + 'px' }"
			 @change="bannerChange">
				<block v-for="(item, index) in banner" :key="index">
					<swiper-item :data-index="index" @tap.stop="previewImage">
						<image :src="item" class="zui-slide-image" :style="{ height: scrollH + 'px' }" />
					</swiper-item>
				</block>
			</swiper>
			<!-- <view class="zui-banner-tag">
                {{ bannerIndex + 1 }}/{{ banner.length }}
			</view> -->
		</view>
		<!--banner-->

        <!-- detail -->
        <view class="p-progress">
            <view class="p-status-info">
                <view class="p-about" >即将开始</view>
                <view class="p-start-time">开拍时间: 2020-08-25</view>
            </view>
        </view>
        <view class="z-p-detail zui-border-radius">
             <view>
                 <view class="p-flex introduce-line">
                      <view class="z-title">柘城县未来大道盛华佳苑小区2幢2-1102号</view>
                    <view class="z-share">
                    <button open-type="share" class="zui-share-btn" :class="'text-' + themeColor.name" @tap.stop="share()">
                        <text class="iconfont iconfenxiang"></text>
                        <text class="tui-share-text tui-gray">分享</text>
                    </button>
                </view>
                 </view>
                  <view class="p-flex">
                      <view class="gray-title">起&nbsp;&nbsp;拍&nbsp;&nbsp;价</view>
                      <view class="price1 text-red"> {{ moneySymbol }} 15000</view>
                  </view>
                  <view class="p-flex">
                      <view class="gray-title">评&nbsp;&nbsp;估&nbsp;&nbsp;价</view>
                    <view class="price1 text-red"> {{ moneySymbol }} 20000</view>
                  </view>

                   <view class="p-flex flex-col">
                      <view class="p-flex2">
                       <view class="gray-title ">保&nbsp;&nbsp;证&nbsp;&nbsp;金</view>
                       <view class="price2 "> {{ moneySymbol }} 20000</view>
                      </view>
                      <view class="p-flex2">
                       <view class="gray-title ">加价幅度</view>
                       <view class="price2 "> {{ moneySymbol }} 5000</view>
                      </view>
                   </view>
                   <view class="p-flex flex-col">
                      <view class="p-flex2">
                       <view class="gray-title ">竞价周期</view>
                       <view class="price2 ">24小时</view>
                      </view>
                      <view class="p-flex2">
                       <view class="gray-title ">竞价周期</view>
                       <view class="price2 ">123123</view>
                      </view>
                   </view>
                    <view class="p-flex">
                        <view class="gray-title">开拍时间</view>
                        <view class="price1">2020-08-25</view>
                  </view>
                
                <view></view>
             </view>
        </view>
        <!-- detail -->

        <!--底部操作栏-->
		<view class="page-bottom">
			<view class="page-bottom-bth-wrapper" style="width:">
				<view class="zui-operation-item" hover-class="tui-opcity" :hover-stay-time="150">
					<i class="iconfont iconkefu2"></i>
					<view class="tui-operation-text tui-scale-small" @tap="hanldeAdvisory">咨询</view>
				</view>
			</view>
			<view class="apply-action-btn" style="flex:1">
                    <button
						class="action-btn"
						:class="'bg-' + themeColor.name"
						:disabled="disabledApplyBtn"
						@tap="applySubmit"
					>
                    申请预约
                    </button>
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
              <view  class="item disFlexCol">
                 	<i class="iconfont iconkefu2"></i>
                    <text>过户办证</text>
             </view>
              <view  class="item disFlexCol">
                 	<i class="iconfont iconkefu2"></i>
                    <text>风险评估</text>
             </view>
              <view  class="item disFlexCol">
                 	<i class="iconfont iconkefu2"></i>
                    <text>税费测算</text>
             </view>
              <view  class="item disFlexCol">
                 	<i class="iconfont iconkefu2"></i>
                    <text>专属顾问</text>

            </view>
             </view>

        </view>

        <view class="z-box">
            <block>
                <view style="margin-bottom:10px;font-size:16px;">重要提示</view>
            </block>
            <view v-html="htmlCode"></view>
        </view>

    </view>
</template>

<script>
export default {
    props: {

    },
    data() {
        return {
            hasLogin: this.$mStore.getters.hasLogin,
            moneySymbol:this.moneySymbol,
            productDetail: {},
            loading: true,
            errorInfo: '',
            userInfo: {},
            scrollTop: 0,
            currentUrl: '',
            navDetailShow: false,
            bannerIndex:0,
            appName: this.$mSettingConfig.appName ,
            height: 64, //header高度
            top: 26, //标题图标距离顶部距离
            scrollH: 0, //滚动总高度
            opcity: 0,
            iconOpcity: 0.5,
            disabledApplyBtn:false,
            // 测试数据
            banner: [
                "https://laipai-img.oss-cn-hangzhou.aliyuncs.com/upload/d0bdb07e71fb3612ff14c9fd8078fb95.jpeg?x-oss-process=image/resize,m_lfit,h_600,w_800",
                "https://laipai-img.oss-cn-hangzhou.aliyuncs.com/upload/4bb64672cad06ee89ae585f4d33e988f.jpeg?x-oss-process=image/resize,m_lfit,h_600,w_800",
                "https://laipai-img.oss-cn-hangzhou.aliyuncs.com/upload/f047401736cb00f9d700b092bc1b0c9b.jpeg?x-oss-process=image/resize,m_lfit,h_600,w_800",
                "https://laipai-img.oss-cn-hangzhou.aliyuncs.com/upload/0e51c3304c3418e4d9e94c813ec3897f.jpeg?x-oss-process=image/resize,m_lfit,h_600,w_800",
                "https://laipai-img.oss-cn-hangzhou.aliyuncs.com/upload/d2dab4908be164506c0939ad151fea81.jpeg?x-oss-process=image/resize,m_lfit,h_600,w_800",
                "https://laipai-img.oss-cn-hangzhou.aliyuncs.com/upload/1a8214722a4177e4342b4a4c56baaffe.jpeg?x-oss-process=image/resize,m_lfit,h_600,w_800",
                "https://laipai-img.oss-cn-hangzhou.aliyuncs.com/upload/d162ffee7353475b4a2e7845f5d79b0f.jpeg?x-oss-process=image/resize,m_lfit,h_600,w_800",
                "https://laipai-img.oss-cn-hangzhou.aliyuncs.com/upload/5f204ba3f7924960989cf6b11dc0fa0f.jpeg?x-oss-process=image/resize,m_lfit,h_600,w_800"
            ],
            htmlCode:`<div class="container detail-important-warming-text color-grey"><p>来拍法服平台受
            	<span class="color-red">柘城县人民法院</span> 
            	委托，承担本标的物情况调查、看样管理等工作，并提供标的物相关信息咨询服务。现将相关事务告知如下：</p> <p>一、竞买人在参拍前，须仔细阅读法院发布的《竞买公告》、《竞买须知》和《标的物情况》。</p> <p>二、本平台向您提供的一切增值信息均不代表处置法院的意见，与处置法院无关，处置法院提供的信息均以法院发布的公告为准。</p> <p>三、本平台所提供的增值信息均系本平台从公开渠道收集并整理所得，本平台将尽力维护信息的准确性和及时性，但本平台仅能确保本平台未对所收集的信息作过任何的伪造或变造，而并不能保证其为完全准确和最新的信息，本平台不对信息内容作任何形式的担保。</p> <p>四、竞买人在预约及看样过程中，请认准本平台及工作人员的工作证件，在看样现场服从带看样人员管理，在服务过程中遇各种情况，都可向4001-571-060建议或投诉。</p></div>`
            //

        };
    },
    computed: {

    },
    created() {

    },
    mounted() {

    },
    watch: {

    },
    methods: {
        navBack() {
		    this.$mRouter.back();
		},
        applySubmit(){
            if (!this.hasLogin) {
                this.$mHelper.backToLogin();
                return;
            }
        },
        hanldeAdvisory(){
             if (!this.hasLogin) {
                this.$mHelper.backToLogin();
                return;
            }
        },
        previewImage: function(e) {
				let index = e.currentTarget.dataset.index;
				uni.previewImage({
					current: this.banner[index],
					urls: this.banner
				});
			},
        bannerChange: function(e) {
            this.bannerIndex = e.detail.current;
        },

        // 分享
         share() {
            // #ifdef H5
                this.$mHelper.h5Copy(`${this.$mConfig.hostUrl}/pages/product/productDetail?id=${this.productId}`);
            // #endif
            // #ifdef APP-PLUS
            
            // this.$mHelper.handleAppShare(this.url, this.appName, this.product.name, this.product.picture); // url,引用名,商品名,图片
                this.$mHelper.handleAppShare(this.url, this.appName, "分享示例", "https://laipai-img.oss-cn-hangzhou.aliyuncs.com/upload/d0bdb07e71fb3612ff14c9fd8078fb95.jpeg?x-oss-process=image/resize,m_lfit,h_600,w_800"); // url,引用名,商品名,图片
            // #endif
        },

    },
    components: {

    },
    async onLoad(options) {
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
                success: res => {
                    this.width = obj.left || res.windowWidth;
                    this.height = obj.top ? obj.top + obj.height + 8 : res.statusBarHeight + 44;
                    this.top = obj.top ? obj.top + (obj.height - 32) / 2 : res.statusBarHeight + 6;
                    this.scrollH = res.windowWidth;
                }
            });
        }, 0);
    },
    onPageScroll(e) {
        let scroll = e.scrollTop <= 0 ? 0 : e.scrollTop;
        let opcity = scroll / this.scrollH;
        if (this.opcity >= 1 && opcity >= 1) {
            return;
        }
        this.opcity = opcity;
        this.iconOpcity = 0.5 * (1 - opcity < 0 ? 0 : 1 - opcity);
    }
};
</script>

<style scoped lang="scss">
.container {
    padding-bottom: 110rpx;
    // header
    .zui-header-box{
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
    }
    
    // banner
    .zui-banner-swiper{
        position: relative;
        .zui-slide-image {
            width: 100%;
            display: block;
	    }

        .zui-banner-tag{
            position: absolute;
            color: #fff;
            bottom: 30rpx;
            right: 0;
        }

    }

    // detail
    .p-progress{
        .p-status-info{
            height: 60rpx;
            display: flex;
            align-items: center;
            background-color: #c3dcd2;
            .p-about{
                height: 60rpx;
                line-height: 60rpx;
                border-top-right-radius: 30px;
                border-bottom-right-radius: 30px;
                padding: 0 10px;
                color:#fff;
                font-size:$font-sm;
            
                    background: green;
            }
            .p-start-time{
                flex:1 1 auto;
                text-align: center;;
            }
        }
    }
    .z-p-detail{
        box-sizing: border-box;
        color: #333;
        padding: 20rpx 0px 8rpx 24rpx;
        background: #fff;
        .z-share{
            line-height: 22rpx;;
            width: 104rpx;
            margin-left: 18rpx;
            font-size: 22rpx;
            .zui-share-btn{
                border-radius: 24px 0 0 24px;
                padding: 4px 7px;
                font-size: 22rpx;
                height:23px;
                background: #ededed !important;
                flex: 1;
                text-align: right;
                line-height: 17px;
            }
            .iconfenxiang{
                font-size: 22rpx;
            }
        }
    .p-flex{
        display: flex;
        align-items: center;
            margin-bottom: 10px;
    }
    .p-flex2{
        display: flex;
        align-items: center;
         flex:1 1 auto;
    }
    .flex1{
        flex:1 1 auto;
    }
    .z-title{
        font-size:32rpx;
    }
        .gray-title{
            color: #a0a0a0;
           &:after { 
                    content: ":";
                    position: relative;
                    top: -.5px;
                    margin: 0 8px 0 2px;
                    
                }
        }
        .price1{
                font-size: 32rpx;
                font-weight: 500;
        }
        .price2{

        }
    }
    .zui-border-radius{
        border-bottom-left-radius: 12px;
        border-bottom-right-radius: 12px;
        overflow: hidden;
    }

    .introduce-line{
        // padding: 9px 0px 4px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .page-bottom{
        height:90rpx;
        box-shadow: 0px -2px 8px 0px rgba(0, 0, 0, 0.3);
    .page-bottom-bth-wrapper{
        width: 90px;
        justify-content: center;
        .zui-operation-item{
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }
    }
    .apply-action-btn{
        height: 100%;
        flex:1;
        button{
            height: 100%;
            border-radius:0 !important;
        }
    }
    }
}

.back-btn {
		position: fixed;
		left: 40upx;
		z-index: 9999;
		padding-top: var(--status-bar-height);
		// top: 40upx;
		font-size: 40upx;
		color: $font-color-dark;
    }
    .paimaiService{
        display: flex;
        flex-wrap: wrap;
        .item{
            // width:120rpx;
            // height:80rpx;
            // flex:1;
            font-size:$font-sm;
            background-color: #f3f5f9;
            border-radius:6px;
            margin:0 20rpx;
            margin-bottom: 10px;
            padding: 10rpx;
        }
        .disFlexCol{
            display: flex;
            flex-direction: column;
            align-items: center;

        }
    }

    .z-box{
        margin:40rpx 10rpx 0;
        padding:20px;
        background-color: #fff;
        border-radius: 6px;
    }
</style>
