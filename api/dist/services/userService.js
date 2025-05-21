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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = createUser;
exports.findUserByLoginName = findUserByLoginName;
exports.isUserExist = isUserExist;
exports.saveRefreshToken = saveRefreshToken;
exports.revokeRefreshToken = revokeRefreshToken;
exports.findValidRefreshToken = findValidRefreshToken;
exports.checkRefreshToken = checkRefreshToken;
exports.deleteRefreshToken = deleteRefreshToken;
exports.findUserById = findUserById;
exports.getAllUser = getAllUser;
const firebase_1 = require("../config/firebase");
function createUser(_a) {
    return __awaiter(this, arguments, void 0, function* ({ email, username, password, role, makanan_favorite }) {
        return firebase_1.db.collection('user').add({
            email,
            username,
            role,
            password,
            makanan_favorite
        });
    });
}
function findUserByLoginName(login_name) {
    return __awaiter(this, void 0, void 0, function* () {
        const isEmail = /@(gmail|yahoo|outlook|icloud)\.com$/.test(login_name);
        let userQuery;
        if (isEmail) {
            userQuery = firebase_1.db
                .collection('user')
                .where('email', '==', login_name)
                .limit(1);
        }
        else {
            userQuery = firebase_1.db
                .collection('user')
                .where('username', '==', login_name)
                .limit(1);
        }
        const userSnapshot = yield userQuery.get();
        if (userSnapshot.empty)
            return null;
        const userDoc = userSnapshot.docs[0];
        return { userId: userDoc.id, user: userDoc.data() };
    });
}
function isUserExist(email, username) {
    return __awaiter(this, void 0, void 0, function* () {
        const emailSnap = yield firebase_1.db
            .collection('user')
            .where('email', '==', email)
            .limit(1)
            .get();
        if (!emailSnap.empty)
            return true;
        const usernameSnap = yield firebase_1.db
            .collection('user')
            .where('username', '==', username)
            .limit(1)
            .get();
        return !usernameSnap.empty;
    });
}
function saveRefreshToken(refresh_token, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        const createdAt = new Date();
        yield firebase_1.db.collection('refresh_tokens').add({
            token: refresh_token,
            userId,
            expiresAt,
            revoke: false,
            createdAt
        });
    });
}
function revokeRefreshToken(refresh_token) {
    return __awaiter(this, void 0, void 0, function* () {
        const tokenSnap = yield firebase_1.db
            .collection('refresh_tokens')
            .where('token', '==', refresh_token)
            .limit(1)
            .get();
        if (!tokenSnap.empty) {
            const docId = tokenSnap.docs[0].id;
            yield firebase_1.db.collection('refresh_tokens').doc(docId).update({ revoke: true });
            return true;
        }
        return false;
    });
}
function findValidRefreshToken(token) {
    return __awaiter(this, void 0, void 0, function* () {
        const snap = yield firebase_1.db
            .collection('refresh_tokens')
            .where('token', '==', token)
            .where('revoke', '==', false)
            .limit(1)
            .get();
        if (snap.empty)
            return null;
        return snap.docs[0].data();
    });
}
function checkRefreshToken(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const snap = yield firebase_1.db
            .collection('refresh_tokens')
            .where('userId', '==', userId)
            .where('revoke', '==', false)
            .limit(1)
            .get();
        return !snap.empty;
    });
}
function deleteRefreshToken(userId, revoke) {
    return __awaiter(this, void 0, void 0, function* () {
        if (revoke === false) {
            const snap = yield firebase_1.db
                .collection('refresh_tokens')
                .where('userId', '==', userId)
                .where('revoke', '==', false)
                .get();
            const batch = firebase_1.db.batch();
            snap.docs.forEach((doc) => {
                batch.delete(doc.ref);
            });
            yield batch.commit();
        }
    });
}
function findUserById(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const userSnap = yield firebase_1.db.collection('user').doc(userId).get();
        if (!userSnap.exists)
            return null;
        const userData = userSnap.data();
        if (!userData)
            return null;
        // Hilangkan password sebelum dikirim
        const { password } = userData, userWithoutPassword = __rest(userData, ["password"]);
        return { userId: userSnap.id, user: userWithoutPassword };
    });
}
function getAllUser() {
    return __awaiter(this, void 0, void 0, function* () {
        const userSnapshot = yield firebase_1.db
            .collection('user')
            .where('role', '==', 'user')
            .get();
        const users = userSnapshot.docs.map((doc) => {
            const _a = doc.data(), { password } = _a, userWithoutPassword = __rest(_a, ["password"]);
            return Object.assign({ userId: doc.id }, userWithoutPassword);
        });
        return users;
    });
}
