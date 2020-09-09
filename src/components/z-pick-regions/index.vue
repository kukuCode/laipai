<template>
  <picker
    mode="multiSelector"
    @change="bindMultiChange"
    @columnchange="bindMultiPickerColumnChange"
    :value="multiIndex"
    :range-key="rangeKey"
    :range="multiArray.slice(0,defaultLevel)"
  >{{ multiStr }}</picker>
</template>

<script>
/* eslint-disable */
import { provinceList } from '@/api/basic';
export default {
	props: {
		// defaultRegions: {
		//     type: Array,
		// }
		customItem: {
			type: String,
			default: "",
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
			multiStr: ''
		};
	},
	 customItem: {
      handler: function (nVal, oVal) {
        if (nVal) {
			debugger;
          this.multiArray = this.setDefaultFirstOption();
        }
      },
      immediate: true,
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
			for (let index = 0; index < this.defaultLevel; index++) {
				arr.push(this.multiArrayClone[index][this.multiIndexClone[index]].code);
			}

			this.multiStr = `${this.multiArray[this.defaultLevel-1][0].name}`
			this.$emit("selecteRegion_", arr);
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
					const column1 = list;
					const column2 = column1[0].children;
					const column3 = column2[0].children;

					this.multiArray = [column1, column2, column3];
					this.multiArrayClone = JSON.parse(JSON.stringify(this.multiArray));
					  debugger;
					this.multiStr = `${this.multiArray[this.defaultLevel-1][0].name}`

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
				data.multiArray[1] = data.multiArray[0][row].children;
				data.multiArray[2] = data.multiArray[1][0].children;
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

			return;


			
			this.multiIndex[e.detail.column] = e.detail.value;
			let provinceIndex = 0;
			let cityIndex = 0;
			let areaIndex = 0;
			let province_name = null;
			let city_name = null;
			let area_name = null;
			switch (e.detail.column) {
				case 0: //拖动第1列
					
					
					break;
				case 1: //拖动第2列
					
					break;
				case 2: //拖动第3列
					if (this.multiIndex[0] === this.multiIndex[0]) {
            if (this.multiIndex[1] === this.multiIndex[1]) {
              if (this.multiIndex[2] === this.multiIndex[2]) {
                this.addressData.province_id = this.multiArray[0][
	                this.multiIndex[0]
                ].id;
                province_name = this.multiArray[0][this.multiIndex[0]]
	                .title;
                this.addressData.city_id = this.multiArray[1][
	                this.multiIndex[1]
                ].id;
                city_name = this.multiArray[1][this.multiIndex[1]].title;
                this.addressData.area_id = this.multiArray[2][
	                e.detail.value
                ].id;
                area_name = this.multiArray[2][e.detail.value].title;
                areaIndex = e.detail.value;
                this.multiIndex = [
	                this.multiIndex[0],
	                this.multiIndex[1],
	                areaIndex
                ];
                // this.multiStr = `${province_name}, ${city_name}, ${area_name}`;
                this.multiStr = `${area_name}`;
              }
            }
          }
					break;
			}
			this.$emit('getRegions', this.addressData);
		},
		setDefaultFirstOption() {
			let region = uni.getStorageSync("region");
			region["00"] = {
				code: "00",
				name: this.customItem,
				child: {
				"00": {
					code: "00",
					region_name: this.customItem,
					child: {
					"00": {
						code: "00",
						name: this.customItem,
					},
					},
				},
				},
			};

			for (const provinceK in region) {
				if (region.hasOwnProperty(provinceK)) {
				const province = region[provinceK];
				if (province.child) {
					province.child["00"] = {
					region_id: "00",
					region_name: this.customItem,
					child: {
						"00": {
						region_id: "00",
						region_name: this.customItem,
						},
					},
					};
				}

				for (const cityK in province.child) {
					if (province.child.hasOwnProperty(cityK)) {
					const city = province.child[cityK];
					if (city.child) {
						city.child["00"] = {
						region_id: "00",
						region_name: this.customItem,
						};
					}
					}
				}
				}
			}
			return region;
		},
		
	}
};
</script>
