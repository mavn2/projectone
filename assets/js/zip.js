var i = 0, distance, duration;
locations = [];
$(document).ready(function () {
    $("#homepage").show();
    $("#results-content").hide();
    $("#breweries-list").hide();
    $("#map").hide();
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
});

$("#homeIcon").on("click", function () {
    $("#homepage").show();
    $("#results-content").hide();
    $("#breweries-list").hide();
});

function breweriesNearby(zipCode) {
    console.log("test : " + zipCode);
    //API URL for fetching the temperature
    var settings = {
        "url": "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/textsearch/json?query=brewery+in+" + zipCode + "&key=AIzaSyCwva93H8v_VpIqPiZ75_0hm0eoKqw4Dgw",
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "Bearer 6HRV34H2QG8huioiDfP9_Fznc-Ig3gAaHcyGdAzjFquxiOqekhtCetxAkYZXWu-lV5UuqlnR5VWE2D0j8yzqs458Su9bnnRuU0XlrFUxjVymamjNuDVOdJtImV4aX3Yx"
        },
    };
    $.ajax(settings).done(function (response) {
        console.log(response);
        $("#results-content").empty();
        list(response, zipCode);
    });
}

async function list(response, zipCode) {
    var len = response.results.length > 10 ? 10 : response.results.length
    console.log("len:", len);

    for (i = 0; i < len; i++) {

        var breweryDiv = $("<div class='results'>");
        breweryDiv.attr("id", "results" + [i]);

        var breweryImage = $("<img class='brewerylogo'>").attr("src", "./assets/images/sampleimage.jpg");
        breweryDiv.append(breweryImage);

        var breweryName = $("<p class='title'>").text(response.results[i].name);
        breweryDiv.append(breweryName);

        var businessStatus = $("<p>").text("Business Status : " + response.results[i].business_status);
        breweryDiv.append(businessStatus);

        var breweryPlaceid = response.results[i].place_id;
        console.log("brewery : " + breweryPlaceid);

        var result1 = await call1(zipCode);
        console.log(result1);

        var result2 = await call2(result1, breweryPlaceid);
        console.log(result2);

        var breweryDistance = $("<p>").text("distance :" + result2[0]);
        breweryDiv.append(breweryDistance);

        var travelDuration = $("<p>").text("duration : " + result2[1]);
        breweryDiv.append(travelDuration);

        $("#results-content").append(breweryDiv);

        var lat = response.results[i].geometry.location.lat;
        var lng = response.results[i].geometry.location.lng;
        markers = {breweryName, lat, lng };

        locations.push(markers);

    }
    initMap(locations);
}

function initMap(locations) {
    console.log(locations);
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 10,
        center: new google.maps.LatLng(37.0902, 95.7129),
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

async function call1(zipCode) {
    var settings = {
        "url": "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/textsearch/json?query=" + zipCode + "&key=AIzaSyCwva93H8v_VpIqPiZ75_0hm0eoKqw4Dgw",
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "Bearer 6HRV34H2QG8huioiDfP9_Fznc-Ig3gAaHcyGdAzjFquxiOqekhtCetxAkYZXWu-lV5UuqlnR5VWE2D0j8yzqs458Su9bnnRuU0XlrFUxjVymamjNuDVOdJtImV4aX3Yx"
        },
    };

    return $.ajax(settings).then(function (originresponse) {
        var placeId = originresponse.results[0].place_id;
        return placeId;
    });
}

async function call2(placeId, breweryPlaceid) {
    var settings = {
        "url": "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=place_id:" + placeId + "&destinations=place_id:" + breweryPlaceid + "&key=AIzaSyCwva93H8v_VpIqPiZ75_0hm0eoKqw4Dgw",
        "method": "GET",
        "timeout": 0,
    };

    return $.ajax(settings).then(function (distanceresponse) {
        distance = distanceresponse.rows[0].elements[0].distance.text;
        duration = distanceresponse.rows[0].elements[0].duration.text;
        return ([distance, duration]);
    })

}