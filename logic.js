// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

// Creating our initial map object
var accessToken = "pk.eyJ1IjoibWFya2dyb25lciIsImEiOiJjamRoazFtN3AwdzRyMndwZ2dxN3hhaWt0In0.Z1mh0XHT_bO7FNgy2ndWLQ";
var graphCenter = [37.09, -95.71];


// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    L.circle(feature.geometry.coordinates, {
      fillOpacity: 0.75,
      color: "white",
      fillColor: "purple",
      // Setting our circle's radius equal to the output of our markerSize function
      // This will make our marker's size proportionate to its population
      radius: markerSize(feature.properties.mag)
    }).bindPopup("<h3>" + feature.properties.place +
          "</h3><hr><p>" + new Date(feature.properties.time) + "</p>").addTo(myMap);
  }


  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature
  });

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}


function createMapLayer(mapStyle, token) {
  var base_url = "https://api.mapbox.com/styles/v1/mapbox/";
  var layer_url = `${base_url}${mapStyle}/tiles/256/{z}/{x}/{y}?access_token=${token}`
  var mapLayer = L.tileLayer(layer_url);
  return(mapLayer);
}
function createMap(earthquakes) {

  // Define streetmap and darkmap layers
  var streetmap = createMapLayer("outdoors-v10", accessToken);

  var darkmap = createMapLayer("dark-v9", accessToken);

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: graphCenter,
    zoom: 5,
    layers: [streetmap, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}
