"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_1 = require("./swagger");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const swaggerSpec = (0, swagger_jsdoc_1.default)(swagger_1.swaggerOptions);
fs_1.default.writeFileSync(path_1.default.join(__dirname, 'swagger.json'), JSON.stringify(swaggerSpec, null, 2));
console.log('Swagger JSON generated!');
