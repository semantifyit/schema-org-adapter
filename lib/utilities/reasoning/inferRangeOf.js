"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inferRangeOf = void 0;
const namespaces_1 = require("../../data/namespaces");
const uniquifyArray_1 = require("../general/uniquifyArray");
const inferSuperClasses_1 = require("./inferSuperClasses");
const inferSuperDataTypes_1 = require("./inferSuperDataTypes");
function inferRangeOf(rangeIRI, graph) {
    const classObj = graph.classes[rangeIRI] || graph.enumerations[rangeIRI];
    const result = [];
    if (classObj) {
        result.push(...classObj[namespaces_1.NS.soa.isRangeOf]);
        const superClasses = (0, inferSuperClasses_1.inferSuperClasses)(rangeIRI, graph);
        for (const superClass of superClasses) {
            const superClassObj = graph.classes[superClass] || graph.enumerations[superClass];
            if (superClassObj) {
                result.push(...superClassObj[namespaces_1.NS.soa.isRangeOf]);
            }
        }
    }
    else {
        const dataTypeObj = graph.dataTypes[rangeIRI];
        if (dataTypeObj) {
            result.push(...dataTypeObj[namespaces_1.NS.soa.isRangeOf]);
            const superDataTypes = (0, inferSuperDataTypes_1.inferSuperDataTypes)(rangeIRI, graph);
            for (const superDataType of superDataTypes) {
                const superDataTypeObj = graph.dataTypes[superDataType];
                if (superDataTypeObj) {
                    result.push(...superDataTypeObj[namespaces_1.NS.soa.isRangeOf]);
                }
            }
        }
    }
    return (0, uniquifyArray_1.uniquifyArray)(result);
}
exports.inferRangeOf = inferRangeOf;
//# sourceMappingURL=inferRangeOf.js.map