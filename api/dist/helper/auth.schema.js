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
exports.makeEmailField = makeEmailField;
exports.makeUsernameField = makeUsernameField;
exports.makeLoginNameField = makeLoginNameField;
const firebase_1 = require("../config/firebase");
function makeEmailField({ optional = false, includeIsEmail = true, includeCustomUniqueCheck = true } = {}) {
    const field = {
        in: ['body']
    };
    if (optional) {
        field.optional = { options: { nullable: true } };
    }
    else {
        field.notEmpty = { errorMessage: 'Email tidak boleh kosong' };
    }
    if (includeIsEmail) {
        field.isEmail = { errorMessage: 'Harus email valid' };
    }
    if (includeCustomUniqueCheck) {
        field.custom = {
            options: (value) => __awaiter(this, void 0, void 0, function* () {
                const userRef = yield firebase_1.db
                    .collection('user')
                    .where('email', '==', value)
                    .get();
                if (!userRef.empty) {
                    throw new Error('Email sudah terdaftar');
                }
                return true;
            })
        };
    }
    return { email: field };
}
function makeUsernameField({ optional = false, includeIsLength = true } = {}) {
    const field = {
        in: ['body']
    };
    if (optional) {
        field.optional = { options: { nullable: true } };
    }
    else {
        field.notEmpty = { errorMessage: 'Username tidak boleh kosong' };
    }
    if (includeIsLength) {
        field.isLength = {
            options: { min: 3 },
            errorMessage: 'Username minimal 3 karakter'
        };
    }
    field.matches = {
        options: [/^[^@]+$/],
        errorMessage: 'Username tidak boleh mengandung karakter @'
    };
    return { username: field };
}
function makeLoginNameField() {
    const field = {
        in: ['body'],
        notEmpty: {
            errorMessage: 'Login name wajib diisi'
        },
        isString: {
            errorMessage: 'Login name harus berupa string'
        }
    };
    return { login_name: field };
}
