function init(){
	return function(){
		if (this.initialize) {
			this.initialize.apply(this, arguments);
		}
	};
}

function extend(protoProps, staticProps){
	var parent = this;
	
	var child = init();
	
	$.extend(child, parent, staticProps);
	
	var proto = Object.create(parent.prototype);
	proto.constructor = child;
	child.prototype = proto;
	
	$.extend(child.prototype, protoProps);
	
	child.superClass = parent.prototype;
	
	return child;
}

var Class = function(protoProps){
	var cls = init();
	
	$.extend(cls.prototype, protoProps);
	
	cls.extend = extend;
	
	return cls;
};

Class.extend = extend;

module.exports = Class;
