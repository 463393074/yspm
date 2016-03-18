var Path = require('path');
var Task = require('./task');
var Gulp = require('gulp');
var Builder = require('./build');

var Klass = Task.extend({
	initialize: function(){
		var self = this;
		Klass.superClass.initialize.apply(self, arguments);
	},
	run: function(){
		var self = this;
		var config = self.config;
		Gulp.watch(self.pathList, function(o){
			if (o.type == 'changed') {
				var oTask = new Builder([self.getRelativePath(o.path, '/' + config.srcPath)], self.config);
				oTask.run();
			}
		});
	},
	_setPathList: function(){
		var self = this;
		var pathList = [];
		var config = self.config;
		config.fileCombos.forEach(function(combo){
			combo.all.forEach(function(path){
				if (!combo.concatJs[path]) {
					pathList.push(Path.resolve(config.root + '/' + config.srcPath + '/' + path));
				}
			});
		});
		self.pathList = pathList;
	}
})
module.exports = Klass;














