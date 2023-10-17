/**
 * Script that handles generation of best and worst trains and stations
 */

function pascalize(str) {
    return str.replace(/\w+/g, word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
}

/**
 * Given a delay in float format, returns a string that shows the minutes and seconds, example: 5.5 is converted to 5' 30'' (5 minutes, 30 seconds)
 */
function generateDelayString(delay) {
    const minutes = Math.floor(delay);
    const seconds = Math.round((delay - minutes) * 60);
    return seconds === 0 ? `${minutes}'` : `${minutes}' ${seconds}''`;
}

function trainClassToImage(train_class) {
    const trainImages = {
        "IC": "media/intercity.svg width='80px'",
        "ICN": "media/intercity_notte.svg width='80px'",
        "REG": "media/RE.svg",
        "EC": "media/EC.svg",
        "FR": "media/frecciarossa.svg width='80px'",
        "FB": "media/frecciabianca.svg width='80px'",
        "FA": "media/frecciargento.svg width='80px'"
    };

    return trainImages[train_class] || "media/logo/favicon.png";
}

const trainClicked = (train_id) => window.location.href = "trains.html?train_id=" + train_id;
const stopClicked = (stop_name) => window.location.href = "index.html?stop_name=" + stop_name;

function generateTrainHTML(trains) {
    let html = '';
    trains.forEach( (train) => {
        html += `<tr onclick="trainClicked('${train["train_id"]}')">
        <td><img src=${trainClassToImage(train["train_class"])} class="ot-train-logo ot-train-logo-ic vertical-center"> ${train["train_number"]}</td>
        <td>${pascalize(train["train_departure_stop_name"])} <span uk-icon="arrow-right"></span> ${pascalize(train["train_arrival_stop_name"])}</td>
        <td>${generateDelayString(train["avg_arrival_delay"])}</td>
        </tr>`
    });

    return html;
}

function generateStopHTML(stops) {
    let html = '';
    stops.forEach(function (stop) {
        html += `<tr onclick="stopClicked('${stop["stop_name"]}')">
        <td>${pascalize(stop["stop_name"])}</td>
        <td>${generateDelayString(stop["avg_arrival_delay"])}</td>
        <td>${stop["count_stops"]}</td>
        </tr>`
    });

    return html;
}

function generateBestWorst(data, sortProperty, generateHTML, bestElementId, worstElementId) {
    /**
     * Generates the best and worst items based on the provided criteria
     */
    const sortedData = data.sort((a, b) => a[sortProperty] - b[sortProperty]);
    const bestItems = sortedData.slice(0, 5);
    const worstItems = sortedData.slice(-5).reverse();

    document.getElementById(bestElementId).innerHTML = generateHTML(bestItems);
    document.getElementById(worstElementId).innerHTML = generateHTML(worstItems);
}

document.addEventListener('DOMContentLoaded', async () => {
    const train_data = await d3.csv("/data/data_train_index.csv");
    const stop_data = await d3.csv("/data/data_stop.csv");

    generateBestWorst(train_data, 'median_arrival_delay', generateTrainHTML, 'best-trains', 'worst-trains');

    // filter out stops with less than 1200 trains
    const stop_data_filtered = stop_data.filter((stop) => stop["count_stops"] > 1200);
    generateBestWorst(stop_data_filtered, 'avg_arrival_delay', generateStopHTML, 'best-stops', 'worst-stops');
});
