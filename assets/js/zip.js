$(document).ready(function(){
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

$("#homeIcon").on("click",function(){
 $("#homepage").show();
 $("#results-content").hide();
 $("#breweries-list").hide();
});

function breweriesNearby(zipCode) {

    $("#results-content").empty();

    //API URL for fetching the temperature
    var settings = {
        "url": "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/textsearch/json?query=brewery+in+redmond&key=AIzaSyCwva93H8v_VpIqPiZ75_0hm0eoKqw4Dgw",
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "Bearer 6HRV34H2QG8huioiDfP9_Fznc-Ig3gAaHcyGdAzjFquxiOqekhtCetxAkYZXWu-lV5UuqlnR5VWE2D0j8yzqs458Su9bnnRuU0XlrFUxjVymamjNuDVOdJtImV4aX3Yx"
        },
    };
    $.ajax(settings).done(function(response) {

        console.log(response);
        for (i = 0; i < response.results.length; i++) {

            var breweryName = $("<p>").text(response.results[i].name);
            $("#results" + [i]).append(breweryName);

            var businessStatus = $("<p>").text("Business Status : " + response.results[i].business_status);
            $("#results" + [i]).append(businessStatus);
            console.log(response.results[i].business_status);

            var breweryRating = $("<p>").text("Rating: " + response.results[i].rating);
            $("#results" + [i]).append(breweryRating);
            console.log(response.results[i].rating);

            var breweryDistance = $("<p>").text("distance");
            $("#results" + [i]).append(breweryDistance);
        }
    });
}