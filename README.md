# Booru-mass-uploader
This userscript allows you to mass-upload images to imageboard sites running Gelbooru software.

With the [public Mass Uploader](https://unblock.ibsearch.xxx/mass-upload/) gone, a need arose for replacement. While many tried to mindlessly replicate the PHP-requiring setup of the old one, I took another approach and simply integrated the uploader into the Booru page itself, eliminating the need to bypass CORS.

After installing, [the userscript](https://github.com/Seedmanc/Booru-mass-uploader/raw/gh-pages/booru.mass.uploader.user.js) adds a link to [the mass uploader page](https://github.com/Seedmanc/Booru-mass-uploader/raw/gh-pages/index.html) in the booru's menu.

![screenshot: booru menu](http://imagehost4.online-image-editor.com/oie_upload/images/14165614sj0U5qVwR/cr9Ug9sKzrGi.png)

The link leads to a (supposedly) non-existant location on the booru, `/index.php?page=post&s=mass_upload` and injects the uploader's code there, effectively incorporating its abilities into the booru.

This removes the need to bother with manual cookie retrieval, upload URL management, and, of course, CORS limitation. Additionally it allows to use custom tags from your settings. I also fixed the irrelevant "Firefox version 3.6 to 40" requirement, all I had to do was adding the polyfill for that one missing method.

![screenshot: index.html](http://puu.sh/lqkYQ/ca6addbb18.png)

Interface was somewhat optimized, removing the redundant `Set tags based on image file names alone` option, just leave the additional tags field empty.  

  New features include ability to ignore last component of a file name instead of treating it like a tag, which allows to have image's original filename there. This is useful to avoid filename collisions when having images with identical tag sets.  
  Additonally, you can now set Title field of an image to its original filename as well as provide a custom Source field, which previously was hard-coded into PHP to advertise the uploader.

Note that so far I have tested it with only a few boorus hosted on the http://booru.org site. I don't own other boorus to test it more and even though I tried adding support for Gelbooru and Safebooru, I haven't tested it there or on other custom-domain boorus. Your feedback is required, with enough of it I might add more support later.

## See also

* Be sure to check out my other Booru-related userscript: The [Booru Augmentation Project](https://github.com/Seedmanc/Booru-Augmentation-Project)
* Usernam's [Booru mass editor userscript](https://github.com/ProximaNova/Booru-mass-editor)
