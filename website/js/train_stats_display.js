function displayTrainInformation(trainID) {
    /**
     * The function is called when the user clicks on a train in the dropdown menu.
     */

    // hide the dropdown 
    UIkit.dropdown(search_options_dropdown_id).hide(false);

    // get from dataset the train with the given ID
    let train_summary = dataset_dropdown.filter(function (train) {
        return train['train_id'] == trainID;
    })[0];
    
    let train_name_label = document.getElementById('train_name_label');
    train_name_label.innerHTML = train_summary['train_class'] + ' ' + train_summary['train_number'];

    let train_avg_delay_label = document.getElementById('train_avg_delay_label');
    train_avg_delay_label.innerHTML = train_summary['avg_arrival_delay'];

    let train_perc_delayed_label = document.getElementById('train_perc_delayed_label');
    train_perc_delayed_label.innerHTML = train_summary['perc_5m_delay'];

    let train_description_label = document.getElementById('train_description_label');
    train_description_label.innerHTML = train_summary['train_departure_stop_name'] + ' <span uk-icon="arrow-right"></span> ' + train_summary['train_arrival_stop_name'];

    // get the dataset of the train
    let train_dataset = d3.csv('data/trains/' + trainID + '.csv').then(function (data) {
        return data
    });

    // when ready
    train_dataset.then(function (data) {

        console.log(data)

    });

    let train_shapes = d3.csv('data/trains_shapes/' + trainID +'.csv').then(function (data) {
        return data
    });

    train_shapes.then(function (data) {
        plotLines(data);
    });

}

