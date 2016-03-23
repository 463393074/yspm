var Event = require('common/js/core/event');

var G = $.extend(new Event, {
	init: function(config){
		var self = this;
		config = config || {};
		console.log('g.init()');
	}
})
console.log('g...');
module.exports = G;

