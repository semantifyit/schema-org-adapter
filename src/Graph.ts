import { Class } from "./Class";
import { Property } from "./Property";
import { Enumeration } from "./Enumeration";
import { EnumerationMember } from "./EnumerationMember";
import { DataType } from "./DataType";
import { SDOAdapter } from "./SDOAdapter";
import {
  Context,
  FilterObject,
  TermMemory,
  Vocabulary,
  VocabularyNode,
} from "./types";
import {
  cloneJson,
  isArray,
  isObject,
  isString,
  switchIRIProtocol,
  toCompactIRI,
} from "./utilities";
import { DC, RDFS, SCHEMA, SOA, TermTypeIRI } from "./namespaces";
import {
  addEmptyArray,
  addInheritanceTermsClassAndEnum,
  addInheritanceTermsDataTypesAndProperties,
  curateVocabNode,
  discoverEquateNamespaces,
  discoverUsedSchemaOrgProtocol,
  extractFromClassMemory,
  generateContext,
  getStandardContext,
  nodeMergeAddIds,
  nodeMergeLanguageTerm,
  nodeMergeOverwrite,
  preProcessVocab,
} from "./graphUtilities";
import { applyFilter } from "./reasoning";

/** @ignore */
export class Graph {
  sdoAdapter: SDOAdapter;
  context: Context;
  // keys are the compacted IRI
  classes: TermMemory;
  properties: TermMemory;
  dataTypes: TermMemory;
  enumerations: TermMemory;
  enumerationMembers: TermMemory;

  /**
   * @param sdoAdapter - The parent sdoAdapter-class to which this Graph belongs
   */
  constructor(sdoAdapter: SDOAdapter) {
    this.sdoAdapter = sdoAdapter;
    this.context = getStandardContext();
    this.classes = {}; // keys are the compacted IRI
    this.properties = {}; // keys are the compacted IRI
    this.dataTypes = {}; // keys are the compacted IRI
    this.enumerations = {}; // keys are the compacted IRI
    this.enumerationMembers = {}; // keys are the compacted IRI
  }

  /**
   * Adds a new vocabulary (in JSON-LD format) to the graph data
   *
   * @param vocab - The vocabulary to add the graph, in JSON-LD format
   * @param vocabURL - The URL of the vocabulary
   * @returns returns true on success
   */
  async addVocabulary(vocab: Vocabulary, vocabURL?: string) {
    // check which protocol version of schema.org is used in the first vocabulary given to the graph, set that version as the namespace for "schema" in the standard @context
    if (this.context.schema === undefined) {
      this.context.schema =
        discoverUsedSchemaOrgProtocol(vocab) + "://schema.org/";
    }
    // this algorithm is well-documented in /docu/algorithm.md
    try {
      // A) Pre-process Vocabulary
      // New: In the following any added vocabularies are slightly changed, if the "equateVocabularyProtocols" option is used and the vocabulary includes namespaces that meet the requirements
      if (this.sdoAdapter.equateVocabularyProtocols) {
        // 1. Check if any namespaces from this.context are used in vocab (context and content) with another protocol (http/https). Create a List of those
        const equateNamespaces = discoverEquateNamespaces(this.context, vocab);
        // 2. If the List is not empty, then the vocab needs to be adapted
        if (equateNamespaces.length > 0) {
          //  - Create adapted context for vocab, which includes IRIs from vocab context + IRIs from the List, use vocab indicators from this.context
          const adaptedContext = cloneJson(vocab["@context"]);
          equateNamespaces.forEach((ens) => {
            const usedKeyToDelete = Object.keys(adaptedContext).find(
              (el) => adaptedContext[el] === ens
            );
            if (usedKeyToDelete) {
              delete adaptedContext[usedKeyToDelete];
            }
            const keyToUse = Object.keys(this.context).find(
              (el) => this.context[el] === switchIRIProtocol(ens)
            );
            adaptedContext[keyToUse as string] = ens;
          });
          //  - jsonld compact vocab with adapted context
          vocab = (await preProcessVocab(vocab, adaptedContext)) as Vocabulary;
          //  - manually change entries of compacted vocab context, so that they use the same protocol as in this.context (the vocab indicators should already be the same)
          equateNamespaces.forEach((ens) => {
            const keyToUse = Object.keys(this.context).find(
              (el) => this.context[el] === switchIRIProtocol(ens)
            );
            vocab["@context"][keyToUse as string] =
              this.context[keyToUse as string];
          });
        }
      }
      // create new context
      this.context = generateContext(this.context, vocab["@context"]);
      // pre-process new vocab
      vocab = (await preProcessVocab(vocab, this.context)) as Vocabulary; // adapt @graph to new context
      const vocabularies = this.sdoAdapter.getVocabularies();
      for (let vocabNode of vocab["@graph"]) {
        vocabNode = curateVocabNode(vocabNode, vocabularies); // curate nodes
      }
      // B) Classify Input
      /**
       Classify every @graph node based on its @type. The node is transformed to another data-model based on the @type and stored in a new memory storage for an easier further usage. This is the first of two steps for an exact classification of the node, since the @type is not enough for a correct classification. The mapping of our data model and the @type(s) of the corresponding @graph nodes are as follows:
       classes ("@type" = "rdfs:Class")
       properties ("@type" = "rdf:Property")
       dataTypes ("@type" = "rdfs:Class" + "schema:DataType")
       enumerations ("@type" = "rdfs:Class", has "schema:Enumeration" as implicit super-class)
       enumerationMembers ("@type" = @id(s) of enumeration(s))
       */
      for (let i = 0; i < vocab["@graph"].length; i++) {
        const curNode = cloneJson(vocab["@graph"][i]);
        if (isString(curNode["@type"])) {
          switch (curNode["@type"]) {
            case TermTypeIRI.class:
              this.addGraphNode(this.classes, curNode, vocabURL);
              break;
            case TermTypeIRI.property:
              this.addGraphNode(this.properties, curNode, vocabURL);
              break;
            default:
              // @type is not something expected -> assume enumerationMember
              this.addGraphNode(this.enumerationMembers, curNode, vocabURL);
              break;
          }
        } else if (isArray(curNode["@type"])) {
          // @type is not a string -> datatype or enumeration
          // [
          //     "rdfs:Class",
          //     "schema:DataType"
          // ]
          // [
          //   "schema:MedicalImagingTechnique",
          //   "schema:MedicalSpecialty"
          // ]
          if (
            curNode["@type"].includes(TermTypeIRI.class) &&
            curNode["@type"].includes(TermTypeIRI.dataType)
          ) {
            // datatype
            this.addGraphNode(this.dataTypes, curNode, vocabURL);
          } else {
            // enumeration member
            this.addGraphNode(this.enumerationMembers, curNode, vocabURL);
          }
        } else {
          this.sdoAdapter.onError(
            "unexpected @type format for the following node: " +
              JSON.stringify(curNode, null, 2)
          );
        }
      }
      // C) Classification cleaning
      /* To have a correct classification for our data model it is needed to clean the data generated in the previous step. Inaccurate records include:
       * Enumerations which are handled as Classes.
       * DataTypes which are handled as Classes.
       */

      // C.1)  Extract enumerations from classes memory
      // For each entry in the classes memory check if its superClasses contain Enumeration or another Enumeration. If this is the case, it is known that this class is an enumeration.
      extractFromClassMemory(
        this.classes,
        this.enumerations,
        this.addGraphNode,
        vocabURL
      );
      // C.2) check if there are subclasses of dataTypes which are in the classes data, put them in dataType data
      extractFromClassMemory(
        this.classes,
        this.dataTypes,
        this.addGraphNode,
        vocabURL
      );
      // C.3) change the @type of data-types to a single value, which is "schema:DataType"
      Object.values(this.dataTypes).forEach(
        (el) => (el["@type"] = TermTypeIRI.dataType)
      );

      // D) Inheritance
      /*    Schema.org's Inheritance design states if an entity is the superClass/superProperty of another entity. In our data model design we also hold the information if an entity is the subClass/subProperty of another entity. In this step this inheritance information is generated. */
      // D.1) Add subClasses for Classes and Enumerations
      // check superclasses for all classes and enumerations. Add these classes/enumerations as subclasses (soa:superClassOf) for the parent class/enumeration
      addInheritanceTermsClassAndEnum(
        this.classes,
        this.enumerations,
        RDFS.subClassOf,
        SOA.superClassOf
      );
      addInheritanceTermsClassAndEnum(
        this.enumerations,
        this.enumerations,
        RDFS.subClassOf,
        SOA.superClassOf
      );
      // D.2) Add subClasses for DataTypes
      // For each entry in the dataTypes memory the superClasses are checked (if they are in dataTypes memory) and those super types add the actual entry in their subClasses.
      addInheritanceTermsDataTypesAndProperties(
        this.dataTypes,
        RDFS.subClassOf,
        SOA.superClassOf
      );
      // D.3) Add subProperties for Properties
      // For each entry in the properties memory the superProperties are checked (if they are in properties memory) and those super properties add the actual entry in their subProperties. (soa:superPropertyOf)
      addInheritanceTermsDataTypesAndProperties(
        this.properties,
        RDFS.subPropertyOf,
        SOA.superPropertyOf
      );
      // E) Relationships
      /*  In this step additional fields are added to certain data entries to add links to other data entries, which should make it easier to use the generated data set.#
                        soa:hasProperty is an inverse of schema:domainIncludes
                        soa:isRangeOf is an inverse of schema:rangeIncludes
                        soa:hasEnumerationMember is used for enumerations to list all its enumeration members (their @type includes the @id of the enumeration)
                        soa:enumerationDomainIncludes is an inverse of soa:hasEnumerationMember */
      // E.0) add empty arrays for the relationships
      Object.values(this.classes).forEach((el) => {
        addEmptyArray(el, SOA.hasProperty);
        addEmptyArray(el, SOA.isRangeOf);
      });
      Object.values(this.enumerations).forEach((el) => {
        addEmptyArray(el, SOA.hasEnumerationMember);
        addEmptyArray(el, SOA.isRangeOf);
        addEmptyArray(el, SOA.hasProperty);
      });
      Object.values(this.dataTypes).forEach((el) => {
        addEmptyArray(el, SOA.isRangeOf);
      });
      Object.values(this.enumerationMembers).forEach((el) => {
        addEmptyArray(el, SOA.enumerationDomainIncludes);
      });
      /* E.1) Add explicit hasProperty and isRangeOf to classes, enumerations, and data types
                        For each entry in the classes/enumeration/dataType memory, the soa:hasProperty field is added.
                        This data field holds all properties which belong to this class/enumeration (class/enumeration is domain for property).
                        Also the soa:isRangeOf field is added -> holds all properties which use to this class/enumeration/dataType as range (class/enumeration/dataType is range for property). */
      const propertyKeys = Object.keys(this.properties);
      for (const actPropKey of propertyKeys) {
        const domainIncludesArray: string[] =
          this.properties[actPropKey][SCHEMA.domainIncludes];
        if (isArray(domainIncludesArray)) {
          for (const actDomain of domainIncludesArray) {
            let target = this.classes[actDomain];
            if (!target) {
              target = this.enumerations[actDomain];
            }
            if (
              target &&
              isArray(target[SOA.hasProperty]) &&
              !target[SOA.hasProperty].includes(actPropKey)
            ) {
              target[SOA.hasProperty].push(actPropKey);
            }
          }
        }
        const rangeIncludesArray: string[] =
          this.properties[actPropKey][SCHEMA.rangeIncludes];
        if (isArray(rangeIncludesArray)) {
          for (const actRange of rangeIncludesArray) {
            const target =
              this.classes[actRange] ||
              this.enumerations[actRange] ||
              this.dataTypes[actRange];
            if (
              target &&
              isArray(target[SOA.isRangeOf]) &&
              !target[SOA.isRangeOf].includes(actPropKey)
            ) {
              target[SOA.isRangeOf].push(actPropKey);
            }
          }
        }
      }
      /* E.2) Add soa:hasEnumerationMember to enumerations and soa:enumerationDomainIncludes to enumerationMembers
                        For each entry in the enumeration memory the soa:hasEnumerationMember field is added, this data field holds all enumeration members which belong to this enumeration.
                        For each entry in the enumerationMembers memory the soa:enumerationDomainIncludes field is added, this data field holds all enumerations that are a domain for this enumerationMember
                        */
      const enumMemKeys = Object.keys(this.enumerationMembers);
      for (const actEnumMemKey of enumMemKeys) {
        const enumMem = this.enumerationMembers[actEnumMemKey];
        let enumMemTypeArray = enumMem["@type"];
        if (!isArray(enumMemTypeArray)) {
          enumMemTypeArray = [enumMemTypeArray];
        }
        for (const actEnumMemType of enumMemTypeArray) {
          const target = this.enumerations[actEnumMemType];
          if (
            target &&
            isArray(target[SOA.hasEnumerationMember]) &&
            !target[SOA.hasEnumerationMember].includes(actEnumMemKey)
          ) {
            target[SOA.hasEnumerationMember].push(actEnumMemKey);
            if (isArray(enumMem[SOA.enumerationDomainIncludes])) {
              enumMem[SOA.enumerationDomainIncludes].push(actEnumMemType);
            } else {
              enumMem[SOA.enumerationDomainIncludes] = [actEnumMemType];
            }
          }
        }
      }
      return true;
    } catch (e) {
      this.sdoAdapter.onError(e as string);
      return false;
    }
  }

  /**
   * Creates/Updates a node in the graph
   *
   * @param memory - The memory object where the new node should be added (Classes, Properties, Enumerations, EnumerationMembers, DataTypes)
   * @param newNode - The node in JSON-LD format to be added
   * @param vocabURL - The vocabulary URL of the node
   * @returns returns true on success
   */
  addGraphNode(
    memory: Record<string, VocabularyNode>,
    newNode: VocabularyNode,
    vocabURL?: string
  ) {
    try {
      if (!memory[newNode["@id"]]) {
        memory[newNode["@id"]] = newNode;
        if (vocabURL) {
          memory[newNode["@id"]]["vocabURLs"] = [vocabURL];
        }
      } else {
        // merging algorithm
        const oldNode = memory[newNode["@id"]];
        // @id stays the same
        // @type should stay the same (we already defined the memory to save it)
        // schema:isPartOf -> overwrite
        nodeMergeOverwrite(oldNode, newNode, SCHEMA.isPartOf);
        // dc:source/schema:source -> overwrite
        nodeMergeOverwrite(oldNode, newNode, DC.source);
        nodeMergeOverwrite(oldNode, newNode, SCHEMA.source);
        // schema:category -> overwrite
        nodeMergeOverwrite(oldNode, newNode, SCHEMA.category);
        // schema:supersededBy -> overwrite
        nodeMergeOverwrite(oldNode, newNode, SCHEMA.supersededBy);
        // rdfs:label -> add new languages, overwrite old ones if needed
        nodeMergeLanguageTerm(oldNode, newNode, RDFS.label);
        // rdfs:comment -> add new languages, overwrite old ones if needed
        nodeMergeLanguageTerm(oldNode, newNode, RDFS.comment);
        // rdfs:subClassOf -> add new ids
        nodeMergeAddIds(oldNode, newNode, RDFS.subClassOf);
        // soa:superClassOf -> add new ids
        nodeMergeAddIds(oldNode, newNode, SOA.superClassOf);
        // soa:hasProperty -> add new ids
        nodeMergeAddIds(oldNode, newNode, SOA.hasProperty);
        // soa:isRangeOf -> add new ids
        nodeMergeAddIds(oldNode, newNode, SOA.isRangeOf);
        // soa:enumerationDomainIncludes -> add new ids
        nodeMergeAddIds(oldNode, newNode, SOA.enumerationDomainIncludes);
        // soa:hasEnumerationMember -> add new ids
        nodeMergeAddIds(oldNode, newNode, SOA.hasEnumerationMember);
        // rdfs:subPropertyOf -> add new ids
        nodeMergeAddIds(oldNode, newNode, RDFS.subPropertyOf);
        // schema:domainIncludes -> add new ids
        nodeMergeAddIds(oldNode, newNode, SCHEMA.domainIncludes);
        // schema:rangeIncludes -> add new ids
        nodeMergeAddIds(oldNode, newNode, SCHEMA.rangeIncludes);
        // soa:superPropertyOf -> add new ids
        nodeMergeAddIds(oldNode, newNode, SOA.superPropertyOf);
        if (vocabURL) {
          if (oldNode["vocabURLs"]) {
            if (!oldNode["vocabURLs"].includes(vocabURL)) {
              oldNode["vocabURLs"].push(vocabURL);
            }
          } else {
            oldNode["vocabURLs"] = [vocabURL];
          }
        }
      }
      return true;
    } catch (e) {
      this.sdoAdapter.onError(e as string);
      return false;
    }
  }

  /**
   * Creates a corresponding JS-Class for the given IRI, depending on its category in the Graph
   *
   * @param id - The id of the wished term, can be an IRI (absolute or compact) or a label
   * @param filter - The filter to be applied on the result
   * @returns the JS-Class for the given IRI
   */
  getTerm(
    id: string,
    filter?: FilterObject
  ): Class | Enumeration | EnumerationMember | Property | DataType {
    const compactIRI = this.discoverCompactIRI(id);
    if (!compactIRI) {
      throw new Error("There is no term with the IRI " + id);
    }
    let targetObj;
    let targetType;
    let tryCounter = 0;
    do {
      switch (tryCounter) {
        case 0:
          targetObj = this.classes[compactIRI];
          targetType = "Class";
          break;
        case 1:
          targetObj = this.properties[compactIRI];
          targetType = "Property";
          break;
        case 2:
          targetObj = this.dataTypes[compactIRI];
          targetType = "DataType";
          break;
        case 3:
          targetObj = this.enumerations[compactIRI];
          targetType = "Enumeration";
          break;
        case 4:
          targetObj = this.enumerationMembers[compactIRI];
          targetType = "EnumerationMember";
          break;
      }
      tryCounter++;
    } while (!targetObj && tryCounter < 6);

    if (!targetObj || !targetType) {
      throw new Error("There is no term with the IRI " + id);
    }

    targetObj = applyFilter({
      data: [targetObj["@id"]],
      filter,
      graph: this,
    });
    if (targetObj.length === 0) {
      throw new Error("There is no term with that IRI and filter settings.");
    }
    switch (targetType) {
      case "Class":
        return new Class(compactIRI, this);
      case "Property":
        return new Property(compactIRI, this);
      case "Enumeration":
        return new Enumeration(compactIRI, this);
      case "EnumerationMember":
        return new EnumerationMember(compactIRI, this);
      case "DataType":
        return new DataType(compactIRI, this);
    }
    throw new Error("targetType with unknown value: " + targetType); // code should never reach here - this is here in place to satisfy TS
  }

  /**
   * Creates a JS-Class for a Class of the Graph
   *
   * @param id - The id of the wished Class-node, can be an IRI (absolute or compact) or a label
   * @param filter - The filter to be applied on the result
   * @returns the JS-Class for the given IRI
   */
  getClass(id: string, filter?: FilterObject) {
    const compactIRI = this.discoverCompactIRI(id);
    if (compactIRI) {
      let classObj = this.classes[compactIRI];
      if (classObj) {
        classObj = applyFilter({ data: [compactIRI], filter, graph: this });
        if (classObj.length === 0) {
          throw new Error(
            "There is no class with that IRI and filter settings."
          );
        } else {
          return new Class(compactIRI, this);
        }
      } else {
        // enumerations can also be counted as classes
        classObj = this.enumerations[compactIRI];
        if (classObj) {
          try {
            return this.getEnumeration(compactIRI, filter);
          } catch (e) {
            throw new Error(
              "There is no class with that IRI and filter settings."
            );
          }
        }
      }
    }
    throw new Error("There is no class with the IRI " + id);
  }

  /**
   * Creates a JS-Class for a Property of the Graph
   *
   * @param id - The id of the wished Property-node, can be an IRI (absolute or compact) or a label
   * @param filter - The filter to be applied on the result
   * @returns the JS-Class for the given IRI
   */
  getProperty(id: string, filter?: FilterObject) {
    const compactIRI = this.discoverCompactIRI(id);
    if (compactIRI) {
      let propertyObj = this.properties[compactIRI];
      if (propertyObj) {
        propertyObj = applyFilter({ data: [compactIRI], filter, graph: this });
        if (propertyObj.length === 0) {
          throw new Error(
            "There is no property with that URI and filter settings."
          );
        } else {
          return new Property(compactIRI, this);
        }
      }
    }
    throw new Error("There is no property with that URI.");
  }

  /**
   * Creates a JS-Class for a DataType of the Graph
   *
   * @param id - The id of the wished DataType-node, can be an IRI (absolute or compact) or a label
   * @param filter - The filter to be applied on the result
   * @returns the JS-Class for the given IRI
   */
  getDataType(id: string, filter?: FilterObject) {
    const compactIRI = this.discoverCompactIRI(id);
    if (compactIRI) {
      let dataTypeObj = this.dataTypes[compactIRI];
      if (dataTypeObj) {
        dataTypeObj = applyFilter({ data: [compactIRI], filter, graph: this });
        if (dataTypeObj.length === 0) {
          throw new Error(
            "There is no data-type with that IRI and filter settings."
          );
        } else {
          return new DataType(compactIRI, this);
        }
      }
    }
    throw new Error("There is no data-type with the IRI " + id);
  }

  /**
   * Creates a JS-Class for an Enumeration of the Graph
   *
   * @param id - The id of the wished Enumeration-node, can be an IRI (absolute or compact) or a label
   * @param filter - The filter to be applied on the result
   * @returns the JS-Class for the given IRI
   */
  getEnumeration(id: string, filter?: FilterObject) {
    const compactIRI = this.discoverCompactIRI(id);
    if (compactIRI) {
      let enumObj = this.enumerations[compactIRI];
      if (enumObj) {
        enumObj = applyFilter({ data: [compactIRI], filter, graph: this });
        if (enumObj.length === 0) {
          throw new Error(
            "There is no enumeration with that IRI and filter settings."
          );
        } else {
          return new Enumeration(compactIRI, this);
        }
      }
    }
    throw new Error("There is no enumeration with the IRI " + id);
  }

  /**
   * Creates a JS-Class for an EnumerationMember of the Graph
   *
   * @param id - The id of the wished EnumerationMember-node, can be an IRI (absolute or compact) or a label
   * @param filter - The filter to be applied on the result
   * @returns the JS-Class for the given IRI
   */
  getEnumerationMember(id: string, filter?: FilterObject) {
    const compactIRI = this.discoverCompactIRI(id);
    if (compactIRI) {
      let enumObj = this.enumerationMembers[compactIRI];
      if (enumObj) {
        enumObj = applyFilter({ data: [compactIRI], filter, graph: this });
        if (enumObj.length === 0) {
          throw new Error(
            "There is no EnumerationMember with that IRI and filter settings."
          );
        } else {
          return new EnumerationMember(compactIRI, this);
        }
      }
    }
    throw new Error("There is no EnumerationMember with the IRI " + id);
  }

  /**
   * Transforms/Discovers the right compact IRI for a given input, which may be a already a compact IRI, or an absolute IRI, or a term label for a vocabulary member
   *
   * @param input - The input string to discover (if label) or transform (if absolute IRI)
   * @returns the corresponding compact IRI (null if input is not valid)
   */
  discoverCompactIRI(input: string): string | null {
    if (input.includes(":")) {
      // is iri
      const terms = Object.keys(this.context);
      for (const actTerm of terms) {
        const absoluteIRI = this.context[actTerm];
        if (isString(absoluteIRI)) {
          if (input.startsWith(actTerm)) {
            // is compactIRI
            return input;
          } else if (
            input.startsWith(absoluteIRI as string) ||
            (this.sdoAdapter.equateVocabularyProtocols &&
              input.startsWith(switchIRIProtocol(absoluteIRI as string)))
          ) {
            // is absoluteIRI
            try {
              return toCompactIRI(
                input,
                this.context,
                this.sdoAdapter.equateVocabularyProtocols
              );
            } catch (e) {
              // the namespace used in the URL is not present in the context
              return null;
            }
          }
        }
      }
    } else {
      // is label
      const classesKeys = Object.keys(this.classes);
      for (const actClassKey of classesKeys) {
        if (this.containsLabel(this.classes[actClassKey], input)) {
          return actClassKey;
        }
      }
      const propertiesKeys = Object.keys(this.properties);
      for (const actPropKey of propertiesKeys) {
        if (this.containsLabel(this.properties[actPropKey], input)) {
          return actPropKey;
        }
      }
      const dataTypeKeys = Object.keys(this.dataTypes);
      for (const actDtKey of dataTypeKeys) {
        if (this.containsLabel(this.dataTypes[actDtKey], input)) {
          return actDtKey;
        }
      }
      const enumerationKeys = Object.keys(this.enumerations);
      for (const actEnumKey of enumerationKeys) {
        if (this.containsLabel(this.enumerations[actEnumKey], input)) {
          return actEnumKey;
        }
      }
      const enumerationMemberKeys = Object.keys(this.enumerationMembers);
      for (const actEnumMemKey of enumerationMemberKeys) {
        if (this.containsLabel(this.enumerationMembers[actEnumMemKey], input)) {
          return actEnumMemKey;
        }
      }
    }
    // if nothing was found yet, the input is invalid
    return null;
  }

  /**
   * Checks if a given term object contains a given label string. Helper function for discoverCompactIRI()
   *
   * @param termObj - the term node
   * @param label - the language to check
   * @returns returns true, if the termObj uses the given label (in any language)
   */
  containsLabel(termObj: VocabularyNode, label: string) {
    if (termObj && isObject(termObj[RDFS.label])) {
      const langKeys = Object.keys(termObj[RDFS.label]);
      for (const actLangKey of langKeys) {
        if (termObj[RDFS.label][actLangKey] === label) {
          return true;
        }
      }
    }
    return false;
  }
}