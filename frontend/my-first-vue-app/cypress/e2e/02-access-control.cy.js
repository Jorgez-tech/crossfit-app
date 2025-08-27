describe('Control de Acceso y Permisos', () => {
    beforeEach(() => {
        cy.mockBackend();
    });

    describe('Protección de Rutas sin Autenticación', () => {
        const protectedRoutes = [
            '/trainer',
            '/athlete',
            '/wods',
            '/members',
            '/records',
            '/profile'
        ];

        protectedRoutes.forEach(route => {
            it(`debe redirigir ${route} a login si no está autenticado`, () => {
                cy.visit(route);
                cy.url().should('include', '/login');
                cy.url().should('include', `redirect=${encodeURIComponent(route)}`);
            });
        });

        it('debe permitir acceso a rutas públicas sin autenticación', () => {
            const publicRoutes = ['/', '/todos', '/crossfit'];

            publicRoutes.forEach(route => {
                cy.visit(route);
                cy.url().should('not.include', '/login');
            });
        });
    });

    describe('Permisos Específicos por Rol - Entrenador', () => {
        beforeEach(() => {
            cy.loginAsTrainer();
        });

        it('debe permitir acceso a todas las rutas de entrenador', () => {
            const trainerRoutes = [
                { path: '/trainer', element: '[data-cy="trainer-dashboard"]' },
                { path: '/wods', element: '[data-cy="wods-list"]' },
                { path: '/members', element: '[data-cy="members-list"]' },
                { path: '/records', element: '[data-cy="records-list"]' },
                { path: '/profile', element: '[data-cy="user-profile"]' }
            ];

            trainerRoutes.forEach(route => {
                cy.visit(route.path);
                cy.url().should('include', route.path);
                cy.get(route.element).should('be.visible');
            });
        });

        it('debe mostrar funcionalidades específicas de entrenador en WODs', () => {
            cy.visit('/wods');

            // Debe poder crear WODs
            cy.get('[data-cy="create-wod-button"]').should('be.visible');
            cy.get('[data-cy="wod-form"]').should('not.exist');

            cy.get('[data-cy="create-wod-button"]').click();
            cy.get('[data-cy="wod-form"]').should('be.visible');

            // Debe poder editar WODs existentes
            cy.get('[data-cy="wod-item"]').first().within(() => {
                cy.get('[data-cy="edit-wod-button"]').should('be.visible');
                cy.get('[data-cy="delete-wod-button"]').should('be.visible');
            });
        });

        it('debe tener acceso completo a gestión de miembros', () => {
            cy.visit('/members');

            // Debe ver todos los miembros
            cy.get('[data-cy="members-list"]').should('be.visible');
            cy.get('[data-cy="member-item"]').should('have.length.at.least', 1);

            // Debe poder crear miembros
            cy.get('[data-cy="create-member-button"]').should('be.visible');

            // Debe poder editar miembros
            cy.get('[data-cy="member-item"]').first().within(() => {
                cy.get('[data-cy="edit-member-button"]').should('be.visible');
            });

            // Debe poder filtrar por diferentes criterios
            cy.get('[data-cy="member-filter"]').should('be.visible');
            cy.get('[data-cy="search-members"]').should('be.visible');
        });

        it('debe ver todos los records de todos los atletas', () => {
            cy.visit('/records');

            // Debe ver records de todos los usuarios
            cy.get('[data-cy="records-list"]').should('be.visible');
            cy.get('[data-cy="user-filter"]').should('be.visible');

            // Debe poder filtrar por usuario específico
            cy.get('[data-cy="user-filter"]').select('Ana Rodríguez');
            cy.get('[data-cy="record-item"]').should('contain', 'Ana Rodríguez');
        });

        it('NO debe poder acceder al dashboard de atleta', () => {
            cy.visit('/athlete');
            cy.shouldShowAccessDenied();
        });
    });

    describe('Permisos Específicos por Rol - Atleta', () => {
        beforeEach(() => {
            // Mock para atleta
            cy.intercept('POST', '**/api/auth/login', {
                statusCode: 200,
                body: {
                    status: 'OK',
                    data: {
                        token: 'athlete-token',
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
        });

        it('debe permitir acceso a rutas específicas de atleta', () => {
            const athleteRoutes = [
                { path: '/athlete', element: '[data-cy="athlete-dashboard"]' },
                { path: '/wods', element: '[data-cy="wods-list"]' },
                { path: '/records', element: '[data-cy="records-list"]' },
                { path: '/profile', element: '[data-cy="user-profile"]' }
            ];

            athleteRoutes.forEach(route => {
                cy.visit(route.path);
                cy.url().should('include', route.path);
                cy.get(route.element).should('be.visible');
            });
        });

        it('NO debe poder acceder a gestión de miembros', () => {
            cy.visit('/members');
            cy.shouldShowAccessDenied();
        });

        it('NO debe poder acceder al dashboard de entrenador', () => {
            cy.visit('/trainer');
            cy.shouldShowAccessDenied();
        });

        it('debe tener funcionalidades limitadas en WODs', () => {
            cy.visit('/wods');

            // NO debe poder crear WODs
            cy.get('[data-cy="create-wod-button"]').should('not.exist');

            // NO debe poder editar/eliminar WODs
            cy.get('[data-cy="wod-item"]').first().within(() => {
                cy.get('[data-cy="edit-wod-button"]').should('not.exist');
                cy.get('[data-cy="delete-wod-button"]').should('not.exist');
            });

            // Pero SÍ debe poder ver los WODs
            cy.get('[data-cy="wod-item"]').should('have.length.at.least', 1);
        });

        it('debe ver solo sus propios records', () => {
            // Mock de records filtrados para el atleta
            cy.intercept('GET', '**/api/records', {
                statusCode: 200,
                body: {
                    status: 'OK',
                    data: [
                        {
                            id: 1,
                            user_id: 2, // ID del atleta actual
                            wod_id: 1,
                            result: '3:45',
                            notes: 'Great workout!',
                            date: '2025-08-22',
                            created_at: '2025-08-22T12:00:00Z'
                        }
                    ]
                }
            }).as('athleteRecords');

            cy.visit('/records');

            // NO debe ver filtro de usuarios (solo ve sus records)
            cy.get('[data-cy="user-filter"]').should('not.exist');

            // Debe ver solo sus records
            cy.get('[data-cy="record-item"]').should('have.length', 1);
            cy.get('[data-cy="record-item"]').should('contain', '3:45');
        });

        it('debe poder registrar sus propios records', () => {
            cy.visit('/records');

            // Debe poder crear records
            cy.get('[data-cy="create-record-button"]').should('be.visible');

            // Mock de creación de record
            cy.intercept('POST', '**/api/records', {
                statusCode: 201,
                body: {
                    status: 'OK',
                    data: {
                        id: 2,
                        user_id: 2,
                        wod_id: 1,
                        result: '4:15',
                        notes: 'Personal best!',
                        date: '2025-08-22'
                    }
                }
            }).as('createRecord');

            cy.createRecord({
                wodName: 'Fran',
                result: '4:15',
                notes: 'Personal best!'
            });

            cy.wait('@createRecord');
        });
    });

    describe('Página de Acceso Denegado', () => {
        it('debe mostrar información específica para usuarios no autenticados', () => {
            cy.visit('/access-denied');

            cy.get('[data-cy="access-denied-title"]').should('contain', 'Acceso Denegado');
            cy.get('[data-cy="login-suggestion"]').should('be.visible');
            cy.get('[data-cy="login-button"]').should('be.visible');
        });

        it('debe mostrar información específica para usuarios autenticados sin permisos', () => {
            // Login como atleta
            cy.intercept('POST', '**/api/auth/login', {
                statusCode: 200,
                body: {
                    status: 'OK',
                    data: {
                        token: 'athlete-token',
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

            // Intentar acceder a página de entrenador
            cy.visit('/members');

            cy.get('[data-cy="access-denied-title"]').should('be.visible');
            cy.get('[data-cy="user-info"]').should('contain', 'Ana Rodríguez');
            cy.get('[data-cy="user-role"]').should('contain', 'Atleta');
            cy.get('[data-cy="permissions-list"]').should('be.visible');
            cy.get('[data-cy="suggested-actions"]').should('be.visible');
        });

        it('debe permitir contactar al administrador', () => {
            cy.visit('/access-denied');

            cy.get('[data-cy="contact-admin-button"]').should('be.visible');
            cy.get('[data-cy="contact-admin-button"]').click();

            // Verificar que se muestra algún feedback
            cy.get('[data-cy="contact-feedback"]').should('be.visible');
        });
    });

    describe('Navegación con Query Parameters', () => {
        it('debe redirigir a la ruta original después del login', () => {
            const targetRoute = '/wods';

            // Intentar acceder a ruta protegida sin auth
            cy.visit(targetRoute);
            cy.url().should('include', '/login');
            cy.url().should('include', `redirect=${encodeURIComponent(targetRoute)}`);

            // Hacer login
            cy.loginAsTrainer();

            // Debe redirigir a la ruta original
            cy.url().should('include', targetRoute);
        });
    });

    describe('Guards de Navegación en Tiempo Real', () => {
        it('debe actualizar permisos cuando cambia el rol del usuario', () => {
            cy.loginAsTrainer();

            // Verificar acceso a gestión de miembros
            cy.visit('/members');
            cy.get('[data-cy="members-list"]').should('be.visible');

            // Simular cambio de rol a atleta (podría ser por actualización del token)
            cy.window().then(win => {
                win.localStorage.setItem('user', JSON.stringify({
                    id: 1,
                    email: 'carlos@box.com',
                    name: 'Carlos Mendoza',
                    role: 'atleta' // Cambio de rol
                }));
            });

            // Intentar navegar a una ruta de entrenador
            cy.visit('/members');
            cy.shouldShowAccessDenied();
        });
    });
});
