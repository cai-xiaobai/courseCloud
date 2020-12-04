<template>
	<view>
		<u-tabbar v-model="current"  :list="list" ></u-tabbar>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [{
						iconPath: "home",
						selectedIconPath: "home-fill",
						text: '首页',
						customIcon: false,
						pagePath: '/pages/main/main',
					},
					{
						iconPath: "photo",
						selectedIconPath: "photo-fill",
						text: '用户',
						customIcon: false,
						pagePath: '/pages/user/user',
					},
					{
						iconPath: "https://cdn.uviewui.com/uview/common/min_button.png",
						selectedIconPath: "https://cdn.uviewui.com/uview/common/min_button_select.png",
						text: '权限',
						customIcon: false,
						pagePath: '/pages/permission/permission',
					},
					{
						iconPath: "play-right",
						selectedIconPath: "play-right-fill",
						text: '角色',
						customIcon: false,
						pagePath: '/pages/role/role',
					},
					{
						iconPath: "account",
						selectedIconPath: "account-fill",
						text: '我的',
						customIcon: false,
						pagePath: '/pages/center/index',
					},
				],
				current: 0
			}
		}
	}
</script>