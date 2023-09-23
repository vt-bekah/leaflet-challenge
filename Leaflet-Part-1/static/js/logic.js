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
