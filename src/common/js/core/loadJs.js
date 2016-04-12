function loadJs(url, op){
	op = op || {};
	if (Object.prototype.toString.call(op) === '[object Function]') {
		op = {
			callback: op
		};
	}
	
	//..
	var script = document.createElement("script");
	var done = false;
	script.type = "text/javascript";
	script.async = true;
	script.charset = op.charset || 'utf-8';
	script.src = window.__ns__(url) || url;
	head = document.getElementsByTagName("head")[0];
	script.onload = script.onreadystatechange = function(){
		if (!done && (!this.readyState || this.readyState == "loaded" || this.readyState == "complete")) {
			done = true;
			script.onload = script.onreadystatechange = null;
			head.removeChild(script);
			if (op.callback) {
				op.callback(__webpack_require__(0));
			}
		}
	};
	head.appendChild(script);
}

module.exports = loadJs;
