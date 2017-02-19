// 用于控制图片翻转

// 3、通用函数
function g(selector){
	var method = (selector.substr(0,1)==".") ? 'getElementsByClassName':'getElementById';
	return document[method](selector.substr(1));
}

// 随机生成一个值,支持取值范围，范围参数数组：[min,max]
function randomPhoto( range ){
	var max = Math.max( range[0], range[1] );
	var min = Math.min( range[0], range[1] );

	var diff = max - min;
	var num = Math.floor(Math.random()*diff + min);

	return num;
}

// 4、输出所有海报
var data = data;
function addPhotos(){
	var template = g('#wrap').innerHTML;
	var html = [];
	var nav = [];
	for (var i = 0; i < data.length; ++i) {
		var _html = template
						.replace('{{index}}',i)
						.replace('{{img}}',data[i].img)
						.replace('{{caption}}',data[i].caption)
						.replace('{{desc}}',data[i].desc);
		html.push(_html);

		nav.push('<span id="nav_' + i + '" onclick="turn(g(\'#photo_' + i + '\'))" class="i">&nbsp</span>');
	}
	html.push('<div class="nav">' + nav.join("") + '</div>');

	g('#wrap').innerHTML = html.join("");
	rsort( randomPhoto( [0,data.length] ) );
}
addPhotos();

// 分区控制函数
function range(){
	var range = { left:{y:[]} , right:{y:[]} };

	var _wrapModel  = {
		w: g('#wrap').clientWidth,
		h: g('#wrap').clientHeight
	};
	var _photoModel = {
		w: g('.photo')[0].clientWidth,
		h: g('.photo')[0].clientHeight
	};
	range.left.y = [ _photoModel.h/3, _wrapModel.h-_photoModel.h/3 ];
	range.right.y = [ _photoModel.h/3, _wrapModel.h-_photoModel.h/3 ];
	return range;
}

//5、排序photo,执行分区
function rsort(n){
	var _photo = g('.photo');
	var photos = [];
	for (var i = 0; i < _photo.length; i++) {
		if (/photo_center/.test(_photo[i].className)) {
			_photo[i].className = _photo[i].className.replace(/\s*photo_center\s*/,'');
		}

		_photo[i].style.top  = "";
		_photo[i].style.left = "";
		_photo[i].style['transform']         = 'rotate(360deg) scale(1)';
		_photo[i].style['-webkit-transform'] = 'rotate(360deg) scale(1)';
		_photo[i].className = _photo[i].className.replace(/photo_back/,'photo_front');

		photos.push( _photo[i] );
	}
	// 为center选中photo增加class样式
	var photo_center = g('#photo_' + n);
	photo_center.className += " photo_center";
	// 为选中i增加class样式，并清除历史i_current
	var navs = g('.i');
	for (var i = 0; i < navs.length; i++) {
		navs[i].className = navs[i].className.replace(/\s*i_back/,'');
		navs[i].className = navs[i].className.replace(/\s*i_current/,'');
	}
	g('#nav_' + n).className += " i_current";
	// 从photos数组移出选中图片
	photo_center = photos.splice(n,1)[0];

	// 分成两部分photo区域,分组、设置区域限制、设置随机角度
	var photos_left = photos.splice( 0,Math.ceil(photos.length/2) );
	var photos_right = photos;
	var _wrapModel  = {
			w: g('#wrap').clientWidth,
			h: g('#wrap').clientHeight
		};
		var _photoModel = {
			w: g('.photo')[0].clientWidth,
			h: g('.photo')[0].clientHeight
		};

	var _range = range();
	for ( s in photos_left ) {
		var photoOfLeft = photos_left[s];
		var leftY = randomPhoto( _range.left.y );
		var leftX = _wrapModel.w/2 - Math.sqrt(160000-(Math.pow(leftY-_wrapModel.h/2,2) ) );
		photoOfLeft.style.left = leftX + 'px';
		photoOfLeft.style.top  = leftY + 'px';
		photoOfLeft.style['transform']         = 'rotate(' + randomPhoto([-45,45]) + 'deg) scale(.6)';
		photoOfLeft.style['-webkit-transform'] = 'rotate(' + randomPhoto([-45,45]) + 'deg) scale(.6)';
	}
	for ( s in photos_right ) {
		var photoOfRight = photos_right[s];
		var rightY = randomPhoto( _range.right.y );
		var rightX = _wrapModel.w/2 + Math.sqrt(160000-(Math.pow(rightY-_wrapModel.h/2,2) ) );
		photoOfRight.style.left = rightX + 'px';
		photoOfRight.style.top  = rightY + 'px';
		photoOfRight.style['transform']         = 'rotate(' + randomPhoto([-45,45]) + 'deg) scale(.6)';
		photoOfRight.style['-webkit-transform'] = 'rotate(' + randomPhoto([-45,45]) + 'deg) scale(.6)';
	}
}

//1.翻转控制
function turn(el){
	var cls = el.className;
	var n = el.id.split('_')[1];

	if ( !/photo_center/.test(cls) ) {
		return rsort(n);
	}

	if (/photo_front/.test(cls)) {
		cls = cls.replace(/photo_front/,'photo_back');
		g('#nav_' + n).className += ' i_back';
	} else {
		cls = cls.replace(/photo_back/,'photo_front');
		g('#nav_' + n).className = g('#nav_' + n).className.replace(/\s*i_back\s*/,'');
	}
	return el.className = cls;
}