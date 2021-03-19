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
	
	/**
	 * 获取用户列表
	 */
	async getUserList(){
		let res = await db.collection('uni-id-users').limit(10).get()
		console.info(res)
		let data = {
			code: 1,
			msg: '获取用户列表失败',
			userList: [],
			total:0
		}
		if(res.data){
			data.code = 0
			data.msg = '获取用户列表成功'
			data.userList = res.data
			data.total = res.affectedDocs
		}
		return data
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
		let { uid , role , name , sex , sexStr , 
		registration , college , collegeStr} = params 
	    let res = uniID.updateUser({
			uid,
			nickname: name,
			gender:sex,
			sexStr,
			role,
			register_date:registration,
			college,
			collegeStr,
		});
		return res
	}
	
	/**
	 * 管理员添加用户（注册+绑定角色+更新）
	 */
	async addUser(params){
		let {username , password , 
		role , 
		name , sex , sexStr , registration , 
		college , collegeStr} = params 
		let payload = await uniID.register({
			username,
			password
		})
		if(payload.code > 0){
			return payload
		}
		let { uid } = payload
		
		let res = await uniID.updateUser({
			uid,
			nickname: name,
			gender:sex,
			sexStr,
			role,
			register_date:registration,
			college,
			collegeStr,
		})
		
		return res
	}
	
	/**
	 * 删除用户（只是将状态改为禁用）
	 */
	deleteUser(params){
		
	}
}