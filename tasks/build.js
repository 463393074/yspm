var Path = require('path');
var Os = require('os');
var Fs = require('fs');
var Task = require('./task');
var Gulp = require('gulp');
var GulpLess = require('gulp-less');
var GulpWebpack = require('gulp-webpack');
var GulpConcat = require('gulp-concat');
var Webpack = require('webpack');
var Extend = require('node.extend');
var GulpImageMin = require('gulp-imagemin');
var GulpUglify = require('gulp-uglify');
var GulpMinifyCss = require('gulp-minify-css');
var GulpCssUrlVersion = require('./gulp-css-url-version');
//var WebpackAsyncLoadPlugin = require('./webpack-async');
//var AsyncModulePlugin = require('async-module-loader/plugin');
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
			Util.info(path);
			//build
			if (/\.js$/i.test(path)) {
				self.buildJs(path);
			}
			else if (/\.less$/i.test(path)) {
				self.buildLess(path);
			}
			else if (/\.(png|jpg|jpeg|gif)$/i.test(path)) {
				self.buildImg(path);
			}
			else {
				self.buildOther(path);
			}
		});
	},
	_setPathList: function(){
		var self = this;
		var pathList = [];
		var args = self.args;
		var config = self.config;
		if (args.length < 1) { //构建所有配置里的文件			
			config.main.js.forEach(function(path) {
				pathList.push(Path.resolve(config.root + '/' + config.srcPath + '/' + path));
			});
			config.main.css.forEach(function(path) {
				pathList.push(Path.resolve(config.root + '/' + config.srcPath + '/' + path));
			});
		} else { //构建指定路径文件
			var path = Path.resolve(config.srcPath + '/' + args[0]);
			if (!Fs.existsSync(path)) {
				Util.error('Can\'t find file: ' + path);
			}
			else {
				var stat = Fs.statSync(path);
				if (stat.isDirectory(path)) {
					pathList = Util.grepPaths(path, self._canBuild.bind(self));
				}
				else {
					if (!self._canBuild(path)) {
						Util.error('Can\'t build: ' + path);
					}
					else {
						pathList.push(path);
					}
				}
			}
		}
		self.pathList = pathList;
	},
	_canBuild: function(path){
		var self = this;
		var config = self.config;
		var srcPath = '/' + config.srcPath;
		//console.log('path:' + path);
		if (!Util.indir(path, Path.resolve(config.root + srcPath))) {
			return false;
		}
		
		if (/\.js$/.test(path)) {
			var relativePath = self.getRelativePath(path, srcPath);
			return config.main.js.indexOf(relativePath) >= 0;
		}
		
		if (/\.less$/.test(path)) {
			var relativePath = self.getRelativePath(path, srcPath);
			return config.main.css.indexOf(relativePath) >= 0;
		}
		
		if (/\.(tpl|vm|sh|bat|cmd)$/.test(path)) {
			return false;
		}
		
		return /\.[a-z]+$/.test(path);
	},
	_getWebpackConfig: function(path){
		var self = this;
		var _path = Path.relative(self.config.root + '/' + self.config.srcPath, path).split(Path.sep).join('/');
		var webpackConfig = {
			//context: self.config.root + "/src",
			entry: {
				main: '',
				common: []
			},
			output: {
				//publicPath: self.config.root + '/' + self.config.srcPath,
				//chunkFilename: "[name].chunk.js",
				filename: Path.basename(path),
			},
			module: {
				//加载器配置
				loaders: [{
					test: /\.css$/,
					loader: 'style-loader!css-loader'
				}, {
					test: /\.js$/,
					loader: "babel"
				}, {
					test: /\.tpl/,
					loader: require.resolve("html-loader")
				}]
			},
			//其它解决方案配置
			resolve: {
				//模块查找目录
				//modulesDirectories: ['node_modules'],
				root: [Path.resolve(self.config.root + '/' + self.config.srcPath)],
				extensions: ['', '.js', '.css', '.less', '.tpl'] //后缀补全
			},
			plugins: []
		}
		
		if (self.config.global.indexOf(_path) == -1) {
			//全局模块不构建
			self.config.ignore.forEach(function(path){
				var fullPath = self.getSrcPath(path);
				if (Fs.existsSync(fullPath)) {
					webpackConfig.entry.common.push(fullPath);
				}
			});
			webpackConfig.entry.main = path;
			webpackConfig.plugins.push(new Webpack.optimize.CommonsChunkPlugin({
				//filename:'common.js',
				name: 'common'
			}))
		}
		else {
			webpackConfig.entry.main = [];
			webpackConfig.entry.main.push(path);
			webpackConfig.entry.common.push(path);
			webpackConfig.plugins.push(new Webpack.optimize.CommonsChunkPlugin({
				name: 'main',
				filename: Path.basename(path)
			}))
		}
		return webpackConfig;
	},
	buildJs: function(path){
		var self = this;
		var config = self.config;
		var relativePath = self.getRelativePath(path, '/' + config.srcPath + '/');
		var buildPath = self.getBuildPath(path);
		var distPath = self.getDistPath(path, config.srcPath);
		
		// 把多个文件合并成一个文件
		var libjsList = config.libjs[relativePath];
		var fileStream;
		if (libjsList) {
			libjsList = libjsList.map(function(_path){
				return self.getSrcPath(_path);
			});
			fileStream = Gulp.src(libjsList)
				.pipe(GulpConcat(Path.basename(path)))
				.pipe(Gulp.dest(Path.dirname(path)));
		}
		else {
			fileStream = Gulp.src(path)
				.pipe(GulpWebpack(self._getWebpackConfig(path)));
		}
		fileStream.pipe(Gulp.dest(Path.dirname(buildPath)))
			.pipe(GulpUglify())
			.pipe(Gulp.dest(Path.dirname(distPath)));
	},
	buildLess: function(path){
		var self = this;
		Gulp.src(path)
			.pipe(GulpLess({
				paths: [Path.resolve(self.config.root + '/')]
			}))
			.pipe(GulpCssUrlVersion({
				getResolvePath: function(url){
					var dirPath = Path.dirname(path);
					var _path = '';
					url = url.replace(/[?#].*$/, '');
					if (url.charAt(0) == '.') {
						_path = Path.resolve(dirPath + '/' + url);
						
					}
					else if (url.charAt(0) == '/') {
						url = url.replace(/^\/[^\/]+/, '');
						_path = Path.resolve(self.config.root + '/' + self.config.srcPath + url);
					}
					return _path;
				},
				check: function(path){
					if (Util.indir(path, self.config.root + '/' + self.config.srcPath)) {
						return true;
					}
				}
			}, function(content, data){
				function addVersion(path, version){
					return path.replace(/^(.+)(\.\w+[?#]?.*)$/, '$1_' + version + '$2');
				}
				for(var _path in data){
					var version = data[_path]
					var buildPath = self.getBuildPath(_path);
					var distPath = self.getDistPath(_path, self.config.srcPath);
					if (version) {
						buildPath = addVersion(buildPath, version);
						distPath = addVersion(distPath, version);
					}
					if (!Fs.existsSync(buildPath) || Util.mtime(_path) >= Util.mtime(buildPath)) {
						Util.copyFile(_path, buildPath);
						Util.copyFile(buildPath, distPath);
					}
				}
			}))
			.pipe(Gulp.dest(Path.dirname(self.getBuildPath(path))))
			.pipe(GulpMinifyCss())
			.pipe(Gulp.dest(Path.dirname(self.getDistPath(path, self.config.srcPath))));
	},
	buildImg: function(path){
		var self = this;
		Gulp.src(path)
			.pipe(GulpImageMin())
			.pipe(Gulp.dest(Path.dirname(self.getBuildPath(path))))
			.pipe(Gulp.dest(Path.dirname(self.getDistPath(path, self.config.srcPath))));
	},
	buildOther: function(path){
		var self = this;
		Gulp.src(path)
			.pipe(Gulp.dest(Path.dirname(self.getBuildPath(path))))
			.pipe(Gulp.dest(Path.dirname(self.getDistPath(path, self.config.srcPath))));
	}
})
module.exports = Klass;