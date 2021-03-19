<template>
	<view>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	export default {
		methods: {
			showToast(title , type , url = '' , isTab = false) {
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