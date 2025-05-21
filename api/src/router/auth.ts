import { Router } from 'express'
import { ensureEmailOrUsername } from '../middlewares/authMiddleware'
import {
   loginValidation,
   registerValidation
} from '../validation/auth.validation'
import { authController } from '../controller'

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
const router = Router()
router.post(
   '/login',
   ensureEmailOrUsername,
   loginValidation,
   authController.handleLogin
)

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
router.post('/register', registerValidation, authController.handleRegister)

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
router.post('/logout', authController.handleLogout)

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
router.post('/refresh-token', authController.handleRefreshToken)

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
router.get('/profile', authController.hadnleProfile)

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

export default router
