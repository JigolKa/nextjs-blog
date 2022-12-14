import { defineConfig } from "cypress";

export default defineConfig({
 e2e: {
  baseUrl: "http://localhost:3000",
  supportFile: false,
  specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
 },

 chromeWebSecurity: false,

 component: {
  devServer() {
   return {
    port: 3000,
    close: () => {},
   };
  },
 },
});
