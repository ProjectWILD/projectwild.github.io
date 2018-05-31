
  var map;

  function initMap() {
    return(
      map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 35.285472, lng: -82.790922},
        zoom: 11
      })
    );
  }
