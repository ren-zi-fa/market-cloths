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
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleGetCategoryId = exports.handleUpdateCategory = exports.handleBulkDeleteCategory = exports.handleDeleteCategory = exports.handleGetCategories = exports.handleCreateCategory = void 0;
const express_validator_1 = require("express-validator");
const categoryService_1 = require("../services/categoryService");
const handleCreateCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
            return;
        }
        const data = (0, express_validator_1.matchedData)(req);
        const { name, description } = data;
        yield (0, categoryService_1.createCategory)({ name, description });
        res.status(201).json({
            success: true,
            message: 'Category created successfully'
        });
        return;
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: err instanceof Error ? err.message : String(err)
        });
        return;
    }
});
exports.handleCreateCategory = handleCreateCategory;
const handleGetCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield (0, categoryService_1.getCategories)();
        res.status(200).json({
            success: true,
            message: 'Data kategori berhasil diambil',
            data: categories
        });
        return;
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat mengambil data kategori',
            error: error instanceof Error ? error.message : error
        });
        return;
    }
});
exports.handleGetCategories = handleGetCategories;
const handleDeleteCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }
        const categoryId = req.params.categoryId;
        const deleted = yield (0, categoryService_1.deleteCategoryById)(categoryId);
        if (!deleted) {
            res.status(404).json({
                success: false,
                message: 'Category not found.'
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: `Category with id ${categoryId} deleted.`
        });
        return;
    }
    catch (error) {
        console.error('Delete category error:', error);
        res.status(500).json({ message: 'Internal server error' });
        return;
    }
});
exports.handleDeleteCategory = handleDeleteCategory;
const handleBulkDeleteCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const { categoriesId } = req.body;
        const result = yield (0, categoryService_1.deleteCategoryByIds)(categoriesId);
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
        console.error('Bulk delete category error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});
exports.handleBulkDeleteCategory = handleBulkDeleteCategory;
const handleGetCategoryId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array()
        });
        return;
    }
    const categoryId = req.params.categoryId;
    try {
        const data = yield (0, categoryService_1.getCategoryById)(categoryId);
        if (!data) {
            res.status(404).json({
                success: false,
                message: `Category with id ${categoryId} not found`
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: 'Category found',
            data
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error instanceof Error ? error.message : String(error)
        });
    }
});
exports.handleGetCategoryId = handleGetCategoryId;
const handleUpdateCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array()
        });
        return;
    }
    const categoryId = req.params.categoryId;
    const data = (0, express_validator_1.matchedData)(req);
    // Validasi: minimal salah satu dari name atau description harus ada
    if (!data.name && !data.description) {
        res.status(400).json({
            success: false,
            message: 'At least one of name or description must be provided'
        });
        return;
    }
    try {
        const updated = yield (0, categoryService_1.updateCategoryById)(categoryId, data);
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
exports.handleUpdateCategory = handleUpdateCategory;
