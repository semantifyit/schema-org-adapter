//https://jestjs.io/docs/en/setup-teardown

const util = require("./../src/utilities");

const testContext = {
    "rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
    "rdfs": "http://www.w3.org/2000/01/rdf-schema#",
    "xsd": "http://www.w3.org/2001/XMLSchema#",
    "dc": "http://purl.org/dc/terms/",
    "schema": "http://schema.org/",
    "dach-kg": "http://http://dachkg.org/ontology/1.0/",
    "soa": "http://schema-org-adapter.at/vocabTerms/",
    "soa:superClassOf": {
        "@id": "soa:superClassOf",
        "@type": "@id"
    },
    "soa:superPropertyOf": {
        "@id": "soa:superPropertyOf",
        "@type": "@id"
    },
    "soa:hasProperty": {
        "@id": "soa:hasProperty",
        "@type": "@id"
    },
    "soa:isRangeOf": {
        "@id": "soa:isRangeOf",
        "@type": "@id"
    },
    "soa:hasEnumerationMember": {
        "@id": "soa:hasEnumerationMember",
        "@type": "@id"
    },
    "soa:enumerationDomainIncludes": {
        "@id": "soa:enumerationDomainIncludes",
        "@type": "@id"
    },
    "rdfs:subClassOf": {
        "@id": "rdfs:subClassOf",
        "@type": "@id"
    },
    "rdfs:subPropertyOf": {
        "@id": "rdfs:subPropertyOf",
        "@type": "@id"
    },
    "schema:isPartOf": {
        "@id": "schema:isPartOf",
        "@type": "@id"
    },
    "schema:domainIncludes": {
        "@id": "schema:domainIncludes",
        "@type": "@id"
    },
    "schema:rangeIncludes": {
        "@id": "schema:rangeIncludes",
        "@type": "@id"
    },
    "schema:supersededBy": {
        "@id": "schema:supersededBy",
        "@type": "@id"
    },
    "schema:inverseOf": {
        "@id": "schema:inverseOf",
        "@type": "@id"
    },
    "dc:source": {
        "@id": "dc:source",
        "@type": "@id"
    }
};

describe('util tools', () => {
    test("toCompactIRI()", async () =>{
       let input = "http://schema.org/Book";
       let expectedOutcome = "schema:Book";
       expect(util.toCompactIRI(input, testContext)).toBe(expectedOutcome);
    });
    test("toAbsoluteIRI()", async () =>{
        let input = "dach-kg:endLocation";
        let expectedOutcome = "http://http://dachkg.org/ontology/1.0/endLocation";
        expect(util.toAbsoluteIRI(input, testContext)).toBe(expectedOutcome);
    });
})