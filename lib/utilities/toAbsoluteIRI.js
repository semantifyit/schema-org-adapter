"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toAbsoluteIRI = void 0;
function toAbsoluteIRI(compactIRI, context) {
    const terms = Object.keys(context);
    for (let i = 0; i < terms.length; i++) {
        const vocabIRI = context[terms[i]];
        if (compactIRI.substring(0, compactIRI.indexOf(":")) === terms[i]) {
            return vocabIRI.concat(compactIRI.substring(compactIRI.indexOf(":") + 1));
        }
    }
    throw new Error("Trying to get an absolute IRI for a term with no entry in the Context");
}
exports.toAbsoluteIRI = toAbsoluteIRI;
//# sourceMappingURL=toAbsoluteIRI.js.map