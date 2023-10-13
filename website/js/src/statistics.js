/**
 * @file This file is responsible for loading, processing, and rendering train and stop data onto
 * the web page.
 * The data is loaded from CSV files using D3.js, sorted, and filtered according
 * to specific criteria, and then the "best" and "worst" items are rendered into designated
 * HTML elements using predefined templates.
 */

import {trainTemplate, stopTemplate} from './templates/statistics';

const TRAIN_DATA_CSV_PATH = 'data/data_train_index.csv';
const STOP_DATA_CSV_PATH = 'data/data_stop.csv';

/**
 * Updates the current page's URL to navigate to the specified URL, appended with a query string containing the provided parameter key and value.
 *
 * @param {string} url - The base URL to navigate to, such as 'trains.html' or 'index.html'.
 * @param {string} paramKey - The key for the query parameter to be appended to the URL.
 * @param {string} paramValue - The value for the query parameter to be appended to the URL.
 * @returns {void} - This function does not return anything; it updates the window's location to navigate to the new URL.
 */
const navigate = (url, paramKey, paramValue) =>
    window.location.href = `${url}?${paramKey}=${paramValue}`;

/**
 * Populate the given element with the given items using the given template.
 * It also assigns a click event handler to each item.
 *
 * @param {Object[]} items - An array of objects,
 * where each object represents a row of data with properties corresponding to different data attributes.
 * @param {string} elementId - The ID of the HTML element that will be populated with items.
 * @param {function(Object): string} template - A function that takes an item (object)
 * as an argument and returns an HTML string that represents the item.
 * @param {function(string): void} onClick - A function that will be called when an item
 * is clicked.
 * It receives the ID of the clicked item as an argument.
 */
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

/**
 * Generates the best and worst items based on the provided criteria and populates the specified elements with them.
 *
 * @param {Object[]} data - An array of objects,
 * where each object represents a row of data with properties corresponding to different data attributes.
 * @param {string} sortProperty - The property name to sort the data by.
 * It should be a key that exists in each object within the data array.
 * @param {function(Object[], string): void} populateFn - A function that takes an array of objects and an element ID as arguments,
 * and populates the specified HTML element with the provided data.
 * @param {string} bestElementId -
 * The ID of the HTML element to be populated with the best items based on the sorting criteria.
 * @param {string} worstElementId -
 * The ID of the HTML element to be populated with the worst items based on the sorting criteria.
 */
function generateBestWorst(data, sortProperty, populateFn, bestElementId, worstElementId) {
    const sortedData = data.sort((a, b) => a[sortProperty] - b[sortProperty]);
    const bestItems = sortedData.slice(0, 5);
    const worstItems = sortedData.slice(-5).reverse();

    populateFn(bestItems, bestElementId);
    populateFn(worstItems, worstElementId);
}

document.addEventListener('DOMContentLoaded', async () => {
    // Load the data from the csv files
    const trainData = await d3.csv(TRAIN_DATA_CSV_PATH);
    const stopData = await d3.csv(STOP_DATA_CSV_PATH);

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
        'median_arrival_delay',
        (items, id) => populateElement(items, id, stopTemplate, stopName => navigate('index.html', 'stop_name', stopName)),
        'best-stops',
        'worst-stops'
    );
});
