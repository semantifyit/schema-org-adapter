import { Graph } from "./Graph";
import axios from "axios";
import {
  getLatestSchemaVersion,
  constructURLSchemaVocabulary,
  isArray,
  isObject,
  isString,
  toArray,
} from "./utilities";
import {
  ErrorFunction,
  FilterObject,
  ParamObjSdoAdapter,
  Vocabulary,
} from "./types";
import { applyFilter } from "./reasoning";
import { Class } from "./Class";
import { Enumeration } from "./Enumeration";
import { EnumerationMember } from "./EnumerationMember";
import { Property } from "./Property";
import { DataType } from "./DataType";

/**
 * An **SDOAdapter** is an instance of the library itself that holds its own settings and vocabularies (specified by the user). Based on these internal settings and vocabularies the SDOAdapter provides corresponding data through the methods described below (an SDOAdapter can only provide data about a vocabulary, if that vocabulary has been added to the instance). An SDOAdapter instance is created with {@link create | .create()}, have a look at the different settings.
 * ```JS
 * // load the library
 * const SDOAdapter = require("schema-org-adapter");
 * // create a new SDOAdapter instance, in this case with the latest schema.org vocabulary
 * const mySdoAdapter = await SDOAdapter.create({schemaVersion: "latest"});
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
    if (paramObj && paramObj.commit) {
      this.commit = paramObj.commit;
    }
    // option onError - defaults to a function that does nothing
    if (paramObj && typeof paramObj.onError === "function") {
      this.onError = paramObj.onError;
    } else {
      this.onError = function () {
        // do nothing; The users should pass their own function to handle errors, they have else no way to hide automatic error messages once the SDO Adapter is compiled
      };
    }
    // option schemaHttps - defaults to true
    if (paramObj && paramObj.schemaHttps !== undefined) {
      this.schemaHttps = paramObj.schemaHttps;
    } else {
      this.schemaHttps = true;
    }
    // option equateVocabularyProtocols - defaults to false
    if (paramObj && paramObj.equateVocabularyProtocols !== undefined) {
      this.equateVocabularyProtocols = paramObj.equateVocabularyProtocols;
    } else {
      this.equateVocabularyProtocols = false;
    }
    this.graph = new Graph(this);
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
   * await SDOAdapter.addVocabularies( [vocabularyOne, vocabularyTwo] );
   * ```
   *
   * @param vocabArray - The vocabularies to add the graph. Given directly as JSON-LD or as an URL to fetch.
   * @returns This is an async function, returns `true` when done.
   */
  async addVocabularies(
    vocabArray: string | Vocabulary | (string | Vocabulary)[]
  ) {
    if (!isArray(vocabArray)) {
      vocabArray = toArray(vocabArray);
    }
    if (isArray(vocabArray)) {
      // check every vocab if it is a valid JSON-LD. If string -> try to JSON.parse()
      for (const vocab of vocabArray as []) {
        if (isString(vocab)) {
          if (
            (vocab as string).startsWith("www") ||
            (vocab as string).startsWith("http")
          ) {
            // assume it is a URL
            try {
              let fetchedVocab = await this.fetchVocabularyFromURL(vocab);
              if (isString(fetchedVocab)) {
                fetchedVocab = JSON.parse(fetchedVocab as string); // try to parse the fetched content as JSON
              }
              await this.graph.addVocabulary(fetchedVocab as Vocabulary, vocab);
            } catch (e) {
              console.log(e);
              throw new Error(
                "The given URL " +
                  vocab +
                  " did not contain a valid JSON-LD vocabulary."
              );
            }
          } else {
            // assume it is a string-version of a JSON-LD
            try {
              await this.graph.addVocabulary(JSON.parse(vocab));
            } catch (e) {
              throw new Error(
                "Parsing of vocabulary string produced an invalid JSON-LD."
              );
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
    } else {
      throw new Error(
        "The first argument of the function must be an Array of vocabularies or a single vocabulary (JSON-LD as Object/String)"
      );
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
    return new Promise(function (resolve, reject) {
      axios
        .get(url, {
          headers: {
            Accept: "application/ld+json, application/json",
          },
        })
        .then(function (res: any) {
          resolve(res.data);
        })
        .catch(function () {
          reject("Could not find any resource at the given URL.");
        });
    });
  }

  /**
   * Creates a corresponding term instance for the given IRI, depending on its term-type.
   *
   * @example
   * ```JS
   * // creates a Class instance for schema:Hotel - using the compact URI for identification is the recommended approach
   * const classInstance = mySdoAdapter.getTerm("schema:Hotel");
   *
   * // creates a Property instance for schema:openingHours (handling of http/https is based on the setting "equateVocabularyProtocols")
   * const propertyInstance = mySdoAdapter.getTerm("https://schema.org/openingHours");
   *
   * // creates an Enumeration instance for schema:DayOfWeek - Using the label for identification is risky when you have multiple vocabularies that may have equal labels
   * const enumerationInstance = mySdoAdapter.getTerm("DayOfWeek");
   * ```
   *
   * @param id - The identification string of the wished term, can be an IRI (absolute or compact) or a label
   * @param filter - The filter to be applied on the result
   * @returns The term instance for the given IRI
   */
  getTerm(id: string, filter?: FilterObject) {
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
  getAllTerms(
    filter?: FilterObject
  ): (Class | Enumeration | EnumerationMember | Property | DataType)[] {
    const result = [];
    const classesIRIList = this.getListOfClasses(filter);
    const enumerationsIRIList = this.getListOfEnumerations(filter);
    const propertiesIRIList = this.getListOfProperties(filter);
    const dataTypesIRIList = this.getListOfDataTypes(filter);
    const enumerationMembersIRIList = this.getListOfEnumerationMembers(filter);
    for (const c of classesIRIList) {
      try {
        result.push(this.getClass(c));
      } catch (e) {
        throw new Error("There is no class with the IRI " + c);
      }
    }
    for (const en of enumerationsIRIList) {
      try {
        result.push(this.getEnumeration(en));
      } catch (e) {
        throw new Error("There is no enumeration with the IRI " + en);
      }
    }
    for (const p of propertiesIRIList) {
      try {
        result.push(this.getProperty(p));
      } catch (e) {
        throw new Error("There is no property with the IRI " + p);
      }
    }
    for (const dt of dataTypesIRIList) {
      try {
        result.push(this.getDataType(dt));
      } catch (e) {
        throw new Error("There is no data type with the IRI " + dt);
      }
    }
    for (const enm of enumerationMembersIRIList) {
      try {
        result.push(this.getEnumerationMember(enm));
      } catch (e) {
        throw new Error("There is no enumeration member with the IRI " + enm);
      }
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
   * ```
   *
   * @param filter - The filter to be applied on the result
   * @returns An array of IRIs representing all vocabulary terms
   */
  getListOfTerms(filter?: FilterObject) {
    const result = [];
    result.push(...Object.keys(this.graph.classes));
    result.push(...Object.keys(this.graph.enumerations));
    result.push(...Object.keys(this.graph.properties));
    result.push(...Object.keys(this.graph.dataTypes));
    result.push(...Object.keys(this.graph.enumerationMembers));
    return applyFilter({ data: result, filter, graph: this.graph });
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
   * @param id - The identification string of the wished term, can be an IRI (absolute or compact) or a label
   * @param filter - The filter to be applied on the result
   * @returns The Class instance for the given IRI
   */
  getClass(id: string, filter?: FilterObject) {
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
  getAllClasses(filter?: FilterObject) {
    const result = [];
    const classesIRIList = this.getListOfClasses(filter);
    for (const c of classesIRIList) {
      try {
        result.push(this.getClass(c));
      } catch (e) {
        throw new Error("There is no class with the IRI " + c);
      }
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
   * ```
   *
   * @param filter - The filter to be applied on the result
   * @returns An array of IRIs representing all class terms
   */
  getListOfClasses(filter?: FilterObject) {
    // do not include enumerations
    return applyFilter({
      data: Object.keys(this.graph.classes),
      filter,
      graph: this.graph,
    });
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
   * @param id - The identification string of the wished term, can be an IRI (absolute or compact) or a label
   * @param filter - The filter to be applied on the result
   * @returns The Property instance for the given IRI
   */
  getProperty(id: string, filter?: FilterObject) {
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
  getAllProperties(filter?: FilterObject) {
    const result = [];
    const propertiesIRIList = this.getListOfProperties(filter);
    for (const p of propertiesIRIList) {
      try {
        result.push(this.getProperty(p));
      } catch (e) {
        throw new Error("There is no property with the IRI " + p);
      }
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
   * ```
   *
   * @param filter - The filter to be applied on the result
   * @returns An array of IRIs representing all property terms
   */
  getListOfProperties(filter?: FilterObject) {
    return applyFilter({
      data: Object.keys(this.graph.properties),
      filter,
      graph: this.graph,
    });
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
   * @param id - The identification string of the wished term, can be an IRI (absolute or compact) or a label
   * @param filter - The filter to be applied on the result
   * @returns The DataType instance for the given IRI
   */
  getDataType(id: string, filter?: FilterObject) {
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
  getAllDataTypes(filter?: FilterObject) {
    const result = [];
    const dataTypesIRIList = this.getListOfDataTypes(filter);
    for (const dt of dataTypesIRIList) {
      try {
        result.push(this.getDataType(dt));
      } catch (e) {
        throw new Error("There is no data type with the IRI " + dt);
      }
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
   * ```
   *
   * @param filter - The filter to be applied on the result
   * @returns An array of IRIs representing all data-type terms
   */
  getListOfDataTypes(filter?: FilterObject) {
    return applyFilter({
      data: Object.keys(this.graph.dataTypes),
      filter,
      graph: this.graph,
    });
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
   * @param id - The identification string of the wished term, can be an IRI (absolute or compact) or a label
   * @param filter - The filter to be applied on the result
   * @returns The Enumeration instance for the given IRI
   */
  getEnumeration(id: string, filter?: FilterObject) {
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
  getAllEnumerations(filter?: FilterObject) {
    const result = [];
    const enumerationsIRIList = this.getListOfEnumerations(filter);
    for (const en of enumerationsIRIList) {
      try {
        result.push(this.getEnumeration(en));
      } catch (e) {
        throw new Error("There is no enumeration with the IRI " + en);
      }
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
   *   'schema:PaymentMethod',
   *   'schema:DayOfWeek',
   *   'schema:GenderType',
   *   ...
   * ]
   * ```
   *
   * @param filter - The filter to be applied on the result
   * @returns An array of IRIs representing all enumeration terms
   */
  getListOfEnumerations(filter?: FilterObject) {
    return applyFilter({
      data: Object.keys(this.graph.enumerations),
      filter,
      graph: this.graph,
    });
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
   * @param id - The identification string of the wished term, can be an IRI (absolute or compact) or a label
   * @param filter - The filter to be applied on the result
   * @returns The EnumerationMember instance for the given IRI
   */
  getEnumerationMember(id: string, filter?: FilterObject) {
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
  getAllEnumerationMembers(filter?: FilterObject) {
    const result = [];
    const enumerationMembersIRIList = this.getListOfEnumerationMembers(filter);
    for (const enm of enumerationMembersIRIList) {
      try {
        result.push(this.getEnumerationMember(enm));
      } catch (e) {
        throw new Error("There is no enumeration member with the IRI " + enm);
      }
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
   * ```
   *
   * @param filter - The filter to be applied on the result
   * @returns An array of IRIs representing all enumeration member terms
   */
  getListOfEnumerationMembers(filter?: FilterObject) {
    return applyFilter({
      data: Object.keys(this.graph.enumerationMembers),
      filter,
      graph: this.graph,
    });
  }

  /**
   * Returns an object with key-value pairs representing the vocabulary indicators (used in compact IRIs) and their namespaces, that are used in this SDOAdapter.
   *
   * @example
   * ```JS
   * // assume mySdoAdapter has been initialized with schema.org and another example vocabulary
   * const usedVocabularies = mySdoAdapter.getVocabularies();
   * // creates an object with vocabulary indicators as keys, and their vocabulary namespaces as values
   * {
   *   "schema": "https://schema.org/",
   *   "ex": "https://example-vocab.ex/"
   * }
   * ```
   *
   * @returns An object containing key-value pairs representing the used vocabulary namespaces
   */
  getVocabularies() {
    const vocabKeys = Object.keys(this.graph.context);
    const result = {} as Record<string, string>;
    const blacklist = ["soa", "xsd", "rdf", "rdfa", "rdfs", "dc"]; // standard vocabs that should not be exposed
    vocabKeys.map((el) => {
      if (isString(this.graph.context[el]) && !blacklist.includes(el)) {
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
  async getLatestSchemaVersion() {
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
   * const schemaUrl = await SDOAdapter.constructURLSchemaVocabulary("13.0");
   * // creates following URL pointing to the schema.org vocabulary version 13.0
   * "https://raw.githubusercontent.com/semantifyit/schemaorg/main/data/releases/13.0/schemaorg-all-https.jsonld"
   * ```
   *
   * @param version - The wished Schema.org vocabulary version for the resulting URL (e.g. "5.0", "3.7", or "latest"). default: "latest"
   * @returns The URL to the Schema.org vocabulary
   */
  async constructURLSchemaVocabulary(version = "latest") {
    return await constructURLSchemaVocabulary(
      version,
      this.schemaHttps,
      this.commit
    );
  }
}
