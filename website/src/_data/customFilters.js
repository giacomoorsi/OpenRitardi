var nunjucks = require('nunjucks');
var env = new nunjucks.Environment();

// env.addFilter('headTitle', function(str) {
//     return "bubino"
// });

function headTitle(input) {
    return input + " | OpenRitardi"
}

module.exports = {
    headTitle
}