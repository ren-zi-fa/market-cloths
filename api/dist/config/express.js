"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const router_1 = require("../router");
const cors_1 = __importDefault(require("cors"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const notFoundMiddleware_1 = require("../middlewares/notFoundMiddleware");
const errorMiddleware_1 = require("../middlewares/errorMiddleware");
const swagger_1 = require("../swagger/swagger");
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const app = (0, express_1.default)();
exports.app = app;
app.use(express_1.default.static(path_1.default.join(__dirname, '../public')));
app.use('/images', express_1.default.static(path_1.default.join(__dirname, '../../public/images')));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
const allowedOrigins = [
    'http://localhost:3000',
    'https://market-cloths.vercel.app'
];
const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
};
app.use((0, cors_1.default)(corsOptions));
app.get('/', (req, res) => {
    res.json({ message: 'api is ok' });
});
app.use('/api', router_1.router);
app.use('/swagger-ui', express_1.default.static(path_1.default.join(__dirname, '../public/swagger-ui')));
const specs = (0, swagger_jsdoc_1.default)(swagger_1.swaggerOptions);
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(specs, {
    customCssUrl: '/api/swagger-ui.css',
}));
// Not found & error handler harus di bawah semua route
app.use(notFoundMiddleware_1.notFoundMiddleware);
app.use(errorMiddleware_1.errorMiddleware);
