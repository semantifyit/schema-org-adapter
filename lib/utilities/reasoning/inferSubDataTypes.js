"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inferSubDataTypes = void 0;
const namespaces_1 = require("../../data/namespaces");
const cloneJson_1 = require("../general/cloneJson");
const uniquifyArray_1 = require("../general/uniquifyArray");
function inferSubDataTypes(dataTypeIRI, graph) {
    let result = [];
    const dataTypeObj = graph.dataTypes[dataTypeIRI];
    if (dataTypeObj) {
        result.push(...dataTypeObj[namespaces_1.NS.soa.superClassOf]);
        let addition = (0, cloneJson_1.cloneJson)(result);
        do {
            let newAddition = [];
            for (const curAdd of addition) {
                const childDataTypeObj = graph.dataTypes[curAdd];
                if (childDataTypeObj) {
                    newAddition.push(...childDataTypeObj[namespaces_1.NS.soa.superClassOf]);
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
exports.inferSubDataTypes = inferSubDataTypes;
//# sourceMappingURL=inferSubDataTypes.js.map