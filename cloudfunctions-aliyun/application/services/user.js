const explain = require("explain");
const uniID = require('uni-id')
const db = uniCloud.database()
const dbCmd = db.command
module.exports = class user extends explain.service {

	/**注册
	 * @param {Object} params
	 *  {String} username 用户名
	 *  {String} password 密码
	 */
	register(params){
		let res = uniID.register(params);
		return res
	}
	
	/**登录
	 * @param {Object} params
	 *  {String} username 用户名
	 *  {String} password 密码
	 */
	login(params) {
	    let res = uniID.login(params);
		return res
	}
	
	/**登出
	 * @param {Object} params
	 *  {String} token  用户token
	 */
	logout(params) {
	    let res = uniID.logout(params);
		return res
	}
	
	/**token校验
	 * @param {Object} params
	 *  {String} uniIdToken  用户token
	 */
	checkToken(params) {
	    let res = uniID.checkToken(params);
		return res
	}
	
	/**修改密码
	 * @param {Object} params
	 * 	{String} uniIdToken  用户token
	 *  {String} oldPassword 旧密码
	 * 	{String} newPassword 新密码
	 *  	{String} uid  用户ID,通过checkToken返回
	 */
	updatePwd(params) {
		let { newPassword , oldPassword } =  params
	    let payload = uniID.checkToken(params.uniIdToken);
		if(payload.code > 0) {
		    return payload
		}
		let { uid } = payload
	    let res = uniID.updatePwd({
			uid,
			oldPassword,
			newPassword
		});
		return res
	}
	
	/**重置密码
	 * @param {Object} params
	 * 	{String} uniIdToken  用户token
	 *  {String} uid  用户ID,通过checkToken返回
	 */
	resetPwd(params) {
	    let payload = uniID.checkToken(params.uniIdToken);
		if(payload.code > 0) {
		    return payload
		  }
		let { uid } = payload
	    let res = uniID.resetPwd({
			uid,
			oldPassword: '123456'
		});
		return res
	}
	
	/**获取用户信息
	 * @param {Object} params
	 * 	{String} uniIdToken  用户token
	 *  	{String} uid  用户ID,通过checkToken返回
	 */
	async getUserInfo(params) {
	    let payload = await uniID.checkToken(params.uniIdToken);
		if(payload.code > 0) {
		    return payload
		  }
		let { uid } = payload
	    let res = uniID.getUserInfo({
			uid
		});
		return res
	}
	
	/**更新用户信息
	 * @param {Object} params
	 * 	{String} uniIdToken  用户token
	 *  {String} uid  用户ID,通过checkToken返回
	 */
	async updateUser(params) {
	    let payload = await uniID.checkToken(params.uniIdToken);
		if(payload.code > 0) {
		    return payload
		  }
		let { uid } = payload
	    let res = uniID.updateUser({
			uid,
			nickname
		});
		return res
	}
	
	
}