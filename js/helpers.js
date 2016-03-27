var settingsToSave = ['tags'];
var checkboxesToSave = ['forceRating', 'ratingAsDefault', 'setSafe', 'setQuest', 'setExplicit', 'forceTags', 'addTags', 'title', 'asFiles', 'asFolder', 'onlyErrors'];
var myTags = ((GetCookie('tags') || '+') + (GetCookie('my_tags') || '+') + (GetCookie('recent_tags') || '+')).replace(/%2520/gi, ' ').replace(/%20|\++/gi, ' ').trim().split(/\s+/);
var bat = [], header = {};
var move = 'move', slash = '\\', extn = 'bat';

if (!~navigator.appVersion.indexOf("Win")) {
	move = 'mv'; slash = '/'; extn = 'sh';
	$$('#bat b')[0].textContent = '.sh';
}

if (myTags.length) {
	var tagsArea = $('my-tags'), tags = '';

	$show('mytags');
	$each(mkUniq(myTags), function (tag) {
		tags += '&nbsp;<a href="#' + tag + '">' + tag + '</a> ';
	});
	tagsArea.innerHTML = tags;

	tagsArea.onclick = function (evt) {
		if (evt.target.nodeName == 'A') {
			toggleTags(evt.target);
		}
		return false;
	};
}

document.title = 'Mass uploader';

// batch sorting of faulty images
$$('#bat > a')[0].onclick = function () {
	var a, blob;

	for (line in header) {
		bat.unshift(header[line]);
	}
	blob = new Blob([bat.join('\r\n')], {type: 'application/octet-stream'});
	a = window.document.createElement('a');
	a.download = 'parse errors.' + extn;

	if (window.URL && window.URL.createObjectURL) {
		a.href = window.URL.createObjectURL(blob);

		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
	} else {
		var reader = new window.FileReader();
		reader.readAsDataURL(blob);
		reader.onloadend = function () {
			a.href = reader.result;
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
		};
	}

};

function toggleTags(tagNode) {
	var tagBox = $('tags');
	var tags = tagBox.value.split(" ");
	var newTag = tagNode.textContent;

	if (tags.include(newTag)) {
		tagBox.value = tags.without(newTag).join(" ") + ' ';
		tagNode.removeClassName('bold');
	} else {
		tagBox.value += ' ' + newTag + ' ';
		tagNode.addClassName('bold');
	}
	tagBox.value = tagBox.value.replace(/\s+/g, ' ');
}

function batch(file, reason) {
	var errors = ['corrupted', 'deleted', 'exists', 'error'];

	errors.some(function (error) {
		if (~reason.indexOf(error)) {
			header[error] = 'mkdir ' + error;
			bat.push(move + ' "' + file.name + '" "' + error + slash + file.name + '"');
			if (error == 'error') {
				bat.push('echo ' + file.name + '\t' + reason + '  >> ' + error + slash + 'log.txt ');
			}

			return true;
		}
	});
	$('bat').show();
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

function isANSI(s) {
	var is = true;

	s = s.split('');
	s.each(function (v) {
		is = is && (/[\u0000-\u007e]/.test(v));
	});
	return is;
}

function RestoreLastSettings() {
	var cookieBaseName = 'last@BMU:';

	$each(settingsToSave, function (setting) {
		var lastValue = GetCookie(cookieBaseName + setting);

		if (lastValue && (!$get(setting))) {
			$set(setting, lastValue);
		}
	});
	$each(checkboxesToSave, function (setting) {
		var lastValue = GetCookie(cookieBaseName + setting);

		if (IsNum(lastValue)) {
			$(setting).checked = lastValue == '1';
			if ($(setting).onchange) {
				$(setting).onchange();
			}
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