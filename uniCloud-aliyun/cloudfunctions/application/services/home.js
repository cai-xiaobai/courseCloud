const explain = require("explain");

module.exports = class home extends explain.service {

    index(params) {
        return 'Hello, 欢迎你!';
    }

}