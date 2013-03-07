//Model bulid & Controler bulid & View Init
(window.app_search = function($, Em) {
	AdminManager.SearchController = Em.ArrayController.extend({
		content:[],
		allDepartmentsBinding:"AdminManager.AllDepartmentController.content",
		allStudentsBinding:"AdminManager.AllStudentListController.content",
		searchValue:"",
		searchValueChanged:function(){
			var newContent = [];
			console.log("re content");
			var D = this.get("allDepartments"),S = this.get("allStudents"),str = this.get("searchValue").trim().split(' ');
			//初始化str 数组，去除空字符
			try{
				for (var i = str.length - 1; i >= 0; i--) {
					if(str[i].trim() === ''){
						str[i] = null;
					}else{
						str[i] = str[i].toLowerCase();
					}
				};
				str.compact();
				for (var i = D.length - 1,pre=0,las=D.length; i >= 0; i--) {
					var name = D[i].Name.toLowerCase();
					for (var j = str.length - 1; j >= 0; j--) {
						if (name.indexOf(str[j]) !== -1 ) {
							newContent[pre] = D[i];
							pre++;
							break;
						};
						var strItem = str[j],passable = false;
						for (var k = strItem.length - 1; k >= 0; k--) {
							if(name.indexOf(strItem[k]) !== -1 )
							{
								newContent[las] = D[i];
								las++;
								passable = true;
								break;
							}
						};
						if (passable) {
							break;
						};
					};
				};
				for (var i = S.length - 1,pre=newContent.length,las=newContent.length+S.length; i >= 0; i--) {
					var name = S[i].Name.toLowerCase();
					for (var j = str.length - 1; j >= 0; j--) {
						if (name.indexOf(str[j]) !== -1 ) {
							newContent[pre] = S[i];
							pre++;
							break;
						};
						var strItem = str[j],passable = false;
						for (var k = strItem.length - 1; k >= 0; k--) {
							if(name.indexOf(strItem[k]) !== -1 )
							{
								newContent[las] = S[i];
								las++;
								passable = true;
								break;
							}
						};
						if (passable) {
							break;
						};
					};
				};
				
				//
				for (var i = newContent.length - 1; i >= 0; i--) {
					if( !(newContent[i]) ){
						newContent[i] = null;
					}
				};
				newContent = newContent.compact();
				// //倒序
				// var newnewContent = [];
				// for (var i = newContent.length - 1,j=0; i >= 0; i--) {
				// 	newnewContent[++j] = newContent[i];
				// };
				// newContent = newnewContent;
			}catch(e){}
			this.set("content",newContent);
		}.observes("searchValue","allDepartments","allStudents"),
	}).create();
	
	AdminManager.SearchView = Em.CollectionView.create({
		contentBinding:"AdminManager.SearchController",
		tagName:"ul",
		classNames:["sub-menu","sidebar-dropdown-menu","light","open"],
		itemViewClass:Em.View.extend({
			template:Ember.Handlebars.compile("<a><i class=‘icon-number-1 fg-color-yellow’></i>{{view.content.Name}}</a>"),
			eventManager:Em.Object.create({
				doubleClick:function(event,view){
					var Obj = view.content;
					if (Obj.Department) {//Student
						if (!$("a[href=" + Obj.get("frameIDSeletor") + "]").length) {
							var Con  = AdminManager.StudentController.create({
								content: Obj
							});
							AdminManager.StudentView.create({
								controller: Con
							});
						}Obj
					}else{//Department
						if (!$("a[href=" + Obj.get("frameIDSeletor") + "]").length) {
							var Con  = AdminManager.DepartmentController.create({
								content: Obj
							});
							AdminManager.DepartmentView.create({
								controller: Con
							});
						}
					};
				},
				click:function(){
					//console.log("???");

				}
			}),
		}),
	});
	AdminManager.SearchView.appendTo("#searchList");

	AdminManager.SearchInputView = 	Em.TextArea.create({
		valueBinding: "AdminManager.SearchController.searchValue",
		attributeBindings: ['placeholder', 'type'],
		placeholder: "搜索 部门 与 学生",
		type: "text",
		tagName: "input"
	});
	AdminManager.SearchInputView.appendTo("#searchInput");

});//(jQuery, Ember);

