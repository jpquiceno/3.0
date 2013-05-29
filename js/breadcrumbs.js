/**
 * modules.js
 * Create links in the bread-crumb nav area, based on the current page
 * @version 1.0
 * @copyright 2013 Centers for Disease Control
 */

 /** Does global CDC namespace exists? */
CDC = CDC || {};

CDC.buildBreadCrumbBar = function (t){
	var li = "",
		str = [],
		parent = "";
		
	if(arguments.length){
		// if($("html").hasClass("no-nav")) { return false; }
		li = t.parents('li'); //;
		
		if(CDC.Global.includePageInBreadCrumbBar) {
			str.push('<span><a class="no-link" href="' + t.children('a').attr('href') + '">' + t.children('a').text() + '</a></span>');
		}
		
		li.each(function(i){
			//console.log("txt: ", $(this).children('a').text());
			// var span = i === 0 ? '<span>' : '<span class="hidden-one">';
			var span = '<span>';
			str.push(span + '<a class="no-link" href="' + $(this).children('a').attr('href') + '">' + $(this).children('a').text() + '</a></span>');
		});

		// need the anchor from the h2 in the titlebar
		/*parent = $('.titlebar h2').html();
		if(li.length) {
			str.push('<span class="hidden-one"><a class="no-link" href="' + parent.attr("href") + '">' + parent.text() + '</a></span>');
		}
		else {
			str.push('<span><a class="no-link" href="' + parent.attr("href") + '">' + parent.text() + '</a></span>');
		}*/
	}
	// if the option to include CDC link in the breadcrumb bar is enabled, add it last
	if(CDC.Global.includeCDCInBreadCrumbBar) str.push('<span class="hidden-one"><a class="no-link" href="http://www.cdc.gov/">CDC</a></span>');

	// reverse the array and join it with our seperator span
	$(".bread-crumb").empty().html(str.reverse().join('<span class="lt hidden-one"></span>'));
}

