
let mapBoxAccessToken = "pk.eyJ1IjoiZ2lhY29tb29yc2kiLCJhIjoiY2pubTM0Nml6MW02MDNwcWY0ajc3ZHE3diJ9.fz0p1ZmseERTYVzXJPqS0Q"
mapboxgl.accessToken = mapBoxAccessToken;

const map = new mapboxgl.Map({
    container: 'regional-differences-map',
    style: 'https://maps.geops.io/styles/base_bright_v2/style.json?key=5cc87b12d7c5370001c1d6552688c8395e0e4e94a4faf2368b9915dd',
    center: [12, 42],
    zoom: 4.6,
});

var container = map.getCanvasContainer();
var width = document.getElementById("regional-differences-map").offsetWidth;
var height = document.getElementById("regional-differences-map").offsetHeight;

// scales the color linearly
let colormap = d3.scaleLinear()
    .domain([-10, 0, 3, 7, 10])
    .range(['#10ad0a', '#10ad0a', '#f7f414', '#e81710', '#e81710']);

// add color legend, without showing the negative values for the colormap
const legend = Legend(colormap.range(colormap.range().slice(1))
    .domain(colormap.domain().slice(1)), {
    title: "Average delay (min)",
})

// add style attribute to legend
legend.style.display = "block"
legend.style.margin = "auto"

d3.select(".regional-legend")
    .append("div")
    .attr("width", "100%")
    .attr("height", "100%")
    .html(legend.outerHTML)

// const svg_size_legend = d3.select(".regional-legend")
//     .append("svg")
//     .attr("width", 150)
//     .attr("height", 80)
//     .attr("z-index", 100000)


/**
 * Function to project coordinates to the exact position on the canvas given by Mapbox
 */
function project(d) {
    return map.project(new mapboxgl.LngLat(d[0], d[1]));
}

var trainsMapping = {
    "Regional": "REG",
    "InterCity": "IC",
    "InterCity Notte": "ICN",
    "EuroCity": "EC",
    "FrecciaRossa": "FR",
    "FrecciaBianca": "FB",
    "FrecciaArgento": "FA"
}

function getFileName(trainType) {
    /**
     * Returns the filename of the dataset to be used, given the day and the train type
     */
    if (trainType == "All trains") {
        return "data_stop_region.csv"
    }
    else {
        return "data_stop_region_class_" + trainsMapping[trainType] + ".csv"
    }
}

/**
 *  
 * USER INTERACTION WITH FORM
 * 
 */
// d3.select("#form-horizontal-select-day").on("change", function (d) {
//   var selectedOptionDay = d3.select(this).property("value")
//   var selectedOptionTrainType = d3.select("#form-horizontal-select-trainType").property("value")
//   var dataset = getFileName(selectedOptionDay, selectedOptionTrainType)
//   var data_stop = d3.csv("data/" + dataset, function (d) {
//     return d;
//   })
//   Promise.all([data_stop]).then(results => {
//     let station_data = results[0];
//     console.log(station_data)
//     d3.selectAll("circle").remove();
//     plotDots(station_data);
//   })
// })

d3.select("#form-horizontal-select-trainType").on("change", function (d) {
    var selectedOptionTrainType = d3.select(this).property("value")
    var dataset = getFileName(selectedOptionTrainType)
    console.log("Change dropdown, load", "data/" + dataset)
    const data_stop = d3.csv("data/" + dataset, function (d) {
        return d;
    })
    Promise.all([data_stop]).then(results => {
        regional_data = results[0];
        plotRegions(regional_data, regional_polygons);
    })
})

// //default dataset, before the user chooses anything
// var dayChosen = document.getElementById("form-horizontal-select-day").value
// var trainTypeChosen = document.getElementById("form-horizontal-select-trainType").value
// var dataset = getFileName(dayChosen, trainTypeChosen)

const data_stop = d3.csv("data/data_stop_region_class_IC.csv", function (d) {
    return d;
})

const polygons_regions = d3.json("data/regions.geojson", function (d) {
    return d;
})

var regional_data = []
var regional_polygons = []

Promise.all([data_stop, polygons_regions]).then(results => {
    regional_data = results[0];
    regional_polygons = results[1];

    // augment the dataset with an ID
    // we need an ID for each stop in order to be able to remove the popup when the user hovers out
    let id = 0
    regional_data = regional_data.map(d => {
        d.id = id
        id += 1
        return d
    });

    plotRegions(regional_data, regional_polygons);
})

/**
 * END USER INTERACTION WITH FORM
 * 
*/


/**
 * CODE TO HANDLE MAP
 */

function generatePopupHTML(d) {
    /**
     * Returns the HTML code for a popup of a stop
     */
    // output = '<div class="uk-text-lead" >'
    // output += '<span style="text-align:center"><b>' + d.stop_name 
    //        +  "</b></span><br/>" + "Number of trains: " + d.count_stops 
    //        + "<br/>" + "Avg Arrival Delay: <span style='color: " + colormap(d.avg_arrival_delay) + "'>" + Math.round(d.avg_arrival_delay * 10) / 10 + " min</span>"
    // output += "</div>"

    output = '<div class="uk-text-lead" style="width: 300px">'
    output += '<span style="text-align:center"><b>' + d.stop_name_region
           + "</b></span><br/>" + "Number of trains: " + d.count_stops 
           + "<br/>" + "Avg Arrival Delay: <span style='color: " + colormap(d.avg_arrival_delay) + "'>" + Math.round(d.avg_arrival_delay * 10) / 10 + " min"
    output += "</div>"

    return output
}





const valuesToShow = [1000, 5000, 10_000]


// variable to check if the map was already fully loaded
// if it is not fully loaded, plotDots will wait 200ms and then try again
let mapHasLoaded = false;
map.on('load', function () {
    mapHasLoaded = true;
});

// variable to store the id of the station the user is hovering on
// we need it to remove the popup when the user hovers out
let hoverStationId = null;

/**
 * Handles the display of dots over the map
 * @param data: a dataframe containing the data to be plotted
 */
function plotRegions(data, geojson) {

    // if the map is not fully loaded, wait 200ms and try again
    if (!mapHasLoaded) {
        setTimeout(function () { plotRegions(data, geojson); }, 200);
        return;
    }




    /**
     * Backup code
  

    */

    // scales the radius using quantiles
    let scale3 = d3.scaleQuantile()
        .domain(data.map((d) => Number(d.count_stops))) // input
        .range([3, 5, 5, 5, 5, 5, 5, 5, 7, 7, 10, 15]); // output


    function scale(d) {
        return scale3(d)
    }



    // need to augment regions.geojson with the regional data of delays
    // we do this by adding the regional data to the geojson file

    // clone geojson variable
    let plotdata = JSON.parse(JSON.stringify(geojson))
    plotdata.features = plotdata.features.map(d => {
        // find the data for the region
        let region_data = data.filter(e => e.stop_name_region == d.properties.name)[0]
        if (region_data == undefined) {
            return d
        }
        // add the data to the geojson file
        d.properties.count_stops = region_data.count_stops
        d.properties.avg_arrival_delay = region_data.avg_arrival_delay
        d.properties.color = colormap(region_data.avg_arrival_delay)
        d.properties.description = generatePopupHTML(region_data)
        return d
    })

    if (map.getLayer('regional-fills')) {
        map.removeLayer('regional-fills')
    }

    if (map.getLayer('regional-borders')) {
        map.removeLayer('regional-borders')
    }

    // remove source if it exists
    if (map.getSource('regions')) {
        map.removeSource('regions')
    }



    map.addSource('regions', {
        'type': 'geojson',
        'data': plotdata
    });




    const layers = map.getStyle().layers;
    // Find the last symbol that contains streets. We put the shapes for the regions over this one, in order to have 
    // map labels over the shapes
    let lastSymbolId;
    for (let i = 0; i < layers.length; i++) {
        if (layers[i].id === 'streetName_path') {
            lastSymbolId = layers[i].id;
            console.log(layers[i])
        }
    }
    console.log(lastSymbolId)

    // The feature-state dependent fill-opacity expression will render the hover effect
    // when a feature's hover state is set to true.
    map.addLayer({
        'id': 'regional-fills',
        'type': 'fill',
        'source': 'regions',
        'layout': {},
        'paint': {
            'fill-color': ['get', 'color'],
            'fill-opacity': [
                'case',
                ['boolean', ['feature-state', 'hover'], false],
                1,
                0.5
            ]
        }
    }, lastSymbolId);

    map.addLayer({
        'id': 'regional-borders',
        'type': 'line',
        'source': 'regions',
        'layout': {},
        'paint': {
            'line-color': '#223046',
            'line-width': 1
        }
    }, lastSymbolId);


    // Create a popup, but don't add it to the map yet.
    var popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false
    });

    /**
     * Adds a popup when the user hovers on a station
     */
    map.on('mousemove', 'regional-fills', (e) => {
        // Change the cursor style as a UI indicator.

        if (hoverStationId !== null) {
            map.setFeatureState(
                { source: 'regions', id: hoverStationId },
                { hover: false }
            );
        }

        hoverStationId = e.features[0].id;



        const html = e.features[0].properties.description;

        if (html == undefined) {
            return
        }

        map.getCanvas().style.cursor = 'pointer';


        // set hover state, the new radius is handled by the paint property
        map.setFeatureState(
            { source: 'regions', id: hoverStationId },
            { hover: true }
        );

        const coordinates = e.lngLat;

        popup.setLngLat(coordinates).setHTML(html).addTo(map);
    });

    map.on('mouseleave', 'regional-fills', (e) => {
        map.setFeatureState(
            { source: 'regions', id: hoverStationId },
            { hover: false }
        );

        map.getCanvas().style.cursor = '';
        popup.remove();
    });

    map.on('click', 'regional-fill', (e) => {
        clickStationId = e.features[0].id;
        displayStation(clickStationId)
    });
}
