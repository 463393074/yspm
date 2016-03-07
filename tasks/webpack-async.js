function AsyncLoadPlugin(options){
}

AsyncLoadPlugin.prototype.apply = function(compiler) {
  compiler.plugin('emit', function(compilation, callback) {
  	console.log(compilation);
    callback();
  });
};

module.exports = AsyncLoadPlugin;