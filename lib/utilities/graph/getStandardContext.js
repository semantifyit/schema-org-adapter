"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStandardContext = void 0;
const namespaces_1 = require("../../data/namespaces");
function getStandardContext() {
    const standardContext = {
        rdf: namespaces_1.NS.rdf._url,
        rdfs: namespaces_1.NS.rdfs._url,
        xsd: namespaces_1.NS.xsd._url,
        dcterms: namespaces_1.NS.dcterms._url,
        soa: namespaces_1.NS.soa._url,
        ds: namespaces_1.NS.ds._url,
    };
    const idEntries = [
        namespaces_1.NS.soa.superClassOf,
        namespaces_1.NS.soa.superPropertyOf,
        namespaces_1.NS.soa.hasProperty,
        namespaces_1.NS.soa.isRangeOf,
        namespaces_1.NS.soa.hasEnumerationMember,
        namespaces_1.NS.soa.enumerationDomainIncludes,
        namespaces_1.NS.rdfs.subClassOf,
        namespaces_1.NS.rdfs.subPropertyOf,
        namespaces_1.NS.schema.isPartOf,
        namespaces_1.NS.schema.domainIncludes,
        namespaces_1.NS.schema.rangeIncludes,
        namespaces_1.NS.schema.supersededBy,
        namespaces_1.NS.schema.inverseOf,
        namespaces_1.NS.schema.source,
        namespaces_1.NS.dcterms.source,
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
//# sourceMappingURL=getStandardContext.js.map