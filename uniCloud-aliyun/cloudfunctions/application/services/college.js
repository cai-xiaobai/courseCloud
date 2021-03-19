const explain = require("explain");
const db = uniCloud.database()
const dbCmd = db.command
module.exports = class college extends explain.service {
	/**
	 * 获取学院列表
	 */
	async getCollegeList(){
		let res = await db.collection('college').get()
		let data = {
			code: 1,
			msg: '获取学院列表失败',
			collegeList: [],
			total:0
		}
		if(res.data){
			data.code = 0
			data.msg = '获取学院列表成功'
			data.collegeList = res.data
			data.total = res.affectedDocs
		}
		return data
	}
	
	/**
	 * 获取学院列选择
	 */
	async getCollegeSelect(){
		let res = await db.collection('college').get()
		let data = {
			code: 1,
			msg: '获取学院列表失败',
			collegeSelect: [],
			total:0
		}
		if(res.data){
			data.code = 0
			data.msg = '获取学院列表成功'
			let select = []
			res.data.forEach((item)=>{
				select.push({
					value:item.college_id,
					label:item.college_name
				})
			})
			data.collegeSelect = select
			data.total = res.affectedDocs
			console.info(select)
		}
		return data
	}
}