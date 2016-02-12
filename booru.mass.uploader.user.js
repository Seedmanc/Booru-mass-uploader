// ==UserScript==
// @name		Booru Mass Uploader
// @description	Add ability to bulk upload images to your booru
// @version     1.1
// @author		Seedmanc
// @include     http://*.booru.org/index.php*
// @include 	http://gelbooru.com/index.php*
// @include     http://safebooru.org/index.php*
// @include     http://rule34.xxx/index.php*
// @include     http://xbooru.com/index.php*
// @include     http://pbooru.com/index.php*
// @include     http://safeponi.com/index.php*
// @include		https://moe.dev.myconan.net/*
// you can add any boorus of your choice by following the pattern

// @grant 		none
// @run-at		document-end
// @noframes
// ==/UserScript==

if (window.top != window.self) {
	throw 'no iframes';
}

if (~document.location.href.indexOf('s=mass_upload')) {
	var xhr = new XMLHttpRequest();

	xhr.open('GET', location.protocol + '//crossorigin.me/http://seedmanc.github.io/Booru-mass-uploader/index.html?r=' + Math.random(), true);
	xhr.onreadystatechange = function () {
		var scripts;

		if (this.readyState != 4 || this.status != 200) {
			return;
		}

		document.getElementsByTagName('body')[0].innerHTML = this.responseText;
		scripts = document.getElementsByTagName('script');

		for (var i = 0; i < scripts.length; i++) {
			var node = scripts[i], parent = node.parentElement, d = document.createElement('script');

			d.async = node.async;
			d.src = node.src;
			parent.insertBefore(d, node);
			parent.removeChild(node);
		}
	};
	xhr.send();

} else {
	var navbar = document.getElementById('navbar') || document.getElementsByClassName('flat-list2')[0] || document.querySelector('#main-menu > ul');
	var li = document.createElement("li");
	var a = document.createElement("a");
	var token = document.querySelector('meta[name="csrf-token"]');

	try {
		var notice = document.getElementById('notice').previous();
		if (notice) {
			notice.parentNode.removeChild(notice);
		}
	} catch (any) {}

	token = token && token.content;
	if (token) {
		localStorage.setItem('auth_token', token);
	}

	if (!navbar) {
		throw "can't link the uploader";
	}

	a.style.fontWeight = 'bold';
	a.appendChild(document.createTextNode('Mass Upload'));
	a.href = document.location.protocol + '//' + document.location.hostname + '/index.php?page=post&s=mass_upload';
	li.appendChild(a);
	navbar.appendChild(li);
}