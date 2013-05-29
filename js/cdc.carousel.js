/** 
* @fileOverview CDC Carousel Library based on flexSlider (http://www.woothemes.com/flexslider/)
* @description This is a companion library for the jQuery plugin, flexSlider. It initializes all carousels
* added to any page based on the properties specified. If no custom properties are specified on the page
* it will run with a default set of properties that have been pre-configured.
* @requires jQuery CORE
* @version 1.0.0.0
*/

 /** Does global CDC namespace exists? */
CDC = CDC || {};

/** 
* @constructor
* @param {Object|Array} cars. An object containing preferences for a carousel, 
* or an array containing multiple carousel objects.
* @example
* var properties = {'id' : 'myCarousel', slideshow : true},
*     myCarousel = new CDC.Carousel(properties);
* myCarousel.init();
*/
CDC.Carousel = function (cars) {
	
	this.custom = false;

	this._carousels = {};

	this.settings = {

		// settings that affect both carousel and slider
		global : {
			namespace	: "cdc-flex-",
			animation	: "slide"
			//slideshow	: true
		},

		slider : {
			directionNav	: false,
			controlNav	: false,
			slideshow	: true
		},

		carousel : {
			slideshow	: false,
			animationLoop	: true,
			// hardcoding this value based on spec. If removed will not show.
			controlNavLabel : $('body.esp').length > 0 ? "P&aacute;gina: &nbsp; " : "Page: &nbsp; ",
			// 4 is default. this is the only time we hardcode a value due to design specifications.
			maxItems	: 4
		}

	};

	var self = this,
		arr  = (cars.constructor !== Array) ? new Array(cars) : cars;

	// We are reusing an object with global carousel settings.
	// here's where we extend the carousel and slider objects
	$.each(arr, function() {

		self._carousels[this.id] = this;

		if (!!this.slider) {
			$.extend(self.settings.slider, self.settings.global);
			var newSlider = $.extend({}, self.settings.slider, this.slider);
			this.slider = newSlider;
		}

		$.extend(self.settings.carousel, self.settings.global);
		var newCarousel = $.extend({}, self.settings.carousel, this);
		
		// we store a reference of the carousel so we can use it in the future
		self._carousels[this.id] = newCarousel;

	});

};

CDC.Carousel.prototype = {
	
	
	/**
	 * @public
	 * @function init
	 * @description Initialized one or many carousels.
	 */
	init : function() {

		var $cars = $('.cdcCarousel').not('.run'),
			self = this;

		$cars.each(function() {

			var $this       = $(this),
				id          = $this.attr('id');

			if (!self._carousels[id]) { return; }

			var $slider     = $this.prev('.cdcSlider'),
				classNames  = $this.attr('class'),
				regex       = /carouselSlides-([0-9])/i,
				numItems    = (classNames.match(regex)) ? Number(classNames.match(regex)[1]) : self._carousels[id].maxItems;
			var slidesWidth = Math.floor($this.innerWidth() / numItems);
			// Override if the inner width of the slider if present to determine carousel slide widths.
			if ($slider.length > 0) {
				slidesWidth = Math.floor(($slider.innerWidth() - 275) / numItems);
			}
			
			self._carousels[id].maxItems = numItems;
			self._carousels[id].itemWidth = slidesWidth;
			self._carousels[id].controlNav = !$this.hasClass('noPagination');
			
			if ($this.hasClass('pageIndicatorTopRight')) {
				self._carousels[id].controlNav = false;
				$this.before('<div class="pageIndicator"></div>');
				
				self._carousels[id].start = function(slider) {
					self.updatePageIndicator(slider);
					$this.parent().find('h3').css('margin-right', $this.parent().find('.pageIndicator').outerWidth() + 15);
				};
				self._carousels[id].after = function(slider) {self.updatePageIndicator(slider)};

			}

			if ($slider.length) {
				var sliderId = id + '-slider';
				
				// by default descriptions and titles are not supposed to show
				if (!$this.hasClass('showTitles')) { $this.addClass('noTitles'); }
				if (!$this.hasClass('showDescriptions')) { $this.addClass('noDescriptions'); }
				
				if (!$slider.hasClass('showDescriptions')) { $slider.addClass('noDescriptions'); }
				
				$slider.attr('id', sliderId);
				
				// slider settings go into the carousel settings for organizational purposes only.
				if (!self._carousels[id].slider) {
					self._carousels[id].slider = self.settings.slider;
				}
				
				// first time these settings get set is here. 
				// We need these so that a slider and a carousel can communicate between each other.
				self._carousels[id].asNavFor = '#' + sliderId;
				self._carousels[id].slider.sync = '#' + id;

				if ($slider.find('ul.slides').length == 0) {
					var ulClone = $this.find('ul.slides').clone();
					$slider.append(ulClone);
				}
				
				// Add anchors so that carousel is keyboard navigable.
				$this.find('ul.slides').children('li').each(function(i) {
					if ($(this).children('a').length == 0) {
						$(this).html($(this).wrapInner('<a class="cdc-flex-image" href="#" />').html());
					}
				});
				
				// Seriously?? You still sniffing browsers?? Shame on you!
				//if ($.browser.msie && Number($.browser.version) <= 7) {
					//$slider.after($('<div style="clear:both; height:0;" />'));
				//}
			}

			$this.flexslider(self._carousels[id]);
			$slider.flexslider(self._carousels[id].slider);

			$this.addClass("run");
		});

		$('body').addClass('cdc-carousel');
		
		//console.log(self._carousels);
	},

	/**
	 * @private
	 * @function updatePageIndicator
	 * @description Update the top right carousel indicator with the current page number.
	 * @param {Object} slider Slider object.
	 */
	updatePageIndicator : function (slider) {
		if ($('body.esp').length > 0) {
			$('.pageIndicator').html('P&aacute;gina ' + (slider.currentSlide + 1) + ' de ' + slider.pagingCount);
		} else {
			$('.pageIndicator').html('Page ' + (slider.currentSlide + 1) + ' of ' + slider.pagingCount);
		}
	}

};


// we auto run here for any carousels or sliders added to the page that didn't need custom properties
$(function () {

	function renderCarousels() {

		var _selfRunCarousel;

		var $cdcCarousel = $('.cdcCarousel').not('.run'),
			cars         = [];

		if ($cdcCarousel.length) {

			$cdcCarousel.each(function() {
				var $this     = $(this),
					id        = $this.attr('id'),
					newCarObj = {};
				
				newCarObj.id = id;
			
				if ($this.prev('.cdcSlider').length) {
					newCarObj.slider = true;
				}
			
				cars.push(newCarObj);
			});
			_selfRunCarousel = new CDC.Carousel(cars);
			_selfRunCarousel.init();
		}

	}

	function redoCarousels() {
		$('.cdcCarousel.run').each(function() {
			$(this).removeClass('run');
		});
		renderCarousels();
	}

	// Global variables to confirm window height and width
	var cdcLastWindowHeight = $(window).height();
	var cdcLastWindowWidth = $(window).width();

	$(window).resize(function() {
		//confirm window was actually resized
		if ($(window).height() != cdcLastWindowHeight || $(window).width() != cdcLastWindowWidth) {
			// Save the new window dimensions.
			cdcLastWindowHeight = $(window).height();
			cdcLastWindowWidth = $(window).width();
			// Call function to redo carousels.
			redoCarousels();
		}
	});

	if (CDC.Carousel.custom) { return; }

	renderCarousels();

});
