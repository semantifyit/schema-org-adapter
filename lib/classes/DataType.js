"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataType = void 0;
const Term_1 = require("./Term");
const namespaces_1 = require("../data/namespaces");
const inferSuperDataTypes_1 = require("../utilities/reasoning/inferSuperDataTypes");
const inferRangeOf_1 = require("../utilities/reasoning/inferRangeOf");
const inferSubDataTypes_1 = require("../utilities/reasoning/inferSubDataTypes");
const filterAndTransformIRIList_1 = require("../utilities/general/filterAndTransformIRIList");
class DataType extends Term_1.Term {
    constructor(IRI, graph) {
        super(IRI, graph);
        this.termTypeLabel = namespaces_1.TermTypeLabel.dataType;
        this.termTypeIRI = namespaces_1.TermTypeIRI.dataType;
    }
    getTermObj() {
        return this.graph.dataTypes[this.IRI];
    }
    getSuperDataTypes(paramObj) {
        const dataTypeObj = this.getTermObj();
        const result = [];
        if (!((paramObj === null || paramObj === void 0 ? void 0 : paramObj.implicit) === false)) {
            result.push(...(0, inferSuperDataTypes_1.inferSuperDataTypes)(this.IRI, this.graph));
        }
        else {
            result.push(...dataTypeObj[namespaces_1.NS.rdfs.subClassOf]);
        }
        return (0, filterAndTransformIRIList_1.filterAndTransformIRIList)(result, this.graph, paramObj);
    }
    getSubDataTypes(paramObj) {
        const dataTypeObj = this.getTermObj();
        const result = [];
        if (!((paramObj === null || paramObj === void 0 ? void 0 : paramObj.implicit) === false)) {
            result.push(...(0, inferSubDataTypes_1.inferSubDataTypes)(this.IRI, this.graph));
        }
        else {
            result.push(...dataTypeObj[namespaces_1.NS.soa.superClassOf]);
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
    toJSON(paramObj) {
        const result = super.toJSON();
        result.superDataTypes = this.getSuperDataTypes(paramObj);
        result.subDataTypes = this.getSubDataTypes(paramObj);
        result.rangeOf = this.isRangeOf(paramObj);
        return result;
    }
    toString(paramObj) {
        return JSON.stringify(this.toJSON(paramObj), null, 2);
    }
    isValidSuperDataTypeOf(subDataTypeId, implicit = true) {
        const dt = this.graph.getDataType(subDataTypeId);
        return this.getSubDataTypes({ implicit, outputFormat: "Compact" }).includes(dt.getIRI("Compact"));
    }
    isValidSubDataTypeOf(superDataTypeId, implicit = true) {
        const dt = this.graph.getDataType(superDataTypeId);
        return this.getSuperDataTypes({ implicit, outputFormat: "Compact" }).includes(dt.getIRI("Compact"));
    }
    isValidRangeOf(propertyId, implicit = true) {
        const p = this.graph.getProperty(propertyId);
        return this.isRangeOf({ implicit, outputFormat: "Compact" }).includes(p.getIRI("Compact"));
    }
}
exports.DataType = DataType;
//# sourceMappingURL=DataType.js.map