<template>
	<view class="content">
		<co-navbar title="角色"></co-navbar>
		<view class="title">角色列表</view>
		<co-table label="添加角色" :addUrl="addUrl" :editUrl="editUrl" :nameList="roleName" :list="roleList" :labelList="labelList"></co-table>
		<co-tabbar></co-tabbar>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				roleName:['角色ID' , '角色名称' , '备注' , '操作' ], //表格的头
				labelList:['role_id','role_name','comment'], // 表格的字段
				roleList:[], //表格的数据
				addUrl:'/pages/role/add/add', // 添加的跳转
				editUrl:'/pages/role/edit/edit' //修改的跳转
			}
		},
		methods: {
			async onLoad(){
				await this.getRoleList()
			},
			getRoleList(data){
				console.info('触发函数 getRoleList >>>')
				uniCloud.callFunction({
					name:'application',
					data:{
						service:'role',
						action: 'getRoleList',
						params: data
					}
				}).then((r)=>{
					if(r.result.code == 0 ){
						this.roleList = r.result.roleList
						uni.setStorageSync('roleList', this.roleList)
					}
					console.info('getRoleList Success <<<' , r,r.result ,this.roleList)
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
