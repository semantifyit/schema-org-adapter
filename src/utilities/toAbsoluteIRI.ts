import { Context, ContextWord } from "../types/types";

/** @ignore
 * Returns the absolute IRI from a given compact IRI and a corresponding context. If the context does not contain the used namespace, then an error is thrown
 *
 * @param compactIRI - the compact IRI to transform
 * @param  context - the context object holding key-value pairs that represent indicator-namespace pairs
 * @returns {?string} the absolute IRI (null, if given context does not contain the used namespace)
 */
export function toAbsoluteIRI(compactIRI: string, context: Context): string {
  const terms = Object.keys(context);
  for (let i = 0; i < terms.length; i++) {
    const vocabIRI = context[terms[i]] as ContextWord;
    if (compactIRI.substring(0, compactIRI.indexOf(":")) === terms[i]) {
      return vocabIRI.concat(compactIRI.substring(compactIRI.indexOf(":") + 1));
    }
  }
  throw new Error(
    "Trying to get an absolute IRI for a term with no entry in the Context"
  );
}
