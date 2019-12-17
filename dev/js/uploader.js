var upOptions = {
    running: false
};
var current = localStorage.getItem(document.location.host) || localStorage.getItem('current') || 'gelbooru';
var engine = $("engine");
var tagStorage = {};

engine.onchange = function () {
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

hitSync();

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




function FilesSelected(selFiles) {
    bat = [];
    header = {};
    $('bat').hide();

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
function IsSidecar(file) {
    return (typeof file.type == 'string' ? file.type == 'text/plain' : true) && /\.txt$/i.test(file.name);
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

    succesStore();

    upOptions.running = false;
    Log('info end', msg);
    $set('status', '');
    UpdateUpProgress(0);
    if (ourBooru) {
        var baseCtrUpdURL = 'http://booru.org/?action=updateimagecount&updateimagecount[booru]=';
        var image = new Image();
        image.src = baseCtrUpdURL + ourBooru[1] + '&rand=' + Math.random();
    }
    $('files').value = '';
}

function UploadOptions() {
    var rating = {
        when: $('forceRating').checked ? 'always' : 'default',
        set:  $('setSafe').checked ? 's' : $('setQuest').checked ? 'q' : 'e'
    };
    var tagging = {
        when: $getRadio('tag-when'),
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
    $('loggedIn').textContent = auth.use ||
    (localStorage.getItem('auth_token') && (GetCookie('login') || GetCookie('user_name'))) ?
        'logged in' :
        'posting anonymously';
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

    if (localStorage.getItem(document.location.host) != engine.value) {
        storEngine();
    }
    localStorage.setItem(document.location.host, engine.value);

    upOptions.stats.success++;

    if ($('onlyErrors').checked) {
        return;
    }

    Log('success', 'Image ' + file.name + ' was successfully uploaded.');
}

function LogFailure(file, reason) {
    Log('error', 'Couldn\'t upload ' + file.name + ': ' + reason + '.');

    batch(file, reason);

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
        token:  localStorage.getItem('auth_token')
    };
    if (upOptions.auth.use) {
        reqVars.cookies = 'user_id=' + upOptions.auth.userID + '; ' + 'pass_hash=' + upOptions.auth.ticket;
    }
    var xhr = CreateXHRequest();
    xhr.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (current == 'gelbooru') {
                if (this.status == 200 || this.status == 302 || this.status == 304 /*not modified*/) {
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
                        } else {
                            LogFailure(file, 'image has been deleted');
                        }
                    }
                    else if (~this.responseText.indexOf('permission')) {
                        LogFailure(file, 'error, access denied. Try logging in. Stopped');
                        OnAllUploaded();
                        throw 403;
                    } else if (~this.responseText.indexOf('n error occured')) {
                        LogFailure(file, 'image too big? too small? corrupted?');
                    } else {
                        LogFailure(file, 'error, wrong response. Check your posting form URL');
                    }
                } else {
                    LogFailure(file, 'error, ' + xhr.statusCode + ' ' + xhr.statusText);
                }
            } else {
                switch (this.status) {
                    case 200:
                        LogSuccess(file);
                        break;
                    case 201:
                        if (current == 'danbooru') {
                            var uploadResult = JSON.parse(xhr.response).status;

                            if (uploadResult == 'completed') {
                                LogSuccess(file);
                            } else if (~uploadResult.indexOf('error:')) {
                                if (~uploadResult.indexOf('duplicate')) {
                                    LogFailure(file, 'image already exists <a href="/posts/' + uploadResult.split('duplicate: ')[1] + '" target="_blank">' + uploadResult.split('duplicate: ')[1] + '</a>');
                                } else {
                                    LogFailure(file, 'error, ' + uploadResult);
                                }
                            }
                        }
                        break;
                    case 423:
                        LogFailure(file, 'image already exists <a href="' + JSON.parse(xhr.response).location + '" target="_blank">' + (JSON.parse(xhr.response).post_id || 'here') + '</a>');
                        break;
                    case 403:
                        LogFailure(file, 'error, access denied. Try logging in. Stopped');
                        OnAllUploaded();
                        throw JSON.parse(xhr.response).reason;
                        break;
                    case 404:
                        LogFailure(file, 'API error, try another booru engine. Stopped');
                        OnAllUploaded();
                        throw 404;
                        break;
                    default:
                        var error;
                        try {
                            error = JSON.parse(xhr.response);
                            if (error.success === true) {
                                LogSuccess(file);
                            }
                            else {
                                LogFailure(file, 'error, ' + error.reason);
                            }
                        } catch(any) {
                            console.log(xhr.response);
                            LogFailure(file, 'error, see console for server response');
                        }
                        break;
                }
            }
            UpdateUpProgress(Math.min(upOptions.stats.success + upOptions.stats.failed, upOptions.stats.total) / upOptions.stats.total);
            setTimeout(callback, upOptions.delay);
        }
    };

    var formData = new FormData();

    for (var name in reqVars) {
        if (boorus[current].fields[name]) {
            formData.append(boorus[current].fields[name], reqVars[name]);
        }
    }

    formData.append(boorus[current].fields.file, file);
    formData.append('filename', file.name);

    xhr.open('POST', upOptions.uploadURL);
    xhr.send(formData);
}

function UpdateUpProgress(percent) {
    WidthOf('progress', WidthOf('progressWr') * percent);
}

function RatingFor(file) {
    return InfoAbout(file)[0];
}

function TagsFor(file) {
    if (upOptions.tagging.when == 'sidecar')
        return NormTags((tagStorage[file.name] || '')+' ')
    else
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
        case 'force':
            tags = [];
        case 'add':
        case 'sidecar':
            tags = tags.concat(upOptions.tagging.set);
            tags = mkUniq(tags);
    }

    if (tags[0] == '') {
        tags.shift();
    }

    return tags.join(' ');
}

function onSidecarChange() {

    if ($getRadio('tag-when') == 'sidecar') { 
        $('files').accept = 'image/*,text/plain';
    }
    else {
        $('tags').enable();
        $('files').accept = 'image/*';
    }
    $set('selectStatus','(All files with MIME types other than <tt>image/*</tt> and\n\textension other than <tt>jpg/jpeg/gif/png/bmp</tt> will be skipped)');
}

function onFileSelect(files) {
    $set('selectStatus','(All files with MIME types other than <tt>image/*</tt> and\n\textension other than <tt>jpg/jpeg/gif/png/bmp</tt> will be skipped)');
    if ($getRadio('tag-when') != 'sidecar') return;

    tagStorage = {};

    files = [].slice.apply(files);
    var images = files.filter(IsUploadable);
    var sidecars = files.filter(IsSidecar);

    var unmatchedImages = [];

    images.forEach(function(img) {
        var sidecar = sidecars.filter(function(file) {return !!~file.name.indexOf(img.name)})[0];

        if (sidecar)
            tagStorage[img.name] = sidecar
        else
            unmatchedImages.push(img.name);
    });

    if (unmatchedImages.length)
        $set('selectStatus', 'Couldn\'t find sidecar matches for '+unmatchedImages.length+' image(s).')

    var matchedSidecars = Object.keys(tagStorage).map(function(key) {return tagStorage[key]});
    if (!matchedSidecars.length) return;
    try {
        function readNext(idx) {
            var reader = new FileReader();

            reader.onload = function(){
                // By lines
                var lines = this.result.split('\n').map(function(line) {return line.trim().replace(/ /g, '_');});
                tagStorage[matchedSidecars[idx].name.replace('.txt','')] = lines.join(' ');

                if (idx < matchedSidecars.length-1)
                    readNext(idx+1);
            };
            reader.readAsText(matchedSidecars[idx]);
        }

        readNext(0);
    } catch (err) {
        console.error(err);
        $set('selectStatus', 'Error reading sidecar files, see console.')
    }
}
