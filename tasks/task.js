var Path = require('path');
var Os = require('os');
var Fs = require('fs');
var Class = require('../lib/class');

var Util = require('../lib/util');

module.exports = Class({
	initialize: function(args, config){
		var self = this;
		config = config || {};
		self.args = args;
		self.config = config;
		self._setAllPathlist();
		self._setPathList();
	},
	run: function(){
		//...
	},
	_setAllPathlist: function(){
		var self = this;
		self.allPathList = [];
		self.config.fileCombos.forEach(function(combo){
			self.allPathList = self.allPathList.concat(combo.js.concat(combo.css));
		});
	},
	_setPathList: function(){
		var self = this;
		self.pathList = [];
	},
	getCombo: function(path){
		var self = this;
		var fileCombos = self.config.fileCombos;
		for (var i = 0; i < fileCombos.length; i++) {
			var combo = fileCombos[i];
			if (combo.js.indexOf(path) >= 0 || combo.css.indexOf(path) >= 0) {
				return combo;
			}
		}
	},
	//转换成相对路径
	getRelativePath: function(path, type){
		var self = this;
		var dirPath = Path.resolve(self.config.root + type);
		return Path.relative(dirPath, path).split(Path.sep).join('/');
	},
	//获取src路径
	getSrcPath: function(path){
		var self = this;
		path = self.config.srcPath + '/' + path;
		var dirPath = Path.resolve(self.config.root + '/' + self.config.distPath);
		var relativePath = Path.relative(dirPath, path).split(Path.sep).join('/');
		if (Path.extname(relativePath)) {
			return Path.resolve(self.config.root + '/' + self.config.srcPath + '/' + relativePath.replace(/\.css$/, '.less'));
		}
		else {
			return '';
		}
	},
	//获取build路径
	getBuildPath: function(path, ref){
		var self = this;
		var relativePath = self.getRelativePath(path, '/' + (ref || self.config.srcPath));
		return Path.resolve(self.config.root + '/' + self.config.buildPath + '/' + relativePath.replace(/\.less$/, '.css'));
	},
	//获取dist路径
	getDistPath: function(path, ref){
		var self = this;
		var relativePath = self.getRelativePath(path, '/' + (ref || self.config.buildPath));
		return Path.resolve(self.config.root + '/' + self.config.distPath + '/' + relativePath.replace(/\.less$/, '.css'));
	}
})
