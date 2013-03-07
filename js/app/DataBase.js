//database
(function ($) {
    var BaseURL = "http://xnqg.51myqg.com/";
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
            Login: function (content,foo) {
                var url = "Sign/Login.ashx";
                var data = {
					RegisterNum:content.RegisterNum,
					Password:content.Password,
					type:2,
				};
                $.getData(url,data,function(result){
                	var formattedData = {};
                	var student = result.Login[0];
					formattedData = {
						id: student.uid.trim(),
						Name: student.name.trim(),
						TeacherID: student.parentid.trim(),
						Phone: student.phone.trim(),
						Logining: (student.logining==1?true:false),
						RegisterNum: student.registernum.trim(),
						// Password: student.password.trim(),
						Score: student.score.trim(),//评分
						// Evaluate: student.contents.trim(),//评价内容
						img: student.img.trim()||"images/0_head.png",
						Department:student.department.trim(),
						Major:student.major.trim(),

					}
                	if(foo){
                		foo(formattedData);
                	}
                });
            },
            Logout: function () {
                var url = "Student/Logout.json";
                $.getData(url);
            },
            GetSignMessage: function (StudentId,beginTime,endTime,foo) {
                var url = "Student/GetSignMessage.ashx";
                var b = new Date,e = new Date;
                b.setDate(b.getDate()-beginTime);
                e.setDate(e.getDate()-endTime);
                b =	(1900+b.getYear()) +"-"+ (b.getMonth()+1) +"-"+ b.getDate();
                e =	(1900+e.getYear()) +"-"+ (e.getMonth()+1) +"-"+ e.getDate();
                $.getData(url,{Id:StudentId,BeginTime:b,EndTime:e},function(result){
                	var formattedData = [];
                	result = result.T_SignMessageList;
                	for (var i = result.length - 1; i >= 0; i--) {
                		var sign = result[i];
                		formattedData[i] = {
                			id:sign.id.trim(),
                			BeginTime:sign.begintime.trim(),
                			EndTime:sign.endtime.trim(),
                			Gain:sign.gain.trim(),
                		}
                	};
                	if(foo){
                		foo(formattedData);
                	}
                });
            },
            GetMessage: function (studentID,foo) {
                var url = "Student/GetMessage.ashx";
                if (!studentID) {return};
                $.getData(url,{Id:studentID},function(data){
					var formattedData = {};
					
					var student = data.StudentMessageList[0];
					console.log("student data format");
					formattedData = {
						id: student.uid.trim(),
						Name: student.name.trim(),
						TeacherID: student.parentid.trim(),
						Phone: student.phone.trim(),
						Logining: (student.logining==1?true:false),
						RegisterNum: student.registernum.trim(),
						Password: student.password.trim(),
						Score: student.score.trim(),//评分
						Evaluate: student.contents.trim(),//评价内容
						img: student.img.trim()||"images/0_head.png",
						Department:student.department.trim(),
						Major:student.major.trim(),

					}
					/**/
					if (foo){
						foo(formattedData);
					}
                });
            },
            Sign:{
            	SignIn:function(Tid,Sid,foo){
            		var url = "Sign/Sign.ashx";
               		$.getData(url,{Tid:Tid,Sid:Sid},function(data){
               			var formattedData = {}
               			var signMes = data.T_Sign[0];
               			formattedData = {
               				//Gain:signMes.gain.trim(),
               				Sid:signMes.id.trim(),
               				LastLoginTime:signMes.begintime.trim(),
               			}
               			if (foo) {
               				foo(data);
               			};
               		})
            	},
            	SignOut:function(sid,foo){
            		var url = "Sign/SignExit.ashx";
               		$.getData(url,{id:sid},function(data){
               			var formattedData = {}
               			var signMes = data.T_Sign[0];
               			formattedData = {
               				Gain:signMes.gain.trim(),
               			}
               			if (foo) {
               				foo(data);
               			};
               		})
            	},
            	ModifyGain:function(signMes,foo){
            		var url = "Sign/ModifySign.ashx";
				    /// ModifySign 修改签到表各数据
				    /// 权限：用工部门以上权限
				    /// 需要：T_Sign需要更改的参数（id除外）
				    /// 执行：修改SId下信息
				    var data = {
				    	id:signMes.id,
				    	gain:signMes.Gain,
				    }
				    $.getData(url,data,function(result){
				    	var formattedData = {};
				    	if (foo) {
				    		foo(formattedData);
				    	};
				    })
            	}
            }
        },
        Teacher: {
            Login: function (data,foo) {
				var data = data||{
					RegisterNum:data.RegisterNum,//"333333",
					Password:data.Password,//"111111"
				}
                var url = "Sign/Login.ashx?Type=1";
                $.getData(url,data,function(result){
					//console.log(result);
					result = result.Login[0];
					var data = {
						type:(result.rank==0?"Admin":"Teacher"),
						Name:result.name.trim(),
						id:result.uid.trim(),
					}
					if (foo) {
						foo(data);
					};
				});
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
				var urlData = teacherId?{Pid:teacherId,Len:100000}:{Len:100000};
				console.log("teacherId:"+teacherId);
                $.getData(url,urlData,function(data){
					var _super = data;
					var formattedData = [];
					var StudentList = data. StudentList;
					var Length = StudentList.length;
					for (var i=0;i<Length ; ++i)
					{
						var student = StudentList[i];
						formattedData[i]={
							id: student.uid.trim(),
							Name: student.name.trim(),
							TeacherID: student.parentid.trim(),
							Phone: student.phone.trim(),
							Logining: (student.logining==1?true:false),
							RegisterNum: student.registernum.trim(),
							Password: student.password.trim(),
							Score: student.score.trim(),
							Evaluate: student.contents.trim(),
							img: student.img.trim()||"images/0_head.png",
							Department:student.department.trim(),
							Major:student.major.trim(),
							Grade:student.grade.trim(),
							Sid:student.sid.trim(),
							LastLoginTime:student.begintime.trim(),
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
            DeleteUser: function (userID,foo) {
                var url = "Admin/DeleteUser.ashx";
                $.getData(url,{Id:userID},foo);
            },
			DeleteUsers:function(users){
				formatData = [];
				var D = this.DeleteUser;
				for (var i=0,len = users.length;i<len ; ++i)
				{
					(function(){
						D(users[i].id,function(data){
							console.log(window.DD = data);
							switch(data.Error[0].num.trim()){
								case '7' : formatData[i] = "成功删除："+users[i].Name+" 。";
											break;
								case '10' : formatData[i] = "删除 "+users[i].Name+" 失败。";
											break;
							}
							alert(formatData[i]);
						} )
					})(i);
				}
				return formatData.join('\n');
			},
            GetTeacherList: function (foo) {
                var url = "Admin/GetTeacherList.ashx";
                $.getData(url,{Len:10000},function(data){
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
							RegisterNum:teacher.registernum.trim(),
							Password:teacher.password.trim(),
						}
					}
					if (foo){
						foo(formattedData);
					}
				});
            },
            Login:  function (data,foo) {
				var data = data||{
					RegisterNum:data.RegisterNum,//"333333",
					Password:data.Password,//"111111"
				}
                var url = "Sign/Login.ashx?Type=0";
                $.getData(url,data,function(result){
					//console.log(result);
					result = result.Login[0];
					var data = {
						type:(result.rank==0?"Admin":"Teacher"),
						Name:result.name.trim(),
						id:result.uid.trim,
					}
					if (foo) {
						foo(data);
					};
				});
            },
            Logout: function () {
                var url = "Admin/Logout.json";
                $.getData(url);
            },
            OperateStudent: function (data,foo) {
                var url = "Admin/OperateStudent.ashx";
                var upData = {
                	Id:data.id,
                	Name:data.Name,
                	Department:data.Department,
                	Major:data.Major,
                	RegisterNum:data.RegisterNum.trim(),
                	Password:data.Password,
                	Phone:data.Phone,
                	Grade:11,
                	ParentId:data.TeacherID,

                }
                if (!data.id) {
                	upData.type="Add";
                };
                $.getData(url,upData,function(data){
                	var student = data.Add||data.Modify;
                	student = student[0];
                	var formattedData = {
							id: student.uid.trim(),
							Name: student.name.trim(),
							TeacherID: student.parentid.trim(),
							Phone: student.phone.trim(),
							Logining: (student.logining==1?true:false),
							RegisterNum: student.registernum.trim(),
							Password: student.password.trim(),
							Score: student.score.trim(),
							//Evaluate: student.contents.trim(),
							img: (student.img.trim()||"images/0_head.png"),
							Department:student.department.trim(),
							Major:student.major.trim(),
							Grade:student.grade.trim(),/**/
						}
					if (foo) {
						foo(formattedData);
					};
                });
            },
            OperateTeacher: function (formatData,foo) {
                var url = "Admin/OperateTeacher.ashx";
                $.getData(url,formatData,function(data){
						data = data.Modify||data.Add
						data = data[0];
						try{
							var formattedData={
								id : data.uid.trim(),
								Name:data.name.trim(),
								ResponsibleTeacher:data.responsibleteacher.trim(),
								Phone:data.phone.trim(),
								UseSign:!!(data.usesign-0),
								RegisterNum:data.registernum.trim(),
								Password : data.password.trim(),/**/
							}
						}catch(e){
							for (var i in e)
							{
								console.log(e[i]);
							}
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