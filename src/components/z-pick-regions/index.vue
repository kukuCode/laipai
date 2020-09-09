<template>
  <picker
  class="pick-region"
    mode="multiSelector"
    @change="bindMultiChange"
    @columnchange="bindMultiPickerColumnChange"
    :value="multiIndex"
    :range-key="rangeKey"
    :range="multiArray.slice(0,defaultLevel)"
  ><view class="region-str">{{ multiStr }}</view></picker>
</template>

<script>
/* eslint-disable */
import { provinceList } from '@/api/basic';
export default {
	props: {
		// defaultRegions: {
		//     type: Array,
		// }
		customFirstName: {
			type: String,
			default: "不限",
		},
		rangeKey:{
			type: String,
			default:'name'
		},
		defaultLevel: {
			type: Number,
			default: 3
		},
		addressData: {
			type: Object,
			default() {
				return {};
			}
		}
	},
	data() {
		return {
			multiArray: [],
			multiIndex: [0, 0, 0],
			multiIndex: [0, 0, 0],
      		multiIndexClone: [0, 0, 0],
			multiStr: '全省',
			customRecord: [{code: "00",id: "00", name: this.customFirstName}]
		};
	},
	mounted() {
	  this.$mHelper.log(this.addressData);
		this.getProvinceList();
	},
	methods: {
		bindMultiChange(e){
			debugger;
			this.multiIndexClone = e.detail.value;
			this.multiArrayClone = JSON.parse(JSON.stringify(this.multiArray));
			const arr = [];
			const showName = []
			for (let index = 0; index < this.defaultLevel; index++) {
				let selectedCol = this.multiArrayClone[index][this.multiIndexClone[index]]
				if(selectedCol.code !== '00') {
					arr.push(selectedCol.code)
					showName.push(selectedCol.name)
				}
			}
debugger;
			// this.multiStr = `$this.multiArrayClone[this.defaultLevel-1][this.multiIndexClone[this.defaultLevel-1]].name}`
			this.multiStr = showName[showName.length-1]
			this.$emit("selecteRegion", arr, this.multiStr);
		},
		async getProvinceList() {
			let provinceIndex = 0;
			let cityIndex = 0;
			let areaIndex = 0;
		/* 	let province_name = null;
			let city_name = null;
			let area_name = null; */
			await this.$http.get(`${provinceList}`).then(async r => {
				let list = r.data
				if(Array.isArray(list)) {
					// const column1 = list;
					const column1 = [{code: "-1",id: "-1", name: '全省', children:[]}].concat(list);
					const column2 = this.customRecord.concat(column1[0].children);
					const column3 = this.customRecord.concat(column2[0].children);

					this.multiArray = [column1, column2, column3];
					this.multiArrayClone = JSON.parse(JSON.stringify(this.multiArray));
					  debugger;
					// this.multiStr = `${this.multiArray[this.defaultLevel-1][0].name}`

				}
			});
		},
		bindMultiPickerColumnChange(e) {

			let data = {
				multiArray: this.multiArray,
				multiIndex: this.multiIndex,
			};
			debugger;
			data.multiIndex[e.detail.column] = e.detail.value;
			const column = e.detail.column; // 移动某一列

			if (column === 0) {
				//移动第一列
				const row = data.multiIndex[0]; //移动第一列的某一行

			/* 	data.multiArray[1] = data.multiArray[0][row].children;
				data.multiArray[2] = data.multiArray[1][0].children; */
				data.multiArray[1] = this.customRecord.concat(data.multiArray[0][row].children);
				data.multiArray[2] = this.customRecord.concat(data.multiArray[1][0].children);
				data.multiIndex[1] = 0;
				data.multiIndex[2] = 0;
			} else if (column === 1) {
				//移动第二列
				const row = data.multiIndex[1]; //移动第一列的某一行
				data.multiArray[2] = data.multiArray[1][row].children;
				data.multiIndex[2] = 0;
			}

			this.multiArray = [...data.multiArray];
			this.multiIndex = [...data.multiIndex];

			this.$emit('columnChange', JSON.parse(JSON.stringify(this.multiArray)));
		}
		
	}
};
</script>
<style lang="scss" scoped>
.pick-region,.region-str{
	    overflow: hidden;
    text-overflow: ellipsis;
}
</style>