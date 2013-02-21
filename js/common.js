(function ($) {
	window.alert = function(str){
		$.Dialog({
				'title'       : '警告！',
				'content'     : str,
				'draggable'   : false,
				'overlay'     : true,
				'closeButton' : true,
				'buttonsAlign': 'center',
				'position'    : {
					'zone'    : 'center'
				},
				'buttons'     : {
					'确定'     : {
						'action': function(){
							clearTimeout( alert.ti );
							return true;
						}
					},
				}
			});
			alert.ti = setTimeout(function(){
				$("#dialogOverlay").animate({
					opacity:0
				},1000);
				setTimeout(function(){
					$("#dialogOverlay .icon-cancel-2").click();
				},1000)
			},str.length*100);
	}
    window.mask = $("#mask");
    window.loading = $("#loading");
    window.interface = $(".interface");
    (function () {//mask-init
        mask.record = function () {
            this.hisarry = this.hisarry || { length: 0 };
            this.hisarry[this.hisarry.length] = this.attr("class");
            this.hisarry.length++;
            //console.log(this.hisarry);
        }
        mask.back = function (time) {
            time = time || 0;
            if (this.hisarry) {
                var his = this.hisarry[--this.hisarry.length];
                //console.log(this.hisarry.length);
                //console.log(his);
                switch (his) {
                    case "mask-middle":
                        middle(time); break;
                    case "mask-top":
                        top(time); break;
                    default:
                        none(time); break;
                }
                return 1;
            } else {
                none(time);
                return 0;
            }
        }
        var none = function (time) {//私有
            time = time || 300;
            mask.removeClass().toggleClass("mask-none");
            //interface.css("-webkit-filter", "blur(0px)");
            interface.css({ "blur": "0px" });
            aid.css({ "blur": "0px" });
            //            interface.animate({ "blur": "0px" }, time);
            //            aid.animate({ "blur": "0px" }, time);
        };
        var middle = function (time) {//私有
            mask.removeClass().toggleClass("mask-middle");
            interface.css({ "blur": "1px" });
            aid.css({ "blur": "0px" });
            //            interface.animate({ "blur": "1px" }, time);
            //            aid.animate({ "blur": "0px" }, time);
        }
        mask.middle = function (time) {
            time = time || 300;
            mask.record();
            middle(time);
        }
        var top = function (time) {
            mask.removeClass().toggleClass("mask-top");
            //            interface.css({ "blur": "3px" });
            //            aid.css({ "blur": "3px" });
            //            console.log("blur-top" + interface[0]);
            interface.animate({ "blur": "3px" }, time);
            aid.animate({ "blur": "3px" }, time);
        }
        mask.top = function (time) {
            time = time || 300;
            mask.record();
            top(time);
        };
    })();
    (function () {//loading-init
        loading.toload = function () {
            mask.top();
			for (var i=0;i<5 ; ++i)
			{
				setTimeout(function(){
				loading.find(".loading").append('<div class="dot"></div>');},1);
			}
            this.show();
        }
        loading.noload = function () {
            mask.back();
			loading.find(".loading").html(" ");
            this.hide();
        }
        loading.find(".place-right").click(function () {
            loading.noload();
        });
    })();

    window.message = $("#message");
    (function () {
        var messageContent = $("#message-content");
        message.message = function (mes) {
            messageContent.html(mes);
            message.show();
            mask.top();
        };
        var messageButton = message.find(".place-right");
        messageButton.click(function () {
            message.hide();
            mask.back();
        });
    })()
    window.aid = $("#aid");
    (function () {//aid-init
        aid.slider = function (time) {
			var aidSliderButton = aid.find(".rollback");
            time = time || 300;
            if (!this.hasClass("hidden")) {
                mask.back();
                var width = this.css("width");
                this.animate({ right: '-' + width }, time, function () {
                    $(this).addClass("hidden");
                });
            } else {
                mask.middle();
                this.removeClass("hidden");
                aidSliderButton.animate({ rotate: '0deg' }, 200 + time);
                this.animate({ right: 0 }, time);
            }
        }
		aid.on("click",".rollback",function () {
            aid.slider(500);
			var aidSliderButton = $(this);
            aidSliderButton.animate({ rotate: '-180deg' }, 300);
        })
    })();

    //window.toolbarButtons = $(".toolbar button");
    window.toolbarButtonsInit = function () {//toolbar-init
		window.toolbarButtons = $(".toolbar button");
        toolbarButtons.each(function () {
            var obj = $(this);
			
				var icon = obj.find("i");
				var originalWidth = parseInt(obj.css("width"));
				icon.html(icon.attr("title"));
				var iconWidth = parseInt(icon.css("width"));
				icon.html("");
				var Width = originalWidth + iconWidth;
				obj.off();
				obj.on('click',function () {
					icon.html(icon.attr("title"));
					icon.css({ "marginRight": -iconWidth });
					icon.stop().animate({ "marginRight": 0 }, iconWidth * 6);
					obj.stop().animate({ "width": Width }, iconWidth * 6);
				}).on('mouseout',function () {
					if (icon.html() !== "") {
						icon.stop().animate({ "marginRight": -iconWidth }, Width * 3);
						obj.stop().animate({ "width": originalWidth }, Width * 3, function () {
							icon.html("");
							icon.css({ "marginRight": 0 });
						});
					}
				});
				obj.attr("init",true);
			
        });
    };

    //extend jQuery
    $.toTxt = function (str) {
        var RexStr = /\<|\>|\"|\'|\&/g
        str = str.replace(RexStr,
        function (MatchStr) {
            switch (MatchStr) {
                case "<":
                    return "&lt;";
                    break;
                case ">":
                    return "&gt;";
                    break;
                case "\"":
                    return "&quot;";
                    break;
                case "'":
                    return "&#39;";
                    break;
                case "&":
                    return "&amp;";
                    break;
                default:
                    break;
            }
        }
    );
        return str;
    }


})(jQuery);
    //标题取代框
    var title = {
        _$: document.getElementById("title"),
        ti: null,
        show: function (str, e) {
			//this._$ = document.createElement("div");
            this._$.style.display = "block";
            this._$.style.left = e.clientX + 10 + "px";
            this._$.style.top = e.clientY + 15 + "px";
            this._$.innerHTML = str;
            //clearTimeout(this.ti);
			//console.log(str);
			$(this._$).stop().show(20);
        },
        move: function (e) {
            this._$.style.left = e.clientX + 10 + "px";
            this._$.style.top = e.clientY + 15 + "px";
            //clearTimeout(this.ti);
			//$(this._$).stop().show(20);
        },
        hide: function () {
            var obj = this._$;
			if(obj){
				/*this.ti = setTimeout(function () {
					obj.style.display = "none";
					console.log("hidden");
				}, 200);*/
				$(obj).hide(200,"easeIn");
			}
        }
    };
    title.hide();
