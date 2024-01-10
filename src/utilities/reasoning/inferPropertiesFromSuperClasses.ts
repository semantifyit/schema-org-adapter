import { Graph } from "../../classes/Graph";
import { NS } from "../../data/namespaces";
import { uniquifyArray } from "../general/uniquifyArray";

/** @ignore
 * Infers all properties that can be used by the given classes and all their implicit and explicit superClasses
 *
 * @param superClasses - Array with IRIs of classes/enumerations
 * @param  graph - the graph
 * @returns {string[]} Array of IRIs of all properties from the given classes and their implicit and explicit superClasses
 */
export function inferPropertiesFromSuperClasses(
  superClasses: string[],
  graph: Graph
): string[] {
  const result = [];
  for (const superClass of superClasses) {
    const superClassObj =
      graph.classes[superClass] || graph.enumerations[superClass];
    if (superClassObj) {
      result.push(...superClassObj[NS.soa.hasProperty]);
      if (superClassObj[NS.rdfs.subClassOf].length !== 0) {
        result.push(
          ...inferPropertiesFromSuperClasses(
            superClassObj[NS.rdfs.subClassOf],
            graph
          )
        );
      }
    }
  }
  return uniquifyArray(result);
}
