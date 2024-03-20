import { VocabularyNode } from "../../types/types";
import { isNil } from "../general/isNil";
import { isArray } from "../general/isArray";

/**
 * @ignore
 */
export function nodeMergeAddIds(
  oldNode: VocabularyNode,
  newNode: VocabularyNode,
  property: string
) {
  if (!isNil(newNode[property])) {
    let newValues = newNode[property]
    if(!isArray(newValues)){
      // make sure the new values are used as array in the following algorithm
      newValues = [newValues]
    }
    for (const arrayElement of newValues) {
      // make sure the old value is changed to an array if needed
      if(!isArray(oldNode[property])){
        if(oldNode[property] !== arrayElement){
          oldNode[property] = [oldNode[property], arrayElement]
        }
      } else if (!oldNode[property].includes(arrayElement)) {
        // add new entry
        oldNode[property].push(arrayElement);
      }
    }
  }
}
