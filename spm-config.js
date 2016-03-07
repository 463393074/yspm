
exports.root = __dirname;

exports.srcPath = 'src'; // 源代码目录

exports.buildPath = 'build'; // 打包文件目录

exports.distPath = 'dist'; // 压缩文件目录

exports.main = {
	"js" : [
		"g/js/lib.js",
		"g/js/g.js",
		"passport/js/login.js"
	],
	"css" : [
		"g/css/g.less",
		"passport/css/main.less"
	]
};

exports.libjs = {
	"g/js/lib.js": ["common/js/lib/jquery.js"] //直接concat复制
};

exports.ignore = [ // 打包时以下文件中出现的子包不被加入
	"g/js/g.js"
];

exports.global = [ // 以下文件无视 ignore的设定
	"g/js/g.js"
];