"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleUpdateProduct = exports.handleGetProductById = exports.handleBulkDeleteProducts = exports.handleDeleteproduct = exports.handleCreateProduct = exports.handleGetProducts = void 0;
const express_validator_1 = require("express-validator");
const productService_1 = require("../services/productService");
const vars_1 = __importDefault(require("../config/vars"));
const handleGetProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }
        const data = (0, express_validator_1.matchedData)(req, { locations: ['query'] });
        const category = data.category;
        const search = data.search; // Tambahkan ini
        // Pagination params, default page 1, limit 10
        const page = data.page ? Number(data.page) : 1;
        const limit = data.limit ? Number(data.limit) : vars_1.default.LIMIT_PRODUCT;
        // Batasi limit maksimal 50 untuk keamanan
        const safeLimit = limit > 50 ? 50 : limit;
        const { data: products, totalItems, totalPages } = yield (0, productService_1.fetchProducts)(category, safeLimit, page, search);
        res.json({
            success: true,
            data: products,
            pagination: {
                page,
                limit: safeLimit,
                totalItems,
                totalPages
            }
        });
    }
    catch (error) {
        console.error('Fetch products error:', error);
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : String(error)
        });
    }
});
exports.handleGetProducts = handleGetProducts;
const handleGetProductById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array()
        });
        return;
    }
    const productId = req.params.productId;
    if (!productId || typeof productId !== 'string' || !productId.trim()) {
        res.status(400).json({
            success: false,
            message: 'Invalid productId'
        });
        return;
    }
    try {
        const data = yield (0, productService_1.getProductById)(productId);
        if (!data) {
            res.status(404).json({
                success: false,
                message: `Product with id ${productId} not found`
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: 'Product found',
            data
        });
        return;
    }
    catch (error) {
        console.error('Get product by id error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error instanceof Error ? error.message : String(error)
        });
        return;
    }
});
exports.handleGetProductById = handleGetProductById;
const handleCreateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({
            success: false,
            message: errors.array()
        });
        return;
    }
    const data = (0, express_validator_1.matchedData)(req);
    const { name, image_url, price, stok, description, category_name } = data;
    try {
        const productData = {
            name,
            category_name,
            price,
            stok,
            description,
            image_url,
            createdAt: new Date()
        };
        const id = yield (0, productService_1.createProduct)(productData);
        res.status(201).json({
            success: true,
            id,
            message: 'data berhasil di tambahkan'
        });
        return;
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error instanceof Error ? error.message : error
        });
        return;
    }
});
exports.handleCreateProduct = handleCreateProduct;
const handleBulkDeleteProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array()
        });
        return;
    }
    try {
        const { ids } = req.body;
        const result = yield (0, productService_1.deleteProductByIds)(ids);
        if (result.notFoundIds.length > 0) {
            res.status(400).json({
                success: false,
                message: 'Beberapa ID tidak ditemukan',
                notFoundIds: result.notFoundIds
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: 'Bulk delete completed',
            deletedCount: result.deletedCount
        });
    }
    catch (error) {
        console.error('Bulk delete product error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});
exports.handleBulkDeleteProducts = handleBulkDeleteProducts;
const handleDeleteproduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }
        const productId = req.params.productId;
        const deleted = yield (0, productService_1.deleteProductByid)(productId);
        if (!deleted) {
            res.status(404).json({
                success: false,
                message: 'product not found.'
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: `product with id ${productId} deleted.`
        });
        return;
    }
    catch (error) {
        console.error('Delete product error:', error);
        res.status(500).json({ message: 'Internal server error' });
        return;
    }
});
exports.handleDeleteproduct = handleDeleteproduct;
const handleUpdateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array()
        });
        return;
    }
    const id = req.params.productId;
    const data = (0, express_validator_1.matchedData)(req);
    // Validasi: minimal salah satu dari name, description, price, stok, atau image_url harus ada
    if (!data.name &&
        !data.description &&
        (data.price === undefined || data.price === null) &&
        (data.stok === undefined || data.stok === null) &&
        (!data.image_url ||
            (Array.isArray(data.image_url) && data.image_url.length === 0)) &&
        !data.categoryName) {
        res.status(400).json({
            success: false,
            message: 'At least one of name, description, price, stok, image_url, or categoryName must be provided'
        });
        return;
    }
    try {
        const updated = yield (0, productService_1.updateProductById)(id, data);
        if (!updated) {
            res.status(404).json({
                success: false,
                message: 'Category not found'
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: 'Category updated successfully'
        });
    }
    catch (error) {
        console.error('Update category error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});
exports.handleUpdateProduct = handleUpdateProduct;
