"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isLanguageObjectVocab = void 0;
const isString_1 = require("./isString");
const isObject_1 = require("./isObject");
function isLanguageObjectVocab(value) {
    if ((0, isObject_1.isObject)(value)) {
        if ((0, isString_1.isString)(value["@language"]) && (0, isString_1.isString)(value["@value"])) {
            return true;
        }
    }
    return false;
}
exports.isLanguageObjectVocab = isLanguageObjectVocab;
//# sourceMappingURL=isLanguageObjectVocab.js.map