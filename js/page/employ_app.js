//Model bulid & Controler bulid & View Init
(function ($, Em) {

	DataBase.Teacher.Login({RegisterNum:"123",Password:"123"},function(data){
		window.EmploymentName = data.Name;
		window.EmploymentId = data.id;
		$("#departmentName").html(EmploymentName);
		setTimeout(function(){
			app();
		},0);
	}); //管理员登录
	//Init
var app = function(){

	window.EmploymentName = localStorage.getItem("EmploymentName");
	window.EmploymentId = localStorage.getItem("EmploymentId");
	console.log("app star");
    window.Employment = Em.Application.create({
		 
	});
//Control
    Employment.StudentObject = Em.Object.extend({
		id: 0,
		canDeleteAble:function(){
			return this.get("id")<=0;
		}.property("id"),
		Name: "新的学生",
		TeacherID: EmploymentId,
		Phone: "无",
		Logining: false,
		RegisterNum: "无",
		Password: "",
		Score: 0,
		Evaluate: "无",
		Department:"无",//系别
		Major:"无",//班级
		img: "images/new.png",
		departmentName:EmploymentName,

		Sid:0,
		LastLoginTime:"",
		signMessage:[],
	});
    Employment.EmployersController = Em.ArrayController.create({
        content: [],
        refreshData: function () {
			var controller = this;
            DataBase.Teacher.GetStudentList(EmploymentId,function(data) {
				var newcontent = [];
				var Length = data.length;
				for (var i = 0; i < Length; ++i) {
					data[i].Password = "";
					newcontent[i] = Employment.StudentObject.create(data[i]);//
				}
				console.log("begin destory");
				for (var i=0, items = [],len = controller.content.length;i<len ; ++i)
				{
					console.log("destory");
					items[i] = controller.content[i];
					(function(n){
						var item = items[i]
						item.destroy();
					})(i);

				}
				controller.content.clear();
				controller.set("content", newcontent);

				//获取签到信息：
				var beginDay = (new Date).getDay()||7;
				for (var i = newcontent.length - 1; i >= 0; i--) {
					var content = controller.content[i] ;
					DataBase.Student.GetSignMessage(content.id,beginDay-1,-1,function(data){
						content.set("signMessage",data);
					})
				};

				//重新绑定aid数据
				try{
					var id = Employment.OneEmployerController.content.get("id");
					var onecontent = controller.content.find(function(i){return i.id == id});
					Employment.OneEmployerController.set("content",onecontent);
				}catch(e){
					console.log(e);
				}
			});
			return this;
        }
    });
    Employment.EmployersController.refreshData();//初始化用户数据，并绑定数据

	/*----------------------------------------------------*/
	//View
	
	Employment.StudentSignMessageView = Em.View.extend({
		sign:null,

		init:function(){

					// //获取签到信息：
					// var beginDay = (new Date).getDay()||7;
					// DataBase.Student.GetSignMessage(data.id,beginDay-1,-1,function(data){
					// 	view.set("content.signMessage",data);
					// 	setTimeout(function(){
					// 		console.log("InitRating");
					// 		window.InitRating();//初始化Rating
					// 	},10);
					// });

			this._super();
			var self = this;
			setTimeout(function(){
				window.InitRating();//初始化Rating
				self.$().find(".rating.small").RatingPercents(self.get("sign.Gain"));
			},1);
		},
		changeGain:function(){
			var sign = this.get("sign");
			console.log("sign");
			this.set("sign.Gain",this.$().find(".rating").RatingPercents());
			DataBase.Student.Sign.ModifyGain(sign,function(){

			});
		},

	});

	Employment.EmployersView = Em.CollectionView.create({
		classNames: ['row'],
		contentBinding:"Employment.EmployersController",
		itemViewClass:Em.View.extend({
			//tagName:"div",
			//classNames:['span2','people','bg-color-grayDark'],
			/*Ember.computed(function(){
					var LoginIng = this.get("content").LoginIng,bgColor="bg-color-grayDark";
					console.log(LoginIng)
					if (LoginIng){
						bgColor = "bg-color-blueDark";
					}
					return['span2','people',bgColor];
				}).property('LoginIng'),*/
			templateName:"employer",
				

			eventManager:Em.Object.create({
				click:function(event,view){
					var data = view.get("content");
					Employment.OneEmployerController.set("content",data);
					//Employment.OneEmployerController.set("Password","");
					setTimeout(function(){//最后执行，避免渲染冲突
						toolbarButtonsInit();//重新初始化功能按钮
						window.ReactivateInputs();//重新初始化登录功能
					},1);
				}
			})
		}),
		emptyView:Ember.View.extend({
			tagName:"h2",
			classNames:['fg-color-white','bg-color-orangeDark'],
			template: Ember.Handlebars.compile("这个部门暂时没有参与兼职的同学")
		})
	});

	Employment.EmployersView.appendTo("#human");

	Employment.OneEmployerController = Em.ObjectController.extend({
		content:Employment.StudentObject,
		Sign:function(){
			var content = this.get("content");
			var self = this;
			DataBase.Student.Sign.SignIn(EmploymentId,self.get("id"),function(data){
				console.log("Sign success");
				Employment.EmployersController.refreshData();
				for (var i in data) {
					self.set(i,data[i]);
				};
			});
		},
		SignExit:function(){
			var content =  this.get("content");
			DataBase.Student.Sign.SignOut(content.Sid,function(){
				console.log("SignExit success");
				Employment.EmployersController.refreshData();
			});
		},
		studentBinding:"content",
	}).create();
	Employment.OneEmployerView = Em.View.create({
		controller:Employment.OneEmployerController,
		templateName:"employer-detail",
		
		Account:Em.TextArea.extend({
			valueBinding:"Employment.OneEmployerController.RegisterNum",
			attributeBindings:['disabled','placeholder','type'],
			placeholder:"账户 Account",
			disabled:'disable',
			type:"text",
			tagName:"input"
		}),
		Password:Em.TextArea.extend({
			valueBinding:"Employment.OneEmployerController.Password",
			attributeBindings:['placeholder','type'],
			placeholder:"密匙 Password",
			type:"password",
			tagName:"input"
		}),
		
	});

	Employment.OneEmployerView.appendTo("#aid");






}
/**/
})(jQuery, Ember);
