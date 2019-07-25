const util = require("./utilities");
const Class = require("./Class");
const Property = require("./Property");
const Enumeration = require("./Enumeration");
const EnumerationMember = require("./EnumerationMember");
const DataType = require("./DataType");
const ReasoningEngine = require("./ReasoningEngine");

class Graph {
    /**
     * @constructor
     * @param {object} sdoAdapter - The parent sdoAdapter-class to which this Graph belongs
     */
    constructor(sdoAdapter) {
        this.sdoAdapter = sdoAdapter;
        this.reasoner = new ReasoningEngine(this);
        // Simply speaking, a context is used to map terms to IRIs. Terms are case sensitive and any valid string that is not a reserved JSON-LD keyword can be used as a term.
        // soa:superClassOf is an inverse of rdfs:subClassOf that should help us
        // soa:superPropertyOf is an inverse of rdfs:subPropertyOf that should help us
        // soa:hasProperty is an inverse of schema:domainIncludes
        // soa:isRangeOf is an inverse of schema:rangeIncludes
        // soa:hasEnumerationMember is used for enumerations to list all its enumeration members (their @type includes the @id of the enumeration)
        // soa:enumerationDomainIncludes is an inverse of soa:hasEnumerationMember
        this.context = {
            "rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
            "rdfs": "http://www.w3.org/2000/01/rdf-schema#",
            "xsd": "http://www.w3.org/2001/XMLSchema#",
            "dc": "http://purl.org/dc/terms/",
            "schema": "http://schema.org/",
            "soa": "http://schema-org-adapter.at/vocabTerms/",
            "soa:superClassOf": {
                "@id": "soa:superClassOf",
                "@type": "@id"
            },
            "soa:superPropertyOf": {
                "@id": "soa:superPropertyOf",
                "@type": "@id"
            },
            "soa:hasProperty": {
                "@id": "soa:hasProperty",
                "@type": "@id"
            },
            "soa:isRangeOf": {
                "@id": "soa:isRangeOf",
                "@type": "@id"
            },
            "soa:hasEnumerationMember": {
                "@id": "soa:hasEnumerationMember",
                "@type": "@id"
            },
            "soa:enumerationDomainIncludes": {
                "@id": "soa:enumerationDomainIncludes",
                "@type": "@id"
            },
            "rdfs:subClassOf": {
                "@id": "rdfs:subClassOf",
                "@type": "@id"
            },
            "rdfs:subPropertyOf": {
                "@id": "rdfs:subPropertyOf",
                "@type": "@id"
            },
            "schema:isPartOf": {
                "@id": "schema:isPartOf",
                "@type": "@id"
            },
            "schema:domainIncludes": {
                "@id": "schema:domainIncludes",
                "@type": "@id"
            },
            "schema:rangeIncludes": {
                "@id": "schema:rangeIncludes",
                "@type": "@id"
            },
            "schema:supersededBy": {
                "@id": "schema:supersededBy",
                "@type": "@id"
            },
            "schema:inverseOf": {
                "@id": "schema:inverseOf",
                "@type": "@id"
            },
            "dc:source": {
                "@id": "dc:source",
                "@type": "@id"
            }
        };
        this.classes = {}; //keys are the compacted IRI
        this.properties = {}; //keys are the compacted IRI
        this.dataTypes = {}; //keys are the compacted IRI
        this.enumerations = {}; //keys are the compacted IRI
        this.enumerationMembers = {}; //keys are the compacted IRI
    }

    /**
     * Adds a new vocabulary (in JSON-LD format) to the graph data
     * @param {object} vocab - The vocabulary to add the graph, in JSON-LD format
     * @return {boolean} returns true on success
     */
    async addVocabulary(vocab) {
        try {
            //A) Load and pre-process Vocabulary
            //create new context
            this.context = util.generateContext(this.context, vocab["@context"]);
            //pre-process new vocab
            vocab = await util.preProcessVocab(vocab, this.context); //adapt @graph to new context
            let vocabularies = this.sdoAdapter.getVocabularies();
            for (let i = 0; i < vocab["@graph"].length; i++) {
                vocab["@graph"][i] = util.curateNode(vocab["@graph"][i], vocabularies); //curate nodes
            }
            //add new vocab

            //B) Classify Input
            /**
             Classify every @graph node based on its @type. The node is transformed to another data-model based on the @type and stored in a new memory storage for an easier further usage. This is the first of two steps for an exact classification of the node, since the @type is not enough for a correct classification. The mapping of our data model and the @type(s) of the corresponding @graph nodes are as follows:
             classes ("@type" = "rdfs:Class")
             properties ("@type" = "rdf:Property")
             dataTypes ("@type" = "rdfs:Class" + "http://schema.org/DataType")
             enumerations ("@type" = "rdfs:Class")
             enumerationMembers ("@type" = @id of enumeration)
             */
            for (let i = 0; i < vocab["@graph"].length; i++) {
                let curNode = JSON.parse(JSON.stringify(vocab["@graph"][i]));
                if (util.isString(curNode["@type"])) {
                    switch (curNode["@type"]) {
                        case "rdfs:Class":
                            this.addGraphNode(this.classes, curNode);
                            break;
                        case "rdf:Property":
                            this.addGraphNode(this.properties, curNode);
                            break;
                        default:
                            //@type is not something expected -> enumerationMember
                            this.addGraphNode(this.enumerationMembers, curNode);
                            break;
                    }
                } else {
                    //@type is not a string -> datatype or enumeration
                    // [
                    //     "rdfs:Class",
                    //     "schema:DataType"
                    // ]
                    //[
                    //   "schema:MedicalImagingTechnique",
                    //   "schema:MedicalSpecialty"
                    // ]
                    if (curNode["@type"].indexOf("rdfs:Class") !== -1 && curNode["@type"].indexOf("schema:DataType") !== -1) {
                        //datatype
                        this.addGraphNode(this.dataTypes, curNode);
                    } else {
                        //enumeration member
                        this.addGraphNode(this.enumerationMembers, curNode);
                    }

                }
            }
            //C) Classification cleaning
            /* To have a correct classification for our data model it is needed to clean the data generated in the previous step. Inaccurate records include:
             Enumerations which are handled as Classes.
             DataTypes which are handled as Classes.
             */

            //C.1)  Extract enumerations from classes memory
            // For each entry in the classes memory check if its superClasses contain Enumeration or another Enumeration. If this is the case, it is known that this class is an enumeration.
            let newEnum;
            do {
                newEnum = false;
                let classesKeys = Object.keys(this.classes);
                let enumKeys = Object.keys(this.enumerations);
                for (let i = 0; i < classesKeys.length; i++) {
                    if (this.classes[classesKeys[i]]["rdfs:subClassOf"] !== undefined) {
                        let subClassArray = this.classes[classesKeys[i]]["rdfs:subClassOf"];
                        for (let j = 0; j < subClassArray.length; j++) {
                            if (enumKeys.indexOf(subClassArray[j]) !== -1 || subClassArray[j] === "schema:Enumeration") {
                                if (this.classes[classesKeys[i]] !== undefined && this.enumerations[classesKeys[i]] === undefined) {
                                    newEnum = true;
                                    this.enumerations[classesKeys[i]] = JSON.parse(JSON.stringify(this.classes[classesKeys[i]]));
                                    delete this.classes[classesKeys[i]];
                                }
                            }
                        }
                    }
                }
            } while (newEnum);
            //C.2) check if there are subclasses of dataTypes which are in the classes data, put them in dataType data
            let newDatatype;
            do {
                newDatatype = false;
                let classesKeys = Object.keys(this.classes);
                let dtKeys = Object.keys(this.dataTypes);
                for (let i = 0; i < classesKeys.length; i++) {
                    if (this.classes[classesKeys[i]]["rdfs:subClassOf"] !== undefined) {
                        let subClassArray = this.classes[classesKeys[i]]["rdfs:subClassOf"];
                        for (let j = 0; j < subClassArray.length; j++) {
                            if (dtKeys.indexOf(subClassArray[j]) !== -1 || subClassArray[j] === "schema:DataType") {
                                if (this.classes[classesKeys[i]] !== undefined && this.dataTypes[classesKeys[i]] === undefined) {
                                    newDatatype = true;
                                    this.dataTypes[classesKeys[i]] = JSON.parse(JSON.stringify(this.classes[classesKeys[i]]));
                                    delete this.classes[classesKeys[i]];
                                }
                            }
                        }
                    }
                }
            } while (newDatatype);

            //D) Inheritance
            /*    Schema.org's Inheritance design states if an entity is the superClass/superProperty of another entity. In our data model design we also hold the information if an entity is the subClass/subProperty of another entity. In this step this inheritance information is generated.*/
            // D.1) Add subClasses for Classes and Enumerations
            //check superclasses for all classes and enumerations. Add these classes/enumerations as subclasses (soa:superClassOf) for the parent class/enumeration
            let classesKeys = Object.keys(this.classes);
            for (let c = 0; c < classesKeys.length; c++) {
                let superClasses = this.classes[classesKeys[c]]["rdfs:subClassOf"];
                //add empty superClassOf if not defined
                if (this.classes[classesKeys[c]]["soa:superClassOf"] === undefined) {
                    this.classes[classesKeys[c]]["soa:superClassOf"] = [];
                }
                for (let s = 0; s < superClasses.length; s++) {
                    let superClass = this.classes[superClasses[s]];
                    if (superClass === undefined) {
                        superClass = this.enumerations[superClasses[s]];
                    }
                    if (superClass !== undefined) {
                        if (superClass["soa:superClassOf"] !== undefined) {
                            if (superClass["soa:superClassOf"].indexOf(classesKeys[c]) === -1) {
                                superClass["soa:superClassOf"].push(classesKeys[c]);
                            }
                        } else {
                            superClass["soa:superClassOf"] = [classesKeys[c]];
                        }
                    }
                }
            }
            let enumKeys = Object.keys(this.enumerations);
            for (let e = 0; e < enumKeys.length; e++) {
                let superClasses = this.enumerations[enumKeys[e]]["rdfs:subClassOf"];
                //add empty superClassOf if not defined
                if (this.enumerations[enumKeys[e]]["soa:superClassOf"] === undefined) {
                    this.enumerations[enumKeys[e]]["soa:superClassOf"] = [];
                }
                for (let s = 0; s < superClasses.length; s++) {
                    let superClass = this.classes[superClasses[s]];
                    if (superClass === undefined) {
                        superClass = this.enumerations[superClasses[s]];
                    }
                    if (superClass !== undefined) {
                        if (superClass["soa:superClassOf"] !== undefined) {
                            if (superClass["soa:superClassOf"].indexOf(enumKeys[e]) === -1) {
                                superClass["soa:superClassOf"].push(enumKeys[e]);
                            }
                        } else {
                            superClass["soa:superClassOf"] = [enumKeys[e]];
                        }
                    }
                }
            }
            // D.2) Add subClasses for DataTypes
            //For each entry in the dataTypes memory the superClasses are checked (if they are in dataTypes memory) and those super types add the actual entry in their subClasses.
            let dataTypeKeys = Object.keys(this.dataTypes);
            for (let d = 0; d < dataTypeKeys.length; d++) {
                let superClasses = this.dataTypes[dataTypeKeys[d]]["rdfs:subClassOf"];
                //add empty superClassOf if not defined
                if (this.dataTypes[dataTypeKeys[d]]["soa:superClassOf"] === undefined) {
                    this.dataTypes[dataTypeKeys[d]]["soa:superClassOf"] = [];
                }
                //add empty subClassOf if not defined
                if (superClasses === undefined) {
                    this.dataTypes[dataTypeKeys[d]]["rdfs:subClassOf"] = [];
                } else {
                    for (let s = 0; s < superClasses.length; s++) {
                        let superClass = this.dataTypes[superClasses[s]];
                        if (superClass !== undefined) {
                            if (superClass["soa:superClassOf"] !== undefined) {
                                if (superClass["soa:superClassOf"].indexOf(dataTypeKeys[d]) === -1) {
                                    superClass["soa:superClassOf"].push(dataTypeKeys[d]);
                                }
                            } else {
                                superClass["soa:superClassOf"] = [dataTypeKeys[d]];
                            }
                        }
                    }
                }
            }
            // D.3) Add subProperties for Properties
            //For each entry in the properties memory the superProperties are checked (if they are in properties memory) and those super properties add the actual entry in their subProperties. (soa:superPropertyOf)
            let propertyKeys = Object.keys(this.properties);
            for (let p = 0; p < propertyKeys.length; p++) {
                let superProperties = this.properties[propertyKeys[p]]["rdfs:subPropertyOf"];
                //add empty superPropertyOf if not defined
                if (this.properties[propertyKeys[p]]["soa:superPropertyOf"] === undefined) {
                    this.properties[propertyKeys[p]]["soa:superPropertyOf"] = [];
                }
                //add empty subPropertyOf if not defined
                if (superProperties === undefined) {
                    this.properties[propertyKeys[p]]["rdfs:subPropertyOf"] = [];
                } else {
                    for (let s = 0; s < superProperties.length; s++) {
                        let superClass = this.properties[superProperties[s]];
                        if (superClass !== undefined) {
                            if (superClass["soa:superPropertyOf"] !== undefined) {
                                if (superClass["soa:superPropertyOf"].indexOf(propertyKeys[p]) === -1) {
                                    superClass["soa:superPropertyOf"].push(propertyKeys[p]);
                                }
                            } else {
                                superClass["soa:superPropertyOf"] = [propertyKeys[p]];
                            }
                        }
                    }
                }
            }
            //E) Relationships
            /*  In this step additional fields are added to certain data entries to add links to other data entries, which should make it easier to use the generated data set.#
            soa:hasProperty is an inverse of schema:domainIncludes
            soa:isRangeOf is an inverse of schema:rangeIncludes
            soa:hasEnumerationMember is used for enumerations to list all its enumeration members (their @type includes the @id of the enumeration)
            soa:enumerationDomainIncludes is an inverse of soa:hasEnumerationMember */
            //E.0) add empty arrays for the relationships
            classesKeys = Object.keys(this.classes);
            for (let c = 0; c < classesKeys.length; c++) {
                if (this.classes[classesKeys[c]]["soa:hasProperty"] === undefined) {
                    this.classes[classesKeys[c]]["soa:hasProperty"] = [];
                }
                if (this.classes[classesKeys[c]]["soa:isRangeOf"] === undefined) {
                    this.classes[classesKeys[c]]["soa:isRangeOf"] = [];
                }
            }
            enumKeys = Object.keys(this.enumerations);
            for (let e = 0; e < enumKeys.length; e++) {
                if (this.enumerations[enumKeys[e]]["soa:hasEnumerationMember"] === undefined) {
                    this.enumerations[enumKeys[e]]["soa:hasEnumerationMember"] = [];
                }
                if (this.enumerations[enumKeys[e]]["soa:isRangeOf"] === undefined) {
                    this.enumerations[enumKeys[e]]["soa:isRangeOf"] = [];
                }
                if (this.enumerations[enumKeys[e]]["soa:hasProperty"] === undefined) {
                    this.enumerations[enumKeys[e]]["soa:hasProperty"] = [];
                }
            }
            let enumMemKeys = Object.keys(this.enumerationMembers);
            for (let e = 0; e < enumMemKeys.length; e++) {
                if (this.enumerationMembers[enumMemKeys[e]]["soa:enumerationDomainIncludes"] === undefined) {
                    this.enumerationMembers[enumMemKeys[e]]["soa:enumerationDomainIncludes"] = [];
                }
            }
            /* E.1) Add explicit hasProperty and isRangeOf to classes and enumerations
            For each entry in the classes/enumeration memory, the properties field is added. This data field holds all properties which belong to this class (class/enumeration is domain for property). */
            propertyKeys = Object.keys(this.properties);
            for (let p = 0; p < propertyKeys.length; p++) {
                let domainIncludesArray = this.properties[propertyKeys[p]]["schema:domainIncludes"];
                if (util.isArray(domainIncludesArray)) {
                    for (let di = 0; di < domainIncludesArray.length; di++) {
                        let target = this.classes[domainIncludesArray[di]];
                        if (target === undefined) {
                            target = this.enumerations[domainIncludesArray[di]];
                        }
                        if (target !== undefined && util.isArray(target["soa:hasProperty"]) && target["soa:hasProperty"].indexOf(propertyKeys[p]) === -1) {
                            target["soa:hasProperty"].push(propertyKeys[p]);
                        }
                    }
                }
                let rangeIncludesArray = this.properties[propertyKeys[p]]["schema:rangeIncludes"];
                if (util.isArray(rangeIncludesArray)) {
                    for (let ri = 0; ri < rangeIncludesArray.length; ri++) {
                        let target = this.classes[rangeIncludesArray[ri]];
                        if (target === undefined) {
                            target = this.enumerations[rangeIncludesArray[ri]];
                        }
                        if (target !== undefined && util.isArray(target["soa:isRangeOf"]) && target["soa:isRangeOf"].indexOf(propertyKeys[p]) === -1) {
                            target["soa:isRangeOf"].push(propertyKeys[p]);
                        }
                    }
                }
            }
            /* E.2) Add soa:hasEnumerationMember to enumerations and soa:enumerationDomainIncludes to enumerationMembers
            For each entry in the enumeration memory the soa:hasEnumerationMember field is added, this data field holds all enumeration members which belong to this enumeration.
            For each entry in the enumerationMembers memory the soa:enumerationDomainIncludes field is added, this data field holds all enumerations that are a domain for this enumerationMember
            */
            enumMemKeys = Object.keys(this.enumerationMembers);
            for (let e = 0; e < enumMemKeys.length; e++) {
                let enumMem = this.enumerationMembers[enumMemKeys[e]];
                let enumMemTypeArray = enumMem["@type"];
                if (!util.isArray(enumMemTypeArray)) {
                    enumMemTypeArray = [enumMemTypeArray];
                }
                for (let t = 0; t < enumMemTypeArray.length; t++) {
                    let target = this.enumerations[enumMemTypeArray[t]];
                    if (target !== undefined && util.isArray(target["soa:hasEnumerationMember"]) && target["soa:hasEnumerationMember"].indexOf(enumMemKeys[e]) === -1) {
                        target["soa:hasEnumerationMember"].push(enumMemKeys[e]);
                        if (util.isArray(enumMem["soa:enumerationDomainIncludes"])) {
                            enumMem["soa:enumerationDomainIncludes"].push(enumMemTypeArray[t]);
                        } else {
                            enumMem["soa:enumerationDomainIncludes"] = [enumMemTypeArray[t]];
                        }
                    }
                }
            }
            return true;
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    /**
     * Creates/Updates a node in the graph
     * @param {object} memory - The memory object where the new node should be added (Classes, Properties, Enumerations, EnumerationMembers, DataTypes, Meta)
     * @param {object} newNode - The node in JSON-LD format to be added
     * @return {boolean} returns true on success
     */
    addGraphNode(memory, newNode) {
        try {
            if (memory[newNode["@id"]] === undefined) {
                memory[newNode["@id"]] = newNode;
            } else {
                //merging algorithm todo
            }
            return true;
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    /**
     * Creates a corresponding JS-Class for the given IRI, depending on its category in the Graph
     * @param {string} id - The id of the wished term, can be an IRI (absolute or compact) or a label
     * @param {object} filter - (optional) The filter settings to be applied on the result
     * @return {Class|Property|Enumeration|EnumerationMember|DataType} the JS-Class for the given IRI
     */
    getTerm(id, filter = null) {
        let compactIRI = this.discoverCompactIRI(id);
        let targetObj;
        let targetType;
        let tryCounter = 0;
        do{
            switch (tryCounter){
                case 0:
                    targetObj = this.classes[compactIRI];
                    targetType = "Class";
                    break;
            }
        } while (targetObj === undefined && tryCounter < 6);


        if (targetObj !== undefined) {
            targetObj = util.applyFilter([targetObj], filter);
            if (targetObj.length === 0) {
                throw new Error("There is no term with that IRI and filter settings.");
            } else {
                return new Class(compactIRI, this);
            }
        } else {
            throw new Error("There is no term with the IRI " + id);
        }

    }

    /**
     * Creates a JS-Class for a Class of the Graph
     * @param {string} id - The id of the wished Class-node, can be an IRI (absolute or compact) or a label
     * @param {object} filter - (optional) The filter settings to be applied on the result
     * @return {Class} the JS-Class for the given IRI
     */
    getClass(id, filter = null) {
        let compactIRI = this.discoverCompactIRI(id);
        let classObj = this.classes[compactIRI];
        //todo enumerations can also be counted as classes
        if (classObj !== undefined) {
            classObj = util.applyFilter([classObj], filter);
            if (classObj.length === 0) {
                throw new Error("There is no class with that IRI and filter settings.");
            } else {
                return new Class(compactIRI, this);
            }
        } else {
            throw new Error("There is no class with the IRI " + id);
        }

    }

    /**
     * Creates a JS-Class for a Property of the Graph
     * @param {string} id - The id of the wished Property-node, can be an IRI (absolute or compact) or a label
     * @param {object} filter - (optional) The filter settings to be applied on the result
     * @return {Property} the JS-Class for the given IRI
     */
    getProperty(id, filter = null) {
        let compactIRI = this.discoverCompactIRI(id);
        let propertyObj = this.properties[compactIRI];
        if (propertyObj !== undefined) {
            propertyObj = util.applyFilter([propertyObj], filter);
            if (propertyObj.length === 0) {
                throw new Error("There is no property with that URI and filter settings.");
            } else {
                return new Property(compactIRI, this);
            }
        } else {
            throw new Error("There is no property with that URI.");
        }

    }

    //input can be a compact or absolute IRI
    discoverCompactIRI(input) {
        if (input.indexOf(":") !== -1) {
            //is iri
            let terms = Object.keys(this.context);
            for (let i = 0; i < terms.length; i++) {
                let absoluteIRI = this.context[terms[i]];
                if (util.isString(absoluteIRI)) {
                    if (input.startsWith(terms[i])) {
                        //is compactIRI
                        return input;
                    } else if (input.startsWith(absoluteIRI)) {
                        //is absoluteIRI
                        return util.toCompactIRI(input, this.context);
                    }
                }
            }
        } else {
            //is label
            //todo
        }
    }

}

module.exports = Graph;