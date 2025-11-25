const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: '8yb3ey',
    e2e: {
        baseUrl: "http://localhost:8080",
        supportFile: "cypress/support/e2e.js",
        specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
        viewportWidth: 1280,
        viewportHeight: 720,
        video: true,
        screenshotOnRunFailure: true,
        defaultCommandTimeout: 10000,
        requestTimeout: 10000,
        responseTimeout: 10000,
        pageLoadTimeout: 30000,
        experimentalStudio: true,
        env: {
            apiUrl: "http://localhost:3000",
            testUser: {
                trainer: {
                    email: "carlos@box.com",
                    password: "123456",
                    name: "Carlos Entrenador",
                },
                athlete: {
                    email: "ana@box.com",
                    password: "123456",
                    name: "Ana Atleta",
                },
            },
        },
        setupNodeEvents(on, config) {
            // Configuraciones adicionales de Node.js
            return config;
        },
    },
});
