"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inferSuperProperties = void 0;
const namespaces_1 = require("../../data/namespaces");
const cloneJson_1 = require("../general/cloneJson");
const uniquifyArray_1 = require("../general/uniquifyArray");
function inferSuperProperties(propertyIRI, graph) {
    let result = [];
    const propertyObj = graph.properties[propertyIRI];
    if (propertyObj) {
        result.push(...propertyObj[namespaces_1.NS.rdfs.subPropertyOf]);
        let addition = (0, cloneJson_1.cloneJson)(result);
        do {
            let newAddition = [];
            for (const curAdd of addition) {
                const parentPropertyObj = graph.properties[curAdd];
                if (parentPropertyObj) {
                    newAddition.push(...parentPropertyObj[namespaces_1.NS.rdfs.subPropertyOf]);
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
exports.inferSuperProperties = inferSuperProperties;
//# sourceMappingURL=inferSuperProperties.js.map