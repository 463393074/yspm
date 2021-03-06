var Cookie = require('common/js/core/cookie');
var Serialize = require('common/js/util/serialize');
var LoadJs = require('common/js/core/loadJs');
var Art = require('common/js/core/art');
var Echarts = require('common/js/lib/echarts');
var G = require('g/js/g');
var A = require('./a');



G.init()

//..
// console.log('login.js');

// tpl
var tpl = Art.compile(require('./login.tpl'))();
$('body').html(tpl);

// module
A();
Serialize.test();

// lazy load
LoadJs('passport/js/amd.js', function(amd) {
    console.log('amd:' + amd);
    amd();
});

LoadJs('passport/js/amd2.js', function(amd2) {
    console.log('amd2:' + amd2);
    amd2();
});

/*
__webpack_public_path__ = 'dist/passport/js/login';
require(['./amd', './amd3'], function(amd, amd3){
	amd();
	amd3();
})

require.ensure(['./amd2'], function(require){
	var amd2 = require('./amd2');
	amd2();
})
*/ //