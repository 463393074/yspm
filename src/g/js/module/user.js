var Cookie = require('common/js/core/cookie');

module.exports = {
	uid: function(){
		return this.getUserInfo().uid;
	},
	getUserInfo: function(){
		var u_info = Cookie('u_info');
		var uInfo = u_info ? u_info.split('|') || [] : [];
		return {
			uid: uInfo[0] || 0,
			domain: uInfo[1] || uInfo[0] || 0,
			unick: decodeURIComponent(uInfo[2]) || '',
			upic: uInfo[3] || ''
		};
	}
}