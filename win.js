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

    let rest;
    
    if(window.localStorage.getItem('restData')===null){
        let restSet = await {
            "url": "https://api.documenu.com/v2/restaurants/search/fields?state=nc&key=f422d66c82828dd09e8bdea21fe1c397",
            "method": "GET",
            "timeout": 0,
        };

        await $.ajax(restSet).done(function (response) {
            rest = response;
        });
        window.localStorage.setItem('restData', JSON.stringify(rest));
    } else {
        let retrieved = window.localStorage.getItem('restData');
        rest = JSON.parse(retrieved);
    }
    console.log(Object.values(rest));

    //let data = {restaurant_name: "Panera Bread", restaurant_phone: "(919) 337-0020", restaurant_website: "https://locations.panerabread.com/nc/cary"};

    $('body').append("<h3>Got hungry when playing? Here are some restraunts close by:</h3>");
    for(let i=0; i<5; i++){
        $('body').append("<div><p><b>"+rest.data[i].restaurant_name+"</b> / Phone: <em>"+rest.data[i].restaurant_phone+"</em> / <a href="+rest.data[i].restaurant_website+" class='restaurant'>Website</a></p></div>");  
    }
    
    darkened = $('body, div>p, h3');
    if(isDark()){
        darkened.addClass('dark');
    } else{
        darkened.removeClass('dark');
    };

});


