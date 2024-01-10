import { SDOAdapter } from "../../src/classes/SDOAdapter";
import { commit, debugFunc, debugFuncErr } from "../resources/utilities/testUtilities";

describe("SDO Adapter - Direct URL", () => {
  test("fetch vocabulary directly from repo", async () => {
    // test fetch of vocabulary directly from the schema.org repo
    const mySA = new SDOAdapter({
      onError: debugFuncErr
    });
    await mySA.addVocabularies([
      "https://raw.githubusercontent.com/schemaorg/schemaorg/main/data/releases/20.0/schemaorg-all-https.jsonld"
    ]);
    expect(mySA.getListOfClasses()).toHaveLength(804);
    expect(mySA.getListOfProperties()).toHaveLength(1464);
  });

  test("fetch vocab by URL - direct URL", async () => {
    const mySA = new SDOAdapter({
      commit,
      schemaHttps: true,
      onError: debugFuncErr
    });
    await mySA.addVocabularies([
      "https://raw.githubusercontent.com/semantifyit/schemaorg/main/data/releases/10.0/schemaorg-all-https.jsonld",
      "https://raw.githubusercontent.com/semantifyit/schema-org-adapter/master/tests/resources/data/vocabularies/vocabulary-animal.json"
    ]);
    const data1a = mySA.getAllProperties();
    debugFunc(data1a.length);
    expect(data1a.length > 1000).toEqual(true);
    const Place = mySA.getClass("schema:Thing");
    expect(Place.getSubClasses({ implicit: false }).length).toBe(11);
    expect(Place.getSubClasses({ implicit: false })).toContain("ex:Animal");

    const mySaError = new SDOAdapter();

    await expect(async () => await mySaError.fetchVocabularyFromURL("http://www.fantasyurl.test")).rejects.toThrow(
      "Could not find any resource at the given URL."
    );

    await expect(async () => await mySaError.addVocabularies("http://www.fantasyurl.test")).rejects.toThrow(
      "The given URL http://www.fantasyurl.test did not contain a valid JSON-LD vocabulary."
    );

    await expect(async () => await mySaError.addVocabularies("https://typedoc.org/")).rejects.toThrow(
      "The given URL https://typedoc.org/ did not contain a valid JSON-LD vocabulary."
    );
  });
});
