const jsonld = require("jsonld");

function applyFilter(dataArray, filter) {
    if (!Array.isArray(dataArray) || dataArray.length === 0 || filter === null) {
        return dataArray;
    }
    let result = [];
    for (let i = 0; i < dataArray.length; i++) {
        //superseeded
        if (filter.superseeded !== undefined) {
            if (filter.superseeded === false && dataArray[i].getSuperseeded() !== false) {
                continue; //skip this element
            }
            if (filter.superseeded === true && dataArray[i].getSuperseeded() === false) {
                continue; //skip this element
            }
        }
        //partOf

        //termType
        if (filter.termType !== undefined) {
            if (filter.termType !== dataArray[i].getTermType()) {
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
    //expand to remove the old context
    //compact to apply the new context (which is supposed to have been merged before with the old context through the function generateContext())
    return await jsonld.compact(await jsonld.expand(vocab), newContext);
}

function curateNode(vocabNode) {
    if (vocabNode["rdfs:comment"] !== undefined) {
        //make a vocab object with "en" as the standard value
        if (isString(vocabNode["rdfs:comment"])) {
            //standard -> "en"
            vocabNode["rdfs:comment"] = {
                "en": vocabNode["rdfs:comment"]
            };
        }
    } else {
        vocabNode["rdfs:comment"] = null;
    }
    if (vocabNode["rdfs:label"] !== undefined) {
        //make a vocab object with "en" as the standard value
        if (isString(vocabNode["rdfs:label"])) {
            //standard -> "en"
            vocabNode["rdfs:label"] = {
                "en": vocabNode["rdfs:label"]
            };
        }
    } else {
        vocabNode["rdfs:label"] = null;
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
    return vocabNode;
}

function mergeVocabNodes(oldNode, newNode) {
    return null; //todo
}

module.exports = {
    applyFilter,
    copByVal,
    isArray,
    isString,
    isObject,
    preProcessVocab,
    generateContext,
    curateNode
};