// From http://leafletjs.com/examples/choropleth/us-states.js
// Example data: states <- geojsonio::geojson_read("json/us-states.geojson", what = "sp")

queryUrl <- geojsonio::geojson_read("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", what = "sp") ;

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});


bins <- c(0, 1, 2, 3, 4, 5, 6, 7, 8, Inf)
pal <- colorBin("YlOrRd", domain = queryUrl$density, bins = bins)

labels <- sprintf(
  "<strong>%s</strong><br/>%g people / mi<sup>2</sup>",
  queryUrl$name, queryUrl$density
) %>% lapply(htmltools::HTML)

leaflet(queryUrl) %>%
  setView(-96, 37.8, 4) %>%
  addProviderTiles("MapBox", options = providerTileOptions(
    id = "mapbox.light",
    accessToken = API_KEY)) %>%
  addPolygons(
    fillColor = ~pal(density),
    weight = 2,
    opacity = 1,
    color = "white",
    dashArray = "3",
    fillOpacity = 0.7,
    highlight = highlightOptions(
      weight = 5,
      color = "#666",
      dashArray = "",
      fillOpacity = 0.7,
      bringToFront = TRUE),
    label = labels,
    labelOptions = labelOptions(
      style = list("font-weight" = "normal", padding = "3px 8px"),
      textsize = "15px",
      direction = "auto")) %>%
  addLegend(pal = pal, values = ~density, opacity = 0.7, title = NULL,
    position = "bottomright")