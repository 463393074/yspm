module.exports = {
	//倒计时
	countdown: function(el, count, callback){
		var count = count || 3;
		var timer;
		var el = $(el).html(count);
		timer = setInterval(function(){
			count--;
			if (count <= 0) {
				clearInterval(timer);
				if (callback) callback();
			}
			el.html(count);
		}, 1000);
		
		return {
			close: function(){
				clearInterval(timer);
			}
		}
	}
}