import { TermTypeLabelValue } from "../data/namespaces";
import { SchemaModule } from "../data/schemaModules";

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
   * Namespaces for vocabularies (e.g. `"https://schema.org/"`) can be passed here to sort out vocabulary terms with the given namespaces in their IRI. This filter is the opposite of `fromVocabulary` and they rule each other out (only one of them can be used at the same time).
   */
  fromVocabularyExclude?: string | string[];

  /**
   * {@link TermTypeLabelValue | Term types} can be passed here, which matches only vocabulary terms that have any of the given term types. `Class` and `Enumeration` are strictly differentiated here.
   */
  termType?: TermTypeLabelValue | TermTypeLabelValue[];

  /**
   * {@link TermTypeLabelValue | Term types} can be passed here to sort out vocabulary terms from the given term types. `Class` and `Enumeration` are strictly differentiated here. This filter is the opposite of `termType` and they rule each other out (only one of them can be used at the same time).
   */
  termTypeExclude?: TermTypeLabelValue | TermTypeLabelValue[];

  /**
   * {@link SchemaModule | Schema module identifiers} can be passed here, which matches only vocabulary terms from schema.org that are from any of the given schema modules. This filter applies only to schema.org terms, terms from other vocabularies are not filtered in/out. More information about the schema modules can be found in [Organization of Schemas - Hosted Sections](https://schema.org/docs/schemas.html)
   */
  schemaModule?: SchemaModule | SchemaModule[];

  /**
   * {@link SchemaModule | Schema module identifiers} can be passed here to sort out vocabulary terms from the given schema modules. This filter is the opposite of `schemaModule` and they rule each other out (only one of them can be used at the same time). More information about the schema modules can be found in [Organization of Schemas - Hosted Sections](https://schema.org/docs/schemas.html)
   */
  schemaModuleExclude?: SchemaModule | SchemaModule[];

  /**
   * The strictMode defines how IRIs of non-present terms (e.g. a Term that is linked by a vocabulary node, but is itself not present in the current vocabulary) should be handled. Some filters (e.g. termType) require term instances to do their checks. If the strictMode is true (default), then such IRIs are filtered out. If the strictMode is false then those IRIs are kept in the result.
   */
  strictMode?: boolean;
};
