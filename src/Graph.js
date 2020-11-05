const util = require('./utilities');
const Class = require('./Class');
const Property = require('./Property');
const Enumeration = require('./Enumeration');
const EnumerationMember = require('./EnumerationMember');
const DataType = require('./DataType');
const ReasoningEngine = require('./ReasoningEngine');

class Graph {
    /**
     * @class
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
        // soa:EnumerationMember is introduced as meta type for the members of an schema:Enumeration
        this.context = {
            rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
            rdfs: 'http://www.w3.org/2000/01/rdf-schema#',
            xsd: 'http://www.w3.org/2001/XMLSchema#',
            dc: 'http://purl.org/dc/terms/',
            schema: 'http://schema.org/',
            soa: 'http://schema-org-adapter.at/vocabTerms/',
            'soa:superClassOf': {
                '@id': 'soa:superClassOf',
                '@type': '@id'
            },
            'soa:superPropertyOf': {
                '@id': 'soa:superPropertyOf',
                '@type': '@id'
            },
            'soa:hasProperty': {
                '@id': 'soa:hasProperty',
                '@type': '@id'
            },
            'soa:isRangeOf': {
                '@id': 'soa:isRangeOf',
                '@type': '@id'
            },
            'soa:hasEnumerationMember': {
                '@id': 'soa:hasEnumerationMember',
                '@type': '@id'
            },
            'soa:enumerationDomainIncludes': {
                '@id': 'soa:enumerationDomainIncludes',
                '@type': '@id'
            },
            'rdfs:subClassOf': {
                '@id': 'rdfs:subClassOf',
                '@type': '@id'
            },
            'rdfs:subPropertyOf': {
                '@id': 'rdfs:subPropertyOf',
                '@type': '@id'
            },
            'schema:isPartOf': {
                '@id': 'schema:isPartOf',
                '@type': '@id'
            },
            'schema:domainIncludes': {
                '@id': 'schema:domainIncludes',
                '@type': '@id'
            },
            'schema:rangeIncludes': {
                '@id': 'schema:rangeIncludes',
                '@type': '@id'
            },
            'schema:supersededBy': {
                '@id': 'schema:supersededBy',
                '@type': '@id'
            },
            'schema:inverseOf': {
                '@id': 'schema:inverseOf',
                '@type': '@id'
            },
            'dc:source': {
                '@id': 'dc:source',
                '@type': '@id'
            },
            'schema:source': {
                '@id': 'schema:source',
                '@type': '@id'
            },
        };
        this.classes = {}; // keys are the compacted IRI
        this.properties = {}; // keys are the compacted IRI
        this.dataTypes = {}; // keys are the compacted IRI
        this.enumerations = {}; // keys are the compacted IRI
        this.enumerationMembers = {}; // keys are the compacted IRI
    }

    /**
     * Adds a new vocabulary (in JSON-LD format) to the graph data
     * @param {object} vocab - The vocabulary to add the graph, in JSON-LD format
     * @param {string|null} vocabURL - The URL of the vocabulary
     * @returns {boolean} returns true on success
     */
    async addVocabulary(vocab, vocabURL = null) {
        // this algorithm is well-documented in /docu/algorithm.md
        try {
            // A) Pre-process Vocabulary
            // create new context
            this.context = util.generateContext(this.context, vocab['@context']);
            // pre-process new vocab
            vocab = await util.preProcessVocab(vocab, this.context); // adapt @graph to new context
            const vocabularies = this.sdoAdapter.getVocabularies();
            for (let vocabNode of vocab['@graph']) {
                vocabNode = util.curateVocabNode(vocabNode, vocabularies); // curate nodes
            }
            // B) Classify Input
            /**
             Classify every @graph node based on its @type. The node is transformed to another data-model based on the @type and stored in a new memory storage for an easier further usage. This is the first of two steps for an exact classification of the node, since the @type is not enough for a correct classification. The mapping of our data model and the @type(s) of the corresponding @graph nodes are as follows:
             classes ("@type" = "rdfs:Class")
             properties ("@type" = "rdf:Property")
             dataTypes ("@type" = "rdfs:Class" + "http://schema.org/DataType")
             enumerations ("@type" = "rdfs:Class", has "http://schema.org/Enumeration" as implicit super-class)
             enumerationMembers ("@type" = @id(s) of enumeration(s))
             */
            for (let i = 0; i < vocab['@graph'].length; i++) {
                const curNode = JSON.parse(JSON.stringify(vocab['@graph'][i]));
                if (util.isString(curNode['@type'])) {
                    switch (curNode['@type']) {
                        case 'rdfs:Class':
                            this.addGraphNode(this.classes, curNode, vocabURL);
                            break;
                        case 'rdf:Property':
                            this.addGraphNode(this.properties, curNode, vocabURL);
                            break;
                        default:
                            // @type is not something expected -> assume enumerationMember
                            this.addGraphNode(this.enumerationMembers, curNode, vocabURL);
                            break;
                    }
                } else if (util.isArray(curNode['@type'])) {
                    // @type is not a string -> datatype or enumeration
                    // [
                    //     "rdfs:Class",
                    //     "schema:DataType"
                    // ]
                    // [
                    //   "schema:MedicalImagingTechnique",
                    //   "schema:MedicalSpecialty"
                    // ]
                    if (curNode['@type'].includes('rdfs:Class') && curNode['@type'].includes('schema:DataType')) {
                        // datatype
                        this.addGraphNode(this.dataTypes, curNode, vocabURL);
                    } else {
                        // enumeration member
                        this.addGraphNode(this.enumerationMembers, curNode, vocabURL);
                    }
                } else {
                    console.log('unexpected @type format for the following node:');
                    console.log(JSON.stringify(curNode, null, 2));
                }
            }
            // C) Classification cleaning
            /* To have a correct classification for our data model it is needed to clean the data generated in the previous step. Inaccurate records include:
             Enumerations which are handled as Classes.
             DataTypes which are handled as Classes.
             */

            // C.1)  Extract enumerations from classes memory
            // For each entry in the classes memory check if its superClasses contain Enumeration or another Enumeration. If this is the case, it is known that this class is an enumeration.
            let newEnum;
            do {
                newEnum = false;
                const classesKeys = Object.keys(this.classes);
                const enumKeys = Object.keys(this.enumerations);
                for (const actClassKey of classesKeys) {
                    if (this.classes[actClassKey]['rdfs:subClassOf'] !== undefined) {
                        const subClassArray = this.classes[actClassKey]['rdfs:subClassOf'];
                        for (const actSubClass of subClassArray) {
                            if (actSubClass === 'schema:Enumeration' || enumKeys.includes(actSubClass)) {
                                if (this.classes[actClassKey] && !this.enumerations[actClassKey]) {
                                    newEnum = true;
                                    this.enumerations[actClassKey] = JSON.parse(JSON.stringify(this.classes[actClassKey]));
                                    delete this.classes[actClassKey];
                                }
                            }
                        }
                    }
                }
            } while (newEnum);
            // C.2) check if there are subclasses of dataTypes which are in the classes data, put them in dataType data
            let newDatatype;
            do {
                newDatatype = false;
                const classesKeys = Object.keys(this.classes);
                const dtKeys = Object.keys(this.dataTypes);
                for (const actClassKey of classesKeys) {
                    if (this.classes[actClassKey]['rdfs:subClassOf'] !== undefined) {
                        const subClassArray = this.classes[actClassKey]['rdfs:subClassOf'];
                        for (const actSubClass of subClassArray) {
                            if (actSubClass === 'schema:DataType' || dtKeys.includes(actSubClass)) {
                                if (this.classes[actClassKey] && !this.dataTypes[actClassKey]) {
                                    newDatatype = true;
                                    this.dataTypes[actClassKey] = JSON.parse(JSON.stringify(this.classes[actClassKey]));
                                    delete this.classes[actClassKey];
                                }
                            }
                        }
                    }
                }
            } while (newDatatype);
            // C.3) change the @type of data-types to a single value, which is "schema:DataType"
            const dtKeys = Object.keys(this.dataTypes);
            for (const actDtKey of dtKeys) {
                this.dataTypes[actDtKey]['@type'] = 'schema:DataType';
            }

            // D) Inheritance
            /*    Schema.org's Inheritance design states if an entity is the superClass/superProperty of another entity. In our data model design we also hold the information if an entity is the subClass/subProperty of another entity. In this step this inheritance information is generated. */
            // D.1) Add subClasses for Classes and Enumerations
            // check superclasses for all classes and enumerations. Add these classes/enumerations as subclasses (soa:superClassOf) for the parent class/enumeration
            let classesKeys = Object.keys(this.classes);
            for (const actClassKey of classesKeys) {
                const superClasses = this.classes[actClassKey]['rdfs:subClassOf'];
                // add empty superClassOf if not defined
                if (!this.classes[actClassKey]['soa:superClassOf']) {
                    this.classes[actClassKey]['soa:superClassOf'] = [];
                }
                for (const actSuperClass of superClasses) {
                    let superClass = this.classes[actSuperClass];
                    if (!superClass) {
                        superClass = this.enumerations[actSuperClass];
                    }
                    if (superClass) {
                        if (superClass['soa:superClassOf']) {
                            if (!superClass['soa:superClassOf'].includes(actClassKey)) {
                                superClass['soa:superClassOf'].push(actClassKey);
                            }
                        } else {
                            superClass['soa:superClassOf'] = [actClassKey];
                        }
                    }
                }
            }
            let enumKeys = Object.keys(this.enumerations);
            for (const actEnumKey of enumKeys) {
                const superClasses = this.enumerations[actEnumKey]['rdfs:subClassOf'];
                // add empty superClassOf if not defined
                if (!this.enumerations[actEnumKey]['soa:superClassOf']) {
                    this.enumerations[actEnumKey]['soa:superClassOf'] = [];
                }
                for (const actSuperClass of superClasses) {
                    let superClass = this.classes[actSuperClass];
                    if (!superClass) {
                        superClass = this.enumerations[actSuperClass];
                    }
                    if (superClass) {
                        if (superClass['soa:superClassOf']) {
                            if (!superClass['soa:superClassOf'].includes(actEnumKey)) {
                                superClass['soa:superClassOf'].push(actEnumKey);
                            }
                        } else {
                            superClass['soa:superClassOf'] = [actEnumKey];
                        }
                    }
                }
            }
            // D.2) Add subClasses for DataTypes
            // For each entry in the dataTypes memory the superClasses are checked (if they are in dataTypes memory) and those super types add the actual entry in their subClasses.
            let dataTypeKeys = Object.keys(this.dataTypes);
            for (const actDtKey of dataTypeKeys) {
                const superClasses = this.dataTypes[actDtKey]['rdfs:subClassOf'];
                // add empty superClassOf if not defined
                if (!this.dataTypes[actDtKey]['soa:superClassOf']) {
                    this.dataTypes[actDtKey]['soa:superClassOf'] = [];
                }
                // add empty subClassOf if not defined
                if (!superClasses) {
                    this.dataTypes[actDtKey]['rdfs:subClassOf'] = [];
                } else {
                    for (const actSuperClass of superClasses) {
                        const superClass = this.dataTypes[actSuperClass];
                        if (superClass) {
                            if (superClass['soa:superClassOf']) {
                                if (!superClass['soa:superClassOf'].includes(actDtKey)) {
                                    superClass['soa:superClassOf'].push(actDtKey);
                                }
                            } else {
                                superClass['soa:superClassOf'] = [actDtKey];
                            }
                        }
                    }
                }
            }
            // D.3) Add subProperties for Properties
            // For each entry in the properties memory the superProperties are checked (if they are in properties memory) and those super properties add the actual entry in their subProperties. (soa:superPropertyOf)
            let propertyKeys = Object.keys(this.properties);
            for (const actPropKey of propertyKeys) {
                const superProperties = this.properties[actPropKey]['rdfs:subPropertyOf'];
                // add empty superPropertyOf if not defined
                if (!this.properties[actPropKey]['soa:superPropertyOf']) {
                    this.properties[actPropKey]['soa:superPropertyOf'] = [];
                }
                // add empty subPropertyOf if not defined
                if (!superProperties) {
                    this.properties[actPropKey]['rdfs:subPropertyOf'] = [];
                } else {
                    for (const actSuperProp of superProperties) {
                        const superClass = this.properties[actSuperProp];
                        if (superClass) {
                            if (superClass['soa:superPropertyOf']) {
                                if (!superClass['soa:superPropertyOf'].includes(actPropKey)) {
                                    superClass['soa:superPropertyOf'].push(actPropKey);
                                }
                            } else {
                                superClass['soa:superPropertyOf'] = [actPropKey];
                            }
                        }
                    }
                }
            }
            // E) Relationships
            /*  In this step additional fields are added to certain data entries to add links to other data entries, which should make it easier to use the generated data set.#
            soa:hasProperty is an inverse of schema:domainIncludes
            soa:isRangeOf is an inverse of schema:rangeIncludes
            soa:hasEnumerationMember is used for enumerations to list all its enumeration members (their @type includes the @id of the enumeration)
            soa:enumerationDomainIncludes is an inverse of soa:hasEnumerationMember */
            // E.0) add empty arrays for the relationships
            classesKeys = Object.keys(this.classes);
            for (const actClassKey of classesKeys) {
                if (!this.classes[actClassKey]['soa:hasProperty']) {
                    this.classes[actClassKey]['soa:hasProperty'] = [];
                }
                if (!this.classes[actClassKey]['soa:isRangeOf']) {
                    this.classes[actClassKey]['soa:isRangeOf'] = [];
                }
            }
            enumKeys = Object.keys(this.enumerations);
            for (const actEnumKey of enumKeys) {
                if (!this.enumerations[actEnumKey]['soa:hasEnumerationMember']) {
                    this.enumerations[actEnumKey]['soa:hasEnumerationMember'] = [];
                }
                if (!this.enumerations[actEnumKey]['soa:isRangeOf']) {
                    this.enumerations[actEnumKey]['soa:isRangeOf'] = [];
                }
                if (!this.enumerations[actEnumKey]['soa:hasProperty']) {
                    this.enumerations[actEnumKey]['soa:hasProperty'] = [];
                }
            }
            dataTypeKeys = Object.keys(this.dataTypes);
            for (const actDataTypeKey of dataTypeKeys) {
                if (!this.dataTypes[actDataTypeKey]['soa:isRangeOf']) {
                    this.dataTypes[actDataTypeKey]['soa:isRangeOf'] = [];
                }
            }
            let enumMemKeys = Object.keys(this.enumerationMembers);
            for (const actEnumMemKey of enumMemKeys) {
                if (!this.enumerationMembers[actEnumMemKey]['soa:enumerationDomainIncludes']) {
                    this.enumerationMembers[actEnumMemKey]['soa:enumerationDomainIncludes'] = [];
                }
            }
            /* E.1) Add explicit hasProperty and isRangeOf to classes, enumerations, and data types
            For each entry in the classes/enumeration/dataType memory, the soa:hasProperty field is added.
            This data field holds all properties which belong to this class/enumeration (class/enumeration is domain for property).
            Also the soa:isRangeOf field is added -> holds all properties which use to this class/enumeration/dataType as range (class/enumeration/dataType is range for property). */
            propertyKeys = Object.keys(this.properties);
            for (const actPropKey of propertyKeys) {
                const domainIncludesArray = this.properties[actPropKey]['schema:domainIncludes'];
                if (util.isArray(domainIncludesArray)) {
                    for (const actDomain of domainIncludesArray) {
                        let target = this.classes[actDomain];
                        if (!target) {
                            target = this.enumerations[actDomain];
                        }
                        if (target && util.isArray(target['soa:hasProperty']) && !target['soa:hasProperty'].includes(actPropKey)) {
                            target['soa:hasProperty'].push(actPropKey);
                        }
                    }
                }
                const rangeIncludesArray = this.properties[actPropKey]['schema:rangeIncludes'];
                if (util.isArray(rangeIncludesArray)) {
                    for (const actRange of rangeIncludesArray) {
                        let target = this.classes[actRange] || this.enumerations[actRange] || this.dataTypes[actRange];
                        if (target && util.isArray(target['soa:isRangeOf']) && !target['soa:isRangeOf'].includes(actPropKey)) {
                            target['soa:isRangeOf'].push(actPropKey);
                        }
                    }
                }
            }
            /* E.2) Add soa:hasEnumerationMember to enumerations and soa:enumerationDomainIncludes to enumerationMembers
            For each entry in the enumeration memory the soa:hasEnumerationMember field is added, this data field holds all enumeration members which belong to this enumeration.
            For each entry in the enumerationMembers memory the soa:enumerationDomainIncludes field is added, this data field holds all enumerations that are a domain for this enumerationMember
            */
            enumMemKeys = Object.keys(this.enumerationMembers);
            for (const actEnumMemKey of enumMemKeys) {
                const enumMem = this.enumerationMembers[actEnumMemKey];
                let enumMemTypeArray = enumMem['@type'];
                if (!util.isArray(enumMemTypeArray)) {
                    enumMemTypeArray = [enumMemTypeArray];
                }
                for (const actEnumMemType of enumMemTypeArray) {
                    const target = this.enumerations[actEnumMemType];
                    if (target && util.isArray(target['soa:hasEnumerationMember']) && !target['soa:hasEnumerationMember'].includes(actEnumMemKey)) {
                        target['soa:hasEnumerationMember'].push(actEnumMemKey);
                        if (util.isArray(enumMem['soa:enumerationDomainIncludes'])) {
                            enumMem['soa:enumerationDomainIncludes'].push(actEnumMemType);
                        } else {
                            enumMem['soa:enumerationDomainIncludes'] = [actEnumMemType];
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
     *
     * @param {object} memory - The memory object where the new node should be added (Classes, Properties, Enumerations, EnumerationMembers, DataTypes)
     * @param {object} newNode - The node in JSON-LD format to be added
     * @param {string|null} vocabURL - The vocabulary URL of the node
     * @returns {boolean} returns true on success
     */
    addGraphNode(memory, newNode, vocabURL = null) {
        try {
            if (!memory[newNode['@id']]) {
                memory[newNode['@id']] = newNode;
                if (vocabURL) {
                    memory[newNode['@id']]['vocabURLs'] = [vocabURL];
                }
            } else {
                // merging algorithm
                const oldNode = memory[newNode['@id']];
                // @id stays the same
                // @type should stay the same (we already defined the memory to save it)
                // schema:isPartOf -> overwrite
                if (!util.isNil(newNode['schema:isPartOf'])) {
                    oldNode['schema:isPartOf'] = newNode['schema:isPartOf'];
                }
                // dc:source/schema:source -> overwrite
                if (!util.isNil(newNode['dc:source'])) {
                    oldNode['dc:source'] = newNode['dc:source'];
                }
                if (!util.isNil(newNode['schema:source'])) {
                    oldNode['schema:source'] = newNode['schema:source'];
                }
                // schema:category -> overwrite
                if (!util.isNil(newNode['schema:category'])) {
                    oldNode['schema:category'] = newNode['schema:category'];
                }
                // schema:supersededBy -> overwrite
                if (!util.isNil(newNode['schema:supersededBy'])) {
                    oldNode['schema:supersededBy'] = newNode['schema:supersededBy'];
                }
                // rdfs:label -> add new languages, overwrite old ones if needed
                if (!util.isNil(newNode['rdfs:label'])) {
                    const labelKeysNew = Object.keys(newNode['rdfs:label']);
                    for (const actLabelKey of labelKeysNew) {
                        oldNode['rdfs:label'][actLabelKey] = newNode['rdfs:label'][actLabelKey];
                    }
                }
                // rdfs:comment -> add new languages, overwrite old ones if needed
                if (!util.isNil(newNode['rdfs:comment'])) {
                    const commentKeysNew = Object.keys(newNode['rdfs:comment']);
                    for (const actCommentKey of commentKeysNew) {
                        oldNode['rdfs:comment'][actCommentKey] = newNode['rdfs:comment'][actCommentKey];
                    }
                }
                // rdfs:subClassOf -> add new ids
                if (!util.isNil(newNode['rdfs:subClassOf'])) {
                    for (const actSuperClass of newNode['rdfs:subClassOf']) {
                        if (!oldNode['rdfs:subClassOf'].includes(actSuperClass)) {
                            // add new entry
                            oldNode['rdfs:subClassOf'].push(actSuperClass);
                        }
                    }
                }
                // soa:superClassOf -> add new ids
                if (!util.isNil(newNode['soa:superClassOf'])) {
                    for (const actSubClass of newNode['soa:superClassOf']) {
                        if (!oldNode['soa:superClassOf'].includes(actSubClass)) {
                            // add new entry
                            oldNode['soa:superClassOf'].push(actSubClass);
                        }
                    }
                }
                // soa:hasProperty -> add new ids
                if (!util.isNil(newNode['soa:hasProperty'])) {
                    for (const actProp of newNode['soa:hasProperty']) {
                        if (!oldNode['soa:hasProperty'].includes(actProp)) {
                            // add new entry
                            oldNode['soa:hasProperty'].push(actProp);
                        }
                    }
                }
                // soa:isRangeOf -> add new ids
                if (!util.isNil(newNode['soa:isRangeOf'])) {
                    for (const actProp of newNode['soa:isRangeOf']) {
                        if (!oldNode['soa:isRangeOf'].includes(actProp)) {
                            // add new entry
                            oldNode['soa:isRangeOf'].push(actProp);
                        }
                    }
                }
                // soa:enumerationDomainIncludes -> add new ids
                if (!util.isNil(newNode['soa:enumerationDomainIncludes'])) {
                    for (const actEnum of newNode['soa:enumerationDomainIncludes']) {
                        if (!oldNode['soa:enumerationDomainIncludes'].includes(actEnum)) {
                            // add new entry
                            oldNode['soa:enumerationDomainIncludes'].push(actEnum);
                        }
                    }
                }
                // soa:hasEnumerationMember -> add new ids
                if (!util.isNil(newNode['soa:hasEnumerationMember'])) {
                    for (const actEnumMem of newNode['soa:hasEnumerationMember']) {
                        if (!oldNode['soa:hasEnumerationMember'].includes(actEnumMem)) {
                            // add new entry
                            oldNode['soa:hasEnumerationMember'].push(actEnumMem);
                        }
                    }
                }
                // rdfs:subPropertyOf -> add new ids
                if (!util.isNil(newNode['rdfs:subPropertyOf'])) {
                    for (const actProp of newNode['rdfs:subPropertyOf']) {
                        if (!oldNode['rdfs:subPropertyOf'].includes(actProp)) {
                            // add new entry
                            oldNode['rdfs:subPropertyOf'].push(actProp);
                        }
                    }
                }
                // schema:domainIncludes -> add new ids
                if (!util.isNil(newNode['schema:domainIncludes'])) {
                    for (const actDomain of newNode['schema:domainIncludes']) {
                        if (!oldNode['schema:domainIncludes'].includes(actDomain)) {
                            // add new entry
                            oldNode['schema:domainIncludes'].push(actDomain);
                        }
                    }
                }
                // schema:rangeIncludes -> add new ids
                if (!util.isNil(newNode['schema:rangeIncludes'])) {
                    for (const actRange of newNode['schema:rangeIncludes']) {
                        if (!oldNode['schema:rangeIncludes'].includes(actRange)) {
                            // add new entry
                            oldNode['schema:rangeIncludes'].push(actRange);
                        }
                    }
                }
                // soa:superPropertyOf-> add new ids
                if (!util.isNil(newNode['schema:superPropertyOf'])) {
                    for (const actProp of newNode['schema:superPropertyOf']) {
                        if (!oldNode['schema:superPropertyOf'].includes(actProp)) {
                            // add new entry
                            oldNode['schema:superPropertyOf'].push(actProp);
                        }
                    }
                }

                if (vocabURL) {
                    if (oldNode['vocabURLs']) {
                        if (!oldNode['vocabURLs'].includes(vocabURL)) {
                            oldNode['vocabURLs'].push(vocabURL);
                        }
                    } else {
                        oldNode['vocabURLs'] = [vocabURL];
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
     * Creates a corresponding JS-Class for the given IRI, depending on its category in the Graph
     *
     * @param {string} id - The id of the wished term, can be an IRI (absolute or compact) or a label
     * @param {object} filter - (optional) The filter settings to be applied on the result
     * @returns {Term} the JS-Class for the given IRI
     */
    getTerm(id, filter = null) {
        const compactIRI = this.discoverCompactIRI(id);
        let targetObj;
        let targetType;
        let tryCounter = 0;
        do {
            switch (tryCounter) {
                case 0:
                    targetObj = this.classes[compactIRI];
                    targetType = 'Class';
                    break;
                case 1:
                    targetObj = this.properties[compactIRI];
                    targetType = 'Property';
                    break;
                case 2:
                    targetObj = this.dataTypes[compactIRI];
                    targetType = 'DataType';
                    break;
                case 3:
                    targetObj = this.enumerations[compactIRI];
                    targetType = 'Enumeration';
                    break;
                case 4:
                    targetObj = this.enumerationMembers[compactIRI];
                    targetType = 'EnumerationMember';
                    break;
            }
            tryCounter++;
        } while (!targetObj && tryCounter < 6);

        if (targetObj) {
            targetObj = util.applyFilter([targetObj['@id']], filter, this);
            if (targetObj.length === 0) {
                throw new Error('There is no term with that IRI and filter settings.');
            } else {
                switch (targetType) {
                    case 'Class':
                        return new Class(compactIRI, this);
                    case 'Property':
                        return new Property(compactIRI, this);
                    case 'Enumeration':
                        return new Enumeration(compactIRI, this);
                    case 'EnumerationMember':
                        return new EnumerationMember(compactIRI, this);
                    case 'DataType':
                        return new DataType(compactIRI, this);
                }
            }
        } else {
            throw new Error('There is no term with the IRI ' + id);
        }
    }

    /**
     * Creates a JS-Class for a Class of the Graph
     *
     * @param {string} id - The id of the wished Class-node, can be an IRI (absolute or compact) or a label
     * @param {object} filter - (optional) The filter settings to be applied on the result
     * @returns {Class|Enumeration} the JS-Class for the given IRI
     */
    getClass(id, filter = null) {
        const compactIRI = this.discoverCompactIRI(id);
        if (compactIRI) {
            let classObj = this.classes[compactIRI];
            if (classObj) {
                classObj = util.applyFilter([compactIRI], filter, this);
                if (classObj.length === 0) {
                    throw new Error('There is no class with that IRI and filter settings.');
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
                        throw new Error('There is no class with that IRI and filter settings.');
                    }
                }
            }
        }
        throw new Error('There is no class with the IRI ' + id);
    }

    /**
     * Creates a JS-Class for a Property of the Graph
     *
     * @param {string} id - The id of the wished Property-node, can be an IRI (absolute or compact) or a label
     * @param {object} filter - (optional) The filter settings to be applied on the result
     * @returns {Property} the JS-Class for the given IRI
     */
    getProperty(id, filter = null) {
        const compactIRI = this.discoverCompactIRI(id);
        if (compactIRI) {
            let propertyObj = this.properties[compactIRI];
            if (propertyObj) {
                propertyObj = util.applyFilter([compactIRI], filter, this);
                if (propertyObj.length === 0) {
                    throw new Error('There is no property with that URI and filter settings.');
                } else {
                    return new Property(compactIRI, this);
                }
            }
        }
        throw new Error('There is no property with that URI.');
    }

    /**
     * Creates a JS-Class for a DataType of the Graph
     *
     * @param {string} id - The id of the wished DataType-node, can be an IRI (absolute or compact) or a label
     * @param {object} filter - (optional) The filter settings to be applied on the result
     * @returns {DataType} the JS-Class for the given IRI
     */
    getDataType(id, filter = null) {
        const compactIRI = this.discoverCompactIRI(id);
        if (compactIRI) {
            let dataTypeObj = this.dataTypes[compactIRI];
            if (dataTypeObj) {
                dataTypeObj = util.applyFilter([compactIRI], filter, this);
                if (dataTypeObj.length === 0) {
                    throw new Error('There is no data-type with that IRI and filter settings.');
                } else {
                    return new DataType(compactIRI, this);
                }
            }
        }
        throw new Error('There is no data-type with the IRI ' + id);
    }

    /**
     * Creates a JS-Class for an Enumeration of the Graph
     *
     * @param {string} id - The id of the wished Enumeration-node, can be an IRI (absolute or compact) or a label
     * @param {object} filter - (optional) The filter settings to be applied on the result
     * @returns {Enumeration} the JS-Class for the given IRI
     */
    getEnumeration(id, filter = null) {
        const compactIRI = this.discoverCompactIRI(id);
        if (compactIRI) {
            let enumObj = this.enumerations[compactIRI];
            if (enumObj) {
                enumObj = util.applyFilter([compactIRI], filter, this);
                if (enumObj.length === 0) {
                    throw new Error('There is no enumeration with that IRI and filter settings.');
                } else {
                    return new Enumeration(compactIRI, this);
                }
            }
        }
        throw new Error('There is no enumeration with the IRI ' + id);
    }

    /**
     * Creates a JS-Class for an EnumerationMember of the Graph
     *
     * @param {string} id - The id of the wished EnumerationMember-node, can be an IRI (absolute or compact) or a label
     * @param {object} filter - (optional) The filter settings to be applied on the result
     * @returns {EnumerationMember} the JS-Class for the given IRI
     */
    getEnumerationMember(id, filter = null) {
        const compactIRI = this.discoverCompactIRI(id);
        if (compactIRI) {
            let enumObj = this.enumerationMembers[compactIRI];
            if (enumObj) {
                enumObj = util.applyFilter([compactIRI], filter, this);
                if (enumObj.length === 0) {
                    throw new Error('There is no EnumerationMember with that IRI and filter settings.');
                } else {
                    return new EnumerationMember(compactIRI, this);
                }
            }
        }
        throw new Error('There is no EnumerationMember with the IRI ' + id);
    }

    /**
     * Transforms/Discovers the right compact IRI for a given input, which may be a already a compact IRI, or an absolute IRI, or a term label for a vocabulary member
     *
     * @param {string} input - The input string to discover (if label) or transform (if absolute IRI)
     * @returns {string|null} the corresponding compact IRI (null if input is not valid)
     */
    discoverCompactIRI(input) {
        if (input.indexOf(':') !== -1) {
            // is iri
            const terms = Object.keys(this.context);
            for (const actTerm of terms) {
                const absoluteIRI = this.context[actTerm];
                if (util.isString(absoluteIRI)) {
                    if (input.startsWith(actTerm)) {
                        // is compactIRI
                        return input;
                    } else if (input.startsWith(absoluteIRI)) {
                        // is absoluteIRI
                        return util.toCompactIRI(input, this.context);
                    }
                }
            }
        } else {
            // is label
            const classesKeys = Object.keys(this.classes);
            for (const actClassKey of classesKeys) {
                if (this.containsLabel(this.classes[actClassKey], input) === true) {
                    return actClassKey;
                }
            }
            const propertiesKeys = Object.keys(this.properties);
            for (const actPropKey of propertiesKeys) {
                if (this.containsLabel(this.properties[actPropKey], input) === true) {
                    return actPropKey;
                }
            }
            const dataTypeKeys = Object.keys(this.dataTypes);
            for (const actDtKey of dataTypeKeys) {
                if (this.containsLabel(this.dataTypes[actDtKey], input) === true) {
                    return actDtKey;
                }
            }
            const enumerationKeys = Object.keys(this.enumerations);
            for (const actEnumKey of enumerationKeys) {
                if (this.containsLabel(this.enumerations[actEnumKey], input) === true) {
                    return actEnumKey;
                }
            }
            const enumerationMemberKeys = Object.keys(this.enumerationMembers);
            for (const actEnumMemKey of enumerationMemberKeys) {
                if (this.containsLabel(this.enumerationMembers[actEnumMemKey], input) === true) {
                    return actEnumMemKey;
                }
            }
        }
        // if nothing was found yet, the input is invalid
        return null;
    }

    // helper function for discoverCompactIRI()
    // returns true, if the termObj uses the given label (in any language)
    containsLabel(termObj, label) {
        if (termObj && util.isObject(termObj['rdfs:label'])) {
            const langKeys = Object.keys(termObj['rdfs:label']);
            for (const actLangKey of langKeys) {
                if (termObj['rdfs:label'][actLangKey] === label) {
                    return true;
                }
            }
        }
        return false;
    }
}

module.exports = Graph;
