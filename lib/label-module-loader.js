'use strict';

var loaderUtils = require('loader-utils');
var Path = require('path');

module.exports = function(source, inputSourceMap){
	var webpackRemainingChain = loaderUtils.getRemainingRequest(this).split('!');
	var filename = webpackRemainingChain[webpackRemainingChain.length - 1];
	
	filename = Path.relative(process.cwd(), filename).split(Path.sep).join('/');
	
	if (filename && filename != '') {
		source = '/* ' + filename + ' */\n\n' + source;
	}
	this.callback(null, source, inputSourceMap);
};
