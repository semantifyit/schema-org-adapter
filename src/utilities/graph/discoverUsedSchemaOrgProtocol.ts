import { Vocabulary } from "../../types/types";
import { isObject } from "../general/isObject";
import { isString } from "../general/isString";

/** @ignore
 * Returns the protocol version used for schema.org in the given vocabulary. Returns "https" as the default
 *
 * @param vocabulary - the vocabulary in question
 * @returns the corresponding protocol version, either "http" or "https"
 */
export function discoverUsedSchemaOrgProtocol(
  vocabulary: Vocabulary | object
): string {
  const httpsIRI = "https://schema.org/";
  const httpIRI = "http://schema.org/";
  // 1. check if namespace is used in @context
  if ((vocabulary as Vocabulary)["@context"]) {
    for (const contextEntry of Object.values(
      (vocabulary as Vocabulary)["@context"]
    )) {
      if (isObject(contextEntry) && contextEntry["@vocab"]) {
        if (contextEntry["@vocab"] === httpsIRI) {
          return "https";
        } else if (contextEntry["@vocab"] === httpIRI) {
          return "http";
        }
      } else if (isString(contextEntry)) {
        if (contextEntry === httpsIRI) {
          return "https";
        } else if (contextEntry === httpIRI) {
          return "http";
        }
      }
    }
  }
  // 2. easiest way -> make a string and count occurrences for each protocol version
  const stringifiedVocab = JSON.stringify(vocabulary);
  const amountHttps = stringifiedVocab.split(httpsIRI).length - 1;
  const amountHttp = stringifiedVocab.split(httpIRI).length - 1;
  if (amountHttps > amountHttp) {
    return "https";
  } else if (amountHttp > amountHttps) {
    return "http";
  } else {
    return httpsIRI; // default case
  }
}
