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
const firebase_1 = require("../config/firebase");
function seed() {
    return __awaiter(this, void 0, void 0, function* () {
        const products = [
            {
                name: 'T-shirt',
                price: 99,
                stok: 12,
                description: 'barang berkualitas',
                image_url: [
                    'https://res.cloudinary.com/dschnntvt/image/upload/v1747301613/Rectangle_19_tcqs5c.png',
                    'https://res.cloudinary.com/dschnntvt/image/upload/v1747301614/Rectangle_17_rgxvjh.png'
                ],
                createdAt: new Date()
            }
        ];
        const batch = firebase_1.db.batch();
        for (const product of products) {
            const docRef = firebase_1.db.collection('product').doc();
            batch.set(docRef, product);
        }
        try {
            yield batch.commit();
            console.log('✅ Seeding selesai!');
            process.exit(0);
        }
        catch (err) {
            console.error('❌ Gagal seeding:', err);
            process.exit(1);
        }
    });
}
seed();
