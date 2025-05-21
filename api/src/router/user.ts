import { Router } from 'express'
import { userController } from '../controller'


const router = Router()

router.get('/users',userController.handleGetAllUser)

export default router
