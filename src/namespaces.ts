import "core-js/proposals/object-from-entries";

/** @ignore
 * Namespace URLs
 */
export const NsUrl = {
  xsd: "http://www.w3.org/2001/XMLSchema#",
  rdf: "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
  rdfs: "http://www.w3.org/2000/01/rdf-schema#",
  schema: "https://schema.org/",
  dcterms: "http://purl.org/dc/terms/",
  soa: "http://schema-org-adapter.at/vocabTerms/",
} as const;

/** @ignore
 * Namespace prefixes
 */
const NsPre = {
  xsd: "xsd",
  rdf: "rdf",
  rdfs: "rdfs",
  schema: "schema",
  dcterms: "dcterms",
  soa: "soa",
} as const;

/** @ignore
 * Type for namespace prefixes
 */
export type NsPreValue = keyof typeof NsPre;

/** @ignore
 * Type for namespace urls
 */
export type NsUrlValue = typeof NsUrl[NsPreValue];

/**
 * creates a record of compact URI for a given namespace prefix and their terms
 */
function toCompactUri<T extends string>(
  prefix: NsPreValue,
  properties: T[]
): Record<T, string> {
  return Object.freeze(
    Object.fromEntries(properties.map((p) => [p, prefix + ":" + p]))
  ) as Record<T, string>;
}

// Create term records for the different namespace prefixes

/** @ignore */
export const _RDF = toCompactUri(NsPre.rdf, ["Property"]);

/** @ignore */
export const _RDFS = toCompactUri("rdfs", [
  "Class",
  "subClassOf",
  "subPropertyOf",
  "label",
  "comment",
]);

/** @ignore */
export const _SOA = toCompactUri("soa", [
  "EnumerationMember",
  "superClassOf",
  "superPropertyOf",
  "hasProperty",
  "isRangeOf",
  "hasEnumerationMember",
  "enumerationDomainIncludes",
]);

/** @ignore */
export const _SCHEMA = toCompactUri("schema", [
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

/** @ignore */
export const _DC = toCompactUri("dcterms", ["source"]);

// actually, we dont need xsd for the sdo adapter. Although it is also not being used in the schema.org vocabularies either, it is listed in their context. Therefore, we treat this namespace as it was used - we just add some terms for xsd data types in the following
/** @ignore */
export const _XSD = toCompactUri("xsd", [
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

/** @ignore
 * The available types of terms as labels (human readable name)
 */
export const TermTypeLabel = {
  class: "Class",
  property: "Property",
  enumeration: "Enumeration",
  enumerationMember: "EnumerationMember",
  dataType: "DataType",
} as const;

/** @ignore
 * The available types of terms as IRIs (computer readable name)
 */
export const TermTypeIRI = {
  class: "rdfs:Class",
  property: "rdf:Property",
  enumeration: "schema:Enumeration",
  enumerationMember: "soa:EnumerationMember",
  dataType: "schema:DataType",
} as const;

/** @ignore
 * Term Types as simple (JS variable) strings
 */
export type TermType = keyof typeof TermTypeLabel;

/**
 * A label (string) indicating the type of a Term:
 * > {@link Class} -> `"Class"`<br>
 * {@link Property} -> `"Property"`<br>
 * {@link Enumeration} -> `"Enumeration"`<br>
 * {@link EnumerationMember} -> `"EnumerationMember"`<br>
 * {@link DataType} -> `"DataType"`
 * @privateRemarks
 * Type for values of TermTypeLabel
 */
export type TermTypeLabelValue = typeof TermTypeLabel[TermType];

/**
 * An IRI (string) indicating the type of a Term:
 * > {@link Class} -> `"rdfs:Class"`<br>
 * {@link Property} -> `"rdf:Property"`<br>
 * {@link Enumeration} -> `"schema:Enumeration"`<br>
 * {@link EnumerationMember} -> `"soa:EnumerationMember"`<br>
 * {@link DataType} -> `"schema:DataType"`
 * @privateRemarks
 * Type for values of TermTypeIRI
 */
export type TermTypeIRIValue = typeof TermTypeIRI[TermType];
