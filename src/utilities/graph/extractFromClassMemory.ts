import { TermMemory, VocabularyNode } from "../../types/types";
import { NS, TermTypeIRI } from "../../data/namespaces";
import { cloneJson } from "../general/cloneJson";

/** @ignore
 * Part C) of the addVocabulary-algorithm
 * This function is used to extract enumerations and data-types form the class memory and move them to the corresponding memories
 * */
export function extractFromClassMemory(
  classMemory: TermMemory,
  otherMemory: TermMemory,
  addGraphNodeFn: (
    // eslint-disable-next-line no-unused-vars
    memory: Record<string, VocabularyNode>,
    // eslint-disable-next-line no-unused-vars
    newNode: VocabularyNode,
    // eslint-disable-next-line no-unused-vars
    vocabURL?: string
  ) => boolean,
  vocabURL?: string
) {
  let termSwitched;
  do {
    termSwitched = false;
    const classesKeys = Object.keys(classMemory);
    const otherKeys = Object.keys(otherMemory);
    for (const actClassKey of classesKeys) {
      if (otherKeys.includes(actClassKey)) {
        // if an entity of the class memory is already in the other memory, then merge them in the other memory (use-case: a new vocabulary adds data to an already existing non-class)
        termSwitched = true;
        // merge
        addGraphNodeFn(otherMemory, classMemory[actClassKey], vocabURL);
        delete classMemory[actClassKey];
      } else if (classMemory[actClassKey][NS.rdfs.subClassOf] !== undefined) {
        const subClassArray = classMemory[actClassKey][NS.rdfs.subClassOf];
        for (const actSubClass of subClassArray) {
          if (
            actSubClass === TermTypeIRI.enumeration ||
            otherKeys.includes(actSubClass)
          ) {
            if (classMemory[actClassKey] && !otherMemory[actClassKey]) {
              termSwitched = true;
              otherMemory[actClassKey] = cloneJson(classMemory[actClassKey]);
              delete classMemory[actClassKey];
            } else if (classMemory[actClassKey] && otherMemory[actClassKey]) {
              termSwitched = true;
              // merge
              addGraphNodeFn(otherMemory, classMemory[actClassKey], vocabURL);
              delete classMemory[actClassKey];
            }
          }
        }
      }
    }
  } while (termSwitched);
}
