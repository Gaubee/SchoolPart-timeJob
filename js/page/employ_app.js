//Model bulid & Controler bulid & View Init
(function ($, Em) {

	//Init

	console.log("app star");
    window.Employment = Em.Application.create({
		 
	});
//Control
    Employment.OneEmployerController = Em.ObjectController.create({
		content:{
							"id": 0,
							"Name": null,
							"RegisterNum": null,
							"Grade": 0,
							"Department": null,
							"LoginIng": false,
							"Password":""
						}
	});
    Employment.EmployersController = Em.ArrayController.create({
        content: [],
			rootElement:$( '#interface'),
        _id: "HumanController",
        _parentId: "human",
        refreshData: function () {
            $.getData("employers.json", { "_$": Math.random() }, function (newdata) {
                var controller = Employment.EmployersController;
                controller.set("content", newdata);
            });
        }
    });
    Employment.EmployersController.refreshData();//初始化用户数据，并绑定数据

/*----------------------------------------------------*/
//View
	Employment.EmployersView = Em.CollectionView.create({
		templateName:"employers-list",
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







/**/
})(jQuery, Ember);
