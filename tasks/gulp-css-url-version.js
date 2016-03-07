var Gutil = require('gulp-util');
var Through = require('through2');
var Path = require('path');
var Util = require(__dirname + '/../util');
var Fs = require('fs');
var _ = require('underscore');

module.exports = function(options, callback){
	options = options || {};
	options.check = options.check || function(){
		return true;
	}
	
	
	function addVersion(path, version){
		return path.replace(/^(.+)(\.\w+[?#]?.*)$/, '$1_' + version + '$2');
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
			this.push(file);
			return cb();
		}
		
		// 插件不支持对 Stream 对直接操作，跑出异常
		if (file.isStream()) {
			this.emit('error', new Gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
			return cb();
		}
		
		
		// main
		var content = file.contents.toString();
		var cssPath = options.path;
		var dirPath = Path.dirname(cssPath);
		var match;
		var regExp = /url\(["']?([^'"\)]+)["']?\)/g;
		var newContent = content.replace(/\/\*[\S\s]*?\*\//g, '');
		var pathList = [];
		
		while((match = regExp.exec(newContent))) {
			var url = match[1];
			var path = options.getResolvePath(url);
			if (path && options.check(path) && Fs.existsSync(path)) {
				pathList.push(path);
			}
			
		}
		if (pathList.length < 1) {
			callback && callback(content);
		}
		else {
			getFileVersion(pathList, function(data){
				content = content.replace(/\/\*[\S\s]*?\*\/|(url\(["']?)([^'"\)]+)(["']?\))/g, function(full, prefix, url, suffix){
					if (prefix) {
						var path = options.getResolvePath(url);
						if (path && data[path]) {
							var version = data[path];
							return prefix + addVersion(url, version) + suffix;
						}
					}
					return full;
				});
				
				callback && callback(content, data);
			});
		}
		

        file.contents = new Buffer(content);
		
		// 下面这两句基本是标配啦，可以参考下 through2 的API
		this.push(file);
		cb();
	});
};
