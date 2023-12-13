import { TermTypeLabelValue } from "../data/namespaces";

/**
 * SDO-Adapter provides various query-functions that accept a **FilterObject** as optional parameter to narrow down the results. These query-functions typically return arrays of IRIs for vocabulary terms. You could for example pass a filter to {@link getAllClasses | .getAllClasses()} to retrieve only classes from a specific vocabulary. You could pass a filter to {@link getRanges | .getRanges()} to get only the ranges of a property that are enumerations (without classes or data-types). The optional attributes for a filter are described below. Keep in mind that there are **no default values** for these filters, that means that **not** using a certain attribute in the FilterObject results in **not** using that characteristic for filtering at all.
 *
 * @example
 * ```JS
 * // following filter can be passed to a function to retrieve only classes and enumerations that are from schema.org and are not superseded
 * {
 *   isSuperseded: false,
 *   fromVocabulary: ["https://schema.org/"],
 *   termType: [
 *     "Class",
 *     "Enumeration"
 *   ]
 * }
 *
 * // following filter can be passed to a function to retrieve only terms that are superseded
 * {
 *   isSuperseded: true
 * }
 * ```
 */
export type FilterObject = {
  /**
   * If true, only [superseded vocabulary terms](https://schema.org/supersededBy) are matched. If false, only vocabulary terms that are NOT superseded are matched.
   */
  isSuperseded?: boolean;
  /**
   * Namespaces for vocabularies (e.g. `"https://schema.org/"`) can be passed here, which matches only vocabulary terms that use any of the given namespaces in their IRI. You can check the namespaces and corresponding identifiers (e.g. `"schema"`) used by an {@link SDOAdapter | SDO-Adapter} instance with {@link getVocabularies | .getVocabularies()}. It is also possible to get the corresponding namespace of Term instance with {@link Class.getVocabulary | .getVocabulary()}.
   */
  fromVocabulary?: string | string[];
  /**
   * {@link TermTypeLabelValue | Term types} can be passed here, which matches only vocabulary terms that have any of the given term types. `Class` and `Enumeration` are strictly differentiated here.
   */
  termType?: TermTypeLabelValue | TermTypeLabelValue[];
};
