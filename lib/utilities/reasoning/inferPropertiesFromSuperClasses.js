"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inferPropertiesFromSuperClasses = void 0;
const namespaces_1 = require("../../data/namespaces");
const uniquifyArray_1 = require("../general/uniquifyArray");
function inferPropertiesFromSuperClasses(superClasses, graph) {
    const result = [];
    for (const superClass of superClasses) {
        const superClassObj = graph.classes[superClass] || graph.enumerations[superClass];
        if (superClassObj) {
            result.push(...superClassObj[namespaces_1.NS.soa.hasProperty]);
            if (superClassObj[namespaces_1.NS.rdfs.subClassOf].length !== 0) {
                result.push(...inferPropertiesFromSuperClasses(superClassObj[namespaces_1.NS.rdfs.subClassOf], graph));
            }
        }
    }
    return (0, uniquifyArray_1.uniquifyArray)(result);
}
exports.inferPropertiesFromSuperClasses = inferPropertiesFromSuperClasses;
//# sourceMappingURL=inferPropertiesFromSuperClasses.js.map