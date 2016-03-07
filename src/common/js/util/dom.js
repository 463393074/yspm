var Str = require('common/js/util/str');
module.exports = {
	//获取图片大小
	getImgSize: function(url, cb){
		var img = document.getElementsByTagName('img')[0];
		img.onload = function(){
			var _img = new Image();
			_img.src = url;
			_img.onload = function(){
				cb && cb(_img.width, _img.height);
			}
		}
		img.src = url;
	},
	setInputMaxLen: (function(){
		function set($input, len){
			len = len || parseInt($input.attr("maxlength"), 10);
			if (len > 0) {
				if ($input.val().length > len / 2) {
					$input.val(Str.substr($input.val(), len));
				}
			}
		}
		
		return function(input, len){
			var $input = $(input);
			$input.keyup(function(){
				set($input, len);
			}).blur(function(){
				set($input, len);
			});
		}
	})()
}

