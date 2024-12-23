import { Graph } from "./Graph";
import axios from "axios";
import { getLatestSchemaVersion, constructURLSchemaVocabulary } from "./Infrastructure";
import { ErrorFunction, ParamObjSdoAdapter, Vocabulary } from "../types/types";
import { Class } from "./Class";
import { Enumeration } from "./Enumeration";
import { EnumerationMember } from "./EnumerationMember";
import { Property } from "./Property";
import { DataType } from "./DataType";
import { isString } from "../utilities/general/isString";
import { isObject } from "../utilities/general/isObject";
import { FilterObject } from "../types/FilterObject.type";
import { toArray } from "../utilities/general/toArray";
import { ParamObjIRIList } from "../types/ParamObjIRIList.type";
import { filterAndTransformIRIList } from "../utilities/general/filterAndTransformIRIList";
import { checkFilterValidity } from "../utilities/reasoning/checkFilterValidity";

/**
 * An **SDOAdapter** is an instance of the library itself that holds its own settings and vocabularies (specified by the user). Based on these internal settings and vocabularies the SDOAdapter provides corresponding data through the methods described below (an SDOAdapter can only provide data about a vocabulary, if that vocabulary has been added to the instance). An SDOAdapter instance is created with {@link create | .create()}, have a look at the different settings.
 * ```JS
 * // load the library
 * const { SOA } = require("schema-org-adapter");
 * // create a new SDOAdapter instance, in this case with the latest schema.org vocabulary
 * const mySdoAdapter = await SOA.create({schemaVersion: "latest"});
 * ```
 */
export class SDOAdapter {
  /** @ignore */
  readonly commit?: string;
  /** @ignore */
  readonly schemaHttps: boolean;
  /** @ignore */
  readonly equateVocabularyProtocols: boolean;
  /** @ignore */
  readonly onError: ErrorFunction;
  /** @ignore */
  readonly graph: Graph;

  /** @ignore
   * The SDOAdapter is a JS-Class that represents the interface between the user and this library. Its methods enable to add vocabularies to its memory as well as retrieving vocabulary items. It is possible to create multiple instances of this JS-Class which use different vocabularies.
   *
   * @param paramObj - an optional parameter object with optional options for the constructor.
   */
  constructor(paramObj?: ParamObjSdoAdapter) {
    // option commit - defaults to undefined
    if (paramObj?.commit) {
      this.commit = paramObj.commit;
    }
    // option onError - defaults to a function that does nothing
    if (typeof paramObj?.onError === "function") {
      this.onError = paramObj.onError;
    } else {
      this.onError = function () {
        // do nothing; The users should pass their own function to handle unexpected errors, they have else no way to hide automatic error messages once the SDO Adapter is compiled
      };
    }
    // option schemaHttps - defaults to true
    if (paramObj?.schemaHttps !== undefined) {
      this.schemaHttps = paramObj.schemaHttps;
    } else {
      this.schemaHttps = true;
    }
    // option equateVocabularyProtocols - defaults to false
    if (paramObj?.equateVocabularyProtocols !== undefined) {
      this.equateVocabularyProtocols = paramObj.equateVocabularyProtocols;
    } else {
      this.equateVocabularyProtocols = false;
    }
    // check validity of default filter (if given)
    if (paramObj?.defaultFilter) {
      checkFilterValidity(paramObj.defaultFilter);
    }

    this.graph = new Graph({
      sdoAdapter: this,
      outputFormat: paramObj?.outputFormat,
      defaultFilter: paramObj?.defaultFilter
    });
  }

  /**
   * This method allows the addition of vocabularies after the SDOAdapter instance has been initialized, as an alternative to the {@link create | vocabulary addition during initialization}. You have to pass the vocabularies either as a JSON-LD vocabularies, or as URLs pointing at such JSON-LD vocabularies. The function {@link constructURLSchemaVocabulary | .constructURLSchemaVocabulary()} helps you to construct URLs for the schema.org vocabulary.
   *
   * @example
   * ```JS
   * const vocabularyOne = require("./myVocabulary.json"); // loads a local JSON-LD vocabulary file
   * const vocabularyTwo = "https://raw.githubusercontent.com/semantifyit/schemaorg/main/data/releases/13.0/schemaorg-all-https.jsonld"; // URL pointing to the schema.org vocabulary
   *
   * // add the two vocabularies to the SDOAdapter instance
   * await mySdoAdapter.addVocabularies( [vocabularyOne, vocabularyTwo] );
   * ```
   *
   * @param vocabArray - The vocabularies to add the graph. Given directly as JSON-LD or as an URL to fetch.
   * @returns This is an async function, returns `true` when done.
   */
  async addVocabularies(vocabArray: string | Vocabulary | (string | Vocabulary)[]): Promise<boolean> {
    vocabArray = toArray(vocabArray);
    // check every vocab if it is a valid JSON-LD. If string -> try to JSON.parse()
    for (const vocab of vocabArray) {
      if (isString(vocab)) {
        if ((vocab as string).startsWith("www") || (vocab as string).startsWith("http")) {
          // assume it is a URL
          try {
            let fetchedVocab = await this.fetchVocabularyFromURL(vocab);
            if (isString(fetchedVocab)) {
              fetchedVocab = JSON.parse(fetchedVocab as string); // try to parse the fetched content as JSON
            }
            await this.graph.addVocabulary(fetchedVocab as Vocabulary, vocab);
          } catch (e) {
            throw new Error("The given URL " + vocab + " did not contain a valid JSON-LD vocabulary.");
          }
        } else {
          // assume it is a string-version of a JSON-LD
          try {
            await this.graph.addVocabulary(JSON.parse(vocab));
          } catch (e) {
            throw new Error("Parsing of vocabulary string produced an invalid JSON-LD.");
          }
        }
      } else if (isObject(vocab)) {
        await this.graph.addVocabulary(vocab);
      } else {
        // invalid argument type!
        throw new Error(
          "The first argument of the function must be an Array of vocabularies or a single vocabulary (JSON-LD as Object/String)"
        );
      }
    }

    return true;
  }

  /** @ignore
   * Fetches a vocabulary from the given URL.
   *
   * @param url - the URL from which the vocabulary should be fetched
   * @returns The fetched vocabulary object (or string, if the server returns a string instead of an object)
   */
  async fetchVocabularyFromURL(url: string): Promise<Vocabulary | string> {
    try {
      const res = await axios.get(url, {
        headers: {
          Accept: "application/ld+json, application/json"
        }
      });
      return res.data;
    } catch (e) {
      throw new Error("Could not find any resource at the given URL.");
    }
  }

  /**
   * Creates a corresponding term instance for the given IRI, depending on its term-type.
   *
   * @example
   * ```JS
   * // creates a Class instance for schema:Hotel - using the compact IRI for identification is the recommended approach
   * const classInstance = mySdoAdapter.getTerm("schema:Hotel");
   *
   * // creates a Property instance for schema:openingHours (handling of http/https is based on the setting "equateVocabularyProtocols")
   * const propertyInstance = mySdoAdapter.getTerm("https://schema.org/openingHours");
   *
   * // creates an Enumeration instance for schema:DayOfWeek - Using the label for identification is risky when you have multiple vocabularies that may have equal labels
   * const enumerationInstance = mySdoAdapter.getTerm("DayOfWeek");
   * ```
   *
   * @param id - The identification string of the wished Term, can be an IRI (absolute or compact) or a label
   * @param filter - The filter to be applied on the result
   * @returns The term instance for the given IRI
   */
  getTerm(id: string, filter?: FilterObject): Class | Enumeration | EnumerationMember | Property | DataType {
    return this.graph.getTerm(id, filter);
  }

  /**
   * Creates an array of term instances (corresponding to their term-types) of all vocabulary Terms known to this SDOAdapter. Depending on the amount of terms, this method could require a lot of resources. If you only need a list of all terms (IRIs), use the method {@link getListOfTerms | .getListOfTerms()} instead.
   *
   * @example
   * ```JS
   * // creates an array with term instances for all terms known to mySdoAdapter
   * const allTermsArray = mySdoAdapter.getAllTerms();
   * ```
   *
   * @param filter - The filter to be applied on the result
   * @returns An array of term instances representing all vocabulary terms
   */
  getAllTerms(filter?: FilterObject): (Class | Enumeration | EnumerationMember | Property | DataType)[] {
    const result = [];
    const classesIRIList = this.getListOfClasses({ filter, outputFormat: "Compact" });
    const enumerationsIRIList = this.getListOfEnumerations({ filter, outputFormat: "Compact" });
    const propertiesIRIList = this.getListOfProperties({ filter, outputFormat: "Compact" });
    const dataTypesIRIList = this.getListOfDataTypes({ filter, outputFormat: "Compact" });
    const enumerationMembersIRIList = this.getListOfEnumerationMembers({ filter, outputFormat: "Compact" });
    for (const c of classesIRIList) {
      result.push(this.getClass(c));
    }
    for (const en of enumerationsIRIList) {
      result.push(this.getEnumeration(en));
    }
    for (const p of propertiesIRIList) {
      result.push(this.getProperty(p));
    }
    for (const dt of dataTypesIRIList) {
      result.push(this.getDataType(dt));
    }
    for (const enm of enumerationMembersIRIList) {
      result.push(this.getEnumerationMember(enm));
    }
    return result;
  }

  /**
   * Creates an array of IRIs of all vocabulary Terms known to this SDOAdapter.
   *
   * @example
   * ```JS
   * const allTermsArray = mySdoAdapter.getListOfTerms();
   * // creates an array with IRIs of all terms known to mySdoAdapter
   * [
   *   'schema:CollegeOrUniversity',
   *   'schema:name',
   *   'schema:Monday',
   *   ...
   * ]
   *
   * const allTermsArrayAbsoluteIRIs = mySdoAdapter.getListOfTerms({outputFormat: "Absolute"});
   * // creates an array with absolute IRIs
   * [
   *   'https://schema.org/CollegeOrUniversity',
   *   'https://schema.org/name',
   *   'https://schema.org/Monday',
   *   ...
   * ]
   * ```
   *
   * @param paramObj - an optional parameter object that filters and formats the result
   * @returns An array of IRIs representing all vocabulary terms
   */
  getListOfTerms(paramObj?: ParamObjIRIList): string[] {
    const result = [];
    result.push(...Object.keys(this.graph.classes));
    result.push(...Object.keys(this.graph.enumerations));
    result.push(...Object.keys(this.graph.properties));
    result.push(...Object.keys(this.graph.dataTypes));
    result.push(...Object.keys(this.graph.enumerationMembers));
    return filterAndTransformIRIList(result, this.graph, paramObj);
  }

  /**
   * Creates a Class instance for the given IRI. If the given IRI belongs to an Enumeration, an Enumeration instance is returned.
   *
   * @example
   * ```JS
   * // creates a Class instance for schema:Hotel
   * const classInstance = mySdoAdapter.getClass("schema:Hotel");
   * ```
   *
   * @param id - The identification string of the wished Class, can be an IRI (absolute or compact) or a label
   * @param filter - The filter to be applied on the result
   * @returns The Class instance for the given IRI
   */
  getClass(id: string, filter?: FilterObject): Class {
    // returns also enumerations
    return this.graph.getClass(id, filter);
  }

  /**
   * Creates an array of Class instances of all class terms (excluding Enumerations) known to this SDOAdapter. Depending on the amount of classes, this method could require a lot of resources. If you only need a list of all classes (IRIs), use the method {@link getListOfClasses | .getListOfClasses()} instead.
   *
   * @example
   * ```JS
   * // creates an array with Class instances for all classes known to mySdoAdapter
   * const allClassesArray = mySdoAdapter.getAllClasses();
   * ```
   *
   * @param filter - The filter to be applied on the result
   * @returns An array of Class instances representing all class terms
   */
  getAllClasses(filter?: FilterObject): Class[] {
    const result = [];
    const classesIRIList = this.getListOfClasses({ filter, outputFormat: "Compact" });
    for (const c of classesIRIList) {
      result.push(this.getClass(c));
    }
    return result;
  }

  /**
   * Creates an array of IRIs of all class terms (excluding Enumerations) known to this SDOAdapter.
   *
   * @example
   * ```JS
   * const allClassesArray = mySdoAdapter.getListOfClasses();
   * // creates an array with IRIs of all class terms known to mySdoAdapter
   * [
   *   'schema:CollegeOrUniversity',
   *   'schema:Hotel',
   *   'schema:Patient',
   *   ...
   * ]
   *
   * const allClassesArrayAbsoluteIRIs = mySdoAdapter.getListOfClasses({outputFormat: "Absolute"});
   * // creates an array with absolute IRIs
   * [
   *   'https://schema.org/CollegeOrUniversity',
   *   'https://schema.org/Hotel',
   *   'https://schema.org/Patient',
   *   ...
   * ]
   * ```
   *
   * @param paramObj - an optional parameter object that filters and formats the result
   * @returns An array of IRIs representing all class terms
   */
  getListOfClasses(paramObj?: ParamObjIRIList): string[] {
    // do not include enumerations
    return filterAndTransformIRIList(Object.keys(this.graph.classes), this.graph, paramObj);
  }

  /**
   * Creates a Property instance for the given IRI.
   *
   * @example
   * ```JS
   * // creates a Property instance for schema:name
   * const propertyInstance = mySdoAdapter.getProperty("schema:name");
   * ```
   *
   * @param id - The identification string of the wished Property, can be an IRI (absolute or compact) or a label
   * @param filter - The filter to be applied on the result
   * @returns The Property instance for the given IRI
   */
  getProperty(id: string, filter?: FilterObject): Property {
    return this.graph.getProperty(id, filter);
  }

  /**
   * Creates an array of Property instances of all property terms known to this SDOAdapter. Depending on the amount of properties, this method could require a lot of resources. If you only need a list of all properties (IRIs), use the method {@link getListOfProperties | .getListOfProperties()} instead.
   *
   * @example
   * ```JS
   * // creates an array with Property instances for all properties known to mySdoAdapter
   * const allPropertiesArray = mySdoAdapter.getAllProperties();
   * ```
   *
   * @param filter - The filter to be applied on the result
   * @returns An array of Property instances representing all property terms
   */
  getAllProperties(filter?: FilterObject): Property[] {
    const result = [];
    const propertiesIRIList = this.getListOfProperties({ filter, outputFormat: "Compact" });
    for (const p of propertiesIRIList) {
      result.push(this.getProperty(p));
    }
    return result;
  }

  /**
   * Creates an array of IRIs of all property terms known to this SDOAdapter.
   *
   * @example
   * ```JS
   * const allPropertiesArray = mySdoAdapter.getListOfProperties();
   * // creates an array with IRIs of all property terms known to mySdoAdapter
   * [
   *   'schema:name',
   *   'schema:url',
   *   'schema:openingHours',
   *   ...
   * ]
   *
   * const allPropertiesArrayAbsoluteIRIs = mySdoAdapter.getListOfProperties({outputFormat: "Absolute"});
   * // creates an array with absolute IRIs
   * [
   *   'https://schema.org/name',
   *   'https://schema.org/url',
   *   'https://schema.org/openingHours',
   *   ...
   * ]
   * ```
   *
   * @param paramObj - an optional parameter object that filters and formats the result
   * @returns An array of IRIs representing all property terms
   */
  getListOfProperties(paramObj?: ParamObjIRIList): string[] {
    return filterAndTransformIRIList(Object.keys(this.graph.properties), this.graph, paramObj);
  }

  /**
   * Creates a DataType instance for the given IRI.
   *
   * @example
   * ```JS
   * // creates a DataType instance for schema:Number
   * const dataTypeInstance = mySdoAdapter.getDataType("schema:Number");
   * ```
   *
   * @param id - The identification string of the wished DataType, can be an IRI (absolute or compact) or a label
   * @param filter - The filter to be applied on the result
   * @returns The DataType instance for the given IRI
   */
  getDataType(id: string, filter?: FilterObject): DataType {
    return this.graph.getDataType(id, filter);
  }

  /**
   * Creates an array of DataType instances of all data-type terms known to this SDOAdapter. Depending on the amount of data-types, this method could require a lot of resources. If you only need a list of all data-types (IRIs), use the method {@link getListOfDataTypes | .getListOfDataTypes()} instead.
   *
   * @example
   * ```JS
   * // creates an array with DataType instances for all data-types known to mySdoAdapter
   * const allDataTypesArray = mySdoAdapter.getAllDataTypes();
   * ```
   *
   * @param filter - The filter to be applied on the result
   * @returns An array of DataType instances representing all data-type terms
   */
  getAllDataTypes(filter?: FilterObject): DataType[] {
    const result = [];
    const dataTypesIRIList = this.getListOfDataTypes({ filter, outputFormat: "Compact" });
    for (const dt of dataTypesIRIList) {
      result.push(this.getDataType(dt));
    }
    return result;
  }

  /**
   * Creates an array of IRIs of all data-type terms known to this SDOAdapter.
   *
   * @example
   * ```JS
   * const allDataTypesArray = mySdoAdapter.getListOfDataTypes();
   * // creates an array with IRIs of all data-type terms known to mySdoAdapter
   * [
   *   'schema:Text',
   *   'schema:URL',
   *   'schema:Date',
   *   ...
   * ]
   *
   * const allDataTypesArrayAbsoluteIRIs = mySdoAdapter.getListOfDataTypes({outputFormat: "Absolute"});
   * // creates an array with absolute IRIs
   * [
   *   'https://schema.org/Text',
   *   'https://schema.org/URL',
   *   'https://schema.org/Date',
   *   ...
   * ]
   * ```
   *
   * @param paramObj - an optional parameter object that filters and formats the result
   * @returns An array of IRIs representing all data-type terms
   */
  getListOfDataTypes(paramObj?: ParamObjIRIList): string[] {
    return filterAndTransformIRIList(Object.keys(this.graph.dataTypes), this.graph, paramObj);
  }

  /**
   * Creates an Enumeration instance for the given IRI.
   *
   * @example
   * ```JS
   * // creates an Enumeration instance for schema:DayOfWeek
   * const enumerationInstance = mySdoAdapter.getEnumeration("schema:DayOfWeek");
   * ```
   *
   * @param id - The identification string of the wished Enumeration, can be an IRI (absolute or compact) or a label
   * @param filter - The filter to be applied on the result
   * @returns The Enumeration instance for the given IRI
   */
  getEnumeration(id: string, filter?: FilterObject): Enumeration {
    return this.graph.getEnumeration(id, filter);
  }

  /**
   * Creates an array of Enumeration instances of all enumeration terms known to this SDOAdapter. Depending on the amount of enumerations, this method could require a lot of resources. If you only need a list of all enumerations (IRIs), use the method {@link getListOfEnumerations | .getListOfEnumerations()} instead.
   *
   * @example
   * ```JS
   * // creates an array with Enumeration instances for all enumerations known to mySdoAdapter
   * const allEnumerationsArray = mySdoAdapter.getAllEnumerations();
   * ```
   *
   * @param filter - The filter to be applied on the result
   * @returns An array of Enumeration instances representing all enumeration terms
   */
  getAllEnumerations(filter?: FilterObject): Enumeration[] {
    const result = [];
    const enumerationsIRIList = this.getListOfEnumerations({ filter, outputFormat: "Compact" });
    for (const en of enumerationsIRIList) {
      result.push(this.getEnumeration(en));
    }
    return result;
  }

  /**
   * Creates an array of IRIs of all enumeration terms known to this SDOAdapter.
   *
   * @example
   * ```JS
   * const allEnumerationsArray = mySdoAdapter.getListOfEnumerations();
   * // creates an array with IRIs of all enumeration terms known to mySdoAdapter
   * [
   *   'schema:DayOfWeek',
   *   'schema:GenderType',
   *   ...
   * ]
   *
   * const allEnumerationsArrayAbsoluteIRIs = mySdoAdapter.getListOfEnumerations({outputFormat: "Absolute"});
   * // creates an array with absolute IRIs
   * [
   *   'https://schema.org/DayOfWeek',
   *   'https://schema.org/GenderType',
   *   ...
   * ]
   * ```
   *
   * @param paramObj - an optional parameter object that filters and formats the result
   * @returns An array of IRIs representing all enumeration terms
   */
  getListOfEnumerations(paramObj?: ParamObjIRIList): string[] {
    return filterAndTransformIRIList(Object.keys(this.graph.enumerations), this.graph, paramObj);
  }

  /**
   * Creates an EnumerationMember instance for the given IRI.
   *
   * @example
   * ```JS
   * // creates an EnumerationMember instance for schema:Monday
   * const enumerationMemberInstance = mySdoAdapter.getEnumerationMember("schema:Monday");
   * ```
   *
   * @param id - The identification string of the wished EnumerationMember, can be an IRI (absolute or compact) or a label
   * @param filter - The filter to be applied on the result
   * @returns The EnumerationMember instance for the given IRI
   */
  getEnumerationMember(id: string, filter?: FilterObject): EnumerationMember {
    return this.graph.getEnumerationMember(id, filter);
  }

  /**
   * Creates an array of EnumerationMember instances of all enumeration member terms known to this SDOAdapter. Depending on the amount of enumeration members, this method could require a lot of resources. If you only need a list of all enumeration members (IRIs), use the method {@link getListOfEnumerationMembers | .getListOfEnumerationMembers()} instead.
   *
   * @example
   * ```JS
   * // creates an array with EnumerationMember instances for all enumeration members known to mySdoAdapter
   * const allEnumerationMembersArray = mySdoAdapter.getAllEnumerationMembers();
   * ```
   *
   * @param filter - The filter to be applied on the result
   * @returns An array of EnumerationMember instances representing all enumeration member terms
   */
  getAllEnumerationMembers(filter?: FilterObject): EnumerationMember[] {
    const result = [];
    const enumerationMembersIRIList = this.getListOfEnumerationMembers({ filter, outputFormat: "Compact" });
    for (const enm of enumerationMembersIRIList) {
      result.push(this.getEnumerationMember(enm));
    }
    return result;
  }

  /**
   * Creates an array of IRIs of all enumeration member terms known to this SDOAdapter.
   *
   * @example
   * ```JS
   * const allEnumerationMembersArray = mySdoAdapter.getListOfEnumerationMembers();
   * // creates an array with IRIs of all enumeration member terms known to mySdoAdapter
   * [
   *   'schema:PublicHolidays',
   *   'schema:UnofficialLegalValue',
   *   'schema:SoundtrackAlbum',
   *   ...
   * ]
   *
   * const allEnumerationMembersArrayAbsoluteIRIs = mySdoAdapter.getListOfEnumerationMembers({outputFormat: "Absolute"});
   * // creates an array with absolute IRIs
   * [
   *   'https://schema.org/PublicHolidays',
   *   'https://schema.org/UnofficialLegalValue',
   *   'https://schema.org/SoundtrackAlbum',
   *   ...
   * ]
   * ```
   *
   * @param paramObj - an optional parameter object that filters and formats the result
   * @returns An array of IRIs representing all enumeration member terms
   */
  getListOfEnumerationMembers(paramObj?: ParamObjIRIList): string[] {
    return filterAndTransformIRIList(Object.keys(this.graph.enumerationMembers), this.graph, paramObj);
  }

  /**
   * Returns an object with key-value pairs representing the vocabulary indicators (used in compact IRIs) and their namespaces, that are used in this SDOAdapter. Vocabularies that are perceived as standard namespaces (e.g. in the context of schema.org or sdo-adapter), and not as vocabularies for the content of SDOAdapter are omitted by default, you can change this behaviour by passing the argument `omitStandardVocabs: false`.
   *
   * @example
   * ```JS
   * // assume mySdoAdapter has been initialized with schema.org and another example vocabulary
   * const usedVocabularies = mySdoAdapter.getVocabularies(); // same as mySdoAdapter.getVocabularies(true)
   * // creates an object with vocabulary indicators as keys, and their vocabulary namespaces as values
   * {
   *   "schema": "https://schema.org/",
   *   "ex": "https://example-vocab.ex/"
   * }
   * ```
   *
   * @returns An object containing key-value pairs representing the used vocabulary namespaces
   */
  getVocabularies(omitStandardVocabs = true): Record<string, string> {
    const vocabKeys = Object.keys(this.graph.context);
    const result = {} as Record<string, string>;
    // standard vocabs that should not be exposed - schema: is used as a vocabulary for the content, so it is allowed
    // includes:
    // 1. standard vocabularies used in the schema.org context
    // 2. vocabularies used in SDO-Adapter internally (soa)
    // 3. the vocabulary for Domain Specifications ("ds": "https://vocab.sti2.at/ds/")
    const blacklist = [
      "soa",
      "xsd",
      "rdf",
      "rdfa",
      "rdfs",
      "dcterms",
      "brick",
      "csvw",
      "dc",
      "dcam",
      "dcat",
      "dcmitype",
      "doap",
      "foaf",
      "odrl",
      "org",
      "owl",
      "prof",
      "prov",
      "qb",
      "sh",
      "skos",
      "sosa",
      "ssn",
      "time",
      "vann",
      "void",
      "geo",
      "wgs",
      "ds"
    ];
    vocabKeys.forEach((el) => {
      if (isString(this.graph.context[el]) && (!omitStandardVocabs || !blacklist.includes(el))) {
        result[el] = this.graph.context[el] as string;
      }
    });
    return result;
  }

  /**
   * Returns the latest version identifier for the schema.org vocabulary.
   * The internal cache is used for this function. If you want to reset the cache, use the global library function {@link fetchSchemaVersions | .fetchSchemaVersions()}.
   *
   * @example
   * ```JS
   * const latestSchemaVersion = await mySdoAdapter.getLatestSchemaVersion();
   * // get the latest schema.org vocabulary version identifier
   * "13.0"
   * ```
   *
   * @returns The latest version of the schema.org vocabulary
   */
  async getLatestSchemaVersion(): Promise<string> {
    return await getLatestSchemaVersion(this.commit);
  }

  /**
   * Creates a URL pointing to the Schema.org vocabulary for the wished version. This URL can then be added to the SDOAdapter to retrieve the Schema.org vocabulary.
   * The Schema.org version listing at https://raw.githubusercontent.com/schemaorg/schemaorg/main/versions.json is used for this function. Check https://schema.org/docs/developers.html for more information.
   * The internal cache is used for this function. If you want to reset the cache, use the global library function {@link fetchSchemaVersions | .fetchSchemaVersions()}.
   *
   * @example
   * ```JS
   *
   * const schemaUrl = await mySdoAdapter.constructURLSchemaVocabulary("13.0");
   * // creates following URL pointing to the schema.org vocabulary version 13.0
   * "https://raw.githubusercontent.com/semantifyit/schemaorg/main/data/releases/13.0/schemaorg-all-https.jsonld"
   * ```
   *
   * @param version - The wished Schema.org vocabulary version for the resulting URL (e.g. "5.0", "3.7", or "latest"). default: "latest"
   * @returns The URL to the Schema.org vocabulary
   */
  async constructURLSchemaVocabulary(version = "latest"): Promise<string> {
    return await constructURLSchemaVocabulary(version, this.schemaHttps, this.commit);
  }

  /**
   * Returns the default filter specified for this SDOAdapter, if any
   *
   * @example
   * ```JS
   * const defaultFilter = mySdoAdapter.getDefaultFilter();
   * ```
   *
   * @returns The default filter of this SDOAdapter, if any
   */
  getDefaultFilter() {
    return this.graph.defaultFilter;
  }

  /**
   * Overwrites the default filter for this SDOAdapter. The default filter is not supposed to change often, and should be set during the creation of a SDOAdapter instance.
   *
   * @example
   * ```JS
   * mySdoAdapter.setDefaultFilter({
   *   schemaModuleExclude: "attic",
   *   isSuperseded: false
   * });
   * ```
   *
   * @param defaultFilter - The default filter for this SDOAdapter (pass no parameter to reset the filter)
   */
  setDefaultFilter(defaultFilter?: FilterObject) {
    this.graph.defaultFilter = defaultFilter;
  }
}
