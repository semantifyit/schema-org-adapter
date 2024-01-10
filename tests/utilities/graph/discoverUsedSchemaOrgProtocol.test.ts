import { discoverUsedSchemaOrgProtocol } from "../../../src/utilities/graph/discoverUsedSchemaOrgProtocol";
import VOC_OBJ_ZOO from "../../resources/data/vocabularies/vocabulary-animal.json";
import VOC_OBJ_ZOO_2 from "../../resources/data/vocabularies/vocabulary-animal-2.json";
import VOC_OBJ_SDO_3_7 from "../../resources/data/vocabularies/schema/schema-3.7.json";
import VOC_OBJ_SDO_10 from "../../resources/data/vocabularies/schema/schema-10.0.json";
import CONTEXT_1 from "../../resources/data/context/test-context.json";
import CONTEXT_2 from "../../resources/data/context/test-context-2.json";

describe("discoverUsedSchemaOrgProtocol()", () => {
  test("discoverUsedSchemaOrgProtocol", async () => {
    expect(discoverUsedSchemaOrgProtocol(VOC_OBJ_ZOO)).toBe("https");
    expect(discoverUsedSchemaOrgProtocol(VOC_OBJ_ZOO_2)).toBe("https");
    expect(discoverUsedSchemaOrgProtocol(VOC_OBJ_SDO_3_7)).toBe("http");
    expect(discoverUsedSchemaOrgProtocol(VOC_OBJ_SDO_10)).toBe("https");
    expect(discoverUsedSchemaOrgProtocol(CONTEXT_1)).toBe("http");
    expect(discoverUsedSchemaOrgProtocol(CONTEXT_2)).toBe("http");
  });
});
