const jsonld = require("jsonld");


/**
 * Applies a filter to the IRIs in the given Array
 * @param {array} dataArray - Array of IRIs that should be filtered
 * @param {object} filter - The filter options, which can be: "isSuperseded": T/F, "hasTermType": string/Array, "isFromVocabulary": string/Array
 * @returns {array} Array of IRIs that are in compliance with the given filter options
 */
function applyFilter(dataArray, filter, graph) {
    if (!Array.isArray(dataArray) || dataArray.length === 0 || filter === null || Object.keys(filter).length === 0) {
        return dataArray;
    }
    let result = [];
    for (let i = 0; i < dataArray.length; i++) {
        let actualTerm = graph.getTerm(dataArray[i]);
        //superseded
        if (filter.isSuperseded !== undefined) {
            if (filter.isSuperseded === false && actualTerm.isSupersededBy() !== null) {
                continue; //skip this element
            } else if (filter.isSuperseded === true && actualTerm.isSupersededBy() === null) {
                continue; //skip this element
            }
        }
        //partOf - vocabularies are given as indicators (e.g. "schema")
        if (filter.fromVocabulary !== undefined) {
            let matchFound = false;
            if (isString(filter.fromVocabulary)) {
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
                continue; //skip this element
            }
        }
        //termType
        if (filter.termType !== undefined) {
            let matchFound = false;
            let toCheck = [];
            if (isString(filter.termType)) {
                toCheck.push(filter.termType)
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
                        console.log("Invalid filter.termType " + toCheck[t]);
                }
                if (typeIRI === actualTerm.getTermType()) {
                    matchFound = true;
                    break;
                }
            }
            if (!matchFound) {
                continue; //skip this element
            }
        }

        result.push(dataArray[i]);
    }
    return result;
}

function copByVal(obj) {
    if (obj === undefined) {
        return undefined; //causes error for JSON functions
    }
    return (JSON.parse(JSON.stringify(obj)));
}

function isObject(value) {
    if (Array.isArray(value)) {
        return false;
    }
    if (value === undefined || value === null) {
        return false;
    }
    return typeof value === 'object';
}

function isString(value) {
    if (value === undefined || value === null) {
        return false;
    }
    return typeof value === 'string' || value instanceof String;
}

function isArray(value) {
    return Array.isArray(value);
}

//make sure each string is only 1 time in the array
function uniquifyArray(array) {
    let seen = {};
    let result = [];
    for (let i = 0; i < array.length; i++) {
        let item = array[i];
        if (seen[item] !== 1) {
            seen[item] = 1;
            result.push(item);
        }
    }
    return result;
}

function generateContext(currentContext, newContext) {
    let keysCurrentContext = Object.keys(currentContext);
    let keysNewContext = Object.keys(newContext);
    //add all of the old context
    let resultContext = JSON.parse(JSON.stringify(currentContext));
    //add vocabs of new context that are not already used (value is URI)
    for (let i = 0; i < keysNewContext.length; i++) {
        let actKey = keysNewContext[i];
        if (isString(newContext[actKey])) {
            //first: check if the URI is already used, with any indicator
            let foundMatch = false;
            for (let k = 0; k < keysCurrentContext.length; k++) {
                if (isString(resultContext[keysCurrentContext[k]])) {
                    if (resultContext[keysCurrentContext[k]] === newContext[actKey]) {
                        //found match, the URI is already covered
                        foundMatch = true;
                        break;
                    }
                }
            }
            if (foundMatch) {
                continue; //URI is already covered, continue with next
            }
            if (resultContext[actKey] === undefined) {
                //add new vocab indicator
                resultContext[actKey] = newContext[actKey];
            } else {
                //check if the URI is the same, if not: add new uri under new vocab indicator
                if (resultContext[actKey] !== newContext[actKey]) {
                    let foundFreeName = false;
                    let counter = 1;
                    while (foundFreeName === false) {
                        let newVocabIndicator = actKey + counter++;
                        if (resultContext[newVocabIndicator] === undefined) {
                            foundFreeName = true;
                            resultContext[newVocabIndicator] = newContext[actKey];
                        }
                    }

                }
            }
        }
    }
    //sort vocab URIs by alphabet
    let ordered = {};
    Object.keys(resultContext).sort().forEach(function (key) {
        ordered[key] = resultContext[key];
    });
    //reorder context: Vocab Indicators first (value = string), then term handlers (value = object)
    resultContext = ordered;
    let keysResultContext = Object.keys(resultContext);
    let orderedResultContext = {};
    //add the Vocab Indicators (value = string)
    for (let i = 0; i < keysResultContext.length; i++) {
        if (isString(resultContext[keysResultContext[i]])) {
            orderedResultContext[keysResultContext[i]] = resultContext[keysResultContext[i]];
        }
    }
    //add the term handlers (value = object)
    for (let i = 0; i < keysResultContext.length; i++) {
        if (isObject(resultContext[keysResultContext[i]])) {
            orderedResultContext[keysResultContext[i]] = resultContext[keysResultContext[i]];
        }
    }
    return orderedResultContext;
}

async function preProcessVocab(vocab, newContext) {
    //recursively put all nodes from inner @graphs to the outermost @graph (is the case for older schema.jsonld versions)
    let foundInnerGraph = false;
    do {
        let newGraph = [];
        foundInnerGraph = false;
        for (let i = 0; i < vocab["@graph"].length; i++) {
            if (vocab["@graph"][i]["@graph"] !== undefined) {
                newGraph.push(...copByVal(vocab["@graph"][i]["@graph"])); //copy all elements of the inner @graph into the outer @graph
                foundInnerGraph = true;
            } else {
                newGraph.push(copByVal(vocab["@graph"][i])); //copy this element to the outer @graph
            }
        }
        vocab["@graph"] = copByVal(newGraph);
    } while (foundInnerGraph === true);

    //expand to remove the old context
    const expandedVocab = await jsonld.expand(vocab);

    //compact to apply the new context (which is supposed to have been merged before with the old context through the function generateContext())
    //option "graph": true not feasible here, because than vocabs with "@id" result in inner @graphs again
    //solution: edge case handling (see below)
    const compactedVocab = await jsonld.compact(expandedVocab, newContext);

    //edge case: @graph had only one node, so values of @graph are in outermost layer
    if (compactedVocab["@graph"] === undefined) {
        delete compactedVocab["@context"];
        return {
            "@context": newContext,
            "@graph": [
                compactedVocab
            ]
        }
    } else {
        return compactedVocab;
    }
}

function curateNode(vocabNode, vocabularies) {
    if (vocabNode["rdfs:comment"] !== undefined) {
        //make a vocab object with "en" as the standard value
        if (isString(vocabNode["rdfs:comment"])) {
            //standard -> "en"
            vocabNode["rdfs:comment"] = {
                "en": vocabNode["rdfs:comment"]
            };
        } else if (isObject(vocabNode["rdfs:comment"])) {

            let newVal = {};
            newVal[vocabNode["rdfs:comment"]["@language"]] = vocabNode["rdfs:comment"]["@value"];
            vocabNode["rdfs:comment"] = copByVal(newVal);
        } else if (isArray(vocabNode["rdfs:comment"])) {
            let newVal = {};
            for (let i = 0; i < vocabNode["rdfs:comment"].length; i++) {
                if (isObject(vocabNode["rdfs:comment"][i])) {
                    newVal[vocabNode["rdfs:comment"][i]["@language"]] = vocabNode["rdfs:comment"][i]["@value"];
                }
            }
            vocabNode["rdfs:comment"] = copByVal(newVal);
        }
    } else {
        vocabNode["rdfs:comment"] = {};
    }
    if (vocabNode["rdfs:label"] !== undefined) {
        //make a vocab object with "en" as the standard value
        if (isString(vocabNode["rdfs:label"])) {
            //"rdfs:label": "transcript"
            //standard -> "en"
            vocabNode["rdfs:label"] = {
                "en": vocabNode["rdfs:label"]
            };
        } else if (isObject(vocabNode["rdfs:label"])) {
            //"rdfs:label": {
            //   "@language": "en",
            //   "@value": "translationOfWork"
            // }
            let newVal = {};
            newVal[vocabNode["rdfs:label"]["@language"]] = vocabNode["rdfs:label"]["@value"];
            vocabNode["rdfs:label"] = copByVal(newVal);
        } else if (isArray(vocabNode["rdfs:label"])) {
            //"rdfs:label": [{
            //   "@language": "en",
            //   "@value": "translationOfWork"
            // },
            // {
            //   "@language": "de",
            //   "@value": "UebersetzungsArbeit"
            // }
            // ]
            let newVal = {};
            for (let i = 0; i < vocabNode["rdfs:label"].length; i++) {
                if (isObject(vocabNode["rdfs:label"][i])) {
                    newVal[vocabNode["rdfs:label"][i]["@language"]] = vocabNode["rdfs:label"][i]["@value"];
                }
            }
            vocabNode["rdfs:label"] = copByVal(newVal);
        }
    } else {
        vocabNode["rdfs:label"] = {};
    }
    //make arrays for some terms in any case
    if (isString(vocabNode["rdfs:subClassOf"])) {
        vocabNode["rdfs:subClassOf"] = [vocabNode["rdfs:subClassOf"]];
    } else if (vocabNode["rdfs:subClassOf"] === undefined && vocabNode["@type"] === "rdfs:Class") {
        vocabNode["rdfs:subClassOf"] = [];
    }
    if (isString(vocabNode["rdfs:subPropertyOf"])) {
        vocabNode["rdfs:subPropertyOf"] = [vocabNode["rdfs:subPropertyOf"]];
    } else if (vocabNode["rdfs:subPropertyOf"] === undefined && vocabNode["@type"] === "rdf:Property") {
        vocabNode["rdfs:subPropertyOf"] = [];
    }
    if (isString(vocabNode["schema:domainIncludes"])) {
        vocabNode["schema:domainIncludes"] = [vocabNode["schema:domainIncludes"]];
    } else if (vocabNode["schema:domainIncludes"] === undefined && vocabNode["@type"] === "rdf:Property") {
        vocabNode["schema:domainIncludes"] = [];
    }
    if (isString(vocabNode["schema:rangeIncludes"])) {
        vocabNode["schema:rangeIncludes"] = [vocabNode["schema:rangeIncludes"]];
    } else if (vocabNode["schema:rangeIncludes"] === undefined && vocabNode["@type"] === "rdf:Property") {
        vocabNode["schema:rangeIncludes"] = [];
    }
    if (!isString(vocabNode["schema:isPartOf"])) {
        let vocabKeys = Object.keys(vocabularies);
        let vocab;
        for (let i = 0; i < vocabKeys.length; i++) {
            if (vocabNode["@id"].substring(0, vocabNode["@id"].indexOf(":")) === vocabKeys[i]) {
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
compact IRI - A compact IRI is has the form of prefix:suffix and is used as a way of expressing an IRI without needing to define separate term definitions for each IRI contained within a common vocabulary identified by prefix.
prefix - A prefix is the first component of a compact IRI which comes from a term that maps to a string that, when prepended to the suffix of the compact IRI results in an absolute IRI.*/

function toCompactIRI(absoluteIRI, context) {
    let terms = Object.keys(context);
    for (let i = 0; i < terms.length; i++) {
        let vocabIRI = context[terms[i]];
        if (isString(vocabIRI) && absoluteIRI.startsWith(vocabIRI)) {
            return terms[i] + ":" + absoluteIRI.substring(vocabIRI.length);
        }
    }
    return null;
}

function toAbsoluteIRI(compactIRI, context) {
    let terms = Object.keys(context);
    for (let i = 0; i < terms.length; i++) {
        let vocabIRI = context[terms[i]];
        if (compactIRI.substring(0, compactIRI.indexOf(":")) === terms[i]) {
            return vocabIRI.concat(compactIRI.substring(compactIRI.indexOf(":") + 1));
        }
    }
    return null;
}


module.exports = {
    applyFilter,
    copByVal,
    isArray,
    isString,
    isObject,
    uniquifyArray,
    preProcessVocab,
    generateContext,
    curateNode,
    toCompactIRI,
    toAbsoluteIRI
};