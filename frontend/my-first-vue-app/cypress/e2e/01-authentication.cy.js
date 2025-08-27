describe('Autenticación y Navegación', () => {
    beforeEach(() => {
        cy.mockBackend();
    });

    describe('Página de Login', () => {
        it('debe cargar la página de login correctamente', () => {
            cy.visit('/login');

            cy.get('[data-cy="login-form"]').should('be.visible');
            cy.get('[data-cy="email-input"]').should('be.visible');
            cy.get('[data-cy="password-input"]').should('be.visible');
            cy.get('[data-cy="login-button"]').should('be.visible');
            cy.get('[data-cy="register-tab"]').should('be.visible');

            cy.title().should('include', 'Iniciar Sesión');
        });

        it('debe mostrar errores de validación con campos vacíos', () => {
            cy.visit('/login');

            cy.get('[data-cy="login-button"]').click();

            // Los campos required del HTML5 deberían prevenir el envío
            cy.get('[data-cy="email-input"]:invalid').should('exist');
            cy.get('[data-cy="password-input"]:invalid').should('exist');
        });

        it('debe mostrar error con credenciales incorrectas', () => {
            cy.visit('/login');

            cy.get('[data-cy="email-input"]').type('usuario@incorrecto.com');
            cy.get('[data-cy="password-input"]').type('password123');
            cy.get('[data-cy="login-button"]').click();

            cy.wait('@mockLogin');
            cy.get('[data-cy="error-message"]').should('contain', 'Usuario o contraseña incorrectos');
        });
    });

    describe('Login como Entrenador', () => {
        it('debe hacer login exitoso y redirigir al dashboard de entrenador', () => {
            const trainer = Cypress.env('testUser').trainer;

            cy.visit('/login');

            cy.get('[data-cy="email-input"]').type(trainer.email);
            cy.get('[data-cy="password-input"]').type(trainer.password);
            cy.get('[data-cy="login-button"]').click();

            cy.wait('@mockLogin');

            // Debe redirigir al dashboard del entrenador
            cy.url().should('include', '/trainer');
            cy.get('[data-cy="trainer-dashboard"]').should('be.visible');
            cy.get('[data-cy="welcome-message"]').should('contain', trainer.name);

            // Verificar elementos específicos del entrenador
            cy.checkTrainerUI();
        });

        it('debe mantener la sesión después de recargar la página', () => {
            cy.loginAsTrainer();

            cy.reload();

            // Debe seguir en el dashboard del entrenador
            cy.url().should('include', '/trainer');
            cy.get('[data-cy="trainer-dashboard"]').should('be.visible');
        });
    });

    describe('Login como Atleta', () => {
        it('debe hacer login exitoso y redirigir al dashboard de atleta', () => {
            // Mock específico para atleta
            cy.intercept('POST', '**/api/auth/login', {
                statusCode: 200,
                body: {
                    status: 'OK',
                    data: {
                        token: 'mock-athlete-token',
                        user: {
                            id: 2,
                            email: 'ana@correo.com',
                            name: 'Ana Rodríguez',
                            role: 'atleta'
                        }
                    }
                }
            }).as('athleteLogin');

            cy.intercept('GET', '**/api/auth/me', {
                statusCode: 200,
                body: {
                    status: 'OK',
                    data: {
                        id: 2,
                        email: 'ana@correo.com',
                        name: 'Ana Rodríguez',
                        role: 'atleta'
                    }
                }
            }).as('athleteUser');

            const athlete = Cypress.env('testUser').athlete;

            cy.visit('/login');

            cy.get('[data-cy="email-input"]').type(athlete.email);
            cy.get('[data-cy="password-input"]').type(athlete.password);
            cy.get('[data-cy="login-button"]').click();

            cy.wait('@mockLogin');

            // Debe redirigir al dashboard del atleta
            cy.url().should('include', '/athlete');
            cy.get('[data-cy="athlete-dashboard"]').should('be.visible');
            cy.get('[data-cy="welcome-message"]').should('contain', athlete.name);

            // Verificar elementos específicos del atleta
            cy.checkAthleteUI();
        });
    });

    describe('Logout', () => {
        it('debe hacer logout correctamente desde el dashboard de entrenador', () => {
            cy.loginAsTrainer();

            cy.get('[data-cy="user-menu"]').click();
            cy.get('[data-cy="logout-button"]').click();

            // Debe redirigir a login
            cy.url().should('include', '/login');
            cy.get('[data-cy="login-form"]').should('be.visible');

            // No debe poder acceder a rutas protegidas
            cy.visit('/trainer');
            cy.url().should('include', '/login');
        });
    });

    describe('Redirecciones de Login', () => {
        it('debe redirigir usuarios ya logueados desde /login', () => {
            cy.loginAsTrainer();

            // Intentar ir a login debe redirigir al dashboard
            cy.visit('/login');
            cy.url().should('include', '/trainer');
        });

        it('debe redirigir desde /dashboard a panel específico del rol', () => {
            cy.loginAsTrainer();

            cy.visit('/dashboard');
            cy.url().should('include', '/trainer');

            // También test para atleta
            cy.logout();

            // Mock para atleta
            cy.intercept('POST', '**/api/auth/login', {
                statusCode: 200,
                body: {
                    status: 'OK',
                    data: {
                        token: 'mock-athlete-token',
                        user: { id: 2, email: 'ana@correo.com', name: 'Ana Rodríguez', role: 'atleta' }
                    }
                }
            });

            cy.intercept('GET', '**/api/auth/me', {
                statusCode: 200,
                body: {
                    status: 'OK',
                    data: { id: 2, email: 'ana@correo.com', name: 'Ana Rodríguez', role: 'atleta' }
                }
            });

            const athlete = Cypress.env('testUser').athlete;
            cy.visit('/login');
            cy.get('[data-cy="email-input"]').type(athlete.email);
            cy.get('[data-cy="password-input"]').type(athlete.password);
            cy.get('[data-cy="login-button"]').click();

            cy.visit('/dashboard');
            cy.url().should('include', '/athlete');
        });
    });

    describe('Registro de Usuarios', () => {
        it('debe permitir registro como atleta', () => {
            // Mock de registro exitoso
            cy.intercept('POST', '**/api/auth/register', {
                statusCode: 201,
                body: {
                    status: 'OK',
                    data: {
                        token: 'new-user-token',
                        user: {
                            id: 3,
                            email: 'nuevo@atleta.com',
                            name: 'Nuevo Atleta',
                            role: 'atleta'
                        }
                    }
                }
            }).as('registerSuccess');

            cy.visit('/login');
            cy.get('[data-cy="register-tab"]').click();

            cy.get('[data-cy="register-name-input"]').type('Nuevo Atleta');
            cy.get('[data-cy="register-email-input"]').type('nuevo@atleta.com');
            cy.get('[data-cy="register-password-input"]').type('123456');
            cy.get('[data-cy="register-role-select"]').select('atleta');
            cy.get('[data-cy="register-button"]').click();

            cy.wait('@registerSuccess');

            // Debe redirigir al dashboard del atleta
            cy.url().should('include', '/athlete');
        });
    });
});
