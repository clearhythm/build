function stringifyKeyCombo(event){
    // Keypress represents characters, not special keys
    var special = event.type !== "keypress" && jQuery.hotkeys.specialKeys[ event.which ],
        character = String.fromCharCode( event.which ).toLowerCase(),
        key, modif = "", possible = {};

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

    /* possible = {
        special: special,
        modif: modif,
        character: character,
        shiftNumsCharacter: jQuery.hotkeys.shiftNums[character]
    }; */

    if (special) {
        possible[ modif + special ] = true; // 'modif + special';
        if (modif == 'shift+'  && typeof jQuery.hotkeys.shiftNums[special] === 'string'){
            modif = '';
            possible[ modif + jQuery.hotkeys.shiftNums[special] ] = true; // 'modif + jQuery.hotkeys.shiftNums[special]';
        }
    } else {
        possible[ modif + character ] = true; // 'modif + character';
        if (modif === 'shift+'){
            if (typeof jQuery.hotkeys.shiftNums[character] === 'string') {
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