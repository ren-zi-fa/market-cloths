import express, { Router } from 'express'
import productRouter from "./product"
import userRouter from "./user"

const router = Router()

router.use(productRouter)
router.use(userRouter) 
export { router }
