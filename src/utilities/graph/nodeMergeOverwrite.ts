import { VocabularyNode } from "../../types/types";
import { isNil } from "../general/isNil";

/**
 * @ignore
 */
export function nodeMergeOverwrite(
  oldNode: VocabularyNode,
  newNode: VocabularyNode,
  property: string
) {
  if (!isNil(newNode[property])) {
    oldNode[property] = newNode[property];
  }
}
