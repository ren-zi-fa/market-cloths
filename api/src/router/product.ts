import { Router } from 'express'

import { body, param, query } from 'express-validator'
import { productValidation } from '../validation/product.validation'
import { productController } from '../controller'

const router = Router()

/**
 * @openapi
 * /products:
 *   post:
 *     summary: Membuat produk baru
 *     tags:
 *       - Products
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "T-shirt"
 *               price:
 *                 type: integer
 *                 example: 100000
 *               stok:
 *                 type: integer
 *                 example: 10
 *               description:
 *                 type: string
 *                 example: "Produk berkualitas"
 *               image_url:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: url
 *                 example: ["https://res.cloudinary.com/xxx/image.png"]
 *               category_name:
 *                 type: string
 *                 example: "Kaos"
 *     responses:
 *       201:
 *         description: Produk berhasil dibuat
 *       400:
 *         description: Validasi gagal
 *   get:
 *     summary: Mendapatkan semua produk
 *     tags:
 *       - Products
 *     parameters:
 *       - in: query
 *         name: new
 *         schema:
 *           type: boolean
 *         description: Jika true, ambil produk terbaru (limit 8)
 *     responses:
 *       200:
 *         description: Daftar produk
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *
 * /products/bulk-delete:
 *   delete:
 *     summary: Menghapus banyak produk sekaligus
 *     tags:
 *       - Products
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
 *                 example: ["id1", "id2"]
 *     responses:
 *       200:
 *         description: Produk berhasil dihapus
 *       400:
 *         description: Validasi gagal
 *
 * /products/{id}:
 *   get:
 *     summary: Mendapatkan detail produk berdasarkan ID
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID produk
 *     responses:
 *       200:
 *         description: Detail produk
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Produk tidak ditemukan
 *   put:
 *     summary: Memperbarui data produk berdasarkan ID
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID produk
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: integer
 *               stok:
 *                 type: integer
 *               description:
 *                 type: string
 *               image_url:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: url
 *               category_name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Produk berhasil diupdate
 *       400:
 *         description: Validasi gagal
 *       404:
 *         description: Produk tidak ditemukan
 *   delete:
 *     summary: Menghapus produk berdasarkan ID
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID produk
 *     responses:
 *       200:
 *         description: Produk berhasil dihapus
 *       404:
 *         description: Produk tidak ditemukan
 *
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         price:
 *           type: integer
 *         stok:
 *           type: integer
 *         description:
 *           type: string
 *         image_url:
 *           type: array
 *           items:
 *             type: string
 *             format: url
 *         category_name:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 */
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
