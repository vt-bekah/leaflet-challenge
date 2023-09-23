// Create the tile layer that will be the background of our map.
let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
})

// Initialize all the LayerGroup
let layers = {
    earthquakesWeek: new L.LayerGroup()
}

// Create the map with layers
let map = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5,
    layers: [layers.earthquakesWeek]
})

// Add "streetmap" tile layer to the map
streetmap.addTo(map)

// Create a legend
let legendInfo = L.control({position: "bottomright"})

// Insert div with class of "legend"
legendInfo.onAdd = function() {
    let div = L.DomUtil.create("div", "legend")
    return div
}

// Add legend to map
legendInfo.addTo(map)

// Perform API call to United States Geological Survey (USGS) GeoJSON
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function(data) {
    // Console log data to review
    console.log("week of earthquakes: ", data)

    // Review data and console log examples for debug purposes
    let features = data.features
    console.log("features", features)
    console.log("locations", features[0].geometry)
    console.log("properties", features[0].properties)
    console.log("magnitude", features[0].properties.mag)
    console.log("depth", features[0].geometry.coordinates[2])
    console.log("location description", features[0].properties.place)

})