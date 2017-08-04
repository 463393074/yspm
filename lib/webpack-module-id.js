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
	var modIdMap = {};
	compiler.plugin("compilation", function(compilation){
		//console.log(1111111111)
		compilation.plugin('optimize-module-ids', function(modules, callback){
			var mods = modules;
			var modMap = {};
			//console.log(mods);
			//console.log(2222222222)
			mods.forEach(function(mod, i){
				//console.log(33333333333)
				if (mod.resource && mod.resource != mod.rawRequest) {
					var content = Util.readFileSync(mod.resource);
					var md5 = Util.md5(content);
					//mod.id = md5
					//console.log(i+':')
					//console.log(md5,mod.id)
					//console.log(mod.id, mod.fileDependencies);
					if(!modMap[md5]){
						modMap[md5] = 1;
						mod.id = md5;
					} else {
						mod.id = md5 + '_' + modMap[md5];
						modMap[md5]++;
					}
					// if(!modIdMap[mod.resource]){
					// 	modIdMap[mod.resource] = mod.id;
					// }
					//console.log(mod.resource+'_'+mod.id);
					//console.log(mod);
					
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
