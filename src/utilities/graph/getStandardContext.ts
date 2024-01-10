import { Context } from "../../types/types";
import { NS } from "../../data/namespaces";

/** @ignore */
export function getStandardContext(): Context {
  // Simply speaking, a context is used to map terms to IRIs. Terms are case-sensitive and any valid string that is not a reserved JSON-LD keyword can be used as a term.
  // soa:superClassOf is an inverse of rdfs:subClassOf that should help us
  // soa:superPropertyOf is an inverse of rdfs:subPropertyOf that should help us
  // soa:hasProperty is an inverse of schema:domainIncludes
  // soa:isRangeOf is an inverse of schema:rangeIncludes
  // soa:hasEnumerationMember is used for enumerations to list all its enumeration members (their @type includes the @id of the enumeration)
  // soa:enumerationDomainIncludes is an inverse of soa:hasEnumerationMember
  // soa:EnumerationMember is introduced as meta type for the members of a schema:Enumeration
  const standardContext: Context = {
    rdf: NS.rdf._url,
    rdfs: NS.rdfs._url,
    xsd: NS.xsd._url,
    dcterms: NS.dcterms._url,
    // schema: 'http://schema.org/', this entry will be generated the first time a vocabulary is added to the graph
    soa: NS.soa._url,
    ds: NS.ds._url,
  };
  const idEntries = [
    NS.soa.superClassOf,
    NS.soa.superPropertyOf,
    NS.soa.hasProperty,
    NS.soa.isRangeOf,
    NS.soa.hasEnumerationMember,
    NS.soa.enumerationDomainIncludes,
    NS.rdfs.subClassOf,
    NS.rdfs.subPropertyOf,
    NS.schema.isPartOf,
    NS.schema.domainIncludes,
    NS.schema.rangeIncludes,
    NS.schema.supersededBy,
    NS.schema.inverseOf,
    NS.schema.source,
    NS.dcterms.source,
  ];
  idEntries.map((el) => {
    standardContext[el] = {
      "@id": el,
      "@type": "@id",
    };
  });
  return standardContext;
}
