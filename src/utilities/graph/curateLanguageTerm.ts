import { LanguageObjectSdoAdapter, VocabularyNode } from "../../types/types";
import { isString } from "../general/isString";
import { isLanguageObjectVocab } from "../general/isLanguageObjectVocab";
import { isArray } from "../general/isArray";

/**
 * @ignore
 * curates the language-tagged value for a given term in a given vocabulary node
 *
 * @param vocabNode - the input vocabulary node
 * @param term - the term in question
 */
export function curateLanguageTerm(
  vocabNode: VocabularyNode,
  term: string
): void {
  // wished format:
  // "term": {
  //    "en": "english text",
  //    "de": "german text"
  // }
  if (vocabNode[term] !== undefined) {
    if (isString(vocabNode[term])) {
      // cover case for a simple string, e.g. "term": "text"
      // for the output simply assume the language is "en"
      vocabNode[term] = {
        en: vocabNode[term],
      };
    } else if (isLanguageObjectVocab(vocabNode[term])) {
      // cover case for a language object
      // "term": {
      //   "@language": "en",
      //   "@value": "english text"
      // }
      vocabNode[term] = {
        [vocabNode[term]["@language"]]: vocabNode[term]["@value"],
      };
    } else if (isArray(vocabNode[term])) {
      // cover case for multiple language objects in an array
      // "term": [{
      //   "@language": "en",
      //   "@value": "translationOfWork"
      // },
      // {
      //   "@language": "de",
      //   "@value": "UebersetzungsArbeit"
      // }]
      const newVal: LanguageObjectSdoAdapter = {};
      vocabNode[term].map((el: unknown) => {
        // it is assumed that an array element in this position is a language object
        if (isLanguageObjectVocab(el)) {
          newVal[el["@language"]] = el["@value"];
        }
      });
      vocabNode[term] = newVal;
    }
  } else {
    // if the term is not given, then create an empty LanguageObjectSdoAdapter
    vocabNode[term] = {};
  }
}
