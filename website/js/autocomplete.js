

let search_options_dropdown_id = '#stations_dropdown';

search_options_dropdown = UIkit.dropdown(search_options_dropdown_id, {
  "pos": "bottom-left",
  "mode": "click",
  "animation": true
});

// Triggered when the dropdown is shown
UIkit.util.on(search_options_dropdown_id, 'show', function () {
  // $('#stations_dropdown').addClass('active');
  document.getElementById('stations_dropdown').classList.add('active');
  console.log('showed');
});

// Triggered when the dropdown is hidden
UIkit.util.on(search_options_dropdown_id, 'hide', function () {
  //$('#search_options_dropdown').addClass('active');
  console.log('hidden');
  //UIkit.dropdown(search_options_dropdown_id).show();
});


var autocompleteData = [];


function pascalize(str) {
  return str.replace(/(\w)(\w*)/g, function (g0, g1, g2) { return g1.toUpperCase() + g2.toLowerCase(); });
}

// d3.csv("data/data_stop.csv", function (d) {
//   return d;
// }).then(function (data) {
//   autocompleteData = data.map(function (d) {
//     return {
//       'stop_name': d.stop_name,
//       'stop_id': d.stop_id,
//     };
//   });
//   console.log(autocompleteData)
// });

let searchBox = document.getElementById("searchBox");


searchBox.addEventListener("input", function () {

  // open the dropdown if it is not already open
  if (!UIkit.dropdown(search_options_dropdown_id).isActive()) {
    UIkit.dropdown(search_options_dropdown_id).show();
  }

  let input = searchBox.value.toLowerCase();
  console.log(input)

  let autocompleteSuggestions = station_data.filter(function (item) {
    return item["stop_name"].toLowerCase().startsWith(input);
  });

  populate_dropdown_from_dataset(autocompleteSuggestions);
});

// function displayAutocompleteSuggestions(suggestions) {
//   autocompleteList.innerHTML = "";
//   suggestions.forEach(function (suggestion) {
//     var li = document.createElement("li");
//     li.textContent = suggestion;
//     li.addEventListener("click", function () {
//       searchBox.value = suggestion;
//       autocompleteList.innerHTML = "";
//     });
//     autocompleteList.appendChild(li);
//   });
// }




function populate_dropdown_from_dataset(dataset) {
  let dropdown_content = document.getElementById('stations_dropdown_content');
  let dropdown_content_html = '';
  let MAX_RESULTS = 4;
  let table_length = dataset.length > MAX_RESULTS ? MAX_RESULTS : dataset.length;
  for (let i = 0; i < table_length; i++) {
    let station = dataset[i];
    dropdown_content_html += '<tr onclick="displayStation(' + station["id"] + ')"><td>' + station['stop_name'] + '</td></tr>';
  }
  if (dataset.length === 0) {
    dropdown_content_html = '<tr><td class="uk-text-center">Sorry, we couldn\'t find any station matching your search</td></tr>';
  }
  dropdown_content.innerHTML = dropdown_content_html;
}

var chosenStationPopup = null


function displayStation(id) {
  console.log("displayStation(", id, ") triggered")
  // need to retrieve the circle corresponding to this station id in the mapbox map
  station = station_data[id];
  coordinates = [station['stop_lon'], station['stop_lat']];
  description = "bubu"

  if (chosenStationPopup !== null) {
    chosenStationPopup.remove();
  }

  chosenStationPopup = new mapboxgl.Popup()
    .setLngLat(coordinates)
    .setHTML(generatePopupHTML(station))
    .addTo(map);

  map.flyTo({
    center: coordinates,
    zoom: 8
  });

}