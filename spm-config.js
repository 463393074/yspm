
exports.root = __dirname;

exports.srcPath = 'src'; // 源代码目录

exports.buildPath = 'build'; // 打包文件目录

exports.distPath = 'dist'; // 压缩文件目录

// 文件组
exports.fileCombos = [{
	// 主文件，各页面入口文件
	all: [
		"g/js/lib.js", 
		"g/js/g.js", 
		"g/js/g2.js", 
		"passport/js/reg.js", 
		"passport/js/login.js", 
		"g/css/g.less", 
		"passport/css/main.less"
	],
	// 直接concat复制的文件
	concatJs: {
		"g/js/lib.js": ["common/js/lib/jquery.js"]
	},
	// 打包时以下文件中出现的子包不被加入
	ignoreJs: [
		"g/js/g.js", 
		"g/js/g2.js"
	],
	// 以下文件无视 ignore的设定
	globalJs: [
		"g/js/g.js", 
		"g/js/g2.js"
	]
}, {
	all: [
		"g/js/m.js", 
		"m/passport/js/login.js"
	],
	concatJs: {
		"g/js/lib.js": ["common/js/lib/jquery.js"]
	},
	ignoreJs: [
		"g/js/m.js"
	],
	globalJs: [
		"g/js/m.js"
	]
}];
