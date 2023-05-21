// import file legend.js


let mapBoxAccessToken = "pk.eyJ1IjoiZ2lhY29tb29yc2kiLCJhIjoiY2pubTM0Nml6MW02MDNwcWY0ajc3ZHE3diJ9.fz0p1ZmseERTYVzXJPqS0Q"
mapboxgl.accessToken = mapBoxAccessToken;

const map = new mapboxgl.Map({
  container: 'route-map',
  style: 'https://maps.geops.io/styles/base_bright_v2/style.json?key=5cc87b12d7c5370001c1d6552688c8395e0e4e94a4faf2368b9915dd',
  center: [8, 42.5],
  zoom: 5,
});

var container = map.getCanvasContainer();
var width = document.getElementById("route-map").offsetWidth;
var height = document.getElementById("route-map").offsetHeight;

var svg = d3
  .select(container)
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .style("position", "absolute")
  .style("z-index", 1000);

/**
 * Mapbox to talk with d3
 */
function project(d) {
  return map.project(new mapboxgl.LngLat(d[0], d[1]));
}


const data_stop = d3.csv("data/data_stop.csv", function (d) {
  return d;
})

const data_route = d3.csv("data/trip_demo.txt", function (d) {
  return d;
})

Promise.all([data_route]).then(results => {
  let route_data = results[0];
  //console.log(route_data)
  plotLines(route_data);
})


function plotLines(data) {
  // extract an array of all coordinates
  let coordinates = data.map(function (d) {
    return [d.shape_pt_lon, d.shape_pt_lat];
  });
  console.log("COordinates: ")
  console.log(coordinates)

  // check if the map is loaded

  // remove layer with id "route" if it exists
  if (map.getLayer('route')) {
    map.removeLayer('route');
  }

  // remove source with id "route" if it exists
  if (map.getSource('route')) {
    map.removeSource('route');
  }

  const layers = map.getStyle().layers;
  // Find the last symbol that contains streets. We highlight the railroad by placing a layer 
  // just after this layer. This way the railroad is always on top of the streets but all the additional layers
  // like station dots and city names will be on top of the railroad.
  let lastSymbolId;
  for (let i = 0; i < layers.length; i++) {
    if (layers[i].id === 'streetName_path') {
      lastSymbolId = layers[i].id;
      console.log(layers[i])
    }
  }
  console.log("lastSymbolId: ")
  console.log(lastSymbolId)


  console.log("lastSymbolId: ")
  console.log(lastSymbolId)

  map.addSource('route', {
    'type': 'geojson',
    'data': {
      'type': 'Feature',
      'properties': {},
      'geometry': {
        'type': 'LineString',
        'coordinates': coordinates
      }
    }
  });
  // specify low z-index 
  map.addLayer({
    'id': 'route',
    'type': 'line',
    'source': 'route',
    'layout': {
      'line-join': 'round',
      'line-cap': 'round'
    },
    'paint': {
      'line-color': 'red',
      'line-width': 8
    }
  },
    lastSymbolId);
  //});

  // extract max_lat, max_lon, min_lat, min_lon
  let max_lat = d3.max(coordinates, function (d) { return d[1]; });
  let max_lon = d3.max(coordinates, function (d) { return d[0]; });
  let min_lat = d3.min(coordinates, function (d) { return d[1]; });
  let min_lon = d3.min(coordinates, function (d) { return d[0]; });

  // center map 
  map.fitBounds([[min_lon, min_lat], [max_lon, max_lat]], { padding: 40 });

}


var lastMove = 0;

function render() {
  svg.selectAll("circle")
    .attr("cx", function (d) {
      return project([d.stop_lon, d.stop_lat]).x;
    })
    .attr("cy", function (d) {
      return project([d.stop_lon, d.stop_lat]).y;
    });
}

function renderMoveStart() {
  lastMove = Date.now();
}

function renderMove() {
  if (Date.now() - lastMove > 0) {
    render();
  }
}
map.on("viewreset", render);
map.on("movestart", renderMoveStart);
map.on("move", renderMove);
map.on("moveend", render);
render(); // Call once to render