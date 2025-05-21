"use strict";
// import swaggerJSDoc from 'swagger-jsdoc'
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSwagger = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Dokumentasi API',
            version: '1.0.0',
            description: 'Dokumentasi API Market Clothes',
        },
        servers: [
            {
                url: 'http://localhost:3000', // sesuaikan URL
            },
        ],
        components: {
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
    apis: ['./src/router/**/*.ts', './router/**/*.js'], // file route API untuk scan swagger-jsdoc
};
const swaggerSpec = (0, swagger_jsdoc_1.default)(options);
const setupSwagger = (app) => {
    // Sajikan file swagger.json yang di-generate
    app.get('/api-docs/swagger.json', (_, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerSpec);
    });
    // Redirect /api-docs ke halaman swagger-ui statis
    app.get('/api-docs', (_, res) => {
        res.redirect('/swagger-ui/');
    });
};
exports.setupSwagger = setupSwagger;
