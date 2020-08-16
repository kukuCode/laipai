<template>
  <view class="services">
    <view class="button-sp-area">
      <view class="action-btn-group2"></view>
      <button type="default" class="action-btn">金融贷款</button>
      <button type="default" class="action-btn">税费过户</button>
    </view>
  </view>
</template>
<script>
/**
 * @des 服务
 */
export default {
  components: {},
  data() {
    return {};
  },
  filters: {},
  computed: {},
  // 小程序分享
  onShareAppMessage() {
    return {
      title: `欢迎来到${this.appName}`,
      path: '/pages/index/index',
    };
  },
  async onShow() {
    // 初始化数据
    await this.initData();
  },
  // #ifndef MP
  onNavigationBarButtonTap(e) {
    const index = e.index;
    if (index === 0) {
      // this.navTo('/pages/set/set');
    } else if (index === 1) {
    }
  },
  // #endif
  methods: {
    decryptPhoneNumber() {
      debugger;
    },
    // 数据初始化
    initData() {},
  },
};
</script>
<style lang="scss" scoped>
page {
  background-color: $page-color-base;
}
.action-btn {
  border: 1px solid #ccc;
  background-color: #fff;
  margin: 40upx;
}
</style>
