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
 *               ids:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Kategori berhasil dihapus
 */

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     summary: Mendapatkan detail kategori berdasarkan ID
 *     tags: [Category]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID kategori
 *     responses:
 *       200:
 *         description: Detail kategori
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *   put:
 *     summary: Memperbarui kategori berdasarkan ID
 *     tags: [Category]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID kategori
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
 *     summary: Menghapus kategori berdasarkan ID
 *     tags: [Category]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID kategori
 *     responses:
 *       200:
 *         description: Kategori berhasil dihapus
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       properties:
 *         id:
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
