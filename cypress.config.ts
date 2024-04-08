import { defineConfig } from "cypress";

import "dotenv/config";

export default defineConfig({
  e2e: {
    setupNodeEvents() {
      // implement node event listeners here
    },
    baseUrl: "http://localhost:3000",
    viewportWidth: 1280,
    viewportHeight: 720,
    testIsolation: true,
    specPattern: [
      "cypress/e2e/logged_in_user.cy.ts",
      "cypress/e2e/page_tests.cy.ts",
      "cypress/e2e/template_page.cy.ts",
    ],
    env: {
      LOGIN_TOKEN: process.env.LOGIN_TOKEN,
    },
  },
});
