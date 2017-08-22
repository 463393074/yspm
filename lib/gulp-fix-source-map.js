var Gutil = require('gulp-util');
var Through = require('through2');
var Path = require('path');
var Util = require('./util');
var Fs = require('fs');
var _ = require('underscore');
var PluginError = Gutil.PluginError;

module.exports = function(options, callback){
	options = options || {};
	options.check = options.check || function(){
		return true;
	}
	
	var stream = Through.obj(function(file, enc, cb){
		// 如果文件为空，不做任何操作，转入下一个操作，即下一个 .pipe()
		if (file.isNull()) {
			return cb(null, file);
		}
		
		// 插件不支持对 Stream 对直接操作，跑出异常
		if (file.isStream()) {
			return cb(new PluginError('gulp-fix-source-map', 'Streaming not supported'));
		}
		
		// main
		var content = file.contents.toString();
		//console.log(content)
		var flag = true;
		content = content.replace(/\/\/# sourceMappingURL.*/g, function(a){
			var ret = flag ? a : '';
			flag = false;
			//console.log(ret)
			//console.log(a);
			return ret;
		})
		//console.log(content);
    file.contents = new Buffer(content);
		
		// 下面这两句基本是标配啦，可以参考下 through2 的API
		this.push(file);
		cb();
	});

	return stream;

};
