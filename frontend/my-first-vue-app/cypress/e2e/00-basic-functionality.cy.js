describe('Pruebas Básicas de Funcionamiento', () => {
    beforeEach(() => {
        cy.clearLocalStorage();
        cy.clearCookies();
    });

    it('debe cargar la página principal correctamente', () => {
        cy.visit('/');
        cy.contains('Alto Rendimiento 360').should('be.visible');
    });

    it('debe navegar a la página de login', () => {
        cy.visit('/login');
        cy.url().should('include', '/login');

        // Verificar que existan elementos del formulario aunque no tengan data-cy
        cy.get('input[type="email"]').should('be.visible');
        cy.get('input[type="password"]').should('be.visible');
        cy.get('button[type="submit"]').should('be.visible');
    });

    it('debe mostrar el formulario de login con elementos básicos', () => {
        cy.visit('/login');

        // Buscar por atributos HTML estándar si data-cy no funciona
        cy.get('#email').should('be.visible');
        cy.get('#password').should('be.visible');
        cy.get('button[type="submit"]').should('be.visible');
    });

    it('debe intentar login con credenciales y mostrar respuesta', () => {
        // Mock básico de login
        cy.intercept('POST', '**/api/auth/login', {
            statusCode: 200,
            body: {
                status: 'OK',
                data: {
                    token: 'test-token',
                    user: {
                        id: 1,
                        email: 'carlos@box.com',
                        name: 'Carlos Entrenador',
                        role: 'entrenador'
                    }
                }
            }
        }).as('loginRequest');

        cy.visit('/login');

        // Llenar formulario con selectores simples
        cy.get('#email').type('carlos@box.com');
        cy.get('#password').type('123456');
        cy.get('button[type="submit"]').click();

        // Verificar que se hizo la petición
        cy.wait('@loginRequest');
    });

    it('debe poder navegar entre páginas públicas', () => {
        cy.visit('/');
        cy.contains('Todo List').click();
        cy.url().should('include', '/todos');

        cy.contains('CrossFit WODs').click();
        cy.url().should('include', '/crossfit');
    });

    it('debe mostrar navegación diferente para usuarios autenticados vs no autenticados', () => {
        // Sin autenticar
        cy.visit('/');
        cy.get('nav').should('contain', 'Login');
        cy.get('nav').should('not.contain', 'Dashboard');

        // Simular autenticación
        cy.window().then((win) => {
            win.localStorage.setItem('token', 'test-token');
            win.localStorage.setItem('user', JSON.stringify({
                id: 1,
                email: 'carlos@box.com',
                name: 'Carlos Entrenador',
                role: 'entrenador'
            }));
        });

        cy.reload();
        cy.get('nav').should('contain', 'Dashboard');
        cy.get('nav').should('contain', 'Salir');
    });
});

describe('Pruebas de Navegación Protegida', () => {
    it('debe redirigir a login si no está autenticado', () => {
        cy.visit('/trainer');
        cy.url().should('include', '/login');
    });

    it('debe permitir acceso con autenticación simulada', () => {
        // Simular autenticación
        cy.window().then((win) => {
            win.localStorage.setItem('token', 'test-token');
            win.localStorage.setItem('user', JSON.stringify({
                id: 1,
                email: 'carlos@box.com',
                name: 'Carlos Entrenador',
                role: 'entrenador'
            }));
        });

        cy.visit('/trainer');
        cy.url().should('include', '/trainer');
    });
});
