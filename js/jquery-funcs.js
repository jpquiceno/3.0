!(function($) {
	"use strict";

	var visible = $.fn.visible,
		invisible = $.fn.invisible,
		visibilityToggle = $.fn.visibilityToggle;

	$.fn.visible = function() {
		return this.css('visibility', 'visible');
	};

	$.fn.invisible = function() {
		return this.css('visibility', 'hidden');
	};

	$.fn.visibilityToggle = function() {
		return this.css('visibility', function(i, visibility) {
			return (visibility == 'visible') ? 'hidden' : 'visible';
		});
	};

	$.extend($.expr[':'], {
		topmost: function(e, index, match, array) {
			for (var i = 0; i < array.length; i++) {
				if (array[i] !== false && $(e).parents().index(array[i]) >= 0) {
					return false;
				}
			}
			return true;
		}
	});
})(jQuery);