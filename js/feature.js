/**
 * feature.js
 * Custom module for Feature Slider objects
 * @version 1.0
 * @copyright 2013 Centers for Disease Control
 */

 /** Does global CDC namespace exists? */
CDC = CDC || {};

CDC.Feature = new function() {
		return {
			Slider: function(settings) {
				if (settings == null || typeof(settings) == "undefined") {
					settings = {
						animation: "fade",
						controlNav: true,
						pauseOnHover: true,
						keyboardNav: true,
						randomize: false,
						slideshowSpeed: 7000,
						xmlPath: ""
					};
				}
				$.ajax({
					type: "GET",
					url: settings.xmlPath,
					dataType: "xml",
					success: function(xml) {
						var slides = $(".flexsliderbox .slides");
						slides.empty();
						$(xml).find("item").each(function(index) {
							var imgPath = $(this).children("enclosure").attr("url");
							var url = $(this).children("link").text();
							var alt = $(this).children("description").text();
							var spanTitle = $(this).children("title").text();
							var panelName = $(this).children("label").text();
							var video = $(this).children("video").text();
							var caption = "";
							if ($("body.esp").length > 0) {
								if (alt) {
									caption = '<div class="slidelft" tabindex="0"><h3>' + spanTitle + "</h3><p>" + alt + '</p><p class="morex"><a href="' + url + '">Conozca más »</a></p></div>';
								} else {
									caption = "";
								}
							} else {
								if (alt) {
									caption = '<div class="slidelft" tabindex="0"><h3>' + spanTitle + "</h3><p>" + alt + '</p><p class="morex"><a href="' + url + '">Learn More »</a></p></div>';
								} else {
									caption = "";
								}
							}
							slides.append('<li class="slide"><div class="slidert" ><a href="' + url + '"><img src="' + imgPath + '" alt="' + alt + '" /></a></div>' + caption + '</li>');
						});
						$(settings.identifier).flexslider(settings);
						var ratio = 2.891304347;
						// removed for RWD...
						// $(window).resize(function() {
						// 	var sliderImgHt = ($(".flexslider").width() / ratio);
						// 	$(".flexslider").height(sliderImgHt);
						// });
					}
				});
			}
		};
	};
