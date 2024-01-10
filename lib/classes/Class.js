"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Class = void 0;
const Term_1 = require("./Term");
const namespaces_1 = require("../data/namespaces");
const inferPropertiesFromSuperClasses_1 = require("../utilities/reasoning/inferPropertiesFromSuperClasses");
const inferSuperClasses_1 = require("../utilities/reasoning/inferSuperClasses");
const inferSubClasses_1 = require("../utilities/reasoning/inferSubClasses");
const inferRangeOf_1 = require("../utilities/reasoning/inferRangeOf");
const filterAndTransformIRIList_1 = require("../utilities/general/filterAndTransformIRIList");
class Class extends Term_1.Term {
    constructor(IRI, graph) {
        super(IRI, graph);
        this.termTypeLabel = namespaces_1.TermTypeLabel.class;
        this.termTypeIRI = namespaces_1.TermTypeIRI.class;
    }
    getTermObj() {
        return this.graph.classes[this.IRI];
    }
    getProperties(paramObj) {
        const classObj = this.getTermObj();
        const result = [];
        result.push(...classObj[namespaces_1.NS.soa.hasProperty]);
        if (!((paramObj === null || paramObj === void 0 ? void 0 : paramObj.implicit) === false)) {
            result.push(...(0, inferPropertiesFromSuperClasses_1.inferPropertiesFromSuperClasses)(classObj[namespaces_1.NS.rdfs.subClassOf], this.graph));
        }
        return (0, filterAndTransformIRIList_1.filterAndTransformIRIList)(result, this.graph, paramObj);
    }
    getSuperClasses(paramObj) {
        const classObj = this.getTermObj();
        const result = [];
        if (!((paramObj === null || paramObj === void 0 ? void 0 : paramObj.implicit) === false)) {
            result.push(...(0, inferSuperClasses_1.inferSuperClasses)(this.IRI, this.graph));
        }
        else {
            result.push(...classObj[namespaces_1.NS.rdfs.subClassOf]);
        }
        return (0, filterAndTransformIRIList_1.filterAndTransformIRIList)(result, this.graph, paramObj);
    }
    getSubClasses(paramObj) {
        const classObj = this.getTermObj();
        const result = [];
        if (!((paramObj === null || paramObj === void 0 ? void 0 : paramObj.implicit) === false)) {
            result.push(...(0, inferSubClasses_1.inferSubClasses)(this.IRI, this.graph));
        }
        else {
            result.push(...classObj[namespaces_1.NS.soa.superClassOf]);
        }
        return (0, filterAndTransformIRIList_1.filterAndTransformIRIList)(result, this.graph, paramObj);
    }
    isRangeOf(paramObj) {
        const result = [];
        if (!((paramObj === null || paramObj === void 0 ? void 0 : paramObj.implicit) === false)) {
            result.push(...(0, inferRangeOf_1.inferRangeOf)(this.IRI, this.graph));
        }
        else {
            result.push(...this.getTermObj()[namespaces_1.NS.soa.isRangeOf]);
        }
        return (0, filterAndTransformIRIList_1.filterAndTransformIRIList)(result, this.graph, paramObj);
    }
    toString(paramObj) {
        return JSON.stringify(this.toJSON(paramObj), null, 2);
    }
    toJSON(paramObj) {
        const result = super.toJSON();
        result.superClasses = this.getSuperClasses(paramObj);
        result.subClasses = this.getSubClasses(paramObj);
        result.properties = this.getProperties(paramObj);
        result.rangeOf = this.isRangeOf(paramObj);
        return result;
    }
    isValidSubClassOf(superClassId, implicit = true) {
        const c = this.graph.getClass(superClassId);
        return this.getSuperClasses({ implicit, outputFormat: "Compact" }).includes(c.getIRI("Compact"));
    }
    isValidSuperClassOf(subClassId, implicit = true) {
        const c = this.graph.getClass(subClassId);
        return this.getSubClasses({ implicit, outputFormat: "Compact" }).includes(c.getIRI("Compact"));
    }
    isValidRangeOf(propertyId, implicit = true) {
        const p = this.graph.getProperty(propertyId);
        return this.isRangeOf({ implicit, outputFormat: "Compact" }).includes(p.getIRI("Compact"));
    }
    isValidDomainOf(propertyId, implicit = true) {
        const p = this.graph.getProperty(propertyId);
        return this.getProperties({ implicit, outputFormat: "Compact" }).includes(p.getIRI("Compact"));
    }
}
exports.Class = Class;
//# sourceMappingURL=Class.js.map