//Model bulid & Controler bulid & View Init
(function ($, Em) {
	window.AdminManager = Em.Application.create({
		 
	});

    var TeacherMessage = {
        "TeacherMessage": [{
            "T_User": [{
                "id": "60",
                "rank": "1",
                "name": "6455555 ",
                "password": "111111 ",
                "usermessageid": "3",
                "parentid": "0",
                "registernum": "222222 ",
                "createtime": "2013/2/4 14:45:34",
                "lastlogintime": "2013/2/14 22:13:17",
                "logintimes": "57"
            }]
        },
    {
        "T_TeacherMessage": [{
            "id": "3",
            "usesign": "1",
            "createtime": "2013/2/1 12:39:37",
            "responsibleteacher": "ResponsibleTeacher ",
            "phone": "444444 "
        }]
    }]
};
    AdminManager.DepartmentObject = Em.Object.extend({
			id:0,
			Name:"新建部门",
			ResponsibleTeacher:"无",
			Phone:"无",
			UseSign:true,
			RegisterNum:"无",
			Password:"无",
			img:"images/Department.jpg",

			hiddenPassword:function(){
				var password =  this.get("Password");
				if (password==="无"||password.trim()===""){
					return "空密码，请及时修改";
				}
				if (password.length>4){
					var hid = "",Length = password.length-4;
					for (var i=0;i<Length ; ++i)
					{
						hid+="*";
					}
					password = password.substr(0,2)+hid+password.substr(-2)
				}else{
					password = "密码长度过短，请修改！"
				}
				return password;
			}.property('Password'),
			frameID:function(){//frame page 的ID，一次性生成
				return "frame-page-dapartment-"+this.get("id")+"-"+this.get("RegisterNum");
			}.property(),
			frameIDSeletor:function(){//frame page 的selectID，一次性生成
				return "#"+this.get("frameID");
			}.property(),
			student:[]
	});

//Per
	AdminManager.DepartmentController = Em.ObjectController.extend({
		content:AdminManager.DepartmentObject.create(),
		isUpdate:function(){
			return !this.get("id");
		},
		toggleIsUpdate:function(){
			this.set("isUpdate",!this.get("isUpdate"));
					setTimeout(function(){//最后执行，避免渲染冲突
						window.ReactivateInputs();//重新初始化输入框
						window.FramePageInit();//重新初始化
					},1);
		},
		nav:function(){
			//console.log(this.content.get("frameIDSeletor"))
			var A = "<a href=\""+this.content.get("frameIDSeletor")+"\">"+this.content.get("Name")+"</a>";
			return A;
		}.property("Name")
	});

//导航栏，不可独立存在，由内容页赋予内容
	AdminManager.frameNavView = Em.View.extend({
		parentSelector:"#frame-page-navs",
		layout: Ember.Handlebars.compile("<a {{bindAttr href='frameIDSeletor'}}>{{yield}}</a>"),
		controller:null,
		tagName:"li",
		template:Ember.Handlebars.compile("{{Name}}")
	});
//内容页，已经集成自动插入功能
	AdminManager.DepartmentView = Em.View.extend({
		parentSelector:"#frame-page-contents",
		controller:AdminManager.DepartmentController.create(),
		idBinding:"this.controller.frameID",
		attributeBindings:["id"],
		classNames:["frame"],
		frameNav:AdminManager.frameNavView.create(),
		init:function(){
			var pageNav = $(this.frameNav.get("parentSelector"));
			this.frameNav.set("controller",this.get("context"));//共享上下文controller
			//插入导航
			this.frameNav.appendTo(pageNav);

			//原生init
			this._super();
			//插入主内容页
			//this.appendTo("#frame-page-contents");
			//console.log(this ==AdminManager.newView)
			
			console.log(window.ll = this);
			var self = this;
			var pageContent = $(this.get("parentSelector")) ;
			setTimeout(function(){//最后执行，避免渲染冲突
				self.appendTo(pageContent);
				setTimeout(function(){//最后执行，避免渲染冲突
					window.ReactivateInputs();//重新初始化输入框
					window.FramePageInit();//重新初始化
				},1);
			},1);
			//console.log("a[href="+this.controller.get("frameIDSeletor")+"]")
			//$("a[href="+this.get("frameIDSeletor")+"]").click;
		},
		Inputs:{
			Name:Em.TextArea.extend({
				valueBinding:"controller.Name",
				attributeBindings:['placeholder','type'],
				placeholder:"部门名称",
				type:"text",
				tagName:"input"
			}),
			ResponsibleTeacher:Em.TextArea.extend({
				valueBinding:"controller.ResponsibleTeacher",
				attributeBindings:['placeholder','type'],
				placeholder:"部门负责教师 姓名",
				type:"text",
				tagName:"input"
			}),
			RegisterNum:Em.TextArea.extend({
				valueBinding:"controller.RegisterNum",
				attributeBindings:['placeholder','type'],
				placeholder:"教师工号 登录账户",
				type:"text",
				tagName:"input"
			}),
			Password:Em.TextArea.extend({
				valueBinding:"controller.Password",
				attributeBindings:['placeholder','type'],
				placeholder:"登录密码",
				type:"password",
				tagName:"input"
			})
		}
	});

	AdminManager.newView = AdminManager.DepartmentView.create({
		templateName:"department"
	});
	/*
	AdminManager.newView.appendTo("#frame-page-contents");
					setTimeout(function(){//最后执行，避免渲染冲突
						window.ReactivateInputs();//重新初始化输入框
						window.FramePageInit();//重新初始化
					},1);
					*/
//Array
	AdminManager.AllDepartmentController = Em.ArrayController.create({
		content:[AdminManager.DepartmentObject.create(),AdminManager.DepartmentObject.create()]
	})

	AdminManager.AllDepartmentView = Em.CollectionView.create({
		contentBinding:"AdminManager.AllDepartmentController",
		tagName:"ul",
		classNames:["listview","fluid"],
		itemViewClass:Em.View.extend({
			templateName:"all-department"
			
		})
	});
    /**/
	AdminManager.AllDepartmentView.appendTo("#frame-page-all-department");
})(jQuery, Ember);
