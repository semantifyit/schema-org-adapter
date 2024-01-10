"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Term = void 0;
const namespaces_1 = require("../data/namespaces");
const toAbsoluteIRI_1 = require("../utilities/general/toAbsoluteIRI");
const isNil_1 = require("../utilities/general/isNil");
const isString_1 = require("../utilities/general/isString");
const outputTransformation_1 = require("../utilities/general/outputTransformation");
class Term {
    constructor(IRI, graph) {
        this.IRI = IRI;
        this.graph = graph;
    }
    getIRI(outputIRIType = "Absolute") {
        if (outputIRIType === "Compact") {
            return this.IRI;
        }
        return (0, toAbsoluteIRI_1.toAbsoluteIRI)(this.IRI, this.graph.context);
    }
    getTermTypeLabel() {
        return this.termTypeLabel;
    }
    getTermTypeIRI() {
        return this.termTypeIRI;
    }
    getVocabURLs() {
        const termObj = this.getTermObj();
        if (!(0, isNil_1.isNil)(termObj["vocabURLs"])) {
            return termObj["vocabURLs"];
        }
        return null;
    }
    getVocabulary() {
        const termObj = this.getTermObj();
        if (!(0, isNil_1.isNil)(termObj[namespaces_1.NS.schema.isPartOf])) {
            return termObj[namespaces_1.NS.schema.isPartOf];
        }
        return null;
    }
    getSource() {
        const termObj = this.getTermObj();
        if (!(0, isNil_1.isNil)(termObj[namespaces_1.NS.dcterms.source])) {
            return termObj[namespaces_1.NS.dcterms.source];
        }
        else if (!(0, isNil_1.isNil)(termObj[namespaces_1.NS.schema.source])) {
            return termObj[namespaces_1.NS.schema.source];
        }
        return null;
    }
    isSupersededBy(outputIRIType = "Compact") {
        const termObj = this.getTermObj();
        if ((0, isString_1.isString)(termObj[namespaces_1.NS.schema.supersededBy])) {
            return (0, outputTransformation_1.outputTransformation)(termObj[namespaces_1.NS.schema.supersededBy], this.graph, outputIRIType);
        }
        return null;
    }
    getName(language = "en") {
        const termObj = this.getTermObj()[namespaces_1.NS.rdfs.label];
        if ((0, isNil_1.isNil)(termObj) || (0, isNil_1.isNil)(termObj[language])) {
            return null;
        }
        return termObj[language];
    }
    getDescription(language = "en") {
        const termObj = this.getTermObj()[namespaces_1.NS.rdfs.comment];
        if ((0, isNil_1.isNil)(termObj) || (0, isNil_1.isNil)(termObj[language])) {
            return null;
        }
        return termObj[language];
    }
    toString() {
        return JSON.stringify(this.toJSON(), null, 2);
    }
    toJSON() {
        return {
            id: this.getIRI("Compact"),
            IRI: this.getIRI("Absolute"),
            typeLabel: this.getTermTypeLabel(),
            typeIRI: this.getTermTypeIRI(),
            vocabURLs: this.getVocabURLs(),
            vocabulary: this.getVocabulary(),
            source: this.getSource(),
            supersededBy: this.isSupersededBy("Compact"),
            name: this.getName(),
            description: this.getDescription()
        };
    }
}
exports.Term = Term;
//# sourceMappingURL=Term.js.map