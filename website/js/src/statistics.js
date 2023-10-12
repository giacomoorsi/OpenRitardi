/**
 * Script that handles generation of the best and worst trains and stations
 */

import {trainTemplate, stopTemplate} from './templates/statistics';

// Navigate to the given url with the given parameter
const navigate = (url, paramKey, paramValue) =>
    window.location.href = `${url}?${paramKey}=${paramValue}`;

// Populate the given element with the given items using the given template
const populateElement = (items, elementId, template, onClick) => {
    const element = document.getElementById(elementId);
    element.innerHTML = '';
    items.forEach(item => element.innerHTML += template(item));

    // Add click listener to each row
    element.addEventListener('click', e => {
        const itemRow = e.target.closest('tr');
        if (itemRow) {
            const itemId = itemRow.dataset.id;
            onClick(itemId);
        }
    });
}

// Generates the best and worst items based on the provided criteria
function generateBestWorst(data, sortProperty, populateFn, bestElementId, worstElementId) {
    const sortedData = data.sort((a, b) => a[sortProperty] - b[sortProperty]);
    const bestItems = sortedData.slice(0, 5);
    const worstItems = sortedData.slice(-5).reverse();

    populateFn(bestItems, bestElementId);
    populateFn(worstItems, worstElementId);
}

document.addEventListener('DOMContentLoaded', async () => {
    const trainData = await d3.csv("data/data_train_index.csv");
    const stopData = await d3.csv("data/data_stop.csv");

    // Generate the best and worst trains
    generateBestWorst(
        trainData,
        'median_arrival_delay',
        (items, id) => populateElement(items, id, trainTemplate, trainId => navigate('trains.html', 'train_id', trainId)),
        'best-trains',
        'worst-trains'
    );

    // Generate the best and worst stops
    const filteredStopData = stopData.filter(stop => stop.count_stops > 1200);
    generateBestWorst(
        filteredStopData,
        'avg_arrival_delay',
        (items, id) => populateElement(items, id, stopTemplate, stopName => navigate('index.html', 'stop_name', stopName)),
        'best-stops',
        'worst-stops'
    );
});
