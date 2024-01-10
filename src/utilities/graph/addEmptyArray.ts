import { VocabularyNode } from "../../types/types";

/**
 * @ignore
 * Adds an empty array for the given attribute, if it doesn't exist yet
 */
export function addEmptyArray(termObject: VocabularyNode, property: string) {
  if (!termObject[property]) {
    termObject[property] = [];
  }
}
