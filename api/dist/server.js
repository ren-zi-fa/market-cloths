"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("./config/express");
const vars_1 = __importDefault(require("./config/vars"));
express_1.app.listen(vars_1.default.port, () => {
    console.log(`APP is running on http://localhost:${vars_1.default.port}  `);
    console.log(`Swagger docs at http://localhost:${vars_1.default.port}/api-docs`);
});
exports.default = express_1.app;
