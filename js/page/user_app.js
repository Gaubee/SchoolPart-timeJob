(function($, Em) {
	window.UserApp = Em.Application.create({
		
	});
	var href = window.location.href;
	var userid = parseInt(href.substring(href.indexOf("?")).replace("?uid=",''))||0;
	//Model
	UserApp.StudentObject = Em.Object.extend({
		id: 0,
		Name: "新的学生",
		TeacherID: 0,
		Phone: "无",
		Logining: false,
		RegisterNum: "无",
		Password: "",
		Score: 0,
		Evaluate: 0,
		Department:"无",//系别
		Major:"无",//班级
		img: "images/new.png",
	});
	//Controller
	UserApp.StudentController = Em.ObjectController.extend({
		content:UserApp.StudentObject.create(),
		refreshData:function(){
			var controller = this;
			DataBase.Student.GetMessage(userid,function(data) {
				var Obj = UserApp.StudentObject.create(data);//
				console.log("set student data");
				controller.content.destroy();
				controller.set("content", Obj);
			});
			return this;
		}

	}).create();
	UserApp.StudentController.refreshData();




	//View
	UserApp.StudentView = Em.View.create({
		controller:UserApp.StudentController,
		templateName:"student-base-data",

	}).appendTo("#studentInfo");
})(jQuery, Ember);