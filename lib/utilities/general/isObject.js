"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isObject = void 0;
const isNil_1 = require("./isNil");
const isArray_1 = require("./isArray");
function isObject(value) {
    if ((0, isArray_1.isArray)(value)) {
        return false;
    }
    if ((0, isNil_1.isNil)(value)) {
        return false;
    }
    return typeof value === "object";
}
exports.isObject = isObject;
//# sourceMappingURL=isObject.js.map