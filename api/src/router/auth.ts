import { Router } from 'express'
import { ensureEmailOrUsername } from '../middlewares/authMiddleware'
import {
   loginValidation,
   registerValidation
} from '../validation/auth.validation'
import { authController } from '../controller'

const router = Router()
router.post(
   '/login',
   ensureEmailOrUsername,
   loginValidation,
   authController.handleLogin
)

// Register route
router.post('/register', registerValidation, authController.handleRegister)
router.post('/logout', authController.handleLogout)
router.post('/refresh-token', authController.handleRefreshToken)
router.get('/profile', authController.hadnleProfile)

export default router
