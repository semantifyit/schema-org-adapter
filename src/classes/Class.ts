// the functions for a class Object
import { Term } from "./Term";
import { Graph } from "./Graph";
import { ToJsonClass, VocabularyNode } from "../types/types";
import { NS, TermTypeIRI, TermTypeIRIValue, TermTypeLabel, TermTypeLabelValue } from "../data/namespaces";
import { inferPropertiesFromSuperClasses } from "../utilities/reasoning/inferPropertiesFromSuperClasses";
import { inferSuperClasses } from "../utilities/reasoning/inferSuperClasses";
import { inferSubClasses } from "../utilities/reasoning/inferSubClasses";
import { inferRangeOf } from "../utilities/reasoning/inferRangeOf";
import { ParamObjIRIListInference } from "../types/ParamObjIRIListInference.type";
import { filterAndTransformIRIList } from "../utilities/general/filterAndTransformIRIList";

/**
 * A **Class** represents a class term, also known as [type in schema.org](https://schema.org/Class). A Class is identified by its IRI (e.g. [schema:Thing](https://schema.org/Thing)), where, by convention, the class name itself starts with an uppercase letter. A Class instance is created with {@link SDOAdapter.getClass | SDOAdapter.getClass()} and offers the methods described below.
 * ```JS
 * // following Class instance is used in the code examples below
 * const personClass = mySdoAdapter.getClass("schema:Person");
 * // it is also possible to create a Class instance with an absolute IRI or a label
 * const personClass2 = mySdoAdapter.getClass("https://schema.org/Person");
 * const personClass3 = mySdoAdapter.getClass("Person");
 * ```
 */
export class Class extends Term {
  /** @ignore */
  readonly termTypeLabel: TermTypeLabelValue = TermTypeLabel.class;
  /** @ignore */
  readonly termTypeIRI: TermTypeIRIValue = TermTypeIRI.class;

  /** @ignore
   * A Class represents a rdfs:Class. It is identified by its compact IRI
   *
   * @param IRI - The compact IRI of this Class, e.g. "schema:Book"
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
   * // returns all properties of the class "schema:Person" (including inherited properties from its superclasses)
   * [
   *    "schema:name",
   *    "schema:description",
   *    "schema:knows",
   *    "schema:worksFor",
   *    ...
   * ]
   *
   * personClass.getProperties({ implicit: false });
   * // returns only the explicit properties of the class "schema:Person"
   * [
   *    "schema:address",
   *    "schema:weight",
   *    "schema:worksFor",
   *    ...
   * ]
   * ```
   *
   * @param paramObj - an optional parameter object that filters and formats the result, and defines the inference behaviour: The "implicit"-parameter defaults to true and returns also implicit properties inherited from superclasses
   * @returns The properties of this Class
   */
  getProperties(paramObj?: ParamObjIRIListInference): string[] {
    const classObj = this.getTermObj();
    const result = [];
    result.push(...classObj[NS.soa.hasProperty]);
    // only skip if implicit is set to false
    if (!(paramObj?.implicit === false)) {
      // add properties from superclasses
      result.push(...inferPropertiesFromSuperClasses(classObj[NS.rdfs.subClassOf], this.graph));
    }
    return filterAndTransformIRIList(result, this.graph, paramObj);
  }

  /**
   * Retrieves the superclasses of this Class
   *
   * @example
   * ```JS
   * personClass.getSuperClasses();
   * // returns all superclasses of the class "schema:Person" (including inherited superclasses from its superclasses)
   * [
   *    "schema:Thing"
   * ]
   * ```
   *
   * @param paramObj - an optional parameter object that filters and formats the result, and defines the inference behaviour: The "implicit"-parameter defaults to true and returns also implicit superclasses inherited recursively from superclasses
   * @returns The superclasses of this Class
   */
  getSuperClasses(paramObj?: ParamObjIRIListInference): string[] {
    const classObj = this.getTermObj();
    const result = [];
    // only skip if implicit is set to false
    if (!(paramObj?.implicit === false)) {
      result.push(...inferSuperClasses(this.IRI, this.graph));
    } else {
      result.push(...classObj[NS.rdfs.subClassOf]);
    }
    return filterAndTransformIRIList(result, this.graph, paramObj);
  }

  /**
   * Retrieves the subclasses of this Class
   * @example
   * ```JS
   * personClass.getSubClasses();
   * // returns all subclasses of the class "schema:Person"
   * [
   *    "schema:Patient"
   * ]
   * ```
   *
   * @param paramObj - an optional parameter object that filters and formats the result, and defines the inference behaviour: The "implicit"-parameter defaults to true and returns also implicit subclasses inherited recursively from subclasses
   * @returns The subclasses of this Class
   */
  getSubClasses(paramObj?: ParamObjIRIListInference): string[] {
    const classObj = this.getTermObj();
    const result = [];
    // only skip if implicit is set to false
    if (!(paramObj?.implicit === false)) {
      result.push(...inferSubClasses(this.IRI, this.graph));
    } else {
      result.push(...classObj[NS.soa.superClassOf]);
    }
    return filterAndTransformIRIList(result, this.graph, paramObj);
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
   * @param paramObj - an optional parameter object that filters and formats the result, and defines the inference behaviour: The "implicit"-parameter defaults to true and returns also implicit properties (where a superclass of this class is a range)
   * @returns The properties that have this Class as a range
   */
  isRangeOf(paramObj?: ParamObjIRIListInference): string[] {
    const result = [];
    // only skip if implicit is set to false
    if (!(paramObj?.implicit === false)) {
      result.push(...inferRangeOf(this.IRI, this.graph));
    } else {
      result.push(...this.getTermObj()[NS.soa.isRangeOf]);
    }
    return filterAndTransformIRIList(result, this.graph, paramObj);
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
   * @param paramObj - an optional parameter object that filters and formats the result, and defines the inference behaviour: The "implicit"-parameter defaults to true and returns also implicit data (e.g. recursive subclasses, superclasses, properties, etc.)
   * @returns The JSON representation of this Class as string
   */
  toString(paramObj?: ParamObjIRIListInference): string {
    return JSON.stringify(this.toJSON(paramObj), null, 2);
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
   * @param paramObj - an optional parameter object that filters and formats the result, and defines the inference behaviour: The "implicit"-parameter defaults to true and returns also implicit data (e.g. recursive subclasses, superclasses, properties, etc.)
   * @returns The JSON representation of this Class as JavaScript Object
   */
  toJSON(paramObj?: ParamObjIRIListInference): ToJsonClass {
    const result = super.toJSON() as ToJsonClass;
    result.superClasses = this.getSuperClasses(paramObj);
    result.subClasses = this.getSubClasses(paramObj);
    result.properties = this.getProperties(paramObj);
    result.rangeOf = this.isRangeOf(paramObj);
    return result;
  }

  /**
   * Returns true, if the given class is a valid superclass of this class. The implicit parameter (default: true) allows to cover recursive relationships (e.g. the superclass of a superclass is also taken into account)
   * @example
   * ```JS
   * hotelClass.isValidSubClassOf("schema:LodgingBusiness"); // true
   * hotelClass.isValidSubClassOf("schema:Thing"); // true
   * hotelClass.isValidSubClassOf("schema:Thing", true); // true
   * hotelClass.isValidSubClassOf("schema:Thing", false); // false, since only direct superclasses are considered
   * ```
   *
   * @param superClassId - The identification string of the superclass in question, can be an IRI (absolute or compact) or a label
   * @param implicit - If true, includes also superclasses of superclasses
   * @returns if the other class is a valid superclass of this class
   */
  isValidSubClassOf(superClassId: string, implicit = true): boolean {
    const c = this.graph.getClass(superClassId);
    return this.getSuperClasses({ implicit, outputFormat: "Compact" }).includes(c.getIRI("Compact"));
  }

  /**
   * Returns true, if the given class is a valid subclass of this class. The implicit parameter (default: true) allows to cover recursive relationships (e.g. the subclass of a subclass is also taken into account)
   * @example
   * ```JS
   * thingClass.isValidSuperClassOf("schema:Place"); // true
   * thingClass.isValidSuperClassOf("schema:Hotel"); // true
   * thingClass.isValidSuperClassOf("schema:Hotel", true); // true
   * thingClass.isValidSuperClassOf("schema:Hotel", false); // false, since only direct subclasses are considered
   * ```
   *
   * @param subClassId - The identification string of the subclass in question, can be an IRI (absolute or compact) or a label
   * @param implicit - If true, includes also subclasses of subclasses
   * @returns if the other class is a valid subclass of this class
   */
  isValidSuperClassOf(subClassId: string, implicit = true): boolean {
    const c = this.graph.getClass(subClassId);
    return this.getSubClasses({ implicit, outputFormat: "Compact" }).includes(c.getIRI("Compact"));
  }

  /**
   * Returns true, if the given property can use this class as a valid range. The implicit parameter (default: true) allows to cover recursive relationships (e.g. subclasses of valid ranges are also taken into account)
   * @example
   * ```JS
   * mediaObjectClass.isValidRangeOf("schema:caption"); // true
   * mediaObjectClass.isValidRangeOf("schema:license"); // true
   * mediaObjectClass.isValidRangeOf("schema:license", true); // true
   * mediaObjectClass.isValidRangeOf("schema:license", false); // false, since only direct ranges are considered
   * ```
   *
   * @param propertyId - The identification string of the property in question, can be an IRI (absolute or compact) or a label
   * @param implicit - If true, includes also subclasses of ranges
   * @returns if this class is a valid range for the given property
   */
  isValidRangeOf(propertyId: string, implicit = true): boolean {
    const p = this.graph.getProperty(propertyId);
    return this.isRangeOf({ implicit, outputFormat: "Compact" }).includes(p.getIRI("Compact"));
  }

  /**
   * Returns true, if the given property can use this class as a valid domain. The implicit parameter (default: true) allows to include properties inherited from superclasses
   * @example
   * ```JS
   * mediaObjectClass.isValidDomainOf("schema:dateline"); // true
   * mediaObjectClass.isValidDomainOf("schema:name"); // true
   * mediaObjectClass.isValidDomainOf("schema:name", true); // true
   * mediaObjectClass.isValidDomainOf("schema:name", false); // false, since only direct domains are considered
   * ```
   *
   * @param propertyId - The identification string of the property in question, can be an IRI (absolute or compact) or a label
   * @param implicit - If true, include properties inherited from superclasses
   * @returns if this class is a valid domain for the given property
   */
  isValidDomainOf(propertyId: string, implicit = true): boolean {
    const p = this.graph.getProperty(propertyId);
    return this.getProperties({ implicit, outputFormat: "Compact" }).includes(p.getIRI("Compact"));
  }
}
