// Create the tile layer that will be the background of our map.
let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
})

// Initialize all the LayerGroups for different earthquake depth bins
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
    "Depth 90+km": layers.depth90plus,
    "70km up to 90km": layers.depth70_89,
    "50km up to 70km": layers.depth50_69,
    "30km up to 50km": layers.depth30_49,
    "10km up to 30km": layers.depth10_29,
    "Depth < 10km": layers.depth09minus
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
    depth90plus: "#ff0505",
    depth70_89: "#fc4c00",
    depth50_69: "#f38a19",
    depth30_49: "#ecb318e4",
    depth10_29: "#f6cb1e",
    depth09minus: "#fbff00"
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
    console.log("dataset: ", data.metadata.title)

    // Capture title in a variable
    dataTitle = data.metadata.title

    // Create an object to count the number of markers in each layer
    let eqCount = {
        depth90plus: 0,
        depth70_89: 0,
        depth50_69: 0,
        depth30_49: 0,
        depth10_29: 0,
        depth09minus: 0
    }

    // Initialize earthquake depth code to use for accessing the appropriate data group
    let eqDepthCode

    // Loop through the earthquakes
    for (i=0; i < features.length; i ++) {
        
        // Create a new object with data from features
        let feature = features[i]
        // Set the eqDepthCode based on earthquake depth (3rd item in geometry coordinates)
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
                fillOpacity: 0.6,
                radius: 25000 * feature.properties.mag
            }
        )
        // Add marker to appropriate layer
        newMarker.addTo(layers[eqDepthCode])

        // Bind a popup displaying location description and magnitude
        newMarker.bindPopup("<h3>" + feature.properties.place + 
                            "</h3><h4>Magnitude: " + feature.properties.mag + 
                            " <br>Depth: " + feature.geometry.coordinates[2] + "km</h4>")
    }

    // Call the update legend function
    updateLegend(eqCount, dataTitle)
})

function updateLegend(count, title) {
    document.querySelector(".legend").innerHTML = [
        "<h2>" + title + "</h2>",
        "<table>",
            "<tr class='depth90plus'>", 
                "<td style='background-color: #ff0505;'>.....</td>",
                "<td> Earthquakes with depth >= 90km: " + count.depth90plus + "</td>",
            "</tr>",
            "<tr class='depth70_89'>", 
                "<td style='background-color: #fc4c00;'>.....</td>",
                "<td> 70km >= depth  < 90km: " + count.depth70_89 + "</td>",
            "</tr>",
            "<tr class='depth50_69'>", 
                "<td style='background-color: #f38a19;'>.....</td>",
                "<td> 50km >= depth  < 70km: " + count.depth50_69 + "</td>",
            "</tr>",
            "<tr class='depth30_49'>", 
                "<td style='background-color: #ecb318e4;'>.....</td>",
                "<td> 30km >= depth  < 50km: " + count.depth30_49 + "</td>",
            "</tr>",
            "<tr class='depth10_29'>", 
                "<td style='background-color: #f6cb1e;'>.....</td>",
                "<td> 10km >= depth  < 30km: " + count.depth10_29 + "</td>",
            "</tr>",
            "<tr class='depth09minus'>", 
                "<td style='background-color: #fbff00;'>.....</td>",
                "<td> Earthquakes with depth < 10km: " + count.depth09minus + "</td>"
    ].join("")
}



{/* <table>
    <tr>
        <td style="background-color: #d7191c;">3000 to 3017</td>
    </tr>
    <tr>
        <td style="background-color: #f07c4a;">2500 to 3000</td>
    </tr>
    <!-- etc -->
</table> */}