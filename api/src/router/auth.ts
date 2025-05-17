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
   authController.login
)

// Register route
router.post('/register', registerValidation, authController.register)
router.post('/logout', authController.logout)
router.post('/refresh-token', authController.refreshToken)
router.get('/profile', authController.profile)

export default router
