
(function ($) {

    //公告栏
    $("#info p").mouseover(function () {
        //$(this).wrap("<blockquote title='双击进行修改' style='margin-top:0px;margin-bottom:-5px;padding-top:0px;'></blockquote>");
        //$(this).attr("tageName", "blockquote");
    }).mouseout(function () {
        //$(this).unwrap();
    }).dblclick(function () {//进行编辑
        var pDOM = this;
        if (!pDOM.editing) {
            var p = $(this);
            var content = p.text();
            p.html('<div class="input-control textarea"><textarea maxlength="120" row = "3">' + $.trim(content) + '</textarea></div>');
            var textarea = p.find("textarea");
            textarea.focus();
            textarea.blur(function () {
                //console.log(textarea.html());
                pDOM.editing = false;
                p.html($.toTxt(textarea.val()));
            }).dblclick(function () { });
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
