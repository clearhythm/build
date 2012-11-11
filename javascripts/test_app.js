var $frame_body = $("#page_frame").contents().find('body');

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
            setIFrameHeight();
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
    build.nodes = _.range(10);                  // TODO: these are preassigned mock values, make 'em dynamic
    build.selected_node = build.default_node;   // used to track which node is selected
}

// --------------
// KEYBOARD SHORTCUTS "HOTKEYS"
// --------------
// Shortcuts for driving Build via the keyboard
// --------------
function bindKey(key, fn, preventDefault){
    // Uses https://github.com/tzuryby/jquery.hotkeys
    $(document).bind(build.keystyle + '.' + key, function(e){
        if (preventDefault !== false) {
            e.preventDefault();
        }
        console.log('bindKey', key);
        fn();
    });
}
function initHotkeys(){
    bindArrowKeys(build.navigation);
    bindEscapeKey();
    bindXKey();
    bindKey('i', function(){
        build.mode = "insert";
    });
    $(document).bind(build.keystyle+'.shift_i', function(){
        console.log('I');
    });
    $(document).bind(build.keystyle+'.p', function(){
        if (build.mode = "insert")
        {
            console.log('p');
        }
    });
    $(document).bind(build.keystyle+'.h', function(){
        if (build.mode = "insert")
        {
            $(document).unbind(build.keystyle+'.1').bind(build.keystyle+'.1', function(){
                console.log('h1');
            });
            $(document).unbind(build.keystyle+'.2').bind(build.keystyle+'.2', function(){
                console.log('h2');
            });
            $(document).unbind(build.keystyle+'.3').bind(build.keystyle+'.3', function(){
                console.log('h3');
            });
            $(document).unbind(build.keystyle+'.4').bind(build.keystyle+'.4', function(){
                console.log('h4');
            });
            $(document).unbind(build.keystyle+'.5').bind(build.keystyle+'.5', function(){
                console.log('h5');
            });
            $(document).unbind(build.keystyle+'.6').bind(build.keystyle+'.6', function(){
                console.log('h6');
            });
        }
    });
}

function bindArrowKeys(bind_request){
    if (bind_request) {
        $(document).bind(build.keystyle+'.up', function(e){
            e.preventDefault();
            navigateTree('up');
        });
        $(document).bind(build.keystyle+'.down', function(e){
            e.preventDefault();
            navigateTree('down');
        });
    }
    else {
        $(document).unbind(build.keystyle+'.up');
        $(document).unbind(build.keystyle+'.down');
    }
}

function bindEscapeKey(){
    $(document).bind(build.keystyle+'.esc', function(){
        build.selected_node = build.default_node; // clear any stored selections
        build.tree.find('.selected').removeClass('selected'); // clear any tree selections
        build.tree_actions.hide(); // clear any tree selections
        build.mode = "waiting"; // go back into waiting mode
    });
    
}

function bindXKey(){
    $(document).bind(build.keystyle+'.x', function(){
        // if (window.nodes.)
    });
}

// --------------
// TREE FUNCTIONS
// --------------
// Navigating, adding, and deleting nodes from the tree
// --------------
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
    });
}

function getStrippedId(full_id)
{
    var id_array = full_id.split("_");
    var my_id = (id_array[1] != undefined) ? id_array[1] : id_array[0];
    return parseInt(my_id);
}

function deleteNode(id){
    // get element from tree
    var $tree_node = $('#tree_'+id).parent();
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
    // delete node from tree
    $tree_node.remove();
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

function initComposer(){
    initToolbar();
    initTree();
    // $('.composer').hover(function(){
    //     $(this).addClass('hover');
    // }, function(){
    //     $(this).removeClass('hover')
    // });
}

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
// TEMPLATING
// --------------
// Functions controlling insertion, deletion of nodes
// --------------
function initComponents(){
    $('.add_row').click(function(e){
        e.preventDefault();
        console.log('row');
        $("#page_frame").contents().find("#content-placeholder").html(template(data));
        $frame_body.append('<p>Row</p>');
    });
    $('.add_column').click(function(e){
        e.preventDefault();
        console.log('column');
        $("#page_frame").contents().find("#content-placeholder").html(template(data));
    });
    $('.add_p').click(function(e){
        e.preventDefault();
        console.log('paragraph');
        $("#page_frame").contents().find("#content-placeholder").html(template(data));
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

// OnLoad and OnReady Handlers
$(window).load(function(){
    setIframeHeight();
    $('#page_frame').removeClass('opaque');
});

function stringifyKeyCombo(event){
    // Keypress represents characters, not special keys
    var special = event.type !== "keypress" && jQuery.hotkeys.specialKeys[ event.which ],
        character = String.fromCharCode( event.which ).toLowerCase(),
        key, modif = "", possible = {};

    // check combinations (alt|ctrl|shift+anything)
    if ( event.altKey && special !== "alt" ) {
        modif += "alt+";
    }

    if ( event.ctrlKey && special !== "ctrl" ) {
        modif += "ctrl+";
    }

    // TODO: Need to make sure this works consistently across platforms
    if ( event.metaKey && !event.ctrlKey && special !== "meta" ) {
        modif += "meta+";
    }

    if ( event.shiftKey && special !== "shift" ) {
        modif += "shift+";
    }

    /* possible = {
        special: special,
        modif: modif,
        character: character,
        shiftNumsCharacter: jQuery.hotkeys.shiftNums[character]
    }; */

    if ( special ) {
        possible[ modif + special ] = true; // 'modif + special';
        if ( modif == 'shift+'  && typeof jQuery.hotkeys.shiftNums[special] === 'string' ){
            modif = '';
            possible[ modif + jQuery.hotkeys.shiftNums[special] ] = true; // 'modif + jQuery.hotkeys.shiftNums[special]';
        }
    } else {
        possible[ modif + character ] = true; // 'modif + character';
        if ( modif === 'shift+' ){
            if ( typeof jQuery.hotkeys.shiftNums[character] === 'string' ) {
                modif = '';
                possible[ modif + jQuery.hotkeys.shiftNums[ character ] ] = true; // 'modif + jQuery.hotkeys.shiftNums[ character ]';
            } else if (character !== character.toUpperCase()){
                modif = '';
                possible[ modif + character.toUpperCase() ] = true; // 'modif + character.toUpperCase()';
            }
        }
    }

    return possible;
}

function fixGapsInHotKeysPlugin(){
    jQuery.hotkeys.specialKeys[91] = 'meta'; // Otherwise looks like 'meta+['
    jQuery.hotkeys.specialKeys[186] = ';';
    jQuery.hotkeys.specialKeys[187] = '=';
    jQuery.hotkeys.specialKeys[189] = '-';
    jQuery.hotkeys.specialKeys[192] = '`';
    jQuery.hotkeys.specialKeys[219] = '[';
    jQuery.hotkeys.specialKeys[220] = '\\';
    jQuery.hotkeys.specialKeys[221] = ']';
    jQuery.hotkeys.specialKeys[222] = '\'';

    jQuery.hotkeys.shiftNums[';'] = ':'; // Fixes typo in plugin
    jQuery.hotkeys.shiftNums['['] = '{';
    jQuery.hotkeys.shiftNums[']'] = '}';
}

$(function(){
    fixGapsInHotKeysPlugin();
    initState();
    initHotkeys();
    initMenus();
    initDevicePicker();
    initComposer();
    initComponents();
    // do stuff on page ready
})
