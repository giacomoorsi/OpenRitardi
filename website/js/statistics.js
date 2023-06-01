/**
 * Script that handles generation of best and worst trains and stations
 */


const promise_train_data = d3.csv("data/data_train_index.csv").then(function (data) {
    return data;
});

const promise_stop_data = d3.csv("data/data_stop.csv").then(function (data) {
    return data;
});

function pascalize(str) {
    return str.replace(/(\w)(\w*)/g, function (g0, g1, g2) { return g1.toUpperCase() + g2.toLowerCase(); });
}


var train_data = [];

Promise.all([promise_train_data]).then(results => {
    train_data = results[0];
    console.log(train_data);
    generateBestWorstTrains(train_data);
});

/**
 * Given a delay in float format, returns a string that shows the minutes and seconds, example: 5.5 is converted to 5' 30'' (5 minutes, 30 seconds)
 */
function generateDelayString(delay) {
    let minutes = Math.floor(delay);
    let seconds = Math.round((delay - minutes) * 60);
    if (seconds == 0) {
        return minutes + "'";
    } else {
        return minutes + "' " + seconds + "''";
    }
}

function trainClicked(train_id) {
    window.location.href = "trains.html?train_id=" + train_id;
}


function trainClassToImage(train_class) {
    console.log(train_class);
    if (train_class == "IC") {
        image = "media/intercity.svg width='80px'";
    } else if (train_class == "REG") {
        image = "media/RE.svg";
    } else if (train_class == "FR") {
        image = "media/frecciarossa.svg width='80px'";
    } else if (train_class == "FB") {
        image = "media/frecciabianca.svg width='80px'";
    } else if (train_class == "FA") {
        image = "media/frecciargento.svg width='80px'";
    } else if (train_class == "ICN") {
        image = "media/intercity_notte.svg width='80px'";
    }
    else image = "media/logo/favicon.png";
    return image;
}


function generateTrainHTML(trains) {
    html = '';
    trains.forEach(function (train) {
        html += `<tr onclick="trainClicked('${train["train_id"]}')">
        <td><img src=${trainClassToImage(train["train_class"])} class="ot-train-logo ot-train-logo-ic vertical-center"> ${train["train_number"]}</td>
        <td>${pascalize(train["train_departure_stop_name"])} <span uk-icon="arrow-right"></span> ${pascalize(train["train_arrival_stop_name"])}</td>
        <td>${generateDelayString(train["avg_arrival_delay"])}</td>
        </tr>`
    });
    return html;
}

function generateBestWorstTrains(train_data) {
    /**
     * Generates the best and worst trains based on the train index
     */
    var best_trains = train_data.sort(function (a, b) {
        return a["median_arrival_delay"] - b["median_arrival_delay"];
    }).slice(1, 6);

    var worst_trains = train_data.sort(function (a, b) {
        return b["median_arrival_delay"] - a["median_arrival_delay"];
    }).slice(1, 6);

    console.log(best_trains);
    console.log(worst_trains);

    var best_trains_html = generateTrainHTML(best_trains);
    var worst_trains_html = generateTrainHTML(worst_trains);

    document.getElementById("best-trains").innerHTML = best_trains_html;
    document.getElementById("worst-trains").innerHTML = worst_trains_html;
}

var stop_data = []

Promise.all([promise_stop_data]).then(results => {



    stop_data = results[0];

    // filter out stops with less than 1200 trains
    stop_data = stop_data.filter(function (stop) {
        return stop["count_stops"] > 1200;
    });

    console.log(stop_data);
    generateBestWorstStops(stop_data);
});

function stopClicked(stop_name) {
    window.location.href = "index.html?stop_name=" + stop_name;
}

function generateStopHTML(stops) {
    html = '';
    stops.forEach(function (stop) {
        html += `<tr onclick="stopClicked('${stop["stop_name"]}')">
        <td>${pascalize(stop["stop_name"])}</td>
        <td>${generateDelayString(stop["avg_arrival_delay"])}</td>
        <td>${stop["count_stops"]}</td>
        </tr>`
    });

    return html;
};

function generateBestWorstStops(stop_data) {
    /**
     * Generates the best and worst stops based on the stop index
     */
    var best_stops = stop_data.sort(function (a, b) {
        return a["avg_arrival_delay"] - b["avg_arrival_delay"];
    }).slice(0, 5);

    var worst_stops = stop_data.sort(function (a, b) {
        return b["avg_arrival_delay"] - a["avg_arrival_delay"];
    }).slice(0, 5);

    console.log(best_stops);
    console.log(worst_stops);

    var best_stops_html = generateStopHTML(best_stops);
    var worst_stops_html = generateStopHTML(worst_stops);

    document.getElementById("best-stops").innerHTML = best_stops_html;
    document.getElementById("worst-stops").innerHTML = worst_stops_html;
}