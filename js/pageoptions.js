/**
 * pageoptions.js
 * Creates Page Option Elements
 * @version 1.0.0.0
 * @copyright 2013 Centers for Disease Control
 */

 /** Does global CDC namespace exists? */
CDC = CDC || {};

/** 
* @module PageOptions
* @memberof CDC
* @param {jQuery} $ 
* @param {window} w 
* @param {underscore} _
* @param {CDC.Global} g
*/
CDC.PageOptions = CDC.PageOptions || (function($, w, _, g) {
	"use strict";
	/*global log:false */

	/** @private */
	var config = {},
		pageOptions = '',
		dropDown = '',
		selectBox = '';

	/** 
	* @function oneColumnize
	* @access private
	* @desc Remove formatting on drop down for one column view
	*/
	var oneColumnize = function() {
		var html = $('html');

		if(html.hasClass("one")){
			pageOptions.removeClass('pull-right');
		} else {
			if(!pageOptions.hasClass('pull-right')){
				pageOptions.addClass('pull-right');
			}
		}
	};

	/** 
	* @function mcAccessible
	* @access private
	* @desc 508 Accessibility - set up page option drop downs for tabbing
	*/
	var mcAccessible = function () {
		var pageOptions = $("div.pageoptions .select-box > a");

		$(pageOptions).bind("focus", function () {
			$(this).parent().siblings('ul').addClass("sfhover");
		});
		
		$(pageOptions).bind("blur", function () {
			$(this).parent().siblings('ul').removeClass("sfhover");
		});
		
		$('div.pageoptions').find("li a").each(function () {
			var mcEl = $(this);
			mcEl.bind("focus", function () {
				var elem = $(this);
				elem.addClass("sffocus");
				var parentElem = elem.parent();
				while (parentElem.length > 0 && !parentElem.hasClass("drop-down")) {
					parentElem = parentElem.parent();
				}
				parentElem.addClass("sfhover");
			});
			mcEl.bind("blur", function () {
				var elem = $(this);
				elem.removeClass("sffocus");
				var parentElem = elem.parent();
				while (parentElem.length > 0 && !parentElem.hasClass("drop-down")) {
					parentElem = parentElem.parent();
				}
				if (parentElem.hasClass("sfhover")) {
					parentElem.removeClass("sfhover");
				}
			});
		});
	};

	/** 
	* @function setupDisplay
	* @access private
	* @desc Run all necessary function for drop down display
	*/
	var setupDisplay = function() {
		var formatOptions = $('.formatOptions'),
		languageOptions = $('.languageOptions');

		pageOptions = $(g.selectors.pageOptions);
		dropDown = $(g.selectors.pageOptions + ' .drop-down');
		selectBox = $(g.selectors.pageOptions + ' .select-box');


		if(g.includePageFormats){
			formatOptions.removeClass('formatOptionsOff');
			formatOptions.addClass('formatOptionsOn');
		} 

		if(g.includePageLanguages){
			languageOptions.removeClass('languageOptionsOff');
			languageOptions.addClass('languageOptionsOn');
		} 

		oneColumnize();	
		mcAccessible();
	};

	/** 
	* @function closeMenu
	* @access private
	* @desc Call drop down hide event
	*/
	var closeMenu = function() {
		dropDown.trigger('hide');
		return false;
	};

	/** 
	* @function resetDisplay
	* @access private
	* @desc Reset drop downs to default state and bindings
	*/
	var resetDisplay = function() {
		oneColumnize();
		mcAccessible();
		closeMenu();
	};

	/** 
	* @function setupListeners
	* @access private
	* @desc Set up all event listners on page options drop down elements
	*/
	var setupListeners = function () {
		dropDown.bind('show',function(){
			$(this).siblings(selectBox).addClass('expanded');
			$(this).addClass('sfhover');

		}).bind('hide',function(){

			$(this).siblings(selectBox).removeClass('expanded');
			$(this).removeClass('sfhover');

		});

		selectBox.find('a').click(function(e){ e.preventDefault(); });

		selectBox.click(function(){
			if($(this).hasClass('expanded')){
				$(this).siblings(dropDown).trigger('hide');
			}
			else {
				dropDown.trigger('hide');
				$(this).siblings(dropDown).trigger('show');
			}
			return false;
		});

		$(document).click(function(){
			dropDown.trigger('hide');
		});
	};

    return {
    	/** 
		* @method init
		* @access public
		* @desc Initialize pageoptions module
		* @param {object} c 
		*/
        init: function(c) {
            if (c && typeof(c) === 'object') {
                $.extend(config, c);
            }

			log("pageoptions init");
			 setupDisplay();
			 setupListeners();
        },
        /** 
		* @method reset
		* @access public
		* @desc Call private function resetDisplay()
		*/
        reset: function() {
			log("pageoptions reset");
			 resetDisplay();
        }
    };
})(jQuery, window, _, CDC.Global);