const i18n = require('eleventy-plugin-i18n');
const translations = require('./_data/i18n');

module.exports = function(eleventyConfig) {
  eleventyConfig.addPlugin(i18n, {
    translations,
    fallbackLocales: {
      '*': 'it-IT'
    }
  });

  return {
    dir: {
      input: ".",
      output: "dist",
    },
    markdownTemplateEngine: 'njk'
  }
};