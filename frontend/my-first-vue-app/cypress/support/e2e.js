// Importar comandos de Cypress
import './commands';

// Configuración global de testing-library
import '@testing-library/cypress/add-commands';

// Configuraciones globales
Cypress.Commands.add('setupInterceptors', () => {
    // Interceptar llamadas al API
    cy.intercept('GET', '**/api/auth/me', { fixture: 'user.json' }).as('getUser');
    cy.intercept('GET', '**/api/wods', { fixture: 'wods.json' }).as('getWods');
    cy.intercept('GET', '**/api/members', { fixture: 'members.json' }).as('getMembers');
    cy.intercept('GET', '**/api/records', { fixture: 'records.json' }).as('getRecords');
});

// Manejar excepciones no capturadas
Cypress.on('uncaught:exception', (err, runnable) => {
    // Ignorar errores específicos que no afectan las pruebas
    if (err.message.includes('ResizeObserver') ||
        err.message.includes('Script error') ||
        err.message.includes('Non-Error promise rejection captured')) {
        return false;
    }
    return true;
});

// Configuración antes de cada test
beforeEach(() => {
    // Limpiar localStorage y sessionStorage
    cy.clearLocalStorage();
    cy.clearCookies();

    // Configurar viewport consistente
    cy.viewport(1280, 720);
});

// Configuración después de cada test
afterEach(() => {
    // Tomar screenshot en caso de fallo
    cy.screenshot({ capture: 'runner', onlyOnFailure: true });
});
