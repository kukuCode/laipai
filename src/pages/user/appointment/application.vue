<template>
	<view class="application-manage rf-row-wrapper">
		<view class="row b-b">
			<text class="tit">您的姓名</text>
			<input
				class="input"
				type="text"
				v-model="addressData.realname"
				@blur="handleRealNameChange"
				placeholder="请填写您的真实姓名"
				placeholder-class="placeholder"
			/>
		</view>
		<view class="row b-b">
			<text class="tit">联系方式</text>
			<input
				class="input"
				type="number"
				v-model="addressData.mobile"
				@blur="handleMobileChange"
				placeholder="请填写你的联系方式"
				placeholder-class="placeholder"
			/>
		</view>
		<button
            class="confirm-btn"
			:class="'bg-' + themeColor.name"
			:disabled="btnLoading"
			:loading="btnLoading"
			@tap="confirm"
		>
			提交
		</button>

		<!--加载动画-->
		<rfLoading isFullScreen :active="loading"></rfLoading>
	</view>
</template>

<script>
/**
 * 预约确认
 */
import { applicationUrl } from '@/api/userInfo';
export default {
	components: {
	},
	data() {
		return {
			addressData: {
				realname: '',
				mobile: '',
			},
			btnLoading: false,
			loading: false
		};
	},
	onLoad(options) {
		this.initData(options);
	},
	methods: {
		// 数据初始化
		async initData(options) {
			// this.manageType = options.type;
			/* uni.setNavigationBarTitle({
				title
			}); */
		},
		// 提交
		confirm() {
			let data = this.addressData;
			if (!data.realname) {
				this.$mHelper.toast('请填写姓名');
				return;
			}
			if (!/^(?:(?:\+|00)86)?1[3-9]\d{9}$/.test(data.mobile)) {
				this.$mHelper.toast('请输入正确的手机号码');
				return;
			}
			this.btnLoading = true;
			if (this.manageType === 'edit') {
				this.handleApplication(data);
			}
		},
		async handleApplication(data) {
			await this.$http
				.put(`${applicationUrl}?id=${data.id}`, {
					realname: data.realname,
					mobile: data.mobile,
				})
				.then(() => {
					this.btnLoading = false;
					this.$mHelper.toast('预约成功！');
					this.$mRouter.back();
				})
				.catch(() => {
					this.btnLoading = false;
				});
		}
	}
};
</script>

<style lang="scss">
page {
	background: $page-color-base;
}
.application-manage {
	padding-top: 16upx;
}
.confirm-btn{
    position: absolute;
    left: 0;
    right: 0;
    bottom: 140rpx;
    margin: auto;
}
</style>
