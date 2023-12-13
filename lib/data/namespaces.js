"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TermTypeIRI = exports.TermTypeLabel = exports._XSD = exports._DC = exports._SCHEMA = exports._SOA = exports._RDFS = exports._RDF = exports.NsUrl = void 0;
require("core-js/proposals/object-from-entries");
exports.NsUrl = {
    xsd: "http://www.w3.org/2001/XMLSchema#",
    rdf: "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
    rdfs: "http://www.w3.org/2000/01/rdf-schema#",
    schema: "https://schema.org/",
    dcterms: "http://purl.org/dc/terms/",
    soa: "http://schema-org-adapter.at/vocabTerms/",
    ds: "https://vocab.sti2.at/ds/",
};
const NsPre = {
    xsd: "xsd",
    rdf: "rdf",
    rdfs: "rdfs",
    schema: "schema",
    dcterms: "dcterms",
    soa: "soa",
    ds: "ds",
};
function toCompactUri(prefix, properties) {
    return Object.freeze(Object.fromEntries(properties.map((p) => [p, prefix + ":" + p])));
}
exports._RDF = toCompactUri(NsPre.rdf, ["Property"]);
exports._RDFS = toCompactUri("rdfs", [
    "Class",
    "subClassOf",
    "subPropertyOf",
    "label",
    "comment",
]);
exports._SOA = toCompactUri("soa", [
    "EnumerationMember",
    "superClassOf",
    "superPropertyOf",
    "hasProperty",
    "isRangeOf",
    "hasEnumerationMember",
    "enumerationDomainIncludes",
]);
exports._SCHEMA = toCompactUri("schema", [
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
exports._DC = toCompactUri("dcterms", ["source"]);
exports._XSD = toCompactUri("xsd", [
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
//# sourceMappingURL=namespaces.js.map