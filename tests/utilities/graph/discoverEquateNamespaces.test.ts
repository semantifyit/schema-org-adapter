import { discoverEquateNamespaces } from "../../../src/utilities/graph/discoverEquateNamespaces";
import VOC_OBJ_ZOO from "../../resources/data/vocabularies/vocabulary-animal.json";
import VOC_OBJ_ZOO_2 from "../../resources/data/vocabularies/vocabulary-animal-2.json";
import VOC_OBJ_SDO_3_7 from "../../resources/data/vocabularies/schema/schema-3.7.json";
import CONTEXT_1 from "../../resources/data/context/test-context.json";

describe("discoverEquateNamespaces()", () => {
  test("discoverEquateNamespaces", async () => {
    expect(
      Array.isArray(discoverEquateNamespaces(CONTEXT_1, VOC_OBJ_ZOO))
    ).toBe(true);
    expect(discoverEquateNamespaces(CONTEXT_1, VOC_OBJ_ZOO).length).toBe(1);
    expect(discoverEquateNamespaces(CONTEXT_1, VOC_OBJ_ZOO)[0]).toBe(
      "https://schema.org/"
    );
    expect(discoverEquateNamespaces(CONTEXT_1, VOC_OBJ_ZOO_2).length).toBe(1);
    expect(discoverEquateNamespaces(CONTEXT_1, VOC_OBJ_ZOO_2)[0]).toBe(
      "https://schema.org/"
    );
    expect(
      discoverEquateNamespaces(VOC_OBJ_ZOO["@context"], VOC_OBJ_SDO_3_7)[0]
    ).toBe("http://schema.org/");
  });
});
