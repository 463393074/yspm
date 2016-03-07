var Num = require('common/js/util/num');
var formatNumber = Num.format;

/**
 * @public 格式化日期
 * @param {pattern} 格式化正则
 * @param {date} 需格式化的日期对象
 */
function formatDate(pattern, date){
	if (date === undefined) {
		date = new Date();
	}
	else if ($.isNumeric(date)) {
		date = new Date(parseInt(date, 10));
	}
	return pattern.replace(/([YMDhsm])\1*/g, function(format){
		switch (format.charAt()) {
			case 'Y':
				return formatNumber(date.getFullYear(), format);
			case 'M':
				return formatNumber(date.getMonth() + 1, format);
			case 'D':
				return formatNumber(date.getDate(), format);
			case 'w':
				return date.getDay() + 1;
			case 'h':
				return formatNumber(date.getHours(), format);
			case 'm':
				return formatNumber(date.getMinutes(), format);
			case 's':
				return formatNumber(date.getSeconds(), format);
		}
	});
}

/**
 * @public 格式化日期
 * @param {int/Date} 开始时间
 * @param {end/Date} 结束时间
 * @param {format/String} 大于30天后显示的样式
 */
var oneDaySer = 24 * 60 * 60; // 一天的秒数
function release(start, end, format){
	if ($.isNumeric(start)) {
		start = new Date(parseInt(start, 10));
	}
	if ($.isNumeric(end)) {
		end = new Date(parseInt(end, 10));
	}
	if (start === undefined) start = new Date;
	if (end === undefined) end = new Date;
	if (!format) {
		format = 'YYYY年MM月DD日';
	}
	var endZero = new Date(end.toDateString()); // 凌晨时间
	var diff = (+end - +start) / 1000;
	var diffZero = (+end - +endZero) / 1000;
	if (diff <= 60) 
		return '刚刚';
	else if (diff <= 60 * 60) 
		return Math.floor(diff / 60) + '分钟前';
	else if (diff <= diffZero) 
		return Math.floor(diff / 3600) + '小时前';
	else if (diff <= diffZero + oneDaySer) 
		return '昨天';
	else if (diff <= diffZero + oneDaySer * 2) 
		return '前天';
	else if (diff <= diffZero + oneDaySer * 25) 
		return Math.floor(diff / oneDaySer) + '天前';
	else 		
		return formatDate(format, start);
}

/**
 * @param t {Object} 时间格式(时:分:秒)转换为秒数
 * @param isMs {Boolean} 返回是否为毫秒数
 */
function parseTime(t, isMs){
	var s = 0;
	t = String(t).split(':');
	for (var i = 0, j = t.length; i < j; i++) {
		s += parseInt(t[i], 10) * Math.pow(60, j - i - 1);
	}
	return isMs ? s * 1000 : s;
}

/**
 * @param s {Number} 数字时间转换为(时:分:秒)字符串
 * @param showHour {Boolean} 是否显示小时 默认显示
 */
function beautyTime(s, showHour){
	var ret = [], h, m, s;
	if (showHour == undefined || showHour) {
		h = parseInt(s / 3600);
		m = parseInt(s % 3600 / 60);
	}
	else {
		m = parseInt(s / 60);
	}
	s = (s % 60);
	if (m < 10) m = '0' + m;
	if (s < 10) s = '0' + s;
	ret = [m, s];
	if (h > 0) ret.unshift(h);
	return ret.join(':');
}

/**
 * @public 格式化时间长度
 * @param {pattern} 格式化正则
 * @param {date} 需格式化的日期对象
 */
function formatTime(pattern, time, noPrefix){
	if ($.type(time) == 'date') 
		time = time.getTime();
	else time = parseInt(time);
	var date = new Date(time), h = date.getHours();
	if (date > 43200000) h += Math.floor(date / 43200000);
	if (noPrefix) {
		pattern = pattern.replace(/(\w)\1+/g, '$1');
	}
	return pattern.replace(/([hms])\1*/g, function(format){
		switch (format.charAt()) {
			case 'h':
				return formatNumber(h - 8, format);
			case 'm':
				var m = (/h+/.test(pattern) ? 0 : h - 8) * 60 + date.getMinutes();
				return formatNumber(m, format);
			case 's':
				return formatNumber(date.getSeconds(), format);
		}
	});
}

function formatTimeE(time, noPrefix){
	if (time < 3600000) {
		return this.formatTime('mm:ss', time, noPrefix);
	}
	else {
		return this.formatTime('hh:mm:ss', time, noPrefix);
	}
}

module.exports = {
	release: release,
	formatDate: formatDate,
	formatTime: formatTime,
	formatTimeE: formatTimeE,
	beautyTime: beautyTime,
	parseTime: parseTime
}
