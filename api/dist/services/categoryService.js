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
exports.createCategory = createCategory;
exports.getCategories = getCategories;
exports.deleteCategoryById = deleteCategoryById;
exports.deleteCategoryByIds = deleteCategoryByIds;
exports.updateCategoryById = updateCategoryById;
exports.getCategoryById = getCategoryById;
const firebase_1 = require("../config/firebase");
function createCategory(_a) {
    return __awaiter(this, arguments, void 0, function* ({ name, description }) {
        return firebase_1.db.collection('category').add({
            name,
            description
        });
    });
}
function getCategories() {
    return __awaiter(this, void 0, void 0, function* () {
        const snapshot = yield firebase_1.db.collection('category').get();
        return snapshot.docs.map((doc) => (Object.assign({ id: doc.id }, doc.data())));
    });
}
function deleteCategoryById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!id || typeof id !== 'string' || !id.trim()) {
            return false;
        }
        try {
            const docRef = firebase_1.db.collection('category').doc(id);
            const doc = yield docRef.get();
            if (!doc.exists) {
                return false;
            }
            yield docRef.delete();
            return true;
        }
        catch (error) {
            console.error('Error deleting category:', error);
            return false;
        }
    });
}
function deleteCategoryByIds(categoriesId) {
    return __awaiter(this, void 0, void 0, function* () {
        let deletedCount = 0;
        const notFoundIds = [];
        const batch = firebase_1.db.batch();
        for (const id of categoriesId) {
            const docRef = firebase_1.db.collection('category').doc(id);
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
function updateCategoryById(id, data) {
    return __awaiter(this, void 0, void 0, function* () {
        const docRef = firebase_1.db.collection('category').doc(id);
        const doc = yield docRef.get();
        if (!doc.exists) {
            return false;
        }
        yield docRef.update(data);
        return true;
    });
}
function getCategoryById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const docRef = firebase_1.db.collection('category').doc(id);
        const doc = yield docRef.get();
        if (!doc.exists) {
            return null;
        }
        return Object.assign({ id: doc.id }, doc.data());
    });
}
