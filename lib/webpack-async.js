var Path = require('path');
var ConcatSource = require("webpack/lib/ConcatSource");
var OriginalSource = require("webpack/lib/OriginalSource");
var ModuleFilenameHelpers = require("webpack/lib/ModuleFilenameHelpers");
var log4js = require('log4js');
log4js.loadAppender('file');
log4js.addAppender(log4js.appenders.file('./log.js'), 'cheese');
var logger = log4js.getLogger('cheese');

var Babel = require('babel-core');



function AsyncLoadPlugin(options){
}

AsyncLoadPlugin.prototype.apply = function(compiler){
//	compiler.plugin("emit", function(compilation, callback){
//		//logger.debug(compilation.assets);
//		callback();
//	});
	
	
	compiler.plugin("compilation", function(compilation){
//		compilation.plugin("optimize-chunk-assets", function(chunks, callback) {
//			chunks.forEach(function(chunk) {
//				chunk.files.filter(ModuleFilenameHelpers.matchObject.bind(undefined, {})).forEach(function(file) {
//					logger.debug(compilation.assets[file]);
//					//compilation.assets[file] = new ConcatSource(banner, "\n", compilation.assets[file]);
//				});
//			});
//			callback();
//		});
		
		
		
		compilation.plugin('optimize-tree', function(chunks, modules, callback){
			var mods = modules;
			//logger.debug(modules);
			//console.log(chunks[0].origins);
//			mods.forEach(function(mod, i){
//				if (mod._source) {
//					mod._source._value = Babel.transform( '/*' + mod.resource + '*/\n\n').code + mod._source._value;
//					
//					//mod._source._value = '/*' + mod.resource + '*/\n\n' + mod._source._value;
//				}
//			});
			callback && callback();
		});

//		compilation.plugin('after-optimize-chunk-assets', function(chunks){
//			chunks.forEach(function(chunk){
//				chunk.modules.forEach(function(mod){
//					if (mod._source) {
//						mod._source._value += '\n\n/* ' + mod.resource + ' */ \n\n'
//						//mod._source._value = '/**/' + mod._source._value;
//						logger.debug(mod._source._value);
//					}
//				});
//			});
//		});
		

	});
};

module.exports = AsyncLoadPlugin;
