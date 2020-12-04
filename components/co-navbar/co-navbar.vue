<template>
	<view>
		<u-navbar title-color="#fff" back-icon-color="#ffffff" 
			z-index="980"
			:is-fixed="isFixed" :is-back="isBack" 
			:background="background" 
			:back-text-style="{color: '#fff'}" :title="title" 
			:back-icon-name="backIconName" :back-text="backText"
			>
			
		</u-navbar>
	</view>
</template>

<script>
	export default {
		name: 'co-navbar',
		props: {
			title: String ,//标题
			isBack: Boolean
		},
		data() {
			return {
				backText: '返回',
				backIconName: 'arrow-left',
				useSlot: false,
				search: false,
				isFixed: true,
				background: {
					// 渐变色
					 backgroundImage: 'linear-gradient(45deg, rgb(28, 187, 180), rgb(141, 198, 63))'
				}
			}
		}
	}
</script>