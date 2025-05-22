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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleProfile = exports.handleRefreshToken = exports.handleLogout = exports.handleLogin = exports.handleRegister = void 0;
const express_validator_1 = require("express-validator");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const vars_1 = __importDefault(require("../config/vars"));
const userService_1 = require("../services/userService");
const userService_2 = require("../services/userService");
const node_crypto_1 = __importDefault(require("node:crypto"));
const handleRegister = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const role = 'user';
        const result = (0, express_validator_1.validationResult)(req);
        if (!result.isEmpty()) {
            res.status(400).json({
                success: false,
                message: result.array()
            });
            return;
        }
        const data = (0, express_validator_1.matchedData)(req);
        const { password, username, email, makanan_favorite } = data;
        // CEK USER SUDAH ADA
        const exist = yield (0, userService_2.isUserExist)(email, username);
        if (exist) {
            res.status(400).json({
                success: false,
                message: 'User dengan email atau username tersebut sudah terdaftar'
            });
            return;
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        yield (0, userService_1.createUser)({
            email,
            username,
            password: hashedPassword,
            role,
            makanan_favorite
        });
        res.status(201).json({
            success: true,
            message: 'Registrasi berhasil silahkan login'
        });
    }
    catch (error) {
        console.error(error.message);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat registrasi'
        });
    }
});
exports.handleRegister = handleRegister;
const handleLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = (0, express_validator_1.validationResult)(req);
        if (!result.isEmpty()) {
            res.status(400).json({
                success: false,
                message: result.array()
            });
            return;
        }
        const data = (0, express_validator_1.matchedData)(req);
        const { login_name, password } = data;
        const found = yield (0, userService_1.findUserByLoginName)(login_name);
        if (!found) {
            res.status(400).json({
                message: 'Username atau email tidak ditemukan'
            });
            return;
        }
        const { userId, user } = found;
        const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(400).json({ message: 'Password salah' });
            return;
        }
        const JWT_SECRET = vars_1.default.JWT_SECRET;
        const access_token = jsonwebtoken_1.default.sign({
            userId,
            username: user.username,
            email: user.email,
            tokenType: 'access',
            role: user.role
        }, JWT_SECRET, { expiresIn: '15m' });
        const existingValidToken = yield (0, userService_1.checkRefreshToken)(userId);
        if (existingValidToken) {
            yield (0, userService_1.deleteRefreshToken)(userId, false);
            console.log('Refresh token yang direvoke telah dihapus.');
        }
        else {
            console.log('Tidak ada refresh token yang direvoke.');
        }
        const refresh_token = node_crypto_1.default.randomBytes(32).toString('hex');
        yield (0, userService_1.saveRefreshToken)(refresh_token, userId);
        res.cookie('access_token', access_token, {
            httpOnly: false,
            secure: false,
            sameSite: 'lax',
            maxAge: vars_1.default.ACCESS_TOKEN_MAX_AGE
        })
            .cookie('refresh_token', refresh_token, {
            httpOnly: false,
            secure: false,
            sameSite: 'lax',
            maxAge: vars_1.default.REFRESH_TOKEN_MAX_AGE
        })
            .json({
            success: true,
            message: 'Login berhasil'
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Terjadi kesalahan pada server',
            error: error.message
        });
    }
});
exports.handleLogin = handleLogin;
const handleLogout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const refresh_token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.refresh_token;
        if (!refresh_token) {
            res.status(400).json({ message: 'Refresh token tidak ditemukan' });
            return;
        }
        yield (0, userService_1.revokeRefreshToken)(refresh_token);
        res.clearCookie('refresh_token')
            .clearCookie('access_token')
            .json({ message: 'Logout berhasil' });
    }
    catch (error) {
        res.status(500).json({
            message: 'Gagal logout',
            error: error.message
        });
    }
});
exports.handleLogout = handleLogout;
const handleRefreshToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const refresh_token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.refresh_token;
        if (!refresh_token) {
            res.status(400).json({ message: 'Refresh token tidak ditemukan' });
            return;
        }
        const tokenData = yield (0, userService_1.findValidRefreshToken)(refresh_token);
        if (!tokenData) {
            res.status(401).json({
                message: 'Refresh token tidak valid atau sudah kadaluarsa'
            });
            return;
        }
        const found = yield (0, userService_1.findUserById)(tokenData.userId);
        if (!found) {
            res.status(404).json({ message: 'User tidak ditemukan' });
            return;
        }
        const { userId, user } = found;
        const JWT_SECRET = vars_1.default.JWT_SECRET;
        const access_token = jsonwebtoken_1.default.sign({
            userId,
            username: user === null || user === void 0 ? void 0 : user.username,
            email: user === null || user === void 0 ? void 0 : user.email,
            tokenType: 'access',
            role: user === null || user === void 0 ? void 0 : user.role
        }, JWT_SECRET, { expiresIn: '15m' });
        res.cookie('access_token', access_token, {
            httpOnly: false,
            secure: false,
            sameSite: 'lax',
            maxAge: vars_1.default.ACCESS_TOKEN_MAX_AGE
        }).json({ success: true, message: 'Token diperbarui' });
    }
    catch (error) {
        res.status(500).json({
            message: 'Gagal refresh token',
            error: error.message
        });
    }
});
exports.handleRefreshToken = handleRefreshToken;
const handleProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.access_token;
        if (!token) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const JWT_SECRET = vars_1.default.JWT_SECRET;
        let payload;
        try {
            payload = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        }
        catch (_b) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        // Ambil userId dari payload
        const userId = payload.userId;
        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const found = yield (0, userService_1.findUserById)(userId);
        if (!found) {
            res.status(404).json({ message: 'User tidak ditemukan' });
            return;
        }
        // Jangan kirim password ke client
        const data = __rest(found.user, []);
        res.json({ user: Object.assign({ userId: found.userId }, data) });
    }
    catch (error) {
        res.status(500).json({
            message: 'Gagal mengambil profile',
            error: error.message
        });
    }
});
exports.handleProfile = handleProfile;
