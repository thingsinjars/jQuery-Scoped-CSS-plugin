jQuery Scoped CSS plugin
========================
This adds support for the CSS scoped attribute to limit a block of style declarations
to a specific area of the HTML. You can also use @import and media filters in scoped blocks
(http://www.w3.org/TR/html5/semantics.html#the-style-element)[Check out the spec]

Use
---
Include this plugin file (minified, ideally) and call $.scoped() on load

Limitations
-----------
 * If you're using multiple nested declarations, Webkit might apply different inheritance specificity rules from the other engines. I don't know who's right.
 * Opera seems to add an extra display:none on text nodes.
 * Remember, IE < 9 support requires a (http://code.google.com/p/html5shim)[helping hand] if you're using HTML 5 elements

Notes
-----
 * Style elements really shouldn't have classes added to them. This bit of the functionality should probably use some kind of data attribute.
 * The scoped blocks are emptied out for non-IE browsers because currently only IE supports that attribute. This plugin could probably enable that attribute as well at no extra cost.
 * Currently, getElementStyles is hand-rolled and probably wrong.

Versions
--------
 * v0.5 2011-01-30
	 * Sibling blocks work, most nested blocks work but some oddness in Webkit means that some styles don't inherit correctly when there are multiple nested declarations.

 * v0.4 2011-01-29
	 * First jQuery plugin version. Works for most cases but gets confused when there are multiple scoped blocks affecting the same context (siblings).
