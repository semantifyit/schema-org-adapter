import { VocabularyNode } from "../../types/types";
import { isNil } from "../general/isNil";

/**
 * @ignore
 */
export function nodeMergeAddIds(
  oldNode: VocabularyNode,
  newNode: VocabularyNode,
  property: string
) {
  if (!isNil(newNode[property])) {
    for (const arrayElement of newNode[property]) {
      if (!oldNode[property].includes(arrayElement)) {
        // add new entry
        oldNode[property].push(arrayElement);
      }
    }
  }
}
