describe('Operaciones CRUD - WODs, Records y Members', () => {
    beforeEach(() => {
        cy.mockBackend();
    });

    describe('CRUD de WODs (Solo Entrenadores)', () => {
        beforeEach(() => {
            cy.loginAsTrainer();
        });

        it('debe listar WODs existentes correctamente', () => {
            cy.visit('/wods');

            cy.get('[data-cy="wods-list"]').should('be.visible');
            cy.get('[data-cy="wod-item"]').should('have.length.at.least', 1);

            // Verificar información de un WOD
            cy.get('[data-cy="wod-item"]').first().within(() => {
                cy.get('[data-cy="wod-name"]').should('be.visible');
                cy.get('[data-cy="wod-type"]').should('be.visible');
                cy.get('[data-cy="wod-description"]').should('be.visible');
            });
        });

        it('debe crear un nuevo WOD exitosamente', () => {
            cy.intercept('POST', '**/api/workouts', {
                statusCode: 201,
                body: {
                    status: 'OK',
                    data: {
                        id: 5,
                        name: 'Nuevo WOD Test',
                        type: 'For Time',
                        description: 'WOD de prueba creado por Cypress',
                        created_at: new Date().toISOString()
                    }
                }
            }).as('createWod');

            cy.visit('/wods');

            cy.get('[data-cy="create-wod-button"]').click();

            cy.get('[data-cy="wod-form"]').should('be.visible');
            cy.get('[data-cy="wod-name-input"]').type('Nuevo WOD Test');
            cy.get('[data-cy="wod-type-select"]').select('For Time');
            cy.get('[data-cy="wod-description-textarea"]').type('WOD de prueba creado por Cypress');

            cy.get('[data-cy="save-wod-button"]').click();

            cy.wait('@createWod');

            // Verificar que aparece en la lista
            cy.get('[data-cy="wod-item"]').should('contain', 'Nuevo WOD Test');
            cy.get('[data-cy="success-message"]').should('contain', 'WOD creado exitosamente');
        });

        it('debe editar un WOD existente', () => {
            cy.intercept('PUT', '**/api/workouts/1', {
                statusCode: 200,
                body: {
                    status: 'OK',
                    data: {
                        id: 1,
                        name: 'Fran Modificado',
                        type: 'For Time',
                        description: 'Descripción actualizada por Cypress',
                        created_at: '2025-08-22T10:00:00Z'
                    }
                }
            }).as('updateWod');

            cy.visit('/wods');

            cy.get('[data-cy="wod-item"]').first().within(() => {
                cy.get('[data-cy="edit-wod-button"]').click();
            });

            cy.get('[data-cy="wod-form"]').should('be.visible');
            cy.get('[data-cy="wod-name-input"]').clear().type('Fran Modificado');
            cy.get('[data-cy="wod-description-textarea"]').clear().type('Descripción actualizada por Cypress');

            cy.get('[data-cy="save-wod-button"]').click();

            cy.wait('@updateWod');

            cy.get('[data-cy="wod-item"]').should('contain', 'Fran Modificado');
            cy.get('[data-cy="success-message"]').should('contain', 'WOD actualizado exitosamente');
        });

        it('debe eliminar un WOD con confirmación', () => {
            cy.intercept('DELETE', '**/api/workouts/1', {
                statusCode: 200,
                body: { status: 'OK', message: 'WOD eliminado exitosamente' }
            }).as('deleteWod');

            cy.visit('/wods');

            const initialCount = cy.get('[data-cy="wod-item"]').should('have.length.at.least', 1);

            cy.get('[data-cy="wod-item"]').first().within(() => {
                cy.get('[data-cy="delete-wod-button"]').click();
            });

            // Debe mostrar modal de confirmación
            cy.get('[data-cy="delete-confirmation-modal"]').should('be.visible');
            cy.get('[data-cy="delete-confirmation-message"]').should('contain', 'Fran');

            cy.get('[data-cy="confirm-delete-button"]').click();

            cy.wait('@deleteWod');

            cy.get('[data-cy="success-message"]').should('contain', 'WOD eliminado exitosamente');
            // Verificar que se removió de la lista
            cy.get('[data-cy="wod-item"]').should('not.contain', 'Fran');
        });

        it('debe validar formulario de WOD con errores', () => {
            cy.visit('/wods');

            cy.get('[data-cy="create-wod-button"]').click();

            // Intentar guardar sin llenar campos requeridos
            cy.get('[data-cy="save-wod-button"]').click();

            cy.get('[data-cy="wod-name-error"]').should('be.visible').and('contain', 'requerido');
            cy.get('[data-cy="wod-type-error"]').should('be.visible').and('contain', 'requerido');
            cy.get('[data-cy="wod-description-error"]').should('be.visible').and('contain', 'requerido');
        });

        it('debe filtrar WODs por tipo', () => {
            cy.visit('/wods');

            // Verificar que hay WODs de diferentes tipos
            cy.get('[data-cy="wod-item"]').should('have.length.at.least', 2);

            // Filtrar por "For Time"
            cy.get('[data-cy="wod-type-filter"]').select('For Time');

            cy.get('[data-cy="wod-item"]').each($item => {
                cy.wrap($item).within(() => {
                    cy.get('[data-cy="wod-type"]').should('contain', 'For Time');
                });
            });

            // Limpiar filtro
            cy.get('[data-cy="clear-filters-button"]').click();
            cy.get('[data-cy="wod-item"]').should('have.length.at.least', 2);
        });
    });

    describe('CRUD de Records', () => {
        describe('Como Entrenador', () => {
            beforeEach(() => {
                cy.loginAsTrainer();
            });

            it('debe ver records de todos los atletas', () => {
                cy.visit('/records');

                cy.get('[data-cy="records-list"]').should('be.visible');
                cy.get('[data-cy="record-item"]').should('have.length.at.least', 1);

                // Debe tener filtro de usuarios
                cy.get('[data-cy="user-filter"]').should('be.visible');

                // Verificar información de records
                cy.get('[data-cy="record-item"]').first().within(() => {
                    cy.get('[data-cy="record-user"]').should('be.visible');
                    cy.get('[data-cy="record-wod"]').should('be.visible');
                    cy.get('[data-cy="record-result"]').should('be.visible');
                    cy.get('[data-cy="record-date"]').should('be.visible');
                });
            });

            it('debe filtrar records por atleta específico', () => {
                cy.visit('/records');

                cy.get('[data-cy="user-filter"]').select('Ana Rodríguez');

                cy.get('[data-cy="record-item"]').each($item => {
                    cy.wrap($item).within(() => {
                        cy.get('[data-cy="record-user"]').should('contain', 'Ana Rodríguez');
                    });
                });
            });

            it('debe crear record para cualquier atleta', () => {
                cy.intercept('POST', '**/api/records', {
                    statusCode: 201,
                    body: {
                        status: 'OK',
                        data: {
                            id: 3,
                            user_id: 2,
                            wod_id: 1,
                            result: '5:30',
                            notes: 'Record creado por entrenador',
                            date: '2025-08-22',
                            created_at: '2025-08-22T14:00:00Z'
                        }
                    }
                }).as('createRecord');

                cy.visit('/records');

                cy.get('[data-cy="create-record-button"]').click();

                cy.get('[data-cy="record-form"]').should('be.visible');
                cy.get('[data-cy="record-user-select"]').select('Ana Rodríguez');
                cy.get('[data-cy="record-wod-select"]').select('Fran');
                cy.get('[data-cy="record-result-input"]').type('5:30');
                cy.get('[data-cy="record-notes-textarea"]').type('Record creado por entrenador');

                cy.get('[data-cy="save-record-button"]').click();

                cy.wait('@createRecord');

                cy.get('[data-cy="success-message"]').should('contain', 'Record creado exitosamente');
            });
        });

        describe('Como Atleta', () => {
            beforeEach(() => {
                cy.loginAsAthlete();
            });

            it('debe ver solo sus propios records', () => {
                cy.visit('/records');

                // NO debe tener filtro de usuarios
                cy.get('[data-cy="user-filter"]').should('not.exist');

                // Todos los records deben ser del atleta actual
                cy.get('[data-cy="record-item"]').each($item => {
                    cy.wrap($item).within(() => {
                        cy.get('[data-cy="record-user"]').should('contain', 'Ana Rodríguez');
                    });
                });
            });

            it('debe crear record solo para sí mismo', () => {
                cy.intercept('POST', '**/api/records', {
                    statusCode: 201,
                    body: {
                        status: 'OK',
                        data: {
                            id: 4,
                            user_id: 2, // ID del atleta actual
                            wod_id: 2,
                            result: '8:45',
                            notes: 'Mi nuevo PR',
                            date: '2025-08-22',
                            created_at: '2025-08-22T15:00:00Z'
                        }
                    }
                }).as('createAthleteRecord');

                cy.visit('/records');

                cy.get('[data-cy="create-record-button"]').click();

                cy.get('[data-cy="record-form"]').should('be.visible');
                // NO debe tener selector de usuario (automáticamente es el atleta actual)
                cy.get('[data-cy="record-user-select"]').should('not.exist');

                cy.get('[data-cy="record-wod-select"]').select('Grace');
                cy.get('[data-cy="record-result-input"]').type('8:45');
                cy.get('[data-cy="record-notes-textarea"]').type('Mi nuevo PR');

                cy.get('[data-cy="save-record-button"]').click();

                cy.wait('@createAthleteRecord');

                cy.get('[data-cy="success-message"]').should('contain', 'Record creado exitosamente');
            });

            it('debe editar sus propios records', () => {
                cy.intercept('PUT', '**/api/records/1', {
                    statusCode: 200,
                    body: {
                        status: 'OK',
                        data: {
                            id: 1,
                            user_id: 2,
                            wod_id: 1,
                            result: '3:30',
                            notes: 'Mejoré mi tiempo!',
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
                cy.get('[data-cy="record-result-input"]').clear().type('3:30');
                cy.get('[data-cy="record-notes-textarea"]').clear().type('Mejoré mi tiempo!');

                cy.get('[data-cy="save-record-button"]').click();

                cy.wait('@updateRecord');

                cy.get('[data-cy="success-message"]').should('contain', 'Record actualizado exitosamente');
            });
        });
    });

    describe('CRUD de Members (Solo Entrenadores)', () => {
        beforeEach(() => {
            cy.loginAsTrainer();
        });

        it('debe listar todos los miembros', () => {
            cy.visit('/members');

            cy.get('[data-cy="members-list"]').should('be.visible');
            cy.get('[data-cy="member-item"]').should('have.length.at.least', 1);

            cy.get('[data-cy="member-item"]').first().within(() => {
                cy.get('[data-cy="member-name"]').should('be.visible');
                cy.get('[data-cy="member-email"]').should('be.visible');
                cy.get('[data-cy="member-role"]').should('be.visible');
                cy.get('[data-cy="member-join-date"]').should('be.visible');
            });
        });

        it('debe crear un nuevo miembro', () => {
            cy.intercept('POST', '**/api/members', {
                statusCode: 201,
                body: {
                    status: 'OK',
                    data: {
                        id: 3,
                        name: 'Juan Pérez',
                        email: 'juan@correo.com',
                        role: 'atleta',
                        join_date: '2025-08-22',
                        created_at: '2025-08-22T16:00:00Z'
                    }
                }
            }).as('createMember');

            cy.visit('/members');

            cy.get('[data-cy="create-member-button"]').click();

            cy.get('[data-cy="member-form"]').should('be.visible');
            cy.get('[data-cy="member-name-input"]').type('Juan Pérez');
            cy.get('[data-cy="member-email-input"]').type('juan@correo.com');
            cy.get('[data-cy="member-role-select"]').select('atleta');

            cy.get('[data-cy="save-member-button"]').click();

            cy.wait('@createMember');

            cy.get('[data-cy="success-message"]').should('contain', 'Miembro creado exitosamente');
            cy.get('[data-cy="member-item"]').should('contain', 'Juan Pérez');
        });

        it('debe editar información de un miembro', () => {
            cy.intercept('PUT', '**/api/members/1', {
                statusCode: 200,
                body: {
                    status: 'OK',
                    data: {
                        id: 1,
                        name: 'Carlos Mendoza Updated',
                        email: 'carlos.updated@box.com',
                        role: 'entrenador',
                        join_date: '2025-01-15',
                        created_at: '2025-01-15T10:00:00Z'
                    }
                }
            }).as('updateMember');

            cy.visit('/members');

            cy.get('[data-cy="member-item"]').first().within(() => {
                cy.get('[data-cy="edit-member-button"]').click();
            });

            cy.get('[data-cy="member-form"]').should('be.visible');
            cy.get('[data-cy="member-name-input"]').clear().type('Carlos Mendoza Updated');
            cy.get('[data-cy="member-email-input"]').clear().type('carlos.updated@box.com');

            cy.get('[data-cy="save-member-button"]').click();

            cy.wait('@updateMember');

            cy.get('[data-cy="success-message"]').should('contain', 'Miembro actualizado exitosamente');
        });

        it('debe filtrar miembros por rol', () => {
            cy.visit('/members');

            cy.get('[data-cy="member-role-filter"]').select('atleta');

            cy.get('[data-cy="member-item"]').each($item => {
                cy.wrap($item).within(() => {
                    cy.get('[data-cy="member-role"]').should('contain', 'Atleta');
                });
            });
        });

        it('debe buscar miembros por nombre o email', () => {
            cy.visit('/members');

            cy.get('[data-cy="search-members"]').type('Ana');

            cy.get('[data-cy="member-item"]').should('have.length', 1);
            cy.get('[data-cy="member-item"]').first().within(() => {
                cy.get('[data-cy="member-name"]').should('contain', 'Ana');
            });
        });

        it('debe validar formulario de miembro', () => {
            cy.visit('/members');

            cy.get('[data-cy="create-member-button"]').click();

            cy.get('[data-cy="save-member-button"]').click();

            cy.get('[data-cy="member-name-error"]').should('contain', 'requerido');
            cy.get('[data-cy="member-email-error"]').should('contain', 'requerido');
            cy.get('[data-cy="member-role-error"]').should('contain', 'requerido');
        });

        it('debe validar email único', () => {
            cy.intercept('POST', '**/api/members', {
                statusCode: 400,
                body: {
                    status: 'ERROR',
                    message: 'El email ya está en uso'
                }
            }).as('createMemberError');

            cy.visit('/members');

            cy.get('[data-cy="create-member-button"]').click();

            cy.get('[data-cy="member-name-input"]').type('Test User');
            cy.get('[data-cy="member-email-input"]').type('carlos@box.com'); // Email existente
            cy.get('[data-cy="member-role-select"]').select('atleta');

            cy.get('[data-cy="save-member-button"]').click();

            cy.wait('@createMemberError');

            cy.get('[data-cy="error-message"]').should('contain', 'El email ya está en uso');
        });
    });

    describe('Manejo de Errores en Operaciones CRUD', () => {
        beforeEach(() => {
            cy.loginAsTrainer();
        });

        it('debe manejar errores de red en creación de WOD', () => {
            cy.intercept('POST', '**/api/workouts', {
                statusCode: 500,
                body: { status: 'ERROR', message: 'Error interno del servidor' }
            }).as('createWodError');

            cy.visit('/wods');

            cy.get('[data-cy="create-wod-button"]').click();
            cy.get('[data-cy="wod-name-input"]').type('Test WOD');
            cy.get('[data-cy="wod-type-select"]').select('For Time');
            cy.get('[data-cy="wod-description-textarea"]').type('Test description');

            cy.get('[data-cy="save-wod-button"]').click();

            cy.wait('@createWodError');

            cy.get('[data-cy="error-message"]').should('contain', 'Error interno del servidor');
        });

        it('debe manejar timeouts en peticiones', () => {
            cy.intercept('GET', '**/api/workouts', { forceNetworkError: true }).as('networkError');

            cy.visit('/wods');

            cy.wait('@networkError');

            cy.get('[data-cy="network-error-message"]').should('be.visible');
            cy.get('[data-cy="retry-button"]').should('be.visible');
        });
    });
});
