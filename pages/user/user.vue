<template>
	<view class="content">
		<co-navbar title="用户"></co-navbar>
		<view class="title">用户列表</view>
		<co-table label="添加用户" :addUrl="addUrl" :editUrl="editUrl" :nameList="userName" :list="userList" :labelList="labelList"></co-table>
		<co-tabbar></co-tabbar>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userName:['学号' , '用户姓名' , '学院' , '操作' ], //表格的头
				labelList:['username','nickname','collegeStr'], // 表格的字段
				userList:[], //表格的数据
				addUrl:'/pages/user/add/add', // 添加的跳转
				editUrl:'/pages/user/edit/edit' //修改的跳转
			}
		},
		methods: {
			async onLoad(){
				await this.getRoleList()
			},
			getRoleList(data){
				console.info('触发函数 getUserList >>>')
				uniCloud.callFunction({
					name:'application',
					data:{
						service:'user',
						action: 'getUserList',
						params: data
					}
				}).then((r)=>{
					if(r.result.code == 0 ){
						this.userList = r.result.userList
						uni.setStorageSync('userList', this.userList)
					}
					console.info('getUserList Success <<<' , r)
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
