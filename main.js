var Path = require('path');
var Fs = require('fs');
var Optimist = require('optimist'); //命令行解析库
var Util = require(__dirname + '/util');

//任务支持
var TASK_MAP = {
//	list : true,
//	cleanup : true,
//	check : true,
//	vm : true,
//	iconfont : true,
	build : true,
	min : true,
};

//帮助信息
Optimist.usage([
	'Usage: ytpm [COMMAND] --config=[CONFIG_FILE]\n\n',
	'Examples:\n',
	'ytpm src/js/g.js\n',
	'ytpm src/css/g.less\n',
	'ytpm min build/js/g.js\n',
	'ytpm cleanup\n',
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
var args; //命令参数
var dirPath; //要处理的路径
var config = null; //配置文件
var CONFIG_FILE_NAME = 'spm-config.js'; //配置文件名
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
	Util.error('File not found: spm-config.js');
	process.exit();
}

//运行任务
var Task = require(__dirname + '/tasks/' + cmd);
var oTask = new Task(args, config);
oTask.run();





























