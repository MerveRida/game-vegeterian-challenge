import { isDark, toggle } from "./dark.js";

let timerCount;
let score = 0;

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
        } else {
            darkened.removeClass('dark');
        }
    });
    let advice;
    let settings = await {
        "url": "https://api.adviceslip.com/advice",
        "method": "GET",
    };
    
    await $.ajax(settings).done(function (response) {
        advice = JSON.parse(response);
        console.log(advice["slip"]["advice"])
    });

    $('#advice').append('<p>Cutie advice from the developer: '+advice["slip"]["advice"]+'</p>')
    timerCount = setInterval(function () { timer(); }, 1000);
});

let timerArray = ["", "Start", "1", "2"]
function timer() {
    $('#timer').html(timerArray.pop());
    if (timerArray.length === 0) {
        clearInterval(timerCount);
        $('#countdown').remove();
        $('body').append('<div id="gameDiv"></div>');
        $('#gameDiv').append('<div id="scoreboard"></div>');
        $('#scoreboard').append('<h3 id="gameTimer">Timer: 0</h3>');
        $('#scoreboard').append('<h3 id="gamePoints">Score: 0</h3>');
        $('#gameDiv').append('<h1 id="mealType"> Choosing for: </h1>');
        $('#gameDiv').append('<p> There can be more than 1 option</p>');
        $('#gameDiv').append('<button class="choice" id="choice1"></button>');
        $('#gameDiv').append('<button class="choice" id="choice2"></button>');
        $('#gameDiv').append('<button class="choice" id="choice3"></button>');
        $('#gameDiv').append('<button class="choice" id="choice4"></button>');
        let darkened = $('body, h3, p');
        let darkSwitch = $('#darkSwitch');

        darkSwitch.prop('checked', isDark());
        if (isDark()) {
            darkened.addClass('dark');
        } else {
            darkened.removeClass('dark');
        };

        timerCount = setInterval(function () { gameTimer(); }, 1000);
        gamePlay();
    }
}


let gameTimerCount = 1;
function gameTimer() {
    $('#gameTimer').html('Timer: ' + gameTimerCount);
    gameTimerCount++;
}

let dishArray = ['soup', 'appetizer', 'main course', 'side dish', 'salad', 'drink', 'dessert'];

let dishCount = -1;
async function gamePlay() {

    for (let i = 1; i < 5; i++) { 
        $('#choice' + i).remove();
    }

$('#gameDiv').append('<button class="choice" id="choice1"></button>');
$('#gameDiv').append('<button class="choice" id="choice2"></button>');
$('#gameDiv').append('<button class="choice" id="choice3"></button>');
$('#gameDiv').append('<button class="choice" id="choice4"></button>');


dishCount++;
$('#mealType').html('Choosing for ' + dishArray[dishCount]);
let vegetarianSet = await {
    "url": "https://api.spoonacular.com/recipes/random?number=1&tags=vegetarian," + dishArray[dishCount] + "&apiKey=2be809f1357046c5a9ee30442c8912a0",
    "method": "GET",
    "timeout": 0
};
let vegetarian;
await $.ajax(vegetarianSet).done(function (response) {
    vegetarian = response.recipes[0];
});
console.log(vegetarian);

let restSet = await {
    "url": "https://api.spoonacular.com/recipes/random?number=3&tags=" + dishArray[dishCount] + "&apiKey=2be809f1357046c5a9ee30442c8912a0",
    "method": "GET",
    "timeout": 0
};

let rest;
await $.ajax(restSet).done(function (response) {
    rest = response;
});
console.log(rest);

let random = Math.floor(Math.random() * 3);
random++;
let restCount = 0;

for (let i = 1; i <= 4; i++) {
    let recepie;
    if (i === random) {
        recepie = vegetarian;
    } else {
        recepie = rest.recipes[restCount];
        restCount++;
    }

    $('#choice' + i).html(recepie.title);
    $('#choice' + i).append(`<img class="foodImg" src="${recepie.image}">`);
    $('#choice' + i).on('click', (e) => { handleChoice(e, recepie) });
}
}

function handleChoice(event, recepie) {
    if (recepie.vegetarian) {
        score += 10;
        $('#gamePoints').html("Score: " + score);
        if (dishCount >= dishArray.length-1) {
            console.log("you win!");
            window.localStorage.setItem("timer", gameTimerCount);
            window.location.replace("win.html");
        } else {
            gamePlay();
        }
    } else {
        window.location.replace("lost.html");
    }
}




