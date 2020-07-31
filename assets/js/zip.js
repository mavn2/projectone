var i = 0, distance = "no distance please", duration;
var locations = [];
$(document).ready(function () {
    $("#homepage").show();
    $("#results-content").hide();
    $("#breweries-list").hide();
    $("#map").hide();
});

$("#submit").on("click", async function (event) {
    var zipCode = $("#zip-code").val();//
    if (zipCode === '') {
        console.log("zipcode : " + zipCode);
        return false;
    }
    currentLocation(zipCode);
    $("#zip-code").val("");
});

$("#homeIcon").on("click", function () {
    $("#homepage").show();
    $("#results-content").hide();
    $("#breweries-list").hide();
    $("#map").hide();
    
});

function breweriesNearby(zipCode, userLat, userLng) {

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
        $("#results-content").empty();
        $("#results-content").show();
        list(response, zipCode, userLat, userLng);
    });

}

async function list(response, zipCode, userLat, userLng) {
    var len = response.results.length > 10 ? 10 : response.results.length
    locations = [];
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
        if (userLat === "" || userLng === "") {
            var distance = "You denied me :-(";
        }
        else {
            var brewerylat = response.results[i].geometry.location.lat;
            var brewerylng = response.results[i].geometry.location.lng;
            var distance = await distanceCalc(userLat, userLng, brewerylat, brewerylng);
        }

        var brewerylat = response.results[i].geometry.location.lat;
        var brewerylng = response.results[i].geometry.location.lng;
        markers = [breweryname, brewerylat, brewerylng];
        locations.push(markers);

        var breweryDistance = $("<p>").text("Distance :" + distance);
        breweryDiv.append(breweryDistance);

        $("#results-content").append(breweryDiv);

    }
    initMap(locations);
    console.log(locations);
}

async function currentLocation(zipCode) {
    $("#homepage").hide();
    $("#breweries-list").show();

    navigator.geolocation.watchPosition(function (position) {
        console.log("i'm tracking you!");
        navigator.geolocation.getCurrentPosition(function (position) {
            console.log(position);
            var userLat = position.coords.latitude;
            var userLng = position.coords.longitude;
            console.log(userLat);
            console.log(userLng);
            breweriesNearby(zipCode, userLat, userLng);
        });
    },
        function (error) {
            if (error.code == error.PERMISSION_DENIED)
                console.log("you denied me :-(");
            var userLat = "";
            var userLng = "";
            console.log(userLat,userLng)
            breweriesNearby(zipCode, userLat, userLng);
        });
}

function distanceCalc(userLat, userLng, brewerylat, brewerylng) {
    var settings = {
        "url": "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins="
            + userLat + "," + userLng +
            "&destinations="
            + brewerylat + "," + brewerylng +
            "&key=AIzaSyCwva93H8v_VpIqPiZ75_0hm0eoKqw4Dgw",
        "method": "GET",
        "timeout": 0,
    };

    return $.ajax(settings).then(function (distanceresponse) {
        console.log(distanceresponse);
        distance = distanceresponse.rows[0].elements[0].distance.text;
        console.log(distance);
        return (distance);
    });
}

function initMap(locations) {
    $("#map").show();
    $("#map").empty();
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




