// --------------
// INIT STATE
// --------------
// Initial values and customizations for Build behavior
// --------------
function initState(){
  window.build = {
    component_id: 0,        // use to track ids of components to keep view states in sync
    mode: "waiting",        // initial state, used to track keypress intention "waiting" or "insert"
    default_node: "body",   // initial state, used to set initially selected node
    keystyle: "keydown",    // controls keyboard behavior: "keydown", "keyup", or "keypress"
    nodes: [],              // where we'll store all the nodes on the page, for faster/easier lookup when we add / remove nodes
    navigation: true        // default state for arrow-based navigation. "true" makes it ON, "false" turns it off (default browser behavior)
  };
  build.nodes = _.range(window.num_nodes);  // TODO: these are preassigned mock values, make 'em dynamic
  build.selected_node = build.default_node; // used to track which node is selected
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


function processHotkeys(key){
  modifyKeyBuffer(key);

  // KEYBOARD SHORTCUT DESIGN: Here's how we intend the keyboard shortcuts to function:
  // escape : Deselect selected tree node and clear out the keypress buffer
  // i : if we are not in insert mode, go into "insert mode (after)" and clear out the buffer
  // i : if we are already in "insert mode", set to "insert into (append)" mode and clear out the buffer
  // b : if we are already in "insert mode", set to "insert before (prepend)" mode and clear out the buffer
  // h4 : if we are in insert mode, add an h4 at selected node, and clear out the buffer
  // 4c : if we are in insert mode, add a four column div at selected node, and clear out the buffer
  // shift-a : toggle navigation on / off (independent of insertion mode)
  // delete : if buffer has one or more keys, remove last typed key from the buffer
  // tab : go into content-edit mode on the current node (future version feature)
  // other keys: if we are in an insertion mode, check if they 
  // other keys: add them to the buffer

  // some key combinations that shouldn't do anything:
  // b (not in insert mode), just silently ignore it
  // i (in insert "into" mode)
  // 

  // switch(key)
  // {
  //   case 'i':
  //     triggerInsertMode();
  //     clearKeyBuffer();
  //     break;
  //   case ''
  // }
  
}

function clearKeyBuffer(){
  
}

function triggerInsertMode(){
  build.mode = "insert";
  console.log("insert mode");
}


  // fixGapsInHotKeysPlugin();
  // bindArrowKeys(build.navigation);
  // bindKey('esc', function(e){
  //     build.selected_node = build.default_node; // clear any stored selections
  //     build.tree.find('.selected').removeClass('selected'); // clear any tree selections
  //     build.tree_actions.hide(); // clear any tree selections
  //     build.mode = "waiting"; // go back into waiting mode
  // });
  // bindKey('shift_a', function(e){
  //     $('#toggle_navigation').click();
  // });
  // bindKey('x', function(e){
  //   build.tree_actions.find('#action_delete').click();
  // });
  // bindKey('i', function(e){
  //     build.mode = "insert";
  // });
  // bindKey('shift_i', function(e){
  //     build.mode = "insert";
  // });
  // bindKey('p', function(e){
  //   if (build.mode == "insert")
  //   {
  //     attachNewTemplate(template.p, window.build.selected_node, 'append');
  //   }
  // })
  // bindKey('h', function(e){
  //     if (build.mode == "insert")
  //     {
  //         $(document).unbind(build.keystyle+'.1').bind(build.keystyle+'.1', function(){
  //           attachNewTemplate(template.h1, window.build.selected_node, 'append');
  //         });
  //         $(document).unbind(build.keystyle+'.2').bind(build.keystyle+'.2', function(){
  //           attachNewTemplate(template.h2, window.build.selected_node, 'append')
  //         });
  //         $(document).unbind(build.keystyle+'.3').bind(build.keystyle+'.3', function(){
  //           attachNewTemplate(template.h3, window.build.selected_node, 'append')
  //         });
  //         $(document).unbind(build.keystyle+'.4').bind(build.keystyle+'.4', function(){
  //           attachNewTemplate(template.h4, window.build.selected_node, 'append')
  //         });
  //         $(document).unbind(build.keystyle+'.5').bind(build.keystyle+'.5', function(){
  //           attachNewTemplate(template.h5, window.build.selected_node, 'append')
  //         });
  //         $(document).unbind(build.keystyle+'.6').bind(build.keystyle+'.6', function(){
  //           attachNewTemplate(template.h6, window.build.selected_node, 'append')
  //         });
  //     }
  // });

function bindKey(key, fn, preventDefault){
  // Uses https://github.com/tzuryby/jquery.hotkeys
  $(document).bind(build.keystyle + '.' + key, function(e){
    if (preventDefault !== false) {
      e.preventDefault();
    }
    console.log('keypress', key);
    fn();
  });
}

function unbindKey(key){
  // Uses https://github.com/tzuryby/jquery.hotkeys
  $(document).unbind(build.keystyle + '.' + key);
  console.log('unbindKey', key);
}

function bindArrowKeys(bind_request){
    if (bind_request) {
        bindKey('up', function(e){
            navigateTree('up');
        });
        bindKey('down', function(e){
            navigateTree('down');
        });
    }
    else {
        unbindKey('up');
        unbindKey('down');
    }
}

// --------------
// iFRAME PAGE VIEWER / DEVICE PICKER
// --------------
// Behavior for the iFrame page viewer and switching between views
// --------------
function initIframe(){
  build.iframe_body = $('#page_frame').contents().find('body');
  initDevicePicker();
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
// MENUS
// --------------
// Functions controlling behavior of header nav / links
// --------------
function initMenus(){
  $('#toggle_navigation').click(function(){
    $(this).toggleClass('on');
    if ($(this).hasClass('on'))
    {
      $(this).find('.value').html('ON');
      build.navigation = true;
      bindArrowKeys(true);
    }
    else
    {
      $(this).find('.value').html('OFF');
      build.navigation = false;
      bindArrowKeys(false);
    }
  });
}

// --------------
// COMPOSER
// --------------
// Handling the left-rail composer, including the composer toolbar, and navigating, adding, and deleting nodes from the tree
// --------------
function initComposer(){
  initToolbar();
  initTree();
}

function initTree(){
    build.tree = $('#tree');
    build.tree_actions = $('#tree_actions');
    // show or hide actions menu on hover
    build.tree.find('li > span').hover(function(){
        var my_node_id = $(this).attr('id');
        selectNodeById(getStrippedId(my_node_id),build.selected_node);
    }, function() {
        $('#tree_'+build.selected_node).removeClass('selected'); // remove selection
        build.selected_node = build.default_node; // unselect in master array
        build.tree_actions.hide().find('ul').removeClass('show-dropdown');
    });
    // remove a node
    build.tree_actions.find('#action_delete').click(function(e){
        e.preventDefault();
        build.tree_actions.hide().appendTo(build.tree); // move menu out of the way so it's not deleted
        deleteNode(build.selected_node); // delete the selected node
        selectNextNode(); // select next node
    });
}

function getStrippedId(full_id)
{
    var id_array = full_id.split("_");
    var my_id = (id_array[1] != undefined) ? id_array[1] : id_array[0];
    return parseInt(my_id);
}

function deleteNode(id){
    // get elements from tree and from view
    var $tree_node = $('#tree_'+id).parent();
    var $view_node = build.iframe_body.find("#view_"+id);
    // find this node and all subnodes within the tree
    var subnodes = []; // init
    var $foo = $tree_node.find('span').each(function(){
        subnodes.push(parseInt(getStrippedId($(this).attr('id'))));
    });
    // delete this node and all subnodes from master node list
    _.each(subnodes,function(node){
        var my_node_key = _.indexOf(build.nodes, node);
        if (my_node_key != -1) { // did we find that value in our nodes array? if so, let's remove it
            build.nodes.splice(my_node_key,1);
        }
        else
        { // if that value isn't here, there's a problem with our code. we could throw an error, but for now, just do nothing...
        }
    });
    // delete nodes from tree and view
    $tree_node.remove();
    $view_node.remove();
}

function navigateTree(direction) {
    if (build.selected_node === build.default_node)
    { // no node selected yet, select the first one (whether uses presses up or down)
        selectFirstNode();
    }
    else if (direction == 'up')
    { // user is trying to navigate up in the tree
        if (_.first(build.nodes) == build.selected_node) {
            // already at the top, don't do anything
        }
        else
        {
            var selected_node_key = _.indexOf(build.nodes, build.selected_node);
            var new_node_id = build.nodes[selected_node_key-1];
            selectNodeById(new_node_id, build.selected_node);
        }
    }
    else if (direction == 'down')
    { // user is trying to navigate down in the tree
        if (_.last(build.nodes) == build.selected_node) {
            // already at the bottom, don't do anything
        }
        else
        {
            var selected_node_key = _.indexOf(build.nodes, build.selected_node);
            var new_node_id = build.nodes[selected_node_key+1];
            selectNodeById(new_node_id, build.selected_node);
        }
    }
}

function selectFirstNode(){
    var my_node = _.first(build.nodes);
    if (my_node != undefined) { // found the first node? select it.
        selectNodeById(my_node);
    }
    else { // if no node was found, there are no nodes. do nothing for now (but later, we could alert the user to get started...)
    }
}

// selectNodeById - selects a node, and deselects the old_id (optional) if it's passed
function selectNodeById(id, old_id){
    if (typeof old_id != "undefined") { // remove old node if requested to do so
        $('#tree_'+old_id).removeClass('selected');
    }
    build.selected_node = id; // store new node in master array
    var $new_node = $('#tree_'+id); // ...and select the actual tree node
    $new_node.addClass('selected');
    build.tree_actions.appendTo($new_node).show();
}

// selectNextNode - tries to select the next node after the current node, or if there isn't one, the node immediately preceding
// TODO: improve the efficiency of this algorithm, which currently requires looping through all nodes
function selectNextNode(){
  var previous_node, next_node, new_node;
  _.each(build.nodes, function(num){
    if (num > build.selected_node)
    { // is there a node immediately after?
      if (!next_node) next_node = num;
    }
    else
    { // if not, store the node before
      previous_node = num;
    }
  });
  new_node = (next_node) ? next_node : previous_node;
  if (typeof new_node != 'undefined') selectNodeById(new_node, build.selected_node);
  // there are no more nodes, so go back to default selection
  else build.selected_node = build.default_node;
}

// --------------
// TEMPLATING
// --------------
// Functions controlling insertion & deletion of nodes
// --------------
function initComponents(){
    $('.add_row').click(function(e){
        e.preventDefault();
        console.log('row');
        build.iframe_body.find("#content-placeholder").html(template(data));
        $frame_body.append('<p>Row</p>');
    });
    $('.add_column').click(function(e){
        e.preventDefault();
        console.log('column');
        build.iframe_body.find("#content-placeholder").html(template(data));
    });
    $('.add_p').click(function(e){
        e.preventDefault();
        console.log('paragraph');
        build.iframe_body.find("#content-placeholder").html(template(data));
    });
    $('.add_h1').click(function(e){
        e.preventDefault();
        console.log('h1');
    });
    $('.add_h2').click(function(e){
        e.preventDefault();
        console.log('h2');
    });
    $('.add_h3').click(function(e){
        e.preventDefault();
        console.log('h3');
    });
}

function initToolbar(){
    $('#view_switcher').click(function(e){
        e.preventDefault();
        if ($(this).hasClass('view_key'))
        {
            $(this).removeClass('view_key').addClass('view_tree').text('Tree');
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

// --------------
// ONREADY / ONLOAD
// --------------
// Controlling page / function sequencing
// --------------
// ONREADY
$(function(){
    initState();
    initHotkeys();
    initMenus();
    initComposer();
    initComponents();
    initIframe();
});
// ONLOAD
$(window).load(function(){
    setIframeHeight();
    $('#page_frame').removeClass('opaque');
});
