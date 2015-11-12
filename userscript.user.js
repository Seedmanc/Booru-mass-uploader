// ==UserScript==
// @name		Booru Mass Uploader
// @description	 Add ability to bulk upload images to your booru
// @version	1.0
// @author		Seedmanc
// @include	http://*.booru.org/index.php?page=*&s=mass_upload

function loadAndExecute(url, callback){											
	var scriptNode = document.createElement ("script");	
	scriptNode.addEventListener("load", callback);
	scriptNode.onerror = function(){ 
		throw new Error("Can't load "+url);
	};
	scriptNode.src = url;
	document.head.appendChild(scriptNode);
};

(function(){
	if (window.top != window.self)  											
		return;
	//loadAndExecute("https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js", main);
	
	var xhr= new XMLHttpRequest();
	xhr.open('GET', 'http://crossorigin.me/http://seedmanc.github.io/Booru-mass-uploader/index.html', true);
	xhr.onreadystatechange= function() {
		if (this.readyState != 4) return;
		if (this.status != 200) return; // or whatever error handling you want
		document.getElementsByTagName('body')[0].innerHTML = this.responseText;
	};
	xhr.send();
	
})();

function main(){
	
}