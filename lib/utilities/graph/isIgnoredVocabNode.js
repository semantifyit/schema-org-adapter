"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isIgnoredVocabNode = void 0;
const isString_1 = require("../general/isString");
function isIgnoredVocabNode(vocabNode) {
    const id = vocabNode["@id"];
    return !(0, isString_1.isString)(id) ||
        id.startsWith("file://") ||
        id.includes("://www.w3.org/wiki/WebSchemas/SchemaDotOrgSources") ||
        id.includes("://meta.schema.org/") ||
        id.includes("://publications.europa.eu") ||
        id.includes("://www.w3.org/ns/regorg#RegisteredOrganization");
}
exports.isIgnoredVocabNode = isIgnoredVocabNode;
//# sourceMappingURL=isIgnoredVocabNode.js.map