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
    console.log(response)
        //vars for content from json
        var name = response.name
        var number = response.display_phone
        var displayNum = checkPhone(number)
        var address = compileAddress(response)
        var displayAddress = address
        var r = response.rating
        var displayRating = findStars(r)
        var reviewNum = response.review_count + " Reviews"
        var yURL = $("<p>").html("<a href=" + response.url + "target='_blank'> More details on Yelp!</a>")
        
        //Writes content to box
        $("#name").html(name)
        $("#phonenumber").html(displayNum)
        $("#location").html(displayAddress)
        $("#rating-stars").html(displayRating)
        $("#rating").html(reviewNum)
        $("#ylink").html(yURL)
      
        //adds photos to box
        for(i = 0; i < 3; i++){
          $("#photos").append($("<img>").attr({"src": response.photos[i], "class": "card-image"}));
        };

        //displays box
        $("#details").show()
  });
}; 

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

function checkPhone (number){
  var result;
  if (number === ""){
    result = "None Listed";
  } else {
    result = number;
  }
  return result;
};

//function to create rating w/ stars for display 
function findStars(r){
  var starRating;
  if (r === 0){
    starRating = $("<img>").attr("src","assets/images/yelp_stars/web_and_ios/regular/regular_0.png")
  } else if(r === 1){
    starRating = $("<img>").attr("src","assets/images/yelp_stars/web_and_ios/regular/regular_1.png")
  }else if(r === 1.5){
    starRating = $("<img>").attr("src","assets/images/yelp_stars/web_and_ios/regular/regular_1_half.png")
  } else if(r === 2){
    starRating = $("<img>").attr("src","assets/images/yelp_stars/web_and_ios/regular/regular_2.png")
  } else if(r === 2.5){
    starRating = $("<img>").attr("src","assets/images/yelp_stars/web_and_ios/regular/regular_2_half.png")
  } else if(r === 3){
    starRating = $("<img>").attr("src","assets/images/yelp_stars/web_and_ios/regular/regular_3.png")
  }else if(r === 3.5){
    starRating = $("<img>").attr("src","assets/images/yelp_stars/web_and_ios/regular/regular_3_half.png")
  } else if(r === 4.0){
    starRating = $("<img>").attr("src","assets/images/yelp_stars/web_and_ios/regular/regular_4.png")
  } else if(r === 4.5){
    starRating = $("<img>").attr("src","assets/images/yelp_stars/web_and_ios/regular/regular_4_half.png")
  } else if(r === 5){
    starRating = $("<img>").attr("src","assets/images/yelp_stars/web_and_ios/regular/regular_5.png")
  };

  return starRating;
};

//Function to close
$("span").on("click", function() {
  $("#details").hide();
});
