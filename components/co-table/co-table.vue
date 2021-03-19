<template>
	<view>
		<!-- icon -->
		<view class="add">
			<u-icon name="plus-circle" size="60" color="#2979ff" :label="label" @click="handleAdd" ></u-icon>
		</view>
		<!-- table -->
		<u-table>
			<u-tr class="u-tr">
				<u-th class="u-th">{{nameList[0]}}</u-th>
				<u-th class="u-th">{{nameList[1]}}</u-th>
				<u-th class="u-th">{{nameList[2]}}</u-th>
				<u-th class="u-th">{{nameList[3]}}</u-th>
			</u-tr>
			<view v-for="(item,index) in list" :key="index">
				<u-tr class="u-tr" >
					<u-td class="u-td">{{item[`${labelList[0]}`]}}</u-td>
					<u-td class="u-td">{{item[`${labelList[1]}`]}}</u-td>
					<u-td class="u-td">{{item[`${labelList[2]}`]}}</u-td>
					<u-td class="u-td">
						<u-button size="mini" type="primary" :custom-style="customStyle" @click="handleEdit(item)">修改</u-button>
					</u-td>
				</u-tr>
			</view>
		</u-table>
	</view>
</template>

<script>
import {mapState, mapMutations} from 'vuex'
export default {
	props:{
		label:String,
		addUrl:String,
		editUrl:String,
		nameList:Array,
		list:Array,
		labelList:Array
	},
	data() {
		return {
			tableList: [],
			uniIdToken:'',
			customStyle: {
				height:'55rpx'
			},
			boxList: [
				{
					name: 'apple',
					checked: false,
					disabled: false
				},
				{
					name: 'banner',
					checked: false,
					disabled: false
				},
				{
					name: 'orange',
					checked: false,
					disabled: false
				}
			],
		}
	},
	computed: { ...mapState(['forcedLogin']) },
	methods: {
		...mapMutations(['login']),
		handleAdd(){
			uni.navigateTo({
			    url: this.addUrl
			});
		},
		handleEdit(row){
			uni.navigateTo({
			    url: this.editUrl + '?item=' + encodeURIComponent(JSON.stringify(row))
			});
		}
	}
}
</script>

<style scoped lang="scss">
	.add{
		display: flex;
		flex-direction: row-reverse;
		margin: -20rpx 20rpx 0;
	}	
	.wrap {
		padding: 24rpx;
	}

	.u-row {
		margin: 40rpx 0;
	}
	.u-td{
		height: 90rpx;
		weight: 90rpx;
	}
	.demo-layout {
		height: 80rpx;
		border-radius: 8rpx;
	}

	.bg-purple {
		background: #d3dce6;
	}

	.bg-purple-light {
		background: #e5e9f2;
	}

	.bg-purple-dark {
		background: #99a9bf;
	}
</style>