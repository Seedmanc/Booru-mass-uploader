// ==UserScript==
// @name		Booru Mass Uploader
// @description	Add ability to bulk upload images to your booru
// @namespace 	https://github.com/Seedmanc/Booru-mass-uploader
// @version     1.3.1
// @author		Seedmanc
// @include     http://*.booru.org/index.php*
// @include 	http://gelbooru.com/index.php*
// @include     http://safebooru.org/index.php*
// @include		https://moe.dev.myconan.net/*
// @include		http://behoimi.org/*
// @include		https://chan.sankakucomplex.com/*
// @include		http://atfbooru.ninja/*
// @include		http://danbooru.donmai.us/*

// you can add any boorus of your choice by following the pattern

// @grant 		none
// @run-at		document-end
// @noframes

// @require  	https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js
// ==/UserScript==

if (window.top != window.self) {
	throw 'no iframes';
}

var corses = ['www.whateverorigin.org/get?url=', 'crossorigin.me/'];

function onSuccess(response) {
	var scripts;

	document.getElementsByTagName('body')[0].innerHTML = response;
	scripts = document.getElementsByTagName('script');

	for (var i = 0; i < scripts.length; i++) {
		var node = scripts[i], parent = node.parentElement, d = document.createElement('script');

		d.async = node.async;
		d.src = node.src;
		parent.insertBefore(d, node);
		parent.removeChild(node);
	}
}

function tryCors(idx) {

	idx = idx || 0;

	if (!corses[idx]) {
		document.write('Ran out of CORS engines, try later');
		return;
	}

	(idx ? $.getJSON : $.get)(location.protocol + '//' + corses[idx] + 'http://seedmanc.github.io/Booru-mass-uploader/index.html' + (idx ? '' : '&callback=?'))
		.done(function (response) {
			onSuccess(response.contents || response);
		})
		.fail(function (response) {
			if (response.status == 200 && response.readyState == 4) {
				onSuccess(response.responseText);
			} else {
				console.log(response);
				tryCors(idx + 1);
			}
		});
}

if (~document.location.href.indexOf('s=mass_upload')) {
	document.write('<img src="https://seedmanc.github.io/Booru-mass-uploader/spinner.gif"/>');
	tryCors();

} else {
	var navbar = $('#navbar')[0] ||
		$('.flat-list2')[0] ||
		$('#main-menu > ul')[0] ||
		$('nav > menu')[0];
	var li = document.createElement("li");
	var a = document.createElement("a");
	var token = $('meta[name="csrf-token"]')[0];

	token = token && token.content;
	if (token) {
		localStorage.setItem('auth_token', token);
	}

	if ($('[src*="moe-legacy"]').length || $('html.action-post').length || $('[href*="/post/upload"]').length) {
		localStorage.setItem('current', 'moebooru');
	} else if ($('[href*="/uploads/new"]').length || ~document.documentElement.innerHTML.indexOf('Running Danbooru')) {
		localStorage.setItem('current', 'danbooru');
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