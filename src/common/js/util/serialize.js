module.exports = {
	arrayToJson: function(array){
		if ($.type(array) !== 'array') 			
			return;
		var o = {};
		array.forEach(function(item, i){
			if (!(item.name in o)) {
				o[item.name] = item.value;
			}
			else {
				if ($.type(o[item.name]) != 'array') {
					o[item.name] = [o[item.name]];
				}
				o[item.name].push(item.value);
			}
		});
		return o;
	}
}