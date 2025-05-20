import { Router } from 'express'

import { param, body } from 'express-validator'
import { categoryValidation } from '../validation/product.validation'
import { categoryController } from '../controller'
const router = Router()
/**
 *
 *
 */
router
   .route('/categories')
   .get(categoryController.handleGetCategories)
   .post(categoryValidation, categoryController.handleCreateCategory)

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
      categoryController.handleBulkDeleteCategory
   )

router
   .route('/categories/:id')
   .get(
      [
         param('id')
            .isString()
            .trim()
            .notEmpty()
            .withMessage('ID tidak boleh kosong dan harus berupa string')
      ],
      categoryController.handleGetCategoryId
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
            .trim()
      ],
      categoryController.handleUpdateCategory
   )
   .delete(
      [
         param('id')
            .isString()
            .withMessage('ID harus berupa string')
            .notEmpty()
            .withMessage('ID tidak boleh kosong')
      ],
      categoryController.handleDeleteCategory
   )

export default router
