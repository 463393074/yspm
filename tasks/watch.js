var Path = require('path');
var Fs = require('fs');
var Task = require('./task');
var Gulp = require('gulp');
var Builder = require('./build');
var Webpack = require('webpack');
var Util = require('../lib/util');
var WebpackGetModule = require('../lib/webpack-get-module');


var Klass = Task.extend({
	initialize: function(){
		var self = this;
		Klass.superClass.initialize.apply(self, arguments);
		self.moduleMap = {};
		self._addModuleMap(self.allPathList);
	},
	run: function(){
		var self = this;
		var config = self.config;
		
		Gulp.watch(self.pathList, function(o){
			if (o.type == 'changed') {
				var relativePath = self.getRelativePath(o.path, '/' + config.srcPath);
				
				if (self.allPathList.indexOf(relativePath) >= 0) {
					var oTask = new Builder([relativePath], self.config);
					oTask.run();
					
					self._addModuleMap(relativePath);
					
				}
				else if (self.moduleMap[o.path].length) {
					self.moduleMap[o.path].forEach(function(path){
						var oTask = new Builder([path], self.config);
						oTask.run();
					});
				}
				
			}
		});
	},
	_addModuleMap: function(paths){
		var self = this;
		var config = self.config;
		paths = paths || [];
		if(Object.prototype.toString.call(paths) !== '[object Array]'){
			paths = [paths];
		}
		paths.forEach(function(path){
			if (!/\.js$/i.test(path)) 		
				return;
			self.getModules(path, function(modules){
				modules.forEach(function(mod){
					if (self.moduleMap[mod.resource]) {
						if (self.moduleMap[mod.resource].indexOf(path) == -1) {
							self.moduleMap[mod.resource].push(path);
						}
					}
					else {
						self.moduleMap[mod.resource] = [path];
					}
				});
			})
		});
	},
	_setPathList: function(){
		var self = this;
		var pathList = [];
		var config = self.config;
		
		self.pathList = Util.grepPaths(config.root + '/' + config.srcPath, function(path){
			if (/\.js$/i.test(path)) {
				return true;
			}
		});
	},
	getModules: function(path, callback){
		var self = this;
		var config = self.config;
		Webpack({
			entry: path,
			resolve: {
				root: [Path.resolve(config.root + '/' + config.srcPath)]
			},
			plugins: [new WebpackGetModule(function(modules){
				callback && callback(modules);
			})]
		}, function(){
		})
	}
	
})
module.exports = Klass;














