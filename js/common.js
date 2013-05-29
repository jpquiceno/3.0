/**
 * common.js
 * Commonly used utility methods
 * @version 1.0
 * @copyright 2013 Centers for Disease Control
 */

 /** Does global CDC namespace exists? */
CDC = CDC || {};

CDC.Common = {
	
	// the the real height/width of an image
	// img should be a selector, not a path or name
	getImageDimensions: function(img) {
		var i = $(img)[0],
			w,
			h;
		$("<img/>")
		.attr("src", $(img).attr("src"))
		.load(function() {
			w = this.width;
			h = this.height;
		});
		return [].push.apply(w,h);
	},
	setTheme: function(color) {
		var c = $.trim(color.toLowerCase()),
			theme = ["theme",c].join("-");
			
		$.cookie('theme', c, { expires: 7 });
		
		$("html").removeClass(function (index, css) {
			return (css.match (/\btheme-\S+/g) || []).join(' ');
		}).addClass(theme);
	},
	getFileName: function(path) {
		path = path.split("/");
		return path[path.length - 1]; 
	},
};


String.prototype.trim = function() {
	return this.replace(/^\s+|\s+$/g, "");
} 

String.prototype.lTrim = function () {
	return this.replace(/^\s+/g, "");
}

String.prototype.rTrim = function () {
	return this.replace(/\s+$/g, "");
}

String.prototype.left = function(len) {
	return (len > this.length) ? this : this.substring(0, len);
}

String.prototype.right = function(len) {
	return (len > this.length) ? this : this.substring(this.length - len);
}

String.prototype.beginsWith = function(t) {
	return (t.toLowerCase() == this.substring(0, t.length).toLowerCase());
} 

String.prototype.endsWith = function(t) {
	return (t.toLowerCase() == this.substring(this.length - t.length).toLowerCase());
}

