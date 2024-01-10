import { VocabularyNode } from "../../types/types";
import { NS, TermTypeIRI } from "../../data/namespaces";
import { isString } from "../general/isString";
import { curateLanguageTerm } from "./curateLanguageTerm";
import { curateRelationshipTermArray } from "./curateRelationshipTermArray";

/** @ignore
 * Processes a given vocabulary node to a wished format (we call this process "curation")
 *
 * @param vocabNode - the input vocabulary node
 * @param vocabularies - the vocabularies used by the graph so far
 * @returns {object} the curated node
 */
export function curateVocabNode(
  vocabNode: VocabularyNode,
  vocabularies: Record<string, string>
): VocabularyNode {
  curateLanguageTerm(vocabNode, NS.rdfs.comment);
  curateLanguageTerm(vocabNode, NS.rdfs.label);
  // terms with an array as default
  curateRelationshipTermArray(vocabNode, NS.rdfs.subClassOf, TermTypeIRI.class);
  curateRelationshipTermArray(
    vocabNode,
    NS.rdfs.subPropertyOf,
    TermTypeIRI.property
  );
  curateRelationshipTermArray(
    vocabNode,
    NS.schema.domainIncludes,
    TermTypeIRI.property
  );
  curateRelationshipTermArray(
    vocabNode,
    NS.schema.rangeIncludes,
    TermTypeIRI.property
  );
  // terms with a string | null as default
  if (
    vocabNode[NS.schema.inverseOf] === undefined &&
    vocabNode["@type"] === TermTypeIRI.property
  ) {
    vocabNode[NS.schema.inverseOf] = null;
  }
  // if no schema:isPartOf property is stated yet (e.g. "https://pending.schema.org"), we detect the vocabulary used from the context, and put the corresponding (curated) IRI as value for this property (e.g. "https://schema.org")
  if (!isString(vocabNode[NS.schema.isPartOf])) {
    const vocabKeys = Object.keys(vocabularies);
    // e.g. schema
    let vocab = vocabKeys.find(
      (el) =>
        vocabNode["@id"].substring(0, vocabNode["@id"].indexOf(":")) === el
    );
    if (isString(vocab)) {
      // e.g. https://schema.org/
      vocab = vocabularies[vocab];
      let newChange;
      do {
        newChange = false;
        if (vocab.endsWith("/") || vocab.endsWith("#")) {
          vocab = vocab.substring(0, vocab.length - 1);
          newChange = true;
        }
      } while (newChange);
      // e.g. https://schema.org
      vocabNode[NS.schema.isPartOf] = vocab;
    }
  }
  return vocabNode;
}
