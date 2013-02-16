//(function($){
//move
function mousePos(e) {
    var x, y;
    var e = e || window.event;
    var point = {
        x: e.screenX, //e.clientX+document.body.scrollLeft+document.documentElement.scrollLeft, 
        y: e.screenY//e.clientY+document.body.scrollTop+document.documentElement.scrollTop 
    };
    //	 console.log(point);
    return point;
}

var DOMmove = function (b) {
    var move = {
        time: null,
        point: { x: null, y: null }
    };
    b.onmousedown = function (event) {
        var e = event || window.event;

        move.point = mousePos(e);
        b.onmousemove = function (lateevent) {
            var latee = lateevent || window.event;
            var point = mousePos(latee);
            //console.log((point.x+":"+move.point.x)+"|"+ (point.y +":"+move.point.y));
            try{
				window.moveBy(point.x - move.point.x, point.y - move.point.y);
			}catch(e){
				//console.error(e);
			}
            move.point.x = point.x;
            move.point.y = point.y;
        };
    }
    b.onmouseup = function () {
        this.onmousemove = function (event) {
            var e = event || window.event;
            //console.log((e));
        };
    };
}
DOMmove(document.body);

//Wheel

//取得滚动值 
function getWheelValue(e) {
    e = e || event;
    return (e.wheelDelta ? e.wheelDelta / 120 : -(e.detail % 3 == 0 ? e.detail / 3 : e.detail));
}
var DOMwhell = function (obj, maxheight, isNull) {
    if (!maxheight) {
        maxheight = parseInt($("body").height());
    }
    function stopEvent(e) //阻止默认事件
    {
        e = e || event;
        if (e.preventDefault) e.preventDefault();
        console.log(e.stopPropagation());
        e.returnValue = false;
    }
    //绑定事件,这里对mousewheel做了判断,注册时统一使用mousewheel 
    function addWhellEvent(obj, fn) {
        var isFirefox = typeof document.body.style.MozUserSelect != 'undefined';
        if (obj) {
            if (obj.addEventListener)
                obj.addEventListener(isFirefox ? 'DOMMouseScroll' : 'mousewheel', fn, false);
            else
                obj.attachEvent('onmousewheel', fn);
        }
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
    function range(num, max, min) {
        return Math.min(max, Math.max(num, min));
    }
    var jQobj = $(obj);
    var mt = parseInt(jQobj.css("marginTop"));
    //初始化
    if (obj === document.body) {
        jQobj.wrap("<body></body>");
        var id = "WhellEvent" + Math.random();
        jQobj.html("<div id='" + id + "'>" + jQobj.html() + "</div>");
        jQobj = $("#" + id);
        jQobj.parent().css({ "overflow": "hidden", "maxHeight": maxheight });
    } else {
        jQobj.wrap("<div></div>");
        //jQobj.html("<div>"+jQobj.html()+"</div>");
        jQobj.parent().css({ "overflow": "hidden", "maxHeight": maxheight, "display": "inline" });
        jQobj.parent().parent().css({ "overflow": "hidden" });
    }
    jQobj.append('<div class="wheel"><div class="scroll-bar"></div></div>');
    var wheel_P = jQobj.find(".wheel");
    var wheel = wheel_P.find(".scroll-bar");
    setTimeout(function () {
        wheel_P.animate({ "opacity": 0 }, 400, "easeIn");
    }, 2000);
    var height = parseInt(jQobj.css("height"));
    wheel.css({ "height": (maxheight / height) * 100 + "%", "opacity": .8 });
    //console.log(jQobj.parent())
    var px = 80; //单位滚动像素
    //var Interval = false;//降低滚动监听的帧数
    if (!isNull) {
        addWhellEvent(obj, function (e) {
            var height = parseInt(jQobj.css("height"));
            var delta = getWheelValue(e);
            var marginTop = parseInt(jQobj.css("marginTop"));
            delta = delta > 0 ? marginTop + px : marginTop - px;
            var readelta = range(delta, mt, (maxheight - height));
            jQobj.css({ "marginTop": delta });
            if (readelta !== delta) {
                //console.log(maxheight + "-" + height + " = " + readelta);
                clearTimeout(jQobj.ti); jQobj.stop();
                jQobj.ti = setTimeout(function () {
                    jQobj.stop().animate({ "marginTop": readelta }, 500, "easeOut");
                }, 100);
            }
            //滚动条滚动
            //console.log((readelta / height) * -100);
            wheel_P.stop().animate({ "opacity": .8 }, 200, "easeOut");
            wheel.css({ "height": (maxheight / height) * 100 + "%" });
            wheel.stop().animate({ "top": (readelta / height) * -100 + "%" }, 200, "easeOut", function () {
                clearTimeout(wheel.ti);
                wheel.ti = setTimeout(function () {
                    wheel_P.animate({ "opacity": 0 }, 800, "easeIn");
                }, 500);
            });
            e.stopPropagation(); //阻止冒泡
        });

    } else {
        addWhellEvent(obj, function (e) {//空函数，仅仅用来阻止冒泡
            e.stopPropagation();
        });
    }
}


//标题取代框





//})(jQuery);

