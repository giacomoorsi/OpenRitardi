

let search_options_dropdown_id = '#search_options_dropdown';

search_options_dropdown = UIkit.dropdown(search_options_dropdown_id, {
    "pos": "bottom-left",
    "mode": "click",
    "animation": true
});

// Triggered when the dropdown is shown
UIkit.util.on(search_options_dropdown_id, 'show', function () {
    $('#search_options_dropdown').addClass('active');
});

// Triggered when the dropdown is hidden
UIkit.util.on(search_options_dropdown_id, 'hide', function () {
});



function pascalize(str) {
    return str.replace(/(\w)(\w*)/g, function (g0, g1, g2) { return g1.toUpperCase() + g2.toLowerCase(); });
}


train_class_names = {
    'IC': 'InterCity (IC)',
    'REG': 'Regionale (REG)',
    'EC': 'EuroCity (EC)',
    'AV': 'Alta Velocità (AV), FrecciaRossa, FrecciaBianca, FrecciaArgento',
}

function round(value, decimals) {
    value = Number(value);
    return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
}



dataset_dropdown = d3.csv('/data/data_train_index.csv').then(function (data) {
    dataset = data
    // keep only some columns
    dataset_dropdown = dataset.map(function (train) {
        return {
            'train_id': train['train_id'],
            'train_class': train['train_class'],
            'train_number': train['train_number'],
            'train_departure_stop_name': pascalize(train['train_departure_stop_name']),
            'train_arrival_stop_name': pascalize(train['train_arrival_stop_name']),
            'avg_arrival_delay': round(train['avg_arrival_delay'], 2),
            'perc_5m_delay': round(Number(train['perc_5m_delay']) * 100, 2),
        };
    });

    populate_dropdown_from_dataset(dataset_dropdown);

    // check if there's URL parameter train_id
    let urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('train_id')) {
        let train_id = urlParams.get('train_id');
        
        displayTrainInformation(train_id);
    } else {
        let train_class_default = "IC";
        let train_number_default = "655";

        let train_id = dataset_dropdown.filter(function (train) {
            return train['train_class'] === train_class_default && train['train_number'] === train_number_default;
        })[0]['train_id'];

        displayTrainInformation(train_id);
    }
});

// populate the dropdown with data from the sample

let dropdown_content = document.getElementById('search_options_dropdown_content');

function populate_dropdown_from_dataset(dataset) {
    let dropdown_content = document.getElementById('search_options_dropdown_content');
    let dropdown_content_html = '';
    let MAX_RESULTS = 10;
    let table_length = dataset.length > MAX_RESULTS ? MAX_RESULTS : dataset.length;
    for (let i = 0; i < table_length; i++) {
        let train = dataset[i];
        dropdown_content_html += '<tr onclick="displayTrainInformation(' + train['train_id'] + ')"><td>' + train['train_class'] + ' ' + train['train_number'] + ' </td><td>' + train['train_departure_stop_name'] + '</td><td>' + train['train_arrival_stop_name'] + '</td></tr>';
    }
    if (dataset.length === 0) {
        dropdown_content_html = '<tr><td colspan="3" class="uk-text-center">Sorry, we couldn\'t find any trains matching your search</td></tr>';
    }
    dropdown_content.innerHTML = dropdown_content_html;
}


let train_search_input = document.getElementById('train_search_input');

train_search_input.addEventListener('input', function () {

    // open the dropdown if it is not already open
    if (!UIkit.dropdown(search_options_dropdown_id).isActive()) {
        UIkit.dropdown(search_options_dropdown_id).show();
    }

    let search_query = train_search_input.value;

    // searched number: removed all non-digit characters
    search_query_number = search_query.replace(/\D/g, '');

    // searched name: removed all digit
    search_query_name = search_query.replace(/\d/g, '').toLowerCase();




    // the digits of the search query should be kept in the same order, when searching for train numbers
    let filtered_dataset = dataset_dropdown.filter(function (train) {
        let train_number = train['train_number'];

        // check if the search query is included, in the same order, in the train number as substring

        return train_number.includes(search_query_number);

    });

    if (search_query_name.length > 0) {



        filtered_dataset = filtered_dataset.filter(function (train) {
            let train_class = train['train_class'];
            // augment dataset

            train_class = train_class_names[train_class] ? train_class_names[train_class] : train_class;
            train_destination = train['train_arrival_stop_name'];
            train_departure = train['train_departure_stop_name'];

            let query_tokens = search_query_name.split(' ');

            // check if one of the tokens is included in the train class, destination or departure
            let found = false;
            query_tokens.forEach(function (token) {
                found = found || train_class.toLowerCase().includes(token) || train_destination.toLowerCase().includes(token) || train_departure.toLowerCase().includes(token);
            });
            return found;
        });
    }

    // reorder the dataset based on the train number, converted to integer
    filtered_dataset.sort(function (a, b) {
        return parseInt(a['train_number']) - parseInt(b['train_number']);
    });

    populate_dropdown_from_dataset(filtered_dataset);

});



