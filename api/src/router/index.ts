import express, { Router } from 'express'
import productRouter from './product'
import userRouter from './user'
import authRouter from './auth'

const router = Router()

router.use(productRouter)
router.use(userRouter)
router.use('/auth', authRouter)

export { router }
