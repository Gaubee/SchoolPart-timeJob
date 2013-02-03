
(function ($) {
    //日历
    var days = $(".days");
    days.each(function () {
        var datas = eval(this.title);
        if (datas) {
            console.log(datas);
            var day = $(this);
            var Height = day.height();
            var Proportion = 60 * 60 * 18 / Height;
            var dutys = [];
            var configs = [];
            for (var i = 0; i < datas.length; i++) {
                var data = datas[i];
                //                console.log(data);
                var config = {
                    num: i,
                    P_Height: null, //滑块堆叠位置
                    height: parseInt(parseInt(data.delay) / Proportion), //滑块大小
                    star: parseInt((parseInt(data.begin) - 60 * 60 * 6) / Proportion), //滑块时间点位置
                    canControl: false//能否控制滑块
                };
                Height -= config.height;
                config.P_Height = Height;
                console.log(Height);
                var duty = $("<span class='duty span1'></span>");
                duty.css({ height: config.height, top: config.P_Height, opacity: 0.8 });
                dutys[i] = duty; //保存浮块
                configs[i] = config; //保存浮块配置
                (function (dutyobj, con) {
                    day.mouseover(function () {
                        dutyobj.stop().animate({ top: con.star }, 200, "easeOut", function () {
                            con.canControl = true;
                        });
                    }).mouseout(function () {
                        dutyobj.stop().animate({ top: con.P_Height }, 200, "easeOut", function () {
                            con.canControl = false;
                        });
                    }).dblclick(function (e) {
                        var duty = $("<span class='duty span1'></span>");
                        duty.css({ height: 30, top: 120, opacity: 0.8 });
                        day.append(duty);

                    });
                    var timeControls = {
                        begin: $('<span class="time-control span1 up"></span>'),
                        end: $('<span class="time-control span1 down"></span>')
                    }
                    dutyobj.mouseover(function () {
                        if (con.canControl) {
                            var halfHeight = con.height / 2;
                            timeControls.begin.css({ top: con.star, height: halfHeight - 1 });
                            timeControls.end.css({ top: con.height / 2 + con.star + 1, height: halfHeight - 1 });
                            day.prepend(timeControls.begin);
                            day.prepend(timeControls.end);

                        }
                    }).mouseout(function () {
                        timeControls.begin.remove(); //清除控制柄
                        timeControls.end.remove(); //清除控制柄
                        dutyobj.off("mousemove"); //清除滑块拖动事件
                    }).mousedown(function (e) {//拖动调整
                        var upSetoff = timeControls.begin.offset();
                        if (upSetoff.top < e.clientY && e.clientY < upSetoff.top + timeControls.begin.height() + 1) {
                            dutyobj.on("mousemove", function (e2) { // 向上调整滑块
                                console.log("up");
                                timeControls.begin.remove(); //清除控制柄
                                timeControls.end.remove(); //清除控制柄
                                var disten = e.clientY - e2.clientY;
                                dutyobj.css({ top: con.star - disten, height: con.height + disten });
                                e2.stopPropagation();
                            });
                        } else {
                            dutyobj.on("mousemove", function (e2) { // 向上调整滑块
                                console.log("down");
                                timeControls.begin.remove(); //清除控制柄
                                timeControls.end.remove(); //清除控制柄
                                var disten = e.clientY - e2.clientY;
                                dutyobj.css({ height: con.height - disten });
                                e2.stopPropagation();
                            });
                        }
                    }).mouseup(function (e) { //释放调整
                        dutyobj.off("mousemove");
                        //存储配置信息
                        con.star = parseInt(dutyobj.css("top"));
                        var newheight = parseInt(dutyobj.height());
                        var newheightdis = newheight - con.height;
                        console.log(newheightdis)
                        for (var i = con.num; i < configs.length; i++) {
                            configs[i].P_Height -= newheightdis;
                        }
                        console.log(con.P_Height);
                        con.height = newheight;
                        //重新部署控制柄
                        dutyobj.mouseover();
                        //con.height =  
                    })
                })(duty, config); //浮块对象、配置信息
                day.append(duty);
                // console.log(dayPosition + "|" + star);
            }
        }
    })
})(jQuery);
