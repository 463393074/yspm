var Cookie = require('common/js/core/cookie');
var Serialize = require('common/js/util/serialize');
var Url = require('common/js/util/url');
var User = require('g/js/module/user');
var Model = require('g/js/model/passport');


var $loginForm = $('#loginForm');

$loginForm.submit(function(e) {
    e.preventDefault();
    var param = Serialize.arrayToJson($loginForm.serializeArray());
	Model.login(param, function(res){
		if (res.code == 0) {
			location.reload();
		}
		else {
			alert(res.msg);
		}
	});
    return false;
});


//检查自动登录
var saveLoginCookie = Cookie('u_sl');
if (saveLoginCookie && saveLoginCookie == "1") {
	Model.autoLogin(function(res){
		if (res.code == 0) {
			var params = Url.params();
			console.log(JSON.stringify(params));
			if (params.surl) {
				Url.openURL(params.surl);
			} else {
				var loginUserInfo = User.getUserInfo();
				var indexUrl = "/u/" + loginUserInfo.domain;
				Url.openURL(indexUrl);
			}
		}
	})
}

//第三方登录定位
var $otherLogin = $('#otherLogin');
$otherLogin.css({
	top: $otherLogin.offset().top,
	bottom: 'auto'
});