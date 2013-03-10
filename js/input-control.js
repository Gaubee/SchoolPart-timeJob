/**
 * jQuery plugin for input elements for Metro UI CSS framework
 */
(function ($) {

    $.Input = function (element, options) {

        var defaults = {
    };

    var plugin = this;
    plugin.settings = {};
    var $element = $(element);

    plugin.init = function () {
        plugin.settings = $.extend({}, defaults, options);

        if ($element.hasClass('text')) {
            initTextInput();
			$element.attr("inputControl",true);
        } else if ($element.hasClass('password')) {
            initPasswordInput();
			$element.attr("inputControl",true);
        }
    };

    /**
    * initialize text input element behavior
    */
    var initTextInput = function () {
        var $helper,
                input;
        $helper = $element.children('.helper');

        if (!$helper.get(0)) {
            return;
        }

        $helper.attr('tabindex', '-1');
        $helper.attr('type', 'button');
        //$helper[0].type = 'button';

        // clear text when click on helper
        $helper.on('click', function () {
            input = $element.children('input');
            if (input.prop('readonly')) {
                return;
            }
            input.val('');
            input.focus();
        });
    };

    /**
    * initialize password input element behavior
    */
    var initPasswordInput = function () {
        var $helper,
                password,
                text;
        $helper = $element.children('.helper');
        if (!$helper.get(0)) {
            return;
        }

        text = $('<input type="text" />');
        password = $element.children('input');
        $helper.attr('tabindex', '-1');
        $helper.attr('type', 'button');
        //$helper[0].type = 'button';

        // insert text element and hode password element when push helper
        $helper.on('mousedown', function () {
            password.hide();
            text.insertAfter(password);
            text.val(password.val());
        });

        // return password and remove text element
        $helper.on('mouseup, mouseout', function () {
            text.detach();
            password.show();
            password.focus();
        });
    };

	if(!$element.attr("inputControl")){
		plugin.init();
		console.log("input init")
	}
};

$.fn.Input = function (options) {
    return this.each(function () {
        if (undefined == $(this).data('Input')) {
            var plugin = new $.Input(this, options);
            $(this).data('Input', plugin);
        }
    });
}

})(jQuery);



$(function(){


	 window.ReactivateInputs = function(){
    
		var allInputs = $('.input-control');

		// allInputs.each(function (index, input) {
			
  //       var params = {};

		// 			$input = $(input);


		// 			$input.Input(params);
 
		// });
        //allInputs.Input({});

        $("body").on("mouseover",".input-control",function(){
            $(this).Input({});
        })
	
}

	//ReactivtaeInputs();
	try{
		ReactivateInputs();

	}catch(e){
			console.info(e);
	}
});