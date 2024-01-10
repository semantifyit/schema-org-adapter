"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyFilter = void 0;
const uniquifyArray_1 = require("../general/uniquifyArray");
const toArray_1 = require("../general/toArray");
const namespaces_1 = require("../../data/namespaces");
function applyFilter(paramObj) {
    const { data, filter, graph } = paramObj;
    if (!Array.isArray(data) ||
        data.length === 0 ||
        !filter ||
        Object.keys(filter).length === 0) {
        return data;
    }
    const unifiedDataArray = (0, uniquifyArray_1.uniquifyArray)(data);
    const result = [];
    const context = graph.context;
    let namespaces;
    if (filter.fromVocabulary) {
        namespaces = (0, toArray_1.toArray)(filter.fromVocabulary);
        for (let v = 0; v < namespaces.length; v++) {
            for (let vi = 0; vi < Object.keys(context).length; vi++) {
                if (context[Object.keys(context)[vi]] === namespaces[v]) {
                    namespaces[v] = Object.keys(context)[vi];
                    break;
                }
            }
        }
    }
    for (let i = 0; i < unifiedDataArray.length; i++) {
        const actualTerm = graph.getTerm(unifiedDataArray[i]);
        if (!actualTerm) {
            continue;
        }
        if (filter.isSuperseded !== undefined) {
            if (!filter.isSuperseded && actualTerm.isSupersededBy() != null) {
                continue;
            }
            else if (filter.isSuperseded && actualTerm.isSupersededBy() == null) {
                continue;
            }
        }
        if (namespaces) {
            let matchFound = false;
            for (let v = 0; v < namespaces.length; v++) {
                if (actualTerm.getIRI("Compact").startsWith(namespaces[v])) {
                    matchFound = true;
                    break;
                }
            }
            if (!matchFound) {
                continue;
            }
        }
        if (filter.termType) {
            const toCheck = (0, toArray_1.toArray)(filter.termType);
            const invalidTermType = toCheck.find((el) => !Object.values(namespaces_1.TermTypeLabel).includes(el));
            if (invalidTermType) {
                throw new Error("Invalid filter.termType " + invalidTermType);
            }
            const foundMatch = toCheck.find((el) => el === actualTerm.getTermTypeLabel());
            if (!foundMatch) {
                continue;
            }
        }
        result.push(unifiedDataArray[i]);
    }
    return result;
}
exports.applyFilter = applyFilter;
//# sourceMappingURL=applyFilter.js.map