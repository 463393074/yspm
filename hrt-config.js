var localRoot = __dirname;

exports.serverRoot = localRoot + '';
exports.map = [

	['http://staticwt.99wanban.com/src', localRoot + '/src'],
	['http://staticwt.99wanban.com/build', localRoot + '/src'],
	['http://staticwt.99wanban.com/dist', localRoot + '/src'],
	['http://static.99wanban.com/src', localRoot + '/src'],
	['http://static.99wanban.com/build', localRoot + '/src'],
	['http://static.99wanban.com/dist', localRoot + '/src']

];

exports.before = function(url) {
	url = url.split('?')[0];
	
	var Mall = this.util.loadPlugin('mall');
	
	url = Mall.stripVersionInfo(url);
	url = Mall.cssToLess(url);

	return url;
};

exports.merge = function(path, callback) {
	var Mall = this.util.loadPlugin('mall');

	Mall.merge.call(this, path, callback);
};
