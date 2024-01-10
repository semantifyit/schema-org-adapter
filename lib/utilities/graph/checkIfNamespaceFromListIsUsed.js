"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkIfNamespaceFromListIsUsed = void 0;
const isObject_1 = require("../general/isObject");
const isString_1 = require("../general/isString");
function checkIfNamespaceFromListIsUsed(value, namespaceArray, result) {
    if (Array.isArray(value)) {
        value.forEach(function (val) {
            checkIfNamespaceFromListIsUsed(val, namespaceArray, result);
        });
    }
    else {
        let toCheck;
        if ((0, isObject_1.isObject)(value) && (0, isString_1.isString)(value["@id"])) {
            toCheck = value["@id"];
        }
        else {
            toCheck = value;
        }
        if ((0, isString_1.isString)(toCheck) && toCheck.startsWith("http")) {
            const match = namespaceArray.find((el) => toCheck.startsWith(el));
            if (match && !result.has(match)) {
                result.add(match);
            }
        }
    }
}
exports.checkIfNamespaceFromListIsUsed = checkIfNamespaceFromListIsUsed;
//# sourceMappingURL=checkIfNamespaceFromListIsUsed.js.map