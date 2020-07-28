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
  //gets ids for each business, used for detail search. easy to rework: search name, specifically, based on button/entry clicked
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
//So, unfortunately since its a bit more complicated, the best way to make this work is run the first call to get the id for a business, then a second call
//that actually provides detailed information: can't do both in one query, essentially distinct apis.
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
  //gets info, creates a test box for me to display it-rework the specifics of this for actual app, obviously, but here's functional groundwork
  $.ajax(detailCall).done(function (response){
    console.log(response);

    //creates mod box
    $("main").append("<div>").attr({"class": "modal-body", "id": "displayMod"})

    //vars for box
    var modContent = $("<div>").attr({"class": "modal-content", "id": "modContent"})
    var closeHTML = "<span class='close'>&times;</span>";

    //vars for content from json
    var name = $("<h3>").html(response.name);
    var number = $("<p>").html(response.display_phone);
    var address = compileAddress(response)
    var displayAddress = $("<p>").html(address)
    var r = response.rating
    var displayRating = findStars(r)
    var reviewNum = $("<p>").html(response.review_count + " Reviews")
    var yURL = $("<p>").html("<a href=" + response.url + "target='_blank'> More details on Yelp!</a>")

    //creates universal elements for the box, adds some info 
    $("main").append("<div>").attr({"class": "modal", "id": "displayMod"});
    $("#displayMod").append("<div>").attr("class","modal-header").html(closeHTML).append(name);
    $("#displayMod").append(modContent);
    

    //adds bulk of content to box body
    for(i = 0; i < 3; i++){
      $(modContent).append($("<img>").attr({"src": response.photos[i], "class": "card-image"}));
    };
    $(modContent).append(number)
    $(modContent).append(displayAddress)
    $(modContent).append(displayRating).append(reviewNum)
    $(modContent).append(yURL)
   });
};

//Function to handle multiple adress fields
function compileAddress(response){
  let final = response.location.address1;
  if(response.location.address2 && response.location.address2 !== undefined){
    final += location.address2;
  };
  if(response.location.addres3 && response.location.address3 !== undefined){
    final +=location.address3
  };
  return final;
};

//function to create rating w/ stars for display 
function findStars(r){
  var starRating;
  if (r === 0){
    starRating = $("<img>").attr("src","yelp_assets/yelp_stars/web_and_ios/regular/regular_0.png")
  } else if(r === 1){
    starRating = $("<img>").attr("src","yelp_assets/yelp_stars/web_and_ios/regular/regular_1.png")
  }else if(r === 1.5){
    starRating = $("<img>").attr("src","yelp_assets/yelp_stars/web_and_ios/regular/regular_1_half.png")
  } else if(r === 2){
    starRating = $("<img>").attr("src","yelp_assets/yelp_stars/web_and_ios/regular/regular_2.png")
  } else if(r === 2.5){
    starRating = $("<img>").attr("src","yelp_assets/yelp_stars/web_and_ios/regular/regular_2_half.png")
  } else if(r === 3){
    starRating = $("<img>").attr("src","yelp_assets/yelp_stars/web_and_ios/regular/regular_3.png")
  }else if(r === 3.5){
    starRating = $("<img>").attr("src","yelp_assets/yelp_stars/web_and_ios/regular/regular_3_half.png")
  } else if(r === 4.0){
    starRating = $("<img>").attr("src","yelp_assets/yelp_stars/web_and_ios/regular/regular_4.png")
  } else if(r === 4.5){
    starRating = $("<img>").attr("src","yelp_assets/yelp_stars/web_and_ios/regular/regular_4_half.png")
  } else if(r === 5){
    starRating = $("<img>").attr("src","yelp_assets/yelp_stars/web_and_ios/regular/regular_5.png")
  }

  return starRating;
}