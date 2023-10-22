// Global variables
let chosenStationPopup = null;
let searchBox = document.getElementById('searchBox');

// Search dropdown options
const search_options_dropdown_id = '#stations_dropdown';
const search_options_dropdown = UIkit.dropdown(search_options_dropdown_id, {
    'pos': 'bottom-left',
    'mode': 'click',
    'animation': true
});

// Triggered when the dropdown is shown
function addDropdownEventListeners() {
    // Triggered when the dropdown is shown
    UIkit.util.on(search_options_dropdown_id, 'show', function () {
        document.getElementById('stations_dropdown').classList.add('active');
    });
}

// Triggered when the user types in the search box
function addSearchBoxEventListener() {
    searchBox.addEventListener('input', () => {

        // open the dropdown if it is not already open
        if (!UIkit.dropdown(search_options_dropdown_id).isActive()) {
            UIkit.dropdown(search_options_dropdown_id).show();
        }

        const input = searchBox.value.toLowerCase();
        const autocompleteSuggestions = station_data.filter((item) => item['stop_name'].toLowerCase().startsWith(input));

        populate_dropdown_from_dataset(autocompleteSuggestions, searchBox);
    });
}

// Populate the dropdown with the suggestions
function populate_dropdown_from_dataset(dataset) {
    const dropdown_content = document.getElementById('stations_dropdown_content');

    let dropdown_content_html = '';
    const MAX_RESULTS = 4;

    dataset.slice(0, MAX_RESULTS).forEach(station => {
        dropdown_content_html += `<tr onclick="displayStation(${station.id})"><td>${station.stop_name}</td></tr>`;
    });

    if (dataset.length === 0) {
        dropdown_content_html = '<tr><td class="uk-text-center">Sorry, we couldn\'t find any station matching your search</td></tr>';
    }

    dropdown_content.innerHTML = dropdown_content_html;
}

// Display the popup of the station
function displayStation(id) {
    // need to retrieve the circle corresponding to this station id in the mapbox map
    const station = station_data[id];
    const coordinates = [station['stop_lon'], station['stop_lat']];

    if (chosenStationPopup !== null) {
        chosenStationPopup.remove();
    }

    // close dropdown
    UIkit.dropdown(search_options_dropdown_id).hide(animation = true);

    // add in text field the station stop
    searchBox.value = station['stop_name'];

    chosenStationPopup = new mapboxgl.Popup()
        .setLngLat(coordinates)
        .setHTML(generatePopupHTML(station))
        .addTo(map);

    map.flyTo({
        center: coordinates,
        zoom: 8
    });
}

document.addEventListener('DOMContentLoaded', () => {
    addDropdownEventListeners();
    addSearchBoxEventListener();
});
