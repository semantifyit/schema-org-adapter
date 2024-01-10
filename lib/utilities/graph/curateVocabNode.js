"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.curateVocabNode = void 0;
const namespaces_1 = require("../../data/namespaces");
const isString_1 = require("../general/isString");
const curateLanguageTerm_1 = require("./curateLanguageTerm");
const curateRelationshipTermArray_1 = require("./curateRelationshipTermArray");
function curateVocabNode(vocabNode, vocabularies) {
    (0, curateLanguageTerm_1.curateLanguageTerm)(vocabNode, namespaces_1.NS.rdfs.comment);
    (0, curateLanguageTerm_1.curateLanguageTerm)(vocabNode, namespaces_1.NS.rdfs.label);
    (0, curateRelationshipTermArray_1.curateRelationshipTermArray)(vocabNode, namespaces_1.NS.rdfs.subClassOf, namespaces_1.TermTypeIRI.class);
    (0, curateRelationshipTermArray_1.curateRelationshipTermArray)(vocabNode, namespaces_1.NS.rdfs.subPropertyOf, namespaces_1.TermTypeIRI.property);
    (0, curateRelationshipTermArray_1.curateRelationshipTermArray)(vocabNode, namespaces_1.NS.schema.domainIncludes, namespaces_1.TermTypeIRI.property);
    (0, curateRelationshipTermArray_1.curateRelationshipTermArray)(vocabNode, namespaces_1.NS.schema.rangeIncludes, namespaces_1.TermTypeIRI.property);
    if (vocabNode[namespaces_1.NS.schema.inverseOf] === undefined &&
        vocabNode["@type"] === namespaces_1.TermTypeIRI.property) {
        vocabNode[namespaces_1.NS.schema.inverseOf] = null;
    }
    if (!(0, isString_1.isString)(vocabNode[namespaces_1.NS.schema.isPartOf])) {
        const vocabKeys = Object.keys(vocabularies);
        let vocab = vocabKeys.find((el) => vocabNode["@id"].substring(0, vocabNode["@id"].indexOf(":")) === el);
        if ((0, isString_1.isString)(vocab)) {
            vocab = vocabularies[vocab];
            let newChange;
            do {
                newChange = false;
                if (vocab.endsWith("/") || vocab.endsWith("#")) {
                    vocab = vocab.substring(0, vocab.length - 1);
                    newChange = true;
                }
            } while (newChange);
            vocabNode[namespaces_1.NS.schema.isPartOf] = vocab;
        }
    }
    return vocabNode;
}
exports.curateVocabNode = curateVocabNode;
//# sourceMappingURL=curateVocabNode.js.map