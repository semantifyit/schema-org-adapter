import { SOA } from "../src/index";
import { commit, debugFuncErr } from "./resources/utilities/testUtilities";
import VOC_OBJ_SDO_3_7 from "./resources/data/vocabularies/schema/schema-3.7.json";
import VOC_OBJ_GWON from "./resources/data/vocabularies/graph-with-one-node.json";
import { getGitHubBaseURL } from "../src/utilities/infrastructure/getGitHubBaseURL";

/**
 *  Tests regarding the JS-Class for "SDOAdapter"
 */
describe("SDO Adapter methods", () => {
  test("create() without schema vocab", async () => {
    const mySA = await SOA.create({
      commit: commit,
      schemaHttps: true,
      onError: debugFuncErr,
      vocabularies: [VOC_OBJ_GWON]
    });
    const testClass = mySA.getClass("namespace:AwesomePerson");
    expect(testClass.getName()).toEqual("validValue");
  });

  test("create() with vocab", async () => {
    const mySA = await SOA.create({
      commit: commit,
      schemaHttps: true,
      onError: debugFuncErr,
      vocabularies: [VOC_OBJ_SDO_3_7, VOC_OBJ_GWON]
    });
    const testClass = mySA.getClass("namespace:AwesomePerson");
    expect(testClass.getName()).toEqual("validValue");
  });

  test("constructURLSchemaVocabulary()", async () => {
    const url = await SOA.constructURLSchemaVocabulary("9.0", true, commit);
    expect(url).toBe(getGitHubBaseURL(commit) + "/data/releases/9.0/schemaorg-all-https.jsonld");
    const url2 = await SOA.constructURLSchemaVocabulary("3.9", false, commit);
    expect(url2).toBe(getGitHubBaseURL(commit) + "/data/releases/3.9/all-layers.jsonld");
    const url3 = await SOA.constructURLSchemaVocabulary("9.0", false, commit);
    expect(url3).toBe(getGitHubBaseURL(commit) + "/data/releases/9.0/schemaorg-all-http.jsonld");
    const url4 = await SOA.constructURLSchemaVocabulary("9.0", true, commit);
    expect(url4).toBe(getGitHubBaseURL(commit) + "/data/releases/9.0/schemaorg-all-https.jsonld");
    const url5a = await SOA.constructURLSchemaVocabulary("latest");
    const url5b = await SOA.constructURLSchemaVocabulary();
    expect(url5a).toBe(url5b);
    const url6a = await SOA.constructURLSchemaVocabulary("9.0", true, "9a3ba46");
    expect(url6a).toBe(getGitHubBaseURL("9a3ba46") + "/data/releases/9.0/schemaorg-all-https.jsonld");
  });

  test("getGitHubBaseURL()", async () => {
    expect(getGitHubBaseURL()).toBe("https://raw.githubusercontent.com/semantifyit/schemaorg/main");
    expect(getGitHubBaseURL("9a3ba46")).toBe("https://raw.githubusercontent.com/schemaorg/schemaorg/9a3ba46");
  });
});
