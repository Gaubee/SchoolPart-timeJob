//Model bulid & Controler bulid & View Init
(function($, Em) {
	DataBase.Admin.Login() //管理员登录
	window.AdminManager = Em.Application.create({

});
	////Model
	AdminManager.DepartmentObject = Em.Object.extend({
		id: 0,
		Name: "新建部门",
		ResponsibleTeacher: "无",
		Phone: "无",
		UseSign: true,
		RegisterNum: "无",
		Password: "",
		img: "images/Department.jpg",
		
		_history:{
			id: 0,
			Name: "新建部门",
			ResponsibleTeacher: "无",
			Phone: "无",
			UseSign: true,
			RegisterNum: "无",
			Password: "",
			img: "images/Department.jpg",
			_history:null//history link ---- multiple recovery
		},
		canBackHistory:false,
		recoveryHistory:function(){//go back history
			if (this.get("canBackHistory")){
				var history = this.get("_history");
				var recoveryAgain = false;
				var last = false;
				for (var i in history)
				{//back recovery one by one
					var data = history[i];
					if (data!==null){
						recoveryAgain = recoveryAgain||((data !== this.get(i))&&(typeof data)!=="object");
						console.log(  ((data !== this.get(i))&&(typeof data)!=="object")  );
						this.set(i,data);
					}else{
						last = true;
					}
				}
				if (!recoveryAgain){//2次回退逻辑
					this.recoveryHistory();
				}
				if (last){//if history is null
					this.set("canBackHistory",false);
				}
				this.storeHistory();
			}
			return this;
		},
		storeHistory:function(cut){//leave away from history and save it
			var history = this.get("_history");
			var preHistory = {};
			var noEqual = false;
			//console.log("begin to store");
			for (var i  in history)
			{
				var data = this.get(i);
				preHistory[i] = data;
				noEqual = noEqual||!(String(data).trim()===String(history[i]).trim())&&i!=="_history";
				//console.log("noEqual:"+noEqual+"||"+String(data).trim()+"||"+String(history[i]).trim());
			}
			if (!cut){
				if (noEqual){
					this.set("_history",preHistory);
					this.set("canBackHistory",true);
				}
			}else{//cut the history link
				preHistory["_history"] = null;
				this.set("_history",preHistory);
				this.set("canBackHistory",false);
			}
			return this;
		},
		hiddenPassword: function() {
			var password = this.get("Password");
			if (password.trim() === "") {
				return "空密码，请及时修改";
			}
			if (password.length > 4) {
				var hid = "",
				Length = password.length - 4;
				for (var i = 0; i < Length; ++i) {
					hid += "*";
				}
				password = password.substr(0, 2) + hid + password.substr( - 2)
			} else {
				password = "密码长度过短，请修改！"
			}
			return password;
		}.property('Password'),
		frameID: function() { //frame page 的ID，一次性生成
			return "frame-page-dapartment-" + this.get("id") + "-" + this.get("RegisterNum");
		}.property("id", "RegisterNum"),
		frameIDSeletor: function() { //frame page 的selectID，一次性生成
			return "#" + this.get("frameID");
		}.property("frameID"),
		student: [],
		signNum: function() {
			var allStudents = this.get("student");
			return allStudents.filter(function(student) {
				return student.Logging;
			}).length;
		}.property("student")
	});
	AdminManager.StudentObject = Em.Object.extend({
		id: 0,
		Name: "新建部门",
		TeacheID: 0,
		Phone: "无",
		Logining: false,
		RegisterNum: "无",
		Password: "",
		Score: 0,
		Evaluate: "暂无评价",
		img: "images/0_head.png",
		
	})
	////Controller
	//Per
	AdminManager.DepartmentController = Em.ObjectController.extend({
		content: AdminManager.DepartmentObject.create(),
		navView:null,
		isUpdate: function() {
			return !this.get("id");
		}.property("id"),
		toggleIsUpdate: function() {
			//console.log(this.get("isUpdate"));
			this.set("isUpdate", !this.get("isUpdate"));
			if (this.get("isUpdate")){// reinit the inputs
				setTimeout(function() { //最后执行，避免渲染冲突
					window.ReactivateInputs(); //重新初始化输入框
					window.FramePageInit(); //重新初始化
				},
				1);
			}else{//submit the new date
				console.log("submit the new date");
				this.content.storeHistory();
				//update the database
				var data = this.get("content");
				var self = this;
				if (data.id){
					console.log("Modify");
					DataBase.Admin.ModifyTeacher(data,function(data){
						
						console.log(data);
						for (var i in data)
						{
							self.set(i,data[i]);
						}
					});
				}else{
					console.log("Add");
					DataBase.Admin.AddTeacher(data,function(data){
						alert("添加成功,返回所有部门视图!");
						self.navView.enforceClose();
						AdminManager.AllDepartmentController.refreshData();
					});
				}
			}
		},//
		refreshData:function(){
			
		},
		canBackHistory:true,
		_canBackHistory:function(){
			window.D = this;
			var result = !(this.get("isUpdate")&&this.get("content.canBackHistory"))
			//console.log("result:"+this.get("isUpdate")+"|"+this.get("content.canBackHistory"))
			//console.log("canBackHistory:"+result);
			this.set("canBackHistory",result);
			//return result;
		}.observes("content.canBackHistory","isUpdate"),
		nav: function() {
			//console.log(this.content.get("frameIDSeletor"))
			var A = "<a href=\"" + this.content.get("frameIDSeletor") + "\">" + this.content.get("Name") + "</a>";
			return A;
		}.property("Name")
	});

	//////View
	//导航栏，不可独立存在，由内容页赋予内容
	AdminManager.frameNavView = Em.View.extend({
		parentSelector: "#frame-page-navs",
		layout: Ember.Handlebars.compile("<a {{bindAttr href='frameIDSeletor'}}>{{yield}}</a><i class=' icon-cancel-2' {{action 'frameClose' target='view'}}></i>"),
		controller: null,
		tagName: "li",
		template: Ember.Handlebars.compile("{{Name}}"),
		pageContent: null,
		enforceClose:function(){
			//destroy Controller
			this.controller.destroy();
			//destroy view
			this.destroy();
			this.pageContent.destroy();
			//Switch pages
			$("#frame-page-navs li").first().find("a").click();
		},
		frameClose: function() {
			//try to submit this update
			if (this.get("controller.isUpdate")){
				var self = this;
				$.Dialog({
					'title':"您还有未保存的数据",
					'content': "修改未保存，是否提交数据再关闭？",
					'draggable'   : true,
					'overlay'     : true,
					'closeButton' : true,
					'buttonsAlign': 'right',
					'position'    : {
						'zone'    : 'left'
					},
					'buttons'     : {
						'直接关闭'     : {
							'action': function(){
								//refreshSelfData
								self.controller.refreshData();
								//close
								self.enforceClose();
							}
						},
						'保存并关闭'     : {
							'action': function(){
								//submit this update
								self.controller.toggleIsUpdate();
								//close
								self.enforceClose();
							}
						},
						'继续编辑'         :{
							'action':function(){
							}
						}
					}
				});
			}else{
				//close
				this.enforceClose();
			}
		},
		init: function() {
			this._super();

			var pageNav = $(this.get("parentSelector"));
			//插入导航
			this.appendTo(pageNav);
		}
	});
	//内容页，已经集成自动插入功能
	AdminManager.DepartmentView = Em.View.extend({
		parentSelector: "#frame-page-contents",
		controller: AdminManager.DepartmentController.create(),
		idBinding: "this.controller.frameID",
		attributeBindings: ["id"],
		classNames: ["frame"],
		templateName: "department",
		frameNav: null,
		//AdminManager.frameNavView
		init: function() {
			//原生init
			this._super();
			var self = this;

			this.frameNav = AdminManager.frameNavView.create({
				controller: self.get("context"),
				//共享上下文controller
				pageContent: self
			});
			//为控制器提供View的控制权
			this.set("controller.navView",this.frameNav);
			console.log( this.get("controller.navView") );
			window.C = this;
			//插入主内容页
			//this.appendTo("#frame-page-contents");
			//console.log(this ==AdminManager.newView)
			var pageContent = $(this.get("parentSelector"));
			setTimeout(function() { //最后执行，避免渲染冲突
				self.appendTo(pageContent);
				setTimeout(function() { //最后执行，避免渲染冲突
					window.ReactivateInputs(); //重新初始化输入框
					window.FramePageInit(); //重新初始化page frame
				},
				1);
			},
			1);
			//console.log("a[href="+this.controller.get("frameIDSeletor")+"]")
			//$("a[href="+this.get("frameIDSeletor")+"]").click;
		},
		Inputs: {
			Name: Em.TextArea.extend({
				valueBinding: "controller.Name",
				attributeBindings: ['placeholder', 'type'],
				placeholder: "部门名称",
				type: "text",
				tagName: "input"
			}),
			ResponsibleTeacher: Em.TextArea.extend({
				valueBinding: "controller.ResponsibleTeacher",
				attributeBindings: ['placeholder', 'type'],
				placeholder: "部门负责教师 姓名",
				type: "text",
				tagName: "input"
			}),
			RegisterNum: Em.TextArea.extend({
				valueBinding: "controller.RegisterNum",
				attributeBindings: ['placeholder', 'type'],
				placeholder: "教师工号 登录账户",
				type: "text",
				tagName: "input"
			}),
			Password: Em.TextArea.extend({
				valueBinding: "controller.Password",
				attributeBindings: ['placeholder', 'type'],
				placeholder: "登录密码",
				type: "password",
				tagName: "input"
			})
		},
		eventManager:Em.Object.create({
				input:function(event,view){
					//console.log(view.get("controller.canBackHistory"))
					view.set("controller.content.canBackHistory",true);
				}
		})
	});
	/*
	AdminManager.newView = AdminManager.DepartmentView.create();
*/

	/////Controller
	//Array
	AdminManager.AllDepartmentController = Em.ArrayController.create({
		content: [AdminManager.DepartmentObject.create()],
		refreshData: function() {
			var controller = this;
			DataBase.Admin.GetTeacherList(function(data) {
				var newcontent = [];
				var Length = data.length;
				for (var i = 0; i < Length; ++i) {
					newcontent[i] = AdminManager.DepartmentObject.create(data[i]).storeHistory("cut");//init the history data
				}
				newcontent[Length] = AdminManager.DepartmentObject.create(); //一个保留，用于新建
				//controller.clear()
				//controller.addObjects(newcontent);
					console.log("begin destory");
					//console.log(controller.content)
				for (var i=0, items = [],len = controller.content.length;i<len ; ++i)
				{
					console.log("destory");
					console.log(i);
					items[i] = controller.content[i];
					(function(n){
						var item = items[i]
						item.destroy();
					})(i);
				}
				controller.content.clear();
				controller.set("content", newcontent);
			});
		},
		multipleChoiceBinding:"choiceContent.multipleChoice",
		toggleMultipleChoice:function(){
			//console.log(this.get("multipleChoice"));
			this.set("multipleChoice",!this.get("multipleChoice"));
		},
		choiceContent:Em.ArrayController.extend({
			content:[],
			multipleChoice:false,
			canMultipleOperatorAble:true,
			judgeMultipleOperatorAble:function(){
				var result = this.get("content").length&&this.get("multipleChoice");
				console.log("result:"+result);
				this.set("canMultipleOperatorAble",!result);
			}.observes("content.length","multipleChoice"),//Object can't observes,property maybe means one time set
			removeChoice:function(){
				var content= this.get("content");
				//remove from Controller
				AdminManager.AllDepartmentController.get("content").removeObjects(content);

				//destory from Object
				for (var i=0;i<content.length ; ++i)
				{
					//destroy from frame page
					$("a[href=" + content[i].get("frameIDSeletor") + "]").next().click();
					//delete from Database
					content[i].destroy();
				}
				var mes = DataBase.Admin.DeleteUsers(content);
				//alert(mes);
				//clear objects
				content.clear();
				//refresh to get new data
				AdminManager.AllDepartmentController.refreshData();
			},
			openChoice:function(){
				var content = this.get("content");
				var framePages = content.map(function(Obj){
						if (!$("a[href=" + Obj.get("frameIDSeletor") + "]").length) {
							var Con  = AdminManager.DepartmentController.create({
								content: Obj
							});
							AdminManager.DepartmentView.create({
								controller: Con
							});
						}
				})
			}
		}).create()
	});
	AdminManager.AllDepartmentController.refreshData();

	/////View
	AdminManager.AllDepartmentControlBarView = Em.View.create({
		controller:AdminManager.AllDepartmentController,
		templateName:"all-department-control-bar"
	});
	AdminManager.AllDepartmentControlBarView.appendTo("#frame-page-all-department");
	/**/
	AdminManager.AllDepartmentView = Em.CollectionView.create({
		contentBinding: "AdminManager.AllDepartmentController",
		//controller:AdminManager.AllDepartmentController,
		tagName: "ul",
		classNames: ["listview", "fluid"],
		itemViewClass: Em.View.extend({
			templateName: "all-department",
			selected:false,
			_selectedClass:function(){
				return this.get("parentView").get("content").get("multipleChoice")&&this.get("selected")&&this.content.get("id");
			}.property("selected","this.parentView.content.multipleChoice"),
			classNameBindings:["_selectedClass:selected"]
		}),
		eventManager: Em.Object.create({
			doubleClick: function(event, view) {
				var Obj = view.get("content");
				if (!$("a[href=" + Obj.get("frameIDSeletor") + "]").length) {
					var Con  = AdminManager.DepartmentController.create({
						content: Obj
					});
					AdminManager.DepartmentView.create({
						controller: Con
					});
				}

				//console.log(					view.get("content") == AdminManager.AllDepartmentView.content.get("content")[view.contentIndex] 				);
			},
			click:function(event,view){
				try{
					var controller = window.CON = view.get("parentView.content");
					var object = window.OBJ = view.get("content");
					view.set("selected",controller.get("multipleChoice")&&!view.get("selected"));
					//console.log("after:"+view.get("selected"));
					var selected = view.get("_selectedClass");
					if (selected){
						controller.get("choiceContent.content").addObject(object);
						/*
						var choiceContent = controller.get("choiceContent.content");
						choiceContent.addObject(object);
						controller.set("choiceContent.content",choiceContent);
						*/
					}else{
						controller.get("choiceContent.content").removeObject(object);
						/*
						var choiceContent = controller.get("choiceContent.content");
						choiceContent.removeObject(object);
						controller.set("choiceContent.content",choiceContent);
						*/
					}
					//console.log(controller.get("choiceContent.content").length);
				}catch(e){
					//console.log(e);
				}
			}
		})
	});
	AdminManager.AllDepartmentView.appendTo("#frame-page-all-department");
	/**/

})(jQuery, Ember);