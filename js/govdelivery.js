/**
 * govdelivery.js
 * Global variables used to enable/disable or set parameters used elsewhere in the application
 * @version 1.0
 * @copyright 2013 Centers for Disease Control
 * @todo Need to update to use the latest GovD URLs/APIs (also update local SSI).
 */

function subscribe() {
    window.location = "http://service.govdelivery.com/service/subscribe.html?code=" + document.govdelivery.folder.value + "&login=" + document.govdelivery.email.value + "&origin=" + window.location.href;
}

function quicksubscribe() {
    window.location = "http://service.govdelivery.com/service/multi_subscribe.html?code=" + document.govdelivery.folder.value + "&login=" + document.govdelivery.email.value + "&origin=" + window.location.href;
}

function profile() {
    window.location = "http:// service.govdelivery.com/service/user.html?code=" + document.govdelivery.folder.value + "&login=" + document.govdelivery.email.value + "&origin=" + window.location.href;
}