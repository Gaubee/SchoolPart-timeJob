//(function($){
//move
	function mousePos(e){ 
		 var x,y; 
		 var e = e||window.event; 
		 var point = { 
			 x:e.screenX,//e.clientX+document.body.scrollLeft+document.documentElement.scrollLeft, 
			 y:e.screenY//e.clientY+document.body.scrollTop+document.documentElement.scrollTop 
		 }; 
		//	 console.log(point);
		 return point;
	}

	var DOMmove = function(b){
		var move = {
			time:null,
				point:{x:null,y:null}
		};
		b.onmousedown  = function(event){
			var  e = event || window.event;

			move.point = mousePos(e);
			b.onmousemove = function(lateevent){
				var latee = lateevent || window.event;
				var point = mousePos(latee);
				//console.log((point.x+":"+move.point.x)+"|"+ (point.y +":"+move.point.y));
				window.moveBy(point.x - move.point.x, point.y -move.point.y);
				move.point.x = point.x;
				move.point.y = point.y;
			};
		}
		b.onmouseup = function(){
			this.onmousemove = function(event){
				var  e = event || window.event;
				//console.log((e));
			};
		};
	}
	DOMmove(document.body);

//Wheel

//取得滚动值 
function getWheelValue( e ) 
{ 
	e = e||event; 
	return ( e.wheelDelta ? e.wheelDelta/120 : -( e.detail%3 == 0 ? e.detail/3 : e.detail ) ) ; 
} 
var DOMwhell = function(obj,maxheight){
	function stopEvent(e) //阻止冒泡
	{ 
		e = e||event; 
		if( e.preventDefault )e.preventDefault(); 
		e.returnValue = false; 
	} 
	//绑定事件,这里对mousewheel做了判断,注册时统一使用mousewheel 
	function addWhellEvent( obj,fn ) 
	{ 
		var isFirefox = typeof document.body.style.MozUserSelect != 'undefined'; 
		if( obj.addEventListener ) 
			obj.addEventListener( isFirefox ? 'DOMMouseScroll' : 'mousewheel',fn,false ); 
		else 
			obj.attachEvent( 'onmousewheel',fn ); 
		return fn; 
	} 
	/*
	//移除事件,这里对mousewheel做了兼容,移除时统一使用mousewheel 
	function delWhellEvent( obj,fn ) 
	{ 
		var isFirefox = typeof document.body.style.MozUserSelect != 'undefined'; 
		if( obj.removeEventListener ) 
			obj.removeEventListener( isFirefox ? 'DOMMouseScroll' : 'mousewheel',fn,false ); 
		else 
			obj.detachEvent( 'onmousewheel',fn ); 
	} 
	*/
	function range( num, max,min ) 
	{ 
		return Math.min( max, Math.max( num,min ) ); 
	} 
	var jQobj = $(obj);
	var mt = parseInt( jQobj.css("marginTop") );
	//var width =parseInt( jQobj.css("width") );
		var height = parseInt(jQobj.css("height") );
	//初始化
	jQobj.css({"overflow":"hidden","maxHeight":maxheight});
	//jQobj.append("")
	var px = 120;//单位滚动像素
	//var Interval = false;//降低滚动监听的帧数
	addWhellEvent(obj,function(e){
			var delta = getWheelValue(e); 
			var marginTop  = parseInt( jQobj.css("marginTop") );
			delta = delta>0?marginTop+px:marginTop-px;
			console.log(delta);
			var readelta = range(delta,mt,(maxheight-height));
			jQobj.stop().animate({"marginTop":delta},300,function(){
				jQobj.animate({"marginTop":readelta},200);
			});
	});
}

/*限制范围函数, 
参数是三个数字,如果num 大于 max, 则返回max， 如果小于min，则返回min,如果在max和min之间，则返回num 
*/ 
DOMwhell(document.body,600);
//})(jQuery);