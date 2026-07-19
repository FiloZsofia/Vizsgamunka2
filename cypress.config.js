const { defineConfig } = require("cypress");

module.exports = defineConfig({
  allowCypressEnv: false,

  e2e: {
    baseUrl: 'http://127.0.0.1:5501/Main',
    viewportWidth: 1920,   // Full HD szélesség
    viewportHeight: 1080,  // Full HD magasság
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
