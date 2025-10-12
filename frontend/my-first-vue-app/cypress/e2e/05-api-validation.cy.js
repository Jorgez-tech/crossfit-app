describe('Validaciones API y manejo de errores', () => {
    const apiUrl = `${Cypress.env('apiUrl')}/api/v1`;

    it('rechaza registro con payload vacío', () => {
        cy.request({
            method: 'POST',
            url: `${apiUrl}/auth/register`,
            failOnStatusCode: false,
            body: {}
        }).then((response) => {
            expect(response.status).to.eq(400);
            expect(response.body).to.have.property('status', 'ERROR');
            expect(response.body.message).to.eq('Datos inválidos');
            expect(response.body.details).to.be.an('array');
        });
    });

    it('rechaza login sin contraseña', () => {
        cy.request({
            method: 'POST',
            url: `${apiUrl}/auth/login`,
            failOnStatusCode: false,
            body: {
                email: 'carlos@box.com'
            }
        }).then((response) => {
            expect(response.status).to.eq(400);
            expect(response.body).to.include({ status: 'ERROR', message: 'Datos inválidos' });
        });
    });

    it('valida identificadores numéricos en rutas', () => {
        cy.request({
            method: 'GET',
            url: `${apiUrl}/workouts/not-a-number`,
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(400);
            expect(response.body.status).to.eq('ERROR');
        });
    });

    it('retorna 404 para rutas inexistentes con formato estándar', () => {
        cy.request({
            method: 'GET',
            url: `${apiUrl}/no-existe`,
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(404);
            expect(response.body.status).to.eq('ERROR');
            expect(response.body.message).to.contain('Ruta no encontrada');
        });
    });

    it('valida creación de records con campos requeridos', () => {
        cy.request({
            method: 'POST',
            url: `${apiUrl}/records`,
            failOnStatusCode: false,
            body: {
                user_id: 1,
                wod_id: 1
            }
        }).then((response) => {
            expect(response.status).to.eq(400);
            expect(response.body.status).to.eq('ERROR');
            expect(response.body.details).to.include("\"result\" is required");
        });
    });
});
