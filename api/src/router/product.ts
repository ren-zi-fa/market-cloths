import { Router } from 'express'
import { getNewProduct, saveProduct } from '../controller/product.controller'
import { query } from 'express-validator'
import { productSchema } from '../validation/product.validation'
const router = Router()

router
   .route('/products')
   .post(productSchema, saveProduct)
   .get(query('new').optional().isBoolean().toBoolean(), getNewProduct)

export default router
