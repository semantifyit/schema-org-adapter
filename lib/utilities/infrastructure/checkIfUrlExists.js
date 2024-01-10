"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkIfUrlExists = void 0;
const axios_1 = __importDefault(require("axios"));
async function checkIfUrlExists(url) {
    try {
        await axios_1.default.head(url);
        return true;
    }
    catch (e) {
        return false;
    }
}
exports.checkIfUrlExists = checkIfUrlExists;
//# sourceMappingURL=checkIfUrlExists.js.map