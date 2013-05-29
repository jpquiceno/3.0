/**
 * search.js
 * Event handling for resizing/responsive elements
 * @version 1.0.0.0
 * @copyright 2013 Centers for Disease Control
 */

 /** Does global CDC namespace exists? */
CDC = CDC || {};

CDC.Search = CDC.Search || (function($, w, _, g) {
	"use strict";
	/*global log:false */
	var config = {};
	
	var setupDisplay = function() {
		// WARN: $.browser removed in 1.9
		// if($.browser.safari){
		// 	$("#search button").css("margin-left", "-10px");
		// }
	};
	
	var setupListeners = function() {
		
		$("#newsearch").on("click", "#newsearchmenu", function() {
			// $("#newsearch ul").slideToggle(g.navSpeed);
			
			if($("#newsearch ul").is(":visible")) {
				$("#newsearch ul").hide();
				
				if($("#newsearchtext").text() === "CDC ONLY") {
					$("#newsearchmenu img").attr("src", "../images/down-w.png");
				}
				else {
					$("#newsearchmenu img").attr("src", "../images/down.png");
				}
			}
			else{
				$("#newsearch ul").show();
				if($("#newsearchtext").text() === "CDC ONLY") {
					$("#newsearchmenu img").attr("src", "../images/up-w.png");
				}
				else {
					$("#newsearchmenu img").attr("src", "../images/up.png");
				}
			}
		});
		
		$("#newsearch").on("click", "li", function(e){
			e.stopPropagation();
			var txt = $(this).text();
			// $("#newsearch ul").slideToggle(g.navSpeed);
			$("#newsearch ul").hide();
			$("#newsearchmenu span:first-child").text(txt);
			// $("#newsearchmenu").toggleClass("dropdown dropup");
			
			if(txt === "CDC ONLY"){
				$('#newsearch').css({background: "#476CA4", color: "#fff"});
				$("#newsearchmenu img").attr("src", "../images/down-w.png");
				$("#searchCDCLocal2").val("");
			}
			else{
				$('#newsearch').css({background: "#dad5eb", color: "#000"});
				$("#newsearchmenu img").attr("src", "../images/down.png");
				$("#searchCDCLocal2").val("features");
			}
		});
		
		// $(document).mouseup(function (e) {
		// 	$("#newsearch ul").hide();
		
		// 	if($("#newsearchtext").text() === "CDC ONLY") {
		// 		$("#newsearchmenu img").attr("src", "../images/down-w.png");
		// 	}
		// 	else {
		// 		$("#newsearchmenu img").attr("src", "../images/down.png");
		// 	}
		// });
		
		$(g.selectors.search).find('.dropdown-menu li').on(g.tap, function(){
			var txt = $(this).text();
			
			// TODO: BAD BAD BAD!!!
			// This is ONLY FOR THE DEMO
			if(txt === "CDC ONLY"){
				$('.input-prepend, #search .dropdown-toggle').css({background: "#476CA4", color: "#fff"});
			}
			else{
				$('.input-prepend, #search .dropdown-toggle').css({background: "#dad5eb", color: "#000"});
			}
			
			$(".dropdown-toggle").html($(this).text() + ' <span class="caret"></span>');
			$(".searchType").val($(this).text());
		});
		
		// the search button that toggles the search form in the 2 column view
		$('.search-button').on(g.tap, function(){
			var t = $(this);
			
			if($(g.selectors.search).length) {
				$(g.selectors.search).toggleClass("hidden-two");
				$(".titlebar").before($(g.selectors.search));
			}
			else {
				$("#newsearch").toggleClass("hidden-two");
				$(".titlebar").before($("#newsearch"));
			}
			// t.after($(g.selectors.search));
		});
		
		$("#prependedDropdownButton").keypress(function(event) {
			if (event.which === 13) {
				event.preventDefault();
				$("form").submit();
			}
		});
		
		// actually the wrong class name...
		$('.topic-button').on("click", function(){
			
			if($(g.selectors.search).length) {
				$(g.selectors.search).toggleClass("hidden-one");
				// $(".titlebar").before($(g.selectors.search));
			}
			else {
				$("#newsearch").toggleClass("hidden-one");
				// $(".titlebar").before($("#newsearch"));
			}
			// $(g.selectors.search).toggleClass("hidden-one");
			// $("#newsearch").toggleClass("hidden-one");
			$(".a2z-link-button").toggleClass("hidden-one");
		});
	};
	
	// public
	return {
		init: function(c) {
			log("search init");
			if (c && typeof(c) === 'object') {
				$.extend(config, c);
			}
			
		setupDisplay();
		setupListeners();
		}
	};
})(jQuery, window, _, CDC.Global);