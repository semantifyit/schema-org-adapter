import { Context } from "../../types/types";
import { cloneJson } from "../general/cloneJson";
import { isString } from "../general/isString";
import { isObject } from "../general/isObject";

/** @ignore
 * Merges 2 JSON-LD context objects into a new one
 *
 * @param currentContext - the first context object
 * @param newContext - the second context object
 * @returns the resulting context object
 */
export function generateContext(
  currentContext: Context,
  newContext: Context
): Context {
  const keysCurrentContext = Object.keys(currentContext);
  const keysNewContext = Object.keys(newContext);
  // add all the definitions of the old context
  let resultContext = cloneJson(currentContext);
  // add vocabs of new context that are not already used (value is IRI)
  for (const keyNC of keysNewContext) {
    if (isString(newContext[keyNC])) {
      // first: check if the IRI is already used, with any indicator
      let foundMatch = false;
      for (const keyCC of keysCurrentContext) {
        if (isString(resultContext[keyCC])) {
          if (resultContext[keyCC] === newContext[keyNC]) {
            // found match, the IRI is already covered
            foundMatch = true;
            break;
          }
        }
      }
      if (foundMatch) {
        continue; // IRI is already covered, continue with next
      }
      if (!resultContext[keyNC]) {
        // add new vocab indicator
        resultContext[keyNC] = newContext[keyNC];
      } else {
        // check if the IRI is the same, if not: add new uri under new vocab indicator
        if (resultContext[keyNC] !== newContext[keyNC]) {
          let foundFreeName = false;
          let counter = 1;
          while (!foundFreeName) {
            const newVocabIndicator = keyNC + counter++;
            if (!resultContext[newVocabIndicator]) {
              foundFreeName = true;
              resultContext[newVocabIndicator] = newContext[keyNC];
            }
          }
        }
      }
    }
  }
  // sort vocab IRIs by alphabet
  const ordered: Context = {};
  Object.keys(resultContext)
    .sort()
    .forEach(function (key) {
      ordered[key] = resultContext[key];
    });
  // reorder context: Vocab Indicators first (value = string), then term handlers (value = object)
  resultContext = ordered;
  const keysResultContext = Object.keys(resultContext);
  const orderedResultContext: Context = {};
  // add the Vocab Indicators (value = string)
  for (const keyRC of keysResultContext) {
    if (isString(resultContext[keyRC])) {
      orderedResultContext[keyRC] = resultContext[keyRC];
    }
  }
  // add the term handlers (value = object)
  for (const keyRC of keysResultContext) {
    if (isObject(resultContext[keyRC])) {
      orderedResultContext[keyRC] = resultContext[keyRC];
    }
  }
  return orderedResultContext;
}
