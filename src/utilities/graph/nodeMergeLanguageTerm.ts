import { VocabularyNode } from "../../types/types";
import { isNil } from "../general/isNil";

/**
 * @ignore
 */
export function nodeMergeLanguageTerm(
  oldNode: VocabularyNode,
  newNode: VocabularyNode,
  property: string
) {
  if (!isNil(newNode[property])) {
    const langKeys = Object.keys(newNode[property]);
    // overwrite old one, if there was one
    for (const actLangKey of langKeys) {
      oldNode[property][actLangKey] = newNode[property][actLangKey];
    }
  }
}
