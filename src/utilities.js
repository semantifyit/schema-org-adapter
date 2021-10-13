const jsonld = require("jsonld");
// eslint-disable-next-line no-unused-vars
const Graph = require("./Graph");

/**
 * @typedef filterObject
 * @type {object}
 * @property {boolean} [isSuperseded] - defines the superseded status for the filter (true: only terms that are superseded, false: only terms that are NOT superseded)
 * @property {string|string[]} [fromVocabulary] - defines a set of allowed vocabularies for the filter - vocabularies are given as indicators (e.g. "schema")
 * @property {string|string[]} [termType] - defines a set of allowed term types for the filter (e.g. "Class", "Property")
 */

/**
 * Applies a filter to the IRIs in the given Array
 *
 * @param {string[]} dataArray - Array of IRIs that should be filtered
 * @param {filterObject} filter - The filter settings used to filter the dataArray (can be undefined to return all data back)
 * @param {Graph} graph - the graph calling this function
 * @returns {string[]} Array of IRIs that are in compliance with the given filter options
 */
function applyFilter(dataArray, filter, graph) {
  if (
    !Array.isArray(dataArray) ||
    dataArray.length === 0 ||
    !filter ||
    Object.keys(filter).length === 0
  ) {
    return dataArray;
  }
  const result = [];
  // check if given value is absolute IRI, if yes, get the vocab indicator for it
  const context = graph.context;
  if (isString(filter.fromVocabulary)) {
    for (const actKey of Object.keys(context)) {
      if (context[actKey] === filter.fromVocabulary) {
        filter.fromVocabulary = actKey;
        break;
      }
    }
  } else if (isArray(filter.fromVocabulary)) {
    for (let v = 0; v < filter.fromVocabulary.length; v++) {
      for (let vi = 0; vi < Object.keys(context).length; vi++) {
        if (context[Object.keys(context)[vi]] === filter.fromVocabulary[v]) {
          filter.fromVocabulary[v] = Object.keys(context)[vi];
          break;
        }
      }
    }
  }
  // check for every term, if it passes the filter conditions
  for (let i = 0; i < dataArray.length; i++) {
    const actualTerm = graph.getTerm(dataArray[i]);
    // superseded
    if (filter.isSuperseded !== undefined) {
      if (
        filter.isSuperseded === false &&
        actualTerm.isSupersededBy() != null
      ) {
        continue; // skip this element
      } else if (
        filter.isSuperseded === true &&
        actualTerm.isSupersededBy() == null
      ) {
        continue; // skip this element
      }
    }
    // partOf - vocabularies are given as indicators (e.g. "schema")
    if (filter.fromVocabulary) {
      let matchFound = false;
      if (isString(filter.fromVocabulary)) {
        if (filter.fromVocabulary)
          if (actualTerm.getIRI(true).startsWith(filter.fromVocabulary)) {
            matchFound = true;
          }
      } else if (isArray(filter.fromVocabulary)) {
        for (let v = 0; v < filter.fromVocabulary.length; v++) {
          if (actualTerm.getIRI(true).startsWith(filter.fromVocabulary[v])) {
            matchFound = true;
          }
        }
      }
      if (!matchFound) {
        continue; // skip this element
      }
    }
    // termType
    if (filter.termType) {
      let matchFound = false;
      let toCheck = [];
      if (isString(filter.termType)) {
        toCheck.push(filter.termType);
      } else if (isArray(filter.termType)) {
        toCheck = filter.termType;
      }
      for (let t = 0; t < toCheck.length; t++) {
        let typeIRI;
        switch (toCheck[t]) {
          case "Class":
            typeIRI = "rdfs:Class";
            break;
          case "Property":
            typeIRI = "rdf:Property";
            break;
          case "Enumeration":
            typeIRI = "schema:Enumeration";
            break;
          case "EnumerationMember":
            typeIRI = "soa:EnumerationMember";
            break;
          case "DataType":
            typeIRI = "schema:DataType";
            break;
          default:
            throw new Error("Invalid filter.termType " + toCheck[t]);
        }
        if (typeIRI === actualTerm.getTermType()) {
          matchFound = true;
          break;
        }
      }
      if (!matchFound) {
        continue; // skip this element
      }
    }

    result.push(dataArray[i]);
  }
  return result;
}

/**
 * Creates a clone of the given JSON input (without reference to the original input)
 *
 * @param {any} input - the JSON element that should be copied
 * @returns {any} copy of the given JSON element
 */
function cloneJson(input) {
  if (input === undefined) {
    return undefined;
  }
  return JSON.parse(JSON.stringify(input));
}

/**
 * Checks if the given input is a JS object
 *
 * @param {any} value - the input element to check
 * @returns {boolean} true if the given input is a JS object
 */
function isObject(value) {
  if (Array.isArray(value)) {
    return false;
  }
  if (isNil(value)) {
    return false;
  }
  return typeof value === "object";
}

/**
 * Checks if the given input is undefined or null
 *
 * @param {any} value - the input element to check
 * @returns {boolean} true if the given input is undefined or null
 */
function isNil(value) {
  return value === undefined || value === null;
}

/**
 * Checks if the given input is a string
 *
 * @param {any} value - the input element to check
 * @returns {boolean} true if the given input is a string
 */
function isString(value) {
  if (isNil(value)) {
    return false;
  }
  return typeof value === "string" || value instanceof String;
}

/**
 * Checks if the given input is a JS array
 *
 * @param {any} value - the input element to check
 * @returns {boolean} true if the given input is a JS array
 */
function isArray(value) {
  return Array.isArray(value);
}

//
/**
 * Removes duplicates from a given Array
 *
 * @param {Array} array - the input array
 * @returns {Array} the input array without duplicates
 */
function uniquifyArray(array) {
  const seen = {};
  const result = [];
  for (const item of array) {
    if (!seen[item]) {
      seen[item] = 1;
      result.push(item);
    }
  }
  return result;
}

/**
 * Merges 2 JSON-LD context objects into a new one
 *
 * @param {object} currentContext - the first context object
 * @param {object} newContext - the second context object
 * @returns {object} the resulting context object
 */
function generateContext(currentContext, newContext) {
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
          while (foundFreeName === false) {
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
  // sort vocab URIs by alphabet
  const ordered = {};
  Object.keys(resultContext)
    .sort()
    .forEach(function (key) {
      ordered[key] = resultContext[key];
    });
  // reorder context: Vocab Indicators first (value = string), then term handlers (value = object)
  resultContext = ordered;
  const keysResultContext = Object.keys(resultContext);
  const orderedResultContext = {};
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

/**
 * Transforms a given vocabulary to a wished format (including a given JSON-LD context)
 *
 * @param {object} vocab - the vocabulary to process
 * @param {object} newContext - the wished JSON-LD context that the vocabulary should have
 * @returns {object} the transformed vocabulary
 */
async function preProcessVocab(vocab, newContext) {
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
  } while (foundInnerGraph === true);

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
    return compactedVocab;
  }
}

/**
 * Processes a given vocabulary node to a wished format (we call this process "curation")
 *
 * @param {object} vocabNode - the input vocabulary node
 * @param {Array} vocabularies - the vocabularies used by the graph so far
 * @returns {object} the curated node
 */
function curateVocabNode(vocabNode, vocabularies) {
  if (vocabNode["rdfs:comment"] !== undefined) {
    // make a vocab object with "en" as the standard value
    if (isString(vocabNode["rdfs:comment"])) {
      // standard -> "en"
      vocabNode["rdfs:comment"] = {
        en: vocabNode["rdfs:comment"],
      };
    } else if (isObject(vocabNode["rdfs:comment"])) {
      const newVal = {};
      newVal[vocabNode["rdfs:comment"]["@language"]] =
        vocabNode["rdfs:comment"]["@value"];
      vocabNode["rdfs:comment"] = cloneJson(newVal);
    } else if (isArray(vocabNode["rdfs:comment"])) {
      const newVal = {};
      for (let i = 0; i < vocabNode["rdfs:comment"].length; i++) {
        if (isObject(vocabNode["rdfs:comment"][i])) {
          newVal[vocabNode["rdfs:comment"][i]["@language"]] =
            vocabNode["rdfs:comment"][i]["@value"];
        }
      }
      vocabNode["rdfs:comment"] = cloneJson(newVal);
    }
  } else {
    vocabNode["rdfs:comment"] = {};
  }
  if (vocabNode["rdfs:label"] !== undefined) {
    // make a vocab object with "en" as the standard value
    if (isString(vocabNode["rdfs:label"])) {
      // "rdfs:label": "transcript"
      // standard -> "en"
      vocabNode["rdfs:label"] = {
        en: vocabNode["rdfs:label"],
      };
    } else if (isObject(vocabNode["rdfs:label"])) {
      // "rdfs:label": {
      //   "@language": "en",
      //   "@value": "translationOfWork"
      // }
      const newVal = {};
      newVal[vocabNode["rdfs:label"]["@language"]] =
        vocabNode["rdfs:label"]["@value"];
      vocabNode["rdfs:label"] = cloneJson(newVal);
    } else if (isArray(vocabNode["rdfs:label"])) {
      // "rdfs:label": [{
      //   "@language": "en",
      //   "@value": "translationOfWork"
      // },
      // {
      //   "@language": "de",
      //   "@value": "UebersetzungsArbeit"
      // }]
      const newVal = {};
      for (let i = 0; i < vocabNode["rdfs:label"].length; i++) {
        if (isObject(vocabNode["rdfs:label"][i])) {
          newVal[vocabNode["rdfs:label"][i]["@language"]] =
            vocabNode["rdfs:label"][i]["@value"];
        }
      }
      vocabNode["rdfs:label"] = cloneJson(newVal);
    }
  } else {
    vocabNode["rdfs:label"] = {};
  }
  // make arrays for some terms in any case
  if (isString(vocabNode["rdfs:subClassOf"])) {
    vocabNode["rdfs:subClassOf"] = [vocabNode["rdfs:subClassOf"]];
  } else if (
    vocabNode["rdfs:subClassOf"] === undefined &&
    vocabNode["@type"] === "rdfs:Class"
  ) {
    vocabNode["rdfs:subClassOf"] = [];
  }
  if (isString(vocabNode["rdfs:subPropertyOf"])) {
    vocabNode["rdfs:subPropertyOf"] = [vocabNode["rdfs:subPropertyOf"]];
  } else if (
    vocabNode["rdfs:subPropertyOf"] === undefined &&
    vocabNode["@type"] === "rdf:Property"
  ) {
    vocabNode["rdfs:subPropertyOf"] = [];
  }
  if (isString(vocabNode["schema:domainIncludes"])) {
    vocabNode["schema:domainIncludes"] = [vocabNode["schema:domainIncludes"]];
  } else if (
    vocabNode["schema:domainIncludes"] === undefined &&
    vocabNode["@type"] === "rdf:Property"
  ) {
    vocabNode["schema:domainIncludes"] = [];
  }
  if (isString(vocabNode["schema:rangeIncludes"])) {
    vocabNode["schema:rangeIncludes"] = [vocabNode["schema:rangeIncludes"]];
  } else if (
    vocabNode["schema:rangeIncludes"] === undefined &&
    vocabNode["@type"] === "rdf:Property"
  ) {
    vocabNode["schema:rangeIncludes"] = [];
  }
  if (
    vocabNode["schema:inverseOf"] === undefined &&
    vocabNode["@type"] === "rdf:Property"
  ) {
    vocabNode["schema:inverseOf"] = null;
  }
  if (!isString(vocabNode["schema:isPartOf"])) {
    const vocabKeys = Object.keys(vocabularies);
    let vocab;
    for (let i = 0; i < vocabKeys.length; i++) {
      if (
        vocabNode["@id"].substring(0, vocabNode["@id"].indexOf(":")) ===
        vocabKeys[i]
      ) {
        vocab = vocabularies[vocabKeys[i]];
        break;
      }
    }
    if (vocab !== undefined) {
      let newChange;
      do {
        newChange = false;
        if (vocab.endsWith("/") || vocab.endsWith("#")) {
          vocab = vocab.substring(0, vocab.length - 1);
          newChange = true;
        }
      } while (newChange === true);
      vocabNode["schema:isPartOf"] = vocab;
    }
  }
  return vocabNode;
}

/*
term - A term is a short word defined in a context that MAY be expanded to an IRI
compact IRI - A compact IRI has the form of prefix:suffix and is used as a way of expressing an IRI without needing to define separate term definitions for each IRI contained within a common vocabulary identified by prefix.
prefix - A prefix is the first component of a compact IRI which comes from a term that maps to a string that, when prepended to the suffix of the compact IRI results in an absolute IRI. */

/**
 * Returns the compact IRI from a given absolute IRI and a corresponding context. If the context does not contain the used namespace, then 'null' is returned
 *
 * @param {string} absoluteIRI - the absolute IRI to transform
 * @param {object} context - the context object holding key-value pairs that represent indicator-namespace pairs
 * @param {boolean} [equateVocabularyProtocols = false] - treats namespaces as equal even if their protocols (http/https) are different, it defaults to false.
 * @returns {?string} the compact IRI (null, if given context does not contain the used namespace)
 */
function toCompactIRI(absoluteIRI, context, equateVocabularyProtocols = false) {
  for (const contextTerm of Object.keys(context)) {
    const vocabIRI = context[contextTerm];
    if (isString(vocabIRI) && absoluteIRI.startsWith(vocabIRI)) {
      return contextTerm + ":" + absoluteIRI.substring(vocabIRI.length);
    }
    if (equateVocabularyProtocols && isString(vocabIRI)) {
      const protocolSwitchedIRI = switchIRIProtocol(vocabIRI);
      if (absoluteIRI.startsWith(protocolSwitchedIRI)) {
        return (
          contextTerm + ":" + absoluteIRI.substring(protocolSwitchedIRI.length)
        );
      }
    }
  }
  return null;
}

/**
 * Returns the absolute IRI from a given compact IRI and a corresponding context. If the context does not contain the used namespace, then 'null' is returned
 *
 * @param {string} compactIRI - the compact IRI to transform
 * @param {object} context - the context object holding key-value pairs that represent indicator-namespace pairs
 * @returns {?string} the absolute IRI (null, if given context does not contain the used namespace)
 */
function toAbsoluteIRI(compactIRI, context) {
  const terms = Object.keys(context);
  for (let i = 0; i < terms.length; i++) {
    const vocabIRI = context[terms[i]];
    if (compactIRI.substring(0, compactIRI.indexOf(":")) === terms[i]) {
      return vocabIRI.concat(compactIRI.substring(compactIRI.indexOf(":") + 1));
    }
  }
  return null;
}

/**
 * Returns a sorted Array of Arrays that have a schema.org vocabulary version as first entry and it's release date as second entry. Latest is first in array.
 *
 * @param {object} releaseLog - the releaseLog object from the versionsFile of schema.org
 * @returns {Array} - Array with sorted release Arrays -> [version, date]
 */
function sortReleaseEntriesByDate(releaseLog) {
  let versionEntries = Object.entries(releaseLog);
  return versionEntries.sort((a, b) => new Date(b[1]) - new Date(a[1]));
}

/**
 * Returns the jsonld filename that holds the schema.org vocabulary for a given version.
 *
 * @param {string} version - the schema.org version
 * @param {boolean} [schemaHttps = true] - use https as protocol for the schema.org vocabulary - works only from version 9.0 upwards
 * @returns {string} - the corresponding jsonld filename
 */
function getFileNameForSchemaOrgVersion(version, schemaHttps = true) {
  switch (version) {
    case "2.0":
    case "2.1":
    case "2.2":
    case "3.0":
      throw new Error("There is no jsonld file for that schema.org version.");
    case "3.1":
    case "3.2":
    case "3.3":
    case "3.4":
    case "3.5":
    case "3.6":
    case "3.7":
    case "3.8":
    case "3.9":
    case "4.0":
    case "5.0":
    case "6.0":
    case "7.0":
    case "7.01":
    case "7.02":
    case "7.03":
    case "7.04":
    case "8.0":
      return "all-layers.jsonld";
    case "9.0":
      if (schemaHttps) {
        return "schemaorg-all-https.jsonld";
      } else {
        return "schemaorg-all-http.jsonld";
      }
    default:
      // this is expected for newer releases that are not covered yet
      if (schemaHttps) {
        return "schemaorg-all-https.jsonld";
      } else {
        return "schemaorg-all-http.jsonld";
      }
  }
}

/**
 * Returns the protocol version used for schema.org in the given vocabulary. Returns "https" as the default
 *
 * @param {object} vocabulary - the vocabulary in question
 * @returns {?string} - the corresponding protocol version, either "http" or "https"
 */
function discoverUsedSchemaOrgProtocol(vocabulary) {
  const httpsIRI = "https://schema.org/";
  const httpIRI = "http://schema.org/";
  // 1. check if namespace is used in @context
  if (vocabulary["@context"]) {
    for (const contextEntry of Object.values(vocabulary["@context"])) {
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

/**
 * Checks if the given vocabulary uses terms (in context or content) that are present in the current given context but with another protocol (http/https), and returns those in a list
 *
 * @param {object} currentContext - the current context
 * @param {object} vocabulary - the vocabulary to be analyzed
 * @returns {string[]} - an array with the found equate namespaces
 */
function discoverEquateNamespaces(currentContext, vocabulary) {
  let result = new Set();
  // 1. Make List of protocol switched namespaces from the current context
  let protocolSwitchedNamespaces = [];
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
        vocabNode["rdfs:subClassOf"],
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
        vocabNode["schema:domainIncludes"],
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
        vocabNode["schema:rangeIncludes"],
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
        vocabNode["rdfs:subPropertyOf"],
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
        vocabNode["schema:inverseOf"],
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

/**
 * Checks if the value includes an absolute IRI that is present in the given namespaceArray. If so, that match is added to the given result Set.
 *
 * @param {any} value - the value to check, is expected to be either an array, an object, or a string.
 * @param {string[]} namespaceArray - an array of IRIs to search for
 * @param {Set} result - a Set to save the found matches
 */
function checkIfNamespaceFromListIsUsed(value, namespaceArray, result) {
  if (Array.isArray(value)) {
    value.forEach(function (val) {
      checkIfNamespaceFromListIsUsed(val, namespaceArray, result);
    });
  } else {
    let toCheck;
    if (isObject(value) && isString(value["@id"])) {
      toCheck = value["@id"];
    } else if (isString(value)) {
      toCheck = value;
    }
    if (isString(toCheck) && toCheck.startsWith("http")) {
      let match = namespaceArray.find((el) => toCheck.startsWith(el));
      if (match && !result.has(match)) {
        result.add(match);
      }
    }
  }
}

/**
 * Returns the given absolute IRI, but with the opposite protocol (http vs. https)
 *
 * @param  {string}IRI - the IRI that should be transformed
 * @returns {string} - the resulting transformed IRI
 */
function switchIRIProtocol(IRI) {
  if (IRI.startsWith("https://")) {
    return "http" + IRI.substring(5);
  } else if (IRI.startsWith("http://")) {
    return "https" + IRI.substring(4);
  }
  return IRI;
}

module.exports = {
  applyFilter,
  cloneJson,
  isArray,
  isString,
  isObject,
  isNil,
  uniquifyArray,
  preProcessVocab,
  generateContext,
  curateVocabNode,
  toCompactIRI,
  toAbsoluteIRI,
  sortReleaseEntriesByDate,
  getFileNameForSchemaOrgVersion,
  discoverUsedSchemaOrgProtocol,
  discoverEquateNamespaces,
  switchIRIProtocol,
};
