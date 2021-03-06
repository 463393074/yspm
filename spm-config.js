
exports.root = __dirname;

exports.srcPath = 'src'; // 源代码目录

exports.buildPath = 'build'; // 打包文件目录

exports.distPath = 'dist'; // 压缩文件目录

exports.staticPrefix = ''; // 静态文件前缀,比如/m/dist/..

exports.watching = false; // 监听修改

// 文件组
exports.fileCombos = [
{
	// 主文件，各页面入口文件
	js: [
		// "g/js/lib.js", 
		// "g/js/g.js", 
		// "g/js/g2.js", 
		// "g/js/g3.js", 
		// "g/js/echarts.js", 
		"passport/js/reg.js", 
		"passport/js/login.js",
		"passport/js/amd.js",
		"passport/js/amd2.js",
		"passport/js/es6-test2.js",
		// "es6/js/main.js"
	],
	css: [
		"g/css/g.less", 
		"passport/css/main.less",
		"passport/css/main.css"
	],
	// 直接concat复制的文件
	concatJs: {
		// "g/js/lib.js": ["common/js/lib/jquery.js", "common/js/lib/ns.js"]
	},
	// 打包时以下文件中出现的子包不被加入
	ignoreJs: [
		"g/js/g.js", 
		"g/js/g2.js",
		"g/js/g3.js",
		"g/js/echarts.js", 
	],
	// 以下文件无视 ignore的设定
	globalJs: [
		"g/js/g.js",  //yspm会把公共方法打包进globalJs的第一个文件
		"g/js/g2.js",
		"g/js/g3.js",
		"g/js/echarts.js"
	]
}, 
{
	js: [
		"g/js/m.js", 
		"m/passport/js/login.js"
	],
	css: [
	],
	concatJs: {
		//"g/js/lib.js": ["common/js/lib/jquery.js"]
	},
	ignoreJs: [
		"g/js/m.js"
	],
	globalJs: [
		"g/js/m.js"
	]
}, 
{
	js: [
		"es6/js/g.js",
		"es6/js/g2.js",
		"es6/js/main.js"
	],
	css: [
		"g/css/g.less", 
		"passport/css/main.less",
		"passport/css/main.css"
	],
	concatJs: {
		//"g/js/lib.js": ["common/js/lib/jquery.js"]
	},
	ignoreJs: [
		"es6/js/g.js",
		"es6/js/g2.js",
	],
	globalJs: [
		"es6/js/g.js",
		"es6/js/g2.js",
	]
},
{
	js: [
		"vue/js/g.js",
	],
	css: [
	],
	concatJs: {
	},
	ignoreJs: [
		"vue/js/g.js",
	],
	globalJs: [
		"vue/js/g.js",
	]
}
];
