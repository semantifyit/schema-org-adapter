import { Graph } from "../../classes/Graph";
import { NS } from "../../data/namespaces";
import { cloneJson } from "../general/cloneJson";
import { uniquifyArray } from "../general/uniquifyArray";

/** @ignore
 * Infers all implicit and explicit subClasses of a given Class/Enumeration
 *
 * @param classIRI - IRI of a Class/Enumeration
 * @param graph - the graph
 * @returns Array of IRI of all implicit and explicit subClasses
 */
export function inferSubClasses(classIRI: string, graph: Graph): string[] {
  let result = [];
  const classObj = graph.classes[classIRI] || graph.enumerations[classIRI];
  if (classObj) {
    result.push(...classObj[NS.soa.superClassOf]);
    let addition = cloneJson(result); // make a copy
    do {
      let newAddition = [];
      for (const curAdd of addition) {
        const parentClassObj =
          graph.classes[curAdd] || graph.enumerations[curAdd];
        if (parentClassObj) {
          newAddition.push(...parentClassObj[NS.soa.superClassOf]);
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
