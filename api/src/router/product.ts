import { Router } from 'express'

import { query } from 'express-validator'
import { productSchema } from '../validation/product.validation'
import { productController } from '../controller'
const router = Router()

router
   .route('/products')
   .post(productSchema, productController.handleCreateProduct)
   .get(
      [query('new').optional().isBoolean().toBoolean()],
      productController.handleGetProduct
   )

export default router
