//Onclick function for brewery buttons
function getYelp(ref, zipCode){
  getID(ref, zipCode);
  
};

//Gets Yelp id for selected brewery
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
    var idNum = response.businesses[0].id
    //gets details for that ID
    getDetails(idNum);
  });
};

//Gets details for sekected brewery
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
  //Accesses, prepares, and displays results
  $.ajax(detailCall).done(function (response){
    //vars for content from json
    var name = response.name;
    var number = response.display_phone;
    var displayNum = checkPhone(number);
    var address = compileAddress(response);
    var displayAddress = address;
    
    //Writes content to box
    clearFields();
    $("#name").html(name);
    $("#phonenumber").html(displayNum);
    $("#location").html(displayAddress);
    $("#deliveryLink").html("<a href=" + response.url + " target='_blank'> Delivery and Pickup Options on Yelp</a>")
    //adds photos to box
    for(i = 0; i < 3; i++){
      $("#photos").append($("<img>").attr({"src": response.photos[i], "class": "card-image"}));
    };

    //displays box
    $("#details").show();
  });
}; 

//Prevents duplicate photos stacking up in box
function clearFields(){
  $("#photos").children().remove();
};

//Ensures all relevant address fields are presented
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

//Sets placeholder message if phone number is not listed on Yelp
function checkPhone (number){
  var result;
  if (number === ""){
    result = "None Listed";
  } else {
    result = number;
  }
  return result;
};

//Function to close window, adapted from W3Schools' modal
$("span").on("click", function() {
  $("#details").hide();
});