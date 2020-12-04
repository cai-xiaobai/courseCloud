import Vue from 'vue'
import * as methods  from './methods.js'

// 加载提示
export function u_showLoading(msg){
	uni.showLoading({ title: msg });
}

Object.assign(Vue.prototype, methods)