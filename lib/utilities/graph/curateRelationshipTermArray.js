"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.curateRelationshipTermArray = void 0;
const isString_1 = require("../general/isString");
function curateRelationshipTermArray(vocabNode, term, initDefaultIf) {
    if ((0, isString_1.isString)(vocabNode[term])) {
        vocabNode[term] = [vocabNode[term]];
    }
    else if (vocabNode[term] === undefined &&
        vocabNode["@type"] === initDefaultIf) {
        vocabNode[term] = [];
    }
}
exports.curateRelationshipTermArray = curateRelationshipTermArray;
//# sourceMappingURL=curateRelationshipTermArray.js.map