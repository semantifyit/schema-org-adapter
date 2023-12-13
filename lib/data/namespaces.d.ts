import "core-js/proposals/object-from-entries";
export declare const NsUrl: {
    readonly xsd: "http://www.w3.org/2001/XMLSchema#";
    readonly rdf: "http://www.w3.org/1999/02/22-rdf-syntax-ns#";
    readonly rdfs: "http://www.w3.org/2000/01/rdf-schema#";
    readonly schema: "https://schema.org/";
    readonly dcterms: "http://purl.org/dc/terms/";
    readonly soa: "http://schema-org-adapter.at/vocabTerms/";
    readonly ds: "https://vocab.sti2.at/ds/";
};
declare const NsPre: {
    readonly xsd: "xsd";
    readonly rdf: "rdf";
    readonly rdfs: "rdfs";
    readonly schema: "schema";
    readonly dcterms: "dcterms";
    readonly soa: "soa";
    readonly ds: "ds";
};
export declare type NsPreValue = keyof typeof NsPre;
export declare type NsUrlValue = typeof NsUrl[NsPreValue];
export declare const _RDF: Record<"Property", string>;
export declare const _RDFS: Record<"Class" | "subClassOf" | "subPropertyOf" | "label" | "comment", string>;
export declare const _SOA: Record<"EnumerationMember" | "superClassOf" | "superPropertyOf" | "hasProperty" | "isRangeOf" | "hasEnumerationMember" | "enumerationDomainIncludes", string>;
export declare const _SCHEMA: Record<"DataType" | "Enumeration" | "isPartOf" | "domainIncludes" | "rangeIncludes" | "supersededBy" | "inverseOf" | "source" | "category", string>;
export declare const _DC: Record<"source", string>;
export declare const _XSD: Record<"string" | "boolean" | "decimal" | "integer" | "float" | "double" | "date" | "time" | "dateTime" | "anyURI", string>;
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
export {};
//# sourceMappingURL=namespaces.d.ts.map