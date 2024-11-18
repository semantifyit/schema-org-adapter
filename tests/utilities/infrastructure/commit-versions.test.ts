import { SDOAdapter, SOA } from "../../../src";
import { SEMANTIFY_COMMIT } from "../../../src/data/semantify";

const schemaRepoCommit = "ad42b25994b238eb6e5b982b079ae2f403c5bba0";
const semantifyHostCommit = SEMANTIFY_COMMIT

// here we want to check that the schema.org ontologies are the same, despite the source of the vocabularies (different commit versions)
// 1. no commit -> GitHub repo of semantify (fork from schema.org GitHub Repo) - stops at version 15.0 currently
// 2. commit "ad42b25994b238eb6e5b982b079ae2f403c5bba0" -> GitHub repo of schema.org - latest version 28.0
// 3. commit "SEMANTIFY" -> Self-hosted versions, starts at 12.0, latest is 28.0

describe("Commit versions", () => {

  test("version 15.0", async () => {
    const soa1 = await SOA.create({
      schemaVersion: "15.0",
    });
    const soa2 = await SOA.create({
      commit: schemaRepoCommit,
      schemaVersion: "15.0",
    });
    const soa3 = await SOA.create({
      commit: semantifyHostCommit,
      schemaVersion: "15.0",
    });
    expect(soa1.getListOfTerms().length).toEqual(soa2.getListOfTerms().length)
    expect(soa1.getListOfTerms().length).toEqual(soa3.getListOfTerms().length)
    compareTerms(soa1, soa2)
    compareTerms(soa1, soa3)
  });

  test("version 25.0", async () => {
    const soa2 = await SOA.create({
      commit: schemaRepoCommit,
      schemaVersion: "25.0",
    });
    const soa3 = await SOA.create({
      commit: semantifyHostCommit,
      schemaVersion: "25.0",
    });
    expect(soa2.getListOfTerms().length).toEqual(soa3.getListOfTerms().length)
    compareTerms(soa2, soa3)
  });

  // if this test fails, it is likely because a new schema.org version is out, and the semantify self-host repository must be updated
  test("latest", async () => {
    const soa2 = await SOA.create({
      commit: schemaRepoCommit,
      schemaVersion: "latest",
    });
    const soa3 = await SOA.create({
      commit: semantifyHostCommit,
      schemaVersion: "latest",
    });
    expect(soa2.getListOfTerms().length).toEqual(soa3.getListOfTerms().length)
    compareTerms(soa2, soa3)
  });

});

function compareTerms(soa1: SDOAdapter, soa2: SDOAdapter){
  compareArrays(soa1.getListOfClasses(), soa2.getListOfClasses())
  compareArrays(soa1.getListOfProperties(), soa2.getListOfProperties())
  compareArrays(soa1.getListOfEnumerations(), soa2.getListOfEnumerations())
  compareArrays(soa1.getListOfEnumerationMembers(), soa2.getListOfEnumerationMembers())
  compareArrays(soa1.getListOfDataTypes(), soa2.getListOfDataTypes())
}

function compareArrays(arr1: string[],arr2: string[]){
  expect(arr1.every(iri => arr2.includes(iri))).toBe(true);
  expect(arr2.every(iri => arr1.includes(iri))).toBe(true);
}
