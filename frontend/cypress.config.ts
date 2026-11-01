import { defineConfig } from "cypress";

export default defineConfig({
  reporter: "cypress-mochawesome-reporter",
  reporterOptions: {
    reportDir: "cypress/reports",
    charts: true,
    reportPageTitle: "Eco Bliss Bath - Rapport de tests",
    embeddedScreenshots: true,
    inlineAssets: true,
  },

  expose: {
    apiUrl: "http://localhost:8081",
  },

  e2e: {
    baseUrl: "http://localhost:4200",
    setupNodeEvents(on, config) {
      require("cypress-mochawesome-reporter/plugin")(on);
    },
  },
});