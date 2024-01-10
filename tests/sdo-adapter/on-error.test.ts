import { SDOAdapter } from "../../src/classes/SDOAdapter";
import { commit, debugFunc } from "../resources/utilities/testUtilities";

describe("SDO Adapter - OnError", () => {
  test("onError function", async () => {
    // this test should trigger the onError function, outputting invalid nodes in the schema.org vocabulary version 3.2
    let mySA = new SDOAdapter({
      commit,
      onError: function (text) {
        debugFunc(text);
      }
    });
    const versionUrl = await mySA.constructURLSchemaVocabulary("3.2");
    await mySA.addVocabularies([versionUrl]);
    // test without onError function
    mySA = new SDOAdapter({ commit });
    await mySA.addVocabularies([versionUrl]);
    // generic test
    expect(mySA.getListOfProperties().length > 300).toBe(true);
  });
});
