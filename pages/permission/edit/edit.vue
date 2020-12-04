<template>
	<view class="wrap">
		<co-navbar title="修改权限" :isBack="true"></co-navbar>
		<u-form :model="form" ref="uForm" label-width="160rpx">
			<u-form-item label="权限ID" prop="permission_id">
				<u-input type="text" v-model="form.permission_id" placeholder="请输入权限ID" />
			</u-form-item>
			<u-form-item label="权限名称" prop="permission_name">
				<u-input type="text" v-model="form.permission_name" placeholder="请输入权限名称" />
			</u-form-item>
			<u-form-item label="备注" prop="comment">
				<u-input type="textarea" v-model="form.comment" placeholder="请填写备注" />
			</u-form-item>
		</u-form>
		<u-button @click="handleEdit" type="primary" :plain="plain" :loading="editLoading" :ripple="ripple" :disabled="disabled">提交</u-button>
		<u-button @click="handleDelete" type="error" :plain="plain" :loading="deleteLoading" :ripple="ripple" :custom-style="deleteStyle" :disabled="disabled">删除</u-button>
		<u-modal v-model="m_show" title="警告" content="确认删除该权限吗"  :mask-close-able="true" :show-cancel-button="true" @confirm="confirm" ref="uModal" :async-close="true"></u-modal>
		<co-toast ref="cToast"></co-toast>
	</view>
</template>

<script>
export default {
	data() {
		return {
			option:{},
			editLoading: false,
			deleteLoading:false,
			ripple: true,
			plain: true,
			disabled:false,
			deleteStyle:{
				marginTop: "20rpx"
			},
			// model
			m_show:false,
			form: {
				permission_id:'',
				permission_name: '',
				comment: '',
			},
			rules: {
				permission_id:[
					{
						required: true, 
						message: '请输入权限ID', 
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change','blur'],
					}
				],
				permission_name: [
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
		onLoad(option){
			this.option = JSON.parse(decodeURIComponent(option.item))
			Object.assign(this.form,this.option)
		},
		handleEdit() {
			let { form } = this
			this.$refs.uForm.validate(valid => {
				console.log(valid,1)
				let data = {
					permissionID:form.permission_id,
					permissionName:form.permission_name,
					comment:form.comment
				}
				if (valid) {
					// console.log( this.form, this.option,this.equal(this.form , this.option))
					console.info("激活 updatePermission >>>")
					
					this.editLoading = true
					this.disabled = true
					uni.showLoading({ title: '加载中' })
					
					uniCloud.callFunction({
						name:'application',
						data:{
							service:'permission',
							action: 'updatePermission',
							params: data
						}
					}).then((r)=>{
						uni.hideLoading();
						if(r.result.code == 0){
							let title = '修改成功'
							let type = 'success'
							this.show(title,type)
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
						console.info('updatePermission Success <<<' , r.result.code)
					}).finall(()=>{this.editLoading = false})
				} else {
					console.log('验证失败');
				}
			});
		},
		handleDelete(){
			let { form } = this
			this.m_show = true
		},
		confirm(){
			let { form } = this
			this.deleteLoading = true
			uniCloud.callFunction({
				name:'application',
				data:{
					service:'permission',
					action: 'deletePermission',
					params: {
						permissionID : form.permission_id + ''
					}
				}
			})
			.then((r)=>{
				uni.hideLoading();
				if(r.result.code == 0){
					this.m_show = false
					this.deleteLoading = false
					let title = '删除成功'
					let type = 'success'
					this.show(title,type)
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
				console.info('updatePermission Success <<<' , r.result.code)
			})
		},
		show(title , type){
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