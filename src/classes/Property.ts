// the functions for a property Object
import { Term } from "./Term";
import { ToJsonProperty, VocabularyNode } from "../types/types";
import { Graph } from "./Graph";
import { NS, TermTypeIRI, TermTypeLabel } from "../data/namespaces";
import { inferSubDataTypes } from "../utilities/reasoning/inferSubDataTypes";
import { inferSubClasses } from "../utilities/reasoning/inferSubClasses";
import { inferSuperProperties } from "../utilities/reasoning/inferSuperProperties";
import { inferSubProperties } from "../utilities/reasoning/inferSubProperties";
import { ParamObjIRIListInference } from "../types/ParamObjIRIListInference.type";
import { filterAndTransformIRIList } from "../utilities/general/filterAndTransformIRIList";
import { OutputIRIType } from "../types/OutputIRIType.type";
import { outputTransformation } from "../utilities/general/outputTransformation";
import { isString } from "../utilities/general/isString";

/**
 * A **Property** represents a property term, which is used to describe a relationship between subject resources (their domains) and object resources (their ranges). A Property is identified by its IRI (e.g. [schema:name](https://schema.org/name)), where, by convention, the property name itself starts with a lowercase letter. A Property instance is created with {@link SDOAdapter.getProperty | SDOAdapter.getProperty()} and offers the methods described below.
 *
 * ```JS
 * // following Property instance is used in the code examples below
 * const identifierProperty = mySdoAdapter.getProperty("schema:identifier");
 * // it is also possible to create a Property instance with an absolute IRI or a label
 * const identifierProperty2 = mySdoAdapter.getProperty("https://schema.org/identifier");
 * const identifierProperty3 = mySdoAdapter.getProperty("identifier");
 * ```
 */
export class Property extends Term {
  /** @ignore */
  readonly termTypeLabel = TermTypeLabel.property;
  /** @ignore */
  readonly termTypeIRI = TermTypeIRI.property;

  /** @ignore
   * A Property represents a rdf:Property. It is identified by its compact IRI
   *
   * @param IRI - The compact IRI of this Property, e.g. "schema:address"
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
   * @param paramObj - an optional parameter object that filters and formats the result, and defines the inference behaviour: The "implicit"-parameter defaults to true and returns also implicit ranges inherited from subclasses of the ranges
   * @returns The ranges of this Property
   */
  getRanges(paramObj?: ParamObjIRIListInference): string[] {
    const propertyObj = this.getTermObj();
    const result = [];
    result.push(...propertyObj[NS.schema.rangeIncludes]);
    // only skip if implicit is set to false
    if (!(paramObj?.implicit === false)) {
      // add subclasses and sub-data-types from ranges
      for (const actRes of result) {
        result.push(...inferSubDataTypes(actRes, this.graph));
      }
      for (const actRes of result) {
        result.push(...inferSubClasses(actRes, this.graph));
      }
    }
    return filterAndTransformIRIList(result, this.graph, paramObj);
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
   * @param paramObj - an optional parameter object that filters and formats the result, and defines the inference behaviour: The "implicit"-parameter defaults to true and returns also implicit domains inherited from subclasses of the domains
   * @returns The domains of this Property
   */
  getDomains(paramObj?: ParamObjIRIListInference): string[] {
    const propertyObj = this.getTermObj();
    const result = [];
    result.push(...propertyObj[NS.schema.domainIncludes]);
    // only skip if implicit is set to false
    if (!(paramObj?.implicit === false)) {
      // add subclasses from domains
      const inferredSubClasses = [];
      for (const actRes of result) {
        inferredSubClasses.push(...inferSubClasses(actRes, this.graph));
      }
      result.push(...inferredSubClasses);
    }
    return filterAndTransformIRIList(result, this.graph, paramObj);
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
   * @param paramObj - an optional parameter object that filters and formats the result, and defines the inference behaviour: The "implicit"-parameter defaults to true and returns also implicit super-properties inherited recursively from super-properties
   * @returns The super-properties of this Property
   */
  getSuperProperties(paramObj?: ParamObjIRIListInference): string[] {
    const propertyObj = this.getTermObj();
    const result = [];
    // only skip if implicit is set to false
    if (!(paramObj?.implicit === false)) {
      result.push(...inferSuperProperties(this.IRI, this.graph));
    } else {
      result.push(...propertyObj[NS.rdfs.subPropertyOf]);
    }
    return filterAndTransformIRIList(result, this.graph, paramObj);
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
   * @param paramObj - an optional parameter object that filters and formats the result, and defines the inference behaviour: The "implicit"-parameter defaults to true and returns also implicit sub-properties inherited recursively from sub-properties
   * @returns The sub-properties of this Property
   */
  getSubProperties(paramObj?: ParamObjIRIListInference): string[] {
    const propertyObj = this.getTermObj();
    const result = [];
    // only skip if implicit is set to false
    if (!(paramObj?.implicit === false)) {
      result.push(...inferSubProperties(this.IRI, this.graph));
    } else {
      result.push(...propertyObj[NS.soa.superPropertyOf]);
    }
    return filterAndTransformIRIList(result, this.graph, paramObj);
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
   * @param outputIRIType - states the format of the returned IRI, either "Compact" for the compact form, e.g. `schema:alumni`, or "Absolute" for the absolute form, e.g. `https://schema.org/alumni`
   * @returns The IRI of the inverse Property of this Property, if any
   */
  getInverseOf(outputIRIType: OutputIRIType = "Compact"): string | null {
    const propertyObj = this.getTermObj();
    if (isString(propertyObj[NS.schema.inverseOf])) {
      return outputTransformation(propertyObj[NS.schema.inverseOf], this.graph, outputIRIType);
    }
    return null;
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
   * @param paramObj - an optional parameter object that filters and formats the result, and defines the inference behaviour: The "implicit"-parameter defaults to true and returns also implicit data (e.g. domains, ranges, etc.)
   * @returns The JSON representation of this Property as string
   */
  toString(paramObj?: ParamObjIRIListInference): string {
    return JSON.stringify(this.toJSON(paramObj), null, 2);
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
   *  description: 'The identifier property represents any kind of identifier for any kind of [[Thing]], such as ISBNs, GTIN codes, UUIDs etc. Schema.org provides dedicated properties for representing many of these, either as textual strings or as URL (IRI) links. See [background notes](/docs/datamodel.html#identifierBg) for more details.,
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
   * @param paramObj - an optional parameter object that filters and formats the result, and defines the inference behaviour: The "implicit"-parameter defaults to true and returns also implicit data (e.g. domains, ranges, etc.)
   * @returns The JSON representation of this Property as JavaScript Object
   */
  toJSON(paramObj?: ParamObjIRIListInference): ToJsonProperty {
    const result = super.toJSON() as ToJsonProperty;
    result["ranges"] = this.getRanges(paramObj);
    result["domains"] = this.getDomains(paramObj);
    result["superProperties"] = this.getSuperProperties(paramObj);
    result["subProperties"] = this.getSubProperties(paramObj);
    result["inverseOf"] = this.getInverseOf(paramObj?.outputFormat);
    return result;
  }

  /**
   * Returns true, if the given domain (class or enumeration) is a valid domain of this property. The implicit parameter (default: true) allows to cover recursive relationships (e.g. the subclasses of a domain are also taken into account)
   * @example
   * ```JS
   * nameProperty.isValidDomain("schema:Thing"); // true
   * nameProperty.isValidDomain("schema:Person"); // true
   * nameProperty.isValidDomain("schema:DayOfWeek"); // true, it is an enumeration, but has "Enumeration" and therefore also "Thing" as superclass
   * nameProperty.isValidDomain("schema:Person", true); // true
   * nameProperty.isValidDomain("schema:Person", false); // false, since only direct domains are considered
   * ```
   *
   * @param domainId - The identification string of the domain in question, can be an IRI (absolute or compact) or a label
   * @param implicit - If true, includes also subclasses of domains
   * @returns if the given class/enumeration is a valid domain of this property
   */
  isValidDomain(domainId: string, implicit = true): boolean {
    const domains = this.getDomains({ implicit, outputFormat: "Compact" });
    const compactIRI = this.graph.discoverCompactIRI(domainId);
    if (compactIRI && domains.includes(compactIRI)) {
      // try "dry-run" with compactIRI, to not have to create an instance (which may even not exist in the current vocab)
      return true;
    }
    const domain = this.graph.getClass(domainId); // includes enumerations
    // if there is an error here, at this point we got no "right" compact IRI as input and there is no property identified with the input
    // if we just return "false" the user may not differentiate between an intended inference result and some non-existing term (or not matching termType, which may also not been intended)
    return domains.includes(domain.getIRI("Compact"));
  }

  /**
   * Returns true, if the given term (Class, Enumeration, DataType) is a valid range of this property. The implicit parameter (default: true) allows to cover recursive relationships (e.g. the subclasses/types of a range are also taken into account)
   * @example
   * ```JS
   * inLanguageProperty.isValidRange("schema:Text"); // true
   * inLanguageProperty.isValidRange("schema:Language"); // true
   * inLanguageProperty.isValidRange("schema:URL"); // true (subtype of Text)
   * inLanguageProperty.isValidRange("schema:Text", true); // true
   * inLanguageProperty.isValidRange("schema:URL", false); // false, since only direct ranges are considered
   * ```
   *
   * @param rangeId - The identification string of the range in question, can be an IRI (absolute or compact) or a label
   * @param implicit - If true, includes also subclasses of ranges
   * @returns if the given class/enumeration/dataType is a valid range of this property
   */
  isValidRange(rangeId: string, implicit = true): boolean {
    const ranges = this.getRanges({ implicit, outputFormat: "Compact" });
    const compactIRI = this.graph.discoverCompactIRI(rangeId);
    if (compactIRI && ranges.includes(compactIRI)) {
      // try "dry-run" with compactIRI, to not have to create an instance (which may even not exist in the current vocab)
      return true;
    }
    const range = this.graph.getTerm(rangeId);
    // if there is an error here, at this point we got no "right" compact IRI as input and there is no property identified with the input
    // if we just return "false" the user may not differentiate between an intended inference result and some non-existing term
    return ranges.includes(range.getIRI("Compact"));
  }

  /**
   * Returns true, if the given property is a valid sub-property of this property. The implicit parameter (default: true) allows to cover recursive relationships (e.g. the sub-properties of a sub-property are also taken into account)
   * @example
   * ```JS
   * hasPartProperty.isValidSuperPropertyOf("schema:season"); // true
   * hasPartProperty.isValidSuperPropertyOf("schema:season", true); // true
   * hasPartProperty.isValidSuperPropertyOf("schema:season", false); // true, (is a direct sub-property)
   * ```
   *
   * @param subPropertyId - The identification string of the sub-property in question, can be an IRI (absolute or compact) or a label
   * @param implicit - If true, includes also sub-properties of sub-properties
   * @returns if the given property is a valid sub-property of this property
   */
  isValidSuperPropertyOf(subPropertyId: string, implicit = true): boolean {
    const subProperties = this.getSubProperties({ implicit, outputFormat: "Compact" });
    const compactIRI = this.graph.discoverCompactIRI(subPropertyId);
    if (compactIRI && subProperties.includes(compactIRI)) {
      // try "dry-run" with compactIRI, to not have to create an instance (which may even not exist in the current vocab)
      return true;
    }
    const p = this.graph.getProperty(subPropertyId);
    // if there is an error here, at this point we got no "right" compact IRI as input and there is no property identified with the input
    // if we just return "false" the user may not differentiate between an intended inference result and some non-existing term (or not matching termType, which may also not been intended)
    return subProperties.includes(p.getIRI("Compact"));
  }

  /**
   * Returns true, if the given property is a valid super-property of this property. The implicit parameter (default: true) allows to cover recursive relationships (e.g. the super-properties of a super-property are also taken into account)
   * @example
   * ```JS
   * seasonProperty.isValidSubPropertyOf("schema:hasPart"); // true
   * seasonProperty.isValidSubPropertyOf("schema:hasPart", true); // true
   * seasonProperty.isValidSubPropertyOf("schema:hasPart", false); // true, (is a direct sub-property)
   * ```
   *
   * @param superPropertyId - The identification string of the super-property in question, can be an IRI (absolute or compact) or a label
   * @param implicit - If true, includes also super-properties of super-properties
   * @returns if the given property is a valid super-property of this property
   */
  isValidSubPropertyOf(superPropertyId: string, implicit = true): boolean {
    const superProperties = this.getSuperProperties({ implicit, outputFormat: "Compact" });
    const compactIRI = this.graph.discoverCompactIRI(superPropertyId);
    if (compactIRI && superProperties.includes(compactIRI)) {
      // try "dry-run" with compactIRI, to not have to create an instance (which may even not exist in the current vocab)
      return true;
    }
    const p = this.graph.getProperty(superPropertyId);
    // if there is an error here, at this point we got no "right" compact IRI as input and there is no property identified with the input
    // if we just return "false" the user may not differentiate between an intended inference result and some non-existing term (or not matching termType, which may also not been intended)
    return superProperties.includes(p.getIRI("Compact"));
  }

  /**
   * Returns true, if the given property is the inverse property of this property
   * @example
   * ```JS
   * memberProperty.isValidInverseOf("schema:memberOf"); // true
   * memberOfProperty.isValidInverseOf("schema:member"); // true
   * brandProperty.isValidInverseOf("schema:name"); // false
   * ```
   *
   * @param inversePropertyId - The identification string of the inverse property in question, can be an IRI (absolute or compact) or a label
   * @returns if the given property is the inverse property of this property
   */
  isValidInverseOf(inversePropertyId: string): boolean {
    const inverse = this.getInverseOf("Compact");
    const compactIRI = this.graph.discoverCompactIRI(inversePropertyId);
    if (compactIRI && inverse === compactIRI) {
      // try "dry-run" with compactIRI, to not have to create an instance (which may even not exist in the current vocab)
      return true;
    }
    const p = this.graph.getProperty(inversePropertyId);
    // if there is an error here, at this point we got no "right" compact IRI as input and there is no property identified with the input
    // if we just return "false" the user may not differentiate between an intended inference result and some non-existing term (or not matching termType, which may also not been intended)
    return inverse === p.getIRI("Compact");
  }
}
