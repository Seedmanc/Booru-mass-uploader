// ==UserScript==
// @name		Booru Mass Uploader
// @description	 Add ability to bulk upload images to your booru
// @version	1.0
// @author		Seedmanc
// @include	http://*.booru.org/index.php?page=*&s=mass_upload

function loadAndExecute(url, callback){											
	var scriptNode = document.createElement ("script");	
	scriptNode.addEventListener("load", callback);
	scriptNode.onerror=function(){ 
		throw new Error("Can't load "+url);
	};
	scriptNode.src = url;
	document.head.appendChild(scriptNode);
};

document.addEventListener('DOMContentLoaded', function(){
	if (window.top != window.self)  											
		return;
	loadAndExecute("https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js", main);
}, false);

function main(){
	
}