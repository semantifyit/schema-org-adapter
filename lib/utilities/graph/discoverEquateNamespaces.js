"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.discoverEquateNamespaces = void 0;
const isString_1 = require("../general/isString");
const switchIRIProtocol_1 = require("../general/switchIRIProtocol");
const namespaces_1 = require("../../data/namespaces");
const checkIfNamespaceFromListIsUsed_1 = require("./checkIfNamespaceFromListIsUsed");
function discoverEquateNamespaces(currentContext, vocabulary) {
    const result = new Set();
    const protocolSwitchedNamespaces = [];
    Object.values(currentContext).forEach(function (el) {
        if ((0, isString_1.isString)(el)) {
            protocolSwitchedNamespaces.push((0, switchIRIProtocol_1.switchIRIProtocol)(el));
        }
    });
    if (vocabulary["@context"]) {
        Object.values(vocabulary["@context"]).forEach(function (el) {
            if ((0, isString_1.isString)(el) && protocolSwitchedNamespaces.includes(el)) {
                result.add(el);
            }
        });
    }
    if (Array.isArray(vocabulary["@graph"])) {
        vocabulary["@graph"].forEach(function (vocabNode) {
            (0, checkIfNamespaceFromListIsUsed_1.checkIfNamespaceFromListIsUsed)(vocabNode["@id"], protocolSwitchedNamespaces, result);
            (0, checkIfNamespaceFromListIsUsed_1.checkIfNamespaceFromListIsUsed)(vocabNode["@type"], protocolSwitchedNamespaces, result);
            (0, checkIfNamespaceFromListIsUsed_1.checkIfNamespaceFromListIsUsed)(vocabNode[namespaces_1.NS.rdfs.subClassOf], protocolSwitchedNamespaces, result);
            (0, checkIfNamespaceFromListIsUsed_1.checkIfNamespaceFromListIsUsed)(vocabNode["http://www.w3.org/2000/01/rdf-schema#subClassOf"], protocolSwitchedNamespaces, result);
            (0, checkIfNamespaceFromListIsUsed_1.checkIfNamespaceFromListIsUsed)(vocabNode[namespaces_1.NS.schema.domainIncludes], protocolSwitchedNamespaces, result);
            (0, checkIfNamespaceFromListIsUsed_1.checkIfNamespaceFromListIsUsed)(vocabNode["http://schema.org/domainIncludes"], protocolSwitchedNamespaces, result);
            (0, checkIfNamespaceFromListIsUsed_1.checkIfNamespaceFromListIsUsed)(vocabNode["https://schema.org/domainIncludes"], protocolSwitchedNamespaces, result);
            (0, checkIfNamespaceFromListIsUsed_1.checkIfNamespaceFromListIsUsed)(vocabNode[namespaces_1.NS.schema.rangeIncludes], protocolSwitchedNamespaces, result);
            (0, checkIfNamespaceFromListIsUsed_1.checkIfNamespaceFromListIsUsed)(vocabNode["http://schema.org/rangeIncludes"], protocolSwitchedNamespaces, result);
            (0, checkIfNamespaceFromListIsUsed_1.checkIfNamespaceFromListIsUsed)(vocabNode["https://schema.org/rangeIncludes"], protocolSwitchedNamespaces, result);
            (0, checkIfNamespaceFromListIsUsed_1.checkIfNamespaceFromListIsUsed)(vocabNode[namespaces_1.NS.rdfs.subPropertyOf], protocolSwitchedNamespaces, result);
            (0, checkIfNamespaceFromListIsUsed_1.checkIfNamespaceFromListIsUsed)(vocabNode["http://www.w3.org/2000/01/rdf-schema#subPropertyOf"], protocolSwitchedNamespaces, result);
            (0, checkIfNamespaceFromListIsUsed_1.checkIfNamespaceFromListIsUsed)(vocabNode[namespaces_1.NS.schema.inverseOf], protocolSwitchedNamespaces, result);
            (0, checkIfNamespaceFromListIsUsed_1.checkIfNamespaceFromListIsUsed)(vocabNode["http://schema.org/inverseOf"], protocolSwitchedNamespaces, result);
            (0, checkIfNamespaceFromListIsUsed_1.checkIfNamespaceFromListIsUsed)(vocabNode["https://schema.org/inverseOf"], protocolSwitchedNamespaces, result);
        });
    }
    return Array.from(result);
}
exports.discoverEquateNamespaces = discoverEquateNamespaces;
//# sourceMappingURL=discoverEquateNamespaces.js.map