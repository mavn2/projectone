$(document).ready(function () {
    $("#homepage").show();
    $("#results-content").hide();
    $("#breweries-list").hide();
});

$("#submit").on("click", function (event) {
    $("#homepage").hide();
    $("#results-content").show();
    $("#breweries-list").show();
    console.log("hello");
    var zipCode = $("#zip-code").val();
    console.log(zipCode);
    if (zipCode === "") {
        return false;
    }
    breweriesNearby(zipCode);
    $("#zip-code").val("");
});

$("#homeIcon").on("click", function () {
    $("#homepage").show();
    $("#results-content").hide();
    $("#breweries-list").hide();
});

function breweriesNearby(zipCode) {
 

    //API URL for fetching the temperature
    var settings = {
        "url": "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/textsearch/json?query=brewery+in+redmond&key=AIzaSyCwva93H8v_VpIqPiZ75_0hm0eoKqw4Dgw",
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "Bearer 6HRV34H2QG8huioiDfP9_Fznc-Ig3gAaHcyGdAzjFquxiOqekhtCetxAkYZXWu-lV5UuqlnR5VWE2D0j8yzqs458Su9bnnRuU0XlrFUxjVymamjNuDVOdJtImV4aX3Yx"
        },
    };
    $.ajax(settings).done(function (response) {
        console.log(response);
          $("#results-content").empty();
        var resultsSearch=response.results.length-10
        
            for (i = 0; i < resultsSearch ; i++) {
                var breweryDiv=$("<div class='results'>");
                breweryDiv.attr("id","results"+[i]);

                var breweryImage = $("<img class='brewerylogo'>").attr("src", "./assets/images/sampleimage.jpg")
                breweryDiv.append(breweryImage);

                var breweryName = $("<p class='title'>").text(response.results[i].name);
                breweryDiv.append(breweryName);
    
                var businessStatus = $("<p>").text("Business Status : " + response.results[i].business_status);
                breweryDiv.append(businessStatus);
                console.log(response.results[i].business_status);
    
                var breweryRating = $("<p>").text("Rating: " + response.results[i].rating);
                breweryDiv.append(breweryRating);
                console.log(response.results[i].rating);
    
                var breweryDistance = $("<p>").text("distance");
                breweryDiv.append(breweryDistance);

                $("#results-content").append(breweryDiv);
            }
        });
        
}