<template>
  <view class="my-service">
    <view v-if="serviceList.length" class="cu-list">
        <view class="cu-card article" v-for="(record,i) in serviceList" :key="i">
          <view class="cu-item s-item">
            <view class="padding-sm">
              <view
                class="padding-bottom-xs s-type flex justify-between dashed-bottom solid-bottom"
              >
                <view class="text-black">{{record.businesstype}}</view>
                <view class="text-grey">{{record.statustype}}</view>
              </view>
              <view class="padding-top-xs s-title">{{record.yuyuename}}</view>
              <view class="padding-top-xs">负责人:  {{record.personman}}  {{record.phonenum}}</view>
              <view class="padding-top-xs">
                <view class="text-gray text-content text-df">
                  <view class="text-cut">{{record.remarks}}</view>
                </view>
              </view>
            </view>
          </view>
        </view>
    </view>
    <view v-else>
      <rf-empty
        :bottom="bottom"
        class="empty-container"
        :info="'暂时没有数据哟~'"
        :isRecommendShow="true"
        v-if="!loading && serviceList.length === 0"
      ></rf-empty>
    </view>

    <!--加载动画-->
    <rfLoading isFullScreen :active="loading"></rfLoading>
  </view>
</template>

<script>
import { myService } from '@/api/userInfo';

export default {
  components: {},
  data() {
    return {
      serviceList: [],
      btnLoading: false,
      loading: true,
    };
  },
  onLoad(options) {
    this.initData(options);
  },
  methods: {
    // 返回上一页
    navBack: function navBack() {
      this.$mRouter.back();
    },
    async getMyService() {
      await this.$http
        .get(`${myService}`)
        .then((r) => {
          this.loading = false;
          this.serviceList = r.data;
        }).catch((err) => {
          this.loading = false;
          this.errInfo = err;
        });
    },
    // 数据初始化
    async initData(options) {
      this.getMyService();
    }
  },
};
</script>

<style lang="scss">
page {
  background: $page-color-base;
}
.my-service {
	.cu-list {
		margin-top:30rpx;
	}
	.s-item {
		margin: 0rpx 30rpx 30rpx;
	}
}
</style>
