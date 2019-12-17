document.documentElement.innerHTML='\
<head>\
	<title>Mass uploader</title>\
	<meta http-equiv="Cache-Control" content="no-store"/>\
	<meta content="text/html" charset="utf-8" http-equiv="Content-Type"/>\
	<style type="text/css">\
		body {\
			width: 66%;\
			margin: 0 auto;\
			min-width: 650px;\
		}\
\
		h1 {\
			text-align: center;\
		}\
\
		p.intro, q {\
			font-style: italic;\
		}\
\
		fieldset {\
			margin: 0.66em 1em;\
			padding: 0.66em 1em 1em;\
		}\
\
		legend {\
			font-weight: bold;\
		}\
\
		legend span {\
			cursor: pointer;\
			color: blue;\
		}\
\
		fieldset p {\
			margin: 0;\
		}\
\
		div.para {\
			margin: 0.3em 0;\
		}\
\
		button {\
			font-size: 1.5em;\
			font-weight: bold;\
			padding: 5px 1em;\
			display: block;\
			margin: 0.66em auto;\
			cursor: pointer;\
		}\
\
		#bat {\
			padding-left: 35px;\
		}\
\
		#status {\
			margin: 0;\
			text-align: center;\
			color: blue;\
		}\
\
		#progressWr {\
			margin-top: 5px;\
		}\
\
		#progress {\
			background: blue;\
			height: 4px;\
		}\
\
		#log {\
			margin: 1em;\
			padding: 5px 1em;\
			border-left: 3px solid silver;\
			overflow: auto;\
			height: 15em;\
		}\
\
		#log .info {\
			color: blue;\
		}\
\
		#log .end {\
			border-bottom: 1px solid silver;\
			padding-bottom: 2px;\
			margin-bottom: 5px;\
		}\
\
		#log .success {\
			color: green;\
		}\
\
		#log .error {\
			color: maroon;\
		}\
\
		label {\
			font-weight: normal !important;\
		}\
\
		#infobar {\
			text-align: center;\
			margin-top: -1em;\
			margin-bottom: -0.33em;\
		}\
\
		#spinner {\
			margin-left: auto;\
			margin-right: auto;\
			display: block;\
		}\
\
		#my-tags > a {\
			text-decoration: none;\
		}\
\
		.bold {\
			font-weight: bold;\
		}\
\
		#tagsWr {\
			padding-top: 0.5em;\
		}\
	</style>\
	<script type="text/javascript" src="https://seedmanc.github.io/Booru-mass-uploader/js/common-min.js?v=1.4.3"></script>\
	<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/prototype/1.7.3.0/prototype.js"></script>\
	<script type="text/javascript" src="https://seedmanc.github.io/Booru-mass-uploader/js/booru-params.js?v=1.4.3"></script>\
	<script type="text/javascript" src="https://seedmanc.github.io/Booru-mass-uploader/js/helpers.min.js?v=1.4.3"></script>\
	<script type="text/javascript" src="https://seedmanc.github.io/Booru-mass-uploader/dev/js/uploader.js?v=1.4.3"></script>\
</head>\
<body>\
<h1>Booru Mass-Uploader<span style="font-size:14px;"> v1.4.3 DEV</span></h1>\
<p class="intro">This script allows you to mass-upload images to imageboard sites running *booru software.\
	Select a number of files and they\'re sent to the website along with the metadata you include such as\
	the tags retrived from the filenames.</p>\
\
<fieldset style="padding: 2px 1em">\
	<legend>\
		Filename syntax for correct uploads\
		<span onclick="var el = \'fileNamesTip\'; $style(el, \'display\') == \'block\' ? $hide(el) : $show(el);">\
		  [+/-]\
		</span>\
	</legend>\
\
	<div id="fileNamesTip" style="display: none; margin: 1em">\
		<p>\
			Example filename: <q>q <b>nagisa muted_color tagme</b> <u>Filename</u>.jpg</q>, where:\
		</p>\
		<ol>\
			<li> <q>q </q> is the image rating:\
				<abbr title="Check http://*.booru.org/help/ratings.php for what these mean.">\
				<q>s </q> = Safe, <q>q </q> = Questionable, and <q>e </q> = Explicit</abbr>;\
				this part is optional.\
				<span id="moreInfo0H" style="cursor: hand; color: blue; display: inline;"\
				onclick="document.getElementById(\'moreInfo0H\').style.display = \'none\';\
				document.getElementById(\'moreInfo0\').style.display = \'inline\';">+</span>\
				<span id="moreInfo0" style="display: none;"><br>The next section allows to set image ratings based on the button selected or the filenames\
				and/or the button selected. The ratings of can be set either by forcing all\
				images in an upload session to have the same rating regardless of the filenames\
				or by the first filename element with fallback to options.</span>\
			</li>\
			<li> <b>Tags</b> separated by spaces. Here are 3 of them: <q>nagisa</q>, <q>muted_color</q> and <q>tagme</q>.\
				<span id="moreInfo1H" style="cursor:hand; color: blue; display: inline;"\
				onclick="document.getElementById(\'moreInfo1H\').style.display = \'none\';\
				document.getElementById(\'moreInfo1\').style.display = \'inline\';">+</span>\
				<span id="moreInfo1" style="display: none;"><br>Tags should be in ANSI format, use <q>_</q> for spaces between words of a single tag.\
				The <q>tagme</q> tag might be added by some boorus if there are under ~5 tags.</span>\
			</li>\
			<li> The <u>filename</u> is either ignored or used as image title on Gelbooru, here it is "Filename".\
				<span id="moreInfo2H" style="cursor:hand; color: blue; display: inline;"\
				onclick="document.getElementById(\'moreInfo2H\').style.display = \'none\';\
				document.getElementById(\'moreInfo2\').style.display = \'inline\';">+</span>\
				<span id="moreInfo2" style="display: none;"><br>Keep it if describes the image well or can be Googled to find the source.\
				Don\'t keep it if the filenames are numbered like "q ascii 1.jpg", "q ascii 2.jpg",\
				"q ascii 3.jpg"	to avoid duplicate filenames.</span>\
			</li>\
		</ol>\
              	<p>\
			Using sidecar text files:<ul><li>The filename must be the image\'s filename plus ".txt": Filename.jpg.txt</li>\
                        <li>Example of acceptable contents:<br><code>8288girls<br>blue_plastic_funnel<br>emoji_on_mylar_balloon</code>\
                        <br>OR<br><code>extreme presbyphonia<br>laptop in landfill<br>moldy arachnid</code><br>OR<br>\
                        <code>source:https://thecheeseballsadventures.wordpress.com/tag/the-office/<br>utz_cheese_balls<br>bespectacled \
                        human<br>jar<br>holding_a jar<br></code></li><li>Plaintext data specifications: Tags must be separated by \
                        newline characters. Each tag can have space(s), underscore(s), or a combination of both and still work out. \
                        The line with the text "source:http..." results in "http..." being put into the source field of the post in \
                        Danbooru software, but this might not work with boorus which are not running some version of Danbooru.</li></ul>\
		</p>\
	</div>\
</fieldset>\
\
<fieldset>\
	<legend>Image ratings</legend>\
\
	<div class="para">\
		<input type="radio" name="rating-when" id="forceRating" checked="checked"/>\
		<label for="forceRating"><strong>Force</strong> all ratings regardless of filename.</label>\
		<input type="radio" name="rating-when" id="ratingAsDefault"/>\
		<label for="ratingAsDefault">Only set rating if failed to determine it from the filename.</label>\
	</div>\
\
	<div class="para">\
		<input type="radio" name="rating" id="setSafe" checked="checked"/>\
		<label for="setSafe"><b>Safe</b></label>\
		<input type="radio" name="rating" id="setQuest"/>\
		<label for="setQuest">Questionable</label>\
		<input type="radio" name="rating" id="setExplicit"/>\
		<label for="setExplicit"><i>Explicit</i></label>\
	</div>\
</fieldset>\
\
<fieldset>\
	<legend>Tagging</legend>\
\
    <input type="radio" name="tag-when" id="sidecarTags" onchange="onSidecarChange(event)" value="sidecar"/>\
    <label for="sidecarTags">Ignore filenames, use <strong>sidecar</strong> files as sources of tags for each \
    image (see above at &sect;Filename syntax).</label>\
<br/>\
\
	<input type="radio" name="tag-when" id="forceTags" checked="checked" onchange="onSidecarChange(event)" value="force"/>\
	<label for="forceTags">Ignore filenames, <strong>force</strong> tags of all images.</label>\
	<br/>\
\
	<input type="radio" name="tag-when" id="addTags" onchange="onSidecarChange(event)" value="add"/>\
	<label for="addTags">Use tags from <b>filenames</b> and add these tags to each image:</label>\
	<br/>\
\
	<div id="tagsWr">\
		Tag list (separate with spaces):\
		<input type="text" id="tags" style="width: 77%"/>\
	</div>\
	<div id="mytags" style="display:none;">\
		<div style="float:left; ">Your tags:</div>\
		<div style="text-align:center;" id="my-tags"></div>\
	</div>\
</fieldset>\
\
<fieldset style="padding: 2px 1em">\
	<legend>\
		Other settings\
		<span onclick="var el = \'otherSettings\'; $style(el, \'display\') == \'block\' ? $hide(el) : $show(el);">\
		  [+/-]\
		</span>\
	</legend>\
\
	<div id="otherSettings" style="display: block;">\
		<div>\
			<div style="float:left;" class="para">\
				<input type="checkbox" id="title"/>\
				<label for="title">Set Title of each image to its original filename</label>\
			</div>\
			<div style="float:right;" class="para">\
				Set Source field of each image to\
				<input type="text" id="source" placeholder="Booru mass uploader" style="width:200px;"/>\
			</div>\
		</div>\
		<div style="text-align:center; padding-bottom:14px; clear:both;">\
			Select booru engine: <select id="engine" style="text-align:center; padding-top:3px;">\
			<option value="gelbooru" selected>Gelbooru</option>\
			<option value="moebooru">Moebooru</option>\
			<option value="danbooru">Danbooru</option>\
		</select>\
			<input type="checkbox" id="onlyErrors">\
			<label for="onlyErrors"> Log only errors</label>\
		</div>\
	</div>\
</fieldset>\
<div class="para" style="text-align:center;">Selection mode:\
	<input type="radio" name="selection" id="asFiles" checked="checked">\
	<label for="asFiles">files</label>\
	<input type="radio" name="selection" id="asFolder">\
	<label for="asFolder">folder</label>\
</div>\
<div class="para" style="padding:2px 1em;text-align:center;">\
	Images:\
	<input type="file" id="files" multiple="true" accept="image/*" style="width:90%;" onchange="onFileSelect(event.target.files)"/><br>\
	<span id="selectStatus"></span>\
</div>\
<br>\
<img src="https://seedmanc.github.io/Booru-mass-uploader/spinner.gif" id="spinner" alt="loading"/>\
<p style="display: none;" id="infobar">You are <b id="loggedIn"></b> to a <b id="current"></b> site.</p>\
<button disabled="" id="submit" onclick="FilesSelected( $(\'files\').files );">Upload!</button>\
\
<h2 id="status"></h2>\
<div id="progressWr">\
	<div id="progress" style="width: 0"></div>\
</div>\
<div id="bat" style="display: none;"><a href="#">Download <b>.bat</b> error log</a></div>\
<div id="log" style="display: none"></div>\
</body>';
