import { Graph } from "../../classes/Graph";
import { NS } from "../../data/namespaces";
import { cloneJson } from "../general/cloneJson";
import { uniquifyArray } from "../general/uniquifyArray";

/** @ignore
 * Infers all implicit and explicit subProperties of a given Property
 *
 * @param {string} propertyIRI - IRI of a Property
 * @param graph - the graph
 * @returns {string[]} Array of IRI of all implicit and explicit subProperties
 */
export function inferSubProperties(
  propertyIRI: string,
  graph: Graph
): string[] {
  let result = [];
  const propertyObj = graph.properties[propertyIRI];
  if (propertyObj) {
    result.push(...propertyObj[NS.soa.superPropertyOf]);
    let addition = cloneJson(result); // make a copy
    do {
      let newAddition = [];
      for (const curAdd of addition) {
        const parentPropertyObj = graph.properties[curAdd];
        if (parentPropertyObj) {
          newAddition.push(...parentPropertyObj[NS.soa.superPropertyOf]);
        }
      }
      newAddition = uniquifyArray(newAddition);
      addition = cloneJson(newAddition);
      result.push(...newAddition);
    } while (addition.length !== 0);
    result = uniquifyArray(result);
  }
  return result;
}
