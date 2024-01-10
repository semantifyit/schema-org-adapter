import { ParamObjIRIList } from "./ParamObjIRIList.type";

/**
 *  A **parameter object** to filter and format the output of a functions that returns a list of IRIs.
 *  Also includes a reasoning parameter "implicit", which defaults to true and makes it possible to include implicit data in the results based on inferences (e.g. the direct subclasses of a target class are **explicit subclasses**. The subclasses of those subclasses can be inferred as **implicit subclasses** for the target class)
 *
 *  @example
 * ```JS
 * // the following parameter object uses no filter. It states that the returned result should be formatted as absolute IRIs and that implicit data should be included
 * const exampleParameters = {
 *    outputFormat: "Absolute",
 *    implicit: true
 * }
 * ```
 */
export type ParamObjIRIListInference = ParamObjIRIList & {
  /**
   *  If true (default), includes also implicit data (e.g. subclasses, superclasses, properties, etc.)
   */
  implicit?: boolean;
};
