// the functions for a class Object
import { Term } from "./Term";
import { Graph } from "./Graph";
import { FilterObject, ToJsonClass, VocabularyNode } from "./types";
import {
  applyFilter,
  inferPropertiesFromSuperClasses,
  inferRangeOf,
  inferSubClasses,
  inferSuperClasses,
} from "./reasoning";
import {
  RDFS,
  SOA,
  TermTypeIRI,
  TermTypeIRIValue,
  TermTypeLabel,
  TermTypeLabelValue,
} from "./namespaces";

/**
 * A **Class** represents a class term, also known as [type in schema.org](https://schema.org/Class). A Class is identified by its IRI (e.g. [schema:Thing](https://schema.org/Thing)), where, by convention, the class name itself starts with an uppercase letter. A Class instance is created with {@link SDOAdapter.getClass | SDOAdapter.getClass()} and offers the methods described below.
 * ```JS
 * // following Class instance is used in the code examples below
 * const personClass = mySdoAdapter.getClass("schema:Person");
 * ```
 */
export class Class extends Term {
  /** @ignore */
  readonly termTypeLabel: TermTypeLabelValue = TermTypeLabel.class;
  /** @ignore */
  readonly termTypeIRI: TermTypeIRIValue = TermTypeIRI.class;

  /** @ignore
   * A Class represents an rdfs:Class. It is identified by its IRI
   *
   * @param IRI - The compacted IRI of this Class, e.g. "schema:Book"
   * @param graph - The underlying data graph to enable the methods of this Class
   */
  constructor(IRI: string, graph: Graph) {
    super(IRI, graph);
  }

  /** @ignore
   * Retrieves the term object of this Class
   *
   * @returns The term object of this Class
   */
  getTermObj(): VocabularyNode {
    return this.graph.classes[this.IRI];
  }

  /**
   * Retrieves the properties of this Class
   *
   * @example
   * ```JS
   * personClass.getProperties();
   * // returns all properties of the class "schema:Person" and its superclasses
   * [
   *    "schema:name",
   *    "schema:description",
   *    "schema:knows",
   *    "schema:worksFor",
   *    ...
   * ]
   * ```
   *
   * @param implicit - If true, retrieve also implicit properties (inheritance from super-classes)
   * @param filter - The filter to be applied on the result
   * @returns The properties of this Class
   */
  getProperties(implicit = true, filter?: FilterObject): string[] {
    const classObj = this.getTermObj();
    const result = [];
    result.push(...classObj[SOA.hasProperty]);
    if (implicit) {
      // add properties from super-classes
      result.push(
        ...inferPropertiesFromSuperClasses(
          classObj[RDFS.subClassOf],
          this.graph
        )
      );
    }
    return applyFilter({ data: result, filter, graph: this.graph });
  }

  /**
   * Retrieves the super-classes of this Class
   *
   * @example
   * ```JS
   * personClass.getSuperClasses();
   * // returns all super-classes of the class "schema:Person"
   * [
   *    "schema:Thing"
   * ]
   * ```
   *
   * @param implicit - If true, retrieve also implicit super-classes (recursive from super-classes)
   * @param filter - The filter to be applied on the result
   * @returns The super-classes of this Class
   */
  getSuperClasses(implicit = true, filter?: FilterObject): string[] {
    const classObj = this.getTermObj();
    const result = [];
    if (implicit) {
      result.push(...inferSuperClasses(this.IRI, this.graph));
    } else {
      result.push(...classObj[RDFS.subClassOf]);
    }
    return applyFilter({ data: result, filter, graph: this.graph });
  }

  /**
   * Retrieves the sub-classes of this Class
   * @example
   * ```JS
   * personClass.getSubClasses();
   * // returns all sub-classes of the class "schema:Person"
   * [
   *    "schema:Patient"
   * ]
   * ```
   *
   * @param implicit - If true, retrieve also implicit sub-classes (recursive from sub-classes)
   * @param filter - The filter to be applied on the result
   * @returns The sub-classes of this Class
   */
  getSubClasses(implicit = true, filter?: FilterObject): string[] {
    const classObj = this.getTermObj();
    const result = [];
    if (implicit) {
      result.push(...inferSubClasses(this.IRI, this.graph));
    } else {
      result.push(...classObj[SOA.superClassOf]);
    }
    return applyFilter({ data: result, filter, graph: this.graph });
  }

  /**
   * Retrieves the properties that have this Class as a range
   *
   * @example
   * ```JS
   * personClass.isRangeOf();
   * // returns all properties for which the class "schema:Person" is a valid range
   * [
   *    "schema:legislationPassedBy",
   *    "schema:sender",
   *    "schema:character",
   *    "schema:actors",
   *    ...
   * ]
   * ```
   *
   * @param implicit - If true, retrieve also implicit properties (where a super-class of this class is a range)
   * @param filter - The filter to be applied on the result
   * @returns The properties that have this Class as a range
   */
  isRangeOf(implicit = true, filter?: FilterObject): string[] {
    const result = [];
    if (implicit) {
      result.push(...inferRangeOf(this.IRI, this.graph));
    } else {
      result.push(...this.getTermObj()[SOA.isRangeOf]);
    }
    return applyFilter({ data: result, filter, graph: this.graph });
  }

  /**
   * Generates a JSON representation of this Class (as string)
   *
   * Check {@link toJSON | .toJSON()} for an example output
   *
   * @example
   * ```JS
   * personClass.toString();
   * ```
   *
   * @param implicit - If true, includes also implicit data (e.g. sub-Classes, super-Classes, properties, etc.)
   * @param filter - The filter to be applied on the result
   * @returns The JSON representation of this Class as string
   */
  toString(implicit = true, filter?: FilterObject): string {
    return JSON.stringify(this.toJSON(implicit, filter), null, 2);
  }

  /**
   * Generates a JSON representation of this Class (as JavaScript Object)
   *
   * @example
   * ```JS
   * personClass.toJSON();
   * // returns a JSON representing the class "schema:Person"
   *{
   *  id: 'schema:Person',
   *  IRI: 'https://schema.org/Person',
   *  typeLabel: 'Class',
   *  typeIRI: 'rdfs:Class',
   *  vocabURLs: ['https://raw.githubusercontent.com/semantifyit/schemaorg/main/data/releases/13.0/schemaorg-all-https.jsonld'],
   *  vocabulary: 'https://schema.org',
   *  source: 'http://www.w3.org/wiki/WebSchemas/SchemaDotOrgSources#source_rNews',
   *  supersededBy: null,
   *  name: 'Person',
   *  description: 'A person (alive, dead, undead, or fictional).',
   *  superClasses: ['schema:Thing'],
   *  subClasses: ['schema:Patient'],
   *  properties: [
   *    'schema:contactPoint',
   *    'schema:jobTitle',
   *    'schema:colleagues',
   *    ...
   *  ],
   *  rangeOf: [
   *    'schema:legislationPassedBy',
   *    'schema:sender',
   *    'schema:character',
   *    ...
   *  ]
   *}
   * ```
   *
   * @param implicit - If true, includes also implicit data (e.g. sub-Classes, super-Classes, properties, etc.)
   * @param filter - The filter to be applied on the result
   * @returns The JSON representation of this Class as JavaScript Object
   */
  toJSON(implicit = true, filter?: FilterObject): ToJsonClass {
    // (implicit === true) ->
    // properties of all parent classes
    // sub-classes and their subclasses
    // super-classes and their superclasses
    const result = super.toJSON() as ToJsonClass;
    result.superClasses = this.getSuperClasses(implicit, filter);
    result.subClasses = this.getSubClasses(implicit, filter);
    result.properties = this.getProperties(implicit, filter);
    result.rangeOf = this.isRangeOf(implicit, filter);
    return result;
  }
}
