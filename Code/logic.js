// Create a map object
  var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5
  });
  
  // Adding tile layer to the map
  L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  }).addTo(myMap);

  
  
  // Assemble API query URL
  var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_week.geojson";
  var url2 = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"


d3.json(url, function(response) {
  console.log(response.features)
});
 
function createMarkers(response) {
  // Pull the "stations" property off of response.data
  var quakes = response.features;
  console.log(quakes)

  // Initialize an array to hold bike markers
  var quakeMarkers = [];
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      
  // Loop through the stations array
  for (var index = 0; index < quakes.length; index++) {
    var quake = quakes[index];

    var color = "";
    if (quake.properties.mag > 8) {
      color = "darkred";
    }
    else if (quake.properties.mags > 7) {
      color = "red";
    }
    else if (quake.properties.mag > 6) {
      color = "orange";
    }
    else if (quake.properties.mag > 5) {
      color = "gold";
    }
    else if (quake.properties.mag > 4) {
      color = "yellow";
    }
    else if (quake.properties.mag > 3) {
      color = "green";
    }
    else {
      color = "lightgreen";
    }

    // For each station, create a marker and bind a popup with the station's name
    // var quakeMarker = L.marker([quake.geometry.coordinates[0], quake.geometry.coordinates[1]]);
    L.circle([quake.geometry.coordinates[1], quake.geometry.coordinates[0]], {
      fillOpacity: 0.75,
      color: color,
      fillColor: color,
      radius: quake.properties.mag * 10000
    })
      .bindPopup("<h3>Magnitude: " + quake.properties.mag + "</h3> <hr> <h3>Latitude: "
      + quake.geometry.coordinates[0] + "</h3> <hr> <h4>Longitude: " +
      quake.geometry.coordinates[1]).addTo(myMap);
    
  }
};


//Color function for legend
function getColor(d) {
  return d > 8 ? 'darkred' :
         d > 7  ? 'red' :
         d > 6  ? 'orange' :
         d > 5  ? 'gold' :
         d > 4   ? 'yellow ' :
         d > 3   ? 'green' :
              'lightgreen' ;
};

//Creating legend
var legend = L.control({position: 'bottomright'});

legend.onAdd = function (myMap) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 3, 4, 5, 6, 7, 8],
        labels = ['<strong>Magnitude</strong>']

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i class ="square" style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(myMap);


d3.json(url2, createMarkers);

