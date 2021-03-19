<template>
	<view class="wrap">
		<co-navbar title="添加权限" :isBack="true"></co-navbar>
		<u-form :model="form" ref="uForm" label-width="160rpx">
			<u-form-item label="权限ID" prop="permissionID">
				<u-input type="text" v-model="form.permissionID" placeholder="请输入权限ID" />
			</u-form-item>
			<u-form-item label="权限名称" prop="permissionName">
				<u-input type="text" v-model="form.permissionName" placeholder="请输入权限名称" />
			</u-form-item>
			<u-form-item label="备注" prop="comment">
				<u-input type="textarea" v-model="form.comment" placeholder="请填写备注" />
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
				permissionID:'',
				permissionName: '',
				comment: '',
			},
			rules: {
				permissionID:[
					{
						required: true, 
						message: '请输入权限ID', 
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change','blur'],
					}
				],
				permissionName: [
					{ 
						required: true, 
						message: '请输入权限姓名', 
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change','blur'],
					}
				],
			}
		};
	},
	methods: {
		// 必须要在onReady生命周期，因为onLoad生命周期组件可能尚未创建完毕
		onReady() {
			this.$refs.uForm.setRules(this.rules);
		},
		// 提交表单
		submit() {
			this.$refs.uForm.validate(valid => {
				let data = {
					permissionID:this.form.permissionID,
					permissionName:this.form.permissionName,
					comment:this.form.comment
				}
				if (valid) {
					console.info("激活 addPermission >>>")
					this.loading = true
					uniCloud.callFunction({
						name:'application',
						data:{
							service:'permission',
							action: 'addPermission',
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
						console.info('addPermission Success <<<' , r.result.code)
					}).finall(()=>{this.loading = false})
				} else {
					console.log('验证失败');
				}
			});
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