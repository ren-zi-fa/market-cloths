import { Router } from 'express'
import { getNewProduct } from '../controller/product.controller'
import { query } from 'express-validator'
const router = Router()

router
   .route('/products')
   .post((req, res) => {
      res.json({ mesage: 'post' })
   })
   .get(query('new').optional().isBoolean().toBoolean(), getNewProduct)

export default router
