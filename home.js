import {isDark, toggle} from './dark.js';


$(document).ready(async (e) => {
    let darkened = $('body, h3, p');
    let darkSwitch = $('#darkSwitch');

    darkSwitch.prop('checked', isDark());
    if(isDark()){
        darkened.addClass('dark');
    } else{
        darkened.removeClass('dark');
    };

    darkSwitch.on('change', (e)=> {
        toggle();
        if(isDark()){
            darkened.addClass('dark');
            console.log("is dark must be true,"+isDark());
        } else{
            darkened.removeClass('dark');
            console.log("is dark must be false,"+isDark());
        }
    });
});
