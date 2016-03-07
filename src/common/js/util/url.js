var isIe = /msie/.test(navigator.userAgent.toLowerCase());
/**
 * @public 跳到到指定地址，相对于open或location=，但是可以避免IE里location跳转时获取不到referrer的问题
 * @reference http://webbugtrack.blogspot.com/2008/11/bug-421-ie-fails-to-pass-http-referer.html
 * @TODO 会引起点击统计无法获得正确的位置编码
 */
function openURL(url, target){
	if (!isIe) {
		if (target) 
			window.open(url, target)
		else location.href = url;
	}
	else {
		var a = $('<a href="' + url + '" target="' + (target || '_self') + '" data-openurl="true"> </a>')[0];
		document.body.appendChild(a);
		a.click();
	}
}

function params(url){
	url = url || location.search || location.href;
	var params = {}, result = url.match(/[^\s&?#=\/]+=[^\s&?#=]+/g);
	if (result) for (var i = 0, l = result.length; i < l; i++) {
		var n = result[i].split('=');
		params[n[0]] = decodeURIComponent(n[1]);
	}
	return params;
}

function parseURL(url){
	if (!/http(s)?:\/\/.+/.test(url)) {
		url = 'http://' + url;
	}
	var a = document.createElement('a');
	a.href = url;
	return {
		source: url,
		protocol: a.protocol.replace(':', ''),
		host: a.hostname,
		port: a.port || '80',
		query: a.search,
		params: params(url),
		file: (a.pathname.match(/\/([^\/?#]+)$/i) || [, ''])[1],
		hash: a.hash.replace('#', ''),
		path: a.pathname.replace(/^([^\/])/, '/$1'),
		relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [, ''])[1],
		segments: a.pathname.replace(/^\//, '').split('/')
	};
}


module.exports = {
	openURL: openURL,
	params: params,
	parseURL: parseURL
}
