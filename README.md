# leaflet-challenge
This project displays earthquakes that have been recorded by the United States Geological Survey (USGS) over the past week. Information about location and magnitude are provided. Marker size is representative of magnitude while marker color is representative of how deep the earthquake was in kilometers.

# Features
* Use html to create the core webpage content
* Use css to style the legend aligning it with marker colors
* Use JavaScript to collect the data (D3 library) and create the map (Leaflet library):
    * Collect earthquake data from the last week of USGS records
    * Use the streetmap representing the U.S. as the initial load point
    * Plot all earthquakes (even outside US) recorded in the last week using the geometry coordinates
    * Create markers for each earthquake with the following properties:
        * size relative to magnitude
        * color relative to depth
    * Create popups for each marker that include the folloiwng:
        * Location description
        * Magnitude
        * Depth
    * Create a legend so the user can identify the color meanings
    * Create a overlay menu to allow users to filter based on earthquake depth


# File Notes
* Leaflet-Part-1 contains the code for the features stated above
  * index.html is the webpage to be rendered calling into leaflet, D3, logic.js, and style.css
  * static contains the following folders and files
    * css contains style.css which sets the legend box, color, text color
    * js contains logic.js which includes the code for setting the map using leaflet and collecting the data using D3
  * Images contains screenshots of the webpage
* Starter_Code contains the original download from BCS/Canvas


# References
* United States Geological Survey (USGS) earthquake data was used: https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php 

Example Views: 
<br> 
![Initial Load](Leaflet-Part-1/images/EarthquakeWebsiteOnLoad.png)
<br>
![Zoom In](Leaflet-Part-1/images/EarthquakeWebsiteZoomPopup.png)


# Getting Started

## Prerequisites
You must have a web browser to view the resulting webpage

## Cloning Repo
$ git clone https://github.com/vt-bekah/leaflet-challenge.git

$ cd leaflet-challenge

# Built With
* html
* javascript
* D3 library https://d3js.org/d3.v7.min.js
* Leaflet library https://unpkg.com/leaflet@1.9.4/dist/leaflet.js 



