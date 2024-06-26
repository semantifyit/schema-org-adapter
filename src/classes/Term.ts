import { Graph } from "./Graph";
import { ToJsonTerm, VocabularyNode } from "../types/types";
import { NS, TermTypeIRIValue, TermTypeLabelValue } from "../data/namespaces";
import { toAbsoluteIRI } from "../utilities/general/toAbsoluteIRI";
import { isNil } from "../utilities/general/isNil";
import { isString } from "../utilities/general/isString";
import { OutputIRIType } from "../types/OutputIRIType.type";
import { outputTransformation } from "../utilities/general/outputTransformation";

// the functions for a term Object
/**
 * @ignore
 */
export abstract class Term {
  abstract readonly termTypeLabel: TermTypeLabelValue;
  abstract readonly termTypeIRI: TermTypeIRIValue;

  /**
   * A vocabulary term. It is identified by its compact IRI.
   *
   * @param IRI - The compact IRI of this Term
   * @param graph - The underlying data graph to enable the methods of this Term
   */
  protected constructor(
    // eslint-disable-next-line no-unused-vars
    protected readonly IRI: string,
    // eslint-disable-next-line no-unused-vars
    protected readonly graph: Graph
  ) {}

  /**
   * Retrieves the IRI of this Term in compact (e.g. `schema:Friday`) or in absolute form (e.g. `https://schema.org/Friday`). By default, the absolute form is returned
   *
   * @example
   * ```JS
   * personClass.getIRI();
   * // returns the absolute IRI of the "schema:Person" Class
   * "https://schema.org/Person"
   *
   * nameProperty.getIRI("Compact");
   * // returns the compact IRI of the "schema:name" Property
   * "schema:name"
   * ```
   * @param outputIRIType - states the format of the returned IRI, either "Compact" for the compact form, e.g. `schema:Friday`, or "Absolute" for the absolute form, e.g. `https://schema.org/Friday`
   * @returns The IRI of this Term
   */
  getIRI(outputIRIType: OutputIRIType = "Absolute"): string {
    if (outputIRIType === "Compact") {
      return this.IRI;
    }
    return toAbsoluteIRI(this.IRI, this.graph.context);
  }

  /**
   * Retrieves the label (string) for the type of this Term:
   * > {@link Class} -> `"Class"`<br>
   * {@link Property} -> `"Property"`<br>
   * {@link Enumeration} -> `"Enumeration"`<br>
   * {@link EnumerationMember} -> `"EnumerationMember"`<br>
   * {@link DataType} -> `"DataType"`
   * @example
   * ```JS
   * personClass.getTermTypeLabel();
   * // returns the term type label of the "schema:Person" Class
   * "Class"
   *
   * nameProperty.getTermTypeLabel();
   * // returns the term type label of the "schema:name" Property
   * "Property"
   * ```
   * @returns The term-type-label of this Term
   */
  getTermTypeLabel() {
    return this.termTypeLabel;
  }

  /**
   * Retrieves the compact IRI for the type of this Term:
   * > {@link Class} -> `"rdfs:Class"`<br>
   * {@link Property} -> `"rdf:Property"`<br>
   * {@link Enumeration} -> `"schema:Enumeration"`<br>
   * {@link EnumerationMember} -> `"soa:EnumerationMember"`<br>
   * {@link DataType} -> `"schema:DataType"`
   * @example
   * ```JS
   * personClass.getTermTypeIRI();
   * // returns the term type IRI of the "schema:Person" Class in compact form
   * "rdfs:Class"
   *
   * nameProperty.getTermTypeIRI();
   * // returns the term type IRI of the "schema:name" Property in compact form
   * "rdf:Property"
   * ```
   *
   * @returns The term-type-IRI of this Term
   */
  getTermTypeIRI() {
    return this.termTypeIRI;
  }

  /**
   * Retrieves the term object of this Term
   *
   * @abstract
   * @returns The term object of this Term
   */
  abstract getTermObj(): VocabularyNode;

  /**
   * Returns the URL of all vocabularies in which this term has been defined. Works only if the corresponding vocabulary was added through a URL, and not as a JSON-LD object.
   *
   * @example
   * ```JS
   * // the parameter `schemaVersion: "12.0"` tells the SDO-Adapter instance to initialize with the schema.org vocabulary version 12.0
   * const mySdoAdapter = await SOA.create({schemaVersion: "12.0"});
   *
   * const personClass = mySdoAdapter.getClass("schema:Person");
   * personClass.getVocabURLs();
   * // returns the source vocabulary url for this class - notice that this url points to version 12.0 of schema.org
   * ["https://raw.githubusercontent.com/semantifyit/schemaorg/main/data/releases/12.0/schemaorg-all-https.jsonld"]
   * ```
   * @returns The original vocabulary source urls of this Term
   */
  getVocabURLs(): string[] | null {
    const termObj = this.getTermObj();
    if (!isNil(termObj["vocabURLs"])) {
      return termObj["vocabURLs"];
    }
    return null;
  }

  /**
   * This method was introduced mainly to return the [vocabulary extension URL of schema.org](https://schema.org/docs/schemas.html) to which the term belongs. The extension URL is defined in the vocabulary through the [`schema:isPartOf`](https://schema.org/isPartOf) property. If no such property is given, then the namespace URL for this term is returned.
   *
   * @example
   * ```JS
   * const personClass = mySdoAdapter.getClass("schema:Person");
   * personClass.getVocabulary();
   * // returns the vocabulary url for the person class, which is the core vocabulary of schema.org
   * "https://schema.org"
   *
   * const patientClass = mySdoAdapter.getClass("schema:Patient");
   * patientClass.getVocabulary();
   * // returns the vocabulary url for the patient class, which is the health extension of schema.org
   * "https://health-lifesci.schema.org"
   * ```
   * @returns The vocabulary URL of this term (extension or namespace)
   */
  getVocabulary(): string {
    const termObj = this.getTermObj();
    // in curateVocabNode() there should always be a value set for isPartOf (it is expected that all vocab nodes have a compact IRI as identifier)
    return termObj[NS.schema.isPartOf];
  }

  /**
   * This method was introduced mainly to return of source(s) for a term, as defined in the vocabulary itself with [`dcterms:source`](https://www.dublincore.org/specifications/dublin-core/dcmi-terms/#http://purl.org/dc/terms/source) or [`schema:source`](https://schema.org/source). The later has been used to link to related github issues for the schema.org vocabulary.
   *
   * @example
   * ```JS
   * const phoneticText = mySdoAdapter.getProperty("schema:phoneticText");
   * phoneticText.getVocabulary();
   * // returns source of the phoneticText property
   * "https://github.com/schemaorg/schemaorg/issues/2108"
   * ```
   *
   * @returns The source IRI given by `dcterms:source` or `schema:source` of this Term
   */
  getSource(): string | string[] | null {
    const termObj = this.getTermObj();
    if (!isNil(termObj[NS.dcterms.source])) {
      return termObj[NS.dcterms.source];
    } else if (!isNil(termObj[NS.schema.source])) {
      return termObj[NS.schema.source];
    }
    return null;
  }

  /**
   * Returns the IRI of the Term superseding this Term (defined with [`schema:supersededBy`](https://schema.org/supersededBy)), if any. By default, the IRI is returned in compact form
   *
   * @example
   * ```JS
   * const requirementsProperty = mySdoAdapter.getProperty("schema:requirements");
   * requirementsProperty.isSupersededBy();
   * // returns IRI for the term that supersedes the property schema:requirements in compact form
   * "schema:softwareRequirements"
   *
   * requirementsProperty.isSupersededBy("Absolute");
   * // returns IRI for the term that supersedes the property schema:requirements in absolute form
   * "https://schema.org/softwareRequirements"
   * ```
   * @param outputIRIType - states the format of the returned IRI, either "Compact" for the compact form, e.g. `schema:softwareRequirements`, or "Absolute" for the absolute form, e.g. `https://schema.org/softwareRequirements`
   * @returns The Term superseding this Term, if any
   */
  isSupersededBy(outputIRIType: OutputIRIType = "Compact"): string | null {
    const termObj = this.getTermObj();
    if (isString(termObj[NS.schema.supersededBy])) {
      return outputTransformation(termObj[NS.schema.supersededBy], this.graph, outputIRIType);
    }
    return null;
  }

  /**
   * Returns the name (`rdfs:label`) of this Term. It is possible to pass a language tag as parameter to get the name in that language, as long as the vocabulary provides that language. The english (`"en"`) language is understood as default.
   *
   * @example
   * ```JS
   * const hotelClass = mySdoAdapter.getClass("schema:Hotel");
   * hotelClass.getName();
   * // returns the (english) name of the class schema:Hotel
   * "Hotel"
   * ```
   *
   * @param language - the wished language for the name (default = `"en"`)
   * @returns  The name of this Term
   */
  getName(language = "en"): string | null {
    const termObj = this.getTermObj()[NS.rdfs.label];
    if (isNil(termObj) || isNil(termObj[language])) {
      return null;
    }
    return termObj[language];
  }

  /**
   * Returns all names (`rdfs:label`) of this Term as an Object. Each name (value) has a language tag (key) associated with it. Language tags are unique for each term (e.g. there is at most one name for any given language).
   *
   * @example
   * ```JS
   * const tigerClass = mySdoAdapter.getClass("ex:Tiger");
   * tigerClass.getNames();
   * // returns the name of this class in all available languages:
   * {
   *   "en": "Tiger",
   *   "de": "Tiger",
   *   "es": "Tigre",
   *   "zh": "虎"
   * }
   * ```
   *
   * @returns  The names (with language tag) of this Term
   */
  getNames(): null | Record<string, string> {
    const termObj = this.getTermObj()[NS.rdfs.label];
    if (isNil(termObj)) {
      return null;
    }
    return termObj;
  }

  /**
   * Returns the description (`rdfs:comment`) of this Term. It is possible to pass a language tag as parameter to get the description in that language, as long as the vocabulary provides that language. The english (`"en"`) language is understood as default.
   *
   * @example
   * ```JS
   * const cwClass = mySdoAdapter.getClass("schema:CreativeWork");
   * cwClass.getDescription();
   * // returns the (english) description of the class schema:CreativeWork
   * "The most generic kind of creative work, including books, movies, photographs, software programs, etc."
   * ```
   *
   * @param language - the wished language for the description (default = `"en"`)
   * @returns The description of this Term
   */
  getDescription(language = "en"): string | null {
    const termObj = this.getTermObj()[NS.rdfs.comment];
    if (isNil(termObj) || isNil(termObj[language])) {
      return null;
    }
    return termObj[language];
  }

  /**
   * Returns all descriptions (`rdfs:comment`) of this Term as an Object. Each description (value) has a language tag (key) associated with it. Language tags are unique for each term (e.g. there is at most one description for any given language)
   *
   * @example
   * ```JS
   * const tigerClass = mySdoAdapter.getClass("ex:Tiger");
   * tigerClass.getDescriptions();
   * // returns the descriptions of this class in all available languages:
   * {
   *   "en": "The tiger (Panthera tigris) is the largest species among the Felidae and classified in the genus Panthera.",
   *   "zh": "虎（学名：Panthera tigris），俗称老虎、大虫，被人称为百獸之王，是現存体型最大的两种猫科动物之一（另一种是狮)"
   * }
   * ```
   *
   * @returns  The descriptions of this Term
   */
  getDescriptions(): null | Record<string, string> {
    const termObj = this.getTermObj()[NS.rdfs.comment];
    if (isNil(termObj)) {
      return null;
    }
    return termObj;
  }

  /**
   * Generates a JSON representation of this Term (as string)
   *
   * @returns The string representation of this Term
   */
  toString(): string {
    return JSON.stringify(this.toJSON(), null, 2);
  }

  /**
   * Generates a JSON representation of this Term (as JavaScript Object)
   *
   * @returns The JSON representation of this Term
   */
  toJSON(): ToJsonTerm {
    return {
      id: this.getIRI("Compact"),
      IRI: this.getIRI("Absolute"),
      typeLabel: this.getTermTypeLabel(),
      typeIRI: this.getTermTypeIRI(),
      vocabURLs: this.getVocabURLs(),
      vocabulary: this.getVocabulary(),
      source: this.getSource(),
      supersededBy: this.isSupersededBy("Compact"),
      name: this.getName(),
      description: this.getDescription()
    };
  }
}
