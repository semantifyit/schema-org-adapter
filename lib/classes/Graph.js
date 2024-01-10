"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Graph = void 0;
const Class_1 = require("./Class");
const Property_1 = require("./Property");
const Enumeration_1 = require("./Enumeration");
const EnumerationMember_1 = require("./EnumerationMember");
const DataType_1 = require("./DataType");
const namespaces_1 = require("../data/namespaces");
const cloneJson_1 = require("../utilities/general/cloneJson");
const isArray_1 = require("../utilities/general/isArray");
const isString_1 = require("../utilities/general/isString");
const isObject_1 = require("../utilities/general/isObject");
const toCompactIRI_1 = require("../utilities/general/toCompactIRI");
const switchIRIProtocol_1 = require("../utilities/general/switchIRIProtocol");
const discoverEquateNamespaces_1 = require("../utilities/graph/discoverEquateNamespaces");
const discoverUsedSchemaOrgProtocol_1 = require("../utilities/graph/discoverUsedSchemaOrgProtocol");
const preProcessVocab_1 = require("../utilities/graph/preProcessVocab");
const generateContext_1 = require("../utilities/graph/generateContext");
const curateVocabNode_1 = require("../utilities/graph/curateVocabNode");
const extractFromClassMemory_1 = require("../utilities/graph/extractFromClassMemory");
const addInheritanceTermsClassAndEnum_1 = require("../utilities/graph/addInheritanceTermsClassAndEnum");
const addInheritanceTermsDataTypesAndProperties_1 = require("../utilities/graph/addInheritanceTermsDataTypesAndProperties");
const addEmptyArray_1 = require("../utilities/graph/addEmptyArray");
const nodeMergeOverwrite_1 = require("../utilities/graph/nodeMergeOverwrite");
const nodeMergeLanguageTerm_1 = require("../utilities/graph/nodeMergeLanguageTerm");
const nodeMergeAddIds_1 = require("../utilities/graph/nodeMergeAddIds");
const getStandardContext_1 = require("../utilities/graph/getStandardContext");
const applyFilter_1 = require("../utilities/reasoning/applyFilter");
const isIgnoredVocabNode_1 = require("../utilities/graph/isIgnoredVocabNode");
class Graph {
    constructor(sdoAdapter, outputFormat = "Compact") {
        this.sdoAdapter = sdoAdapter;
        this.context = (0, getStandardContext_1.getStandardContext)();
        this.classes = {};
        this.properties = {};
        this.dataTypes = {};
        this.enumerations = {};
        this.enumerationMembers = {};
        this.outputFormat = outputFormat;
    }
    async addVocabulary(vocab, vocabURL) {
        if (this.context.schema === undefined) {
            this.context.schema = (0, discoverUsedSchemaOrgProtocol_1.discoverUsedSchemaOrgProtocol)(vocab) + "://schema.org/";
        }
        try {
            if (this.sdoAdapter.equateVocabularyProtocols) {
                const equateNamespaces = (0, discoverEquateNamespaces_1.discoverEquateNamespaces)(this.context, vocab);
                if (equateNamespaces.length > 0) {
                    const adaptedContext = (0, cloneJson_1.cloneJson)(vocab["@context"]);
                    equateNamespaces.forEach((ens) => {
                        const usedKeyToDelete = Object.keys(adaptedContext).find((el) => adaptedContext[el] === ens);
                        if (usedKeyToDelete) {
                            delete adaptedContext[usedKeyToDelete];
                        }
                        const keyToUse = Object.keys(this.context).find((el) => this.context[el] === (0, switchIRIProtocol_1.switchIRIProtocol)(ens));
                        adaptedContext[keyToUse] = ens;
                    });
                    vocab = (await (0, preProcessVocab_1.preProcessVocab)(vocab, adaptedContext));
                    equateNamespaces.forEach((ens) => {
                        const keyToUse = Object.keys(this.context).find((el) => this.context[el] === (0, switchIRIProtocol_1.switchIRIProtocol)(ens));
                        vocab["@context"][keyToUse] = this.context[keyToUse];
                    });
                }
            }
            this.context = (0, generateContext_1.generateContext)(this.context, vocab["@context"]);
            vocab = (await (0, preProcessVocab_1.preProcessVocab)(vocab, this.context));
            const vocabularies = this.sdoAdapter.getVocabularies();
            for (let vocabNode of vocab["@graph"]) {
                vocabNode = (0, curateVocabNode_1.curateVocabNode)(vocabNode, vocabularies);
            }
            for (let i = 0; i < vocab["@graph"].length; i++) {
                const curNode = (0, cloneJson_1.cloneJson)(vocab["@graph"][i]);
                if ((0, isIgnoredVocabNode_1.isIgnoredVocabNode)(curNode)) {
                }
                else if ((0, isString_1.isString)(curNode["@type"])) {
                    switch (curNode["@type"]) {
                        case namespaces_1.TermTypeIRI.class:
                            this.addGraphNode(this.classes, curNode, vocabURL);
                            break;
                        case namespaces_1.TermTypeIRI.property:
                            this.addGraphNode(this.properties, curNode, vocabURL);
                            break;
                        default:
                            this.addGraphNode(this.enumerationMembers, curNode, vocabURL);
                            break;
                    }
                }
                else if ((0, isArray_1.isArray)(curNode["@type"])) {
                    if (curNode["@type"].includes(namespaces_1.TermTypeIRI.class) && curNode["@type"].includes(namespaces_1.TermTypeIRI.dataType)) {
                        this.addGraphNode(this.dataTypes, curNode, vocabURL);
                    }
                    else {
                        this.addGraphNode(this.enumerationMembers, curNode, vocabURL);
                    }
                }
                else {
                    this.sdoAdapter.onError("unexpected @type format for the following node: " + JSON.stringify(curNode, null, 2));
                }
            }
            (0, extractFromClassMemory_1.extractFromClassMemory)(this.classes, this.enumerations, this.addGraphNode, vocabURL);
            (0, extractFromClassMemory_1.extractFromClassMemory)(this.classes, this.dataTypes, this.addGraphNode, vocabURL);
            Object.values(this.dataTypes).forEach((el) => (el["@type"] = namespaces_1.TermTypeIRI.dataType));
            (0, addInheritanceTermsClassAndEnum_1.addInheritanceTermsClassAndEnum)(this.classes, this.enumerations, namespaces_1.NS.rdfs.subClassOf, namespaces_1.NS.soa.superClassOf);
            (0, addInheritanceTermsClassAndEnum_1.addInheritanceTermsClassAndEnum)(this.enumerations, this.enumerations, namespaces_1.NS.rdfs.subClassOf, namespaces_1.NS.soa.superClassOf);
            (0, addInheritanceTermsDataTypesAndProperties_1.addInheritanceTermsDataTypesAndProperties)(this.dataTypes, namespaces_1.NS.rdfs.subClassOf, namespaces_1.NS.soa.superClassOf);
            (0, addInheritanceTermsDataTypesAndProperties_1.addInheritanceTermsDataTypesAndProperties)(this.properties, namespaces_1.NS.rdfs.subPropertyOf, namespaces_1.NS.soa.superPropertyOf);
            Object.values(this.classes).forEach((el) => {
                (0, addEmptyArray_1.addEmptyArray)(el, namespaces_1.NS.soa.hasProperty);
                (0, addEmptyArray_1.addEmptyArray)(el, namespaces_1.NS.soa.isRangeOf);
            });
            Object.values(this.enumerations).forEach((el) => {
                (0, addEmptyArray_1.addEmptyArray)(el, namespaces_1.NS.soa.hasEnumerationMember);
                (0, addEmptyArray_1.addEmptyArray)(el, namespaces_1.NS.soa.isRangeOf);
                (0, addEmptyArray_1.addEmptyArray)(el, namespaces_1.NS.soa.hasProperty);
            });
            Object.values(this.dataTypes).forEach((el) => {
                (0, addEmptyArray_1.addEmptyArray)(el, namespaces_1.NS.soa.isRangeOf);
            });
            Object.values(this.enumerationMembers).forEach((el) => {
                (0, addEmptyArray_1.addEmptyArray)(el, namespaces_1.NS.soa.enumerationDomainIncludes);
            });
            const propertyKeys = Object.keys(this.properties);
            for (const actPropKey of propertyKeys) {
                const domainIncludesArray = this.properties[actPropKey][namespaces_1.NS.schema.domainIncludes];
                if ((0, isArray_1.isArray)(domainIncludesArray)) {
                    for (const actDomain of domainIncludesArray) {
                        let target = this.classes[actDomain];
                        if (!target) {
                            target = this.enumerations[actDomain];
                        }
                        if (target && (0, isArray_1.isArray)(target[namespaces_1.NS.soa.hasProperty]) && !target[namespaces_1.NS.soa.hasProperty].includes(actPropKey)) {
                            target[namespaces_1.NS.soa.hasProperty].push(actPropKey);
                        }
                    }
                }
                const rangeIncludesArray = this.properties[actPropKey][namespaces_1.NS.schema.rangeIncludes];
                if ((0, isArray_1.isArray)(rangeIncludesArray)) {
                    for (const actRange of rangeIncludesArray) {
                        const target = this.classes[actRange] || this.enumerations[actRange] || this.dataTypes[actRange];
                        if (target && (0, isArray_1.isArray)(target[namespaces_1.NS.soa.isRangeOf]) && !target[namespaces_1.NS.soa.isRangeOf].includes(actPropKey)) {
                            target[namespaces_1.NS.soa.isRangeOf].push(actPropKey);
                        }
                    }
                }
            }
            const enumMemKeys = Object.keys(this.enumerationMembers);
            for (const actEnumMemKey of enumMemKeys) {
                const enumMem = this.enumerationMembers[actEnumMemKey];
                let enumMemTypeArray = enumMem["@type"];
                if (!(0, isArray_1.isArray)(enumMemTypeArray)) {
                    enumMemTypeArray = [enumMemTypeArray];
                }
                for (const actEnumMemType of enumMemTypeArray) {
                    const target = this.enumerations[actEnumMemType];
                    if (target &&
                        (0, isArray_1.isArray)(target[namespaces_1.NS.soa.hasEnumerationMember]) &&
                        !target[namespaces_1.NS.soa.hasEnumerationMember].includes(actEnumMemKey)) {
                        target[namespaces_1.NS.soa.hasEnumerationMember].push(actEnumMemKey);
                        if ((0, isArray_1.isArray)(enumMem[namespaces_1.NS.soa.enumerationDomainIncludes])) {
                            enumMem[namespaces_1.NS.soa.enumerationDomainIncludes].push(actEnumMemType);
                        }
                        else {
                            enumMem[namespaces_1.NS.soa.enumerationDomainIncludes] = [actEnumMemType];
                        }
                    }
                }
            }
            return true;
        }
        catch (e) {
            this.sdoAdapter.onError(e);
            return false;
        }
    }
    addGraphNode(memory, newNode, vocabURL) {
        try {
            if (!memory[newNode["@id"]]) {
                memory[newNode["@id"]] = newNode;
                if (vocabURL) {
                    memory[newNode["@id"]]["vocabURLs"] = [vocabURL];
                }
            }
            else {
                const oldNode = memory[newNode["@id"]];
                (0, nodeMergeOverwrite_1.nodeMergeOverwrite)(oldNode, newNode, namespaces_1.NS.schema.isPartOf);
                (0, nodeMergeOverwrite_1.nodeMergeOverwrite)(oldNode, newNode, namespaces_1.NS.dcterms.source);
                (0, nodeMergeOverwrite_1.nodeMergeOverwrite)(oldNode, newNode, namespaces_1.NS.schema.source);
                (0, nodeMergeOverwrite_1.nodeMergeOverwrite)(oldNode, newNode, namespaces_1.NS.schema.category);
                (0, nodeMergeOverwrite_1.nodeMergeOverwrite)(oldNode, newNode, namespaces_1.NS.schema.supersededBy);
                (0, nodeMergeLanguageTerm_1.nodeMergeLanguageTerm)(oldNode, newNode, namespaces_1.NS.rdfs.label);
                (0, nodeMergeLanguageTerm_1.nodeMergeLanguageTerm)(oldNode, newNode, namespaces_1.NS.rdfs.comment);
                (0, nodeMergeAddIds_1.nodeMergeAddIds)(oldNode, newNode, namespaces_1.NS.rdfs.subClassOf);
                (0, nodeMergeAddIds_1.nodeMergeAddIds)(oldNode, newNode, namespaces_1.NS.soa.superClassOf);
                (0, nodeMergeAddIds_1.nodeMergeAddIds)(oldNode, newNode, namespaces_1.NS.soa.hasProperty);
                (0, nodeMergeAddIds_1.nodeMergeAddIds)(oldNode, newNode, namespaces_1.NS.soa.isRangeOf);
                (0, nodeMergeAddIds_1.nodeMergeAddIds)(oldNode, newNode, namespaces_1.NS.soa.enumerationDomainIncludes);
                (0, nodeMergeAddIds_1.nodeMergeAddIds)(oldNode, newNode, namespaces_1.NS.soa.hasEnumerationMember);
                (0, nodeMergeAddIds_1.nodeMergeAddIds)(oldNode, newNode, namespaces_1.NS.rdfs.subPropertyOf);
                (0, nodeMergeAddIds_1.nodeMergeAddIds)(oldNode, newNode, namespaces_1.NS.schema.domainIncludes);
                (0, nodeMergeAddIds_1.nodeMergeAddIds)(oldNode, newNode, namespaces_1.NS.schema.rangeIncludes);
                (0, nodeMergeAddIds_1.nodeMergeAddIds)(oldNode, newNode, namespaces_1.NS.soa.superPropertyOf);
                if (vocabURL) {
                    if (oldNode["vocabURLs"]) {
                        if (!oldNode["vocabURLs"].includes(vocabURL)) {
                            oldNode["vocabURLs"].push(vocabURL);
                        }
                    }
                    else {
                        oldNode["vocabURLs"] = [vocabURL];
                    }
                }
            }
            return true;
        }
        catch (e) {
            this.sdoAdapter.onError(e);
            return false;
        }
    }
    getTerm(id, filter) {
        const compactIRI = this.discoverCompactIRI(id);
        if (!compactIRI) {
            throw new Error("There is no term associated with '" + id + "'");
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
            throw new Error("There is no term associated with '" + id + "'");
        }
        targetObj = (0, applyFilter_1.applyFilter)({
            data: [targetObj["@id"]],
            filter,
            graph: this
        });
        if (targetObj.length === 0) {
            throw new Error("There is no term associated with '" + id + "' and the given filter settings");
        }
        switch (targetType) {
            case "Class":
                return new Class_1.Class(compactIRI, this);
            case "Property":
                return new Property_1.Property(compactIRI, this);
            case "Enumeration":
                return new Enumeration_1.Enumeration(compactIRI, this);
            case "EnumerationMember":
                return new EnumerationMember_1.EnumerationMember(compactIRI, this);
            case "DataType":
                return new DataType_1.DataType(compactIRI, this);
        }
        throw new Error("targetType with unknown value: " + targetType);
    }
    getClass(id, filter) {
        const compactIRI = this.discoverCompactIRI(id);
        if (compactIRI) {
            let classObj = this.classes[compactIRI];
            if (classObj) {
                classObj = (0, applyFilter_1.applyFilter)({ data: [compactIRI], filter, graph: this });
                if (classObj.length === 0) {
                    throw new Error("There is no class associated with '" + id + "' and the given filter settings");
                }
                else {
                    return new Class_1.Class(compactIRI, this);
                }
            }
            else {
                classObj = this.enumerations[compactIRI];
                if (classObj) {
                    try {
                        return this.getEnumeration(compactIRI, filter);
                    }
                    catch (e) {
                        throw new Error("There is no class associated with '" + id + "' and the given filter settings");
                    }
                }
            }
        }
        throw new Error("There is no class associated with '" + id + "'");
    }
    getProperty(id, filter) {
        const compactIRI = this.discoverCompactIRI(id);
        if (compactIRI) {
            let propertyObj = this.properties[compactIRI];
            if (propertyObj) {
                propertyObj = (0, applyFilter_1.applyFilter)({ data: [compactIRI], filter, graph: this });
                if (propertyObj.length === 0) {
                    throw new Error("There is no property associated with '" + id + "' and the given filter settings.");
                }
                else {
                    return new Property_1.Property(compactIRI, this);
                }
            }
        }
        throw new Error("There is no property associated with '" + id + "'");
    }
    getDataType(id, filter) {
        const compactIRI = this.discoverCompactIRI(id);
        if (compactIRI) {
            let dataTypeObj = this.dataTypes[compactIRI];
            if (dataTypeObj) {
                dataTypeObj = (0, applyFilter_1.applyFilter)({ data: [compactIRI], filter, graph: this });
                if (dataTypeObj.length === 0) {
                    throw new Error("There is no data-type associated with '" + id + "' and the given filter settings.");
                }
                else {
                    return new DataType_1.DataType(compactIRI, this);
                }
            }
        }
        throw new Error("There is no data-type associated with '" + id + "'");
    }
    getEnumeration(id, filter) {
        const compactIRI = this.discoverCompactIRI(id);
        if (compactIRI) {
            let enumObj = this.enumerations[compactIRI];
            if (enumObj) {
                enumObj = (0, applyFilter_1.applyFilter)({ data: [compactIRI], filter, graph: this });
                if (enumObj.length === 0) {
                    throw new Error("There is no enumeration associated with '" + id + "' and the given filter settings");
                }
                else {
                    return new Enumeration_1.Enumeration(compactIRI, this);
                }
            }
        }
        throw new Error("There is no enumeration associated with '" + id + "'");
    }
    getEnumerationMember(id, filter) {
        const compactIRI = this.discoverCompactIRI(id);
        if (compactIRI) {
            let enumObj = this.enumerationMembers[compactIRI];
            if (enumObj) {
                enumObj = (0, applyFilter_1.applyFilter)({ data: [compactIRI], filter, graph: this });
                if (enumObj.length === 0) {
                    throw new Error("There is no EnumerationMember associated with '" + id + "' and the given filter settings");
                }
                else {
                    return new EnumerationMember_1.EnumerationMember(compactIRI, this);
                }
            }
        }
        throw new Error("There is no EnumerationMember associated with '" + id + "'");
    }
    discoverCompactIRI(input) {
        if (input.includes(":")) {
            const contextKeys = Object.keys(this.context);
            for (const contextKey of contextKeys) {
                const contextValue = this.context[contextKey];
                if ((0, isString_1.isString)(contextValue)) {
                    if (input.startsWith(contextKey + ":")) {
                        return input;
                    }
                    else if (input.startsWith(contextValue) ||
                        (this.sdoAdapter.equateVocabularyProtocols && input.startsWith((0, switchIRIProtocol_1.switchIRIProtocol)(contextValue)))) {
                        try {
                            return (0, toCompactIRI_1.toCompactIRI)(input, this.context, this.sdoAdapter.equateVocabularyProtocols);
                        }
                        catch (e) {
                            return null;
                        }
                    }
                }
            }
        }
        else {
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
        return null;
    }
    containsLabel(termObj, label) {
        if (termObj && (0, isObject_1.isObject)(termObj[namespaces_1.NS.rdfs.label])) {
            const langKeys = Object.keys(termObj[namespaces_1.NS.rdfs.label]);
            for (const actLangKey of langKeys) {
                if (termObj[namespaces_1.NS.rdfs.label][actLangKey] === label) {
                    return true;
                }
            }
        }
        return false;
    }
}
exports.Graph = Graph;
//# sourceMappingURL=Graph.js.map