// Comandos personalizados para la aplicación CrossFit

// Comando para login como entrenador
Cypress.Commands.add('loginAsTrainer', () => {
    const trainer = Cypress.env('testUser').trainer;

    cy.visit('/login');
    cy.get('[data-cy="email-input"]').type(trainer.email);
    cy.get('[data-cy="password-input"]').type(trainer.password);
    cy.get('[data-cy="login-button"]').click();

    // Verificar que estamos en el dashboard del entrenador
    cy.url().should('include', '/trainer');
    cy.get('[data-cy="welcome-message"]').should('contain', trainer.name);
});

// Comando para login como atleta
Cypress.Commands.add('loginAsAthlete', () => {
    const athlete = Cypress.env('testUser').athlete;

    cy.visit('/login');
    cy.get('[data-cy="email-input"]').type(athlete.email);
    cy.get('[data-cy="password-input"]').type(athlete.password);
    cy.get('[data-cy="login-button"]').click();

    // Verificar que estamos en el dashboard del atleta
    cy.url().should('include', '/athlete');
    cy.get('[data-cy="welcome-message"]').should('contain', athlete.name);
});

// Comando para logout
Cypress.Commands.add('logout', () => {
    cy.get('[data-cy="user-menu"]').click();
    cy.get('[data-cy="logout-button"]').click();
    cy.url().should('include', '/login');
});

// Comando para crear un WOD
Cypress.Commands.add('createWod', (wodData) => {
    cy.get('[data-cy="create-wod-button"]').click();
    cy.get('[data-cy="wod-name-input"]').type(wodData.name);
    cy.get('[data-cy="wod-mode-select"]').select(wodData.mode);
    cy.get('[data-cy="wod-description-textarea"]').type(wodData.description);
    cy.get('[data-cy="save-wod-button"]').click();

    // Verificar que el WOD fue creado
    cy.get('[data-cy="wod-list"]').should('contain', wodData.name);
});

// Comando para crear un record
Cypress.Commands.add('createRecord', (recordData) => {
    cy.get('[data-cy="create-record-button"]').click();
    cy.get('[data-cy="record-wod-select"]').select(recordData.wodName);
    cy.get('[data-cy="record-result-input"]').type(recordData.result);
    if (recordData.notes) {
        cy.get('[data-cy="record-notes-textarea"]').type(recordData.notes);
    }
    cy.get('[data-cy="save-record-button"]').click();

    // Verificar que el record fue creado
    cy.get('[data-cy="records-list"]').should('contain', recordData.result);
});

// Comando para verificar acceso denegado
Cypress.Commands.add('shouldShowAccessDenied', () => {
    cy.url().should('include', '/access-denied');
    cy.get('[data-cy="access-denied-title"]').should('be.visible');
});

// Comando para esperar que la aplicación cargue
Cypress.Commands.add('waitForApp', () => {
    cy.intercept('GET', '**/api/**').as('apiCalls');
    cy.wait('@apiCalls');

    // Esperar a que los componentes principales estén cargados
    cy.get('[data-cy="app-container"]', { timeout: 10000 }).should('be.visible');
});

// Comando para simular datos del backend
Cypress.Commands.add('mockBackend', () => {
    // Mock de autenticación dinámico
    cy.intercept('POST', '**/api/v1/auth/login', (req) => {
        if (req.body.email === 'usuario@incorrecto.com') {
            req.reply({
                statusCode: 401,
                body: {
                    status: 'ERROR',
                    message: 'Usuario o contraseña incorrectos'
                }
            });
        } else if (req.body.email === 'carlos@box.com') {
            req.reply({
                statusCode: 200,
                body: {
                    status: 'OK',
                    data: {
                        token: 'mock-jwt-token-trainer',
                        user: {
                            id: 1,
                            email: 'carlos@box.com',
                            name: 'Carlos Entrenador',
                            role: 'entrenador'
                        }
                    }
                }
            });
        } else if (req.body.email === 'ana@box.com') {
            req.reply({
                statusCode: 200,
                body: {
                    status: 'OK',
                    data: {
                        token: 'mock-jwt-token-athlete',
                        user: {
                            id: 2,
                            email: 'ana@box.com',
                            name: 'Ana Atleta',
                            role: 'atleta'
                        }
                    }
                }
            });
        } else {
            req.reply({
                statusCode: 200,
                body: {
                    status: 'OK',
                    data: {
                        token: 'mock-jwt-token',
                        user: {
                            id: 1,
                            email: req.body.email,
                            name: 'Usuario Test',
                            role: 'entrenador'
                        }
                    }
                }
            });
        }
    }).as('mockLogin');

    // Mock de registro exitoso
    cy.intercept('POST', '**/api/v1/auth/register', {
        statusCode: 201,
        body: {
            status: 'OK',
            data: {
                token: 'mock-jwt-token',
                user: {
                    id: 3,
                    email: 'nuevo@atleta.com',
                    name: 'Nuevo Atleta',
                    role: 'atleta'
                }
            }
        }
    }).as('registerSuccess');

    // Mock de verificación de usuario
    cy.intercept('GET', '**/api/v1/auth/me', {
        statusCode: 200,
        body: {
            status: 'OK',
            data: {
                id: 1,
                email: 'carlos@box.com',
                name: 'Carlos Entrenador',
                role: 'entrenador'
            }
        }
    }).as('mockUser');

    // Mock de WODs
    cy.intercept('GET', '**/api/v1/workouts', {
        statusCode: 200,
        body: {
            status: 'OK',
            data: [
                {
                    id: 1,
                    name: 'Fran',
                    mode: 'For Time',
                    description: '21-15-9\nThrusters (95/65)\nPull-ups',
                    created_at: '2025-08-22T10:00:00Z'
                },
                {
                    id: 2,
                    name: 'Grace',
                    mode: 'For Time',
                    description: '30 Clean and Jerks\n135/95 lbs',
                    created_at: '2025-08-22T11:00:00Z'
                }
            ]
        }
    }).as('mockWods');

    // Mock de Members
    cy.intercept('GET', '**/api/v1/members', {
        statusCode: 200,
        body: {
            status: 'OK',
            data: [
                {
                    id: 2,
                    email: 'ana@box.com',
                    name: 'Ana Atleta',
                    role: 'atleta',
                    created_at: '2025-08-20T10:00:00Z'
                },
                {
                    id: 3,
                    email: 'juan@correo.com',
                    name: 'Juan Pérez',
                    role: 'atleta',
                    created_at: '2025-08-21T10:00:00Z'
                }
            ]
        }
    }).as('mockMembers');

    // Mock de Records
    cy.intercept('GET', '**/api/v1/records', {
        statusCode: 200,
        body: {
            status: 'OK',
            data: [
                {
                    id: 1,
                    user_id: 2,
                    wod_id: 1,
                    result: '3:45',
                    notes: 'Great workout!',
                    date: '2025-08-22',
                    created_at: '2025-08-22T12:00:00Z'
                }
            ]
        }
    }).as('mockRecords');
});

// Comando para verificar elementos de la UI por rol
Cypress.Commands.add('checkTrainerUI', () => {
    cy.get('[data-cy="create-wod-button"]').should('be.visible');
    cy.get('[data-cy="manage-members-link"]').should('be.visible');
    cy.get('[data-cy="trainer-stats"]').should('be.visible');
});

Cypress.Commands.add('checkAthleteUI', () => {
    cy.get('[data-cy="create-wod-button"]').should('not.exist');
    cy.get('[data-cy="manage-members-link"]').should('not.exist');
    cy.get('[data-cy="athlete-stats"]').should('be.visible');
    cy.get('[data-cy="record-button"]').should('be.visible');
});
