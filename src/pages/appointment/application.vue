<template>
	<view class="application-manage rf-row-wrapper">
		<view class="pro-name">
				<i class="cuIcon cuIcon-activity" />
				<text class="cell-tit clamp">{{ model.title }}</text>
		</view>
		<view class="row b-b ">
			<text class="tit">您的姓名</text>
			<input
				class="input"
				type="text"
				v-model="appointmenData.name"
				@blur="handleRealNameChange"
				placeholder="请填写您的真实姓名"
				placeholder-class="placeholder"
			/>
		</view>
		<view class="row b-b ">
			<text class="tit">统一看样时间</text>
			<text class="input text-grey">{{model.date||''}}</text>
			<!-- <input
				class="input text-grey"
				type="number"
				disabled
				:value="model.date"
				placeholder-class="placeholder"
			/> -->
		</view>
		<view class="row b-b ">
			<text class="tit">希望看样时间</text>
			<input
				class="input"
				type="number"
				@click="onShowDatePicker('datetime')"
				v-model="appointmenData.xwdate"
				@blur="handleMobileChange"
				placeholder="请选择看样时间"
				placeholder-class="placeholder"
			/>
		</view>
		<view class="row b-b ">
			<text class="tit">联系方式</text>
			<input
				class="input"
				type="number"
				v-model="appointmenData.phonenum"
				@blur="handleMobileChange"
				placeholder="请填写你的联系方式"
				placeholder-class="placeholder"
			/>
		</view>
		<view class="row b-b ">
			<text class="tit">备注信息</text>
			<input
				class="input"
				auto-height
				maxlength="100"
				v-model="appointmenData.remarks"
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

		<mx-date-picker :show="showPicker" :type="type" :value="dateVal"  :show-tips="false" format="yyyy-mm-dd hh:ii" :show-holiday="false" :show-seconds="false" @confirm="onDateSelected" @cancel="onCancel" />

	</view>
</template>

<script>
/**
 * 预约确认
 */
import { appointment } from '@/api/appointmentAPI';
import moment from '@/common/moment';
import MxDatePicker from "@/components/mx-datepicker/mx-datepicker.vue";

export default {
	components: {
		MxDatePicker
	},
	data() {
		return {
			appointmenData: {
				name: '',
				phonenum: '',
				remarks: '',
				xwdate:null,
			},
			model:{
				title:'',
				pid:''
			},
			timer: 0,
			btnLoading: false,
			loading: false,

			//日期
			 showPicker: false,
			datetime: moment().format('YYYY-MM-DD'),
			type: 'datetime',
			dateVal: ''
		};
	},
	onLoad(options) {
		this.initData(options);
	},
	methods: {
		onShowDatePicker(type){//显示
			this.type = type;
			this.showPicker = true;
		},
		onDateSelected(e) {//选择
			debugger;
			this.showPicker = false;
			if(e) {
				//选择的值
				console.log('value => '+ e.value);
				//原始的Date对象
				console.log('date => ' + e.date);
				this.$set(this.appointmenData, 'xwdate', e.value)
				// this.appointmenData.xwdate = e.value
			}
		},
		onCancel(){
			this.showPicker = false;
		},
		handleRealNameChange(){

		},
		handleMobileChange(){

		},
		// 数据初始化
		async initData(options) {
			debugger;
			let {title, pid, sampledate}  = options
			this.model = {title, pid}
			if(sampledate){
				this.dateVal = moment(sampledate).format('YYYY-MM-DD HH:mm')
				this.model.date = moment(sampledate).format('YYYY-MM-DD HH:mm')
				this.appointmenData.xwdate = moment(sampledate).format('YYYY-MM-DD HH:mm')
			}
			// this.manageType = options.type;
			/* uni.setNavigationBarTitle({
				title
			}); */
		},
		// 提交
		confirm() {
			let data = this.appointmenData;
			if (!data.name) {
				this.$mHelper.toast('请填写姓名');
				return;
			}
			if (!/^(?:(?:\+|00)86)?1[3-9]\d{9}$/.test(data.phonenum)) {
				this.$mHelper.toast('请输入正确的手机号码');
				return;
			}
			if(this.timer == 1){
				return;
			}
			this.timer = 1;
			setTimeout(()=>{
				this.timer = 0;
			}, 500)

			this.btnLoading = true;
			this.handleApplication(data);
		},
		async handleApplication(data) {
			/* 参数：
			会员id：mid
			资产id： sid
			预约电话：phonenum
			希望看样时间：xwdate
			备注： remarks */
			let params = {
					mid:'1599638335305a13',
					sid: this.model.pid,
					...data
				}
				// params.fzperson='Test_fzperson'
				// params.name = 'Test_name'
				// params.nickname='Test_nickname'
				// params.title = this.model.title
				// params.xwdate = 1593945183000
				// params.yystate = false

			await this.$http
				.post(`${appointment}`, params)
				.then(() => {
					this.btnLoading = false;
					this.$mHelper.toast('预约成功！', 2000, false,'success');
					// toast(title, duration = 3000, mask = false, icon = 'none')

					setTimeout(() => {
						// this.$mRouter.back();
						// this.navTo('/pages/appointment/appointmentlist')
						this.$mRouter.redirectTo({ route: '/pages/appointment/appointmentlist' });
					}, 1000);
				})
				.catch(() => {
					this.btnLoading = false;
				});
		},
		navTo(route) {
			if (!route) return;
			/* if (!this.hasLogin) {
			    this.$mHelper.backToLogin();
			    return;
			} */
			this.$mRouter.push({
				route
			});
		},
	}
};
</script>

<style lang="scss">
page {
	background: $page-color-base;
}

.pro-name{
    padding: 20rpx;
    background-color: #fff6f5;
    display: flex;
    align-items: center;
		i{
			font-size: 50rpx;
			color: #b52e25;
			padding-right: 20rpx;
		}
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
.rf-row-wrapper .row .input {
	flex:2;
}
.rf-row-wrapper .row  .text-grey{
	color: #8799a3 !important;
}
.rf-row-wrapper .row .tit {
	flex:1;
}
</style>
