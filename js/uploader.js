if (!XMLHttpRequest.prototype.sendAsBinary) {
	XMLHttpRequest.prototype.sendAsBinary = function (sData) {
		var nBytes  = sData.length,
			ui8Data = new Uint8Array(nBytes);
		for (var nIdx = 0; nIdx < nBytes; nIdx++) {
			ui8Data[nIdx] = sData.charCodeAt(nIdx) & 0xff;
		}
		/* send as ArrayBufferView...: */
		this.send(ui8Data);
		/* ...or as ArrayBuffer (legacy)...: this.send(ui8Data.buffer); */
	};
}
var settingsToSave = ['tags'];
var checkboxesToSave = ['forceRating', 'ratingAsDefault', 'setSafe', 'setQuest', 'setExplicit', 'forceTags', 'addTags', 'title', 'asFiles', 'asFolder'];
var myTags = ((GetCookie('tags') || '+') + (GetCookie('my_tags') || '+') + (GetCookie('recent_tags') || '+')).replace(/%2520/gi, ' ').replace(/%20|\++/gi, ' ').trim().split(/\s+/);
var upOptions = {
	running: false
};
var current = localStorage.getItem(document.location.host) || localStorage.getItem('current') || 'gelbooru';
var engine = $("engine");

engine.onchange = function() {
	current = this.value;
	$('current').textContent = current;
	if (current != 'gelbooru') {
		$('title').disable();
	} else {
		$('title').enable();
	}
};
engine.selectedIndex = current == 'gelbooru' ? 0 : (current == 'moebooru' ? 1 : 2);
engine.onchange();

if (myTags.length) {
	var tagsArea = '';

	$show('mytags');
	$each(mkUniq(myTags), function (tag) {
		tagsArea += '&nbsp;<a style="text-decoration:none;" href="#' + tag + '" id="t_' + tag + '"' +
			"onclick=\"javascript:toggleTags('" + tag + "','tags','t_" + tag + "');" + 'return false;">' + tag + '</a> ';
	});
	$('my-tags').innerHTML = tagsArea;
}
document.title = 'Mass uploader';

$$('#asFiles,#asFolder').each(function (el) {
	var files = $('files');

	el.onchange = function () {
		if (this.id == 'asFolder' && this.checked) {
			files.writeAttribute({directory: '', mozdirectory: '', webkitdirectory: ''});
		} else {
			files.writeAttribute({directory: false, mozdirectory: false, webkitdirectory: false});
		}
	};
});

RestoreLastSettings();
UploadOptions();

function toggleTags(tag, id, lid) {
	var temp = new Array(1);
	var tagBox = $('tags');
	var tags = tagBox.value.split(" ");

	temp[0] = tag;
	if (tags.include(tag)) {
		tagBox.value = tags.without(tag).join(" ").trim() + ' ';
		$(lid).innerHTML = tag + " ";
	} else {
		tagBox.value = tags.concat(temp).join(" ").trim() + ' ';
		$(lid).innerHTML = "<b>" + tag + "</b> ";
	}
	return false;
}

function FilesSelected(selFiles) {
	if (upOptions.running) {
		return;
	}
	upOptions = UploadOptions();
	if (upOptions.auth.use && isNaN(upOptions.auth.userID)) {
		alert('Wrong user ID - it must be a number.');
		return;
	}
	if (upOptions.auth.use && upOptions.auth.ticket.length != 40) {
		alert('Wrong ticket - it must be 40 characters long.');
		return;
	}
	upOptions.running = true;
	try {
		var files = [];
		$each(selFiles, function (file) {
			if (IsUploadable(file)) {
				files.push(file);
			}
		});
		SendFiles(files);
	} catch (e) {
		if (typeof e == 'string') {
			alert('Couldn\'t upload - ' + e);
		}
	}
}

function IsUploadable(file) {
	return (typeof file.type == 'string' ? file.type.substr(0, 6) == 'image/' : true) && /(jpe?g|gif|png|bmp)$/i.test(file.name);
}

function OnFirstUpload(files) {
	SaveLastSettings();
	Log('info', 'Started uploading ' + upOptions.stats.total + ' files.');
	UpdateUpProgress(0);
}

function OnAllUploaded() {
	var msg = 'Finished uploading; ' + upOptions.stats.success + ' uploaded ok + ' +
		upOptions.stats.failed + ' failed = ' +
		upOptions.stats.total + ' images total.';
	var ourBooru = upOptions.uploadURL.match(/^http:\/\/([\w\d-]+)\.booru\.org\//i);

	upOptions.running = false;
	Log('info end', msg);
	$set('status', '');
	UpdateUpProgress(0);
	if (ourBooru) {
		var baseCtrUpdURL = 'http://booru.org/?action=updateimagecount&updateimagecount[booru]=';
		var image = new Image();
		image.src = baseCtrUpdURL + ourBooru[1] + '&rand=' + Math.random();
	}
	$('files').files = [];
	$('files').value = '';
}

function UploadOptions() {
	var rating = {
		when: $('forceRating').checked ? 'always' : 'default',
		set:  $('setSafe').checked ? 's' : $('setQuest').checked ? 'q' : 'e'
	};
	var tagging = {
		when: $('forceTags').checked ? 'always' : 'add',
		set:  $get('tags').toLowerCase().split(/\s+/)
	};
	var auth = {
		userID: GetCookie('user_id'),
		ticket: GetCookie('pass_hash')
	};
	auth.use = (auth.userID || GetCookie('login')) && auth.ticket;
	var uploadURL = document.location.protocol + '//' + document.location.hostname + boorus[current].uploadPath;

	$('spinner').hide();
	$('infobar').show();
	$('submit').enable();
	$('loggedIn').textContent = auth.use || (localStorage.getItem('auth_token') && (GetCookie('login') || GetCookie('user_name'))) ? 'logged in' : 'posting anonymously';
	$('current').textContent = current;
	return {
		delay:     1000,
		uploadURL: uploadURL,
		title:     $('title').checked,
		rating:    rating,
		tagging:   tagging,
		source:    $get('source'),
		stats:     {
			total:   0,
			success: 0,
			failed:  0
		},
		auth:      auth
	};
}

function Log(className, msg) {
	var now = new Date;
	var line = document.createElement('div');

	msg = '[' + now.getHours() + ':' + now.getMinutes() + '] ' + msg;
	$show('log');
	line.className = className;
	line.innerHTML = msg;
	$('log').appendChild(line);
}

function LogSuccess(file) {
	localStorage.setItem(document.location.host, $('engine').value);
	Log('success', 'Image ' + file.name + ' was successfully uploaded.');
	upOptions.stats.success++;
}

function LogFailure(file, reason) {
	Log('error', 'Couldn\'t upload ' + file.name + ': ' + reason + '.');
	upOptions.stats.failed++;
}

function SendFiles(files, index) {
	index = index || 0;
	if (index < files.length) {
		if (index == 0) {
			upOptions.stats.total = files.length;
			OnFirstUpload(files);
		}
		SendFile(files[index], function () {
			SendFiles(files, index + 1);
		});
		$set('status', 'Uploading #' + (index + 1) + ' image out of ' + files.length + '...');
	} else {
		OnAllUploaded();
	}
}

function SendFile(file, callback) {
	var reqVars = {
		title:  TitleFor(file),
		rating: RatingFor(file),
		source: upOptions.source,
		submit: 'Upload',
		tags:   TagsFor(file),
		token:	localStorage.getItem('auth_token')
	};
	if (upOptions.auth.use) {
		reqVars.cookies = 'user_id=' + upOptions.auth.userID + '; ' + 'pass_hash=' + upOptions.auth.ticket;
	}
	var xhr = CreateXHRequest();
	xhr.onreadystatechange = function () {
		if (this.readyState == 4) {
			if (current == 'gelbooru') {
				 if (this.status == 200 || this.status == 302 || this.status == 304 /*not modified*/ ) {
					if (~this.responseText.indexOf('generation failed')) {
						LogFailure(file, 'thumbnail generation failed, image might be corrupted even if added');
					}
					// "mage" instead of "image" because first "I" might be capitalized.
					if (~this.responseText.indexOf('mage added')) {
						LogSuccess(file);
					}
					else if (~this.responseText.indexOf('already exists.')) {
						var existId;
						try {
							existId = this.responseText.split('can find it ')[1].split('here')[0].split('&id=')[1].replace('">', '');
						} catch (any) {}

						if (!!Number(existId)) {
							LogFailure(file, 'image already exists <a href="index.php?page=post&s=view&id=' + existId + '" target="_blank">here</a>')
						} else
							LogFailure(file, 'image has been deleted');
					}
					else if (~this.responseText.indexOf('permission')) {
						LogFailure(file, 'no permissions');
						var msg =
								'Could not upload this image - the board says that you have no permissions.\nCheck if you are logged in. Stopped.';
						alert(msg);
						OnAllUploaded();
						throw msg;
					} else if (~this.responseText.indexOf('n error occured')) {
						LogFailure(file, 'image too big? too small? corrupted?');
					} else
						LogFailure(file, 'wrong response, check your posting form URL');
				} else {
					 LogFailure(file, xhr.statusCode);
				 }
			} else {
				switch (this.status) {
					case 200:
						LogSuccess(file);
						break;
					case 201:
						if (current == 'danbooru'){
							var uploadResult = JSON.parse(xhr.response).status;

							if (uploadResult == 'completed') {
								LogSuccess(file);
							} else if (~uploadResult.indexOf('error:')) {
								if (~uploadResult.indexOf('duplicate')) {
									LogFailure(file, 'image already exists <a href="/posts/' + uploadResult.split('duplicate: ')[1] + '" target="_blank">' + uploadResult.split('duplicate: ')[1] + '</a>');
								} else {
									LogFailure(file, uploadResult);
								}
							}
						}
						break;
					case 423:
						LogFailure(file, 'image already exists <a href="' + JSON.parse(xhr.response).location + '" target="_blank">' + (JSON.parse(xhr.response).post_id || 'here') + '</a>');
						break;
					case 403:
						LogFailure(file, 'access denied, try logging in. Stopped');
						OnAllUploaded();
						throw JSON.parse(xhr.response).reason;
						break;
					case 404:
						LogFailure(file, 'API error, try another booru engine. Stopped');
						OnAllUploaded();
						throw 404;
						break;
					default:
						if (JSON.parse(xhr.response).success === true) {
							LogSuccess(file);
						}
						else {
							LogFailure(file, 'error: ' + JSON.parse(xhr.response).reason);
						}
						break;
				}
			}
			UpdateUpProgress(Math.min(upOptions.stats.success + upOptions.stats.failed, upOptions.stats.total) / upOptions.stats.total);
			setTimeout(callback, upOptions.delay);
		}
	};

	var boundary = '--bOh3aYae';
	var EOLN = "\r\n";
	var postVars = '';

	for (var name in reqVars) {
		if (boorus[current].fields[name]) {
			postVars += boundary + EOLN +
				'Content-Disposition: form-data; name="' + boorus[current].fields[name] + '"' + EOLN + EOLN +
				reqVars[name] + EOLN;
		}
	}

	var reader = new FileReader;

	reader.onloadend = function () {
		var data = boundary + EOLN +
			'Content-Disposition: form-data; name="' + boorus[current].fields.file + '";' + ' filename="' + file.name + '"' + EOLN +
			'Content-Type: application/octet-stream' + EOLN +
			'Content-Transfer-Encoding: binary' + EOLN + EOLN +
			reader.result + EOLN +
			postVars + boundary + '--';
		xhr.open('POST', upOptions.uploadURL);
		xhr.setRequestHeader('Content-Type', 'multipart/form-data; boundary=' + boundary.substr(2));
		xhr.setRequestHeader('Content-Length', data.length);
		xhr.sendAsBinary(data);
	};
	reader.readAsBinaryString(file);
}

function UpdateUpProgress(percent) {
	WidthOf('progress', WidthOf('progressWr') * percent);
}

function RatingFor(file) {
	return InfoAbout(file)[0];
}

function TagsFor(file) {
	return NormTags(InfoAbout(file)[1]);
}

function TitleFor(file) {
	return InfoAbout(file)[2];
}

function InfoAbout(file) {
	var fileName = file.name.toLowerCase();
	var ext = fileName.match(/ *\.(\w{2,4})$/i);
	var rating, tags, title;

	if (ext) {
		fileName = fileName.replace(ext[0], '');
	}
	if (!ext) {
		throw 'File ' + file.name + ' has no extension.';
	} else {
		ext = ext[1];
	}
	rating = fileName.match(/^([sqe])( +|$)/i);
	if (rating) {
		fileName = fileName.replace(rating[0], '');
	}
	if (upOptions.rating.when == 'always' || !rating) {
		rating = upOptions.rating.set;
	} else {
		rating = rating[1];
	}
	tags = fileName;
	title = upOptions.title ? tags.split(/\s+/)[tags.split(/\s+/).length - 1] : '';
	return [rating, tags, title];
}

function NormTags(tags) {
	tags = tags.toLowerCase().split(/\s+/);
	tags.pop();
	if (tags.length >= 2) {
		tags = mkUniq(tags);
	}

	switch (upOptions.tagging.when) {
		case 'always':
			tags = [];
		case 'add':
			tags = tags.concat(upOptions.tagging.set);
			tags = mkUniq(tags);
	}

	if (tags[0] == '') {
		tags.shift();
	}

	return tags.join(' ');
}

function mkUniq(arr) {
	var to = {};

	for (var v = 0; v < arr.length; v++) {
		if (isANSI(arr[v])) {
			to[arr[v].toLowerCase()] = true
		}
		else {
			to[encodeURI(arr[v].toLowerCase())] = true;
		}
	}

	return Object.keys(to).sort();
}

function RestoreLastSettings() {
	var cookieBaseName = 'last@BMU:';

	$each(settingsToSave, function (setting) {
		var lastValue = GetCookie(cookieBaseName + setting);

		if (lastValue && (!$get(setting)))
			$set(setting, lastValue);
	});
	$each(checkboxesToSave, function (setting) {
		var lastValue = GetCookie(cookieBaseName + setting);

		if (IsNum(lastValue)) {
			$(setting).checked = lastValue == '1';
			if ($(setting).onchange)
				$(setting).onchange();
		}
	});
}

function SaveLastSettings() {
	var cookieBaseName = 'last@BMU:';

	$each(settingsToSave, function (setting) {
		SetCookie(cookieBaseName + setting, $get(setting), 7 * 24 * 3600);
	});
	$each(checkboxesToSave, function (setting) {
		SetCookie(cookieBaseName + setting, $(setting).checked ? '1' : '0', 7 * 24 * 3600);
	});
}

function isANSI(s) {
	var is = true;

	s = s.split('');
	s.each(function (v) {
		is = is && (/[\u0000-\u007e]/.test(v));
	});
	return is;
}