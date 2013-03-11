//Model bulid & Controler bulid & View Init
(window.app_student = function($, Em) {
	AdminManager.AllDepartments =	[
						{Name:"中文系"},
			            {Name:"外语系"},
			            {Name:"数学系"},
			            {Name:"电子系"},
			            {Name:"计算机系"},
			            {Name:"旅游系"},
			            {Name:"管理系"},
			            {Name:"服装系"},
			            {Name:"美术系"},
			            {Name:"地理系"},
			            {Name:"化工系"},
			            {Name:"历史系"},
			            {Name:"法律系"},
			            {Name:"经济系"},
			            {Name:"音乐学院"},
			            {Name:"爱恩学院"},
			            {Name:"软件学院"},
			            {Name:"海峡学院"},
			            {Name:"商学院学院"},
			            {Name:"交通学院"},
					]
	AdminManager.AllGrade = [
		{Name:((new Date).getYear()-5).toString().substring(1)},
		{Name:((new Date).getYear()-4).toString().substring(1)},
		{Name:((new Date).getYear()-3).toString().substring(1)},
		{Name:((new Date).getYear()-2).toString().substring(1)},
		{Name:((new Date).getYear()-1).toString().substring(1)},
		{Name:((new Date).getYear()+0).toString().substring(1)},
	]
	AdminManager.StudentObject = Em.Object.extend({
		id: 0,
		canDeleteAble:function(){
			return this.get("id")<=0;
		}.property("id"),
		Name: "新的学生",
		TeacherID: 0,
		Phone: "无",
		Logining: false,
		RegisterNum: "无",
		Password: "",
		Score: 0,
		Evaluate: "无",
		Department:"无",//系别
		Major:"无",//班级
		img: "images/new.png",
		departmentName: function(){
			var allDepartments = AdminManager.AllDepartmentController.content;
			var teacherId = this.get("TeacherID");
			var teacher = allDepartments.find(function(i){
				return i.id == teacherId;
			});
			if(!teacher){
				console.log("null Name ");
				var selfn = arguments.callee;
				var self = this;
				setTimeout(function(){
					selfn.call(self);
				},300);
				return "";
			}
			console.log("ok get Name");
			return teacher.Name;
		}.property("TeacherID","AdminManager.AllDepartmentController.content.@each.Name"),
		frameID: function() { //frame page 的ID
			return "frame-page-dapartment-" + this.get("id") + "-" + this.get("RegisterNum");
		}.property("id", "RegisterNum"),
		frameIDSeletor: function() { //frame page 的selectID
			return "#" + this.get("frameID");
		}.property("frameID"),


		_history:{
			id: 0,
			Name: "新的学生",
			TeacherID: 0,
			Phone: "无",
			Logining: false,
			RegisterNum: "无",
			Password: "",
			Score: 0,
			Evaluate: "无",
			Department:"无",//系别
			Major:"无",//班级
			img: "images/new.png",
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

		signMessage:[],
	});
//per
	AdminManager.StudentController = Em.ObjectController.extend({
		content:AdminManager.StudentObject.create(),
		SignBeginDay:0,
		SignBeginDate:function(){
			var beginTime = this.get("SignBeginDay");
			var b = new Date;
                b.setDate(b.getDate()-beginTime);
                b =	(1900+b.getYear()) +"-"+ (b.getMonth()+1) +"-"+ b.getDate();
                return b;
        }.property("SignBeginDay"),

		SignEndDay:-1,
		SignEndDate:function(){
			var endTime = this.get("SignEndDay");
			var e = new Date;
                e.setDate(e.getDate()-endTime);
                e =	(1900+e.getYear()) +"-"+ (e.getMonth()+1) +"-"+ e.getDate();
                return e;
		}.property("SignEndDay"),

		Score_T:function(){
			var Score = this.get("content.Score");
			if (Score>90) {
				return 9;
			};
			return parseInt( Score/10 );
		}.property("content.Score"),
		Score_B:function(){
			return this.get("content.Score")%10;
		}.property("content.Score"),
		updateScore:function(){
			var content = this.get("content");

			var frameID = content.id;
			console.log(".rating.T[data-id='"+frameID+"']");
			var T = $(".rating.T[data-id='"+frameID+"']").RatingValue();
			var B = $(".rating.B[data-id='"+frameID+"']").RatingValue();
			var Score = T*10+B;
			if (Score>100) {Score=100};
			this.set("content.Score",Score);
		},

		AddSignDay:function(){
			console.log("add");
			var b = this.get("SignBeginDay");
			var e = this.get("SignEndDay");
			if (e>-1) {
				b=e;
				e-=7;
				if (e<-1) {
					e=-1;
				};
			};
			this.set("SignBeginDay",b);
			this.set("SignEndDay",e);
			this.refreshData();
		},
		SubSignDay:function(){
			console.log("sub");
			var b = this.get("SignBeginDay");
			var e = this.get("SignEndDay");
				e=b;
				b=b+7;
			this.set("SignBeginDay",b);
			this.set("SignEndDay",e);
			this.refreshData();
		},
		init:function(){
			var self = this;
			var content = this.get("content");
			var beginDay = (new Date).getDay()||7;
			DataBase.Student.GetSignMessage(content.id,beginDay-1,-1,function(data){
				//console.log(data);
				self.set("signMessage",data);
				setTimeout(function(){
					console.log("InitRating");
					window.InitRating();//初始化Rating
				},10);
			})
			this._super();
			this.set("_Self",this);
		},
		iframeUrl:function(){
			return "User_super.html?uid="+this.get("content.id");
		}.property("content.id"),
		isUpdate: function() {
			return !this.get("id");
		}.property("id"),
		toggleIsUpdate: function() {
			//console.log(this.get("isUpdate"));
			this.set("isUpdate", !this.get("isUpdate"));
			setTimeout(function(){
				console.log("InitRating");
				window.InitRating();//初始化Rating
			},10);
			if (this.get("isUpdate")){// reinit the inputs
				setTimeout(function() { //最后执行，避免渲染冲突
						//window.ReactivateInputs(); //重新初始化输入框
						//window.FramePageInit(); //重新初始化
					},
				1);
			}else{//submit the new date
				console.log("submit the new date");
				this.content.storeHistory();
				//update the database
				var data = this.get("content");
				var self = this;
				DataBase.Admin.OperateStudent(data)
			}
		},//
		refreshData:function(){
			var self = this;
			var b = this.get("SignBeginDay");
			var e = this.get("SignEndDay");
			var content = this.get("content");
			DataBase.Student.GetSignMessage(content.id,b,e,function(data){
				//console.log(data);
				self.set("signMessage",data);
				setTimeout(function(){
					console.log("InitRating");
					window.InitRating();//初始化Rating
				},10);
			})
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
	
	AdminManager.StudentSignMessageView = Em.View.extend({
		sign:null,

		init:function(){
			this._super();
			var self = this;
			setTimeout(function(){
				var rate = $(".rating.small[data-id='"+self.sign.id+"']");
				//console.log(".rating.small[data-id='"+self.sign.id+"']");
				window.R = self;
				if (rate.length) {
					rate.RatingPercents(self.get("sign.Gain"));
				};
			},1);
		},
		changeGain:function(){
			var sign = this.get("sign");
			console.log(".rating.small[data-id='"+this.sign.id+"']");
			this.set("sign.Gain",$(".rating.small[data-id='"+this.sign.id+"']").RatingPercents());
			DataBase.Student.Sign.ModifyGain(sign,function(){

			});
		},

	});

	AdminManager.DepartmentPromptController = Em.ArrayController.extend({
		parentView:null,
		content:[],
		baseContent:[],
		filterValue:"",
		filterFn: function(){
			var filterValue = this.get("filterValue");
			filterValue = filterValue?filterValue.trim():'';
			if (filterValue.length) {
				var filterArray = filterValue.split("");
			}else{
				filterArray = [''];
			}
			var allDepartments = this.get("baseContent");
			var newContent = allDepartments.filter(function(department){
				var name = department.Name;
				//console.log(name);
				var isSimilar = true;
				for (var i = filterArray.length - 1; i >= 0; i--) {
					isSimilar =  isSimilar&&name.indexOf(filterArray[i])!== -1;
					if (!isSimilar) {break;};
				};
				return isSimilar;
			});
			this.set("content",newContent);
		}.observes("filterValue","baseContent.@each.Name"),
		init:function(){
			window.P = this;
			this._super();
			this.set("filterValue",this.get("filterValue")+" ");
		}
	});


	AdminManager.DepartmentPromptView = Em.CollectionView.extend({
		parentView:null,
		filterValueBinding:"parentView.filterValue",
		content:[],
		baseContent:[],
		init:function(){
			window.PV = this;
			console.log("init PV");
			this._super();
		},
		filterFn: function(){
			var filterValue = this.get("filterValue");
			filterValue = filterValue?filterValue.trim():'';
			var filterArray = filterValue?filterValue.split(""):[''];
			console.log()
			var allDepartments = this.get("baseContent");
			var newContent = allDepartments.filter(function(department){
				var name = department.Name;
				//console.log(name);
				var isSimilar = true;
				for (var i = filterArray.length - 1; i >= 0; i--) {
					isSimilar =  isSimilar&&name.indexOf(filterArray[i])!== -1;
					if (!isSimilar) {break;};
				};
				return isSimilar;
			});
			this.set("content",newContent);
		}.observes("filterValue","baseContent.@each.Name"),
		tagName:"ul",
		// classNames:["sub-menu","sidebar-dropdown-menu","light","open","prompt"],// 
		//classNames:["dropdown-menu","open","prompt"],
		itemViewClass:Em.View.extend({
			tagName:"li",
			templateName: "lists",
			valueBinding:"content.Name",
			attributeBindings:['value'],
		}),
		/*eventManager:Em.Object.create({}),Em.Object.extend({
			click:function(event,view){
				//alert("select：" + view.Name);
			},
			focus:false,
			mouseEnter:function(event,view){
				this.set("focus",true);
			},
			mouseLeave:function(event,view){
				this.set("focus",false);
				//alert("Out")
			},
			
		}),*/
	});//.create(),
	//下拉栏提示输入框
	AdminManager.InputWithPromptView = Em.TextArea.extend({//list view
		attributeBindings: ['placeholder', 'type'],
		classNames:['dropdown'],
		placeholder: "",
		type: "text",
		tagName: "input",
		// init:function(){
		// 	this._super();
		// 	this.eventManager.input();
		// },
		prompt:null,
		
		eventManager:Em.Object.create({
			focusIn:function(event,view){
				var value = view.get("value");
				view.set("parentView.filterValue",value);
			},
			input:function(event,view){
				clearTimeout(this.ti);
				this.ti = setTimeout(function(){
					try{
						var value = view.get("value");
						//console.log(value);
						view.set("parentView.filterValue",value);
					}catch(e){
						//console.log(window.VV = view);
						console.log(e);
					}
				},350);
			},
		}),
	});
	//下拉提示元素
	AdminManager.PromptItemView = Em.View.extend({
		content:{},
		init:function(){
			window.PI = this;
			this._super();
		}
	});
	//导航栏，不可独立存在，由内容页赋予内容
	AdminManager.frameNavForStudentView = Em.View.extend({
		parentSelector: "#frame-page-navs",
		layout: Ember.Handlebars.compile("<a {{bindAttr href='frameIDSeletor'}}>{{yield}}</a><i class='icon-remove' {{action 'frameClose' target='view'}}></i>"),
		controller: null,
		tagName: "li",
		template: Ember.Handlebars.compile("{{departmentName}}--{{Name}}"),
		pageContent: null,
		enforceClose:function(){
			//destroy Controller
			this.controller.destroy();
			//destroy view
			this.destroy();
			this.pageContent.destroy();
			//Switch pages
			$($("#frame-page-navs li")[1]).find("a").click();
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
	AdminManager.StudentView =  Em.View.extend({
		parentSelector: "#frame-page-contents",
		controller: AdminManager.StudentController.create(),
		idBinding: "this.controller.frameID",
		attributeBindings: ["id"],
		classNames: ["frame","studentframe"],
		templateName: "student",
		frameNav: null,
		filterValue:"",
		deleteUser:function(){
			var self = this;
			var content = this.get("controller.content");
			var ID = content.id;
			var Name = content.Name;
			var str = "确定删除"+Name
			var time = (str.length+2)*100;
			$.Dialog({
				'title'       : '警告！',
				'content'     : str,
				'draggable'   : false,
				'overlay'     : true,
				'closeButton' : true,
				'buttonsAlign': 'center',
				'position'    : {
					'zone'    : 'center'
				},
				'buttons'     : {
					'确定'     : {
						'action': function(){
							DataBase.Admin.DeleteUser(ID,function(data){
								if (data.Error[0].describe==="操作成功，") {
									setTimeout(function(){
										AdminManager.AllStudentListController.refreshData();
										alert("删除成功,返回所有部门视图");
										self.frameNav.enforceClose();
									},time);
								}else{
									setTimeout(function(){
										alert("删除失败");
									},time);
								}
							})
						}
					},
					'取消'		:{
						'action':function(){

						}
					}
				}
			});
		},
		//AdminManager.frameNavView
		init: function() {
			//原生init
			this._super();
			var self = this;
			this.frameNav = AdminManager.frameNavForStudentView.create({
				controller: self.get("context"),
				//共享上下文controller
				pageContent: self
			});
			//为控制器提供View的控制权
			this.set("controller.navView",this.frameNav);
			//console.log( this.get("controller.navView") );
			var pageContent = $(this.get("parentSelector"));
				setTimeout(function() { //最后执行，避免渲染冲突
					self.appendTo(pageContent);
					setTimeout(function() { //最后执行，避免渲染冲突
						//window.FramePageInit(); //重新初始化page frame
					},
					1);
				},
			1);
			//为下拉框提供控制权
			/*
			self.set("Inputs.departmentName",self.Inputs.departmentNameCreater.create() )
			self.set("Inputs.Department",self.Inputs.DepartmentCreater.create() )
			self.set("Inputs.Grade",self.Inputs.GradeCreater.create() )
			self.Inputs.departmentName.prompt.set("parentView",self);
			self.Inputs.Department.prompt.set("parentView",self);
			self.Inputs.Grade.prompt.set("parentView",self);
			*/
			setTimeout(function(){
				console.log("InitRating");
				window.InitRating();//初始化Rating
			},10);
		},

		Inputs: {
			Name: Em.TextArea.extend({
				valueBinding: "controller.Name",
				attributeBindings: ['placeholder', 'type'],
				placeholder: "学生姓名",
				type: "text",
				tagName: "input"
			}),
			Phone:  Em.TextArea.extend({
				valueBinding: "controller.Phone",
				attributeBindings: ['placeholder', 'type'],
				placeholder: "学生 联系方式",
				type: "text",
				tagName: "input"
			}),
			/*
			Department:  Em.TextArea.extend({//list view
				valueBinding: "controller.Department",
				attributeBindings: ['placeholder', 'type'],
				placeholder: "学生 系别",
				type: "text",
				tagName: "input"
			}),
			*/
			//Grade:null,
			Grade:AdminManager.InputWithPromptView.extend({
				placeholder: "学生 年级",
				valueBinding: "controller.Grade",
			}),
			GradePrompt:AdminManager.DepartmentPromptView.extend({
				baseContentBinding: "AdminManager.AllGrade",
				eventManager:Em.Object.create({
					click:function(event,view){
						window.V = view;
						console.log(view.content.Name);
						view.get("parentView.parentView.controller.content").set("Grade",view.content.Name)

					}
				}),
			}),
			//Department:null,
			Department:AdminManager.InputWithPromptView.extend({
				placeholder: "学生 系别",
				valueBinding: "controller.Department",
			}),
			DepartmentPrompt:AdminManager.DepartmentPromptView.extend({
				baseContentBinding: "AdminManager.AllDepartments",
				eventManager:Em.Object.create({
					click:function(event,view){
						window.V = view;
						console.log(view.content.Name);
						view.get("parentView.parentView.controller.content").set("Department",view.content.Name)
						// view.get("parentView.parentView.controller.content").set("Grade",view.content.Name)

					}
				}),
			}),
			Major:Em.TextArea.extend({//list view || Input text
				valueBinding: "controller.Major",
				attributeBindings: ['placeholder', 'type'],
				placeholder: "学生 班级",
				type: "text",
				tagName: "input"
			}),
			//departmentName:null,
			departmentName: AdminManager.InputWithPromptView.extend({
				placeholder: "隶属部门名",
				valueBinding: Ember.Binding.oneWay("controller.departmentName"),

				init:function(){
					/**/
					// this.set("prompt",AdminManager.DepartmentPromptView.create({
					// 				parentView:maxSelf,
					// 				baseContentBinding: "AdminManager.AllDepartmentController.content",

					// 				eventManager:Em.Object.create({
					// 						click:function(event,view){
					// 							console.log("aaaa");
					// 							view.get("parentView.parentView.controller.content").set("TeacherID",view.content.id);
					// 						}
					// 					})
					// 			})
					// 		);
					this._super();
					
				}
			}),
			departmentNamePrompt:AdminManager.DepartmentPromptView.extend({
				baseContentBinding: "AdminManager.AllDepartmentController.content",
				eventManager:Em.Object.create({
					click:function(event,view){
						window.V = view;
						view.get("parentView.parentView.controller.content").set("TeacherID",view.content.id);

					}
				}),
			}),
			RegisterNum: Em.TextArea.extend({
				valueBinding: "controller.RegisterNum",
				attributeBindings: ['placeholder', 'type'],
				placeholder: "学生学号 登录账户",
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




//Array
	AdminManager.StudentListController = Em.ArrayController.extend({
		departmentId:0,
		content:[AdminManager.StudentObject.create()],
		refreshData: function() {
			var controller = this;
			DataBase.Teacher.GetStudentList(controller.get("DapartmentId"),function(data) {
				var newcontent = [];
				var Length = data.length;
				for (var i = 0; i < Length; ++i) {
					newcontent[i] = AdminManager.StudentObject.create(data[i]).storeHistory("cut");//
				}
				//newcontent[Length] = AdminManager.StudentObject.create(); //一个保留，用于新建
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
			return this;
		},
		init:function(){
			this.set("choiceContent.parentController",this) ;//同数据控制
			this._super();
		},
		multipleChoiceBinding:"choiceContent.multipleChoice",
		toggleMultipleChoice:function(){
			//console.log(this.get("multipleChoice"));
			this.set("multipleChoice",!this.get("multipleChoice"));
		},
		ListViewer:AdminManager.AllStudentList,
		addItem:function(){
			console.log("add student");
			// var vs = this.get("ListViewer.childViews");
			// vs[vs.length-1].$().dblclick();
			var Obj = AdminManager.StudentObject.create();
			if (!$("a[href=" + Obj.get("frameIDSeletor") + "]").length) {
				var Con  = AdminManager.StudentController.create({
					content: Obj
				});
				AdminManager.StudentView.create({
					controller: Con
				});
			}
		},
		choiceContent:Em.ArrayController.extend({
			content:[],
			multipleChoice:false,
			canMultipleOperatorAble:true,
			parentController:AdminManager.StudentListController,
			judgeMultipleOperatorAble:function(){
				var result = this.get("content").length&&this.get("multipleChoice");
				console.log("result:"+result);
				this.set("canMultipleOperatorAble",!result);
			}.observes("content.length","multipleChoice"),//Object can't observes,property maybe means one time set
			removeChoice:function(){
				var content= this.get("content");
				var parentController = this.get("parentController");
				//remove from Controller
				//AdminManager.AllDepartmentController.get("content").removeObjects(content);
				parentController.get("content").removeObjects(content);

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
				//AdminManager.AllDepartmentController.refreshData();
				parentController.refreshData();
			},
			openChoice:function(){
				var content = this.get("content");
				var framePages = content.map(function(Obj){
						if (!$("a[href=" + Obj.get("frameIDSeletor") + "]").length) {
							var Con  = AdminManager.StudentController.create({
								content: Obj
							});
							AdminManager.StudentView.create({
								controller: Con
							});
						}
				})
			}
		}).create()
	});
	AdminManager.StudentListView = Em.CollectionView.extend({
		content:AdminManager.StudentListController,
		//classNames: ["row","listview", "fluid"],
		tagName: "tbody",
		classNames: ["listview", "fluid"],
		itemViewClass: Em.View.extend({
			templateName: "student-list",
			tagName: "tr",
			selected:false,
			_selectedClass:function(){
				return this.get("parentView").get("content").get("multipleChoice")&&this.get("selected")&&this.content.get("id");
			}.property("selected","this.parentView.content.multipleChoice"),
			classNameBindings:["_selectedClass:selected"],
		}),
		eventManager: Em.Object.create({
			doubleClick: function(event, view) {
				var Obj = view.get("content");
				if (!$("a[href=" + Obj.get("frameIDSeletor") + "]").length) {
					var Con  = AdminManager.StudentController.create({
						content: Obj
					});
					AdminManager.StudentView.create({
						controller: Con
					});
				}
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
		}),
	});
	//View
	AdminManager.AllStudentListController = AdminManager.StudentListController.extend({
			departmenrName:"所有学生",
			_Self:null,
			refreshData:function(){
				var controller = this;
				var S = controller.get("_Self");
				if (S) {
					S.fnDestroy();
				}else{
					$("#frame-page-all-student_table").width("100%");
				};
				this._super();
				setTimeout(function(){
					if (!S) {
						window.s = $("#frame-page-all-student_table").width("100%").dataTable({
							"oLanguage": {"sSearch": "查询：",
							"sLengthMenu": "显示 _MENU_ 记录",
							"sInfo": "共有 _TOTAL_ 个记录，显示第 _START_ 至 _END_ 条",
							"oPaginate":{
								"sNext":"下一页",
								"sPrevious":"上一页",
							},
							"bDestroy":true,
							"bRetrieve":true,
						}});
						controller.set("_Self",s);
						controller.refreshData();
					}else{
						S.width("100%").dataTable({
							"oLanguage": {"sSearch": "查询：",
							"sLengthMenu": "显示 _MENU_ 记录",
							"sInfo": "共有 _TOTAL_ 个记录，显示第 _START_ 至 _END_ 条",
							"oPaginate":{
								"sNext":"下一页",
								"sPrevious":"上一页",
							},
							"bDestroy":true,
							"bRetrieve":true,
						}});
					};
				},50);
				return this;
			}
		}).create().refreshData();

	AdminManager.AllStudentListControlBarView = Em.View.create({
		controller:AdminManager.AllStudentListController,
		templateName:"all-student-list-bar",
	});
	AdminManager.AllStudentListControlBarView.appendTo("#frame-page-all-student_toolbar");

	AdminManager.AllStudentListView = AdminManager.StudentListView.create({
		content:AdminManager.AllStudentListController ,
	});
	AdminManager.AllStudentListController.set("ListViewer",AdminManager.AllStudentListView);//!!!!!important
	AdminManager.AllStudentListView.appendTo("#frame-page-all-student_table");/**/

	//app_search
	app_search($,Em);


});//(jQuery, Ember);

