import { Context, Vocabulary } from "../../types/types";
import { cloneJson } from "../general/cloneJson";
import jsonld from "jsonld";

/** @ignore
 * Transforms a given vocabulary to a wished format (including a given JSON-LD context)
 *
 * @param vocab - the vocabulary to process
 * @param newContext - the wished JSON-LD context that the vocabulary should have
 * @returns the transformed vocabulary
 */
export async function preProcessVocab(
  vocab: Vocabulary,
  newContext: Context
): Promise<Vocabulary> {
  // recursively put all nodes from inner @graphs to the outermost @graph (is the case for older schema.jsonld versions)
  let foundInnerGraph = false;
  do {
    const newGraph = [];
    foundInnerGraph = false;
    for (let i = 0; i < vocab["@graph"].length; i++) {
      if (vocab["@graph"][i]["@graph"] !== undefined) {
        newGraph.push(...cloneJson(vocab["@graph"][i]["@graph"])); // copy all elements of the inner @graph into the outer @graph
        foundInnerGraph = true;
      } else {
        newGraph.push(cloneJson(vocab["@graph"][i])); // copy this element to the outer @graph
      }
    }
    vocab["@graph"] = cloneJson(newGraph);
  } while (foundInnerGraph);

  // compact to apply the new context (which is supposed to have been merged before with the old context through the function generateContext())
  // option "graph": true not feasible here, because then vocabs with "@id" result in inner @graphs again
  // solution: edge case handling (see below)
  const compactedVocab = await jsonld.compact(vocab, newContext);

  // edge case: @graph had only one node, so values of @graph are in outermost layer
  if (compactedVocab["@graph"] === undefined) {
    delete compactedVocab["@context"];
    return {
      "@context": newContext,
      "@graph": [compactedVocab],
    };
  } else {
    return compactedVocab as Vocabulary;
  }
}
