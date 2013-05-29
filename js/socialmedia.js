/**
 * socialmedia.js
 * Display and Event handling for Social Media Share Bar, Modules, and Feeds
 * @version 1.0.0.0
 * @copyright 2013 Centers for Disease Control
 */

 /** Does global CDC namespace exists? */
CDC = CDC || {};

CDC.SocialMedia = CDC.SocialMedia || (function($, w, _, g, c) {
	"use strict";
	/*global log:false, console:false */

	var config = {};

	/*private variables and methods (not accessible directly through the  mySingleton namespace): */
	
	var cdcSocialMediaWindowObjectReference;
	var twitterCountReady = false;
	var facebookCountReady = false;
	var linkedInCountReady = false;
	var fbAndTwitterJsonTimeout = 10;
	var fbAndTwitterJsonTimeoutId;
	var fbAndTwitterMaxAttempts = 40;
	var fbAndTwitterAttempts = 0;
	var fbCount = 0;
	var twitterCount = 0;
	var linkedInCount = '';
	var templateVersionLessThan260 = false;
	var WriteSocialMediaTimeout;
	var WriteSocialMediaAttempts = 0;
	var handled = false;

	//******************************************************************************************//
	//* A function that iterates through the collection of LI items with a class of "share" and
	//* sets the event handlers for the onmouseover and onmouseout events.
	//******************************************************************************************//
	var shareHover = function () {
		$("div.bookmarkShare").each(function () {
			var shareNavLi = $(this);
			if (shareNavLi.length > 0) {
				var shareClass = new CDC.SocialMedia.BookmarkShare(shareNavLi);
				shareNavLi.on("click", $.proxy(shareClass.showPopup, shareClass, this ));

				//shareNavLi.on("mouseout", $.proxy(shareClass.hidePopup, shareClass, this ));
				$(document).click(function(){
					shareNavLi.removeClass("sfhover");
				});
			}
		});
	};

	//******************************************************************************************//
	//* A function that iterates through the collection of LI items with a class of "share" and
	//* sets the event handlers for the onfocus and onblur events.  These handlers are needed
	//* to support keyboard-driven navigation of the bookmark/share functionality.
	//******************************************************************************************//
	var mcAccessible = function () {
		var bookmarkShare = $("div.bookmarkShare");

		$(bookmarkShare).bind("focus", function () {
			$(this).addClass("sfhover");
		});
		
		$(bookmarkShare).bind("blur", function () {
			$(this).removeClass("sfhover");
		});
		
		$(bookmarkShare).find("a").each(function () {
			var mcEl = $(this);
			mcEl.bind("focus", function () {
				var elem = $(this);
				elem.addClass("sffocus");
				var parentElem = elem.parent();
				while (parentElem.length > 0 && !parentElem.hasClass("bookmarkShare")) {
					parentElem = parentElem.parent();
				}
				parentElem.addClass("sfhover");
			});
			mcEl.bind("blur", function () {
				var elem = $(this);
				elem.removeClass("sffocus");
				var parentElem = elem.parent();
				while (parentElem.length > 0 && !parentElem.hasClass("bookmarkShare")) {
					parentElem = parentElem.parent();
				}
				if (parentElem.hasClass("sfhover")) {
					parentElem.removeClass("sfhover");
				}
			});
		});
	};

	var getShareUrl = function(sitename, urlOverride) {
		var title = encodeURIComponent(document.title);
		var url = encodeURIComponent(location.href);
		var hash = url.indexOf("#");
		if (hash > -1) {
			url = url.substring(0, hash);
		}
		var shareUrl;
		if (sitename.toLowerCase() == "facebook" && urlOverride != null && typeof urlOverride != 'undefined') {
			shareUrl = urlOverride;
		} else if (sitename.toLowerCase() == "twitter" && urlOverride != null && typeof urlOverride != 'undefined') {
			shareUrl = urlOverride;
		} else if (sitename.toLowerCase() == "facebook") {
			shareUrl = "https://www.facebook.com/sharer.php?u=" + url + "&t=" + title;
		} else if (sitename.toLowerCase() == "twitter") {
			if (title.length > 119 - CDC.SocialMedia.twitterAccount.length) {
				title = title.substring(0, 116 - CDC.SocialMedia.twitterAccount.length) + "...";
			}
			shareUrl = "https://twitter.com/intent/tweet?text=" + title + " - @" + CDC.SocialMedia.twitterAccount + "&url=" + url;
		} else if (sitename.toLowerCase() == "delicious") {
			shareUrl = "http://delicious.com/save?url=" + url + "&title=" + title;
		} else if (sitename.toLowerCase() == "digg") {
			shareUrl = "http://digg.com/submit?url=" + url + "&title=" + title + "&media=news";
		} else if (sitename.toLowerCase() == "google") {
			shareUrl = "http://www.google.com/bookmarks/mark?op=add&bkmk=" + url + "&title=" + title;
		} else if (sitename.toLowerCase() == "technorati") {
			shareUrl = "http://technorati.com/faves?sub=favthis&add=" + url;
		} else if (sitename.toLowerCase() == "linkedin") {
			shareUrl = "https://www.linkedin.com/uas/connect/user-signin?session_redirect=" + 
				encodeURIComponent("http://www.linkedin.com/wcs/share?isFramed=false&lang=en_US&url=") + url +
				encodeURIComponent("&original_referer=") + url;
		}
		return shareUrl;
	};

	var GetTwitterProfileLinkText= function() {
		var linkText = CDC.SocialMedia.twitterProfileLinkText;
		if (linkText == '') {
			if ($('body.esp').length > 0) {
				linkText = 'CDC en Twitter';
			} else {
				linkText = 'Follow CDC on Twitter';
			}
		}
		return linkText;
	};
	
	var GetFacebookProfileLinkText = function() {
		var linkText = CDC.SocialMedia.facebookProfileLinkText;
		if (linkText == '') {
			if ($('body.esp').length > 0) {
				linkText = 'CDC en Facebook';
			} else {
				linkText = 'Like CDC on Facebook';
			}
		}
		return linkText;
	};

	var GetLinkedInProfileLinkText = function() {
		var linkText = CDC.SocialMedia.linkedInProfileLinkText;
		if (linkText == '') {
			if ($('body.esp').length > 0) {
				linkText = 'CDC en LinkedIn';
			} else {
				linkText = 'Follow CDC on LinkedIn';
			}
		}
		return linkText;
	};

	var GetTwitterProfileUrl = function() {
		var link = CDC.SocialMedia.twitterProfileUrl;
		if (link == '') {
			if ($('body.esp').length > 0) {
				link = 'https://twitter.com/CDCespanol';
			} else {
				link = 'https://twitter.com/cdcgov';
			}
		}
		return link;
	};
	
	var GetFacebookProfileUrl = function() {
		var link = CDC.SocialMedia.facebookProfileUrl;
		if (link == '') {
			if ($('body.esp').length > 0) {
				link = 'https://www.facebook.com/CDCespanol';
			} else {
				link = 'https://www.facebook.com/CDC';
			}
		}
		return link;
	};

	var GetLinkedInProfileUrl = function() {
		var link = CDC.SocialMedia.linkedInProfileUrl;
		if (link == '') {
			if ($('body.esp').length > 0) {
				link = 'http://www.linkedin.com/company/centers-for-disease-control-and-prevention';
			} else {
				link = 'http://www.linkedin.com/company/centers-for-disease-control-and-prevention';
			}
		}
		return link;
	};

	var GetSocialMediaShareBlockHtml = function() {
		var socialMediaHtml = '';
		socialMediaHtml += '	<div id="socialMedia">';
		socialMediaHtml += '		<div id="facebookBlock">';
		socialMediaHtml += '			<a href="#" class="skip facebookRecommend external" onclick="SocialMedia.openSocialMediaWindow(\'facebook\', null, this); return false;">&nbsp;</a>';
		socialMediaHtml += '			<div id="facebookCountWrapper" class="countWrapper"><div class="counterNub"><s></s><i></i></div><div id="fbCount">0</div></div>';
		socialMediaHtml += '		</div>';
		socialMediaHtml += '		<div id="twitterBlock">';
		socialMediaHtml += '			<a href="#" class="skip twitterTweet external" onclick="SocialMedia.openSocialMediaWindow(\'twitter\', null, this); return false;">&nbsp;</a>';
		socialMediaHtml += '			<div id="twitterCountWrapper" class="countWrapper"><div class="counterNub"><s></s><i></i></div><div id="twitterCount">0</div></div>';
		socialMediaHtml += '		</div>';
		socialMediaHtml += '		<div id="bookmarkShareBlock">';
		socialMediaHtml += '			<div class="bookmarkShare" id="bookmarkShare">';
		socialMediaHtml += '				<div class="shareButtonEn">Share</div><div class="shareButtonEs">Compartir</div>';
		socialMediaHtml += '				<ul>';
		socialMediaHtml += '					<li class="email"><a href="http://www.cdc.gov/email.do"><i class="sprite-24-govd-icon"></i>Email</a></li>';
		socialMediaHtml += '					<li class="digg"><a href="#" class="skip" onclick="SocialMedia.openSocialMediaWindow(\'digg\', null, this); $(this).blur(); return false;"><i class="sprite-32-diggtext"></i>Digg</a></li>';
		socialMediaHtml += '					<li class="addthis eng"><a class="skip"><i class="sprite-24-syndicate"></i>Add this to your site</a></li>';
		socialMediaHtml += '				</ul>';
		socialMediaHtml += '			</div>';
		socialMediaHtml += '		</div>';
		socialMediaHtml += '	</div>';
		return socialMediaHtml;
	};

	var GetSocialMediaShareBlockHtmlOneColumn = function(htmlString) {	
		var html = $('<div></div>').html(htmlString);
		var facebook = html.find('#facebookBlock'),
			twitter = html.find('#twitterBlock'),
			bookmarkShareList = html.find('#bookmarkShareBlock ul');

		var facebookListItem = $('<li class="facebook" />'),
			twitterListItem = $('<li class="twitter" />');

		facebook.appendTo(facebookListItem);
		twitter.appendTo(twitterListItem);

		bookmarkShareList.prepend(twitterListItem).prepend(facebookListItem);

		html.remove('#socialMedia > #facebookBlock').remove('#socialMedia > #twitterBlock');

		return html.html();
	};
	
	var addCommas = function(nStr)  {
		nStr += '';
		x = nStr.split('.');
		x1 = x[0];
		x2 = x.length > 1 ? '.' + x[1] : '';
		var rgx = /(\d+)(\d{3})/;
		while (rgx.test(x1)) {
			x1 = x1.replace(rgx, '$1' + ',' + '$2');
		}
		return x1 + x2;
	};
	
	var Fix252Spacing = function() {
		if (templateVersionLessThan260) {
			if ($('body').hasClass('secondTier') && $('body').hasClass('optionalTwo')) {
				$('#breadBox').css('margin-bottom', '10px');
			} else if ($('body').hasClass('secondTier') && $('body').hasClass('topicHome')) {
				$('#breadBox').css('margin-bottom', '10px');
			} else if ($('body#applicationsPage').length > 0 && $('body').hasClass('widePage')) {
			} else if ($('body').hasClass('widePage')) {
				$('.main-inner').css('margin-top', '10px');
			} else {
				$('#socialMediaContainer').css('margin-bottom', '10px');
				$('#breadBox').css('margin-bottom', '10px');
			}
		}
	};

	var parseSocialMediaCount =  function(count){
		var countDisplay;
		if (count < 10000) {
			countDisplay = addCommas(count);
		} else if (count >= 10000) {
			countDisplay = (addCommas(Math.round(count / 1000))) + 'k';
		}

		return countDisplay;
	};
	
	var DisplaySocialMediaCounts = function() {
	
		if ((facebookCountReady && twitterCountReady) || fbAndTwitterAttempts >= fbAndTwitterMaxAttempts) {
			clearTimeout(fbAndTwitterJsonTimeoutId);
	
			if (fbCount > 0) {
				$('#fbCount').html(parseSocialmediaCount(fbCount));
				$('#facebookCountWrapper').css('display', 'inline');
			}
	
			if (twitterCount > 0) {
				$('#twitterCount').html(parseSocialmediaCount(twitterCount));
				$('#twitterCountWrapper').css('display', 'inline');
			}
			$('#socialMedia').show();
	
			//Fix252Spacing();
	
		} else {
			fbAndTwitterAttempts += 1;
			fbAndTwitterJsonTimeoutId = setTimeout(DisplaySocialMediaCounts, fbAndTwitterJsonTimeout);
		}

		if(linkedInCountReady) {
			if(linkedInCount > 0) {
				$('#linkedInCount').html(parseSocialMediaCount(linkedInCount));
				$('#linkedInCountWrapper').css('display', 'inline');
			}
		}
	};
	
	var getFacebookCount = function() {
		var url = location.href;
		var hashLocation = url.indexOf("#");
		if (hashLocation > 0) {
			url = url.substring(0, hashLocation);
		}
		$.getJSON('https://graph.facebook.com/?ids=' + encodeURI(url) + '&callback=?', function (data) {
			if (data[url] && data[url].shares != undefined && data[url].shares > 0) {
				fbCount = data[url].shares;
			}
			facebookCountReady = true;
		});
	};
	
	var getTwitterCount = function() {
		var url = location.href;
		var hashLocation = url.indexOf("#");
		if (hashLocation > 0) {
			url = url.substring(0, hashLocation);
		}
		try {
			$.getJSON('https://cdn.api.twitter.com/1/urls/count.json?url=' + encodeURI(url) + '&callback=?', function (data) {
				if (data.count != undefined && data.count > 0) {
					twitterCount = data.count;
				}
				twitterCountReady = true;
			})
			.error(function() { twitterCount = 0; twitterCountReady = true; });
		} catch(e) {
			twitterCount = 0;
			twitterCountReady = true;
		}
	};

	var getLinkedInCount = function() {
		var url = location.href;
		var hashLocation = url.indexOf("#");
		if (hashLocation > 0) {
			url = url.substring(0, hashLocation);
		}
		try {
			$.getJSON('http://www.linkedin.com/countserv/count/share?url=' + encodeURI(url) + '&format=json', function (data) {
				if (data.count != undefined && data.count > 0) {
					linkedInCount = data.fCnt;
				}
				linkedInCountReady = true;
			})
			.error(function() { linkedInCount = 0; linkedInCountReady = true; });
		} catch(e) {
			linkedInCount = 0;
			linkedInCountReady = true;
		}
	};

	/* public variables and methods (can access private vars and methods ) */
	return {

		//Social media public defaults (Overideable)
		socialMediaSharingEnabled: true,

		emailUpdatesEnabled: true,
		emailUpdateLink: "http://www.cdc.gov/Other/emailupdates/",

		twitterProfileLinkEnabled: true,
		twitterProfileLinkText: 'Twitter',
		twitterProfileUrl: "http://www.twitter.com/CDCgov",
		twitterAccount: 'CDCgov',

		facebookProfileLinkEnabled: true,
		facebookProfileLinkText: 'Facebook',
		facebookProfileUrl: 'http://www.facebook.com/CDC',

		linkedInButtonEnabled: true,
		linkedInImage: '',
		linkedInProfileLinkEnabled: true,
		linkedInProfileUrl: 'http://www.linkedin.com/company/centers-for-disease-control-and-prevention',
		linkedInProfileLinkText: "LinkedIn",

		rssLinkEnabled: true,
		rssSubscriptionUrl: "http://www.cdc.gov/ncbddd/socialmedia/rss-list.html",
		rssSubscriptionLinkText: "Subscribe",

		pinterestButtonEnabled: true,
		pinterestProfileLinkEnabled: true,
		pinterestImage: $('<img border="0" src="//assets.pinterest.com/images/PinExt.png" title="Pin It" />'),
		pinnedUrl: 'http://pinterest.com/pin/create/button/?url=' + encodeURI(document.location),
		pinnedImageDescription: '',
		pinnedImageUrl: '',

		init: function(){
			var self = this;
			self.WriteSocialMediaWhenReady();

			$(w).resize(_.debounce(function(e) {
					self.writeSocialMedia();
				}, 200));
		},
		//Write the social media and share block on each content page
		writeSocialMedia: function () {
			var socMedShareDiv = $('#socialMediaShareContainer');
			var bookmarkShare = null;
			var ww = $(w).width(),
				html = $("html");
			
			if (this.socialMediaSharingEnabled) {
				
				 var socialMediaHtml = (html.hasClass("one") || html.hasClass("two"))  ? GetSocialMediaShareBlockHtmlOneColumn(GetSocialMediaShareBlockHtml()) : GetSocialMediaShareBlockHtml();
				
				$(socMedShareDiv).html(socialMediaHtml);
				
				bookmarkShare = $('#bookmarkShare');

				shareHover();
				
				
				getFacebookCount();
				getTwitterCount();
				getLinkedInCount();

				fbAndTwitterJsonTimeoutId = setTimeout(DisplaySocialMediaCounts, fbAndTwitterJsonTimeout);

			} else {		
				if ($(socMedShareDiv).length > 0) {
					$(socMedShareDiv).remove();
				} else {
					templateVersionLessThan260 = true;
					Fix252Spacing();
				}
			}

			if(this.pinterestButtonEnabled) {
				var pinterestListItem = $('<li class="pinterest"/>');
				var pinterestAnchor = $('<a />');
				this.pinterestImage.appendTo(pinterestAnchor);

				if (this.pinnedImageUrl && this.pinnedImageUrl.length > 0) {
					this.pinnedUrl += '&media=' + encodeURI(this.pinnedImageUrl);
				}

				if (this.pinnedImageDescription && this.pinnedImageDescription.length > 0) {
					this.pinnedUrl += '&description=' + encodeURI(this.pinnedImageDescription);
				}
				pinterestAnchor.attr('href', this.pinnedUrl)
					.attr('count-layout', 'horizontal')
					.attr('onclick','SocialMedia.openSocialMediaWindow(\'pinterest\', \'' + this.pinnedUrl + '\', this); return false;')
				pinterestAnchor.addClass('pin-it-button');
				pinterestAnchor.find('img').after('Pinterest');
				pinterestAnchor.appendTo(pinterestListItem);
				bookmarkShare.find('li.email').before(pinterestListItem);
			}

			//<a href="#" class="skip facebookRecommend external" onclick="SocialMedia.openSocialMediaWindow(\'facebook\', null, this); return false;">&nbsp;</a>';
		//socialMediaHtml += '			<div id="facebookCountWrapper" class="countWrapper"><div class="counterNub"><s></s><i></i></div><div id="fbCount">0</div></div>';

			if(this.linkedInButtonEnabled){
				bookmarkShare.find('li.pinterest').after('<li class="linkedin"><a href="#" class="no-link skip linkedInShare external" onclick="SocialMedia.openSocialMediaWindow(\'linkedin\', null, this); return false;">&nbsp;</a><div id="linkedInCountWrapper" class="countWrapper"><div class="counterNub"><s></s><i></i></div><div id="linkedInCount">0</div></div></li>');
			}
			
			mcAccessible();
		},
		//Write the social media profile like/follow buttons
		writeSocialMediaProfileLinks: function () {
			var self = this;
			var socMedLinksList = $('ul#SocialMediaLinksContainer');

			if(!this.facebookProfileLinkEnabled && !this.twitterProfileLinkEnabled && !this.linkedInButtonEnabled && !rssEnabled && !emailUpdatesEnabled){
				if ($(socMedLinksList).length > 0) {
					$(socMedLinksList).remove();
				} 
			} else {

				//Append Email Updates by default
				$(socMedLinksList).append('<li class="email-updates"><a href="http://www.cdc.gov/Other/emailupdates/"><i class="sprite-24-govd"></i>Email Updates</a></li>');

				if (this.facebookProfileLinkEnabled) {
					var newFacebookListItem = $('<li class="facebook" />');
					var newFacebookItem = $('<a />')
					.attr('href', GetFacebookProfileUrl())
					.attr('target', '_blank');
					

					newFacebookItem.html('<i class="sprite-facebook"></i><span class="text">'+GetFacebookProfileLinkText()+'</span>');
					
					$(newFacebookListItem).append(newFacebookItem);
					$(socMedLinksList).append(newFacebookListItem);
				}

				//Append Twitter profile link if enabled
				if (this.twitterProfileLinkEnabled) {
					var newTwitterListItem = $('<li class="twitter" />');
					var newTwitterItem = $('<a />')
					.attr('href', GetTwitterProfileUrl())
					.attr('target', '_blank');
					
					newTwitterItem.html('<i class="sprite-twitter"></i><span class="text">'+GetTwitterProfileLinkText()+'</span>');

					$(newTwitterListItem).append(newTwitterItem);
					$(socMedLinksList).append(newTwitterListItem);
				}

				//Append Linked In profile link if enabled
				if (this.linkedInProfileLinkEnabled) {
					var newFacebookListItem = $('<li class="linkedIn"/>');
					var newFacebookItem = $('<a />')
					.attr('href', GetLinkedInProfileUrl())
					.attr('target', '_blank');

					newFacebookItem.html('<i class="sprite-linkedin"></i><span class="text">'+GetLinkedInProfileLinkText()+'</span>');
					
					$(newFacebookListItem).append(newFacebookItem);
					$(socMedLinksList).append(newFacebookListItem);
				}

				//Append RSS Link by default
				$(socMedLinksList).append('<li class="rss"><a href="'+ this.rssSubscriptionUrl +'"><i class="sprite-rss"></i>'+ this.rssSubscriptionLinkText +'</a></li>');
			}
		},
		//Handle social media and sharing popup windows
		openSocialMediaWindow: function (sitename, urlOverride, e) {
			$('body').css('cursor', 'wait');
			var url = location.href;
			var hash = url.indexOf("#");
			if (hash > -1) {
				url = url.substring(0, hash);
			}
			var title = document.title;
			if (sitename.toLowerCase() == "favorites") {
				if (window.sidebar) { // firefox
					window.sidebar.addPanel(title, url, "");
				} else if (document.all) { // IE
					external.AddFavorite(url, title);
				} else if (window.opera && window.print) { // opera
					var elem = document.createElement('a');
					elem.setAttribute('href', url);
					elem.setAttribute('title', title);
					elem.setAttribute('rel', 'sidebar');
					elem.click();
				} else {
					alert('Your web browser does not support adding a bookmark with Javascript.  Please manually add one via your browser\'s bookmark menu.');
				}
			} else {
				var windowWidth = 780;
				var bookmarkURL = getShareUrl(sitename, urlOverride);
				if (sitename.toLowerCase() == "twitter" && typeof urlOverride != 'undefined') {
					windowWidth = 900;
				} else if (sitename.toLowerCase() == "facebook") {
					var watchClose = setInterval(function () {
						try {
							if (cdcSocialMediaWindowObjectReference.closed) {
								clearTimeout(watchClose);
								getFacebookCount();
							}
						} catch (e) { }
					}, 200);
				} else if (sitename.toLowerCase() == "twitter") {
					var watchClose = setInterval(function () {
						try {
							if (cdcSocialMediaWindowObjectReference.closed) {
								clearTimeout(watchClose);
								getTwitterCount();
							}
						} catch (e) { }
					}, 200);
				}
				// Display popup window with selected site URL.
				if (sitename.toLowerCase() == "__linkedin") {
					IN.UI.Share().params({
						url: urlOverride
					}).place();
				//	cdcSocialMediaWindowObjectReference = window.open(bookmarkURL,
				//		"_blank", "height=200,width=600,status=yes,toolbar=no,menubar=no,location=no,scrollbars=yes,resizable=yes");
				} else {
					cdcSocialMediaWindowObjectReference = window.open(bookmarkURL,
						"_blank", "height=500,width=" + windowWidth + ",status=yes,toolbar=no,menubar=no,location=no,scrollbars=yes,resizable=yes");
				}
			}

			// Figure out which button was clicked for metrics reporting purposes.
			var buttonType = sitename;
			var anchorClicked = $(e);

			if (anchorClicked.parents('ul#services li').hasClass('facebook')) {
				buttonType = 'facebook-right';
			} else if (anchorClicked.parents('ul#services li').hasClass('twitter')) {
				buttonType = 'twitter-right';
			} else if (anchorClicked.parents('div.pageOptions-horizontal li').hasClass('facebook')) {
				buttonType = 'facebook-bottom';
			} else if (anchorClicked.parents('div.pageOptions-horizontal li').hasClass('twitter')) {
				buttonType = 'twitter-bottom';
			}
			// Record the metrics hit.
			this.recordMetrics(buttonType);

			// Remove the CSS class indicating focus on the bookmark/share item
			$('div#bookmarkShare').removeClass('sfhover');

			// Restore the cursor.
			$('body').css('cursor', 'auto');

			// If the popup did not work then return true so that the anchor href can still work (e.g., for iPad apps).
			if (cdcSocialMediaWindowObjectReference == null || typeof(cdcSocialMediaWindowObjectReference)=='undefined') {
				return true;
			} else {
				return false;
			}
		},
		recordMetrics : function(buttonName) {
			// Write out a metrics image "beacon" to record the event.
			var url = location.href;
			var hash = url.indexOf("#");
			if (hash > 0) {
				url = url.substring(0, hash);
			}
			$('#metrics').append($('<img height="1" width="1" border="0" alt="Web Analytics" class="analytics" />')
				.attr('src', 'http://tools.cdc.gov/metrics.aspx?reportsuite=cdcsynd&url=' + escape(url) + 
					'&c5=' + 
					($('body.esp').length > 0 ? "spa" : "eng") + 
					'&channel=' + s.channel + 
					'&c8=Social%20Media%20Buttons' + 
					'&c34=' + buttonName + 
					'&contenttitle=Social%20Media%20Button%20Page' + 
					'&c26=' + escape(s.pageName)));
		},
		WriteSocialMediaWhenReady: function() {
			if (WriteSocialMediaAttempts < 30) {
				if ($('.titlebar').length > 0 && !handled) { //Condition has to be removed
					clearTimeout(WriteSocialMediaTimeout);
					handled = true;
					this.writeSocialMedia();
					this.writeSocialMediaProfileLinks();
					//***************
					// Re-write the URLs to Facebook/Twitter/Share buttons for failover in case popup windows are disabled.
					var facebookBlock = $('div#facebookBlock');
					var twitterBlock = $('div#twitterBlock');
					var bookmarkBlock = $('div#bookmarkShareBlock');

					$(facebookBlock).find('a.facebookRecommend')
						.attr('href', getShareUrl('facebook'))
						.attr('target', '_blank');
					$(twitterBlock).find('a.twitterTweet')
						.attr('href', getShareUrl('twitter'))
						.attr('target', '_blank');
					$(bookmarkBlock).find('li.delicious a')
						.attr('href', getShareUrl('delicious'))
						.attr('target', '_blank');
					$(bookmarkBlock).find('li.digg a')
						.attr('href', getShareUrl('digg'))
						.attr('target', '_blank');
					$(bookmarkBlock).find('li.google a')
						.attr('href', getShareUrl('google'))
						.attr('target', '_blank');
					$(bookmarkBlock).find('li.linkedin a')
						.attr('href', getShareUrl('linkedin'))
						.attr('target', '_blank');
					//***************
				} else {
					WriteSocialMediaAttempts += 1;
					WriteSocialMediaTimeout = setTimeout('WriteSocialMediaWhenReady()', 100);
				}
			} else {
				clearTimeout(WriteSocialMediaTimeout);
			}
		}
	}
})(jQuery, window, _, CDC.Global, CDC.Constants);

//******************************************************************************************//
//* The javascript class that handles showing and hiding the bookmark/share "window" by
//* applying and removing the "sfhover" CSS class to the LI element.
//******************************************************************************************//

CDC.SocialMedia.BookmarkShare = function () {};
CDC.SocialMedia.BookmarkShare.prototype = {
	timeout: null,
	addBookmarkHover: function(id) {
			var elem = $("#" + id);
			if (elem.length > 0) {
				elem.addClass("sfhover");
			}		
 		},	
	removeBookmarkHover: function(id) {
		var elem = $("#" + id);
		if (elem.length > 0) {
			elem.removeClass("sfhover");
		}
	},
	showPopup: function (el) {
		var self = this;
		clearTimeout(el.timeout);
		if (el.className.indexOf("sfhover") < 0) {
			el.timeout = setTimeout(function(){ self.addBookmarkHover(el.id);}, 200);
		}
	},
	hidePopup: function (el) {
		var self = this;
		if (el.className.indexOf("sfhover") < 0) {
			clearTimeout(el.timeout);
		} else {
			el.timeout = setTimeout(function(){ self.removeBookmarkHover(el.id);}, 7000);
		}
	}
};

/*
* @fileOverview A jQuery-based class to support the display of real-time Facebook and Twitter feeds.
* @description This is a library utilizing jQuery JSONP AJAX calls to request JSON serialized Atom feeds
* that are requested directly from Facebook and Twitter via an application that "proxies" the feed.
* 
* @requires jQuery CORE
*						Server-side feed generator that supports JSONP
* @version 1.0.0.0
*/

CDC.SocialMedia.Feeds = CDC.SocialMedia.Feeds || (function () {
	var config = {
		FEED_URL_PREFIX: "http://www2c.cdc.gov/podcasts/feed.asp",
		FEED_ID_PARAM : "feedid",
		SOCIAL_MEDIA_FEEDS_DIV_ID : "socialMediaFeeds",
		TWITTER_DIV_ID : "tweet",
		FACEBOOK_DIV_ID : "facebook",
		LOADER_GRAPHIC: "div.socl-loader-graphic",
		FEED_ITEM_BLOCK: "div.socl-comment-text",
		FEED_ITEM_POSTS: this.FEED_ITEM_BLOCK + " p",
		FAILOVER_ANCHOR: this.FEED_ITEM_BLOCK + " a.failover"
	};
	return {
	feedDefinition : function (feedId, url, title, numberOfItems, enabled) {
		    this.feedId = feedId;
		    this.url = url;
		    this.title = title;
		    this.numberOfItems = numberOfItems;
		    this.enabled = enabled;
		},
        Twitter: function (feedDefinitionArray, moduleId, twitterDivId) {
		    this.feedDefinitionArray = feedDefinitionArray;
		    this.moduleId = (typeof moduleId == "undefined") ? config.SOCIAL_MEDIA_FEEDS_DIV_ID : moduleId;
		    this.twitterDivId = (typeof twitterDivId == "undefined") ? config.TWITTER_DIV_ID : twitterDivId;
		    AjaxMethod = function (feedDef, feedIndex, firstFeed, lastFeed, moduleId, twitterDivId) {
		        this.feedDef = feedDef;
		        this.feedIndex = feedIndex;
		        this.firstFeed = firstFeed;
		        this.lastFeed = lastFeed;
		        this.moduleId = moduleId;
		        this.twitterDivId = twitterDivId;
		        this.tagId = this.moduleId + " " + this.twitterDivId + " ";
		    };
		    AjaxMethod.prototype = {
		        render: function () {
		            if (this.feedDef.enabled && $.support.ajax && !(navigator.platform == "BlackBerry" && navigator.appVersion.substring(0, 6) == "5.0.0.")) {
		                if (this.firstFeed) {
		                    $(this.tagId + config.LOADER_GRAPHIC).css("display", "block");
		                }
		                $.getJSON(config.FEED_URL_PREFIX + "?" + config.FEED_ID_PARAM + "=" + this.feedDef.feedId + "&format=json&callback=?", (function (fd, tagId, ff, lf) {
		                    var ti = tagId;
		                    return function (data) {
		                        try {
		                            var qs = (function (a) {
		                                if (a == "") {
		                                    return {};
		                                }
		                                var b = {};
		                                for (var i = 0; i < a.length; ++i) {
		                                    var p = a[i].split("=");
		                                    if (p.length != 2) {
		                                        continue;
		                                    }
		                                    b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
		                                }
		                                return b;
		                            })(this.url.replace(config.FEED_URL_PREFIX + "?", "").split("&"));
		                            var newId = "item-tweet-" + qs["feedid"];
		                            var newItem = $("#" + newId);
		                            var i = 0;
		                            var numberFound = 0;
		                            while (numberFound < fd.numberOfItems && i < data.entries.length) {
		                                if (data.entries[i].description != "") {
		                                    if (numberFound < fd.numberOfItems - 1) {
		                                        newItem.html(newItem.html() + '<div class="feed-item">' + $('<div style="display: none;"/>').html(data.entries[i].description).text().replace(/\<\/?em\>/g, "") + "</div>");
		                                    } else {
		                                        newItem.html(newItem.html() + '<div class="feed-item lastChild">' + $('<div style="display: none;"/>').html(data.entries[i].description).text().replace(/\<\/?em\>/g, "") + "</div>");
		                                    }
		                                    numberFound++;
		                                }
		                                i++;
		                            }
		                            var block = $("#item-twitter-profile-" + qs["feedid"]);
		                            block.append(newItem);
		                            $("#" + newId).fadeIn(400, function () {});
		                            if (lf) {
		                                $(ti + config.LOADER_GRAPHIC).css("display", "none");
		                                $(ti + config.FAILOVER_ANCHOR).css("display", "none");
		                            }
		                        } catch (err) {
		                            alert(err);
		                            if (lf) {
		                                $(ti + config.LOADER_GRAPHIC).css("display", "none");
		                                $(ti + config.FAILOVER_ANCHOR).css("display", "block");
		                            }
		                        }
		                    };
		                })(this.feedDef, this.tagId, this.firstFeed, this.lastFeed)).error(function () {
		                    if (this.lastFeed) {
		                        $(this.tagId + config.LOADER_GRAPHIC).css("display", "none");
		                        $(this.tagId + config.FAILOVER_ANCHOR).css("display", "block");
		                    }
		                });
		            } else {
		                if (this.feedDef.enabled && navigator.platform == "BlackBerry" && navigator.appVersion.substring(0, 6) == "5.0.0.") {
		                    $(this.tagId + config.LOADER_GRAPHIC).css("display", "none");
		                    $(this.tagId + config.FAILOVER_ANCHOR).css("display", "block");
		                } else {
		                    if (this.lastFeed) {
		                        $(this.tagId + config.LOADER_GRAPHIC).css("display", "none");
		                        $(this.tagId + config.FEED_ITEM_POSTS).css("display", "block");
		                    }
		                }
		            }
		        }
		    };
		    return {
		        render: function () {
		            var firstFeed = true;
		            var lastFeed = true;
		            var moduleId;
		            var twitterDivId;
		            if (typeof this.moduleId == "undefined") {
		                moduleId = "#" + config.SOCIAL_MEDIA_FEEDS_DIV_ID;
		            } else {
		                if (this.moduleId.substring(0, 1) != "#") {
		                    moduleId = "#" + this.moduleId;
		                }
		            }
		            if (typeof this.twitterDivId == "undefined") {
		                twitterDivId = "#" + config.TWITTER_DIV_ID;
		            } else {
		                if (this.twitterDivId.substring(0, 1) != "#") {
		                    twitterDivId = "#" + this.twitterDivId;
		                }
		            }
		            var tagId = moduleId + " " + twitterDivId + " ";
		            for (var i = 0; i < feedDefinitionArray.length; i++) {
		                var placeholder = $('<div id="item-twitter-profile-' + feedDefinitionArray[i].feedId + '" />');
		                $(tagId + config.FEED_ITEM_BLOCK).append(placeholder);
		                var newId = "item-tweet-" + feedDefinitionArray[i].feedId;
		                var block = $(tagId + config.FEED_ITEM_BLOCK);
		                var newItem = $('<p id="' + newId + '" style="display: none;" />');
		                var cdcGovHeader = $('<a class="socl-user noLinking" href="' + feedDefinitionArray[i].url + '" target="_blank">' + feedDefinitionArray[i].title + "</a>");
		                placeholder.append(newItem);
		                placeholder.append(cdcGovHeader);
		            }
		            for (var i = 0; i < feedDefinitionArray.length; i++) {
		                firstFeed = (i == 0);
		                lastFeed = (i == feedDefinitionArray.length - 1);
		                var theFeed = new AjaxMethod(feedDefinitionArray[i], i, firstFeed, lastFeed, moduleId, twitterDivId);
		                theFeed.render();
		            }
		        }
		    };
		},
		Facebook: function (feedDefinitionArray, moduleId, facebookDivId) {
			this.feedDefinitionArray = feedDefinitionArray;
			this.moduleId = (typeof moduleId == "undefined") ? config.SOCIAL_MEDIA_FEEDS_DIV_ID : moduleId;
			this.facebookDivId = (typeof facebookDivId == "undefined") ? config.FACEBOOK_DIV_ID : facebookDivId;
			AjaxMethod = function (feedDef, feedIndex, firstFeed, lastFeed, moduleId, facebookDivId) {
				this.feedDef = feedDef;
				this.feedIndex = feedIndex;
				this.firstFeed = firstFeed;
				this.lastFeed = lastFeed;
				this.moduleId = moduleId;
				this.facebookDivId = facebookDivId;
				this.tagId = this.moduleId + " " + this.facebookDivId + " ";
			};
			AjaxMethod.prototype = {
				render: function () {
			    if (this.feedDef.enabled && $.support.ajax && !(navigator.platform == "BlackBerry" && navigator.appVersion.substring(0, 6) == "5.0.0.")) {
			        if (this.firstFeed) {
			            $(this.tagId + config.LOADER_GRAPHIC).css("display", "block");
			        }
			        $.getJSON(config.FEED_URL_PREFIX + "?" + config.FEED_ID_PARAM + "=" + this.feedDef.feedId + "&format=json&callback=?", (function (fd, ti, ff, lf) {
			            return function (data) {
			                try {
			                    var qs = (function (a) {
			                        if (a == "") {
			                            return {};
			                        }
			                        var b = {};
			                        for (var i = 0; i < a.length; ++i) {
			                            var p = a[i].split("=");
			                            if (p.length != 2) {
			                                continue;
			                            }
			                            b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
			                        }
			                        return b;
			                    })(this.url.replace(config.FEED_URL_PREFIX + "?", "").split("&"));
			                    var newId = "item-fb-" + qs["feedid"];
			                    var newItem = $("#" + newId);
			                    var i = 0;
			                    var numberFound = 0;
			                    while (numberFound < fd.numberOfItems && i < data.entries.length) {
			                        if (data.entries[i].title != "") {
			                            var rawEntry = data.entries[i].description;
			                            rawEntry = rawEntry.replace(/&lt;br\/&gt;/gi, "");
			                            rawEntry = rawEntry.replace(/onclick=&quot;.*&quot;\);&quot;/gi, "");
			                            rawEntry = rawEntry.replace(/onmouseover=&quot;.*&quot;\);&quot;/gi, "");
			                            var endAnchorTag = "&lt;/a&gt;";
			                            var endAnchorPos = rawEntry.lastIndexOf(endAnchorTag);
			                            if (endAnchorPos > -1) {
			                                rawEntry = rawEntry.substring(0, endAnchorPos + endAnchorTag.length);
			                            }
			                            if (numberFound < fd.numberOfItems - 1) {
			                                newItem.html(newItem.html() + '<div class="feed-item">' + $('<div style="display: none;"/>').html(rawEntry).text() + "</div>");
			                            } else {
			                                newItem.html(newItem.html() + '<div class="feed-item lastChild">' + $('<div style="display: none;"/>').html(rawEntry).text() + "</div>");
			                            }
			                            newItem.find("a").each(function () {
			                                var target = $(this).prop("href");
			                                if (target.indexOf("http://" + location.host + "/profile.php?") == 0) {
			                                    $(this).prop("href", target.replace(location.host, "www.facebook.com"));
			                                } else {
			                                    if (target.indexOf("http://" + location.host + "/l.php?") == 0) {
			                                        $(this).prop("href", target.replace(location.host, "www.facebook.com"));
			                                    } else {
			                                        if (target.indexOf("/") == 0) {
			                                            $(this).prop("href", "http://www.facebook.com" + target);
			                                        }
			                                    }
			                                }
			                            });
			                            newItem.find('a[title^="To tag someone"]').each(function () {
			                                $(this).prop("title", $(this).text());
			                            });
			                            newItem.find("a").filter(function () {
			                                return /(jpe?g|png|gif)$/i.test($(this).attr("href"));
			                            }).remove();
			                            numberFound++;
			                        }
			                        i++;
			                    }
			                    var block = $("#item-fb-profile-" + qs["feedid"]);
			                    block.append(newItem);
			                    $("#" + newId + " img").attr("alt", "Image from Facebook").css("display", "none");
			                    $("#" + newId).fadeIn(400, function () {});
			                    if (lf) {
			                        $(ti + config.LOADER_GRAPHIC).css("display", "none");
			                        $(ti + config.FAILOVER_ANCHOR).css("display", "none");
			                    }
			                } catch (err) {
			                    if (lf) {
			                        $(ti + config.LOADER_GRAPHIC).css("display", "none");
			                        $(ti + config.FAILOVER_ANCHOR).css("display", "block");
			                    }
			                }
			            };
			        })(this.feedDef, this.tagId, this.firstFeed, this.lastFeed)).error(function () {
			            if (this.lastFeed) {
			                $(this.tagId + config.LOADER_GRAPHIC).css("display", "none");
			                $(this.tagId + config.FAILOVER_ANCHOR).css("display", "block");
			            }
			        });
			    } else {
			        if (this.feedDef.enabled && navigator.platform == "BlackBerry" && navigator.appVersion.substring(0, 6) == "5.0.0.") {
			            $(this.tagId + config.LOADER_GRAPHIC).css("display", "none");
			            $(this.tagId + config.FAILOVER_ANCHOR).css("display", "block");
			            $(this.tagId + "h4 a").css("padding-left", "28px");
			        } else {
			            $(this.tagId + config.LOADER_GRAPHIC).css("display", "none");
			        }
			    }
				}
			};
			return {
				render: function () {
			    var firstFeed = true;
			    var lastFeed = true;
			    var moduleId;
			    var facebookDivId;
			    if (typeof this.moduleId == "undefined") {
			        moduleId = "#" + config.SOCIAL_MEDIA_FEEDS_DIV_ID;
			    } else {
			        if (this.moduleId.substring(0, 1) != "#") {
			            moduleId = "#" + this.moduleId;
			        }
			    }
			    if (typeof this.facebookDivId == "undefined") {
			        facebookDivId = "#" + config.FACEBOOK_DIV_ID;
			    } else {
			        if (this.facebookDivId.substring(0, 1) != "#") {
			            facebookDivId = "#" + this.facebookDivId;
			        }
			    }
			    var tagId = moduleId + " " + facebookDivId + " ";
			    for (var i = 0; i < feedDefinitionArray.length; i++) {
			        var placeholder = $('<div id="item-fb-profile-' + feedDefinitionArray[i].feedId + '" />');
			        $(tagId + config.FEED_ITEM_BLOCK).append(placeholder);
			        var newId = "item-fb-" + feedDefinitionArray[i].feedId;
			        var block = $(tagId + config.FEED_ITEM_BLOCK);
			        var newItem = $('<p id="' + newId + '" style="display: none;" />');
			        var cdcGovHeader = $('<a class="socl-user noLinking" href="' + feedDefinitionArray[i].url + '" target="_blank">' + feedDefinitionArray[i].title + "</a>");
			        placeholder.append(newItem);
			        placeholder.append(cdcGovHeader);
			    }
			    for (var i = 0; i < feedDefinitionArray.length; i++) {
			        firstFeed = (i == 0);
			        lastFeed = (i == feedDefinitionArray.length - 1);
			        var theFeed = new AjaxMethod(feedDefinitionArray[i], i, firstFeed, lastFeed, moduleId, facebookDivId);
			        theFeed.render();
			    }
				}
			};
    	}
    };
})();


$(function(){
	CDC.SocialMedia.init();
});

