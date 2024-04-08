import { defineConfig } from "cypress";

import "dotenv/config";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: "http://localhost:3000",
    env: {
      LOGIN_TOKEN: process.env.LOGIN_TOKEN,
    },
  },
});
