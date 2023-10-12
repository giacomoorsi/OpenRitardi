// ----------------------------------
// UTILITY FUNCTIONS
// ----------------------------------

// Capitalize the first letter of each word
function pascalize(str) {
    return str.replace(/\w+/g, word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
}

// Create a string representing the delay in minutes and seconds (example: 5.5 is converted to 5' 30'' (5 minutes, 30 seconds))
function generateDelayString(delay) {
    const minutes = Math.floor(delay);
    const seconds = Math.round((delay - minutes) * 60);
    return seconds === 0 ? `${minutes}'` : `${minutes}' ${seconds}''`;
}

// Calculate the percentage of delayed trains
const calculateDelayPercentage = (delayCount, totalCount) =>
    Math.round((delayCount / totalCount) * 100);

// TODO: improve this function
function round(value, decimals) {
    value = Number(value);
    return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
}

// Train class names
const trainClassNames = {
    'IC': 'InterCity (IC)',
    'REG': 'Regionale (REG)',
    'EC': 'EuroCity (EC)',
    'AV': 'Alta Velocità (AV), FrecciaRossa, FrecciaBianca, FrecciaArgento',
}

// Convert train class to image
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

export {pascalize, generateDelayString, calculateDelayPercentage, round, trainClassNames, trainClassToImage};