import {
  Context,
  LanguageObjectSdoAdapter,
  TermMemory,
  Vocabulary,
  VocabularyNode,
} from "./types";
import {
  TermTypeIRI,
  TermTypeIRIValue,
  NS,
} from "./data/namespaces";
import {
  cloneJson,
  isArray,
  isLanguageObjectVocab,
  isNil,
  isObject,
  isString,
  switchIRIProtocol,
} from "./utilities";
import jsonld from "jsonld";
import "core-js/actual/set";

/**
 * curates the language-tagged value for a given term in a given vocabulary node
 *
 * @param vocabNode - the input vocabulary node
 * @param term - the term in question
 */
function curateLanguageTerm(vocabNode: VocabularyNode, term: string): void {
  // wished format:
  // "term": {
  //    "en": "english text",
  //    "de": "german text"
  // }
  if (vocabNode[term] !== undefined) {
    if (isString(vocabNode[term])) {
      // cover case for a simple string, e.g. "term": "text"
      // for the output simply assume the language is "en"
      vocabNode[term] = {
        en: vocabNode[term],
      };
    } else if (isLanguageObjectVocab(vocabNode[term])) {
      // cover case for a language object
      // "term": {
      //   "@language": "en",
      //   "@value": "english text"
      // }
      vocabNode[term] = {
        [vocabNode[term]["@language"]]: vocabNode[term]["@value"],
      };
    } else if (isArray(vocabNode[term])) {
      // cover case for multiple language objects in an array
      // "term": [{
      //   "@language": "en",
      //   "@value": "translationOfWork"
      // },
      // {
      //   "@language": "de",
      //   "@value": "UebersetzungsArbeit"
      // }]
      const newVal: LanguageObjectSdoAdapter = {};
      vocabNode[term].map((el: unknown) => {
        // it is assumed that an array element in this position is a language object
        if (isLanguageObjectVocab(el)) {
          newVal[el["@language"]] = el["@value"];
        }
      });
      vocabNode[term] = newVal;
    }
  } else {
    // if the term is not given, then create an empty LanguageObjectSdoAdapter
    vocabNode[term] = {};
  }
}

/**
 * curates the value for a given relationship term in a given vocabulary node that should have an array as value
 *
 * @param vocabNode - the input vocabulary node
 * @param term - the term in question
 * @param initDefaultIf - the node type URI that triggers a default initialization, e.g. rdfs:Class
 */

function curateRelationshipTermArray(
  vocabNode: VocabularyNode,
  term: string,
  initDefaultIf: TermTypeIRIValue
): void {
  // the relationships should always be an array, even for 1 and 0 (if the @type of the vocabulary node matches) values
  if (isString(vocabNode[term])) {
    vocabNode[term] = [vocabNode[term]];
  } else if (
    vocabNode[term] === undefined &&
    vocabNode["@type"] === initDefaultIf
  ) {
    // initialize an empty array
    vocabNode[term] = [];
  }
}

/** @ignore
 * Processes a given vocabulary node to a wished format (we call this process "curation")
 *
 * @param vocabNode - the input vocabulary node
 * @param vocabularies - the vocabularies used by the graph so far
 * @returns {object} the curated node
 */
export function curateVocabNode(
  vocabNode: VocabularyNode,
  vocabularies: Record<string, string>
): VocabularyNode {
  curateLanguageTerm(vocabNode, NS.rdfs.comment);
  curateLanguageTerm(vocabNode, NS.rdfs.label);
  // terms with an array as default
  curateRelationshipTermArray(vocabNode, NS.rdfs.subClassOf, TermTypeIRI.class);
  curateRelationshipTermArray(
    vocabNode,
    NS.rdfs.subPropertyOf,
    TermTypeIRI.property
  );
  curateRelationshipTermArray(
    vocabNode,
    NS.schema.domainIncludes,
    TermTypeIRI.property
  );
  curateRelationshipTermArray(
    vocabNode,
    NS.schema.rangeIncludes,
    TermTypeIRI.property
  );
  // terms with a string | null as default
  if (
    vocabNode[NS.schema.inverseOf] === undefined &&
    vocabNode["@type"] === TermTypeIRI.property
  ) {
    vocabNode[NS.schema.inverseOf] = null;
  }
  // if no schema:isPartOf property is stated yet (e.g. "https://pending.schema.org"), we detect the vocabulary used from the context, and put the corresponding (curated) IRI as value for this property (e.g. "https://schema.org")
  if (!isString(vocabNode[NS.schema.isPartOf])) {
    const vocabKeys = Object.keys(vocabularies);
    // e.g. schema
    let vocab = vocabKeys.find(
      (el) =>
        vocabNode["@id"].substring(0, vocabNode["@id"].indexOf(":")) === el
    );
    if (isString(vocab)) {
      // e.g. https://schema.org/
      vocab = vocabularies[vocab];
      let newChange;
      do {
        newChange = false;
        if (vocab.endsWith("/") || vocab.endsWith("#")) {
          vocab = vocab.substring(0, vocab.length - 1);
          newChange = true;
        }
      } while (newChange);
      // e.g. https://schema.org
      vocabNode[NS.schema.isPartOf] = vocab;
    }
  }
  return vocabNode;
}

/** @ignore
 * Merges 2 JSON-LD context objects into a new one
 *
 * @param currentContext - the first context object
 * @param newContext - the second context object
 * @returns the resulting context object
 */
export function generateContext(
  currentContext: Context,
  newContext: Context
): Context {
  const keysCurrentContext = Object.keys(currentContext);
  const keysNewContext = Object.keys(newContext);
  // add all of the old context
  let resultContext = cloneJson(currentContext);
  // add vocabs of new context that are not already used (value is URI)
  for (const keyNC of keysNewContext) {
    if (isString(newContext[keyNC])) {
      // first: check if the URI is already used, with any indicator
      let foundMatch = false;
      for (const keyCC of keysCurrentContext) {
        if (isString(resultContext[keyCC])) {
          if (resultContext[keyCC] === newContext[keyNC]) {
            // found match, the URI is already covered
            foundMatch = true;
            break;
          }
        }
      }
      if (foundMatch) {
        continue; // URI is already covered, continue with next
      }
      if (!resultContext[keyNC]) {
        // add new vocab indicator
        resultContext[keyNC] = newContext[keyNC];
      } else {
        // check if the URI is the same, if not: add new uri under new vocab indicator
        if (resultContext[keyNC] !== newContext[keyNC]) {
          let foundFreeName = false;
          let counter = 1;
          while (!foundFreeName) {
            const newVocabIndicator = keyNC + counter++;
            if (!resultContext[newVocabIndicator]) {
              foundFreeName = true;
              resultContext[newVocabIndicator] = newContext[keyNC];
            }
          }
        }
      }
    }
  }
  // sort vocab IRIs by alphabet
  const ordered: Context = {};
  Object.keys(resultContext)
    .sort()
    .forEach(function (key) {
      ordered[key] = resultContext[key];
    });
  // reorder context: Vocab Indicators first (value = string), then term handlers (value = object)
  resultContext = ordered;
  const keysResultContext = Object.keys(resultContext);
  const orderedResultContext: Context = {};
  // add the Vocab Indicators (value = string)
  for (const keyRC of keysResultContext) {
    if (isString(resultContext[keyRC])) {
      orderedResultContext[keyRC] = resultContext[keyRC];
    }
  }
  // add the term handlers (value = object)
  for (const keyRC of keysResultContext) {
    if (isObject(resultContext[keyRC])) {
      orderedResultContext[keyRC] = resultContext[keyRC];
    }
  }
  return orderedResultContext;
}

/** @ignore
 * Transforms a given vocabulary to a wished format (including a given JSON-LD context)
 *
 * @param vocab - the vocabulary to process
 * @param newContext - the wished JSON-LD context that the vocabulary should have
 * @returns the transformed vocabulary
 */
export async function preProcessVocab(
  vocab: Vocabulary,
  newContext: Context
): Promise<Vocabulary> {
  // recursively put all nodes from inner @graphs to the outermost @graph (is the case for older schema.jsonld versions)
  let foundInnerGraph = false;
  do {
    const newGraph = [];
    foundInnerGraph = false;
    for (let i = 0; i < vocab["@graph"].length; i++) {
      if (vocab["@graph"][i]["@graph"] !== undefined) {
        newGraph.push(...cloneJson(vocab["@graph"][i]["@graph"])); // copy all elements of the inner @graph into the outer @graph
        foundInnerGraph = true;
      } else {
        newGraph.push(cloneJson(vocab["@graph"][i])); // copy this element to the outer @graph
      }
    }
    vocab["@graph"] = cloneJson(newGraph);
  } while (foundInnerGraph);

  // compact to apply the new context (which is supposed to have been merged before with the old context through the function generateContext())
  // option "graph": true not feasible here, because then vocabs with "@id" result in inner @graphs again
  // solution: edge case handling (see below)
  const compactedVocab = await jsonld.compact(vocab, newContext);

  // edge case: @graph had only one node, so values of @graph are in outermost layer
  if (compactedVocab["@graph"] === undefined) {
    delete compactedVocab["@context"];
    return {
      "@context": newContext,
      "@graph": [compactedVocab],
    };
  } else {
    return compactedVocab as Vocabulary;
  }
}

/** @ignore
 * Returns the protocol version used for schema.org in the given vocabulary. Returns "https" as the default
 *
 * @param vocabulary - the vocabulary in question
 * @returns the corresponding protocol version, either "http" or "https"
 */
export function discoverUsedSchemaOrgProtocol(
  vocabulary: Vocabulary | object
): string {
  const httpsIRI = "https://schema.org/";
  const httpIRI = "http://schema.org/";
  // 1. check if namespace is used in @context
  if ((vocabulary as Vocabulary)["@context"]) {
    for (const contextEntry of Object.values(
      (vocabulary as Vocabulary)["@context"]
    )) {
      if (isObject(contextEntry) && contextEntry["@vocab"]) {
        if (contextEntry["@vocab"] === httpsIRI) {
          return "https";
        } else if (contextEntry["@vocab"] === httpIRI) {
          return "http";
        }
      } else if (isString(contextEntry)) {
        if (contextEntry === httpsIRI) {
          return "https";
        } else if (contextEntry === httpIRI) {
          return "http";
        }
      }
    }
  }
  // 2. easiest way -> make a string and count occurrences for each protocol version
  const stringifiedVocab = JSON.stringify(vocabulary);
  const amountHttps = stringifiedVocab.split(httpsIRI).length - 1;
  const amountHttp = stringifiedVocab.split(httpIRI).length - 1;
  if (amountHttps > amountHttp) {
    return "https";
  } else if (amountHttp > amountHttps) {
    return "http";
  } else {
    return httpsIRI; // default case
  }
}

/** @ignore
 * Checks if the given vocabulary uses terms (in context or content) that are present in the current given context but with another protocol (http/https), and returns those in a list
 *
 * @param currentContext - the current context
 * @param vocabulary - the vocabulary to be analyzed
 * @returns an array with the found equate namespaces
 */
export function discoverEquateNamespaces(
  currentContext: Context,
  vocabulary: Vocabulary
): string[] {
  const result: Set<string> = new Set();
  // 1. Make List of protocol switched namespaces from the current context
  const protocolSwitchedNamespaces: string[] = [];
  Object.values(currentContext).forEach(function (el) {
    if (isString(el)) {
      protocolSwitchedNamespaces.push(switchIRIProtocol(el));
    }
  });
  // 2. Look in vocabulary context if any protocol switched namespaces are present
  if (vocabulary["@context"]) {
    Object.values(vocabulary["@context"]).forEach(function (el) {
      if (isString(el) && protocolSwitchedNamespaces.includes(el)) {
        result.add(el);
      }
    });
  }
  // 3. Look in vocabulary content if any protocol switched namespaces are present (everywhere, where @ids are expected)
  if (Array.isArray(vocabulary["@graph"])) {
    vocabulary["@graph"].forEach(function (vocabNode) {
      checkIfNamespaceFromListIsUsed(
        vocabNode["@id"],
        protocolSwitchedNamespaces,
        result
      );
      checkIfNamespaceFromListIsUsed(
        vocabNode["@type"],
        protocolSwitchedNamespaces,
        result
      );
      // super class
      checkIfNamespaceFromListIsUsed(
        vocabNode[NS.rdfs.subClassOf],
        protocolSwitchedNamespaces,
        result
      );
      checkIfNamespaceFromListIsUsed(
        vocabNode["http://www.w3.org/2000/01/rdf-schema#subClassOf"],
        protocolSwitchedNamespaces,
        result
      );
      // domain class
      checkIfNamespaceFromListIsUsed(
        vocabNode[NS.schema.domainIncludes],
        protocolSwitchedNamespaces,
        result
      );
      checkIfNamespaceFromListIsUsed(
        vocabNode["http://schema.org/domainIncludes"],
        protocolSwitchedNamespaces,
        result
      );
      checkIfNamespaceFromListIsUsed(
        vocabNode["https://schema.org/domainIncludes"],
        protocolSwitchedNamespaces,
        result
      );
      // range class
      checkIfNamespaceFromListIsUsed(
        vocabNode[NS.schema.rangeIncludes],
        protocolSwitchedNamespaces,
        result
      );
      checkIfNamespaceFromListIsUsed(
        vocabNode["http://schema.org/rangeIncludes"],
        protocolSwitchedNamespaces,
        result
      );
      checkIfNamespaceFromListIsUsed(
        vocabNode["https://schema.org/rangeIncludes"],
        protocolSwitchedNamespaces,
        result
      );
      // super property
      checkIfNamespaceFromListIsUsed(
        vocabNode[NS.rdfs.subPropertyOf],
        protocolSwitchedNamespaces,
        result
      );
      checkIfNamespaceFromListIsUsed(
        vocabNode["http://www.w3.org/2000/01/rdf-schema#subPropertyOf"],
        protocolSwitchedNamespaces,
        result
      );
      // inverse property
      checkIfNamespaceFromListIsUsed(
        vocabNode[NS.schema.inverseOf],
        protocolSwitchedNamespaces,
        result
      );
      checkIfNamespaceFromListIsUsed(
        vocabNode["http://schema.org/inverseOf"],
        protocolSwitchedNamespaces,
        result
      );
      checkIfNamespaceFromListIsUsed(
        vocabNode["https://schema.org/inverseOf"],
        protocolSwitchedNamespaces,
        result
      );
    });
  }
  return Array.from(result);
}

/** @ignore
 * Checks if the value includes an absolute IRI that is present in the given namespaceArray. If so, that match is added to the given result Set.
 *
 * @param value - the value to check, is expected to be either an array, an object, or a string.
 * @param namespaceArray - an array of IRIs to search for
 * @param result - a Set to save the found matches
 */
export function checkIfNamespaceFromListIsUsed(
  value: string | object | (string | object)[],
  namespaceArray: string[],
  result: Set<string>
): void {
  if (Array.isArray(value)) {
    value.forEach(function (val) {
      checkIfNamespaceFromListIsUsed(val, namespaceArray, result);
    });
  } else {
    let toCheck: string;
    // todo this could be refactored? what if toCheck is either a string or an @id object? use types
    if (isObject(value) && isString(value["@id"])) {
      toCheck = value["@id"];
    } else {
      // } else if (isString(value)) {
      toCheck = value as string;
    }
    if (isString(toCheck) && toCheck.startsWith("http")) {
      const match = namespaceArray.find((el) => toCheck.startsWith(el));
      if (match && !result.has(match)) {
        result.add(match);
      }
    }
  }
}

/** @ignore */
export function getStandardContext(): Context {
  // Simply speaking, a context is used to map terms to IRIs. Terms are case-sensitive and any valid string that is not a reserved JSON-LD keyword can be used as a term.
  // soa:superClassOf is an inverse of rdfs:subClassOf that should help us
  // soa:superPropertyOf is an inverse of rdfs:subPropertyOf that should help us
  // soa:hasProperty is an inverse of schema:domainIncludes
  // soa:isRangeOf is an inverse of schema:rangeIncludes
  // soa:hasEnumerationMember is used for enumerations to list all its enumeration members (their @type includes the @id of the enumeration)
  // soa:enumerationDomainIncludes is an inverse of soa:hasEnumerationMember
  // soa:EnumerationMember is introduced as meta type for the members of a schema:Enumeration
  const standardContext: Context = {
    rdf: NS.rdf._url,
    rdfs: NS.rdfs._url,
    xsd: NS.xsd._url,
    dcterms: NS.dcterms._url,
    // schema: 'http://schema.org/', this entry will be generated the first time a vocabulary is added to the graph
    soa: NS.soa._url,
    ds: NS.ds._url,
  };
  const idEntries = [
    NS.soa.superClassOf,
    NS.soa.superPropertyOf,
    NS.soa.hasProperty,
    NS.soa.isRangeOf,
    NS.soa.hasEnumerationMember,
    NS.soa.enumerationDomainIncludes,
    NS.rdfs.subClassOf,
    NS.rdfs.subPropertyOf,
    NS.schema.isPartOf,
    NS.schema.domainIncludes,
    NS.schema.rangeIncludes,
    NS.schema.supersededBy,
    NS.schema.inverseOf,
    NS.schema.source,
    NS.dcterms.source,
  ];
  idEntries.map((el) => {
    standardContext[el] = {
      "@id": el,
      "@type": "@id",
    };
  });
  return standardContext;
}

/** @ignore
 * Part C) of the addVocabulary-algorithm
 * This function is used to extract enumerations and data-types form the class memory and move them to the corresponding memories
 * */
export function extractFromClassMemory(
  classMemory: TermMemory,
  otherMemory: TermMemory,
  addGraphNodeFn: (
    // eslint-disable-next-line no-unused-vars
    memory: Record<string, VocabularyNode>,
    // eslint-disable-next-line no-unused-vars
    newNode: VocabularyNode,
    // eslint-disable-next-line no-unused-vars
    vocabURL?: string
  ) => boolean,
  vocabURL?: string
) {
  let termSwitched;
  do {
    termSwitched = false;
    const classesKeys = Object.keys(classMemory);
    const otherKeys = Object.keys(otherMemory);
    for (const actClassKey of classesKeys) {
      if (otherKeys.includes(actClassKey)) {
        // if an entity of the class memory is already in the other memory, then merge them in the other memory (use-case: a new vocabulary adds data to an already existing non-class)
        termSwitched = true;
        // merge
        addGraphNodeFn(otherMemory, classMemory[actClassKey], vocabURL);
        delete classMemory[actClassKey];
      } else if (classMemory[actClassKey][NS.rdfs.subClassOf] !== undefined) {
        const subClassArray = classMemory[actClassKey][NS.rdfs.subClassOf];
        for (const actSubClass of subClassArray) {
          if (
            actSubClass === TermTypeIRI.enumeration ||
            otherKeys.includes(actSubClass)
          ) {
            if (classMemory[actClassKey] && !otherMemory[actClassKey]) {
              termSwitched = true;
              otherMemory[actClassKey] = cloneJson(classMemory[actClassKey]);
              delete classMemory[actClassKey];
            } else if (classMemory[actClassKey] && otherMemory[actClassKey]) {
              termSwitched = true;
              // merge
              addGraphNodeFn(otherMemory, classMemory[actClassKey], vocabURL);
              delete classMemory[actClassKey];
            }
          }
        }
      }
    }
  } while (termSwitched);
}

/** @ignore
 * Part D.1) of the addVocabulary-algorithm
 * Add link to sub-class for classes and enumerations
 */
export function addInheritanceTermsClassAndEnum(
  memory: TermMemory,
  enumerationsMemory: TermMemory,
  subOfProperty: string,
  superOfProperty: string
) {
  const classesKeys = Object.keys(memory);
  for (const actClassKey of classesKeys) {
    const superClasses = memory[actClassKey][subOfProperty];
    // add empty superClassOf if not defined
    if (!memory[actClassKey][superOfProperty]) {
      memory[actClassKey][superOfProperty] = [];
    }
    for (const actSuperClass of superClasses) {
      let superClass = memory[actSuperClass];
      if (!superClass) {
        superClass = enumerationsMemory[actSuperClass];
      }
      if (superClass) {
        if (superClass[superOfProperty]) {
          if (!superClass[superOfProperty].includes(actClassKey)) {
            superClass[superOfProperty].push(actClassKey);
          }
        } else {
          superClass[superOfProperty] = [actClassKey];
        }
      }
    }
  }
}

/** @ignore
 * Part D.2) and D.3) of the addVocabulary-algorithm
 * Add link to sub-class for classes and enumerations
 */
export function addInheritanceTermsDataTypesAndProperties(
  memory: TermMemory,
  subOfProperty: string,
  superOfProperty: string
) {
  const dataTypeKeys = Object.keys(memory);
  for (const actDtKey of dataTypeKeys) {
    const superClasses = memory[actDtKey][subOfProperty];
    // add empty superClassOf if not defined
    if (!memory[actDtKey][superOfProperty]) {
      memory[actDtKey][superOfProperty] = [];
    }
    // add empty subClassOf if not defined
    if (!superClasses) {
      memory[actDtKey][subOfProperty] = [];
    } else {
      for (const actSuperClass of superClasses) {
        const superClass = memory[actSuperClass];
        if (superClass) {
          if (superClass[superOfProperty]) {
            if (!superClass[superOfProperty].includes(actDtKey)) {
              superClass[superOfProperty].push(actDtKey);
            }
          } else {
            superClass[superOfProperty] = [actDtKey];
          }
        }
      }
    }
  }
}

/**
 * @ignore
 * Adds an empty array for the given attribute, if it doesnt exist yet
 */
export function addEmptyArray(termObject: VocabularyNode, property: string) {
  if (!termObject[property]) {
    termObject[property] = [];
  }
}

/**
 * @ignore
 */
export function nodeMergeOverwrite(
  oldNode: VocabularyNode,
  newNode: VocabularyNode,
  property: string
) {
  if (!isNil(newNode[property])) {
    oldNode[property] = newNode[property];
  }
}

/**
 * @ignore
 */
export function nodeMergeLanguageTerm(
  oldNode: VocabularyNode,
  newNode: VocabularyNode,
  property: string
) {
  if (!isNil(newNode[property])) {
    const langKeys = Object.keys(newNode[property]);
    // overwrite old one, if there was one
    for (const actLangKey of langKeys) {
      oldNode[property][actLangKey] = newNode[property][actLangKey];
    }
  }
}

/**
 * @ignore
 */
export function nodeMergeAddIds(
  oldNode: VocabularyNode,
  newNode: VocabularyNode,
  property: string
) {
  if (!isNil(newNode[property])) {
    for (const arrayElement of newNode[property]) {
      if (!oldNode[property].includes(arrayElement)) {
        // add new entry
        oldNode[property].push(arrayElement);
      }
    }
  }
}
