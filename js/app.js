/**
 * app.js
 * {Description}
 * @version 1.0
 * @copyright 2013 Centers for Disease Control
 */

 /** Does global CDC namespace exists? */
CDC = CDC || {};

CDC.App = CDC.App || (function($, w, _, g, c) {
	"use strict";
	/*global log:false, console:false */
	var config = {
		ww: $(w).width()
	};

	// contains general methods for setup of display and event handlers for the app
	// TODO: consider moving specific functionality to their own modules
	var methods = {
		init: function() {
			// this.catchErrors();
			this.setupResponsive();
			this.setupDisplay();
			this.setupListeners();
		},
		setupDisplay: function() {
			this.tidyMarkup();
			this.displayA2Z();
			this.displayBreadCrumbs();
			this.displayPageOptions();
			this.displayExternalLinksDocuments();
			this.displayContainer();
		},
		setupListeners: function() {
			this.handleA2Z();
			this.handleSearch();
			this.handleMobile();
			this.handleModules();
			this.handleScroll();
			this.rebindClicks();
		},
		setupResponsive: function() {
			CDC.Responsive.init();
		},
		tidyMarkup: function() {
			this.removeInlineStyles();
			this.removeEmptyParagraphs();
			this.removeBRAfterHeading();
			this.removeDoubleBreaks();
		},
		removeInlineStyles: function(){
			// remove any styles added to any element in the content
			// TODO: I don't know how heavy this could be, consider revising
			// WARN: this might (even though it shouldn't) break plugins!
			if(!g.allowInlineStyles) {
				$(g.selectors.content).find("*").removeAttr("style");
			}
		},
		removeEmptyParagraphs: function() {
			// remove <p>&nbsp;</p>
			if(!g.allowEmptyParagraphs) {
				$("p").filter(function(){
					return $.trim(this.innerHTML) === "&nbsp;";
				}).remove();
			}
		},
		removeBRAfterHeading: function() {
			// remove stuff like <h3>heading</h3><br />
			if(!g.allowBRAfterHeading) {
				$('h1,h2,h3,h4,h5,h6').next("br").remove();
			}
		},
		removeDoubleBreaks: function() {
			if(!g.allowDoubeBreaks) {
				$("br").next("br").remove();
			}
		},
		toggleDebug: function(b){
			// b && $('body').toggleClass("debug");
		},
		catchErrors: function() {
			// if there are any errors, force the container to show anyway.
			if(g.catchJSErrors) {
				w.onerror = function(m, u, l) {
					document.querySelector('.container').style.visibility = "visible";
					if(this.console) {
						console.log("Error: Line [%s] Message [%s] Page [%s]", l, m, u);
					}
					else {
						w.log("Error: Line [%s] Message [%s] Page [%s]", l, m, u);
					}
				};
			}
		},
		displayA2Z: function() {
			// hide a2z bar by default
			if($(".a2z-bar").length) {
				$(".a2z-bar").hide();
			}
		},
		handleA2Z: function() {
			$('.a2z-button').on("click", function(){
				$('.a2z-bar').slideToggle(g.navSpeed);
				// TODO: this needs to change to work like the rest of the arrow icons
				// dropdown > arrow , dropup > arrow
				$(this).children("span").toggleClass("w12d w12u");
			});
		},
		handleSearch: function() {
			CDC.Search.init();
		},
		handleMobile: function() {
			CDC.Mobile.init();
		},
		handleModules: function() {
			CDC.Modules.init();
		},
		handleScroll: function() {
			var t = $('#totop');
			
			// when scrolling in the one column, keep the top icon visible for 3seconds
			$(w).scroll(function() {
				g.isScrolling = true;
				if($(this).scrollTop() > 200) {
					if(t.hasClass("off")){
						t.removeClass("off").addClass("on");
						setTimeout(function() {
							t.removeClass("on").addClass("off");
						}, g.hideToTopIconMS);
					}
				} else {
					if(t.hasClass("on")){
						t.removeClass("on").addClass("off");
					}
				}
			});
			
			$(w).scroll(_.debounce(function(e) {
				g.isScrolling = false;
			}, 300));
			
			$('#totop, .toTop').click(function() {
				$('body,html').animate({scrollTop:0},800);
			});
		},
		rebindClicks: function() {
			var userAgent = navigator.userAgent.toLowerCase();
			var isIphone = (userAgent.indexOf('iphone') != -1) ? true : false;
			
			if (isIphone) {
				// For each event with an inline onclick
				$('[onclick]').each(function() {
					var onclick = $(this).attr('onclick');
					$(this).removeAttr('onclick'); // Remove the onclick attribute
					$(this).bind("click", this.preventClickEvent); // See to it that clicks never happen
					$(this).bind('tap', onclick); // Point taps to the onclick
				});
			}
		},
	preventClickEvent: function(event) {
		event.preventDefault();
	},
		displayBreadCrumbs: function() {
			if($(g.leftNav).length == 0 && g.includeBreadCrumbOnHomePage){
				CDC.buildBreadCrumbBar();
			}
		},
		displayPageOptions: function() {
			if((g.includePageFormats || g.includePageLanguages) && $(g.selectors.pageOptions).length > 0){
				CDC.PageOptions.init();
			}
		},
		displayExternalLinksDocuments: function() {
			CDC.Policy.Documents.init();
			CDC.Policy.External.init();
		},
		displayContainer: function() {
			// once everything is loaded, display the container
			// WARN: revisit this.
			$(".container").visible();
		}
	};

	// public
	return {
		init: function(c) {
			log("cdc init");
			if (c && typeof(c) === 'object') {
				$.extend(config, c);
			}
			methods.init();
			
			// theme cookie
			var tc = $.cookie('theme');
			if(!!(tc)) {
				common.setTheme(tc);
			}
			
			// TODO: late minute prototype addition, needs to be moved!
			$('.related h4').on("click", function() {
				var t = $(this),
					u = t.next("ul"),
					s = t.children("span");
				
				if(u.hasClass("hidden-one")) {
					u.removeClass();
					s.removeClass("b14d").addClass("b14u");
				}
				else {
					u.addClass("hidden-one hidden-two");
					s.removeClass("b14u").addClass("b14d");
				}
			});
			
			$('#themepicker').on("click", "li", function(){
				var t = $(this);
				common.setTheme(t.text());
				
				return false;
			});
		}
	};
})(jQuery, window, _, CDC.Global, CDC.Constants);

$(function(){
	CDC.App.init();
});

$(document).bind("mobileinit", function(){
	$.mobile.loadingMessage = false;
});