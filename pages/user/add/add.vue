<template>
	<view class="wrap">
		<co-navbar title="添加用户" :isBack="true"></co-navbar>
		<u-form :model="model" :rules="rules" ref="uForm" :errorType="errorType">
			<u-form-item :leftIconStyle="{color: '#888', fontSize: '32rpx'}" left-icon="account" label-width="120" :label-position="labelPosition" label="姓名" prop="nickname">
				<u-input :border="border" placeholder="请输入姓名" v-model="model.nickname" type="text"></u-input>
			</u-form-item>
			<u-form-item label-width="120" :label-position="labelPosition" label="登录号" prop="username">
				<u-input :border="border" placeholder="请输入登录号" v-model="model.username" type="text"></u-input>
			</u-form-item>
			<u-alert-tips type="warning" :show-icon="true" :title="tip_title"></u-alert-tips>
			<u-form-item :label-position="labelPosition" label="性别" prop="sexStr">
				<u-input :border="border" type="select" :select-open="actionSheetShow" v-model="model.sexStr" placeholder="请选择性别" @click="actionSheetShow = true"></u-input>
			</u-form-item>
			<u-form-item :label-position="labelPosition" label="角色" label-width="150" prop="role">
				<u-checkbox-group @change="checkboxGroupChange" :width="radioCheckWidth" :wrap="radioCheckWrap">
					<u-checkbox 
					v-model="item.checked" v-for="(item, index) in roleList" 
					:key="index" :name="item.role_id"
					>{{ item.role_name}}</u-checkbox>
				</u-checkbox-group>
			</u-form-item>
			<u-form-item :label-position="labelPosition" label="注册年份" prop="registration" label-width="150">
				<u-input :border="border" type="select" :select-open="pickerShow" v-model="model.registration" placeholder="请选择注册年份" @click="pickerShow = true"></u-input>
			</u-form-item>
			<u-form-item :label-position="labelPosition" label="学院" prop="collegeStr" label-width="150">
				<u-input :border="border" type="select" :select-open="selectShow" v-model="model.collegeStr" placeholder="请选择学院" @click="selectShow = true"></u-input>
			</u-form-item>
		</u-form>
		<u-button @click="submit" :type="type" :plain="plain" :loading="loading" :ripple="ripple">提交</u-button>
		<u-action-sheet :list="actionSheetList" v-model="actionSheetShow" @click="actionSheetCallback"></u-action-sheet>
		<u-select mode="single-column" :list="collegeSelect" v-model="selectShow" @confirm="selectConfirm"></u-select>
		<u-picker mode="time" v-model="pickerShow" :params="pickerParams" @confirm="registrationConfirm"></u-picker>
		<co-toast ref="cToast"></co-toast>
	</view>
</template>

<script>
export default {
	data() {
		let that = this;
		return {
			loading: false,
			ripple: true,
			plain: true,
			type:'primary',
			model: {
				nickname: '',
				username:'',
				password:'123456',
				sex: '',
				sexStr:'',
				role: [],
				registration: '',
				college: '',
				collegeStr:''
			},
			tip_title: '初始密码默认123456',
			collegeSelect: [],
			rules: {
				nickname: [
					{
						required: true,
						message: '请输入姓名',
						trigger: 'blur' ,
					},
					{
						min: 3,
						max: 5,
						message: '姓名长度在3到5个字符',
						trigger: ['change','blur'],
					},
					{
						// 此为同步验证，可以直接返回true或者false，如果是异步验证，稍微不同，见下方说明
						validator: (rule, value, callback) => {
							// 调用uView自带的js验证规则，详见：https://www.uviewui.com/js/test.html
							return this.$u.test.chinese(value);
						},
						message: '姓名必须为中文',
						// 触发器可以同时用blur和change，二者之间用英文逗号隔开
						trigger: ['change','blur'],
					},
				],
				role: [
					{
						required: true,
						message: '请选择角色',
						trigger: 'change',
						type: 'array',
					}
				],
				sexStr: [
					{
						required: true,
						message: '请选择性别',
						trigger: 'change'
					},
				],
				registration: [
					{
						required: true,
						message: '请选择注册年份',
						trigger: 'change',
					}
				],
				college: [
					{
						required: true,
						message: '请选择学院',
						trigger: 'change',
					}
				],
			},
			border: false,
			check: false,
			selectStatus: 'close',
			roleList: [],
			actionSheetList: [
				{
					text: '男',
					value:1
				},
				{
					text: '女',
					value:2
				}
			],
			actionSheetShow: false,
			pickerShow: false,
			pickerParams:{
				year: true,
				month: true,
			},
			selectShow: false,
			radioCheckWidth: 'auto',
			radioCheckWrap: false,
			labelPosition: 'left',
			codeTips: '',
			errorType: ['message'],
		};
	},
	async onLoad() {
		// 学院列
		let collegeSelect = uni.getStorageSync('collegeSelect')
		if(this.$u.test.isEmpty(collegeSelect)){
			console.info('触发函数 getCollegeSelect >>>')
			await uniCloud.callFunction({
				name:'application',
				data:{
					service:'college',
					action: 'getCollegeSelect'
				}
			}).then((r)=>{
				if(r.result.code == 0 ){
					collegeSelect = r.result.collegeSelect
					uni.setStorageSync('collegeSelect', collegeSelect)
				}
				console.info('getCollegeSelect Success <<<' , r)
			})
		}
		this.collegeSelect = collegeSelect
		// 角色列
		let roleList = uni.getStorageSync('roleList')
		if(this.$u.test.isEmpty(roleList)){
			console.info('触发函数 getRoleList >>>')
			await uniCloud.callFunction({
				name:'application',
				data:{
					service:'role',
					action: 'getRoleList'
				}
			}).then((r)=>{
				if(r.result.code == 0 ){
					roleList = r.result.roleList
					uni.setStorageSync('roleList',roleList)
				}
				console.info('getRoleList Success <<<' , r)
			})
		}
		roleList.forEach((item)=>{
			this.roleList.push(Object.assign(item,{checked: false})) 
		})
	},
	computed: {
		borderCurrent() {
			return this.border ? 0 : 1;
		}
	},
	onReady() {
		this.$refs.uForm.setRules(this.rules);
	},
	methods: {
		submit() {
			this.$refs.uForm.validate(valid => {
				if (valid) {
					console.log(this.model);
					console.info("激活 addUser >>>")
					this.loading = true
					uniCloud.callFunction({
						name:'application',
						data:{
							service:'user',
							action: 'addUser',
							params: this.model
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
						console.info('addUser Success <<<' , r.result.code)
					}).finall(()=>{this.loading = false})
				} else {
					console.log('验证失败');
				}
			});
		},
		// 点击actionSheet回调
		actionSheetCallback(index) {
			uni.hideKeyboard();
			this.model.sex = this.actionSheetList[index].value
			this.model.sexStr = this.actionSheetList[index].text;
		},
		// checkbox选择发生变化
		checkboxGroupChange(e) {
			this.model.role = e;
		},
		// radio选择发生变化
		radioGroupChange(e) {
			this.model.payType = e;
		},
		// 选择注册年份回调
		registrationConfirm(e) {
			this.model.registration = e.year + '-' + e.month
		},
		// 选择学院回调
		selectConfirm(e) {
			this.model.collegeStr = '';
			this.model.college = e[0].value
			this.model.collegeStr = e[0].label
		},
		// 成功提示
		show(){
			let title = '添加成功'
			let type = 'success'
			this.$refs.cToast.showToast(title , type)
		}
	}
};
</script>

<style scoped lang="scss">
.wrap {
	padding: 30rpx;
}
</style>
