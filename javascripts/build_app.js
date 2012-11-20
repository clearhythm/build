// --------------
// INIT STATE
// --------------
// Initial values and customizations for Build behavior
// --------------
function initState(){
  if (typeof window.build === "undefined") window.build = {};
  _.extend(window.build, {
    component_id: num_nodes,  // use to track ids of components to keep view states in sync
    mode: "waiting",          // initial state, used to track keypress intention "waiting" or an insertion: "after", "before", "prepend", "append"
    default_node: "body",     // initial state, used to set initially selected node
    keystyle: "keydown",      // controls keyboard behavior: "keydown", "keyup", or "keypress"
    nodes: [],                // where we'll store all the nodes on the page, for faster/easier lookup when we add / remove nodes
    navigation: true          // default state for arrow-based navigation. "true" makes it ON, "false" turns it off (default browser behavior)
  });
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

  // KEYBOARD SHORTCUT DESIGN: Here's how we intend the keyboard shortcuts to function:
  // escape : Remove current inserted node and select previous node (first time), or deselect all nodes (second time)
  // , : insert node before
  // . : insert node after
  // < : insert node as first child (prepend)
  // > : insert node as last child (append)
  // tab : go into content-edit mode on the current node (future version feature)

  $(document).bind(build.keystyle, function(e) {
      var key = stringifyKeyCombo(e);
      switch(key)
      {
        case 'a':
          toggleNavigation(e);
          break;
        case 'down':
          navigateTree(key, e);
          break;
        case 'up':
          navigateTree(key, e);
          break;
        case 'esc':
          deselectNode(e);
          break;
        case ',':
          insertNode('prepend', build.selected_node, e);
          break;
        case '.':
          insertNode('append', build.selected_node, e);
          break;
        case 'i':
          insertNode('prepend', 'body', e);
          break;
        case 'I':
          insertNode('prepend', 'body', e);
          break;
        case '<':
          insertNode('before', build.selected_node, e);
          break;
        case '>':
          insertNode('after', build.selected_node, e);
          break;
        case 'x':
          e.preventDefault();
          deleteNode(build.selected_node);
          break;
        case 'return':
          processNode();
          break;
        case 'tab':
          processNode();
          break;
      }
  });
}

function toggleNavigation(e){
  if (build.mode != "waiting")
  { // let the event pass through if we're not in "waiting" mode
    return;
  }
  e.preventDefault();
  $('#toggle_navigation').click();
}

function deselectNode(e){
  e.preventDefault();
  if (build.mode != "waiting")
  {
    $("#tree .input_selected").parent().remove(); // remove the inserted input node
    selectNodeById(build.selected_node); // reselect the previous node
    build.mode = "waiting";
  }
  else
  {
    build.selected_node = build.default_node; // clear any stored selections
    build.tree.find('.selected').removeClass('selected'); // clear any tree selections
  }
}

function insertNode(method, node_id, e){
  if (build.mode != "waiting")
  { // we don't want to insert a new node unless we are currently "waiting"
    return;
  }
  e.preventDefault();
  build.mode = method;
  // figure out where in the tree to add the insert field, based on the method
  if (node_id === "body") {
    method = "prepend"; // we want to hardcode insertions into body to 'prepend'
    $tree_node = $("#tree");
  }
  else
  {
    var $tree_node = $("#tree_"+node_id).parent();
    if (['append', 'prepend'].indexOf(method) !== -1) // are we in append or prepend mode?
    {
      if ($tree_node.children('ul').length === 0)
      {
        $tree_node.append('<ul />'); // add a ul for the insertion if one doesn't already exist
      }
      $tree_node = $tree_node.children('ul');
    }
  }
  // now add the new input field, focus it, and deselect the previously selected node
  $tree_node[method]('<li><span class="selected input_selected"><input text="text"></span></li>');
  var $tree_input = $('#tree').find('input');
  $tree_input.focus(); // focus on the input
  $tree_input.autocomplete(build.autocompleteInitOptions); // add autocompletion UI
  $('#tree_'+build.selected_node).removeClass('selected'); // deselect other nodes
}

function processNode(){
  if (build.mode == "waiting") // do nothing, we're just waiting
  {
    return;
  }
  var input, user_entry;
  $input = $('#tree').find('input');
  user_entry = $input.val();
  if (validateNodeInsertion(user_entry))
  {
    // TODO : remove the input, then insert the node
    // remove the input
    var $input_li = $input.parent().parent();
    $input_li.find('span').remove();
    // insert the node here
    $input.parent().remove();
    insertTemplate(user_entry, build.selected_node, build.mode);
  }
}

function validateNodeInsertion(user_entry){
  if (user_entry === "") // user typed nothing, so do nothing but return false
  {
    return false;
  }
  if (_.indexOf(build.elements.available, user_entry) == -1) // 
  {
    $("#tree .input_selected").addClass('input_error');
    return false;
  }
  // TODO : template insertion rules : do the check here, throw the error if it's not valid
  if (false)
  {
    $("#tree .input_selected").addClass('input_error');
    return false;
  }
  // Made it this far?  We're attempting a valid insertion, so return true
  return true;
}

function insertTemplate(template, node_id, method)
{
  var data = {
      copy: "Bacon ipsum dolor sit amet",
      heading: "Heading",
      subheading: "Subheading" };
  var view_template = Handlebars.compile($("#template-view-"+template).html());
  var tree_template = Handlebars.compile($("#template-tree-"+template).html());
  var new_view_template = view_template(data);
  var new_tree_template = tree_template(data);
  new_tree_template = '<li><span id="tree_'+build.component_id+'" data-template="'+template+'">'+new_tree_template+'</span></li>';

  // now get the view and tree nodes where we'll do the insertion
  var $view_node, $tree_node;
  if (node_id == "body") $view_node = $("#page_frame").contents().find("body");
  else $view_node = $("#page_frame").contents().find("#view_"+node_id);
  // tree node...
  $tree_node = $("#tree_"+node_id).parent();

  $view_node[method](new_view_template);
  $tree_node[method](new_tree_template);

  // finally, increment the global id counter, so next node added will have a unique id
  build.component_id += 1; // increment the counter
}

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
    }
    else
    {
      $(this).find('.value').html('OFF');
      build.navigation = false;
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
  $('#insert_body').click(function(e){
    insertNode('prepend', 'body', e);
  });
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
        build.tree_actions.find('ul').removeClass('show-dropdown');
    });
    // insert a node
    build.tree_actions.find('.insert_node').click(function(e){
        e.preventDefault();
        insertNode($(this).data('insert-method'), build.selected_node, e);
    });
    // remove a node
    build.tree_actions.find('#action_delete').click(function(e){
        e.preventDefault();
        deleteNode(build.selected_node);
    });
}

function getStrippedId(full_id)
{
    var id_array = full_id.split("_");
    var my_id = (id_array[1] != undefined) ? id_array[1] : id_array[0];
    return parseInt(my_id);
}

function deleteNode(id){
  // move menu out of the way so it's not deleted
  build.tree_actions.appendTo(build.tree); 
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
  // select next node
  selectNextNode(); 
}

function navigateTree(direction, event) {
    // only navigate if we are if "navigation" mode and in "waiting" mode
    if (!build.navigation || build.mode != "waiting") { 
      return false;
    }
    // prevent default action of arrow keys...
    event.preventDefault();
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
      $('#page_frame').removeClass('opaque');
      setIframeHeight();
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
    initIframe();
});
