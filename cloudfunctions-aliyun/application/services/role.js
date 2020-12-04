const explain = require("explain");
const uniID = require('uni-id')
const db = uniCloud.database()
const dbCmd = db.command
module.exports = class role extends explain.service {

	/**添加角色
	 * @param {Object} params
	 * 	{String} roleID 角色ID
	 * 	{String} roleName 角色名称
	 * 	{String} comment 备注
	 * 	{Array} permission 权限ID列表
	 */
	addRole(params) {
	    let res = uniID.addRole(params);
		return res
	}
	
	/**获取角色列表
	 * @param {Object} params
	 * 	{Number} limit 限制返回数量
	 * 	{Number} offset 偏移量
	 * 	{Boolean} needTotal 是否需要返回总数
	 */
	getRoleList(params) {
	    let res = uniID.getRoleList(params);
		return res
	}
	
	/**获取角色信息
	 * @param {Object} params
	 * 	{String} roleID 角色ID
	 */
	getRoleInfo(params) {
	    let res = uniID.getRoleInfo(params);
		return res
	}
	
	/**更新角色信息
	 * @param {Object} params
	 * 不可修改role_id
	 * 	{String} roleID 角色ID
	 * 	{String} roleName 角色名称
	 * 	{String} comment 备注
	 * 	{Array} permission 权限ID列表
	 */
	updateRole(params) {
	    let res = uniID.updateRole(params);
		return res
	}
	
	/**删除角色信息
	 * @param {Object} params
	 * 	{String} roleID 角色ID
	 */
	deleteRole(params) {
	    let res = uniID.deleteRole(params);
		return res
	}

}