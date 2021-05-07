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

    let gif;
    let settings = await {
        "url": "http://api.giphy.com/v1/gifs/search?api_key=oWBnjiXDj3ttOERTGpNsq8SGzz0IsSqu&q=vegeterian",
        "method": "GET",
    };
    
    await $.ajax(settings).done(function (response) {
        gif = response;
    });

    let random = Math.floor(Math.random() * 31);
    console.log(gif.data[random])

    gif = gif.data[random]['embed_url']

    $('#gif').append('<iframe src='+gif+'></iframe><p>Gif from Giphy</p>');

    let word;
    if(window.localStorage.getItem('word')===null){
        let settings = {
            "async": false,
            "crossDomain": true,
            "url": "https://wordsapiv1.p.rapidapi.com/words/vegetarian/definitions",
            "method": "GET",
            "headers": {
                "x-rapidapi-key": "dc4da22202msh11ccd6c3eff9313p10c8f2jsnee4d50fae334",
                "x-rapidapi-host": "wordsapiv1.p.rapidapi.com"
            }
        };
        
        let definition;
        $.ajax(settings).done(function (response) {
            definition = response['definitions'];
            console.log(response);
            console.log(response['definitions']);
        });
    
    
        settings = {
            "async": false,
            "crossDomain": true,
            "url": "https://wordsapiv1.p.rapidapi.com/words/vegetarian/frequency",
            "method": "GET",
            "headers": {
                "x-rapidapi-key": "dc4da22202msh11ccd6c3eff9313p10c8f2jsnee4d50fae334",
                "x-rapidapi-host": "wordsapiv1.p.rapidapi.com"
            }
        };
        
        let frequency;
        $.ajax(settings).done(function (response) {
            frequency = response['frequency'];
            console.log(response['frequency']);
    
        });
    
        settings = {
            "async": false,
            "crossDomain": true,
            "url": "https://wordsapiv1.p.rapidapi.com/words/vegetarian/pronunciation",
            "method": "GET",
            "headers": {
                "x-rapidapi-key": "dc4da22202msh11ccd6c3eff9313p10c8f2jsnee4d50fae334",
                "x-rapidapi-host": "wordsapiv1.p.rapidapi.com"
            }
        };
        
        let pronunciation;
        $.ajax(settings).done(function (response) {
            pronunciation = response['pronunciation'];
            console.log(response['pronunciation']);
    
        });
        word= [pronunciation['all'], definition[0]['definition'], frequency['diversity']]
        window.localStorage.setItem('word', JSON.stringify(word));
    } else {
        let retrieved = window.localStorage.getItem('word');
        word = JSON.parse(retrieved);
    }

    $('#definition').append('<h3>The word Vegeterian in the dictionary</h3>');
    $('#definition').append('<p>Pronunciation: '+word[0]+'</p>');
    $('#definition').append('<p>Definition: '+word[1]+'</p>');
    $('#definition').append('<p>Diversity: '+word[2]+'</p>');
    $('#definition').append('<a href="game.html" id="startButton">Start</a>')

});
