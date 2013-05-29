* often used vendor libraries are compressed into libs.js

* modernizr is loaded seperately in the head of the document

* jquery plugins and mediaelement can be loaded by yepnope(part of modernizr) or require.js

* response might wind up being a default plugin
 
* zepto might wind up being a jquery replacement

* consolelog.min.js: ensure we have access to console calls in all (?) browsers, ONLY LOADED IN DEV




Libs
----
uglifyjs jquery.js bootstrap.js underscore.js backbone.js jquery.mediahelpers.js > libs.js
||
uglifyjs zepto.js bootstrap.js underscore.js backbone.js > libs.js

App
---
uglifyjs constants.js common.js global.js CDC.js > app.js

Other
-----
require, cookie, flexslider, mediaelement, etc...



* require.js loads like this:
<script data-main="scripts/main.js" src="scripts/lib/require.js"></script>