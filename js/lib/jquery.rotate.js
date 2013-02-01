/*
* blur: A jQuery cssHooks adding a cross browser 'blur' property to $.fn.css() and $.fn.animate()
*
* Copyright (c) 2010 Louis-R¨¦mi Bab¨¦
* Licensed under the MIT license.
* 
* This saved you an hour of work? 
* Send me music http://www.amazon.fr/wishlist/HNTU0468LQON
*
*/
(function ($) {

    var div = document.createElement('div'),
  divStyle = div.style,
  support = $.support;

    support.filter =
  divStyle.MozFilter === '' ? 'MozFilter' :
  (divStyle.MsFilter === '' ? 'MsFilter' :
  (divStyle.WebkitFilter === '' ? 'WebkitFilter' :
  (divStyle.OFilter === '' ? 'OFilter' :
  false)));
    support.matrixFilter = !support.filter && divStyle.filter === '';
    div = null;

    $.cssNumber.blur = true;
    $.cssHooks.blur = {
        set: function (elem, value) {
            var _support = support,
      supportFilter = _support.filter,
      cos, sin,
      centerOrigin;

            if (typeof value === 'string') {
                value = toRadian(value);
            }

            $.data(elem, 'filter', {
                blur: value
            });

            if (supportFilter) {
                elem.style[supportFilter] = 'blur(' + value + 'px)';

            } else if (_support.matrixFilter) {
                cos = Math.cos(value);
                sin = Math.sin(value);
                elem.style.filter = [
        "progid:DXImageFilter.Microsoft.Matrix(",
          "M11=" + cos + ",",
          "M12=" + (-sin) + ",",
          "M21=" + sin + ",",
          "M22=" + cos + ",",
          "SizingMethod='auto expand'",
        ")"
      ].join('');

                // From pbakaus's Filterie http://github.com/pbakaus/filterie
                if (centerOrigin = $.blur.centerOrigin) {
                    elem.style[centerOrigin == 'margin' ? 'marginLeft' : 'left'] = -(elem.offsetWidth / 2) + (elem.clientWidth / 2) + "px";
                    elem.style[centerOrigin == 'margin' ? 'marginTop' : 'top'] = -(elem.offsetHeight / 2) + (elem.clientHeight / 2) + "px";
                }
            }
        },
        get: function (elem, computed) {
            var filter = $.data(elem, 'filter');
            return filter && filter.blur ? filter.blur : 0;
        }
    };
    $.fx.step.blur = function (fx) {
        $.cssHooks.blur.set(fx.elem, fx.now + fx.unit);
    };

    function radToDeg(rad) {
        return rad * 180 / Math.PI;
    }
    function toRadian(value) {
        if (value.indexOf("deg") != -1) {
            return parseInt(value, 10) * (Math.PI * 2 / 360);
        } else if (value.indexOf("grad") != -1) {
            return parseInt(value, 10) * (Math.PI / 200);
        }
        return parseFloat(value);
    }

    $.blur = {
        centerOrigin: 'margin',
        radToDeg: radToDeg
    };

})(jQuery);