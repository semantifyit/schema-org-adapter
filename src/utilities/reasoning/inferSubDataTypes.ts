import { Graph } from "../../classes/Graph";
import { NS } from "../../data/namespaces";
import { cloneJson } from "../general/cloneJson";
import { uniquifyArray } from "../general/uniquifyArray";

/** @ignore
 * Infers all implicit and explicit subDataTypes of a given DataType
 *
 * @param dataTypeIRI - IRI of a DataType
 * @param graph - the graph
 * @returns Array of IRI of all implicit and explicit subDataTypes
 */
export function inferSubDataTypes(dataTypeIRI: string, graph: Graph): string[] {
  let result = [];
  const dataTypeObj = graph.dataTypes[dataTypeIRI];
  if (dataTypeObj) {
    result.push(...dataTypeObj[NS.soa.superClassOf]);
    let addition = cloneJson(result); // make a copy
    do {
      let newAddition = [];
      for (const curAdd of addition) {
        const childDataTypeObj = graph.dataTypes[curAdd];
        if (childDataTypeObj) {
          newAddition.push(...childDataTypeObj[NS.soa.superClassOf]);
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
