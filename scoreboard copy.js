import { isDark, toggle } from "./dark.js";

$(document).ready(async (e) => {
    let darkened = $('body, h3, p');
    let darkSwitch = $('#darkSwitch');

    darkSwitch.prop('checked', isDark());
    if (isDark()) {
        darkened.addClass('dark');
    } else {
        darkened.removeClass('dark');
    };

    darkSwitch.on('change', (e) => {
        toggle();
        if (isDark()) {
            darkened.addClass('dark');
            console.log("is dark must be true," + isDark());
        } else {
            darkened.removeClass('dark');
            console.log("is dark must be false," + isDark());
        }
    });

    // add your score
    // let updateScore = {
    //     //"url": "http://35.196.236.79/score/" + window.localStorage.getItem("username"),
    //     "url": "http://35.196.236.79/score/selam",
    //     "method": "PUT",
    //      "body": {
    //          "score": 5
    //      },
    //     "responseType": 'json'
    //  };
    // await $.ajax(updateScore).done();

    // get scoreboard
    let scores = {
        "url": "http://35.196.236.79/scoreboard",
        "method": "GET",
        "responseType": 'json'
    };

    let scoreSet;
    await $.ajax(scores).done(function (response) {
        scoreSet = JSON.parse(response);
        console.log(typeof scoreSet);
    });

    console.log(scoreSet);
    console.log(scoreSet.length);
    $('#scoreboardDiv').empty();
    $('#scoreboardDiv').append("<table><tr><th>Username</th><th>Time</th></tr></table>")
    for (let i = 0; i < scoreSet.length; i++) {
        $('table').append("<tr><td>" + scoreSet[i]['username'] + "</td><td>" + scoreSet[i]['highest_score'] + "</td></tr>");
    }

});