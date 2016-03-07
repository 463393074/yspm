var Class = require('common/js/core/class');

var Event = Class({
	initialize: function(){
		//this.__event = window.Zepto ? new window.Zepto.Event : $({});
		this.__event = $({});
	}
});

var proto = Event.prototype;

['bind', 'one'].forEach(function(method){
	proto[method] = function(type, handler, context){
		if ($.isPlainObject(type)) {
			for (var i in type) 
				this[method](i, type[i]);
		}
		else {
			var event = this.__event;
			var callback = function(){
				return handler.apply(context || event, arguments.length > 0 ? (window.Zepto ? arguments : Array.prototype.slice.call(arguments, 1)) : []);
			};
			event[method].call(event, type, callback);
			handler.guid = callback.guid;
		}
		return this;
	};
});
['unbind', 'trigger', 'triggerHandler'].forEach(function(method){
	proto[method] = function(){
		var event = this.__event;
//		if (require.debug) {
//			console.log('[event] ' + this.constructor.__mid + ' : ' + arguments[0], arguments[1]);
//		}
		var ret = event[method].apply(event, arguments);
//		if (require.debug && ret != event && ret != undefined) {
//			console.log(ret);
//		}
		return ret;
	};
});

proto.fire = proto.trigger;
proto.firing = proto.triggerHandler;
Event.mix = function(receiver){
	return $.extend(receiver, new Event());
};

module.exports = Event;
