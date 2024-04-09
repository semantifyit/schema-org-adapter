import { OutputIRIType } from "../../types/OutputIRIType.type";
import { toAbsoluteIRI } from "./toAbsoluteIRI";
import { Graph } from "../../classes/Graph";
import { isString } from "./isString";
import { isArrayOfStrings } from "./isArrayOfStrings";

/** @ignore
 * transforms the input compact IRI(s) into the desired output format if given, else the default format stated in the Graph is taken
 */
export function outputTransformation<T extends string | string[]>(input: T, graph: Graph, outputFormat?: OutputIRIType): T {
  const format = outputFormat ? outputFormat : graph.outputFormat;
  if (format === "Compact") {
    return input;
  }
  // right now there is only the "Absolute" option left
  if (isString(input)) {
    // input is a string
    return toAbsoluteIRI(input, graph.context) as T;
  } else if (isArrayOfStrings(input)) {
    // input is an array of strings
    return input.map((s) => toAbsoluteIRI(s, graph.context)) as T;
  }
  throw new Error("Wrong input type! - must be string or array of strings");
}
