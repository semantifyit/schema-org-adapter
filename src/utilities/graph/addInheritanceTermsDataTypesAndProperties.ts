import { TermMemory } from "../../types/types";

/** @ignore
 * Part D.2) and D.3) of the addVocabulary-algorithm
 * Add link to subclass for classes and enumerations
 */
export function addInheritanceTermsDataTypesAndProperties(
  memory: TermMemory,
  subOfProperty: string,
  superOfProperty: string
) {
  const dataTypeKeys = Object.keys(memory);
  for (const actDtKey of dataTypeKeys) {
    const superClasses = memory[actDtKey][subOfProperty];
    // add empty superClassOf if not defined
    if (!memory[actDtKey][superOfProperty]) {
      memory[actDtKey][superOfProperty] = [];
    }
    // add empty subClassOf if not defined
    if (!superClasses) {
      memory[actDtKey][subOfProperty] = [];
    } else {
      for (const actSuperClass of superClasses) {
        const superClass = memory[actSuperClass];
        if (superClass) {
          if (superClass[superOfProperty]) {
            if (!superClass[superOfProperty].includes(actDtKey)) {
              superClass[superOfProperty].push(actDtKey);
            }
          } else {
            superClass[superOfProperty] = [actDtKey];
          }
        }
      }
    }
  }
}
