const fs = require('fs');
const handlebars = require('handlebars');

// Read the template file
const source = fs.readFileSync('index.hbs', 'utf8');

// Compile the template
const template = handlebars.compile(source);

// Data to be injected into the template
const data = {
    title: 'My Compiled Template',
    heading: 'Hello, World!',
    content: 'This is a compiled HTML template using Handlebars.'
};

// Render the template with data
const result = template(data);

// Write the compiled HTML to a file
fs.writeFileSync('output.html', result);
