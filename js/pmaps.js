//global variable map. Still trying to write in functional style though
var map;
var mapTypes;

//Used for testing markers
var fishHatch = {
  lat: 35.285472,
  lng: -82.790922
};
var tileSizePX = 256;
var defaultZoom = 13;

var mapOpts = {
  //  streetViewControl: true,
  //  mapTypeId: 'Nat Geo',
  center: fishHatch,
  zoom: defaultZoom,

    mapTypeControlOptions:{
      mapTypeIds: [ 'Nat Geo',
        'USGS 2013', 'USGS TIFF', 'USGS'
      //  google.maps.MapTypeId.ROADMAP, google.maps.MapTypeId.SATELLITE,
      //  google.maps.MapTypeId.HYBRID, google.maps.MapTypeId.TERRAIN
      ]
    }
}



//Adding to global scope because needs to be accessed fast due to async load of Google Maps api
//Reference: https://stackoverflow.com/questions/34466718/googlemaps-does-not-load-on-page-load
window.initMap = function() {
  firebase.database().ref().child("mapTypes").once('value').then(
    function(snapshot){
      mapTypes = snapshot.val().map(mapType =>
        createMapType(mapType.name, mapType.id, mapType.minZoom, mapType.maxZoom,
          createMapBounds(mapType.swBound.lat,mapType.swBound.long, mapType.neBound.lat, mapType.neBound.long),
          mapType.fileType
        )
      )
        console.log(snapshot.val()[0].neBound.lat + " " + snapshot.val()[0].neBound.lng);
        console.log(snapshot.val());
        console.log("map bounds created");
        console.log(mapTypes)
      createMap();
    },
    function(error){
      console.error(error);
    });
}

function createMap(){
    map = new google.maps.Map(
      document.getElementById('map'), mapOpts);

      console.log("check mapTypes");
    mapTypes.forEach(type => map.mapTypes.set(type.name, type));

    //init map bounds
    var bounds = new Map();
    bounds.set("name", new google.maps.LatLngBounds(
      new google.maps.LatLng(35, -84), //sw
      new google.maps.LatLng(35.8, -82)))
}


function addMarker(map, position) {
  return (new google.maps.Marker({
    position: {
      lat: position.lat,
      lng: position.lng
    },
    map: map
  }));
}


function createMapBounds(swLat, swLng, neLat, neLng){
  return(
    new google.maps.LatLngBounds(
      new google.maps.LatLng(swLat, swLng),
      new google.maps.LatLng(neLat, neLng)
    )
  );
}

function createMapType(mapName, mapID, minZoom, maxZoom, bounds, imgFileType) {
  return (
    new google.maps.ImageMapType({
      minZoom: minZoom,
      maxZoom: maxZoom,
      getTileUrl: function(coord, zoom) {
        var proj = map.getProjection();
        var tileLength = tileSizePX / Math.pow(2, zoom);
        var tileBounds = new google.maps.LatLngBounds(
          proj.fromPointToLatLng(new google.maps.Point(coord.x * tileLength, (coord.y + 1) * tileLength)),
          proj.fromPointToLatLng(new google.maps.Point((coord.x + 1) * tileLength, coord.y * tileLength))
        );
        console.log(bounds);
        console.log(tileBounds);
        console.log(bounds.intersects(tileBounds));
        console.log("zoom " + zoom);
        console.log("minZoom " + minZoom);
        console.log("maxZoom " + maxZoom);

        if (bounds.intersects(tileBounds) && (minZoom <= zoom) && (zoom <= maxZoom))
          return "historic_pmaps/" + mapID + "/" + zoom + "/" + coord.x + "/" + coord.y + imgFileType;
        else
          return "historic_pmaps/" + "none.png";
      },
      tileSize: new google.maps.Size(tileSizePX, tileSizePX),
      name: mapName,
      alt: mapName,
      isPng: imgFileType === ".png"
    }));
}
