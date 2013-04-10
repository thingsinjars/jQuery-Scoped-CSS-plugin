jQuery Scoped CSS plugin
========================
This adds support for the scoped attribute to limit a block of style declarations to a specific area of the HTML. You can also use @import and media filters in scoped blocks.

 * [Check out the spec on the W3C site](http://www.w3.org/TR/html5/semantics.html#the-style-element)
 * [Read more about the plugin](http://thingsinjars.com/post/359/css-scoped/)
 * [Demo of the plugin in action](http://thingsinjars.com/lab/scoped/index.html)

Use
---
Include this plugin file (minified, ideally) and call $.scoped() on load. If you add style blocks to the page later, you need to rerun the plugin.

Any style blocks with the scoped attribute are processed and limited to only affect their parent's children:

    <p>This will be black.</p>
    <section>
     <style scoped>
       p {color:red;}
     </style> 
     <p>This will be red.</p>
    </section>


Limitations
-----------

  * If you're using multiple nested declarations, Webkit might apply different inheritance specificity rules from the other engines. I don't know who's right.
  * Remember, IE < 9 support requires a [helping hand](http://code.google.com/p/html5shim) if you're using HTML 5 elements
  * Currently, getElementStyles is hand-rolled and possibly wrong.
  * Sometimes there are delays parsing externally loaded stylesheets (via @import) and they might get skipped. Not often but it happens.

Notes
-----

  * If the browser natively supports `style scoped`, this will return without doing anything
  * Style elements really shouldn't have classes added to them. This bit of the functionality should probably use some kind of data attribute.
  * The scoped blocks are emptied out for non-IE browsers because currently only IE supports the 'disabled' attribute.
  * Opera exhibits a short delay (~20ms) when resolving styles included via `@import`. There's a forced delay to counter this.
  * Opera seems to add an extra content:none on text nodes.
