// ==UserScript==
// @name		Booru Mass Uploader
// @description	Add ability to bulk upload images to your booru
// @version	1.1
// @author		Seedmanc
// @include	http://*.booru.org/index.php*
// @include 	http://gelbooru.com/index.php*
// @include	http://safebooru.org/index.php*
// @include	http://rule34.xxx/index.php* 
// @include	http://xbooru.com/index.php*
// @grant 		none 
// @noframes
// ==/UserScript==

if (window.top != window.self)  											
	throw 'no iframes';

if (~document.location.href.indexOf('s=mass_upload')) {	
	var xhr= new XMLHttpRequest();
	xhr.open('GET', 'http://crossorigin.me/http://seedmanc.github.io/Booru-mass-uploader/index.html', true);
	xhr.onreadystatechange= function() {
		if (this.readyState != 4) return;
		if (this.status != 200) return; 
		document.getElementsByTagName('body')[0].innerHTML = this.responseText;
		var s = document.getElementsByTagName('script');
		for (var i = 0; i < s.length ; i++) {
			var node=s[i], parent = node.parentElement, d = document.createElement('script');
			d.async = node.async;
			d.src = node.src;
			parent.insertBefore(d, node);
			parent.removeChild(node);
		}
	};
	xhr.send();
} else if (~document.location.href.indexOf('?page=')) {
  try {
	var notice = document.getElementById('notice').previous() ;
	if (notice) notice.parentNode.removeChild(notice);
  } catch(any){} 
	
	var navbar = document.getElementById('navbar') || document.getElementsByClassName('flat-list2')[0];			
	var li = document.createElement("li");
	var a  = document.createElement("a");
	a.style= "font-weight:bold;";
	a.appendChild(document.createTextNode('Mass Upload'));
	a.href = document.location.protocol+'//'+document.location.hostname+'/index.php?page=post&s=mass_upload';
	li.appendChild(a);
	navbar.appendChild(li);
} 	
