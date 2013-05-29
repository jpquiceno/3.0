// mobile.js
// typically the stuff that happens only in 1 & 2 col...
//

CDC = CDC || {};
CDC.Mobile = CDC.Mobile || (function($, w, _, g, c) {
	"use strict";
	/*global log:false */
	var config = {};
	
	var setupDisplay = function() {
		// if there's a datatable, add the button & listener then append
		if($('.datatable').length){
			var ttv = $("<div></div>")
				.attr({
					id: 'ttv'
				})
				.addClass("visible-one")		// when resizing(!), make sure it only appears in the one column view
				.text(c.getTapToViewText())
				.on("click", function() {
					$("html").toggleClass('datatable');
					$(this).text($(this).text() ===  c.getTapToViewText() ? c.getTapToCloseText() : c.getTapToViewText());
				});
			$(".datatable").after(ttv);
		}
	};
	
	var setupListeners = function() {
		// click on the footer headings in 1 col
		$("#footer").on("click", "h4", function(){
			var t = $(this);
			
			// show/hide the next element - should be the hidden one
			t.next().toggleClass("hidden-one");
			
			// toggle the arrows
			t.children("span").toggleClass("b14d b14u");
		});
		
		$("nav#left li:first-child").on("click", "a", function(){
			$("#navmenu").hide();
		});
		
		// menu tab click
		$("#mobile-menu li:first-child").on("click", function(){
			$(".a2z-bar").removeClass("hide").addClass("hide");
			$(".searchbar").removeClass("hide").addClass("hide");
			
			$("#mobile-menu li:eq(0)").removeClass().addClass("border-bottom-themed");
			$("#mobile-menu li:eq(1)").removeClass().addClass("border-bottom-white");
			$("#mobile-menu li:eq(2)").removeClass().addClass("border-bottom-white");
			
			var t = $(this),
			navmenu = $('#navmenu'),
			ln = $("nav#left:first");
			
			if(navmenu.length === 0 ) {
				navmenu = $('<div></div>').attr('id', 'navmenu')
				.css('display', 'none')
				.appendTo($('body'));
				
				ln.clone(true).appendTo(navmenu);
				
				$("#navmenu nav#left").addClass("left-menu").removeClass("hidden-two hidden-one").css({
					display: "inherit",
					position: "relative",
					left: 0,
					zIndex: 9999
				});
			}
			
			// width: "300px",
			// padding: "5px",
			// background: "#fff",
			
			
			if($("html").hasClass("one")) {
				// in one column view, the leftnav has a back link at the top
				
				navmenu.css({
					position: 'absolute',
					height: "auto",
					top: "85px",
					left: "0",
					width: "100%"
				});
			}
			else {
				if ($("html").hasClass("two")) { 
					navmenu.css({
						position: 'absolute',
						top: t.offset().top + t.outerHeight(),
						left: t.offset().left - 140 + t.outerWidth(),
						height: "auto",
						width: "50%"
					});
				}
			}
			
			$("#navmenu").toggle();
		});
		
		// a2z large and Desktop view
		$(".a2z-button").on("click", function(){
			if($(".a2z-button i").hasClass("icon-angle-up")){
				$(".a2z-button i").removeClass("icon-angle-up").addClass("icon-angle-down");
			} else {
				$(".a2z-button i").removeClass("icon-angle-down").addClass("icon-angle-up");
			}
			
			$(".a2z-bar").removeClass("hide");
			// $(".a2z-bar .a2z").show();
		});
		
		// a2z tab click
		$("#mobile-menu li:eq(1)").on("click", function(){
			$("#mobile-menu li:eq(0)").removeClass().addClass("border-bottom-white");
			$("#mobile-menu li:eq(1)").removeClass().addClass("border-bottom-cdcblue");
			$("#mobile-menu li:eq(2)").removeClass().addClass("border-bottom-white");
			
			$("#navmenu").hide();
			$(".a2z-bar").removeClass("hide");
			$(".a2z-bar").show();
			$(".searchbar").removeClass("hide").addClass("hide");
		});
		
		// search tab click
		$("#mobile-menu li:eq(2)").on("click", function(){
			$("#mobile-menu li:eq(0)").removeClass().addClass("border-bottom-white");
			$("#mobile-menu li:eq(1)").removeClass().addClass("border-bottom-white");
			$("#mobile-menu li:eq(2)").removeClass().addClass("border-bottom-cdcblue");
			
			$("#navmenu").hide();
			$(".a2z-bar").removeClass("hide").addClass("hide");
			$(".searchbar").removeClass("hide");
		});
	};
	
	// public
	return {
		init: function(c) {
			log("mobile init");
			if (c && typeof(c) === 'object') {
				$.extend(config, c);
			}
			setupDisplay();
			setupListeners();
		}
	};
})(jQuery, window, _, CDC.Global, CDC.Constants);