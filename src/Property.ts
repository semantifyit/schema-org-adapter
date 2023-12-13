// the functions for a property Object
import { Term } from "./Term";
import { ToJsonProperty, VocabularyNode } from "./types/types";
import { Graph } from "./Graph";
import {
  applyFilter,
  inferSubClasses,
  inferSubDataTypes,
  inferSubProperties,
  inferSuperProperties,
} from "./reasoning";
import { NS, TermTypeIRI, TermTypeLabel } from "./data/namespaces";
import { FilterObject } from "./types/FilterObject.type";

/**
 * A **Property** represents a property term, which is used to describe a relationship between subject resources (their domains) and object resources (their ranges). A Property is identified by its IRI (e.g. [schema:name](https://schema.org/name)), where, by convention, the property name itself starts with a lowercase letter. A Property instance is created with {@link SDOAdapter.getProperty | SDOAdapter.getProperty()} and offers the methods described below.
 *
 * ```JS
 * // following Property instance is used in the code examples below
 * const identifierProperty = mySdoAdapter.getProperty("schema:identifier");
 * ```
 */
export class Property extends Term {
  /** @ignore */
  readonly termTypeLabel = TermTypeLabel.property;
  /** @ignore */
  readonly termTypeIRI = TermTypeIRI.property;

  /** @ignore
   * A Property represents an rdf:Property. It is identified by its IRI
   *
   * @param IRI - The compacted IRI of this Property, e.g. "schema:address"
   * @param graph - The underlying data graph to enable the methods of this Property
   */
  constructor(IRI: string, graph: Graph) {
    super(IRI, graph);
  }

  /** @ignore
   * Retrieves the term object of this Property
   *
   * @returns The term object of this Property
   */
  getTermObj(): VocabularyNode {
    return this.graph.properties[this.IRI];
  }

  /**
   * Retrieves the classes, enumerations, and data-types that are defined as ranges for this Property
   *
   * @example
   * ```JS
   * identifierProperty.getRanges();
   * // returns all ranges of the property "schema:identifier"
   * [
   *    "schema:Text",
   *    "schema:URL",
   *    "schema:PropertyValue",
   *    "schema:PronounceableText",
   *    ...
   * ]
   * ```
   *
   * @param implicit - If true, retrieve also implicit ranges (inheritance from subclasses of the ranges)
   * @param filter - The filter to be applied on the result
   * @returns The ranges of this Property
   */
  getRanges(implicit = true, filter?: FilterObject): string[] {
    const propertyObj = this.getTermObj();
    const result = [];
    result.push(...propertyObj[NS.schema.rangeIncludes]);
    if (implicit) {
      // add subclasses and sub-data-types from ranges
      for (const actRes of result) {
        result.push(...inferSubDataTypes(actRes, this.graph));
      }
      for (const actRes of result) {
        result.push(...inferSubClasses(actRes, this.graph));
      }
    }
    return applyFilter({ data: result, filter, graph: this.graph });
  }

  /**
   * Retrieves the classes and enumerations that are defined as domains for this Property
   *
   * @example
   * ```JS
   * identifierProperty.getDomains();
   * // returns all domains of the property "schema:identifier"
   * [
   *    "schema:Thing",
   *    "schema:Event",
   *    "schema:Product",
   *    "schema:Organization",
   *    ...
   * ]
   * ```
   *
   * @param implicit - If true, retrieve also implicit domains (inheritance from subclasses of the domains)
   * @param filter - The filter to be applied on the result
   * @returns The domains of this Property
   */
  getDomains(implicit = true, filter?: FilterObject): string[] {
    const propertyObj = this.getTermObj();
    const result = [];
    result.push(...propertyObj[NS.schema.domainIncludes]);
    if (implicit) {
      // add subclasses from ranges
      const inferredSubClasses = [];
      for (const actRes of result) {
        inferredSubClasses.push(...inferSubClasses(actRes, this.graph));
      }
      result.push(...inferredSubClasses);
    }
    return applyFilter({ data: result, filter, graph: this.graph });
  }

  /**
   * Retrieves the super-properties of this Property
   *
   * @example
   * ```JS
   * const bccRecipientProperty = mySdoAdapter.getProperty("schema:bccRecipient");
   * bccRecipientProperty.getSuperProperties();
   * // returns all super-properties of the property "schema:bccRecipient"
   * [
   *    "schema:recipient",
   *    "schema:participant"
   * ]
   * ```
   *
   * @param implicit - If true, retrieve also implicit super-properties (recursive from super-properties)
   * @param filter - The filter to be applied on the result
   * @returns The super-properties of this Property
   */
  getSuperProperties(implicit = true, filter?: FilterObject): string[] {
    const propertyObj = this.getTermObj();
    const result = [];
    if (implicit) {
      result.push(...inferSuperProperties(this.IRI, this.graph));
    } else {
      result.push(...propertyObj[NS.rdfs.subPropertyOf]);
    }
    return applyFilter({ data: result, filter, graph: this.graph });
  }

  /**
   * Retrieves the sub-properties of this Property
   *
   * @example
   * ```JS
   * const recipientProperty = mySdoAdapter.getProperty("schema:recipient");
   * recipientProperty.getSubProperties();
   * // returns all sub-properties of the property "schema:recipient"
   * [
   *    "schema:participant"
   * ]
   * ```
   *
   * @param implicit - If true, retrieve also implicit sub-properties (recursive from sub-properties)
   * @param filter - The filter to be applied on the result
   * @returns The sub-properties of this Property
   */
  getSubProperties(implicit = true, filter?: FilterObject): string[] {
    const propertyObj = this.getTermObj();
    const result = [];

    if (implicit) {
      result.push(...inferSubProperties(this.IRI, this.graph));
    } else {
      result.push(...propertyObj[NS.soa.superPropertyOf]);
    }
    return applyFilter({ data: result, filter, graph: this.graph });
  }

  /**
   * Retrieves the inverse Property of this Property
   *
   * @example
   * ```JS
   * const alumniProperty = mySdoAdapter.getProperty("schema:alumni");
   * alumniProperty.getInverseOf();
   * // returns the inverse properties of the property "schema:alumni"
   * "schema:alumniOf"
   * ```
   *
   * @returns The IRI of the inverse Property of this Property
   */
  getInverseOf(): string {
    const propertyObj = this.getTermObj();
    return propertyObj[NS.schema.inverseOf];
  }

  /**
   * Generates a JSON representation of this Property (as string)
   *
   * Check {@link toJSON | .toJSON()} for an example output
   *
   * @example
   * ```JS
   * identifierProperty.toString();
   * ```
   *
   * @param implicit - If true, includes also implicit data (e.g. domains, ranges, etc.)
   * @param filter - The filter to be applied on the result
   * @returns The JSON representation of this Property as string
   */
  toString(implicit = true, filter?: FilterObject): string {
    return JSON.stringify(this.toJSON(implicit, filter), null, 2);
  }

  /**
   * Generates a JSON representation of this Property (as JavaScript Object)
   *
   * @example
   * ```JS
   * identifierProperty.toJSON();
   * // returns a JSON representing the property "schema:identifier"
   * {
   *  id: 'schema:identifier',
   *  IRI: 'https://schema.org/identifier',
   *  typeLabel: 'Property',
   *  typeIRI: 'rdf:Property',
   *  vocabURLs: ["https://raw.githubusercontent.com/semantifyit/schemaorg/main/data/releases/12.0/schemaorg-all-https.jsonld"],
   *  vocabulary: 'https://schema.org',
   *  source: null,
   *  supersededBy: null,
   *  name: 'identifier',
   *  description: 'The identifier property represents any kind of identifier for any kind of [[Thing]], such as ISBNs, GTIN codes, UUIDs etc. Schema.org provides dedicated properties for representing many of these, either as textual strings or as URL (URI) links. See [background notes](/docs/datamodel.html#identifierBg) for more details.,
   *  ranges: [
   *    'schema:Text',
   *    'schema:URL',
   *    'schema:PropertyValue',
   *    ...
   *  ],
   *  domains: [
   *    'schema:Thing',
   *    'schema:Event',
   *    'schema:Product',
   *    ...
   *  ],
   *  superProperties: [],
   *  subProperties: [
   *    'schema:gtin12',
   *    'schema:globalLocationNumber',
   *    'schema:leiCode',
   *    ...
   *  ],
   *  inverseOf: null
   * }
   * ```
   *
   *
   * @param implicit - If true, includes also implicit data (e.g. domains, ranges, etc.)
   * @param filter - The filter to be applied on the result
   * @returns The JSON representation of this Property as JavaScript Object
   */
  toJSON(implicit = true, filter?: FilterObject): ToJsonProperty {
    const result = super.toJSON() as ToJsonProperty;
    result["ranges"] = this.getRanges(implicit, filter);
    result["domains"] = this.getDomains(implicit, filter);
    result["superProperties"] = this.getSuperProperties(implicit, filter);
    result["subProperties"] = this.getSubProperties(implicit, filter);
    result["inverseOf"] = this.getInverseOf();
    return result;
  }
}
