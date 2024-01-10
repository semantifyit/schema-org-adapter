"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Property = void 0;
const Term_1 = require("./Term");
const namespaces_1 = require("../data/namespaces");
const inferSubDataTypes_1 = require("../utilities/reasoning/inferSubDataTypes");
const inferSubClasses_1 = require("../utilities/reasoning/inferSubClasses");
const inferSuperProperties_1 = require("../utilities/reasoning/inferSuperProperties");
const inferSubProperties_1 = require("../utilities/reasoning/inferSubProperties");
const filterAndTransformIRIList_1 = require("../utilities/general/filterAndTransformIRIList");
const outputTransformation_1 = require("../utilities/general/outputTransformation");
const isString_1 = require("../utilities/general/isString");
class Property extends Term_1.Term {
    constructor(IRI, graph) {
        super(IRI, graph);
        this.termTypeLabel = namespaces_1.TermTypeLabel.property;
        this.termTypeIRI = namespaces_1.TermTypeIRI.property;
    }
    getTermObj() {
        return this.graph.properties[this.IRI];
    }
    getRanges(paramObj) {
        const propertyObj = this.getTermObj();
        const result = [];
        result.push(...propertyObj[namespaces_1.NS.schema.rangeIncludes]);
        if (!((paramObj === null || paramObj === void 0 ? void 0 : paramObj.implicit) === false)) {
            for (const actRes of result) {
                result.push(...(0, inferSubDataTypes_1.inferSubDataTypes)(actRes, this.graph));
            }
            for (const actRes of result) {
                result.push(...(0, inferSubClasses_1.inferSubClasses)(actRes, this.graph));
            }
        }
        return (0, filterAndTransformIRIList_1.filterAndTransformIRIList)(result, this.graph, paramObj);
    }
    getDomains(paramObj) {
        const propertyObj = this.getTermObj();
        const result = [];
        result.push(...propertyObj[namespaces_1.NS.schema.domainIncludes]);
        if (!((paramObj === null || paramObj === void 0 ? void 0 : paramObj.implicit) === false)) {
            const inferredSubClasses = [];
            for (const actRes of result) {
                inferredSubClasses.push(...(0, inferSubClasses_1.inferSubClasses)(actRes, this.graph));
            }
            result.push(...inferredSubClasses);
        }
        return (0, filterAndTransformIRIList_1.filterAndTransformIRIList)(result, this.graph, paramObj);
    }
    getSuperProperties(paramObj) {
        const propertyObj = this.getTermObj();
        const result = [];
        if (!((paramObj === null || paramObj === void 0 ? void 0 : paramObj.implicit) === false)) {
            result.push(...(0, inferSuperProperties_1.inferSuperProperties)(this.IRI, this.graph));
        }
        else {
            result.push(...propertyObj[namespaces_1.NS.rdfs.subPropertyOf]);
        }
        return (0, filterAndTransformIRIList_1.filterAndTransformIRIList)(result, this.graph, paramObj);
    }
    getSubProperties(paramObj) {
        const propertyObj = this.getTermObj();
        const result = [];
        if (!((paramObj === null || paramObj === void 0 ? void 0 : paramObj.implicit) === false)) {
            result.push(...(0, inferSubProperties_1.inferSubProperties)(this.IRI, this.graph));
        }
        else {
            result.push(...propertyObj[namespaces_1.NS.soa.superPropertyOf]);
        }
        return (0, filterAndTransformIRIList_1.filterAndTransformIRIList)(result, this.graph, paramObj);
    }
    getInverseOf(outputIRIType = "Compact") {
        const propertyObj = this.getTermObj();
        if ((0, isString_1.isString)(propertyObj[namespaces_1.NS.schema.inverseOf])) {
            return (0, outputTransformation_1.outputTransformation)(propertyObj[namespaces_1.NS.schema.inverseOf], this.graph, outputIRIType);
        }
        return null;
    }
    toString(paramObj) {
        return JSON.stringify(this.toJSON(paramObj), null, 2);
    }
    toJSON(paramObj) {
        const result = super.toJSON();
        result["ranges"] = this.getRanges(paramObj);
        result["domains"] = this.getDomains(paramObj);
        result["superProperties"] = this.getSuperProperties(paramObj);
        result["subProperties"] = this.getSubProperties(paramObj);
        result["inverseOf"] = this.getInverseOf(paramObj === null || paramObj === void 0 ? void 0 : paramObj.outputFormat);
        return result;
    }
    isValidDomain(domainId, implicit = true) {
        const domain = this.graph.getClass(domainId);
        return this.getDomains({ implicit, outputFormat: "Compact" }).includes(domain.getIRI("Compact"));
    }
    isValidRange(rangeId, implicit = true) {
        const range = this.graph.getTerm(rangeId);
        return this.getRanges({ implicit, outputFormat: "Compact" }).includes(range.getIRI("Compact"));
    }
    isValidSuperPropertyOf(subPropertyId, implicit = true) {
        const p = this.graph.getProperty(subPropertyId);
        return this.getSubProperties({ implicit, outputFormat: "Compact" }).includes(p.getIRI("Compact"));
    }
    isValidSubPropertyOf(superPropertyId, implicit = true) {
        const p = this.graph.getProperty(superPropertyId);
        return this.getSuperProperties({ implicit, outputFormat: "Compact" }).includes(p.getIRI("Compact"));
    }
    isValidInverseOf(inversePropertyId) {
        const p = this.graph.getProperty(inversePropertyId);
        return this.getInverseOf("Compact") === p.getIRI("Compact");
    }
}
exports.Property = Property;
//# sourceMappingURL=Property.js.map