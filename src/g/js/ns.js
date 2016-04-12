window.__ns__ = (function(){
	var json = {};
	return function(key, value){
		if (Object.prototype.toString.call(key) === '[object Object]') {
			for (var k in key) {
				arguments.callee(k, key[k]);
			}
		}
		else if (value === undefined) {
			return json[key];
		}
		else {
			json[key] = value;
		}
	}
})();
