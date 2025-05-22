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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProduct = void 0;
exports.fetchProducts = fetchProducts;
exports.deleteProductByid = deleteProductByid;
exports.deleteProductByIds = deleteProductByIds;
exports.updateProductById = updateProductById;
exports.getProductById = getProductById;
const firebase_1 = require("../config/firebase");
const vars_1 = __importDefault(require("../config/vars"));
const createProduct = (productData) => __awaiter(void 0, void 0, void 0, function* () {
    const docRef = yield firebase_1.db.collection('product').add(productData);
    return docRef.id;
});
exports.createProduct = createProduct;
function fetchProducts(category_1) {
    return __awaiter(this, arguments, void 0, function* (category, limit = vars_1.default.LIMIT_PRODUCT, page = 1, search) {
        let queryRef = firebase_1.db.collection('product').orderBy('createdAt', 'desc');
        if (category) {
            queryRef = queryRef.where('category_name', '==', category);
        }
        const snapshot = yield queryRef.get();
        let docs = snapshot.docs;
        if (search) {
            const searchLower = search.toLowerCase();
            docs = docs.filter((doc) => {
                const data = doc.data();
                const name = (data.name || '').toString().toLowerCase();
                const description = (data.description || '').toString().toLowerCase();
                const price = data.price !== undefined ? String(data.price) : '';
                const category_name = (data.category_name || '')
                    .toString()
                    .toLowerCase();
                return (name.includes(searchLower) ||
                    description.includes(searchLower) ||
                    category_name.includes(searchLower) ||
                    price.includes(searchLower));
            });
        }
        const totalItems = docs.length;
        const totalPages = Math.ceil(totalItems / limit);
        const offset = (page - 1) * limit;
        const pagedDocs = docs.slice(offset, offset + limit);
        const data = pagedDocs.map((doc) => {
            const data = doc.data();
            return Object.assign(Object.assign({ id: doc.id }, data), { createdAt: data.createdAt && data.createdAt.toDate
                    ? data.createdAt.toDate().toISOString()
                    : data.createdAt });
        });
        return {
            data,
            totalItems,
            totalPages
        };
    });
}
function deleteProductByid(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const docRef = firebase_1.db.collection('product').doc(id);
        const doc = yield docRef.get();
        if (!doc.exists) {
            return false;
        }
        yield docRef.delete();
        return true;
    });
}
function deleteProductByIds(ids) {
    return __awaiter(this, void 0, void 0, function* () {
        let deletedCount = 0;
        const notFoundIds = [];
        const batch = firebase_1.db.batch();
        for (const id of ids) {
            const docRef = firebase_1.db.collection('product').doc(id);
            const doc = yield docRef.get();
            if (doc.exists) {
                batch.delete(docRef);
                deletedCount++;
            }
            else {
                notFoundIds.push(id);
            }
        }
        if (deletedCount > 0) {
            yield batch.commit();
        }
        return { deletedCount, notFoundIds };
    });
}
function updateProductById(id, data) {
    return __awaiter(this, void 0, void 0, function* () {
        const docRef = firebase_1.db.collection('product').doc(id);
        const doc = yield docRef.get();
        if (!doc.exists) {
            return false;
        }
        yield docRef.update(data);
        return true;
    });
}
function getProductById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const docRef = firebase_1.db.collection('product').doc(id);
        const doc = yield docRef.get();
        if (!doc.exists) {
            return null;
        }
        return Object.assign({ id: doc.id }, doc.data());
    });
}
