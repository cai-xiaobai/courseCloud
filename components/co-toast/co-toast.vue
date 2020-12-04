<template>
	<view>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	export default {
		methods: {
			showToast(title , type , url = '' , isTab = false) {
				console.info(title , type , url , isTab )
				this.$refs.uToast.show({
					title: title,
					type: type,
					url: url,
					isTab:isTab
				})
			}
		}
	}
</script>