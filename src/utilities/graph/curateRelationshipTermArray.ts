import { VocabularyNode } from "../../types/types";
import { TermTypeIRIValue } from "../../data/namespaces";
import { isString } from "../general/isString";
import { isArray } from "../general/isArray";

/** @ignore
 * curates the value for a given relationship term in a given vocabulary node that should have an array as value
 *
 * @param vocabNode - the input vocabulary node
 * @param term - the term in question
 * @param initDefaultIf - the node type IRI that triggers a default initialization, e.g. rdfs:Class
 */
export function curateRelationshipTermArray(
  vocabNode: VocabularyNode,
  term: string,
  initDefaultIf: TermTypeIRIValue
): void {
  // the relationships should always be an array, even for 1 and 0 (if the @type of the vocabulary node matches) values
  if (isString(vocabNode[term])) {
    vocabNode[term] = [vocabNode[term]];
  } else if (
    vocabNode[term] === undefined &&
    vocabNode["@type"] === initDefaultIf
  ) {
    // initialize an empty array
    vocabNode[term] = [];
  }
  // remove terms that are defined as subclasses of themselves (see vocabulary-animal-altered-2.json for details)
  if (isArray(vocabNode[term])) {
    vocabNode[term] = vocabNode[term].filter((iri: string) => iri !== vocabNode["@id"]);
  }
}
