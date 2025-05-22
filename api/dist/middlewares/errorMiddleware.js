"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = errorMiddleware;
function errorMiddleware(err, req, res, next) {
    console.error('Internal server error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error'
    });
}
