//View Control
(function ($) {

    //公告栏
    var Interface = $("#interface");
    Interface.on("mouseover", "#info p", function (e) {
        //var mes = $()
        //$("#info p").append()
        e = e || event;
        title.show("双击进行编辑", e);
    }).on("mousemove", "#info p", function (e) {
        e = e || event;
        title.move(e);
    }).on("mouseout", "#info p", function () {
        title.hide();
    }).on("dblclick", "#info p", function () {//进行编辑
        var pDOM = this;
        if (!pDOM.editing) {
            title.hide();
            var p = $(this);
            var content = p.text();
            p.html('<div class="input-control textarea" style="height:' + p.height() + 'px;"><textarea maxlength="120" style="height:' + p.height() + 'px;">' + $.trim(content) + '</textarea></div>');
            var textarea = p.find("textarea");
            textarea.focus();
            textarea.blur(function () {
                //console.log(textarea.html());
                pDOM.editing = false;
                p.html($.toTxt(textarea.val()));
            }).dblclick(function () { }).mousemove(function () { }).mouseover(function (e) {
                e.stopPropagation();
            }).mousedown(function (e) {
                e.stopPropagation();
            });
            pDOM.editing = true;
        }
    });
    //按钮功能提示
    $("#frame-page-contents").on("mouseover",".toolbar button",function(e){
        var $self = $(this);
        var $detial = $self.parent().find(".detial-text");
        if ($detial.length) {
            $detial.html($self.attr("title"));
        };
    }).on("mouseout",".toolbar button",function(e){
        var $self = $(this);
        var $detial = $self.parent().find(".detial-text");
        if ($detial.length) {
            $detial.html("");
        };
    })
    //用户
    //	Interface.on("click", ".people", function () {
    //		aid.slider();
    //	});
    





    //滚动
    DOMwhell(document.getElementById("interface"), 600);
    DOMwhell(document.getElementById("frame-page-all-department"), 486);
    DOMwhell(document.getElementById("list"), 600);
    DOMwhell(document.getElementById("mask"), 1, true);
    DOMwhell(document.getElementById("loading"), 1, true);
    DOMwhell(document.getElementById("message"), 1, true);
    DOMwhell($("#aid .page")[0]);

    //页面初始化 

    //ready
    aid.slider(0); //隐藏用户简要信息页
    loading.noload(); //隐藏加载页
    message.message("欢迎回来");
})(jQuery, Ember);
