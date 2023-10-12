// ----------------------------------
// STATISTICS HTML TEMPLATE
// ----------------------------------

import {pascalize, generateDelayString, trainClassToImage} from "../utils.js";

const trainTemplate = (train) => `
    <tr data-id="${train["train_id"]}">
        <td><img src=${trainClassToImage(train["train_class"])} class="ot-train-logo ot-train-logo-ic vertical-center"> ${train["train_number"]}</td>
        <td>${pascalize(train["train_departure_stop_name"])} <span uk-icon="arrow-right"></span> ${pascalize(train["train_arrival_stop_name"])}</td>
        <td>${generateDelayString(train["avg_arrival_delay"])}</td>
    </tr>
`;

const stopTemplate = (stop) => `
    <tr data-id="${stop["stop_name"]}">
        <td>${pascalize(stop["stop_name"])}</td>
        <td>${generateDelayString(stop["avg_arrival_delay"])}</td>
        <td>${stop["count_stops"]}</td>
    </tr>
`;

export {trainTemplate, stopTemplate};