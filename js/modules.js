/**
 * modules.js
 * {Description}s
 * @version 1.0
 * @copyright 2013 Centers for Disease Control
 */

 /** Does global CDC namespace exists? */
CDC = CDC || {};

CDC.Modules = CDC.Modules || (function($, w, _, g) {
	"use strict";
	/*global log:false */
	var config = {};

	var setupDisplay = function() {

		// WARN: this was created for the FASD demo, and may not be useful!
		if($(g.selectors.onthispage).find("ul").is(":visible")) {
			$(g.selectors.onthispage).find("h3").before('<span class="up"></span>');
		}
		else {
			$(g.selectors.onthispage).find("h3").before('<span class="down"></span>');
		}
	};

	var setupListeners = function() {
		$(g.selectors.onthispage).on("click", "span", function() {
			var t = $(this),
				c = t.children("img");
				
			t.parent("div").find("ul").slideToggle(g.navSpeed);
			
			t.toggleClass("down up");
			// t.toggle(
			// 	function () {
			// 		t.children("img").attr({src:"images/down.png"});
			// 	},
			// 	function () {
			// 		t.children("img").attr({src:"images/up.png"});
			// 	}
			// );
		});
		
		$(".box-module").on("click", "li", function() {
			var t = $(this);
			
			window.location=t.find("a").attr("href");
			return false;
		});
	};

    // public
    return {
        init: function(c) {
            if (c && typeof(c) === 'object') {
                $.extend(config, c);
            }

			log("modules init");
			setupDisplay();
			setupListeners();
        }
    };
})(jQuery, window, _, CDC.Global);