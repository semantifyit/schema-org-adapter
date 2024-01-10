import { TermMemory } from "../../types/types";

/** @ignore
 * Part D.1) of the addVocabulary-algorithm
 * Add link to subclass for classes and enumerations
 */
export function addInheritanceTermsClassAndEnum(
  memory: TermMemory,
  enumerationsMemory: TermMemory,
  subOfProperty: string,
  superOfProperty: string
) {
  const classesKeys = Object.keys(memory);
  for (const actClassKey of classesKeys) {
    const superClasses = memory[actClassKey][subOfProperty];
    // add empty superClassOf if not defined
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
        } else {
          superClass[superOfProperty] = [actClassKey];
        }
      }
    }
  }
}
