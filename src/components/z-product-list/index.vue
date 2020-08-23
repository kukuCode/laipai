<template>
	<view class="rf-product-list" style="padding:20rpx">
		<view class="rf-product-list-container">
			<block v-for="(item, index) in list" :key="index">
				<!--商品列表-->
				<view
					v-if="(index + 1) % 2 !== 0 || isList"
					class="rf-product-item"
					@tap.stop="navTo(`/pages/product/productDetail?id=${item.id}`)"
					:class="[isList ? 'rf-product-flex-list' : '']"
					hover-class="hover"
					:hover-start-time="150"
				>
					<view class="rf-pro-content">
						<view class="rf-pro-tit">
							<text class="sublist-mark orderenable">即将开始</text>
							<text class="sublist-mark special">可预约</text>
							<!-- <text class="sublist-mark booking">看样排期中</text> -->
						 	{{ item.title }}</view>
						<view v-if="item">
							<view class="rf-pro-price">
								<view>
								<text class="rf-sub-title" style="font-size:30upx">起 拍 价: </text><text class="rf-sale-price" :class="'text-'+themeColor.name" v-if="item.consultPrice"> {{ moneySymbol }} <text class="rf-price-txt">{{ item.consultPrice | filterTotalSales }}</text></text>
								</view>
								<view>
								<text class="rf-sub-title">开拍时间:</text><text class="rf-fatory-date" v-if="item.start" >{{ item.start }}</text>
								</view>
							</view>
						</view>
					</view>
					<view class="rf-product-image-wrapper">
						<image :src="item.picUrl" mode="widthFix" :preview="false" :class="[isList?'rf-product-list-img':'rf-product-img']" ></image>
						<text class="sketch in1line" v-if="item.sketch">{{ item.sketch }}</text>
					<!-- 	<view class="triangle-wrapper">
							<image class="triangle-tag" :src="item | filterTagName"></image>
						</view> -->
					</view>
				</view>
				<!--商品列表-->
			</block>
		</view>
		<view class="rf-product-list-container" v-if="!isList">
			<block v-for="(item, index) in list" :key="index">
				<!--商品列表-->
				<view
					v-if="(index + 1) % 2 === 0"
					class="rf-product-item"
					@tap.stop="navTo(`/pages/product/productDetail?id=${item.id}`)"
					:class="[isList ? 'rf-product-flex-list' : '']"
					hover-class="hover"
					:hover-start-time="150"
				>
					<view class="rf-product-image-wrapper">
						<image :src="item.picture" mode="widthFix" :preview="false" :class="[isList?'rf-product-list-img':'rf-product-img']" ></image>
						<text class="sketch in1line" v-if="item.sketch">{{ item.sketch }}</text>
						<!-- <view class="triangle-wrapper" v-if="item.shipping_type === '1' || item.is_virtual === '1' || item.commissionRate || item.is_open_presell === '1'">
							<image class="triangle-tag" :src="item | filterTagName"></image>
						</view> -->
					</view>
					<view class="rf-pro-content">
						<view class="rf-pro-tit">{{ item.name }}</view>
						<view v-if="item">
							<view class="rf-pro-price">
								<text class="rf-sale-price" :class="'text-'+themeColor.name">{{ moneySymbol }}{{ item.price }}</text>
								<text class="rf-factory-price" v-if="item.market_price > item.price">{{ moneySymbol }}{{ item.market_price }}</text>
							</view>
							<view class="rf-pro-pay">
								<text
									><text :class="'text-'+themeColor.name">{{
										item.total_sales | filterTotalSales
									}}</text>
									付款</text
								>
								<text
									@tap.stop="toggleSpec(item)"
									:class="'text-'+themeColor.name"
									class="iconfont icongouwuche2"
								></text>
							</view>
						</view>
					</view>
				</view>
				<!--商品列表-->
			</block>
		</view>
		<!-- 规格-模态层弹窗 -->
		<view
			class="popup spec show"
			v-if="specClass === 'show'"
			@touchmove.stop.prevent="stopPrevent"
			@tap="hideSpec"
		>
			<!-- 遮罩层 -->
			<view class="mask" @tap="hideSpec"></view>
			<view class="layer" :style="{bottom: bottom ? `${bottom}upx` : 0}" @tap.stop="stopPrevent">
				<rf-attr-content
					:product="productDetail"
					@toggle="toggleSpec"
					:showBuyBtn="true"
				></rf-attr-content>
			</view>
		</view>
	</view>
</template>
<script>
/**
 *  商品列表
 */
import { productDetail, cartItemCount, cartItemCreate } from '@/api/product';
import rfAttrContent from '@/components/rf-attr-content';
import $mAssetsPath from '@/config/assets.config';
import { mapMutations } from 'vuex';
export default {
	name: 'zProductList',
	props: {
		list: {
			type: Array,
			default() {
				return [];
			}
		},
		// 是否以列表展示 | 列表或大图
		isList: {
			type: Boolean,
			default: false
		},
		// 下边距
		bottom: {
			type: Number,
			default: 0
		}
	},
	components: {
		rfAttrContent
	},
	data() {
		return {
			specClass: 'none',
      moneySymbol: this.moneySymbol,
			productDetail: {}
		};
	},
	filters: {
		filterTotalSales(val) {
			if (val > 10000) {
				val = `${(val / 10000).toFixed(2)}万元`;
			}
			return val;
		},
		filterTagName(val) {
			if (val.commissionRate) {
				// 分销商品
				return $mAssetsPath.distribution;
			} else if (val.is_virtual === '1') {
				// 虚拟产品
				return $mAssetsPath.virtual;
			} else if (val.shipping_type === '1') {
				// 包邮产品
				return $mAssetsPath.pinkage;
			}
		}
	},
	methods: {
    ...mapMutations(['setCartNum']),
		// 跳转详情
		navTo(route) {
			this.$mRouter.push({ route });
		},
		// 获取产品详情
		async getProductDetail(row) {
			await this.$http
				.get(`${productDetail}`, {
					id: row.id
				})
				.then(async r => {
					this.productDetail = await r.data;
					this.productDetail.sku_name = row.sku_name;
					this.specClass = 'show';
				});
		},
		// 规格弹窗开关
		toggleSpec(row) {
			if (parseInt(row.status, 10) === 0) return;
			if (this.specClass === 'show') {
				this.specClass = 'hide';
				if (row.stock === 0) {
					this.$mHelper.toast('库存不足');
					return;
				}
				if (row.type.toString() === '1') {
					// 加入购物车
					this.handleCartItemCreate(row.skuId, row.cartCount);
				} else if (row.type.toString() === '2') {
					// 立即购买
					const list = {};
					const data = {};
					data.sku_id = row.skuId;
					data.num = row.cartCount;
					if (
						this.productDetail.point_exchange_type.toString() === '2' ||
						this.productDetail.point_exchange_type.toString() === '4' ||
						(this.productDetail.point_exchange_type.toString() === '3' &&
							this.isPointExchange)
					) {
						list.type = 'point_exchange';
					} else {
						list.type = 'buy_now';
					}
					list.data = JSON.stringify(data);
					this.navTo(`/pages/order/create/order?data=${JSON.stringify(list)}`);
				}
				setTimeout(() => {
					this.specClass = 'none';
				}, 250);
			} else if (this.specClass === 'none') {
				this.getProductDetail(row);
			}
		},
		stopPrevent() {},
		hideSpec() {
			this.specClass = 'hide';
			setTimeout(() => {
				this.specClass = 'none';
			}, 250);
		},
		// 添加商品至购物车
		async handleCartItemCreate(skuId, cartCount) {
			await this.$http
				.post(`${cartItemCreate}`, {
					sku_id: skuId,
					num: cartCount
				})
				.then(async () => {
					await this.$http.get(`${cartItemCount}`).then(async r => {
						this.setCartNum(r.data);
					});
					this.$mHelper.toast('添加购物车成功');
				});
		}
	}
};
</script>

<style lang="scss" scoped>
.rf-pro-content{
	.sublist-mark{
		margin-right: 10upx;
		color: white;
		border-radius: 6upx;
		padding: 4upx 14upx;
		vertical-align: top;
		font-size:24upx;
		&.special{
			background-color: #d74b4b;
		}
		&.orderenable{
			background-color: #2B8651;
		}
		&.booking{
			background-color: #FF9933;
		}
	}
}

</style>