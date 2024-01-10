import { outputTransformation } from "./outputTransformation";
import { applyFilter } from "../reasoning/applyFilter";
import { ParamObjIRIList } from "../../types/ParamObjIRIList.type";
import { Graph } from "../../classes/Graph";

/** @ignore
 * shortcut function to apply a filter and a transformation function on a given compactIRIList (array of compact IRIs)
 * @param compactIRIList - Array of compact IRIs to filter and transform
 * @param graph - a reference to the Graph instance
 * @param paramObj - optional parameter object with parameters to filter and transform
 * @returns Array of filtered and transformed compact IRIs
 */
export function filterAndTransformIRIList(compactIRIList: string[], graph: Graph, paramObj?: ParamObjIRIList) {
  return outputTransformation(
    applyFilter({ data: compactIRIList, filter: paramObj?.filter, graph: graph }),
    graph,
    paramObj?.outputFormat
  );
}
