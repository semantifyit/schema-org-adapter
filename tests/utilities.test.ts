import {
  getFileNameForSchemaOrgVersion,
  toAbsoluteIRI,
  toCompactIRI,
} from "../src/utilities";
import { SOA } from "../src/index";
import VOC_OBJ_ZOO from "./data/vocabulary-animal.json";
import VOC_OBJ_SDO_3_7 from "./data/schema-3.7.json";
import VOC_OBJ_SDO_10 from "./data/schema-10.0.json";
import VOC_OBJ_ZOO_2 from "./data/vocabulary-animal-2.json";
import { commit, debugFuncErr } from "./testUtility";
import {
  discoverEquateNamespaces,
  discoverUsedSchemaOrgProtocol,
  generateContext,
} from "../src/graphUtilities";
import { FilterObject } from "../lib/types";

async function initAdapter() {
  return await SOA.create({
    commit: commit,
    onError: debugFuncErr,
    schemaVersion: "latest",
    vocabularies: [VOC_OBJ_ZOO],
  });
}

/**
 *  Tests regarding the utility functions
 */
describe("utilities testing", () => {
  test("generateContext()", async () => {
    const newContext = generateContext(testContext, testContext);
    expect(newContext).toEqual(testContext);
    const newContext2 = generateContext(testContext, testContext2);
    expect(newContext2).not.toEqual(testContext);
  });
  test("generateContext() - extended", async () => {
    const contextA = {
      schema: "https://schema.org/",
    };
    const contextB = {
      schema2: "https://schema.org/",
    };
    const contextC = {
      schema: "http://schema.org/",
    };
    const contextD = {
      schema2: "http://schema.org/",
    };
    expect(generateContext(contextA, contextA)).toEqual(contextA);
    expect(generateContext(contextA, contextB)).toEqual(contextA);
    expect(generateContext(contextB, contextA)).toEqual(contextB);
    expect(generateContext(contextA, contextC)).toEqual({
      schema: "https://schema.org/",
      schema1: "http://schema.org/",
    });
    expect(generateContext(contextA, contextD)).toEqual({
      schema: "https://schema.org/",
      schema2: "http://schema.org/",
    });
  });
  test("toCompactIRI()", async () => {
    expect(toCompactIRI("http://schema.org/Book", testContext)).toBe(
      "schema:Book"
    );
    expect(toCompactIRI("http://schema.org/Book", testContext, false)).toBe(
      "schema:Book"
    );
    expect(toCompactIRI("https://schema.org/Book", testContext, true)).toBe(
      "schema:Book"
    );
    expect(() =>
      toCompactIRI("https://schema.org/Book", testContext, false)
    ).toThrow();
  });
  test("toAbsoluteIRI()", async () => {
    const input = "schema:Hotel";
    const expectedOutcome = "http://schema.org/Hotel";
    expect(toAbsoluteIRI(input, testContext)).toBe(expectedOutcome);
    expect(() => toAbsoluteIRI("schemaaaa:Hotel", testContext)).toThrow();
  });
  test("applyFilter()", async () => {
    const mySA = await initAdapter();
    const MedicalWebPage = mySA.getClass("schema:MedicalWebPage");
    const filter1 = undefined;
    const filter2 = {};
    const filter3 = { termType: "Class" } as FilterObject;
    const filter4 = { termType: "Property" } as FilterObject;
    const filter5 = { isSuperseded: false } as FilterObject;
    const filter6 = { isSuperseded: true } as FilterObject;
    const filter7 = { termType: ["Property", "Class"] } as FilterObject;
    const filter8 = { termType: ["Enumeration", "Class"] } as FilterObject;
    const filter9 = {
      termType: ["Property"],
      fromVocabulary: ["https://schema.org/"],
    } as FilterObject;
    const filter9b = {
      termType: ["Property"],
      fromVocabulary: "https://schema.org/",
    } as FilterObject;
    const filter10 = {
      termType: ["Property"],
      fromVocabulary: "ex",
    } as FilterObject;
    const filter11 = {
      termType: ["Property"],
      fromVocabulary: ["schema", "ex"],
    } as FilterObject;
    const filter12 = { termType: ["SomeThingFalse"] };
    const filter13 = { termType: ["DataType"] } as FilterObject;
    expect(MedicalWebPage.getProperties(true, filter1)).toContain(
      "schema:aspect"
    );
    expect(MedicalWebPage.getProperties(true, filter2)).toContain(
      "schema:aspect"
    );
    expect(MedicalWebPage.getProperties(true, filter3)).not.toContain(
      "schema:aspect"
    );
    expect(MedicalWebPage.getProperties(true, filter4)).toContain(
      "schema:aspect"
    );
    expect(MedicalWebPage.getProperties(true, filter5)).not.toContain(
      "schema:aspect"
    );
    expect(MedicalWebPage.getProperties(true, filter5)).toContain(
      "schema:name"
    );
    expect(MedicalWebPage.getProperties(true, filter6)).toContain(
      "schema:aspect"
    );
    expect(MedicalWebPage.getProperties(true, filter6)).not.toContain(
      "schema:name"
    );
    expect(mySA.getListOfProperties(filter6)).not.toContain("schema:name");
    expect(mySA.getListOfProperties(filter6)).toContain("schema:aspect");
    expect(mySA.getListOfProperties(filter4)).toContain("schema:aspect");
    expect(mySA.getListOfProperties(filter4)).toContain("schema:name");
    expect(mySA.getListOfProperties(filter1)).toContain(
      "ex:animalLivingEnvironment"
    );
    expect(mySA.getListOfProperties(filter7)).toContain(
      "ex:animalLivingEnvironment"
    );
    expect(mySA.getListOfProperties(filter8)).not.toContain(
      "ex:animalLivingEnvironment"
    );
    expect(mySA.getListOfProperties(filter9)).not.toContain(
      "ex:animalLivingEnvironment"
    );
    expect(mySA.getListOfProperties(filter9)).toContain("schema:name");
    expect(mySA.getListOfProperties(filter9b)).toContain("schema:name");
    expect(mySA.getListOfProperties(filter10)).toContain(
      "ex:animalLivingEnvironment"
    );
    expect(mySA.getListOfProperties(filter10)).not.toContain("schema:name");
    expect(mySA.getListOfProperties(filter11)).toContain(
      "ex:animalLivingEnvironment"
    );
    expect(mySA.getListOfProperties(filter11)).toContain("schema:aspect");
    // @ts-ignore - we want to test an invalid filter
    expect(() => mySA.getListOfProperties(filter12)).toThrow();
    expect(mySA.getListOfDataTypes(filter13)).toContain("schema:Text");
  });
  test("discoverUsedSchemaOrgProtocol()", async () => {
    expect(discoverUsedSchemaOrgProtocol(VOC_OBJ_ZOO)).toBe("https");
    expect(discoverUsedSchemaOrgProtocol(VOC_OBJ_ZOO_2)).toBe("https");
    expect(discoverUsedSchemaOrgProtocol(VOC_OBJ_SDO_3_7)).toBe("http");
    expect(discoverUsedSchemaOrgProtocol(VOC_OBJ_SDO_10)).toBe("https");
    expect(discoverUsedSchemaOrgProtocol(testContext)).toBe("http");
    expect(discoverUsedSchemaOrgProtocol(testContext2)).toBe("http");
  });
  test("discoverEquateNamespaces()", async () => {
    expect(
      Array.isArray(discoverEquateNamespaces(testContext, VOC_OBJ_ZOO))
    ).toBe(true);
    expect(discoverEquateNamespaces(testContext, VOC_OBJ_ZOO).length).toBe(1);
    expect(discoverEquateNamespaces(testContext, VOC_OBJ_ZOO)[0]).toBe(
      "https://schema.org/"
    );
    expect(discoverEquateNamespaces(testContext, VOC_OBJ_ZOO_2).length).toBe(1);
    expect(discoverEquateNamespaces(testContext, VOC_OBJ_ZOO_2)[0]).toBe(
      "https://schema.org/"
    );
    expect(
      discoverEquateNamespaces(VOC_OBJ_ZOO["@context"], VOC_OBJ_SDO_3_7)[0]
    ).toBe("http://schema.org/");
  });

  // Checks if the function getFileNameForSchemaOrgVersion() retrieves filenames (only jsonld) for the corresponding schema.org versions as expected
  test("getFileNameForSchemaOrgVersion()", async () => {
    // 2.0 - 3.0 have no jsonld -> error
    // 3.1 - 8.0 have all-layers.jsonld
    // 9.0 + have schemaorg-all-http.jsonld
    const expectedFileMapping = {
      "10.0": "schemaorg-all-https.jsonld",
      "9.0": "schemaorg-all-https.jsonld",
      "8.0": "all-layers.jsonld",
      7.04: "all-layers.jsonld",
      7.03: "all-layers.jsonld",
      7.02: "all-layers.jsonld",
      7.01: "all-layers.jsonld",
      "7.0": "all-layers.jsonld",
      "6.0": "all-layers.jsonld",
      "5.0": "all-layers.jsonld",
      "4.0": "all-layers.jsonld",
      3.9: "all-layers.jsonld",
      3.8: "all-layers.jsonld",
      3.7: "all-layers.jsonld",
      3.6: "all-layers.jsonld",
      3.5: "all-layers.jsonld",
      3.4: "all-layers.jsonld",
      3.3: "all-layers.jsonld",
      3.2: "all-layers.jsonld",
      3.1: "all-layers.jsonld",
      "3.0": null,
      2.2: null,
      2.1: null,
      "2.0": null,
    };
    for (const currVersion of Object.entries(expectedFileMapping)) {
      if (currVersion[1] === null) {
        // expect to fail (You must wrap the code in a function, otherwise the error will not be caught and the assertion will fail.)
        // eslint-disable-next-line jest/no-conditional-expect
        expect(() => {
          getFileNameForSchemaOrgVersion(currVersion[0]);
        }).toThrow();
      } else {
        // eslint-disable-next-line jest/no-conditional-expect
        expect(getFileNameForSchemaOrgVersion(currVersion[0])).toBe(
          currVersion[1]
        );
      }
    }
  });
});

const testContext = {
  rdf: "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
  rdfs: "http://www.w3.org/2000/01/rdf-schema#",
  xsd: "http://www.w3.org/2001/XMLSchema#",
  dc: "http://purl.org/dc/terms/",
  schema: "http://schema.org/",
  ex: "https://example-vocab.ex/",
  soa: "http://schema-org-adapter.at/vocabTerms/",
  "soa:superClassOf": {
    "@id": "soa:superClassOf",
    "@type": "@id",
  },
  "soa:superPropertyOf": {
    "@id": "soa:superPropertyOf",
    "@type": "@id",
  },
  "soa:hasProperty": {
    "@id": "soa:hasProperty",
    "@type": "@id",
  },
  "soa:isRangeOf": {
    "@id": "soa:isRangeOf",
    "@type": "@id",
  },
  "soa:hasEnumerationMember": {
    "@id": "soa:hasEnumerationMember",
    "@type": "@id",
  },
  "soa:enumerationDomainIncludes": {
    "@id": "soa:enumerationDomainIncludes",
    "@type": "@id",
  },
  "rdfs:subClassOf": {
    "@id": "rdfs:subClassOf",
    "@type": "@id",
  },
  "rdfs:subPropertyOf": {
    "@id": "rdfs:subPropertyOf",
    "@type": "@id",
  },
  "schema:isPartOf": {
    "@id": "schema:isPartOf",
    "@type": "@id",
  },
  "schema:domainIncludes": {
    "@id": "schema:domainIncludes",
    "@type": "@id",
  },
  "schema:rangeIncludes": {
    "@id": "schema:rangeIncludes",
    "@type": "@id",
  },
  "schema:supersededBy": {
    "@id": "schema:supersededBy",
    "@type": "@id",
  },
  "schema:inverseOf": {
    "@id": "schema:inverseOf",
    "@type": "@id",
  },
  "dc:source": {
    "@id": "dc:source",
    "@type": "@id",
  },
  "schema:source": {
    "@id": "schema:source",
    "@type": "@id",
  },
};

const testContext2 = {
  rdf: "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
  rdfs: "http://www.w3.org/2000/01/rdf-schema#",
  xsd: "http://www.w3.org/2001/XMLSchema#",
  dc: "http://purl.org/dc/terms/2",
  schema2: "http://schema.org/",
  ex: "https://example-vocab.ex/",
  soa: "http://schema-org-adapter.at/vocabTerms/",
  "soa:superClassOf": {
    "@id": "soa:superClassOf",
    "@type": "@id",
  },
  "soa:superPropertyOf": {
    "@id": "soa:superPropertyOf",
    "@type": "@id",
  },
  "soa:hasProperty": {
    "@id": "soa:hasProperty",
    "@type": "@id",
  },
  "soa:isRangeOf": {
    "@id": "soa:isRangeOf",
    "@type": "@id",
  },
  "soa:hasEnumerationMember": {
    "@id": "soa:hasEnumerationMember",
    "@type": "@id",
  },
  "soa:enumerationDomainIncludes": {
    "@id": "soa:enumerationDomainIncludes",
    "@type": "@id",
  },
  "rdfs:subClassOf": {
    "@id": "rdfs:subClassOf",
    "@type": "@id",
  },
  "rdfs:subPropertyOf": {
    "@id": "rdfs:subPropertyOf",
    "@type": "@id",
  },
  "schema:isPartOf": {
    "@id": "schema:isPartOf",
    "@type": "@id",
  },
  "schema:domainIncludes": {
    "@id": "schema:domainIncludes",
    "@type": "@id",
  },
  "schema:rangeIncludes": {
    "@id": "schema:rangeIncludes",
    "@type": "@id",
  },
  "schema:supersededBy": {
    "@id": "schema:supersededBy",
    "@type": "@id",
  },
  "schema:inverseOf": {
    "@id": "schema:inverseOf",
    "@type": "@id",
  },
  "dc:source": {
    "@id": "dc:source",
    "@type": "@id",
  },
  "schema:source": {
    "@id": "schema:source",
    "@type": "@id",
  },
};
