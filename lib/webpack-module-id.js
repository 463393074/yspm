var Path = require('path');
var Util = require('./util');
var Fs = require('fs');

function AsyncLoadPlugin(options){
	options = options || {};
	this.root = options.root || '';
	this.path = options.path || '';
}

AsyncLoadPlugin.prototype.apply = function(compiler){
	var self = this;
	compiler.plugin("compilation", function(compilation){
		
		compilation.plugin('optimize-module-ids', function(modules, callback){
			var mods = modules;
			mods.forEach(function(mod, i){
				if (mod.resource && mod.resource != mod.rawRequest) {
					//console.log(mod.id);
					var content = Util.readFileSync(mod.resource);
					var md5 = Util.md5(content);
					mod.id = md5 + mod.id;
					//mod.id = Path.relative(self.root, mod.resource).split(Path.sep).join('/');
					//console.log(mod.id);
					//mod.id = mod.rawRequest.split(Path.sep).join('/');
				}
			});
			callback && callback();
		});
//		compilation.plugin('optimize-chunk-ids', function(chunks, callback){
//
//			chunks.forEach(function(chunk, i){
//				if (i > 1) {
//					var id = Path.dirname(self.path) + '/' + Path.basename(self.path, '.js') + '.' + chunk.id + '.js';
//					chunk.id = id.split(Path.sep).join('/');
//				}
//			});
//			callback && callback();
//		});

	});
};

module.exports = AsyncLoadPlugin;
