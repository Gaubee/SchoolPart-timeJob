
(function ($) {

    //公告栏
    $("#info p").mouseover(function (e) {
        //var mes = $()
        //$("#info p").append()
        e = e || event;
        title.show("双击进行编辑", e);
    }).mousemove(function (e) {
        e = e || event;
        title.move(e);
    }).mouseout(function () {
        title.hide();
    }).dblclick(function () {//进行编辑
        var pDOM = this;
        if (!pDOM.editing) {
            title.hide();
            var p = $(this);
            var content = p.text();
            p.html('<div class="input-control textarea"><textarea maxlength="120" row = "3">' + $.trim(content) + '</textarea></div>');
            var textarea = p.find("textarea");
            textarea.focus();
            textarea.blur(function () {
                //console.log(textarea.html());
                pDOM.editing = false;
                p.html($.toTxt(textarea.val()));
            }).dblclick(function () { }).mousemove(function () { }).mouseover(function () { });
            pDOM.editing = true;
        }
    });
    var people = $("#human .people"); //用户
    (function () {
        people.click(function () {
            aid.slider();
        });
    })();

    var employLoadButton = $("#employLoadButton"); //登录按钮
    employLoadButton.click(function () {
        loading.toload();
    });

    //标题取代框
    var title = {
        _$: document.getElementById("title"),
        ti: null,
        show: function (str, e) {
            this._$.style.display = "block";
            this._$.style.left = e.clientX + 10 + "px";
            this._$.style.top = e.clientY + 10 + "px";
            this._$.innerHTML = str;
            clearTimeout(this.ti);
        },
        move: function (e) {
            this._$.style.left = e.clientX + 10 + "px";
            this._$.style.top = e.clientY + 10 + "px";
            //clearTimeout(this.ti);
        },
        hide: function () {
            var obj = this._$;
            this.ti = setTimeout(function () {
                obj.style.display = "none";
            }, 200)
        }
    };
    title.hide();


    //滚动
	DOMwhell(document.getElementById("interface"), 600);
	DOMwhell(document.getElementById("news"), 600);
    DOMwhell(document.getElementById("mask"), 1, true);
    DOMwhell(document.getElementById("loading"), 1, true);
    DOMwhell(document.getElementById("message"), 1, true);
    DOMwhell($("#aid .page")[0]);

    //页面初始化 

    //ready
    aid.slider(0); //隐藏用户简要信息页
    loading.noload(); //隐藏加载页
    message.message("欢迎回来");
})(jQuery);
