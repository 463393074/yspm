/**
 * 图片适配器规则：[默认是定宽，高度取中间]
 * html结构必须如
 * <div  class="pic-adapter>
 *     <a><img src="" onload="picAdjust(this)"></a>
 * </div>
 * 图片的大小在类pic-adapter上设置CSS，img的宽高等于pic-adapter的宽高
 * 
 * @param {Object} pic img对象
 * @param {Object} w （可选） 要调整到的宽度
 * @param {Object} h （可选） 要调整到的高度
 */
(function(){
	//图片实际宽高不足设定值时放大到设定值的最低比例阈值
	var minCanZoomInActuralRatio = 0.8; 
	var picAdjust= function(img,setW,setH){
		var $ = window.$;
		if (!img) {
			return;
		}
		
		var wrapWidth = 0; 
		var wrapHeight = 0;
		if (setW && setH) {
			wrapWidth = setW;
			wrapHeight = setH;
		} else {
			if (!img.parentElement) {
				return;
			}
			var picAdapter = img.parentElement; //找到外层包裹适配容器DIV
			if (picAdapter.nodeName == "A") {
				picAdapter = picAdapter.parentElement;
			}
			wrapWidth = $ ? $(picAdapter).width() : picAdapter.clientWidth;
			wrapHeight = $ ? $(picAdapter).height() : picAdapter.clientHeight;
		}
		// 获取图片原始宽高
		var naturalDim = getNaturalDimention(img, function(){
			var actImg = this;
			doAdjust(img, wrapWidth, wrapHeight, actImg.width, actImg.height);
		});
		if (naturalDim) {
			doAdjust(img, wrapWidth, wrapHeight, naturalDim[0], naturalDim[1]);
		}
	};
	var doAdjust = function(img,setW, setH, actW, actH) {
		var scaleRatioW = parseInt(actW * 1000 / setW) / 1000 , scaleRatioH = parseInt(actH * 1000 / setH) / 1000;
		if (Math.abs(scaleRatioW - scaleRatioH) < 0.02) {
			img.style.width = setW + "px";
			img.style.height = setH + "px";
		}
		// 宽优先
		else if (scaleRatioW < scaleRatioH) {
			if (actW < setW) {
//				var actRatio = actW / setW;
				//如果可以放大到设置尺寸则放大
				if (scaleRatioW >= minCanZoomInActuralRatio) {
					var scaledHeight = parseInt(actH / scaleRatioW);
					img.style.width = setW + "px";
					img.style.height = scaledHeight + "px";
					if (scaledHeight > setH) {
						var marginTop = parseInt(-(scaledHeight - setH) / 2);
						img.style.marginTop = marginTop + "px";
					} else {
						var marginTop = parseInt((setH - scaledHeight) / 2);
						img.style.marginTop = marginTop + "px";
					}
				} else {
					img.style.width = actW + "px";
					img.style.height = actH + "px";
					//设置居中显示
					img.style.marginLeft = "auto";
					img.style.marginRight = "auto";
					if (actH > setH) {
						var marginTop = parseInt(-(actH - setH) / 2);
						img.style.marginTop = marginTop + "px";
					} else {
						var marginTop = parseInt((setH - actH) / 2);
						img.style.marginTop = marginTop + "px";
					}
				}
			} else {
				var newHeightAfterScale = parseInt(actH / scaleRatioW);
				if (newHeightAfterScale > setH) {
					var exceedH = newHeightAfterScale - setH;
					var marginTop = parseInt(-(exceedH / 2));
					img.style.width = setW + "px";
					img.style.height = newHeightAfterScale + "px";
					img.style.marginTop = marginTop + "px";
				}
				//这时的缩放后的高肯定大于设置的高
			}
		}
		// 高优先
		else {
			if (actH < setH) {
				var ratio = actH / setH;
				if (ratio >= minCanZoomInActuralRatio) {
					var scaledWidth = parseInt(actW / ratio);
					img.style.height = setH + "px";
					img.style.width = scaledWidth + "px";
					if (scaledWidth > setW) {
						var marginLeft = parseInt(-(scaledWidth -setW) / 2);
						img.style.marginLeft = marginLeft + "px";
					} else {
						var marginLeft = parseInt((setW - scaledWidth) / 2);
						img.style.marginLeft = marginLeft + "px";
					}
				} else {
					img.style.width = actW + "px";
					img.style.height = actH + "px";
					img.style.marginTop = parseInt((setH - actH)/2) + "px";
					if(actW > setW) {
						var marginLeft = parseInt(-(actW - setW) / 2);
						img.style.marginLeft = marginLeft + "px";
					} else {
						var marginLeft = parseInt((setW - actW) / 2);
						img.style.marginLeft = marginLeft + "px";
					}
				}
			} else {
				var newWidthAfterScale = parseInt(actW / scaleRatioH);
				//缩放后宽度大于设定宽度时水平部分显示图片中间
				if (newWidthAfterScale > setW) {
					var exceedW = newWidthAfterScale - setW;
					var marginLeft = parseInt(- (exceedW / 2));
					img.style.width= newWidthAfterScale + "px";
					img.style.height = setH + "px";
					img.style.marginLeft = "" + marginLeft + "px";
				}
			}
		}
	}
	
	var picAdjustLong= function(img,setW,setH){
		var $ = window.$;
		if (!img) {
			return;
		}
		
		var wrapWidth = 0; 
		var wrapHeight = 0;
		if (setW && setH) {
			wrapWidth = setW;
			wrapHeight = setH;
		} else {
			if (!img.parentElement) {
				return;
			}
			var picAdapter = img.parentElement; //找到外层包裹适配容器DIV
			if (picAdapter.nodeName == "A") {
				picAdapter = picAdapter.parentElement;
			}
			console.log('2:'+picAdapter.clientWidth);
			wrapWidth = $ ? $(picAdapter).width() : picAdapter.clientWidth;
			wrapHeight = $ ? $(picAdapter).height() : picAdapter.clientHeight;
		}
		// 获取图片原始宽高
		var naturalDim = getNaturalDimention(img, function(){
			var actImg = this;
			doAdjustLong(img, wrapWidth, wrapHeight, actImg.width, actImg.height);
		});
		if (naturalDim) {
			doAdjustLong(img, wrapWidth, wrapHeight, naturalDim[0], naturalDim[1]);
		}
	};
	
	var doAdjustLong = function(img,setW, setH, originWidth, originHeight) {
		var widthHeightRatio = originWidth / originHeight;
		var wRatio = originWidth / setW, hRatio = originHeight / setH;
		var scaledWidth = originWidth, scaledHeight = originHeight;
		if (wRatio > hRatio) { // 长边是宽
			scaledWidth = Math.min(originWidth, setW);
			scaledHeight = parseInt((scaledWidth / widthHeightRatio));
		} else { // 长边是高
			scaledHeight = Math.min(originHeight, setH);
			scaledWidth = parseInt((scaledHeight * widthHeightRatio));
		}
		
		img.style.width = scaledWidth + "px";
		if (setW >= scaledWidth) {
			var marginLeft = parseInt((setW - scaledWidth) / 2);
			img.style.marginLeft = marginLeft + "px";
		}
		if (setH >= scaledHeight) {
			img.style.height = scaledHeight + "px";
			var marginTop = parseInt((setH - scaledHeight) / 2);
			img.style.marginTop = marginTop + "px";
		}
	}
	
	var getNaturalDimention = function(img, callback) {
		if (img.naturalWidth) {
			return [img.naturalWidth, img.naturalHeight];
		} else {
			var memImg = new Image();
			memImg.onload=function(){
				callback.apply(memImg);
			};
			memImg.src = img.src;
			return null;
		}
	}
	
	
	window.picAdjust = picAdjust;
	window.picAdjustLong = picAdjustLong;
})();
