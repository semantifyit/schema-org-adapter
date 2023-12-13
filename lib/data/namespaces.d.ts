export declare const NS: {
    readonly xsd: {
        readonly _url: "http://www.w3.org/2001/XMLSchema#";
        readonly string: "xsd:string";
        readonly decimal: "xsd:decimal";
        readonly integer: "xsd:integer";
        readonly float: "xsd:float";
        readonly double: "xsd:double";
        readonly boolean: "xsd:boolean";
        readonly date: "xsd:date";
        readonly time: "xsd:time";
        readonly dateTime: "xsd:dateTime";
        readonly anyURI: "xsd:anyURI";
    };
    readonly rdf: {
        readonly _url: "http://www.w3.org/1999/02/22-rdf-syntax-ns#";
        readonly property: "rdf:Property";
    };
    readonly rdfs: {
        readonly _url: "http://www.w3.org/2000/01/rdf-schema#";
        readonly class: "rdfs:Class";
        readonly subClassOf: "rdfs:subClassOf";
        readonly subPropertyOf: "rdfs:subPropertyOf";
        readonly label: "rdfs:label";
        readonly comment: "rdfs:comment";
    };
    readonly schema: {
        readonly _url: "https://schema.org/";
        readonly dataType: "schema:DataType";
        readonly enumeration: "schema:Enumeration";
        readonly isPartOf: "schema:isPartOf";
        readonly domainIncludes: "schema:domainIncludes";
        readonly rangeIncludes: "schema:rangeIncludes";
        readonly supersededBy: "schema:supersededBy";
        readonly inverseOf: "schema:inverseOf";
        readonly source: "schema:source";
        readonly category: "schema:category";
    };
    readonly dcterms: {
        readonly _url: "http://purl.org/dc/terms/";
        readonly source: "dcterms:source";
    };
    readonly soa: {
        readonly _url: "http://schema-org-adapter.at/vocabTerms/";
        readonly enumerationMember: "soa:EnumerationMember";
        readonly superClassOf: "soa:superClassOf";
        readonly superPropertyOf: "soa:superPropertyOf";
        readonly hasProperty: "soa:hasProperty";
        readonly isRangeOf: "soa:isRangeOf";
        readonly hasEnumerationMember: "soa:hasEnumerationMember";
        readonly enumerationDomainIncludes: "soa:enumerationDomainIncludes";
    };
    readonly ds: {
        readonly _url: "https://vocab.sti2.at/ds/";
    };
};
export declare const TermTypeLabel: {
    readonly class: "Class";
    readonly property: "Property";
    readonly enumeration: "Enumeration";
    readonly enumerationMember: "EnumerationMember";
    readonly dataType: "DataType";
};
export declare const TermTypeIRI: {
    readonly class: "rdfs:Class";
    readonly property: "rdf:Property";
    readonly enumeration: "schema:Enumeration";
    readonly enumerationMember: "soa:EnumerationMember";
    readonly dataType: "schema:DataType";
};
export declare type TermType = keyof typeof TermTypeLabel;
export declare type TermTypeLabelValue = typeof TermTypeLabel[TermType];
export declare type TermTypeIRIValue = typeof TermTypeIRI[TermType];
//# sourceMappingURL=namespaces.d.ts.map