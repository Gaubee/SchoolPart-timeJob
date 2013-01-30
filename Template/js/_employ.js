
(function ($) {
    var mask = $("#mask");
    var loading = $("#loading");
    var interface = $("#interface");
    (function () {//mask-init
        mask.record = function () {
            this.hisarry = this.hisarry || [];
            this.hisarry[this.hisarry.length] = this.attr("class");
        }
        mask.back = function (time) {
            time = time || 0;
            if (this.hisarry) {
                var his = this.hisarry[this.hisarry.length - 1];
                --this.hisarry.length;
                switch (his) {
                    case "mask-middle":
                        mask.middle(time); break;
                    case "mask-top":
                        mask.top(time); break;
                    default:
                        none(time); break;
                }
                return 1;
            } else {
                none(time);
                return 0;
            }
        }
        var none = function (time) {//к╫сп
            time = time || 300;
            mask.removeClass().toggleClass("mask-none");
            //interface.css("-webkit-filter", "blur(0px)");
            interface.animate({ "blur": "0px" }, time);
            aid.animate({ "blur": "0px" }, time);
        };
        mask.middle = function (time) {
            time = time || 300;
            mask.record();
            this.removeClass().toggleClass("mask-middle");
            interface.animate({ "blur": "1px" }, time);
            aid.animate({ "blur": "0px" }, time);
        }
        mask.top = function (time) {
            time = time || 300;
            mask.record();
            this.removeClass().toggleClass("mask-top");
            interface.animate({ "blur": "3px" }, time);
            aid.animate({ "blur": "3px" }, time);
        };
    })();
    loading.toload = function (time) {
        time = time || 400;
        mask.top();
        this.show();
        var icon = this.find("i");
        clearInterval(loading.time);
        var load = function () {
            //                        icon.stop();
            //                        icon.animate({ rotate: '360deg' }, time, function () {
            //                            icon.css({ rotate: '0deg' });
            //                        });
            var ftp = 32;
            for (var i = 0; i < ftp; i++) {
                Tools.TimeOut(function (Coefficient, deg) {
                    //                    var top = -Math.sin(deg);
                    //                    var left = -Math.cos(deg);
                    icon.css({ rotate: Coefficient * 360 + 'deg' });
                    //                    icon.css({ rotate: Coefficient * 360 + 'deg', top: top * 10, left: left * 5 });
                }, i / ftp * time, [i / ftp, i / ftp * Math.PI]);
            }
        }; load();
        loading.time = setInterval(load, time);
    }
    loading.noload = function () {
        mask.back();
        this.hide();
        clearInterval(loading.time);
        //this.find("i").stop();
    }
    loading.find(".place-right").click(function () {
        loading.noload();
    })
    var people = $("#human .people");
    var aid = $("#aid");
    var aidSliderButton = aid.find(".rollback");
    aid.slider = function (time) {
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
    aidSliderButton.click(function () {
        aid.slider(500);
        aidSliderButton.animate({ rotate: '-180deg' }, 300);
    });
    people.click(function () {
        aid.slider();
    });

    var toolbarButtons = $(".toolbar button");
    toolbarButtons.each(function () {
        var obj = $(this);
        var icon = obj.find("i");
        var originalWidth = parseInt(obj.css("width"));
        var iconWidth = parseInt(icon.css("width"));
        icon.attr("title", icon.html());
        icon.html("");
        var Width = originalWidth + iconWidth;
        obj.click(function () {
            icon.html(icon.attr("title"));
            icon.css({ "marginRight": -iconWidth });
            icon.stop().animate({ "marginRight": 0 }, iconWidth * 6);
            obj.stop().animate({ "width": Width }, iconWidth * 6);
        }).mouseout(function () {
            if (icon.html() !== "") {
                icon.stop().animate({ "marginRight": -iconWidth }, Width * 3);
                obj.stop().animate({ "width": originalWidth }, Width * 3, function () {
                    icon.html("");
                    icon.css({ "marginRight": 0 });
                });
            }
        });
    });

    var employLoadButton = $("#employLoadButton");
    employLoadButton.click(function () {
        loading.toload(4000);
    })

    //ready
    aid.slider(0);
    loading.noload();
    //loading.toload(600);
})(jQuery);
