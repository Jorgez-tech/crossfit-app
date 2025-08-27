describe('Flujos de Integración Completos', () => {
    beforeEach(() => {
        cy.mockBackend();
    });

    describe('Flujo Completo del Entrenador', () => {
        it('debe permitir el flujo completo: login → crear WOD → asignar a atleta → ver resultados', () => {
            // 1. Login como entrenador
            cy.loginAsTrainer();
            cy.url().should('include', '/trainer');

            // 2. Crear un nuevo WOD
            cy.intercept('POST', '**/api/workouts', {
                statusCode: 201,
                body: {
                    status: 'OK',
                    data: {
                        id: 10,
                        name: 'WOD Integración',
                        type: 'For Time',
                        description: '5 rounds: 10 burpees, 15 air squats',
                        created_at: new Date().toISOString()
                    }
                }
            }).as('createWod');

            cy.visit('/wods');
            cy.get('[data-cy="create-wod-button"]').click();
            cy.get('[data-cy="wod-name-input"]').type('WOD Integración');
            cy.get('[data-cy="wod-type-select"]').select('For Time');
            cy.get('[data-cy="wod-description-textarea"]').type('5 rounds: 10 burpees, 15 air squats');
            cy.get('[data-cy="save-wod-button"]').click();

            cy.wait('@createWod');
            cy.get('[data-cy="success-message"]').should('contain', 'WOD creado exitosamente');

            // 3. Verificar que el WOD aparece en la lista
            cy.get('[data-cy="wod-item"]').should('contain', 'WOD Integración');

            // 4. Navegar a records para ver si hay resultados de este WOD
            cy.visit('/records');
            cy.get('[data-cy="wod-filter"]').select('WOD Integración');

            // 5. Ver dashboard de entrenador con estadísticas actualizadas
            cy.visit('/trainer');
            cy.get('[data-cy="total-wods-count"]').should('contain', '5'); // Incluye el nuevo WOD
            cy.get('[data-cy="recent-activities"]').should('contain', 'WOD Integración');
        });

        it('debe gestionar el ciclo completo de un miembro: crear → asignar WODs → seguir progreso', () => {
            cy.loginAsTrainer();

            // 1. Crear un nuevo miembro
            cy.intercept('POST', '**/api/members', {
                statusCode: 201,
                body: {
                    status: 'OK',
                    data: {
                        id: 5,
                        name: 'María García',
                        email: 'maria@correo.com',
                        role: 'atleta',
                        join_date: '2025-08-22',
                        created_at: '2025-08-22T10:00:00Z'
                    }
                }
            }).as('createMember');

            cy.visit('/members');
            cy.get('[data-cy="create-member-button"]').click();
            cy.get('[data-cy="member-name-input"]').type('María García');
            cy.get('[data-cy="member-email-input"]').type('maria@correo.com');
            cy.get('[data-cy="member-role-select"]').select('atleta');
            cy.get('[data-cy="save-member-button"]').click();

            cy.wait('@createMember');

            // 2. Crear un record para este miembro
            cy.intercept('POST', '**/api/records', {
                statusCode: 201,
                body: {
                    status: 'OK',
                    data: {
                        id: 10,
                        user_id: 5,
                        wod_id: 1,
                        result: '7:30',
                        notes: 'Primer intento de María',
                        date: '2025-08-22',
                        created_at: '2025-08-22T11:00:00Z'
                    }
                }
            }).as('createRecord');

            cy.visit('/records');
            cy.get('[data-cy="create-record-button"]').click();
            cy.get('[data-cy="record-user-select"]').select('María García');
            cy.get('[data-cy="record-wod-select"]').select('Fran');
            cy.get('[data-cy="record-result-input"]').type('7:30');
            cy.get('[data-cy="record-notes-textarea"]').type('Primer intento de María');
            cy.get('[data-cy="save-record-button"]').click();

            cy.wait('@createRecord');

            // 3. Verificar que se puede filtrar por este miembro
            cy.get('[data-cy="user-filter"]').select('María García');
            cy.get('[data-cy="record-item"]').should('contain', 'María García');
            cy.get('[data-cy="record-item"]').should('contain', '7:30');

            // 4. Ver progreso en dashboard
            cy.visit('/trainer');
            cy.get('[data-cy="total-members-count"]').should('contain', '3'); // Incluye el nuevo miembro
        });
    });

    describe('Flujo Completo del Atleta', () => {
        it('debe permitir el flujo completo: login → ver WODs → registrar resultado → ver progreso', () => {
            // 1. Login como atleta
            cy.loginAsAthlete();
            cy.url().should('include', '/athlete');

            // 2. Ver dashboard inicial
            cy.get('[data-cy="athlete-dashboard"]').should('be.visible');
            cy.get('[data-cy="my-recent-records"]').should('be.visible');

            // 3. Explorar WODs disponibles
            cy.visit('/wods');
            cy.get('[data-cy="wods-list"]').should('be.visible');
            cy.get('[data-cy="wod-item"]').should('have.length.at.least', 1);

            // Verificar que NO puede editar WODs
            cy.get('[data-cy="create-wod-button"]').should('not.exist');
            cy.get('[data-cy="edit-wod-button"]').should('not.exist');

            // 4. Registrar un nuevo resultado
            cy.intercept('POST', '**/api/records', {
                statusCode: 201,
                body: {
                    status: 'OK',
                    data: {
                        id: 15,
                        user_id: 2, // ID del atleta
                        wod_id: 2,
                        result: '12:45',
                        notes: 'Gran sesión hoy!',
                        date: '2025-08-22',
                        created_at: '2025-08-22T16:00:00Z'
                    }
                }
            }).as('createAthleteRecord');

            cy.visit('/records');
            cy.get('[data-cy="create-record-button"]').click();
            cy.get('[data-cy="record-wod-select"]').select('Grace');
            cy.get('[data-cy="record-result-input"]').type('12:45');
            cy.get('[data-cy="record-notes-textarea"]').type('Gran sesión hoy!');
            cy.get('[data-cy="save-record-button"]').click();

            cy.wait('@createAthleteRecord');

            // 5. Verificar que aparece en su lista de records
            cy.get('[data-cy="record-item"]').should('contain', 'Grace');
            cy.get('[data-cy="record-item"]').should('contain', '12:45');

            // 6. Ver progreso actualizado en dashboard
            cy.visit('/athlete');
            cy.get('[data-cy="total-workouts-completed"]').should('be.visible');
            cy.get('[data-cy="personal-records"]').should('be.visible');
            cy.get('[data-cy="recent-activities"]').should('contain', 'Grace');
        });

        it('debe mostrar progreso y estadísticas personales', () => {
            cy.loginAsAthlete();

            cy.visit('/athlete');

            // Verificar métricas personales
            cy.get('[data-cy="total-workouts-completed"]').should('be.visible');
            cy.get('[data-cy="this-month-workouts"]').should('be.visible');
            cy.get('[data-cy="personal-records-count"]').should('be.visible');

            // Verificar gráficos de progreso (si están implementados)
            cy.get('[data-cy="progress-chart"]').should('be.visible');
            cy.get('[data-cy="recent-records-chart"]').should('be.visible');

            // Verificar actividad reciente
            cy.get('[data-cy="recent-activities"]').should('be.visible');
            cy.get('[data-cy="activity-item"]').should('have.length.at.least', 1);
        });

        it('debe permitir editar sus propios records', () => {
            cy.loginAsAthlete();

            cy.intercept('PUT', '**/api/records/1', {
                statusCode: 200,
                body: {
                    status: 'OK',
                    data: {
                        id: 1,
                        user_id: 2,
                        wod_id: 1,
                        result: '3:20',
                        notes: 'Nuevo PR! Mejoré 25 segundos',
                        date: '2025-08-22',
                        created_at: '2025-08-22T12:00:00Z'
                    }
                }
            }).as('updateRecord');

            cy.visit('/records');

            cy.get('[data-cy="record-item"]').first().within(() => {
                cy.get('[data-cy="edit-record-button"]').click();
            });

            cy.get('[data-cy="record-form"]').should('be.visible');
            cy.get('[data-cy="record-result-input"]').clear().type('3:20');
            cy.get('[data-cy="record-notes-textarea"]').clear().type('Nuevo PR! Mejoré 25 segundos');
            cy.get('[data-cy="save-record-button"]').click();

            cy.wait('@updateRecord');
            cy.get('[data-cy="success-message"]').should('contain', 'Record actualizado exitosamente');
        });
    });

    describe('Flujos de Colaboración entre Roles', () => {
        it('debe sincronizar datos entre entrenador y atleta en tiempo real', () => {
            // 1. Entrenador crea un WOD
            cy.loginAsTrainer();

            cy.intercept('POST', '**/api/workouts', {
                statusCode: 201,
                body: {
                    status: 'OK',
                    data: {
                        id: 20,
                        name: 'WOD Colaborativo',
                        type: 'AMRAP',
                        description: '15 min AMRAP: 5 pull-ups, 10 push-ups, 15 air squats',
                        created_at: new Date().toISOString()
                    }
                }
            }).as('createCollaborativeWod');

            cy.visit('/wods');
            cy.get('[data-cy="create-wod-button"]').click();
            cy.get('[data-cy="wod-name-input"]').type('WOD Colaborativo');
            cy.get('[data-cy="wod-type-select"]').select('AMRAP');
            cy.get('[data-cy="wod-description-textarea"]').type('15 min AMRAP: 5 pull-ups, 10 push-ups, 15 air squats');
            cy.get('[data-cy="save-wod-button"]').click();

            cy.wait('@createCollaborativeWod');

            // 2. Logout del entrenador
            cy.get('[data-cy="logout-button"]').click();

            // 3. Login como atleta
            cy.loginAsAthlete();

            // 4. Verificar que el nuevo WOD está disponible
            cy.visit('/wods');
            cy.get('[data-cy="wod-item"]').should('contain', 'WOD Colaborativo');

            // 5. Atleta registra resultado del nuevo WOD
            cy.intercept('POST', '**/api/records', {
                statusCode: 201,
                body: {
                    status: 'OK',
                    data: {
                        id: 25,
                        user_id: 2,
                        wod_id: 20,
                        result: '8 rounds + 7',
                        notes: 'Excelente WOD!',
                        date: '2025-08-22',
                        created_at: new Date().toISOString()
                    }
                }
            }).as('createCollaborativeRecord');

            cy.visit('/records');
            cy.get('[data-cy="create-record-button"]').click();
            cy.get('[data-cy="record-wod-select"]').select('WOD Colaborativo');
            cy.get('[data-cy="record-result-input"]').type('8 rounds + 7');
            cy.get('[data-cy="record-notes-textarea"]').type('Excelente WOD!');
            cy.get('[data-cy="save-record-button"]').click();

            cy.wait('@createCollaborativeRecord');

            // 6. Logout del atleta
            cy.get('[data-cy="logout-button"]').click();

            // 7. Login nuevamente como entrenador
            cy.loginAsTrainer();

            // 8. Verificar que puede ver el resultado del atleta
            cy.visit('/records');
            cy.get('[data-cy="user-filter"]').select('Ana Rodríguez');
            cy.get('[data-cy="record-item"]').should('contain', 'WOD Colaborativo');
            cy.get('[data-cy="record-item"]').should('contain', '8 rounds + 7');
        });
    });

    describe('Flujos de Error y Recuperación', () => {
        it('debe manejar errores de autenticación durante operaciones', () => {
            cy.loginAsTrainer();

            // Simular token expirado durante una operación
            cy.intercept('POST', '**/api/workouts', {
                statusCode: 401,
                body: { status: 'ERROR', message: 'Token expirado' }
            }).as('unauthorizedRequest');

            cy.visit('/wods');
            cy.get('[data-cy="create-wod-button"]').click();
            cy.get('[data-cy="wod-name-input"]').type('Test WOD');
            cy.get('[data-cy="wod-type-select"]').select('For Time');
            cy.get('[data-cy="wod-description-textarea"]').type('Test');
            cy.get('[data-cy="save-wod-button"]').click();

            cy.wait('@unauthorizedRequest');

            // Debe redirigir a login
            cy.url().should('include', '/login');
            cy.get('[data-cy="session-expired-message"]').should('be.visible');
        });

        it('debe recuperarse de errores de red y permitir reintentos', () => {
            cy.loginAsTrainer();

            // Simular error de red
            cy.intercept('GET', '**/api/workouts', { forceNetworkError: true }).as('networkError');

            cy.visit('/wods');
            cy.wait('@networkError');

            cy.get('[data-cy="network-error-message"]').should('be.visible');
            cy.get('[data-cy="retry-button"]').should('be.visible');

            // Configurar respuesta exitosa para el retry
            cy.intercept('GET', '**/api/workouts', {
                statusCode: 200,
                body: {
                    status: 'OK',
                    data: [
                        { id: 1, name: 'Fran', type: 'For Time', description: '21-15-9 Thrusters, Pull-ups' }
                    ]
                }
            }).as('retrySuccess');

            cy.get('[data-cy="retry-button"]').click();
            cy.wait('@retrySuccess');

            cy.get('[data-cy="wods-list"]').should('be.visible');
            cy.get('[data-cy="network-error-message"]').should('not.exist');
        });
    });

    describe('Navegación y Estado de la Aplicación', () => {
        it('debe mantener el estado durante navegación entre páginas', () => {
            cy.loginAsTrainer();

            // Crear un filtro en la página de records
            cy.visit('/records');
            cy.get('[data-cy="user-filter"]').select('Ana Rodríguez');
            cy.get('[data-cy="date-filter"]').type('2025-08-22');

            // Navegar a otra página
            cy.visit('/wods');
            cy.get('[data-cy="wods-list"]').should('be.visible');

            // Regresar a records y verificar que se mantienen los filtros
            cy.visit('/records');
            cy.get('[data-cy="user-filter"]').should('have.value', 'Ana Rodríguez');
            cy.get('[data-cy="date-filter"]').should('have.value', '2025-08-22');
        });

        it('debe actualizar el breadcrumb correctamente', () => {
            cy.loginAsTrainer();

            cy.visit('/trainer');
            cy.get('[data-cy="breadcrumb"]').should('contain', 'Dashboard');

            cy.visit('/wods');
            cy.get('[data-cy="breadcrumb"]').should('contain', 'WODs');

            cy.visit('/records');
            cy.get('[data-cy="breadcrumb"]').should('contain', 'Records');

            cy.visit('/members');
            cy.get('[data-cy="breadcrumb"]').should('contain', 'Miembros');
        });

        it('debe mostrar indicadores de carga durante peticiones', () => {
            cy.loginAsTrainer();

            // Simular respuesta lenta
            cy.intercept('GET', '**/api/workouts', {
                statusCode: 200,
                body: { status: 'OK', data: [] },
                delay: 2000
            }).as('slowResponse');

            cy.visit('/wods');

            cy.get('[data-cy="loading-indicator"]').should('be.visible');
            cy.wait('@slowResponse');
            cy.get('[data-cy="loading-indicator"]').should('not.exist');
        });
    });
});
