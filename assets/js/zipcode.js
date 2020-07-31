var i = 0, distance, duration;
var locations = [];
var searched;
var searchedCheck = localStorage.getItem("searched");

$(document).ready(function () {
    if(searchedCheck === false || !searchedCheck){
        $("#homepage").show();
        $("#results-content").hide();
        $("#breweries-list").hide();
        $("#map").hide();
        } else {
            $("#homepage").hide();
            $("#results-content").show();
            var zipCode = localStorage.getItem("last search")
            breweriesNearby(zipCode);
            searched = true;
        }
    });

    $("#submit").on("click", function (event) {
        $("#homepage").hide();
        $("#results-content").show();
        var zipCode = $("#zip-code").val();
        if (zipCode === "") {
            return false;
        }
        breweriesNearby(zipCode);
        $("#zip-code").val("");
        searched = true
        localStorage.setItem("searched", searched)
        localStorage.setItem("last search", zipCode)
    });


$("#homeIcon").on("click", function () {
    $("#homepage").show();
    $("#results-content").hide();
    $("#breweries-list").hide();
    $("#map").hide();
});

$("#homeIcon").on("click", function () {
    $("#homepage").show();
    $("#results-content").hide();
    $("#breweries-list").hide();
    searched = false
    localStorage.setItem("searched", searched)
});

function breweriesNearby(zipCode) {

    //API URL for fetching the temperature
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
        console.log(response);
        $("#homepage").hide();
        $("#results-content").show();
        $("#breweries-list").show();
        $("#map").show();
        $("#results-content").empty();

        console.log(response,);

        locations = [];
        for (i = 0; i < response.results.length; i++) {
            if (i < 10) {
                var iString = i.toString();
                var breweryDiv = $("<div class='results'>");
                breweryDiv.attr("id", "results" + [i]);

                var breweryImage = $("<img class='brewerylogo'>").attr("src", "./assets/images/sampleimage.jpg");
                breweryDiv.append(breweryImage);

                var breweryname = response.results[i].name;
                var breweryName = $("<p class='title'>").html(response.results[i].name.bold());
                breweryDiv.append(breweryName);

               
                var bussinesshours = response.results[i].business_status;

                if (bussinesshours == "OPERATIONAL") {
                    var breweryStatus=("Business Status : Open");
                    var businessStatus = $("<p>").text("Business Status : Open");
                }
                else {
                    var breweryStatus=("Business Status : Closed");
                    var businessStatus = $("<p>").text("Business Status : Closed");
                }
                breweryDiv.append(businessStatus);

                 var mapRating=("Rating : " +response.results[i].rating);
                var breweryRating=$("<p>").text("Rating : " +response.results[i].rating);
                breweryDiv.append(breweryRating);


                $("#results" + iString).on("click", function (){
                    var ref = $(this).attr("data-name")
                    console.log(ref)
                    getYelp(ref, breweryname, zipCode);
                });

                var brewerylat = response.results[i].geometry.location.lat;
                console.log(brewerylat);
                var brewerylng = response.results[i].geometry.location.lng;
                console.log(brewerylng);
                markers = [breweryname, brewerylat, brewerylng,breweryStatus,mapRating];
                console.log(markers);
                locations.push(markers);

                $("#results-content").append(breweryDiv);
            }
        }
        initMap(locations);
        console.log(locations);
    });

}

function initMap(locations) {

    console.log(locations);

        $("#map").show();
        $("#map").empty();
        $("#map").scroll(function () {
            $("#FixedDiv").animate({ top: $(this).scrollTop() });
        });
        var map = new google.maps.Map(document.getElementById('map'), {
            zoom: 10,
            center: new google.maps.LatLng(locations[0][1],locations[0][2]),
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
                        +"<br>"+locations[i][3]
                        +"<br>"+locations[i][4]);
                    infowindow.open(map, marker);
                }
            })(marker, i));
        }
    }
   
