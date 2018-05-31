

//global variable map. Still trying to write in functional style though
var map;
//Used for testing markers
var fishHatch = {lat: 35.285472, lng: -82.790922};

//Adding to global scope because needs to be accessed fast due to async load of Google Maps api
//Reference: https://stackoverflow.com/questions/34466718/googlemaps-does-not-load-on-page-load
window.initMap = function() {
    var map = new google.maps.Map(
      document.getElementById('map'), {zoom: 11, center: fishHatch});

    addMarker(map, fishHatch)
}

function addMarker(map, position){
  return(new google.maps.Marker(
    {position: {lat: position.lat, lng: position.lng}, map: map}));
}
