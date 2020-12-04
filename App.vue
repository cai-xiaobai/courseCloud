<script>

	import {
		mapState,
		mapMutations
	} from 'vuex'
	
	export default {
		onLaunch: function() {
			let uniIdToken = uni.getStorageSync('uniIdToken')
			if(uniIdToken){
				this.login(uni.getStorageSync('username'))
			}
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		methods: {
			...mapMutations(['login']),
		}
	}
</script>

<style lang="scss">
	@import "uview-ui/index.scss";
</style>
