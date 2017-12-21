var map;
var map2 = document.querySelector('.map');
var zoom = document.getElementById('zoom');
var reduce = document.getElementById('reduce');
var normal = document.getElementById('normal');
var cluster = document.getElementById('cluster');
var hide = document.getElementById('hide');
var geolocation = document.getElementById('geolocation');
var submitName = document.getElementById('submitName');
// var inputName = document.getElementById('inputName');
var paris = {lat:48.866667, lng:2.333333 };
var myLatLng = paris;
var locations = [];
var allMarkers = [];
var marker;
var markers;
var markerCluster;
var clusterMarkers = [];
var autocomplete;

function initMap() {

map = new google.maps.Map(document.getElementById('map'), {
    center: myLatLng,
    zoom: 9
});

// var defaultBounds = new google.maps.LatLngBounds(
//   new google.maps.LatLng(-33.8902, 151.1759),
//   new google.maps.LatLng(-33.8474, 151.2631));

var input = document.getElementById('inputName');
var options = {
  // bounds: defaultBounds,
  componentRestrictions:{country:'fr'}
  // types: ['establishment']
};

autocomplete = new google.maps.places.Autocomplete(input, options);

submitName.addEventListener('click', function(event){
  // console.log(autocomplete.getPlace().geometry.location);
  var inputGps = autocomplete.getPlace().geometry.location;
  map.setCenter(inputGps);
  map.setZoom(15);
  input.value = '';
  marker = new google.maps.Marker({
        position: inputGps,
        map: map
      });
  allMarkers.push(marker);
  console.log(allMarkers);
  marker.addListener('click', function(event){
    for(let mk of allMarkers){
      if(mk.position == event.latLng){
        mk.setMap(null);
        let index = allMarkers.indexOf(mk);
        allMarkers.splice(index,1);
      }
    }
  });
  event.preventDefault();
});

geolocation.addEventListener('click', function(){

  var infoWindow = new google.maps.InfoWindow({map: map});

  if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
              var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
              };

              infoWindow.setPosition(pos);
              infoWindow.setContent('Location found.');
              map.setCenter(pos);
              map.setZoom(18);

              marker = new google.maps.Marker({
                    position: pos,
                    map: map
                  });
              allMarkers.push(marker);
              console.log(allMarkers);


              marker.addListener('click', function(event){
                console.log(event);
                for(let mk of allMarkers){
                  if(mk.position == event.latLng){
                    mk.setMap(null);
                    let index = allMarkers.indexOf(mk);
                    allMarkers.splice(index,1);
                  }
                }
              });
            }, function() {
              handleLocationError(true, infoWindow, map.getCenter());
            });
          } else {
            // Browser doesn't support Geolocation
            handleLocationError(false, infoWindow, map.getCenter());
          }
  });


map.addListener('click', function(event){
    map.setCenter(event.latLng);
    myLatLng = event.latLng;

    marker = new google.maps.Marker({
          position: event.latLng,
          map: map
        });
    allMarkers.push(marker);

    marker.addListener('click', function(event){
      for(let mk of allMarkers){
        if(mk.position == event.latLng){
          mk.setMap(null);
          let index = allMarkers.indexOf(mk);
          allMarkers.splice(index,1);
        }
      }
    });

  });



  zoom.addEventListener('click', function(){
    map.setZoom(12);
  });

  reduce.addEventListener('click', function(){
    map.setZoom(5);
  });

  normal.addEventListener('click', function(){
    map.setZoom(10);
    map.setCenter(paris);
  });

  cluster.addEventListener('click', function(){

    for(let mk of allMarkers){
      mk.setMap(null);
    }

    locations.push(...allMarkers);
    allMarkers = [];

    var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    var markers = locations.map(function(location, i) {
            return new google.maps.Marker({
              position: location.position,
              label: labels[i % labels.length]
            });
          });

    markerCluster = new MarkerClusterer(map, markers);

    clusterMarkers.push(markerCluster);
    console.log(clusterMarkers);

    markerCluster.addListener('clusterclick', function(event){
      console.log(event);
      setTimeout(function(){
        console.log(allMarkers);
        allMarkers[allMarkers.length-1].setMap(null);
        allMarkers.pop(allMarkers.length-1);
      }, 10);
    });

    // markerCluster.addEventListener('click', function(event){
    //   console.log(event);
    // });

  });

  hide.addEventListener('click', function(){
    for(let mk of allMarkers){
      mk.setMap(null);
    }
    locations = [];
    markers=[];

    for(let cmk of clusterMarkers){
        cmk.clearMarkers();
    }
    clusterMarkers = [];
    // markerCluster.clearMarkers();
    // console.log(markerCluster);
  });

}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
                              'Error: The Geolocation service failed.' :
                              'Error: Your browser doesn\'t support geolocation.');
      }
