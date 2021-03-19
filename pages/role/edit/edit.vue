<template>
	<view class="wrap">
		<co-navbar title="修改角色" :isBack="true"></co-navbar>
		<u-form :model="form" ref="uForm" label-width="160rpx">
			<u-form-item label="角色ID" prop="role_id">
				<u-input type="text" disabled="true" v-model="form.role_id" />
			</u-form-item>
			<u-alert-tips type="warning" :show-icon="true" :title="tip_title"></u-alert-tips>
			<u-form-item label="角色名称" prop="role_name">
				<u-input type="text" v-model="form.role_name" placeholder="请输入角色名称" />
			</u-form-item>
			<u-form-item label="备注" prop="comment">
				<u-input type="textarea" v-model="form.comment" placeholder="请填写备注" />
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
		<u-button @click="handleEdit" type="primary" :plain="plain" :loading="editLoading" :ripple="ripple" :disabled="disabled">提交</u-button>
		<u-button @click="handleDelete" type="error" :plain="plain" :loading="deleteLoading" :ripple="ripple" :custom-style="deleteStyle" :disabled="disabled">删除</u-button>
		<u-modal v-model="m_show" title="警告" content="确认删除该角色吗"  :mask-close-able="true" :show-cancel-button="true" @confirm="confirm" ref="uModal" :async-close="true"></u-modal>
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
			tip_title: '角色ID禁止修改',
			// all权限列表
			perlist:[], 
			deleteStyle:{
				marginTop: "20rpx"
			},
			// model
			m_show:false,
			form: {
				role_id:'',
				role_name: '',
				comment: '',
				permission:[]
			},
			rules: {
				role_id:[
					{
						required: true, 
						message: '请输入权限ID', 
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change','blur'],
					}
				],
				role_name: [
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
	computed: {
		permissionList({perlist , form}){
			let {permission} = form
			perlist.forEach((item)=>{
				permission.map((r)=>{
					if(item.permission_id == r) {
						item.checked = true;
					}
				})
			})
			return perlist
		}
	},
	methods: {
		// 必须要在onReady生命周期，因为onLoad生命周期组件可能尚未创建完毕
		onReady() {
			this.$refs.uForm.setRules(this.rules);
		},
		onLoad(option){
			this.option = JSON.parse(decodeURIComponent(option.item))
			Object.assign(this.form,this.option)
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
					permissionList = r.result.permissionList
					uni.setStorageSync('permissionList',permissionList)
					console.info("getPermissionList success <<<" , r.result)
				})
			}
			permissionList.forEach((item)=>{
				this.perlist.push(Object.assign(item,{checked: false})) 
			})
		},
		handleEdit() {
			let { form } = this
			this.$refs.uForm.validate(valid => {
				let data = {
					roleID    : this.form.role_id,
					roleName  : this.form.role_name,
					comment   : this.form.comment,
					permission: this.form.permission
				}
				if (valid) {
					console.info("激活 updateRole >>>")
					this.editLoading = true
					this.disabled = true
					uni.showLoading({ title: '加载中' })
					
					uniCloud.callFunction({
						name:'application',
						data:{
							service:'role',
							action: 'updateRole',
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
						console.info('updateRole Success <<<' , r)
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
		// 确认删除角色
		confirm(){
			let { form } = this
			this.deleteLoading = true
			uniCloud.callFunction({
				name:'application',
				data:{
					service:'role',
					action: 'deleteRole',
					params: {
						roleID : form.role_id + ''
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
		// 选中任一checkbox时，由checkbox-group触发
		checkboxGroupChange(e) {
			this.form.permission = e
		},
		// 全选
		checkedAll() {
			// 置空初始化
			this.form.permission= []
			this.permissionList.map(val => {
				this.form.permission.push(val.permission_id)
				val.checked = true;
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