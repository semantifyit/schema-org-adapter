import { isObject } from "../../src/utilities/general/isObject";
import {
  executeTestForEach,
  initializeSdoAdapterMap,
  isOrIncludesAbsoluteIRI,
  SdoAdapterMap
} from "../resources/utilities/testUtilities";
import { SDOAdapter } from "../../src";

/**
 *  Tests regarding the JS-Class for "EnumerationMember"
 */
describe("EnumerationMember tests - All schema versions", () => {
  let sdoAdapterMap: SdoAdapterMap;

  beforeAll(async () => {
    sdoAdapterMap = await initializeSdoAdapterMap();
  });

  test("getEnumerationMember()", async () => {
    await executeTestForEach(sdoAdapterMap, (sdoAdapter: SDOAdapter) => {
      const friday = sdoAdapter.getEnumerationMember("schema:Friday");
      expect(friday).toEqual(sdoAdapter.getEnumerationMember("https://schema.org/Friday"));
      expect(friday).toEqual(sdoAdapter.getEnumerationMember("http://schema.org/Friday"));
      expect(friday).toEqual(sdoAdapter.getEnumerationMember("Friday"));
      const zoo = sdoAdapter.getEnumerationMember("ex:AnimalLivingEnvironmentZoo");
      expect(zoo).toEqual(sdoAdapter.getEnumerationMember("https://example-vocab.ex/AnimalLivingEnvironmentZoo"));
      expect(zoo).toEqual(sdoAdapter.getEnumerationMember("AnimalLivingEnvironmentZoo"));
    });
  });

  test("getTermTypeLabel()", async () => {
    await executeTestForEach(sdoAdapterMap, (sdoAdapter: SDOAdapter) => {
      const friday = sdoAdapter.getEnumerationMember("schema:Friday");
      expect(friday.getTermTypeLabel()).toBe("EnumerationMember");
    });
  });

  test("getTermTypeIRI()", async () => {
    await executeTestForEach(sdoAdapterMap, (sdoAdapter: SDOAdapter) => {
      const friday = sdoAdapter.getEnumerationMember("schema:Friday");
      expect(friday.getTermTypeIRI()).toBe("soa:EnumerationMember");
    });
  });

  test("getSource()", async () => {
    await executeTestForEach(sdoAdapterMap, (sdoAdapter: SDOAdapter) => {
      const friday = sdoAdapter.getEnumerationMember("schema:Friday");
      expect(friday.getSource()).toBe(null);
    });
  });

  test("getVocabulary()", async () => {
    await executeTestForEach(sdoAdapterMap, (mySA: SDOAdapter) => {
      const friday = mySA.getEnumerationMember("schema:Friday");
      expect(friday.getVocabulary().includes("://schema.org")).toBeTruthy();
      const drivingSchoolVehicleUsage = mySA.getEnumerationMember("schema:DrivingSchoolVehicleUsage");
      expect(drivingSchoolVehicleUsage.getVocabulary().includes("://auto.schema.org")).toBeTruthy();
    });
  });

  test("getIRI()", async () => {
    await executeTestForEach(sdoAdapterMap, (sdoAdapter: SDOAdapter) => {
      const friday = sdoAdapter.getEnumerationMember("schema:Friday");
      expect(friday.getIRI().includes("://schema.org/Friday")).toBeTruthy();
      expect(friday.getIRI("Compact")).toBe("schema:Friday");
      expect(friday.getIRI()).toBe(friday.getIRI("Absolute"));
    });
  });

  test("getName()", async () => {
    await executeTestForEach(sdoAdapterMap, (sdoAdapter: SDOAdapter) => {
      const friday = sdoAdapter.getEnumerationMember("schema:Friday");
      expect(friday.getName()).toBe("Friday");
      expect(friday.getName("en")).toBe(friday.getName());
      expect(friday.getName("de")).toBe(null);
    });
  });

  test("getDescription()", async () => {
    await executeTestForEach(sdoAdapterMap, (sdoAdapter: SDOAdapter) => {
      const friday = sdoAdapter.getEnumerationMember("schema:Friday");
      expect(friday.getDescription()).toBe("The day of the week between Thursday and Saturday.");
      expect(friday.getDescription("en")).toBe("The day of the week between Thursday and Saturday.");
      expect(friday.getDescription("de")).toBe(null);
    });
  });

  test("isSupersededBy()", async () => {
    await executeTestForEach(sdoAdapterMap, (sdoAdapter: SDOAdapter) => {
      const friday = sdoAdapter.getEnumerationMember("schema:Friday");
      expect(friday.isSupersededBy()).toBe(null);
    });
  });

  test("getDomainEnumerations()", async () => {
    await executeTestForEach(sdoAdapterMap, (sdoAdapter: SDOAdapter) => {
      const friday = sdoAdapter.getEnumerationMember("schema:Friday");
      expect(friday.getDomainEnumerations()).toContain("schema:DayOfWeek");
      expect(friday.getDomainEnumerations()).not.toContain("schema:Thing");
      const radiography = sdoAdapter.getEnumerationMember("schema:Radiography");
      expect(radiography.getDomainEnumerations()).toContain("schema:MedicalImagingTechnique");
      expect(radiography.getDomainEnumerations({ implicit: false })).toContain("schema:MedicalSpecialty");
      expect(radiography.getDomainEnumerations({ implicit: false })).not.toContain("schema:MedicalEnumeration");
      expect(radiography.getDomainEnumerations({ implicit: false }).length).toBe(2);
      expect(radiography.getDomainEnumerations({ implicit: true }).length).not.toBe(2);
      expect(radiography.getDomainEnumerations({ implicit: true })).toContain("schema:MedicalEnumeration");
    });
  });

  test("toString()", async () => {
    await executeTestForEach(sdoAdapterMap, (sdoAdapter: SDOAdapter) => {
      const friday = sdoAdapter.getEnumerationMember("schema:Friday");
      expect(isObject(JSON.parse(friday.toString()))).toBe(true);
    });
  });

  test("getListOfEnumerationMembers()", async () => {
    await executeTestForEach(sdoAdapterMap, (sdoAdapter: SDOAdapter) => {
      const allEnumList = sdoAdapter.getListOfEnumerationMembers();
      expect(allEnumList.length > 200).toBeTruthy();
      expect(allEnumList.includes("schema:Hotel")).toBeFalsy(); // should NOT contain other term types
      expect(allEnumList.includes("schema:Text")).toBeFalsy(); // should NOT contain other term types
      expect(allEnumList.includes("schema:DayOfWeek")).toBeFalsy(); // should NOT contain other term types
      expect(allEnumList.includes("schema:Monday")).toBeTruthy();
      expect(isOrIncludesAbsoluteIRI(allEnumList, "schema.org/Monday")).toBe(false);
      expect(isOrIncludesAbsoluteIRI(allEnumList, "example-vocab.ex/AnimalLivingEnvironmentFreedom")).toBe(false);
      const allEnumListAbsolute = sdoAdapter.getListOfEnumerationMembers({ outputFormat: "Absolute" });
      expect(allEnumList.length).toBe(allEnumListAbsolute.length);
      expect(allEnumListAbsolute.includes("schema:Monday")).toBe(false);
      expect(allEnumListAbsolute.includes("ex:AnimalLivingEnvironmentFreedom")).toBe(false);
      expect(isOrIncludesAbsoluteIRI(allEnumListAbsolute, "schema.org/Monday")).toBe(true);
      expect(isOrIncludesAbsoluteIRI(allEnumListAbsolute, "example-vocab.ex/AnimalLivingEnvironmentFreedom")).toBe(
        true
      );
    });
  });

  test("getAllEnumerationMembers()", async () => {
    await executeTestForEach(sdoAdapterMap, (sdoAdapter: SDOAdapter) => {
      const allEnumerationMembers = sdoAdapter.getAllEnumerationMembers();
      expect(allEnumerationMembers.length > 200).toBe(true);
      for (const actEnumerationMember of allEnumerationMembers) {
        expect(actEnumerationMember.getTermTypeIRI()).toBe("soa:EnumerationMember");
      }
      expect(allEnumerationMembers.find((em) => em.getIRI("Compact") === "schema:DayOfWeek")).toBeUndefined(); // should NOT contain other term types
      expect(allEnumerationMembers.find((em) => em.getIRI("Compact") === "schema:Monday")).toBeDefined();
    });
  });

  test("isValidEnumerationMemberOf()", async () => {
    await executeTestForEach(sdoAdapterMap, (sdoAdapter: SDOAdapter) => {
      const mondayEM = sdoAdapter.getEnumerationMember("schema:Monday");
      expect(mondayEM.isValidEnumerationMemberOf("schema:DayOfWeek")).toBeTruthy();
      expect(mondayEM.isValidEnumerationMemberOf("DayOfWeek", true)).toBeTruthy();
      expect(mondayEM.isValidEnumerationMemberOf("schema:DayOfWeek", false)).toBeTruthy();
      expect(() => {
        mondayEM.isValidEnumerationMemberOf("schema:dateline");
      }).toThrow();
      expect(() => {
        mondayEM.isValidEnumerationMemberOf("schema:Thing");
      }).toThrow();

      const eventPostponedEM = sdoAdapter.getEnumerationMember("schema:EventPostponed");
      expect(eventPostponedEM.isValidEnumerationMemberOf("schema:EventStatusType")).toBeTruthy();
      expect(eventPostponedEM.isValidEnumerationMemberOf("EventStatusType", true)).toBeTruthy();
      expect(eventPostponedEM.isValidEnumerationMemberOf("schema:EventStatusType", false)).toBeTruthy();
    });
  });
});
