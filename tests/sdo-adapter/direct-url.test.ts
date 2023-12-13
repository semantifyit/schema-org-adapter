import { SDOAdapter } from "../../src/SDOAdapter";
import { debugFuncErr } from "../testUtility";

describe("SDO Adapter - Direct URL", () => {
  test("fetch vocabulary directly from repo", async () => {
    //test fetch of vocabulary directly from the schema.org repo
    const mySA = new SDOAdapter({
      onError: debugFuncErr,
    });
    await mySA.addVocabularies([
      "https://raw.githubusercontent.com/schemaorg/schemaorg/main/data/releases/20.0/schemaorg-all-https.jsonld",
    ]);
    expect(mySA.getListOfClasses()).toHaveLength(804);
    expect(mySA.getListOfProperties()).toHaveLength(1464);
  });
});
