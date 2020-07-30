var i = 0, distance, duration;
var locations = [];
var searched;
var searchedCheck = localStorage.getItem("searched")

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
        searched = true
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
    searched = false
    localStorage.setItem("searched", searched)
});

function breweriesNearby(zipCode) {
    var settings = {
        "url": "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/textsearch/json?query=brewery+in+" + zipCode + "&key=AIzaSyCwva93H8v_VpIqPiZ75_0hm0eoKqw4Dgw",
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "Bearer 6HRV34H2QG8huioiDfP9_Fznc-Ig3gAaHcyGdAzjFquxiOqekhtCetxAkYZXWu-lV5UuqlnR5VWE2D0j8yzqs458Su9bnnRuU0XlrFUxjVymamjNuDVOdJtImV4aX3Yx"
        },
    };
    $.ajax(settings).done(function (response) {
        $("#results-content").empty();
        list(response, zipCode);
    });
}

async function list(response, zipCode) {
    console.log(response)
    var len = response.results.length > 10 ? 10 : response.results.length

    for (i = 0; i < len; i++) {
        var iString = i.toString();

        var breweryDiv = $("<div class='results'>");
        breweryDiv.attr("id", "results" + [i]);

        var breweryImage = $("<img class='brewerylogo'>").attr("src", "./assets/images/sampleimage.jpg");
        breweryDiv.append(breweryImage);

        var breweryname=response.results[i].name;
        var breweryName = $("<p class='title'>").text(response.results[i].name);
        breweryDiv.append(breweryName);
        breweryDiv.attr("data-name", breweryname)
        console.log(breweryDiv.attr("data-name"))

        var bussinesshours=response.results[i].business_status;
        
        if(bussinesshours=="OPERATIONAL"){
            var businessStatus = $("<p>").text("Business Status : Open");
        }
        else{
            var businessStatus = $("<p>").text("Business Status : Closed");
        }

        breweryDiv.append(businessStatus);

        var breweryPlaceid = response.results[i].place_id;

        var result1 = await call1(zipCode);//origin place id

        var result2 = await call2(result1, breweryPlaceid);

        var breweryDistance = $("<p>").text("Distance :" + distance);
        breweryDiv.append(breweryDistance);

        $("#results-content").append(breweryDiv);

        $("#results" + iString).on("click", function (){
            var ref = $(this).attr("data-name")
            console.log(ref)
            getYelp(ref, breweryname, zipCode);
        });

        var lat = response.results[i].geometry.location.lat;
        var lng = response.results[i].geometry.location.lng;
        markers = [breweryname, lat, lng ];

        locations.push(markers);
    }
    initMap(locations);
}

function initMap(locations) {
    $("#map").show();
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 10,
        center: new google.maps.LatLng(37.0902, -95.7129),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    var infowindow = new google.maps.InfoWindow();

    var marker, i;
    for (i = 0; i < locations.length; i++) {
        console.log(locations);
        console.log(locations[i][1],locations[i][2]);
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
        return (distance);
    })
};