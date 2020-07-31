var i = 0, distance, duration;
var locations = [];
$(document).ready(function () {
    $("#homepage").show();
    $("#results-content").hide();
    $("#breweries-list").hide();
    $("#map").hide();
});

$("#submit").on("click", function (event) {

    var zipCode = $("#zip-code").val();
    if (zipCode === '') {
        console.log("zipcode : " + zipCode);
        return false;
    }
    breweriesNearby(zipCode);
    $("#zip-code").val("");
});

$("#homeIcon").on("click", function () {
    $("#homepage").show();
    $("#results-content").hide();
    $("#breweries-list").hide();
    $("#map").hide();
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
        $("#homepage").hide();
        $("#results-content").show();
        $("#breweries-list").show();
        $("#results-content").empty();

        list(response, zipCode);
    }).fail(() => {
        // if its a invalid city name
        $("#homepage").show();
        $("#results-content").hide();
        var error=$("<p>").text("Invalid cityName/Zipcode");
        $("#zipCodeInfo").append(error);
        
    });

}

async function list(response, zipCode) {
    var len = response.results.length > 10 ? 10 : response.results.length

    for (i = 0; i < len; i++) {

        var breweryDiv = $("<div class='results'>");
        breweryDiv.attr("id", "results" + [i]);

        var breweryImage = $("<img class='brewerylogo'>").attr("src", "./assets/images/sampleimage.jpg");
        breweryDiv.append(breweryImage);

        var breweryname = response.results[i].name;
        var breweryName = $("<p class='title'>").text(response.results[i].name);
        breweryDiv.append(breweryName);

        var bussinesshours = response.results[i].business_status;

        if (bussinesshours == "OPERATIONAL") {
            var businessStatus = $("<p>").text("Business Status : Open");
        }
        else {
            var businessStatus = $("<p>").text("Business Status : Closed");
        }

        breweryDiv.append(businessStatus);

        var breweryPlaceid = response.results[i].place_id;

      

        var brewerylat = response.results[i].geometry.location.lat;
        var brewerylng = response.results[i].geometry.location.lng;
        markers = [breweryname, brewerylat, brewerylng];
        locations.push(markers);

        var result1 = await currentLocation(brewerylat,brewerylng);
        console.log(result1);

         var breweryDistance = $("<p>").text("Distance :" + distance);
         breweryDiv.append(breweryDistance);

        $("#results-content").append(breweryDiv);
    
    }
    initMap(locations);
}

function initMap(locations) {
    $("#map").show();
    $("#map").scroll(function() { 
        $("#FixedDiv").animate({top:$(this).scrollTop()});
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
                    infowindow.setContent(locations[i][0]);
                    infowindow.open(map, marker);
                }
            })(marker, i));
        }
    }

    async function currentLocation(brewerylat,brewerlng) {
        navigator.geolocation.getCurrentPosition(function(position){
            console.log(position);
            var userLat=position.coords.latitude;
            var userLng=position.coords.longitude;
            console.log(userLat);
            console.log(userLng);

            var settings = {
                "url": "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins="
                    +userLat+","+userLng+
                    "&destinations="
                    + brewerylat+","+brewerlng+
                    "&key=AIzaSyCwva93H8v_VpIqPiZ75_0hm0eoKqw4Dgw",
                "method": "GET",
                "timeout": 0,
            };
        
            return $.ajax(settings).then(function (distanceresponse) {
                console.log(distanceresponse);
                distance = distanceresponse.rows[0].elements[0].distance.text;
                console.log(distance);
                return (distance);
            })
        });
    }

  /*async function call2(result1, breweryPlaceid) {
    var settings = {
        "url": "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=place_id:"
            + result1 +
            "&destinations="
            + breweryPlaceid+
            "&key=AIzaSyCwva93H8v_VpIqPiZ75_0hm0eoKqw4Dgw",
        "method": "GET",
        "timeout": 0,
    };

    return $.ajax(settings).then(function (distanceresponse) {
        distance = distanceresponse.rows[0].elements[0].distance.text;
        return (distance);
    })

}*/