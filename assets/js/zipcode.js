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
    };
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
        $("#results-content").empty();
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
                var status=bussinesshoursCalc(bussinesshours);
                breweryDiv.append(status[1]);

                //getting the brewery rating  
                var mapRating = ("Rating : " + response.results[i].rating);
                var breweryRating = $("<p>").text("Rating : " + response.results[i].rating);
                breweryDiv.append(breweryRating);

                $("#results-content").append(breweryDiv);

                //getting the lat and lng values to get the markers on the map
                var brewerylat = response.results[i].geometry.location.lat;
                var brewerylng = response.results[i].geometry.location.lng;
                markers = [breweryname, brewerylat, brewerylng, status[0], mapRating];

                locationsvalidate(locations,markers);

                //when the user clicks on the results it fetches the yelp API and display more info
                $("#results" + [i]).on("click", function () {
                    var ref = $(this).attr("data-name");
                    getYelp(ref, zipCode);
                });
            };
        };
        //Checks if search is valid
        cityNameValidate(locations, zipCode);
    });
};

//Determines/displayhs business hours
function bussinesshoursCalc(bussinesshours){
    if (bussinesshours == "OPERATIONAL") {
        var breweryStatus = ("Business Status : Open");
        var businessStatus = $("<p>").text("Business Status : Open");
        return [breweryStatus,businessStatus];
    }
    else {
        var breweryStatus = ("Business Status : Closed");
        var businessStatus = $("<p>").text("Business Status : Closed");
        return [breweryStatus,businessStatus];
    };
};

function locationsvalidate(locations,markers) {
    if (locations) {
        locations.push(markers);
        return locations;
    }
    else {
        locations = [breweryname, brewerylat, brewerylng, breweryStatus, mapRating];
        return locations;
    };
};

function cityNameValidate(locations, zipCode) {
    //Prevents invalid search from loading
    if (locations.length === "" || locations.length == 0) {
        $("#homepage").show();
        $("#results-content").hide();
        $("#breweries-list").hide();
        $("#map").hide();
        $("#error").html("Invalid City or Zipcode".bold());
        $("#error").show()
        return false;
    }
    else {
        //Allows valid search to run
        $("#error").hide();
        $("#homepage").hide();
        $("#results-content").show();
        $("#breweries-list").show();
        searched = true;
        //Updates local storage
        localStorage.setItem("searched", searched);
        localStorage.setItem("last search", zipCode);
        initMap(locations);
    };
};

//function  to show the searches in the map
function initMap(locations) {
    $("#map").empty();
    $("#map").show();
    $("#map").scroll(function () {
        $("#FixedDiv").animate({ top: $(this).scrollTop() });
    });


    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 10,
        center: new google.maps.LatLng(locations[0][1], locations[0][2]),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    var infowindow = new google.maps.InfoWindow();

    var marker, i;
    //display the  markers on the map
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
    };
};

