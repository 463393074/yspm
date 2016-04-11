var Cookie = require('common/js/core/cookie');
var Serialize = require('common/js/util/serialize');
var G = require('g/js/g');
var A = require('./a');

G.init()

console.log('login.js');
Serialize.test();
A();

__webpack_public_path__ = 'dist/passport/js/login';
require(['./amd', './amd3'], function(amd, amd3){
	amd();
	amd3();
})

require.ensure(['./amd2'], function(require){
	var amd2 = require('./amd2');
	amd2();
})
