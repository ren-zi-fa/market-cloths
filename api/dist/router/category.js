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
    .get(controller_1.categoryController.handleGetCategories)
    .post(product_validation_1.categoryValidation, controller_1.categoryController.handleCreateCategory);
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
    .delete([
    (0, express_validator_1.body)('categoriesId')
        .isArray({ min: 1 })
        .withMessage('categoriesId harus berupa array yang tidak kosong'),
    (0, express_validator_1.body)('categoriesId.*')
        .isString()
        .notEmpty()
        .withMessage('Setiap categoryId harus berupa string yang tidak kosong')
], controller_1.categoryController.handleBulkDeleteCategory);
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
    .get([
    (0, express_validator_1.param)('categoryId')
        .isString()
        .trim()
        .notEmpty()
        .withMessage('categoryId tidak boleh kosong dan harus berupa string')
], controller_1.categoryController.handleGetCategoryId)
    .put([
    (0, express_validator_1.param)('categoryId')
        .isString()
        .trim()
        .notEmpty()
        .withMessage('categoryId tidak boleh kosong dan harus berupa string'),
    (0, express_validator_1.body)('name')
        .optional()
        .isString()
        .withMessage('Name harus berupa string')
        .trim(),
    (0, express_validator_1.body)('description')
        .optional()
        .isString()
        .withMessage('Description harus berupa string')
        .trim()
], controller_1.categoryController.handleUpdateCategory)
    .delete([
    (0, express_validator_1.param)('categoryId')
        .isString()
        .withMessage('categoryId harus berupa string')
        .notEmpty()
        .withMessage('categoryId tidak boleh kosong')
], controller_1.categoryController.handleDeleteCategory);
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
exports.default = router;
