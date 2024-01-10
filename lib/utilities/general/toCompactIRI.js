"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toCompactIRI = void 0;
const isString_1 = require("./isString");
const switchIRIProtocol_1 = require("./switchIRIProtocol");
function toCompactIRI(absoluteIRI, context, equateVocabularyProtocols = false) {
    for (const contextTerm of Object.keys(context)) {
        const vocabIRI = context[contextTerm];
        if ((0, isString_1.isString)(vocabIRI) && absoluteIRI.startsWith(vocabIRI)) {
            return (contextTerm + ":" + absoluteIRI.substring(vocabIRI.length));
        }
        if (equateVocabularyProtocols && (0, isString_1.isString)(vocabIRI)) {
            const protocolSwitchedIRI = (0, switchIRIProtocol_1.switchIRIProtocol)(vocabIRI);
            if (absoluteIRI.startsWith(protocolSwitchedIRI)) {
                return (contextTerm + ":" + absoluteIRI.substring(protocolSwitchedIRI.length));
            }
        }
    }
    throw new Error("Trying to get a compact IRI for a term with no entry in the Context");
}
exports.toCompactIRI = toCompactIRI;
//# sourceMappingURL=toCompactIRI.js.map