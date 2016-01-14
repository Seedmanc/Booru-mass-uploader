# Booru-mass-uploader
This userscript allows you to mass-upload images to imageboard sites running Gelbooru software.

With the [public Mass Uploader](https://unblock.ibsearch.xxx/mass-upload/) gone, a need arose for replacement. While many tried to mindlessly replicate the PHP-requiring setup of the old one, I took another approach and simply integrated the uploader into the Booru page itself, eliminating the need to bypass CORS.

After installing, [the userscript](https://github.com/Seedmanc/Booru-mass-uploader/raw/gh-pages/booru.mass.uploader.user.js) adds a link to [the mass uploader page](https://github.com/Seedmanc/Booru-mass-uploader/raw/gh-pages/index.html) in the booru's menu:

![screenshot: booru menu](https://anonm.gr/d214.png)

The link leads to a (supposedly) non-existant location on the booru&mdash;`/index.php?page=post&s=mass_upload`&mdash;and injects the uploader's code there, effectively incorporating its abilities into the booru.

This removes the need to bother with manual cookie retrieval, upload URL management, and, of course, CORS limitation. Additionally it allows to use custom tags from your settings. I also fixed the irrelevant "Firefox version 3.6 to 38" requirement; all I had to do was add the polyfill for that one missing method.

![screenshot: index.html](http://puu.sh/lqkYQ/ca6addbb18.png)

Interface was somewhat optimized, removing the redundant `Set tags based on image file names alone` option, just leave the additional tags field empty.  

## New features

* You can set the Title field of an image to its original filename: the last part of the filename such as `tag1 tag2 tag3 tag4 tag5 something_at_location_in_time.jpg`
* Set a custom Source field (which previously was hard-coded into PHP to advertise the uploader).
* There are now 3 upload errors instead of 1: "image already exists", "image was deleted", and "image is too big, too small, or corrupted".

If you see a Gelbooru-based site that is not included on [this userscript](https://github.com/Seedmanc/Booru-mass-uploader/raw/gh-pages/booru.mass.uploader.user.js) include it with whatever userscript manager you have.

## See also

Be sure to check out these Booru-related userscripts:

* My userscripts at the [Booru Augmentation Project](https://github.com/Seedmanc/Booru-Augmentation-Project)
* Usernam's [Booru mass editor userscript](https://github.com/ProximaNova/Booru-mass-editor)
