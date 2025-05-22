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
 *         headers:
 *           Set-Cookie:
 *             description: Cookie untuk access_token dan refresh_token
 *             schema:
 *               type: string
 *             example: access_token=xxx; Path=/; HttpOnly; Secure; SameSite=None
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Login berhasil
 *       400:
 *         description: Username/email tidak ditemukan atau password salah
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Username atau email tidak ditemukan
 *       500:
 *         description: Terjadi kesalahan pada server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Terjadi kesalahan pada server
 *                 error:
 *                   type: string
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Logout berhasil
 *       400:
 *         description: Refresh token tidak ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Refresh token tidak ditemukan
 *       500:
 *         description: Gagal logout
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Gagal logout
 *                 error:
 *                   type: string
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
 *         headers:
 *           Set-Cookie:
 *             description: Cookie untuk access_token
 *             schema:
 *               type: string
 *             example: access_token=xxx; Path=/; HttpOnly; Secure; SameSite=None
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Token diperbarui
 *       400:
 *         description: Refresh token tidak ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Refresh token tidak ditemukan
 *       401:
 *         description: Refresh token tidak valid atau sudah kadaluarsa
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Refresh token tidak valid atau sudah kadaluarsa
 *       404:
 *         description: User tidak ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User tidak ditemukan
 *       500:
 *         description: Gagal refresh token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Gagal refresh token
 *                 error:
 *                   type: string
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
router.get('/profile', controller_1.authController.handleProfile);
/**
 * @swagger
 * components:
 *   schemas:
 *     LoginInput:
 *       type: object
 *       properties:
 *         login_name:
 *           type: string
 *         password:
 *           type: string
 *     RegisterInput:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password
 *         - konfirmasi_password
 *         - makanan_favorite
 *       properties:
 *         username:
 *           type: string
 *           example: johndoe
 *         email:
 *           type: string
 *           format: email
 *           example: johndoe@email.com
 *         password:
 *           type: string
 *           example: password123
 *         konfirmasi_password:
 *           type: string
 *           example: password123
 *         makanan_favorite:
 *           type: string
 *           example: Nasi Goreng
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
