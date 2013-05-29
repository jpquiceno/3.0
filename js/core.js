/**
 * core.js
 * This file should house code snippets that are core to the application and unlikely to change, i.e libs, frameworks, etc.
 * @version 1.0.0.0
 * @copyright 2013 Centers for Disease Control
 */


/** 
* New CDC namespace for responsive templates to avoid any possible clash with existing template scripts
* @namespace CDC
*/
window.CDC = {};

/** 
* Application Logging
* @function log
*/
window.log=function(){log.history=log.history||[];log.history.push(arguments);if(this.console){console.log(Array.prototype.slice.call(arguments))}};


