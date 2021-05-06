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
    //let updateScore = {
        // "url": "http://35.196.236.79/score/" + window.localStorage.getItem("username"),
    //     "url": "http://35.196.236.79/score/selam",
    //     "method": "PUT",
    //     "body": {
    //         "score": window.localStorage.getItem("timer")
    //     }
    // };
    //await $.ajax(updateScore).done();

    // get scoreboard
    let scores = {
        "url": "https://35.196.236.79/scoreboard",
        "method": "GET",
    };
    let scoreSet;
    await $.ajax(scores).done(function (response) {
        scoreSet = response;
    });

    let scoresUpTo = 20;
    $('pageCount').html('Page Number '+scoresUpTo/20 +' out of '+scoreSet.length/20);
    $('scoreboardDiv').empty();
    for (let i = 0; i < scoresUpTo; i++) {
        $('scoreboardDiv').append("<div class=scoreline> <div class=user>" + scoreSet[i].username + "</div> <div class=score>" + scoreSet[i].highest_score + "</div> </div>");
    }

    $('#nextScore').on('click', () => {
        scoresUpTo += 20;
        if (scoresUpTo >= scoreSet.length) {
            scoresUpTo -= 20;
            alert("That is all the scores, next page does not exist.")
        }
        else {
            $('scoreboardDiv').empty();
            for (let i = scoresUpTo - 20; i < scoresUpTo; i++) {
                $('scoreboardDiv').append("<div class=scoreline> <div class=user>" + scoreSet[i].username + "</div> <div class=score>" + scoreSet[i].highest_score + "</div> </div>");
            }
        }
    });

    $('#prevScore').on('click', () => {
        scoresUpTo -= 20;
        if (scoresUpTo < 20) {
            scoresUpTo += 20;
            alert("This is the first page, previous page does not exist.")
        }
        else {
            $('scoreboardDiv').empty();
            for (let i = scoresUpTo - 20; i < scoresUpTo; i++) {
                $('scoreboardDiv').append("<div class=scoreline> <div class=user>" + scoreSet[i].username + "</div> <div class=score>" + scoreSet[i].highest_score + "</div> </div>");
            }
        }
    });

});