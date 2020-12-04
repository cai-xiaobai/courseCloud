// 云函数入口
const explain = require("explain");

exports.main = async (event, context) => {
    return explain.run(event, context, (config) => {

        config.init({
			baseDir: __dirname,
			serviceDir: "/services/", // service目录
			serviceKey: "service", // service参数别名，默认"service"，作用是与其他参数冲突时可以修改为别的名称
			actionKey: "action", // action参数别名，默认"action"，作用是与其他参数冲突时可以修改为别的名称
			routeKey: "route", // route参数别名，默认"route"，作用是与其他参数冲突时可以修改为别的名称
			methodKey: "method", // method参数别名，默认"method"，作用是与其他参数冲突时可以修改为别的名称
			paramsKey: "params", // params参数别名，默认"params"，作用是与其他参数冲突时可以修改为别的名称
			enableMatchMode: true, // 启用匹配模式，false为禁用，禁用后仅支持路由模式访问业务函数
			matchIgnore: [ // 匹配模式忽略指定的service和actions，忽略后仅配置路由模式后可访问
			    {
			       service: "goods",
			       actions: ["getListAsync"]
			    }
			]
		
		});
    });
}