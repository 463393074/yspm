var localRoot = __dirname;

exports.serverRoot = localRoot + '';
exports.map = [

    ['http://127.0.0.1:8080/src', localRoot + '/build'],
    ['http://127.0.0.1:8080/build', localRoot + '/build'],
    ['http://127.0.0.1:8080/dist', localRoot + '/build'],

    ['http://js.tudouui.com/v3/dist', localRoot + '/build'],
    ['http://css.tudouui.com/v3/dist', localRoot + '/build'],
    ['http://ui.tudou.com/v3/dist', localRoot + '/build'],

    ['http://js.tudouui.com/v3/src', localRoot + '/build'],
    ['http://css.tudouui.com/v3/src', localRoot + '/build'],
    ['http://ui.tudou.com/v3/src', localRoot + '/build']

];


exports.before = function(url) {
    url = url.split('?')[0];

    var Mall = this.util.loadPlugin('mall');
    url = Mall.stripVersionInfo(url);

    url = Mall.cssToLess(url);

    return url;
};

exports.merge = function(path, callback) {
    if (/\.less$/.test(path)) {
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
