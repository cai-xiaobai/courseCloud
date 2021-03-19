<template>
	<view class="content">
		<co-navbar title="权限"></co-navbar>
		<view class="title">权限列表</view>
		<co-table label="添加权限" :addUrl="addUrl" :editUrl="editUrl"  :nameList="permissionName" :list="permissionList" :labelList="labelList"></co-table>
		<co-tabbar></co-tabbar>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				permissionName:['权限ID' , '权限名称' , '备注' , '操作' ], //表格的标题
				labelList:['permission_id','permission_name','comment'], // 表格的字段
				permissionList:[], //表格的数据
				addUrl:'/pages/permission/add/add' ,// 添加的跳转
				editUrl:'/pages/permission/edit/edit' //修改的跳转
			}
		},
		methods: {
			async onLoad(){
				await this.getPermissionList()
			},
			getPermissionList(data){
				console.info('触发函数 getPermissionList >>>')
				//触发权限验证
				uniCloud.callFunction({
					name:'application',
					data:{
						service:'permission',
						action: 'getPermissionList',
						params: data
					}
				}).then((r)=>{
					if(r.result.code == 0 ){
						this.permissionList = r.result.permissionList
						uni.setStorageSync('permissionList', this.permissionList)
					}
					console.info('getPermissionList Success <<<' , r,r.result)
				})
			}
		}
	}
</script>

<style>
	.content {
		padding-bottom: 30px;
	}
	.title {
		font-weight: bold;
		text-align: center;
		padding: 20px 0 10px 0px;
		font-size: 20px;
	}

	.tips {
		color: #999999;
		font-size: 14px;
		padding: 20px 30px;
	}

	.btn-list {
		padding: 0px 30px;
	}

	.btn-list button {
		margin-bottom: 20px;
	}

	.upload-preview {
		width: 100%;
	}
</style>
