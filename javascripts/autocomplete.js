// VAR
if (typeof build === "undefined") build = {};
build.elements = {};
build.elements.available;

// Source: [MDN](https://developer.mozilla.org/en-US/docs/HTML/Element)
build.elements.html5 = {
    standard: ['a', 'abbr', 'address', 'area', 'article', 'aside', 'audio', 'b', 'base', 'bdi', 'bdo', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 'cite', 'code', 'col', 'colgroup', 'command', 'data', 'datalist', 'dd', 'del', 'details', 'dfn', 'div', 'dl', 'dt', 'em', 'embed', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hgroup', 'hr', 'html', 'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'keygen', 'label', 'legend', 'li', 'link', 'map', 'mark', 'menu', 'meta', 'meter', 'nav', 'nobr', 'noscript', 'object', 'ol', 'optgroup', 'option', 'output', 'p', 'param', 'pre', 'progress', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'script', 'section', 'select', 'small', 'source', 'span', 'strong', 'style', 'sub', 'summary', 'sup', 'table', 'tbody', 'td', 'textarea', 'tfoot', 'th', 'thead', 'time', 'title', 'tr', 'track', 'u', 'ul', 'var', 'video', 'wbr'],
    nonStandard: ['bgsound', 'blink', 'marquee', 'spacer'],
    obsolete: ['acronym', 'big', 'frame', 'frameset', 'tt'],
    deprecated: ['applet', 'basefont', 'center', 'dir', 'font', 'isindex', 'listing', 'noframes', 'plaintext', 'strike']
};

// Not allowed within the `body` tag (todo: double-check this list)
build.elements.outOfScopeElements = ['base', 'body', 'head', 'html', 'link', 'meta', 'title'];

build.elements.notImplementedElements = ['abbr', 'address', 'area', 'article', 'aside', 'audio', 'b', 'base', 'bdi', 'bdo', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 'cite', 'code', 'col', 'colgroup', 'command', 'data', 'datalist', 'dd', 'del', 'details', 'dfn', 'div', 'dl', 'dt', 'em', 'embed', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'head', 'header', 'hgroup', 'hr', 'html', 'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'keygen', 'label', 'legend', 'li', 'link', 'map', 'mark', 'menu', 'meta', 'meter', 'nav', 'nobr', 'noscript', 'object', 'ol', 'optgroup', 'option', 'output', 'param', 'pre', 'progress', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'script', 'section', 'select', 'small', 'source', 'span', 'strong', 'style', 'sub', 'summary', 'sup', 'table', 'tbody', 'td', 'textarea', 'tfoot', 'th', 'thead', 'time', 'title', 'tr', 'track', 'u', 'ul', 'var', 'video', 'wbr'];

// ZURB Foundation templates (todo: add the rest)
build.elements.foundationTemplates = ['alert-box', 'alert-box-success'];

// `build.elements.available`: `build.elements.html5`, plus 'build.elements.foundationTemplates', minus `build.elements.outOfScopeElements`, minus `build.elements.notImplementedElements`.
build.elements.available = build.elements.html5.standard.concat(build.elements.html5.nonStandard, build.elements.html5.obsolete, build.elements.html5.deprecated, build.elements.foundationTemplates);
build.elements.available = _.difference(build.elements.available, build.elements.outOfScopeElements);
build.elements.available = _.difference(build.elements.available, build.elements.notImplementedElements);

autoCompleteInitOptions = {
    source: build.elements.available,
    delay: 75,
    change: function(){
        // Todo: Use to submit input?
        console.log('jQuery UI Autocomplete: "change" event');
    },
    open: function(){
        var disableItems = function(i, v, text){
            if (text === 'standard') return;

            if (_.indexOf(v, text) !== -1) {
              console.log(i, text);
              $(this).removeClass('ui-menu-item').addClass('ui-menu-item-disabled ' + i);
            }
        };

        console.log('jQuery UI Autocomplete: "open" event', this, arguments);
        // Todo: Probably a easier-to-read way to get a reference to the menu
        //       (but without just searching the DOM, which would be much slower)
        $(this).data().autocomplete.menu.activeMenu.children('.ui-menu-item').each(function(){
          var text = $(this).children('a').text();
          $.each(build.elements.html5, function(i, v){
            disableItems(i, v, text)
          });
          disableItems('outOfScopeElements', build.elements.outOfScopeElements, text);
        });
    }
}