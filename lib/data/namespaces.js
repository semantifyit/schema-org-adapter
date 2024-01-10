"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TermTypeIRI = exports.TermTypeLabel = exports.NS = void 0;
exports.NS = {
    xsd: {
        _url: "http://www.w3.org/2001/XMLSchema#",
        string: "xsd:string",
        decimal: "xsd:decimal",
        integer: "xsd:integer",
        float: "xsd:float",
        double: "xsd:double",
        boolean: "xsd:boolean",
        date: "xsd:date",
        time: "xsd:time",
        dateTime: "xsd:dateTime",
        anyURI: "xsd:anyURI"
    },
    rdf: {
        _url: "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
        property: "rdf:Property"
    },
    rdfs: {
        _url: "http://www.w3.org/2000/01/rdf-schema#",
        class: "rdfs:Class",
        subClassOf: "rdfs:subClassOf",
        subPropertyOf: "rdfs:subPropertyOf",
        label: "rdfs:label",
        comment: "rdfs:comment"
    },
    schema: {
        _url: "https://schema.org/",
        dataType: "schema:DataType",
        enumeration: "schema:Enumeration",
        isPartOf: "schema:isPartOf",
        domainIncludes: "schema:domainIncludes",
        rangeIncludes: "schema:rangeIncludes",
        supersededBy: "schema:supersededBy",
        inverseOf: "schema:inverseOf",
        source: "schema:source",
        category: "schema:category"
    },
    dcterms: {
        _url: "http://purl.org/dc/terms/",
        source: "dcterms:source"
    },
    soa: {
        _url: "http://schema-org-adapter.at/vocabTerms/",
        enumerationMember: "soa:EnumerationMember",
        superClassOf: "soa:superClassOf",
        superPropertyOf: "soa:superPropertyOf",
        hasProperty: "soa:hasProperty",
        isRangeOf: "soa:isRangeOf",
        hasEnumerationMember: "soa:hasEnumerationMember",
        enumerationDomainIncludes: "soa:enumerationDomainIncludes"
    },
    ds: {
        _url: "https://vocab.sti2.at/ds/"
    }
};
exports.TermTypeLabel = {
    class: "Class",
    property: "Property",
    enumeration: "Enumeration",
    enumerationMember: "EnumerationMember",
    dataType: "DataType"
};
exports.TermTypeIRI = {
    class: exports.NS.rdfs.class,
    property: exports.NS.rdf.property,
    enumeration: exports.NS.schema.enumeration,
    enumerationMember: exports.NS.soa.enumerationMember,
    dataType: exports.NS.schema.dataType
};
//# sourceMappingURL=namespaces.js.map