import { isDark, toggle } from "./dark.js";

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


    let scores = {
        "url": "http://localhost:8080/scoreboard",
        "method": "GET",
    };
    let scoreSet;
    await $.ajax(scores).done(function (response) {
        scoreSet = response;
    });

    $('scoreboardDiv').empty();
    for(let i=0; i<20; i++){
        $('scoreboardDiv').append("<div class=scoreline> <div class=user>"+ scoreSet[i].username+ "</div> <div class=score>"+ scoreSet[i].highest_score+ "</div> </div>");
    }
    



});