import { Router } from 'express'

import { query } from 'express-validator'
import {
   categoryValidation,
   productValidation
} from '../validation/product.validation'
import { productController } from '../controller'
const router = Router()

router
   .route('/products')
   .post(productValidation, productController.handleCreateProduct)
   .get(
      [query('new').optional().isBoolean().toBoolean()],
      productController.handleGetProduct
   )

router
   .route('/categories')
   .post(categoryValidation, productController.handleCreateCategory)

export default router
