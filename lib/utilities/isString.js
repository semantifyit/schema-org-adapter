"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isString = void 0;
const isNil_1 = require("./isNil");
function isString(value) {
    if ((0, isNil_1.isNil)(value)) {
        return false;
    }
    return typeof value === "string" || value instanceof String;
}
exports.isString = isString;
//# sourceMappingURL=isString.js.map