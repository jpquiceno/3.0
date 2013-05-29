/**
 * global.js
 * Global variables used to enable/disable or set parameters used elsewhere in the application
 * @version 1.0
 * @copyright 2013 Centers for Disease Control
 */

 /** Does global CDC namespace exists? */
CDC = CDC || {};

CDC.Global = {
	// list of all the common chrome selectors in the template (footer, etc...)
	selectors: {
		container: "#container",
		pageOptions: ".pageoptions",
		leftNav: "nav#left",
		footer: "#footer",
		search: "#searchArea-two-column",
		content: "#content",
		onthispage: "#onthispage",
		localA2Z: ".local-a2z",
		modules: {
			box: ".box-module",
			block: ".block-module"
		},
		horizontalPageOptions: ".three, .two, .wide, .home-feat-opt, .wide-ln",
		verticalPageOptions: ".one"
	},
	// any assets used in the app should be referenced here.
	elements: {
		plus: "/TemplatePackage/3.0/images/plus12.png",
		minus: "/TemplatePackage/3.0/images/minus12.png"
	},
	ar: window.location.pathname.split("/"),
	filename: function() {return this.ar[this.ar.length - 1];},
	defaultLanguageCode: "en-US",
	socialEnabled: true,				// Idea was to enable FB/Twitter etc, globally per site. May be pointless
	debugEnabled: true,					// Allow console script debugging?
	a2zVisible: false,					// Is the A-Z bar visible?
	// these are bad markup removal flags ===========================================================================
	allowInlineStyles: false,			// allow style="" on elements?
	allowBRAfterHeading: false,			// allow <br /> after heading (<h1><h2>etc..) elements?
	allowEmptyParagraphs: false,		// allow <p></p> or <p>&nbsp;</p>?
	allowDoubleBreaks: true,			// allow <br /><br />?
	//									  ===========================================================================
	allowThemeSwitching: true,			// Doesn't appear to be used ATM, but would allow users to dynamically change the theme
	navSpeed: "fast",
	includePageFormats: true,
	includePageLanguages: true,					// Expand/collapse speed ("fast","slow", 2000): NOT EDITABLE
	includeBreadCrumbOnHomePage: true,	// Does bread crumb bar appear on home page
	includeCDCInBreadCrumbBar: true,	// Does "CDC" appear as the first item in the bread crumb bar?
	includePageInBreadCrumbBar: false,	// Should the current page appear in the bread crumb bar?
	catchJSErrors: true,				// Should we capture all JS errors?  I'm not sure this should be controlled by end users..
	hideToTopIconMS: 4000,				// How long to wait before hiding the To Top button in 1 column in milliseconds: NOT EDITABLE
	isScrolling: false,					// is the user currently scrolling: NOT EDITABLE
	tap: Modernizr.touch ? "touchstart" : "click",	// This needs to be revisited at some point to use the touch event instead of click on devices that support it.
	sliderSettings: []					// Not-yet-defined slider settings
	// WARN: $.browser removed in 1.9
	// isIE: $.browser.msie || false,
	// isIE6: ($.browser.msie || false) && +$.browser.version === 6,
	// isIE7: ($.browser.msie || false) && +$.browser.version === 7,
	// isIE8: ($.browser.msie || false) && +$.browser.version === 8,
	// isLTIE9: ($.browser.msie || false) && +$.browser.version < 9
};