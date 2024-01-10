import { SDOAdapter } from "../../src";
import { isObject } from "../../src/utilities/general/isObject";
import {
  executeTestForEach,
  initializeSdoAdapterMap,
  isOrIncludesAbsoluteIRI,
  SdoAdapterMap
} from "../resources/utilities/testUtilities";

/**
 *  Tests regarding the JS-Class for "Property"
 */
describe("Property tests - All schema versions", () => {
  let sdoAdapterMap: SdoAdapterMap;

  beforeAll(async () => {
    sdoAdapterMap = await initializeSdoAdapterMap();
  });

  test("getProperty()", async () => {
    await executeTestForEach(sdoAdapterMap, (sdoAdapter: SDOAdapter) => {
      const name = sdoAdapter.getProperty("schema:name");
      expect(name).toEqual(sdoAdapter.getProperty("https://schema.org/name"));
      expect(name).toEqual(sdoAdapter.getProperty("http://schema.org/name"));
      expect(name).toEqual(sdoAdapter.getProperty("name"));
      const numberOfLegs = sdoAdapter.getProperty("ex:numberOfLegs");
      expect(numberOfLegs).toEqual(sdoAdapter.getProperty("https://example-vocab.ex/numberOfLegs"));
      expect(numberOfLegs).toEqual(sdoAdapter.getProperty("numberOfLegs"));
    });
  });

  test("getTermTypeLabel()", async () => {
    await executeTestForEach(sdoAdapterMap, (sdoAdapter: SDOAdapter) => {
      const address = sdoAdapter.getProperty("schema:address");
      expect(address.getTermTypeLabel()).toBe("Property");
    });
  });

  test("getTermTypeIRI()", async () => {
    await executeTestForEach(sdoAdapterMap, (sdoAdapter: SDOAdapter) => {
      const address = sdoAdapter.getProperty("schema:address");
      expect(address.getTermTypeIRI()).toBe("rdf:Property");
    });
  });

  test("getSource()", async () => {
    await executeTestForEach(sdoAdapterMap, (sdoAdapter: SDOAdapter) => {
      const accelerationTime = sdoAdapter.getProperty("schema:accelerationTime");
      expect(typeof accelerationTime.getSource() === "string" || accelerationTime.getSource() === null).toBeTruthy();
      const startLocation = sdoAdapter.getProperty("ex:animalLivingEnvironment");
      expect(startLocation.getSource()).toBe(null);
    });
  });

  test("getVocabulary()", async () => {
    await executeTestForEach(sdoAdapterMap, (sdoAdapter: SDOAdapter) => {
      const address = sdoAdapter.getProperty("schema:address");
      expect(address.getVocabulary().includes("://schema.org")).toBeTruthy();
      const accelerationTime = sdoAdapter.getProperty("schema:accelerationTime");
      expect(accelerationTime.getVocabulary().includes("://auto.schema.org")).toBeTruthy();
      const startLocation = sdoAdapter.getProperty("ex:animalLivingEnvironment");
      expect(startLocation.getVocabulary()).toBe("https://example-vocab.ex");
    });
  });

  test("getIRI()", async () => {
    await executeTestForEach(sdoAdapterMap, (sdoAdapter: SDOAdapter) => {
      const address = sdoAdapter.getProperty("schema:address");
      expect(address.getIRI().includes("://schema.org/address")).toBeTruthy();
      expect(address.getIRI("Compact")).toBe("schema:address");
      expect(address.getIRI()).toBe(address.getIRI("Absolute"));
      const startLocation = sdoAdapter.getProperty("ex:animalLivingEnvironment");
      expect(startLocation.getIRI("Absolute")).toBe("https://example-vocab.ex/animalLivingEnvironment");
    });
  });

  test("getName()", async () => {
    await executeTestForEach(sdoAdapterMap, (sdoAdapter: SDOAdapter) => {
      const address = sdoAdapter.getProperty("schema:address");
      expect(address.getName()).toBe("address");
      expect(address.getName("en")).toBe(address.getName());
      expect(address.getName("es")).toBe(null);
    });
  });

  test("getDescription()", async () => {
    await executeTestForEach(sdoAdapterMap, (sdoAdapter: SDOAdapter) => {
      const address = sdoAdapter.getProperty("schema:address");
      expect(address.getDescription()).toBe("Physical address of the item.");
      expect(address.getDescription("en")).toBe("Physical address of the item.");
      expect(address.getDescription("de")).toBe(null);
    });
  });

  test("isSupersededBy()", async () => {
    await executeTestForEach(sdoAdapterMap, (sdoAdapter: SDOAdapter) => {
      const serviceAudience = sdoAdapter.getProperty("schema:serviceAudience");
      expect(serviceAudience.isSupersededBy()).toBe("schema:audience");
      expect(isOrIncludesAbsoluteIRI(serviceAudience.isSupersededBy("Absolute"), "schema.org/audience")).toBe(true);
      const address = sdoAdapter.getProperty("schema:address");
      expect(address.isSupersededBy()).toBe(null);
      expect(address.isSupersededBy("Absolute")).toBe(null);
    });
  });

  test("getRanges()", async () => {
    await executeTestForEach(sdoAdapterMap, (sdoAdapter: SDOAdapter) => {
      const serviceAudience = sdoAdapter.getProperty("schema:serviceAudience");
      expect(serviceAudience.getRanges()).toContain("schema:Audience");
      expect(serviceAudience.getRanges({ implicit: true })).toContain("schema:Audience");
      expect(serviceAudience.getRanges({ implicit: false })).toContain("schema:Audience");
      expect(serviceAudience.getRanges({ implicit: true })).toContain("schema:EducationalAudience");
      expect(serviceAudience.getRanges()).toContain("schema:EducationalAudience");
      expect(serviceAudience.getRanges({ implicit: false })).not.toContain("schema:EducationalAudience");
      const startLocation = sdoAdapter.getProperty("ex:animalLivingEnvironment");
      expect(startLocation.getRanges({ implicit: true })).toContain("schema:Text");
      expect(startLocation.getRanges({ implicit: true })).toContain("ex:AnimalLivingEnvironment");
      expect(
        startLocation.getRanges({
          implicit: true,
          filter: {
            fromVocabulary: "ex"
          }
        })
      ).not.toContain("schema:Text");
      const elevation = sdoAdapter.getProperty("schema:elevation");
      expect(elevation.getRanges({ implicit: true })).toContain("schema:Number");
      expect(elevation.getRanges({ implicit: false })).toContain("schema:Number");
      expect(elevation.getRanges({ implicit: true })).toContain("schema:Text");
      expect(elevation.getRanges({ implicit: false })).toContain("schema:Text");
      expect(elevation.getRanges({ implicit: true })).toContain("schema:Integer");
      expect(elevation.getRanges({ implicit: false })).not.toContain("schema:Integer");
      expect(elevation.getRanges({ implicit: true })).toContain("schema:URL");
      expect(elevation.getRanges({ implicit: false })).not.toContain("schema:URL");
    });
  });

  test("getDomains()", async () => {
    await executeTestForEach(sdoAdapterMap, (sdoAdapter: SDOAdapter) => {
      const serviceAudience = sdoAdapter.getProperty("schema:serviceAudience");
      expect(serviceAudience.getDomains()).toContain("schema:Service");
      expect(serviceAudience.getDomains({ implicit: true })).toContain("schema:Service");
      expect(serviceAudience.getDomains({ implicit: false })).toContain("schema:Service");
      expect(serviceAudience.getDomains({ implicit: true })).toContain("schema:FoodService");
      expect(serviceAudience.getDomains({ implicit: false })).not.toContain("schema:FoodService");
      const startLocation = sdoAdapter.getProperty("ex:animalLivingEnvironment");
      expect(startLocation.getDomains({ implicit: true })).toContain("ex:Tiger");
      expect(startLocation.getDomains({ implicit: false })).not.toContain("ex:Tiger");
      expect(
        startLocation.getDomains({
          implicit: true,
          filter: {
            fromVocabulary: "ex"
          }
        })
      ).toContain("ex:Tiger");
    });
  });

  test("getSuperProperties()", async () => {
    await executeTestForEach(sdoAdapterMap, (sdoAdapter: SDOAdapter) => {
      const startLocation = sdoAdapter.getProperty("schema:vendor");
      expect(startLocation.getSuperProperties()).toContain("schema:participant");
      expect(startLocation.getSuperProperties()).not.toContain("schema:address");
    });
  });

  test("getSubProperties()", async () => {
    await executeTestForEach(sdoAdapterMap, (sdoAdapter: SDOAdapter) => {
      const workFeatured = sdoAdapter.getProperty("schema:workFeatured");
      expect(workFeatured.getSubProperties()).toContain("schema:workPresented");
      expect(workFeatured.getSubProperties().length).toBe(2);
      expect(workFeatured.getSubProperties()).not.toContain("schema:location");
      const address = sdoAdapter.getProperty("schema:address");
      expect(address.getSubProperties().length).toBe(0);
    });
  });

  test("getInverseOf()", async () => {
    await executeTestForEach(sdoAdapterMap, (sdoAdapter: SDOAdapter) => {
      const subOrganization = sdoAdapter.getProperty("schema:subOrganization");
      expect(subOrganization.getInverseOf()).toBe("schema:parentOrganization");
      expect(isOrIncludesAbsoluteIRI(subOrganization.getInverseOf("Absolute"), "schema.org/parentOrganization")).toBe(
        true
      );
      const name = sdoAdapter.getProperty("schema:name");
      expect(name.getInverseOf()).toBe(null);
      expect(name.getInverseOf("Absolute")).toBe(null);
    });
  });

  test("getInverseOf() - Bijection", async () => {
    await executeTestForEach(sdoAdapterMap, (sdoAdapter: SDOAdapter) => {
      const allProperties = sdoAdapter.getAllProperties();
      for (const actProp of allProperties) {
        const thisInverse = actProp.getInverseOf();
        if (thisInverse) {
          const inverseProp = sdoAdapter.getProperty(thisInverse);
          // eslint-disable-next-line jest/no-conditional-expect
          expect(inverseProp).toBeDefined();
          // Basically a cool test to check bijection, but there are early versions of schema.org that don't hold this assumption
          // const thisProp = actProp.getIRI(true);
          // const inversePropInverse = inverseProp.getInverseOf();
          // debugFunc(
          //   thisProp + " -> " + thisInverse + " -> " + inversePropInverse
          // );
          // // eslint-disable-next-line jest/no-conditional-expect
          // expect(inversePropInverse).toBe(thisProp);
        }
      }
    });
  });

  test("toString()", async () => {
    await executeTestForEach(sdoAdapterMap, (sdoAdapter: SDOAdapter) => {
      const subOrganization = sdoAdapter.getProperty("schema:subOrganization");
      expect(isObject(JSON.parse(subOrganization.toString()))).toBe(true);
      const name = sdoAdapter.getProperty("schema:name");
      expect(isObject(JSON.parse(name.toString()))).toBe(true);
    });
  });

  test("toString() - source", async () => {
    await executeTestForEach(sdoAdapterMap, (sdoAdapter: SDOAdapter) => {
      // no source
      const subOrganization = sdoAdapter.getProperty("schema:subOrganization");
      expect(JSON.parse(subOrganization.toString()).source).toBe(null);
      // dc terms source
      const availableDeliveryMethod = sdoAdapter.getProperty("schema:availableDeliveryMethod");
      // dcterms has been removed as a source at some point, only schema:sources seem to be left
      const source = JSON.parse(availableDeliveryMethod.toString()).source;
      expect(
        source === "http://www.w3.org/wiki/WebSchemas/SchemaDotOrgSources#source_GoodRelationsTerms" || source === null
      ).toBeTruthy();
      // schema source
      const weight = sdoAdapter.getProperty("schema:weight");
      const weightSource = JSON.parse(weight.toString()).source;
      expect(typeof weightSource === "string" || weightSource === null).toBeTruthy();
    });
  });

  test("getListOfProperties()", async () => {
    await executeTestForEach(sdoAdapterMap, (sdoAdapter: SDOAdapter) => {
      const allPropertiesList = sdoAdapter.getListOfProperties();
      expect(allPropertiesList.length > 300).toBeTruthy();
      expect(allPropertiesList.includes("schema:Hotel")).toBeFalsy(); // should NOT contain other term types
      expect(allPropertiesList.includes("schema:Text")).toBeFalsy(); // should NOT contain other term types
      expect(allPropertiesList.includes("schema:name")).toBeTruthy();
      expect(allPropertiesList.includes("ex:numberOfLegs")).toBeTruthy();
      expect(isOrIncludesAbsoluteIRI(allPropertiesList, "schema.org/name")).toBe(false);
      expect(isOrIncludesAbsoluteIRI(allPropertiesList, "example-vocab.ex/numberOfLegs")).toBe(false);
      const allPropertiesListAbsolute = sdoAdapter.getListOfProperties({ outputFormat: "Absolute" });
      expect(allPropertiesList.length).toBe(allPropertiesListAbsolute.length);
      expect(allPropertiesListAbsolute.includes("schema:name")).toBe(false);
      expect(allPropertiesListAbsolute.includes("ex:numberOfLegs")).toBe(false);
      expect(isOrIncludesAbsoluteIRI(allPropertiesListAbsolute, "schema.org/name")).toBe(true);
      expect(isOrIncludesAbsoluteIRI(allPropertiesListAbsolute, "example-vocab.ex/numberOfLegs")).toBe(true);
    });
  });

  test("getAllProperties()", async () => {
    await executeTestForEach(sdoAdapterMap, (sdoAdapter: SDOAdapter) => {
      const allProperties = sdoAdapter.getAllProperties();
      expect(allProperties.length > 300).toBeTruthy();
      const allPropertiesEx = sdoAdapter.getAllProperties({
        fromVocabulary: "ex"
      });
      expect(allPropertiesEx.length).toBe(2);
      expect(allPropertiesEx.find((p) => p.getIRI("Compact") === "ex:numberOfLegs")).toBeDefined();
      const allPropertiesSchema = sdoAdapter.getAllProperties({
        fromVocabulary: "schema"
      });
      expect(allPropertiesSchema.length > 300).toBeTruthy();
      for (const actProperty of allProperties) {
        expect(actProperty.getTermTypeIRI()).toBe("rdf:Property");
      }
      expect(allPropertiesSchema.find((p) => p.getIRI("Compact") === "schema:name")).toBeDefined();
      expect(allPropertiesSchema.find((p) => p.getIRI("Compact") === "schema:DayOfWeek")).toBeUndefined(); // should NOT contain other term types
      expect(allPropertiesSchema.find((p) => p.getIRI("Compact") === "schema:Hotel")).toBeUndefined(); // should NOT contain other term types
      expect(allPropertiesSchema.find((p) => p.getIRI("Compact") === "schema:Text")).toBeUndefined(); // should NOT contain other term types
    });
  });

  test("isValidDomain()", async () => {
    await executeTestForEach(sdoAdapterMap, (sdoAdapter: SDOAdapter) => {
      const startDate = sdoAdapter.getProperty("schema:startDate");
      expect(startDate.isValidDomain("schema:ComedyEvent")).toBeTruthy();
      expect(startDate.isValidDomain("schema:ComedyEvent", true)).toBeTruthy();
      expect(startDate.isValidDomain("schema:ComedyEvent", false)).toBeFalsy();
      expect(startDate.isValidDomain("schema:Event", true)).toBeTruthy();
      expect(startDate.isValidDomain("schema:Event", false)).toBeTruthy();
      expect(startDate.isValidDomain("schema:Place")).toBeFalsy();
    });
  });

  test("isValidRange()", async () => {
    await executeTestForEach(sdoAdapterMap, (sdoAdapter: SDOAdapter) => {
      const inLanguage = sdoAdapter.getProperty("schema:inLanguage");
      expect(inLanguage.isValidRange("schema:Text")).toBeTruthy();
      expect(inLanguage.isValidRange("schema:Text", true)).toBeTruthy();
      expect(inLanguage.isValidRange("schema:URL", false)).toBeFalsy();
      expect(inLanguage.isValidRange("schema:Language", true)).toBeTruthy();
      expect(inLanguage.isValidRange("schema:Language", false)).toBeTruthy();
      expect(inLanguage.isValidRange("schema:Date")).toBeFalsy();
    });
  });

  test("isValidSuperPropertyOf()", async () => {
    await executeTestForEach(sdoAdapterMap, (sdoAdapter: SDOAdapter) => {
      const hasPart = sdoAdapter.getProperty("schema:hasPart");
      expect(hasPart.isValidSuperPropertyOf("schema:season")).toBeTruthy();
      expect(hasPart.isValidSuperPropertyOf("schema:season", true)).toBeTruthy();
      expect(hasPart.isValidSuperPropertyOf("schema:season", false)).toBeTruthy();
      expect(() => {
        hasPart.isValidSuperPropertyOf("schema:Text");
      }).toThrow();
    });
  });

  test("isValidSubPropertyOf()", async () => {
    await executeTestForEach(sdoAdapterMap, (sdoAdapter: SDOAdapter) => {
      const season = sdoAdapter.getProperty("schema:season");
      expect(season.isValidSubPropertyOf("schema:hasPart")).toBeTruthy();
      expect(season.isValidSubPropertyOf("schema:hasPart", true)).toBeTruthy();
      expect(season.isValidSubPropertyOf("schema:hasPart", false)).toBeTruthy();
      expect(() => {
        season.isValidSubPropertyOf("schema:Text");
      }).toThrow();
    });
  });

  test("isValidInverseOf()", async () => {
    await executeTestForEach(sdoAdapterMap, (sdoAdapter: SDOAdapter) => {
      expect(sdoAdapter.getProperty("schema:member").isValidInverseOf("schema:memberOf")).toBeTruthy();
      expect(sdoAdapter.getProperty("schema:memberOf").isValidInverseOf("schema:member")).toBeTruthy();
      expect(sdoAdapter.getProperty("schema:name").isValidInverseOf("schema:about")).toBeFalsy();
    });
  });
});
