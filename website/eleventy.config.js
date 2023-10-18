/**
 * Website entry point
 * 
 * Compile with:
 * ```
 * npm install
 * npm run build
 * ```
 */

const i18n = require('eleventy-plugin-i18n');

// load translation files
const translations = require('./src/_data/i18n');

// load custom filters
const customFilters = require('./src/_data/custom-filters.js')


module.exports = function (eleventyConfig) {

  // unpack static files in the root folder of the website
  eleventyConfig.addPassthroughCopy({ "./src/static": "/" });
  eleventyConfig.addPassthroughCopy("data/regions.geojson");

  // handle translations
  eleventyConfig.addPlugin(i18n, {
    translations,
    fallbackLocales: {
      '*': 'it'
    }
  });

  // TODO: make the customFilters.js module export a dictionary of function names and functions definitions and add all the filters here by looping on that
  eleventyConfig.addFilter("makeHeadTitle", customFilters.headTitle);

  return {
    dir: {
      input: "src",
      output: "dist",
    },
    markdownTemplateEngine: 'njk'
  }
};