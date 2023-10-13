/**
 * @file This file contains HTML templates for rendering train and stop data for the statistics page.
 */

import {toTitleCase, generateDelayString, trainClassToImage} from "../utils.js";

/**
 * Generates an HTML string representing a table row containing train data.
 *
 * @param {Object} train - A train object containing train data.
 * @returns {string} - An HTML string representing a table row containing train data.
 */
const trainTemplate = (train) => `
    <tr data-id="${train["train_id"]}">
        <td><img src=${trainClassToImage(train["train_class"])} class="ot-train-logo ot-train-logo-ic vertical-center"> ${train["train_number"]}</td>
        <td>${toTitleCase(train["train_departure_stop_name"])} <span uk-icon="arrow-right"></span> ${toTitleCase(train["train_arrival_stop_name"])}</td>
        <td>${generateDelayString(train["avg_arrival_delay"])}</td>
    </tr>
`;

/**
 * Generates an HTML string representing a table row containing stop data.
 *
 * @param {Object} stop - A stop object containing stop data.
 * @returns {string} - An HTML string representing a table row containing stop data.
 */
const stopTemplate = (stop) => `
    <tr data-id="${stop["stop_name"]}">
        <td>${toTitleCase(stop["stop_name"])}</td>
        <td>${generateDelayString(stop["avg_arrival_delay"])}</td>
        <td>${stop["count_stops"]}</td>
    </tr>
`;

export {trainTemplate, stopTemplate};