(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.SDOAdapter = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(_dereq_,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Class = void 0;
const Term_1 = _dereq_("./Term");
const reasoning_1 = _dereq_("./reasoning");
const namespaces_1 = _dereq_("./namespaces");
class Class extends Term_1.Term {
    constructor(IRI, graph) {
        super(IRI, graph);
        this.termTypeLabel = namespaces_1.TermTypeLabel.class;
        this.termTypeIRI = namespaces_1.TermTypeIRI.class;
    }
    getTermObj() {
        return this.graph.classes[this.IRI];
    }
    getProperties(implicit = true, filter) {
        const classObj = this.getTermObj();
        const result = [];
        result.push(...classObj[namespaces_1.SOA.hasProperty]);
        if (implicit) {
            result.push(...(0, reasoning_1.inferPropertiesFromSuperClasses)(classObj[namespaces_1.RDFS.subClassOf], this.graph));
        }
        return (0, reasoning_1.applyFilter)({ data: result, filter, graph: this.graph });
    }
    getSuperClasses(implicit = true, filter) {
        const classObj = this.getTermObj();
        const result = [];
        if (implicit) {
            result.push(...(0, reasoning_1.inferSuperClasses)(this.IRI, this.graph));
        }
        else {
            result.push(...classObj[namespaces_1.RDFS.subClassOf]);
        }
        return (0, reasoning_1.applyFilter)({ data: result, filter, graph: this.graph });
    }
    getSubClasses(implicit = true, filter) {
        const classObj = this.getTermObj();
        const result = [];
        if (implicit) {
            result.push(...(0, reasoning_1.inferSubClasses)(this.IRI, this.graph));
        }
        else {
            result.push(...classObj[namespaces_1.SOA.superClassOf]);
        }
        return (0, reasoning_1.applyFilter)({ data: result, filter, graph: this.graph });
    }
    isRangeOf(implicit = true, filter) {
        const result = [];
        if (implicit) {
            result.push(...(0, reasoning_1.inferRangeOf)(this.IRI, this.graph));
        }
        else {
            result.push(...this.getTermObj()[namespaces_1.SOA.isRangeOf]);
        }
        return (0, reasoning_1.applyFilter)({ data: result, filter, graph: this.graph });
    }
    toString(implicit = true, filter) {
        return JSON.stringify(this.toJSON(implicit, filter), null, 2);
    }
    toJSON(implicit = true, filter) {
        const result = super.toJSON();
        result.superClasses = this.getSuperClasses(implicit, filter);
        result.subClasses = this.getSubClasses(implicit, filter);
        result.properties = this.getProperties(implicit, filter);
        result.rangeOf = this.isRangeOf(implicit, filter);
        return result;
    }
}
exports.Class = Class;

},{"./Term":9,"./namespaces":12,"./reasoning":13}],2:[function(_dereq_,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataType = void 0;
const Term_1 = _dereq_("./Term");
const reasoning_1 = _dereq_("./reasoning");
const namespaces_1 = _dereq_("./namespaces");
class DataType extends Term_1.Term {
    constructor(IRI, graph) {
        super(IRI, graph);
        this.termTypeLabel = namespaces_1.TermTypeLabel.dataType;
        this.termTypeIRI = namespaces_1.TermTypeIRI.dataType;
    }
    getTermObj() {
        return this.graph.dataTypes[this.IRI];
    }
    getSuperDataTypes(implicit = true, filter) {
        const dataTypeObj = this.getTermObj();
        const result = [];
        if (implicit) {
            result.push(...(0, reasoning_1.inferSuperDataTypes)(this.IRI, this.graph));
        }
        else {
            result.push(...dataTypeObj[namespaces_1.RDFS.subClassOf]);
        }
        return (0, reasoning_1.applyFilter)({ data: result, filter, graph: this.graph });
    }
    getSubDataTypes(implicit = true, filter) {
        const dataTypeObj = this.getTermObj();
        const result = [];
        if (implicit) {
            result.push(...(0, reasoning_1.inferSubDataTypes)(this.IRI, this.graph));
        }
        else {
            result.push(...dataTypeObj[namespaces_1.SOA.superClassOf]);
        }
        return (0, reasoning_1.applyFilter)({ data: result, filter, graph: this.graph });
    }
    isRangeOf(implicit = true, filter) {
        const result = [];
        if (implicit) {
            result.push(...(0, reasoning_1.inferRangeOf)(this.IRI, this.graph));
        }
        else {
            result.push(...this.getTermObj()[namespaces_1.SOA.isRangeOf]);
        }
        return (0, reasoning_1.applyFilter)({ data: result, filter, graph: this.graph });
    }
    toJSON(implicit = true, filter) {
        const result = super.toJSON();
        result.superDataTypes = this.getSuperDataTypes(implicit, filter);
        result.subDataTypes = this.getSubDataTypes(implicit, filter);
        result.rangeOf = this.isRangeOf(implicit, filter);
        return result;
    }
    toString(implicit = true, filter) {
        return JSON.stringify(this.toJSON(implicit, filter), null, 2);
    }
}
exports.DataType = DataType;

},{"./Term":9,"./namespaces":12,"./reasoning":13}],3:[function(_dereq_,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Enumeration = void 0;
const Class_1 = _dereq_("./Class");
const utilities_1 = _dereq_("./utilities");
const namespaces_1 = _dereq_("./namespaces");
const reasoning_1 = _dereq_("./reasoning");
class Enumeration extends Class_1.Class {
    constructor(IRI, graph) {
        super(IRI, graph);
        this.termTypeLabel = namespaces_1.TermTypeLabel.enumeration;
        this.termTypeIRI = namespaces_1.TermTypeIRI.enumeration;
    }
    getTermObj() {
        return this.graph.enumerations[this.IRI];
    }
    getEnumerationMembers(implicit = true, filter) {
        const result = [];
        result.push(...this.getTermObj()[namespaces_1.SOA.hasEnumerationMember]);
        if (implicit) {
            const subClasses = this.getSubClasses(true);
            for (const actSubClass of subClasses) {
                const actualEnumeration = this.graph.enumerations[actSubClass];
                if (!(0, utilities_1.isNil)(actualEnumeration)) {
                    result.push(...actualEnumeration[namespaces_1.SOA.hasEnumerationMember]);
                }
            }
        }
        return (0, reasoning_1.applyFilter)({ data: result, filter, graph: this.graph });
    }
    toString(implicit = true, filter) {
        return JSON.stringify(this.toJSON(implicit, filter), null, 2);
    }
    toJSON(implicit = true, filter) {
        const result = super.toJSON(implicit, filter);
        result.enumerationMembers = this.getEnumerationMembers(implicit, filter);
        return result;
    }
}
exports.Enumeration = Enumeration;

},{"./Class":1,"./namespaces":12,"./reasoning":13,"./utilities":14}],4:[function(_dereq_,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnumerationMember = void 0;
const Term_1 = _dereq_("./Term");
const utilities_1 = _dereq_("./utilities");
const reasoning_1 = _dereq_("./reasoning");
const namespaces_1 = _dereq_("./namespaces");
class EnumerationMember extends Term_1.Term {
    constructor(IRI, graph) {
        super(IRI, graph);
        this.termTypeLabel = namespaces_1.TermTypeLabel.enumerationMember;
        this.termTypeIRI = namespaces_1.TermTypeIRI.enumerationMember;
    }
    getTermObj() {
        return this.graph.enumerationMembers[this.IRI];
    }
    getDomainEnumerations(implicit = true, filter) {
        const enumObj = this.getTermObj();
        let result = [];
        result.push(...enumObj[namespaces_1.SOA.enumerationDomainIncludes]);
        if (implicit) {
            const domainEnumerationsToCheck = (0, utilities_1.cloneJson)(result);
            for (const actDE of domainEnumerationsToCheck) {
                result.push(...(0, reasoning_1.inferSuperClasses)(actDE, this.graph));
            }
            result = (0, reasoning_1.applyFilter)({
                data: result,
                filter: { termType: namespaces_1.TermTypeLabel.enumeration },
                graph: this.graph,
            });
        }
        return (0, reasoning_1.applyFilter)({ data: result, filter, graph: this.graph });
    }
    toString(implicit = true, filter) {
        return JSON.stringify(this.toJSON(implicit, filter), null, 2);
    }
    toJSON(implicit = true, filter) {
        const result = super.toJSON();
        result["domainEnumerations"] = this.getDomainEnumerations(implicit, filter);
        return result;
    }
}
exports.EnumerationMember = EnumerationMember;

},{"./Term":9,"./namespaces":12,"./reasoning":13,"./utilities":14}],5:[function(_dereq_,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Graph = void 0;
const Class_1 = _dereq_("./Class");
const Property_1 = _dereq_("./Property");
const Enumeration_1 = _dereq_("./Enumeration");
const EnumerationMember_1 = _dereq_("./EnumerationMember");
const DataType_1 = _dereq_("./DataType");
const utilities_1 = _dereq_("./utilities");
const namespaces_1 = _dereq_("./namespaces");
const graphUtilities_1 = _dereq_("./graphUtilities");
const reasoning_1 = _dereq_("./reasoning");
class Graph {
    constructor(sdoAdapter) {
        this.sdoAdapter = sdoAdapter;
        this.context = (0, graphUtilities_1.getStandardContext)();
        this.classes = {};
        this.properties = {};
        this.dataTypes = {};
        this.enumerations = {};
        this.enumerationMembers = {};
    }
    addVocabulary(vocab, vocabURL) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.context.schema === undefined) {
                this.context.schema =
                    (0, graphUtilities_1.discoverUsedSchemaOrgProtocol)(vocab) + "://schema.org/";
            }
            try {
                if (this.sdoAdapter.equateVocabularyProtocols) {
                    const equateNamespaces = (0, graphUtilities_1.discoverEquateNamespaces)(this.context, vocab);
                    if (equateNamespaces.length > 0) {
                        const adaptedContext = (0, utilities_1.cloneJson)(vocab["@context"]);
                        equateNamespaces.forEach((ens) => {
                            const usedKeyToDelete = Object.keys(adaptedContext).find((el) => adaptedContext[el] === ens);
                            if (usedKeyToDelete) {
                                delete adaptedContext[usedKeyToDelete];
                            }
                            const keyToUse = Object.keys(this.context).find((el) => this.context[el] === (0, utilities_1.switchIRIProtocol)(ens));
                            adaptedContext[keyToUse] = ens;
                        });
                        vocab = (yield (0, graphUtilities_1.preProcessVocab)(vocab, adaptedContext));
                        equateNamespaces.forEach((ens) => {
                            const keyToUse = Object.keys(this.context).find((el) => this.context[el] === (0, utilities_1.switchIRIProtocol)(ens));
                            vocab["@context"][keyToUse] =
                                this.context[keyToUse];
                        });
                    }
                }
                this.context = (0, graphUtilities_1.generateContext)(this.context, vocab["@context"]);
                vocab = (yield (0, graphUtilities_1.preProcessVocab)(vocab, this.context));
                const vocabularies = this.sdoAdapter.getVocabularies();
                for (let vocabNode of vocab["@graph"]) {
                    vocabNode = (0, graphUtilities_1.curateVocabNode)(vocabNode, vocabularies);
                }
                for (let i = 0; i < vocab["@graph"].length; i++) {
                    const curNode = (0, utilities_1.cloneJson)(vocab["@graph"][i]);
                    if ((0, utilities_1.isString)(curNode["@type"])) {
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
                    else if ((0, utilities_1.isArray)(curNode["@type"])) {
                        if (curNode["@type"].includes(namespaces_1.TermTypeIRI.class) &&
                            curNode["@type"].includes(namespaces_1.TermTypeIRI.dataType)) {
                            this.addGraphNode(this.dataTypes, curNode, vocabURL);
                        }
                        else {
                            this.addGraphNode(this.enumerationMembers, curNode, vocabURL);
                        }
                    }
                    else {
                        this.sdoAdapter.onError("unexpected @type format for the following node: " +
                            JSON.stringify(curNode, null, 2));
                    }
                }
                let newEnum;
                do {
                    newEnum = false;
                    const classesKeys = Object.keys(this.classes);
                    const enumKeys = Object.keys(this.enumerations);
                    for (const actClassKey of classesKeys) {
                        if (this.classes[actClassKey][namespaces_1.RDFS.subClassOf] !== undefined) {
                            const subClassArray = this.classes[actClassKey][namespaces_1.RDFS.subClassOf];
                            for (const actSubClass of subClassArray) {
                                if (actSubClass === namespaces_1.TermTypeIRI.enumeration ||
                                    enumKeys.includes(actSubClass)) {
                                    if (this.classes[actClassKey] &&
                                        !this.enumerations[actClassKey]) {
                                        newEnum = true;
                                        this.enumerations[actClassKey] = (0, utilities_1.cloneJson)(this.classes[actClassKey]);
                                        delete this.classes[actClassKey];
                                    }
                                }
                            }
                        }
                    }
                } while (newEnum);
                let newDatatype;
                do {
                    newDatatype = false;
                    const classesKeys = Object.keys(this.classes);
                    const dtKeys = Object.keys(this.dataTypes);
                    for (const actClassKey of classesKeys) {
                        if (this.classes[actClassKey][namespaces_1.RDFS.subClassOf] !== undefined) {
                            const subClassArray = this.classes[actClassKey][namespaces_1.RDFS.subClassOf];
                            for (const actSubClass of subClassArray) {
                                if (actSubClass === namespaces_1.TermTypeIRI.dataType ||
                                    dtKeys.includes(actSubClass)) {
                                    if (this.classes[actClassKey] && !this.dataTypes[actClassKey]) {
                                        newDatatype = true;
                                        this.dataTypes[actClassKey] = (0, utilities_1.cloneJson)(this.classes[actClassKey]);
                                        delete this.classes[actClassKey];
                                    }
                                }
                            }
                        }
                    }
                } while (newDatatype);
                const dtKeys = Object.keys(this.dataTypes);
                for (const actDtKey of dtKeys) {
                    this.dataTypes[actDtKey]["@type"] = namespaces_1.TermTypeIRI.dataType;
                }
                let classesKeys = Object.keys(this.classes);
                for (const actClassKey of classesKeys) {
                    const superClasses = this.classes[actClassKey][namespaces_1.RDFS.subClassOf];
                    if (!this.classes[actClassKey][namespaces_1.SOA.superClassOf]) {
                        this.classes[actClassKey][namespaces_1.SOA.superClassOf] = [];
                    }
                    for (const actSuperClass of superClasses) {
                        let superClass = this.classes[actSuperClass];
                        if (!superClass) {
                            superClass = this.enumerations[actSuperClass];
                        }
                        if (superClass) {
                            if (superClass[namespaces_1.SOA.superClassOf]) {
                                if (!superClass[namespaces_1.SOA.superClassOf].includes(actClassKey)) {
                                    superClass[namespaces_1.SOA.superClassOf].push(actClassKey);
                                }
                            }
                            else {
                                superClass[namespaces_1.SOA.superClassOf] = [actClassKey];
                            }
                        }
                    }
                }
                let enumKeys = Object.keys(this.enumerations);
                for (const actEnumKey of enumKeys) {
                    const superClasses = this.enumerations[actEnumKey][namespaces_1.RDFS.subClassOf];
                    if (!this.enumerations[actEnumKey][namespaces_1.SOA.superClassOf]) {
                        this.enumerations[actEnumKey][namespaces_1.SOA.superClassOf] = [];
                    }
                    for (const actSuperClass of superClasses) {
                        let superClass = this.classes[actSuperClass];
                        if (!superClass) {
                            superClass = this.enumerations[actSuperClass];
                        }
                        if (superClass) {
                            if (superClass[namespaces_1.SOA.superClassOf]) {
                                if (!superClass[namespaces_1.SOA.superClassOf].includes(actEnumKey)) {
                                    superClass[namespaces_1.SOA.superClassOf].push(actEnumKey);
                                }
                            }
                            else {
                                superClass[namespaces_1.SOA.superClassOf] = [actEnumKey];
                            }
                        }
                    }
                }
                let dataTypeKeys = Object.keys(this.dataTypes);
                for (const actDtKey of dataTypeKeys) {
                    const superClasses = this.dataTypes[actDtKey][namespaces_1.RDFS.subClassOf];
                    if (!this.dataTypes[actDtKey][namespaces_1.SOA.superClassOf]) {
                        this.dataTypes[actDtKey][namespaces_1.SOA.superClassOf] = [];
                    }
                    if (!superClasses) {
                        this.dataTypes[actDtKey][namespaces_1.RDFS.subClassOf] = [];
                    }
                    else {
                        for (const actSuperClass of superClasses) {
                            const superClass = this.dataTypes[actSuperClass];
                            if (superClass) {
                                if (superClass[namespaces_1.SOA.superClassOf]) {
                                    if (!superClass[namespaces_1.SOA.superClassOf].includes(actDtKey)) {
                                        superClass[namespaces_1.SOA.superClassOf].push(actDtKey);
                                    }
                                }
                                else {
                                    superClass[namespaces_1.SOA.superClassOf] = [actDtKey];
                                }
                            }
                        }
                    }
                }
                let propertyKeys = Object.keys(this.properties);
                for (const actPropKey of propertyKeys) {
                    const superProperties = this.properties[actPropKey][namespaces_1.RDFS.subPropertyOf];
                    if (!this.properties[actPropKey][namespaces_1.SOA.superPropertyOf]) {
                        this.properties[actPropKey][namespaces_1.SOA.superPropertyOf] = [];
                    }
                    if (!superProperties) {
                        this.properties[actPropKey][namespaces_1.RDFS.subPropertyOf] = [];
                    }
                    else {
                        for (const actSuperProp of superProperties) {
                            const superClass = this.properties[actSuperProp];
                            if (superClass) {
                                if (superClass[namespaces_1.SOA.superPropertyOf]) {
                                    if (!superClass[namespaces_1.SOA.superPropertyOf].includes(actPropKey)) {
                                        superClass[namespaces_1.SOA.superPropertyOf].push(actPropKey);
                                    }
                                }
                                else {
                                    superClass[namespaces_1.SOA.superPropertyOf] = [actPropKey];
                                }
                            }
                        }
                    }
                }
                classesKeys = Object.keys(this.classes);
                for (const actClassKey of classesKeys) {
                    if (!this.classes[actClassKey][namespaces_1.SOA.hasProperty]) {
                        this.classes[actClassKey][namespaces_1.SOA.hasProperty] = [];
                    }
                    if (!this.classes[actClassKey][namespaces_1.SOA.isRangeOf]) {
                        this.classes[actClassKey][namespaces_1.SOA.isRangeOf] = [];
                    }
                }
                enumKeys = Object.keys(this.enumerations);
                for (const actEnumKey of enumKeys) {
                    if (!this.enumerations[actEnumKey][namespaces_1.SOA.hasEnumerationMember]) {
                        this.enumerations[actEnumKey][namespaces_1.SOA.hasEnumerationMember] = [];
                    }
                    if (!this.enumerations[actEnumKey][namespaces_1.SOA.isRangeOf]) {
                        this.enumerations[actEnumKey][namespaces_1.SOA.isRangeOf] = [];
                    }
                    if (!this.enumerations[actEnumKey][namespaces_1.SOA.hasProperty]) {
                        this.enumerations[actEnumKey][namespaces_1.SOA.hasProperty] = [];
                    }
                }
                dataTypeKeys = Object.keys(this.dataTypes);
                for (const actDataTypeKey of dataTypeKeys) {
                    if (!this.dataTypes[actDataTypeKey][namespaces_1.SOA.isRangeOf]) {
                        this.dataTypes[actDataTypeKey][namespaces_1.SOA.isRangeOf] = [];
                    }
                }
                let enumMemKeys = Object.keys(this.enumerationMembers);
                for (const actEnumMemKey of enumMemKeys) {
                    if (!this.enumerationMembers[actEnumMemKey][namespaces_1.SOA.enumerationDomainIncludes]) {
                        this.enumerationMembers[actEnumMemKey][namespaces_1.SOA.enumerationDomainIncludes] = [];
                    }
                }
                propertyKeys = Object.keys(this.properties);
                for (const actPropKey of propertyKeys) {
                    const domainIncludesArray = this.properties[actPropKey][namespaces_1.SCHEMA.domainIncludes];
                    if ((0, utilities_1.isArray)(domainIncludesArray)) {
                        for (const actDomain of domainIncludesArray) {
                            let target = this.classes[actDomain];
                            if (!target) {
                                target = this.enumerations[actDomain];
                            }
                            if (target &&
                                (0, utilities_1.isArray)(target[namespaces_1.SOA.hasProperty]) &&
                                !target[namespaces_1.SOA.hasProperty].includes(actPropKey)) {
                                target[namespaces_1.SOA.hasProperty].push(actPropKey);
                            }
                        }
                    }
                    const rangeIncludesArray = this.properties[actPropKey][namespaces_1.SCHEMA.rangeIncludes];
                    if ((0, utilities_1.isArray)(rangeIncludesArray)) {
                        for (const actRange of rangeIncludesArray) {
                            const target = this.classes[actRange] ||
                                this.enumerations[actRange] ||
                                this.dataTypes[actRange];
                            if (target &&
                                (0, utilities_1.isArray)(target[namespaces_1.SOA.isRangeOf]) &&
                                !target[namespaces_1.SOA.isRangeOf].includes(actPropKey)) {
                                target[namespaces_1.SOA.isRangeOf].push(actPropKey);
                            }
                        }
                    }
                }
                enumMemKeys = Object.keys(this.enumerationMembers);
                for (const actEnumMemKey of enumMemKeys) {
                    const enumMem = this.enumerationMembers[actEnumMemKey];
                    let enumMemTypeArray = enumMem["@type"];
                    if (!(0, utilities_1.isArray)(enumMemTypeArray)) {
                        enumMemTypeArray = [enumMemTypeArray];
                    }
                    for (const actEnumMemType of enumMemTypeArray) {
                        const target = this.enumerations[actEnumMemType];
                        if (target &&
                            (0, utilities_1.isArray)(target[namespaces_1.SOA.hasEnumerationMember]) &&
                            !target[namespaces_1.SOA.hasEnumerationMember].includes(actEnumMemKey)) {
                            target[namespaces_1.SOA.hasEnumerationMember].push(actEnumMemKey);
                            if ((0, utilities_1.isArray)(enumMem[namespaces_1.SOA.enumerationDomainIncludes])) {
                                enumMem[namespaces_1.SOA.enumerationDomainIncludes].push(actEnumMemType);
                            }
                            else {
                                enumMem[namespaces_1.SOA.enumerationDomainIncludes] = [actEnumMemType];
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
        });
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
                if (!(0, utilities_1.isNil)(newNode[namespaces_1.SCHEMA.isPartOf])) {
                    oldNode[namespaces_1.SCHEMA.isPartOf] = newNode[namespaces_1.SCHEMA.isPartOf];
                }
                if (!(0, utilities_1.isNil)(newNode[namespaces_1.DC.source])) {
                    oldNode[namespaces_1.DC.source] = newNode[namespaces_1.DC.source];
                }
                if (!(0, utilities_1.isNil)(newNode[namespaces_1.SCHEMA.source])) {
                    oldNode[namespaces_1.SCHEMA.source] = newNode[namespaces_1.SCHEMA.source];
                }
                if (!(0, utilities_1.isNil)(newNode[namespaces_1.SCHEMA.category])) {
                    oldNode[namespaces_1.SCHEMA.category] = newNode[namespaces_1.SCHEMA.category];
                }
                if (!(0, utilities_1.isNil)(newNode[namespaces_1.SCHEMA.supersededBy])) {
                    oldNode[namespaces_1.SCHEMA.supersededBy] = newNode[namespaces_1.SCHEMA.supersededBy];
                }
                if (!(0, utilities_1.isNil)(newNode[namespaces_1.RDFS.label])) {
                    const labelKeysNew = Object.keys(newNode[namespaces_1.RDFS.label]);
                    for (const actLabelKey of labelKeysNew) {
                        oldNode[namespaces_1.RDFS.label][actLabelKey] = newNode[namespaces_1.RDFS.label][actLabelKey];
                    }
                }
                if (!(0, utilities_1.isNil)(newNode[namespaces_1.RDFS.comment])) {
                    const commentKeysNew = Object.keys(newNode[namespaces_1.RDFS.comment]);
                    for (const actCommentKey of commentKeysNew) {
                        oldNode[namespaces_1.RDFS.comment][actCommentKey] =
                            newNode[namespaces_1.RDFS.comment][actCommentKey];
                    }
                }
                if (!(0, utilities_1.isNil)(newNode[namespaces_1.RDFS.subClassOf])) {
                    for (const actSuperClass of newNode[namespaces_1.RDFS.subClassOf]) {
                        if (!oldNode[namespaces_1.RDFS.subClassOf].includes(actSuperClass)) {
                            oldNode[namespaces_1.RDFS.subClassOf].push(actSuperClass);
                        }
                    }
                }
                if (!(0, utilities_1.isNil)(newNode[namespaces_1.SOA.superClassOf])) {
                    for (const actSubClass of newNode[namespaces_1.SOA.superClassOf]) {
                        if (!oldNode[namespaces_1.SOA.superClassOf].includes(actSubClass)) {
                            oldNode[namespaces_1.SOA.superClassOf].push(actSubClass);
                        }
                    }
                }
                if (!(0, utilities_1.isNil)(newNode[namespaces_1.SOA.hasProperty])) {
                    for (const actProp of newNode[namespaces_1.SOA.hasProperty]) {
                        if (!oldNode[namespaces_1.SOA.hasProperty].includes(actProp)) {
                            oldNode[namespaces_1.SOA.hasProperty].push(actProp);
                        }
                    }
                }
                if (!(0, utilities_1.isNil)(newNode[namespaces_1.SOA.isRangeOf])) {
                    for (const actProp of newNode[namespaces_1.SOA.isRangeOf]) {
                        if (!oldNode[namespaces_1.SOA.isRangeOf].includes(actProp)) {
                            oldNode[namespaces_1.SOA.isRangeOf].push(actProp);
                        }
                    }
                }
                if (!(0, utilities_1.isNil)(newNode[namespaces_1.SOA.enumerationDomainIncludes])) {
                    for (const actEnum of newNode[namespaces_1.SOA.enumerationDomainIncludes]) {
                        if (!oldNode[namespaces_1.SOA.enumerationDomainIncludes].includes(actEnum)) {
                            oldNode[namespaces_1.SOA.enumerationDomainIncludes].push(actEnum);
                        }
                    }
                }
                if (!(0, utilities_1.isNil)(newNode[namespaces_1.SOA.hasEnumerationMember])) {
                    for (const actEnumMem of newNode[namespaces_1.SOA.hasEnumerationMember]) {
                        if (!oldNode[namespaces_1.SOA.hasEnumerationMember].includes(actEnumMem)) {
                            oldNode[namespaces_1.SOA.hasEnumerationMember].push(actEnumMem);
                        }
                    }
                }
                if (!(0, utilities_1.isNil)(newNode[namespaces_1.RDFS.subPropertyOf])) {
                    for (const actProp of newNode[namespaces_1.RDFS.subPropertyOf]) {
                        if (!oldNode[namespaces_1.RDFS.subPropertyOf].includes(actProp)) {
                            oldNode[namespaces_1.RDFS.subPropertyOf].push(actProp);
                        }
                    }
                }
                if (!(0, utilities_1.isNil)(newNode[namespaces_1.SCHEMA.domainIncludes])) {
                    for (const actDomain of newNode[namespaces_1.SCHEMA.domainIncludes]) {
                        if (!oldNode[namespaces_1.SCHEMA.domainIncludes].includes(actDomain)) {
                            oldNode[namespaces_1.SCHEMA.domainIncludes].push(actDomain);
                        }
                    }
                }
                if (!(0, utilities_1.isNil)(newNode[namespaces_1.SCHEMA.rangeIncludes])) {
                    for (const actRange of newNode[namespaces_1.SCHEMA.rangeIncludes]) {
                        if (!oldNode[namespaces_1.SCHEMA.rangeIncludes].includes(actRange)) {
                            oldNode[namespaces_1.SCHEMA.rangeIncludes].push(actRange);
                        }
                    }
                }
                if (!(0, utilities_1.isNil)(newNode[namespaces_1.SOA.superPropertyOf])) {
                    for (const actProp of newNode[namespaces_1.SOA.superPropertyOf]) {
                        if (!oldNode[namespaces_1.SOA.superPropertyOf].includes(actProp)) {
                            oldNode[namespaces_1.SOA.superPropertyOf].push(actProp);
                        }
                    }
                }
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
        targetObj = (0, reasoning_1.applyFilter)({
            data: [targetObj["@id"]],
            filter,
            graph: this,
        });
        if (targetObj.length === 0) {
            throw new Error("There is no term with that IRI and filter settings.");
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
                classObj = (0, reasoning_1.applyFilter)({ data: [compactIRI], filter, graph: this });
                if (classObj.length === 0) {
                    throw new Error("There is no class with that IRI and filter settings.");
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
                        throw new Error("There is no class with that IRI and filter settings.");
                    }
                }
            }
        }
        throw new Error("There is no class with the IRI " + id);
    }
    getProperty(id, filter) {
        const compactIRI = this.discoverCompactIRI(id);
        if (compactIRI) {
            let propertyObj = this.properties[compactIRI];
            if (propertyObj) {
                propertyObj = (0, reasoning_1.applyFilter)({ data: [compactIRI], filter, graph: this });
                if (propertyObj.length === 0) {
                    throw new Error("There is no property with that URI and filter settings.");
                }
                else {
                    return new Property_1.Property(compactIRI, this);
                }
            }
        }
        throw new Error("There is no property with that URI.");
    }
    getDataType(id, filter) {
        const compactIRI = this.discoverCompactIRI(id);
        if (compactIRI) {
            let dataTypeObj = this.dataTypes[compactIRI];
            if (dataTypeObj) {
                dataTypeObj = (0, reasoning_1.applyFilter)({ data: [compactIRI], filter, graph: this });
                if (dataTypeObj.length === 0) {
                    throw new Error("There is no data-type with that IRI and filter settings.");
                }
                else {
                    return new DataType_1.DataType(compactIRI, this);
                }
            }
        }
        throw new Error("There is no data-type with the IRI " + id);
    }
    getEnumeration(id, filter) {
        const compactIRI = this.discoverCompactIRI(id);
        if (compactIRI) {
            let enumObj = this.enumerations[compactIRI];
            if (enumObj) {
                enumObj = (0, reasoning_1.applyFilter)({ data: [compactIRI], filter, graph: this });
                if (enumObj.length === 0) {
                    throw new Error("There is no enumeration with that IRI and filter settings.");
                }
                else {
                    return new Enumeration_1.Enumeration(compactIRI, this);
                }
            }
        }
        throw new Error("There is no enumeration with the IRI " + id);
    }
    getEnumerationMember(id, filter) {
        const compactIRI = this.discoverCompactIRI(id);
        if (compactIRI) {
            let enumObj = this.enumerationMembers[compactIRI];
            if (enumObj) {
                enumObj = (0, reasoning_1.applyFilter)({ data: [compactIRI], filter, graph: this });
                if (enumObj.length === 0) {
                    throw new Error("There is no EnumerationMember with that IRI and filter settings.");
                }
                else {
                    return new EnumerationMember_1.EnumerationMember(compactIRI, this);
                }
            }
        }
        throw new Error("There is no EnumerationMember with the IRI " + id);
    }
    discoverCompactIRI(input) {
        if (input.includes(":")) {
            const terms = Object.keys(this.context);
            for (const actTerm of terms) {
                const absoluteIRI = this.context[actTerm];
                if ((0, utilities_1.isString)(absoluteIRI)) {
                    if (input.startsWith(actTerm)) {
                        return input;
                    }
                    else if (input.startsWith(absoluteIRI) ||
                        (this.sdoAdapter.equateVocabularyProtocols &&
                            input.startsWith((0, utilities_1.switchIRIProtocol)(absoluteIRI)))) {
                        try {
                            return (0, utilities_1.toCompactIRI)(input, this.context, this.sdoAdapter.equateVocabularyProtocols);
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
        if (termObj && (0, utilities_1.isObject)(termObj[namespaces_1.RDFS.label])) {
            const langKeys = Object.keys(termObj[namespaces_1.RDFS.label]);
            for (const actLangKey of langKeys) {
                if (termObj[namespaces_1.RDFS.label][actLangKey] === label) {
                    return true;
                }
            }
        }
        return false;
    }
}
exports.Graph = Graph;

},{"./Class":1,"./DataType":2,"./Enumeration":3,"./EnumerationMember":4,"./Property":6,"./graphUtilities":10,"./namespaces":12,"./reasoning":13,"./utilities":14}],6:[function(_dereq_,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Property = void 0;
const Term_1 = _dereq_("./Term");
const reasoning_1 = _dereq_("./reasoning");
const namespaces_1 = _dereq_("./namespaces");
class Property extends Term_1.Term {
    constructor(IRI, graph) {
        super(IRI, graph);
        this.termTypeLabel = namespaces_1.TermTypeLabel.property;
        this.termTypeIRI = namespaces_1.TermTypeIRI.property;
    }
    getTermObj() {
        return this.graph.properties[this.IRI];
    }
    getRanges(implicit = true, filter) {
        const propertyObj = this.getTermObj();
        const result = [];
        result.push(...propertyObj[namespaces_1.SCHEMA.rangeIncludes]);
        if (implicit) {
            for (const actRes of result) {
                result.push(...(0, reasoning_1.inferSubDataTypes)(actRes, this.graph));
            }
            for (const actRes of result) {
                result.push(...(0, reasoning_1.inferSubClasses)(actRes, this.graph));
            }
        }
        return (0, reasoning_1.applyFilter)({ data: result, filter, graph: this.graph });
    }
    getDomains(implicit = true, filter) {
        const propertyObj = this.getTermObj();
        const result = [];
        result.push(...propertyObj[namespaces_1.SCHEMA.domainIncludes]);
        if (implicit) {
            const inferredSubClasses = [];
            for (const actRes of result) {
                inferredSubClasses.push(...(0, reasoning_1.inferSubClasses)(actRes, this.graph));
            }
            result.push(...inferredSubClasses);
        }
        return (0, reasoning_1.applyFilter)({ data: result, filter, graph: this.graph });
    }
    getSuperProperties(implicit = true, filter) {
        const propertyObj = this.getTermObj();
        const result = [];
        if (implicit) {
            result.push(...(0, reasoning_1.inferSuperProperties)(this.IRI, this.graph));
        }
        else {
            result.push(...propertyObj[namespaces_1.RDFS.subPropertyOf]);
        }
        return (0, reasoning_1.applyFilter)({ data: result, filter, graph: this.graph });
    }
    getSubProperties(implicit = true, filter) {
        const propertyObj = this.getTermObj();
        const result = [];
        if (implicit) {
            result.push(...(0, reasoning_1.inferSubProperties)(this.IRI, this.graph));
        }
        else {
            result.push(...propertyObj[namespaces_1.SOA.superPropertyOf]);
        }
        return (0, reasoning_1.applyFilter)({ data: result, filter, graph: this.graph });
    }
    getInverseOf() {
        const propertyObj = this.getTermObj();
        return propertyObj[namespaces_1.SCHEMA.inverseOf];
    }
    toString(implicit = true, filter) {
        return JSON.stringify(this.toJSON(implicit, filter), null, 2);
    }
    toJSON(implicit = true, filter) {
        const result = super.toJSON();
        result["ranges"] = this.getRanges(implicit, filter);
        result["domains"] = this.getDomains(implicit, filter);
        result["superProperties"] = this.getSuperProperties(implicit, filter);
        result["subProperties"] = this.getSubProperties(implicit, filter);
        result["inverseOf"] = this.getInverseOf();
        return result;
    }
}
exports.Property = Property;

},{"./Term":9,"./namespaces":12,"./reasoning":13}],7:[function(_dereq_,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RetrievalMemory = void 0;
const utilities_1 = _dereq_("./utilities");
class RetrievalMemory {
    constructor() {
        this.cache = new Map();
    }
    static getInstance() {
        if (!RetrievalMemory.instance) {
            RetrievalMemory.instance = new RetrievalMemory();
        }
        return RetrievalMemory.instance;
    }
    setData(dataId, data, commit = "standard") {
        let entry = this.cache.get(commit);
        if (!entry) {
            entry = {};
            this.cache.set(commit, entry);
        }
        entry[dataId] = (0, utilities_1.cloneJson)(data);
    }
    getData(dataId, commit = "standard") {
        const entry = this.cache.get(commit);
        if (entry) {
            return (0, utilities_1.cloneJson)(entry[dataId]);
        }
        return undefined;
    }
    deleteCache() {
        this.cache = new Map();
    }
}
exports.RetrievalMemory = RetrievalMemory;

},{"./utilities":14}],8:[function(_dereq_,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SDOAdapter = void 0;
const Graph_1 = _dereq_("./Graph");
const axios_1 = __importDefault(_dereq_("axios"));
const utilities_1 = _dereq_("./utilities");
const reasoning_1 = _dereq_("./reasoning");
class SDOAdapter {
    constructor(paramObj) {
        if (paramObj === null || paramObj === void 0 ? void 0 : paramObj.commit) {
            this.commit = paramObj.commit;
        }
        if (typeof (paramObj === null || paramObj === void 0 ? void 0 : paramObj.onError) === "function") {
            this.onError = paramObj.onError;
        }
        else {
            this.onError = function () {
            };
        }
        if ((paramObj === null || paramObj === void 0 ? void 0 : paramObj.schemaHttps) !== undefined) {
            this.schemaHttps = paramObj.schemaHttps;
        }
        else {
            this.schemaHttps = true;
        }
        if ((paramObj === null || paramObj === void 0 ? void 0 : paramObj.equateVocabularyProtocols) !== undefined) {
            this.equateVocabularyProtocols = paramObj.equateVocabularyProtocols;
        }
        else {
            this.equateVocabularyProtocols = false;
        }
        this.graph = new Graph_1.Graph(this);
    }
    addVocabularies(vocabArray) {
        return __awaiter(this, void 0, void 0, function* () {
            vocabArray = (0, utilities_1.toArray)(vocabArray);
            for (const vocab of vocabArray) {
                if ((0, utilities_1.isString)(vocab)) {
                    if (vocab.startsWith("www") ||
                        vocab.startsWith("http")) {
                        try {
                            let fetchedVocab = yield this.fetchVocabularyFromURL(vocab);
                            if ((0, utilities_1.isString)(fetchedVocab)) {
                                fetchedVocab = JSON.parse(fetchedVocab);
                            }
                            yield this.graph.addVocabulary(fetchedVocab, vocab);
                        }
                        catch (e) {
                            throw new Error("The given URL " +
                                vocab +
                                " did not contain a valid JSON-LD vocabulary.");
                        }
                    }
                    else {
                        try {
                            yield this.graph.addVocabulary(JSON.parse(vocab));
                        }
                        catch (e) {
                            throw new Error("Parsing of vocabulary string produced an invalid JSON-LD.");
                        }
                    }
                }
                else if ((0, utilities_1.isObject)(vocab)) {
                    yield this.graph.addVocabulary(vocab);
                }
                else {
                    throw new Error("The first argument of the function must be an Array of vocabularies or a single vocabulary (JSON-LD as Object/String)");
                }
            }
            return true;
        });
    }
    fetchVocabularyFromURL(url) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield axios_1.default.get(url, {
                    headers: {
                        Accept: "application/ld+json, application/json",
                    },
                });
                return res.data;
            }
            catch (e) {
                throw new Error("Could not find any resource at the given URL.");
            }
        });
    }
    getTerm(id, filter) {
        return this.graph.getTerm(id, filter);
    }
    getAllTerms(filter) {
        const result = [];
        const classesIRIList = this.getListOfClasses(filter);
        const enumerationsIRIList = this.getListOfEnumerations(filter);
        const propertiesIRIList = this.getListOfProperties(filter);
        const dataTypesIRIList = this.getListOfDataTypes(filter);
        const enumerationMembersIRIList = this.getListOfEnumerationMembers(filter);
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
    getListOfTerms(filter) {
        const result = [];
        result.push(...Object.keys(this.graph.classes));
        result.push(...Object.keys(this.graph.enumerations));
        result.push(...Object.keys(this.graph.properties));
        result.push(...Object.keys(this.graph.dataTypes));
        result.push(...Object.keys(this.graph.enumerationMembers));
        return (0, reasoning_1.applyFilter)({ data: result, filter, graph: this.graph });
    }
    getClass(id, filter) {
        return this.graph.getClass(id, filter);
    }
    getAllClasses(filter) {
        const result = [];
        const classesIRIList = this.getListOfClasses(filter);
        for (const c of classesIRIList) {
            result.push(this.getClass(c));
        }
        return result;
    }
    getListOfClasses(filter) {
        return (0, reasoning_1.applyFilter)({
            data: Object.keys(this.graph.classes),
            filter,
            graph: this.graph,
        });
    }
    getProperty(id, filter) {
        return this.graph.getProperty(id, filter);
    }
    getAllProperties(filter) {
        const result = [];
        const propertiesIRIList = this.getListOfProperties(filter);
        for (const p of propertiesIRIList) {
            result.push(this.getProperty(p));
        }
        return result;
    }
    getListOfProperties(filter) {
        return (0, reasoning_1.applyFilter)({
            data: Object.keys(this.graph.properties),
            filter,
            graph: this.graph,
        });
    }
    getDataType(id, filter) {
        return this.graph.getDataType(id, filter);
    }
    getAllDataTypes(filter) {
        const result = [];
        const dataTypesIRIList = this.getListOfDataTypes(filter);
        for (const dt of dataTypesIRIList) {
            result.push(this.getDataType(dt));
        }
        return result;
    }
    getListOfDataTypes(filter) {
        return (0, reasoning_1.applyFilter)({
            data: Object.keys(this.graph.dataTypes),
            filter,
            graph: this.graph,
        });
    }
    getEnumeration(id, filter) {
        return this.graph.getEnumeration(id, filter);
    }
    getAllEnumerations(filter) {
        const result = [];
        const enumerationsIRIList = this.getListOfEnumerations(filter);
        for (const en of enumerationsIRIList) {
            result.push(this.getEnumeration(en));
        }
        return result;
    }
    getListOfEnumerations(filter) {
        return (0, reasoning_1.applyFilter)({
            data: Object.keys(this.graph.enumerations),
            filter,
            graph: this.graph,
        });
    }
    getEnumerationMember(id, filter) {
        return this.graph.getEnumerationMember(id, filter);
    }
    getAllEnumerationMembers(filter) {
        const result = [];
        const enumerationMembersIRIList = this.getListOfEnumerationMembers(filter);
        for (const enm of enumerationMembersIRIList) {
            result.push(this.getEnumerationMember(enm));
        }
        return result;
    }
    getListOfEnumerationMembers(filter) {
        return (0, reasoning_1.applyFilter)({
            data: Object.keys(this.graph.enumerationMembers),
            filter,
            graph: this.graph,
        });
    }
    getVocabularies() {
        const vocabKeys = Object.keys(this.graph.context);
        const result = {};
        const blacklist = ["soa", "xsd", "rdf", "rdfa", "rdfs", "dc"];
        vocabKeys.forEach((el) => {
            if ((0, utilities_1.isString)(this.graph.context[el]) && !blacklist.includes(el)) {
                result[el] = this.graph.context[el];
            }
        });
        return result;
    }
    getLatestSchemaVersion() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, utilities_1.getLatestSchemaVersion)(this.commit);
        });
    }
    constructURLSchemaVocabulary(version = "latest") {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, utilities_1.constructURLSchemaVocabulary)(version, this.schemaHttps, this.commit);
        });
    }
}
exports.SDOAdapter = SDOAdapter;

},{"./Graph":5,"./reasoning":13,"./utilities":14,"axios":15}],9:[function(_dereq_,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Term = void 0;
const utilities_1 = _dereq_("./utilities");
const namespaces_1 = _dereq_("./namespaces");
class Term {
    constructor(IRI, graph) {
        this.IRI = IRI;
        this.graph = graph;
    }
    getIRI(compactForm = false) {
        if (compactForm) {
            return this.IRI;
        }
        return (0, utilities_1.toAbsoluteIRI)(this.IRI, this.graph.context);
    }
    getTermTypeLabel() {
        return this.termTypeLabel;
    }
    getTermTypeIRI() {
        return this.termTypeIRI;
    }
    getVocabURLs() {
        const termObj = this.getTermObj();
        if (!(0, utilities_1.isNil)(termObj["vocabURLs"])) {
            return termObj["vocabURLs"];
        }
        return null;
    }
    getVocabulary() {
        const termObj = this.getTermObj();
        if (!(0, utilities_1.isNil)(termObj[namespaces_1.SCHEMA.isPartOf])) {
            return termObj[namespaces_1.SCHEMA.isPartOf];
        }
        return null;
    }
    getSource() {
        const termObj = this.getTermObj();
        if (!(0, utilities_1.isNil)(termObj[namespaces_1.DC.source])) {
            return termObj[namespaces_1.DC.source];
        }
        else if (!(0, utilities_1.isNil)(termObj[namespaces_1.SCHEMA.source])) {
            return termObj[namespaces_1.SCHEMA.source];
        }
        return null;
    }
    isSupersededBy() {
        const termObj = this.getTermObj();
        if ((0, utilities_1.isString)(termObj[namespaces_1.SCHEMA.supersededBy])) {
            return termObj[namespaces_1.SCHEMA.supersededBy];
        }
        return null;
    }
    getName(language = "en") {
        const termObj = this.getTermObj()[namespaces_1.RDFS.label];
        if ((0, utilities_1.isNil)(termObj) || (0, utilities_1.isNil)(termObj[language])) {
            return null;
        }
        return termObj[language];
    }
    getDescription(language = "en") {
        const termObj = this.getTermObj()[namespaces_1.RDFS.comment];
        if ((0, utilities_1.isNil)(termObj) || (0, utilities_1.isNil)(termObj[language])) {
            return null;
        }
        return termObj[language];
    }
    toString() {
        return JSON.stringify(this.toJSON(), null, 2);
    }
    toJSON() {
        return {
            id: this.getIRI(true),
            IRI: this.getIRI(),
            typeLabel: this.getTermTypeLabel(),
            typeIRI: this.getTermTypeIRI(),
            vocabURLs: this.getVocabURLs(),
            vocabulary: this.getVocabulary(),
            source: this.getSource(),
            supersededBy: this.isSupersededBy(),
            name: this.getName(),
            description: this.getDescription(),
        };
    }
}
exports.Term = Term;

},{"./namespaces":12,"./utilities":14}],10:[function(_dereq_,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStandardContext = exports.checkIfNamespaceFromListIsUsed = exports.discoverEquateNamespaces = exports.discoverUsedSchemaOrgProtocol = exports.preProcessVocab = exports.generateContext = exports.curateVocabNode = void 0;
const namespaces_1 = _dereq_("./namespaces");
const utilities_1 = _dereq_("./utilities");
const jsonld_1 = __importDefault(_dereq_("jsonld"));
function curateLanguageTerm(vocabNode, term) {
    if (vocabNode[term] !== undefined) {
        if ((0, utilities_1.isString)(vocabNode[term])) {
            vocabNode[term] = {
                en: vocabNode[term],
            };
        }
        else if ((0, utilities_1.isLanguageObjectVocab)(vocabNode[term])) {
            vocabNode[term] = {
                [vocabNode[term]["@language"]]: vocabNode[term]["@value"],
            };
        }
        else if ((0, utilities_1.isArray)(vocabNode[term])) {
            const newVal = {};
            vocabNode[term].map((el) => {
                if ((0, utilities_1.isLanguageObjectVocab)(el)) {
                    newVal[el["@language"]] = el["@value"];
                }
            });
            vocabNode[term] = newVal;
        }
    }
    else {
        vocabNode[term] = {};
    }
}
function curateRelationshipTermArray(vocabNode, term, initDefaultIf) {
    if ((0, utilities_1.isString)(vocabNode[term])) {
        vocabNode[term] = [vocabNode[term]];
    }
    else if (vocabNode[term] === undefined &&
        vocabNode["@type"] === initDefaultIf) {
        vocabNode[term] = [];
    }
}
function curateVocabNode(vocabNode, vocabularies) {
    curateLanguageTerm(vocabNode, namespaces_1.RDFS.comment);
    curateLanguageTerm(vocabNode, namespaces_1.RDFS.label);
    curateRelationshipTermArray(vocabNode, namespaces_1.RDFS.subClassOf, namespaces_1.TermTypeIRI.class);
    curateRelationshipTermArray(vocabNode, namespaces_1.RDFS.subPropertyOf, namespaces_1.TermTypeIRI.property);
    curateRelationshipTermArray(vocabNode, namespaces_1.SCHEMA.domainIncludes, namespaces_1.TermTypeIRI.property);
    curateRelationshipTermArray(vocabNode, namespaces_1.SCHEMA.rangeIncludes, namespaces_1.TermTypeIRI.property);
    if (vocabNode[namespaces_1.SCHEMA.inverseOf] === undefined &&
        vocabNode["@type"] === namespaces_1.TermTypeIRI.property) {
        vocabNode[namespaces_1.SCHEMA.inverseOf] = null;
    }
    if (!(0, utilities_1.isString)(vocabNode[namespaces_1.SCHEMA.isPartOf])) {
        const vocabKeys = Object.keys(vocabularies);
        let vocab = vocabKeys.find((el) => vocabNode["@id"].substring(0, vocabNode["@id"].indexOf(":")) === el);
        if ((0, utilities_1.isString)(vocab)) {
            vocab = vocabularies[vocab];
            let newChange;
            do {
                newChange = false;
                if (vocab.endsWith("/") || vocab.endsWith("#")) {
                    vocab = vocab.substring(0, vocab.length - 1);
                    newChange = true;
                }
            } while (newChange);
            vocabNode[namespaces_1.SCHEMA.isPartOf] = vocab;
        }
    }
    return vocabNode;
}
exports.curateVocabNode = curateVocabNode;
function generateContext(currentContext, newContext) {
    const keysCurrentContext = Object.keys(currentContext);
    const keysNewContext = Object.keys(newContext);
    let resultContext = (0, utilities_1.cloneJson)(currentContext);
    for (const keyNC of keysNewContext) {
        if ((0, utilities_1.isString)(newContext[keyNC])) {
            let foundMatch = false;
            for (const keyCC of keysCurrentContext) {
                if ((0, utilities_1.isString)(resultContext[keyCC])) {
                    if (resultContext[keyCC] === newContext[keyNC]) {
                        foundMatch = true;
                        break;
                    }
                }
            }
            if (foundMatch) {
                continue;
            }
            if (!resultContext[keyNC]) {
                resultContext[keyNC] = newContext[keyNC];
            }
            else {
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
    const ordered = {};
    Object.keys(resultContext)
        .sort()
        .forEach(function (key) {
        ordered[key] = resultContext[key];
    });
    resultContext = ordered;
    const keysResultContext = Object.keys(resultContext);
    const orderedResultContext = {};
    for (const keyRC of keysResultContext) {
        if ((0, utilities_1.isString)(resultContext[keyRC])) {
            orderedResultContext[keyRC] = resultContext[keyRC];
        }
    }
    for (const keyRC of keysResultContext) {
        if ((0, utilities_1.isObject)(resultContext[keyRC])) {
            orderedResultContext[keyRC] = resultContext[keyRC];
        }
    }
    return orderedResultContext;
}
exports.generateContext = generateContext;
function preProcessVocab(vocab, newContext) {
    return __awaiter(this, void 0, void 0, function* () {
        let foundInnerGraph = false;
        do {
            const newGraph = [];
            foundInnerGraph = false;
            for (let i = 0; i < vocab["@graph"].length; i++) {
                if (vocab["@graph"][i]["@graph"] !== undefined) {
                    newGraph.push(...(0, utilities_1.cloneJson)(vocab["@graph"][i]["@graph"]));
                    foundInnerGraph = true;
                }
                else {
                    newGraph.push((0, utilities_1.cloneJson)(vocab["@graph"][i]));
                }
            }
            vocab["@graph"] = (0, utilities_1.cloneJson)(newGraph);
        } while (foundInnerGraph);
        const compactedVocab = yield jsonld_1.default.compact(vocab, newContext);
        if (compactedVocab["@graph"] === undefined) {
            delete compactedVocab["@context"];
            return {
                "@context": newContext,
                "@graph": [compactedVocab],
            };
        }
        else {
            return compactedVocab;
        }
    });
}
exports.preProcessVocab = preProcessVocab;
function discoverUsedSchemaOrgProtocol(vocabulary) {
    const httpsIRI = "https://schema.org/";
    const httpIRI = "http://schema.org/";
    if (vocabulary["@context"]) {
        for (const contextEntry of Object.values(vocabulary["@context"])) {
            if ((0, utilities_1.isObject)(contextEntry) && contextEntry["@vocab"]) {
                if (contextEntry["@vocab"] === httpsIRI) {
                    return "https";
                }
                else if (contextEntry["@vocab"] === httpIRI) {
                    return "http";
                }
            }
            else if ((0, utilities_1.isString)(contextEntry)) {
                if (contextEntry === httpsIRI) {
                    return "https";
                }
                else if (contextEntry === httpIRI) {
                    return "http";
                }
            }
        }
    }
    const stringifiedVocab = JSON.stringify(vocabulary);
    const amountHttps = stringifiedVocab.split(httpsIRI).length - 1;
    const amountHttp = stringifiedVocab.split(httpIRI).length - 1;
    if (amountHttps > amountHttp) {
        return "https";
    }
    else if (amountHttp > amountHttps) {
        return "http";
    }
    else {
        return httpsIRI;
    }
}
exports.discoverUsedSchemaOrgProtocol = discoverUsedSchemaOrgProtocol;
function discoverEquateNamespaces(currentContext, vocabulary) {
    const result = new Set();
    const protocolSwitchedNamespaces = [];
    Object.values(currentContext).forEach(function (el) {
        if ((0, utilities_1.isString)(el)) {
            protocolSwitchedNamespaces.push((0, utilities_1.switchIRIProtocol)(el));
        }
    });
    if (vocabulary["@context"]) {
        Object.values(vocabulary["@context"]).forEach(function (el) {
            if ((0, utilities_1.isString)(el) && protocolSwitchedNamespaces.includes(el)) {
                result.add(el);
            }
        });
    }
    if (Array.isArray(vocabulary["@graph"])) {
        vocabulary["@graph"].forEach(function (vocabNode) {
            checkIfNamespaceFromListIsUsed(vocabNode["@id"], protocolSwitchedNamespaces, result);
            checkIfNamespaceFromListIsUsed(vocabNode["@type"], protocolSwitchedNamespaces, result);
            checkIfNamespaceFromListIsUsed(vocabNode[namespaces_1.RDFS.subClassOf], protocolSwitchedNamespaces, result);
            checkIfNamespaceFromListIsUsed(vocabNode["http://www.w3.org/2000/01/rdf-schema#subClassOf"], protocolSwitchedNamespaces, result);
            checkIfNamespaceFromListIsUsed(vocabNode[namespaces_1.SCHEMA.domainIncludes], protocolSwitchedNamespaces, result);
            checkIfNamespaceFromListIsUsed(vocabNode["http://schema.org/domainIncludes"], protocolSwitchedNamespaces, result);
            checkIfNamespaceFromListIsUsed(vocabNode["https://schema.org/domainIncludes"], protocolSwitchedNamespaces, result);
            checkIfNamespaceFromListIsUsed(vocabNode[namespaces_1.SCHEMA.rangeIncludes], protocolSwitchedNamespaces, result);
            checkIfNamespaceFromListIsUsed(vocabNode["http://schema.org/rangeIncludes"], protocolSwitchedNamespaces, result);
            checkIfNamespaceFromListIsUsed(vocabNode["https://schema.org/rangeIncludes"], protocolSwitchedNamespaces, result);
            checkIfNamespaceFromListIsUsed(vocabNode[namespaces_1.RDFS.subPropertyOf], protocolSwitchedNamespaces, result);
            checkIfNamespaceFromListIsUsed(vocabNode["http://www.w3.org/2000/01/rdf-schema#subPropertyOf"], protocolSwitchedNamespaces, result);
            checkIfNamespaceFromListIsUsed(vocabNode[namespaces_1.SCHEMA.inverseOf], protocolSwitchedNamespaces, result);
            checkIfNamespaceFromListIsUsed(vocabNode["http://schema.org/inverseOf"], protocolSwitchedNamespaces, result);
            checkIfNamespaceFromListIsUsed(vocabNode["https://schema.org/inverseOf"], protocolSwitchedNamespaces, result);
        });
    }
    return Array.from(result);
}
exports.discoverEquateNamespaces = discoverEquateNamespaces;
function checkIfNamespaceFromListIsUsed(value, namespaceArray, result) {
    if (Array.isArray(value)) {
        value.forEach(function (val) {
            checkIfNamespaceFromListIsUsed(val, namespaceArray, result);
        });
    }
    else {
        let toCheck;
        if ((0, utilities_1.isObject)(value) && (0, utilities_1.isString)(value["@id"])) {
            toCheck = value["@id"];
        }
        else {
            toCheck = value;
        }
        if ((0, utilities_1.isString)(toCheck) && toCheck.startsWith("http")) {
            const match = namespaceArray.find((el) => toCheck.startsWith(el));
            if (match && !result.has(match)) {
                result.add(match);
            }
        }
    }
}
exports.checkIfNamespaceFromListIsUsed = checkIfNamespaceFromListIsUsed;
function getStandardContext() {
    const standardContext = {
        rdf: namespaces_1.NsUrl.rdf,
        rdfs: namespaces_1.NsUrl.rdfs,
        xsd: namespaces_1.NsUrl.xsd,
        dc: namespaces_1.NsUrl.dc,
        soa: namespaces_1.NsUrl.soa,
    };
    const idEntries = [
        namespaces_1.SOA.superClassOf,
        namespaces_1.SOA.superPropertyOf,
        namespaces_1.SOA.hasProperty,
        namespaces_1.SOA.isRangeOf,
        namespaces_1.SOA.hasEnumerationMember,
        namespaces_1.SOA.enumerationDomainIncludes,
        namespaces_1.RDFS.subClassOf,
        namespaces_1.RDFS.subPropertyOf,
        namespaces_1.SCHEMA.isPartOf,
        namespaces_1.SCHEMA.domainIncludes,
        namespaces_1.SCHEMA.rangeIncludes,
        namespaces_1.SCHEMA.supersededBy,
        namespaces_1.SCHEMA.inverseOf,
        namespaces_1.SCHEMA.source,
        namespaces_1.DC.source,
    ];
    idEntries.map((el) => {
        standardContext[el] = {
            "@id": el,
            "@type": "@id",
        };
    });
    return standardContext;
}
exports.getStandardContext = getStandardContext;

},{"./namespaces":12,"./utilities":14,"jsonld":61}],11:[function(_dereq_,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.constructURLSchemaVocabulary = exports.getLatestSchemaVersion = exports.fetchSchemaVersions = exports.create = void 0;
const SDOAdapter_1 = _dereq_("./SDOAdapter");
const utilities_1 = _dereq_("./utilities");
function create(paramObj) {
    return __awaiter(this, void 0, void 0, function* () {
        const newInstance = new SDOAdapter_1.SDOAdapter(paramObj);
        if (paramObj && paramObj.schemaVersion) {
            const schemaUrl = yield (0, utilities_1.constructURLSchemaVocabulary)(paramObj.schemaVersion, paramObj.schemaHttps, paramObj.commit);
            yield newInstance.addVocabularies(schemaUrl);
        }
        if (paramObj && paramObj.vocabularies) {
            yield newInstance.addVocabularies(paramObj.vocabularies);
        }
        return newInstance;
    });
}
exports.create = create;
var utilities_2 = _dereq_("./utilities");
Object.defineProperty(exports, "fetchSchemaVersions", { enumerable: true, get: function () { return utilities_2.fetchSchemaVersions; } });
Object.defineProperty(exports, "getLatestSchemaVersion", { enumerable: true, get: function () { return utilities_2.getLatestSchemaVersion; } });
Object.defineProperty(exports, "constructURLSchemaVocabulary", { enumerable: true, get: function () { return utilities_2.constructURLSchemaVocabulary; } });

},{"./SDOAdapter":8,"./utilities":14}],12:[function(_dereq_,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TermTypeIRI = exports.TermTypeLabel = exports.XSD = exports.DC = exports.SCHEMA = exports.SOA = exports.RDFS = exports.RDF = exports.NsPre = exports.NsUrl = void 0;
exports.NsUrl = {
    xsd: "http://www.w3.org/2001/XMLSchema#",
    rdf: "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
    rdfs: "http://www.w3.org/2000/01/rdf-schema#",
    schema: "https://schema.org/",
    dc: "http://purl.org/dc/terms/",
    soa: "http://schema-org-adapter.at/vocabTerms/",
};
exports.NsPre = {
    xsd: "xsd",
    rdf: "rdf",
    rdfs: "rdfs",
    schema: "schema",
    dc: "dc",
    soa: "soa",
};
function toCompactUri(prefix, properties) {
    return Object.freeze(Object.fromEntries(properties.map((p) => [p, prefix + ":" + p])));
}
exports.RDF = toCompactUri(exports.NsPre.rdf, ["Property"]);
exports.RDFS = toCompactUri("rdfs", [
    "Class",
    "subClassOf",
    "subPropertyOf",
    "label",
    "comment",
]);
exports.SOA = toCompactUri("soa", [
    "EnumerationMember",
    "superClassOf",
    "superPropertyOf",
    "hasProperty",
    "isRangeOf",
    "hasEnumerationMember",
    "enumerationDomainIncludes",
]);
exports.SCHEMA = toCompactUri("schema", [
    "DataType",
    "Enumeration",
    "isPartOf",
    "domainIncludes",
    "rangeIncludes",
    "supersededBy",
    "inverseOf",
    "source",
    "category",
]);
exports.DC = toCompactUri("dc", ["source"]);
exports.XSD = toCompactUri("xsd", [
    "string",
    "decimal",
    "integer",
    "float",
    "double",
    "boolean",
    "date",
    "time",
    "dateTime",
    "anyURI",
]);
exports.TermTypeLabel = {
    class: "Class",
    property: "Property",
    enumeration: "Enumeration",
    enumerationMember: "EnumerationMember",
    dataType: "DataType",
};
exports.TermTypeIRI = {
    class: "rdfs:Class",
    property: "rdf:Property",
    enumeration: "schema:Enumeration",
    enumerationMember: "soa:EnumerationMember",
    dataType: "schema:DataType",
};

},{}],13:[function(_dereq_,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inferRangeOf = exports.inferSubProperties = exports.inferSuperProperties = exports.inferSubDataTypes = exports.inferSuperDataTypes = exports.inferSubClasses = exports.inferSuperClasses = exports.inferPropertiesFromSuperClasses = exports.applyFilter = void 0;
const utilities_1 = _dereq_("./utilities");
const namespaces_1 = _dereq_("./namespaces");
function applyFilter(paramObj) {
    const { data, filter, graph } = paramObj;
    if (!Array.isArray(data) ||
        data.length === 0 ||
        !filter ||
        Object.keys(filter).length === 0) {
        return data;
    }
    const unifiedDataArray = (0, utilities_1.uniquifyArray)(data);
    const result = [];
    const context = graph.context;
    let namespaces;
    if (filter.fromVocabulary) {
        namespaces = (0, utilities_1.toArray)(filter.fromVocabulary);
        for (let v = 0; v < namespaces.length; v++) {
            for (let vi = 0; vi < Object.keys(context).length; vi++) {
                if (context[Object.keys(context)[vi]] === namespaces[v]) {
                    namespaces[v] = Object.keys(context)[vi];
                    break;
                }
            }
        }
    }
    for (let i = 0; i < unifiedDataArray.length; i++) {
        const actualTerm = graph.getTerm(unifiedDataArray[i]);
        if (!actualTerm) {
            continue;
        }
        if (filter.isSuperseded !== undefined) {
            if (!filter.isSuperseded && actualTerm.isSupersededBy() != null) {
                continue;
            }
            else if (filter.isSuperseded && actualTerm.isSupersededBy() == null) {
                continue;
            }
        }
        if (namespaces) {
            let matchFound = false;
            for (let v = 0; v < namespaces.length; v++) {
                if (actualTerm.getIRI(true).startsWith(namespaces[v])) {
                    matchFound = true;
                    break;
                }
            }
            if (!matchFound) {
                continue;
            }
        }
        if (filter.termType) {
            const toCheck = (0, utilities_1.toArray)(filter.termType);
            const invalidTermType = toCheck.find((el) => !Object.values(namespaces_1.TermTypeLabel).includes(el));
            if (invalidTermType) {
                throw new Error("Invalid filter.termType " + invalidTermType);
            }
            const foundMatch = toCheck.find((el) => el === actualTerm.getTermTypeLabel());
            if (!foundMatch) {
                continue;
            }
        }
        result.push(unifiedDataArray[i]);
    }
    return result;
}
exports.applyFilter = applyFilter;
function inferPropertiesFromSuperClasses(superClasses, graph) {
    const result = [];
    for (const superClass of superClasses) {
        const superClassObj = graph.classes[superClass] || graph.enumerations[superClass];
        if (superClassObj) {
            result.push(...superClassObj[namespaces_1.SOA.hasProperty]);
            if (superClassObj[namespaces_1.RDFS.subClassOf].length !== 0) {
                result.push(...inferPropertiesFromSuperClasses(superClassObj[namespaces_1.RDFS.subClassOf], graph));
            }
        }
    }
    return (0, utilities_1.uniquifyArray)(result);
}
exports.inferPropertiesFromSuperClasses = inferPropertiesFromSuperClasses;
function inferSuperClasses(classIRI, graph) {
    let result = [];
    const classObj = graph.classes[classIRI] || graph.enumerations[classIRI];
    if (classObj) {
        result.push(...classObj[namespaces_1.RDFS.subClassOf]);
        let addition = (0, utilities_1.cloneJson)(result);
        do {
            let newAddition = [];
            for (const curAdd of addition) {
                const parentClassObj = graph.classes[curAdd] || graph.enumerations[curAdd];
                if (parentClassObj) {
                    newAddition.push(...parentClassObj[namespaces_1.RDFS.subClassOf]);
                }
            }
            newAddition = (0, utilities_1.uniquifyArray)(newAddition);
            addition = (0, utilities_1.cloneJson)(newAddition);
            result.push(...newAddition);
        } while (addition.length !== 0);
        result = (0, utilities_1.uniquifyArray)(result);
    }
    return result;
}
exports.inferSuperClasses = inferSuperClasses;
function inferSubClasses(classIRI, graph) {
    let result = [];
    const classObj = graph.classes[classIRI] || graph.enumerations[classIRI];
    if (classObj) {
        result.push(...classObj[namespaces_1.SOA.superClassOf]);
        let addition = (0, utilities_1.cloneJson)(result);
        do {
            let newAddition = [];
            for (const curAdd of addition) {
                const parentClassObj = graph.classes[curAdd] || graph.enumerations[curAdd];
                if (parentClassObj) {
                    newAddition.push(...parentClassObj[namespaces_1.SOA.superClassOf]);
                }
            }
            newAddition = (0, utilities_1.uniquifyArray)(newAddition);
            addition = (0, utilities_1.cloneJson)(newAddition);
            result.push(...newAddition);
        } while (addition.length !== 0);
        result = (0, utilities_1.uniquifyArray)(result);
    }
    return result;
}
exports.inferSubClasses = inferSubClasses;
function inferSuperDataTypes(dataTypeIRI, graph) {
    let result = [];
    const dataTypeObj = graph.dataTypes[dataTypeIRI];
    if (dataTypeObj) {
        result.push(...dataTypeObj[namespaces_1.RDFS.subClassOf]);
        let addition = (0, utilities_1.cloneJson)(result);
        do {
            let newAddition = [];
            for (const curAdd of addition) {
                const parentDataTypeObj = graph.dataTypes[curAdd];
                if (parentDataTypeObj) {
                    newAddition.push(...parentDataTypeObj[namespaces_1.RDFS.subClassOf]);
                }
            }
            newAddition = (0, utilities_1.uniquifyArray)(newAddition);
            addition = (0, utilities_1.cloneJson)(newAddition);
            result.push(...newAddition);
        } while (addition.length !== 0);
        result = (0, utilities_1.uniquifyArray)(result);
    }
    return result;
}
exports.inferSuperDataTypes = inferSuperDataTypes;
function inferSubDataTypes(dataTypeIRI, graph) {
    let result = [];
    const dataTypeObj = graph.dataTypes[dataTypeIRI];
    if (dataTypeObj) {
        result.push(...dataTypeObj[namespaces_1.SOA.superClassOf]);
        let addition = (0, utilities_1.cloneJson)(result);
        do {
            let newAddition = [];
            for (const curAdd of addition) {
                const childDataTypeObj = graph.dataTypes[curAdd];
                if (childDataTypeObj) {
                    newAddition.push(...childDataTypeObj[namespaces_1.SOA.superClassOf]);
                }
            }
            newAddition = (0, utilities_1.uniquifyArray)(newAddition);
            addition = (0, utilities_1.cloneJson)(newAddition);
            result.push(...newAddition);
        } while (addition.length !== 0);
        result = (0, utilities_1.uniquifyArray)(result);
    }
    return result;
}
exports.inferSubDataTypes = inferSubDataTypes;
function inferSuperProperties(propertyIRI, graph) {
    let result = [];
    const propertyObj = graph.properties[propertyIRI];
    if (propertyObj) {
        result.push(...propertyObj[namespaces_1.RDFS.subPropertyOf]);
        let addition = (0, utilities_1.cloneJson)(result);
        do {
            let newAddition = [];
            for (const curAdd of addition) {
                const parentPropertyObj = graph.properties[curAdd];
                if (parentPropertyObj) {
                    newAddition.push(...parentPropertyObj[namespaces_1.RDFS.subPropertyOf]);
                }
            }
            newAddition = (0, utilities_1.uniquifyArray)(newAddition);
            addition = (0, utilities_1.cloneJson)(newAddition);
            result.push(...newAddition);
        } while (addition.length !== 0);
        result = (0, utilities_1.uniquifyArray)(result);
    }
    return result;
}
exports.inferSuperProperties = inferSuperProperties;
function inferSubProperties(propertyIRI, graph) {
    let result = [];
    const propertyObj = graph.properties[propertyIRI];
    if (propertyObj) {
        result.push(...propertyObj[namespaces_1.SOA.superPropertyOf]);
        let addition = (0, utilities_1.cloneJson)(result);
        do {
            let newAddition = [];
            for (const curAdd of addition) {
                const parentPropertyObj = graph.properties[curAdd];
                if (parentPropertyObj) {
                    newAddition.push(...parentPropertyObj[namespaces_1.SOA.superPropertyOf]);
                }
            }
            newAddition = (0, utilities_1.uniquifyArray)(newAddition);
            addition = (0, utilities_1.cloneJson)(newAddition);
            result.push(...newAddition);
        } while (addition.length !== 0);
        result = (0, utilities_1.uniquifyArray)(result);
    }
    return result;
}
exports.inferSubProperties = inferSubProperties;
function inferRangeOf(rangeIRI, graph) {
    const classObj = graph.classes[rangeIRI] || graph.enumerations[rangeIRI];
    const result = [];
    if (classObj) {
        result.push(...classObj[namespaces_1.SOA.isRangeOf]);
        const superClasses = inferSuperClasses(rangeIRI, graph);
        for (const superClass of superClasses) {
            const superClassObj = graph.classes[superClass] || graph.enumerations[superClass];
            if (superClassObj) {
                result.push(...superClassObj[namespaces_1.SOA.isRangeOf]);
            }
        }
    }
    else {
        const dataTypeObj = graph.dataTypes[rangeIRI];
        if (dataTypeObj) {
            result.push(...dataTypeObj[namespaces_1.SOA.isRangeOf]);
            const superDataTypes = inferSuperDataTypes(rangeIRI, graph);
            for (const superDataType of superDataTypes) {
                const superDataTypeObj = graph.dataTypes[superDataType];
                if (superDataTypeObj) {
                    result.push(...superDataTypeObj[namespaces_1.SOA.isRangeOf]);
                }
            }
        }
    }
    return (0, utilities_1.uniquifyArray)(result);
}
exports.inferRangeOf = inferRangeOf;

},{"./namespaces":12,"./utilities":14}],14:[function(_dereq_,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLatestSchemaVersion = exports.checkURL = exports.fetchSchemaVersions = exports.constructURLSchemaVocabulary = exports.getURLSchemaVersions = exports.getURLBaseSchema = exports.toArray = exports.switchIRIProtocol = exports.getFileNameForSchemaOrgVersion = exports.sortReleaseEntriesByDate = exports.toAbsoluteIRI = exports.toCompactIRI = exports.uniquifyArray = exports.isArray = exports.isString = exports.isNil = exports.isLanguageObjectVocab = exports.isObject = exports.cloneJson = void 0;
const axios_1 = __importDefault(_dereq_("axios"));
const RetrievalMemory_1 = _dereq_("./RetrievalMemory");
const myRetrievalMemory = RetrievalMemory_1.RetrievalMemory.getInstance();
function cloneJson(input) {
    if (input === undefined) {
        return input;
    }
    return JSON.parse(JSON.stringify(input));
}
exports.cloneJson = cloneJson;
function isObject(value) {
    if (Array.isArray(value)) {
        return false;
    }
    if (isNil(value)) {
        return false;
    }
    return typeof value === "object";
}
exports.isObject = isObject;
function isLanguageObjectVocab(value) {
    if (isObject(value)) {
        if (isString(value["@language"]) && isString(value["@value"])) {
            return true;
        }
    }
    return false;
}
exports.isLanguageObjectVocab = isLanguageObjectVocab;
function isNil(value) {
    return value === undefined || value === null;
}
exports.isNil = isNil;
function isString(value) {
    if (isNil(value)) {
        return false;
    }
    return typeof value === "string" || value instanceof String;
}
exports.isString = isString;
function isArray(value) {
    return Array.isArray(value);
}
exports.isArray = isArray;
function uniquifyArray(array) {
    return [...new Set(array)];
}
exports.uniquifyArray = uniquifyArray;
function toCompactIRI(absoluteIRI, context, equateVocabularyProtocols = false) {
    for (const contextTerm of Object.keys(context)) {
        const vocabIRI = context[contextTerm];
        if (isString(vocabIRI) && absoluteIRI.startsWith(vocabIRI)) {
            return (contextTerm + ":" + absoluteIRI.substring(vocabIRI.length));
        }
        if (equateVocabularyProtocols && isString(vocabIRI)) {
            const protocolSwitchedIRI = switchIRIProtocol(vocabIRI);
            if (absoluteIRI.startsWith(protocolSwitchedIRI)) {
                return (contextTerm + ":" + absoluteIRI.substring(protocolSwitchedIRI.length));
            }
        }
    }
    throw new Error("Trying to get a compact IRI for a term with no entry in the Context");
}
exports.toCompactIRI = toCompactIRI;
function toAbsoluteIRI(compactIRI, context) {
    const terms = Object.keys(context);
    for (let i = 0; i < terms.length; i++) {
        const vocabIRI = context[terms[i]];
        if (compactIRI.substring(0, compactIRI.indexOf(":")) === terms[i]) {
            return vocabIRI.concat(compactIRI.substring(compactIRI.indexOf(":") + 1));
        }
    }
    throw new Error("Trying to get an absolute IRI for a term with no entry in the Context");
}
exports.toAbsoluteIRI = toAbsoluteIRI;
function sortReleaseEntriesByDate(releaseLog) {
    const versionEntries = Object.entries(releaseLog);
    return versionEntries.sort((a, b) => +new Date(b[1]) - +new Date(a[1]));
}
exports.sortReleaseEntriesByDate = sortReleaseEntriesByDate;
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
            }
            else {
                return "schemaorg-all-http.jsonld";
            }
        default:
            if (schemaHttps) {
                return "schemaorg-all-https.jsonld";
            }
            else {
                return "schemaorg-all-http.jsonld";
            }
    }
}
exports.getFileNameForSchemaOrgVersion = getFileNameForSchemaOrgVersion;
function switchIRIProtocol(IRI) {
    if (IRI.startsWith("https://")) {
        return "http" + IRI.substring(5);
    }
    else if (IRI.startsWith("http://")) {
        return "https" + IRI.substring(4);
    }
    return IRI;
}
exports.switchIRIProtocol = switchIRIProtocol;
const toArray = (o) => (Array.isArray(o) ? o : [o]);
exports.toArray = toArray;
const URI_SEMANTIFY_GITHUB = "https://raw.githubusercontent.com/semantifyit/schemaorg/main";
const URI_SCHEMA_ORG_GITHUB = "https://raw.githubusercontent.com/schemaorg/schemaorg/";
function getURLBaseSchema(commitBase) {
    const path = "/data/releases/";
    if (commitBase) {
        return URI_SCHEMA_ORG_GITHUB + commitBase + path;
    }
    else {
        return URI_SEMANTIFY_GITHUB + path;
    }
}
exports.getURLBaseSchema = getURLBaseSchema;
function getURLSchemaVersions(commitBase) {
    const path = "/versions.json";
    if (commitBase) {
        return URI_SCHEMA_ORG_GITHUB + commitBase + path;
    }
    else {
        return URI_SEMANTIFY_GITHUB + path;
    }
}
exports.getURLSchemaVersions = getURLSchemaVersions;
function constructURLSchemaVocabulary(version = "latest", schemaHttps = true, commit) {
    return __awaiter(this, void 0, void 0, function* () {
        if (version === "latest") {
            version = yield getLatestSchemaVersion(commit);
        }
        const fileName = getFileNameForSchemaOrgVersion(version, schemaHttps);
        return getURLBaseSchema(commit) + version + "/" + fileName;
    });
}
exports.constructURLSchemaVocabulary = constructURLSchemaVocabulary;
function fetchSchemaVersions(cacheClear = false, commit) {
    return __awaiter(this, void 0, void 0, function* () {
        let versionFile;
        if (cacheClear) {
            myRetrievalMemory.deleteCache();
        }
        else {
            const cachedData = myRetrievalMemory.getData("versionsFile", commit);
            if (cachedData) {
                return cachedData;
            }
        }
        const urlSchemaVersions = getURLSchemaVersions(commit);
        try {
            versionFile = yield axios_1.default.get(urlSchemaVersions);
        }
        catch (e) {
            throw new Error("Unable to retrieve the schema.org versions file at " + urlSchemaVersions);
        }
        if (!versionFile || !versionFile.data || !versionFile.data.releaseLog) {
            throw new Error("The schema.org versions file at " +
                urlSchemaVersions +
                " returned an unexpected result.");
        }
        const schemaVersions = versionFile.data;
        myRetrievalMemory.setData("versionsFile", schemaVersions, commit);
        let latestVersion;
        if (schemaVersions.schemaversion &&
            (yield checkURL(yield constructURLSchemaVocabulary(schemaVersions.schemaversion)))) {
            latestVersion = schemaVersions.schemaversion;
        }
        else {
            const sortedArray = sortReleaseEntriesByDate(schemaVersions.releaseLog);
            for (const currVersion of sortedArray) {
                if (yield checkURL(yield constructURLSchemaVocabulary(currVersion[0]))) {
                    latestVersion = currVersion[0];
                    break;
                }
            }
        }
        if (!latestVersion) {
            throw new Error('Could not find any valid vocabulary file in the schema.org versions to be declared as "latest".');
        }
        myRetrievalMemory.setData("latest", latestVersion, commit);
        return schemaVersions;
    });
}
exports.fetchSchemaVersions = fetchSchemaVersions;
function checkURL(url) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield axios_1.default.head(url);
            return true;
        }
        catch (e) {
            return false;
        }
    });
}
exports.checkURL = checkURL;
function getLatestSchemaVersion(commit) {
    return __awaiter(this, void 0, void 0, function* () {
        let latestVersion = myRetrievalMemory.getData("latest", commit);
        if (!latestVersion) {
            yield fetchSchemaVersions(false, commit);
        }
        latestVersion = myRetrievalMemory.getData("latest", commit);
        if (latestVersion) {
            return latestVersion;
        }
        else {
            throw new Error("Could not identify the latest version of the schema.org vocabulary");
        }
    });
}
exports.getLatestSchemaVersion = getLatestSchemaVersion;

},{"./RetrievalMemory":7,"axios":15}],15:[function(_dereq_,module,exports){
module.exports = _dereq_('./lib/axios');
},{"./lib/axios":17}],16:[function(_dereq_,module,exports){
'use strict';

var utils = _dereq_('./../utils');
var settle = _dereq_('./../core/settle');
var cookies = _dereq_('./../helpers/cookies');
var buildURL = _dereq_('./../helpers/buildURL');
var buildFullPath = _dereq_('../core/buildFullPath');
var parseHeaders = _dereq_('./../helpers/parseHeaders');
var isURLSameOrigin = _dereq_('./../helpers/isURLSameOrigin');
var createError = _dereq_('../core/createError');

module.exports = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestData = config.data;
    var requestHeaders = config.headers;
    var responseType = config.responseType;

    if (utils.isFormData(requestData)) {
      delete requestHeaders['Content-Type']; // Let the browser set it
    }

    var request = new XMLHttpRequest();

    // HTTP basic authentication
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : '';
      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
    }

    var fullPath = buildFullPath(config.baseURL, config.url);
    request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);

    // Set the request timeout in MS
    request.timeout = config.timeout;

    function onloadend() {
      if (!request) {
        return;
      }
      // Prepare the response
      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      var responseData = !responseType || responseType === 'text' ||  responseType === 'json' ?
        request.responseText : request.response;
      var response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };

      settle(resolve, reject, response);

      // Clean up request
      request = null;
    }

    if ('onloadend' in request) {
      // Use onloadend if available
      request.onloadend = onloadend;
    } else {
      // Listen for ready state to emulate onloadend
      request.onreadystatechange = function handleLoad() {
        if (!request || request.readyState !== 4) {
          return;
        }

        // The request errored out and we didn't get a response, this will be
        // handled by onerror instead
        // With one exception: request that using file: protocol, most browsers
        // will return status as 0 even though it's a successful request
        if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
          return;
        }
        // readystate handler is calling before onerror or ontimeout handlers,
        // so we should call onloadend on the next 'tick'
        setTimeout(onloadend);
      };
    }

    // Handle browser request cancellation (as opposed to a manual cancellation)
    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }

      reject(createError('Request aborted', config, 'ECONNABORTED', request));

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(createError('Network Error', config, null, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      var timeoutErrorMessage = 'timeout of ' + config.timeout + 'ms exceeded';
      if (config.timeoutErrorMessage) {
        timeoutErrorMessage = config.timeoutErrorMessage;
      }
      reject(createError(
        timeoutErrorMessage,
        config,
        config.transitional && config.transitional.clarifyTimeoutError ? 'ETIMEDOUT' : 'ECONNABORTED',
        request));

      // Clean up request
      request = null;
    };

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.
    if (utils.isStandardBrowserEnv()) {
      // Add xsrf header
      var xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName ?
        cookies.read(config.xsrfCookieName) :
        undefined;

      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    }

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
          // Remove Content-Type if data is undefined
          delete requestHeaders[key];
        } else {
          // Otherwise add header to the request
          request.setRequestHeader(key, val);
        }
      });
    }

    // Add withCredentials to request if needed
    if (!utils.isUndefined(config.withCredentials)) {
      request.withCredentials = !!config.withCredentials;
    }

    // Add responseType to request if needed
    if (responseType && responseType !== 'json') {
      request.responseType = config.responseType;
    }

    // Handle progress if needed
    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', config.onDownloadProgress);
    }

    // Not all browsers support upload events
    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', config.onUploadProgress);
    }

    if (config.cancelToken) {
      // Handle cancellation
      config.cancelToken.promise.then(function onCanceled(cancel) {
        if (!request) {
          return;
        }

        request.abort();
        reject(cancel);
        // Clean up request
        request = null;
      });
    }

    if (!requestData) {
      requestData = null;
    }

    // Send the request
    request.send(requestData);
  });
};

},{"../core/buildFullPath":23,"../core/createError":24,"./../core/settle":28,"./../helpers/buildURL":32,"./../helpers/cookies":34,"./../helpers/isURLSameOrigin":37,"./../helpers/parseHeaders":39,"./../utils":42}],17:[function(_dereq_,module,exports){
'use strict';

var utils = _dereq_('./utils');
var bind = _dereq_('./helpers/bind');
var Axios = _dereq_('./core/Axios');
var mergeConfig = _dereq_('./core/mergeConfig');
var defaults = _dereq_('./defaults');

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  var instance = bind(Axios.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, Axios.prototype, context);

  // Copy context to instance
  utils.extend(instance, context);

  return instance;
}

// Create the default instance to be exported
var axios = createInstance(defaults);

// Expose Axios class to allow class inheritance
axios.Axios = Axios;

// Factory for creating new instances
axios.create = function create(instanceConfig) {
  return createInstance(mergeConfig(axios.defaults, instanceConfig));
};

// Expose Cancel & CancelToken
axios.Cancel = _dereq_('./cancel/Cancel');
axios.CancelToken = _dereq_('./cancel/CancelToken');
axios.isCancel = _dereq_('./cancel/isCancel');

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = _dereq_('./helpers/spread');

// Expose isAxiosError
axios.isAxiosError = _dereq_('./helpers/isAxiosError');

module.exports = axios;

// Allow use of default import syntax in TypeScript
module.exports.default = axios;

},{"./cancel/Cancel":18,"./cancel/CancelToken":19,"./cancel/isCancel":20,"./core/Axios":21,"./core/mergeConfig":27,"./defaults":30,"./helpers/bind":31,"./helpers/isAxiosError":36,"./helpers/spread":40,"./utils":42}],18:[function(_dereq_,module,exports){
'use strict';

/**
 * A `Cancel` is an object that is thrown when an operation is canceled.
 *
 * @class
 * @param {string=} message The message.
 */
function Cancel(message) {
  this.message = message;
}

Cancel.prototype.toString = function toString() {
  return 'Cancel' + (this.message ? ': ' + this.message : '');
};

Cancel.prototype.__CANCEL__ = true;

module.exports = Cancel;

},{}],19:[function(_dereq_,module,exports){
'use strict';

var Cancel = _dereq_('./Cancel');

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @class
 * @param {Function} executor The executor function.
 */
function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  var resolvePromise;
  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });

  var token = this;
  executor(function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }

    token.reason = new Cancel(message);
    resolvePromise(token.reason);
  });
}

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};

/**
 * Returns an object that contains a new `CancelToken` and a function that, when called,
 * cancels the `CancelToken`.
 */
CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};

module.exports = CancelToken;

},{"./Cancel":18}],20:[function(_dereq_,module,exports){
'use strict';

module.exports = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};

},{}],21:[function(_dereq_,module,exports){
'use strict';

var utils = _dereq_('./../utils');
var buildURL = _dereq_('../helpers/buildURL');
var InterceptorManager = _dereq_('./InterceptorManager');
var dispatchRequest = _dereq_('./dispatchRequest');
var mergeConfig = _dereq_('./mergeConfig');
var validator = _dereq_('../helpers/validator');

var validators = validator.validators;
/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 */
function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}

/**
 * Dispatch a request
 *
 * @param {Object} config The config specific for this request (merged with this.defaults)
 */
Axios.prototype.request = function request(config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof config === 'string') {
    config = arguments[1] || {};
    config.url = arguments[0];
  } else {
    config = config || {};
  }

  config = mergeConfig(this.defaults, config);

  // Set config.method
  if (config.method) {
    config.method = config.method.toLowerCase();
  } else if (this.defaults.method) {
    config.method = this.defaults.method.toLowerCase();
  } else {
    config.method = 'get';
  }

  var transitional = config.transitional;

  if (transitional !== undefined) {
    validator.assertOptions(transitional, {
      silentJSONParsing: validators.transitional(validators.boolean, '1.0.0'),
      forcedJSONParsing: validators.transitional(validators.boolean, '1.0.0'),
      clarifyTimeoutError: validators.transitional(validators.boolean, '1.0.0')
    }, false);
  }

  // filter out skipped interceptors
  var requestInterceptorChain = [];
  var synchronousRequestInterceptors = true;
  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    if (typeof interceptor.runWhen === 'function' && interceptor.runWhen(config) === false) {
      return;
    }

    synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;

    requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  var responseInterceptorChain = [];
  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
  });

  var promise;

  if (!synchronousRequestInterceptors) {
    var chain = [dispatchRequest, undefined];

    Array.prototype.unshift.apply(chain, requestInterceptorChain);
    chain = chain.concat(responseInterceptorChain);

    promise = Promise.resolve(config);
    while (chain.length) {
      promise = promise.then(chain.shift(), chain.shift());
    }

    return promise;
  }


  var newConfig = config;
  while (requestInterceptorChain.length) {
    var onFulfilled = requestInterceptorChain.shift();
    var onRejected = requestInterceptorChain.shift();
    try {
      newConfig = onFulfilled(newConfig);
    } catch (error) {
      onRejected(error);
      break;
    }
  }

  try {
    promise = dispatchRequest(newConfig);
  } catch (error) {
    return Promise.reject(error);
  }

  while (responseInterceptorChain.length) {
    promise = promise.then(responseInterceptorChain.shift(), responseInterceptorChain.shift());
  }

  return promise;
};

Axios.prototype.getUri = function getUri(config) {
  config = mergeConfig(this.defaults, config);
  return buildURL(config.url, config.params, config.paramsSerializer).replace(/^\?/, '');
};

// Provide aliases for supported request methods
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request(mergeConfig(config || {}, {
      method: method,
      url: url,
      data: (config || {}).data
    }));
  };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, data, config) {
    return this.request(mergeConfig(config || {}, {
      method: method,
      url: url,
      data: data
    }));
  };
});

module.exports = Axios;

},{"../helpers/buildURL":32,"../helpers/validator":41,"./../utils":42,"./InterceptorManager":22,"./dispatchRequest":25,"./mergeConfig":27}],22:[function(_dereq_,module,exports){
'use strict';

var utils = _dereq_('./../utils');

function InterceptorManager() {
  this.handlers = [];
}

/**
 * Add a new interceptor to the stack
 *
 * @param {Function} fulfilled The function to handle `then` for a `Promise`
 * @param {Function} rejected The function to handle `reject` for a `Promise`
 *
 * @return {Number} An ID used to remove interceptor later
 */
InterceptorManager.prototype.use = function use(fulfilled, rejected, options) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected,
    synchronous: options ? options.synchronous : false,
    runWhen: options ? options.runWhen : null
  });
  return this.handlers.length - 1;
};

/**
 * Remove an interceptor from the stack
 *
 * @param {Number} id The ID that was returned by `use`
 */
InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

/**
 * Iterate over all the registered interceptors
 *
 * This method is particularly useful for skipping over any
 * interceptors that may have become `null` calling `eject`.
 *
 * @param {Function} fn The function to call for each interceptor
 */
InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};

module.exports = InterceptorManager;

},{"./../utils":42}],23:[function(_dereq_,module,exports){
'use strict';

var isAbsoluteURL = _dereq_('../helpers/isAbsoluteURL');
var combineURLs = _dereq_('../helpers/combineURLs');

/**
 * Creates a new URL by combining the baseURL with the requestedURL,
 * only when the requestedURL is not already an absolute URL.
 * If the requestURL is absolute, this function returns the requestedURL untouched.
 *
 * @param {string} baseURL The base URL
 * @param {string} requestedURL Absolute or relative URL to combine
 * @returns {string} The combined full path
 */
module.exports = function buildFullPath(baseURL, requestedURL) {
  if (baseURL && !isAbsoluteURL(requestedURL)) {
    return combineURLs(baseURL, requestedURL);
  }
  return requestedURL;
};

},{"../helpers/combineURLs":33,"../helpers/isAbsoluteURL":35}],24:[function(_dereq_,module,exports){
'use strict';

var enhanceError = _dereq_('./enhanceError');

/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The created error.
 */
module.exports = function createError(message, config, code, request, response) {
  var error = new Error(message);
  return enhanceError(error, config, code, request, response);
};

},{"./enhanceError":26}],25:[function(_dereq_,module,exports){
'use strict';

var utils = _dereq_('./../utils');
var transformData = _dereq_('./transformData');
var isCancel = _dereq_('../cancel/isCancel');
var defaults = _dereq_('../defaults');

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 * @returns {Promise} The Promise to be fulfilled
 */
module.exports = function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  // Ensure headers exist
  config.headers = config.headers || {};

  // Transform request data
  config.data = transformData.call(
    config,
    config.data,
    config.headers,
    config.transformRequest
  );

  // Flatten headers
  config.headers = utils.merge(
    config.headers.common || {},
    config.headers[config.method] || {},
    config.headers
  );

  utils.forEach(
    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
    function cleanHeaderConfig(method) {
      delete config.headers[method];
    }
  );

  var adapter = config.adapter || defaults.adapter;

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData.call(
      config,
      response.data,
      response.headers,
      config.transformResponse
    );

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData.call(
          config,
          reason.response.data,
          reason.response.headers,
          config.transformResponse
        );
      }
    }

    return Promise.reject(reason);
  });
};

},{"../cancel/isCancel":20,"../defaults":30,"./../utils":42,"./transformData":29}],26:[function(_dereq_,module,exports){
'use strict';

/**
 * Update an Error with the specified config, error code, and response.
 *
 * @param {Error} error The error to update.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The error.
 */
module.exports = function enhanceError(error, config, code, request, response) {
  error.config = config;
  if (code) {
    error.code = code;
  }

  error.request = request;
  error.response = response;
  error.isAxiosError = true;

  error.toJSON = function toJSON() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: this.config,
      code: this.code
    };
  };
  return error;
};

},{}],27:[function(_dereq_,module,exports){
'use strict';

var utils = _dereq_('../utils');

/**
 * Config-specific merge-function which creates a new config-object
 * by merging two configuration objects together.
 *
 * @param {Object} config1
 * @param {Object} config2
 * @returns {Object} New object resulting from merging config2 to config1
 */
module.exports = function mergeConfig(config1, config2) {
  // eslint-disable-next-line no-param-reassign
  config2 = config2 || {};
  var config = {};

  var valueFromConfig2Keys = ['url', 'method', 'data'];
  var mergeDeepPropertiesKeys = ['headers', 'auth', 'proxy', 'params'];
  var defaultToConfig2Keys = [
    'baseURL', 'transformRequest', 'transformResponse', 'paramsSerializer',
    'timeout', 'timeoutMessage', 'withCredentials', 'adapter', 'responseType', 'xsrfCookieName',
    'xsrfHeaderName', 'onUploadProgress', 'onDownloadProgress', 'decompress',
    'maxContentLength', 'maxBodyLength', 'maxRedirects', 'transport', 'httpAgent',
    'httpsAgent', 'cancelToken', 'socketPath', 'responseEncoding'
  ];
  var directMergeKeys = ['validateStatus'];

  function getMergedValue(target, source) {
    if (utils.isPlainObject(target) && utils.isPlainObject(source)) {
      return utils.merge(target, source);
    } else if (utils.isPlainObject(source)) {
      return utils.merge({}, source);
    } else if (utils.isArray(source)) {
      return source.slice();
    }
    return source;
  }

  function mergeDeepProperties(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(config1[prop], config2[prop]);
    } else if (!utils.isUndefined(config1[prop])) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  }

  utils.forEach(valueFromConfig2Keys, function valueFromConfig2(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(undefined, config2[prop]);
    }
  });

  utils.forEach(mergeDeepPropertiesKeys, mergeDeepProperties);

  utils.forEach(defaultToConfig2Keys, function defaultToConfig2(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(undefined, config2[prop]);
    } else if (!utils.isUndefined(config1[prop])) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  });

  utils.forEach(directMergeKeys, function merge(prop) {
    if (prop in config2) {
      config[prop] = getMergedValue(config1[prop], config2[prop]);
    } else if (prop in config1) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  });

  var axiosKeys = valueFromConfig2Keys
    .concat(mergeDeepPropertiesKeys)
    .concat(defaultToConfig2Keys)
    .concat(directMergeKeys);

  var otherKeys = Object
    .keys(config1)
    .concat(Object.keys(config2))
    .filter(function filterAxiosKeys(key) {
      return axiosKeys.indexOf(key) === -1;
    });

  utils.forEach(otherKeys, mergeDeepProperties);

  return config;
};

},{"../utils":42}],28:[function(_dereq_,module,exports){
'use strict';

var createError = _dereq_('./createError');

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 */
module.exports = function settle(resolve, reject, response) {
  var validateStatus = response.config.validateStatus;
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(createError(
      'Request failed with status code ' + response.status,
      response.config,
      null,
      response.request,
      response
    ));
  }
};

},{"./createError":24}],29:[function(_dereq_,module,exports){
'use strict';

var utils = _dereq_('./../utils');
var defaults = _dereq_('./../defaults');

/**
 * Transform the data for a request or a response
 *
 * @param {Object|String} data The data to be transformed
 * @param {Array} headers The headers for the request or response
 * @param {Array|Function} fns A single function or Array of functions
 * @returns {*} The resulting transformed data
 */
module.exports = function transformData(data, headers, fns) {
  var context = this || defaults;
  /*eslint no-param-reassign:0*/
  utils.forEach(fns, function transform(fn) {
    data = fn.call(context, data, headers);
  });

  return data;
};

},{"./../defaults":30,"./../utils":42}],30:[function(_dereq_,module,exports){
(function (process){(function (){
'use strict';

var utils = _dereq_('./utils');
var normalizeHeaderName = _dereq_('./helpers/normalizeHeaderName');
var enhanceError = _dereq_('./core/enhanceError');

var DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

function setContentTypeIfUnset(headers, value) {
  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value;
  }
}

function getDefaultAdapter() {
  var adapter;
  if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = _dereq_('./adapters/xhr');
  } else if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
    // For node use HTTP adapter
    adapter = _dereq_('./adapters/http');
  }
  return adapter;
}

function stringifySafely(rawValue, parser, encoder) {
  if (utils.isString(rawValue)) {
    try {
      (parser || JSON.parse)(rawValue);
      return utils.trim(rawValue);
    } catch (e) {
      if (e.name !== 'SyntaxError') {
        throw e;
      }
    }
  }

  return (encoder || JSON.stringify)(rawValue);
}

var defaults = {

  transitional: {
    silentJSONParsing: true,
    forcedJSONParsing: true,
    clarifyTimeoutError: false
  },

  adapter: getDefaultAdapter(),

  transformRequest: [function transformRequest(data, headers) {
    normalizeHeaderName(headers, 'Accept');
    normalizeHeaderName(headers, 'Content-Type');

    if (utils.isFormData(data) ||
      utils.isArrayBuffer(data) ||
      utils.isBuffer(data) ||
      utils.isStream(data) ||
      utils.isFile(data) ||
      utils.isBlob(data)
    ) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
      return data.toString();
    }
    if (utils.isObject(data) || (headers && headers['Content-Type'] === 'application/json')) {
      setContentTypeIfUnset(headers, 'application/json');
      return stringifySafely(data);
    }
    return data;
  }],

  transformResponse: [function transformResponse(data) {
    var transitional = this.transitional;
    var silentJSONParsing = transitional && transitional.silentJSONParsing;
    var forcedJSONParsing = transitional && transitional.forcedJSONParsing;
    var strictJSONParsing = !silentJSONParsing && this.responseType === 'json';

    if (strictJSONParsing || (forcedJSONParsing && utils.isString(data) && data.length)) {
      try {
        return JSON.parse(data);
      } catch (e) {
        if (strictJSONParsing) {
          if (e.name === 'SyntaxError') {
            throw enhanceError(e, this, 'E_JSON_PARSE');
          }
          throw e;
        }
      }
    }

    return data;
  }],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,
  maxBodyLength: -1,

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  }
};

defaults.headers = {
  common: {
    'Accept': 'application/json, text/plain, */*'
  }
};

utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults.headers[method] = {};
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});

module.exports = defaults;

}).call(this)}).call(this,_dereq_('_process'))
},{"./adapters/http":16,"./adapters/xhr":16,"./core/enhanceError":26,"./helpers/normalizeHeaderName":38,"./utils":42,"_process":69}],31:[function(_dereq_,module,exports){
'use strict';

module.exports = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};

},{}],32:[function(_dereq_,module,exports){
'use strict';

var utils = _dereq_('./../utils');

function encode(val) {
  return encodeURIComponent(val).
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */
module.exports = function buildURL(url, params, paramsSerializer) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }

  var serializedParams;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (utils.isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    var parts = [];

    utils.forEach(params, function serialize(val, key) {
      if (val === null || typeof val === 'undefined') {
        return;
      }

      if (utils.isArray(val)) {
        key = key + '[]';
      } else {
        val = [val];
      }

      utils.forEach(val, function parseValue(v) {
        if (utils.isDate(v)) {
          v = v.toISOString();
        } else if (utils.isObject(v)) {
          v = JSON.stringify(v);
        }
        parts.push(encode(key) + '=' + encode(v));
      });
    });

    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    var hashmarkIndex = url.indexOf('#');
    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }

    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
};

},{"./../utils":42}],33:[function(_dereq_,module,exports){
'use strict';

/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */
module.exports = function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
};

},{}],34:[function(_dereq_,module,exports){
'use strict';

var utils = _dereq_('./../utils');

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs support document.cookie
    (function standardBrowserEnv() {
      return {
        write: function write(name, value, expires, path, domain, secure) {
          var cookie = [];
          cookie.push(name + '=' + encodeURIComponent(value));

          if (utils.isNumber(expires)) {
            cookie.push('expires=' + new Date(expires).toGMTString());
          }

          if (utils.isString(path)) {
            cookie.push('path=' + path);
          }

          if (utils.isString(domain)) {
            cookie.push('domain=' + domain);
          }

          if (secure === true) {
            cookie.push('secure');
          }

          document.cookie = cookie.join('; ');
        },

        read: function read(name) {
          var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
          return (match ? decodeURIComponent(match[3]) : null);
        },

        remove: function remove(name) {
          this.write(name, '', Date.now() - 86400000);
        }
      };
    })() :

  // Non standard browser env (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return {
        write: function write() {},
        read: function read() { return null; },
        remove: function remove() {}
      };
    })()
);

},{"./../utils":42}],35:[function(_dereq_,module,exports){
'use strict';

/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
module.exports = function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
};

},{}],36:[function(_dereq_,module,exports){
'use strict';

/**
 * Determines whether the payload is an error thrown by Axios
 *
 * @param {*} payload The value to test
 * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
 */
module.exports = function isAxiosError(payload) {
  return (typeof payload === 'object') && (payload.isAxiosError === true);
};

},{}],37:[function(_dereq_,module,exports){
'use strict';

var utils = _dereq_('./../utils');

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
    (function standardBrowserEnv() {
      var msie = /(msie|trident)/i.test(navigator.userAgent);
      var urlParsingNode = document.createElement('a');
      var originURL;

      /**
    * Parse a URL to discover it's components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */
      function resolveURL(url) {
        var href = url;

        if (msie) {
        // IE needs attribute set twice to normalize properties
          urlParsingNode.setAttribute('href', href);
          href = urlParsingNode.href;
        }

        urlParsingNode.setAttribute('href', href);

        // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
        return {
          href: urlParsingNode.href,
          protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
          host: urlParsingNode.host,
          search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
          hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
          hostname: urlParsingNode.hostname,
          port: urlParsingNode.port,
          pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
            urlParsingNode.pathname :
            '/' + urlParsingNode.pathname
        };
      }

      originURL = resolveURL(window.location.href);

      /**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */
      return function isURLSameOrigin(requestURL) {
        var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
        return (parsed.protocol === originURL.protocol &&
            parsed.host === originURL.host);
      };
    })() :

  // Non standard browser envs (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return function isURLSameOrigin() {
        return true;
      };
    })()
);

},{"./../utils":42}],38:[function(_dereq_,module,exports){
'use strict';

var utils = _dereq_('../utils');

module.exports = function normalizeHeaderName(headers, normalizedName) {
  utils.forEach(headers, function processHeader(value, name) {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
};

},{"../utils":42}],39:[function(_dereq_,module,exports){
'use strict';

var utils = _dereq_('./../utils');

// Headers whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
var ignoreDuplicateOf = [
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
];

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} headers Headers needing to be parsed
 * @returns {Object} Headers parsed into an object
 */
module.exports = function parseHeaders(headers) {
  var parsed = {};
  var key;
  var val;
  var i;

  if (!headers) { return parsed; }

  utils.forEach(headers.split('\n'), function parser(line) {
    i = line.indexOf(':');
    key = utils.trim(line.substr(0, i)).toLowerCase();
    val = utils.trim(line.substr(i + 1));

    if (key) {
      if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
        return;
      }
      if (key === 'set-cookie') {
        parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
      }
    }
  });

  return parsed;
};

},{"./../utils":42}],40:[function(_dereq_,module,exports){
'use strict';

/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 * @returns {Function}
 */
module.exports = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};

},{}],41:[function(_dereq_,module,exports){
'use strict';

var pkg = _dereq_('./../../package.json');

var validators = {};

// eslint-disable-next-line func-names
['object', 'boolean', 'number', 'function', 'string', 'symbol'].forEach(function(type, i) {
  validators[type] = function validator(thing) {
    return typeof thing === type || 'a' + (i < 1 ? 'n ' : ' ') + type;
  };
});

var deprecatedWarnings = {};
var currentVerArr = pkg.version.split('.');

/**
 * Compare package versions
 * @param {string} version
 * @param {string?} thanVersion
 * @returns {boolean}
 */
function isOlderVersion(version, thanVersion) {
  var pkgVersionArr = thanVersion ? thanVersion.split('.') : currentVerArr;
  var destVer = version.split('.');
  for (var i = 0; i < 3; i++) {
    if (pkgVersionArr[i] > destVer[i]) {
      return true;
    } else if (pkgVersionArr[i] < destVer[i]) {
      return false;
    }
  }
  return false;
}

/**
 * Transitional option validator
 * @param {function|boolean?} validator
 * @param {string?} version
 * @param {string} message
 * @returns {function}
 */
validators.transitional = function transitional(validator, version, message) {
  var isDeprecated = version && isOlderVersion(version);

  function formatMessage(opt, desc) {
    return '[Axios v' + pkg.version + '] Transitional option \'' + opt + '\'' + desc + (message ? '. ' + message : '');
  }

  // eslint-disable-next-line func-names
  return function(value, opt, opts) {
    if (validator === false) {
      throw new Error(formatMessage(opt, ' has been removed in ' + version));
    }

    if (isDeprecated && !deprecatedWarnings[opt]) {
      deprecatedWarnings[opt] = true;
      // eslint-disable-next-line no-console
      console.warn(
        formatMessage(
          opt,
          ' has been deprecated since v' + version + ' and will be removed in the near future'
        )
      );
    }

    return validator ? validator(value, opt, opts) : true;
  };
};

/**
 * Assert object's properties type
 * @param {object} options
 * @param {object} schema
 * @param {boolean?} allowUnknown
 */

function assertOptions(options, schema, allowUnknown) {
  if (typeof options !== 'object') {
    throw new TypeError('options must be an object');
  }
  var keys = Object.keys(options);
  var i = keys.length;
  while (i-- > 0) {
    var opt = keys[i];
    var validator = schema[opt];
    if (validator) {
      var value = options[opt];
      var result = value === undefined || validator(value, opt, options);
      if (result !== true) {
        throw new TypeError('option ' + opt + ' must be ' + result);
      }
      continue;
    }
    if (allowUnknown !== true) {
      throw Error('Unknown option ' + opt);
    }
  }
}

module.exports = {
  isOlderVersion: isOlderVersion,
  assertOptions: assertOptions,
  validators: validators
};

},{"./../../package.json":43}],42:[function(_dereq_,module,exports){
'use strict';

var bind = _dereq_('./helpers/bind');

// utils is a library of generic helper functions non-specific to axios

var toString = Object.prototype.toString;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */
function isArray(val) {
  return toString.call(val) === '[object Array]';
}

/**
 * Determine if a value is undefined
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */
function isUndefined(val) {
  return typeof val === 'undefined';
}

/**
 * Determine if a value is a Buffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Buffer, otherwise false
 */
function isBuffer(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
    && typeof val.constructor.isBuffer === 'function' && val.constructor.isBuffer(val);
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
function isArrayBuffer(val) {
  return toString.call(val) === '[object ArrayBuffer]';
}

/**
 * Determine if a value is a FormData
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */
function isFormData(val) {
  return (typeof FormData !== 'undefined') && (val instanceof FormData);
}

/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  var result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a String, otherwise false
 */
function isString(val) {
  return typeof val === 'string';
}

/**
 * Determine if a value is a Number
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Number, otherwise false
 */
function isNumber(val) {
  return typeof val === 'number';
}

/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */
function isObject(val) {
  return val !== null && typeof val === 'object';
}

/**
 * Determine if a value is a plain Object
 *
 * @param {Object} val The value to test
 * @return {boolean} True if value is a plain Object, otherwise false
 */
function isPlainObject(val) {
  if (toString.call(val) !== '[object Object]') {
    return false;
  }

  var prototype = Object.getPrototypeOf(val);
  return prototype === null || prototype === Object.prototype;
}

/**
 * Determine if a value is a Date
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */
function isDate(val) {
  return toString.call(val) === '[object Date]';
}

/**
 * Determine if a value is a File
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
function isFile(val) {
  return toString.call(val) === '[object File]';
}

/**
 * Determine if a value is a Blob
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */
function isBlob(val) {
  return toString.call(val) === '[object Blob]';
}

/**
 * Determine if a value is a Function
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
function isFunction(val) {
  return toString.call(val) === '[object Function]';
}

/**
 * Determine if a value is a Stream
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Stream, otherwise false
 */
function isStream(val) {
  return isObject(val) && isFunction(val.pipe);
}

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
function isURLSearchParams(val) {
  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
}

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */
function trim(str) {
  return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '');
}

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 * nativescript
 *  navigator.product -> 'NativeScript' or 'NS'
 */
function isStandardBrowserEnv() {
  if (typeof navigator !== 'undefined' && (navigator.product === 'ReactNative' ||
                                           navigator.product === 'NativeScript' ||
                                           navigator.product === 'NS')) {
    return false;
  }
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined'
  );
}

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */
function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (isPlainObject(result[key]) && isPlainObject(val)) {
      result[key] = merge(result[key], val);
    } else if (isPlainObject(val)) {
      result[key] = merge({}, val);
    } else if (isArray(val)) {
      result[key] = val.slice();
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 * @return {Object} The resulting value of object a
 */
function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === 'function') {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}

/**
 * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
 *
 * @param {string} content with BOM
 * @return {string} content value without BOM
 */
function stripBOM(content) {
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }
  return content;
}

module.exports = {
  isArray: isArray,
  isArrayBuffer: isArrayBuffer,
  isBuffer: isBuffer,
  isFormData: isFormData,
  isArrayBufferView: isArrayBufferView,
  isString: isString,
  isNumber: isNumber,
  isObject: isObject,
  isPlainObject: isPlainObject,
  isUndefined: isUndefined,
  isDate: isDate,
  isFile: isFile,
  isBlob: isBlob,
  isFunction: isFunction,
  isStream: isStream,
  isURLSearchParams: isURLSearchParams,
  isStandardBrowserEnv: isStandardBrowserEnv,
  forEach: forEach,
  merge: merge,
  extend: extend,
  trim: trim,
  stripBOM: stripBOM
};

},{"./helpers/bind":31}],43:[function(_dereq_,module,exports){
module.exports={
  "name": "axios",
  "version": "0.21.4",
  "description": "Promise based HTTP client for the browser and node.js",
  "main": "index.js",
  "scripts": {
    "test": "grunt test",
    "start": "node ./sandbox/server.js",
    "build": "NODE_ENV=production grunt build",
    "preversion": "npm test",
    "version": "npm run build && grunt version && git add -A dist && git add CHANGELOG.md bower.json package.json",
    "postversion": "git push && git push --tags",
    "examples": "node ./examples/server.js",
    "coveralls": "cat coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js",
    "fix": "eslint --fix lib/**/*.js"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/axios/axios.git"
  },
  "keywords": [
    "xhr",
    "http",
    "ajax",
    "promise",
    "node"
  ],
  "author": "Matt Zabriskie",
  "license": "MIT",
  "bugs": {
    "url": "https://github.com/axios/axios/issues"
  },
  "homepage": "https://axios-http.com",
  "devDependencies": {
    "coveralls": "^3.0.0",
    "es6-promise": "^4.2.4",
    "grunt": "^1.3.0",
    "grunt-banner": "^0.6.0",
    "grunt-cli": "^1.2.0",
    "grunt-contrib-clean": "^1.1.0",
    "grunt-contrib-watch": "^1.0.0",
    "grunt-eslint": "^23.0.0",
    "grunt-karma": "^4.0.0",
    "grunt-mocha-test": "^0.13.3",
    "grunt-ts": "^6.0.0-beta.19",
    "grunt-webpack": "^4.0.2",
    "istanbul-instrumenter-loader": "^1.0.0",
    "jasmine-core": "^2.4.1",
    "karma": "^6.3.2",
    "karma-chrome-launcher": "^3.1.0",
    "karma-firefox-launcher": "^2.1.0",
    "karma-jasmine": "^1.1.1",
    "karma-jasmine-ajax": "^0.1.13",
    "karma-safari-launcher": "^1.0.0",
    "karma-sauce-launcher": "^4.3.6",
    "karma-sinon": "^1.0.5",
    "karma-sourcemap-loader": "^0.3.8",
    "karma-webpack": "^4.0.2",
    "load-grunt-tasks": "^3.5.2",
    "minimist": "^1.2.0",
    "mocha": "^8.2.1",
    "sinon": "^4.5.0",
    "terser-webpack-plugin": "^4.2.3",
    "typescript": "^4.0.5",
    "url-search-params": "^0.10.0",
    "webpack": "^4.44.2",
    "webpack-dev-server": "^3.11.0"
  },
  "browser": {
    "./lib/adapters/http.js": "./lib/adapters/xhr.js"
  },
  "jsdelivr": "dist/axios.min.js",
  "unpkg": "dist/axios.min.js",
  "typings": "./index.d.ts",
  "dependencies": {
    "follow-redirects": "^1.14.0"
  },
  "bundlesize": [
    {
      "path": "./dist/axios.min.js",
      "threshold": "5kB"
    }
  ]
}

},{}],44:[function(_dereq_,module,exports){

},{}],45:[function(_dereq_,module,exports){
/* jshint esversion: 6 */
/* jslint node: true */
'use strict';

module.exports = function serialize (object) {
  if (object === null || typeof object !== 'object' || object.toJSON != null) {
    return JSON.stringify(object);
  }

  if (Array.isArray(object)) {
    return '[' + object.reduce((t, cv, ci) => {
      const comma = ci === 0 ? '' : ',';
      const value = cv === undefined || typeof cv === 'symbol' ? null : cv;
      return t + comma + serialize(value);
    }, '') + ']';
  }

  return '{' + Object.keys(object).sort().reduce((t, cv, ci) => {
    if (object[cv] === undefined ||
        typeof object[cv] === 'symbol') {
      return t;
    }
    const comma = t.length === 0 ? '' : ',';
    return t + comma + serialize(cv) + ':' + serialize(object[cv]);
  }, '') + '}';
};

},{}],46:[function(_dereq_,module,exports){
/*
 * Copyright (c) 2019 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const {
  isArray: _isArray,
  isObject: _isObject,
  isString: _isString,
} = _dereq_('./types');
const {
  asArray: _asArray
} = _dereq_('./util');
const {prependBase} = _dereq_('./url');
const JsonLdError = _dereq_('./JsonLdError');
const ResolvedContext = _dereq_('./ResolvedContext');

const MAX_CONTEXT_URLS = 10;

module.exports = class ContextResolver {
  /**
   * Creates a ContextResolver.
   *
   * @param sharedCache a shared LRU cache with `get` and `set` APIs.
   */
  constructor({sharedCache}) {
    this.perOpCache = new Map();
    this.sharedCache = sharedCache;
  }

  async resolve({
    activeCtx, context, documentLoader, base, cycles = new Set()
  }) {
    // process `@context`
    if(context && _isObject(context) && context['@context']) {
      context = context['@context'];
    }

    // context is one or more contexts
    context = _asArray(context);

    // resolve each context in the array
    const allResolved = [];
    for(const ctx of context) {
      if(_isString(ctx)) {
        // see if `ctx` has been resolved before...
        let resolved = this._get(ctx);
        if(!resolved) {
          // not resolved yet, resolve
          resolved = await this._resolveRemoteContext(
            {activeCtx, url: ctx, documentLoader, base, cycles});
        }

        // add to output and continue
        if(_isArray(resolved)) {
          allResolved.push(...resolved);
        } else {
          allResolved.push(resolved);
        }
        continue;
      }
      if(ctx === null) {
        // handle `null` context, nothing to cache
        allResolved.push(new ResolvedContext({document: null}));
        continue;
      }
      if(!_isObject(ctx)) {
        _throwInvalidLocalContext(context);
      }
      // context is an object, get/create `ResolvedContext` for it
      const key = JSON.stringify(ctx);
      let resolved = this._get(key);
      if(!resolved) {
        // create a new static `ResolvedContext` and cache it
        resolved = new ResolvedContext({document: ctx});
        this._cacheResolvedContext({key, resolved, tag: 'static'});
      }
      allResolved.push(resolved);
    }

    return allResolved;
  }

  _get(key) {
    // get key from per operation cache; no `tag` is used with this cache so
    // any retrieved context will always be the same during a single operation
    let resolved = this.perOpCache.get(key);
    if(!resolved) {
      // see if the shared cache has a `static` entry for this URL
      const tagMap = this.sharedCache.get(key);
      if(tagMap) {
        resolved = tagMap.get('static');
        if(resolved) {
          this.perOpCache.set(key, resolved);
        }
      }
    }
    return resolved;
  }

  _cacheResolvedContext({key, resolved, tag}) {
    this.perOpCache.set(key, resolved);
    if(tag !== undefined) {
      let tagMap = this.sharedCache.get(key);
      if(!tagMap) {
        tagMap = new Map();
        this.sharedCache.set(key, tagMap);
      }
      tagMap.set(tag, resolved);
    }
    return resolved;
  }

  async _resolveRemoteContext({activeCtx, url, documentLoader, base, cycles}) {
    // resolve relative URL and fetch context
    url = prependBase(base, url);
    const {context, remoteDoc} = await this._fetchContext(
      {activeCtx, url, documentLoader, cycles});

    // update base according to remote document and resolve any relative URLs
    base = remoteDoc.documentUrl || url;
    _resolveContextUrls({context, base});

    // resolve, cache, and return context
    const resolved = await this.resolve(
      {activeCtx, context, documentLoader, base, cycles});
    this._cacheResolvedContext({key: url, resolved, tag: remoteDoc.tag});
    return resolved;
  }

  async _fetchContext({activeCtx, url, documentLoader, cycles}) {
    // check for max context URLs fetched during a resolve operation
    if(cycles.size > MAX_CONTEXT_URLS) {
      throw new JsonLdError(
        'Maximum number of @context URLs exceeded.',
        'jsonld.ContextUrlError',
        {
          code: activeCtx.processingMode === 'json-ld-1.0' ?
            'loading remote context failed' :
            'context overflow',
          max: MAX_CONTEXT_URLS
        });
    }

    // check for context URL cycle
    // shortcut to avoid extra work that would eventually hit the max above
    if(cycles.has(url)) {
      throw new JsonLdError(
        'Cyclical @context URLs detected.',
        'jsonld.ContextUrlError',
        {
          code: activeCtx.processingMode === 'json-ld-1.0' ?
            'recursive context inclusion' :
            'context overflow',
          url
        });
    }

    // track cycles
    cycles.add(url);

    let context;
    let remoteDoc;

    try {
      remoteDoc = await documentLoader(url);
      context = remoteDoc.document || null;
      // parse string context as JSON
      if(_isString(context)) {
        context = JSON.parse(context);
      }
    } catch(e) {
      throw new JsonLdError(
        'Dereferencing a URL did not result in a valid JSON-LD object. ' +
        'Possible causes are an inaccessible URL perhaps due to ' +
        'a same-origin policy (ensure the server uses CORS if you are ' +
        'using client-side JavaScript), too many redirects, a ' +
        'non-JSON response, or more than one HTTP Link Header was ' +
        'provided for a remote context.',
        'jsonld.InvalidUrl',
        {code: 'loading remote context failed', url, cause: e});
    }

    // ensure ctx is an object
    if(!_isObject(context)) {
      throw new JsonLdError(
        'Dereferencing a URL did not result in a JSON object. The ' +
        'response was valid JSON, but it was not a JSON object.',
        'jsonld.InvalidUrl', {code: 'invalid remote context', url});
    }

    // use empty context if no @context key is present
    if(!('@context' in context)) {
      context = {'@context': {}};
    } else {
      context = {'@context': context['@context']};
    }

    // append @context URL to context if given
    if(remoteDoc.contextUrl) {
      if(!_isArray(context['@context'])) {
        context['@context'] = [context['@context']];
      }
      context['@context'].push(remoteDoc.contextUrl);
    }

    return {context, remoteDoc};
  }
};

function _throwInvalidLocalContext(ctx) {
  throw new JsonLdError(
    'Invalid JSON-LD syntax; @context must be an object.',
    'jsonld.SyntaxError', {
      code: 'invalid local context', context: ctx
    });
}

/**
 * Resolve all relative `@context` URLs in the given context by inline
 * replacing them with absolute URLs.
 *
 * @param context the context.
 * @param base the base IRI to use to resolve relative IRIs.
 */
function _resolveContextUrls({context, base}) {
  if(!context) {
    return;
  }

  const ctx = context['@context'];

  if(_isString(ctx)) {
    context['@context'] = prependBase(base, ctx);
    return;
  }

  if(_isArray(ctx)) {
    for(let i = 0; i < ctx.length; ++i) {
      const element = ctx[i];
      if(_isString(element)) {
        ctx[i] = prependBase(base, element);
        continue;
      }
      if(_isObject(element)) {
        _resolveContextUrls({context: {'@context': element}, base});
      }
    }
    return;
  }

  if(!_isObject(ctx)) {
    // no @context URLs can be found in non-object
    return;
  }

  // ctx is an object, resolve any context URLs in terms
  for(const term in ctx) {
    _resolveContextUrls({context: ctx[term], base});
  }
}

},{"./JsonLdError":47,"./ResolvedContext":51,"./types":65,"./url":66,"./util":67}],47:[function(_dereq_,module,exports){
/*
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

module.exports = class JsonLdError extends Error {
  /**
   * Creates a JSON-LD Error.
   *
   * @param msg the error message.
   * @param type the error type.
   * @param details the error details.
   */
  constructor(
    message = 'An unspecified JSON-LD error occurred.',
    name = 'jsonld.Error',
    details = {}) {
    super(message);
    this.name = name;
    this.message = message;
    this.details = details;
  }
};

},{}],48:[function(_dereq_,module,exports){
/*
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

module.exports = jsonld => {
  class JsonLdProcessor {
    toString() {
      return '[object JsonLdProcessor]';
    }
  }
  Object.defineProperty(JsonLdProcessor, 'prototype', {
    writable: false,
    enumerable: false
  });
  Object.defineProperty(JsonLdProcessor.prototype, 'constructor', {
    writable: true,
    enumerable: false,
    configurable: true,
    value: JsonLdProcessor
  });

  // The Web IDL test harness will check the number of parameters defined in
  // the functions below. The number of parameters must exactly match the
  // required (non-optional) parameters of the JsonLdProcessor interface as
  // defined here:
  // https://www.w3.org/TR/json-ld-api/#the-jsonldprocessor-interface

  JsonLdProcessor.compact = function(input, ctx) {
    if(arguments.length < 2) {
      return Promise.reject(
        new TypeError('Could not compact, too few arguments.'));
    }
    return jsonld.compact(input, ctx);
  };
  JsonLdProcessor.expand = function(input) {
    if(arguments.length < 1) {
      return Promise.reject(
        new TypeError('Could not expand, too few arguments.'));
    }
    return jsonld.expand(input);
  };
  JsonLdProcessor.flatten = function(input) {
    if(arguments.length < 1) {
      return Promise.reject(
        new TypeError('Could not flatten, too few arguments.'));
    }
    return jsonld.flatten(input);
  };

  return JsonLdProcessor;
};

},{}],49:[function(_dereq_,module,exports){
/*
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

// TODO: move `NQuads` to its own package
module.exports = _dereq_('rdf-canonize').NQuads;

},{"rdf-canonize":70}],50:[function(_dereq_,module,exports){
/*
 * Copyright (c) 2017-2019 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

module.exports = class RequestQueue {
  /**
   * Creates a simple queue for requesting documents.
   */
  constructor() {
    this._requests = {};
  }

  wrapLoader(loader) {
    const self = this;
    self._loader = loader;
    return function(/* url */) {
      return self.add.apply(self, arguments);
    };
  }

  async add(url) {
    let promise = this._requests[url];
    if(promise) {
      // URL already queued, wait for it to load
      return Promise.resolve(promise);
    }

    // queue URL and load it
    promise = this._requests[url] = this._loader(url);

    try {
      return await promise;
    } finally {
      delete this._requests[url];
    }
  }
};

},{}],51:[function(_dereq_,module,exports){
/*
 * Copyright (c) 2019 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const LRU = _dereq_('lru-cache');

const MAX_ACTIVE_CONTEXTS = 10;

module.exports = class ResolvedContext {
  /**
   * Creates a ResolvedContext.
   *
   * @param document the context document.
   */
  constructor({document}) {
    this.document = document;
    // TODO: enable customization of processed context cache
    // TODO: limit based on size of processed contexts vs. number of them
    this.cache = new LRU({max: MAX_ACTIVE_CONTEXTS});
  }

  getProcessed(activeCtx) {
    return this.cache.get(activeCtx);
  }

  setProcessed(activeCtx, processedCtx) {
    this.cache.set(activeCtx, processedCtx);
  }
};

},{"lru-cache":68}],52:[function(_dereq_,module,exports){
/*
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const JsonLdError = _dereq_('./JsonLdError');

const {
  isArray: _isArray,
  isObject: _isObject,
  isString: _isString,
  isUndefined: _isUndefined
} = _dereq_('./types');

const {
  isList: _isList,
  isValue: _isValue,
  isGraph: _isGraph,
  isSimpleGraph: _isSimpleGraph,
  isSubjectReference: _isSubjectReference
} = _dereq_('./graphTypes');

const {
  expandIri: _expandIri,
  getContextValue: _getContextValue,
  isKeyword: _isKeyword,
  process: _processContext,
  processingMode: _processingMode
} = _dereq_('./context');

const {
  removeBase: _removeBase,
  prependBase: _prependBase
} = _dereq_('./url');

const {
  addValue: _addValue,
  asArray: _asArray,
  compareShortestLeast: _compareShortestLeast
} = _dereq_('./util');

const api = {};
module.exports = api;

/**
 * Recursively compacts an element using the given active context. All values
 * must be in expanded form before this method is called.
 *
 * @param activeCtx the active context to use.
 * @param activeProperty the compacted property associated with the element
 *          to compact, null for none.
 * @param element the element to compact.
 * @param options the compaction options.
 * @param compactionMap the compaction map to use.
 *
 * @return a promise that resolves to the compacted value.
 */
api.compact = async ({
  activeCtx,
  activeProperty = null,
  element,
  options = {},
  compactionMap = () => undefined
}) => {
  // recursively compact array
  if(_isArray(element)) {
    let rval = [];
    for(let i = 0; i < element.length; ++i) {
      // compact, dropping any null values unless custom mapped
      let compacted = await api.compact({
        activeCtx,
        activeProperty,
        element: element[i],
        options,
        compactionMap
      });
      if(compacted === null) {
        compacted = await compactionMap({
          unmappedValue: element[i],
          activeCtx,
          activeProperty,
          parent: element,
          index: i,
          options
        });
        if(compacted === undefined) {
          continue;
        }
      }
      rval.push(compacted);
    }
    if(options.compactArrays && rval.length === 1) {
      // use single element if no container is specified
      const container = _getContextValue(
        activeCtx, activeProperty, '@container') || [];
      if(container.length === 0) {
        rval = rval[0];
      }
    }
    return rval;
  }

  // use any scoped context on activeProperty
  const ctx = _getContextValue(activeCtx, activeProperty, '@context');
  if(!_isUndefined(ctx)) {
    activeCtx = await _processContext({
      activeCtx,
      localCtx: ctx,
      propagate: true,
      overrideProtected: true,
      options
    });
  }

  // recursively compact object
  if(_isObject(element)) {
    if(options.link && '@id' in element &&
      options.link.hasOwnProperty(element['@id'])) {
      // check for a linked element to reuse
      const linked = options.link[element['@id']];
      for(let i = 0; i < linked.length; ++i) {
        if(linked[i].expanded === element) {
          return linked[i].compacted;
        }
      }
    }

    // do value compaction on @values and subject references
    if(_isValue(element) || _isSubjectReference(element)) {
      const rval =
        api.compactValue({activeCtx, activeProperty, value: element, options});
      if(options.link && _isSubjectReference(element)) {
        // store linked element
        if(!(options.link.hasOwnProperty(element['@id']))) {
          options.link[element['@id']] = [];
        }
        options.link[element['@id']].push({expanded: element, compacted: rval});
      }
      return rval;
    }

    // if expanded property is @list and we're contained within a list
    // container, recursively compact this item to an array
    if(_isList(element)) {
      const container = _getContextValue(
        activeCtx, activeProperty, '@container') || [];
      if(container.includes('@list')) {
        return api.compact({
          activeCtx,
          activeProperty,
          element: element['@list'],
          options,
          compactionMap
        });
      }
    }

    // FIXME: avoid misuse of active property as an expanded property?
    const insideReverse = (activeProperty === '@reverse');

    const rval = {};

    // original context before applying property-scoped and local contexts
    const inputCtx = activeCtx;

    // revert to previous context, if there is one,
    // and element is not a value object or a node reference
    if(!_isValue(element) && !_isSubjectReference(element)) {
      activeCtx = activeCtx.revertToPreviousContext();
    }

    // apply property-scoped context after reverting term-scoped context
    const propertyScopedCtx =
      _getContextValue(inputCtx, activeProperty, '@context');
    if(!_isUndefined(propertyScopedCtx)) {
      activeCtx = await _processContext({
        activeCtx,
        localCtx: propertyScopedCtx,
        propagate: true,
        overrideProtected: true,
        options
      });
    }

    if(options.link && '@id' in element) {
      // store linked element
      if(!options.link.hasOwnProperty(element['@id'])) {
        options.link[element['@id']] = [];
      }
      options.link[element['@id']].push({expanded: element, compacted: rval});
    }

    // apply any context defined on an alias of @type
    // if key is @type and any compacted value is a term having a local
    // context, overlay that context
    let types = element['@type'] || [];
    if(types.length > 1) {
      types = Array.from(types).sort();
    }
    // find all type-scoped contexts based on current context, prior to
    // updating it
    const typeContext = activeCtx;
    for(const type of types) {
      const compactedType = api.compactIri(
        {activeCtx: typeContext, iri: type, relativeTo: {vocab: true}});

      // Use any type-scoped context defined on this value
      const ctx = _getContextValue(inputCtx, compactedType, '@context');
      if(!_isUndefined(ctx)) {
        activeCtx = await _processContext({
          activeCtx,
          localCtx: ctx,
          options,
          propagate: false
        });
      }
    }

    // process element keys in order
    const keys = Object.keys(element).sort();
    for(const expandedProperty of keys) {
      const expandedValue = element[expandedProperty];

      // compact @id
      if(expandedProperty === '@id') {
        let compactedValue = _asArray(expandedValue).map(
          expandedIri => api.compactIri({
            activeCtx,
            iri: expandedIri,
            relativeTo: {vocab: false},
            base: options.base
          }));
        if(compactedValue.length === 1) {
          compactedValue = compactedValue[0];
        }

        // use keyword alias and add value
        const alias = api.compactIri(
          {activeCtx, iri: '@id', relativeTo: {vocab: true}});

        rval[alias] = compactedValue;
        continue;
      }

      // compact @type(s)
      if(expandedProperty === '@type') {
        // resolve type values against previous context
        let compactedValue = _asArray(expandedValue).map(
          expandedIri => api.compactIri({
            activeCtx: inputCtx,
            iri: expandedIri,
            relativeTo: {vocab: true}
          }));
        if(compactedValue.length === 1) {
          compactedValue = compactedValue[0];
        }

        // use keyword alias and add value
        const alias = api.compactIri(
          {activeCtx, iri: '@type', relativeTo: {vocab: true}});
        const container = _getContextValue(
          activeCtx, alias, '@container') || [];

        // treat as array for @type if @container includes @set
        const typeAsSet =
          container.includes('@set') &&
          _processingMode(activeCtx, 1.1);
        const isArray =
          typeAsSet || (_isArray(compactedValue) && expandedValue.length === 0);
        _addValue(rval, alias, compactedValue, {propertyIsArray: isArray});
        continue;
      }

      // handle @reverse
      if(expandedProperty === '@reverse') {
        // recursively compact expanded value
        const compactedValue = await api.compact({
          activeCtx,
          activeProperty: '@reverse',
          element: expandedValue,
          options,
          compactionMap
        });

        // handle double-reversed properties
        for(const compactedProperty in compactedValue) {
          if(activeCtx.mappings.has(compactedProperty) &&
            activeCtx.mappings.get(compactedProperty).reverse) {
            const value = compactedValue[compactedProperty];
            const container = _getContextValue(
              activeCtx, compactedProperty, '@container') || [];
            const useArray = (
              container.includes('@set') || !options.compactArrays);
            _addValue(
              rval, compactedProperty, value, {propertyIsArray: useArray});
            delete compactedValue[compactedProperty];
          }
        }

        if(Object.keys(compactedValue).length > 0) {
          // use keyword alias and add value
          const alias = api.compactIri({
            activeCtx,
            iri: expandedProperty,
            relativeTo: {vocab: true}
          });
          _addValue(rval, alias, compactedValue);
        }

        continue;
      }

      if(expandedProperty === '@preserve') {
        // compact using activeProperty
        const compactedValue = await api.compact({
          activeCtx,
          activeProperty,
          element: expandedValue,
          options,
          compactionMap
        });

        if(!(_isArray(compactedValue) && compactedValue.length === 0)) {
          _addValue(rval, expandedProperty, compactedValue);
        }
        continue;
      }

      // handle @index property
      if(expandedProperty === '@index') {
        // drop @index if inside an @index container
        const container = _getContextValue(
          activeCtx, activeProperty, '@container') || [];
        if(container.includes('@index')) {
          continue;
        }

        // use keyword alias and add value
        const alias = api.compactIri({
          activeCtx,
          iri: expandedProperty,
          relativeTo: {vocab: true}
        });
        _addValue(rval, alias, expandedValue);
        continue;
      }

      // skip array processing for keywords that aren't
      // @graph, @list, or @included
      if(expandedProperty !== '@graph' && expandedProperty !== '@list' &&
        expandedProperty !== '@included' &&
        _isKeyword(expandedProperty)) {
        // use keyword alias and add value as is
        const alias = api.compactIri({
          activeCtx,
          iri: expandedProperty,
          relativeTo: {vocab: true}
        });
        _addValue(rval, alias, expandedValue);
        continue;
      }

      // Note: expanded value must be an array due to expansion algorithm.
      if(!_isArray(expandedValue)) {
        throw new JsonLdError(
          'JSON-LD expansion error; expanded value must be an array.',
          'jsonld.SyntaxError');
      }

      // preserve empty arrays
      if(expandedValue.length === 0) {
        const itemActiveProperty = api.compactIri({
          activeCtx,
          iri: expandedProperty,
          value: expandedValue,
          relativeTo: {vocab: true},
          reverse: insideReverse
        });
        const nestProperty = activeCtx.mappings.has(itemActiveProperty) ?
          activeCtx.mappings.get(itemActiveProperty)['@nest'] : null;
        let nestResult = rval;
        if(nestProperty) {
          _checkNestProperty(activeCtx, nestProperty, options);
          if(!_isObject(rval[nestProperty])) {
            rval[nestProperty] = {};
          }
          nestResult = rval[nestProperty];
        }
        _addValue(
          nestResult, itemActiveProperty, expandedValue, {
            propertyIsArray: true
          });
      }

      // recusively process array values
      for(const expandedItem of expandedValue) {
        // compact property and get container type
        const itemActiveProperty = api.compactIri({
          activeCtx,
          iri: expandedProperty,
          value: expandedItem,
          relativeTo: {vocab: true},
          reverse: insideReverse
        });

        // if itemActiveProperty is a @nest property, add values to nestResult,
        // otherwise rval
        const nestProperty = activeCtx.mappings.has(itemActiveProperty) ?
          activeCtx.mappings.get(itemActiveProperty)['@nest'] : null;
        let nestResult = rval;
        if(nestProperty) {
          _checkNestProperty(activeCtx, nestProperty, options);
          if(!_isObject(rval[nestProperty])) {
            rval[nestProperty] = {};
          }
          nestResult = rval[nestProperty];
        }

        const container = _getContextValue(
          activeCtx, itemActiveProperty, '@container') || [];

        // get simple @graph or @list value if appropriate
        const isGraph = _isGraph(expandedItem);
        const isList = _isList(expandedItem);
        let inner;
        if(isList) {
          inner = expandedItem['@list'];
        } else if(isGraph) {
          inner = expandedItem['@graph'];
        }

        // recursively compact expanded item
        let compactedItem = await api.compact({
          activeCtx,
          activeProperty: itemActiveProperty,
          element: (isList || isGraph) ? inner : expandedItem,
          options,
          compactionMap
        });

        // handle @list
        if(isList) {
          // ensure @list value is an array
          if(!_isArray(compactedItem)) {
            compactedItem = [compactedItem];
          }

          if(!container.includes('@list')) {
            // wrap using @list alias
            compactedItem = {
              [api.compactIri({
                activeCtx,
                iri: '@list',
                relativeTo: {vocab: true}
              })]: compactedItem
            };

            // include @index from expanded @list, if any
            if('@index' in expandedItem) {
              compactedItem[api.compactIri({
                activeCtx,
                iri: '@index',
                relativeTo: {vocab: true}
              })] = expandedItem['@index'];
            }
          } else {
            _addValue(nestResult, itemActiveProperty, compactedItem, {
              valueIsArray: true,
              allowDuplicate: true
            });
            continue;
          }
        }

        // Graph object compaction cases
        if(isGraph) {
          if(container.includes('@graph') && (container.includes('@id') ||
            container.includes('@index') && _isSimpleGraph(expandedItem))) {
            // get or create the map object
            let mapObject;
            if(nestResult.hasOwnProperty(itemActiveProperty)) {
              mapObject = nestResult[itemActiveProperty];
            } else {
              nestResult[itemActiveProperty] = mapObject = {};
            }

            // index on @id or @index or alias of @none
            const key = (container.includes('@id') ?
              expandedItem['@id'] : expandedItem['@index']) ||
              api.compactIri({activeCtx, iri: '@none',
                relativeTo: {vocab: true}});
            // add compactedItem to map, using value of `@id` or a new blank
            // node identifier

            _addValue(
              mapObject, key, compactedItem, {
                propertyIsArray:
                  (!options.compactArrays || container.includes('@set'))
              });
          } else if(container.includes('@graph') &&
            _isSimpleGraph(expandedItem)) {
            // container includes @graph but not @id or @index and value is a
            // simple graph object add compact value
            // if compactedItem contains multiple values, it is wrapped in
            // `@included`
            if(_isArray(compactedItem) && compactedItem.length > 1) {
              compactedItem = {'@included': compactedItem};
            }
            _addValue(
              nestResult, itemActiveProperty, compactedItem, {
                propertyIsArray:
                  (!options.compactArrays || container.includes('@set'))
              });
          } else {
            // wrap using @graph alias, remove array if only one item and
            // compactArrays not set
            if(_isArray(compactedItem) && compactedItem.length === 1 &&
              options.compactArrays) {
              compactedItem = compactedItem[0];
            }
            compactedItem = {
              [api.compactIri({
                activeCtx,
                iri: '@graph',
                relativeTo: {vocab: true}
              })]: compactedItem
            };

            // include @id from expanded graph, if any
            if('@id' in expandedItem) {
              compactedItem[api.compactIri({
                activeCtx,
                iri: '@id',
                relativeTo: {vocab: true}
              })] = expandedItem['@id'];
            }

            // include @index from expanded graph, if any
            if('@index' in expandedItem) {
              compactedItem[api.compactIri({
                activeCtx,
                iri: '@index',
                relativeTo: {vocab: true}
              })] = expandedItem['@index'];
            }
            _addValue(
              nestResult, itemActiveProperty, compactedItem, {
                propertyIsArray:
                  (!options.compactArrays || container.includes('@set'))
              });
          }
        } else if(container.includes('@language') ||
          container.includes('@index') || container.includes('@id') ||
          container.includes('@type')) {
          // handle language and index maps
          // get or create the map object
          let mapObject;
          if(nestResult.hasOwnProperty(itemActiveProperty)) {
            mapObject = nestResult[itemActiveProperty];
          } else {
            nestResult[itemActiveProperty] = mapObject = {};
          }

          let key;
          if(container.includes('@language')) {
          // if container is a language map, simplify compacted value to
          // a simple string
            if(_isValue(compactedItem)) {
              compactedItem = compactedItem['@value'];
            }
            key = expandedItem['@language'];
          } else if(container.includes('@index')) {
            const indexKey = _getContextValue(
              activeCtx, itemActiveProperty, '@index') || '@index';
            const containerKey = api.compactIri(
              {activeCtx, iri: indexKey, relativeTo: {vocab: true}});
            if(indexKey === '@index') {
              key = expandedItem['@index'];
              delete compactedItem[containerKey];
            } else {
              let others;
              [key, ...others] = _asArray(compactedItem[indexKey] || []);
              if(!_isString(key)) {
                // Will use @none if it isn't a string.
                key = null;
              } else {
                switch(others.length) {
                  case 0:
                    delete compactedItem[indexKey];
                    break;
                  case 1:
                    compactedItem[indexKey] = others[0];
                    break;
                  default:
                    compactedItem[indexKey] = others;
                    break;
                }
              }
            }
          } else if(container.includes('@id')) {
            const idKey = api.compactIri({activeCtx, iri: '@id',
              relativeTo: {vocab: true}});
            key = compactedItem[idKey];
            delete compactedItem[idKey];
          } else if(container.includes('@type')) {
            const typeKey = api.compactIri({
              activeCtx,
              iri: '@type',
              relativeTo: {vocab: true}
            });
            let types;
            [key, ...types] = _asArray(compactedItem[typeKey] || []);
            switch(types.length) {
              case 0:
                delete compactedItem[typeKey];
                break;
              case 1:
                compactedItem[typeKey] = types[0];
                break;
              default:
                compactedItem[typeKey] = types;
                break;
            }

            // If compactedItem contains a single entry
            // whose key maps to @id, recompact without @type
            if(Object.keys(compactedItem).length === 1 &&
              '@id' in expandedItem) {
              compactedItem = await api.compact({
                activeCtx,
                activeProperty: itemActiveProperty,
                element: {'@id': expandedItem['@id']},
                options,
                compactionMap
              });
            }
          }

          // if compacting this value which has no key, index on @none
          if(!key) {
            key = api.compactIri({activeCtx, iri: '@none',
              relativeTo: {vocab: true}});
          }
          // add compact value to map object using key from expanded value
          // based on the container type
          _addValue(
            mapObject, key, compactedItem, {
              propertyIsArray: container.includes('@set')
            });
        } else {
          // use an array if: compactArrays flag is false,
          // @container is @set or @list , value is an empty
          // array, or key is @graph
          const isArray = (!options.compactArrays ||
            container.includes('@set') || container.includes('@list') ||
            (_isArray(compactedItem) && compactedItem.length === 0) ||
            expandedProperty === '@list' || expandedProperty === '@graph');

          // add compact value
          _addValue(
            nestResult, itemActiveProperty, compactedItem,
            {propertyIsArray: isArray});
        }
      }
    }

    return rval;
  }

  // only primitives remain which are already compact
  return element;
};

/**
 * Compacts an IRI or keyword into a term or prefix if it can be. If the
 * IRI has an associated value it may be passed.
 *
 * @param activeCtx the active context to use.
 * @param iri the IRI to compact.
 * @param value the value to check or null.
 * @param relativeTo options for how to compact IRIs:
 *          vocab: true to split after @vocab, false not to.
 * @param reverse true if a reverse property is being compacted, false if not.
 * @param base the absolute URL to use for compacting document-relative IRIs.
 *
 * @return the compacted term, prefix, keyword alias, or the original IRI.
 */
api.compactIri = ({
  activeCtx,
  iri,
  value = null,
  relativeTo = {vocab: false},
  reverse = false,
  base = null
}) => {
  // can't compact null
  if(iri === null) {
    return iri;
  }

  // if context is from a property term scoped context composed with a
  // type-scoped context, then use the previous context instead
  if(activeCtx.isPropertyTermScoped && activeCtx.previousContext) {
    activeCtx = activeCtx.previousContext;
  }

  const inverseCtx = activeCtx.getInverse();

  // if term is a keyword, it may be compacted to a simple alias
  if(_isKeyword(iri) &&
    iri in inverseCtx &&
    '@none' in inverseCtx[iri] &&
    '@type' in inverseCtx[iri]['@none'] &&
    '@none' in inverseCtx[iri]['@none']['@type']) {
    return inverseCtx[iri]['@none']['@type']['@none'];
  }

  // use inverse context to pick a term if iri is relative to vocab
  if(relativeTo.vocab && iri in inverseCtx) {
    const defaultLanguage = activeCtx['@language'] || '@none';

    // prefer @index if available in value
    const containers = [];
    if(_isObject(value) && '@index' in value && !('@graph' in value)) {
      containers.push('@index', '@index@set');
    }

    // if value is a preserve object, use its value
    if(_isObject(value) && '@preserve' in value) {
      value = value['@preserve'][0];
    }

    // prefer most specific container including @graph, prefering @set
    // variations
    if(_isGraph(value)) {
      // favor indexmap if the graph is indexed
      if('@index' in value) {
        containers.push(
          '@graph@index', '@graph@index@set', '@index', '@index@set');
      }
      // favor idmap if the graph is has an @id
      if('@id' in value) {
        containers.push(
          '@graph@id', '@graph@id@set');
      }
      containers.push('@graph', '@graph@set', '@set');
      // allow indexmap if the graph is not indexed
      if(!('@index' in value)) {
        containers.push(
          '@graph@index', '@graph@index@set', '@index', '@index@set');
      }
      // allow idmap if the graph does not have an @id
      if(!('@id' in value)) {
        containers.push('@graph@id', '@graph@id@set');
      }
    } else if(_isObject(value) && !_isValue(value)) {
      containers.push('@id', '@id@set', '@type', '@set@type');
    }

    // defaults for term selection based on type/language
    let typeOrLanguage = '@language';
    let typeOrLanguageValue = '@null';

    if(reverse) {
      typeOrLanguage = '@type';
      typeOrLanguageValue = '@reverse';
      containers.push('@set');
    } else if(_isList(value)) {
      // choose the most specific term that works for all elements in @list
      // only select @list containers if @index is NOT in value
      if(!('@index' in value)) {
        containers.push('@list');
      }
      const list = value['@list'];
      if(list.length === 0) {
        // any empty list can be matched against any term that uses the
        // @list container regardless of @type or @language
        typeOrLanguage = '@any';
        typeOrLanguageValue = '@none';
      } else {
        let commonLanguage = (list.length === 0) ? defaultLanguage : null;
        let commonType = null;
        for(let i = 0; i < list.length; ++i) {
          const item = list[i];
          let itemLanguage = '@none';
          let itemType = '@none';
          if(_isValue(item)) {
            if('@direction' in item) {
              const lang = (item['@language'] || '').toLowerCase();
              const dir = item['@direction'];
              itemLanguage = `${lang}_${dir}`;
            } else if('@language' in item) {
              itemLanguage = item['@language'].toLowerCase();
            } else if('@type' in item) {
              itemType = item['@type'];
            } else {
              // plain literal
              itemLanguage = '@null';
            }
          } else {
            itemType = '@id';
          }
          if(commonLanguage === null) {
            commonLanguage = itemLanguage;
          } else if(itemLanguage !== commonLanguage && _isValue(item)) {
            commonLanguage = '@none';
          }
          if(commonType === null) {
            commonType = itemType;
          } else if(itemType !== commonType) {
            commonType = '@none';
          }
          // there are different languages and types in the list, so choose
          // the most generic term, no need to keep iterating the list
          if(commonLanguage === '@none' && commonType === '@none') {
            break;
          }
        }
        commonLanguage = commonLanguage || '@none';
        commonType = commonType || '@none';
        if(commonType !== '@none') {
          typeOrLanguage = '@type';
          typeOrLanguageValue = commonType;
        } else {
          typeOrLanguageValue = commonLanguage;
        }
      }
    } else {
      if(_isValue(value)) {
        if('@language' in value && !('@index' in value)) {
          containers.push('@language', '@language@set');
          typeOrLanguageValue = value['@language'];
          const dir = value['@direction'];
          if(dir) {
            typeOrLanguageValue = `${typeOrLanguageValue}_${dir}`;
          }
        } else if('@direction' in value && !('@index' in value)) {
          typeOrLanguageValue = `_${value['@direction']}`;
        } else if('@type' in value) {
          typeOrLanguage = '@type';
          typeOrLanguageValue = value['@type'];
        }
      } else {
        typeOrLanguage = '@type';
        typeOrLanguageValue = '@id';
      }
      containers.push('@set');
    }

    // do term selection
    containers.push('@none');

    // an index map can be used to index values using @none, so add as a low
    // priority
    if(_isObject(value) && !('@index' in value)) {
      // allow indexing even if no @index present
      containers.push('@index', '@index@set');
    }

    // values without type or language can use @language map
    if(_isValue(value) && Object.keys(value).length === 1) {
      // allow indexing even if no @index present
      containers.push('@language', '@language@set');
    }

    const term = _selectTerm(
      activeCtx, iri, value, containers, typeOrLanguage, typeOrLanguageValue);
    if(term !== null) {
      return term;
    }
  }

  // no term match, use @vocab if available
  if(relativeTo.vocab) {
    if('@vocab' in activeCtx) {
      // determine if vocab is a prefix of the iri
      const vocab = activeCtx['@vocab'];
      if(iri.indexOf(vocab) === 0 && iri !== vocab) {
        // use suffix as relative iri if it is not a term in the active context
        const suffix = iri.substr(vocab.length);
        if(!activeCtx.mappings.has(suffix)) {
          return suffix;
        }
      }
    }
  }

  // no term or @vocab match, check for possible CURIEs
  let choice = null;
  // TODO: make FastCurieMap a class with a method to do this lookup
  const partialMatches = [];
  let iriMap = activeCtx.fastCurieMap;
  // check for partial matches of against `iri`, which means look until
  // iri.length - 1, not full length
  const maxPartialLength = iri.length - 1;
  for(let i = 0; i < maxPartialLength && iri[i] in iriMap; ++i) {
    iriMap = iriMap[iri[i]];
    if('' in iriMap) {
      partialMatches.push(iriMap[''][0]);
    }
  }
  // check partial matches in reverse order to prefer longest ones first
  for(let i = partialMatches.length - 1; i >= 0; --i) {
    const entry = partialMatches[i];
    const terms = entry.terms;
    for(const term of terms) {
      // a CURIE is usable if:
      // 1. it has no mapping, OR
      // 2. value is null, which means we're not compacting an @value, AND
      //   the mapping matches the IRI
      const curie = term + ':' + iri.substr(entry.iri.length);
      const isUsableCurie = (activeCtx.mappings.get(term)._prefix &&
        (!activeCtx.mappings.has(curie) ||
        (value === null && activeCtx.mappings.get(curie)['@id'] === iri)));

      // select curie if it is shorter or the same length but lexicographically
      // less than the current choice
      if(isUsableCurie && (choice === null ||
        _compareShortestLeast(curie, choice) < 0)) {
        choice = curie;
      }
    }
  }

  // return chosen curie
  if(choice !== null) {
    return choice;
  }

  // If iri could be confused with a compact IRI using a term in this context,
  // signal an error
  for(const [term, td] of activeCtx.mappings) {
    if(td && td._prefix && iri.startsWith(term + ':')) {
      throw new JsonLdError(
        `Absolute IRI "${iri}" confused with prefix "${term}".`,
        'jsonld.SyntaxError',
        {code: 'IRI confused with prefix', context: activeCtx});
    }
  }

  // compact IRI relative to base
  if(!relativeTo.vocab) {
    if('@base' in activeCtx) {
      if(!activeCtx['@base']) {
        // The None case preserves rval as potentially relative
        return iri;
      } else {
        return _removeBase(_prependBase(base, activeCtx['@base']), iri);
      }
    } else {
      return _removeBase(base, iri);
    }
  }

  // return IRI as is
  return iri;
};

/**
 * Performs value compaction on an object with '@value' or '@id' as the only
 * property.
 *
 * @param activeCtx the active context.
 * @param activeProperty the active property that points to the value.
 * @param value the value to compact.
 * @param {Object} [options] - processing options.
 *
 * @return the compaction result.
 */
api.compactValue = ({activeCtx, activeProperty, value, options}) => {
  // value is a @value
  if(_isValue(value)) {
    // get context rules
    const type = _getContextValue(activeCtx, activeProperty, '@type');
    const language = _getContextValue(activeCtx, activeProperty, '@language');
    const direction = _getContextValue(activeCtx, activeProperty, '@direction');
    const container =
      _getContextValue(activeCtx, activeProperty, '@container') || [];

    // whether or not the value has an @index that must be preserved
    const preserveIndex = '@index' in value && !container.includes('@index');

    // if there's no @index to preserve ...
    if(!preserveIndex && type !== '@none') {
      // matching @type or @language specified in context, compact value
      if(value['@type'] === type) {
        return value['@value'];
      }
      if('@language' in value && value['@language'] === language &&
         '@direction' in value && value['@direction'] === direction) {
        return value['@value'];
      }
      if('@language' in value && value['@language'] === language) {
        return value['@value'];
      }
      if('@direction' in value && value['@direction'] === direction) {
        return value['@value'];
      }
    }

    // return just the value of @value if all are true:
    // 1. @value is the only key or @index isn't being preserved
    // 2. there is no default language or @value is not a string or
    //   the key has a mapping with a null @language
    const keyCount = Object.keys(value).length;
    const isValueOnlyKey = (keyCount === 1 ||
      (keyCount === 2 && '@index' in value && !preserveIndex));
    const hasDefaultLanguage = ('@language' in activeCtx);
    const isValueString = _isString(value['@value']);
    const hasNullMapping = (activeCtx.mappings.has(activeProperty) &&
      activeCtx.mappings.get(activeProperty)['@language'] === null);
    if(isValueOnlyKey &&
      type !== '@none' &&
      (!hasDefaultLanguage || !isValueString || hasNullMapping)) {
      return value['@value'];
    }

    const rval = {};

    // preserve @index
    if(preserveIndex) {
      rval[api.compactIri({
        activeCtx,
        iri: '@index',
        relativeTo: {vocab: true}
      })] = value['@index'];
    }

    if('@type' in value) {
      // compact @type IRI
      rval[api.compactIri({
        activeCtx,
        iri: '@type',
        relativeTo: {vocab: true}
      })] = api.compactIri(
        {activeCtx, iri: value['@type'], relativeTo: {vocab: true}});
    } else if('@language' in value) {
      // alias @language
      rval[api.compactIri({
        activeCtx,
        iri: '@language',
        relativeTo: {vocab: true}
      })] = value['@language'];
    }

    if('@direction' in value) {
      // alias @direction
      rval[api.compactIri({
        activeCtx,
        iri: '@direction',
        relativeTo: {vocab: true}
      })] = value['@direction'];
    }

    // alias @value
    rval[api.compactIri({
      activeCtx,
      iri: '@value',
      relativeTo: {vocab: true}
    })] = value['@value'];

    return rval;
  }

  // value is a subject reference
  const expandedProperty = _expandIri(activeCtx, activeProperty, {vocab: true},
    options);
  const type = _getContextValue(activeCtx, activeProperty, '@type');
  const compacted = api.compactIri({
    activeCtx,
    iri: value['@id'],
    relativeTo: {vocab: type === '@vocab'},
    base: options.base});

  // compact to scalar
  if(type === '@id' || type === '@vocab' || expandedProperty === '@graph') {
    return compacted;
  }

  return {
    [api.compactIri({
      activeCtx,
      iri: '@id',
      relativeTo: {vocab: true}
    })]: compacted
  };
};

/**
 * Picks the preferred compaction term from the given inverse context entry.
 *
 * @param activeCtx the active context.
 * @param iri the IRI to pick the term for.
 * @param value the value to pick the term for.
 * @param containers the preferred containers.
 * @param typeOrLanguage either '@type' or '@language'.
 * @param typeOrLanguageValue the preferred value for '@type' or '@language'.
 *
 * @return the preferred term.
 */
function _selectTerm(
  activeCtx, iri, value, containers, typeOrLanguage, typeOrLanguageValue) {
  if(typeOrLanguageValue === null) {
    typeOrLanguageValue = '@null';
  }

  // preferences for the value of @type or @language
  const prefs = [];

  // determine prefs for @id based on whether or not value compacts to a term
  if((typeOrLanguageValue === '@id' || typeOrLanguageValue === '@reverse') &&
    _isObject(value) && '@id' in value) {
    // prefer @reverse first
    if(typeOrLanguageValue === '@reverse') {
      prefs.push('@reverse');
    }
    // try to compact value to a term
    const term = api.compactIri(
      {activeCtx, iri: value['@id'], relativeTo: {vocab: true}});
    if(activeCtx.mappings.has(term) &&
      activeCtx.mappings.get(term) &&
      activeCtx.mappings.get(term)['@id'] === value['@id']) {
      // prefer @vocab
      prefs.push.apply(prefs, ['@vocab', '@id']);
    } else {
      // prefer @id
      prefs.push.apply(prefs, ['@id', '@vocab']);
    }
  } else {
    prefs.push(typeOrLanguageValue);

    // consider direction only
    const langDir = prefs.find(el => el.includes('_'));
    if(langDir) {
      // consider _dir portion
      prefs.push(langDir.replace(/^[^_]+_/, '_'));
    }
  }
  prefs.push('@none');

  const containerMap = activeCtx.inverse[iri];
  for(const container of containers) {
    // if container not available in the map, continue
    if(!(container in containerMap)) {
      continue;
    }

    const typeOrLanguageValueMap = containerMap[container][typeOrLanguage];
    for(const pref of prefs) {
      // if type/language option not available in the map, continue
      if(!(pref in typeOrLanguageValueMap)) {
        continue;
      }

      // select term
      return typeOrLanguageValueMap[pref];
    }
  }

  return null;
}

/**
 * The value of `@nest` in the term definition must either be `@nest`, or a term
 * which resolves to `@nest`.
 *
 * @param activeCtx the active context.
 * @param nestProperty a term in the active context or `@nest`.
 * @param {Object} [options] - processing options.
 */
function _checkNestProperty(activeCtx, nestProperty, options) {
  if(_expandIri(activeCtx, nestProperty, {vocab: true}, options) !== '@nest') {
    throw new JsonLdError(
      'JSON-LD compact error; nested property must have an @nest value ' +
      'resolving to @nest.',
      'jsonld.SyntaxError', {code: 'invalid @nest value'});
  }
}

},{"./JsonLdError":47,"./context":54,"./graphTypes":60,"./types":65,"./url":66,"./util":67}],53:[function(_dereq_,module,exports){
/*
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const RDF = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#';
const XSD = 'http://www.w3.org/2001/XMLSchema#';

module.exports = {
  // TODO: Deprecated and will be removed later. Use LINK_HEADER_CONTEXT.
  LINK_HEADER_REL: 'http://www.w3.org/ns/json-ld#context',

  LINK_HEADER_CONTEXT: 'http://www.w3.org/ns/json-ld#context',

  RDF,
  RDF_LIST: RDF + 'List',
  RDF_FIRST: RDF + 'first',
  RDF_REST: RDF + 'rest',
  RDF_NIL: RDF + 'nil',
  RDF_TYPE: RDF + 'type',
  RDF_PLAIN_LITERAL: RDF + 'PlainLiteral',
  RDF_XML_LITERAL: RDF + 'XMLLiteral',
  RDF_JSON_LITERAL: RDF + 'JSON',
  RDF_OBJECT: RDF + 'object',
  RDF_LANGSTRING: RDF + 'langString',

  XSD,
  XSD_BOOLEAN: XSD + 'boolean',
  XSD_DOUBLE: XSD + 'double',
  XSD_INTEGER: XSD + 'integer',
  XSD_STRING: XSD + 'string',
};

},{}],54:[function(_dereq_,module,exports){
/*
 * Copyright (c) 2017-2019 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const util = _dereq_('./util');
const JsonLdError = _dereq_('./JsonLdError');

const {
  isArray: _isArray,
  isObject: _isObject,
  isString: _isString,
  isUndefined: _isUndefined
} = _dereq_('./types');

const {
  isAbsolute: _isAbsoluteIri,
  isRelative: _isRelativeIri,
  prependBase
} = _dereq_('./url');

const {
  asArray: _asArray,
  compareShortestLeast: _compareShortestLeast
} = _dereq_('./util');

const INITIAL_CONTEXT_CACHE = new Map();
const INITIAL_CONTEXT_CACHE_MAX_SIZE = 10000;
const KEYWORD_PATTERN = /^@[a-zA-Z]+$/;

const api = {};
module.exports = api;

/**
 * Processes a local context and returns a new active context.
 *
 * @param activeCtx the current active context.
 * @param localCtx the local context to process.
 * @param options the context processing options.
 * @param propagate `true` if `false`, retains any previously defined term,
 *   which can be rolled back when the descending into a new node object.
 * @param overrideProtected `false` allows protected terms to be modified.
 *
 * @return a Promise that resolves to the new active context.
 */
api.process = async ({
  activeCtx, localCtx, options,
  propagate = true,
  overrideProtected = false,
  cycles = new Set()
}) => {
  // normalize local context to an array of @context objects
  if(_isObject(localCtx) && '@context' in localCtx &&
    _isArray(localCtx['@context'])) {
    localCtx = localCtx['@context'];
  }
  const ctxs = _asArray(localCtx);

  // no contexts in array, return current active context w/o changes
  if(ctxs.length === 0) {
    return activeCtx;
  }

  // resolve contexts
  const resolved = await options.contextResolver.resolve({
    activeCtx,
    context: localCtx,
    documentLoader: options.documentLoader,
    base: options.base
  });

  // override propagate if first resolved context has `@propagate`
  if(_isObject(resolved[0].document) &&
    typeof resolved[0].document['@propagate'] === 'boolean') {
    // retrieve early, error checking done later
    propagate = resolved[0].document['@propagate'];
  }

  // process each context in order, update active context
  // on each iteration to ensure proper caching
  let rval = activeCtx;

  // track the previous context
  // if not propagating, make sure rval has a previous context
  if(!propagate && !rval.previousContext) {
    // clone `rval` context before updating
    rval = rval.clone();
    rval.previousContext = activeCtx;
  }

  for(const resolvedContext of resolved) {
    let {document: ctx} = resolvedContext;

    // update active context to one computed from last iteration
    activeCtx = rval;

    // reset to initial context
    if(ctx === null) {
      // We can't nullify if there are protected terms and we're
      // not allowing overrides (e.g. processing a property term scoped context)
      if(!overrideProtected &&
        Object.keys(activeCtx.protected).length !== 0) {
        const protectedMode = (options && options.protectedMode) || 'error';
        if(protectedMode === 'error') {
          throw new JsonLdError(
            'Tried to nullify a context with protected terms outside of ' +
            'a term definition.',
            'jsonld.SyntaxError',
            {code: 'invalid context nullification'});
        } else if(protectedMode === 'warn') {
          // FIXME: remove logging and use a handler
          console.warn('WARNING: invalid context nullification');

          // get processed context from cache if available
          const processed = resolvedContext.getProcessed(activeCtx);
          if(processed) {
            rval = activeCtx = processed;
            continue;
          }

          const oldActiveCtx = activeCtx;
          // copy all protected term definitions to fresh initial context
          rval = activeCtx = api.getInitialContext(options).clone();
          for(const [term, _protected] of
            Object.entries(oldActiveCtx.protected)) {
            if(_protected) {
              activeCtx.mappings[term] =
                util.clone(oldActiveCtx.mappings[term]);
            }
          }
          activeCtx.protected = util.clone(oldActiveCtx.protected);

          // cache processed result
          resolvedContext.setProcessed(oldActiveCtx, rval);
          continue;
        }
        throw new JsonLdError(
          'Invalid protectedMode.',
          'jsonld.SyntaxError',
          {code: 'invalid protected mode', context: localCtx, protectedMode});
      }
      rval = activeCtx = api.getInitialContext(options).clone();
      continue;
    }

    // get processed context from cache if available
    const processed = resolvedContext.getProcessed(activeCtx);
    if(processed) {
      rval = activeCtx = processed;
      continue;
    }

    // dereference @context key if present
    if(_isObject(ctx) && '@context' in ctx) {
      ctx = ctx['@context'];
    }

    // context must be an object by now, all URLs retrieved before this call
    if(!_isObject(ctx)) {
      throw new JsonLdError(
        'Invalid JSON-LD syntax; @context must be an object.',
        'jsonld.SyntaxError', {code: 'invalid local context', context: ctx});
    }

    // TODO: there is likely a `previousContext` cloning optimization that
    // could be applied here (no need to copy it under certain conditions)

    // clone context before updating it
    rval = rval.clone();

    // define context mappings for keys in local context
    const defined = new Map();

    // handle @version
    if('@version' in ctx) {
      if(ctx['@version'] !== 1.1) {
        throw new JsonLdError(
          'Unsupported JSON-LD version: ' + ctx['@version'],
          'jsonld.UnsupportedVersion',
          {code: 'invalid @version value', context: ctx});
      }
      if(activeCtx.processingMode &&
        activeCtx.processingMode === 'json-ld-1.0') {
        throw new JsonLdError(
          '@version: ' + ctx['@version'] + ' not compatible with ' +
          activeCtx.processingMode,
          'jsonld.ProcessingModeConflict',
          {code: 'processing mode conflict', context: ctx});
      }
      rval.processingMode = 'json-ld-1.1';
      rval['@version'] = ctx['@version'];
      defined.set('@version', true);
    }

    // if not set explicitly, set processingMode to "json-ld-1.1"
    rval.processingMode =
      rval.processingMode || activeCtx.processingMode;

    // handle @base
    if('@base' in ctx) {
      let base = ctx['@base'];

      if(base === null || _isAbsoluteIri(base)) {
        // no action
      } else if(_isRelativeIri(base)) {
        base = prependBase(rval['@base'], base);
      } else {
        throw new JsonLdError(
          'Invalid JSON-LD syntax; the value of "@base" in a ' +
          '@context must be an absolute IRI, a relative IRI, or null.',
          'jsonld.SyntaxError', {code: 'invalid base IRI', context: ctx});
      }

      rval['@base'] = base;
      defined.set('@base', true);
    }

    // handle @vocab
    if('@vocab' in ctx) {
      const value = ctx['@vocab'];
      if(value === null) {
        delete rval['@vocab'];
      } else if(!_isString(value)) {
        throw new JsonLdError(
          'Invalid JSON-LD syntax; the value of "@vocab" in a ' +
          '@context must be a string or null.',
          'jsonld.SyntaxError', {code: 'invalid vocab mapping', context: ctx});
      } else if(!_isAbsoluteIri(value) && api.processingMode(rval, 1.0)) {
        throw new JsonLdError(
          'Invalid JSON-LD syntax; the value of "@vocab" in a ' +
          '@context must be an absolute IRI.',
          'jsonld.SyntaxError', {code: 'invalid vocab mapping', context: ctx});
      } else {
        rval['@vocab'] = _expandIri(rval, value, {vocab: true, base: true},
          undefined, undefined, options);
      }
      defined.set('@vocab', true);
    }

    // handle @language
    if('@language' in ctx) {
      const value = ctx['@language'];
      if(value === null) {
        delete rval['@language'];
      } else if(!_isString(value)) {
        throw new JsonLdError(
          'Invalid JSON-LD syntax; the value of "@language" in a ' +
          '@context must be a string or null.',
          'jsonld.SyntaxError',
          {code: 'invalid default language', context: ctx});
      } else {
        rval['@language'] = value.toLowerCase();
      }
      defined.set('@language', true);
    }

    // handle @direction
    if('@direction' in ctx) {
      const value = ctx['@direction'];
      if(activeCtx.processingMode === 'json-ld-1.0') {
        throw new JsonLdError(
          'Invalid JSON-LD syntax; @direction not compatible with ' +
          activeCtx.processingMode,
          'jsonld.SyntaxError',
          {code: 'invalid context member', context: ctx});
      }
      if(value === null) {
        delete rval['@direction'];
      } else if(value !== 'ltr' && value !== 'rtl') {
        throw new JsonLdError(
          'Invalid JSON-LD syntax; the value of "@direction" in a ' +
          '@context must be null, "ltr", or "rtl".',
          'jsonld.SyntaxError',
          {code: 'invalid base direction', context: ctx});
      } else {
        rval['@direction'] = value;
      }
      defined.set('@direction', true);
    }

    // handle @propagate
    // note: we've already extracted it, here we just do error checking
    if('@propagate' in ctx) {
      const value = ctx['@propagate'];
      if(activeCtx.processingMode === 'json-ld-1.0') {
        throw new JsonLdError(
          'Invalid JSON-LD syntax; @propagate not compatible with ' +
          activeCtx.processingMode,
          'jsonld.SyntaxError',
          {code: 'invalid context entry', context: ctx});
      }
      if(typeof value !== 'boolean') {
        throw new JsonLdError(
          'Invalid JSON-LD syntax; @propagate value must be a boolean.',
          'jsonld.SyntaxError',
          {code: 'invalid @propagate value', context: localCtx});
      }
      defined.set('@propagate', true);
    }

    // handle @import
    if('@import' in ctx) {
      const value = ctx['@import'];
      if(activeCtx.processingMode === 'json-ld-1.0') {
        throw new JsonLdError(
          'Invalid JSON-LD syntax; @import not compatible with ' +
          activeCtx.processingMode,
          'jsonld.SyntaxError',
          {code: 'invalid context entry', context: ctx});
      }
      if(!_isString(value)) {
        throw new JsonLdError(
          'Invalid JSON-LD syntax; @import must be a string.',
          'jsonld.SyntaxError',
          {code: 'invalid @import value', context: localCtx});
      }

      // resolve contexts
      const resolvedImport = await options.contextResolver.resolve({
        activeCtx,
        context: value,
        documentLoader: options.documentLoader,
        base: options.base
      });
      if(resolvedImport.length !== 1) {
        throw new JsonLdError(
          'Invalid JSON-LD syntax; @import must reference a single context.',
          'jsonld.SyntaxError',
          {code: 'invalid remote context', context: localCtx});
      }
      const processedImport = resolvedImport[0].getProcessed(activeCtx);
      if(processedImport) {
        // Note: if the same context were used in this active context
        // as a reference context, then processed_input might not
        // be a dict.
        ctx = processedImport;
      } else {
        const importCtx = resolvedImport[0].document;
        if('@import' in importCtx) {
          throw new JsonLdError(
            'Invalid JSON-LD syntax: ' +
            'imported context must not include @import.',
            'jsonld.SyntaxError',
            {code: 'invalid context entry', context: localCtx});
        }

        // merge ctx into importCtx and replace rval with the result
        for(const key in importCtx) {
          if(!ctx.hasOwnProperty(key)) {
            ctx[key] = importCtx[key];
          }
        }

        // Note: this could potenially conflict if the import
        // were used in the same active context as a referenced
        // context and an import. In this case, we
        // could override the cached result, but seems unlikely.
        resolvedImport[0].setProcessed(activeCtx, ctx);
      }

      defined.set('@import', true);
    }

    // handle @protected; determine whether this sub-context is declaring
    // all its terms to be "protected" (exceptions can be made on a
    // per-definition basis)
    defined.set('@protected', ctx['@protected'] || false);

    // process all other keys
    for(const key in ctx) {
      api.createTermDefinition({
        activeCtx: rval,
        localCtx: ctx,
        term: key,
        defined,
        options,
        overrideProtected
      });

      if(_isObject(ctx[key]) && '@context' in ctx[key]) {
        const keyCtx = ctx[key]['@context'];
        let process = true;
        if(_isString(keyCtx)) {
          const url = prependBase(options.base, keyCtx);
          // track processed contexts to avoid scoped context recursion
          if(cycles.has(url)) {
            process = false;
          } else {
            cycles.add(url);
          }
        }
        // parse context to validate
        if(process) {
          try {
            await api.process({
              activeCtx: rval.clone(),
              localCtx: ctx[key]['@context'],
              overrideProtected: true,
              options,
              cycles
            });
          } catch(e) {
            throw new JsonLdError(
              'Invalid JSON-LD syntax; invalid scoped context.',
              'jsonld.SyntaxError',
              {
                code: 'invalid scoped context',
                context: ctx[key]['@context'],
                term: key
              });
          }
        }
      }
    }

    // cache processed result
    resolvedContext.setProcessed(activeCtx, rval);
  }

  return rval;
};

/**
 * Creates a term definition during context processing.
 *
 * @param activeCtx the current active context.
 * @param localCtx the local context being processed.
 * @param term the term in the local context to define the mapping for.
 * @param defined a map of defining/defined keys to detect cycles and prevent
 *          double definitions.
 * @param {Object} [options] - creation options.
 * @param {string} [options.protectedMode="error"] - "error" to throw error
 *   on `@protected` constraint violation, "warn" to allow violations and
 *   signal a warning.
 * @param overrideProtected `false` allows protected terms to be modified.
 */
api.createTermDefinition = ({
  activeCtx,
  localCtx,
  term,
  defined,
  options,
  overrideProtected = false,
}) => {
  if(defined.has(term)) {
    // term already defined
    if(defined.get(term)) {
      return;
    }
    // cycle detected
    throw new JsonLdError(
      'Cyclical context definition detected.',
      'jsonld.CyclicalContext',
      {code: 'cyclic IRI mapping', context: localCtx, term});
  }

  // now defining term
  defined.set(term, false);

  // get context term value
  let value;
  if(localCtx.hasOwnProperty(term)) {
    value = localCtx[term];
  }

  if(term === '@type' &&
     _isObject(value) &&
     (value['@container'] || '@set') === '@set' &&
     api.processingMode(activeCtx, 1.1)) {

    const validKeys = ['@container', '@id', '@protected'];
    const keys = Object.keys(value);
    if(keys.length === 0 || keys.some(k => !validKeys.includes(k))) {
      throw new JsonLdError(
        'Invalid JSON-LD syntax; keywords cannot be overridden.',
        'jsonld.SyntaxError',
        {code: 'keyword redefinition', context: localCtx, term});
    }
  } else if(api.isKeyword(term)) {
    throw new JsonLdError(
      'Invalid JSON-LD syntax; keywords cannot be overridden.',
      'jsonld.SyntaxError',
      {code: 'keyword redefinition', context: localCtx, term});
  } else if(term.match(KEYWORD_PATTERN)) {
    // FIXME: remove logging and use a handler
    console.warn('WARNING: terms beginning with "@" are reserved' +
      ' for future use and ignored', {term});
    return;
  } else if(term === '') {
    throw new JsonLdError(
      'Invalid JSON-LD syntax; a term cannot be an empty string.',
      'jsonld.SyntaxError',
      {code: 'invalid term definition', context: localCtx});
  }

  // keep reference to previous mapping for potential `@protected` check
  const previousMapping = activeCtx.mappings.get(term);

  // remove old mapping
  if(activeCtx.mappings.has(term)) {
    activeCtx.mappings.delete(term);
  }

  // convert short-hand value to object w/@id
  let simpleTerm = false;
  if(_isString(value) || value === null) {
    simpleTerm = true;
    value = {'@id': value};
  }

  if(!_isObject(value)) {
    throw new JsonLdError(
      'Invalid JSON-LD syntax; @context term values must be ' +
      'strings or objects.',
      'jsonld.SyntaxError',
      {code: 'invalid term definition', context: localCtx});
  }

  // create new mapping
  const mapping = {};
  activeCtx.mappings.set(term, mapping);
  mapping.reverse = false;

  // make sure term definition only has expected keywords
  const validKeys = ['@container', '@id', '@language', '@reverse', '@type'];

  // JSON-LD 1.1 support
  if(api.processingMode(activeCtx, 1.1)) {
    validKeys.push(
      '@context', '@direction', '@index', '@nest', '@prefix', '@protected');
  }

  for(const kw in value) {
    if(!validKeys.includes(kw)) {
      throw new JsonLdError(
        'Invalid JSON-LD syntax; a term definition must not contain ' + kw,
        'jsonld.SyntaxError',
        {code: 'invalid term definition', context: localCtx});
    }
  }

  // always compute whether term has a colon as an optimization for
  // _compactIri
  const colon = term.indexOf(':');
  mapping._termHasColon = (colon > 0);

  if('@reverse' in value) {
    if('@id' in value) {
      throw new JsonLdError(
        'Invalid JSON-LD syntax; a @reverse term definition must not ' +
        'contain @id.', 'jsonld.SyntaxError',
        {code: 'invalid reverse property', context: localCtx});
    }
    if('@nest' in value) {
      throw new JsonLdError(
        'Invalid JSON-LD syntax; a @reverse term definition must not ' +
        'contain @nest.', 'jsonld.SyntaxError',
        {code: 'invalid reverse property', context: localCtx});
    }
    const reverse = value['@reverse'];
    if(!_isString(reverse)) {
      throw new JsonLdError(
        'Invalid JSON-LD syntax; a @context @reverse value must be a string.',
        'jsonld.SyntaxError', {code: 'invalid IRI mapping', context: localCtx});
    }

    if(!api.isKeyword(reverse) && reverse.match(KEYWORD_PATTERN)) {
      // FIXME: remove logging and use a handler
      console.warn('WARNING: values beginning with "@" are reserved' +
        ' for future use and ignored', {reverse});
      if(previousMapping) {
        activeCtx.mappings.set(term, previousMapping);
      } else {
        activeCtx.mappings.delete(term);
      }
      return;
    }

    // expand and add @id mapping
    const id = _expandIri(
      activeCtx, reverse, {vocab: true, base: false}, localCtx, defined,
      options);
    if(!_isAbsoluteIri(id)) {
      throw new JsonLdError(
        'Invalid JSON-LD syntax; a @context @reverse value must be an ' +
        'absolute IRI or a blank node identifier.',
        'jsonld.SyntaxError', {code: 'invalid IRI mapping', context: localCtx});
    }

    mapping['@id'] = id;
    mapping.reverse = true;
  } else if('@id' in value) {
    let id = value['@id'];
    if(id && !_isString(id)) {
      throw new JsonLdError(
        'Invalid JSON-LD syntax; a @context @id value must be an array ' +
        'of strings or a string.',
        'jsonld.SyntaxError', {code: 'invalid IRI mapping', context: localCtx});
    }
    if(id === null) {
      // reserve a null term, which may be protected
      mapping['@id'] = null;
    } else if(!api.isKeyword(id) && id.match(KEYWORD_PATTERN)) {
      // FIXME: remove logging and use a handler
      console.warn('WARNING: values beginning with "@" are reserved' +
        ' for future use and ignored', {id});
      if(previousMapping) {
        activeCtx.mappings.set(term, previousMapping);
      } else {
        activeCtx.mappings.delete(term);
      }
      return;
    } else if(id !== term) {
      // expand and add @id mapping
      id = _expandIri(
        activeCtx, id, {vocab: true, base: false}, localCtx, defined, options);
      if(!_isAbsoluteIri(id) && !api.isKeyword(id)) {
        throw new JsonLdError(
          'Invalid JSON-LD syntax; a @context @id value must be an ' +
          'absolute IRI, a blank node identifier, or a keyword.',
          'jsonld.SyntaxError',
          {code: 'invalid IRI mapping', context: localCtx});
      }

      // if term has the form of an IRI it must map the same
      if(term.match(/(?::[^:])|\//)) {
        const termDefined = new Map(defined).set(term, true);
        const termIri = _expandIri(
          activeCtx, term, {vocab: true, base: false},
          localCtx, termDefined, options);
        if(termIri !== id) {
          throw new JsonLdError(
            'Invalid JSON-LD syntax; term in form of IRI must ' +
            'expand to definition.',
            'jsonld.SyntaxError',
            {code: 'invalid IRI mapping', context: localCtx});
        }
      }

      mapping['@id'] = id;
      // indicate if this term may be used as a compact IRI prefix
      mapping._prefix = (simpleTerm &&
        !mapping._termHasColon &&
        id.match(/[:\/\?#\[\]@]$/));
    }
  }

  if(!('@id' in mapping)) {
    // see if the term has a prefix
    if(mapping._termHasColon) {
      const prefix = term.substr(0, colon);
      if(localCtx.hasOwnProperty(prefix)) {
        // define parent prefix
        api.createTermDefinition({
          activeCtx, localCtx, term: prefix, defined, options
        });
      }

      if(activeCtx.mappings.has(prefix)) {
        // set @id based on prefix parent
        const suffix = term.substr(colon + 1);
        mapping['@id'] = activeCtx.mappings.get(prefix)['@id'] + suffix;
      } else {
        // term is an absolute IRI
        mapping['@id'] = term;
      }
    } else if(term === '@type') {
      // Special case, were we've previously determined that container is @set
      mapping['@id'] = term;
    } else {
      // non-IRIs *must* define @ids if @vocab is not available
      if(!('@vocab' in activeCtx)) {
        throw new JsonLdError(
          'Invalid JSON-LD syntax; @context terms must define an @id.',
          'jsonld.SyntaxError',
          {code: 'invalid IRI mapping', context: localCtx, term});
      }
      // prepend vocab to term
      mapping['@id'] = activeCtx['@vocab'] + term;
    }
  }

  // Handle term protection
  if(value['@protected'] === true ||
    (defined.get('@protected') === true && value['@protected'] !== false)) {
    activeCtx.protected[term] = true;
    mapping.protected = true;
  }

  // IRI mapping now defined
  defined.set(term, true);

  if('@type' in value) {
    let type = value['@type'];
    if(!_isString(type)) {
      throw new JsonLdError(
        'Invalid JSON-LD syntax; an @context @type value must be a string.',
        'jsonld.SyntaxError',
        {code: 'invalid type mapping', context: localCtx});
    }

    if((type === '@json' || type === '@none')) {
      if(api.processingMode(activeCtx, 1.0)) {
        throw new JsonLdError(
          'Invalid JSON-LD syntax; an @context @type value must not be ' +
          `"${type}" in JSON-LD 1.0 mode.`,
          'jsonld.SyntaxError',
          {code: 'invalid type mapping', context: localCtx});
      }
    } else if(type !== '@id' && type !== '@vocab') {
      // expand @type to full IRI
      type = _expandIri(
        activeCtx, type, {vocab: true, base: false}, localCtx, defined,
        options);
      if(!_isAbsoluteIri(type)) {
        throw new JsonLdError(
          'Invalid JSON-LD syntax; an @context @type value must be an ' +
          'absolute IRI.',
          'jsonld.SyntaxError',
          {code: 'invalid type mapping', context: localCtx});
      }
      if(type.indexOf('_:') === 0) {
        throw new JsonLdError(
          'Invalid JSON-LD syntax; an @context @type value must be an IRI, ' +
          'not a blank node identifier.',
          'jsonld.SyntaxError',
          {code: 'invalid type mapping', context: localCtx});
      }
    }

    // add @type to mapping
    mapping['@type'] = type;
  }

  if('@container' in value) {
    // normalize container to an array form
    const container = _isString(value['@container']) ?
      [value['@container']] : (value['@container'] || []);
    const validContainers = ['@list', '@set', '@index', '@language'];
    let isValid = true;
    const hasSet = container.includes('@set');

    // JSON-LD 1.1 support
    if(api.processingMode(activeCtx, 1.1)) {
      validContainers.push('@graph', '@id', '@type');

      // check container length
      if(container.includes('@list')) {
        if(container.length !== 1) {
          throw new JsonLdError(
            'Invalid JSON-LD syntax; @context @container with @list must ' +
            'have no other values',
            'jsonld.SyntaxError',
            {code: 'invalid container mapping', context: localCtx});
        }
      } else if(container.includes('@graph')) {
        if(container.some(key =>
          key !== '@graph' && key !== '@id' && key !== '@index' &&
          key !== '@set')) {
          throw new JsonLdError(
            'Invalid JSON-LD syntax; @context @container with @graph must ' +
            'have no other values other than @id, @index, and @set',
            'jsonld.SyntaxError',
            {code: 'invalid container mapping', context: localCtx});
        }
      } else {
        // otherwise, container may also include @set
        isValid &= container.length <= (hasSet ? 2 : 1);
      }

      if(container.includes('@type')) {
        // If mapping does not have an @type,
        // set it to @id
        mapping['@type'] = mapping['@type'] || '@id';

        // type mapping must be either @id or @vocab
        if(!['@id', '@vocab'].includes(mapping['@type'])) {
          throw new JsonLdError(
            'Invalid JSON-LD syntax; container: @type requires @type to be ' +
            '@id or @vocab.',
            'jsonld.SyntaxError',
            {code: 'invalid type mapping', context: localCtx});
        }
      }
    } else {
      // in JSON-LD 1.0, container must not be an array (it must be a string,
      // which is one of the validContainers)
      isValid &= !_isArray(value['@container']);

      // check container length
      isValid &= container.length <= 1;
    }

    // check against valid containers
    isValid &= container.every(c => validContainers.includes(c));

    // @set not allowed with @list
    isValid &= !(hasSet && container.includes('@list'));

    if(!isValid) {
      throw new JsonLdError(
        'Invalid JSON-LD syntax; @context @container value must be ' +
        'one of the following: ' + validContainers.join(', '),
        'jsonld.SyntaxError',
        {code: 'invalid container mapping', context: localCtx});
    }

    if(mapping.reverse &&
      !container.every(c => ['@index', '@set'].includes(c))) {
      throw new JsonLdError(
        'Invalid JSON-LD syntax; @context @container value for a @reverse ' +
        'type definition must be @index or @set.', 'jsonld.SyntaxError',
        {code: 'invalid reverse property', context: localCtx});
    }

    // add @container to mapping
    mapping['@container'] = container;
  }

  // property indexing
  if('@index' in value) {
    if(!('@container' in value) || !mapping['@container'].includes('@index')) {
      throw new JsonLdError(
        'Invalid JSON-LD syntax; @index without @index in @container: ' +
        `"${value['@index']}" on term "${term}".`, 'jsonld.SyntaxError',
        {code: 'invalid term definition', context: localCtx});
    }
    if(!_isString(value['@index']) || value['@index'].indexOf('@') === 0) {
      throw new JsonLdError(
        'Invalid JSON-LD syntax; @index must expand to an IRI: ' +
        `"${value['@index']}" on term "${term}".`, 'jsonld.SyntaxError',
        {code: 'invalid term definition', context: localCtx});
    }
    mapping['@index'] = value['@index'];
  }

  // scoped contexts
  if('@context' in value) {
    mapping['@context'] = value['@context'];
  }

  if('@language' in value && !('@type' in value)) {
    let language = value['@language'];
    if(language !== null && !_isString(language)) {
      throw new JsonLdError(
        'Invalid JSON-LD syntax; @context @language value must be ' +
        'a string or null.', 'jsonld.SyntaxError',
        {code: 'invalid language mapping', context: localCtx});
    }

    // add @language to mapping
    if(language !== null) {
      language = language.toLowerCase();
    }
    mapping['@language'] = language;
  }

  // term may be used as a prefix
  if('@prefix' in value) {
    if(term.match(/:|\//)) {
      throw new JsonLdError(
        'Invalid JSON-LD syntax; @context @prefix used on a compact IRI term',
        'jsonld.SyntaxError',
        {code: 'invalid term definition', context: localCtx});
    }
    if(api.isKeyword(mapping['@id'])) {
      throw new JsonLdError(
        'Invalid JSON-LD syntax; keywords may not be used as prefixes',
        'jsonld.SyntaxError',
        {code: 'invalid term definition', context: localCtx});
    }
    if(typeof value['@prefix'] === 'boolean') {
      mapping._prefix = value['@prefix'] === true;
    } else {
      throw new JsonLdError(
        'Invalid JSON-LD syntax; @context value for @prefix must be boolean',
        'jsonld.SyntaxError',
        {code: 'invalid @prefix value', context: localCtx});
    }
  }

  if('@direction' in value) {
    const direction = value['@direction'];
    if(direction !== null && direction !== 'ltr' && direction !== 'rtl') {
      throw new JsonLdError(
        'Invalid JSON-LD syntax; @direction value must be ' +
        'null, "ltr", or "rtl".',
        'jsonld.SyntaxError',
        {code: 'invalid base direction', context: localCtx});
    }
    mapping['@direction'] = direction;
  }

  if('@nest' in value) {
    const nest = value['@nest'];
    if(!_isString(nest) || (nest !== '@nest' && nest.indexOf('@') === 0)) {
      throw new JsonLdError(
        'Invalid JSON-LD syntax; @context @nest value must be ' +
        'a string which is not a keyword other than @nest.',
        'jsonld.SyntaxError',
        {code: 'invalid @nest value', context: localCtx});
    }
    mapping['@nest'] = nest;
  }

  // disallow aliasing @context and @preserve
  const id = mapping['@id'];
  if(id === '@context' || id === '@preserve') {
    throw new JsonLdError(
      'Invalid JSON-LD syntax; @context and @preserve cannot be aliased.',
      'jsonld.SyntaxError', {code: 'invalid keyword alias', context: localCtx});
  }

  // Check for overriding protected terms
  if(previousMapping && previousMapping.protected && !overrideProtected) {
    // force new term to continue to be protected and see if the mappings would
    // be equal
    activeCtx.protected[term] = true;
    mapping.protected = true;
    if(!_deepCompare(previousMapping, mapping)) {
      const protectedMode = (options && options.protectedMode) || 'error';
      if(protectedMode === 'error') {
        throw new JsonLdError(
          `Invalid JSON-LD syntax; tried to redefine "${term}" which is a ` +
          'protected term.',
          'jsonld.SyntaxError',
          {code: 'protected term redefinition', context: localCtx, term});
      } else if(protectedMode === 'warn') {
        // FIXME: remove logging and use a handler
        console.warn('WARNING: protected term redefinition', {term});
        return;
      }
      throw new JsonLdError(
        'Invalid protectedMode.',
        'jsonld.SyntaxError',
        {code: 'invalid protected mode', context: localCtx, term,
          protectedMode});
    }
  }
};

/**
 * Expands a string to a full IRI. The string may be a term, a prefix, a
 * relative IRI, or an absolute IRI. The associated absolute IRI will be
 * returned.
 *
 * @param activeCtx the current active context.
 * @param value the string to expand.
 * @param relativeTo options for how to resolve relative IRIs:
 *          base: true to resolve against the base IRI, false not to.
 *          vocab: true to concatenate after @vocab, false not to.
 * @param {Object} [options] - processing options.
 *
 * @return the expanded value.
 */
api.expandIri = (activeCtx, value, relativeTo, options) => {
  return _expandIri(activeCtx, value, relativeTo, undefined, undefined,
    options);
};

/**
 * Expands a string to a full IRI. The string may be a term, a prefix, a
 * relative IRI, or an absolute IRI. The associated absolute IRI will be
 * returned.
 *
 * @param activeCtx the current active context.
 * @param value the string to expand.
 * @param relativeTo options for how to resolve relative IRIs:
 *          base: true to resolve against the base IRI, false not to.
 *          vocab: true to concatenate after @vocab, false not to.
 * @param localCtx the local context being processed (only given if called
 *          during context processing).
 * @param defined a map for tracking cycles in context definitions (only given
 *          if called during context processing).
 * @param {Object} [options] - processing options.
 *
 * @return the expanded value.
 */
function _expandIri(activeCtx, value, relativeTo, localCtx, defined, options) {
  // already expanded
  if(value === null || !_isString(value) || api.isKeyword(value)) {
    return value;
  }

  // ignore non-keyword things that look like a keyword
  if(value.match(KEYWORD_PATTERN)) {
    return null;
  }

  // define term dependency if not defined
  if(localCtx && localCtx.hasOwnProperty(value) &&
    defined.get(value) !== true) {
    api.createTermDefinition({
      activeCtx, localCtx, term: value, defined, options
    });
  }

  relativeTo = relativeTo || {};
  if(relativeTo.vocab) {
    const mapping = activeCtx.mappings.get(value);

    // value is explicitly ignored with a null mapping
    if(mapping === null) {
      return null;
    }

    if(_isObject(mapping) && '@id' in mapping) {
      // value is a term
      return mapping['@id'];
    }
  }

  // split value into prefix:suffix
  const colon = value.indexOf(':');
  if(colon > 0) {
    const prefix = value.substr(0, colon);
    const suffix = value.substr(colon + 1);

    // do not expand blank nodes (prefix of '_') or already-absolute
    // IRIs (suffix of '//')
    if(prefix === '_' || suffix.indexOf('//') === 0) {
      return value;
    }

    // prefix dependency not defined, define it
    if(localCtx && localCtx.hasOwnProperty(prefix)) {
      api.createTermDefinition({
        activeCtx, localCtx, term: prefix, defined, options
      });
    }

    // use mapping if prefix is defined
    const mapping = activeCtx.mappings.get(prefix);
    if(mapping && mapping._prefix) {
      return mapping['@id'] + suffix;
    }

    // already absolute IRI
    if(_isAbsoluteIri(value)) {
      return value;
    }
  }

  // prepend vocab
  if(relativeTo.vocab && '@vocab' in activeCtx) {
    return activeCtx['@vocab'] + value;
  }

  // prepend base
  if(relativeTo.base && '@base' in activeCtx) {
    if(activeCtx['@base']) {
      // The null case preserves value as potentially relative
      return prependBase(prependBase(options.base, activeCtx['@base']), value);
    }
  } else if(relativeTo.base) {
    return prependBase(options.base, value);
  }

  return value;
}

/**
 * Gets the initial context.
 *
 * @param options the options to use:
 *          [base] the document base IRI.
 *
 * @return the initial context.
 */
api.getInitialContext = options => {
  const key = JSON.stringify({processingMode: options.processingMode});
  const cached = INITIAL_CONTEXT_CACHE.get(key);
  if(cached) {
    return cached;
  }

  const initialContext = {
    processingMode: options.processingMode,
    mappings: new Map(),
    inverse: null,
    getInverse: _createInverseContext,
    clone: _cloneActiveContext,
    revertToPreviousContext: _revertToPreviousContext,
    protected: {}
  };
  // TODO: consider using LRU cache instead
  if(INITIAL_CONTEXT_CACHE.size === INITIAL_CONTEXT_CACHE_MAX_SIZE) {
    // clear whole cache -- assumes scenario where the cache fills means
    // the cache isn't being used very efficiently anyway
    INITIAL_CONTEXT_CACHE.clear();
  }
  INITIAL_CONTEXT_CACHE.set(key, initialContext);
  return initialContext;

  /**
   * Generates an inverse context for use in the compaction algorithm, if
   * not already generated for the given active context.
   *
   * @return the inverse context.
   */
  function _createInverseContext() {
    const activeCtx = this;

    // lazily create inverse
    if(activeCtx.inverse) {
      return activeCtx.inverse;
    }
    const inverse = activeCtx.inverse = {};

    // variables for building fast CURIE map
    const fastCurieMap = activeCtx.fastCurieMap = {};
    const irisToTerms = {};

    // handle default language
    const defaultLanguage = (activeCtx['@language'] || '@none').toLowerCase();

    // handle default direction
    const defaultDirection = activeCtx['@direction'];

    // create term selections for each mapping in the context, ordered by
    // shortest and then lexicographically least
    const mappings = activeCtx.mappings;
    const terms = [...mappings.keys()].sort(_compareShortestLeast);
    for(const term of terms) {
      const mapping = mappings.get(term);
      if(mapping === null) {
        continue;
      }

      let container = mapping['@container'] || '@none';
      container = [].concat(container).sort().join('');

      if(mapping['@id'] === null) {
        continue;
      }
      // iterate over every IRI in the mapping
      const ids = _asArray(mapping['@id']);
      for(const iri of ids) {
        let entry = inverse[iri];
        const isKeyword = api.isKeyword(iri);

        if(!entry) {
          // initialize entry
          inverse[iri] = entry = {};

          if(!isKeyword && !mapping._termHasColon) {
            // init IRI to term map and fast CURIE prefixes
            irisToTerms[iri] = [term];
            const fastCurieEntry = {iri, terms: irisToTerms[iri]};
            if(iri[0] in fastCurieMap) {
              fastCurieMap[iri[0]].push(fastCurieEntry);
            } else {
              fastCurieMap[iri[0]] = [fastCurieEntry];
            }
          }
        } else if(!isKeyword && !mapping._termHasColon) {
          // add IRI to term match
          irisToTerms[iri].push(term);
        }

        // add new entry
        if(!entry[container]) {
          entry[container] = {
            '@language': {},
            '@type': {},
            '@any': {}
          };
        }
        entry = entry[container];
        _addPreferredTerm(term, entry['@any'], '@none');

        if(mapping.reverse) {
          // term is preferred for values using @reverse
          _addPreferredTerm(term, entry['@type'], '@reverse');
        } else if(mapping['@type'] === '@none') {
          _addPreferredTerm(term, entry['@any'], '@none');
          _addPreferredTerm(term, entry['@language'], '@none');
          _addPreferredTerm(term, entry['@type'], '@none');
        } else if('@type' in mapping) {
          // term is preferred for values using specific type
          _addPreferredTerm(term, entry['@type'], mapping['@type']);
        } else if('@language' in mapping && '@direction' in mapping) {
          // term is preferred for values using specific language and direction
          const language = mapping['@language'];
          const direction = mapping['@direction'];
          if(language && direction) {
            _addPreferredTerm(term, entry['@language'],
              `${language}_${direction}`.toLowerCase());
          } else if(language) {
            _addPreferredTerm(term, entry['@language'], language.toLowerCase());
          } else if(direction) {
            _addPreferredTerm(term, entry['@language'], `_${direction}`);
          } else {
            _addPreferredTerm(term, entry['@language'], '@null');
          }
        } else if('@language' in mapping) {
          _addPreferredTerm(term, entry['@language'],
            (mapping['@language'] || '@null').toLowerCase());
        } else if('@direction' in mapping) {
          if(mapping['@direction']) {
            _addPreferredTerm(term, entry['@language'],
              `_${mapping['@direction']}`);
          } else {
            _addPreferredTerm(term, entry['@language'], '@none');
          }
        } else if(defaultDirection) {
          _addPreferredTerm(term, entry['@language'], `_${defaultDirection}`);
          _addPreferredTerm(term, entry['@language'], '@none');
          _addPreferredTerm(term, entry['@type'], '@none');
        } else {
          // add entries for no type and no language
          _addPreferredTerm(term, entry['@language'], defaultLanguage);
          _addPreferredTerm(term, entry['@language'], '@none');
          _addPreferredTerm(term, entry['@type'], '@none');
        }
      }
    }

    // build fast CURIE map
    for(const key in fastCurieMap) {
      _buildIriMap(fastCurieMap, key, 1);
    }

    return inverse;
  }

  /**
   * Runs a recursive algorithm to build a lookup map for quickly finding
   * potential CURIEs.
   *
   * @param iriMap the map to build.
   * @param key the current key in the map to work on.
   * @param idx the index into the IRI to compare.
   */
  function _buildIriMap(iriMap, key, idx) {
    const entries = iriMap[key];
    const next = iriMap[key] = {};

    let iri;
    let letter;
    for(const entry of entries) {
      iri = entry.iri;
      if(idx >= iri.length) {
        letter = '';
      } else {
        letter = iri[idx];
      }
      if(letter in next) {
        next[letter].push(entry);
      } else {
        next[letter] = [entry];
      }
    }

    for(const key in next) {
      if(key === '') {
        continue;
      }
      _buildIriMap(next, key, idx + 1);
    }
  }

  /**
   * Adds the term for the given entry if not already added.
   *
   * @param term the term to add.
   * @param entry the inverse context typeOrLanguage entry to add to.
   * @param typeOrLanguageValue the key in the entry to add to.
   */
  function _addPreferredTerm(term, entry, typeOrLanguageValue) {
    if(!entry.hasOwnProperty(typeOrLanguageValue)) {
      entry[typeOrLanguageValue] = term;
    }
  }

  /**
   * Clones an active context, creating a child active context.
   *
   * @return a clone (child) of the active context.
   */
  function _cloneActiveContext() {
    const child = {};
    child.mappings = util.clone(this.mappings);
    child.clone = this.clone;
    child.inverse = null;
    child.getInverse = this.getInverse;
    child.protected = util.clone(this.protected);
    if(this.previousContext) {
      child.previousContext = this.previousContext.clone();
    }
    child.revertToPreviousContext = this.revertToPreviousContext;
    if('@base' in this) {
      child['@base'] = this['@base'];
    }
    if('@language' in this) {
      child['@language'] = this['@language'];
    }
    if('@vocab' in this) {
      child['@vocab'] = this['@vocab'];
    }
    return child;
  }

  /**
   * Reverts any type-scoped context in this active context to the previous
   * context.
   */
  function _revertToPreviousContext() {
    if(!this.previousContext) {
      return this;
    }
    return this.previousContext.clone();
  }
};

/**
 * Gets the value for the given active context key and type, null if none is
 * set or undefined if none is set and type is '@context'.
 *
 * @param ctx the active context.
 * @param key the context key.
 * @param [type] the type of value to get (eg: '@id', '@type'), if not
 *          specified gets the entire entry for a key, null if not found.
 *
 * @return the value, null, or undefined.
 */
api.getContextValue = (ctx, key, type) => {
  // invalid key
  if(key === null) {
    if(type === '@context') {
      return undefined;
    }
    return null;
  }

  // get specific entry information
  if(ctx.mappings.has(key)) {
    const entry = ctx.mappings.get(key);

    if(_isUndefined(type)) {
      // return whole entry
      return entry;
    }
    if(entry.hasOwnProperty(type)) {
      // return entry value for type
      return entry[type];
    }
  }

  // get default language
  if(type === '@language' && type in ctx) {
    return ctx[type];
  }

  // get default direction
  if(type === '@direction' && type in ctx) {
    return ctx[type];
  }

  if(type === '@context') {
    return undefined;
  }
  return null;
};

/**
 * Processing Mode check.
 *
 * @param activeCtx the current active context.
 * @param version the string or numeric version to check.
 *
 * @return boolean.
 */
api.processingMode = (activeCtx, version) => {
  if(version.toString() >= '1.1') {
    return !activeCtx.processingMode ||
      activeCtx.processingMode >= 'json-ld-' + version.toString();
  } else {
    return activeCtx.processingMode === 'json-ld-1.0';
  }
};

/**
 * Returns whether or not the given value is a keyword.
 *
 * @param v the value to check.
 *
 * @return true if the value is a keyword, false if not.
 */
api.isKeyword = v => {
  if(!_isString(v) || v[0] !== '@') {
    return false;
  }
  switch(v) {
    case '@base':
    case '@container':
    case '@context':
    case '@default':
    case '@direction':
    case '@embed':
    case '@explicit':
    case '@graph':
    case '@id':
    case '@included':
    case '@index':
    case '@json':
    case '@language':
    case '@list':
    case '@nest':
    case '@none':
    case '@omitDefault':
    case '@prefix':
    case '@preserve':
    case '@protected':
    case '@requireAll':
    case '@reverse':
    case '@set':
    case '@type':
    case '@value':
    case '@version':
    case '@vocab':
      return true;
  }
  return false;
};

function _deepCompare(x1, x2) {
  // compare `null` or primitive types directly
  if((!(x1 && typeof x1 === 'object')) ||
     (!(x2 && typeof x2 === 'object'))) {
    return x1 === x2;
  }
  // x1 and x2 are objects (also potentially arrays)
  const x1Array = Array.isArray(x1);
  if(x1Array !== Array.isArray(x2)) {
    return false;
  }
  if(x1Array) {
    if(x1.length !== x2.length) {
      return false;
    }
    for(let i = 0; i < x1.length; ++i) {
      if(!_deepCompare(x1[i], x2[i])) {
        return false;
      }
    }
    return true;
  }
  // x1 and x2 are non-array objects
  const k1s = Object.keys(x1);
  const k2s = Object.keys(x2);
  if(k1s.length !== k2s.length) {
    return false;
  }
  for(const k1 in x1) {
    let v1 = x1[k1];
    let v2 = x2[k1];
    // special case: `@container` can be in any order
    if(k1 === '@container') {
      if(Array.isArray(v1) && Array.isArray(v2)) {
        v1 = v1.slice().sort();
        v2 = v2.slice().sort();
      }
    }
    if(!_deepCompare(v1, v2)) {
      return false;
    }
  }
  return true;
}

},{"./JsonLdError":47,"./types":65,"./url":66,"./util":67}],55:[function(_dereq_,module,exports){
/*
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const {parseLinkHeader, buildHeaders} = _dereq_('../util');
const {LINK_HEADER_CONTEXT} = _dereq_('../constants');
const JsonLdError = _dereq_('../JsonLdError');
const RequestQueue = _dereq_('../RequestQueue');
const {prependBase} = _dereq_('../url');

const REGEX_LINK_HEADER = /(^|(\r\n))link:/i;

/**
 * Creates a built-in XMLHttpRequest document loader.
 *
 * @param options the options to use:
 *          secure: require all URLs to use HTTPS.
 *          headers: an object (map) of headers which will be passed as request
 *            headers for the requested document. Accept is not allowed.
 *          [xhr]: the XMLHttpRequest API to use.
 *
 * @return the XMLHttpRequest document loader.
 */
module.exports = ({
  secure,
  headers = {},
  xhr
} = {headers: {}}) => {
  headers = buildHeaders(headers);
  const queue = new RequestQueue();
  return queue.wrapLoader(loader);

  async function loader(url) {
    if(url.indexOf('http:') !== 0 && url.indexOf('https:') !== 0) {
      throw new JsonLdError(
        'URL could not be dereferenced; only "http" and "https" URLs are ' +
        'supported.',
        'jsonld.InvalidUrl', {code: 'loading document failed', url});
    }
    if(secure && url.indexOf('https') !== 0) {
      throw new JsonLdError(
        'URL could not be dereferenced; secure mode is enabled and ' +
        'the URL\'s scheme is not "https".',
        'jsonld.InvalidUrl', {code: 'loading document failed', url});
    }

    let req;
    try {
      req = await _get(xhr, url, headers);
    } catch(e) {
      throw new JsonLdError(
        'URL could not be dereferenced, an error occurred.',
        'jsonld.LoadDocumentError',
        {code: 'loading document failed', url, cause: e});
    }

    if(req.status >= 400) {
      throw new JsonLdError(
        'URL could not be dereferenced: ' + req.statusText,
        'jsonld.LoadDocumentError', {
          code: 'loading document failed',
          url,
          httpStatusCode: req.status
        });
    }

    let doc = {contextUrl: null, documentUrl: url, document: req.response};
    let alternate = null;

    // handle Link Header (avoid unsafe header warning by existence testing)
    const contentType = req.getResponseHeader('Content-Type');
    let linkHeader;
    if(REGEX_LINK_HEADER.test(req.getAllResponseHeaders())) {
      linkHeader = req.getResponseHeader('Link');
    }
    if(linkHeader && contentType !== 'application/ld+json') {
      // only 1 related link header permitted
      const linkHeaders = parseLinkHeader(linkHeader);
      const linkedContext = linkHeaders[LINK_HEADER_CONTEXT];
      if(Array.isArray(linkedContext)) {
        throw new JsonLdError(
          'URL could not be dereferenced, it has more than one ' +
          'associated HTTP Link Header.',
          'jsonld.InvalidUrl',
          {code: 'multiple context link headers', url});
      }
      if(linkedContext) {
        doc.contextUrl = linkedContext.target;
      }

      // "alternate" link header is a redirect
      alternate = linkHeaders['alternate'];
      if(alternate &&
        alternate.type == 'application/ld+json' &&
        !(contentType || '').match(/^application\/(\w*\+)?json$/)) {
        doc = await loader(prependBase(url, alternate.target));
      }
    }

    return doc;
  }
};

function _get(xhr, url, headers) {
  xhr = xhr || XMLHttpRequest;
  const req = new xhr();
  return new Promise((resolve, reject) => {
    req.onload = () => resolve(req);
    req.onerror = err => reject(err);
    req.open('GET', url, true);
    for(const k in headers) {
      req.setRequestHeader(k, headers[k]);
    }
    req.send();
  });
}

},{"../JsonLdError":47,"../RequestQueue":50,"../constants":53,"../url":66,"../util":67}],56:[function(_dereq_,module,exports){
/*
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const JsonLdError = _dereq_('./JsonLdError');

const {
  isArray: _isArray,
  isObject: _isObject,
  isEmptyObject: _isEmptyObject,
  isString: _isString,
  isUndefined: _isUndefined
} = _dereq_('./types');

const {
  isList: _isList,
  isValue: _isValue,
  isGraph: _isGraph,
  isSubject: _isSubject
} = _dereq_('./graphTypes');

const {
  expandIri: _expandIri,
  getContextValue: _getContextValue,
  isKeyword: _isKeyword,
  process: _processContext,
  processingMode: _processingMode
} = _dereq_('./context');

const {
  isAbsolute: _isAbsoluteIri
} = _dereq_('./url');

const {
  addValue: _addValue,
  asArray: _asArray,
  getValues: _getValues,
  validateTypeValue: _validateTypeValue
} = _dereq_('./util');

const api = {};
module.exports = api;
const REGEX_BCP47 = /^[a-zA-Z]{1,8}(-[a-zA-Z0-9]{1,8})*$/;

/**
 * Recursively expands an element using the given context. Any context in
 * the element will be removed. All context URLs must have been retrieved
 * before calling this method.
 *
 * @param activeCtx the context to use.
 * @param activeProperty the property for the element, null for none.
 * @param element the element to expand.
 * @param options the expansion options.
 * @param insideList true if the element is a list, false if not.
 * @param insideIndex true if the element is inside an index container,
 *          false if not.
 * @param typeScopedContext an optional type-scoped active context for
 *          expanding values of nodes that were expressed according to
 *          a type-scoped context.
 * @param expansionMap(info) a function that can be used to custom map
 *          unmappable values (or to throw an error when they are detected);
 *          if this function returns `undefined` then the default behavior
 *          will be used.
 *
 * @return a Promise that resolves to the expanded value.
 */
api.expand = async ({
  activeCtx,
  activeProperty = null,
  element,
  options = {},
  insideList = false,
  insideIndex = false,
  typeScopedContext = null,
  expansionMap = () => undefined
}) => {
  // nothing to expand
  if(element === null || element === undefined) {
    return null;
  }

  // disable framing if activeProperty is @default
  if(activeProperty === '@default') {
    options = Object.assign({}, options, {isFrame: false});
  }

  if(!_isArray(element) && !_isObject(element)) {
    // drop free-floating scalars that are not in lists unless custom mapped
    if(!insideList && (activeProperty === null ||
      _expandIri(activeCtx, activeProperty, {vocab: true},
        options) === '@graph')) {
      const mapped = await expansionMap({
        unmappedValue: element,
        activeCtx,
        activeProperty,
        options,
        insideList
      });
      if(mapped === undefined) {
        return null;
      }
      return mapped;
    }

    // expand element according to value expansion rules
    return _expandValue({activeCtx, activeProperty, value: element, options});
  }

  // recursively expand array
  if(_isArray(element)) {
    let rval = [];
    const container = _getContextValue(
      activeCtx, activeProperty, '@container') || [];
    insideList = insideList || container.includes('@list');
    for(let i = 0; i < element.length; ++i) {
      // expand element
      let e = await api.expand({
        activeCtx,
        activeProperty,
        element: element[i],
        options,
        expansionMap,
        insideIndex,
        typeScopedContext
      });
      if(insideList && _isArray(e)) {
        e = {'@list': e};
      }

      if(e === null) {
        e = await expansionMap({
          unmappedValue: element[i],
          activeCtx,
          activeProperty,
          parent: element,
          index: i,
          options,
          expandedParent: rval,
          insideList
        });
        if(e === undefined) {
          continue;
        }
      }

      if(_isArray(e)) {
        rval = rval.concat(e);
      } else {
        rval.push(e);
      }
    }
    return rval;
  }

  // recursively expand object:

  // first, expand the active property
  const expandedActiveProperty = _expandIri(
    activeCtx, activeProperty, {vocab: true}, options);

  // Get any property-scoped context for activeProperty
  const propertyScopedCtx =
    _getContextValue(activeCtx, activeProperty, '@context');

  // second, determine if any type-scoped context should be reverted; it
  // should only be reverted when the following are all true:
  // 1. `element` is not a value or subject reference
  // 2. `insideIndex` is false
  typeScopedContext = typeScopedContext ||
    (activeCtx.previousContext ? activeCtx : null);
  let keys = Object.keys(element).sort();
  let mustRevert = !insideIndex;
  if(mustRevert && typeScopedContext && keys.length <= 2 &&
    !keys.includes('@context')) {
    for(const key of keys) {
      const expandedProperty = _expandIri(
        typeScopedContext, key, {vocab: true}, options);
      if(expandedProperty === '@value') {
        // value found, ensure type-scoped context is used to expand it
        mustRevert = false;
        activeCtx = typeScopedContext;
        break;
      }
      if(expandedProperty === '@id' && keys.length === 1) {
        // subject reference found, do not revert
        mustRevert = false;
        break;
      }
    }
  }

  if(mustRevert) {
    // revert type scoped context
    activeCtx = activeCtx.revertToPreviousContext();
  }

  // apply property-scoped context after reverting term-scoped context
  if(!_isUndefined(propertyScopedCtx)) {
    activeCtx = await _processContext({
      activeCtx,
      localCtx: propertyScopedCtx,
      propagate: true,
      overrideProtected: true,
      options
    });
  }

  // if element has a context, process it
  if('@context' in element) {
    activeCtx = await _processContext(
      {activeCtx, localCtx: element['@context'], options});
  }

  // set the type-scoped context to the context on input, for use later
  typeScopedContext = activeCtx;

  // Remember the first key found expanding to @type
  let typeKey = null;

  // look for scoped contexts on `@type`
  for(const key of keys) {
    const expandedProperty = _expandIri(activeCtx, key, {vocab: true}, options);
    if(expandedProperty === '@type') {
      // set scoped contexts from @type
      // avoid sorting if possible
      typeKey = typeKey || key;
      const value = element[key];
      const types =
        Array.isArray(value) ?
          (value.length > 1 ? value.slice().sort() : value) : [value];
      for(const type of types) {
        const ctx = _getContextValue(typeScopedContext, type, '@context');
        if(!_isUndefined(ctx)) {
          activeCtx = await _processContext({
            activeCtx,
            localCtx: ctx,
            options,
            propagate: false
          });
        }
      }
    }
  }

  // process each key and value in element, ignoring @nest content
  let rval = {};
  await _expandObject({
    activeCtx,
    activeProperty,
    expandedActiveProperty,
    element,
    expandedParent: rval,
    options,
    insideList,
    typeKey,
    typeScopedContext,
    expansionMap});

  // get property count on expanded output
  keys = Object.keys(rval);
  let count = keys.length;

  if('@value' in rval) {
    // @value must only have @language or @type
    if('@type' in rval && ('@language' in rval || '@direction' in rval)) {
      throw new JsonLdError(
        'Invalid JSON-LD syntax; an element containing "@value" may not ' +
        'contain both "@type" and either "@language" or "@direction".',
        'jsonld.SyntaxError', {code: 'invalid value object', element: rval});
    }
    let validCount = count - 1;
    if('@type' in rval) {
      validCount -= 1;
    }
    if('@index' in rval) {
      validCount -= 1;
    }
    if('@language' in rval) {
      validCount -= 1;
    }
    if('@direction' in rval) {
      validCount -= 1;
    }
    if(validCount !== 0) {
      throw new JsonLdError(
        'Invalid JSON-LD syntax; an element containing "@value" may only ' +
        'have an "@index" property and either "@type" ' +
        'or either or both "@language" or "@direction".',
        'jsonld.SyntaxError', {code: 'invalid value object', element: rval});
    }
    const values = rval['@value'] === null ? [] : _asArray(rval['@value']);
    const types = _getValues(rval, '@type');

    // drop null @values unless custom mapped
    if(_processingMode(activeCtx, 1.1) && types.includes('@json') &&
      types.length === 1) {
      // Any value of @value is okay if @type: @json
    } else if(values.length === 0) {
      const mapped = await expansionMap({
        unmappedValue: rval,
        activeCtx,
        activeProperty,
        element,
        options,
        insideList
      });
      if(mapped !== undefined) {
        rval = mapped;
      } else {
        rval = null;
      }
    } else if(!values.every(v => (_isString(v) || _isEmptyObject(v))) &&
      '@language' in rval) {
      // if @language is present, @value must be a string
      throw new JsonLdError(
        'Invalid JSON-LD syntax; only strings may be language-tagged.',
        'jsonld.SyntaxError',
        {code: 'invalid language-tagged value', element: rval});
    } else if(!types.every(t =>
      (_isAbsoluteIri(t) && !(_isString(t) && t.indexOf('_:') === 0) ||
      _isEmptyObject(t)))) {
      throw new JsonLdError(
        'Invalid JSON-LD syntax; an element containing "@value" and "@type" ' +
        'must have an absolute IRI for the value of "@type".',
        'jsonld.SyntaxError', {code: 'invalid typed value', element: rval});
    }
  } else if('@type' in rval && !_isArray(rval['@type'])) {
    // convert @type to an array
    rval['@type'] = [rval['@type']];
  } else if('@set' in rval || '@list' in rval) {
    // handle @set and @list
    if(count > 1 && !(count === 2 && '@index' in rval)) {
      throw new JsonLdError(
        'Invalid JSON-LD syntax; if an element has the property "@set" ' +
        'or "@list", then it can have at most one other property that is ' +
        '"@index".', 'jsonld.SyntaxError',
        {code: 'invalid set or list object', element: rval});
    }
    // optimize away @set
    if('@set' in rval) {
      rval = rval['@set'];
      keys = Object.keys(rval);
      count = keys.length;
    }
  } else if(count === 1 && '@language' in rval) {
    // drop objects with only @language unless custom mapped
    const mapped = await expansionMap(rval, {
      unmappedValue: rval,
      activeCtx,
      activeProperty,
      element,
      options,
      insideList
    });
    if(mapped !== undefined) {
      rval = mapped;
    } else {
      rval = null;
    }
  }

  // drop certain top-level objects that do not occur in lists, unless custom
  // mapped
  if(_isObject(rval) &&
    !options.keepFreeFloatingNodes && !insideList &&
    (activeProperty === null || expandedActiveProperty === '@graph')) {
    // drop empty object, top-level @value/@list, or object with only @id
    if(count === 0 || '@value' in rval || '@list' in rval ||
      (count === 1 && '@id' in rval)) {
      const mapped = await expansionMap({
        unmappedValue: rval,
        activeCtx,
        activeProperty,
        element,
        options,
        insideList
      });
      if(mapped !== undefined) {
        rval = mapped;
      } else {
        rval = null;
      }
    }
  }

  return rval;
};

/**
 * Expand each key and value of element adding to result
 *
 * @param activeCtx the context to use.
 * @param activeProperty the property for the element.
 * @param expandedActiveProperty the expansion of activeProperty
 * @param element the element to expand.
 * @param expandedParent the expanded result into which to add values.
 * @param options the expansion options.
 * @param insideList true if the element is a list, false if not.
 * @param typeKey first key found expanding to @type.
 * @param typeScopedContext the context before reverting.
 * @param expansionMap(info) a function that can be used to custom map
 *          unmappable values (or to throw an error when they are detected);
 *          if this function returns `undefined` then the default behavior
 *          will be used.
 */
async function _expandObject({
  activeCtx,
  activeProperty,
  expandedActiveProperty,
  element,
  expandedParent,
  options = {},
  insideList,
  typeKey,
  typeScopedContext,
  expansionMap
}) {
  const keys = Object.keys(element).sort();
  const nests = [];
  let unexpandedValue;

  // Figure out if this is the type for a JSON literal
  const isJsonType = element[typeKey] &&
    _expandIri(activeCtx,
      (_isArray(element[typeKey]) ? element[typeKey][0] : element[typeKey]),
      {vocab: true}, options) === '@json';

  for(const key of keys) {
    let value = element[key];
    let expandedValue;

    // skip @context
    if(key === '@context') {
      continue;
    }

    // expand property
    let expandedProperty = _expandIri(activeCtx, key, {vocab: true}, options);

    // drop non-absolute IRI keys that aren't keywords unless custom mapped
    if(expandedProperty === null ||
      !(_isAbsoluteIri(expandedProperty) || _isKeyword(expandedProperty))) {
      // TODO: use `await` to support async
      expandedProperty = expansionMap({
        unmappedProperty: key,
        activeCtx,
        activeProperty,
        parent: element,
        options,
        insideList,
        value,
        expandedParent
      });
      if(expandedProperty === undefined) {
        continue;
      }
    }

    if(_isKeyword(expandedProperty)) {
      if(expandedActiveProperty === '@reverse') {
        throw new JsonLdError(
          'Invalid JSON-LD syntax; a keyword cannot be used as a @reverse ' +
          'property.', 'jsonld.SyntaxError',
          {code: 'invalid reverse property map', value});
      }
      if(expandedProperty in expandedParent &&
         expandedProperty !== '@included' &&
         expandedProperty !== '@type') {
        throw new JsonLdError(
          'Invalid JSON-LD syntax; colliding keywords detected.',
          'jsonld.SyntaxError',
          {code: 'colliding keywords', keyword: expandedProperty});
      }
    }

    // syntax error if @id is not a string
    if(expandedProperty === '@id') {
      if(!_isString(value)) {
        if(!options.isFrame) {
          throw new JsonLdError(
            'Invalid JSON-LD syntax; "@id" value must a string.',
            'jsonld.SyntaxError', {code: 'invalid @id value', value});
        }
        if(_isObject(value)) {
          // empty object is a wildcard
          if(!_isEmptyObject(value)) {
            throw new JsonLdError(
              'Invalid JSON-LD syntax; "@id" value an empty object or array ' +
              'of strings, if framing',
              'jsonld.SyntaxError', {code: 'invalid @id value', value});
          }
        } else if(_isArray(value)) {
          if(!value.every(v => _isString(v))) {
            throw new JsonLdError(
              'Invalid JSON-LD syntax; "@id" value an empty object or array ' +
              'of strings, if framing',
              'jsonld.SyntaxError', {code: 'invalid @id value', value});
          }
        } else {
          throw new JsonLdError(
            'Invalid JSON-LD syntax; "@id" value an empty object or array ' +
            'of strings, if framing',
            'jsonld.SyntaxError', {code: 'invalid @id value', value});
        }
      }

      _addValue(
        expandedParent, '@id',
        _asArray(value).map(v =>
          _isString(v) ? _expandIri(activeCtx, v, {base: true}, options) : v),
        {propertyIsArray: options.isFrame});
      continue;
    }

    if(expandedProperty === '@type') {
      // if framing, can be a default object, but need to expand
      // key to determine that
      if(_isObject(value)) {
        value = Object.fromEntries(Object.entries(value).map(([k, v]) => [
          _expandIri(typeScopedContext, k, {vocab: true}),
          _asArray(v).map(vv =>
            _expandIri(typeScopedContext, vv, {base: true, vocab: true})
          )
        ]));
      }
      _validateTypeValue(value, options.isFrame);
      _addValue(
        expandedParent, '@type',
        _asArray(value).map(v =>
          _isString(v) ?
            _expandIri(typeScopedContext, v,
              {base: true, vocab: true}, options) : v),
        {propertyIsArray: options.isFrame});
      continue;
    }

    // Included blocks are treated as an array of separate object nodes sharing
    // the same referencing active_property.
    // For 1.0, it is skipped as are other unknown keywords
    if(expandedProperty === '@included' && _processingMode(activeCtx, 1.1)) {
      const includedResult = _asArray(await api.expand({
        activeCtx,
        activeProperty,
        element: value,
        options,
        expansionMap
      }));

      // Expanded values must be node objects
      if(!includedResult.every(v => _isSubject(v))) {
        throw new JsonLdError(
          'Invalid JSON-LD syntax; ' +
          'values of @included must expand to node objects.',
          'jsonld.SyntaxError', {code: 'invalid @included value', value});
      }

      _addValue(
        expandedParent, '@included', includedResult, {propertyIsArray: true});
      continue;
    }

    // @graph must be an array or an object
    if(expandedProperty === '@graph' &&
      !(_isObject(value) || _isArray(value))) {
      throw new JsonLdError(
        'Invalid JSON-LD syntax; "@graph" value must not be an ' +
        'object or an array.',
        'jsonld.SyntaxError', {code: 'invalid @graph value', value});
    }

    if(expandedProperty === '@value') {
      // capture value for later
      // "colliding keywords" check prevents this from being set twice
      unexpandedValue = value;
      if(isJsonType && _processingMode(activeCtx, 1.1)) {
        // no coercion to array, and retain all values
        expandedParent['@value'] = value;
      } else {
        _addValue(
          expandedParent, '@value', value, {propertyIsArray: options.isFrame});
      }
      continue;
    }

    // @language must be a string
    // it should match BCP47
    if(expandedProperty === '@language') {
      if(value === null) {
        // drop null @language values, they expand as if they didn't exist
        continue;
      }
      if(!_isString(value) && !options.isFrame) {
        throw new JsonLdError(
          'Invalid JSON-LD syntax; "@language" value must be a string.',
          'jsonld.SyntaxError',
          {code: 'invalid language-tagged string', value});
      }
      // ensure language value is lowercase
      value = _asArray(value).map(v => _isString(v) ? v.toLowerCase() : v);

      // ensure language tag matches BCP47
      for(const lang of value) {
        if(_isString(lang) && !lang.match(REGEX_BCP47)) {
          console.warn(`@language must be valid BCP47: ${lang}`);
        }
      }

      _addValue(
        expandedParent, '@language', value, {propertyIsArray: options.isFrame});
      continue;
    }

    // @direction must be "ltr" or "rtl"
    if(expandedProperty === '@direction') {
      if(!_isString(value) && !options.isFrame) {
        throw new JsonLdError(
          'Invalid JSON-LD syntax; "@direction" value must be a string.',
          'jsonld.SyntaxError',
          {code: 'invalid base direction', value});
      }

      value = _asArray(value);

      // ensure direction is "ltr" or "rtl"
      for(const dir of value) {
        if(_isString(dir) && dir !== 'ltr' && dir !== 'rtl') {
          throw new JsonLdError(
            'Invalid JSON-LD syntax; "@direction" must be "ltr" or "rtl".',
            'jsonld.SyntaxError',
            {code: 'invalid base direction', value});
        }
      }

      _addValue(
        expandedParent, '@direction', value,
        {propertyIsArray: options.isFrame});
      continue;
    }

    // @index must be a string
    if(expandedProperty === '@index') {
      if(!_isString(value)) {
        throw new JsonLdError(
          'Invalid JSON-LD syntax; "@index" value must be a string.',
          'jsonld.SyntaxError',
          {code: 'invalid @index value', value});
      }
      _addValue(expandedParent, '@index', value);
      continue;
    }

    // @reverse must be an object
    if(expandedProperty === '@reverse') {
      if(!_isObject(value)) {
        throw new JsonLdError(
          'Invalid JSON-LD syntax; "@reverse" value must be an object.',
          'jsonld.SyntaxError', {code: 'invalid @reverse value', value});
      }

      expandedValue = await api.expand({
        activeCtx,
        activeProperty:
        '@reverse',
        element: value,
        options,
        expansionMap
      });
      // properties double-reversed
      if('@reverse' in expandedValue) {
        for(const property in expandedValue['@reverse']) {
          _addValue(
            expandedParent, property, expandedValue['@reverse'][property],
            {propertyIsArray: true});
        }
      }

      // FIXME: can this be merged with code below to simplify?
      // merge in all reversed properties
      let reverseMap = expandedParent['@reverse'] || null;
      for(const property in expandedValue) {
        if(property === '@reverse') {
          continue;
        }
        if(reverseMap === null) {
          reverseMap = expandedParent['@reverse'] = {};
        }
        _addValue(reverseMap, property, [], {propertyIsArray: true});
        const items = expandedValue[property];
        for(let ii = 0; ii < items.length; ++ii) {
          const item = items[ii];
          if(_isValue(item) || _isList(item)) {
            throw new JsonLdError(
              'Invalid JSON-LD syntax; "@reverse" value must not be a ' +
              '@value or an @list.', 'jsonld.SyntaxError',
              {code: 'invalid reverse property value', value: expandedValue});
          }
          _addValue(reverseMap, property, item, {propertyIsArray: true});
        }
      }

      continue;
    }

    // nested keys
    if(expandedProperty === '@nest') {
      nests.push(key);
      continue;
    }

    // use potential scoped context for key
    let termCtx = activeCtx;
    const ctx = _getContextValue(activeCtx, key, '@context');
    if(!_isUndefined(ctx)) {
      termCtx = await _processContext({
        activeCtx,
        localCtx: ctx,
        propagate: true,
        overrideProtected: true,
        options
      });
    }

    const container = _getContextValue(termCtx, key, '@container') || [];

    if(container.includes('@language') && _isObject(value)) {
      const direction = _getContextValue(termCtx, key, '@direction');
      // handle language map container (skip if value is not an object)
      expandedValue = _expandLanguageMap(termCtx, value, direction, options);
    } else if(container.includes('@index') && _isObject(value)) {
      // handle index container (skip if value is not an object)
      const asGraph = container.includes('@graph');
      const indexKey = _getContextValue(termCtx, key, '@index') || '@index';
      const propertyIndex = indexKey !== '@index' &&
        _expandIri(activeCtx, indexKey, {vocab: true}, options);

      expandedValue = await _expandIndexMap({
        activeCtx: termCtx,
        options,
        activeProperty: key,
        value,
        expansionMap,
        asGraph,
        indexKey,
        propertyIndex
      });
    } else if(container.includes('@id') && _isObject(value)) {
      // handle id container (skip if value is not an object)
      const asGraph = container.includes('@graph');
      expandedValue = await _expandIndexMap({
        activeCtx: termCtx,
        options,
        activeProperty: key,
        value,
        expansionMap,
        asGraph,
        indexKey: '@id'
      });
    } else if(container.includes('@type') && _isObject(value)) {
      // handle type container (skip if value is not an object)
      expandedValue = await _expandIndexMap({
        // since container is `@type`, revert type scoped context when expanding
        activeCtx: termCtx.revertToPreviousContext(),
        options,
        activeProperty: key,
        value,
        expansionMap,
        asGraph: false,
        indexKey: '@type'
      });
    } else {
      // recurse into @list or @set
      const isList = (expandedProperty === '@list');
      if(isList || expandedProperty === '@set') {
        let nextActiveProperty = activeProperty;
        if(isList && expandedActiveProperty === '@graph') {
          nextActiveProperty = null;
        }
        expandedValue = await api.expand({
          activeCtx: termCtx,
          activeProperty: nextActiveProperty,
          element: value,
          options,
          insideList: isList,
          expansionMap
        });
      } else if(
        _getContextValue(activeCtx, key, '@type') === '@json') {
        expandedValue = {
          '@type': '@json',
          '@value': value
        };
      } else {
        // recursively expand value with key as new active property
        expandedValue = await api.expand({
          activeCtx: termCtx,
          activeProperty: key,
          element: value,
          options,
          insideList: false,
          expansionMap
        });
      }
    }

    // drop null values if property is not @value
    if(expandedValue === null && expandedProperty !== '@value') {
      // TODO: use `await` to support async
      expandedValue = expansionMap({
        unmappedValue: value,
        expandedProperty,
        activeCtx: termCtx,
        activeProperty,
        parent: element,
        options,
        insideList,
        key,
        expandedParent
      });
      if(expandedValue === undefined) {
        continue;
      }
    }

    // convert expanded value to @list if container specifies it
    if(expandedProperty !== '@list' && !_isList(expandedValue) &&
      container.includes('@list')) {
      // ensure expanded value in @list is an array
      expandedValue = {'@list': _asArray(expandedValue)};
    }

    // convert expanded value to @graph if container specifies it
    // and value is not, itself, a graph
    // index cases handled above
    if(container.includes('@graph') &&
      !container.some(key => key === '@id' || key === '@index')) {
      // ensure expanded values are arrays
      expandedValue = _asArray(expandedValue)
        .map(v => ({'@graph': _asArray(v)}));
    }

    // FIXME: can this be merged with code above to simplify?
    // merge in reverse properties
    if(termCtx.mappings.has(key) && termCtx.mappings.get(key).reverse) {
      const reverseMap =
        expandedParent['@reverse'] = expandedParent['@reverse'] || {};
      expandedValue = _asArray(expandedValue);
      for(let ii = 0; ii < expandedValue.length; ++ii) {
        const item = expandedValue[ii];
        if(_isValue(item) || _isList(item)) {
          throw new JsonLdError(
            'Invalid JSON-LD syntax; "@reverse" value must not be a ' +
            '@value or an @list.', 'jsonld.SyntaxError',
            {code: 'invalid reverse property value', value: expandedValue});
        }
        _addValue(reverseMap, expandedProperty, item, {propertyIsArray: true});
      }
      continue;
    }

    // add value for property
    // special keywords handled above
    _addValue(expandedParent, expandedProperty, expandedValue, {
      propertyIsArray: true
    });
  }

  // @value must not be an object or an array (unless framing) or if @type is
  // @json
  if('@value' in expandedParent) {
    if(expandedParent['@type'] === '@json' && _processingMode(activeCtx, 1.1)) {
      // allow any value, to be verified when the object is fully expanded and
      // the @type is @json.
    } else if((_isObject(unexpandedValue) || _isArray(unexpandedValue)) &&
      !options.isFrame) {
      throw new JsonLdError(
        'Invalid JSON-LD syntax; "@value" value must not be an ' +
        'object or an array.',
        'jsonld.SyntaxError',
        {code: 'invalid value object value', value: unexpandedValue});
    }
  }

  // expand each nested key
  for(const key of nests) {
    const nestedValues = _isArray(element[key]) ? element[key] : [element[key]];
    for(const nv of nestedValues) {
      if(!_isObject(nv) || Object.keys(nv).some(k =>
        _expandIri(activeCtx, k, {vocab: true}, options) === '@value')) {
        throw new JsonLdError(
          'Invalid JSON-LD syntax; nested value must be a node object.',
          'jsonld.SyntaxError',
          {code: 'invalid @nest value', value: nv});
      }
      await _expandObject({
        activeCtx,
        activeProperty,
        expandedActiveProperty,
        element: nv,
        expandedParent,
        options,
        insideList,
        typeScopedContext,
        typeKey,
        expansionMap});
    }
  }
}

/**
 * Expands the given value by using the coercion and keyword rules in the
 * given context.
 *
 * @param activeCtx the active context to use.
 * @param activeProperty the active property the value is associated with.
 * @param value the value to expand.
 * @param {Object} [options] - processing options.
 *
 * @return the expanded value.
 */
function _expandValue({activeCtx, activeProperty, value, options}) {
  // nothing to expand
  if(value === null || value === undefined) {
    return null;
  }

  // special-case expand @id and @type (skips '@id' expansion)
  const expandedProperty = _expandIri(
    activeCtx, activeProperty, {vocab: true}, options);
  if(expandedProperty === '@id') {
    return _expandIri(activeCtx, value, {base: true}, options);
  } else if(expandedProperty === '@type') {
    return _expandIri(activeCtx, value, {vocab: true, base: true}, options);
  }

  // get type definition from context
  const type = _getContextValue(activeCtx, activeProperty, '@type');

  // do @id expansion (automatic for @graph)
  if((type === '@id' || expandedProperty === '@graph') && _isString(value)) {
    return {'@id': _expandIri(activeCtx, value, {base: true}, options)};
  }
  // do @id expansion w/vocab
  if(type === '@vocab' && _isString(value)) {
    return {
      '@id': _expandIri(activeCtx, value, {vocab: true, base: true}, options)
    };
  }

  // do not expand keyword values
  if(_isKeyword(expandedProperty)) {
    return value;
  }

  const rval = {};

  if(type && !['@id', '@vocab', '@none'].includes(type)) {
    // other type
    rval['@type'] = type;
  } else if(_isString(value)) {
    // check for language tagging for strings
    const language = _getContextValue(activeCtx, activeProperty, '@language');
    if(language !== null) {
      rval['@language'] = language;
    }
    const direction = _getContextValue(activeCtx, activeProperty, '@direction');
    if(direction !== null) {
      rval['@direction'] = direction;
    }
  }
  // do conversion of values that aren't basic JSON types to strings
  if(!['boolean', 'number', 'string'].includes(typeof value)) {
    value = value.toString();
  }
  rval['@value'] = value;

  return rval;
}

/**
 * Expands a language map.
 *
 * @param activeCtx the active context to use.
 * @param languageMap the language map to expand.
 * @param direction the direction to apply to values.
 * @param {Object} [options] - processing options.
 *
 * @return the expanded language map.
 */
function _expandLanguageMap(activeCtx, languageMap, direction, options) {
  const rval = [];
  const keys = Object.keys(languageMap).sort();
  for(const key of keys) {
    const expandedKey = _expandIri(activeCtx, key, {vocab: true}, options);
    let val = languageMap[key];
    if(!_isArray(val)) {
      val = [val];
    }
    for(const item of val) {
      if(item === null) {
        // null values are allowed (8.5) but ignored (3.1)
        continue;
      }
      if(!_isString(item)) {
        throw new JsonLdError(
          'Invalid JSON-LD syntax; language map values must be strings.',
          'jsonld.SyntaxError',
          {code: 'invalid language map value', languageMap});
      }
      const val = {'@value': item};
      if(expandedKey !== '@none') {
        val['@language'] = key.toLowerCase();
      }
      if(direction) {
        val['@direction'] = direction;
      }
      rval.push(val);
    }
  }
  return rval;
}

async function _expandIndexMap(
  {activeCtx, options, activeProperty, value, expansionMap, asGraph,
    indexKey, propertyIndex}) {
  const rval = [];
  const keys = Object.keys(value).sort();
  const isTypeIndex = indexKey === '@type';
  for(let key of keys) {
    // if indexKey is @type, there may be a context defined for it
    if(isTypeIndex) {
      const ctx = _getContextValue(activeCtx, key, '@context');
      if(!_isUndefined(ctx)) {
        activeCtx = await _processContext({
          activeCtx,
          localCtx: ctx,
          propagate: false,
          options
        });
      }
    }

    let val = value[key];
    if(!_isArray(val)) {
      val = [val];
    }

    val = await api.expand({
      activeCtx,
      activeProperty,
      element: val,
      options,
      insideList: false,
      insideIndex: true,
      expansionMap
    });

    // expand for @type, but also for @none
    let expandedKey;
    if(propertyIndex) {
      if(key === '@none') {
        expandedKey = '@none';
      } else {
        expandedKey = _expandValue(
          {activeCtx, activeProperty: indexKey, value: key, options});
      }
    } else {
      expandedKey = _expandIri(activeCtx, key, {vocab: true}, options);
    }

    if(indexKey === '@id') {
      // expand document relative
      key = _expandIri(activeCtx, key, {base: true}, options);
    } else if(isTypeIndex) {
      key = expandedKey;
    }

    for(let item of val) {
      // If this is also a @graph container, turn items into graphs
      if(asGraph && !_isGraph(item)) {
        item = {'@graph': [item]};
      }
      if(indexKey === '@type') {
        if(expandedKey === '@none') {
          // ignore @none
        } else if(item['@type']) {
          item['@type'] = [key].concat(item['@type']);
        } else {
          item['@type'] = [key];
        }
      } else if(_isValue(item) &&
        !['@language', '@type', '@index'].includes(indexKey)) {
        throw new JsonLdError(
          'Invalid JSON-LD syntax; Attempt to add illegal key to value ' +
          `object: "${indexKey}".`,
          'jsonld.SyntaxError',
          {code: 'invalid value object', value: item});
      } else if(propertyIndex) {
        // index is a property to be expanded, and values interpreted for that
        // property
        if(expandedKey !== '@none') {
          // expand key as a value
          _addValue(item, propertyIndex, expandedKey, {
            propertyIsArray: true,
            prependValue: true
          });
        }
      } else if(expandedKey !== '@none' && !(indexKey in item)) {
        item[indexKey] = key;
      }
      rval.push(item);
    }
  }
  return rval;
}

},{"./JsonLdError":47,"./context":54,"./graphTypes":60,"./types":65,"./url":66,"./util":67}],57:[function(_dereq_,module,exports){
/*
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const {
  isSubjectReference: _isSubjectReference
} = _dereq_('./graphTypes');

const {
  createMergedNodeMap: _createMergedNodeMap
} = _dereq_('./nodeMap');

const api = {};
module.exports = api;

/**
 * Performs JSON-LD flattening.
 *
 * @param input the expanded JSON-LD to flatten.
 *
 * @return the flattened output.
 */
api.flatten = input => {
  const defaultGraph = _createMergedNodeMap(input);

  // produce flattened output
  const flattened = [];
  const keys = Object.keys(defaultGraph).sort();
  for(let ki = 0; ki < keys.length; ++ki) {
    const node = defaultGraph[keys[ki]];
    // only add full subjects to top-level
    if(!_isSubjectReference(node)) {
      flattened.push(node);
    }
  }
  return flattened;
};

},{"./graphTypes":60,"./nodeMap":62}],58:[function(_dereq_,module,exports){
/*
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const {isKeyword} = _dereq_('./context');
const graphTypes = _dereq_('./graphTypes');
const types = _dereq_('./types');
const util = _dereq_('./util');
const url = _dereq_('./url');
const JsonLdError = _dereq_('./JsonLdError');
const {
  createNodeMap: _createNodeMap,
  mergeNodeMapGraphs: _mergeNodeMapGraphs
} = _dereq_('./nodeMap');

const api = {};
module.exports = api;

/**
 * Performs JSON-LD `merged` framing.
 *
 * @param input the expanded JSON-LD to frame.
 * @param frame the expanded JSON-LD frame to use.
 * @param options the framing options.
 *
 * @return the framed output.
 */
api.frameMergedOrDefault = (input, frame, options) => {
  // create framing state
  const state = {
    options,
    embedded: false,
    graph: '@default',
    graphMap: {'@default': {}},
    subjectStack: [],
    link: {},
    bnodeMap: {}
  };

  // produce a map of all graphs and name each bnode
  // FIXME: currently uses subjects from @merged graph only
  const issuer = new util.IdentifierIssuer('_:b');
  _createNodeMap(input, state.graphMap, '@default', issuer);
  if(options.merged) {
    state.graphMap['@merged'] = _mergeNodeMapGraphs(state.graphMap);
    state.graph = '@merged';
  }
  state.subjects = state.graphMap[state.graph];

  // frame the subjects
  const framed = [];
  api.frame(state, Object.keys(state.subjects).sort(), frame, framed);

  // If pruning blank nodes, find those to prune
  if(options.pruneBlankNodeIdentifiers) {
    // remove all blank nodes appearing only once, done in compaction
    options.bnodesToClear =
      Object.keys(state.bnodeMap).filter(id => state.bnodeMap[id].length === 1);
  }

  // remove @preserve from results
  options.link = {};
  return _cleanupPreserve(framed, options);
};

/**
 * Frames subjects according to the given frame.
 *
 * @param state the current framing state.
 * @param subjects the subjects to filter.
 * @param frame the frame.
 * @param parent the parent subject or top-level array.
 * @param property the parent property, initialized to null.
 */
api.frame = (state, subjects, frame, parent, property = null) => {
  // validate the frame
  _validateFrame(frame);
  frame = frame[0];

  // get flags for current frame
  const options = state.options;
  const flags = {
    embed: _getFrameFlag(frame, options, 'embed'),
    explicit: _getFrameFlag(frame, options, 'explicit'),
    requireAll: _getFrameFlag(frame, options, 'requireAll')
  };

  // get link for current graph
  if(!state.link.hasOwnProperty(state.graph)) {
    state.link[state.graph] = {};
  }
  const link = state.link[state.graph];

  // filter out subjects that match the frame
  const matches = _filterSubjects(state, subjects, frame, flags);

  // add matches to output
  const ids = Object.keys(matches).sort();
  for(const id of ids) {
    const subject = matches[id];

    /* Note: In order to treat each top-level match as a compartmentalized
    result, clear the unique embedded subjects map when the property is null,
    which only occurs at the top-level. */
    if(property === null) {
      state.uniqueEmbeds = {[state.graph]: {}};
    } else {
      state.uniqueEmbeds[state.graph] = state.uniqueEmbeds[state.graph] || {};
    }

    if(flags.embed === '@link' && id in link) {
      // TODO: may want to also match an existing linked subject against
      // the current frame ... so different frames could produce different
      // subjects that are only shared in-memory when the frames are the same

      // add existing linked subject
      _addFrameOutput(parent, property, link[id]);
      continue;
    }

    // start output for subject
    const output = {'@id': id};
    if(id.indexOf('_:') === 0) {
      util.addValue(state.bnodeMap, id, output, {propertyIsArray: true});
    }
    link[id] = output;

    // validate @embed
    if((flags.embed === '@first' || flags.embed === '@last') && state.is11) {
      throw new JsonLdError(
        'Invalid JSON-LD syntax; invalid value of @embed.',
        'jsonld.SyntaxError', {code: 'invalid @embed value', frame});
    }

    if(!state.embedded && state.uniqueEmbeds[state.graph].hasOwnProperty(id)) {
      // skip adding this node object to the top level, as it was
      // already included in another node object
      continue;
    }

    // if embed is @never or if a circular reference would be created by an
    // embed, the subject cannot be embedded, just add the reference;
    // note that a circular reference won't occur when the embed flag is
    // `@link` as the above check will short-circuit before reaching this point
    if(state.embedded &&
      (flags.embed === '@never' ||
      _createsCircularReference(subject, state.graph, state.subjectStack))) {
      _addFrameOutput(parent, property, output);
      continue;
    }

    // if only the first (or once) should be embedded
    if(state.embedded &&
       (flags.embed == '@first' || flags.embed == '@once') &&
       state.uniqueEmbeds[state.graph].hasOwnProperty(id)) {
      _addFrameOutput(parent, property, output);
      continue;
    }

    // if only the last match should be embedded
    if(flags.embed === '@last') {
      // remove any existing embed
      if(id in state.uniqueEmbeds[state.graph]) {
        _removeEmbed(state, id);
      }
    }

    state.uniqueEmbeds[state.graph][id] = {parent, property};

    // push matching subject onto stack to enable circular embed checks
    state.subjectStack.push({subject, graph: state.graph});

    // subject is also the name of a graph
    if(id in state.graphMap) {
      let recurse = false;
      let subframe = null;
      if(!('@graph' in frame)) {
        recurse = state.graph !== '@merged';
        subframe = {};
      } else {
        subframe = frame['@graph'][0];
        recurse = !(id === '@merged' || id === '@default');
        if(!types.isObject(subframe)) {
          subframe = {};
        }
      }

      if(recurse) {
        // recurse into graph
        api.frame(
          {...state, graph: id, embedded: false},
          Object.keys(state.graphMap[id]).sort(), [subframe], output, '@graph');
      }
    }

    // if frame has @included, recurse over its sub-frame
    if('@included' in frame) {
      api.frame(
        {...state, embedded: false},
        subjects, frame['@included'], output, '@included');
    }

    // iterate over subject properties
    for(const prop of Object.keys(subject).sort()) {
      // copy keywords to output
      if(isKeyword(prop)) {
        output[prop] = util.clone(subject[prop]);

        if(prop === '@type') {
          // count bnode values of @type
          for(const type of subject['@type']) {
            if(type.indexOf('_:') === 0) {
              util.addValue(
                state.bnodeMap, type, output, {propertyIsArray: true});
            }
          }
        }
        continue;
      }

      // explicit is on and property isn't in the frame, skip processing
      if(flags.explicit && !(prop in frame)) {
        continue;
      }

      // add objects
      for(const o of subject[prop]) {
        const subframe = (prop in frame ?
          frame[prop] : _createImplicitFrame(flags));

        // recurse into list
        if(graphTypes.isList(o)) {
          const subframe =
            (frame[prop] && frame[prop][0] && frame[prop][0]['@list']) ?
              frame[prop][0]['@list'] :
              _createImplicitFrame(flags);

          // add empty list
          const list = {'@list': []};
          _addFrameOutput(output, prop, list);

          // add list objects
          const src = o['@list'];
          for(const oo of src) {
            if(graphTypes.isSubjectReference(oo)) {
              // recurse into subject reference
              api.frame(
                {...state, embedded: true},
                [oo['@id']], subframe, list, '@list');
            } else {
              // include other values automatically
              _addFrameOutput(list, '@list', util.clone(oo));
            }
          }
        } else if(graphTypes.isSubjectReference(o)) {
          // recurse into subject reference
          api.frame(
            {...state, embedded: true},
            [o['@id']], subframe, output, prop);
        } else if(_valueMatch(subframe[0], o)) {
          // include other values, if they match
          _addFrameOutput(output, prop, util.clone(o));
        }
      }
    }

    // handle defaults
    for(const prop of Object.keys(frame).sort()) {
      // skip keywords
      if(prop === '@type') {
        if(!types.isObject(frame[prop][0]) ||
           !('@default' in frame[prop][0])) {
          continue;
        }
        // allow through default types
      } else if(isKeyword(prop)) {
        continue;
      }

      // if omit default is off, then include default values for properties
      // that appear in the next frame but are not in the matching subject
      const next = frame[prop][0] || {};
      const omitDefaultOn = _getFrameFlag(next, options, 'omitDefault');
      if(!omitDefaultOn && !(prop in output)) {
        let preserve = '@null';
        if('@default' in next) {
          preserve = util.clone(next['@default']);
        }
        if(!types.isArray(preserve)) {
          preserve = [preserve];
        }
        output[prop] = [{'@preserve': preserve}];
      }
    }

    // if embed reverse values by finding nodes having this subject as a value
    // of the associated property
    for(const reverseProp of Object.keys(frame['@reverse'] || {}).sort()) {
      const subframe = frame['@reverse'][reverseProp];
      for(const subject of Object.keys(state.subjects)) {
        const nodeValues =
          util.getValues(state.subjects[subject], reverseProp);
        if(nodeValues.some(v => v['@id'] === id)) {
          // node has property referencing this subject, recurse
          output['@reverse'] = output['@reverse'] || {};
          util.addValue(
            output['@reverse'], reverseProp, [], {propertyIsArray: true});
          api.frame(
            {...state, embedded: true},
            [subject], subframe, output['@reverse'][reverseProp],
            property);
        }
      }
    }

    // add output to parent
    _addFrameOutput(parent, property, output);

    // pop matching subject from circular ref-checking stack
    state.subjectStack.pop();
  }
};

/**
 * Replace `@null` with `null`, removing it from arrays.
 *
 * @param input the framed, compacted output.
 * @param options the framing options used.
 *
 * @return the resulting output.
 */
api.cleanupNull = (input, options) => {
  // recurse through arrays
  if(types.isArray(input)) {
    const noNulls = input.map(v => api.cleanupNull(v, options));
    return noNulls.filter(v => v); // removes nulls from array
  }

  if(input === '@null') {
    return null;
  }

  if(types.isObject(input)) {
    // handle in-memory linked nodes
    if('@id' in input) {
      const id = input['@id'];
      if(options.link.hasOwnProperty(id)) {
        const idx = options.link[id].indexOf(input);
        if(idx !== -1) {
          // already visited
          return options.link[id][idx];
        }
        // prevent circular visitation
        options.link[id].push(input);
      } else {
        // prevent circular visitation
        options.link[id] = [input];
      }
    }

    for(const key in input) {
      input[key] = api.cleanupNull(input[key], options);
    }
  }
  return input;
};

/**
 * Creates an implicit frame when recursing through subject matches. If
 * a frame doesn't have an explicit frame for a particular property, then
 * a wildcard child frame will be created that uses the same flags that the
 * parent frame used.
 *
 * @param flags the current framing flags.
 *
 * @return the implicit frame.
 */
function _createImplicitFrame(flags) {
  const frame = {};
  for(const key in flags) {
    if(flags[key] !== undefined) {
      frame['@' + key] = [flags[key]];
    }
  }
  return [frame];
}

/**
 * Checks the current subject stack to see if embedding the given subject
 * would cause a circular reference.
 *
 * @param subjectToEmbed the subject to embed.
 * @param graph the graph the subject to embed is in.
 * @param subjectStack the current stack of subjects.
 *
 * @return true if a circular reference would be created, false if not.
 */
function _createsCircularReference(subjectToEmbed, graph, subjectStack) {
  for(let i = subjectStack.length - 1; i >= 0; --i) {
    const subject = subjectStack[i];
    if(subject.graph === graph &&
      subject.subject['@id'] === subjectToEmbed['@id']) {
      return true;
    }
  }
  return false;
}

/**
 * Gets the frame flag value for the given flag name.
 *
 * @param frame the frame.
 * @param options the framing options.
 * @param name the flag name.
 *
 * @return the flag value.
 */
function _getFrameFlag(frame, options, name) {
  const flag = '@' + name;
  let rval = (flag in frame ? frame[flag][0] : options[name]);
  if(name === 'embed') {
    // default is "@last"
    // backwards-compatibility support for "embed" maps:
    // true => "@last"
    // false => "@never"
    if(rval === true) {
      rval = '@once';
    } else if(rval === false) {
      rval = '@never';
    } else if(rval !== '@always' && rval !== '@never' && rval !== '@link' &&
      rval !== '@first' && rval !== '@last' && rval !== '@once') {
      throw new JsonLdError(
        'Invalid JSON-LD syntax; invalid value of @embed.',
        'jsonld.SyntaxError', {code: 'invalid @embed value', frame});
    }
  }
  return rval;
}

/**
 * Validates a JSON-LD frame, throwing an exception if the frame is invalid.
 *
 * @param frame the frame to validate.
 */
function _validateFrame(frame) {
  if(!types.isArray(frame) || frame.length !== 1 || !types.isObject(frame[0])) {
    throw new JsonLdError(
      'Invalid JSON-LD syntax; a JSON-LD frame must be a single object.',
      'jsonld.SyntaxError', {frame});
  }

  if('@id' in frame[0]) {
    for(const id of util.asArray(frame[0]['@id'])) {
      // @id must be wildcard or an IRI
      if(!(types.isObject(id) || url.isAbsolute(id)) ||
        (types.isString(id) && id.indexOf('_:') === 0)) {
        throw new JsonLdError(
          'Invalid JSON-LD syntax; invalid @id in frame.',
          'jsonld.SyntaxError', {code: 'invalid frame', frame});
      }
    }
  }

  if('@type' in frame[0]) {
    for(const type of util.asArray(frame[0]['@type'])) {
      // @id must be wildcard or an IRI
      if(!(types.isObject(type) || url.isAbsolute(type)) ||
        (types.isString(type) && type.indexOf('_:') === 0)) {
        throw new JsonLdError(
          'Invalid JSON-LD syntax; invalid @type in frame.',
          'jsonld.SyntaxError', {code: 'invalid frame', frame});
      }
    }
  }
}

/**
 * Returns a map of all of the subjects that match a parsed frame.
 *
 * @param state the current framing state.
 * @param subjects the set of subjects to filter.
 * @param frame the parsed frame.
 * @param flags the frame flags.
 *
 * @return all of the matched subjects.
 */
function _filterSubjects(state, subjects, frame, flags) {
  // filter subjects in @id order
  const rval = {};
  for(const id of subjects) {
    const subject = state.graphMap[state.graph][id];
    if(_filterSubject(state, subject, frame, flags)) {
      rval[id] = subject;
    }
  }
  return rval;
}

/**
 * Returns true if the given subject matches the given frame.
 *
 * Matches either based on explicit type inclusion where the node has any
 * type listed in the frame. If the frame has empty types defined matches
 * nodes not having a @type. If the frame has a type of {} defined matches
 * nodes having any type defined.
 *
 * Otherwise, does duck typing, where the node must have all of the
 * properties defined in the frame.
 *
 * @param state the current framing state.
 * @param subject the subject to check.
 * @param frame the frame to check.
 * @param flags the frame flags.
 *
 * @return true if the subject matches, false if not.
 */
function _filterSubject(state, subject, frame, flags) {
  // check ducktype
  let wildcard = true;
  let matchesSome = false;

  for(const key in frame) {
    let matchThis = false;
    const nodeValues = util.getValues(subject, key);
    const isEmpty = util.getValues(frame, key).length === 0;

    if(key === '@id') {
      // match on no @id or any matching @id, including wildcard
      if(types.isEmptyObject(frame['@id'][0] || {})) {
        matchThis = true;
      } else if(frame['@id'].length >= 0) {
        matchThis = frame['@id'].includes(nodeValues[0]);
      }
      if(!flags.requireAll) {
        return matchThis;
      }
    } else if(key === '@type') {
      // check @type (object value means 'any' type,
      // fall through to ducktyping)
      wildcard = false;
      if(isEmpty) {
        if(nodeValues.length > 0) {
          // don't match on no @type
          return false;
        }
        matchThis = true;
      } else if(frame['@type'].length === 1 &&
        types.isEmptyObject(frame['@type'][0])) {
        // match on wildcard @type if there is a type
        matchThis = nodeValues.length > 0;
      } else {
        // match on a specific @type
        for(const type of frame['@type']) {
          if(types.isObject(type) && '@default' in type) {
            // match on default object
            matchThis = true;
          } else {
            matchThis = matchThis || nodeValues.some(tt => tt === type);
          }
        }
      }
      if(!flags.requireAll) {
        return matchThis;
      }
    } else if(isKeyword(key)) {
      continue;
    } else {
      // Force a copy of this frame entry so it can be manipulated
      const thisFrame = util.getValues(frame, key)[0];
      let hasDefault = false;
      if(thisFrame) {
        _validateFrame([thisFrame]);
        hasDefault = '@default' in thisFrame;
      }

      // no longer a wildcard pattern if frame has any non-keyword properties
      wildcard = false;

      // skip, but allow match if node has no value for property, and frame has
      // a default value
      if(nodeValues.length === 0 && hasDefault) {
        continue;
      }

      // if frame value is empty, don't match if subject has any value
      if(nodeValues.length > 0 && isEmpty) {
        return false;
      }

      if(thisFrame === undefined) {
        // node does not match if values is not empty and the value of property
        // in frame is match none.
        if(nodeValues.length > 0) {
          return false;
        }
        matchThis = true;
      } else {
        if(graphTypes.isList(thisFrame)) {
          const listValue = thisFrame['@list'][0];
          if(graphTypes.isList(nodeValues[0])) {
            const nodeListValues = nodeValues[0]['@list'];

            if(graphTypes.isValue(listValue)) {
              // match on any matching value
              matchThis = nodeListValues.some(lv => _valueMatch(listValue, lv));
            } else if(graphTypes.isSubject(listValue) ||
              graphTypes.isSubjectReference(listValue)) {
              matchThis = nodeListValues.some(lv => _nodeMatch(
                state, listValue, lv, flags));
            }
          }
        } else if(graphTypes.isValue(thisFrame)) {
          matchThis = nodeValues.some(nv => _valueMatch(thisFrame, nv));
        } else if(graphTypes.isSubjectReference(thisFrame)) {
          matchThis =
            nodeValues.some(nv => _nodeMatch(state, thisFrame, nv, flags));
        } else if(types.isObject(thisFrame)) {
          matchThis = nodeValues.length > 0;
        } else {
          matchThis = false;
        }
      }
    }

    // all non-defaulted values must match if requireAll is set
    if(!matchThis && flags.requireAll) {
      return false;
    }

    matchesSome = matchesSome || matchThis;
  }

  // return true if wildcard or subject matches some properties
  return wildcard || matchesSome;
}

/**
 * Removes an existing embed.
 *
 * @param state the current framing state.
 * @param id the @id of the embed to remove.
 */
function _removeEmbed(state, id) {
  // get existing embed
  const embeds = state.uniqueEmbeds[state.graph];
  const embed = embeds[id];
  const parent = embed.parent;
  const property = embed.property;

  // create reference to replace embed
  const subject = {'@id': id};

  // remove existing embed
  if(types.isArray(parent)) {
    // replace subject with reference
    for(let i = 0; i < parent.length; ++i) {
      if(util.compareValues(parent[i], subject)) {
        parent[i] = subject;
        break;
      }
    }
  } else {
    // replace subject with reference
    const useArray = types.isArray(parent[property]);
    util.removeValue(parent, property, subject, {propertyIsArray: useArray});
    util.addValue(parent, property, subject, {propertyIsArray: useArray});
  }

  // recursively remove dependent dangling embeds
  const removeDependents = id => {
    // get embed keys as a separate array to enable deleting keys in map
    const ids = Object.keys(embeds);
    for(const next of ids) {
      if(next in embeds && types.isObject(embeds[next].parent) &&
        embeds[next].parent['@id'] === id) {
        delete embeds[next];
        removeDependents(next);
      }
    }
  };
  removeDependents(id);
}

/**
 * Removes the @preserve keywords from expanded result of framing.
 *
 * @param input the framed, framed output.
 * @param options the framing options used.
 *
 * @return the resulting output.
 */
function _cleanupPreserve(input, options) {
  // recurse through arrays
  if(types.isArray(input)) {
    return input.map(value => _cleanupPreserve(value, options));
  }

  if(types.isObject(input)) {
    // remove @preserve
    if('@preserve' in input) {
      return input['@preserve'][0];
    }

    // skip @values
    if(graphTypes.isValue(input)) {
      return input;
    }

    // recurse through @lists
    if(graphTypes.isList(input)) {
      input['@list'] = _cleanupPreserve(input['@list'], options);
      return input;
    }

    // handle in-memory linked nodes
    if('@id' in input) {
      const id = input['@id'];
      if(options.link.hasOwnProperty(id)) {
        const idx = options.link[id].indexOf(input);
        if(idx !== -1) {
          // already visited
          return options.link[id][idx];
        }
        // prevent circular visitation
        options.link[id].push(input);
      } else {
        // prevent circular visitation
        options.link[id] = [input];
      }
    }

    // recurse through properties
    for(const prop in input) {
      // potentially remove the id, if it is an unreference bnode
      if(prop === '@id' && options.bnodesToClear.includes(input[prop])) {
        delete input['@id'];
        continue;
      }

      input[prop] = _cleanupPreserve(input[prop], options);
    }
  }
  return input;
}

/**
 * Adds framing output to the given parent.
 *
 * @param parent the parent to add to.
 * @param property the parent property.
 * @param output the output to add.
 */
function _addFrameOutput(parent, property, output) {
  if(types.isObject(parent)) {
    util.addValue(parent, property, output, {propertyIsArray: true});
  } else {
    parent.push(output);
  }
}

/**
 * Node matches if it is a node, and matches the pattern as a frame.
 *
 * @param state the current framing state.
 * @param pattern used to match value
 * @param value to check
 * @param flags the frame flags.
 */
function _nodeMatch(state, pattern, value, flags) {
  if(!('@id' in value)) {
    return false;
  }
  const nodeObject = state.subjects[value['@id']];
  return nodeObject && _filterSubject(state, nodeObject, pattern, flags);
}

/**
 * Value matches if it is a value and matches the value pattern
 *
 * * `pattern` is empty
 * * @values are the same, or `pattern[@value]` is a wildcard, and
 * * @types are the same or `value[@type]` is not null
 *   and `pattern[@type]` is `{}`, or `value[@type]` is null
 *   and `pattern[@type]` is null or `[]`, and
 * * @languages are the same or `value[@language]` is not null
 *   and `pattern[@language]` is `{}`, or `value[@language]` is null
 *   and `pattern[@language]` is null or `[]`.
 *
 * @param pattern used to match value
 * @param value to check
 */
function _valueMatch(pattern, value) {
  const v1 = value['@value'];
  const t1 = value['@type'];
  const l1 = value['@language'];
  const v2 = pattern['@value'] ?
    (types.isArray(pattern['@value']) ?
      pattern['@value'] : [pattern['@value']]) :
    [];
  const t2 = pattern['@type'] ?
    (types.isArray(pattern['@type']) ?
      pattern['@type'] : [pattern['@type']]) :
    [];
  const l2 = pattern['@language'] ?
    (types.isArray(pattern['@language']) ?
      pattern['@language'] : [pattern['@language']]) :
    [];

  if(v2.length === 0 && t2.length === 0 && l2.length === 0) {
    return true;
  }
  if(!(v2.includes(v1) || types.isEmptyObject(v2[0]))) {
    return false;
  }
  if(!(!t1 && t2.length === 0 || t2.includes(t1) || t1 &&
    types.isEmptyObject(t2[0]))) {
    return false;
  }
  if(!(!l1 && l2.length === 0 || l2.includes(l1) || l1 &&
    types.isEmptyObject(l2[0]))) {
    return false;
  }
  return true;
}

},{"./JsonLdError":47,"./context":54,"./graphTypes":60,"./nodeMap":62,"./types":65,"./url":66,"./util":67}],59:[function(_dereq_,module,exports){
/*
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const JsonLdError = _dereq_('./JsonLdError');
const graphTypes = _dereq_('./graphTypes');
const types = _dereq_('./types');
const util = _dereq_('./util');

// constants
const {
  // RDF,
  RDF_LIST,
  RDF_FIRST,
  RDF_REST,
  RDF_NIL,
  RDF_TYPE,
  // RDF_PLAIN_LITERAL,
  // RDF_XML_LITERAL,
  RDF_JSON_LITERAL,
  // RDF_OBJECT,
  // RDF_LANGSTRING,

  // XSD,
  XSD_BOOLEAN,
  XSD_DOUBLE,
  XSD_INTEGER,
  XSD_STRING,
} = _dereq_('./constants');

const REGEX_BCP47 = /^[a-zA-Z]{1,8}(-[a-zA-Z0-9]{1,8})*$/;

const api = {};
module.exports = api;

/**
 * Converts an RDF dataset to JSON-LD.
 *
 * @param dataset the RDF dataset.
 * @param options the RDF serialization options.
 *
 * @return a Promise that resolves to the JSON-LD output.
 */
api.fromRDF = async (
  dataset,
  {
    useRdfType = false,
    useNativeTypes = false,
    rdfDirection = null
  }
) => {
  const defaultGraph = {};
  const graphMap = {'@default': defaultGraph};
  const referencedOnce = {};

  for(const quad of dataset) {
    // TODO: change 'name' to 'graph'
    const name = (quad.graph.termType === 'DefaultGraph') ?
      '@default' : quad.graph.value;
    if(!(name in graphMap)) {
      graphMap[name] = {};
    }
    if(name !== '@default' && !(name in defaultGraph)) {
      defaultGraph[name] = {'@id': name};
    }

    const nodeMap = graphMap[name];

    // get subject, predicate, object
    const s = quad.subject.value;
    const p = quad.predicate.value;
    const o = quad.object;

    if(!(s in nodeMap)) {
      nodeMap[s] = {'@id': s};
    }
    const node = nodeMap[s];

    const objectIsNode = o.termType.endsWith('Node');
    if(objectIsNode && !(o.value in nodeMap)) {
      nodeMap[o.value] = {'@id': o.value};
    }

    if(p === RDF_TYPE && !useRdfType && objectIsNode) {
      util.addValue(node, '@type', o.value, {propertyIsArray: true});
      continue;
    }

    const value = _RDFToObject(o, useNativeTypes, rdfDirection);
    util.addValue(node, p, value, {propertyIsArray: true});

    // object may be an RDF list/partial list node but we can't know easily
    // until all triples are read
    if(objectIsNode) {
      if(o.value === RDF_NIL) {
        // track rdf:nil uniquely per graph
        const object = nodeMap[o.value];
        if(!('usages' in object)) {
          object.usages = [];
        }
        object.usages.push({
          node,
          property: p,
          value
        });
      } else if(o.value in referencedOnce) {
        // object referenced more than once
        referencedOnce[o.value] = false;
      } else {
        // keep track of single reference
        referencedOnce[o.value] = {
          node,
          property: p,
          value
        };
      }
    }
  }

  /*
  for(let name in dataset) {
    const graph = dataset[name];
    if(!(name in graphMap)) {
      graphMap[name] = {};
    }
    if(name !== '@default' && !(name in defaultGraph)) {
      defaultGraph[name] = {'@id': name};
    }
    const nodeMap = graphMap[name];
    for(let ti = 0; ti < graph.length; ++ti) {
      const triple = graph[ti];

      // get subject, predicate, object
      const s = triple.subject.value;
      const p = triple.predicate.value;
      const o = triple.object;

      if(!(s in nodeMap)) {
        nodeMap[s] = {'@id': s};
      }
      const node = nodeMap[s];

      const objectIsId = (o.type === 'IRI' || o.type === 'blank node');
      if(objectIsId && !(o.value in nodeMap)) {
        nodeMap[o.value] = {'@id': o.value};
      }

      if(p === RDF_TYPE && !useRdfType && objectIsId) {
        util.addValue(node, '@type', o.value, {propertyIsArray: true});
        continue;
      }

      const value = _RDFToObject(o, useNativeTypes);
      util.addValue(node, p, value, {propertyIsArray: true});

      // object may be an RDF list/partial list node but we can't know easily
      // until all triples are read
      if(objectIsId) {
        if(o.value === RDF_NIL) {
          // track rdf:nil uniquely per graph
          const object = nodeMap[o.value];
          if(!('usages' in object)) {
            object.usages = [];
          }
          object.usages.push({
            node: node,
            property: p,
            value: value
          });
        } else if(o.value in referencedOnce) {
          // object referenced more than once
          referencedOnce[o.value] = false;
        } else {
          // keep track of single reference
          referencedOnce[o.value] = {
            node: node,
            property: p,
            value: value
          };
        }
      }
    }
  }*/

  // convert linked lists to @list arrays
  for(const name in graphMap) {
    const graphObject = graphMap[name];

    // no @lists to be converted, continue
    if(!(RDF_NIL in graphObject)) {
      continue;
    }

    // iterate backwards through each RDF list
    const nil = graphObject[RDF_NIL];
    if(!nil.usages) {
      continue;
    }
    for(let usage of nil.usages) {
      let node = usage.node;
      let property = usage.property;
      let head = usage.value;
      const list = [];
      const listNodes = [];

      // ensure node is a well-formed list node; it must:
      // 1. Be referenced only once.
      // 2. Have an array for rdf:first that has 1 item.
      // 3. Have an array for rdf:rest that has 1 item.
      // 4. Have no keys other than: @id, rdf:first, rdf:rest, and,
      //   optionally, @type where the value is rdf:List.
      let nodeKeyCount = Object.keys(node).length;
      while(property === RDF_REST &&
        types.isObject(referencedOnce[node['@id']]) &&
        types.isArray(node[RDF_FIRST]) && node[RDF_FIRST].length === 1 &&
        types.isArray(node[RDF_REST]) && node[RDF_REST].length === 1 &&
        (nodeKeyCount === 3 ||
          (nodeKeyCount === 4 && types.isArray(node['@type']) &&
          node['@type'].length === 1 && node['@type'][0] === RDF_LIST))) {
        list.push(node[RDF_FIRST][0]);
        listNodes.push(node['@id']);

        // get next node, moving backwards through list
        usage = referencedOnce[node['@id']];
        node = usage.node;
        property = usage.property;
        head = usage.value;
        nodeKeyCount = Object.keys(node).length;

        // if node is not a blank node, then list head found
        if(!graphTypes.isBlankNode(node)) {
          break;
        }
      }

      // transform list into @list object
      delete head['@id'];
      head['@list'] = list.reverse();
      for(const listNode of listNodes) {
        delete graphObject[listNode];
      }
    }

    delete nil.usages;
  }

  const result = [];
  const subjects = Object.keys(defaultGraph).sort();
  for(const subject of subjects) {
    const node = defaultGraph[subject];
    if(subject in graphMap) {
      const graph = node['@graph'] = [];
      const graphObject = graphMap[subject];
      const graphSubjects = Object.keys(graphObject).sort();
      for(const graphSubject of graphSubjects) {
        const node = graphObject[graphSubject];
        // only add full subjects to top-level
        if(!graphTypes.isSubjectReference(node)) {
          graph.push(node);
        }
      }
    }
    // only add full subjects to top-level
    if(!graphTypes.isSubjectReference(node)) {
      result.push(node);
    }
  }

  return result;
};

/**
 * Converts an RDF triple object to a JSON-LD object.
 *
 * @param o the RDF triple object to convert.
 * @param useNativeTypes true to output native types, false not to.
 *
 * @return the JSON-LD object.
 */
function _RDFToObject(o, useNativeTypes, rdfDirection) {
  // convert NamedNode/BlankNode object to JSON-LD
  if(o.termType.endsWith('Node')) {
    return {'@id': o.value};
  }

  // convert literal to JSON-LD
  const rval = {'@value': o.value};

  // add language
  if(o.language) {
    rval['@language'] = o.language;
  } else {
    let type = o.datatype.value;
    if(!type) {
      type = XSD_STRING;
    }
    if(type === RDF_JSON_LITERAL) {
      type = '@json';
      try {
        rval['@value'] = JSON.parse(rval['@value']);
      } catch(e) {
        throw new JsonLdError(
          'JSON literal could not be parsed.',
          'jsonld.InvalidJsonLiteral',
          {code: 'invalid JSON literal', value: rval['@value'], cause: e});
      }
    }
    // use native types for certain xsd types
    if(useNativeTypes) {
      if(type === XSD_BOOLEAN) {
        if(rval['@value'] === 'true') {
          rval['@value'] = true;
        } else if(rval['@value'] === 'false') {
          rval['@value'] = false;
        }
      } else if(types.isNumeric(rval['@value'])) {
        if(type === XSD_INTEGER) {
          const i = parseInt(rval['@value'], 10);
          if(i.toFixed(0) === rval['@value']) {
            rval['@value'] = i;
          }
        } else if(type === XSD_DOUBLE) {
          rval['@value'] = parseFloat(rval['@value']);
        }
      }
      // do not add native type
      if(![XSD_BOOLEAN, XSD_INTEGER, XSD_DOUBLE, XSD_STRING].includes(type)) {
        rval['@type'] = type;
      }
    } else if(rdfDirection === 'i18n-datatype' &&
      type.startsWith('https://www.w3.org/ns/i18n#')) {
      const [, language, direction] = type.split(/[#_]/);
      if(language.length > 0) {
        rval['@language'] = language;
        if(!language.match(REGEX_BCP47)) {
          console.warn(`@language must be valid BCP47: ${language}`);
        }
      }
      rval['@direction'] = direction;
    } else if(type !== XSD_STRING) {
      rval['@type'] = type;
    }
  }

  return rval;
}

},{"./JsonLdError":47,"./constants":53,"./graphTypes":60,"./types":65,"./util":67}],60:[function(_dereq_,module,exports){
/*
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const types = _dereq_('./types');

const api = {};
module.exports = api;

/**
 * Returns true if the given value is a subject with properties.
 *
 * @param v the value to check.
 *
 * @return true if the value is a subject with properties, false if not.
 */
api.isSubject = v => {
  // Note: A value is a subject if all of these hold true:
  // 1. It is an Object.
  // 2. It is not a @value, @set, or @list.
  // 3. It has more than 1 key OR any existing key is not @id.
  if(types.isObject(v) &&
    !(('@value' in v) || ('@set' in v) || ('@list' in v))) {
    const keyCount = Object.keys(v).length;
    return (keyCount > 1 || !('@id' in v));
  }
  return false;
};

/**
 * Returns true if the given value is a subject reference.
 *
 * @param v the value to check.
 *
 * @return true if the value is a subject reference, false if not.
 */
api.isSubjectReference = v =>
  // Note: A value is a subject reference if all of these hold true:
  // 1. It is an Object.
  // 2. It has a single key: @id.
  (types.isObject(v) && Object.keys(v).length === 1 && ('@id' in v));

/**
 * Returns true if the given value is a @value.
 *
 * @param v the value to check.
 *
 * @return true if the value is a @value, false if not.
 */
api.isValue = v =>
  // Note: A value is a @value if all of these hold true:
  // 1. It is an Object.
  // 2. It has the @value property.
  types.isObject(v) && ('@value' in v);

/**
 * Returns true if the given value is a @list.
 *
 * @param v the value to check.
 *
 * @return true if the value is a @list, false if not.
 */
api.isList = v =>
  // Note: A value is a @list if all of these hold true:
  // 1. It is an Object.
  // 2. It has the @list property.
  types.isObject(v) && ('@list' in v);

/**
 * Returns true if the given value is a @graph.
 *
 * @return true if the value is a @graph, false if not.
 */
api.isGraph = v => {
  // Note: A value is a graph if all of these hold true:
  // 1. It is an object.
  // 2. It has an `@graph` key.
  // 3. It may have '@id' or '@index'
  return types.isObject(v) &&
    '@graph' in v &&
    Object.keys(v)
      .filter(key => key !== '@id' && key !== '@index').length === 1;
};

/**
 * Returns true if the given value is a simple @graph.
 *
 * @return true if the value is a simple @graph, false if not.
 */
api.isSimpleGraph = v => {
  // Note: A value is a simple graph if all of these hold true:
  // 1. It is an object.
  // 2. It has an `@graph` key.
  // 3. It has only 1 key or 2 keys where one of them is `@index`.
  return api.isGraph(v) && !('@id' in v);
};

/**
 * Returns true if the given value is a blank node.
 *
 * @param v the value to check.
 *
 * @return true if the value is a blank node, false if not.
 */
api.isBlankNode = v => {
  // Note: A value is a blank node if all of these hold true:
  // 1. It is an Object.
  // 2. If it has an @id key its value begins with '_:'.
  // 3. It has no keys OR is not a @value, @set, or @list.
  if(types.isObject(v)) {
    if('@id' in v) {
      return (v['@id'].indexOf('_:') === 0);
    }
    return (Object.keys(v).length === 0 ||
      !(('@value' in v) || ('@set' in v) || ('@list' in v)));
  }
  return false;
};

},{"./types":65}],61:[function(_dereq_,module,exports){
/**
 * A JavaScript implementation of the JSON-LD API.
 *
 * @author Dave Longley
 *
 * @license BSD 3-Clause License
 * Copyright (c) 2011-2019 Digital Bazaar, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice,
 * this list of conditions and the following disclaimer.
 *
 * Redistributions in binary form must reproduce the above copyright
 * notice, this list of conditions and the following disclaimer in the
 * documentation and/or other materials provided with the distribution.
 *
 * Neither the name of the Digital Bazaar, Inc. nor the names of its
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS
 * IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED
 * TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A
 * PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED
 * TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
 * PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
 * LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
const canonize = _dereq_('rdf-canonize');
const platform = _dereq_('./platform');
const util = _dereq_('./util');
const ContextResolver = _dereq_('./ContextResolver');
const IdentifierIssuer = util.IdentifierIssuer;
const JsonLdError = _dereq_('./JsonLdError');
const LRU = _dereq_('lru-cache');
const NQuads = _dereq_('./NQuads');

const {expand: _expand} = _dereq_('./expand');
const {flatten: _flatten} = _dereq_('./flatten');
const {fromRDF: _fromRDF} = _dereq_('./fromRdf');
const {toRDF: _toRDF} = _dereq_('./toRdf');

const {
  frameMergedOrDefault: _frameMergedOrDefault,
  cleanupNull: _cleanupNull
} = _dereq_('./frame');

const {
  isArray: _isArray,
  isObject: _isObject,
  isString: _isString
} = _dereq_('./types');

const {
  isSubjectReference: _isSubjectReference,
} = _dereq_('./graphTypes');

const {
  expandIri: _expandIri,
  getInitialContext: _getInitialContext,
  process: _processContext,
  processingMode: _processingMode
} = _dereq_('./context');

const {
  compact: _compact,
  compactIri: _compactIri
} = _dereq_('./compact');

const {
  createNodeMap: _createNodeMap,
  createMergedNodeMap: _createMergedNodeMap,
  mergeNodeMaps: _mergeNodeMaps
} = _dereq_('./nodeMap');

/* eslint-disable indent */
// attaches jsonld API to the given object
const wrapper = function(jsonld) {

/** Registered RDF dataset parsers hashed by content-type. */
const _rdfParsers = {};

// resolved context cache
// TODO: consider basing max on context size rather than number
const RESOLVED_CONTEXT_CACHE_MAX_SIZE = 100;
const _resolvedContextCache = new LRU({max: RESOLVED_CONTEXT_CACHE_MAX_SIZE});

/* Core API */

/**
 * Performs JSON-LD compaction.
 *
 * @param input the JSON-LD input to compact.
 * @param ctx the context to compact with.
 * @param [options] options to use:
 *          [base] the base IRI to use.
 *          [compactArrays] true to compact arrays to single values when
 *            appropriate, false not to (default: true).
 *          [compactToRelative] true to compact IRIs to be relative to document
 *            base, false to keep absolute (default: true)
 *          [graph] true to always output a top-level graph (default: false).
 *          [expandContext] a context to expand with.
 *          [skipExpansion] true to assume the input is expanded and skip
 *            expansion, false not to, defaults to false.
 *          [documentLoader(url, options)] the document loader.
 *          [expansionMap(info)] a function that can be used to custom map
 *            unmappable values (or to throw an error when they are detected);
 *            if this function returns `undefined` then the default behavior
 *            will be used.
 *          [framing] true if compaction is occuring during a framing operation.
 *          [compactionMap(info)] a function that can be used to custom map
 *            unmappable values (or to throw an error when they are detected);
 *            if this function returns `undefined` then the default behavior
 *            will be used.
 *          [contextResolver] internal use only.
 *
 * @return a Promise that resolves to the compacted output.
 */
jsonld.compact = async function(input, ctx, options) {
  if(arguments.length < 2) {
    throw new TypeError('Could not compact, too few arguments.');
  }

  if(ctx === null) {
    throw new JsonLdError(
      'The compaction context must not be null.',
      'jsonld.CompactError', {code: 'invalid local context'});
  }

  // nothing to compact
  if(input === null) {
    return null;
  }

  // set default options
  options = _setDefaults(options, {
    base: _isString(input) ? input : '',
    compactArrays: true,
    compactToRelative: true,
    graph: false,
    skipExpansion: false,
    link: false,
    issuer: new IdentifierIssuer('_:b'),
    contextResolver: new ContextResolver(
      {sharedCache: _resolvedContextCache})
  });
  if(options.link) {
    // force skip expansion when linking, "link" is not part of the public
    // API, it should only be called from framing
    options.skipExpansion = true;
  }
  if(!options.compactToRelative) {
    delete options.base;
  }

  // expand input
  let expanded;
  if(options.skipExpansion) {
    expanded = input;
  } else {
    expanded = await jsonld.expand(input, options);
  }

  // process context
  const activeCtx = await jsonld.processContext(
    _getInitialContext(options), ctx, options);

  // do compaction
  let compacted = await _compact({
    activeCtx,
    element: expanded,
    options,
    compactionMap: options.compactionMap
  });

  // perform clean up
  if(options.compactArrays && !options.graph && _isArray(compacted)) {
    if(compacted.length === 1) {
      // simplify to a single item
      compacted = compacted[0];
    } else if(compacted.length === 0) {
      // simplify to an empty object
      compacted = {};
    }
  } else if(options.graph && _isObject(compacted)) {
    // always use array if graph option is on
    compacted = [compacted];
  }

  // follow @context key
  if(_isObject(ctx) && '@context' in ctx) {
    ctx = ctx['@context'];
  }

  // build output context
  ctx = util.clone(ctx);
  if(!_isArray(ctx)) {
    ctx = [ctx];
  }
  // remove empty contexts
  const tmp = ctx;
  ctx = [];
  for(let i = 0; i < tmp.length; ++i) {
    if(!_isObject(tmp[i]) || Object.keys(tmp[i]).length > 0) {
      ctx.push(tmp[i]);
    }
  }

  // remove array if only one context
  const hasContext = (ctx.length > 0);
  if(ctx.length === 1) {
    ctx = ctx[0];
  }

  // add context and/or @graph
  if(_isArray(compacted)) {
    // use '@graph' keyword
    const graphAlias = _compactIri({
      activeCtx, iri: '@graph', relativeTo: {vocab: true}
    });
    const graph = compacted;
    compacted = {};
    if(hasContext) {
      compacted['@context'] = ctx;
    }
    compacted[graphAlias] = graph;
  } else if(_isObject(compacted) && hasContext) {
    // reorder keys so @context is first
    const graph = compacted;
    compacted = {'@context': ctx};
    for(const key in graph) {
      compacted[key] = graph[key];
    }
  }

  return compacted;
};

/**
 * Performs JSON-LD expansion.
 *
 * @param input the JSON-LD input to expand.
 * @param [options] the options to use:
 *          [base] the base IRI to use.
 *          [expandContext] a context to expand with.
 *          [keepFreeFloatingNodes] true to keep free-floating nodes,
 *            false not to, defaults to false.
 *          [documentLoader(url, options)] the document loader.
 *          [expansionMap(info)] a function that can be used to custom map
 *            unmappable values (or to throw an error when they are detected);
 *            if this function returns `undefined` then the default behavior
 *            will be used.
 *          [contextResolver] internal use only.
 *
 * @return a Promise that resolves to the expanded output.
 */
jsonld.expand = async function(input, options) {
  if(arguments.length < 1) {
    throw new TypeError('Could not expand, too few arguments.');
  }

  // set default options
  options = _setDefaults(options, {
    keepFreeFloatingNodes: false,
    contextResolver: new ContextResolver(
      {sharedCache: _resolvedContextCache})
  });
  if(options.expansionMap === false) {
    options.expansionMap = undefined;
  }

  // build set of objects that may have @contexts to resolve
  const toResolve = {};

  // build set of contexts to process prior to expansion
  const contextsToProcess = [];

  // if an `expandContext` has been given ensure it gets resolved
  if('expandContext' in options) {
    const expandContext = util.clone(options.expandContext);
    if(_isObject(expandContext) && '@context' in expandContext) {
      toResolve.expandContext = expandContext;
    } else {
      toResolve.expandContext = {'@context': expandContext};
    }
    contextsToProcess.push(toResolve.expandContext);
  }

  // if input is a string, attempt to dereference remote document
  let defaultBase;
  if(!_isString(input)) {
    // input is not a URL, do not need to retrieve it first
    toResolve.input = util.clone(input);
  } else {
    // load remote doc
    const remoteDoc = await jsonld.get(input, options);
    defaultBase = remoteDoc.documentUrl;
    toResolve.input = remoteDoc.document;
    if(remoteDoc.contextUrl) {
      // context included in HTTP link header and must be resolved
      toResolve.remoteContext = {'@context': remoteDoc.contextUrl};
      contextsToProcess.push(toResolve.remoteContext);
    }
  }

  // set default base
  if(!('base' in options)) {
    options.base = defaultBase || '';
  }

  // process any additional contexts
  let activeCtx = _getInitialContext(options);
  for(const localCtx of contextsToProcess) {
    activeCtx = await _processContext({activeCtx, localCtx, options});
  }

  // expand resolved input
  let expanded = await _expand({
    activeCtx,
    element: toResolve.input,
    options,
    expansionMap: options.expansionMap
  });

  // optimize away @graph with no other properties
  if(_isObject(expanded) && ('@graph' in expanded) &&
    Object.keys(expanded).length === 1) {
    expanded = expanded['@graph'];
  } else if(expanded === null) {
    expanded = [];
  }

  // normalize to an array
  if(!_isArray(expanded)) {
    expanded = [expanded];
  }

  return expanded;
};

/**
 * Performs JSON-LD flattening.
 *
 * @param input the JSON-LD to flatten.
 * @param ctx the context to use to compact the flattened output, or null.
 * @param [options] the options to use:
 *          [base] the base IRI to use.
 *          [expandContext] a context to expand with.
 *          [documentLoader(url, options)] the document loader.
 *          [contextResolver] internal use only.
 *
 * @return a Promise that resolves to the flattened output.
 */
jsonld.flatten = async function(input, ctx, options) {
  if(arguments.length < 1) {
    return new TypeError('Could not flatten, too few arguments.');
  }

  if(typeof ctx === 'function') {
    ctx = null;
  } else {
    ctx = ctx || null;
  }

  // set default options
  options = _setDefaults(options, {
    base: _isString(input) ? input : '',
    contextResolver: new ContextResolver(
      {sharedCache: _resolvedContextCache})
  });

  // expand input
  const expanded = await jsonld.expand(input, options);

  // do flattening
  const flattened = _flatten(expanded);

  if(ctx === null) {
    // no compaction required
    return flattened;
  }

  // compact result (force @graph option to true, skip expansion)
  options.graph = true;
  options.skipExpansion = true;
  const compacted = await jsonld.compact(flattened, ctx, options);

  return compacted;
};

/**
 * Performs JSON-LD framing.
 *
 * @param input the JSON-LD input to frame.
 * @param frame the JSON-LD frame to use.
 * @param [options] the framing options.
 *          [base] the base IRI to use.
 *          [expandContext] a context to expand with.
 *          [embed] default @embed flag: '@last', '@always', '@never', '@link'
 *            (default: '@last').
 *          [explicit] default @explicit flag (default: false).
 *          [requireAll] default @requireAll flag (default: true).
 *          [omitDefault] default @omitDefault flag (default: false).
 *          [documentLoader(url, options)] the document loader.
 *          [contextResolver] internal use only.
 *
 * @return a Promise that resolves to the framed output.
 */
jsonld.frame = async function(input, frame, options) {
  if(arguments.length < 2) {
    throw new TypeError('Could not frame, too few arguments.');
  }

  // set default options
  options = _setDefaults(options, {
    base: _isString(input) ? input : '',
    embed: '@once',
    explicit: false,
    requireAll: false,
    omitDefault: false,
    bnodesToClear: [],
    contextResolver: new ContextResolver(
      {sharedCache: _resolvedContextCache})
  });

  // if frame is a string, attempt to dereference remote document
  if(_isString(frame)) {
    // load remote doc
    const remoteDoc = await jsonld.get(frame, options);
    frame = remoteDoc.document;

    if(remoteDoc.contextUrl) {
      // inject link header @context into frame
      let ctx = frame['@context'];
      if(!ctx) {
        ctx = remoteDoc.contextUrl;
      } else if(_isArray(ctx)) {
        ctx.push(remoteDoc.contextUrl);
      } else {
        ctx = [ctx, remoteDoc.contextUrl];
      }
      frame['@context'] = ctx;
    }
  }

  const frameContext = frame ? frame['@context'] || {} : {};

  // process context
  const activeCtx = await jsonld.processContext(
    _getInitialContext(options), frameContext, options);

  // mode specific defaults
  if(!options.hasOwnProperty('omitGraph')) {
    options.omitGraph = _processingMode(activeCtx, 1.1);
  }
  if(!options.hasOwnProperty('pruneBlankNodeIdentifiers')) {
    options.pruneBlankNodeIdentifiers = _processingMode(activeCtx, 1.1);
  }

  // expand input
  const expanded = await jsonld.expand(input, options);

  // expand frame
  const opts = {...options};
  opts.isFrame = true;
  opts.keepFreeFloatingNodes = true;
  const expandedFrame = await jsonld.expand(frame, opts);

  // if the unexpanded frame includes a key expanding to @graph, frame the
  // default graph, otherwise, the merged graph
  const frameKeys = Object.keys(frame)
    .map(key => _expandIri(activeCtx, key, {vocab: true}));
  opts.merged = !frameKeys.includes('@graph');
  opts.is11 = _processingMode(activeCtx, 1.1);

  // do framing
  const framed = _frameMergedOrDefault(expanded, expandedFrame, opts);

  opts.graph = !options.omitGraph;
  opts.skipExpansion = true;
  opts.link = {};
  opts.framing = true;
  let compacted = await jsonld.compact(framed, frameContext, opts);

  // replace @null with null, compacting arrays
  opts.link = {};
  compacted = _cleanupNull(compacted, opts);

  return compacted;
};

/**
 * **Experimental**
 *
 * Links a JSON-LD document's nodes in memory.
 *
 * @param input the JSON-LD document to link.
 * @param [ctx] the JSON-LD context to apply.
 * @param [options] the options to use:
 *          [base] the base IRI to use.
 *          [expandContext] a context to expand with.
 *          [documentLoader(url, options)] the document loader.
 *          [contextResolver] internal use only.
 *
 * @return a Promise that resolves to the linked output.
 */
jsonld.link = async function(input, ctx, options) {
  // API matches running frame with a wildcard frame and embed: '@link'
  // get arguments
  const frame = {};
  if(ctx) {
    frame['@context'] = ctx;
  }
  frame['@embed'] = '@link';
  return jsonld.frame(input, frame, options);
};

/**
 * Performs RDF dataset normalization on the given input. The input is JSON-LD
 * unless the 'inputFormat' option is used. The output is an RDF dataset
 * unless the 'format' option is used.
 *
 * @param input the input to normalize as JSON-LD or as a format specified by
 *          the 'inputFormat' option.
 * @param [options] the options to use:
 *          [algorithm] the normalization algorithm to use, `URDNA2015` or
 *            `URGNA2012` (default: `URDNA2015`).
 *          [base] the base IRI to use.
 *          [expandContext] a context to expand with.
 *          [skipExpansion] true to assume the input is expanded and skip
 *            expansion, false not to, defaults to false.
 *          [inputFormat] the format if input is not JSON-LD:
 *            'application/n-quads' for N-Quads.
 *          [format] the format if output is a string:
 *            'application/n-quads' for N-Quads.
 *          [documentLoader(url, options)] the document loader.
 *          [useNative] true to use a native canonize algorithm
 *          [contextResolver] internal use only.
 *
 * @return a Promise that resolves to the normalized output.
 */
jsonld.normalize = jsonld.canonize = async function(input, options) {
  if(arguments.length < 1) {
    throw new TypeError('Could not canonize, too few arguments.');
  }

  // set default options
  options = _setDefaults(options, {
    base: _isString(input) ? input : '',
    algorithm: 'URDNA2015',
    skipExpansion: false,
    contextResolver: new ContextResolver(
      {sharedCache: _resolvedContextCache})
  });
  if('inputFormat' in options) {
    if(options.inputFormat !== 'application/n-quads' &&
      options.inputFormat !== 'application/nquads') {
      throw new JsonLdError(
        'Unknown canonicalization input format.',
        'jsonld.CanonizeError');
    }
    // TODO: `await` for async parsers
    const parsedInput = NQuads.parse(input);

    // do canonicalization
    return canonize.canonize(parsedInput, options);
  }

  // convert to RDF dataset then do normalization
  const opts = {...options};
  delete opts.format;
  opts.produceGeneralizedRdf = false;
  const dataset = await jsonld.toRDF(input, opts);

  // do canonicalization
  return canonize.canonize(dataset, options);
};

/**
 * Converts an RDF dataset to JSON-LD.
 *
 * @param dataset a serialized string of RDF in a format specified by the
 *          format option or an RDF dataset to convert.
 * @param [options] the options to use:
 *          [format] the format if dataset param must first be parsed:
 *            'application/n-quads' for N-Quads (default).
 *          [rdfParser] a custom RDF-parser to use to parse the dataset.
 *          [useRdfType] true to use rdf:type, false to use @type
 *            (default: false).
 *          [useNativeTypes] true to convert XSD types into native types
 *            (boolean, integer, double), false not to (default: false).
 *
 * @return a Promise that resolves to the JSON-LD document.
 */
jsonld.fromRDF = async function(dataset, options) {
  if(arguments.length < 1) {
    throw new TypeError('Could not convert from RDF, too few arguments.');
  }

  // set default options
  options = _setDefaults(options, {
    format: _isString(dataset) ? 'application/n-quads' : undefined
  });

  const {format} = options;
  let {rdfParser} = options;

  // handle special format
  if(format) {
    // check supported formats
    rdfParser = rdfParser || _rdfParsers[format];
    if(!rdfParser) {
      throw new JsonLdError(
        'Unknown input format.',
        'jsonld.UnknownFormat', {format});
    }
  } else {
    // no-op parser, assume dataset already parsed
    rdfParser = () => dataset;
  }

  // rdfParser must be synchronous or return a promise, no callback support
  const parsedDataset = await rdfParser(dataset);
  return _fromRDF(parsedDataset, options);
};

/**
 * Outputs the RDF dataset found in the given JSON-LD object.
 *
 * @param input the JSON-LD input.
 * @param [options] the options to use:
 *          [base] the base IRI to use.
 *          [expandContext] a context to expand with.
 *          [skipExpansion] true to assume the input is expanded and skip
 *            expansion, false not to, defaults to false.
 *          [format] the format to use to output a string:
 *            'application/n-quads' for N-Quads.
 *          [produceGeneralizedRdf] true to output generalized RDF, false
 *            to produce only standard RDF (default: false).
 *          [documentLoader(url, options)] the document loader.
 *          [contextResolver] internal use only.
 *
 * @return a Promise that resolves to the RDF dataset.
 */
jsonld.toRDF = async function(input, options) {
  if(arguments.length < 1) {
    throw new TypeError('Could not convert to RDF, too few arguments.');
  }

  // set default options
  options = _setDefaults(options, {
    base: _isString(input) ? input : '',
    skipExpansion: false,
    contextResolver: new ContextResolver(
      {sharedCache: _resolvedContextCache})
  });

  // TODO: support toRDF custom map?
  let expanded;
  if(options.skipExpansion) {
    expanded = input;
  } else {
    // expand input
    expanded = await jsonld.expand(input, options);
  }

  // output RDF dataset
  const dataset = _toRDF(expanded, options);
  if(options.format) {
    if(options.format === 'application/n-quads' ||
      options.format === 'application/nquads') {
      return NQuads.serialize(dataset);
    }
    throw new JsonLdError(
      'Unknown output format.',
      'jsonld.UnknownFormat', {format: options.format});
  }

  return dataset;
};

/**
 * **Experimental**
 *
 * Recursively flattens the nodes in the given JSON-LD input into a merged
 * map of node ID => node. All graphs will be merged into the default graph.
 *
 * @param input the JSON-LD input.
 * @param [options] the options to use:
 *          [base] the base IRI to use.
 *          [expandContext] a context to expand with.
 *          [issuer] a jsonld.IdentifierIssuer to use to label blank nodes.
 *          [documentLoader(url, options)] the document loader.
 *          [contextResolver] internal use only.
 *
 * @return a Promise that resolves to the merged node map.
 */
jsonld.createNodeMap = async function(input, options) {
  if(arguments.length < 1) {
    throw new TypeError('Could not create node map, too few arguments.');
  }

  // set default options
  options = _setDefaults(options, {
    base: _isString(input) ? input : '',
    contextResolver: new ContextResolver(
      {sharedCache: _resolvedContextCache})
  });

  // expand input
  const expanded = await jsonld.expand(input, options);

  return _createMergedNodeMap(expanded, options);
};

/**
 * **Experimental**
 *
 * Merges two or more JSON-LD documents into a single flattened document.
 *
 * @param docs the JSON-LD documents to merge together.
 * @param ctx the context to use to compact the merged result, or null.
 * @param [options] the options to use:
 *          [base] the base IRI to use.
 *          [expandContext] a context to expand with.
 *          [issuer] a jsonld.IdentifierIssuer to use to label blank nodes.
 *          [mergeNodes] true to merge properties for nodes with the same ID,
 *            false to ignore new properties for nodes with the same ID once
 *            the ID has been defined; note that this may not prevent merging
 *            new properties where a node is in the `object` position
 *            (default: true).
 *          [documentLoader(url, options)] the document loader.
 *          [contextResolver] internal use only.
 *
 * @return a Promise that resolves to the merged output.
 */
jsonld.merge = async function(docs, ctx, options) {
  if(arguments.length < 1) {
    throw new TypeError('Could not merge, too few arguments.');
  }
  if(!_isArray(docs)) {
    throw new TypeError('Could not merge, "docs" must be an array.');
  }

  if(typeof ctx === 'function') {
    ctx = null;
  } else {
    ctx = ctx || null;
  }

  // set default options
  options = _setDefaults(options, {
    contextResolver: new ContextResolver(
      {sharedCache: _resolvedContextCache})
  });

  // expand all documents
  const expanded = await Promise.all(docs.map(doc => {
    const opts = {...options};
    return jsonld.expand(doc, opts);
  }));

  let mergeNodes = true;
  if('mergeNodes' in options) {
    mergeNodes = options.mergeNodes;
  }

  const issuer = options.issuer || new IdentifierIssuer('_:b');
  const graphs = {'@default': {}};

  for(let i = 0; i < expanded.length; ++i) {
    // uniquely relabel blank nodes
    const doc = util.relabelBlankNodes(expanded[i], {
      issuer: new IdentifierIssuer('_:b' + i + '-')
    });

    // add nodes to the shared node map graphs if merging nodes, to a
    // separate graph set if not
    const _graphs = (mergeNodes || i === 0) ? graphs : {'@default': {}};
    _createNodeMap(doc, _graphs, '@default', issuer);

    if(_graphs !== graphs) {
      // merge document graphs but don't merge existing nodes
      for(const graphName in _graphs) {
        const _nodeMap = _graphs[graphName];
        if(!(graphName in graphs)) {
          graphs[graphName] = _nodeMap;
          continue;
        }
        const nodeMap = graphs[graphName];
        for(const key in _nodeMap) {
          if(!(key in nodeMap)) {
            nodeMap[key] = _nodeMap[key];
          }
        }
      }
    }
  }

  // add all non-default graphs to default graph
  const defaultGraph = _mergeNodeMaps(graphs);

  // produce flattened output
  const flattened = [];
  const keys = Object.keys(defaultGraph).sort();
  for(let ki = 0; ki < keys.length; ++ki) {
    const node = defaultGraph[keys[ki]];
    // only add full subjects to top-level
    if(!_isSubjectReference(node)) {
      flattened.push(node);
    }
  }

  if(ctx === null) {
    return flattened;
  }

  // compact result (force @graph option to true, skip expansion)
  options.graph = true;
  options.skipExpansion = true;
  const compacted = await jsonld.compact(flattened, ctx, options);

  return compacted;
};

/**
 * The default document loader for external documents.
 *
 * @param url the URL to load.
 *
 * @return a promise that resolves to the remote document.
 */
Object.defineProperty(jsonld, 'documentLoader', {
  get: () => jsonld._documentLoader,
  set: v => jsonld._documentLoader = v
});
// default document loader not implemented
jsonld.documentLoader = async url => {
  throw new JsonLdError(
    'Could not retrieve a JSON-LD document from the URL. URL ' +
    'dereferencing not implemented.', 'jsonld.LoadDocumentError',
    {code: 'loading document failed', url});
};

/**
 * Gets a remote JSON-LD document using the default document loader or
 * one given in the passed options.
 *
 * @param url the URL to fetch.
 * @param [options] the options to use:
 *          [documentLoader] the document loader to use.
 *
 * @return a Promise that resolves to the retrieved remote document.
 */
jsonld.get = async function(url, options) {
  let load;
  if(typeof options.documentLoader === 'function') {
    load = options.documentLoader;
  } else {
    load = jsonld.documentLoader;
  }

  const remoteDoc = await load(url);

  try {
    if(!remoteDoc.document) {
      throw new JsonLdError(
        'No remote document found at the given URL.',
        'jsonld.NullRemoteDocument');
    }
    if(_isString(remoteDoc.document)) {
      remoteDoc.document = JSON.parse(remoteDoc.document);
    }
  } catch(e) {
    throw new JsonLdError(
      'Could not retrieve a JSON-LD document from the URL.',
      'jsonld.LoadDocumentError', {
        code: 'loading document failed',
        cause: e,
        remoteDoc
      });
  }

  return remoteDoc;
};

/**
 * Processes a local context, resolving any URLs as necessary, and returns a
 * new active context.
 *
 * @param activeCtx the current active context.
 * @param localCtx the local context to process.
 * @param [options] the options to use:
 *          [documentLoader(url, options)] the document loader.
 *          [contextResolver] internal use only.
 *
 * @return a Promise that resolves to the new active context.
 */
jsonld.processContext = async function(
  activeCtx, localCtx, options) {
  // set default options
  options = _setDefaults(options, {
    base: '',
    contextResolver: new ContextResolver(
      {sharedCache: _resolvedContextCache})
  });

  // return initial context early for null context
  if(localCtx === null) {
    return _getInitialContext(options);
  }

  // get URLs in localCtx
  localCtx = util.clone(localCtx);
  if(!(_isObject(localCtx) && '@context' in localCtx)) {
    localCtx = {'@context': localCtx};
  }

  return _processContext({activeCtx, localCtx, options});
};

// backwards compatibility
jsonld.getContextValue = _dereq_('./context').getContextValue;

/**
 * Document loaders.
 */
jsonld.documentLoaders = {};

/**
 * Assigns the default document loader for external document URLs to a built-in
 * default. Supported types currently include: 'xhr' and 'node'.
 *
 * @param type the type to set.
 * @param [params] the parameters required to use the document loader.
 */
jsonld.useDocumentLoader = function(type) {
  if(!(type in jsonld.documentLoaders)) {
    throw new JsonLdError(
      'Unknown document loader type: "' + type + '"',
      'jsonld.UnknownDocumentLoader',
      {type});
  }

  // set document loader
  jsonld.documentLoader = jsonld.documentLoaders[type].apply(
    jsonld, Array.prototype.slice.call(arguments, 1));
};

/**
 * Registers an RDF dataset parser by content-type, for use with
 * jsonld.fromRDF. An RDF dataset parser will always be given one parameter,
 * a string of input. An RDF dataset parser can be synchronous or
 * asynchronous (by returning a promise).
 *
 * @param contentType the content-type for the parser.
 * @param parser(input) the parser function (takes a string as a parameter
 *          and either returns an RDF dataset or a Promise that resolves to one.
 */
jsonld.registerRDFParser = function(contentType, parser) {
  _rdfParsers[contentType] = parser;
};

/**
 * Unregisters an RDF dataset parser by content-type.
 *
 * @param contentType the content-type for the parser.
 */
jsonld.unregisterRDFParser = function(contentType) {
  delete _rdfParsers[contentType];
};

// register the N-Quads RDF parser
jsonld.registerRDFParser('application/n-quads', NQuads.parse);
jsonld.registerRDFParser('application/nquads', NQuads.parse);

/* URL API */
jsonld.url = _dereq_('./url');

/* Utility API */
jsonld.util = util;
// backwards compatibility
Object.assign(jsonld, util);

// reexpose API as jsonld.promises for backwards compatability
jsonld.promises = jsonld;

// backwards compatibility
jsonld.RequestQueue = _dereq_('./RequestQueue');

/* WebIDL API */
jsonld.JsonLdProcessor = _dereq_('./JsonLdProcessor')(jsonld);

platform.setupGlobals(jsonld);
platform.setupDocumentLoaders(jsonld);

function _setDefaults(options, {
  documentLoader = jsonld.documentLoader,
  ...defaults
}) {
  return Object.assign({}, {documentLoader}, defaults, options);
}

// end of jsonld API `wrapper` factory
return jsonld;
};

// external APIs:

// used to generate a new jsonld API instance
const factory = function() {
  return wrapper(function() {
    return factory();
  });
};

// wrap the main jsonld API instance
wrapper(factory);
// export API
module.exports = factory;

},{"./ContextResolver":46,"./JsonLdError":47,"./JsonLdProcessor":48,"./NQuads":49,"./RequestQueue":50,"./compact":52,"./context":54,"./expand":56,"./flatten":57,"./frame":58,"./fromRdf":59,"./graphTypes":60,"./nodeMap":62,"./platform":63,"./toRdf":64,"./types":65,"./url":66,"./util":67,"lru-cache":68,"rdf-canonize":70}],62:[function(_dereq_,module,exports){
/*
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const {isKeyword} = _dereq_('./context');
const graphTypes = _dereq_('./graphTypes');
const types = _dereq_('./types');
const util = _dereq_('./util');
const JsonLdError = _dereq_('./JsonLdError');

const api = {};
module.exports = api;

/**
 * Creates a merged JSON-LD node map (node ID => node).
 *
 * @param input the expanded JSON-LD to create a node map of.
 * @param [options] the options to use:
 *          [issuer] a jsonld.IdentifierIssuer to use to label blank nodes.
 *
 * @return the node map.
 */
api.createMergedNodeMap = (input, options) => {
  options = options || {};

  // produce a map of all subjects and name each bnode
  const issuer = options.issuer || new util.IdentifierIssuer('_:b');
  const graphs = {'@default': {}};
  api.createNodeMap(input, graphs, '@default', issuer);

  // add all non-default graphs to default graph
  return api.mergeNodeMaps(graphs);
};

/**
 * Recursively flattens the subjects in the given JSON-LD expanded input
 * into a node map.
 *
 * @param input the JSON-LD expanded input.
 * @param graphs a map of graph name to subject map.
 * @param graph the name of the current graph.
 * @param issuer the blank node identifier issuer.
 * @param name the name assigned to the current input if it is a bnode.
 * @param list the list to append to, null for none.
 */
api.createNodeMap = (input, graphs, graph, issuer, name, list) => {
  // recurse through array
  if(types.isArray(input)) {
    for(const node of input) {
      api.createNodeMap(node, graphs, graph, issuer, undefined, list);
    }
    return;
  }

  // add non-object to list
  if(!types.isObject(input)) {
    if(list) {
      list.push(input);
    }
    return;
  }

  // add values to list
  if(graphTypes.isValue(input)) {
    if('@type' in input) {
      let type = input['@type'];
      // rename @type blank node
      if(type.indexOf('_:') === 0) {
        input['@type'] = type = issuer.getId(type);
      }
    }
    if(list) {
      list.push(input);
    }
    return;
  } else if(list && graphTypes.isList(input)) {
    const _list = [];
    api.createNodeMap(input['@list'], graphs, graph, issuer, name, _list);
    list.push({'@list': _list});
    return;
  }

  // Note: At this point, input must be a subject.

  // spec requires @type to be named first, so assign names early
  if('@type' in input) {
    const types = input['@type'];
    for(const type of types) {
      if(type.indexOf('_:') === 0) {
        issuer.getId(type);
      }
    }
  }

  // get name for subject
  if(types.isUndefined(name)) {
    name = graphTypes.isBlankNode(input) ?
      issuer.getId(input['@id']) : input['@id'];
  }

  // add subject reference to list
  if(list) {
    list.push({'@id': name});
  }

  // create new subject or merge into existing one
  const subjects = graphs[graph];
  const subject = subjects[name] = subjects[name] || {};
  subject['@id'] = name;
  const properties = Object.keys(input).sort();
  for(let property of properties) {
    // skip @id
    if(property === '@id') {
      continue;
    }

    // handle reverse properties
    if(property === '@reverse') {
      const referencedNode = {'@id': name};
      const reverseMap = input['@reverse'];
      for(const reverseProperty in reverseMap) {
        const items = reverseMap[reverseProperty];
        for(const item of items) {
          let itemName = item['@id'];
          if(graphTypes.isBlankNode(item)) {
            itemName = issuer.getId(itemName);
          }
          api.createNodeMap(item, graphs, graph, issuer, itemName);
          util.addValue(
            subjects[itemName], reverseProperty, referencedNode,
            {propertyIsArray: true, allowDuplicate: false});
        }
      }
      continue;
    }

    // recurse into graph
    if(property === '@graph') {
      // add graph subjects map entry
      if(!(name in graphs)) {
        graphs[name] = {};
      }
      api.createNodeMap(input[property], graphs, name, issuer);
      continue;
    }

    // recurse into included
    if(property === '@included') {
      api.createNodeMap(input[property], graphs, graph, issuer);
      continue;
    }

    // copy non-@type keywords
    if(property !== '@type' && isKeyword(property)) {
      if(property === '@index' && property in subject &&
        (input[property] !== subject[property] ||
        input[property]['@id'] !== subject[property]['@id'])) {
        throw new JsonLdError(
          'Invalid JSON-LD syntax; conflicting @index property detected.',
          'jsonld.SyntaxError',
          {code: 'conflicting indexes', subject});
      }
      subject[property] = input[property];
      continue;
    }

    // iterate over objects
    const objects = input[property];

    // if property is a bnode, assign it a new id
    if(property.indexOf('_:') === 0) {
      property = issuer.getId(property);
    }

    // ensure property is added for empty arrays
    if(objects.length === 0) {
      util.addValue(subject, property, [], {propertyIsArray: true});
      continue;
    }
    for(let o of objects) {
      if(property === '@type') {
        // rename @type blank nodes
        o = (o.indexOf('_:') === 0) ? issuer.getId(o) : o;
      }

      // handle embedded subject or subject reference
      if(graphTypes.isSubject(o) || graphTypes.isSubjectReference(o)) {
        // skip null @id
        if('@id' in o && !o['@id']) {
          continue;
        }

        // relabel blank node @id
        const id = graphTypes.isBlankNode(o) ?
          issuer.getId(o['@id']) : o['@id'];

        // add reference and recurse
        util.addValue(
          subject, property, {'@id': id},
          {propertyIsArray: true, allowDuplicate: false});
        api.createNodeMap(o, graphs, graph, issuer, id);
      } else if(graphTypes.isValue(o)) {
        util.addValue(
          subject, property, o,
          {propertyIsArray: true, allowDuplicate: false});
      } else if(graphTypes.isList(o)) {
        // handle @list
        const _list = [];
        api.createNodeMap(o['@list'], graphs, graph, issuer, name, _list);
        o = {'@list': _list};
        util.addValue(
          subject, property, o,
          {propertyIsArray: true, allowDuplicate: false});
      } else {
        // handle @value
        api.createNodeMap(o, graphs, graph, issuer, name);
        util.addValue(
          subject, property, o, {propertyIsArray: true, allowDuplicate: false});
      }
    }
  }
};

/**
 * Merge separate named graphs into a single merged graph including
 * all nodes from the default graph and named graphs.
 *
 * @param graphs a map of graph name to subject map.
 *
 * @return the merged graph map.
 */
api.mergeNodeMapGraphs = graphs => {
  const merged = {};
  for(const name of Object.keys(graphs).sort()) {
    for(const id of Object.keys(graphs[name]).sort()) {
      const node = graphs[name][id];
      if(!(id in merged)) {
        merged[id] = {'@id': id};
      }
      const mergedNode = merged[id];

      for(const property of Object.keys(node).sort()) {
        if(isKeyword(property) && property !== '@type') {
          // copy keywords
          mergedNode[property] = util.clone(node[property]);
        } else {
          // merge objects
          for(const value of node[property]) {
            util.addValue(
              mergedNode, property, util.clone(value),
              {propertyIsArray: true, allowDuplicate: false});
          }
        }
      }
    }
  }

  return merged;
};

api.mergeNodeMaps = graphs => {
  // add all non-default graphs to default graph
  const defaultGraph = graphs['@default'];
  const graphNames = Object.keys(graphs).sort();
  for(const graphName of graphNames) {
    if(graphName === '@default') {
      continue;
    }
    const nodeMap = graphs[graphName];
    let subject = defaultGraph[graphName];
    if(!subject) {
      defaultGraph[graphName] = subject = {
        '@id': graphName,
        '@graph': []
      };
    } else if(!('@graph' in subject)) {
      subject['@graph'] = [];
    }
    const graph = subject['@graph'];
    for(const id of Object.keys(nodeMap).sort()) {
      const node = nodeMap[id];
      // only add full subjects
      if(!graphTypes.isSubjectReference(node)) {
        graph.push(node);
      }
    }
  }
  return defaultGraph;
};

},{"./JsonLdError":47,"./context":54,"./graphTypes":60,"./types":65,"./util":67}],63:[function(_dereq_,module,exports){
/*
 * Copyright (c) 2021 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const xhrLoader = _dereq_('./documentLoaders/xhr');

const api = {};
module.exports = api;

/**
 * Setup browser document loaders.
 *
 * @param jsonld the jsonld api.
 */
api.setupDocumentLoaders = function(jsonld) {
  if(typeof XMLHttpRequest !== 'undefined') {
    jsonld.documentLoaders.xhr = xhrLoader;
    // use xhr document loader by default
    jsonld.useDocumentLoader('xhr');
  }
};

/**
 * Setup browser globals.
 *
 * @param jsonld the jsonld api.
 */
api.setupGlobals = function(jsonld) {
  // setup browser global JsonLdProcessor
  if(typeof globalThis.JsonLdProcessor === 'undefined') {
    Object.defineProperty(globalThis, 'JsonLdProcessor', {
      writable: true,
      enumerable: false,
      configurable: true,
      value: jsonld.JsonLdProcessor
    });
  }
};

},{"./documentLoaders/xhr":55}],64:[function(_dereq_,module,exports){
/*
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const {createNodeMap} = _dereq_('./nodeMap');
const {isKeyword} = _dereq_('./context');
const graphTypes = _dereq_('./graphTypes');
const jsonCanonicalize = _dereq_('canonicalize');
const types = _dereq_('./types');
const util = _dereq_('./util');

const {
  // RDF,
  // RDF_LIST,
  RDF_FIRST,
  RDF_REST,
  RDF_NIL,
  RDF_TYPE,
  // RDF_PLAIN_LITERAL,
  // RDF_XML_LITERAL,
  RDF_JSON_LITERAL,
  // RDF_OBJECT,
  RDF_LANGSTRING,

  // XSD,
  XSD_BOOLEAN,
  XSD_DOUBLE,
  XSD_INTEGER,
  XSD_STRING,
} = _dereq_('./constants');

const {
  isAbsolute: _isAbsoluteIri
} = _dereq_('./url');

const api = {};
module.exports = api;

/**
 * Outputs an RDF dataset for the expanded JSON-LD input.
 *
 * @param input the expanded JSON-LD input.
 * @param options the RDF serialization options.
 *
 * @return the RDF dataset.
 */
api.toRDF = (input, options) => {
  // create node map for default graph (and any named graphs)
  const issuer = new util.IdentifierIssuer('_:b');
  const nodeMap = {'@default': {}};
  createNodeMap(input, nodeMap, '@default', issuer);

  const dataset = [];
  const graphNames = Object.keys(nodeMap).sort();
  for(const graphName of graphNames) {
    let graphTerm;
    if(graphName === '@default') {
      graphTerm = {termType: 'DefaultGraph', value: ''};
    } else if(_isAbsoluteIri(graphName)) {
      if(graphName.startsWith('_:')) {
        graphTerm = {termType: 'BlankNode'};
      } else {
        graphTerm = {termType: 'NamedNode'};
      }
      graphTerm.value = graphName;
    } else {
      // skip relative IRIs (not valid RDF)
      continue;
    }
    _graphToRDF(dataset, nodeMap[graphName], graphTerm, issuer, options);
  }

  return dataset;
};

/**
 * Adds RDF quads for a particular graph to the given dataset.
 *
 * @param dataset the dataset to append RDF quads to.
 * @param graph the graph to create RDF quads for.
 * @param graphTerm the graph term for each quad.
 * @param issuer a IdentifierIssuer for assigning blank node names.
 * @param options the RDF serialization options.
 *
 * @return the array of RDF triples for the given graph.
 */
function _graphToRDF(dataset, graph, graphTerm, issuer, options) {
  const ids = Object.keys(graph).sort();
  for(const id of ids) {
    const node = graph[id];
    const properties = Object.keys(node).sort();
    for(let property of properties) {
      const items = node[property];
      if(property === '@type') {
        property = RDF_TYPE;
      } else if(isKeyword(property)) {
        continue;
      }

      for(const item of items) {
        // RDF subject
        const subject = {
          termType: id.startsWith('_:') ? 'BlankNode' : 'NamedNode',
          value: id
        };

        // skip relative IRI subjects (not valid RDF)
        if(!_isAbsoluteIri(id)) {
          continue;
        }

        // RDF predicate
        const predicate = {
          termType: property.startsWith('_:') ? 'BlankNode' : 'NamedNode',
          value: property
        };

        // skip relative IRI predicates (not valid RDF)
        if(!_isAbsoluteIri(property)) {
          continue;
        }

        // skip blank node predicates unless producing generalized RDF
        if(predicate.termType === 'BlankNode' &&
          !options.produceGeneralizedRdf) {
          continue;
        }

        // convert list, value or node object to triple
        const object =
          _objectToRDF(item, issuer, dataset, graphTerm, options.rdfDirection);
        // skip null objects (they are relative IRIs)
        if(object) {
          dataset.push({
            subject,
            predicate,
            object,
            graph: graphTerm
          });
        }
      }
    }
  }
}

/**
 * Converts a @list value into linked list of blank node RDF quads
 * (an RDF collection).
 *
 * @param list the @list value.
 * @param issuer a IdentifierIssuer for assigning blank node names.
 * @param dataset the array of quads to append to.
 * @param graphTerm the graph term for each quad.
 *
 * @return the head of the list.
 */
function _listToRDF(list, issuer, dataset, graphTerm, rdfDirection) {
  const first = {termType: 'NamedNode', value: RDF_FIRST};
  const rest = {termType: 'NamedNode', value: RDF_REST};
  const nil = {termType: 'NamedNode', value: RDF_NIL};

  const last = list.pop();
  // Result is the head of the list
  const result = last ? {termType: 'BlankNode', value: issuer.getId()} : nil;
  let subject = result;

  for(const item of list) {
    const object = _objectToRDF(item, issuer, dataset, graphTerm, rdfDirection);
    const next = {termType: 'BlankNode', value: issuer.getId()};
    dataset.push({
      subject,
      predicate: first,
      object,
      graph: graphTerm
    });
    dataset.push({
      subject,
      predicate: rest,
      object: next,
      graph: graphTerm
    });
    subject = next;
  }

  // Tail of list
  if(last) {
    const object = _objectToRDF(last, issuer, dataset, graphTerm, rdfDirection);
    dataset.push({
      subject,
      predicate: first,
      object,
      graph: graphTerm
    });
    dataset.push({
      subject,
      predicate: rest,
      object: nil,
      graph: graphTerm
    });
  }

  return result;
}

/**
 * Converts a JSON-LD value object to an RDF literal or a JSON-LD string,
 * node object to an RDF resource, or adds a list.
 *
 * @param item the JSON-LD value or node object.
 * @param issuer a IdentifierIssuer for assigning blank node names.
 * @param dataset the dataset to append RDF quads to.
 * @param graphTerm the graph term for each quad.
 *
 * @return the RDF literal or RDF resource.
 */
function _objectToRDF(item, issuer, dataset, graphTerm, rdfDirection) {
  const object = {};

  // convert value object to RDF
  if(graphTypes.isValue(item)) {
    object.termType = 'Literal';
    object.value = undefined;
    object.datatype = {
      termType: 'NamedNode'
    };
    let value = item['@value'];
    const datatype = item['@type'] || null;

    // convert to XSD/JSON datatypes as appropriate
    if(datatype === '@json') {
      object.value = jsonCanonicalize(value);
      object.datatype.value = RDF_JSON_LITERAL;
    } else if(types.isBoolean(value)) {
      object.value = value.toString();
      object.datatype.value = datatype || XSD_BOOLEAN;
    } else if(types.isDouble(value) || datatype === XSD_DOUBLE) {
      if(!types.isDouble(value)) {
        value = parseFloat(value);
      }
      // canonical double representation
      object.value = value.toExponential(15).replace(/(\d)0*e\+?/, '$1E');
      object.datatype.value = datatype || XSD_DOUBLE;
    } else if(types.isNumber(value)) {
      object.value = value.toFixed(0);
      object.datatype.value = datatype || XSD_INTEGER;
    } else if(rdfDirection === 'i18n-datatype' &&
      '@direction' in item) {
      const datatype = 'https://www.w3.org/ns/i18n#' +
        (item['@language'] || '') +
        `_${item['@direction']}`;
      object.datatype.value = datatype;
      object.value = value;
    } else if('@language' in item) {
      object.value = value;
      object.datatype.value = datatype || RDF_LANGSTRING;
      object.language = item['@language'];
    } else {
      object.value = value;
      object.datatype.value = datatype || XSD_STRING;
    }
  } else if(graphTypes.isList(item)) {
    const _list =
      _listToRDF(item['@list'], issuer, dataset, graphTerm, rdfDirection);
    object.termType = _list.termType;
    object.value = _list.value;
  } else {
    // convert string/node object to RDF
    const id = types.isObject(item) ? item['@id'] : item;
    object.termType = id.startsWith('_:') ? 'BlankNode' : 'NamedNode';
    object.value = id;
  }

  // skip relative IRIs, not valid RDF
  if(object.termType === 'NamedNode' && !_isAbsoluteIri(object.value)) {
    return null;
  }

  return object;
}

},{"./constants":53,"./context":54,"./graphTypes":60,"./nodeMap":62,"./types":65,"./url":66,"./util":67,"canonicalize":45}],65:[function(_dereq_,module,exports){
/*
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const api = {};
module.exports = api;

/**
 * Returns true if the given value is an Array.
 *
 * @param v the value to check.
 *
 * @return true if the value is an Array, false if not.
 */
api.isArray = Array.isArray;

/**
 * Returns true if the given value is a Boolean.
 *
 * @param v the value to check.
 *
 * @return true if the value is a Boolean, false if not.
 */
api.isBoolean = v => (typeof v === 'boolean' ||
  Object.prototype.toString.call(v) === '[object Boolean]');

/**
 * Returns true if the given value is a double.
 *
 * @param v the value to check.
 *
 * @return true if the value is a double, false if not.
 */
api.isDouble = v => api.isNumber(v) &&
  (String(v).indexOf('.') !== -1 || Math.abs(v) >= 1e21);

/**
 * Returns true if the given value is an empty Object.
 *
 * @param v the value to check.
 *
 * @return true if the value is an empty Object, false if not.
 */
api.isEmptyObject = v => api.isObject(v) && Object.keys(v).length === 0;

/**
 * Returns true if the given value is a Number.
 *
 * @param v the value to check.
 *
 * @return true if the value is a Number, false if not.
 */
api.isNumber = v => (typeof v === 'number' ||
  Object.prototype.toString.call(v) === '[object Number]');

/**
 * Returns true if the given value is numeric.
 *
 * @param v the value to check.
 *
 * @return true if the value is numeric, false if not.
 */
api.isNumeric = v => !isNaN(parseFloat(v)) && isFinite(v);

/**
 * Returns true if the given value is an Object.
 *
 * @param v the value to check.
 *
 * @return true if the value is an Object, false if not.
 */
api.isObject = v => Object.prototype.toString.call(v) === '[object Object]';

/**
 * Returns true if the given value is a String.
 *
 * @param v the value to check.
 *
 * @return true if the value is a String, false if not.
 */
api.isString = v => (typeof v === 'string' ||
  Object.prototype.toString.call(v) === '[object String]');

/**
 * Returns true if the given value is undefined.
 *
 * @param v the value to check.
 *
 * @return true if the value is undefined, false if not.
 */
api.isUndefined = v => typeof v === 'undefined';

},{}],66:[function(_dereq_,module,exports){
/*
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const types = _dereq_('./types');

const api = {};
module.exports = api;

// define URL parser
// parseUri 1.2.2
// (c) Steven Levithan <stevenlevithan.com>
// MIT License
// with local jsonld.js modifications
api.parsers = {
  simple: {
    // RFC 3986 basic parts
    keys: [
      'href', 'scheme', 'authority', 'path', 'query', 'fragment'
    ],
    /* eslint-disable-next-line max-len */
    regex: /^(?:([^:\/?#]+):)?(?:\/\/([^\/?#]*))?([^?#]*)(?:\?([^#]*))?(?:#(.*))?/
  },
  full: {
    keys: [
      'href', 'protocol', 'scheme', 'authority', 'auth', 'user', 'password',
      'hostname', 'port', 'path', 'directory', 'file', 'query', 'fragment'
    ],
    /* eslint-disable-next-line max-len */
    regex: /^(([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?(?:(((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/
  }
};
api.parse = (str, parser) => {
  const parsed = {};
  const o = api.parsers[parser || 'full'];
  const m = o.regex.exec(str);
  let i = o.keys.length;
  while(i--) {
    parsed[o.keys[i]] = (m[i] === undefined) ? null : m[i];
  }

  // remove default ports in found in URLs
  if((parsed.scheme === 'https' && parsed.port === '443') ||
    (parsed.scheme === 'http' && parsed.port === '80')) {
    parsed.href = parsed.href.replace(':' + parsed.port, '');
    parsed.authority = parsed.authority.replace(':' + parsed.port, '');
    parsed.port = null;
  }

  parsed.normalizedPath = api.removeDotSegments(parsed.path);
  return parsed;
};

/**
 * Prepends a base IRI to the given relative IRI.
 *
 * @param base the base IRI.
 * @param iri the relative IRI.
 *
 * @return the absolute IRI.
 */
api.prependBase = (base, iri) => {
  // skip IRI processing
  if(base === null) {
    return iri;
  }
  // already an absolute IRI
  if(api.isAbsolute(iri)) {
    return iri;
  }

  // parse base if it is a string
  if(!base || types.isString(base)) {
    base = api.parse(base || '');
  }

  // parse given IRI
  const rel = api.parse(iri);

  // per RFC3986 5.2.2
  const transform = {
    protocol: base.protocol || ''
  };

  if(rel.authority !== null) {
    transform.authority = rel.authority;
    transform.path = rel.path;
    transform.query = rel.query;
  } else {
    transform.authority = base.authority;

    if(rel.path === '') {
      transform.path = base.path;
      if(rel.query !== null) {
        transform.query = rel.query;
      } else {
        transform.query = base.query;
      }
    } else {
      if(rel.path.indexOf('/') === 0) {
        // IRI represents an absolute path
        transform.path = rel.path;
      } else {
        // merge paths
        let path = base.path;

        // append relative path to the end of the last directory from base
        path = path.substr(0, path.lastIndexOf('/') + 1);
        if((path.length > 0 || base.authority) && path.substr(-1) !== '/') {
          path += '/';
        }
        path += rel.path;

        transform.path = path;
      }
      transform.query = rel.query;
    }
  }

  if(rel.path !== '') {
    // remove slashes and dots in path
    transform.path = api.removeDotSegments(transform.path);
  }

  // construct URL
  let rval = transform.protocol;
  if(transform.authority !== null) {
    rval += '//' + transform.authority;
  }
  rval += transform.path;
  if(transform.query !== null) {
    rval += '?' + transform.query;
  }
  if(rel.fragment !== null) {
    rval += '#' + rel.fragment;
  }

  // handle empty base
  if(rval === '') {
    rval = './';
  }

  return rval;
};

/**
 * Removes a base IRI from the given absolute IRI.
 *
 * @param base the base IRI.
 * @param iri the absolute IRI.
 *
 * @return the relative IRI if relative to base, otherwise the absolute IRI.
 */
api.removeBase = (base, iri) => {
  // skip IRI processing
  if(base === null) {
    return iri;
  }

  if(!base || types.isString(base)) {
    base = api.parse(base || '');
  }

  // establish base root
  let root = '';
  if(base.href !== '') {
    root += (base.protocol || '') + '//' + (base.authority || '');
  } else if(iri.indexOf('//')) {
    // support network-path reference with empty base
    root += '//';
  }

  // IRI not relative to base
  if(iri.indexOf(root) !== 0) {
    return iri;
  }

  // remove root from IRI and parse remainder
  const rel = api.parse(iri.substr(root.length));

  // remove path segments that match (do not remove last segment unless there
  // is a hash or query)
  const baseSegments = base.normalizedPath.split('/');
  const iriSegments = rel.normalizedPath.split('/');
  const last = (rel.fragment || rel.query) ? 0 : 1;
  while(baseSegments.length > 0 && iriSegments.length > last) {
    if(baseSegments[0] !== iriSegments[0]) {
      break;
    }
    baseSegments.shift();
    iriSegments.shift();
  }

  // use '../' for each non-matching base segment
  let rval = '';
  if(baseSegments.length > 0) {
    // don't count the last segment (if it ends with '/' last path doesn't
    // count and if it doesn't end with '/' it isn't a path)
    baseSegments.pop();
    for(let i = 0; i < baseSegments.length; ++i) {
      rval += '../';
    }
  }

  // prepend remaining segments
  rval += iriSegments.join('/');

  // add query and hash
  if(rel.query !== null) {
    rval += '?' + rel.query;
  }
  if(rel.fragment !== null) {
    rval += '#' + rel.fragment;
  }

  // handle empty base
  if(rval === '') {
    rval = './';
  }

  return rval;
};

/**
 * Removes dot segments from a URL path.
 *
 * @param path the path to remove dot segments from.
 */
api.removeDotSegments = path => {
  // RFC 3986 5.2.4 (reworked)

  // empty path shortcut
  if(path.length === 0) {
    return '';
  }

  const input = path.split('/');
  const output = [];

  while(input.length > 0) {
    const next = input.shift();
    const done = input.length === 0;

    if(next === '.') {
      if(done) {
        // ensure output has trailing /
        output.push('');
      }
      continue;
    }

    if(next === '..') {
      output.pop();
      if(done) {
        // ensure output has trailing /
        output.push('');
      }
      continue;
    }

    output.push(next);
  }

  // if path was absolute, ensure output has leading /
  if(path[0] === '/' && output.length > 0 && output[0] !== '') {
    output.unshift('');
  }
  if(output.length === 1 && output[0] === '') {
    return '/';
  }

  return output.join('/');
};

// TODO: time better isAbsolute/isRelative checks using full regexes:
// http://jmrware.com/articles/2009/uri_regexp/URI_regex.html

// regex to check for absolute IRI (starting scheme and ':') or blank node IRI
const isAbsoluteRegex = /^([A-Za-z][A-Za-z0-9+-.]*|_):[^\s]*$/;

/**
 * Returns true if the given value is an absolute IRI or blank node IRI, false
 * if not.
 * Note: This weak check only checks for a correct starting scheme.
 *
 * @param v the value to check.
 *
 * @return true if the value is an absolute IRI, false if not.
 */
api.isAbsolute = v => types.isString(v) && isAbsoluteRegex.test(v);

/**
 * Returns true if the given value is a relative IRI, false if not.
 * Note: this is a weak check.
 *
 * @param v the value to check.
 *
 * @return true if the value is a relative IRI, false if not.
 */
api.isRelative = v => types.isString(v);

},{"./types":65}],67:[function(_dereq_,module,exports){
/*
 * Copyright (c) 2017-2019 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const graphTypes = _dereq_('./graphTypes');
const types = _dereq_('./types');
// TODO: move `IdentifierIssuer` to its own package
const IdentifierIssuer = _dereq_('rdf-canonize').IdentifierIssuer;
const JsonLdError = _dereq_('./JsonLdError');

// constants
const REGEX_LINK_HEADERS = /(?:<[^>]*?>|"[^"]*?"|[^,])+/g;
const REGEX_LINK_HEADER = /\s*<([^>]*?)>\s*(?:;\s*(.*))?/;
const REGEX_LINK_HEADER_PARAMS =
  /(.*?)=(?:(?:"([^"]*?)")|([^"]*?))\s*(?:(?:;\s*)|$)/g;

const DEFAULTS = {
  headers: {
    accept: 'application/ld+json, application/json'
  }
};

const api = {};
module.exports = api;
api.IdentifierIssuer = IdentifierIssuer;

/**
 * Clones an object, array, Map, Set, or string/number. If a typed JavaScript
 * object is given, such as a Date, it will be converted to a string.
 *
 * @param value the value to clone.
 *
 * @return the cloned value.
 */
api.clone = function(value) {
  if(value && typeof value === 'object') {
    let rval;
    if(types.isArray(value)) {
      rval = [];
      for(let i = 0; i < value.length; ++i) {
        rval[i] = api.clone(value[i]);
      }
    } else if(value instanceof Map) {
      rval = new Map();
      for(const [k, v] of value) {
        rval.set(k, api.clone(v));
      }
    } else if(value instanceof Set) {
      rval = new Set();
      for(const v of value) {
        rval.add(api.clone(v));
      }
    } else if(types.isObject(value)) {
      rval = {};
      for(const key in value) {
        rval[key] = api.clone(value[key]);
      }
    } else {
      rval = value.toString();
    }
    return rval;
  }
  return value;
};

/**
 * Ensure a value is an array. If the value is an array, it is returned.
 * Otherwise, it is wrapped in an array.
 *
 * @param value the value to return as an array.
 *
 * @return the value as an array.
 */
api.asArray = function(value) {
  return Array.isArray(value) ? value : [value];
};

/**
 * Builds an HTTP headers object for making a JSON-LD request from custom
 * headers and asserts the `accept` header isn't overridden.
 *
 * @param headers an object of headers with keys as header names and values
 *          as header values.
 *
 * @return an object of headers with a valid `accept` header.
 */
api.buildHeaders = (headers = {}) => {
  const hasAccept = Object.keys(headers).some(
    h => h.toLowerCase() === 'accept');

  if(hasAccept) {
    throw new RangeError(
      'Accept header may not be specified; only "' +
      DEFAULTS.headers.accept + '" is supported.');
  }

  return Object.assign({Accept: DEFAULTS.headers.accept}, headers);
};

/**
 * Parses a link header. The results will be key'd by the value of "rel".
 *
 * Link: <http://json-ld.org/contexts/person.jsonld>;
 * rel="http://www.w3.org/ns/json-ld#context"; type="application/ld+json"
 *
 * Parses as: {
 *   'http://www.w3.org/ns/json-ld#context': {
 *     target: http://json-ld.org/contexts/person.jsonld,
 *     type: 'application/ld+json'
 *   }
 * }
 *
 * If there is more than one "rel" with the same IRI, then entries in the
 * resulting map for that "rel" will be arrays.
 *
 * @param header the link header to parse.
 */
api.parseLinkHeader = header => {
  const rval = {};
  // split on unbracketed/unquoted commas
  const entries = header.match(REGEX_LINK_HEADERS);
  for(let i = 0; i < entries.length; ++i) {
    let match = entries[i].match(REGEX_LINK_HEADER);
    if(!match) {
      continue;
    }
    const result = {target: match[1]};
    const params = match[2];
    while((match = REGEX_LINK_HEADER_PARAMS.exec(params))) {
      result[match[1]] = (match[2] === undefined) ? match[3] : match[2];
    }
    const rel = result['rel'] || '';
    if(Array.isArray(rval[rel])) {
      rval[rel].push(result);
    } else if(rval.hasOwnProperty(rel)) {
      rval[rel] = [rval[rel], result];
    } else {
      rval[rel] = result;
    }
  }
  return rval;
};

/**
 * Throws an exception if the given value is not a valid @type value.
 *
 * @param v the value to check.
 */
api.validateTypeValue = (v, isFrame) => {
  if(types.isString(v)) {
    return;
  }

  if(types.isArray(v) && v.every(vv => types.isString(vv))) {
    return;
  }
  if(isFrame && types.isObject(v)) {
    switch(Object.keys(v).length) {
      case 0:
        // empty object is wildcard
        return;
      case 1:
        // default entry is all strings
        if('@default' in v &&
          api.asArray(v['@default']).every(vv => types.isString(vv))) {
          return;
        }
    }
  }

  throw new JsonLdError(
    'Invalid JSON-LD syntax; "@type" value must a string, an array of ' +
    'strings, an empty object, ' +
    'or a default object.', 'jsonld.SyntaxError',
    {code: 'invalid type value', value: v});
};

/**
 * Returns true if the given subject has the given property.
 *
 * @param subject the subject to check.
 * @param property the property to look for.
 *
 * @return true if the subject has the given property, false if not.
 */
api.hasProperty = (subject, property) => {
  if(subject.hasOwnProperty(property)) {
    const value = subject[property];
    return (!types.isArray(value) || value.length > 0);
  }
  return false;
};

/**
 * Determines if the given value is a property of the given subject.
 *
 * @param subject the subject to check.
 * @param property the property to check.
 * @param value the value to check.
 *
 * @return true if the value exists, false if not.
 */
api.hasValue = (subject, property, value) => {
  if(api.hasProperty(subject, property)) {
    let val = subject[property];
    const isList = graphTypes.isList(val);
    if(types.isArray(val) || isList) {
      if(isList) {
        val = val['@list'];
      }
      for(let i = 0; i < val.length; ++i) {
        if(api.compareValues(value, val[i])) {
          return true;
        }
      }
    } else if(!types.isArray(value)) {
      // avoid matching the set of values with an array value parameter
      return api.compareValues(value, val);
    }
  }
  return false;
};

/**
 * Adds a value to a subject. If the value is an array, all values in the
 * array will be added.
 *
 * @param subject the subject to add the value to.
 * @param property the property that relates the value to the subject.
 * @param value the value to add.
 * @param [options] the options to use:
 *        [propertyIsArray] true if the property is always an array, false
 *          if not (default: false).
 *        [valueIsArray] true if the value to be added should be preserved as
 *          an array (lists) (default: false).
 *        [allowDuplicate] true to allow duplicates, false not to (uses a
 *          simple shallow comparison of subject ID or value) (default: true).
 *        [prependValue] false to prepend value to any existing values.
 *          (default: false)
 */
api.addValue = (subject, property, value, options) => {
  options = options || {};
  if(!('propertyIsArray' in options)) {
    options.propertyIsArray = false;
  }
  if(!('valueIsArray' in options)) {
    options.valueIsArray = false;
  }
  if(!('allowDuplicate' in options)) {
    options.allowDuplicate = true;
  }
  if(!('prependValue' in options)) {
    options.prependValue = false;
  }

  if(options.valueIsArray) {
    subject[property] = value;
  } else if(types.isArray(value)) {
    if(value.length === 0 && options.propertyIsArray &&
      !subject.hasOwnProperty(property)) {
      subject[property] = [];
    }
    if(options.prependValue) {
      value = value.concat(subject[property]);
      subject[property] = [];
    }
    for(let i = 0; i < value.length; ++i) {
      api.addValue(subject, property, value[i], options);
    }
  } else if(subject.hasOwnProperty(property)) {
    // check if subject already has value if duplicates not allowed
    const hasValue = (!options.allowDuplicate &&
      api.hasValue(subject, property, value));

    // make property an array if value not present or always an array
    if(!types.isArray(subject[property]) &&
      (!hasValue || options.propertyIsArray)) {
      subject[property] = [subject[property]];
    }

    // add new value
    if(!hasValue) {
      if(options.prependValue) {
        subject[property].unshift(value);
      } else {
        subject[property].push(value);
      }
    }
  } else {
    // add new value as set or single value
    subject[property] = options.propertyIsArray ? [value] : value;
  }
};

/**
 * Gets all of the values for a subject's property as an array.
 *
 * @param subject the subject.
 * @param property the property.
 *
 * @return all of the values for a subject's property as an array.
 */
api.getValues = (subject, property) => [].concat(subject[property] || []);

/**
 * Removes a property from a subject.
 *
 * @param subject the subject.
 * @param property the property.
 */
api.removeProperty = (subject, property) => {
  delete subject[property];
};

/**
 * Removes a value from a subject.
 *
 * @param subject the subject.
 * @param property the property that relates the value to the subject.
 * @param value the value to remove.
 * @param [options] the options to use:
 *          [propertyIsArray] true if the property is always an array, false
 *            if not (default: false).
 */
api.removeValue = (subject, property, value, options) => {
  options = options || {};
  if(!('propertyIsArray' in options)) {
    options.propertyIsArray = false;
  }

  // filter out value
  const values = api.getValues(subject, property).filter(
    e => !api.compareValues(e, value));

  if(values.length === 0) {
    api.removeProperty(subject, property);
  } else if(values.length === 1 && !options.propertyIsArray) {
    subject[property] = values[0];
  } else {
    subject[property] = values;
  }
};

/**
 * Relabels all blank nodes in the given JSON-LD input.
 *
 * @param input the JSON-LD input.
 * @param [options] the options to use:
 *          [issuer] an IdentifierIssuer to use to label blank nodes.
 */
api.relabelBlankNodes = (input, options) => {
  options = options || {};
  const issuer = options.issuer || new IdentifierIssuer('_:b');
  return _labelBlankNodes(issuer, input);
};

/**
 * Compares two JSON-LD values for equality. Two JSON-LD values will be
 * considered equal if:
 *
 * 1. They are both primitives of the same type and value.
 * 2. They are both @values with the same @value, @type, @language,
 *   and @index, OR
 * 3. They both have @ids they are the same.
 *
 * @param v1 the first value.
 * @param v2 the second value.
 *
 * @return true if v1 and v2 are considered equal, false if not.
 */
api.compareValues = (v1, v2) => {
  // 1. equal primitives
  if(v1 === v2) {
    return true;
  }

  // 2. equal @values
  if(graphTypes.isValue(v1) && graphTypes.isValue(v2) &&
    v1['@value'] === v2['@value'] &&
    v1['@type'] === v2['@type'] &&
    v1['@language'] === v2['@language'] &&
    v1['@index'] === v2['@index']) {
    return true;
  }

  // 3. equal @ids
  if(types.isObject(v1) &&
    ('@id' in v1) &&
    types.isObject(v2) &&
    ('@id' in v2)) {
    return v1['@id'] === v2['@id'];
  }

  return false;
};

/**
 * Compares two strings first based on length and then lexicographically.
 *
 * @param a the first string.
 * @param b the second string.
 *
 * @return -1 if a < b, 1 if a > b, 0 if a === b.
 */
api.compareShortestLeast = (a, b) => {
  if(a.length < b.length) {
    return -1;
  }
  if(b.length < a.length) {
    return 1;
  }
  if(a === b) {
    return 0;
  }
  return (a < b) ? -1 : 1;
};

/**
 * Labels the blank nodes in the given value using the given IdentifierIssuer.
 *
 * @param issuer the IdentifierIssuer to use.
 * @param element the element with blank nodes to rename.
 *
 * @return the element.
 */
function _labelBlankNodes(issuer, element) {
  if(types.isArray(element)) {
    for(let i = 0; i < element.length; ++i) {
      element[i] = _labelBlankNodes(issuer, element[i]);
    }
  } else if(graphTypes.isList(element)) {
    element['@list'] = _labelBlankNodes(issuer, element['@list']);
  } else if(types.isObject(element)) {
    // relabel blank node
    if(graphTypes.isBlankNode(element)) {
      element['@id'] = issuer.getId(element['@id']);
    }

    // recursively apply to all keys
    const keys = Object.keys(element).sort();
    for(let ki = 0; ki < keys.length; ++ki) {
      const key = keys[ki];
      if(key !== '@id') {
        element[key] = _labelBlankNodes(issuer, element[key]);
      }
    }
  }

  return element;
}

},{"./JsonLdError":47,"./graphTypes":60,"./types":65,"rdf-canonize":70}],68:[function(_dereq_,module,exports){
'use strict'

// A linked list to keep track of recently-used-ness
const Yallist = _dereq_('yallist')

const MAX = Symbol('max')
const LENGTH = Symbol('length')
const LENGTH_CALCULATOR = Symbol('lengthCalculator')
const ALLOW_STALE = Symbol('allowStale')
const MAX_AGE = Symbol('maxAge')
const DISPOSE = Symbol('dispose')
const NO_DISPOSE_ON_SET = Symbol('noDisposeOnSet')
const LRU_LIST = Symbol('lruList')
const CACHE = Symbol('cache')
const UPDATE_AGE_ON_GET = Symbol('updateAgeOnGet')

const naiveLength = () => 1

// lruList is a yallist where the head is the youngest
// item, and the tail is the oldest.  the list contains the Hit
// objects as the entries.
// Each Hit object has a reference to its Yallist.Node.  This
// never changes.
//
// cache is a Map (or PseudoMap) that matches the keys to
// the Yallist.Node object.
class LRUCache {
  constructor (options) {
    if (typeof options === 'number')
      options = { max: options }

    if (!options)
      options = {}

    if (options.max && (typeof options.max !== 'number' || options.max < 0))
      throw new TypeError('max must be a non-negative number')
    // Kind of weird to have a default max of Infinity, but oh well.
    const max = this[MAX] = options.max || Infinity

    const lc = options.length || naiveLength
    this[LENGTH_CALCULATOR] = (typeof lc !== 'function') ? naiveLength : lc
    this[ALLOW_STALE] = options.stale || false
    if (options.maxAge && typeof options.maxAge !== 'number')
      throw new TypeError('maxAge must be a number')
    this[MAX_AGE] = options.maxAge || 0
    this[DISPOSE] = options.dispose
    this[NO_DISPOSE_ON_SET] = options.noDisposeOnSet || false
    this[UPDATE_AGE_ON_GET] = options.updateAgeOnGet || false
    this.reset()
  }

  // resize the cache when the max changes.
  set max (mL) {
    if (typeof mL !== 'number' || mL < 0)
      throw new TypeError('max must be a non-negative number')

    this[MAX] = mL || Infinity
    trim(this)
  }
  get max () {
    return this[MAX]
  }

  set allowStale (allowStale) {
    this[ALLOW_STALE] = !!allowStale
  }
  get allowStale () {
    return this[ALLOW_STALE]
  }

  set maxAge (mA) {
    if (typeof mA !== 'number')
      throw new TypeError('maxAge must be a non-negative number')

    this[MAX_AGE] = mA
    trim(this)
  }
  get maxAge () {
    return this[MAX_AGE]
  }

  // resize the cache when the lengthCalculator changes.
  set lengthCalculator (lC) {
    if (typeof lC !== 'function')
      lC = naiveLength

    if (lC !== this[LENGTH_CALCULATOR]) {
      this[LENGTH_CALCULATOR] = lC
      this[LENGTH] = 0
      this[LRU_LIST].forEach(hit => {
        hit.length = this[LENGTH_CALCULATOR](hit.value, hit.key)
        this[LENGTH] += hit.length
      })
    }
    trim(this)
  }
  get lengthCalculator () { return this[LENGTH_CALCULATOR] }

  get length () { return this[LENGTH] }
  get itemCount () { return this[LRU_LIST].length }

  rforEach (fn, thisp) {
    thisp = thisp || this
    for (let walker = this[LRU_LIST].tail; walker !== null;) {
      const prev = walker.prev
      forEachStep(this, fn, walker, thisp)
      walker = prev
    }
  }

  forEach (fn, thisp) {
    thisp = thisp || this
    for (let walker = this[LRU_LIST].head; walker !== null;) {
      const next = walker.next
      forEachStep(this, fn, walker, thisp)
      walker = next
    }
  }

  keys () {
    return this[LRU_LIST].toArray().map(k => k.key)
  }

  values () {
    return this[LRU_LIST].toArray().map(k => k.value)
  }

  reset () {
    if (this[DISPOSE] &&
        this[LRU_LIST] &&
        this[LRU_LIST].length) {
      this[LRU_LIST].forEach(hit => this[DISPOSE](hit.key, hit.value))
    }

    this[CACHE] = new Map() // hash of items by key
    this[LRU_LIST] = new Yallist() // list of items in order of use recency
    this[LENGTH] = 0 // length of items in the list
  }

  dump () {
    return this[LRU_LIST].map(hit =>
      isStale(this, hit) ? false : {
        k: hit.key,
        v: hit.value,
        e: hit.now + (hit.maxAge || 0)
      }).toArray().filter(h => h)
  }

  dumpLru () {
    return this[LRU_LIST]
  }

  set (key, value, maxAge) {
    maxAge = maxAge || this[MAX_AGE]

    if (maxAge && typeof maxAge !== 'number')
      throw new TypeError('maxAge must be a number')

    const now = maxAge ? Date.now() : 0
    const len = this[LENGTH_CALCULATOR](value, key)

    if (this[CACHE].has(key)) {
      if (len > this[MAX]) {
        del(this, this[CACHE].get(key))
        return false
      }

      const node = this[CACHE].get(key)
      const item = node.value

      // dispose of the old one before overwriting
      // split out into 2 ifs for better coverage tracking
      if (this[DISPOSE]) {
        if (!this[NO_DISPOSE_ON_SET])
          this[DISPOSE](key, item.value)
      }

      item.now = now
      item.maxAge = maxAge
      item.value = value
      this[LENGTH] += len - item.length
      item.length = len
      this.get(key)
      trim(this)
      return true
    }

    const hit = new Entry(key, value, len, now, maxAge)

    // oversized objects fall out of cache automatically.
    if (hit.length > this[MAX]) {
      if (this[DISPOSE])
        this[DISPOSE](key, value)

      return false
    }

    this[LENGTH] += hit.length
    this[LRU_LIST].unshift(hit)
    this[CACHE].set(key, this[LRU_LIST].head)
    trim(this)
    return true
  }

  has (key) {
    if (!this[CACHE].has(key)) return false
    const hit = this[CACHE].get(key).value
    return !isStale(this, hit)
  }

  get (key) {
    return get(this, key, true)
  }

  peek (key) {
    return get(this, key, false)
  }

  pop () {
    const node = this[LRU_LIST].tail
    if (!node)
      return null

    del(this, node)
    return node.value
  }

  del (key) {
    del(this, this[CACHE].get(key))
  }

  load (arr) {
    // reset the cache
    this.reset()

    const now = Date.now()
    // A previous serialized cache has the most recent items first
    for (let l = arr.length - 1; l >= 0; l--) {
      const hit = arr[l]
      const expiresAt = hit.e || 0
      if (expiresAt === 0)
        // the item was created without expiration in a non aged cache
        this.set(hit.k, hit.v)
      else {
        const maxAge = expiresAt - now
        // dont add already expired items
        if (maxAge > 0) {
          this.set(hit.k, hit.v, maxAge)
        }
      }
    }
  }

  prune () {
    this[CACHE].forEach((value, key) => get(this, key, false))
  }
}

const get = (self, key, doUse) => {
  const node = self[CACHE].get(key)
  if (node) {
    const hit = node.value
    if (isStale(self, hit)) {
      del(self, node)
      if (!self[ALLOW_STALE])
        return undefined
    } else {
      if (doUse) {
        if (self[UPDATE_AGE_ON_GET])
          node.value.now = Date.now()
        self[LRU_LIST].unshiftNode(node)
      }
    }
    return hit.value
  }
}

const isStale = (self, hit) => {
  if (!hit || (!hit.maxAge && !self[MAX_AGE]))
    return false

  const diff = Date.now() - hit.now
  return hit.maxAge ? diff > hit.maxAge
    : self[MAX_AGE] && (diff > self[MAX_AGE])
}

const trim = self => {
  if (self[LENGTH] > self[MAX]) {
    for (let walker = self[LRU_LIST].tail;
      self[LENGTH] > self[MAX] && walker !== null;) {
      // We know that we're about to delete this one, and also
      // what the next least recently used key will be, so just
      // go ahead and set it now.
      const prev = walker.prev
      del(self, walker)
      walker = prev
    }
  }
}

const del = (self, node) => {
  if (node) {
    const hit = node.value
    if (self[DISPOSE])
      self[DISPOSE](hit.key, hit.value)

    self[LENGTH] -= hit.length
    self[CACHE].delete(hit.key)
    self[LRU_LIST].removeNode(node)
  }
}

class Entry {
  constructor (key, value, length, now, maxAge) {
    this.key = key
    this.value = value
    this.length = length
    this.now = now
    this.maxAge = maxAge || 0
  }
}

const forEachStep = (self, fn, node, thisp) => {
  let hit = node.value
  if (isStale(self, hit)) {
    del(self, node)
    if (!self[ALLOW_STALE])
      hit = undefined
  }
  if (hit)
    fn.call(thisp, hit.value, hit.key, self)
}

module.exports = LRUCache

},{"yallist":83}],69:[function(_dereq_,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],70:[function(_dereq_,module,exports){
/**
 * An implementation of the RDF Dataset Normalization specification.
 *
 * @author Dave Longley
 *
 * Copyright 2010-2021 Digital Bazaar, Inc.
 */
module.exports = _dereq_('./lib');

},{"./lib":79}],71:[function(_dereq_,module,exports){
/*
 * Copyright (c) 2016-2021 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

module.exports = class IdentifierIssuer {
  /**
   * Creates a new IdentifierIssuer. A IdentifierIssuer issues unique
   * identifiers, keeping track of any previously issued identifiers.
   *
   * @param prefix the prefix to use ('<prefix><counter>').
   * @param existing an existing Map to use.
   * @param counter the counter to use.
   */
  constructor(prefix, existing = new Map(), counter = 0) {
    this.prefix = prefix;
    this._existing = existing;
    this.counter = counter;
  }

  /**
   * Copies this IdentifierIssuer.
   *
   * @return a copy of this IdentifierIssuer.
   */
  clone() {
    const {prefix, _existing, counter} = this;
    return new IdentifierIssuer(prefix, new Map(_existing), counter);
  }

  /**
   * Gets the new identifier for the given old identifier, where if no old
   * identifier is given a new identifier will be generated.
   *
   * @param [old] the old identifier to get the new identifier for.
   *
   * @return the new identifier.
   */
  getId(old) {
    // return existing old identifier
    const existing = old && this._existing.get(old);
    if(existing) {
      return existing;
    }

    // get next identifier
    const identifier = this.prefix + this.counter;
    this.counter++;

    // save mapping
    if(old) {
      this._existing.set(old, identifier);
    }

    return identifier;
  }

  /**
   * Returns true if the given old identifer has already been assigned a new
   * identifier.
   *
   * @param old the old identifier to check.
   *
   * @return true if the old identifier has been assigned a new identifier,
   *   false if not.
   */
  hasId(old) {
    return this._existing.has(old);
  }

  /**
   * Returns all of the IDs that have been issued new IDs in the order in
   * which they were issued new IDs.
   *
   * @return the list of old IDs that has been issued new IDs in order.
   */
  getOldIds() {
    return [...this._existing.keys()];
  }
};

},{}],72:[function(_dereq_,module,exports){
/*
 * Copyright (c) 2016-2021 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

_dereq_('setimmediate');

const crypto = self.crypto || self.msCrypto;

// TODO: synchronous version no longer supported in browser

module.exports = class MessageDigest {
  /**
   * Creates a new MessageDigest.
   *
   * @param algorithm the algorithm to use.
   */
  constructor(algorithm) {
    // check if crypto.subtle is available
    // check is here rather than top-level to only fail if class is used
    if(!(crypto && crypto.subtle)) {
      throw new Error('crypto.subtle not found.');
    }
    if(algorithm === 'sha256') {
      this.algorithm = {name: 'SHA-256'};
    } else if(algorithm === 'sha1') {
      this.algorithm = {name: 'SHA-1'};
    } else {
      throw new Error(`Unsupport algorithm "${algorithm}".`);
    }
    this._content = '';
  }

  update(msg) {
    this._content += msg;
  }

  async digest() {
    const data = new TextEncoder().encode(this._content);
    const buffer = new Uint8Array(
      await crypto.subtle.digest(this.algorithm, data));
    // return digest in hex
    let hex = '';
    for(let i = 0; i < buffer.length; ++i) {
      hex += buffer[i].toString(16).padStart(2, '0');
    }
    return hex;
  }
};

},{"setimmediate":80}],73:[function(_dereq_,module,exports){
/*
 * Copyright (c) 2016-2021 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

// eslint-disable-next-line no-unused-vars
const TERMS = ['subject', 'predicate', 'object', 'graph'];
const RDF = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#';
const RDF_LANGSTRING = RDF + 'langString';
const XSD_STRING = 'http://www.w3.org/2001/XMLSchema#string';

const TYPE_NAMED_NODE = 'NamedNode';
const TYPE_BLANK_NODE = 'BlankNode';
const TYPE_LITERAL = 'Literal';
const TYPE_DEFAULT_GRAPH = 'DefaultGraph';

// build regexes
const REGEX = {};
(() => {
  const iri = '(?:<([^:]+:[^>]*)>)';
  // https://www.w3.org/TR/turtle/#grammar-production-BLANK_NODE_LABEL
  const PN_CHARS_BASE =
    'A-Z' + 'a-z' +
    '\u00C0-\u00D6' +
    '\u00D8-\u00F6' +
    '\u00F8-\u02FF' +
    '\u0370-\u037D' +
    '\u037F-\u1FFF' +
    '\u200C-\u200D' +
    '\u2070-\u218F' +
    '\u2C00-\u2FEF' +
    '\u3001-\uD7FF' +
    '\uF900-\uFDCF' +
    '\uFDF0-\uFFFD';
    // TODO:
    //'\u10000-\uEFFFF';
  const PN_CHARS_U =
    PN_CHARS_BASE +
    '_';
  const PN_CHARS =
    PN_CHARS_U +
    '0-9' +
    '-' +
    '\u00B7' +
    '\u0300-\u036F' +
    '\u203F-\u2040';
  const BLANK_NODE_LABEL =
    '(_:' +
      '(?:[' + PN_CHARS_U + '0-9])' +
      '(?:(?:[' + PN_CHARS + '.])*(?:[' + PN_CHARS + ']))?' +
    ')';
  const bnode = BLANK_NODE_LABEL;
  const plain = '"([^"\\\\]*(?:\\\\.[^"\\\\]*)*)"';
  const datatype = '(?:\\^\\^' + iri + ')';
  const language = '(?:@([a-zA-Z]+(?:-[a-zA-Z0-9]+)*))';
  const literal = '(?:' + plain + '(?:' + datatype + '|' + language + ')?)';
  const ws = '[ \\t]+';
  const wso = '[ \\t]*';

  // define quad part regexes
  const subject = '(?:' + iri + '|' + bnode + ')' + ws;
  const property = iri + ws;
  const object = '(?:' + iri + '|' + bnode + '|' + literal + ')' + wso;
  const graphName = '(?:\\.|(?:(?:' + iri + '|' + bnode + ')' + wso + '\\.))';

  // end of line and empty regexes
  REGEX.eoln = /(?:\r\n)|(?:\n)|(?:\r)/g;
  REGEX.empty = new RegExp('^' + wso + '$');

  // full quad regex
  REGEX.quad = new RegExp(
    '^' + wso + subject + property + object + graphName + wso + '$');
})();

module.exports = class NQuads {
  /**
   * Parses RDF in the form of N-Quads.
   *
   * @param input the N-Quads input to parse.
   *
   * @return an RDF dataset (an array of quads per http://rdf.js.org/).
   */
  static parse(input) {
    // build RDF dataset
    const dataset = [];

    const graphs = {};

    // split N-Quad input into lines
    const lines = input.split(REGEX.eoln);
    let lineNumber = 0;
    for(const line of lines) {
      lineNumber++;

      // skip empty lines
      if(REGEX.empty.test(line)) {
        continue;
      }

      // parse quad
      const match = line.match(REGEX.quad);
      if(match === null) {
        throw new Error('N-Quads parse error on line ' + lineNumber + '.');
      }

      // create RDF quad
      const quad = {subject: null, predicate: null, object: null, graph: null};

      // get subject
      if(match[1] !== undefined) {
        quad.subject = {termType: TYPE_NAMED_NODE, value: match[1]};
      } else {
        quad.subject = {termType: TYPE_BLANK_NODE, value: match[2]};
      }

      // get predicate
      quad.predicate = {termType: TYPE_NAMED_NODE, value: match[3]};

      // get object
      if(match[4] !== undefined) {
        quad.object = {termType: TYPE_NAMED_NODE, value: match[4]};
      } else if(match[5] !== undefined) {
        quad.object = {termType: TYPE_BLANK_NODE, value: match[5]};
      } else {
        quad.object = {
          termType: TYPE_LITERAL,
          value: undefined,
          datatype: {
            termType: TYPE_NAMED_NODE
          }
        };
        if(match[7] !== undefined) {
          quad.object.datatype.value = match[7];
        } else if(match[8] !== undefined) {
          quad.object.datatype.value = RDF_LANGSTRING;
          quad.object.language = match[8];
        } else {
          quad.object.datatype.value = XSD_STRING;
        }
        quad.object.value = _unescape(match[6]);
      }

      // get graph
      if(match[9] !== undefined) {
        quad.graph = {
          termType: TYPE_NAMED_NODE,
          value: match[9]
        };
      } else if(match[10] !== undefined) {
        quad.graph = {
          termType: TYPE_BLANK_NODE,
          value: match[10]
        };
      } else {
        quad.graph = {
          termType: TYPE_DEFAULT_GRAPH,
          value: ''
        };
      }

      // only add quad if it is unique in its graph
      if(!(quad.graph.value in graphs)) {
        graphs[quad.graph.value] = [quad];
        dataset.push(quad);
      } else {
        let unique = true;
        const quads = graphs[quad.graph.value];
        for(const q of quads) {
          if(_compareTriples(q, quad)) {
            unique = false;
            break;
          }
        }
        if(unique) {
          quads.push(quad);
          dataset.push(quad);
        }
      }
    }

    return dataset;
  }

  /**
   * Converts an RDF dataset to N-Quads.
   *
   * @param dataset (array of quads) the RDF dataset to convert.
   *
   * @return the N-Quads string.
   */
  static serialize(dataset) {
    if(!Array.isArray(dataset)) {
      dataset = NQuads.legacyDatasetToQuads(dataset);
    }
    const quads = [];
    for(const quad of dataset) {
      quads.push(NQuads.serializeQuad(quad));
    }
    return quads.sort().join('');
  }

  /**
   * Converts an RDF quad to an N-Quad string (a single quad).
   *
   * @param quad the RDF quad convert.
   *
   * @return the N-Quad string.
   */
  static serializeQuad(quad) {
    const s = quad.subject;
    const p = quad.predicate;
    const o = quad.object;
    const g = quad.graph;

    let nquad = '';

    // subject can only be NamedNode or BlankNode
    if(s.termType === TYPE_NAMED_NODE) {
      nquad += `<${s.value}>`;
    } else {
      nquad += `${s.value}`;
    }

    // predicate can only be NamedNode
    nquad += ` <${p.value}> `;

    // object is NamedNode, BlankNode, or Literal
    if(o.termType === TYPE_NAMED_NODE) {
      nquad += `<${o.value}>`;
    } else if(o.termType === TYPE_BLANK_NODE) {
      nquad += o.value;
    } else {
      nquad += `"${_escape(o.value)}"`;
      if(o.datatype.value === RDF_LANGSTRING) {
        if(o.language) {
          nquad += `@${o.language}`;
        }
      } else if(o.datatype.value !== XSD_STRING) {
        nquad += `^^<${o.datatype.value}>`;
      }
    }

    // graph can only be NamedNode or BlankNode (or DefaultGraph, but that
    // does not add to `nquad`)
    if(g.termType === TYPE_NAMED_NODE) {
      nquad += ` <${g.value}>`;
    } else if(g.termType === TYPE_BLANK_NODE) {
      nquad += ` ${g.value}`;
    }

    nquad += ' .\n';
    return nquad;
  }

  /**
   * Converts a legacy-formatted dataset to an array of quads dataset per
   * http://rdf.js.org/.
   *
   * @param dataset the legacy dataset to convert.
   *
   * @return the array of quads dataset.
   */
  static legacyDatasetToQuads(dataset) {
    const quads = [];

    const termTypeMap = {
      'blank node': TYPE_BLANK_NODE,
      IRI: TYPE_NAMED_NODE,
      literal: TYPE_LITERAL
    };

    for(const graphName in dataset) {
      const triples = dataset[graphName];
      triples.forEach(triple => {
        const quad = {};
        for(const componentName in triple) {
          const oldComponent = triple[componentName];
          const newComponent = {
            termType: termTypeMap[oldComponent.type],
            value: oldComponent.value
          };
          if(newComponent.termType === TYPE_LITERAL) {
            newComponent.datatype = {
              termType: TYPE_NAMED_NODE
            };
            if('datatype' in oldComponent) {
              newComponent.datatype.value = oldComponent.datatype;
            }
            if('language' in oldComponent) {
              if(!('datatype' in oldComponent)) {
                newComponent.datatype.value = RDF_LANGSTRING;
              }
              newComponent.language = oldComponent.language;
            } else if(!('datatype' in oldComponent)) {
              newComponent.datatype.value = XSD_STRING;
            }
          }
          quad[componentName] = newComponent;
        }
        if(graphName === '@default') {
          quad.graph = {
            termType: TYPE_DEFAULT_GRAPH,
            value: ''
          };
        } else {
          quad.graph = {
            termType: graphName.startsWith('_:') ?
              TYPE_BLANK_NODE : TYPE_NAMED_NODE,
            value: graphName
          };
        }
        quads.push(quad);
      });
    }

    return quads;
  }
};

/**
 * Compares two RDF triples for equality.
 *
 * @param t1 the first triple.
 * @param t2 the second triple.
 *
 * @return true if the triples are the same, false if not.
 */
function _compareTriples(t1, t2) {
  // compare subject and object types first as it is the quickest check
  if(!(t1.subject.termType === t2.subject.termType &&
    t1.object.termType === t2.object.termType)) {
    return false;
  }
  // compare values
  if(!(t1.subject.value === t2.subject.value &&
    t1.predicate.value === t2.predicate.value &&
    t1.object.value === t2.object.value)) {
    return false;
  }
  if(t1.object.termType !== TYPE_LITERAL) {
    // no `datatype` or `language` to check
    return true;
  }
  return (
    (t1.object.datatype.termType === t2.object.datatype.termType) &&
    (t1.object.language === t2.object.language) &&
    (t1.object.datatype.value === t2.object.datatype.value)
  );
}

const _escapeRegex = /["\\\n\r]/g;
/**
 * Escape string to N-Quads literal
 */
function _escape(s) {
  return s.replace(_escapeRegex, function(match) {
    switch(match) {
      case '"': return '\\"';
      case '\\': return '\\\\';
      case '\n': return '\\n';
      case '\r': return '\\r';
    }
  });
}

const _unescapeRegex =
  /(?:\\([tbnrf"'\\]))|(?:\\u([0-9A-Fa-f]{4}))|(?:\\U([0-9A-Fa-f]{8}))/g;
/**
 * Unescape N-Quads literal to string
 */
function _unescape(s) {
  return s.replace(_unescapeRegex, function(match, code, u, U) {
    if(code) {
      switch(code) {
        case 't': return '\t';
        case 'b': return '\b';
        case 'n': return '\n';
        case 'r': return '\r';
        case 'f': return '\f';
        case '"': return '"';
        case '\'': return '\'';
        case '\\': return '\\';
      }
    }
    if(u) {
      return String.fromCharCode(parseInt(u, 16));
    }
    if(U) {
      // FIXME: support larger values
      throw new Error('Unsupported U escape');
    }
  });
}

},{}],74:[function(_dereq_,module,exports){
/*
 * Copyright (c) 2016-2021 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

// TODO: convert to ES6 iterable?

module.exports = class Permuter {
  /**
   * A Permuter iterates over all possible permutations of the given array
   * of elements.
   *
   * @param list the array of elements to iterate over.
   */
  constructor(list) {
    // original array
    this.current = list.sort();
    // indicates whether there are more permutations
    this.done = false;
    // directional info for permutation algorithm
    this.dir = new Map();
    for(let i = 0; i < list.length; ++i) {
      this.dir.set(list[i], true);
    }
  }

  /**
   * Returns true if there is another permutation.
   *
   * @return true if there is another permutation, false if not.
   */
  hasNext() {
    return !this.done;
  }

  /**
   * Gets the next permutation. Call hasNext() to ensure there is another one
   * first.
   *
   * @return the next permutation.
   */
  next() {
    // copy current permutation to return it
    const {current, dir} = this;
    const rval = current.slice();

    /* Calculate the next permutation using the Steinhaus-Johnson-Trotter
     permutation algorithm. */

    // get largest mobile element k
    // (mobile: element is greater than the one it is looking at)
    let k = null;
    let pos = 0;
    const length = current.length;
    for(let i = 0; i < length; ++i) {
      const element = current[i];
      const left = dir.get(element);
      if((k === null || element > k) &&
        ((left && i > 0 && element > current[i - 1]) ||
        (!left && i < (length - 1) && element > current[i + 1]))) {
        k = element;
        pos = i;
      }
    }

    // no more permutations
    if(k === null) {
      this.done = true;
    } else {
      // swap k and the element it is looking at
      const swap = dir.get(k) ? pos - 1 : pos + 1;
      current[pos] = current[swap];
      current[swap] = k;

      // reverse the direction of all elements larger than k
      for(const element of current) {
        if(element > k) {
          dir.set(element, !dir.get(element));
        }
      }
    }

    return rval;
  }
};

},{}],75:[function(_dereq_,module,exports){
(function (setImmediate){(function (){
/*
 * Copyright (c) 2016-2021 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const IdentifierIssuer = _dereq_('./IdentifierIssuer');
const MessageDigest = _dereq_('./MessageDigest');
const Permuter = _dereq_('./Permuter');
const NQuads = _dereq_('./NQuads');

module.exports = class URDNA2015 {
  constructor() {
    this.name = 'URDNA2015';
    this.blankNodeInfo = new Map();
    this.canonicalIssuer = new IdentifierIssuer('_:c14n');
    this.hashAlgorithm = 'sha256';
    this.quads = null;
  }

  // 4.4) Normalization Algorithm
  async main(dataset) {
    this.quads = dataset;

    // 1) Create the normalization state.
    // 2) For every quad in input dataset:
    for(const quad of dataset) {
      // 2.1) For each blank node that occurs in the quad, add a reference
      // to the quad using the blank node identifier in the blank node to
      // quads map, creating a new entry if necessary.
      this._addBlankNodeQuadInfo({quad, component: quad.subject});
      this._addBlankNodeQuadInfo({quad, component: quad.object});
      this._addBlankNodeQuadInfo({quad, component: quad.graph});
    }

    // 3) Create a list of non-normalized blank node identifiers
    // non-normalized identifiers and populate it using the keys from the
    // blank node to quads map.
    // Note: We use a map here and it was generated during step 2.

    // 4) `simple` flag is skipped -- loop is optimized away. This optimization
    // is permitted because there was a typo in the hash first degree quads
    // algorithm in the URDNA2015 spec that was implemented widely making it
    // such that it could not be fixed; the result was that the loop only
    // needs to be run once and the first degree quad hashes will never change.
    // 5.1-5.2 are skipped; first degree quad hashes are generated just once
    // for all non-normalized blank nodes.

    // 5.3) For each blank node identifier identifier in non-normalized
    // identifiers:
    const hashToBlankNodes = new Map();
    const nonNormalized = [...this.blankNodeInfo.keys()];
    let i = 0;
    for(const id of nonNormalized) {
      // Note: batch hashing first degree quads 100 at a time
      if(++i % 100 === 0) {
        await this._yield();
      }
      // steps 5.3.1 and 5.3.2:
      await this._hashAndTrackBlankNode({id, hashToBlankNodes});
    }

    // 5.4) For each hash to identifier list mapping in hash to blank
    // nodes map, lexicographically-sorted by hash:
    const hashes = [...hashToBlankNodes.keys()].sort();
    // optimize away second sort, gather non-unique hashes in order as we go
    const nonUnique = [];
    for(const hash of hashes) {
      // 5.4.1) If the length of identifier list is greater than 1,
      // continue to the next mapping.
      const idList = hashToBlankNodes.get(hash);
      if(idList.length > 1) {
        nonUnique.push(idList);
        continue;
      }

      // 5.4.2) Use the Issue Identifier algorithm, passing canonical
      // issuer and the single blank node identifier in identifier
      // list, identifier, to issue a canonical replacement identifier
      // for identifier.
      const id = idList[0];
      this.canonicalIssuer.getId(id);

      // Note: These steps are skipped, optimized away since the loop
      // only needs to be run once.
      // 5.4.3) Remove identifier from non-normalized identifiers.
      // 5.4.4) Remove hash from the hash to blank nodes map.
      // 5.4.5) Set simple to true.
    }

    // 6) For each hash to identifier list mapping in hash to blank nodes map,
    // lexicographically-sorted by hash:
    // Note: sort optimized away, use `nonUnique`.
    for(const idList of nonUnique) {
      // 6.1) Create hash path list where each item will be a result of
      // running the Hash N-Degree Quads algorithm.
      const hashPathList = [];

      // 6.2) For each blank node identifier identifier in identifier list:
      for(const id of idList) {
        // 6.2.1) If a canonical identifier has already been issued for
        // identifier, continue to the next identifier.
        if(this.canonicalIssuer.hasId(id)) {
          continue;
        }

        // 6.2.2) Create temporary issuer, an identifier issuer
        // initialized with the prefix _:b.
        const issuer = new IdentifierIssuer('_:b');

        // 6.2.3) Use the Issue Identifier algorithm, passing temporary
        // issuer and identifier, to issue a new temporary blank node
        // identifier for identifier.
        issuer.getId(id);

        // 6.2.4) Run the Hash N-Degree Quads algorithm, passing
        // temporary issuer, and append the result to the hash path list.
        const result = await this.hashNDegreeQuads(id, issuer);
        hashPathList.push(result);
      }

      // 6.3) For each result in the hash path list,
      // lexicographically-sorted by the hash in result:
      hashPathList.sort(_stringHashCompare);
      for(const result of hashPathList) {
        // 6.3.1) For each blank node identifier, existing identifier,
        // that was issued a temporary identifier by identifier issuer
        // in result, issue a canonical identifier, in the same order,
        // using the Issue Identifier algorithm, passing canonical
        // issuer and existing identifier.
        const oldIds = result.issuer.getOldIds();
        for(const id of oldIds) {
          this.canonicalIssuer.getId(id);
        }
      }
    }

    /* Note: At this point all blank nodes in the set of RDF quads have been
    assigned canonical identifiers, which have been stored in the canonical
    issuer. Here each quad is updated by assigning each of its blank nodes
    its new identifier. */

    // 7) For each quad, quad, in input dataset:
    const normalized = [];
    for(const quad of this.quads) {
      // 7.1) Create a copy, quad copy, of quad and replace any existing
      // blank node identifiers using the canonical identifiers
      // previously issued by canonical issuer.
      // Note: We optimize with shallow copies here.
      const q = {...quad};
      q.subject = this._useCanonicalId({component: q.subject});
      q.object = this._useCanonicalId({component: q.object});
      q.graph = this._useCanonicalId({component: q.graph});
      // 7.2) Add quad copy to the normalized dataset.
      normalized.push(NQuads.serializeQuad(q));
    }

    // sort normalized output
    normalized.sort();

    // 8) Return the normalized dataset.
    return normalized.join('');
  }

  // 4.6) Hash First Degree Quads
  async hashFirstDegreeQuads(id) {
    // 1) Initialize nquads to an empty list. It will be used to store quads in
    // N-Quads format.
    const nquads = [];

    // 2) Get the list of quads `quads` associated with the reference blank node
    // identifier in the blank node to quads map.
    const info = this.blankNodeInfo.get(id);
    const quads = info.quads;

    // 3) For each quad `quad` in `quads`:
    for(const quad of quads) {
      // 3.1) Serialize the quad in N-Quads format with the following special
      // rule:

      // 3.1.1) If any component in quad is an blank node, then serialize it
      // using a special identifier as follows:
      const copy = {
        subject: null, predicate: quad.predicate, object: null, graph: null
      };
      // 3.1.2) If the blank node's existing blank node identifier matches
      // the reference blank node identifier then use the blank node
      // identifier _:a, otherwise, use the blank node identifier _:z.
      copy.subject = this.modifyFirstDegreeComponent(
        id, quad.subject, 'subject');
      copy.object = this.modifyFirstDegreeComponent(
        id, quad.object, 'object');
      copy.graph = this.modifyFirstDegreeComponent(
        id, quad.graph, 'graph');
      nquads.push(NQuads.serializeQuad(copy));
    }

    // 4) Sort nquads in lexicographical order.
    nquads.sort();

    // 5) Return the hash that results from passing the sorted, joined nquads
    // through the hash algorithm.
    const md = new MessageDigest(this.hashAlgorithm);
    for(const nquad of nquads) {
      md.update(nquad);
    }
    info.hash = await md.digest();
    return info.hash;
  }

  // 4.7) Hash Related Blank Node
  async hashRelatedBlankNode(related, quad, issuer, position) {
    // 1) Set the identifier to use for related, preferring first the canonical
    // identifier for related if issued, second the identifier issued by issuer
    // if issued, and last, if necessary, the result of the Hash First Degree
    // Quads algorithm, passing related.
    let id;
    if(this.canonicalIssuer.hasId(related)) {
      id = this.canonicalIssuer.getId(related);
    } else if(issuer.hasId(related)) {
      id = issuer.getId(related);
    } else {
      id = this.blankNodeInfo.get(related).hash;
    }

    // 2) Initialize a string input to the value of position.
    // Note: We use a hash object instead.
    const md = new MessageDigest(this.hashAlgorithm);
    md.update(position);

    // 3) If position is not g, append <, the value of the predicate in quad,
    // and > to input.
    if(position !== 'g') {
      md.update(this.getRelatedPredicate(quad));
    }

    // 4) Append identifier to input.
    md.update(id);

    // 5) Return the hash that results from passing input through the hash
    // algorithm.
    return md.digest();
  }

  // 4.8) Hash N-Degree Quads
  async hashNDegreeQuads(id, issuer) {
    // 1) Create a hash to related blank nodes map for storing hashes that
    // identify related blank nodes.
    // Note: 2) and 3) handled within `createHashToRelated`
    const md = new MessageDigest(this.hashAlgorithm);
    const hashToRelated = await this.createHashToRelated(id, issuer);

    // 4) Create an empty string, data to hash.
    // Note: We created a hash object `md` above instead.

    // 5) For each related hash to blank node list mapping in hash to related
    // blank nodes map, sorted lexicographically by related hash:
    const hashes = [...hashToRelated.keys()].sort();
    for(const hash of hashes) {
      // 5.1) Append the related hash to the data to hash.
      md.update(hash);

      // 5.2) Create a string chosen path.
      let chosenPath = '';

      // 5.3) Create an unset chosen issuer variable.
      let chosenIssuer;

      // 5.4) For each permutation of blank node list:
      const permuter = new Permuter(hashToRelated.get(hash));
      let i = 0;
      while(permuter.hasNext()) {
        const permutation = permuter.next();
        // Note: batch permutations 3 at a time
        if(++i % 3 === 0) {
          await this._yield();
        }

        // 5.4.1) Create a copy of issuer, issuer copy.
        let issuerCopy = issuer.clone();

        // 5.4.2) Create a string path.
        let path = '';

        // 5.4.3) Create a recursion list, to store blank node identifiers
        // that must be recursively processed by this algorithm.
        const recursionList = [];

        // 5.4.4) For each related in permutation:
        let nextPermutation = false;
        for(const related of permutation) {
          // 5.4.4.1) If a canonical identifier has been issued for
          // related, append it to path.
          if(this.canonicalIssuer.hasId(related)) {
            path += this.canonicalIssuer.getId(related);
          } else {
            // 5.4.4.2) Otherwise:
            // 5.4.4.2.1) If issuer copy has not issued an identifier for
            // related, append related to recursion list.
            if(!issuerCopy.hasId(related)) {
              recursionList.push(related);
            }
            // 5.4.4.2.2) Use the Issue Identifier algorithm, passing
            // issuer copy and related and append the result to path.
            path += issuerCopy.getId(related);
          }

          // 5.4.4.3) If chosen path is not empty and the length of path
          // is greater than or equal to the length of chosen path and
          // path is lexicographically greater than chosen path, then
          // skip to the next permutation.
          // Note: Comparing path length to chosen path length can be optimized
          // away; only compare lexicographically.
          if(chosenPath.length !== 0 && path > chosenPath) {
            nextPermutation = true;
            break;
          }
        }

        if(nextPermutation) {
          continue;
        }

        // 5.4.5) For each related in recursion list:
        for(const related of recursionList) {
          // 5.4.5.1) Set result to the result of recursively executing
          // the Hash N-Degree Quads algorithm, passing related for
          // identifier and issuer copy for path identifier issuer.
          const result = await this.hashNDegreeQuads(related, issuerCopy);

          // 5.4.5.2) Use the Issue Identifier algorithm, passing issuer
          // copy and related and append the result to path.
          path += issuerCopy.getId(related);

          // 5.4.5.3) Append <, the hash in result, and > to path.
          path += `<${result.hash}>`;

          // 5.4.5.4) Set issuer copy to the identifier issuer in
          // result.
          issuerCopy = result.issuer;

          // 5.4.5.5) If chosen path is not empty and the length of path
          // is greater than or equal to the length of chosen path and
          // path is lexicographically greater than chosen path, then
          // skip to the next permutation.
          // Note: Comparing path length to chosen path length can be optimized
          // away; only compare lexicographically.
          if(chosenPath.length !== 0 && path > chosenPath) {
            nextPermutation = true;
            break;
          }
        }

        if(nextPermutation) {
          continue;
        }

        // 5.4.6) If chosen path is empty or path is lexicographically
        // less than chosen path, set chosen path to path and chosen
        // issuer to issuer copy.
        if(chosenPath.length === 0 || path < chosenPath) {
          chosenPath = path;
          chosenIssuer = issuerCopy;
        }
      }

      // 5.5) Append chosen path to data to hash.
      md.update(chosenPath);

      // 5.6) Replace issuer, by reference, with chosen issuer.
      issuer = chosenIssuer;
    }

    // 6) Return issuer and the hash that results from passing data to hash
    // through the hash algorithm.
    return {hash: await md.digest(), issuer};
  }

  // helper for modifying component during Hash First Degree Quads
  modifyFirstDegreeComponent(id, component) {
    if(component.termType !== 'BlankNode') {
      return component;
    }
    /* Note: A mistake in the URDNA2015 spec that made its way into
    implementations (and therefore must stay to avoid interop breakage)
    resulted in an assigned canonical ID, if available for
    `component.value`, not being used in place of `_:a`/`_:z`, so
    we don't use it here. */
    return {
      termType: 'BlankNode',
      value: component.value === id ? '_:a' : '_:z'
    };
  }

  // helper for getting a related predicate
  getRelatedPredicate(quad) {
    return `<${quad.predicate.value}>`;
  }

  // helper for creating hash to related blank nodes map
  async createHashToRelated(id, issuer) {
    // 1) Create a hash to related blank nodes map for storing hashes that
    // identify related blank nodes.
    const hashToRelated = new Map();

    // 2) Get a reference, quads, to the list of quads in the blank node to
    // quads map for the key identifier.
    const quads = this.blankNodeInfo.get(id).quads;

    // 3) For each quad in quads:
    let i = 0;
    for(const quad of quads) {
      // Note: batch hashing related blank node quads 100 at a time
      if(++i % 100 === 0) {
        await this._yield();
      }
      // 3.1) For each component in quad, if component is the subject, object,
      // and graph name and it is a blank node that is not identified by
      // identifier:
      // steps 3.1.1 and 3.1.2 occur in helpers:
      await Promise.all([
        this._addRelatedBlankNodeHash({
          quad, component: quad.subject, position: 's',
          id, issuer, hashToRelated
        }),
        this._addRelatedBlankNodeHash({
          quad, component: quad.object, position: 'o',
          id, issuer, hashToRelated
        }),
        this._addRelatedBlankNodeHash({
          quad, component: quad.graph, position: 'g',
          id, issuer, hashToRelated
        })
      ]);
    }

    return hashToRelated;
  }

  async _hashAndTrackBlankNode({id, hashToBlankNodes}) {
    // 5.3.1) Create a hash, hash, according to the Hash First Degree
    // Quads algorithm.
    const hash = await this.hashFirstDegreeQuads(id);

    // 5.3.2) Add hash and identifier to hash to blank nodes map,
    // creating a new entry if necessary.
    const idList = hashToBlankNodes.get(hash);
    if(!idList) {
      hashToBlankNodes.set(hash, [id]);
    } else {
      idList.push(id);
    }
  }

  _addBlankNodeQuadInfo({quad, component}) {
    if(component.termType !== 'BlankNode') {
      return;
    }
    const id = component.value;
    const info = this.blankNodeInfo.get(id);
    if(info) {
      info.quads.add(quad);
    } else {
      this.blankNodeInfo.set(id, {quads: new Set([quad]), hash: null});
    }
  }

  async _addRelatedBlankNodeHash(
    {quad, component, position, id, issuer, hashToRelated}) {
    if(!(component.termType === 'BlankNode' && component.value !== id)) {
      return;
    }
    // 3.1.1) Set hash to the result of the Hash Related Blank Node
    // algorithm, passing the blank node identifier for component as
    // related, quad, path identifier issuer as issuer, and position as
    // either s, o, or g based on whether component is a subject, object,
    // graph name, respectively.
    const related = component.value;
    const hash = await this.hashRelatedBlankNode(
      related, quad, issuer, position);

    // 3.1.2) Add a mapping of hash to the blank node identifier for
    // component to hash to related blank nodes map, adding an entry as
    // necessary.
    const entries = hashToRelated.get(hash);
    if(entries) {
      entries.push(related);
    } else {
      hashToRelated.set(hash, [related]);
    }
  }

  _useCanonicalId({component}) {
    if(component.termType === 'BlankNode' &&
      !component.value.startsWith(this.canonicalIssuer.prefix)) {
      return {
        termType: 'BlankNode',
        value: this.canonicalIssuer.getId(component.value)
      };
    }
    return component;
  }

  async _yield() {
    return new Promise(resolve => setImmediate(resolve));
  }
};

function _stringHashCompare(a, b) {
  return a.hash < b.hash ? -1 : a.hash > b.hash ? 1 : 0;
}

}).call(this)}).call(this,_dereq_("timers").setImmediate)
},{"./IdentifierIssuer":71,"./MessageDigest":72,"./NQuads":73,"./Permuter":74,"timers":81}],76:[function(_dereq_,module,exports){
/*
 * Copyright (c) 2016-2021 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const IdentifierIssuer = _dereq_('./IdentifierIssuer');
const MessageDigest = _dereq_('./MessageDigest');
const Permuter = _dereq_('./Permuter');
const NQuads = _dereq_('./NQuads');

module.exports = class URDNA2015Sync {
  constructor() {
    this.name = 'URDNA2015';
    this.blankNodeInfo = new Map();
    this.canonicalIssuer = new IdentifierIssuer('_:c14n');
    this.hashAlgorithm = 'sha256';
    this.quads = null;
  }

  // 4.4) Normalization Algorithm
  main(dataset) {
    this.quads = dataset;

    // 1) Create the normalization state.
    // 2) For every quad in input dataset:
    for(const quad of dataset) {
      // 2.1) For each blank node that occurs in the quad, add a reference
      // to the quad using the blank node identifier in the blank node to
      // quads map, creating a new entry if necessary.
      this._addBlankNodeQuadInfo({quad, component: quad.subject});
      this._addBlankNodeQuadInfo({quad, component: quad.object});
      this._addBlankNodeQuadInfo({quad, component: quad.graph});
    }

    // 3) Create a list of non-normalized blank node identifiers
    // non-normalized identifiers and populate it using the keys from the
    // blank node to quads map.
    // Note: We use a map here and it was generated during step 2.

    // 4) `simple` flag is skipped -- loop is optimized away. This optimization
    // is permitted because there was a typo in the hash first degree quads
    // algorithm in the URDNA2015 spec that was implemented widely making it
    // such that it could not be fixed; the result was that the loop only
    // needs to be run once and the first degree quad hashes will never change.
    // 5.1-5.2 are skipped; first degree quad hashes are generated just once
    // for all non-normalized blank nodes.

    // 5.3) For each blank node identifier identifier in non-normalized
    // identifiers:
    const hashToBlankNodes = new Map();
    const nonNormalized = [...this.blankNodeInfo.keys()];
    for(const id of nonNormalized) {
      // steps 5.3.1 and 5.3.2:
      this._hashAndTrackBlankNode({id, hashToBlankNodes});
    }

    // 5.4) For each hash to identifier list mapping in hash to blank
    // nodes map, lexicographically-sorted by hash:
    const hashes = [...hashToBlankNodes.keys()].sort();
    // optimize away second sort, gather non-unique hashes in order as we go
    const nonUnique = [];
    for(const hash of hashes) {
      // 5.4.1) If the length of identifier list is greater than 1,
      // continue to the next mapping.
      const idList = hashToBlankNodes.get(hash);
      if(idList.length > 1) {
        nonUnique.push(idList);
        continue;
      }

      // 5.4.2) Use the Issue Identifier algorithm, passing canonical
      // issuer and the single blank node identifier in identifier
      // list, identifier, to issue a canonical replacement identifier
      // for identifier.
      const id = idList[0];
      this.canonicalIssuer.getId(id);

      // Note: These steps are skipped, optimized away since the loop
      // only needs to be run once.
      // 5.4.3) Remove identifier from non-normalized identifiers.
      // 5.4.4) Remove hash from the hash to blank nodes map.
      // 5.4.5) Set simple to true.
    }

    // 6) For each hash to identifier list mapping in hash to blank nodes map,
    // lexicographically-sorted by hash:
    // Note: sort optimized away, use `nonUnique`.
    for(const idList of nonUnique) {
      // 6.1) Create hash path list where each item will be a result of
      // running the Hash N-Degree Quads algorithm.
      const hashPathList = [];

      // 6.2) For each blank node identifier identifier in identifier list:
      for(const id of idList) {
        // 6.2.1) If a canonical identifier has already been issued for
        // identifier, continue to the next identifier.
        if(this.canonicalIssuer.hasId(id)) {
          continue;
        }

        // 6.2.2) Create temporary issuer, an identifier issuer
        // initialized with the prefix _:b.
        const issuer = new IdentifierIssuer('_:b');

        // 6.2.3) Use the Issue Identifier algorithm, passing temporary
        // issuer and identifier, to issue a new temporary blank node
        // identifier for identifier.
        issuer.getId(id);

        // 6.2.4) Run the Hash N-Degree Quads algorithm, passing
        // temporary issuer, and append the result to the hash path list.
        const result = this.hashNDegreeQuads(id, issuer);
        hashPathList.push(result);
      }

      // 6.3) For each result in the hash path list,
      // lexicographically-sorted by the hash in result:
      hashPathList.sort(_stringHashCompare);
      for(const result of hashPathList) {
        // 6.3.1) For each blank node identifier, existing identifier,
        // that was issued a temporary identifier by identifier issuer
        // in result, issue a canonical identifier, in the same order,
        // using the Issue Identifier algorithm, passing canonical
        // issuer and existing identifier.
        const oldIds = result.issuer.getOldIds();
        for(const id of oldIds) {
          this.canonicalIssuer.getId(id);
        }
      }
    }

    /* Note: At this point all blank nodes in the set of RDF quads have been
    assigned canonical identifiers, which have been stored in the canonical
    issuer. Here each quad is updated by assigning each of its blank nodes
    its new identifier. */

    // 7) For each quad, quad, in input dataset:
    const normalized = [];
    for(const quad of this.quads) {
      // 7.1) Create a copy, quad copy, of quad and replace any existing
      // blank node identifiers using the canonical identifiers
      // previously issued by canonical issuer.
      // Note: We optimize with shallow copies here.
      const q = {...quad};
      q.subject = this._useCanonicalId({component: q.subject});
      q.object = this._useCanonicalId({component: q.object});
      q.graph = this._useCanonicalId({component: q.graph});
      // 7.2) Add quad copy to the normalized dataset.
      normalized.push(NQuads.serializeQuad(q));
    }

    // sort normalized output
    normalized.sort();

    // 8) Return the normalized dataset.
    return normalized.join('');
  }

  // 4.6) Hash First Degree Quads
  hashFirstDegreeQuads(id) {
    // 1) Initialize nquads to an empty list. It will be used to store quads in
    // N-Quads format.
    const nquads = [];

    // 2) Get the list of quads `quads` associated with the reference blank node
    // identifier in the blank node to quads map.
    const info = this.blankNodeInfo.get(id);
    const quads = info.quads;

    // 3) For each quad `quad` in `quads`:
    for(const quad of quads) {
      // 3.1) Serialize the quad in N-Quads format with the following special
      // rule:

      // 3.1.1) If any component in quad is an blank node, then serialize it
      // using a special identifier as follows:
      const copy = {
        subject: null, predicate: quad.predicate, object: null, graph: null
      };
      // 3.1.2) If the blank node's existing blank node identifier matches
      // the reference blank node identifier then use the blank node
      // identifier _:a, otherwise, use the blank node identifier _:z.
      copy.subject = this.modifyFirstDegreeComponent(
        id, quad.subject, 'subject');
      copy.object = this.modifyFirstDegreeComponent(
        id, quad.object, 'object');
      copy.graph = this.modifyFirstDegreeComponent(
        id, quad.graph, 'graph');
      nquads.push(NQuads.serializeQuad(copy));
    }

    // 4) Sort nquads in lexicographical order.
    nquads.sort();

    // 5) Return the hash that results from passing the sorted, joined nquads
    // through the hash algorithm.
    const md = new MessageDigest(this.hashAlgorithm);
    for(const nquad of nquads) {
      md.update(nquad);
    }
    info.hash = md.digest();
    return info.hash;
  }

  // 4.7) Hash Related Blank Node
  hashRelatedBlankNode(related, quad, issuer, position) {
    // 1) Set the identifier to use for related, preferring first the canonical
    // identifier for related if issued, second the identifier issued by issuer
    // if issued, and last, if necessary, the result of the Hash First Degree
    // Quads algorithm, passing related.
    let id;
    if(this.canonicalIssuer.hasId(related)) {
      id = this.canonicalIssuer.getId(related);
    } else if(issuer.hasId(related)) {
      id = issuer.getId(related);
    } else {
      id = this.blankNodeInfo.get(related).hash;
    }

    // 2) Initialize a string input to the value of position.
    // Note: We use a hash object instead.
    const md = new MessageDigest(this.hashAlgorithm);
    md.update(position);

    // 3) If position is not g, append <, the value of the predicate in quad,
    // and > to input.
    if(position !== 'g') {
      md.update(this.getRelatedPredicate(quad));
    }

    // 4) Append identifier to input.
    md.update(id);

    // 5) Return the hash that results from passing input through the hash
    // algorithm.
    return md.digest();
  }

  // 4.8) Hash N-Degree Quads
  hashNDegreeQuads(id, issuer) {
    // 1) Create a hash to related blank nodes map for storing hashes that
    // identify related blank nodes.
    // Note: 2) and 3) handled within `createHashToRelated`
    const md = new MessageDigest(this.hashAlgorithm);
    const hashToRelated = this.createHashToRelated(id, issuer);

    // 4) Create an empty string, data to hash.
    // Note: We created a hash object `md` above instead.

    // 5) For each related hash to blank node list mapping in hash to related
    // blank nodes map, sorted lexicographically by related hash:
    const hashes = [...hashToRelated.keys()].sort();
    for(const hash of hashes) {
      // 5.1) Append the related hash to the data to hash.
      md.update(hash);

      // 5.2) Create a string chosen path.
      let chosenPath = '';

      // 5.3) Create an unset chosen issuer variable.
      let chosenIssuer;

      // 5.4) For each permutation of blank node list:
      const permuter = new Permuter(hashToRelated.get(hash));
      while(permuter.hasNext()) {
        const permutation = permuter.next();

        // 5.4.1) Create a copy of issuer, issuer copy.
        let issuerCopy = issuer.clone();

        // 5.4.2) Create a string path.
        let path = '';

        // 5.4.3) Create a recursion list, to store blank node identifiers
        // that must be recursively processed by this algorithm.
        const recursionList = [];

        // 5.4.4) For each related in permutation:
        let nextPermutation = false;
        for(const related of permutation) {
          // 5.4.4.1) If a canonical identifier has been issued for
          // related, append it to path.
          if(this.canonicalIssuer.hasId(related)) {
            path += this.canonicalIssuer.getId(related);
          } else {
            // 5.4.4.2) Otherwise:
            // 5.4.4.2.1) If issuer copy has not issued an identifier for
            // related, append related to recursion list.
            if(!issuerCopy.hasId(related)) {
              recursionList.push(related);
            }
            // 5.4.4.2.2) Use the Issue Identifier algorithm, passing
            // issuer copy and related and append the result to path.
            path += issuerCopy.getId(related);
          }

          // 5.4.4.3) If chosen path is not empty and the length of path
          // is greater than or equal to the length of chosen path and
          // path is lexicographically greater than chosen path, then
          // skip to the next permutation.
          // Note: Comparing path length to chosen path length can be optimized
          // away; only compare lexicographically.
          if(chosenPath.length !== 0 && path > chosenPath) {
            nextPermutation = true;
            break;
          }
        }

        if(nextPermutation) {
          continue;
        }

        // 5.4.5) For each related in recursion list:
        for(const related of recursionList) {
          // 5.4.5.1) Set result to the result of recursively executing
          // the Hash N-Degree Quads algorithm, passing related for
          // identifier and issuer copy for path identifier issuer.
          const result = this.hashNDegreeQuads(related, issuerCopy);

          // 5.4.5.2) Use the Issue Identifier algorithm, passing issuer
          // copy and related and append the result to path.
          path += issuerCopy.getId(related);

          // 5.4.5.3) Append <, the hash in result, and > to path.
          path += `<${result.hash}>`;

          // 5.4.5.4) Set issuer copy to the identifier issuer in
          // result.
          issuerCopy = result.issuer;

          // 5.4.5.5) If chosen path is not empty and the length of path
          // is greater than or equal to the length of chosen path and
          // path is lexicographically greater than chosen path, then
          // skip to the next permutation.
          // Note: Comparing path length to chosen path length can be optimized
          // away; only compare lexicographically.
          if(chosenPath.length !== 0 && path > chosenPath) {
            nextPermutation = true;
            break;
          }
        }

        if(nextPermutation) {
          continue;
        }

        // 5.4.6) If chosen path is empty or path is lexicographically
        // less than chosen path, set chosen path to path and chosen
        // issuer to issuer copy.
        if(chosenPath.length === 0 || path < chosenPath) {
          chosenPath = path;
          chosenIssuer = issuerCopy;
        }
      }

      // 5.5) Append chosen path to data to hash.
      md.update(chosenPath);

      // 5.6) Replace issuer, by reference, with chosen issuer.
      issuer = chosenIssuer;
    }

    // 6) Return issuer and the hash that results from passing data to hash
    // through the hash algorithm.
    return {hash: md.digest(), issuer};
  }

  // helper for modifying component during Hash First Degree Quads
  modifyFirstDegreeComponent(id, component) {
    if(component.termType !== 'BlankNode') {
      return component;
    }
    /* Note: A mistake in the URDNA2015 spec that made its way into
    implementations (and therefore must stay to avoid interop breakage)
    resulted in an assigned canonical ID, if available for
    `component.value`, not being used in place of `_:a`/`_:z`, so
    we don't use it here. */
    return {
      termType: 'BlankNode',
      value: component.value === id ? '_:a' : '_:z'
    };
  }

  // helper for getting a related predicate
  getRelatedPredicate(quad) {
    return `<${quad.predicate.value}>`;
  }

  // helper for creating hash to related blank nodes map
  createHashToRelated(id, issuer) {
    // 1) Create a hash to related blank nodes map for storing hashes that
    // identify related blank nodes.
    const hashToRelated = new Map();

    // 2) Get a reference, quads, to the list of quads in the blank node to
    // quads map for the key identifier.
    const quads = this.blankNodeInfo.get(id).quads;

    // 3) For each quad in quads:
    for(const quad of quads) {
      // 3.1) For each component in quad, if component is the subject, object,
      // or graph name and it is a blank node that is not identified by
      // identifier:
      // steps 3.1.1 and 3.1.2 occur in helpers:
      this._addRelatedBlankNodeHash({
        quad, component: quad.subject, position: 's',
        id, issuer, hashToRelated
      });
      this._addRelatedBlankNodeHash({
        quad, component: quad.object, position: 'o',
        id, issuer, hashToRelated
      });
      this._addRelatedBlankNodeHash({
        quad, component: quad.graph, position: 'g',
        id, issuer, hashToRelated
      });
    }

    return hashToRelated;
  }

  _hashAndTrackBlankNode({id, hashToBlankNodes}) {
    // 5.3.1) Create a hash, hash, according to the Hash First Degree
    // Quads algorithm.
    const hash = this.hashFirstDegreeQuads(id);

    // 5.3.2) Add hash and identifier to hash to blank nodes map,
    // creating a new entry if necessary.
    const idList = hashToBlankNodes.get(hash);
    if(!idList) {
      hashToBlankNodes.set(hash, [id]);
    } else {
      idList.push(id);
    }
  }

  _addBlankNodeQuadInfo({quad, component}) {
    if(component.termType !== 'BlankNode') {
      return;
    }
    const id = component.value;
    const info = this.blankNodeInfo.get(id);
    if(info) {
      info.quads.add(quad);
    } else {
      this.blankNodeInfo.set(id, {quads: new Set([quad]), hash: null});
    }
  }

  _addRelatedBlankNodeHash(
    {quad, component, position, id, issuer, hashToRelated}) {
    if(!(component.termType === 'BlankNode' && component.value !== id)) {
      return;
    }
    // 3.1.1) Set hash to the result of the Hash Related Blank Node
    // algorithm, passing the blank node identifier for component as
    // related, quad, path identifier issuer as issuer, and position as
    // either s, o, or g based on whether component is a subject, object,
    // graph name, respectively.
    const related = component.value;
    const hash = this.hashRelatedBlankNode(related, quad, issuer, position);

    // 3.1.2) Add a mapping of hash to the blank node identifier for
    // component to hash to related blank nodes map, adding an entry as
    // necessary.
    const entries = hashToRelated.get(hash);
    if(entries) {
      entries.push(related);
    } else {
      hashToRelated.set(hash, [related]);
    }
  }

  _useCanonicalId({component}) {
    if(component.termType === 'BlankNode' &&
      !component.value.startsWith(this.canonicalIssuer.prefix)) {
      return {
        termType: 'BlankNode',
        value: this.canonicalIssuer.getId(component.value)
      };
    }
    return component;
  }
};

function _stringHashCompare(a, b) {
  return a.hash < b.hash ? -1 : a.hash > b.hash ? 1 : 0;
}

},{"./IdentifierIssuer":71,"./MessageDigest":72,"./NQuads":73,"./Permuter":74}],77:[function(_dereq_,module,exports){
/*
 * Copyright (c) 2016-2021 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const URDNA2015 = _dereq_('./URDNA2015');

module.exports = class URDNA2012 extends URDNA2015 {
  constructor() {
    super();
    this.name = 'URGNA2012';
    this.hashAlgorithm = 'sha1';
  }

  // helper for modifying component during Hash First Degree Quads
  modifyFirstDegreeComponent(id, component, key) {
    if(component.termType !== 'BlankNode') {
      return component;
    }
    if(key === 'graph') {
      return {
        termType: 'BlankNode',
        value: '_:g'
      };
    }
    return {
      termType: 'BlankNode',
      value: (component.value === id ? '_:a' : '_:z')
    };
  }

  // helper for getting a related predicate
  getRelatedPredicate(quad) {
    return quad.predicate.value;
  }

  // helper for creating hash to related blank nodes map
  async createHashToRelated(id, issuer) {
    // 1) Create a hash to related blank nodes map for storing hashes that
    // identify related blank nodes.
    const hashToRelated = new Map();

    // 2) Get a reference, quads, to the list of quads in the blank node to
    // quads map for the key identifier.
    const quads = this.blankNodeInfo.get(id).quads;

    // 3) For each quad in quads:
    let i = 0;
    for(const quad of quads) {
      // 3.1) If the quad's subject is a blank node that does not match
      // identifier, set hash to the result of the Hash Related Blank Node
      // algorithm, passing the blank node identifier for subject as related,
      // quad, path identifier issuer as issuer, and p as position.
      let position;
      let related;
      if(quad.subject.termType === 'BlankNode' && quad.subject.value !== id) {
        related = quad.subject.value;
        position = 'p';
      } else if(
        quad.object.termType === 'BlankNode' && quad.object.value !== id) {
        // 3.2) Otherwise, if quad's object is a blank node that does not match
        // identifier, to the result of the Hash Related Blank Node algorithm,
        // passing the blank node identifier for object as related, quad, path
        // identifier issuer as issuer, and r as position.
        related = quad.object.value;
        position = 'r';
      } else {
        // 3.3) Otherwise, continue to the next quad.
        continue;
      }
      // Note: batch hashing related blank nodes 100 at a time
      if(++i % 100 === 0) {
        await this._yield();
      }
      // 3.4) Add a mapping of hash to the blank node identifier for the
      // component that matched (subject or object) to hash to related blank
      // nodes map, adding an entry as necessary.
      const hash = await this.hashRelatedBlankNode(
        related, quad, issuer, position);
      const entries = hashToRelated.get(hash);
      if(entries) {
        entries.push(related);
      } else {
        hashToRelated.set(hash, [related]);
      }
    }

    return hashToRelated;
  }
};

},{"./URDNA2015":75}],78:[function(_dereq_,module,exports){
/*
 * Copyright (c) 2016-2021 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const URDNA2015Sync = _dereq_('./URDNA2015Sync');

module.exports = class URDNA2012Sync extends URDNA2015Sync {
  constructor() {
    super();
    this.name = 'URGNA2012';
    this.hashAlgorithm = 'sha1';
  }

  // helper for modifying component during Hash First Degree Quads
  modifyFirstDegreeComponent(id, component, key) {
    if(component.termType !== 'BlankNode') {
      return component;
    }
    if(key === 'graph') {
      return {
        termType: 'BlankNode',
        value: '_:g'
      };
    }
    return {
      termType: 'BlankNode',
      value: (component.value === id ? '_:a' : '_:z')
    };
  }

  // helper for getting a related predicate
  getRelatedPredicate(quad) {
    return quad.predicate.value;
  }

  // helper for creating hash to related blank nodes map
  createHashToRelated(id, issuer) {
    // 1) Create a hash to related blank nodes map for storing hashes that
    // identify related blank nodes.
    const hashToRelated = new Map();

    // 2) Get a reference, quads, to the list of quads in the blank node to
    // quads map for the key identifier.
    const quads = this.blankNodeInfo.get(id).quads;

    // 3) For each quad in quads:
    for(const quad of quads) {
      // 3.1) If the quad's subject is a blank node that does not match
      // identifier, set hash to the result of the Hash Related Blank Node
      // algorithm, passing the blank node identifier for subject as related,
      // quad, path identifier issuer as issuer, and p as position.
      let position;
      let related;
      if(quad.subject.termType === 'BlankNode' && quad.subject.value !== id) {
        related = quad.subject.value;
        position = 'p';
      } else if(
        quad.object.termType === 'BlankNode' && quad.object.value !== id) {
        // 3.2) Otherwise, if quad's object is a blank node that does not match
        // identifier, to the result of the Hash Related Blank Node algorithm,
        // passing the blank node identifier for object as related, quad, path
        // identifier issuer as issuer, and r as position.
        related = quad.object.value;
        position = 'r';
      } else {
        // 3.3) Otherwise, continue to the next quad.
        continue;
      }
      // 3.4) Add a mapping of hash to the blank node identifier for the
      // component that matched (subject or object) to hash to related blank
      // nodes map, adding an entry as necessary.
      const hash = this.hashRelatedBlankNode(related, quad, issuer, position);
      const entries = hashToRelated.get(hash);
      if(entries) {
        entries.push(related);
      } else {
        hashToRelated.set(hash, [related]);
      }
    }

    return hashToRelated;
  }
};

},{"./URDNA2015Sync":76}],79:[function(_dereq_,module,exports){
/**
 * An implementation of the RDF Dataset Normalization specification.
 * This library works in the browser and node.js.
 *
 * BSD 3-Clause License
 * Copyright (c) 2016-2021 Digital Bazaar, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice,
 * this list of conditions and the following disclaimer.
 *
 * Redistributions in binary form must reproduce the above copyright
 * notice, this list of conditions and the following disclaimer in the
 * documentation and/or other materials provided with the distribution.
 *
 * Neither the name of the Digital Bazaar, Inc. nor the names of its
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS
 * IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED
 * TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A
 * PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED
 * TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
 * PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
 * LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
'use strict';

const URDNA2015 = _dereq_('./URDNA2015');
const URGNA2012 = _dereq_('./URGNA2012');
const URDNA2015Sync = _dereq_('./URDNA2015Sync');
const URGNA2012Sync = _dereq_('./URGNA2012Sync');

// optional native support
let rdfCanonizeNative;
try {
  rdfCanonizeNative = _dereq_('rdf-canonize-native');
} catch(e) {}

const api = {};
module.exports = api;

// expose helpers
api.NQuads = _dereq_('./NQuads');
api.IdentifierIssuer = _dereq_('./IdentifierIssuer');

/**
 * Get or set native API.
 *
 * @param api the native API.
 *
 * @return the currently set native API.
 */
api._rdfCanonizeNative = function(api) {
  if(api) {
    rdfCanonizeNative = api;
  }
  return rdfCanonizeNative;
};

/**
 * Asynchronously canonizes an RDF dataset.
 *
 * @param dataset the dataset to canonize.
 * @param options the options to use:
 *          algorithm the canonicalization algorithm to use, `URDNA2015` or
 *            `URGNA2012`.
 *          [useNative] use native implementation (default: false).
 *
 * @return a Promise that resolves to the canonicalized RDF Dataset.
 */
api.canonize = async function(dataset, options) {
  // back-compat with legacy dataset
  if(!Array.isArray(dataset)) {
    dataset = api.NQuads.legacyDatasetToQuads(dataset);
  }

  if(options.useNative) {
    if(!rdfCanonizeNative) {
      throw new Error('rdf-canonize-native not available');
    }
    // TODO: convert native algorithm to Promise-based async
    return new Promise((resolve, reject) =>
      rdfCanonizeNative.canonize(dataset, options, (err, canonical) =>
        err ? reject(err) : resolve(canonical)));
  }

  if(options.algorithm === 'URDNA2015') {
    return new URDNA2015(options).main(dataset);
  }
  if(options.algorithm === 'URGNA2012') {
    return new URGNA2012(options).main(dataset);
  }
  if(!('algorithm' in options)) {
    throw new Error('No RDF Dataset Canonicalization algorithm specified.');
  }
  throw new Error(
    'Invalid RDF Dataset Canonicalization algorithm: ' + options.algorithm);
};

/**
 * This method is no longer available in the public API, it is for testing
 * only. It synchronously canonizes an RDF dataset and does not work in the
 * browser.
 *
 * @param dataset the dataset to canonize.
 * @param options the options to use:
 *          algorithm the canonicalization algorithm to use, `URDNA2015` or
 *            `URGNA2012`.
 *          [useNative] use native implementation (default: false).
 *
 * @return the RDF dataset in canonical form.
 */
api._canonizeSync = function(dataset, options) {
  // back-compat with legacy dataset
  if(!Array.isArray(dataset)) {
    dataset = api.NQuads.legacyDatasetToQuads(dataset);
  }

  if(options.useNative) {
    if(rdfCanonizeNative) {
      return rdfCanonizeNative.canonizeSync(dataset, options);
    }
    throw new Error('rdf-canonize-native not available');
  }
  if(options.algorithm === 'URDNA2015') {
    return new URDNA2015Sync(options).main(dataset);
  }
  if(options.algorithm === 'URGNA2012') {
    return new URGNA2012Sync(options).main(dataset);
  }
  if(!('algorithm' in options)) {
    throw new Error('No RDF Dataset Canonicalization algorithm specified.');
  }
  throw new Error(
    'Invalid RDF Dataset Canonicalization algorithm: ' + options.algorithm);
};

},{"./IdentifierIssuer":71,"./NQuads":73,"./URDNA2015":75,"./URDNA2015Sync":76,"./URGNA2012":77,"./URGNA2012Sync":78,"rdf-canonize-native":44}],80:[function(_dereq_,module,exports){
(function (process,global){(function (){
(function (global, undefined) {
    "use strict";

    if (global.setImmediate) {
        return;
    }

    var nextHandle = 1; // Spec says greater than zero
    var tasksByHandle = {};
    var currentlyRunningATask = false;
    var doc = global.document;
    var registerImmediate;

    function setImmediate(callback) {
      // Callback can either be a function or a string
      if (typeof callback !== "function") {
        callback = new Function("" + callback);
      }
      // Copy function arguments
      var args = new Array(arguments.length - 1);
      for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i + 1];
      }
      // Store and register the task
      var task = { callback: callback, args: args };
      tasksByHandle[nextHandle] = task;
      registerImmediate(nextHandle);
      return nextHandle++;
    }

    function clearImmediate(handle) {
        delete tasksByHandle[handle];
    }

    function run(task) {
        var callback = task.callback;
        var args = task.args;
        switch (args.length) {
        case 0:
            callback();
            break;
        case 1:
            callback(args[0]);
            break;
        case 2:
            callback(args[0], args[1]);
            break;
        case 3:
            callback(args[0], args[1], args[2]);
            break;
        default:
            callback.apply(undefined, args);
            break;
        }
    }

    function runIfPresent(handle) {
        // From the spec: "Wait until any invocations of this algorithm started before this one have completed."
        // So if we're currently running a task, we'll need to delay this invocation.
        if (currentlyRunningATask) {
            // Delay by doing a setTimeout. setImmediate was tried instead, but in Firefox 7 it generated a
            // "too much recursion" error.
            setTimeout(runIfPresent, 0, handle);
        } else {
            var task = tasksByHandle[handle];
            if (task) {
                currentlyRunningATask = true;
                try {
                    run(task);
                } finally {
                    clearImmediate(handle);
                    currentlyRunningATask = false;
                }
            }
        }
    }

    function installNextTickImplementation() {
        registerImmediate = function(handle) {
            process.nextTick(function () { runIfPresent(handle); });
        };
    }

    function canUsePostMessage() {
        // The test against `importScripts` prevents this implementation from being installed inside a web worker,
        // where `global.postMessage` means something completely different and can't be used for this purpose.
        if (global.postMessage && !global.importScripts) {
            var postMessageIsAsynchronous = true;
            var oldOnMessage = global.onmessage;
            global.onmessage = function() {
                postMessageIsAsynchronous = false;
            };
            global.postMessage("", "*");
            global.onmessage = oldOnMessage;
            return postMessageIsAsynchronous;
        }
    }

    function installPostMessageImplementation() {
        // Installs an event handler on `global` for the `message` event: see
        // * https://developer.mozilla.org/en/DOM/window.postMessage
        // * http://www.whatwg.org/specs/web-apps/current-work/multipage/comms.html#crossDocumentMessages

        var messagePrefix = "setImmediate$" + Math.random() + "$";
        var onGlobalMessage = function(event) {
            if (event.source === global &&
                typeof event.data === "string" &&
                event.data.indexOf(messagePrefix) === 0) {
                runIfPresent(+event.data.slice(messagePrefix.length));
            }
        };

        if (global.addEventListener) {
            global.addEventListener("message", onGlobalMessage, false);
        } else {
            global.attachEvent("onmessage", onGlobalMessage);
        }

        registerImmediate = function(handle) {
            global.postMessage(messagePrefix + handle, "*");
        };
    }

    function installMessageChannelImplementation() {
        var channel = new MessageChannel();
        channel.port1.onmessage = function(event) {
            var handle = event.data;
            runIfPresent(handle);
        };

        registerImmediate = function(handle) {
            channel.port2.postMessage(handle);
        };
    }

    function installReadyStateChangeImplementation() {
        var html = doc.documentElement;
        registerImmediate = function(handle) {
            // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
            // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
            var script = doc.createElement("script");
            script.onreadystatechange = function () {
                runIfPresent(handle);
                script.onreadystatechange = null;
                html.removeChild(script);
                script = null;
            };
            html.appendChild(script);
        };
    }

    function installSetTimeoutImplementation() {
        registerImmediate = function(handle) {
            setTimeout(runIfPresent, 0, handle);
        };
    }

    // If supported, we should attach to the prototype of global, since that is where setTimeout et al. live.
    var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global);
    attachTo = attachTo && attachTo.setTimeout ? attachTo : global;

    // Don't get fooled by e.g. browserify environments.
    if ({}.toString.call(global.process) === "[object process]") {
        // For Node.js before 0.9
        installNextTickImplementation();

    } else if (canUsePostMessage()) {
        // For non-IE10 modern browsers
        installPostMessageImplementation();

    } else if (global.MessageChannel) {
        // For web workers, where supported
        installMessageChannelImplementation();

    } else if (doc && "onreadystatechange" in doc.createElement("script")) {
        // For IE 6–8
        installReadyStateChangeImplementation();

    } else {
        // For older browsers
        installSetTimeoutImplementation();
    }

    attachTo.setImmediate = setImmediate;
    attachTo.clearImmediate = clearImmediate;
}(typeof self === "undefined" ? typeof global === "undefined" ? this : global : self));

}).call(this)}).call(this,_dereq_('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"_process":69}],81:[function(_dereq_,module,exports){
(function (setImmediate,clearImmediate){(function (){
var nextTick = _dereq_('process/browser.js').nextTick;
var apply = Function.prototype.apply;
var slice = Array.prototype.slice;
var immediateIds = {};
var nextImmediateId = 0;

// DOM APIs, for completeness

exports.setTimeout = function() {
  return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
};
exports.setInterval = function() {
  return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
};
exports.clearTimeout =
exports.clearInterval = function(timeout) { timeout.close(); };

function Timeout(id, clearFn) {
  this._id = id;
  this._clearFn = clearFn;
}
Timeout.prototype.unref = Timeout.prototype.ref = function() {};
Timeout.prototype.close = function() {
  this._clearFn.call(window, this._id);
};

// Does not start the time, just sets up the members needed.
exports.enroll = function(item, msecs) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = msecs;
};

exports.unenroll = function(item) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = -1;
};

exports._unrefActive = exports.active = function(item) {
  clearTimeout(item._idleTimeoutId);

  var msecs = item._idleTimeout;
  if (msecs >= 0) {
    item._idleTimeoutId = setTimeout(function onTimeout() {
      if (item._onTimeout)
        item._onTimeout();
    }, msecs);
  }
};

// That's not how node.js implements it but the exposed api is the same.
exports.setImmediate = typeof setImmediate === "function" ? setImmediate : function(fn) {
  var id = nextImmediateId++;
  var args = arguments.length < 2 ? false : slice.call(arguments, 1);

  immediateIds[id] = true;

  nextTick(function onNextTick() {
    if (immediateIds[id]) {
      // fn.call() is faster so we optimize for the common use-case
      // @see http://jsperf.com/call-apply-segu
      if (args) {
        fn.apply(null, args);
      } else {
        fn.call(null);
      }
      // Prevent ids from leaking
      exports.clearImmediate(id);
    }
  });

  return id;
};

exports.clearImmediate = typeof clearImmediate === "function" ? clearImmediate : function(id) {
  delete immediateIds[id];
};
}).call(this)}).call(this,_dereq_("timers").setImmediate,_dereq_("timers").clearImmediate)
},{"process/browser.js":69,"timers":81}],82:[function(_dereq_,module,exports){
'use strict'
module.exports = function (Yallist) {
  Yallist.prototype[Symbol.iterator] = function* () {
    for (let walker = this.head; walker; walker = walker.next) {
      yield walker.value
    }
  }
}

},{}],83:[function(_dereq_,module,exports){
'use strict'
module.exports = Yallist

Yallist.Node = Node
Yallist.create = Yallist

function Yallist (list) {
  var self = this
  if (!(self instanceof Yallist)) {
    self = new Yallist()
  }

  self.tail = null
  self.head = null
  self.length = 0

  if (list && typeof list.forEach === 'function') {
    list.forEach(function (item) {
      self.push(item)
    })
  } else if (arguments.length > 0) {
    for (var i = 0, l = arguments.length; i < l; i++) {
      self.push(arguments[i])
    }
  }

  return self
}

Yallist.prototype.removeNode = function (node) {
  if (node.list !== this) {
    throw new Error('removing node which does not belong to this list')
  }

  var next = node.next
  var prev = node.prev

  if (next) {
    next.prev = prev
  }

  if (prev) {
    prev.next = next
  }

  if (node === this.head) {
    this.head = next
  }
  if (node === this.tail) {
    this.tail = prev
  }

  node.list.length--
  node.next = null
  node.prev = null
  node.list = null

  return next
}

Yallist.prototype.unshiftNode = function (node) {
  if (node === this.head) {
    return
  }

  if (node.list) {
    node.list.removeNode(node)
  }

  var head = this.head
  node.list = this
  node.next = head
  if (head) {
    head.prev = node
  }

  this.head = node
  if (!this.tail) {
    this.tail = node
  }
  this.length++
}

Yallist.prototype.pushNode = function (node) {
  if (node === this.tail) {
    return
  }

  if (node.list) {
    node.list.removeNode(node)
  }

  var tail = this.tail
  node.list = this
  node.prev = tail
  if (tail) {
    tail.next = node
  }

  this.tail = node
  if (!this.head) {
    this.head = node
  }
  this.length++
}

Yallist.prototype.push = function () {
  for (var i = 0, l = arguments.length; i < l; i++) {
    push(this, arguments[i])
  }
  return this.length
}

Yallist.prototype.unshift = function () {
  for (var i = 0, l = arguments.length; i < l; i++) {
    unshift(this, arguments[i])
  }
  return this.length
}

Yallist.prototype.pop = function () {
  if (!this.tail) {
    return undefined
  }

  var res = this.tail.value
  this.tail = this.tail.prev
  if (this.tail) {
    this.tail.next = null
  } else {
    this.head = null
  }
  this.length--
  return res
}

Yallist.prototype.shift = function () {
  if (!this.head) {
    return undefined
  }

  var res = this.head.value
  this.head = this.head.next
  if (this.head) {
    this.head.prev = null
  } else {
    this.tail = null
  }
  this.length--
  return res
}

Yallist.prototype.forEach = function (fn, thisp) {
  thisp = thisp || this
  for (var walker = this.head, i = 0; walker !== null; i++) {
    fn.call(thisp, walker.value, i, this)
    walker = walker.next
  }
}

Yallist.prototype.forEachReverse = function (fn, thisp) {
  thisp = thisp || this
  for (var walker = this.tail, i = this.length - 1; walker !== null; i--) {
    fn.call(thisp, walker.value, i, this)
    walker = walker.prev
  }
}

Yallist.prototype.get = function (n) {
  for (var i = 0, walker = this.head; walker !== null && i < n; i++) {
    // abort out of the list early if we hit a cycle
    walker = walker.next
  }
  if (i === n && walker !== null) {
    return walker.value
  }
}

Yallist.prototype.getReverse = function (n) {
  for (var i = 0, walker = this.tail; walker !== null && i < n; i++) {
    // abort out of the list early if we hit a cycle
    walker = walker.prev
  }
  if (i === n && walker !== null) {
    return walker.value
  }
}

Yallist.prototype.map = function (fn, thisp) {
  thisp = thisp || this
  var res = new Yallist()
  for (var walker = this.head; walker !== null;) {
    res.push(fn.call(thisp, walker.value, this))
    walker = walker.next
  }
  return res
}

Yallist.prototype.mapReverse = function (fn, thisp) {
  thisp = thisp || this
  var res = new Yallist()
  for (var walker = this.tail; walker !== null;) {
    res.push(fn.call(thisp, walker.value, this))
    walker = walker.prev
  }
  return res
}

Yallist.prototype.reduce = function (fn, initial) {
  var acc
  var walker = this.head
  if (arguments.length > 1) {
    acc = initial
  } else if (this.head) {
    walker = this.head.next
    acc = this.head.value
  } else {
    throw new TypeError('Reduce of empty list with no initial value')
  }

  for (var i = 0; walker !== null; i++) {
    acc = fn(acc, walker.value, i)
    walker = walker.next
  }

  return acc
}

Yallist.prototype.reduceReverse = function (fn, initial) {
  var acc
  var walker = this.tail
  if (arguments.length > 1) {
    acc = initial
  } else if (this.tail) {
    walker = this.tail.prev
    acc = this.tail.value
  } else {
    throw new TypeError('Reduce of empty list with no initial value')
  }

  for (var i = this.length - 1; walker !== null; i--) {
    acc = fn(acc, walker.value, i)
    walker = walker.prev
  }

  return acc
}

Yallist.prototype.toArray = function () {
  var arr = new Array(this.length)
  for (var i = 0, walker = this.head; walker !== null; i++) {
    arr[i] = walker.value
    walker = walker.next
  }
  return arr
}

Yallist.prototype.toArrayReverse = function () {
  var arr = new Array(this.length)
  for (var i = 0, walker = this.tail; walker !== null; i++) {
    arr[i] = walker.value
    walker = walker.prev
  }
  return arr
}

Yallist.prototype.slice = function (from, to) {
  to = to || this.length
  if (to < 0) {
    to += this.length
  }
  from = from || 0
  if (from < 0) {
    from += this.length
  }
  var ret = new Yallist()
  if (to < from || to < 0) {
    return ret
  }
  if (from < 0) {
    from = 0
  }
  if (to > this.length) {
    to = this.length
  }
  for (var i = 0, walker = this.head; walker !== null && i < from; i++) {
    walker = walker.next
  }
  for (; walker !== null && i < to; i++, walker = walker.next) {
    ret.push(walker.value)
  }
  return ret
}

Yallist.prototype.sliceReverse = function (from, to) {
  to = to || this.length
  if (to < 0) {
    to += this.length
  }
  from = from || 0
  if (from < 0) {
    from += this.length
  }
  var ret = new Yallist()
  if (to < from || to < 0) {
    return ret
  }
  if (from < 0) {
    from = 0
  }
  if (to > this.length) {
    to = this.length
  }
  for (var i = this.length, walker = this.tail; walker !== null && i > to; i--) {
    walker = walker.prev
  }
  for (; walker !== null && i > from; i--, walker = walker.prev) {
    ret.push(walker.value)
  }
  return ret
}

Yallist.prototype.splice = function (start, deleteCount, ...nodes) {
  if (start > this.length) {
    start = this.length - 1
  }
  if (start < 0) {
    start = this.length + start;
  }

  for (var i = 0, walker = this.head; walker !== null && i < start; i++) {
    walker = walker.next
  }

  var ret = []
  for (var i = 0; walker && i < deleteCount; i++) {
    ret.push(walker.value)
    walker = this.removeNode(walker)
  }
  if (walker === null) {
    walker = this.tail
  }

  if (walker !== this.head && walker !== this.tail) {
    walker = walker.prev
  }

  for (var i = 0; i < nodes.length; i++) {
    walker = insert(this, walker, nodes[i])
  }
  return ret;
}

Yallist.prototype.reverse = function () {
  var head = this.head
  var tail = this.tail
  for (var walker = head; walker !== null; walker = walker.prev) {
    var p = walker.prev
    walker.prev = walker.next
    walker.next = p
  }
  this.head = tail
  this.tail = head
  return this
}

function insert (self, node, value) {
  var inserted = node === self.head ?
    new Node(value, null, node, self) :
    new Node(value, node, node.next, self)

  if (inserted.next === null) {
    self.tail = inserted
  }
  if (inserted.prev === null) {
    self.head = inserted
  }

  self.length++

  return inserted
}

function push (self, item) {
  self.tail = new Node(item, self.tail, null, self)
  if (!self.head) {
    self.head = self.tail
  }
  self.length++
}

function unshift (self, item) {
  self.head = new Node(item, null, self.head, self)
  if (!self.tail) {
    self.tail = self.head
  }
  self.length++
}

function Node (value, prev, next, list) {
  if (!(this instanceof Node)) {
    return new Node(value, prev, next, list)
  }

  this.list = list
  this.value = value

  if (prev) {
    prev.next = this
    this.prev = prev
  } else {
    this.prev = null
  }

  if (next) {
    next.prev = this
    this.next = next
  } else {
    this.next = null
  }
}

try {
  // add if support for Symbol.iterator is present
  _dereq_('./iterator.js')(Yallist)
} catch (er) {}

},{"./iterator.js":82}]},{},[11])(11)
});
