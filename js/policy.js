/**
 * policy.js
 * External Links and Non-HTML Documents
 * @version 1.0.0.0
 * @copyright 2013 Centers for Disease Control
 */

 /** Does global CDC namespace exists? */
CDC = CDC || {};

CDC.Policy = {};

CDC.Policy.External = CDC.Policy.External || (function($, w, _, g, c){
	"use strict";
	/*global log:false */
	var config = {};

	var local = {
		hasExternal: false
	};

	var WhiteListEntry = function (domainPattern, isRegExp) {
		this.DomainPattern = domainPattern;
		this.IsRegExp = isRegExp;
	};

	// Holds a collection of expressions for defining non-external sites.
	var whiteList = [
		new WhiteListEntry("https?://[a-zA-Z0-9_\-]*\.cdc\.gov(?:[\\?/](?:.*)?)?", true),
		new WhiteListEntry("https?://[a-zA-Z0-9_\-]*\.[a-zA-Z0-9_\-]*\.cdc\.gov(?:[\\?/](?:.*)?)?", true)
	];

	// Simple function to see if a URL should be considered external based on the white list.
	var IsExternal = function (href) {
		var result = true;
		if (typeof href == "undefined" || href.length == 0){ // || (href.indexOf("http://") == -1 && href.indexOf("https://") == -1)) {
			return false;
		} else {
			for (var i = 0; i < whiteList.length; i++) {		
				if (whiteList[i].IsRegExp) {
					var exp = new RegExp(whiteList[i].DomainPattern, "mi");
					if (exp.test(href)) {
						result = false;
						break;
					}
				} else {
					if (href.indexOf(whiteList[i].DomainPattern) > -1) {
						result = false;
						break;
					}
				}
			}
		}

		return result;
	};

	var AddExternalLinking = function(el){
		// if the html is flagged with no-link, jump out
		if($('html').hasClass('no-link')) return;

		var anchors = el ? el : $('#content a:not([href^="mailto:"],[href^="javascript:"],[href^="#"])');
		
		anchors.filter(function() {

			var result = this.href && IsExternal(this.href);
			return result;
			}).each(function() {
				var t = $(this);
				var ext = ["<a href=\"", c.getExternalLink(), "\" class=\"external\"></a>"].join("");

				if(!t.hasClass("no-link") && !t.hasClass("external") && !t.hasClass("noLinking")){
							// ignore flagged links & links that are already external
					t.attr({target: "_blank", title: c.getExternalIconTitle()}).append(ext);
					local.hasExternal = true;
				}
		});
	};

	var setupDisplay = function() {

		 AddExternalLinking();
		
		//TODO: need docs on Legend for external links/documents
		if(local.hasExternal);
		// if a pdf or some other file is used in the page:
		//<div id="plugin-legend" class="pluginOn"><h3>File Formats Help:</h3><ul><li class="plugin-pdf pluginOn"><a href="/Other/plugins/#pdf"><img alt="Adobe PDF file" src="/TemplatePackage/images/icon_pdf.gif"></a></li><li class="plugin-word"><a href="/Other/plugins/#doc"><img alt="Microsoft Word file" src="/TemplatePackage/images/icon_word.gif"></a></li><li class="plugin-excel"><a href="/Other/plugins/#xls"><img alt="Microsoft Excel file" src="/TemplatePackage/images/icon_excel.gif"></a></li><li class="plugin-ppt"><a href="/Other/plugins/#ppt"><img alt="Microsoft PowerPoint file" src="/TemplatePackage/images/icon_ppt.gif"></a></li><li class="plugin-wmv"><a href="/Other/plugins/#wmv"><img alt="Audio/Video file" src="/TemplatePackage/images/icon_wmv.gif"></a></li><li class="plugin-zip"><a href="/Other/plugins/#zip"><img alt="Zip Archive file" src="/TemplatePackage/images/icon_zip.gif"></a></li><li class="plugin-real"><a href="/Other/plugins/#ram"><img alt="RealPlayer file" src="/TemplatePackage/images/icon_real.gif"></a></li><li class="plugin-qt"><a href="/Other/plugins/#qt"><img alt="Apple Quicktime file" src="/TemplatePackage/images/icon_qt.gif"></a></li></ul><p><a href="/Other/plugins/"><span class="tp-label">How do I view different file formats (PDF, DOC, PPT, MPEG) on this site?</span>&nbsp;<img alt="double arrows." src="/TemplatePackage/images/btn_dblArrows.gif"></a></p></div>
	};

   // public
    return {
        init: function(c) {
            log("external init");
            if (c && typeof(c) === 'object') {
                $.extend(config, c);
            }

            setupDisplay();
        },
        isExternal: function(href){
        	return IsExternal(href);
        },
        addExternalLinking: function(el){
        	AddExternalLinking(el);
        }
    };
})(jQuery, window, _, CDC.Global, CDC.Constants);


// Declare an object for handling page links.
CDC.Policy.Documents = CDC.Policy.Documents || (function($, w, _, g, c){

	// A class used to define the image and attributes associated with a particular file extension.
	function pluginDefinition(fileExtension, imageSrc, imageAlt, imageTitle, legendClass) {
		this.fileExtension = fileExtension;
		this.imageSrc = imageSrc;
		this.imageAlt = imageAlt;
		this.imageTitle = imageTitle;
		this.legendClass = legendClass;
	};
	
	var pluginDefinitions = new Array(
		new pluginDefinition(".pdf", "/TemplatePackage/images/icon_pdf.gif", "Adobe PDF file", "Adobe PDF file", "plugin-pdf"),
		new pluginDefinition(".doc", "/TemplatePackage/images/icon_word.gif", "Microsoft Word file", "Microsoft Word file", "plugin-word"),
		new pluginDefinition(".docx", "/TemplatePackage/images/icon_word.gif", "Microsoft Word file", "Microsoft Word file", "plugin-word"),
		new pluginDefinition(".rtf", "/TemplatePackage/images/icon_word.gif", "Microsoft Word file", "Microsoft Word file", "plugin-word"),
		new pluginDefinition(".xls", "/TemplatePackage/images/icon_excel.gif", "Microsoft Excel file", "Microsoft Excel file", "plugin-excel"),
		new pluginDefinition(".xlsx", "/TemplatePackage/images/icon_excel.gif", "Microsoft Excel file", "Microsoft Excel file", "plugin-excel"),
		new pluginDefinition(".csv", "/TemplatePackage/images/icon_excel.gif", "Microsoft Excel file", "Microsoft Excel file", "plugin-excel"),
		new pluginDefinition(".ppt", "/TemplatePackage/images/icon_ppt.gif", "Microsoft PowerPoint file", "Microsoft PowerPoint file", "plugin-ppt"),
		new pluginDefinition(".pptx", "/TemplatePackage/images/icon_ppt.gif", "Microsoft PowerPoint file", "Microsoft PowerPoint file", "plugin-pptx"),
		new pluginDefinition(".avi", "/TemplatePackage/images/icon_wmv.gif", "Audio/Video file", "Audio/Video file", "plugin-wmv"),
		new pluginDefinition(".mp3", "/TemplatePackage/images/icon_wmv.gif", "Audio/Video file", "Audio/Video file", "plugin-wmv"),
		new pluginDefinition(".mp4", "/TemplatePackage/images/icon_wmv.gif", "Audio/Video file", "Audio/Video file", "plugin-wmv"),
		new pluginDefinition(".mpg", "/TemplatePackage/images/icon_wmv.gif", "Audio/Video file", "Audio/Video file", "plugin-wmv"),
		new pluginDefinition(".mpeg", "/TemplatePackage/images/icon_wmv.gif", "Audio/Video file", "Audio/Video file", "plugin-wmv"),
		new pluginDefinition(".wmv", "/TemplatePackage/images/icon_wmv.gif", "Audio/Video file", "Audio/Video file", "plugin-wmv"),
		new pluginDefinition(".wav", "/TemplatePackage/images/icon_wmv.gif", "Audio/Video file", "Audio/Video file", "plugin-wmv"),
		new pluginDefinition(".wma", "/TemplatePackage/images/icon_wmv.gif", "Audio/Video file", "Audio/Video file", "plugin-wmv"),
		new pluginDefinition(".zip", "/TemplatePackage/images/icon_zip.gif", "Zip Archive file", "ZIP Archive file", "plugin-zip"),
		new pluginDefinition(".cab", "/TemplatePackage/images/icon_zip.gif", "Zip Archive file", "ZIP Archive file", "plugin-zip"),
		new pluginDefinition(".ram", "/TemplatePackage/images/icon_real.gif", "RealPlayer file", "RealPlayer file", "plugin-real"),
		new pluginDefinition(".rmm", "/TemplatePackage/images/icon_real.gif", "RealPlayer file", "RealPlayer file", "plugin-real"),
		new pluginDefinition(".ra", "/TemplatePackage/images/icon_real.gif", "RealPlayer file", "RealPlayer file", "plugin-real"),
		new pluginDefinition(".rax", "/TemplatePackage/images/icon_real.gif", "RealPlayer file", "RealPlayer file", "plugin-real"),
		new pluginDefinition(".rv", "/TemplatePackage/images/icon_real.gif", "RealPlayer file", "RealPlayer file", "plugin-real"),
		new pluginDefinition(".rvx", "/TemplatePackage/images/icon_real.gif", "RealPlayer file", "RealPlayer file", "plugin-real"),
		new pluginDefinition(".rm", "/TemplatePackage/images/icon_real.gif", "RealPlayer file", "RealPlayer file", "plugin-real"),
		new pluginDefinition(".rms", "/TemplatePackage/images/icon_real.gif", "RealPlayer file", "RealPlayer file", "plugin-real"),
		new pluginDefinition(".mov", "/TemplatePackage/images/icon_qt.gif", "Apple QuickTime file", "Apple QuickTime file", "plugin-qt"),
		new pluginDefinition(".m4v", "/TemplatePackage/images/icon_qt.gif", "Apple QuickTime file", "Apple QuickTime file", "plugin-qt"),
		new pluginDefinition(".qt", "/TemplatePackage/images/icon_qt.gif", "Apple QuickTime file", "Apple QuickTime file", "plugin-qt")
	);
	
	var pluginDefinitionsEsp = new Array(
		new pluginDefinition(".pdf", "/TemplatePackage/images/icon_pdf.gif", "Archivo PDF", "Archivo PDF", "plugin-pdf"),
		new pluginDefinition(".doc", "/TemplatePackage/images/icon_word.gif", "Archivo de Microsoft Word", "Archivo de Microsoft Word", "plugin-word"),
		new pluginDefinition(".docx", "/TemplatePackage/images/icon_word.gif", "Archivo de Microsoft Word", "Archivo de Microsoft Word", "plugin-word"),
		new pluginDefinition(".rtf", "/TemplatePackage/images/icon_word.gif", "Archivo de Microsoft Word", "Archivo de Microsoft Word", "plugin-word"),
		new pluginDefinition(".xls", "/TemplatePackage/images/icon_excel.gif", "Archivo de Microsoft Excel", "Archivo de Microsoft Excel", "plugin-excel"),
		new pluginDefinition(".xlsx", "/TemplatePackage/images/icon_excel.gif", "Archivo de Microsoft Excel", "Archivo de Microsoft Excel", "plugin-excel"),
		new pluginDefinition(".csv", "/TemplatePackage/images/icon_excel.gif", "Archivo de Microsoft Excel", "Archivo de Microsoft Excel", "plugin-excel"),
		new pluginDefinition(".ppt", "/TemplatePackage/images/icon_ppt.gif", "Archivo de Microsoft PowerPoint", "Archivo de Microsoft PowerPoint", "plugin-ppt"),
		new pluginDefinition(".pptx", "/TemplatePackage/images/icon_ppt.gif", "Archivo de Microsoft PowerPoint", "Archivo de Microsoft PowerPoint", "plugin-pptx"),
		new pluginDefinition(".avi", "/TemplatePackage/images/icon_wmv.gif", "Archivo de audio o video", "Archivo de audio o video", "plugin-wmv"),
		new pluginDefinition(".mp3", "/TemplatePackage/images/icon_wmv.gif", "Archivo de audio o video", "Archivo de audio o video", "plugin-wmv"),
		new pluginDefinition(".mp4", "/TemplatePackage/images/icon_wmv.gif", "Archivo de audio o video", "Archivo de audio o video", "plugin-wmv"),
		new pluginDefinition(".mpg", "/TemplatePackage/images/icon_wmv.gif", "Archivo de audio o video", "Archivo de audio o video", "plugin-wmv"),
		new pluginDefinition(".mpeg", "/TemplatePackage/images/icon_wmv.gif", "Archivo de audio o video", "Archivo de audio o video", "plugin-wmv"),
		new pluginDefinition(".wmv", "/TemplatePackage/images/icon_wmv.gif", "Archivo de audio o video", "Archivo de audio o video", "plugin-wmv"),
		new pluginDefinition(".wav", "/TemplatePackage/images/icon_wmv.gif", "Archivo de audio o video", "Archivo de audio o video", "plugin-wmv"),
		new pluginDefinition(".wma", "/TemplatePackage/images/icon_wmv.gif", "Archivo de audio o video", "Archivo de audio o video", "plugin-wmv"),
		new pluginDefinition(".zip", "/TemplatePackage/images/icon_zip.gif", "Archivo en formato zip", "Archivo en formato zip", "plugin-zip"),
		new pluginDefinition(".cab", "/TemplatePackage/images/icon_zip.gif", "Archivo en formato zip", "Archivo en formato zip", "plugin-zip"),
		new pluginDefinition(".ram", "/TemplatePackage/images/icon_real.gif", "Archivo de RealPlayer", "Archivo de RealPlayer", "plugin-real"),
		new pluginDefinition(".rmm", "/TemplatePackage/images/icon_real.gif", "Archivo de RealPlayer", "Archivo de RealPlayer", "plugin-real"),
		new pluginDefinition(".ra", "/TemplatePackage/images/icon_real.gif", "Archivo de RealPlayer", "Archivo de RealPlayer", "plugin-real"),
		new pluginDefinition(".rax", "/TemplatePackage/images/icon_real.gif", "Archivo de RealPlayer", "Archivo de RealPlayer", "plugin-real"),
		new pluginDefinition(".rv", "/TemplatePackage/images/icon_real.gif", "Archivo de RealPlayer", "Archivo de RealPlayer", "plugin-real"),
		new pluginDefinition(".rvx", "/TemplatePackage/images/icon_real.gif", "Archivo de RealPlayer", "Archivo de RealPlayer", "plugin-real"),
		new pluginDefinition(".rm", "/TemplatePackage/images/icon_real.gif", "Archivo de RealPlayer", "Archivo de RealPlayer", "plugin-real"),
		new pluginDefinition(".rms", "/TemplatePackage/images/icon_real.gif", "Archivo de RealPlayer", "Archivo de RealPlayer", "plugin-real"),
		new pluginDefinition(".mov", "/TemplatePackage/images/icon_qt.gif", "Archivo de Apple QuickTime", "Archivo de Apple QuickTime", "plugin-qt"),
		new pluginDefinition(".m4v", "/TemplatePackage/images/icon_qt.gif", "Archivo de Apple QuickTime", "Archivo de Apple QuickTime", "plugin-qt"),
		new pluginDefinition(".qt", "/TemplatePackage/images/icon_qt.gif", "Archivo de Apple QuickTime", "Archivo de Apple QuickTime", "plugin-qt")
	);

	// A helper method to add the non-HTML image to the link.
	var AddNonHtmlImage = function (anchor, definitionArray) {
		var href = anchor.attr("href");
		if (href && !anchor.hasClass('noDecoration')) {
			href = href.toLowerCase();
			var hash = href.indexOf("#");
			if (hash > -1) {
				href = href.substring(0, hash);
			}
			if (!(href.endsWith('.htm') || href.endsWith('.html') || href.endsWith('/'))) {
				// Get the text of the anchor.
				var anchorContent = anchor.html();
			
				// Find out where the location of the "[" is. If not found the image will be placed at the end.
				// Strip out any comments before looking for bracket -- just in case.
				anchorContent = anchorContent.replace(/<!(?:--[\s\S]*?--\s*)?>\s*/g,'');
				var bracketPos = anchorContent.lastIndexOf("[");
			
				// Now determine what image should be displayed based on the href attribute.
				for (var i = 0; i < definitionArray.length; i++) {
					if (href.endsWith(definitionArray[i].fileExtension.toLowerCase())) {
						if (anchor.parents(".pageOptions-inner").length == 0) {

								anchor.addClass("noDecoration");
								if (anchor.parents("div#multiPage").length == 0) {
									// Replace the inner HTML with the image included.
									if (bracketPos == -1) {
										anchor.html("<span class=\"tp-label\">" + anchorContent.trim() + "</span>" + 
										"&nbsp;" + "<span class=\"plugIns\"><img src=\"" + definitionArray[i].imageSrc + "\" alt=\"" + definitionArray[i].imageAlt + "\" title=\"" + definitionArray[i].imageTitle + "\" class=\"plugin\" border=\"0\" />" +
										"</span>");
									} else {
										anchor.html("<span class=\"tp-label\">" + anchorContent.substring(0, bracketPos).trim() + "</span>" + 
										"<span class=\"plugIns\">&nbsp;<img src=\"" + definitionArray[i].imageSrc + "\" alt=\"" + definitionArray[i].imageAlt + "\" title=\"" + definitionArray[i].imageTitle + "\" class=\"plugin\" border=\"0\" />" +
										"&nbsp;" + anchorContent.substring(bracketPos) +
										"</span>");
									}
								} else {
									// Get the title to use for the title attribute.
									var anchorTitle = anchor.attr("title");
									if (!anchorTitle || anchorTitle.length == 0) {
										anchorTitle = definitionArray[i].imageTitle;
									}
									anchor.html("<span class=\"plugIns\"><img src=\"" + definitionArray[i].imageSrc + "\" alt=\"" + anchorTitle + "\" title=\"" + anchorTitle + "\" class=\"plugin\" border=\"0\" />" + "</span>" + "&nbsp;" + "<span class=\"tp-label\">" + anchorContent.trim() + "</span>");
								}

								// Turn on the corresponding list item in the legend.
								$("#plugin-legend li." + definitionArray[i].legendClass).addClass("pluginOn");
							
							break;
						}
					}
				}
			}
		}
	};
	
	// A helper method to add the non-HTML image to the link.
	var AddNonHtmlImageToPageOptions = function (anchor, definitionArray) {
		var href = anchor.attr("href");
		if (href) {
			href = href.toLowerCase();
			var hash = href.indexOf("#");
			if (hash > -1) {
				href = href.substring(0, hash);
			}
			if (!(href.endsWith('.htm') || href.endsWith('.html') || href.endsWith('/'))) {
				// Now determine what image should be displayed based on the href attribute.
				for (var i = 0; i < definitionArray.length; i++) {
					if (href.endsWith(definitionArray[i].fileExtension.toLowerCase())) {
						// Get the text of the anchor.
						var anchorContent = anchor.html();
						// Set the class
						anchor.addClass("noDecoration");
						// Get the title to use for the title attribute.
						var anchorTitle = anchor.attr("title");
						if (!anchorTitle || anchorTitle.length == 0) {
							anchorTitle = definitionArray[i].imageTitle;
						}
						// Replace the inner HTML with the image included.
						if ($("body").hasClass("widePage") && anchor.parent().parent().hasClass("forWide")) {
							//$(this).parent("li").css("overflow", "hidden");
							anchor.html("<span class=\"plugIns\"><img src=\"" + definitionArray[i].imageSrc + "\" alt=\"" + anchorTitle + "\" title=\"" + anchorTitle + "\" class=\"plugin\" border=\"0\" />" + "</span>");
						} else if ($("body").hasClass("widePage") && $(this).parents("div").hasClass("pageOptions-inner2")) {
							anchor.html("<span class=\"plugIns\"><img src=\"" + definitionArray[i].imageSrc + "\" alt=\"" + anchorTitle + "\" title=\"" + anchorTitle + "\" class=\"plugin\" border=\"0\" />" + "</span>" + "<span class=\"tp-label\">" + anchorContent.trim() + "</span>");
					
						} else if ($(this).parents("div").hasClass("pageOptions-horizontal")) {
							anchor.html("<span class=\"plugIns\"><img src=\"" + definitionArray[i].imageSrc + "\" alt=\"" + anchorTitle + "\" title=\"" + anchorTitle + "\" class=\"plugin\" border=\"0\" />" + "</span>" + "<span class=\"tp-label\">" + anchorContent.trim() + "</span>");
					
						} else {
							anchor.html("<span class=\"plugIns\"><img src=\"" + definitionArray[i].imageSrc + "\" alt=\"" + anchorTitle + "\" title=\"" + anchorTitle + "\" class=\"plugin\" border=\"0\" />" + "</span>" + "&nbsp;" + "<span class=\"tp-label\">" + anchorContent.trim() + "</span>");
						}
					
						// Turn on the corresponding list item in the legend.
						$("#plugin-legend li." + definitionArray[i].legendClass).addClass("pluginOn");
					
						//need to set the remaining li s to regain their margin
					
						break;
					}
				}
			}
		}
	};

		 //
		// This function modifies content links to documents (e.g., Word, Powerpoint, etc.) so that they are 
		// rendered with the appropriate image.  It also displays the document legend on the page if any document 
		// links are on the page.
		//
	var setupDisplay = function() {

			/*var previousVersion = false;
			$("head meta").each(function() {
				if ($(this).attr("name") == "template.version" && 
					 ($(this).attr("content").indexOf("2.0.") > -1 ||
						$(this).attr("content").indexOf("2.1.") > -1)) {
					previousVersion = true;
				}
			});*/
			
			var pluginsEnabled = (!$("body").hasClass("noPlugins") ? true : false); // && $("#plugin-legend").length > 0);
			
			var externalsEnabled = (!$("body").hasClass("noLinking") ? true : false); // && $("#linkPolicy").length > 0);

			if (externalsEnabled || pluginsEnabled) {
				
				var definitionArray;
				var linkPolicyUrl = c.getExternalLink();
				if ($("body.esp").length > 0) {
					definitionArray = pluginDefinitionsEsp;
				} else {
					definitionArray = pluginDefinitions;
				}

				// Find and fix all anchors within #content that are external excluding anchors that appear
				// in the left nav, contact info module, email updates module, and page options.
				$('#content div#nav,#content div#contact-info,#content div.rounders.email,#content div.pageOptions,#content div.pageOptions-inner,#content div.pageOptions-inner2,#content div.pageOptions-horizontal,#content div.cdc-listWImage').find('a').addClass('no-link');
				// Flag the list with image module for special handling when adding external iamges.
				$('#content .cdc-listWImage a').addClass('cdclistWImageLink');

				// Find and fix all anchors within #content that are links to non-HTML pages excluding anchors that appear
				// in the left nav, contact info module, email updates module, and page options.
				$('#content div#nav,#content div#contact-info,#content div.rounders.email').find('a').addClass('noDecoration');

				// Fix the external anchors (which can exclude root-relative, javascript, mailto, and jump links).
				$('#content a:not([href^="mailto:"],[href^="javascript:"],[href^="#"])').each(function() {
					var t = $(this);

					if (!t.hasClass("noDecoration") && pluginsEnabled) {
						AddNonHtmlImage(t, definitionArray);
					}
				});
				
				// Now display the link policy if any of the anchors have the .external class assigned.
				if ($(".external").length > 0) {
					$("#linkPolicy").addClass("toggleOn");
				}
				
				// Now display the plugin legend if any of the anchors have the .plugin class assigned.
				if ($(".plugin").length > 0) {
					// Show the legend
					$("#plugin-legend").removeClass("pluginOff");
					$("#plugin-legend").addClass("pluginOn");
				}
			}
		}

	return {
		init: function(c) {
            log("document init");
            if (c && typeof(c) === 'object') {
                $.extend(config, c);
            }

            setupDisplay();
        },

		// A public method that can be used to add entries to the plugin definition list.
		addPluginDefinition: function(fileExtension, imageSrc, imageAlt, imageTitle, legendClass) {
			pluginDefinitions[pluginDefinitions.length] = new pluginDefinition(fileExtension, imageSrc, imageAlt, imageTitle, legendClass);
		},

		addPluginDefinitionEsp: function(fileExtension, imageSrc, imageAlt, imageTitle, legendClass) {
			pluginDefinitionsEsp[pluginDefinitionsEsp.length] = new pluginDefinition(fileExtension, imageSrc, imageAlt, imageTitle, legendClass);
		},

		// A public method that can be used to add entries to the global white list.
		addWhiteListEntry: function(pattern, isRegularExpression) {
			whiteList[whiteList.length] = new WhiteListEntry(pattern, isRegularExpression);
		}
	}; // end return

})(jQuery, window, _, CDC.Global, CDC.Constants);