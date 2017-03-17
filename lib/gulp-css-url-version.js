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
	var staticPrefix = '';
	if (options.staticPrefix && options.staticPrefix != '') {
		staticPrefix = '/' + options.staticPrefix;
	}
	
	
	function addVersion(path, version){
		return path.replace(/^([^\.]+)(\.\w+[?#]?.*)$/, '$1_' + version + '$2');
	}
	
	
	// 取得文件MD5
	function getFileVersion(pathList, callback){
		pathList = _.uniq(pathList);
		var pathCount = pathList.length;
		
		var result = {};
		
		// 取得文件MD5
		pathList.forEach(function(path){
			var content = Util.readFileSync(path);
			var md5 = Util.md5(content);
			result[path] = md5;
		});
		
		callback(result);
	}
	
	function resolveUrl(url){
		while (true) {
			url = url.replace(/\w+\/\.\.\//g, '');
			if (!/\.\.\//.test(url)) {
				break;
			}
		}
		url = url.replace(/\.\//g, '');
		return url;
	}

	return Through.obj(function(file, enc, cb){
		// 如果文件为空，不做任何操作，转入下一个操作，即下一个 .pipe()
		if (file.isNull()) {
			return cb(null, file);
		}
		
		// 插件不支持对 Stream 对直接操作，跑出异常
		if (file.isStream()) {
			return cb(new PluginError('gulp-less', 'Streaming not supported'));
		}
		
		// main
		var content = file.contents.toString();
		var cssPath = options.path;
		var match;
		var regExp = /url\(["']?([^'"\)]+)["']?\)/g;
		var newContent = content.replace(/\/\*[\S\s]*?\*\//g, '');
		var pathList = [];
		
		while((match = regExp.exec(newContent))) {
			var url = match[1];
			var path = options.getResolvePath(url);
			// && Fs.existsSync(path)
			if (path && options.check(path)) {
				pathList.push(path);
			}
			
		}
		if (pathList.length < 1) {
			return cb(null, file);
		}
		else {
			getFileVersion(pathList, function(data){
				content = content.replace(/\/\*[\S\s]*?\*\/|(url\(["']?)([^'"\)]+)(["']?\))/g, function(full, prefix, url, suffix){
					if (prefix) {
						var path = options.getResolvePath(url);
						if (path && data[path]) {
							var version = data[path];
							return prefix + addVersion(staticPrefix + url, version) + suffix;
						}
					}
					return full;
				});
				callback(data);
			});
		}
        file.contents = new Buffer(content);
		
		// 下面这两句基本是标配啦，可以参考下 through2 的API
		//this.push(file);
		return cb(null, file);
	});
};
