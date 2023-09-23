// Create the tile layer that will be the background of our map.
let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
})

// Initialize all the LayerGroups for different earthquake magnitude bins
let layers = {
    depth90plus: new L.LayerGroup(),
    depth70_89: new L.LayerGroup(),
    depth50_69: new L.LayerGroup(),
    depth30_49: new L.LayerGroup(),
    depth10_29: new L.LayerGroup(),
    depth09minus: new L.LayerGroup()
}

// Create the map with layers based on depth
let map = L.map("map", {
    center: [47.00, -95.71],
    zoom: 4,
    layers: [
        layers.depth90plus,
        layers.depth70_89,
        layers.depth50_69,
        layers.depth30_49,
        layers.depth10_29,
        layers.depth09minus
    ]
})

// Add "streetmap" tile layer to the map
streetmap.addTo(map)

// Create overlays object to add to the layer control
let overlays = {
    "90+": layers.depth90plus,
    "70 up to 90": layers.depth70_89,
    "50 up to 70": layers.depth50_69,
    "30 up to 50": layers.depth30_49,
    "10 up to 30": layers.depth10_29,
    "< 10": layers.depth09minus
}

// Create a control to select different magnitude levels
L.control.layers(null, overlays, {collapsed: false}).addTo(map)

// Create a legend
let legendInfo = L.control({position: "bottomright"})

// Insert div with class of "legend"
legendInfo.onAdd = function() {
    let div = L.DomUtil.create("div", "legend")
    return div
}

// Add legend to map
legendInfo.addTo(map)

// Create the color list for each depth bin
let circleColors = {
    depth90plus: "#ff0000",
    depth70_89: "#f34c19",
    depth50_69: "#f39819",
    depth30_49: "#ecdb18",
    depth10_29: "#b1f11e",
    depth09minus: "#41f319"
}

// Perform API call to United States Geological Survey (USGS) GeoJSON
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function(data) {
    // Console log data to review
    console.log("week of earthquakes: ", data)

    // Review data and console log examples for debug purposes
    let features = data.features
    console.log("features", features)
    console.log("locations", features[0].geometry.coordinates)
    console.log("properties", features[0].properties)
    console.log("magnitude", features[0].properties.mag)
    console.log("depth", features[0].geometry.coordinates[2])
    console.log("location description", features[0].properties.place)

    // Create an object to count the number of markers in each layer
    let eqCount = {
        depth90plus: 0,
        depth70_89: 0,
        depth50_69: 0,
        depth30_49: 0,
        depth10_29: 0,
        depth09minus: 0
    }

    // Initialize earthquake magnitude code to use for accessing the appropriate data group
    let eqDepthCode

    // Loop through the earthquakes
    for (i=0; i < features.length; i ++) {
        
        // Create a new object with data from features
        let feature = features[i]
        // Set the eqMagCode based on earthquake depth (3rd item in geometry)
        if (feature.geometry.coordinates[2] >= 90) {
            eqDepthCode = "depth90plus"
        }
        else if (feature.geometry.coordinates[2] >=70) {
            eqDepthCode = "depth70_89"
        }
        else if (feature.geometry.coordinates[2] >=50) {
            eqDepthCode = "depth50_69"
        }
        else if (feature.geometry.coordinates[2] >=30) {
            eqDepthCode = "depth30_49"
        }
        else if (feature.geometry.coordinates[2] >=10) {
            eqDepthCode = "depth10_29"
        }
        else {
            eqDepthCode = "depth09minus"
        }

        // Update earthquake count
        eqCount[eqDepthCode]++
        
        // Create a new marker
        let newMarker = L.circle(
            [feature.geometry.coordinates[1], feature.geometry.coordinates[0]], 
            {
                color: "black",
                fillColor: circleColors[eqDepthCode],
                weight: 1,
                fillOpacity: 0.5,
                radius: 25000 * feature.properties.mag
            }
        )
        // Add marker to appropriate layer
        newMarker.addTo(layers[eqDepthCode])

        // Bind a popup displaying location description and magnitude
        newMarker.bindPopup("<h3>" + feature.properties.place + "</h3><h4>Magnitude: " + feature.properties.mag + "</h4>")
    }

    // Call the update Legen function
    updateLegend(eqCount)
})

function updateLegend(count) {
    document.querySelector(".legend").innerHTML = [
        "<p>USGS All Earthquakes, Past Week</p>",
        "<p class='depth90plus'> Earthquakes with depth >= 90: " + count.depth90plus + "</p>",
        "<p class='depth70_89'> 70 >= depth  < 90: " + count.depth70_89 + "</p>",
        "<p class='depth50_69'> 50 >= depth  < 70: " + count.depth50_69 + "</p>",
        "<p class='depth30_49'> 30 >= depth  < 50: " + count.depth30_49 + "</p>",
        "<p class='depth10_29'> 10 >= depth  < 30: " + count.depth10_29 + "</p>",
        "<p class='depth09minus'> Earthquakes with depth < 10: " + count.depth09minus + "</p>"
    ].join("")
}


