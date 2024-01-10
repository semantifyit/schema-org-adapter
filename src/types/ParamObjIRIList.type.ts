import { FilterObject } from "./FilterObject.type";
import { OutputIRIType } from "./OutputIRIType.type";

/**
 *  A **parameter object** to filter and format the output of a functions that returns a list of IRIs
 */
export type ParamObjIRIList = {
  /**
   *  The filter to be applied on the result
   */
  filter?: FilterObject;

  /**
   * Defines the format in which the IRI results of this functions should be returned.
   * Use this parameter only if the wished format is different to the default format set for the SDO-Adapter during its initialization.
   * The possible formats are:
   * * "Compact": The resulting IRIs are given in compact form, e.g. "schema:Hotel"
   * * "Absolute": The resulting IRIs are given in absolute form, e.g. "https://schema.org/Hotel"
   */
  outputFormat?: OutputIRIType;
};
