/**
 * constants.js
 * Immutable values
 * @version 1.0.0.0
 * @copyright 2013 Centers for Disease Control
 */

 /** Does global CDC namespace exists? */
CDC = CDC || {};

CDC.Constants = (function() {
	"use strict";
	var local = {
		title: "Centers for Disease Control and Prevention",
		description: "CDC Centers for Disease Control and Prevention - Your Online Source for Credible Health Information",
		author: "Centers for Disease Control and Prevention",
		externalIconTitle: "External Web Site Icon",
		externalLink: "http://www.cdc.gov/Other/disclaimer.html",
		charset: "utf-8",
		mobileCDCLogo: "images/m-cdc-logo.png",
		CDCLogo: "images/cdc-logo.png",
		languageLabel: "Languages",
		languageFlag: "",
		languageCode: "en-US",
		tapToView: "Tap Image for Full Screen",
		tapToClose: "Tap to Close"
	};
	
	var localES = {
		title: "Centros para el Control y la Prevenci&oacute;n de Enfermedades | P&aacute;gina principal",
		description: "Centros para el Control y la Prevenci&oacute;n de Enfermedades - Su fuente confiable de informaci&oacute;n sobre salud en Internet",
		author: "Centros para el Control y la Prevenci&oacute;n de Enfermedades",
		externalIconTitle: "Web externa icono del sitio",
		externalLink: "http://www.cdc.gov/spanish/CDC/descargos.html",
		charset: "utf-8",
		mobileCDCLogo: "images/m-cdc-logo.png",
		CDCLogo: "images/cdc-logo.png",
		languageLabel: "Idiomas",
		languageFlag: "",
		languageCode: "es",
		tapToView: "Toque la imagen de pantalla completa",
		tapToClose: "Pulse para Cerrar"
	};

	// public
	return {
		get: function(w){
			// if(this.getLanguage() === local.languageCode) {
			// 	return local[w];
			// }
			// else 
			if(this.getLanguage() === localES.languageCode) {
				return localES[w];
			}
			else {
				return local[w];
			}
		},
		getTitle: function() { return this.get("title"); },
		getDescription: function() { return this.get("description"); },
		getAuthor: function() { return this.get("author"); },
		getCharset: function() { return this.get("charset"); },
		getExternalIconTitle: function() { return this.get("externalIconTitle"); },
		getExternalLink: function() { return this.get("externalLink"); },
		getMobileCDCLogo: function() { return this.get("mobileCDCLogo"); },
		getTapToViewText: function() { return this.get("tapToView"); },
		getTapToCloseText: function() { return this.get("tapToClose"); },
		getCDCLogo: function() { return this.get("CDCLogo"); },
		getLanguageLabel: function() { return this.get("languageLabel"); },
		getLanguageCode: function() { return  this.get("languageCode"); },
		getLanguage: function() { return window.navigator.userLanguage || window.navigator.language; }
	};
})();