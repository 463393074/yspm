var localRoot = __dirname;

exports.serverRoot = localRoot + '';
exports.map = [
    ['http://js.tudouui.com/dist', localRoot + '/build'],
    ['http://css.tudouui.com/dist', localRoot + '/build'],
    ['http://ui.tudou.com/dist', localRoot + '/build'],

    ['http://js.tudouui.com/src', localRoot + '/build'],
    ['http://css.tudouui.com/src', localRoot + '/build'],
    ['http://ui.tudou.com/src', localRoot + '/build']
];


exports.before = function(url) {
    url = url.split('?')[0];

    var Mall = this.util.loadPlugin('mall');
    url = Mall.stripVersionInfo(url);

    url = Mall.cssToLess(url);

    return url;
};

exports.merge = function(path, callback) {
    if (!/\.js/.test(path)) {
		path = path.replace(/build/, 'src');
	}
    var Mall = this.util.loadPlugin('mall');
    Mall.merge.call(this, path, callback);
};

/*
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
*/
