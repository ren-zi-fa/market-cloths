"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyUserRole = exports.ensureEmailOrUsername = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const vars_1 = __importDefault(require("../config/vars"));
const JWT_SECRET = vars_1.default.JWT_SECRET;
const ensureEmailOrUsername = (req, res, next) => {
    // Tambahkan pengecekan body
    if (!req.body) {
        res.status(400).json({
            success: false,
            message: 'Request body tidak boleh kosong.'
        });
        return;
    }
    const { login_name } = req.body;
    if (!login_name) {
        res.status(400).json({
            success: false,
            message: 'Email atau Username harus diisi salah satu.'
        });
        return;
    }
    next();
};
exports.ensureEmailOrUsername = ensureEmailOrUsername;
const verifyUserRole = (requiredRole) => {
    return (req, res, next) => {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                res.status(401).json({ message: 'No token provided' });
                return;
            }
            const token = authHeader.split(' ')[1];
            const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
            console.log(decoded);
            if (!decoded.role) {
                res.status(403).json({ message: 'Role not found in token' });
                return;
            }
            // Cek role
            if (decoded.role !== requiredRole) {
                res.status(403).json({
                    message: 'Access denied: insufficient role'
                });
                return;
            }
            // Simpan data user (opsional, biar route handler bisa akses)
            ;
            req.user = decoded;
            next();
        }
        catch (error) {
            res.status(401).json({ message: 'Invalid or expired token' });
            return;
        }
    };
};
exports.verifyUserRole = verifyUserRole;
