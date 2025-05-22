"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginValidation = exports.registerValidation = void 0;
const express_validator_1 = require("express-validator");
const auth_schema_1 = require("../helper/auth.schema");
const passwordField = {
    password: {
        in: ['body'],
        notEmpty: {
            errorMessage: 'Password tidak boleh kosong'
        },
        isLength: {
            options: { min: 6 },
            errorMessage: 'Password minimal 6 karakter'
        },
        matches: {
            options: /^(?=.*[a-zA-Z])(?=.*[0-9])/,
            errorMessage: 'Password harus mengandung huruf dan angka'
        }
    }
};
const passwordConfirmationField = {
    konfirmasi_password: {
        in: ['body'],
        notEmpty: {
            errorMessage: 'Konfirmasi password wajib diisi'
        },
        custom: {
            options: (value, { req }) => {
                if (value !== req.body.password) {
                    throw new Error('password yang anda inputkan tidak sesuai');
                }
                return true;
            }
        }
    }
};
const makananFavorite = {
    makanan_favorite: {
        in: ['body'],
        notEmpty: {
            errorMessage: 'Konfirmasi password wajib diisi'
        },
        isString: {
            errorMessage: 'harus berupa string'
        }
    }
};
const registerValidation = (0, express_validator_1.checkSchema)(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, (0, auth_schema_1.makeUsernameField)()), (0, auth_schema_1.makeEmailField)({
    includeIsEmail: true,
    includeCustomUniqueCheck: true,
    optional: false
})), passwordField), passwordConfirmationField), makananFavorite));
exports.registerValidation = registerValidation;
const loginValidation = (0, express_validator_1.checkSchema)(Object.assign(Object.assign({}, (0, auth_schema_1.makeLoginNameField)()), passwordField));
exports.loginValidation = loginValidation;
