//database
(function ($) {
    var BaseURL = "file:///E:/Github/SchoolPart-timeJob/data/";
    $.getData = function (url, data, callback, type) {
        type = type || "GET";
        data = data || {};
        var result = null;
        $.ajax({
            dataType: "json",
            url: BaseURL + url,
            data: data,
            cache: false,
            error: function () {//先执行
                //从数据库获取数据，历史url记录
                result = {};
            },
            success: function (newdata) {//先执行
                result = newdata;
            },
            complete: function () {//执行回调函数
                if (result) {//如可需要执行回调函数
                    callback.call(this, result);
                }
            },
            type: type
        });
        return result;
    }
    window.DataBase = {
        Student: {
            Login: function () {
                var url = "Student/Login.json";
                $.getData(url);
            },
            Logout: function () {
                var url = "Student/Logout.json";
                $.getData(url);
            },
            GetLoginMessage: function () {
                var url = "Student/GetLoginMessage.json";
                $.getData(url);
            },
            GetMessage: function () {
                var url = "Student/GetMessage.json";
                $.getData(url);
            }
        },
        Teacher: {
            Login: function () {
                var url = "Teacher/Login.json";
                $.getData(url);
            },
            Logout: function () {
                var url = "Teacher/Logout.json";
                $.getData(url);
            },
            GetMessage: function () {
                var url = "Teacher/GetMessage.json";
                $.getData(url);
            },
            GetStudentList: function () {
                var url = "Teacher/GetStudentList.json";
                $.getData(url);
            },
            EvaluationStudent: function () {
                var url = "";
                $.getData(url);;
            },
            ModifyMessage: function () {
                var url = "Teacher/ModifyMessage.json";
                $.getData(url);
            }
        },
        Admin: {
            DeleteUser: function () {
                var url = "Admin/DeleteUser.json";
                $.getData(url);
            },
            GetTeacherList: function () {
                var url = "Admin/GetTeacherList.json";
                $.getData(url);
            },
            Login: function () {
                var url = "Admin/Login.json";
                $.getData(url);
            },
            Logout: function () {
                var url = "Admin/Logout.json";
                $.getData(url);
            },
            OperatorStudent: function () {
                var url = "Admin/OperatorStudent.json";
                $.getData(url);
            },
            OperatorTeacher: function () {
                var url = "Admin/OperatorTeacher.json";
                $.getData(url);
            }
        }
    }
})(jQuery);