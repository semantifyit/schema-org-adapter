"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inferSuperDataTypes = void 0;
const namespaces_1 = require("../../data/namespaces");
const cloneJson_1 = require("../general/cloneJson");
const uniquifyArray_1 = require("../general/uniquifyArray");
function inferSuperDataTypes(dataTypeIRI, graph) {
    let result = [];
    const dataTypeObj = graph.dataTypes[dataTypeIRI];
    if (dataTypeObj) {
        result.push(...dataTypeObj[namespaces_1.NS.rdfs.subClassOf]);
        let addition = (0, cloneJson_1.cloneJson)(result);
        do {
            let newAddition = [];
            for (const curAdd of addition) {
                const parentDataTypeObj = graph.dataTypes[curAdd];
                if (parentDataTypeObj) {
                    newAddition.push(...parentDataTypeObj[namespaces_1.NS.rdfs.subClassOf]);
                }
            }
            newAddition = (0, uniquifyArray_1.uniquifyArray)(newAddition);
            addition = (0, cloneJson_1.cloneJson)(newAddition);
            result.push(...newAddition);
        } while (addition.length !== 0);
        result = (0, uniquifyArray_1.uniquifyArray)(result);
    }
    return result;
}
exports.inferSuperDataTypes = inferSuperDataTypes;
//# sourceMappingURL=inferSuperDataTypes.js.map