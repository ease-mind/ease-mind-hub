import swaggerJsdoc from 'swagger-jsdoc';
import { Application } from 'express';
import swaggerUi from 'swagger-ui-express';

const PORT = process.env.PORT || '8080';

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Easemind API',
            version: '1.0.0',
            description: 'Documentação da API criada para o projeto easemind, gerada com Swagger.',
        },
        servers: [
            {
                url: `http://localhost:${PORT}/api`,
                description: 'Servidor de Desenvolvimento',
            },
        ],
        components: {
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string', example: '60d0fe4f5311236168a109ca' },
                        name: { type: 'string', example: 'João da Silva' },
                        email: { type: 'string', example: 'joao.silva@example.com' },
                        document: { type: 'string', example: '194.419.430-45' },
                        image: { type: 'string', example: 'https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740' },
                        address: { type: 'string', example: 'Rua Fernando Melão Martini, 25' },
                        city: { type: 'string', example: 'São Paulo' },
                        state: { type: 'string', example: 'SP' },
                        code: { type: 'string', example: '04438-290' },
                        complement: { type: 'string', example: 'apto 2' },
                    },
                },
                UserInput: {
                    type: 'object',
                    properties: {
                        name: { type: 'string', example: 'Maria da Silva' },
                        email: { type: 'string', example: 'maria.silva@example.com' },
                        password: { type: 'string', example: 'senhaForte123!' },
                        document: { type: 'string', example: '194.419.430-45' },
                        image: { type: 'string', example: 'https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740' },
                        address: { type: 'string', example: 'Rua Fernando Melão Martini, 25' },
                        city: { type: 'string', example: 'São Paulo' },
                        state: { type: 'string', example: 'SP' },
                        code: { type: 'string', example: '04438-290' },
                        complement: { type: 'string', example: 'apto 2' },
                    },
                    required: ['name', 'email', 'password'],
                },
                Card: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string', example: '60f7eabc1234567890abcdef' },
                        userId: { type: 'string', example: '60d0fe4f5311236168a109ca' },
                        cardNumber: { type: 'string', example: '**** **** **** 1234' },
                        name: { type: 'string', example: 'João da Silva' },
                        functions: { type: 'array', example: ['credit'] },
                        variant: { type: 'string', example: ['black'] },
                        expirationDate: { type: 'Date', example: '2028-07-01T04:03:58.696Z' },
                        cvv: { type: 'number', example: 157 },
                        flag: { type: 'string', example: 'Elo' },
                        blocked: { type: 'boolean', example: false }
                    },
                },
                CardInput: {
                    type: 'object',
                    properties: {
                        userId: { type: 'string', example: '60d0fe4f5311236168a109ca' },
                        name: { type: 'string', example: 'João da Silva' },
                        functions: { type: 'array', example: ['credito'] },
                        variant: { type: 'string', example: ['black'] },
                    },
                    required: ['userId', 'cardNumber', 'name', 'functions', 'variant']
                },
                CategoryInput: {
                    type: 'object',
                    properties: {
                      name: { type: 'string', example: 'Alimentação' },
                      type: { type: 'string', example: 'expense' }
                    },
                    required: ['name', 'type']
                  },
                Transaction: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string', example: '6859d060974ebbce5320e9a6' },
                        userId: { type: 'string', example: '68508e5d4d5d533f1205562f' },
                        date: { type: 'Date', example: '2025-06-23T00:00:00.000Z' },
                        type: { type: 'string', example: 'income' },
                        value: { type: 'number', example: 20 },
                    },
                },
                TransactionInput: {
                    type: 'object',
                    properties: {
                        userId: { type: 'string', example: '6859d060974ebbce5320e9a6' },
                        date: { type: 'Date', example: '2025-06-23T00:00:00.000Z' },
                        type: { type: 'string', example: 'income' },
                        value: { type: 'number', example: 20 },
                    },
                    required: ['userId', 'cardNumber', 'name', 'functions', 'variant']
                },
            },
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ['./src/docs/**/*.yaml'],
};

const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app: Application) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    console.log(`📄 Swagger docs available at http://localhost:${PORT}/api-docs`);
};