/**
 * 对目标数字进行0补齐处理
 * @param {number} source 需要处理的数字
 * @param {number} length 需要输出的长度
 *
 * @returns {string} 对目标数字进行0补齐处理后的结果
 * @reference http://tangram.baidu.com/api.html#baidu.number.pad
 */
function pad(source, length) {
	var pre = '',
		negative = (source < 0),
		string = String(Math.abs(source));

	if (string.length < length) {
		pre = (new Array(length - string.length + 1)).join('0');
	}

	return (negative ?  '-' : '') + pre + string;
}

// format(2, '00000') -> '00002'
function formatNumber(data, format) {
	format = format.length;
	data = data || 0;
	return format == 1 ? data : (data = String(Math.pow(10, format) + data)).substr(data.length - format);
}

// 1234 -> 1,234
function numberSplit(num, separator){
	separator = separator || ',';
	return String(num).replace(/(\d)(?=(\d{3})+($|\.))/g, '$1'+separator);
}

function field(num){
	num = parseInt(num);
	var numStr;
	if(num >= 10E7){ // 1亿 1.2亿 12.4亿
		numStr = (num / 10E7).toFixed(2) + '亿'
	}else if(num >= 10E3){ // 1.20万 1.23万 12.34万 100万 100.03万 1,234万
		var n = num / 10E3;
		var nl = parseInt(n).toString();
		var nlLen = nl.length;
		if(nlLen < 4 && n != nl){ // 保证只显示4个数字
			nl = n.toFixed(nlLen == 1 ? 2 : 4 - nlLen);
		}
		numStr = numberSplit(nl) + '万';
	}else{ // 123 12,234
		numStr = numberSplit(num);
	}
	return numStr;
}

// 数字字节格式化
function bytes(bytes){
	bytes = parseInt(bytes);
	var i = -1;
	do {
		bytes /= 1024;
		i++;
	} while (bytes > 1024);
	return Math.max(bytes, 0.1).toFixed(1) + ['KB', 'MB', 'GB', 'TB'][i];
}

function formatCurrency(num){
	if (isNaN(num)) {
		num = 0;
	}
	num = num.toString();
	num = Math.floor(num * 100 + 0.50000000001);
	var cents = num % 100;
	num = Math.floor(num / 100).toString();
	if (cents < 10) {
		cents = "0" + cents;  
	}
	for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++) {
		num = num.substring(0, num.length - (4 * i + 3)) + ',' + num.substring(num.length-(4 * i + 3));  
	}
	return num + '.' + cents;  
}

/**
 * @param {Object} amount 数字
 * @param {Object} num 保留小数位
 * @param {Object} round 是否四舍五入
 */
function amountFormat(amount, num, round){
	var amountReg = /[-\+]?((\d+\.?\d*)|(\d*\.?\d+))/, integer, decimal;
	num = num == null ? 2 : num;
	round = round == null ? false : round;
	
	if (!(amountReg.test(amount))) {
		return 'invalid amount';
	};
	
	if (!(/\d+/.test(num))) {
		num = 2;
	};
	
	if (!(typeof round == 'boolean')) {
		round = false;
	};
	
	//确定是正值还是负值
	sign = (amount == (amount = Math.abs(amount)));
	
	
	if (round) {
		amount = Math.floor(amount * Math.pow(10, num) + 0.50000000001);
	}
	else {
		amount = Math.floor(amount * Math.pow(10, num));
	};
	
	
	integer = Math.floor(amount / Math.pow(10, num)).toString();
	decimal = amount % Math.pow(10, num);
	decimal = decimal.toString();
	
	while (decimal.length < num) {
		decimal = '0' + decimal;
	};
	
	//给整数部分添加分隔符
	integer = integer.split('').reverse().reduce(function(pre, cur, i, arr){
		return cur + (i && !(i % 3) ? ',' : '') + pre;
	}, '');
	
	//返回格式化后的值
	return (sign ? '' : '-') + integer + '.' + decimal;
}

module.exports = {
	pad: pad,
	format: formatNumber,
	currency:formatCurrency,
	split: numberSplit,
	field: field,
	bytes: bytes,
	amountFormat: amountFormat
}