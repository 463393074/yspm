var Path = require('path');
var Fs = require('fs');
var Optimist = require('optimist'); //命令行解析库
var Util = require(__dirname + '/lib/util');
var Extend = require('node.extend');

//任务支持
var TASK_MAP = {
	build : true, //构建
	min : true, //压缩
	watch: true //监听修改，实时构建
};

//帮助信息
Optimist.usage([
	'Usage: yspm [COMMAND] --config=[CONFIG_FILE]\n\n',
	'Examples:\n',
	'ytpm g/js/g.js\n',
	'ytpm g/css/g.less\n',
	'ytpm min g/js/g.js\n'
].join(''));

var ARGV = Optimist.argv;

//监听命令显示帮助信息
if (ARGV.help || ARGV.h) {
	Optimist.showHelp();
	process.exit();
}

//监听命令显示版本信息
if (ARGV.version || ARGV.v) {
	var packageInfo = JSON.parse(Util.readFileSync(__dirname + '/package.json', 'utf-8'));
	console.log(packageInfo.version);
	process.exit();
}

var cmd; //命令
var args; //命令参数，要处理的文件或者目录
var dirPath; //要处理的路径
var config = null; //配置文件
var CONFIG_FILE_NAME = 'spm-config.js'; //默认配置文件名
var configPath = './' + CONFIG_FILE_NAME; //配置文件路径

//拆分参数
if (ARGV._.length > 0 && TASK_MAP[ARGV._[0]]) {
	cmd = ARGV._[0];
	args = ARGV._.slice(1);
} else {
	cmd = 'build';
	args = ARGV._;
}

//解析为绝对路径
dirPath = args.length > 0 ? args[0] : '.';
if (!Fs.existsSync(dirPath)) {
	dirPath = '.';
}
if (!Fs.statSync(dirPath).isDirectory()) {
	dirPath = Path.dirname(dirPath);
}
dirPath = Path.resolve(dirPath);


//配置文件绝对路径
if(typeof ARGV.config !== 'undefined'){
	configPath = ARGV.config;
}
configPath = Path.resolve(configPath);

//逐级寻找配置文件
if (Fs.existsSync(configPath)) {
	config = require(configPath);
}else{
	while (true) {
		configPath = Path.resolve(dirPath + '/' + CONFIG_FILE_NAME);

		if (Fs.existsSync(configPath)) {
			config = require(configPath);
			break;
		}

		var parentPath = Path.dirname(dirPath);

		if (parentPath == dirPath) {
			break;
		}

		dirPath = parentPath;
	}
}
//没找到配置文件，抛出错误信息
if (config === null) {
	Util.error('File not found: ' + configPath);
	process.exit();
}

//运行任务
var Task = require(__dirname + '/tasks/' + cmd);
var oTask = new Task(args, Extend(config, ARGV));
oTask.run();





























