

//global variable map. Still trying to write in functional style though
var map;
//Used for testing markers
var fishHatch = {lat: 35.285472, lng: -82.790922};
var tileSizePX = 256;
var defaultZoom = 13;


var mapOpts = {
//  streetViewControl: true,
//  mapTypeId: 'Nat Geo',
  center: fishHatch,
  zoom: defaultZoom
/*
  mapTypeControlOptions:{
    mapTypeIds: [
      'USGS 2013', 'USGS TIFF', 'Nat Geo', 'USGS',
      google.maps.MapTypeId.ROADMAP, google.maps.MapTypeId.SATELLITE,
      google.maps.MapTypeId.HYBRID, google.maps.MapTypeId.TERRAIN
    ]
  }*/
}

//Adding to global scope because needs to be accessed fast due to async load of Google Maps api
//Reference: https://stackoverflow.com/questions/34466718/googlemaps-does-not-load-on-page-load
window.initMap = function() {
    var map = new google.maps.Map(
      document.getElementById('map'), mapOpts);

    //init map bounds
    var bounds = new Map();
    bounds.set("name", new google.maps.LatLngBounds(
  		new google.maps.LatLng(35, -84), //sw
  		new google.maps.LatLng(35.8, -82)))

    addMarker(map, fishHatch)
}

function addMarker(map, position){
  return(new google.maps.Marker(
    {position: {lat: position.lat, lng: position.lng}, map: map}));
}

function addMapType(mapName, minZoom, maxZoom){
  return(
    new google.maps.ImageMapType({
      minZoom:minZoom,
      maxZoom:maxZoom,
      getTileUrl:function (coord, zoom) {
          var proj = map.getProjection();
          var tileLength = tileSizePX / Math.pow(2, zoom);
          var tileBounds = new google.maps.LatLngBounds(
            proj.fromPointToLatLng(new google.maps.Point(coord.x * tileLength, (coord.y + 1) * tileLength)),
            proj.fromPointToLatLng(new google.maps.Point((coord.x + 1) * tileLength, coord.y * tileLength))
          );
          if (bounds.get(mapName).intersects(tileBounds) && (minZoom <= zoom) && (zoom <= maxZoom))
            return "natGeo" + "/" + zoom + "/" + coord.x + "/" + coord.y + ".jpg";
          else
            return "none.png";
        },
      tileSize: new google.maps.Size(tileSizePX, tileSizePX),
    	name: mapName,
  		alt: mapName,
  		isPng: true
  }));
}
