import { Router } from 'express'
import productRouter from './product'
import userRouter from './user'
import authRouter from './auth'
import categoryRouter from './category'

const router = Router()

router.use(productRouter)
router.use(categoryRouter)
router.use(userRouter)
router.use('/auth', authRouter)

export { router }
