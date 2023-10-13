/**
 * @file
 * This file contains utility functions for data transformation and UI manipulation.
 * Each function is designed to be general-purpose and reusable across multiple modules and components.
 */

/**
 * Converts a string to Title Case.
 *
 * @param {string} str - The string to convert.
 * @returns {string} - The converted string in Title Case.
 */
function toTitleCase(str) {
    return str.replace(/\w+/g, word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
}

/**
 * Converts a numerical delay value into a string representing the delay in minutes and seconds.
 *
 * @param {number} delay - The delay in minutes.
 * @returns {string} - A string representing the delay in the format of minutes' seconds''.
 */
function generateDelayString(delay) {
    const minutes = Math.floor(delay);
    const seconds = Math.round((delay - minutes) * 60);
    return seconds === 0 ? `${minutes}'` : `${minutes}' ${seconds}''`;
}

/**
 * Calculates the percentage of delayed trains.
 *
 * @param {number} delayCount - The number of delayed trains.
 * @param {number} totalCount - The total number of trains.
 * @returns {number} - The percentage of delayed trains, rounded to the nearest integer.
 */
const calculateDelayPercentage = (delayCount, totalCount) =>
    Math.round((delayCount / totalCount) * 100);

/**
 * Rounds a number to a specified number of decimal places.
 *
 * @param {number} value - The number to round.
 * @param {number} decimals - The number of decimal places to round to.
 * @returns {number} - The rounded number.
 */
function round(value, decimals) {
    const factor = Math.pow(10, decimals);
    return Math.round(value * factor) / factor;
}

// Train class names
const trainClassNames = {
    'IC': 'InterCity (IC)',
    'REG': 'Regionale (REG)',
    'EC': 'EuroCity (EC)',
    'AV': 'Alta Velocità (AV), FrecciaRossa, FrecciaBianca, FrecciaArgento',
}

/**
 * Maps a train class abbreviation to the corresponding image source.
 *
 * @param {string} train_class - The abbreviation of the train class.
 * @returns {string} - The image source string corresponding to the train class, or a default image if the class is not recognized.
 */
function trainClassToImage(train_class) {
    const trainImages = {
        'IC': 'media/intercity.svg width=\'80px\'',
        'ICN': 'media/intercity_notte.svg width=\'80px\'',
        'REG': 'media/RE.svg',
        'EC': 'media/EC.svg',
        'FR': 'media/frecciarossa.svg width=\'80px\'',
        'FB': 'media/frecciabianca.svg width=\'80px\'',
        'FA': 'media/frecciargento.svg width=\'80px\''
    };

    return trainImages[train_class] || 'media/logo/favicon.png';
}

export {toTitleCase, generateDelayString, calculateDelayPercentage, round, trainClassNames, trainClassToImage};