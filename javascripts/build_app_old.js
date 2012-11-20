// --------------
// INIT STATE
// --------------
// Initial values and customizations for Build behavior
// --------------
function initState(){
  window.build = {
    keystyle: "keydown",    // controls keyboard behavior: "keydown", "keyup", or "keypress"
  };
}

// --------------
// KEYBOARD SHORTCUTS "HOTKEYS"
// --------------
// Shortcuts for driving Build via the keyboard
// --------------
function initHotkeys(){
  var specialKeys = {
    8: "backspace", 9: "tab", 13: "return", 16: "shift", 17: "ctrl", 18: "alt", 19: "pause",
    20: "capslock", 27: "esc", 32: "space", 33: "pageup", 34: "pagedown", 35: "end", 36: "home",
    37: "left", 38: "up", 39: "right", 40: "down", 45: "insert", 46: "del",
    91: "meta", 96: "0", 97: "1", 98: "2", 99: "3", 100: "4", 101: "5", 102: "6", 103: "7",
    104: "8", 105: "9", 106: "*", 107: "+", 109: "-", 110: ".", 111 : "/",
    112: "f1", 113: "f2", 114: "f3", 115: "f4", 116: "f5", 117: "f6", 118: "f7", 119: "f8",
    120: "f9", 121: "f10", 122: "f11", 123: "f12", 144: "numlock", 145: "scroll", 186: ";", 187: "=",
    188: ",", 189: "-", 190: ".", 191: "/", 192: "`", 219: "[", 220: "\\", 221: "]", 222: "'"
  };

  var shiftNums = {
    "`": "~", "1": "!", "2": "@", "3": "#", "4": "$", "5": "%", "6": "^", "7": "&",
    "8": "*", "9": "(", "0": ")", "-": "_", "=": "+", ";": ": ", "'": "\"", ",": "<",
    ".": ">",  "/": "?",  "\\": "|"
  }

  function stringifyKeyCombo(event){
      // Keypress represents characters, not special keys
      var special = event.type !== "keypress" && specialKeys[ event.which ],
          character = String.fromCharCode( event.which ).toLowerCase(),
          key, modif = "";

      // check combinations (alt|ctrl|shift+anything)
      if (event.altKey && special !== "alt") {
          modif += "alt+";
      }
      if (event.ctrlKey && special !== "ctrl") {
          modif += "ctrl+";
      }
      // TODO: Need to make sure this works consistently across platforms
      if (event.metaKey && !event.ctrlKey && special !== "meta") {
          modif += "meta+";
      }
      if (event.shiftKey && special !== "shift") {
          modif += "shift+";
      }

      if (special) {
          if (modif == 'shift+'  && typeof shiftNums[special] === 'string'){
              modif = '';
              return modif+shiftNums[special];
          }
          else return modif+special;
      } else {
          if (modif === 'shift+'){
              if (typeof shiftNums[character] === 'string') {
                  modif = '';
                  return modif+shiftNums[character];
              } else if (character !== character.toUpperCase()){
                  modif = '';
                  return modif+character.toUpperCase();
              }
          }
          else return modif+character;
      }
  }

  $(document).bind(build.keystyle, function(e) {
      var key = stringifyKeyCombo(e);
      console.log(key);
  });
}

// --------------
// COMPOSER
// --------------
// Handling the left-rail composer, including the composer toolbar
// --------------
function initComposer(){
  initToolbar();
  initEditor();
  initTextarea();
}

function initToolbar(){
  $('#view_switcher').click(function(e){
    e.preventDefault();
    if ($(this).hasClass('view_key'))
    {
      $(this).removeClass('view_key').addClass('view_tree').text('Editor');
      $('#tree').hide();
      $('#key').show();
    }
    else
    {
      $(this).removeClass('view_tree').addClass('view_key').text('Key');
      $('#key').hide();
      $('#tree').show();
    }
  });
}

function initEditor(){
  $("#jade").xarea(); // make it expandable
  $('#jade').focus(function(){
    $(this).addClass('focus');
  });
  $('#jade').blur(function(){
    $(this).removeClass('focus');
  });
}

// --------------
// TEXTAREA
// --------------
// Handling the textarea where user can write Jade code
// --------------
var jade2HTML, updateContent;

jade2HTML = function(input, data) {
  return jade.compile(input, {
    pretty: true,
    doctype: "5"
  })(data);
}

updateContent = function($jade) {
  var $data, $html, $iframe, data, html, input;
  $html = $jade.closest("div").find("textarea.html");
  $iframe = $("#page_frame");
  $iframe_content = $iframe.contents().find('#build_content');
  $jade.closest("div").find("textarea").removeClass("error");
  input = $jade.val();
  if (input == "") { // if it's now empty, put the welcome message in there
    $iframe_content.html('<div class="twelve columns"><div style="margin-top: 300px; text-align: center"><h1>Build</h1><p>No content yet. Choose a template or just start coding in the Composer!</div></div>');
  }
  else
  {
    try {
    // console.log(input);
    html = jade2HTML(input, data);
    } catch (error) {
      $jade.addClass("error");
      $html.val("[jade] " + error.message).addClass("error");
      return;
    }
    html = html.trim();
    $html.val(html);
    if ($iframe.length) {
      $iframe_content.html(html);
    } else {
      console.log('nyet');
    }
  }
  setIframeHeight();
}

function initTextarea(){
  $("textarea.jade").each(function() {
    return updateContent($(this).on("keyup", function() {
      return updateContent($(this));
    }));
  });
  $.fn.tabOverride.autoIndent(true);
  $.fn.tabOverride.tabSize(3);
  $.fn.tabOverride.backspaceTabRemoval(true);
  $("textarea.jade").tabOverride();
}

// --------------
// iFRAME PAGE VIEWER / DEVICE PICKER
// --------------
// Behavior for the iFrame page viewer and switching between views
// --------------
function initIframe(){
  var iframe_load_detect = window.setInterval(function(){findIframe()}, 1000);

  function findIframe(){
    build.iframe_body = $('#page_frame').contents().find('body');
    if (build.iframe_body.length > 0) // did we finally find the iFrame?
    {
      clearInterval(iframe_load_detect); // clear the interval
      updateContent($("textarea.jade")); // update the content
    }
  }
}

function initDevicePicker(){
  $('.size').click(function(e){
    e.preventDefault();
    if ($(this).hasClass('selected')) {
      // already selected, do nothing
    }
    else {
      $('.size').removeClass('selected');
      $(this).addClass('selected');
      var newSize = $(this).data('size');
      $('.page_wrapper').removeClass('desktop').removeClass('laptop').removeClass('tablet').removeClass('phone');
      $('.page_wrapper').addClass(newSize);
      setIframeHeight();
    }
  });
}

function setIframeHeight() {
  iframe = document.getElementById('page_frame');
  if (iframe) {
    var iframeWin = iframe.contentWindow || iframe.contentDocument.parentWindow;
    if (iframeWin.document.body) {
      iframe.height = iframeWin.document.documentElement.scrollHeight || iframeWin.document.body.scrollHeight;
    }
  }
};

// --------------
// ONREADY / ONLOAD
// --------------
// Controlling page / function sequencing
// --------------
// ONREADY
$(function(){
  initState();
  initHotkeys();
  initComposer();
  initTextarea();
  initIframe();
});
// ONLOAD
$(window).load(function(){
  initDevicePicker();
  setIframeHeight();
  $('#page_frame').removeClass('opaque');
});
