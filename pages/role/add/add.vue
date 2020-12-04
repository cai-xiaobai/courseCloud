<template>
	<view class="wrap">
		<co-navbar title="添加角色" :isBack="true"></co-navbar>
		<u-form :model="form" ref="uForm">
			<u-form-item label="角色ID" prop="roleID">
				<u-input type="text" v-model="form.roleID" placeholder="请输入角色ID" />
			</u-form-item>
			<u-form-item label="角色" prop="roleName">
				<u-input type="text" v-model="form.roleName" placeholder="请输入角色姓名" />
			</u-form-item>
			<u-form-item label="简介" prop="comment">
				<u-input type="textarea" v-model="form.comment" placeholder="请填写简介" />
			</u-form-item>
			<u-form-item label="权限" prop="permission">
				<u-checkbox-group @change="checkboxGroupChange" :activeColor="activeColor">
					<u-checkbox 
						v-model="item.checked" 
						v-for="(item,index) in permissionList" :key="index" 
						:name="item.permission_id"
					>{{item.permission_name}}</u-checkbox>
				</u-checkbox-group>
				<u-button @click="checkedAll" size="mini">全选</u-button>
				
			</u-form-item>
		</u-form>
		<u-button @click="submit">提交</u-button>
	</view>
</template>

<script>
export default {
	data() {
		return {
			form: {
				roleID:'',
				roleName: '',
				comment: '',
			},
			permissionList: [],
			activeColor: '#2979ff',
			result:[],
			rules: {
				roleID:[
					{
						required: true, 
						message: '请输入角色ID', 
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change','blur'],
					}
				],
				roleName: [
					{ 
						required: true, 
						message: '请输入角色姓名', 
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change','blur'],
					}
				],
			}
		};
	},
	methods: {
		onLoad(){
			
			let permissionList = JSON.parse(JSON.stringify(uni.getStorageSync('permissionList')))
			permissionList.forEach((item)=>{
				this.permissionList.push(Object.assign(item,{checked: false})) 
			})
			
			if(this.permissionList){
				return
			}
			console.info("激活 getPermissionList >>>")
			uniCloud.callFunction({
				name:'application',
				data:{
					service:'permission',
					action: 'getPermissionList'
				}
			}).then((r)=>{
				this.list = r.result.permissionList
				console.info("getPermissionList success <<<" , r.result)
			})
		},
		// 必须要在onReady生命周期，因为onLoad生命周期组件可能尚未创建完毕
		onReady() {
			this.$refs.uForm.setRules(this.rules);
			
			console.info(this.permissionList)
		},
		submit() {
			this.$refs.uForm.validate(valid => {
				if (valid) {
					console.log('验证通过');
				} else {
					console.log('验证失败');
				}
			});
		},
		// 选中任一checkbox时，由checkbox-group触发
		checkboxGroupChange(e) {
			this.result = e
			console.info(this.result)
		},
		// 全选
		checkedAll() {
			this.permissionList.map(val => {
				val.checked = true;
			})
		}
	},
};
</script>

<style scoped lang="scss">
.wrap {
	padding: 30rpx;
}
</style>