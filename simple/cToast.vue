<template>
	<co-toast ref="cToast"></co-toast>
</template>

<script>
	export default {
		data(){
			return{}
		},
		methods:{
			showcToast(){
				//赋值
				let title = '成功'
				let type = 'success'
				let url = 'pages/login/login'
				let isTab = true
				this.$refs.cToast.showToast(title, type, url, isTab)
			}
		}
	}
</script>

<style>
</style>
