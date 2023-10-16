const i18n = require('eleventy-plugin-i18n');

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(i18n, {
    translations: {
      hello: {
        'en-GB': 'Hello',
        'it-IT': 'Ciao!'
      }
    },
    fallbackLocales: {
      '*': 'it-IT'
    }
  });

  return {
    dir: {
      input: "views",
      output: "dist"
    }
};