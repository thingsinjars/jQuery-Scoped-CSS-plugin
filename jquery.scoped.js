/*
 *  jQuery Scoped CSS plugin
 *  This adds support for the CSS scoped attribute to limit a block of style declarations
 *  to a specific area of the HTML. You can also use @import and media filters in scoped blocks
 *  http://www.w3.org/TR/html5/semantics.html#the-style-element
 *
 *  Simon Madine, 1 February 2011
 *
 *  Use:
 *  Include this plugin file (minified, ideally) and call $.scoped() on load
 *
 *  Limitations:
 *  - If you're using multiple nested declarations, Webkit might apply different inheritance
 *    specificity rules from the other engines. I don't know who's right.
 *
 *  Notes:
 *  - Style elements really shouldn't have classes added to them. This functionality should
 *    probably use some kind of data attribute.
 *  - The scoped blocks are emptied out in non-IE because there is also no support for the disabled
 *    attribute. This plugin could probably enable that attribute as well at no extra cost.
 *  - Currently, getElementStyles is hand-rolled and probably wrong.
 *
 *  v0.5 2011-01-30
 *  Sibling blocks work, most nested blocks work but some oddness in Webkit means that some
 *  styles don't inherit correctly when there are multiple nested declarations.
 *
 *  v0.4 2011-01-29
 *  First jQuery plugin version. Works for most cases but gets confused when there are
 *  multiple scoped blocks affecting the same context (siblings).
 *
 */
(function ($) {
  //Add this to the global jQuery object as we want to apply this once to the entire document
  $.scoped = function() {

    //Backup the original styles
    backupBlocks();

    //Go through once to add dependencies
    $('style').each(function(index) {
        if( isScoped($(this)) ) {
          $this = $(this);
          $this.addClass('this_is_'+index);

          //Get all style blocks in this scope
          //Including nested blocks
          $this.parent().find('style').each(function(i) {
            //Add a dependency class here to check for later
            $(this).addClass('depends_on_'+index);
          });
      }
    });

    //Go through a second time to process the scopes
    $('style').each(function(index) {
      $this = $(this);
        if( isScoped($this) ) {

        //Empty all scoped style blocks
        //Except those that this context is dependant on
        emptyBlocks($this);

        var holdingArea = [];

        //Read all styles and copy them to a holding area
        $this.parent().find('*').add($this.parent()).each(function() {
          var this_tag = this.nodeName;
          $(this).css('cssText','');
          if(this.nodeName != 'STYLE') {
            holdingArea.push(getStylesText(this));
          }
        });

        //Copy all the styles back from the holding area onto the in-scope elements
        $this.parent().find('*').add($this.parent()).each(function() {
          var this_tag = this.nodeName;
          if(this.nodeName != 'STYLE') {
            var this_style = holdingArea.shift();
            if($.browser.msie) {
              for(var n in this_style) {
                this.style[n]=this_style[n];
              }
            } else if($.browser.opera) {
              for(var n in this_style) {
                if(n != 'content' || this_style[n] != 'none') {
                  this.style.setProperty(n, this_style[n]);
                }
              }
            } else {
              $(this).css('cssText',this_style);
            }
          }
        });

            //Put all other style blocks back
            fillBlocks();
      }
    });

    //Measurements done and styles applied, now clear styles from this style block
    //This will stop them affecting out-of-scope elements
    $('style').each(function(index) {
      if( isScoped($(this)) ) {
        if($.browser.msie) {
          $(this).attr('disabled', 'disabled');
        } else {
          $(this).html('');
        }
      }
    });

    //Standard jQuery attribute selector $('style[scoped]') doesn't
    //work with empty boolean attributes so this is used instead
    function isScoped(styleBlock) {
      return ( $(styleBlock).attr('scoped') != undefined );
    }

    //Save all style tag contents to a data object
    function backupBlocks() {
      $('style').each(function(i) {
        if( isScoped($(this)) ) {
          $(this).data('original-style', $(this).html());
        }
      });
    }

    //Each style block now has class="depends_on_1 depends_on_2"
    //We switch off all the scoped style blocks not mentioned in that list
    //The disabled attribute only works on IE but coincidentally,
    //IE doesn't allow .html() on style blocks.
    function emptyBlocks(currentBlock) {
      $('style').each(function(i) {
        if( isScoped($(this)) ) {
          if(!currentBlock.hasClass('depends_on_'+i)) {
            if($.browser.msie) {
              $('style').eq(i).attr('disabled', 'disabled');
            } else {
              $('style').eq(i).html('');
            }
          }
        }
      });
    }

    //Put all the styles back to reset for the next loop
    function fillBlocks() {
      $('style').each(function(i) {
        if( isScoped($(this)) ) {
          if($.browser.msie) {
            $(this).removeAttr('disabled');
          } else {
            $(this).html($(this).data('original-style'));
          }
        }
      });
    }

    //Update this bit with some jQuery magic later
    function getStylesText(element) {
      if($.browser.msie) {
        //We actually work with a style object in IE rather than the text
        return element.currentStyle;
      } else if($.browser.opera) {
        sleep(50); //Opera takes a short time (~20ms) to resolve styles included via @import
        return document.defaultView.getComputedStyle(element, null);
      } else if($.browser.mozilla) {
        //We extract and process the ComputedCSSStyleObject into text
        var temp = document.defaultView.getComputedStyle(element, null);
        var styles = '';
        for(var n in temp) {
          if(parseInt(n,10)) {
            var key = camelize(temp[n]);
            if(temp[key] != undefined) {
              styles += temp[n]+':'+temp[key]+';\n';
            }
          }
        }
        return styles;
      } else {
        //Webkit implements cssText on ComputedCSSStyleObjects so we can use it here
        return document.defaultView.getComputedStyle(element, null).cssText;
      }
    }
    //from Prototype
    function camelize(string) {
     return string.replace(/-+(.)?/g, function(match, chr) {
       return chr ? chr.toUpperCase() : '';
     });
    }
    function sleep(ms){
        var dt = new Date();
        dt.setTime(dt.getTime() + ms);
        while (new Date().getTime() < dt.getTime()) {};
    }

  }
})(jQuery);