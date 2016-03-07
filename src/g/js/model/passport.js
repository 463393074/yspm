module.exports = {
	//登录
	login: function(o, cb){
		o = $.extend({
			passport: '',
			password: '',
			remember: 1
		}, o);
		return $.post('/passport/login.do', o, function(res){
			cb && cb(res);
		}, 'json')
	},
	//自动登录
	autoLogin: function(cb){
		return $.getJSON('/passport/autoLogin.do?callback=?', function(res){
			cb && cb(res);
		}, 'json')
	},
	//检测邮箱
	checkEmail: function(o, cb){
		o = $.extend({
			email: ''
		}, o);
		return $.getJSON('/passport/checkEmail.do', function(res){
			cb && cb(res);
		}, 'json')
	},
	//注册帐号
	register: function(o, cb){
		o = $.extend({
			passport: '',
			password: '',
			nickname: '',
			sex: 1,
			code: '',
			codeId: ''
		}, o);
		return $.post('/passport/register.do', function(res){
			cb && cb(res);
		}, 'json')
	}
}
