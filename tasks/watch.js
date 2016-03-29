var Builder = require('./build');

var Klass = Builder.extend({
	initialize: function(){
		var self = this;
		Klass.superClass.initialize.apply(self, arguments);
		self.config.watch = true;
	}
})
module.exports = Klass;












