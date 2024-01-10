import { Graph } from "../../classes/Graph";
import { NS } from "../../data/namespaces";
import { cloneJson } from "../general/cloneJson";
import { uniquifyArray } from "../general/uniquifyArray";

/** @ignore
 * Infers all implicit and explicit superProperties of a given Property
 *
 * @param {string} propertyIRI - IRI of a Property
 * @param graph - the graph
 * @returns {string[]} Array of IRI of all implicit and explicit superProperties
 */
export function inferSuperProperties(
  propertyIRI: string,
  graph: Graph
): string[] {
  let result = [];
  const propertyObj = graph.properties[propertyIRI];
  if (propertyObj) {
    result.push(...propertyObj[NS.rdfs.subPropertyOf]);
    let addition = cloneJson(result); // make a copy
    do {
      let newAddition = [];
      for (const curAdd of addition) {
        const parentPropertyObj = graph.properties[curAdd];
        if (parentPropertyObj) {
          newAddition.push(...parentPropertyObj[NS.rdfs.subPropertyOf]);
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
