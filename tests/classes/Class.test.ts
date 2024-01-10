import { isObject } from "../../src/utilities/general/isObject";
import {
  executeTestForEach,
  initializeSdoAdapterMap,
  isOrIncludesAbsoluteIRI,
  SdoAdapterMap
} from "../resources/utilities/testUtilities";
import { SDOAdapter } from "../../src";

/**
 *  Tests regarding the JS-Class for "Class"
 */
describe("Class tests - All schema versions", () => {
  let sdoAdapterMap: SdoAdapterMap;

  beforeAll(async () => {
    sdoAdapterMap = await initializeSdoAdapterMap();
  });

  test("getClass()", async () => {
    await executeTestForEach(sdoAdapterMap, (sdoAdapter: SDOAdapter) => {
      const hotel = sdoAdapter.getClass("schema:Hotel");
      expect(hotel).toEqual(sdoAdapter.getClass("https://schema.org/Hotel"));
      expect(hotel).toEqual(sdoAdapter.getClass("http://schema.org/Hotel"));
      expect(hotel).toEqual(sdoAdapter.getClass("Hotel"));
      const tiger = sdoAdapter.getClass("ex:Tiger");
      expect(tiger).toEqual(sdoAdapter.getClass("https://example-vocab.ex/Tiger"));
      expect(tiger).toEqual(sdoAdapter.getClass("Tiger"));
      expect(tiger).toEqual(sdoAdapter.getClass("虎"));
      expect(() => {
        sdoAdapter.getClass("ex:Hotel");
      }).toThrow();
      expect(() => {
        sdoAdapter.getClass("schema:Tiger");
      }).toThrow();
    });
  });

  test("getTermTypeLabel()", async () => {
    await executeTestForEach(sdoAdapterMap, (sdoAdapter: SDOAdapter) => {
      const hotel = sdoAdapter.getClass("schema:Hotel");
      expect(hotel.getTermTypeLabel()).toBe("Class");
    });
  });

  test("getTermTypeIRI()", async () => {
    await executeTestForEach(sdoAdapterMap, (sdoAdapter: SDOAdapter) => {
      const hotel = sdoAdapter.getClass("schema:Hotel");
      expect(hotel.getTermTypeIRI()).toBe("rdfs:Class");
    });
  });

  test("getSource()", async () => {
    await executeTestForEach(sdoAdapterMap, (sdoAdapter: SDOAdapter) => {
      const hotel = sdoAdapter.getClass("schema:Hotel");
      expect(typeof hotel.getSource() === "string" || hotel.getSource() === null).toBeTruthy();
      const hospital = sdoAdapter.getClass("schema:Hospital");
      expect(hospital.getSource()).toBe(null);
    });
  });

  test("getVocabulary()", async () => {
    await executeTestForEach(sdoAdapterMap, (sdoAdapter: SDOAdapter) => {
      const Hotel = sdoAdapter.getClass("schema:Hotel");
      expect(Hotel.getVocabulary().includes("://schema.org")).toBeTruthy(); // could be http or https
      const Class = sdoAdapter.getClass("schema:Class");
      expect(Class.getVocabulary().includes("meta.schema.org")).toBeTruthy(); // could be http or https
      const Tiger = sdoAdapter.getClass("ex:Tiger");
      expect(Tiger.getVocabulary()).toBe("https://example-vocab.ex");
    });
  });

  test("getIRI()", async () => {
    await executeTestForEach(sdoAdapterMap, (sdoAdapter: SDOAdapter) => {
      const hospital = sdoAdapter.getClass("schema:Hospital");
      expect(hospital.getIRI().includes("://schema.org/Hospital")).toBeTruthy();
      expect(hospital.getIRI("Compact")).toBe("schema:Hospital");
      expect(hospital.getIRI()).toBe(hospital.getIRI("Absolute"));
      const Tiger = sdoAdapter.getClass("ex:Tiger");
      expect(Tiger.getIRI("Absolute")).toBe("https://example-vocab.ex/Tiger");
    });
  });

  test("getName()", async () => {
    await executeTestForEach(sdoAdapterMap, (sdoAdapter: SDOAdapter) => {
      const hotel = sdoAdapter.getClass("schema:Hotel");
      expect(hotel.getName()).toBe("Hotel");
      expect(hotel.getName("en")).toBe(hotel.getName());
      expect(hotel.getName("de")).toBe(null);
    });
  });

  test("getDescription()", async () => {
    await executeTestForEach(sdoAdapterMap, (sdoAdapter: SDOAdapter) => {
      const hotel = sdoAdapter.getClass("schema:Hotel");
      expect((hotel.getDescription() as string).includes("A hotel")).toBe(true);
    });
  });

  test("isSupersededBy()", async () => {
    await executeTestForEach(sdoAdapterMap, (sdoAdapter: SDOAdapter) => {
      const UserPlays = sdoAdapter.getClass("schema:UserPlays");
      expect(UserPlays.isSupersededBy()).toBe("schema:InteractionCounter");
      expect(UserPlays.isSupersededBy("Compact")).toBe("schema:InteractionCounter");
      expect(UserPlays.isSupersededBy("Absolute").includes("://schema.org/InteractionCounter")).toBe(true);
      const Hotel = sdoAdapter.getClass("schema:Hotel");
      expect(Hotel.isSupersededBy()).toBe(null);
    });
  });

  test("getProperties()", async () => {
    await executeTestForEach(sdoAdapterMap, (sdoAdapter: SDOAdapter) => {
      const person = sdoAdapter.getClass("schema:Person");
      expect(person.getProperties()).toContain("schema:givenName");
      expect(person.getProperties({ implicit: true })).toContain("schema:givenName");
      expect(isOrIncludesAbsoluteIRI(person.getProperties({ implicit: true }), "schema.org/givenName")).toBe(false);
      expect(person.getProperties({ implicit: true, outputFormat: "Absolute" })).not.toContain("schema:givenName");
      expect(
        isOrIncludesAbsoluteIRI(
          person.getProperties({ implicit: true, outputFormat: "Absolute" }),
          "schema.org/givenName"
        )
      ).toBe(true);
      expect(person.getProperties({ implicit: false })).toContain("schema:givenName");
      expect(person.getProperties({ implicit: true })).toContain("schema:name");
      expect(person.getProperties()).toContain("schema:name");
      expect(person.getProperties({ implicit: false })).not.toContain("schema:name");
      const event = sdoAdapter.getClass("schema:Event");
      const musicEvent = sdoAdapter.getClass("schema:MusicEvent");
      const eventProps = event.getProperties({ implicit: true });
      const musicEventProps = musicEvent.getProperties({ implicit: true });
      for (const actProp of eventProps) {
        expect(musicEventProps).toContain(actProp);
      }
      const crWork = sdoAdapter.getClass("schema:CreativeWork");
      expect(crWork.getProperties({ implicit: true })).not.toContain("schema:legislationJurisdiction");
    });
  });

  test("getSuperClasses()", async () => {
    await executeTestForEach(sdoAdapterMap, (sdoAdapter: SDOAdapter) => {
      const person = sdoAdapter.getClass("schema:Person");
      expect(person.getSuperClasses()).toContain("schema:Thing");
      expect(person.getSuperClasses()).not.toContain("schema:Event");
      const hotel = sdoAdapter.getClass("schema:Hotel");
      expect(hotel.getSuperClasses({ implicit: true })).toContain("schema:Thing");
      expect(hotel.getSuperClasses({ implicit: false })).not.toContain("schema:Thing");
    });
  });

  test("getSubClasses()", async () => {
    await executeTestForEach(sdoAdapterMap, (sdoAdapter: SDOAdapter) => {
      const thing = sdoAdapter.getClass("schema:Thing");
      expect(thing.getSubClasses()).toContain("schema:Hospital");
      expect(thing.getSubClasses({ implicit: false })).not.toContain("schema:Hospital");
      const lodgingBusiness = sdoAdapter.getClass("schema:LodgingBusiness");
      expect(lodgingBusiness.getSubClasses()).toContain("schema:Hotel");
      expect(lodgingBusiness.getSubClasses()).not.toContain("schema:Thing");
    });
  });

  test("isRangeOf()", async () => {
    await executeTestForEach(sdoAdapterMap, (sdoAdapter: SDOAdapter) => {
      const thing = sdoAdapter.getClass("schema:Thing");
      expect(thing.isRangeOf()).toContain("schema:about");
      expect(thing.isRangeOf({ implicit: false })).toContain("schema:about");
      expect(thing.isRangeOf().length === thing.isRangeOf({ implicit: false }).length).toBe(true);
      const restaurant = sdoAdapter.getClass("schema:Restaurant");
      expect(restaurant.isRangeOf()).toContain("schema:about");
      expect(restaurant.isRangeOf({ implicit: false })).not.toContain("schema:about");
      const foodEstablishment = sdoAdapter.getClass("schema:FoodEstablishment");
      expect(restaurant.isRangeOf().length === foodEstablishment.isRangeOf().length).toBe(true);
    });
  });

  test("toString()", async () => {
    await executeTestForEach(sdoAdapterMap, (sdoAdapter: SDOAdapter) => {
      const thing = sdoAdapter.getClass("schema:Thing");
      expect(isObject(JSON.parse(thing.toString()))).toBe(true);
    });
  });

  test("getListOfClasses()", async () => {
    await executeTestForEach(sdoAdapterMap, (sdoAdapter: SDOAdapter) => {
      const allClassesList = sdoAdapter.getListOfClasses();
      expect(allClassesList.length > 100).toBeTruthy();
      expect(allClassesList.includes("schema:DayOfWeek")).toBeFalsy(); // should NOT contain enumerations
      expect(allClassesList.includes("schema:name")).toBeFalsy(); // should NOT contain other term types
      expect(allClassesList.includes("schema:Text")).toBeFalsy(); // should NOT contain other term types
      expect(allClassesList.includes("schema:Hotel")).toBeTruthy();
      expect(allClassesList.includes("ex:Tiger")).toBeTruthy();
      expect(isOrIncludesAbsoluteIRI(allClassesList, "schema.org/Monday")).toBe(false);
      expect(isOrIncludesAbsoluteIRI(allClassesList, "example-vocab.ex/Tiger")).toBe(false);
      const allClassesListAbsolute = sdoAdapter.getListOfClasses({ outputFormat: "Absolute" });
      expect(allClassesList.length).toBe(allClassesListAbsolute.length);
      expect(allClassesListAbsolute.includes("schema:Hotel")).toBe(false);
      expect(allClassesListAbsolute.includes("ex:Tiger")).toBe(false);
      expect(isOrIncludesAbsoluteIRI(allClassesListAbsolute, "schema.org/Hotel")).toBe(true);
      expect(isOrIncludesAbsoluteIRI(allClassesListAbsolute, "example-vocab.ex/Tiger")).toBe(true);
    });
  });

  test("getAllClasses()", async () => {
    await executeTestForEach(sdoAdapterMap, (sdoAdapter: SDOAdapter) => {
      const allClasses = sdoAdapter.getAllClasses();
      expect(allClasses.length > 100).toBeTruthy();
      const allClassesZoo = sdoAdapter.getAllClasses({ fromVocabulary: "ex" });
      expect(allClassesZoo.length).toBe(2);
      expect(allClassesZoo.find((c) => c.getIRI("Compact") === "ex:Tiger")).toBeDefined();
      const allClassesSchema = sdoAdapter.getAllClasses({
        fromVocabulary: "schema"
      });
      expect(allClassesSchema.length > 100).toBeTruthy();
      expect(allClassesSchema.find((c) => c.getIRI("Compact") === "schema:Hotel")).toBeDefined();
      expect(allClassesSchema.find((c) => c.getIRI("Compact") === "schema:DayOfWeek")).toBeUndefined(); // should NOT contain enumerations
      expect(allClassesSchema.find((c) => c.getIRI("Compact") === "schema:name")).toBeUndefined(); // should NOT contain other term types
      expect(allClassesSchema.find((c) => c.getIRI("Compact") === "schema:Text")).toBeUndefined(); // should NOT contain other term types
    });
  });

  test("isValidSubClassOf()", async () => {
    await executeTestForEach(sdoAdapterMap, (sdoAdapter: SDOAdapter) => {
      const hotel = sdoAdapter.getClass("schema:Hotel");
      expect(hotel.isValidSubClassOf("schema:Hotel")).toBeFalsy(); // although true in RDF, SDO-Adapter does not consider any class a subclass of itself
      expect(hotel.isValidSubClassOf("schema:Thing")).toBeTruthy();
      expect(hotel.isValidSubClassOf("schema:Thing", true)).toBeTruthy();
      expect(hotel.isValidSubClassOf("schema:Thing", false)).toBeFalsy();
      expect(hotel.isValidSubClassOf("schema:LodgingBusiness", true)).toBeTruthy();
      expect(hotel.isValidSubClassOf("schema:LodgingBusiness", false)).toBeTruthy();
      expect(hotel.isValidSubClassOf("schema:DayOfWeek")).toBeFalsy();
    });
  });

  test("isValidSuperClassOf()", async () => {
    await executeTestForEach(sdoAdapterMap, (sdoAdapter: SDOAdapter) => {
      const thing = sdoAdapter.getClass("schema:Thing");
      expect(thing.isValidSuperClassOf("schema:Thing")).toBeFalsy(); // although true in RDF, SDO-Adapter does not consider any class a subclass of itself
      expect(thing.isValidSuperClassOf("schema:LocalBusiness")).toBeTruthy();
      expect(thing.isValidSuperClassOf("schema:LocalBusiness", true)).toBeTruthy();
      expect(thing.isValidSuperClassOf("schema:LocalBusiness", false)).toBeFalsy();
      expect(thing.isValidSuperClassOf("schema:Place", true)).toBeTruthy();
      expect(thing.isValidSuperClassOf("schema:Place", false)).toBeTruthy();
      expect(thing.isValidSuperClassOf("schema:DataType")).toBeFalsy();
    });
  });

  test("isValidRangeOf()", async () => {
    await executeTestForEach(sdoAdapterMap, (sdoAdapter: SDOAdapter) => {
      const mediaObject = sdoAdapter.getClass("schema:MediaObject");
      expect(mediaObject.isValidRangeOf("schema:license")).toBeTruthy();
      expect(mediaObject.isValidRangeOf("license", true)).toBeTruthy();
      expect(mediaObject.isValidRangeOf("schema:license", false)).toBeFalsy();
      expect(mediaObject.isValidRangeOf("schema:associatedMedia", true)).toBeTruthy();
      expect(mediaObject.isValidRangeOf("schema:associatedMedia", false)).toBeTruthy();
      expect(() => {
        mediaObject.isValidRangeOf("blubliblah", false);
      }).toThrow();
    });
  });

  test("isValidDomainOf()", async () => {
    await executeTestForEach(sdoAdapterMap, (sdoAdapter: SDOAdapter) => {
      const newsArticle = sdoAdapter.getClass("schema:NewsArticle");
      expect(newsArticle.isValidDomainOf("schema:name")).toBeTruthy();
      expect(newsArticle.isValidDomainOf("schema:name", true)).toBeTruthy();
      expect(newsArticle.isValidDomainOf("schema:name", false)).toBeFalsy();
      expect(newsArticle.isValidDomainOf("schema:dateline", true)).toBeTruthy();
      expect(newsArticle.isValidDomainOf("schema:dateline", false)).toBeTruthy();
    });
  });
});
