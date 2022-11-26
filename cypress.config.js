const { defineConfig } = require("cypress");

require('dotenv').config()

module.exports = defineConfig({
  fixturesFolder: "tests/e2e/fixtures",
  screenshotsFolder: "tests/e2e/screenshots",
  videosFolder: "tests/e2e/videos",

  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      config.env = {
        ...process.env,
      }
      return config 
    },
    specPattern(on, config) {
      return require("./tests/e2e/plugins/index.js")(on, config);
    },
    specPattern: "tests/e2e/specs/**/*.cy.{js,jsx,ts,tsx}",
    supportFile: "tests/e2e/support/index.js",
    hosts: { "*.localhost": "127.0.0.1" },
    baseUrl: 'http://dev.localhost:8080',
  },

  component: {
    devServer: {
      framework: "vue-cli",
      bundler: "webpack",
    },
  },
});