import { SDOAdapter } from "../../src/classes/SDOAdapter";
import { commit, debugFuncErr } from "../resources/utilities/testUtilities";
import VOC_OBJ_ZOO from "../resources/data/vocabularies/vocabulary-animal.json";
import VOC_OBJ_SDO_3_7 from "../resources/data/vocabularies/schema/schema-3.7.json";
import VOC_OBJ_GWON from "../resources/data/vocabularies/graph-with-one-node.json";

/**
 *  Tests regarding the JS-Class for "SDOAdapter"
 */
describe("SDO Adapter - Vocabulary functions", () => {
  test("addVocabularies()", async () => {
    const mySA = new SDOAdapter({
      commit,
      onError: debugFuncErr
    });
    await mySA.addVocabularies([VOC_OBJ_SDO_3_7, VOC_OBJ_GWON]);
    const testClass = mySA.getClass("namespace:AwesomePerson");
    expect(testClass.getName()).toEqual("validValue");
    // await mySA.addVocabularies('http://noVocab.com')
    await expect(mySA.addVocabularies("http://noVocab.com")).rejects.toEqual(
      Error("The given URL http://noVocab.com did not contain a valid JSON-LD vocabulary.")
    );
    // we try to trigger an error with an invalid input
    await expect(mySA.addVocabularies([true] as unknown as string)).rejects.toEqual(
      Error(
        "The first argument of the function must be an Array of vocabularies or a single vocabulary (JSON-LD as Object/String)"
      )
    );
    await mySA.addVocabularies(JSON.stringify(VOC_OBJ_SDO_3_7)); // try stringified version
  });

  test("addVocabularies() add single vocabulary", async () => {
    const mySA = new SDOAdapter({
      commit,
      onError: debugFuncErr
    });
    await mySA.addVocabularies(VOC_OBJ_SDO_3_7);
    const testClass = mySA.getClass("schema:Hotel");
    expect(testClass.getName()).toEqual("Hotel");
  });

  test("addVocabularies() latest", async () => {
    const mySA = new SDOAdapter({
      commit,
      onError: debugFuncErr
    });
    await mySA.addVocabularies([await mySA.constructURLSchemaVocabulary("latest"), VOC_OBJ_GWON]);
    const testClass = mySA.getClass("namespace:AwesomePerson");
    expect(testClass.getName()).toEqual("validValue");
  });

  test("getVocabularies() latest", async () => {
    const mySA = new SDOAdapter({
      commit,
      onError: debugFuncErr
    });
    await mySA.addVocabularies([await mySA.constructURLSchemaVocabulary("latest"), VOC_OBJ_ZOO]);
    const vocabs = mySA.getVocabularies();
    expect(Object.keys(vocabs).length).toBe(2);
    expect(vocabs.schema).not.toBe(undefined);
    expect(vocabs.ex).not.toBe(undefined);
    expect(vocabs.ex).toBe("https://example-vocab.ex/");
    const allVocabs = mySA.getVocabularies(false);
    expect(Object.keys(allVocabs).length).not.toBe(2);
    expect(allVocabs.schema).not.toBe(undefined);
    expect(allVocabs.dcterms).not.toBe(undefined);
    expect(allVocabs.rdf).not.toBe(undefined);
    expect(allVocabs.rdfs).not.toBe(undefined);
    expect(allVocabs.ex).not.toBe(undefined);
    expect(allVocabs.ex).toBe("https://example-vocab.ex/");
  });
});
