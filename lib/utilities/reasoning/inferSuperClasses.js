"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inferSuperClasses = void 0;
const namespaces_1 = require("../../data/namespaces");
const cloneJson_1 = require("../general/cloneJson");
const uniquifyArray_1 = require("../general/uniquifyArray");
function inferSuperClasses(classIRI, graph) {
    let result = [];
    const classObj = graph.classes[classIRI] || graph.enumerations[classIRI];
    if (classObj) {
        result.push(...classObj[namespaces_1.NS.rdfs.subClassOf]);
        let addition = (0, cloneJson_1.cloneJson)(result);
        do {
            let newAddition = [];
            for (const curAdd of addition) {
                const parentClassObj = graph.classes[curAdd] || graph.enumerations[curAdd];
                if (parentClassObj) {
                    newAddition.push(...parentClassObj[namespaces_1.NS.rdfs.subClassOf]);
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
exports.inferSuperClasses = inferSuperClasses;
//# sourceMappingURL=inferSuperClasses.js.map