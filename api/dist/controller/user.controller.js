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
exports.handleGetAllUser = void 0;
const userService_1 = require("../services/userService");
const handleGetAllUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const dataUser = yield (0, userService_1.getAllUser)();
        res.status(200).json({
            success: true,
            message: 'data berhasil didapatkan',
            data: dataUser
        });
    }
    catch (error) {
        console.error('Fetch data user error:', error);
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : String(error)
        });
    }
});
exports.handleGetAllUser = handleGetAllUser;
