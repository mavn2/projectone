//Onclick function for brewery buttons
function getYelp(ref, zipCode){
    getID(ref, zipCode)
  
};

//Gets yelp id for selected brewery
function getID(ref, zipCode){
    var settings = {
        "url": "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?location=" + zipCode + "&term=" + ref,
        "method": "GET",
        "timeout": 0,
        "headers": {
          "accept": "application/json",
            "x-requested-with": "xmlhttprequest",
            "Access-Control-Allow-Origin":"*",
            "Authorization": "Bearer wR0mMmgKO12tZ1oKt9JNRgb2d5cHlLPlnXr59v3aDhjD1cgGqEANWCgiYyXM8dSLhR771J9jYp4t3_rosKf0iesG87MTE_wwGDvgDxyrxji9Qt4RDP-JQTbZyFUTX3Yx"
        },
    };
    //gets yelp id for selected brewery
    $.ajax(settings).done(function (response) {
      console.log(response)
      var idNum = response.businesses[0].id
      //gets more details from yelp
      getDetails(idNum)
    });
};

function getDetails(idNum){
    var detailCall = {
        "url": "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/" + idNum,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "accept": "application/json",
            "x-requested-with": "xmlhttprequest",
            "Access-Control-Allow-Origin":"*",
            "Authorization": "Bearer wR0mMmgKO12tZ1oKt9JNRgb2d5cHlLPlnXr59v3aDhjD1cgGqEANWCgiYyXM8dSLhR771J9jYp4t3_rosKf0iesG87MTE_wwGDvgDxyrxji9Qt4RDP-JQTbZyFUTX3Yx"
        },
    };
  //This will call a final function to display the response info, rather then console.log
  $.ajax(detailCall).done(function (response){
    console.log(response);
  })
} 