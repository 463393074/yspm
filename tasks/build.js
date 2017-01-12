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
var GulpCssUrlVersion = require('../lib/gulp-css-url-version');
var WebpackModuleId = require('../lib/webpack-module-id');
var Util = require('../lib/util');
var nodeRoot = Path.join(__dirname, '../node_modules');
//nodeRoot="/usr/local/lib/node_modules/yspm/node_modules";
//var WebpacPlugin = require('../lib/webpack-plugin');


var Klass = Task.extend({
	initialize: function () {
		var self = this;
		Klass.superClass.initialize.apply(self, arguments);
	},
	run: function () {
		var self = this;
		var config = self.config;
		self.pathList.forEach(function (path) {
			if (/\.(html?|bat|cmd|sh)$/i.test(path)) { // 过虑掉不构建的文件
				return;
			}
			Util.info(path);
			//build
			if (/\.js$/i.test(path)) {
				self.buildJs(path);
			}
			else if (/\.(less|css)$/i.test(path)) {
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
	_setPathList: function () {
		var self = this;
		var pathList = [];
		var args = self.args;
		var config = self.config;
		if (args.length < 1) { //构建所有配置里的文件	
			self.allPathList.forEach(function (path) {
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
	_canBuild: function (path) {
		var self = this;
		var config = self.config;
		var srcPath = '/' + config.srcPath;
		if (!Util.indir(path, Path.resolve(config.root + srcPath))) {
			return false;
		}

		if (/\.js$/.test(path) || /\.less$/.test(path)) {
			var relativePath = self.getRelativePath(path, srcPath);
			return self.allPathList.indexOf(relativePath) >= 0;
		}

		if (/\.(tpl|vm|sh|bat|cmd)$/.test(path)) {
			return false;
		}

		return /\.[a-z]+$/.test(path);
	},
	_getWebpackConfig: function (path) {
		var self = this;
		var _path = Path.relative(self.config.root + '/' + self.config.srcPath, path).split(Path.sep).join('/');
		var combo = self.getCombo(_path);
		var root = Path.resolve(self.config.root + '/' + self.config.srcPath);
		var filename = Path.basename(path);
		var webpackConfig = {
			entry: {
				main: '',
				common: []
			},
			output: {
				filename: filename
				//publicPath: Path.dirname(_path) + '/',
				//chunkFilename: filename.split('.')[0] + ".[id].js"
			},
			resolveLoader:{
				root: nodeRoot
			},
			resolve:{
				alias: {
					'vue$': nodeRoot + '/vue/dist/vue.js'
				},
				root: [root],
				extensions: ['', '.js', '.css', '.less', '.tpl', '.vue'] //后缀补全
			},
			module: {
				//加载器配置
				loaders: [{
					test: /\.css$/,
					loader: 'style-loader!css-loader'
				}, {
					test: /\.(js|jsx)$/,
					exclude: /(node_modules|bower_components)/,
					loader: 'babel-loader',
					query: {
						//presets: ['../../gulp/node_modules/babel-preset-es2015']
					}
				}, {
					test: /\.tpl/,
					loader: 'html-loader'
				}, {
					test: /\.vue/,
					loader: 'vue-loader'
				}]
			},
			babel: {
				//plugins: [nodeRoot + '/babel-plugin-transform-runtime'],
				//presets: ['es2015','stage-0']
				presets: [nodeRoot + '/babel-preset-es2015']
			},
			watch: self.config.watch, //是否监听文件修改
			devtool: 'cheap-module-inline-source-map', //sourcemap调试
			plugins: [
				new WebpackModuleId({ //修改moduleId为module的文件MD5+id, 加id是因为vue一个文件对应多个模块
					root: root,
					path: _path
				})
			]
		}

		//第一个全局文件，一般是g.js，会把公共方法打包进去
		if (combo.globalJs.indexOf(_path) == 0) {
			webpackConfig.entry.main = [path];
			webpackConfig.entry.common.push(path);
			//webpackConfig.output.chunkFilename = ".[name]";
			webpackConfig.plugins.push(new Webpack.optimize.CommonsChunkPlugin({
				name: 'main',
				filename: Path.basename(path)
			}))
		}
		//其他全局文件
		else if (combo.globalJs.indexOf(_path) > 0) {
			combo.ignoreJs.forEach(function (__path) {
				var fullPath = self.getSrcPath(__path);
				if (Fs.existsSync(fullPath) && __path != _path) {
					webpackConfig.entry.common.push(fullPath);
				}
			});
			webpackConfig.entry.main = [path];
			webpackConfig.plugins.push(new Webpack.optimize.CommonsChunkPlugin({
				name: 'common'
			}))
		}
		//普通文件
		else {
			combo.ignoreJs.forEach(function (path) {
				var fullPath = self.getSrcPath(path);
				if (Fs.existsSync(fullPath)) {
					webpackConfig.entry.common.push(fullPath);
				}
			});
			webpackConfig.entry.main = path;
			//webpackConfig.output.chunkFilename = filename.split('.')[0] + ".[name]";
			webpackConfig.plugins.push(new Webpack.optimize.CommonsChunkPlugin({
				//filename:'common.js',
				name: 'common'
			}))

		}
		return webpackConfig;
	},
	buildJs: function (path) {
		var self = this;
		var config = self.config;
		var relativePath = self.getRelativePath(path, '/' + config.srcPath + '/');
		var buildPath = self.getBuildPath(path);
		var distPath = self.getDistPath(path, config.srcPath);
		var combo = self.getCombo(relativePath);

		// 把多个文件合并成一个文件
		var concatJsList = combo.concatJs[relativePath];
		var fileStream;
		if (concatJsList) {
			concatJsList = concatJsList.map(function (_path) {
				return self.getSrcPath(_path);
			});
			fileStream = Gulp.src(concatJsList)
				.pipe(GulpConcat(Path.basename(path)))
				.pipe(Gulp.dest(Path.dirname(path)));
			//concat文件的监听
			if (self.config.watch) {
				Gulp.watch(concatJsList, function (o) {
					if (o.type == 'changed') {
						Gulp.src(concatJsList)
							.pipe(GulpConcat(Path.basename(path)))
							.pipe(Gulp.dest(Path.dirname(path)))
							.pipe(Gulp.dest(Path.dirname(buildPath)))
							.pipe(GulpUglify())
							.pipe(Gulp.dest(Path.dirname(distPath)));
					}
				});
				return;
			}
		}
		else {
			fileStream = Gulp.src(path)
				.pipe(GulpWebpack(self._getWebpackConfig(path)));
		}
		fileStream.pipe(Gulp.dest(Path.dirname(buildPath)))
			.pipe(GulpUglify())
			.pipe(Gulp.dest(Path.dirname(distPath)));
	},
	buildLess: function (path) {
		var self = this;
		Gulp.src(path)
			.pipe(GulpLess({
				paths: [Path.resolve(self.config.root + '/')]
			}))
			.pipe(GulpCssUrlVersion({
				getResolvePath: function (url) {
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
				check: function (path) {
					if (Util.indir(path, self.config.root + '/' + self.config.srcPath)) {
						return true;
					}
				},
				staticPrefix: self.config.staticPrefix
			}, function (content, data) {
				function addVersion(path, version) {
					return path.replace(/^(.+)(\.\w+[?#]?.*)$/, '$1_' + version + '$2');
				}
				for (var _path in data) {
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
	buildImg: function (path) {
		var self = this;
		Gulp.src(path)
			.pipe(GulpImageMin())
			.pipe(Gulp.dest(Path.dirname(self.getBuildPath(path))))
			.pipe(Gulp.dest(Path.dirname(self.getDistPath(path, self.config.srcPath))));
	},
	buildOther: function (path) {
		var self = this;
		Gulp.src(path)
			.pipe(Gulp.dest(Path.dirname(self.getBuildPath(path))))
			.pipe(Gulp.dest(Path.dirname(self.getDistPath(path, self.config.srcPath))));
	}
})
module.exports = Klass;