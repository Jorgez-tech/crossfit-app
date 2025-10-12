const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.3',
        info: {
            title: 'CrossFit WOD API',
            version: '1.0.0',
            description: 'Documentación de la API para la gestión de un box de CrossFit'
        },
        servers: [
            {
                url: process.env.SWAGGER_BASE_URL || 'http://localhost:3000',
                description: 'Servidor local'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            },
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', example: 1 },
                        name: { type: 'string', example: 'Jane Doe' },
                        email: { type: 'string', example: 'jane@example.com' },
                        role: { type: 'string', example: 'entrenador' }
                    }
                },
                AuthRegisterRequest: {
                    type: 'object',
                    required: ['name', 'email', 'password', 'role'],
                    properties: {
                        name: { type: 'string', example: 'Jane Doe' },
                        email: { type: 'string', example: 'jane@example.com' },
                        password: { type: 'string', example: 'SuperSecret123' },
                        role: { type: 'string', enum: ['atleta', 'entrenador', 'admin'], example: 'atleta' }
                    }
                },
                AuthLoginRequest: {
                    type: 'object',
                    required: ['email', 'password'],
                    properties: {
                        email: { type: 'string', example: 'jane@example.com' },
                        password: { type: 'string', example: 'SuperSecret123' }
                    }
                },
                AuthResponse: {
                    type: 'object',
                    properties: {
                        status: { type: 'string', example: 'OK' },
                        data: {
                            type: 'object',
                            properties: {
                                token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
                                user: { $ref: '#/components/schemas/User' }
                            }
                        }
                    }
                },
                Member: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', example: 1 },
                        name: { type: 'string', example: 'Ana Pérez' },
                        email: { type: 'string', example: 'ana@example.com' },
                        gender: { type: 'string', example: 'female' },
                        dateOfBirth: { type: 'string', format: 'date', example: '1990-05-20' },
                        phone: { type: 'string', example: '+34 600 123 456' },
                        membershipStatus: { type: 'string', example: 'active' }
                    }
                },
                MemberCreateRequest: {
                    type: 'object',
                    required: ['name', 'gender', 'dateOfBirth', 'email', 'password'],
                    properties: {
                        name: { type: 'string', example: 'Ana Pérez' },
                        gender: { type: 'string', enum: ['male', 'female', 'other'], example: 'female' },
                        dateOfBirth: { type: 'string', format: 'date', example: '1990-05-20' },
                        email: { type: 'string', example: 'ana@example.com' },
                        password: { type: 'string', example: 'ContraseñaSegura123' },
                        phone: { type: 'string', example: '+34 600 123 456' },
                        membershipStatus: { type: 'string', enum: ['active', 'inactive', 'pending'], example: 'active' },
                        notes: { type: 'string', example: 'Prefiere entrenar por las mañanas' }
                    }
                },
                MemberUpdateRequest: {
                    type: 'object',
                    properties: {
                        name: { type: 'string' },
                        gender: { type: 'string', enum: ['male', 'female', 'other'] },
                        dateOfBirth: { type: 'string', format: 'date' },
                        email: { type: 'string' },
                        password: { type: 'string' },
                        phone: { type: 'string' },
                        membershipStatus: { type: 'string', enum: ['active', 'inactive', 'pending'] },
                        notes: { type: 'string' }
                    }
                },
                Workout: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', example: 10 },
                        name: { type: 'string', example: 'Murph' },
                        description: { type: 'string', example: '1 mile run, 100 pull-ups, 200 push-ups, 300 squats, 1 mile run' },
                        exercises: { type: 'string', example: '["Run", "Pull-ups", "Push-ups", "Squats"]' },
                        created_at: { type: 'string', format: 'date-time' }
                    }
                },
                Record: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', example: 3 },
                        user_id: { type: 'integer', example: 1 },
                        wod_id: { type: 'integer', example: 2 },
                        result: { type: 'string', example: '35:20 RX' },
                        notes: { type: 'string', example: 'Muy duro, trabajar pull-ups' },
                        date: { type: 'string', format: 'date', example: '2025-09-01' }
                    }
                }
            }
        },
        security: [{ bearerAuth: [] }]
    },
    apis: ['src/docs/swagger/*.yaml']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
