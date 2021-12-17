// the functions for a enumeration Object
import { Class } from "./Class";
import { Graph } from "./Graph";
import { isNil } from "./utilities";
import { FilterObject, ToJsonEnumeration, VocabularyNode } from "./types";
import { SOA, TermTypeIRI, TermTypeLabel } from "./namespaces";
import { applyFilter } from "./reasoning";

/**
 * An **Enumeration** represents an enumeration term, which is a special kind of Class. For SDO-Adapter, a Class is understood as Enumeration when it is a sub-class of the [schema.org Enumeration Class](https://schema.org/Enumeration). Usually, Enumerations (e.g. [schema:DayOfWeek](https://schema.org/DayOfWeek)) have predefined instances (e.g. [schema:Monday](https://schema.org/Monday)) that are also part of the Vocabulary. Instead of creating new instances for this Class/Enumeration, it is usual to just link to a predefined instance (In SDO-Adapter these predefined instances are called {@link EnumerationMember | Enumeration Members}). But, since an Enumeration is also a Class, every enumeration can also be understood as a Class for which a new instance can be created, therefore the API also provides all Class methods for Enumerations. An Enumeration is created with {@link SDOAdapter.getEnumeration | SDOAdapter.getEnumeration()} and offers the methods described below.
 * ```JS
 * // following Enumeration instance is used in the code examples below
 * const dayEnum = mySdoAdapter.getEnumeration("schema:DayOfWeek");
 * ```
 */
export class Enumeration extends Class {
  /** @ignore */
  readonly termTypeLabel = TermTypeLabel.enumeration;
  /** @ignore */
  readonly termTypeIRI = TermTypeIRI.enumeration;

  /** @ignore
   * An Enumeration represents a schema:Enumeration, which is also a sub-type of an rdfs:Class. It is identified by its IRI
   *
   * @param IRI - The compacted IRI of this Enumeration, e.g. "schema:DayOfWeek"
   * @param graph - The underlying data graph to enable the methods of this Enumeration
   */
  constructor(IRI: string, graph: Graph) {
    super(IRI, graph);
  }

  /** @ignore
   * Retrieves the term object of this Enumeration
   *
   * @returns The term object of this Enumeration
   */
  getTermObj(): VocabularyNode {
    return this.graph.enumerations[this.IRI];
  }

  /**
   * Retrieves the Enumeration Members of this Enumeration
   *
   * @example
   * ```JS
   * dayEnum.getEnumerationMembers();
   * // returns all Enumeration Members of the Enumeration "schema:DayOfWeek"
   * [
   *    "schema:Monday",
   *    "schema:Thursday",
   *    "schema:Sunday",
   *    ...
   * ]
   * ```
   *
   * @param implicit - If true, retrieve also implicit enumeration members (inheritance from sub-enumerations)
   * @param filter - The filter to be applied on the result
   * @returns The Enumeration Members of this Enumeration
   */
  getEnumerationMembers(implicit = true, filter?: FilterObject): string[] {
    const result = [];
    result.push(...this.getTermObj()[SOA.hasEnumerationMember]);
    if (implicit) {
      const subClasses = this.getSubClasses(true);
      for (const actSubClass of subClasses) {
        const actualEnumeration = this.graph.enumerations[actSubClass];
        if (!isNil(actualEnumeration)) {
          result.push(...actualEnumeration[SOA.hasEnumerationMember]);
        }
      }
    }
    return applyFilter({ data: result, filter, graph: this.graph });
  }

  /**
   * Generates a JSON representation of this Enumeration (as string)
   *
   * Check {@link toJSON | .toJSON()} for an example output
   *
   * @example
   * ```JS
   * dayEnum.toString();
   * ```
   *
   * @param implicit - If true, includes also implicit data (e.g. enumeration members, properties, etc.)
   * @param filter - The filter to be applied on the result
   * @returns The JSON representation of this Enumeration as string
   */
  toString(implicit = true, filter?: FilterObject): string {
    return JSON.stringify(this.toJSON(implicit, filter), null, 2);
  }

  /**
   * Generates a JSON representation of this Enumeration (as JavaScript Object)
   *
   * @example
   * ```JS
   * dayEnum.toJSON();
   * // returns a JSON representing the Enumeration "schema:DayOfWeek"
   * {
   *  id: 'schema:DayOfWeek',
   *  IRI: 'https://schema.org/DayOfWeek',
   *  typeLabel: 'Enumeration',
   *  typeIRI: 'schema:Enumeration',
   *  vocabURLs: ["https://raw.githubusercontent.com/semantifyit/schemaorg/main/data/releases/12.0/schemaorg-all-https.jsonld"],
   *  vocabulary: 'https://schema.org',
   *  source: 'http://www.w3.org/wiki/WebSchemas/SchemaDotOrgSources#source_GoodRelationsClass',
   *  supersededBy: null,
   *  name: 'DayOfWeek',
   *  description: 'The day of the week, e.g. used to specify to which day the opening hours of an OpeningHoursSpecification refer.\n\nOriginally, URLs from [GoodRelations](http://purl.org/goodrelations/v1) were used (for [[Monday]], [[Tuesday]], [[Wednesday]], [[Thursday]], [[Friday]], [[Saturday]], [[Sunday]] plus a special entry for [[PublicHolidays]]); these have now been integrated directly into schema.org.\n',
   *  superClasses: [ 'schema:Enumeration', 'schema:Intangible', 'schema:Thing' ],
   *  subClasses: [],
   *  properties: [
   *    'schema:supersededBy',
   *    'schema:sameAs',
   *    'schema:description',
   *    ...
   *  ],
   *  rangeOf: [
   *    'schema:dayOfWeek',
   *    'schema:byDay',
   *    'schema:supersededBy',
   *    ...
   *  ],
   *  enumerationMembers: [
   *    'schema:PublicHolidays',
   *    'schema:Sunday',
   *    'schema:Monday',
   *    'schema:Thursday',
   *    ...
   *  ]
   *}
   * ```
   *
   * @param implicit - If true, include also implicit data. (e.g. enumeration members, properties, etc.)
   * @param filter - The filter to be applied on the result
   * @returns The JSON representation of this Enumeration as JavaScript Object
   */
  toJSON(implicit = true, filter?: FilterObject): ToJsonEnumeration {
    const result = super.toJSON(implicit, filter) as ToJsonEnumeration;
    result.enumerationMembers = this.getEnumerationMembers(implicit, filter);
    return result;
  }
}
