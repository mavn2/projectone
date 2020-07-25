var IDs = []

getIDS();
//needs work to base search on info pulled from g places-ideally, through location, but could run 10 individual calls (probably-or-just get details once on click-yea.)
function getIDS(){
  var settings = {
    "url": "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?location=Seattle&term=fremont_brewing",
    "method": "GET",
    "timeout": 0,
    "headers": {
      "accept": "application/json",
      "x-requested-with": "xmlhttprequest",
      "Access-Control-Allow-Origin":"*",
      "Authorization": "Bearer wR0mMmgKO12tZ1oKt9JNRgb2d5cHlLPlnXr59v3aDhjD1cgGqEANWCgiYyXM8dSLhR771J9jYp4t3_rosKf0iesG87MTE_wwGDvgDxyrxji9Qt4RDP-JQTbZyFUTX3Yx"
    },
  };
  $.ajax(settings).done(function (response) {
  console.log(response);
  for(i=0; i < response.businesses.length; i++){
    IDs.push(response.businesses[i].id)
    var button = $("<button>").html(response.businesses[i].name).attr("data-id", (response.businesses[i].id))
    $("main").append(button)
    button.on("click", function(){
      var id = $(this).attr("data-id");
      getDetails(id);
    })
   }
  });
};

//so-this info could all be passed to third page-make loading that html the first code here.
function getDetails(id){
    console.log(id)
    var detailCall = {
      "url": "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/" + id,
      "method": "GET",
      "timeout": 0,
      "headers": {
        "accept": "application/json",
        "x-requested-with": "xmlhttprequest",
        "Access-Control-Allow-Origin":"*",
        "Authorization": "Bearer wR0mMmgKO12tZ1oKt9JNRgb2d5cHlLPlnXr59v3aDhjD1cgGqEANWCgiYyXM8dSLhR771J9jYp4t3_rosKf0iesG87MTE_wwGDvgDxyrxji9Qt4RDP-JQTbZyFUTX3Yx"
    },
  };
  $.ajax(detailCall).done(function (response){
    console.log(response);
    $("main").append($("<p>").html(response.name));
    $("main").append($("<p>").html(response.display_phone));
    for(i = 0; i < 3; i++){
      $("main").append($("<img>").attr("src", response.photos[i]));
    };
   });
};

