import { Graph } from "../../classes/Graph";
import { NS } from "../../data/namespaces";
import { uniquifyArray } from "../general/uniquifyArray";
import { inferSuperClasses } from "./inferSuperClasses";
import { inferSuperDataTypes } from "./inferSuperDataTypes";

/** @ignore
 * Infers all implicit and explicit properties that can have the given Class/Enumeration/DataType as range
 *
 * @param {string} rangeIRI - IRI of the range (Class/Enumeration/DataType)
 * @param graph - the graph
 * @returns {string[]} Array of IRI of all implicit and explicit properties that can use the given range
 */
export function inferRangeOf(rangeIRI: string, graph: Graph): string[] {
  const classObj = graph.classes[rangeIRI] || graph.enumerations[rangeIRI];
  const result = [];
  if (classObj) {
    result.push(...classObj[NS.soa.isRangeOf]);
    const superClasses = inferSuperClasses(rangeIRI, graph);
    for (const superClass of superClasses) {
      const superClassObj =
        graph.classes[superClass] || graph.enumerations[superClass];
      if (superClassObj) {
        result.push(...superClassObj[NS.soa.isRangeOf]);
      }
    }
  } else {
    const dataTypeObj = graph.dataTypes[rangeIRI];
    if (dataTypeObj) {
      result.push(...dataTypeObj[NS.soa.isRangeOf]);
      const superDataTypes = inferSuperDataTypes(rangeIRI, graph);
      for (const superDataType of superDataTypes) {
        const superDataTypeObj = graph.dataTypes[superDataType];
        if (superDataTypeObj) {
          result.push(...superDataTypeObj[NS.soa.isRangeOf]);
        }
      }
    }
  }
  return uniquifyArray(result);
}
