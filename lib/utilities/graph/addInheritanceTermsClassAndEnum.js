"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addInheritanceTermsClassAndEnum = void 0;
function addInheritanceTermsClassAndEnum(memory, enumerationsMemory, subOfProperty, superOfProperty) {
    const classesKeys = Object.keys(memory);
    for (const actClassKey of classesKeys) {
        const superClasses = memory[actClassKey][subOfProperty];
        if (!memory[actClassKey][superOfProperty]) {
            memory[actClassKey][superOfProperty] = [];
        }
        for (const actSuperClass of superClasses) {
            let superClass = memory[actSuperClass];
            if (!superClass) {
                superClass = enumerationsMemory[actSuperClass];
            }
            if (superClass) {
                if (superClass[superOfProperty]) {
                    if (!superClass[superOfProperty].includes(actClassKey)) {
                        superClass[superOfProperty].push(actClassKey);
                    }
                }
                else {
                    superClass[superOfProperty] = [actClassKey];
                }
            }
        }
    }
}
exports.addInheritanceTermsClassAndEnum = addInheritanceTermsClassAndEnum;
//# sourceMappingURL=addInheritanceTermsClassAndEnum.js.map