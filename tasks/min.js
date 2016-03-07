var Path = require('path');
var Os = require('os');
var Fs = require('fs');
var Task = require('./task');
var Gulp = require('gulp');
var Webpack = require('webpack');
var Extend = require('node.extend');
var GulpUglify = require('gulp-uglify');
var GulpMinifyCss = require('gulp-minify-css');
var GulpImageMin = require('gulp-imagemin');
var Util = require(__dirname + '/../util');

var Klass = Task.extend({
	initialize: function(){
		var self = this;
		Klass.superClass.initialize.apply(self, arguments);
	},
	run: function(){
		var self = this;
		var config = self.config;
		self.pathList.forEach(function(path){
			if (/\.(html?|bat|cmd|sh)$/i.test(path)) { // 过虑掉不构建的文件
				return;
			}
			
			//min
			if (/\.js$/i.test(path)) {
				self.minJs(path);
			}
			else if (/\.less$/i.test(path)) {
				self.minLess(path);
			}
			else if (/\.(png|jpg|jpeg|gif)$/i.test(path)) {
				self.minImg(path);
			}
			else {
				self.minOther(path);
			}
		});
	},
	_setPathList: function(){
		var self = this;
		var pathList = [];
		var args = self.args;
		var config = self.config;
		if (args.length < 1) { //构建所有配置里的文件	
			args = ['/'];
		}
		var path = Path.resolve(config.buildPath + '/' + args[0]);
		if (!Fs.existsSync(path)) {
			Util.error('Can\'t find file: ' + path);
		}
		else {
			var stat = Fs.statSync(path);
			if (stat.isDirectory(path)) {
				pathList = Util.grepPaths(path, self._canBuild.bind(self));
			}
			else {
				if (!self.canBuild(path)) {
					Util.error('Can\'t build: ' + path);
				}
				else {
					pathList.push(path);
				}
			}
		}
		self.pathList = pathList;
	},
	_canBuild: function(path){
		var self = this;
		
		if (/\.(tpl|vm|sh|bat|cmd)$/.test(path)) {
			return false;
		}
		
		return /\.[a-z]+$/.test(path);
	},
	minJs: function(path){
		var self = this;
		Gulp.src(path)
			.pipe(GulpUglify())
			.pipe(Gulp.dest(Path.dirname(self.getDistPath(path))));
	},
	minLess: function(path){
		var self = this;
		Gulp.src(path)
			.pipe(GulpMinifyCss())
			.pipe(Gulp.dest(Path.dirname(self.getDistPath(path))));
	},
	minImg: function(path){
		var self = this;
		Gulp.src(path)
			.pipe(GulpImageMin())
			.pipe(Gulp.dest(Path.dirname(self.getDistPath(path))));
	},
	minOther: function(path){
		var self = this;
		Gulp.src(path)
			.pipe(Gulp.dest(Path.dirname(self.getDistPath(path))));
	}
})
module.exports = Klass;














