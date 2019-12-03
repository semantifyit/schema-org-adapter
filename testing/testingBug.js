const jsonld = require("jsonld");

let vocabBuggy = {
    "@context": {
        "namespace": "http://janstestvocab.com/",
        "rdfs": "http://www.w3.org/2000/01/rdf-schema#",
        "schema": "http://schema.org/"
    },
    "@graph": [
        {
            "@id": "namespace:AwesomePerson",
            "@type": "rdfs:Class",
            "rdfs:comment": "validValue",
            "rdfs:label": "validValue",
            "rdfs:subClassOf": {
                "@id": "schema:Person"
            }
        }
    ]
};


let vocab = {
    "@context": {
        "namespace": "http://janstestvocab.com/",
        "rdfs": "http://www.w3.org/2000/01/rdf-schema#",
        "schema": "http://schema.org/"
    },
    "@graph": [
        {
            "@id": "namespace:AwesomePerson",
            "@type": "rdfs:Class",
            "rdfs:comment": "validValue",
            "rdfs:label": "validValue",
            "rdfs:subClassOf": {
                "@id": "schema:Person"
            }
        },
        {
            "@id": "namespace:AwesomePerson2",
            "@type": "rdfs:Class",
            "rdfs:comment": "validValue2",
            "rdfs:label": "validValue2",
            "rdfs:subClassOf": {
                "@id": "schema:Person"
            }
        }
    ]
};

let newContext = {
    "rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
    "rdfs": "http://www.w3.org/2000/01/rdf-schema#",
    "xsd": "http://www.w3.org/2001/XMLSchema#",
    "dc": "http://purl.org/dc/terms/",
    "schema": "http://schema.org/",
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

main();

async function main() {
    let result = await jsonld.compact(await jsonld.expand(vocab), newContext);
    console.log(result);

}