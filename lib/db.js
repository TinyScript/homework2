const Tapable = require('tapable')

class DB extends Tapable {
  constructor(options) {
    super(options)
    this.options = options || {};
  }

  request(options) {
  	// 同步执行指定名称的处理函数，这里执行的是options，
  	// 将对象传入进行配置，返回最后一次配置的对象。
  	let opts = this.applyPluginsWaterfall('options', {});
  	Object.assign(this.options, options, opts)

  	// 同上，但是只返回不为undefined的值，
  	// 只要返回不为undefined，终止该系列处理函数的执行。
  	return this.applyPluginsBailResult('endpoint', this.options)
  			.then((res) => {
  				if(!this.applyPluginsBailResult('judge', res)) {
  					return Promise.resolve(res);
  				} else {
  					return Promise.reject(res);
  				}
  			});
  }
}

module.exports = DB