module.exports = {
	//target不存在的属性，不进行合并
	iExtend: function(target, src){
		for (key in src) {
			if (target[key] !== undefined) {
				if ($.isPlainObject(src[key])) {
					if ($.isPlainObject(target[key])) {
						this.iExtend(target[key], src[key]);
					}
					else {
						target[key] = $.extend(deep, {}, src[key]);
					}
				}
				else {
					target[key] = src[key];
				}
			}
		}
		return target;
	}
}
