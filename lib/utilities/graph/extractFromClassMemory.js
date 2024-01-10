"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractFromClassMemory = void 0;
const namespaces_1 = require("../../data/namespaces");
const cloneJson_1 = require("../general/cloneJson");
function extractFromClassMemory(classMemory, otherMemory, addGraphNodeFn, vocabURL) {
    let termSwitched;
    do {
        termSwitched = false;
        const classesKeys = Object.keys(classMemory);
        const otherKeys = Object.keys(otherMemory);
        for (const actClassKey of classesKeys) {
            if (otherKeys.includes(actClassKey)) {
                termSwitched = true;
                addGraphNodeFn(otherMemory, classMemory[actClassKey], vocabURL);
                delete classMemory[actClassKey];
            }
            else if (classMemory[actClassKey][namespaces_1.NS.rdfs.subClassOf] !== undefined) {
                const subClassArray = classMemory[actClassKey][namespaces_1.NS.rdfs.subClassOf];
                for (const actSubClass of subClassArray) {
                    if (actSubClass === namespaces_1.TermTypeIRI.enumeration ||
                        otherKeys.includes(actSubClass)) {
                        if (classMemory[actClassKey] && !otherMemory[actClassKey]) {
                            termSwitched = true;
                            otherMemory[actClassKey] = (0, cloneJson_1.cloneJson)(classMemory[actClassKey]);
                            delete classMemory[actClassKey];
                        }
                        else if (classMemory[actClassKey] && otherMemory[actClassKey]) {
                            termSwitched = true;
                            addGraphNodeFn(otherMemory, classMemory[actClassKey], vocabURL);
                            delete classMemory[actClassKey];
                        }
                    }
                }
            }
        }
    } while (termSwitched);
}
exports.extractFromClassMemory = extractFromClassMemory;
//# sourceMappingURL=extractFromClassMemory.js.map