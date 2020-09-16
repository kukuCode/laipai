<template>
	<view class="appointmentlist rf-row-wrapper">
		<view class="" v-if="appointmenList.length">
			<template v-for="(record,i) in appointmenList">
				<view class="apt-wrapper" :key="i">
					<view class="apt-content">
						<view class="apt-title">
							{{record.title || ''}}
						</view>
						<view class="apt-date">
							{{record.xwdate || ''}}
						</view>
					</view>
					<view class="apt-oper-wrapper">
						<button size="mini" class="action-btn" :class="'bg-' + themeColor.name" @tap="handleCancelAppo(record.id)">取消预约</button>
					</view>
				</view>
			</template>
				</view>
				<view v-else>
				<rf-empty
					:bottom="bottom"
					class="empty-container"
					:info="'您还预约哟~'"
					:isRecommendShow="true"
					v-if="!loading && appointmenList.length === 0"
				></rf-empty>
					
				</view>

		<!--加载动画-->
		<rfLoading isFullScreen :active="loading"></rfLoading>
	</view>
</template>

<script>
	/**
	 * 预约确认
	 */
	import {
		cancelAppointment,
		appointmentList
	} from '@/api/appointmentAPI';

	export default {
		components: {},
		data() {
			return {
				appointmenList: [{
					createdate: 1593834860000,
					fzperson: "刘明",
					id: 1,
					mid: "1548123922204mWy",
					name: "刘明",
					nickname: "刘明",
					phonenum: "18000537389",
					remarks: "备注大法师第三方dddd",
					sid: "0010733166ff4f6da098605d78a65d98",
					title: "成都市泰兴路36号1栋2楼202号（权1448138）的商业用房",
					xwdate: 1593945183000,
					yystate: false
				},{
					createdate: 1593834860000,
					fzperson: "张俊华",
					id: 2,
					mid: "1548123922204mWy",
					name: "张俊华",
					nickname: "张俊华",
					phonenum: "18000537389",
					remarks: "",
					sid: "0010733166ff4f6da098605d78a65d98",
					title: "四川省成都市金牛区蜀西南二路66号高家庄赞城1栋-1层309号车位",
					xwdate: 1593945183000,
					yystate: false
				}],
				sid: '',
				userId: '1599638335305a13',
				btnLoading: false,
				loading: true
			};
		},
		onLoad(options) {
			debugger;
			this.initData(options);
		},
		methods: {
			// 返回上一页
			navBack: function navBack() {
				this.$mRouter.back();
			},
			async getAppointmentlist() {
					await this.$http
						.get(`${appointmentList}`)
						.then(r => {
							debugger;
							this.loading = false;
							this.appointmenList = r.data;
						})
						.catch(err => {
							this.loading = false;
							this.errInfo = err;
						});
			},
			// 数据初始化
			async initData(options) {
				debugger;
				this.getAppointmentlist();
			},
			/* 取消预约 */
			async handleCancelAppo(id) {
				this.loading = true;
				await this.$http
					.get(`${cancelAppointment}${id}`)
					.then(r => {
						// this.$mHelper.toast('取消预约成功！');
						this.$mHelper.toast('取消成功！', 2000, false,'success');

						this.loading = false;
						this.getAppointmentlist()
						// this.appointmenList = r.data;
					})
					.catch(err => {
						this.$mHelper.toast('取消预约失败！');
						this.loading = false;
						this.errInfo = err;
					});

			}

		}
	};
</script>

<style lang="scss">
	page {
		background: $page-color-base;
	}

	.appointmentlist {
		padding: 20rpx;
	}

	.apt-wrapper {
		display: flex;
		align-items: center;
		height: 94px;
		justify-content: space-around;
		background: #fff;
		padding: 20rpx;
		width: 100%;
		margin-bottom: 5px;
		box-sizing: border-box;
		background: #fff;
		border-radius: 6px;
		overflow: hidden;
		-webkit-transition: all 0.15s ease-in-out;
		transition: all 0.15s ease-in-out;

		.apt-content {
			display: flex;
			flex-direction: column;
			justify-content: space-around;
			margin-right: 20rpx;
			height: 100%;

			.apt-title {
				height: 78upx;
				color: #2e2e2e;
				font-size: 26upx;
				word-break: break-all;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 2;
			}
		}

		.apt-oper-wrapper {
			overflow: hidden;
			position: relative;
			flex-shrink: 0;

			.action-btn {
				padding: 0 10px;
				line-height: 30px;
				height: 30px;
			}
		}
	}
</style>
