// Namespaces object
/** @ignore */
export const NS = {
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
} as const;

/** @ignore
 * The available types of terms as labels (human-readable name)
 */
export const TermTypeLabel = {
  class: "Class",
  property: "Property",
  enumeration: "Enumeration",
  enumerationMember: "EnumerationMember",
  dataType: "DataType"
} as const;

/** @ignore
 * The available types of terms as IRIs (computer readable name)
 */
export const TermTypeIRI = {
  class: NS.rdfs.class,
  property: NS.rdf.property,
  enumeration: NS.schema.enumeration,
  enumerationMember: NS.soa.enumerationMember,
  dataType: NS.schema.dataType
} as const;

/** @ignore
 * Term Types as simple (JS variable) strings
 */
export type TermType = keyof typeof TermTypeLabel;

/**
 * A label (string) indicating the type of Term:
 * > {@link Class} -> `"Class"`<br>
 * {@link Property} -> `"Property"`<br>
 * {@link Enumeration} -> `"Enumeration"`<br>
 * {@link EnumerationMember} -> `"EnumerationMember"`<br>
 * {@link DataType} -> `"DataType"`
 * @privateRemarks
 * Type for values of TermTypeLabel
 */
export type TermTypeLabelValue = typeof TermTypeLabel[TermType];

export function isTermTypeLabelValue(value: string): value is TermTypeLabelValue {
  return Object.values(TermTypeLabel).includes(value as TermTypeLabelValue);
}

/**
 * An IRI (string) indicating the type of Term:
 * > {@link Class} -> `"rdfs:Class"`<br>
 * {@link Property} -> `"rdf:Property"`<br>
 * {@link Enumeration} -> `"schema:Enumeration"`<br>
 * {@link EnumerationMember} -> `"soa:EnumerationMember"`<br>
 * {@link DataType} -> `"schema:DataType"`
 * @privateRemarks
 * Type for values of TermTypeIRI
 */
export type TermTypeIRIValue = typeof TermTypeIRI[TermType];

export function isTermTypeIRIValue(value: string): value is TermTypeIRIValue {
  return Object.values(TermTypeIRI).includes(value as TermTypeIRIValue);
}
