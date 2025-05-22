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
 *         headers:
 *           access_token:
 *             description: JWT akses token, kirim di header Authorization pada request berikutnya
 *             schema:
 *               type: string
 *           refresh_token:
 *             description: JWT refresh token, gunakan untuk refresh token
 *             schema:
 *               type: string
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
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: 'Refresh token dalam format Bearer. Contoh: "Bearer [refresh_token]"'
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
router.post('/logout', authController.handleLogout)

/**
 * @swagger
 * /api/auth/refresh-token:
 *   post:
 *     summary: Refresh token JWT
 *     tags: [Auth]
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: 'Refresh token dalam format Bearer. Contoh: "Bearer [refresh_token]"'
 *     responses:
 *       200:
 *         description: Token berhasil diperbarui
 *         headers:
 *           access_token:
 *             description: JWT akses token baru, kirim di header Authorization pada request berikutnya
 *             schema:
 *               type: string
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
router.post('/refresh-token', authController.handleRefreshToken)
/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     summary: Mendapatkan profil user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         description: "Token JWT akses dalam format Bearer. Contoh: \"Bearer [access_token]\""
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Data profil user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized (token tidak valid atau tidak dikirim)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized
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
 *         description: Gagal mengambil profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Gagal mengambil profile
 *                 error:
 *                   type: string
 */

router.get('/profile', authController.handleProfile)

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
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

export default router
