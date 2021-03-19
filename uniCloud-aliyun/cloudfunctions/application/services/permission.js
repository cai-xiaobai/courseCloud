const explain = require("explain");
const uniID = require('uni-id')
const db = uniCloud.database()
const dbCmd = db.command
module.exports = class permission extends explain.service {

	/**添加权限
	 * @param {Object} params
	 * 	{String} permissionID 权限ID
	 * 	{String} permissionName 权限名称
	 * 	{String} comment 备注
	 */
	addPermission(params) {
	    let res = uniID.addPermission(params);
		return res
	}
	
	/**获取权限列表
	 * @param {Object} params
	 * 	{Number} limit 限制返回数量
	 * 	{Number} offset 偏移量
	 * 	{Boolean} needTotal 是否需要返回总数
	 */
	getPermissionList(params) {
	    let res = uniID.getPermissionList(params);
		return res
	}
	
	/**获取权限信息
	 * @param {Object} params
	 * 	{String} roleID 权限ID
	 */
	getPermissionInfo(params) {
	    let res = uniID.getPermissionInfo(params);
		return res
	}
	
	/**更新权限信息
	 * @param {Object} params
	 * 不可修改role_id
	 * 	{String} roleID 权限ID
	 * 	{String} roleName 权限名称
	 * 	{String} comment 备注
	 */
	updatePermission(params) {
	    let res = uniID.updatePermission(params);
		return res
	}
	
	/**删除权限信息
	 * @param {Object} params
	 * 	{String} roleID 权限ID
	 */
	deletePermission(params) {
	    let res = uniID.deletePermission(params);
		return res
	}

}