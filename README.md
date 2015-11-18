# Booru-mass-uploader
This userscript allows you to mass-upload images to imageboard sites running *booru engines.

With the [public Mass Uploader](https://unblock.ibsearch.xxx/mass-upload/) gone, a need arose for replacement. While many tried to mindlessly replicate the PHP-requiring setup of the old one, I took another approach and simply integrated the uploader into Booru page itself, eliminating the need to bypass CORS.

After installing, the userscript adds a link to mass uploader in the booru's menu.

![booru menu](http://puu.sh/lk53S/ad48c303c0.png)

The link leads to a (supposedly) non-existant location on the booru, `/index.php?page=post&s=mass_upload` and injects original uploader's code there, effectively incorporating its abilities into the booru.

This removes the need to bother with manual cookie retrieval, upload URL management, and, of course, CORS limitation. Additionally it allows to use custom tags from your settings. I also fixed the irrelevant "FF 3.6" requirement, all I had to do was adding the polyfill for that one missing method.

![screenshot](http://puu.sh/lqkYQ/ca6addbb18.png)

Interface was somewhat optimized, removing the redundant `Set tags based on image file names alone` option, just leave the additional tags field empty.  

  New features include ability to ignore last component of a file name instead of treating it like a tag, which allows to have image's original filename there. This is useful to avoid filename collisions when having images with identical tag sets.  
  Additonally, you can now set Title field of an image to its original filename as well as provide a custom Source field, which previously was hard-coded into PHP to advertise the uploader.

Note that so far I have tested it with only a few boorus hosted on the http://booru.org site. I don't own other boorus to test it more and I even though I tried adding support for Gelbooru and Safebooru, I haven't tested it there or on other custom-domain boorus. Your feedback is required, with enough of it I might add more support later.
