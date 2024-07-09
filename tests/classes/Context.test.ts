import {
  testSdoAdapter
} from "../resources/utilities/testUtilities";
import VOC_OBJ_ODTA_NEW from "../resources/data/vocabularies/odta-new-context.json";
import VOC_OBJ_20 from "../resources/data/vocabularies/schema/schema-20.0.json";
import VOC_OBJ_20_NEW from "../resources/data/vocabularies/schema-20-new-context.json";

/**
 *  Tests regarding different contexts in vocabularies, and SDO handling them
 */
describe("Context tests", () => {
  test("new context 1", async () => {
    const sdoAdapter = await testSdoAdapter({
      vocabularies: [VOC_OBJ_ODTA_NEW],
      schemaVersion: "latest",
      equateVocabularyProtocols: true
    });
    const p1 = sdoAdapter.getProperty("odta:sustainabilityFeature");
    expect(p1.getName()).toEqual("sustainabilityFeature");
    expect(p1.getDescription("en")).toEqual(
      "A property for defining sustainability features for different types of touristic entities."
    );
    expect(p1.getDomains({ implicit: false })).toEqual([
      "schema:Event",
      "schema:Offer",
      "schema:Organization",
      "schema:Place",
      "schema:Trip"
    ]);
    expect(p1.getRanges({ implicit: false })).toEqual(["odta:SustainableTransportationEnumeration"]);
    expect(p1.getInverseOf("Compact")).toEqual("schema:name");
    expect(p1.isSupersededBy("Compact")).toEqual("schema:description");
    expect(p1.getSuperProperties({implicit:false})).toEqual(["schema:legalName"]);
  });

  test("new context 2", async () => {
    const sdoAdapter1 = await testSdoAdapter({
      vocabularies: [VOC_OBJ_20],
      equateVocabularyProtocols: true
    });
    const sdoAdapter2 = await testSdoAdapter({
      vocabularies: [VOC_OBJ_20_NEW],
      equateVocabularyProtocols: true
    });
    const propsList1 = sdoAdapter1.getListOfProperties()
    expect(propsList1).toEqual(sdoAdapter2.getListOfProperties());
    for(const p of propsList1){
      const p1 = sdoAdapter1.getProperty(p);
      const p2 = sdoAdapter2.getProperty(p);
      expect(p1.getName()).toEqual(p2.getName())
      expect(p1.getDescriptions()).toEqual(p2.getDescriptions())
      expect(p1.getDescription()).toEqual(p2.getDescription())
      expect(p1.getRanges()).toEqual(p2.getRanges())
      expect(p1.getDomains()).toEqual(p2.getDomains())
      expect(p1.getInverseOf()).toEqual(p2.getInverseOf())
      expect(p1.isSupersededBy()).toEqual(p2.isSupersededBy())
      expect(p1.getSuperProperties()).toEqual(p2.getSuperProperties())
      expect(p1.getSubProperties()).toEqual(p2.getSubProperties())
    }
  });
});
