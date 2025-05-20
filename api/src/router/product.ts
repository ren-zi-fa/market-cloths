import { Router } from 'express'

import { body, param, query } from 'express-validator'
import { productValidation } from '../validation/product.validation'
import { productController } from '../controller'

const router = Router()

router
   .route('/products')
   .post(productValidation, productController.handleCreateProduct)
   .get(
      [query('new').optional().isBoolean().toBoolean()],
      productController.handleGetProducts
   )
router
   .route('/products/bulk-delete')

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
      productController.handleBulkDeleteProducts
   )
router
   .route('/products/:id')
   .get(
      [
         param('id')
            .isString()
            .trim()
            .notEmpty()
            .withMessage('ID tidak boleh kosong dan harus berupa string')
      ],
      productController.handleGetProductById
   )
   .put(
      [
         param('id')
            .isString()
            .trim()
            .notEmpty()
            .withMessage('ID tidak boleh kosong dan harus berupa string'),

         body('name')
            .optional()
            .isString()
            .withMessage('Name harus berupa string')
            .trim(),

         body('description')
            .optional()
            .isString()
            .withMessage('Description harus berupa string')
            .trim(),
         body('category_name')
            .optional()
            .isString()
            .withMessage('category_name harus berupa string')
            .trim(),

         body('image_url')
            .optional()
            .isArray()
            .withMessage('image url harus berupa array'),

         body('price')
            .optional()
            .isInt()
            .withMessage('price harus berupa number'),

         body('stok').optional().isInt().withMessage('stok harus berupa number')
      ],
      productController.handleUpdateProduct
   )
   .delete(
      [
         param('id')
            .isString()
            .withMessage('ID harus berupa string')
            .notEmpty()
            .withMessage('ID tidak boleh kosong')
      ],
      productController.handleDeleteproduct
   )

export default router
