"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryValidation = exports.productValidation = void 0;
const express_validator_1 = require("express-validator");
// Definisikan schema validasi sebagai object biasa
const productSchema = {
    name: {
        in: ['body'],
        notEmpty: {
            errorMessage: 'Nama produk wajib diisi'
        },
        isString: {
            errorMessage: 'Nama produk harus berupa string'
        }
    },
    price: {
        in: ['body'],
        notEmpty: {
            errorMessage: 'Harga produk wajib diisi'
        },
        isNumeric: {
            errorMessage: 'Harga produk wajib berupa angka'
        }
    },
    stok: {
        in: ['body'],
        notEmpty: {
            errorMessage: 'Stok produk wajib diisi'
        },
        isNumeric: {
            errorMessage: 'Stok produk wajib berupa angka'
        }
    },
    description: {
        in: ['body'],
        notEmpty: {
            errorMessage: 'Deskripsi produk wajib diisi'
        },
        isString: {
            errorMessage: 'Deskripsi produk harus berupa string'
        }
    },
    image_url: {
        in: ['body'],
        isArray: {
            errorMessage: 'Gambar produk wajib diisi dan berupa array'
        }
    },
    category_name: {
        in: ['body'],
        notEmpty: { errorMessage: 'Nama kategori wajib diisi' },
        isString: { errorMessage: 'Nama kategori harus berupa string' }
    }
};
const categorySchema = {
    name: {
        in: ['body'],
        notEmpty: {
            errorMessage: 'Name is required'
        },
        isString: {
            errorMessage: 'Name must be a string'
        }
    },
    description: {
        in: ['body'],
        notEmpty: {
            errorMessage: 'Description is required'
        },
        isString: {
            errorMessage: 'Description must be a string'
        }
    }
};
const productValidation = (0, express_validator_1.checkSchema)(productSchema);
exports.productValidation = productValidation;
const categoryValidation = (0, express_validator_1.checkSchema)(categorySchema);
exports.categoryValidation = categoryValidation;
