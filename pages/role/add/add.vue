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
		<u-button @click="submit" :type="type" :plain="plain" :loading="loading" :ripple="ripple">提交</u-button>
		<co-toast ref="cToast"></co-toast>
	</view>
</template>

<script>
export default {
	data() {
		return {
			loading: false,
			ripple: true,
			plain: true,
			type:'primary',
			form: {
				roleID:'',
				roleName: '',
				comment: '',
				result:[]
			},
			permissionList: [],
			activeColor: '#2979ff',
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
			// 加载权限列表
			let permissionList = JSON.parse(JSON.stringify(uni.getStorageSync('permissionList')))
			if(this.$u.test.isEmpty(permissionList)){
				console.info("激活 getPermissionList >>>")
				uniCloud.callFunction({
					name:'application',
					data:{
						service:'permission',
						action: 'getPermissionList'
					}
				}).then((r)=>{
					permissionList  = r.result.permissionList
					uni.setStorageSync('permissionList',permissionList)
					console.info("getPermissionList success <<<" , r.result)
				})
			}
			permissionList.forEach((item)=>{
				this.permissionList.push(Object.assign(item,{checked: false})) 
			})
		},
		// 必须要在onReady生命周期，因为onLoad生命周期组件可能尚未创建完毕
		onReady() {
			this.$refs.uForm.setRules(this.rules);
		},
		// 提交表单
		submit() {
			this.$refs.uForm.validate(valid => {
				let {roleID, roleName, comment, result} = this.form
				let data = {
					roleID,
					roleName,
					comment,
					permission:result
				}
				if (valid) {
					console.info("激活 addRole >>>")
					this.loading = true
					uniCloud.callFunction({
						name:'application',
						data:{
							service:'role',
							action: 'addRole',
							params: data
						}
					}).then((r)=>{
						this.show()
						if(r.result.code == 0){
							setTimeout(()=>{
								uni.navigateBack({
									delta:1,
									success(e){
										var page = getCurrentPages().pop();
										if (page == undefined || page == null) return;
										page.onLoad();
									}
								});
							},2000)
						}
						console.info('addRole Success <<<' , r.result.code)
					}).finall(()=>{this.loading = false})
				} else {
					console.log('验证失败');
				}
			});
		},
		// 选中任一checkbox时，由checkbox-group触发
		checkboxGroupChange(e) {
			this.form.result = e
		},
		// 全选
		checkedAll() {
			// 置空初始化
			this.form.result= []
			this.permissionList.map(val => {
				this.form.result.push(val.permission_id)
				val.checked = true;
			})
		},
		// 成功提示
		show(){
			let title = '添加成功'
			let type = 'success'
			this.$refs.cToast.showToast(title , type)
		}
	},
};
</script>

<style scoped lang="scss">
.wrap {
	padding: 30rpx;
}
</style>