/**
 * dynamic.js
 * Use modernizr to the compiled application, and any scripts or css needed based off elements in the page
 * @version 1.0
 * @copyright 2013 Centers for Disease Control
 * @todo ensure we're not loading the same libraries multiple times.  For instance, jquery UI
 * @note app.js may appear to load twice, one of which is a cached version and normal to how yepnope works.
 */

var jqueryuiLoaded = false;

Modernizr.load([
	{
		test : Modernizr.mq('only all and (max-width: 767px)'),
		yep: {
			'jqm': '/TemplatePackage/3.0/js/libs/jquery.mobile-1.3.0.js'
		},
		callback: {
			'jqm': function() {
				log("jqm loaded");
			}
		}
	},
	{
		/** wide data tables */
		test : $("table.wide-datatable").length > 0,
		yep  : ['/TemplatePackage/3.0/css/table.css', '/TemplatePackage/3.0/js/table.js']
	},
	{
		/**  wide image */
		test : $("img.wide-image").length > 0,
		yep  : ['/TemplatePackage/3.0/js/libs/response.min.js', 'js/image.js']
	},
	{
		/**  youtube using fitvids */
		test: $(".youtube").length > 0,
		yep: {
			'isVideo': '/TemplatePackage/3.0/js/libs/jquery.fitvids.js'
		},
		callback: {
			'isVideo': function(){
					log("fitsvids loaded");
					$(".youtube").fitVids();
			}
		}
	},
	{
		/**  jquery UI tabs */
		test: $(".tabs").length > 0,
		yep:['http://code.jquery.com/ui/1.9.2/jquery-ui.js','http://code.jquery.com/ui/1.9.2/themes/base/jquery-ui.css'],
		callback: {
			'jquery-ui.js': function(){
				jqueryuiLoaded = true;
				$(".tabs").tabs().css("visibility", "visible");
			}
		}
	},
	{
		/**  jquery ui accordian */
		test: $(".accordion").length,
		yep:['http://code.jquery.com/ui/1.9.2/jquery-ui.js','http://code.jquery.com/ui/1.9.2/themes/base/jquery-ui.css'],
		callback: {
			'jquery-ui.js': function(){
				$(".accordion").accordion().css("visibility", "visible");
			}
		}
	},
	{
		/**  media element for any video/audio tag */
		test: $("audio").length > 0,
		yep:['/TemplatePackage/3.0/js/libs/mediaelement-and-player.min.js','/TemplatePackage/3.0/css/lib/mediaelementplayer.css'],
		callback: {
			'css/lib/mediaelementplayer.css': function() {
				$('video,audio').mediaelementplayer();
				log("mediaelement loaded");
			}
		}
	},
	{
		/**  flex slider */
		test: $(".flexslider").length > 0,
		yep:{'flexslider': '/TemplatePackage/3.0/js/libs/jquery.flexslider.js', 'featureslider': '/TemplatePackage/3.0/js/feature.js'},
		callback: {
			'flexslider': function(){
				log("flexslider init");
			},
			'featureslider': function() {
				if(sliderSettings.length > 0){
					$.each(sliderSettings, function(i, val){
						CDC.Feature.Slider(sliderSettings[i]);
					}); 

					log("Feature slider loaded");
				}
				else {
					log("Featrue slider failed: global slider settings not set");
				}
				
			}
		}
	},
	{
		/**  carousel slider */
		test: $(".slider").length > 0,
		yep:{ 'flexslider': '/TemplatePackage/3.0/js/libs/jquery.flexslider.js','carousel': '/TemplatePackage/3.0/js/cdc.carousel.js'},
		callback: {
			'flexslider': function(){
				log("flexslider init");
			},
			'carousel': function(){
				log("carousel init");
			}
		}
	}
]);