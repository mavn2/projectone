var i = 0, distance, duration;
var locations;
var searched;
var searchedCheck = localStorage.getItem("searched");

$(document).ready(function () {
    //if localstorage is empty 
    if (searchedCheck === false || !searchedCheck) {
        $("#homepage").show();
        $("#results-content").hide();
        $("#breweries-list").hide();
        $("#map").hide();
        $("#map").empty();
        $("#details").hide();
    } else {
        //if local storage has results then show the searched city/zipcode
        $("#homepage").hide();
        $("#results-content").show();
        $("#details").hide();
        var zipCode = localStorage.getItem("last search")
        breweriesNearby(zipCode);
        searched = true;
    }
});

$("#submit").on("click", function (event) {
    //on clicking the search button 
    var zipCode = $("#zip-code").val();
    if (zipCode === "") {
        return false;
    }
    //go the function breweries near by and the searched the breweries near by the zipcode user enters
    breweriesNearby(zipCode);
    $("#zip-code").val("");
});

//on clicking the home icon it goes back to the home page
$("#homeIcon").on("click", function () {
    $("#homepage").show();
    $("#results-content").hide();
    $("#results-content").empty();
    $("#breweries-list").hide();
    $("#map").hide();
    $("#map").empty();
    searched = false;
    localStorage.setItem("searched", searched);
});

function breweriesNearby(zipCode) {

    //API URL for fetching the breweries nearby
    var settings = {
        "url": "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/textsearch/json?query=brewery+in+"
            + zipCode +
            "&key=AIzaSyCwva93H8v_VpIqPiZ75_0hm0eoKqw4Dgw",
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "Bearer 6HRV34H2QG8huioiDfP9_Fznc-Ig3gAaHcyGdAzjFquxiOqekhtCetxAkYZXWu-lV5UuqlnR5VWE2D0j8yzqs458Su9bnnRuU0XlrFUxjVymamjNuDVOdJtImV4aX3Yx"
        },
    };
    $.ajax(settings).done(function (response) {
        $("#result-content").empty();
        console.log(response)
        locations = [];
        //fetching the 10 breweries nearby
        for (i = 0; i < response.results.length; i++) {
            if (i < 10) {
                var breweryDiv = $("<div class='results'>");
                breweryDiv.attr("id", "results" + [i]);

                var breweryImage = $("<img class='brewerylogo'>").attr("src", "./assets/images/sampleimage.jpg");
                breweryDiv.append(breweryImage);

                //getting the brewery name
                var breweryname = response.results[i].name;
                var breweryName = $("<p class='title'>").html(response.results[i].name.bold());
                breweryDiv.append(breweryName);
                breweryDiv.attr("data-name", breweryname);

                var bussinesshours = response.results[i].business_status;

                if (bussinesshours == "OPERATIONAL") {
                    //getting bussiness status
                    var breweryStatus = ("Business Status : Open");
                    var businessStatus = $("<p>").text("Business Status : Open");
                }
                else {
                    var breweryStatus = ("Business Status : Closed");
                    var businessStatus = $("<p>").text("Business Status : Closed");
                }
                breweryDiv.append(businessStatus);

                //getting the brewery rating  
                var mapRating = ("Rating : " + response.results[i].rating);
                var breweryRating = $("<p>").text("Rating : " + response.results[i].rating);
                breweryDiv.append(breweryRating);

                //getting the lat and lng values to get the markers on the map
                var brewerylat = response.results[i].geometry.location.lat;
                var brewerylng = response.results[i].geometry.location.lng;
                markers = [breweryname, brewerylat, brewerylng, breweryStatus, mapRating];
                if (locations) {
                    locations.push(markers);
                }
                else {
                    locations = [breweryname, brewerylat, brewerylng, breweryStatus, mapRating]
                }

                $("#results-content").append(breweryDiv);

                //when the user clicks on the results it fetches the yelp API and display more info
                $("#results" + [i]).on("click", function () {
                    var ref = $(this).attr("data-name");
                    getYelp(ref, zipCode);
                });
            }
        }
        initMap(locations,zipCode);
    });

};


function initMap(locations,zipCode) {
    $("#error").empty();
    console.log(locations);
    $("#map").scroll(function () {
        $("#FixedDiv").animate({ top: $(this).scrollTop() });
    });

    if (locations.length === "" || locations.length == 0) {
        console.log("hello");
        $("#homepage").show();
        $("#results-content").hide();
        $("#breweries-list").hide();
        $("#map").hide();
        console.log(locations);
        console.log("not equal to locations");
        var error = $("#error").html("invalid city name".bold());
        return false;
    }
    else {
        $("#error").hide();
        console.log(locations);
        console.log("hello");
        $("#homepage").hide();
        $("#results-content").show();
        $("#breweries-list").show();
        $("#map").show();
        searched=true;
        localStorage.setItem("searched", searched);
        localStorage.setItem("last search", zipCode);
        //function to get the get map displayed and the markers
    }

    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 10,
        center: new google.maps.LatLng(locations[0][1], locations[0][2]),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    var infowindow = new google.maps.InfoWindow();

    var marker, i;

    for (i = 0; i < locations.length; i++) {
        marker = new google.maps.Marker({
            position: new google.maps.LatLng(locations[i][1], locations[i][2]),
            map: map
        });

        google.maps.event.addListener(marker, 'click', (function (marker, i) {
            return function () {
                infowindow.setContent(locations[i][0]
                    + "<br>" + locations[i][3]
                    + "<br>" + locations[i][4]);
                infowindow.open(map, marker);
            }
        })(marker, i));
    }
}

