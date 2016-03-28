var Path = require('path');


function AsyncLoadPlugin(callback){
	this.callback = callback;
}

AsyncLoadPlugin.prototype.apply = function(compiler){
	var self = this;
	compiler.plugin("compilation", function(compilation){
		compilation.plugin('optimize-modules', function(modules, callback){
			callback && callback();
			self.callback && self.callback(modules);
		});
	});
};

module.exports = AsyncLoadPlugin;
