import { Router } from 'express'

import { body, param, query } from 'express-validator'
import { productValidation } from '../validation/product.validation'
import { productController } from '../controller'

const router = Router()

/**
 * @swagger
 * tags:
 *   - name: Products
 *     description: Endpoint untuk produk
 */

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Membuat produk baru
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductInput'
 *     responses:
 *       201:
 *         description: Produk berhasil dibuat
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Validasi gagal
 *   get:
 *     summary: Mendapatkan daftar produk
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter produk berdasarkan kategori
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Jumlah maksimum produk yang ditampilkan per halaman
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Nomor halaman untuk paginasi
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Pencarian produk berdasarkan nama atau deskripsi
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
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *       400:
 *         description: Validasi parameter query gagal
 */

router
   .route('/products')
   .post(productValidation, productController.handleCreateProduct)
   .get(
      [
         query('category').optional().isString().trim(),
         query('limit').optional().isInt(),
         query('page').optional().isInt(),
         query('search').optional().isString().trim()
      ],
      productController.handleGetProducts
   )

/**
 * @swagger
 * /api/products/bulk-delete:
 *   delete:
 *     summary: Menghapus banyak produk sekaligus
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productsId:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["id1", "id2"]
 *     responses:
 *       200:
 *         description: Produk berhasil dihapus
 *       400:
 *         description: Validasi gagal
 */
router
   .route('/products/bulk-delete')
   .delete(
      [
         body('productsId')
            .isArray({ min: 1 })
            .withMessage('productsId harus berupa array yang tidak kosong'),
         body('productsId.*')
            .isString()
            .notEmpty()
            .withMessage('Setiap productsId harus berupa string yang tidak kosong')
      ],
      productController.handleBulkDeleteProducts
   )

/**
 * @swagger
 * /api/products/{productId}:
 *   get:
 *     summary: Mendapatkan detail produk berdasarkan productId
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: productId produk
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
 *     summary: Memperbarui data produk berdasarkan productId
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: productId produk
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductInput'
 *     responses:
 *       200:
 *         description: Produk berhasil diupdate
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Validasi gagal
 *       404:
 *         description: Produk tidak ditemukan
 *   delete:
 *     summary: Menghapus produk berdasarkan productId
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: productId produk
 *     responses:
 *       200:
 *         description: Produk berhasil dihapus
 *       404:
 *         description: Produk tidak ditemukan
 */
router
   .route('/products/:productId')
   .get(
      [
         param('productId')
            .isString()
            .trim()
            .notEmpty()
            .withMessage('productId tidak boleh kosong dan harus berupa string')
      ],
      productController.handleGetProductById
   )
   .put(
      [
         param('productId')
            .isString()
            .trim()
            .notEmpty()
            .withMessage('productId  tidak boleh kosong dan harus berupa string'),

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
         param('productId')
            .isString()
            .withMessage('productId harus berupa string')
            .notEmpty()
            .withMessage('productId tidak boleh kosong')
      ],
      productController.handleDeleteproduct
   )

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         productId :
 *           type: string
 *           example: "664a1b2c3d4e5f6a7b8c9d0e"
 *         name:
 *           type: string
 *           example: "T-shirt"
 *         price:
 *           type: integer
 *           example: 100000
 *         stok:
 *           type: integer
 *           example: 10
 *         description:
 *           type: string
 *           example: "Produk berkualitas"
 *         image_url:
 *           type: array
 *           items:
 *             type: string
 *             format: url
 *           example: ["https://res.cloudinary.com/xxx/image.png"]
 *         category_name:
 *           type: string
 *           example: "Kaos"
 *     ProductInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: "T-shirt"
 *         price:
 *           type: integer
 *           example: 100000
 *         stok:
 *           type: integer
 *           example: 10
 *         description:
 *           type: string
 *           example: "Produk berkualitas"
 *         image_url:
 *           type: array
 *           items:
 *             type: string
 *             format: url
 *           example: ["https://res.cloudinary.com/xxx/image.png"]
 *         category_name:
 *           type: string
 *           example: "Kaos"
 */

export default router
