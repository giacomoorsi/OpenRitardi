// import file legend.js


let mapBoxAccessToken = "pk.eyJ1IjoiZ2lhY29tb29yc2kiLCJhIjoiY2pubTM0Nml6MW02MDNwcWY0ajc3ZHE3diJ9.fz0p1ZmseERTYVzXJPqS0Q"
mapboxgl.accessToken = mapBoxAccessToken;

const map = new mapboxgl.Map({
    container: 'map', 
    style: 'https://maps.geops.io/styles/base_bright_v2/style.json?key=5cc87b12d7c5370001c1d6552688c8395e0e4e94a4faf2368b9915dd', 
    center: [8, 42.5], 
    zoom: 5
});

var container = map.getCanvasContainer();
var width = document.getElementById("map").offsetWidth;
var height = document.getElementById("map").offsetHeight;

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

  
const data_stop = d3.csv("data/data_stop.csv", function(d) {
    return d;
  })

Promise.all([data_stop]).then(results => {
  let station_data = results[0];
  console.log(station_data)
  plotDots(station_data);
})



function plotDots(data) {
    var svg = d3.select("svg");

    let min_count = d3.min(data, function(d) { return d.count_stops; });
    let max_count = d3.max(data, function(d) { return d.count_stops; });


    let scale = d3.scalePow()
      .exponent(0.6)
      .domain([min_count, max_count]) // input
      .range([2, 10]); // output

    let colormap = d3.scaleLinear()
      .domain([-10,       0,       3,        7,       100])
      .range(['#10ad0a','#10ad0a','#f7f414','#e81710', '#e81710']);

      
    var div = d3.select("body").append("div")
          .attr("class", "tooltip")
          .style("opacity", 0);

    const g = svg.append("g");
    g.selectAll("circle")
     .data(data)
     .enter()
     .append("circle")
     .attr("cx", function(d) { return project([d.stop_lon, d.stop_lat]).x })
     .attr("cy", function(d) { return project([d.stop_lon, d.stop_lat]).y })
     .attr("r", function (d) { return scale(d.count_stops) })
     .attr("name", function(d) { return d.stop_name })
     .style("fill", function (d) { return colormap(d.avg_arrival_delay) })
     .style("stroke", "white")

    //"Quick and dirty" tooltip
    //.append("svg:title")
    //.text(function(d) { return d.stop_name + "\n" + "avg arrival delay: " + String(d.avg_arrival_delay) })

    

    .on("mouseover", function(event, d) {
      d3.select(this).transition()
            .duration('100')
            .attr("r", function (d) { return scale(d.count_stops) +5  });      
      d3.select(this).raise();
      div.transition()
        .duration(200)
        .style("opacity", .9);
      div.html("Stop Name: " + d.stop_name + "<br/>" + "Number of trains: " + d.count_stops + "<br/>" + "Avg Arrival Delay: " + Math.round(d.avg_arrival_delay * 1000) / 1000 + " min")
        .style("left", (event.pageX) + "px")
        .style("top", (event.pageY - 28) + "px");
    })
    .on("mouseout", function(d) {
      d3.select(this).lower();
      d3.select(this).transition()
            .duration('200')
            .attr("r", function (d) { return scale(d.count_stops) });
      div.transition()
        .duration(500)
        .style("opacity", 0);
    });




    // svg.call(d3.zoom()
    // .extent([[0, 0], [width, height]])
    // .scaleExtent([1, 2])
    // .on('zoom', ({transform}) => {
    //   g.attr('transform', transform);
    // }));

    


    let legend = Legend(colormap, {
      title: "avg arrival delay",
    })

    // add to the inner html of the legend div the class "map-legend"

    //legend

    // extract content from legend and add it to the main svg
    // legend is a DOM element, we need to extract the content and put it in the main svg
    // we use insertAdjacentHTML to do that
    
    svg.node().insertAdjacentHTML("beforeend", '<g class="map-legend">' + legend.innerHTML + '</g>');    

}

function render() {
    svg.selectAll("circle")
      .attr("cx", function (d) {
        return project([d.stop_lon, d.stop_lat]).x;
      })
      .attr("cy", function (d) {
        return project([d.stop_lon, d.stop_lat]).y;
      });
  }

map.on("viewreset", render);
map.on("move", render);
map.on("moveend", render);
render(); // Call once to render