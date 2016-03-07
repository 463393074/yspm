/**
 * @public 取字符串的字节长度
 * @param {string} 字符串
 */
function byteLen(str) {
	return str.replace(/([^\x00-\xff])/g, '$1 ').length;
}
/**
 * @public 按字节长度截取字符串
 * @param {string} str是包含中英文的字符串
 * @param {int} limit是长度限制（按英文字符的长度计算）
 * @param {String} 添加在末尾的字符串
 * @return {string} 返回截取后的字符串,默认末尾带有'..'
 */
function substr(str, limit, repl) {
	str = str || '';
	repl = repl || '';
	if (this.byteLen(str) <= limit)
		return str;
	var sub = str.substr(0, limit).replace(/([^\x00-\xff])/g, '$1 ').substr(0, limit).replace(/([^\x00-\xff])\s/g, '$1');
	return sub + repl;
}

// 截取HTML，保留图片、视频、文本
function subHtml(html, limit) {
	limit = limit || 400;
	html = html.replace(/(\r\n|\n)+/g, '<br>');
	html = html.replace(/\s{2,}/g, ' ');
	html = html.replace(/(<(?:img|embed).*?>)([\s\S]*)$/ig, function($0, $1, $2) {
		return $1 + $2.replace(/<(?:img|embed).*?>/ig, '');
	});
	html = html.replace(/<\/(p|div|ol|ul|li)>/ig, '<br>');
	html = html.replace(/<(?!img|embed|br).*?>/ig, '');
	html = html.replace(/(<br[^>]*>\s*){2,}/ig, '$1');
	var oldLength = html.length;
	html = html.substr(0, limit);

	html = html.replace(/<[^>]*$/, '');
	if (html.length < oldLength) {
		html += ' ...';
	}
	return html;
}

// UUID生成
// test: http://jsfiddle.net/jcward/7hyaC/3/
var lut = [];
for (var i = 0; i < 256; i++) {lut[i] = (i < 16 ? '0' : '') + (i).toString(16);}
function e7() {
	var d0 = Math.random() * 0xffffffff | 0;
	var d1 = Math.random() * 0xffffffff | 0;
	var d2 = Math.random() * 0xffffffff | 0;
	var d3 = Math.random() * 0xffffffff | 0;
	return lut[d0 & 0xff] + lut[d0 >> 8 & 0xff] + lut[d0 >> 16 & 0xff] + lut[d0 >> 24 & 0xff] + '-' +
		lut[d1 & 0xff] + lut[d1 >> 8 & 0xff] + '-' + lut[d1 >> 16 & 0x0f | 0x40] + lut[d1 >> 24 & 0xff] + '-' +
		lut[d2 & 0x3f | 0x80] + lut[d2 >> 8 & 0xff] + '-' + lut[d2 >> 16 & 0xff] + lut[d2 >> 24 & 0xff] +
		lut[d3 & 0xff] + lut[d3 >> 8 & 0xff] + lut[d3 >> 16 & 0xff] + lut[d3 >> 24 & 0xff];
}


module.exports = {
	byteLen: byteLen,
	substr: substr,
	subHtml: subHtml,
	uuid: e7
}