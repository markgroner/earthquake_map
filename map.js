// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";
// Creating our initial map object
var accessToken = "pk.eyJ1IjoibWFya2dyb25lciIsImEiOiJjamRoazFtN3AwdzRyMndwZ2dxN3hhaWt0In0.Z1mh0XHT_bO7FNgy2ndWLQ";
var graphCenter = [37.09, -95.71];


function createMapLayer(mapStyle, token) {
  var baseUrl = "https://api.mapbox.com/styles/v1/mapbox/";
  var layerUrl = `${baseUrl}${mapStyle}/tiles/256/{z}/{x}/{y}?access_token=${token}`
  console.log(layerUrl)
  var mapLayer = L.tileLayer(layerUrl);
  return(mapLayer);
}


// Create a map object
var myMap = L.map("map", {
  center: graphCenter,
  zoom: 5
});


var darkmap = createMapLayer("dark-v9", accessToken);
// Add a tile layer
darkmap.addTo(myMap);

// Define a markerSize function that will give each city a different radius based on its population
function markerSize(magnitude) {
  return magnitude * 25000;
}

function getColor(magnitude) {
    return magnitude >= 8  ? '#BD0026' :
           magnitude >= 7  ? '#E31A1C' :
           magnitude >= 6   ? '#FC4E2A' :
           magnitude >= 5.5   ? '#FD8D3C' :
           magnitude >= 2.5   ? '#FEB24C' :
                      '#FED976';
}

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

function createFeatures(featureData) {
    featureData.forEach(function(feature) {
      var latLong = feature.geometry.coordinates.slice(0,2).reverse();
      var dateStamp = Date(feature.properties.time);

      var circle = L.circle(latLong, {
        radius: markerSize(feature.properties.mag),
        color: "black",
        fillColor: getColor(feature.properties.mag),
        fillOpacity: 0.75
      }).addTo(myMap)

      circle.bindPopup(`<h1> ${feature.properties.place} </h1> <hr>
        <h3> Date: ${dateStamp} <\h3>
        <h3> magnitude: ${feature.properties.mag} <\h3>`);
  })
};
