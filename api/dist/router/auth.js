"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const auth_validation_1 = require("../validation/auth.validation");
const controller_1 = require("../controller");
/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Endpoint autentikasi pengguna
 */
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginInput'
 *     responses:
 *       200:
 *         description: Login berhasil
 *       401:
 *         description: Login gagal
 */
const router = (0, express_1.Router)();
router.post('/login', authMiddleware_1.ensureEmailOrUsername, auth_validation_1.loginValidation, controller_1.authController.handleLogin);
/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register user baru
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterInput'
 *     responses:
 *       201:
 *         description: Registrasi berhasil
 *       400:
 *         description: Registrasi gagal
 */
router.post('/register', auth_validation_1.registerValidation, controller_1.authController.handleRegister);
/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logout berhasil
 */
router.post('/logout', controller_1.authController.handleLogout);
/**
 * @swagger
 * /api/auth/refresh-token:
 *   post:
 *     summary: Refresh token JWT
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Token berhasil diperbarui
 */
router.post('/refresh-token', controller_1.authController.handleRefreshToken);
/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     summary: Mendapatkan profil user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Data profil user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
router.get('/profile', controller_1.authController.hadnleProfile);
/**
 * @swagger
 * components:
 *   schemas:
 *     LoginInput:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *         password:
 *           type: string
 *     RegisterInput:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *         username:
 *           type: string
 *         password:
 *           type: string
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         email:
 *           type: string
 *         username:
 *           type: string
 */
exports.default = router;
