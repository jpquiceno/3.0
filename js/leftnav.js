// leftnav.js
//
CDC = CDC || {};
CDC.Nav = CDC.Nav || {};
CDC.Nav.Generator = CDC.Nav.Generator  || (function($, w, _, g, c) {
    "use strict";
    /*global log:false */
    var config = {
        match: false
    };

    var currentLocationWoHash;  //Current Location without hash values
    var currentLocationWHash;   //Current Location with hadh values

    //default document array must be in lower case
    var documentArray = new Array("index.htm", "index.html", "default.html", "default.htm", "index.asp", "index.aspx", "default.asp", "default.aspx");
    

    // A helper function to normalize the URLs.  It makes the URL root-relative.
    var normalizedUrl = function(url) {
        var result = url;
        result = result.replace("file://", "");
        result = result.replace("http://", "");
        result = result.replace("https://", "");
        if (location.port && location.port.length > 0 && location.port != "80" && location.port != "443") {
                result = result.replace(location.hostname + ":" + location.port, "");
        } else {
                result = result.replace(location.hostname, "");
        }
        return result.toLowerCase();
    };

    var setCurrentLocations = function(){

        var portPart = "";          //Port number

        if (location.port && location.port.length > 0 && location.port != "80" && location.port != "443") {
                portPart = ":" + location.port;
        }
        currentLocationWoHash = location.hostname + portPart + location.pathname;
        if (location.search) {
                currentLocationWoHash = location.hostname + portPart + location.pathname + location.search;
        }
        if (location.hash) {
            //Replace With:  currentLocationWHash = currentLocationWoHash + location.hash;

            if (location.search) {
                    currentLocationWHash = location.hostname + portPart + location.pathname + location.search + location.hash;
            } else {
            currentLocationWHash = location.hostname + portPart + location.pathname + location.hash;
            }
        }

        if (currentLocationWHash) { 
            currentLocationWHash = currentLocationWHash.replace(/\?(s_cid=\w*)\&/mg, '?');
            currentLocationWHash = currentLocationWHash.replace(/\?(s_cid=\w*)\#/mg, '#');
            currentLocationWHash = currentLocationWHash.replace(/\&(s_cid=\w*)\&/mg, '&');
            currentLocationWHash = currentLocationWHash.replace(/\&(s_cid=\w*)\#/mg, '#');
            currentLocationWHash = currentLocationWHash.replace(/\?(source=govdelivery)\&/mg, '&');
            currentLocationWHash = currentLocationWHash.replace(/\?(source=govdelivery)\#/mg, '#');
            currentLocationWHash = currentLocationWHash.replace(/\&(source=govdelivery)\&/mg, '&');
            currentLocationWHash = currentLocationWHash.replace(/\&(source=govdelivery)\#/mg, '#');
        }

        currentLocationWoHash = currentLocationWoHash.replace(/\?(s_cid=\w*)\&/mg, '?');
        currentLocationWoHash = currentLocationWoHash.replace(/\?(s_cid=\w*)$/mg, '');
        currentLocationWoHash = currentLocationWoHash.replace(/\&(s_cid=\w*)\&/mg, '&');
        currentLocationWoHash = currentLocationWoHash.replace(/\&(s_cid=\w*)$/mg, '');
        currentLocationWoHash = currentLocationWoHash.replace(/\?(source=govdelivery)\&/mg, '?');
        currentLocationWoHash = currentLocationWoHash.replace(/\?(source=govdelivery)$/mg, '');
        currentLocationWoHash = currentLocationWoHash.replace(/\&(source=govdelivery)\&/mg, '&');
        currentLocationWoHash = currentLocationWoHash.replace(/\&(source=govdelivery)$/mg, '');
   
        var directoryDefault = false;

        if (currentLocationWoHash.substr(currentLocationWoHash.length - 1, 1) == "/") {
            directoryDefault = true;
        }

        currentLocationWoHash = normalizedUrl(currentLocationWoHash);

        if (typeof currentLocationWHash != "undefined") { currentLocationWHash = normalizedUrl(currentLocationWHash); }
        

        currentLocationWoHash = normalizedUrl(currentLocationWoHash);
        if (!currentLocationWHash || currentLocationWHash.length == 0) {
            currentLocationWHash = currentLocationWoHash;
        }
    };

    var getFourthLevelModule = function(ulElement){
        var newModule = $('<div class="multipage light bullet double" />');
        var newInner = $('<div class="inner"></div>');

        newInner.append(ulElement);
        newModule.append(newInner);

        return newModule;
    };

    var setupDisplay = function() {
        var nav = $(g.selectors.leftNav);
        // * Hide the top level UL's

        if(nav.length) {

            $('nav ul li ul').hide();

            nav.find('li').each(function () {
                var t = $(this),
                    pi = $("<img>").attr("src", g.elements.plus),
                    pm = $("<img>").attr("src", g.elements.minus),
                    plus = $('<div class="plus">').append(pi),
                    minus = $('<div class="minus">').append(pm);

                // if we find an anchor that has the same href as the filename in the url
                if (normalizedUrl(t.children('a:first-child').attr('href')) === currentLocationWoHash) {
                    var parentLi = t.parent().parent();
                    var innerText = t.children('a:first-child').html();

                    config.match = true;

                    CDC.buildBreadCrumbBar(t);

                    t.addClass('selected');
                    parentLi.addClass('selected');

                    t.parents('li').find('> div.plus').remove();
                    t.parents('li').children('a:first-child').before(minus);
                    t.parents().show();

                    if(t.children('ul').length > 0 && t.parents('ul').length == 3 && config.showFourthLevel){
                        var fourthNav = t.children('ul').clone();
                        var newModule = getFourthLevelModule(fourthNav);

                        t.html(innerText);

                        $('#contentArea h1').after(newModule);
                        $('.multipage ul').show();

                    } else if (t.children('ul').length > 0) {

                        t.children('a:first-child').before(minus);
                        t.children("ul").show();
                    }
                    else {
                         t.html(innerText);
                    }
                   
                    
                    
                    
                }
                else {
                    if (t.children('ul').length > 0 && t.parents('ul').length < 3) {
                        t.children('a:first-child').before(plus);
                        t.children("ul").hide();
                    }
                }
            });
        
            // there wasn't a matching link in the address bar, just create      
            if(!config.match && config.parentUrl != "undefined" && config.parentUrl != "") {
                nav.find('li a').each(function () {
                    var t = $(this),
                    pi = $("<img>").attr("src", g.elements.plus),
                    pm = $("<img>").attr("src", g.elements.minus),
                    plus = $('<div class="plus">').append(pi),
                    minus = $('<div class="minus">').append(pm);

                    if (normalizedUrl(t.attr('href')) === normalizedUrl(config.parentUrl)) {
                        var p = t.parent('li');
                        p.addClass('selected');
                        p.parents().show();

                        var newNode = ('<li class="selected" />');

                        if (p.children('ul').length > 0) {
                            p.children('a:first-child').before(minus);
                            p.children("ul").show();
                            p.children("ul").append(newNode);
                        }
                        else {
                            var newList = ('<ul />');
                            newList.append(newNode);
                            p.append(newList);
                            p.children('a:first-child').before(minus);
                        }

                        CDC.buildBreadCrumbBar(t);
                    }
                });
            }
        }
        else {
             CDC.buildBreadCrumbBar();
        } 
    };
    
    var setupListeners = function() {
        $(g.selectors.leftNav).on("click", function(event){
            event.stopPropagation();
        });

        $(g.selectors.leftNav).find('div').on('click', function () {
            var t = $(this),
                p = t.parent('li'),
                i = t.find('img');

            //if(p.hasClass("dropdown")) {
            if(i.attr("src") === g.elements.plus) {
                p.children().show(g.navSpeed);
                t.removeClass().addClass("minus");
                i.attr("src", g.elements.minus);
            }
            else {
                p.children("ul").hide(g.navSpeed);
                t.removeClass().addClass("plus");
                i.attr("src", g.elements.plus)
            }
        });
    };

    // public
    return {
        init: function(c) {
            log("leftnav init");
            if (c && typeof(c) === 'object') {
                $.extend(config, c);
            }

            setCurrentLocations();
            setupDisplay();
            setupListeners();
        },


    };
})(jQuery, window, _, CDC.Global, CDC.Common);

CDC.LeftNav = function(ulTagId, parentUrl, showSiblings, showChildren, showFourthLevel, pageTitleTagId) {
    CDC.Nav.Generator.init({parentUrl: parentUrl, showFourthLevel: showFourthLevel, pageTitleId: pageTitleTagId});
}


//**************************************************//
// DEPRECATED: CDC.LeftNav.render - Public render method.  
// Function signature kept to avoid breaking existing left nav calls
//**************************************************//  
CDC.LeftNav.prototype = {  
    render: function () {
        return false;
    }
}