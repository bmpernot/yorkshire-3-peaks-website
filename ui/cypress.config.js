require("dotenv").config({ path: ".env.local" });

const { defineConfig } = require("cypress");

module.exports = defineConfig({
  env: {
    ui_base_url: "http://localhost:3000",
    largeViewportWidth: 1600,
    largeViewportHeight: 800,
    smallViewportWidth: 320,
    smallViewportHeight: 420,
  },

  scrollBehavior: "nearest",

  video: false,

  retries: {
    runMode: 2,
    openMode: 0,
  },
  e2e: {
    setupNodeEvents(on, config) {
      config.env = {
        ...process.env,
        ...config.env,
      };

      return config;
    },
  },
});
