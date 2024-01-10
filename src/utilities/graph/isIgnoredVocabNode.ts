import { VocabularyNode } from "../../types/types";
import { isString } from "../general/isString";

/** @ignore
 * ignore nodes that make no sense and "prominent" cases that are not really part of the schema vocabulary
 *
 * @param vocabNode
 */
export function isIgnoredVocabNode(vocabNode: VocabularyNode): boolean {
  const id = vocabNode["@id"];
  return !isString(id) ||
    id.startsWith("file://") ||
    id.includes("://www.w3.org/wiki/WebSchemas/SchemaDotOrgSources") ||
    id.includes("://meta.schema.org/") ||
    id.includes("://publications.europa.eu") ||
    id.includes("://www.w3.org/ns/regorg#RegisteredOrganization")
}
