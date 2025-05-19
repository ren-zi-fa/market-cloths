import { Router } from 'express'

import { param, query, body } from 'express-validator'
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
   .route('/categories/bulk-delete')
   .delete(
      [
         body('ids')
            .isArray({ min: 1 })
            .withMessage('ids harus berupa array yang tidak kosong'),
         body('ids.*')
            .isString()
            .notEmpty()
            .withMessage('Setiap id harus berupa string yang tidak kosong')
      ],
      productController.handleBulkDeleteCategory
   )
   
router
   .route('/categories/:id')
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
