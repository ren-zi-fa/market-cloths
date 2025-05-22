"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const product_1 = __importDefault(require("./product"));
const user_1 = __importDefault(require("./user"));
const auth_1 = __importDefault(require("./auth"));
const category_1 = __importDefault(require("./category"));
const router = (0, express_1.Router)();
exports.router = router;
router.use(product_1.default);
router.use(category_1.default);
router.use(user_1.default);
router.use('/auth', auth_1.default);
