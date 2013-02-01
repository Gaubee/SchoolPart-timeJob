
(function ($) {

    //公告栏
    $("#info p").mouseover(function (e) {
        //var mes = $()
        //$("#info p").append()
        e = e || event;
        title.show("双击进行编辑", e);
    }).mousemove(function(e){
        e = e || event;
        title.move( e);
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
    })
})(jQuery);
