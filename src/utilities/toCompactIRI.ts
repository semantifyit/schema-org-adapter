import { Context } from "../types/types";
import { isString } from "./isString";
import { switchIRIProtocol } from "./switchIRIProtocol";

/** @ignore
 * Returns the compact IRI (e.g. schema:Hotel) from a given absolute IRI (https://schema.org/Hotel) and a corresponding context. If the context does not contain the used namespace, then an error is thrown
 *
 * @param absoluteIRI - the absolute IRI to transform
 * @param context - the context object holding key-value pairs that represent indicator-namespace pairs
 * @param [equateVocabularyProtocols = false] - treats namespaces as equal even if their protocols (http/https) are different, it defaults to false.
 * @returns the compact IRI (null, if given context does not contain the used namespace)
 */
export function toCompactIRI(
  absoluteIRI: string,
  context: Context,
  equateVocabularyProtocols = false
): string {
  for (const contextTerm of Object.keys(context)) {
    const vocabIRI = context[contextTerm];
    if (isString(vocabIRI) && absoluteIRI.startsWith(vocabIRI as string)) {
      return (
        contextTerm + ":" + absoluteIRI.substring((vocabIRI as string).length)
      );
    }
    if (equateVocabularyProtocols && isString(vocabIRI)) {
      const protocolSwitchedIRI = switchIRIProtocol(vocabIRI as string);
      if (absoluteIRI.startsWith(protocolSwitchedIRI)) {
        return (
          contextTerm + ":" + absoluteIRI.substring(protocolSwitchedIRI.length)
        );
      }
    }
  }
  throw new Error(
    "Trying to get a compact IRI for a term with no entry in the Context"
  );
}
