"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
// Gantikan __dirname
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../.env') });
// Export config
exports.default = {
    port: process.env.PORT,
    node_env: process.env.NODE_ENV,
    FIREBASE_SERVICE_ACCOUNT: process.env.FIREBASE_SERVICE_ACCOUNT,
    JWT_SECRET: process.env.JWT_SECRET,
    REFRESH_TOKEN_MAX_AGE: Number(process.env.REFRESH_TOKEN_MAX_AGE) || 2592000000,
    ACCESS_TOKEN_MAX_AGE: Number(process.env.ACCESS_TOKEN_MAX_AGE) || 900000,
    LIMIT_PRODUCT: Number(process.env.LIMIT_PRODUCT) || 20,
    BASE_URL: process.env.BASE_URL || 'http://localhost:3100',
    FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000'
};
