//Model bulid & Controler bulid & View Init
(function ($, Em) {
	console.log("app star");
    window.Employment = Em.Application.create({
		 
	});
//Control
    Employment.employer = Em.ObjectController.create({
		content:{
							"id": 0,
							"Name": null,
							"RegisterNum": null,
							"Grade": 0,
							"Department": null,
							"LoginIng": false
						}
	});
    Employment.EmployersController = Em.ArrayController.create({
        content: [],
			rootElement:$( '#interface'),
        _id: "HumanController",
        _parentId: "human",
        refreshData: function () {
            $.getJSON("./data/employers.json", { "_$": Math.random() }, function (newdata) {
                var controller = Employment.EmployersController;
                controller.set("content", newdata);
            });
        }
    });
    Employment.EmployersController.refreshData();//初始化用户数据，并绑定数据

/*----------------------------------------------------*/
//View
	Employment.EmployersView = Em.CollectionView.create({
		templateName:"employersList",
		content:Employment.EmployersController.content
	})

    $("#human").on("click", ".people", function () {
        //console.log(this);
		var self = this;
		var id = self.userId;
		var data=Employment.EmployersController.find(function(item){return parseInt(item.id) === parseInt(id);});//从缓存中取得数据
		$.getJSON("./data/employers.json", { "_$": Math.random() }, function (newdata) {
			var Length = newdata.length;
			for (var i=0;i<Length ; ++i)
			{
				if (parseInt(newdata[i].id) === parseInt(id)){//取得最新数据
					data = newdata[i];
					break;
				}
			}
		});
		Employment.employer.set(data);
    });

})(jQuery, Ember);
