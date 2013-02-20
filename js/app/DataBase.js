﻿//database
(function ($) {
    var BaseURL = "http://localhost:13543/";
    $.getData = function (url, data, callback, type) {
        type = type || "GET";
        data = data || {};
		callback = callback||function(){};
        var result = null;
        $.ajax({
            dataType: "json",
            url: BaseURL + url,
            data: data,
            cache: false,
            error: function () {//先执行
                //从数据库获取数据，历史url记录
                result = localStorage.getItem(url);
				//log()
				alert("network error");
            },
            success: function (newdata) {//先执行，并写入数据库
                result = newdata;
				localStorage.setItem(url,newdata);
            },
            complete: function () {//执行回调函数
                if (result) {//如可需要执行回调函数
					try{
                    callback.call(this, result);
					}catch(e){

						try{
							console.log(result)
							var error = result.Error[0].describe;
							alert(error);
						}catch(e){
							alert("操作失败！");
						}
					//
					}
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
            GetStudentList: function (teacherId,foo) {
                var url = "teacher/GetStudentList.ashx";
                $.getData(url,{Pid:teacherId},function(data){
					var _super = data;
					var formattedData = [{}];
					var T_StudentList = data. T_StudentList;
					var Length = T_StudentList.length;
					for (var i=0;i<Length ; ++i)
					{
						var student = T_StudentList[i];
						formattedData[i]={
							
						}

					}
					if (foo){
						foo(formattedData);
					}
				});
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
            GetTeacherList: function (foo) {
                var url = "Admin/GetTeacherList.ashx";
                $.getData(url,{},function(data){
					var _super = data;
					var formattedData = [{}];
					var T_TeacherList = data. T_TeacherList;
					var Length = T_TeacherList.length;
					for (var i=0;i<Length ; ++i)
					{
						var teacher = T_TeacherList[i];
						formattedData[i]={
							id : teacher.uid.trim(),
							Name:teacher.name.trim(),
							ResponsibleTeacher:teacher.responsibleteacher.trim(),
							Phone:teacher.phone.trim(),
							UseSign:!!(teacher.usesign-0),
							RegisterNum:teacher.registernum.trim()
						}
					}
					if (foo){
						foo(formattedData);
					}
				});
            },
            Login:  function (data) {
				var data = data||{
					RegisterNum:"333333",
					Password:"111111"
				}
                var url = "Sign/Login.ashx?Type=0";
                $.getData(url,data,function(result){
					//console.log(result);
				});
            },
            Logout: function () {
                var url = "Admin/Logout.json";
                $.getData(url);
            },
            OperateStudent: function (data,foo) {
                var url = "Admin/OperateStudent.ashx";
                $.getData(url);
            },
            OperateTeacher: function (formatData,foo) {
                var url = "Admin/OperateTeacher.ashx";
                $.getData(url,formatData,function(data){
						data = data.Modify||data.Add;
						data = data[0].T_TeacherMessage;
						formattedData={
							id : data.id.trim(),
							Name:data.name.trim(),
							ResponsibleTeacher:data.responsibledata.trim(),
							Phone:data.phone.trim(),
							UseSign:!!(data.usesign-0),
							RegisterNum:data.registernum.trim()
						}
					if (foo){
						foo(formattedData);
					}
				});
            },
			AddTeacher:function(data,foo){
				var formatData = {
						type : "Add",
						Name : data.Name,
						RegisterNum : data.RegisterNum,
						Password : data.Password,
						Phone : data.Phone,
						ResponsibleTeacher : data.ResponsibleTeacher,
						UseSign : (data.UseSign?1:0)
				};
				this.OperateTeacher(formatData,foo)
			},
			ModifyTeacher:function(data,foo){
				var formatData = {
						Id : data.id,
						Name : data.Name,
						RegisterNum : data.RegisterNum,
						Password : data.Password,
						Phone : data.Phone,
						ResponsibleTeacher : data.ResponsibleTeacher,
						UseSign : (data.UseSign?1:0)
				};
				this.OperateTeacher(formatData,foo)
			}
			//
        }
    }
})(jQuery);