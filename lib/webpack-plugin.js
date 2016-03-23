var Path = require('path');
var ConcatSource = require("webpack/lib/ConcatSource");
var OriginalSource = require("webpack/lib/OriginalSource");
var ModuleFilenameHelpers = require("webpack/lib/ModuleFilenameHelpers");

var log4js = require('log4js');
log4js.loadAppender('file');
log4js.addAppender(log4js.appenders.file('./log.js'), 'cheese');
var logger = log4js.getLogger('cheese');

var Util = require('./util');



function AsyncLoadPlugin(options){
}

AsyncLoadPlugin.prototype.apply = function(compiler){
	
	compiler.plugin("compilation", function(compilation){
		
		compilation.plugin('optimize-module-ids', function(modules, callback){
			var mods = modules;
			console.log(mods[0]);
			mods.forEach(function(mod, i){
				if (mod.resource && mod.resource != mod.rawRequest) {
					mod.id = mod.rawRequest;
//					var content = Util.readFileSync(mod.resource);
//					var md5 = Util.md5(content);
//					mod.id = md5;
				}
			});
			callback && callback();
		});

	});
};

module.exports = AsyncLoadPlugin;
