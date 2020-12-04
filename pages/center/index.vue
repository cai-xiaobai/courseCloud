<template>
	<view>
		<co-navbar title="用户中心"></co-navbar>
		<view class="u-flex user-box u-p-l-30 u-p-r-20 u-p-b-30">
			<view class="u-m-r-10">
				<u-avatar :src="pic" size="140"></u-avatar>
			</view>
			<view class="u-flex-1">
				<view class="u-font-18 u-p-b-20">{{nickName}}</view>
				<view class="u-font-14 u-tips-color">学号:{{userName}}</view>
			</view>
			<view class="u-m-l-10 u-p-10">
				<u-icon name="arrow-right" color="#969799" size="28"></u-icon>
			</view>
		</view>
		
		<view class="u-m-t-20">
			<u-cell-group>
				<u-cell-item icon="rmb-circle" title="支付"></u-cell-item>
			</u-cell-group>
		</view>
		
		<view class="u-m-t-20">
			<u-cell-group>
				<u-cell-item icon="star" title="收藏"></u-cell-item>
				<u-cell-item icon="photo" title="相册"></u-cell-item>
				<u-cell-item icon="coupon" title="卡券"></u-cell-item>
				<u-cell-item icon="heart" title="关注"></u-cell-item>
			</u-cell-group>
		</view>
		
		<view class="u-m-t-20">
			<u-cell-group>
				<u-cell-item icon="setting" @click="logout" title="退出"></u-cell-item>
			</u-cell-group>
		</view>
		<co-tabbar></co-tabbar>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'
	export default {
		computed: mapState(['forcedLogin', 'hasLogin', 'userName']),
		data() {
			return {
				pic:'https://uviewui.com/common/logo.png',
				show:true,
				uniIdToken:'',
				nickName:''
			}
		},
		onLoad() {
			
		},
		methods: {
			...mapMutations(['login']),
			onLoad() {
				const loginType = uni.getStorageSync('login_type')
				if (loginType === 'local') {
					this.login(uni.getStorageSync('username'))
					return
				}
				this.uniIdToken = uni.getStorageSync('uniIdToken')
				if (this.uniIdToken) {
					this.login(uni.getStorageSync('username'))
					uniCloud.callFunction({
						name:'application',
						data:{
							service:'user',
							action: 'checkToken',
							params: this.uniIdToken
						}
					}).then((r)=>{
						if(r.result.code > 0){
							//token过期或token不合法，重新登录
							uni.reLaunch({
								url: '../login/login'
							});
						}
						this.nickName = r.result.userInfo.nickname
						console.info('checkToken Success',r.result )
					}).finally(()=>{ this.loading = false })
				
				} else {
					this.guideToLogin()
				}
			},
			logout(){
				console.log("启动logout >>>")
				uniCloud.callFunction({
					name: 'application',
					data: {
						service: 'user',
						action: 'logout',
						params: this.uniIdToken
					}
				}).then((e)=>{
					console.log('logout success', e.result);
					if(e.result.code == 0){
						uni.removeStorageSync('uniIdToken')
						uni.removeStorageSync('username')
						uni.removeStorageSync('login_type')
						uni.reLaunch({
							url: '../login/login'
						});
					}
				})
			},
			guideToLogin() {
				uni.showModal({
					title: '未登录',
					content: '您未登录，需要登录后才能继续',
					/**
					 * 如果需要强制登录，不显示取消按钮
					 */
					showCancel: !this.forcedLogin,
					success: (res) => {
						if (res.confirm) {
							/**
							 * 如果需要强制登录，使用reLaunch方式
							 */
							if (this.forcedLogin) {
								uni.reLaunch({
									url: '../login/login'
								});
							} else {
								uni.navigateTo({
									url: '../login/login'
								});
							}
						}
					}
				});
			}
		}
	}
</script>

<style lang="scss">
page{
	background-color: #ededed;
}

.camera{
	width: 54px;
	height: 44px;
	
	&:active{
		background-color: #ededed;
	}
}
.user-box{
	background-color: #fff;
}
</style>
