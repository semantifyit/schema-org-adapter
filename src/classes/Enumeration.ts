// the functions for an enumeration Object
import { Class } from "./Class";
import { Graph } from "./Graph";
import { ToJsonEnumeration, VocabularyNode } from "../types/types";
import { NS, TermTypeIRI, TermTypeLabel } from "../data/namespaces";
import { isNil } from "../utilities/general/isNil";
import { ParamObjIRIListInference } from "../types/ParamObjIRIListInference.type";
import { filterAndTransformIRIList } from "../utilities/general/filterAndTransformIRIList";

/**
 * An **Enumeration** represents an enumeration term, which is a special kind of Class. For SDO-Adapter, a Class is understood as Enumeration when it is a subclass of the [schema.org Enumeration Class](https://schema.org/Enumeration). Usually, Enumerations (e.g. [schema:DayOfWeek](https://schema.org/DayOfWeek)) have predefined instances (e.g. [schema:Monday](https://schema.org/Monday)) that are also part of the Vocabulary. Instead of creating new instances for this Class/Enumeration, it is usual to just link to a predefined instance (In SDO-Adapter these predefined instances are called {@link EnumerationMember | Enumeration Members}). But, since an Enumeration is also a Class, every enumeration can also be understood as a Class for which a new instance can be created, therefore the API also provides all Class methods for Enumerations. An Enumeration is created with {@link SDOAdapter.getEnumeration | SDOAdapter.getEnumeration()} and offers the methods described below.
 * ```JS
 * // following Enumeration instance is used in the code examples below
 * const dayEnum = mySdoAdapter.getEnumeration("schema:DayOfWeek");
 * // it is also possible to create an Enumeration instance with an absolute IRI or a label
 * const dayEnum2 = mySdoAdapter.getEnumeration("https://schema.org/DayOfWeek");
 * const dayEnum3 = mySdoAdapter.getEnumeration("DayOfWeek");
 * ```
 */
export class Enumeration extends Class {
  /** @ignore */
  readonly termTypeLabel = TermTypeLabel.enumeration;
  /** @ignore */
  readonly termTypeIRI = TermTypeIRI.enumeration;

  /** @ignore
   * An Enumeration represents a schema:Enumeration, which is also a sub-type of an rdfs:Class. It is identified by its compact IRI
   *
   * @param IRI - The compact IRI of this Enumeration, e.g. "schema:DayOfWeek"
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
   * @param paramObj - an optional parameter object that filters and formats the result, and defines the inference behaviour: The "implicit"-parameter defaults to true and returns also implicit enumeration members inherited recursively from sub-enumerations
   * @returns The Enumeration Members of this Enumeration
   */
  getEnumerationMembers(paramObj?: ParamObjIRIListInference): string[] {
    const result = [];
    result.push(...this.getTermObj()[NS.soa.hasEnumerationMember]);
    // only skip if implicit is set to false
    if (!(paramObj?.implicit === false)) {
      const subClasses = this.getSubClasses(paramObj);
      for (const actSubClass of subClasses) {
        const actualEnumeration = this.graph.enumerations[actSubClass];
        if (!isNil(actualEnumeration)) {
          result.push(...actualEnumeration[NS.soa.hasEnumerationMember]);
        }
      }
    }
    return filterAndTransformIRIList(result, this.graph, paramObj);
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
   * @param paramObj - an optional parameter object that filters and formats the result, and defines the inference behaviour: The "implicit"-parameter defaults to true and returns also implicit data (e.g. enumeration members, properties, etc.)
   * @returns The JSON representation of this Enumeration as string
   */
  toString(paramObj?: ParamObjIRIListInference): string {
    return JSON.stringify(this.toJSON(paramObj), null, 2);
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
   * @param paramObj - an optional parameter object that filters and formats the result, and defines the inference behaviour: The "implicit"-parameter defaults to true and returns also implicit data (e.g. enumeration members, properties, etc.)
   * @returns The JSON representation of this Enumeration as JavaScript Object
   */
  toJSON(paramObj?: ParamObjIRIListInference): ToJsonEnumeration {
    const result = super.toJSON(paramObj) as ToJsonEnumeration;
    result.enumerationMembers = this.getEnumerationMembers(paramObj);
    return result;
  }

  /**
   * Returns true, if the given Enumeration Member is a valid instance of this Enumeration. The implicit parameter (default: true) allows to cover recursive relationships (e.g. the Enumeration Members of sub-enumerations are also taken into account)
   * @example
   * ```JS
   * statusEnumeration.isValidDomainEnumerationOf("schema:EventPostponed"); // true
   * statusEnumeration.isValidDomainEnumerationOf("schema:EventPostponed", true); // true
   * statusEnumeration.isValidDomainEnumerationOf("schema:EventPostponed", false); // false, (is a member of a sub-enumeration)
   * eventStatusTypeEnumeration.isValidDomainEnumerationOf("schema:EventPostponed", false); // true
   * ```
   *
   * @param enumerationMemberId - The identification string of the Enumeration Member in question, can be an IRI (absolute or compact) or a label
   * @param implicit - If true, includes also Enumeration Members of sub-enumerations
   * @returns if the given Enumeration Member is a valid instance of this Enumeration
   */
  isValidDomainEnumerationOf(enumerationMemberId: string, implicit = true) {
    const em = this.graph.getEnumerationMember(enumerationMemberId);
    return this.getEnumerationMembers({ implicit, outputFormat: "Compact" }).includes(em.getIRI("Compact"));
  }
}
