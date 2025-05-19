import { Router } from 'express'

import {  param, query } from 'express-validator'
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
   .get(productController.handleGetCategories)
   .post(categoryValidation, productController.handleCreateCategory)

router
   .route('/category/:id')
   .delete(
      [
         param('id')
            .isString()
            .withMessage('ID harus berupa string')
            .notEmpty()
            .withMessage('ID tidak boleh kosong')
      ],
      productController.handleDeleteCategory
   )

export default router
