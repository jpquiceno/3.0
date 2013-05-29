/*! Picturefill - Responsive Images that work today. (and mimic the proposed Picture element with divs). Author: Scott Jehl, Filament Group, 2012 | License: MIT/GPLv2 */

(function( w ){
	
	// Enable strict mode
	"use strict";

	// the the real height/width of an image
	// img should be a selector, not a path or name
	// w.getImageDimensions = function(img) {
	// 	var i = $(img)[0],
	// 		w,
	// 		h;
	// 	$("<img/>")
	// 	.attr("src", $(img).attr("src"))
	// 	.load(function() {
	// 		w = this.width;
	// 		h = this.height;
	// 	});
	// 	return [].push.apply(w,h);
	// };

	w.picturefill = function() {
		var ps = w.document.getElementsByTagName( "div" );
		
		// Loop the pictures
		for( var i = 0, il = ps.length; i < il; i++ ){
			if( ps[ i ].getAttribute( "data-picture" ) !== null ){

				var sources = ps[ i ].getElementsByTagName( "div" ),
					matches = [];
			
				// See if which sources match
				for( var j = 0, jl = sources.length; j < jl; j++ ){
					var media = sources[ j ].getAttribute( "data-media" );
					// if there's no media specified, OR w.matchMedia is supported 
					if( !media || ( w.matchMedia && w.matchMedia( media ).matches ) ){
						matches.push( sources[ j ] );
					}
				}

			// Find any existing img element in the picture element
			var picImg = ps[ i ].getElementsByTagName( "img" )[ 0 ],
				picUrl = "",
				picCaption = "",
				canTapToView = $('html').hasClass("one");

			if( matches.length ){
				if( !picImg ){
					picImg = w.document.createElement( "img" );
					picImg.alt = ps[ i ].getAttribute( "data-alt" );

					// CDC, add a class if one exists
					picImg.className = ps[ i ].getAttribute( "class" );

					// CDC, wrap img with anchor if it has one
					if( ps[ i ].getAttribute( "data-href" ) ){
						picUrl = w.document.createElement( "a" );
						picUrl.setAttribute( "href" , ps[ i ].getAttribute( "data-href" ) );

						// modal view, needs a caption
						if( canTapToView && ps[ i ].getAttribute( "data-toggle" ) ) {
							picUrl.setAttribute( "data-toggle" , ps[ i ].getAttribute( "data-toggle" ) );

							picCaption = w.document.createElement( "div" );
							picCaption.className = "caption_largeimage visible-one";
							picCaption.innerHTML = constants.getTapToViewText();
						}

						picUrl.appendChild( picImg );
						ps[ i ].appendChild( picUrl );
						if( picCaption ) { 
							ps[ i ].insertBefore( picCaption, ps[ i ].firstChild );
						}
					}
					else{
						ps[ i ].appendChild( picImg );
					}
				}
				
				picImg.src =  matches.pop().getAttribute( "data-src" );
			}
			else if( picImg ){
				ps[ i ].removeChild( picImg );
			}
		}
		}
	};
	
	// Run on resize and domready (w.load as a fallback)
	if( w.addEventListener ){
		w.addEventListener( "resize", w.picturefill, false );
		w.addEventListener( "DOMContentLoaded", function(){
			w.picturefill();
			// Run once only
			w.removeEventListener( "load", w.picturefill, false );
		}, false );
		w.addEventListener( "load", w.picturefill, false );
	}
	else if( w.attachEvent ){
		w.attachEvent( "onload", w.picturefill );
	}
	
}( this ));