<template>
	<view class="wrap">
		<co-navbar title="登录" :isBack="false"></co-navbar>
		<view class="top"></view>
		<view class="content">
			<view class="title">欢迎登录选课系统</view>
			<u-field
				v-model="username"
				label="学号"
				placeholder="请填写学号"
				:required="required"
				type="text"
			>
			</u-field>
			<u-field
				v-model="password"
				label="密码"
				placeholder="请填写密码"
				:required="required"
				:password="true"
			>
			</u-field>
			<u-loading class="loading" :mode="lo_mode" :show="loading" :color="lo_color" :size="lo_size"></u-loading>
			<button @tap="login" :style="[inputStyle]" :disabled="disabled" class="getCaptcha">登录</button>
			<view class="alternative">
				<view class="password">微信登录</view>
				<view class="issue">遇到问题</view>
			</view>
		</view>
		<view class="buttom">
			<view class="hint">
				登录代表同意
				<text class="link">用户协议、隐私政策，</text>
				并授权使用您的账号信息（如昵称、收获地址）以便您统一管理
			</view>
		</view>
		<u-toast ref="uToast" />
		
	</view>
</template>

<script>
import {mapState, mapMutations} from 'vuex'

export default {
	data() {
		return {
			required: false,
			username:'',
			password:'',
			disabled:true,
			to_title: '',
			to_type: '',
			to_url: '',
			loading:false,
			lo_mode:'circle',
			lo_color:this.$u.color['success'],
			lo_size: '100'
		}
	},
	computed: {
		...mapState(['forcedLogin']),
		inputStyle() {
			let style = {};
			if(this.username) {
				this.disabled = false
				style.color = "#fff";
				style.backgroundImage = 'linear-gradient(45deg,  rgb(141, 198, 63), rgb(28, 187, 180))'
			}
			return style;
		}
	},
	methods: {
		...mapMutations(['login']),
		onLoad(){
			console.info('进入登录页面')
			const uniIdToken = uni.getStorageSync('uniIdToken');
			if(uniIdToken != ''){
				console.info('触发函数 checkToken >>>')
				this.loading = true
				uniCloud.callFunction({
					name:'application',
					data:{
						service:'user',
						action: 'checkToken',
						params: uniIdToken
					}
				}).then((r)=>{
					if(r.result.code === 0){
						uni.switchTab({
						    url: '/pages/main/main'
						});
					}
					let { message , code , uid } = r.result
					console.info('checkToken Success',r.result )
				}).finally(()=>{ this.loading = false })
			}
		},
		login(){
			if (this.username.length < 3) {
				uni.showToast({
					icon: 'none',
					title: '账号最短为 3 个字符'
				});
				return;
			}
			if (this.password.length < 6) {
				uni.showToast({
					icon: 'none',
					title: '密码最短为 6 个字符'
				});
				return;
			}
			const data = {
				username: this.username,
				password: this.password
			};
			let _self = this;
			console.log("启动login >>>")
			this.loading = true
			uniCloud.callFunction({
				name: 'application',
				data: {
					service: 'user',
					action: 'login',
					params: data
				}
			}).then((e) => {
				this.loading = false
				console.log('login success', e.result);
				if (e.result.code == 0) {
					uni.setStorageSync('uniIdToken', e.result.token)
					uni.setStorageSync('username', e.result.username)
					uni.setStorageSync('login_type', 'online')
					this.to_title = e.result.msg
					this.to_type = "success"
					this.to_url = "/pages/main/main"
					this.isTab
					this.showToast()
				} else {
					this.to_title = e.result.msg
					this.to_type = "error"
					this.showToast()
					console.log('登录失败', e);
				}
			}).catch((e) =>{
				this.loading = false
				console.log('login error', e);
				this.to_title = JSON.stringify(e)
				this.to_type = "error"
				this.showToast()
			})
		},
		showToast() {
			this.$refs.uToast.show({
				title: this.to_title,
				type: this.to_type,
				url: this.to_url,
				isTab:true
			})
		},
		toMain(userName) {
			this.login(userName);
			/**
			 * 强制登录时使用reLaunch方式跳转过来
			 * 返回首页也使用reLaunch方式
			 */
			if (this.forcedLogin) {
				uni.reLaunch({
					url: '../main/main',
				});
			} else {
				uni.navigateBack();
			}
		
		},
	}
};
</script>

<style lang="scss" scoped>
.wrap {
	font-size: 28rpx;
	.content {
		width: 600rpx;
		margin: 80rpx auto 0;
		.loading{
			position: absolute;
			z-index: 999;
			margin-top: -50rpx;
			margin-left: 35%;
		}
		.title {
			text-align: center;
			font-size: 60rpx;
			font-weight: 500;
			margin-bottom: 100rpx;
		}
		input {
			text-align: left;
			margin-bottom: 10rpx;
			padding-bottom: 6rpx;
		}
		.tips {
			color: $u-type-info;
			margin-bottom: 60rpx;
			margin-top: 8rpx;
		}
		.getCaptcha {
			background-color: rgb(220, 253, 234);
			color: $u-tips-color;
			border: none;
			font-size: 30rpx;
			padding: 12rpx 0;
			
			&::after {
				border: none;
			}
		}
		.alternative {
			color: $u-tips-color;
			display: flex;
			justify-content: space-between;
			margin-top: 30rpx;
		}
	}
	.buttom {
		.loginType {
			display: flex;
			padding: 350rpx 150rpx 150rpx 150rpx;
			justify-content:space-between;
			
			.item {
				display: flex;
				flex-direction: column;
				align-items: center;
				color: $u-content-color;
				font-size: 28rpx;
			}
		}
		
		.hint {
			width: 700rpx;
			margin: 0 auto;
			padding: 30rpx 50rpx;
			font-size: 20rpx;
			color: $u-tips-color;
			.link {
				margin: 0 auto;
				
				color: $u-type-warning;
			}
		}
	}
}
</style>
