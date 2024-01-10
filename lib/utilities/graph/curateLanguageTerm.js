"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.curateLanguageTerm = void 0;
const isString_1 = require("../general/isString");
const isLanguageObjectVocab_1 = require("../general/isLanguageObjectVocab");
const isArray_1 = require("../general/isArray");
function curateLanguageTerm(vocabNode, term) {
    if (vocabNode[term] !== undefined) {
        if ((0, isString_1.isString)(vocabNode[term])) {
            vocabNode[term] = {
                en: vocabNode[term],
            };
        }
        else if ((0, isLanguageObjectVocab_1.isLanguageObjectVocab)(vocabNode[term])) {
            vocabNode[term] = {
                [vocabNode[term]["@language"]]: vocabNode[term]["@value"],
            };
        }
        else if ((0, isArray_1.isArray)(vocabNode[term])) {
            const newVal = {};
            vocabNode[term].map((el) => {
                if ((0, isLanguageObjectVocab_1.isLanguageObjectVocab)(el)) {
                    newVal[el["@language"]] = el["@value"];
                }
            });
            vocabNode[term] = newVal;
        }
    }
    else {
        vocabNode[term] = {};
    }
}
exports.curateLanguageTerm = curateLanguageTerm;
//# sourceMappingURL=curateLanguageTerm.js.map