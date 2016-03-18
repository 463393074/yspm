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
	
	_extend(child, parent);
	_extend(child, staticProps);
	
	var proto = Object.create(parent.prototype);
	proto.constructor = child;
	child.prototype = proto;
	
	_extend(child.prototype, protoProps);
	
	child.superClass = parent.prototype;
	
	return child;
}


function _extend(destination, source){
	for (var property in source) {
		destination[property] = source[property];
	}
	return destination;
}

var Class = function(protoProps){
	var cls = init();
	
	_extend(cls.prototype, protoProps);
	
	cls.extend = extend;
	
	return cls;
};

Class.extend = extend;

module.exports = Class;
