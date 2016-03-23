var Path = require('path');

function AsyncLoadPlugin(options){
	options = options || {};
	this.root = options.root || '';
}

AsyncLoadPlugin.prototype.apply = function(compiler){
	var self = this;
	compiler.plugin("compilation", function(compilation){
		
		compilation.plugin('optimize-module-ids', function(modules, callback){
			var mods = modules;
			mods.forEach(function(mod, i){
				
				if (mod.resource && mod.resource != mod.rawRequest) {
					mod.id = Path.relative(self.root, mod.resource).split(Path.sep).join('/');
					//mod.id = mod.rawRequest.split(Path.sep).join('/');
				}
			});
			callback && callback();
		});

	});
};

module.exports = AsyncLoadPlugin;
