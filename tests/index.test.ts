import * as Index from "../src/index";
import { commit, debugFuncErr } from "./testUtility";
import VOC_OBJ_SDO3_7 from "./data/schema-3.7.json";
import VOC_OBJ_GWON from "./data/graph-with-one-node.json";
import { getURLBaseSchema, getURLSchemaVersions } from "../lib/utilities";

/**
 *  Tests regarding the JS-Class for "SDOAdapter"
 */
describe("SDO Adapter methods", () => {
  test("create() without vocab", async () => {
    const mySA = await Index.create({
      commit: commit,
      schemaHttps: true,
      onError: debugFuncErr,
      vocabularies: [VOC_OBJ_SDO3_7, VOC_OBJ_GWON],
    });
    const testClass = mySA.getClass("namespace:AwesomePerson");
    expect(testClass.getName()).toEqual("validValue");
  });

  test("create() with vocab", async () => {
    const mySA = await Index.create({
      commit: commit,
      schemaHttps: true,
      onError: debugFuncErr,
      vocabularies: [VOC_OBJ_SDO3_7, VOC_OBJ_GWON],
    });
    const testClass = mySA.getClass("namespace:AwesomePerson");
    expect(testClass.getName()).toEqual("validValue");
  });

  test("constructURLSchemaVocabulary()", async () => {
    const url = await Index.constructURLSchemaVocabulary("9.0", true, commit);
    expect(url).toBe(
      getURLBaseSchema(commit) + "9.0/schemaorg-all-https.jsonld"
    );
    const url2 = await Index.constructURLSchemaVocabulary("3.9", false, commit);
    expect(url2).toBe(getURLBaseSchema(commit) + "3.9/all-layers.jsonld");
    const url3 = await Index.constructURLSchemaVocabulary("9.0", false, commit);
    expect(url3).toBe(
      getURLBaseSchema(commit) + "9.0/schemaorg-all-http.jsonld"
    );
    const url4 = await Index.constructURLSchemaVocabulary("9.0", true, commit);
    expect(url4).toBe(
      getURLBaseSchema(commit) + "9.0/schemaorg-all-https.jsonld"
    );
    const url5a = await Index.constructURLSchemaVocabulary("latest");
    const url5b = await Index.constructURLSchemaVocabulary();
    expect(url5a).toBe(url5b);
    const url6a = await Index.constructURLSchemaVocabulary(
      "9.0",
      true,
      "9a3ba46"
    );
    expect(url6a).toBe(
      getURLBaseSchema("9a3ba46") + "9.0/schemaorg-all-https.jsonld"
    );
  });

  test("getURLSchemaVersions()", async () => {
    expect(getURLSchemaVersions()).toBe(
      "https://raw.githubusercontent.com/semantifyit/schemaorg/main/versions.json"
    );
    expect(getURLSchemaVersions("9a3ba46")).toBe(
      "https://raw.githubusercontent.com/schemaorg/schemaorg/9a3ba46/versions.json"
    );
  });

  test("getURLBaseSchema()", async () => {
    expect(getURLBaseSchema()).toBe(
      "https://raw.githubusercontent.com/semantifyit/schemaorg/main/data/releases/"
    );
    expect(getURLBaseSchema("9a3ba46")).toBe(
      "https://raw.githubusercontent.com/schemaorg/schemaorg/9a3ba46/data/releases/"
    );
  });
});
