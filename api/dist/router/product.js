"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const product_validation_1 = require("../validation/product.validation");
const controller_1 = require("../controller");
const router = (0, express_1.Router)();
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
    .post(product_validation_1.productValidation, controller_1.productController.handleCreateProduct)
    .get([
    (0, express_validator_1.query)('category').optional().isString().trim(),
    (0, express_validator_1.query)('limit').optional().isInt(),
    (0, express_validator_1.query)('page').optional().isInt(),
    (0, express_validator_1.query)('search').optional().isString().trim()
], controller_1.productController.handleGetProducts);
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
 */
router
    .route('/products/bulk-delete')
    .delete([
    (0, express_validator_1.body)('ids')
        .isArray({ min: 1 })
        .withMessage('ids harus berupa array yang tidak kosong'),
    (0, express_validator_1.body)('ids.*')
        .isString()
        .notEmpty()
        .withMessage('Setiap id harus berupa string yang tidak kosong')
], controller_1.productController.handleBulkDeleteProducts);
/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Mendapatkan detail produk berdasarkan ID
 *     tags: [Products]
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
 *     tags: [Products]
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
 *     summary: Menghapus produk berdasarkan ID
 *     tags: [Products]
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
 */
router
    .route('/products/:id')
    .get([
    (0, express_validator_1.param)('id')
        .isString()
        .trim()
        .notEmpty()
        .withMessage('ID tidak boleh kosong dan harus berupa string')
], controller_1.productController.handleGetProductById)
    .put([
    (0, express_validator_1.param)('id')
        .isString()
        .trim()
        .notEmpty()
        .withMessage('ID tidak boleh kosong dan harus berupa string'),
    (0, express_validator_1.body)('name')
        .optional()
        .isString()
        .withMessage('Name harus berupa string')
        .trim(),
    (0, express_validator_1.body)('description')
        .optional()
        .isString()
        .withMessage('Description harus berupa string')
        .trim(),
    (0, express_validator_1.body)('category_name')
        .optional()
        .isString()
        .withMessage('category_name harus berupa string')
        .trim(),
    (0, express_validator_1.body)('image_url')
        .optional()
        .isArray()
        .withMessage('image url harus berupa array'),
    (0, express_validator_1.body)('price')
        .optional()
        .isInt()
        .withMessage('price harus berupa number'),
    (0, express_validator_1.body)('stok').optional().isInt().withMessage('stok harus berupa number')
], controller_1.productController.handleUpdateProduct)
    .delete([
    (0, express_validator_1.param)('id')
        .isString()
        .withMessage('ID harus berupa string')
        .notEmpty()
        .withMessage('ID tidak boleh kosong')
], controller_1.productController.handleDeleteproduct);
/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         id:
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
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2024-05-20T12:34:56.789Z"
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
exports.default = router;
