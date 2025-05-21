"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.options = void 0;
const path_1 = __importDefault(require("path"));
const vars_1 = __importDefault(require("../config/vars"));
exports.options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Market Cloths API',
            version: '1.0.0',
            description: 'API documentation for Market Cloths'
        },
        servers: [
            {
                url: vars_1.default.BASE_URL,
                description: 'Market cloths  Documentation'
            }
        ]
    },
    apis: [path_1.default.join(__dirname, '../router/*.js')]
};
