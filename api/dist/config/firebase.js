"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const vars_1 = __importDefault(require("./vars"));
let app;
if (!firebase_admin_1.default.apps.length) {
    if (!vars_1.default.FIREBASE_SERVICE_ACCOUNT) {
        throw new Error('FIREBASE_SERVICE_ACCOUNT is not defined in the configuration.');
    }
    try {
        const parsedServiceAccount = JSON.parse(vars_1.default.FIREBASE_SERVICE_ACCOUNT);
        if (parsedServiceAccount.private_key) {
            parsedServiceAccount.private_key =
                parsedServiceAccount.private_key.replace(/\\n/g, '\n');
        }
        app = firebase_admin_1.default.initializeApp({
            credential: firebase_admin_1.default.credential.cert(parsedServiceAccount)
        });
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('Failed to initialize Firebase Admin:', error.message);
        }
        else {
            console.error('Unknown error during Firebase Admin initialization');
        }
        throw error;
    }
}
else {
    app = firebase_admin_1.default.app();
}
exports.db = firebase_admin_1.default.firestore(app);
