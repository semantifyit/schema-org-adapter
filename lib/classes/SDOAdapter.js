"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SDOAdapter = void 0;
const Graph_1 = require("./Graph");
const axios_1 = __importDefault(require("axios"));
const Infrastructure_1 = require("./Infrastructure");
const isString_1 = require("../utilities/general/isString");
const isObject_1 = require("../utilities/general/isObject");
const toArray_1 = require("../utilities/general/toArray");
const filterAndTransformIRIList_1 = require("../utilities/general/filterAndTransformIRIList");
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
        if (paramObj === null || paramObj === void 0 ? void 0 : paramObj.outputFormat) {
            this.graph = new Graph_1.Graph(this, paramObj.outputFormat);
        }
        else {
            this.graph = new Graph_1.Graph(this);
        }
    }
    async addVocabularies(vocabArray) {
        vocabArray = (0, toArray_1.toArray)(vocabArray);
        for (const vocab of vocabArray) {
            if ((0, isString_1.isString)(vocab)) {
                if (vocab.startsWith("www") || vocab.startsWith("http")) {
                    try {
                        let fetchedVocab = await this.fetchVocabularyFromURL(vocab);
                        if ((0, isString_1.isString)(fetchedVocab)) {
                            fetchedVocab = JSON.parse(fetchedVocab);
                        }
                        await this.graph.addVocabulary(fetchedVocab, vocab);
                    }
                    catch (e) {
                        throw new Error("The given URL " + vocab + " did not contain a valid JSON-LD vocabulary.");
                    }
                }
                else {
                    try {
                        await this.graph.addVocabulary(JSON.parse(vocab));
                    }
                    catch (e) {
                        throw new Error("Parsing of vocabulary string produced an invalid JSON-LD.");
                    }
                }
            }
            else if ((0, isObject_1.isObject)(vocab)) {
                await this.graph.addVocabulary(vocab);
            }
            else {
                throw new Error("The first argument of the function must be an Array of vocabularies or a single vocabulary (JSON-LD as Object/String)");
            }
        }
        return true;
    }
    async fetchVocabularyFromURL(url) {
        try {
            const res = await axios_1.default.get(url, {
                headers: {
                    Accept: "application/ld+json, application/json"
                }
            });
            return res.data;
        }
        catch (e) {
            throw new Error("Could not find any resource at the given URL.");
        }
    }
    getTerm(id, filter) {
        return this.graph.getTerm(id, filter);
    }
    getAllTerms(filter) {
        const result = [];
        const classesIRIList = this.getListOfClasses({ filter, outputFormat: "Compact" });
        const enumerationsIRIList = this.getListOfEnumerations({ filter, outputFormat: "Compact" });
        const propertiesIRIList = this.getListOfProperties({ filter, outputFormat: "Compact" });
        const dataTypesIRIList = this.getListOfDataTypes({ filter, outputFormat: "Compact" });
        const enumerationMembersIRIList = this.getListOfEnumerationMembers({ filter, outputFormat: "Compact" });
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
    getListOfTerms(paramObj) {
        const result = [];
        result.push(...Object.keys(this.graph.classes));
        result.push(...Object.keys(this.graph.enumerations));
        result.push(...Object.keys(this.graph.properties));
        result.push(...Object.keys(this.graph.dataTypes));
        result.push(...Object.keys(this.graph.enumerationMembers));
        return (0, filterAndTransformIRIList_1.filterAndTransformIRIList)(result, this.graph, paramObj);
    }
    getClass(id, filter) {
        return this.graph.getClass(id, filter);
    }
    getAllClasses(filter) {
        const result = [];
        const classesIRIList = this.getListOfClasses({ filter, outputFormat: "Compact" });
        for (const c of classesIRIList) {
            result.push(this.getClass(c));
        }
        return result;
    }
    getListOfClasses(paramObj) {
        return (0, filterAndTransformIRIList_1.filterAndTransformIRIList)(Object.keys(this.graph.classes), this.graph, paramObj);
    }
    getProperty(id, filter) {
        return this.graph.getProperty(id, filter);
    }
    getAllProperties(filter) {
        const result = [];
        const propertiesIRIList = this.getListOfProperties({ filter, outputFormat: "Compact" });
        for (const p of propertiesIRIList) {
            result.push(this.getProperty(p));
        }
        return result;
    }
    getListOfProperties(paramObj) {
        return (0, filterAndTransformIRIList_1.filterAndTransformIRIList)(Object.keys(this.graph.properties), this.graph, paramObj);
    }
    getDataType(id, filter) {
        return this.graph.getDataType(id, filter);
    }
    getAllDataTypes(filter) {
        const result = [];
        const dataTypesIRIList = this.getListOfDataTypes({ filter, outputFormat: "Compact" });
        for (const dt of dataTypesIRIList) {
            result.push(this.getDataType(dt));
        }
        return result;
    }
    getListOfDataTypes(paramObj) {
        return (0, filterAndTransformIRIList_1.filterAndTransformIRIList)(Object.keys(this.graph.dataTypes), this.graph, paramObj);
    }
    getEnumeration(id, filter) {
        return this.graph.getEnumeration(id, filter);
    }
    getAllEnumerations(filter) {
        const result = [];
        const enumerationsIRIList = this.getListOfEnumerations({ filter, outputFormat: "Compact" });
        for (const en of enumerationsIRIList) {
            result.push(this.getEnumeration(en));
        }
        return result;
    }
    getListOfEnumerations(paramObj) {
        return (0, filterAndTransformIRIList_1.filterAndTransformIRIList)(Object.keys(this.graph.enumerations), this.graph, paramObj);
    }
    getEnumerationMember(id, filter) {
        return this.graph.getEnumerationMember(id, filter);
    }
    getAllEnumerationMembers(filter) {
        const result = [];
        const enumerationMembersIRIList = this.getListOfEnumerationMembers({ filter, outputFormat: "Compact" });
        for (const enm of enumerationMembersIRIList) {
            result.push(this.getEnumerationMember(enm));
        }
        return result;
    }
    getListOfEnumerationMembers(paramObj) {
        return (0, filterAndTransformIRIList_1.filterAndTransformIRIList)(Object.keys(this.graph.enumerationMembers), this.graph, paramObj);
    }
    getVocabularies(omitStandardVocabs = true) {
        const vocabKeys = Object.keys(this.graph.context);
        const result = {};
        const blacklist = [
            "soa",
            "xsd",
            "rdf",
            "rdfa",
            "rdfs",
            "dcterms",
            "brick",
            "csvw",
            "dc",
            "dcam",
            "dcat",
            "dcmitype",
            "doap",
            "foaf",
            "odrl",
            "org",
            "owl",
            "prof",
            "prov",
            "qb",
            "sh",
            "skos",
            "sosa",
            "ssn",
            "time",
            "vann",
            "void",
            "geo",
            "wgs",
            "ds"
        ];
        vocabKeys.forEach((el) => {
            if ((0, isString_1.isString)(this.graph.context[el]) && (!omitStandardVocabs || !blacklist.includes(el))) {
                result[el] = this.graph.context[el];
            }
        });
        return result;
    }
    async getLatestSchemaVersion() {
        return await (0, Infrastructure_1.getLatestSchemaVersion)(this.commit);
    }
    async constructURLSchemaVocabulary(version = "latest") {
        return await (0, Infrastructure_1.constructURLSchemaVocabulary)(version, this.schemaHttps, this.commit);
    }
}
exports.SDOAdapter = SDOAdapter;
//# sourceMappingURL=SDOAdapter.js.map