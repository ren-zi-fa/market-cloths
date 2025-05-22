import { Router } from 'express'

import { param, body } from 'express-validator'
import { categoryValidation } from '../validation/product.validation'
import { categoryController } from '../controller'
const router = Router()

/**
 * @swagger
 * tags:
 *   name: Category
 *   description: Endpoint untuk kategori produk
 */

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Mendapatkan semua kategori
 *     tags: [Category]
 *     responses:
 *       200:
 *         description: Daftar kategori
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 *   post:
 *     summary: Membuat kategori baru
 *     tags: [Category]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategoryInput'
 *     responses:
 *       201:
 *         description: Kategori berhasil dibuat
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 */
router
   .route('/categories')
   .get(categoryController.handleGetCategories)
   .post(categoryValidation, categoryController.handleCreateCategory)

/**
 * @swagger
 * /api/categories/bulk-delete:
 *   delete:
 *     summary: Menghapus banyak kategori sekaligus
 *     tags: [Category]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               categoryIds:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Kategori berhasil dihapus
 */
router
   .route('/categories/bulk-delete')
   .delete(
      [
         body('categoriesId')
            .isArray({ min: 1 })
            .withMessage('categoriesId harus berupa array yang tidak kosong'),
         body('categoriesId.*')
            .isString()
            .notEmpty()
            .withMessage(
               'Setiap categoryId harus berupa string yang tidak kosong'
            )
      ],
      categoryController.handleBulkDeleteCategory
   )

/**
 * @swagger
 * /api/categories/{categoryId}:
 *   get:
 *     summary: Mendapatkan detail kategori berdasarkan categoryId
 *     tags: [Category]
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         schema:
 *           type: string
 *         required: true
 *         description: categoryId kategori
 *     responses:
 *       200:
 *         description: Detail kategori
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *   put:
 *     summary: Memperbarui kategori berdasarkan categoryId
 *     tags: [Category]
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         schema:
 *           type: string
 *         required: true
 *         description: categoryId kategori
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategoryInput'
 *     responses:
 *       200:
 *         description: Kategori berhasil diperbarui
 *   delete:
 *     summary: Menghapus kategori berdasarkan categoryId
 *     tags: [Category]
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         schema:
 *           type: string
 *         required: true
 *         description: categoryId kategori
 *     responses:
 *       200:
 *         description: Kategori berhasil dihapus
 */
router
   .route('/categories/:categoryId')
   .get(
      [
         param('categoryId')
            .isString()
            .trim()
            .notEmpty()
            .withMessage('categoryId tidak boleh kosong dan harus berupa string')
      ],
      categoryController.handleGetCategoryId
   )
   .put(
      [
         param('categoryId')
            .isString()
            .trim()
            .notEmpty()
            .withMessage('categoryId tidak boleh kosong dan harus berupa string'),

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
         param('categoryId')
            .isString()
            .withMessage('categoryId harus berupa string')
            .notEmpty()
            .withMessage('categoryId tidak boleh kosong')
      ],
      categoryController.handleDeleteCategory
   )

/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       properties:
 *         categoryId:
 *           type: string
 *         name:
 *           type: string
 *         description:
 *           type: string
 *     CategoryInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         description:
 *           type: string
 */

export default router
