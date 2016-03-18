
var Path = require('path');
var Fs = require('fs');
var util = require('util');
var Iconv = require('iconv-lite');
var Crypto = require('crypto');

var SLICE = Array.prototype.slice;

var linefeed = process.platform === 'win32' ? '\r\n' : '\n';

var banner = '/**\n' +
	' * @modified $Author$\n' +
	' * @version $Rev$\n' +
	' */\n';

function each(obj, fn) {
	for (var key in obj) {

		if (obj.hasOwnProperty(key)) {
			if (fn.call(obj[key], key, obj[key]) === false) {
				break;
			}
		}

	}
}

function undef(val, defaultVal) {
	return typeof val === 'undefined' ? defaultVal : val;
}

function info(str) {
	var args = SLICE.call(arguments, 1);
	console.info.apply(console, ['\033[36m'+ str +'\033[0m'].concat(args));
}

function warn(str) {
	var args = SLICE.call(arguments, 1);
	console.info.apply(console, ['\033[33m'+ str +'\033[0m'].concat(args));
}
 
//...
function error(str) {
	var args = SLICE.call(arguments, 1);
	console.info.apply(console, ['\033[31m'+ str +'\033[0m'].concat(args));
}
//...
function indir(path, dirPath) {
	path = Path.resolve(path);
	dirPath = Path.resolve(dirPath);
	return path.indexOf(dirPath) == 0;
}

function mkdir(dirPath, mode) {
	var list = [];
	while (true) {
		if (Fs.existsSync(dirPath)) {
			break;
		}

		list.push(dirPath);

		var parentPath = Path.dirname(dirPath);

		if (parentPath == dirPath) {
			break;
		}

		dirPath = parentPath;
	}

	list.reverse().forEach(function(path) {
		Fs.mkdirSync(path, mode);

		info('Directory "' + path + '" created.' + linefeed);
	});
}

function readFileSync(filePath, encoding) {
	var buffer = new Buffer('');

	try {
		buffer = Fs.readFileSync(filePath);
	} catch (e) {
		error(e.toString());
	}

	if (!encoding) {
		return buffer;
	}

	var fileStr = Iconv.fromEncoding(buffer, encoding);

	return fileStr;
}

function writeFileSync(filePath, content) {
	mkdir(Path.dirname(filePath), '0777');
	Fs.writeFileSync(filePath, content);
}

function mtime(filePath) {
	var stat = Fs.statSync(filePath);
	return stat.mtime.getTime();
}

function copyFile(fromPath, toPath) {
	console.log('Copy file: ' + fromPath);

	var buffer = readFileSync(fromPath);

	writeFileSync(toPath, buffer);

	info('File "' + toPath + '" created.' + linefeed);
}

function minJs(fromPath, toPath, charset) {
	charset = charset || 'utf-8';

	console.log('Compress file: ' + fromPath);

	var content = readFileSync(fromPath, charset);

	var result = UglifyJS.minify(content, {
		fromString : true,
		compress : {
			sequences : false,
			properties : false,
			dead_code : false,
			conditionals : false,
			comparisons : false,
			evaluate : false,
			booleans : false,
			loops : false,
			unused : false,
			hoist_funs : false,
			hoist_vars : false,
			if_return : false,
			join_vars : false,
			cascade : false,
		}
	});
	var minContent = result.code + ';';

	writeFileSync(toPath, banner + minContent);

	info('File "' + toPath + '" created.' + linefeed);
}

function minCss(fromPath, toPath, charset) {
	charset = charset || 'utf-8';

	console.log('Compress file: ' + fromPath);

	var content = readFileSync(fromPath, charset);

	var minContent = CleanCss.process(content);

	writeFileSync(toPath, banner + minContent);

	info('File "' + toPath + '" created.' + linefeed);
}

function concatFile(fromPaths, toPath, charset) {
	charset = charset || 'utf-8';

	if (fromPaths.length == 1 && fromPaths[0] == toPath) {
		return;
	}

	console.log('Concat files:');

	var contentList = [];

	fromPaths.forEach(function(path) {
		console.log(path);

		contentList.push(readFileSync(path, charset));
	});

	writeFileSync(toPath, contentList.join(linefeed));

	info('File "' + toPath + '" created.' + linefeed);
}

// Grep target paths
function grepPaths(rootDirPath, checkFn) {
	var paths = [];

	function walk(dirPath) {
		var files = Fs.readdirSync(dirPath);

		for (var i = 0, len = files.length; i < len; i++) {
			var file = files[i];

			if (file.charAt(0) === '.') {
				continue;
			}

			var path = Path.resolve(dirPath + '/' + file);

			var stat = Fs.statSync(path);

			if (stat.isDirectory()) {
				walk(path);
			} else if (checkFn(path)) {
				paths.push(path);
			}
		}
	}

	walk(rootDirPath);

	return paths;
}

// Grep module ID list
function grepModuleList(path) {
	var fileStr = readFileSync(path, 'utf8');

	var regExp = /(?:^|[^\w\.])define\(\s*(?:'([^']*)'|"([^"]*)")\s*,/g;

	var idMap = {};

	var match;

	while((match = regExp.exec(fileStr))) {
		idMap[match[2] || match[1]] = true;
	}

	return Object.keys(idMap);
}

function md5(data, len){
	var md5sum = Crypto.createHash('md5');
	var encoding = typeof data === 'string' ? 'utf8' : 'binary';
	md5sum.update(data, encoding);
	len = len || 7;
	return md5sum.digest('hex').substring(0, len);
}

exports.linefeed = linefeed;
exports.banner = banner;
exports.each = each;
exports.undef = undef;
exports.info = info;
exports.warn = warn;
exports.error = error;
exports.indir = indir;
exports.mkdir = mkdir;
exports.readFileSync = readFileSync;
exports.writeFileSync = writeFileSync;
exports.mtime = mtime;
exports.copyFile = copyFile;
exports.minJs = minJs;
exports.minCss = minCss;
exports.concatFile = concatFile;
exports.grepPaths = grepPaths;
exports.grepModuleList = grepModuleList;
exports.md5 = md5;
