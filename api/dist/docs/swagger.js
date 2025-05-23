"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerOptions = void 0;
const path_1 = __importDefault(require("path"));
const vars_1 = __importDefault(require("../config/vars"));
exports.swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Market Cloths API',
            version: '1.0.0',
            description: `API documentation for Market Cloths.

**CORS Policy:**

This REST API is only accessible from the following origins:
- http://localhost:3000
- https://market-clozy.vercel.app/
- https://market-cloths.vercel.app/`
        },
        servers: [
            {
                url: vars_1.default.BASE_URL
            },
            {
                url: 'http://localhost:3100'
            }
        ]
    },
    apis: [path_1.default.join(__dirname, '../router/*.{ts,js}')]
};
