"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addInheritanceTermsDataTypesAndProperties = void 0;
function addInheritanceTermsDataTypesAndProperties(memory, subOfProperty, superOfProperty) {
    const dataTypeKeys = Object.keys(memory);
    for (const actDtKey of dataTypeKeys) {
        const superClasses = memory[actDtKey][subOfProperty];
        if (!memory[actDtKey][superOfProperty]) {
            memory[actDtKey][superOfProperty] = [];
        }
        if (!superClasses) {
            memory[actDtKey][subOfProperty] = [];
        }
        else {
            for (const actSuperClass of superClasses) {
                const superClass = memory[actSuperClass];
                if (superClass) {
                    if (superClass[superOfProperty]) {
                        if (!superClass[superOfProperty].includes(actDtKey)) {
                            superClass[superOfProperty].push(actDtKey);
                        }
                    }
                    else {
                        superClass[superOfProperty] = [actDtKey];
                    }
                }
            }
        }
    }
}
exports.addInheritanceTermsDataTypesAndProperties = addInheritanceTermsDataTypesAndProperties;
//# sourceMappingURL=addInheritanceTermsDataTypesAndProperties.js.map