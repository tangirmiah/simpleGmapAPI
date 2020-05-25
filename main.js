let map;
let globalBtnMarkerCount = 1;
let randomColor;
let prevMarker = null;
let antipodeMarker = null;
let antipodeMarker1 = null;
let btn4Clicked = false;
let btn4center = null;
let squareMarkerGlobal1,
  squareMarkerGlobal2,
  squareMarkerGlobal3,
  squareMarkerGlobal4;
let btn5Clicked = false;
let mapListener;
let myPolygon = null;
let btn6Clicked = false;

let etineraryBtn6;

function initMap() {
  etineraryBtn6 = new google.maps.MVCArray();
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 51.509865, lng: -0.118092 },
    zoom: 11.5,
    mapTypeId: "terrain"
  });

  //adding listener to hover the map
  map.addListener("mouseover", function() {
    if (myPolygon != null) {
      console.log("this is needed to change color on hover for the polygonsc");
    }
  });

  //
}

$("#center-btn").click(function() {
  map.setCenter(
    new google.maps.LatLng($("#input-lat").val(), $("#input-lon").val())
  );
});

//button 1
$("#modal-btn1").click(function() {
  //getting random color
  randomColor = (0x1000000 + Math.random() * 0xffffff)
    .toString(16)
    .substr(1, 6);

  const icon = `http://www.googlemapsmarkers.com/v1/${globalBtnMarkerCount}/${randomColor}/`;
  //console.log(icon);

  prevMarker = new google.maps.Marker({
    position: new google.maps.LatLng(
      $("#input-lat-btn1").val(),
      $("#input-lon-btn1").val()
    ),
    map: map,
    icon: icon
  });
  globalBtnMarkerCount++;
  //center map to new marker
  map.setCenter(
    new google.maps.LatLng(
      $("#input-lat-btn1").val(),
      $("#input-lon-btn1").val()
    )
  );
});

//button 2
$("#btn-2").click(function() {
  let lat, lng;
  if (prevMarker == null) {
    lat = Math.random() * 180 - 90;
    lng = Math.random() * 360 - 180;
  } else {
    let distantEnough = false;

    while (!distantEnough) {
      lat = Math.random() * 180 - 90;
      lng = Math.random() * 360 - 180;

      var distanceInMeters = google.maps.geometry.spherical.computeDistanceBetween(
        prevMarker.getPosition(),
        new google.maps.LatLng(lat, lng)
      );
      //check if distance is 300km from previous one
      if (distanceInMeters * 0.001 <= 300) {
        distantEnough = true;
      }
    }
  }

  //getting random color
  randomColor = (0x1000000 + Math.random() * 0xffffff)
    .toString(16)
    .substr(1, 6);

  const icon = `http://www.googlemapsmarkers.com/v1/${globalBtnMarkerCount}/${randomColor}/`;

  prevMarker = new google.maps.Marker({
    position: new google.maps.LatLng(lat, lng),
    map: map,
    icon: icon
  });

  globalBtnMarkerCount++;
  //center map to new marker
  //map.setCenter(new google.maps.LatLng(lat, lng));
  map.setZoom(8);
  map.panTo(prevMarker.position);
});

//button 3
$("#modal-btn3").click(function() {
  //getting random color
  randomColor = (0x1000000 + Math.random() * 0xffffff)
    .toString(16)
    .substr(1, 6);

  const icon = `http://www.googlemapsmarkers.com/v1/${randomColor}/`;
  console.log(icon);

  antipodeMarker = new google.maps.Marker({
    position: new google.maps.LatLng(
      $("#input-lat-btn3").val(),
      $("#input-lon-btn3").val()
    ),
    map: map,
    icon: icon
  });

  //center map to new marker
  map.setCenter(
    new google.maps.LatLng(
      $("#input-lat-btn3").val(),
      $("#input-lon-btn3").val()
    )
  );

  antipodeMarker.addListener("click", function() {
    const icon = `http://www.googlemapsmarkers.com/v1/${randomColor}/`;
    console.log(icon);
    antipodeMarker1 = new google.maps.Marker({
      position: new google.maps.LatLng(
        antipodeMarker.getPosition().lat() * -1,
        antipodeMarker.getPosition().lng() - 180
      ),
      map: map,
      icon: icon
    });
    //console.log(antipodeMarker1.getPosition().toString());
    //center map to antipode marker
    map.setCenter(
      new google.maps.LatLng(
        antipodeMarker1.getPosition().lat(),
        antipodeMarker1.getPosition().lng()
      )
    );

    antipodeMarker1.addListener("click", function() {
      //center map to main marker
      map.setCenter(
        new google.maps.LatLng(
          antipodeMarker.getPosition().lat(),
          antipodeMarker.getPosition().lng()
        )
      );
    });
  });
});

//Button 4
$("#btn-4").click(function() {
  // this will allow easily to put info on markers
  const makeInfoWindow = (marker, openedInfo) => {
    //make infoWindow
    let infoWin = new google.maps.InfoWindow({
      content: `
      <div class="container">
        <div> 
            <h3>Latitude: ${marker.getPosition().lat()}, </br>
              Longitude: ${marker.getPosition().lng()}
            </h3>
        </div>
        </br>
        <div> 
      <img src="https://maps.googleapis.com/maps/api/streetview?size=600x200&location=${marker
        .getPosition()
        .lat()},${marker
        .getPosition()
        .lng()}&key=AIzaSyD_gHvNobQD5E9nxwJCFK2fBw8gpsTP1nQ" class="img-responsive img-fit-contain"/>
        
        </div>
      </div>`
    });

    marker.addListener("click", () => {
      if (openedInfo) {
        infoWin.open(map, marker);
        openedInfo = false;
      } else {
        infoWin.close();
        openedInfo = true;
      }
    });
  };

  ///

  let randomDistance = Math.random();
  let opened = [true, true, true, true, true];
  if (!btn4Clicked) {
    $("#modal-btn4").click(function() {
      $("#btn-4").removeClass("btn-primary");
      $("#btn-4").addClass("btn-success");
      $("#btn-4").attr(
        "data-tooltip",
        "click the button again \n to get random markers inside the square "
      );
      btn4Clicked = true;
      const icon = `http://www.googlemapsmarkers.com/v1/E60000/`;
      btn4center = new google.maps.Marker({
        position: new google.maps.LatLng(
          $("#input-lat-btn4").val(),
          $("#input-lon-btn4").val()
        ),
        map: map,
        icon: icon
      });

      //center map to new marker
      // map.setCenter(
      //   new google.maps.LatLng(
      //     $("#input-lat-btn4").val(),
      //     $("#input-lon-btn4").val()
      //   )
      // );

      map.setZoom(8);
      map.panTo(btn4center.position);
      makeInfoWindow(btn4center, opened[0]);
      // make the 4 green markes
      let g1 = new google.maps.Marker({
        position: new google.maps.LatLng(
          parseFloat($("#input-lat-btn4").val()) + randomDistance,
          parseFloat($("#input-lon-btn4").val()) + randomDistance * 2
        ),
        map: map,
        icon: `http://www.googlemapsmarkers.com/v1/005900/`
      });
      makeInfoWindow(g1, opened[1]);
      let g2 = new google.maps.Marker({
        position: new google.maps.LatLng(
          parseFloat($("#input-lat-btn4").val()) + randomDistance,
          parseFloat($("#input-lon-btn4").val()) - randomDistance * 2
        ),
        map: map,
        icon: `http://www.googlemapsmarkers.com/v1/005900/`
      });
      makeInfoWindow(g2, opened[2]);
      let g3 = new google.maps.Marker({
        position: new google.maps.LatLng(
          parseFloat($("#input-lat-btn4").val()) - randomDistance,
          parseFloat($("#input-lon-btn4").val()) + randomDistance * 2
        ),
        map: map,
        icon: `http://www.googlemapsmarkers.com/v1/005900/`
      });
      makeInfoWindow(g3, opened[3]);
      let g4 = new google.maps.Marker({
        position: new google.maps.LatLng(
          parseFloat($("#input-lat-btn4").val()) - randomDistance,
          parseFloat($("#input-lon-btn4").val()) - randomDistance * 2
        ),
        map: map,
        icon: `http://www.googlemapsmarkers.com/v1/005900/`
      });
      makeInfoWindow(g4, opened[4]);

      squareMarkerGlobal1 = g1;
      squareMarkerGlobal2 = g2;
      squareMarkerGlobal3 = g3;
      squareMarkerGlobal4 = g4;
      // console.log(
      //   google.maps.geometry.spherical.computeDistanceBetween(
      //     g4.getPosition(),
      //     g1.getPosition()
      //   )
      // );
    });
  } else {
    $("#btn-4").attr("href", "#");

    //getting random color
    randomColor = (0x1000000 + Math.random() * 0xffffff)
      .toString(16)
      .substr(1, 6);

    const icon = `http://www.googlemapsmarkers.com/v1/${randomColor}/`;
    //old code, mathmatical distanc, is not working on  map since it's not a perfect globe
    // let lat, lng;

    // lat =
    //   Math.random() *
    //     (parseFloat($("#input-lat-btn4").val()) +
    //       randomDistance -
    //       (parseFloat($("#input-lat-btn4").val()) - randomDistance)) +
    //   (parseFloat($("#input-lat-btn4").val()) - randomDistance);
    // lng =
    //   Math.random() *
    //     (parseFloat($("#input-lon-btn4").val()) +
    //       randomDistance -
    //       (parseFloat($("#input-lon-btn4").val()) - randomDistance)) +
    //   (parseFloat($("#input-lon-btn4").val()) - randomDistance);

    let pos1 = google.maps.geometry.spherical.interpolate(
      squareMarkerGlobal1.getPosition(),
      squareMarkerGlobal3.getPosition(),
      Math.random()
    );
    let pos2 = google.maps.geometry.spherical.interpolate(
      squareMarkerGlobal4.getPosition(),
      squareMarkerGlobal2.getPosition(),
      Math.random()
    );
    new google.maps.Marker({
      //position: new google.maps.LatLng(lat, lng),
      position: google.maps.geometry.spherical.interpolate(
        pos1,
        pos2,
        Math.random()
      ),
      map: map,
      icon: icon
    });
  }
});

///Button 5
$("#btn-5").click(function() {
  let strokeColorRandom = (0x1000000 + Math.random() * 0xffffff)
    .toString(16)
    .substr(1, 6);
  let fillColorRandom = (0x1000000 + Math.random() * 0xffffff)
    .toString(16)
    .substr(1, 6);
  let fillColorRandom2 = (0x1000000 + Math.random() * 0xffffff)
    .toString(16)
    .substr(1, 6);

  if (!btn5Clicked) {
    $("#btn-5").removeClass("btn-primary");
    $("#btn-5").addClass("btn-error");
    $("#btn-5").attr(
      "data-tooltip",
      "Click on map to draw or \n click again to disable draw"
    );
    btn5Clicked = true;

    let polyPath = new google.maps.MVCArray();
    myPolygon = new google.maps.Polygon({
      path: polyPath,
      strokeColor: "#" + strokeColorRandom,
      strokeOpacity: 0.8,
      strokeWeight: 5,
      fillColor: "#" + fillColorRandom,
      fillOpacity: 0.9
    });
    myPolygon.setMap(map);

    mapListener = map.addListener("click", function(clickOnPosition) {
      let tempMark = new google.maps.Marker({
        position: clickOnPosition.latLng,
        animation: google.maps.Animation.DROP,
        icon: "https://img.icons8.com/doodle/48/000000/marker--v1.png",
        map: map
      });

      polyPath.push(clickOnPosition.latLng);
    });

    //changing color on hover
    myPolygon.addListener("mouseover", function() {
      this.setOptions({
        fillColor: "#" + fillColorRandom2
      });

      //adding markers to path inside polygon
      myPolygon.addListener("mousemove", function(mousePositionInPoly) {
        if (polyPath.length > 2) {
          new google.maps.Marker({
            position: mousePositionInPoly.latLng,
            icon:
              "https://img.icons8.com/material-outlined/16/000000/marker.png",
            map: map
          });
        }
      });
    });
    myPolygon.addListener("mouseout", function() {
      this.setOptions({
        fillColor: "#" + fillColorRandom
      });
    });
  } else {
    $("#btn-5").removeClass("btn-error");
    $("#btn-5").addClass("btn-primary");
    $("#btn-5").attr("data-tooltip", "Enable map drawing");
    btn5Clicked = false;

    google.maps.event.removeListener(mapListener);
  }
});

/// Button 6
$("#btn-6").click(function() {
  // this will allow easily to put info on markers
  const makeInfoWindow = (marker, openedInfo) => {
    //make infoWindow
    let infoWin = new google.maps.InfoWindow({
      content: `
      <div class="container">
        
        <div id="panoramic${marker
          .getPosition()
          .lat()}${marker
        .getPosition()
        .lng()}" style="width:600px; height: 300px;"> 
        </div>
      </div>`
    });

    marker.addListener("click", () => {
      if (openedInfo) {
        infoWin.open(map, marker);
        let panorama = new google.maps.StreetViewPanorama(
          document.getElementById(
            `panoramic${marker
              .getPosition()
              .lat()}${marker.getPosition().lng()}`
          ),
          {
            position: {
              lat: marker.getPosition().lat(),
              lng: marker.getPosition().lng()
            },
            pov: { heading: 0, pitch: -30 },
            zoom: 0,
            panControl: false,
            linksControl: false,
            clickToGo: false
          }
        );
        openedInfo = false;
      } else {
        infoWin.close();
        openedInfo = true;
      }
    });
  };
  if (!btn6Clicked) {
    $("#btn-6").removeClass("btn-primary");
    $("#btn-6").addClass("btn-error");
    $("#btn-6").attr(
      "data-tooltip",
      "Make markers on where you want to \nvisit on the map.  \nClick button again to draw path"
    );
    btn6Clicked = true;

    mapListener = map.addListener("click", function(clickOnPosition) {
      //getting random color
      randomColor = (0x1000000 + Math.random() * 0xffffff)
        .toString(16)
        .substr(1, 6);

      const icon = `http://www.googlemapsmarkers.com/v1/${randomColor}/`;
      let tempMark = new google.maps.Marker({
        position: clickOnPosition.latLng,
        animation: google.maps.Animation.DROP,
        icon: icon,
        map: map
      });

      makeInfoWindow(tempMark, false);

      etineraryBtn6.push(clickOnPosition.latLng);
    });
  } else {
    $("#btn-6").removeClass("btn-error");
    $("#btn-6").addClass("btn-primary");
    $("#btn-6").attr("data-tooltip", "Make a panoramic trip");
    btn6Clicked = false;

    /*after adding the markers that should be the routes, the program will iterate through 
    the mvcArray of this markers, each element of the array are both start and end point for
    the mini routes, except for the fist point and the last point, which are start and end. 
    all together the "mini" routes put together forms the complete route*/
    for (let i = 0; i < etineraryBtn6.getArray().length - 1; i++) {
      //getting the color for the different routes
      let randomRouteColor = (0x1000000 + Math.random() * 0xffffff)
        .toString(16)
        .substr(1, 6);

      //making the routes
      let directionsService = new google.maps.DirectionsService();
      let directionsRenderer = new google.maps.DirectionsRenderer({
        polylineOptions: {
          strokeColor: "#" + randomRouteColor
        },
        suppressMarkers: true
      });
      //assigning current "mini route" to the map and rendering it
      directionsRenderer.setMap(map);
      directionsService.route(
        {
          origin: new google.maps.LatLng(
            etineraryBtn6.getArray()[i].lat(),
            etineraryBtn6.getArray()[i].lng()
          ),
          destination: new google.maps.LatLng(
            etineraryBtn6.getArray()[i + 1].lat(),
            etineraryBtn6.getArray()[i + 1].lng()
          ),
          travelMode: "DRIVING"
        },
        function(response, status) {
          if (status === "OK") {
            directionsRenderer.setDirections(response);
          } else {
            window.alert("Directions request failed due to " + status);
          }
        }
      );
    }

    google.maps.event.removeListener(mapListener);

    etineraryBtn6.clear();
  }
});
