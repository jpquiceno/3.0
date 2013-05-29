/**
 * responsive.js
 * Event handling for resizing/responsive elements
 * @version 1.0.0.0
 * @copyright 2013 Centers for Disease Control
 */

 /** Does global CDC namespace exists? */
CDC = CDC || {};

CDC.Responsive = CDC.Responsive || (function($, w, _, g, c) {
	"use strict";
	/*global log:false console:false */
	var config = {
		last: 0,
		hasPageOptions: $("#pageoptions").length,
		orgBodyClass: $("#body")[0].className,
		spanName: ["span", parseInt($("#body")[0].className.replace("span", ""), 10) + 2].join("")	// page options...
	};
	
	var setupListeners = function() {
		// $(g.selectors.modules.box + " , " + g.selectors.modules.block).find('h3').each(function(){
		// 	$(this).on('click', function () {
		// 		$(this).next('ul').toggleClass("hidden-one");
		// 		$(this).toggleClass("expand");
		// 	}).css("cursor", "pointer");
		// });
		
		// $(g.selectors.footer).find('article h4').each(function(){
		// 	var t = $(this);
		// 	t.on('click', function () {
		// 		t.next("ul, address").toggleClass("hidden-one");
		// 		t.toggleClass("expand");
		// 	}).css("cursor", "pointer");
		// });
	};
	
	var updateViewPort = function(resize) {
		var ww = $(w).width(),
			html = $("html");
		
		if(ww > 1199){
			html.removeClass("one two three four").addClass("four");
		}
		else if(ww > 979 && ww < 1200) {
			html.removeClass("one two three four").addClass("three");
		}
		else if(ww > 767 && ww < 980) {
			html.removeClass("one two three four").addClass("two");
		}
		else {
			html.removeClass("one two three four").addClass("one");
		}
		
		setupListeners();
		
		// reset left nav, close & empty nav slider
		if(resize){
			//s$.pageslide.close();
			$("#pageslide").empty();
			$("#navmenu").hide();
			// $('#imageModal').modal('hide');
			$("nav#left:not('left-menu')").removeClass("hidden-one hidden-two").addClass("hidden-one hidden-two");
			CDC.PageOptions.reset();
			// hide zoomed in images
			// don't allow clicking on zoom images in 2,3,4
		}
	};
	
	// public
	return {
		init: function(c) {
			log("responsive init");
			if (c && typeof(c) === 'object') {
				$.extend(config, c);
			}
			
			// window was resized or orientation change
			// delay the event until user is done resizing the window
				$(w).resize(_.debounce(function(e) {
					log("responsive resize: ", e.target === w);
					updateViewPort(1);
				}, 200));
			
			updateViewPort(0);
		}
	};
})(jQuery, window, _, CDC.Global, CDC.Constants);