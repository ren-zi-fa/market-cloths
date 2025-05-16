import { Router } from 'express'
import { ensureEmailOrUsername } from '../middlewares/authMiddleware'
import { loginValidation } from '../validation/auth.validation'

const router = Router()
router.post("/auth/login",ensureEmailOrUsername,loginValidation,)

export default router