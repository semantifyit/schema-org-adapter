import { isObject } from "../../src/utilities/general/isObject";
import { SDOAdapter, SOA } from "../../src";
import {
  commit,
  debugFuncErr,
  executeTestForEach,
  initializeSdoAdapterMap,
  isOrIncludesAbsoluteIRI,
  SdoAdapterMap,
  testSdoAdapter
} from "../resources/utilities/testUtilities";
import VOC_ENUM from "../resources/data/vocabularies/vocabulary-day-of-week.json";

/**
 *  Tests regarding the JS-Class for "Enumeration"
 */
describe("Enumeration tests - All schema versions", () => {
  let sdoAdapterMap: SdoAdapterMap;

  beforeAll(async () => {
    sdoAdapterMap = await initializeSdoAdapterMap();
  });

  test("constructor()", async () => {
    await executeTestForEach(sdoAdapterMap, (sdoAdapter: SDOAdapter) => {
      const dayOfWeek = sdoAdapter.getEnumeration("schema:DayOfWeek");
      expect(dayOfWeek.getTermTypeIRI()).toBe("schema:Enumeration");
      const dayOfWeekFromClass = sdoAdapter.getClass("schema:DayOfWeek");
      expect(dayOfWeekFromClass.getTermTypeIRI()).toBe("schema:Enumeration");
    });
  });

  test("getEnumeration()", async () => {
    await executeTestForEach(sdoAdapterMap, (sdoAdapter: SDOAdapter) => {
      const dayOfWeek = sdoAdapter.getEnumeration("schema:DayOfWeek");
      expect(dayOfWeek).toEqual(sdoAdapter.getEnumeration("https://schema.org/DayOfWeek"));
      expect(dayOfWeek).toEqual(sdoAdapter.getEnumeration("http://schema.org/DayOfWeek"));
      expect(dayOfWeek).toEqual(sdoAdapter.getEnumeration("DayOfWeek"));
      const ale = sdoAdapter.getEnumeration("ex:AnimalLivingEnvironment");
      expect(ale).toEqual(sdoAdapter.getEnumeration("https://example-vocab.ex/AnimalLivingEnvironment"));
      expect(ale).toEqual(sdoAdapter.getEnumeration("AnimalLivingEnvironment"));
    });
  });

  test("getTermTypeLabel()", async () => {
    await executeTestForEach(sdoAdapterMap, (sdoAdapter: SDOAdapter) => {
      const dayOfWeek = sdoAdapter.getEnumeration("schema:DayOfWeek");
      expect(dayOfWeek.getTermTypeLabel()).toBe("Enumeration");
    });
  });

  test("getTermTypeIRI()", async () => {
    await executeTestForEach(sdoAdapterMap, (sdoAdapter: SDOAdapter) => {
      const DayOfWeek = sdoAdapter.getEnumeration("schema:DayOfWeek");
      expect(DayOfWeek.getTermTypeIRI()).toBe("schema:Enumeration");
    });
  });

  test("getSource()", async () => {
    await executeTestForEach(sdoAdapterMap, (sdoAdapter: SDOAdapter) => {
      const DayOfWeek = sdoAdapter.getEnumeration("schema:DayOfWeek");
      expect(typeof DayOfWeek.getSource() === "string" || DayOfWeek.getSource() === null).toBeTruthy();
      const MedicalEnumeration = sdoAdapter.getEnumeration("schema:MedicalEnumeration");
      expect(MedicalEnumeration.getSource()).toBe(null);
    });
  });

  test("getVocabulary()", async () => {
    await executeTestForEach(sdoAdapterMap, (sdoAdapter: SDOAdapter) => {
      const DayOfWeek = sdoAdapter.getEnumeration("schema:DayOfWeek");
      expect(DayOfWeek.getVocabulary().includes("://schema.org")).toBeTruthy();
      const MedicalEnumeration = sdoAdapter.getEnumeration("schema:MedicalEnumeration");
      expect(MedicalEnumeration.getVocabulary().includes("://health-lifesci.schema.org")).toBeTruthy();
    });
  });

  test("getIRI()", async () => {
    await executeTestForEach(sdoAdapterMap, (sdoAdapter: SDOAdapter) => {
      const DayOfWeek = sdoAdapter.getEnumeration("schema:DayOfWeek");
      expect(DayOfWeek.getIRI().includes("://schema.org/DayOfWeek")).toBeTruthy();
      expect(DayOfWeek.getIRI("Compact")).toBe("schema:DayOfWeek");
      expect(DayOfWeek.getIRI()).toBe(DayOfWeek.getIRI("Absolute"));
    });
  });

  test("getName()", async () => {
    await executeTestForEach(sdoAdapterMap, (sdoAdapter: SDOAdapter) => {
      const DayOfWeek = sdoAdapter.getEnumeration("schema:DayOfWeek");
      expect(DayOfWeek.getName()).toBe("DayOfWeek");
      expect(DayOfWeek.getName("en")).toBe(DayOfWeek.getName());
      expect(DayOfWeek.getName("de")).toBe(null);
    });
  });

  test("getDescription()", async () => {
    await executeTestForEach(sdoAdapterMap, (sdoAdapter: SDOAdapter) => {
      const MedicalEnumeration = sdoAdapter.getEnumeration("schema:MedicalEnumeration");
      expect(MedicalEnumeration.getDescription()).toBe(
        "Enumerations related to health and the practice of medicine: A concept that is used to attribute a quality to another concept, as a qualifier, a collection of items or a listing of all of the elements of a set in medicine practice."
      );
      expect(MedicalEnumeration.getDescription("en")).toBe(
        "Enumerations related to health and the practice of medicine: A concept that is used to attribute a quality to another concept, as a qualifier, a collection of items or a listing of all of the elements of a set in medicine practice."
      );
      expect(MedicalEnumeration.getDescription("de")).toBe(null);
    });
  });

  test("isSupersededBy()", async () => {
    await executeTestForEach(sdoAdapterMap, (sdoAdapter: SDOAdapter) => {
      const MedicalEnumeration = sdoAdapter.getEnumeration("schema:MedicalEnumeration");
      expect(MedicalEnumeration.isSupersededBy()).toBe(null);
    });
  });

  test("getEnumerationMembers()", async () => {
    await executeTestForEach(sdoAdapterMap, (sdoAdapter: SDOAdapter) => {
      const DayOfWeek = sdoAdapter.getEnumeration("schema:DayOfWeek");
      expect(DayOfWeek.getEnumerationMembers({ implicit: true })).toContain("schema:Monday");
      expect(DayOfWeek.getEnumerationMembers()).toContain("schema:Friday");
      expect(DayOfWeek.getEnumerationMembers()).not.toContain("schema:Thing");
      expect(DayOfWeek.getEnumerationMembers().length).toBe(DayOfWeek.getEnumerationMembers({ implicit: true }).length); // DayOfWeek has no sub-Enumeration
      const MedicalEnumeration = sdoAdapter.getEnumeration("schema:MedicalEnumeration");
      expect(MedicalEnumeration.getEnumerationMembers({ implicit: false }).length).toBe(0);
      expect(MedicalEnumeration.getEnumerationMembers({ implicit: true }).length).not.toBe(0); // enumeration members of subclasses are taken into account
      expect(MedicalEnumeration.getEnumerationMembers({ implicit: false })).not.toContain("schema:Radiography");
      expect(MedicalEnumeration.getEnumerationMembers({ implicit: true })).toContain("schema:Radiography");
    });
  });

  test("getProperties()", async () => {
    await executeTestForEach(sdoAdapterMap, (sdoAdapter: SDOAdapter) => {
      const dayOfWeek = sdoAdapter.getEnumeration("schema:DayOfWeek");
      expect(dayOfWeek.getProperties()).toContain("schema:name");
      expect(dayOfWeek.getProperties({ implicit: true })).toContain("schema:name");
      expect(dayOfWeek.getProperties({ implicit: false })).not.toContain("schema:name");
      expect(dayOfWeek.getProperties({ implicit: true })).not.toContain("schema:accessModeSufficient");
      expect(dayOfWeek.getProperties({ implicit: false })).not.toContain("schema:accessModeSufficient");
    });
  });

  test("getSuperClasses()", async () => {
    await executeTestForEach(sdoAdapterMap, (sdoAdapter: SDOAdapter) => {
      const dayOfWeek = sdoAdapter.getEnumeration("schema:DayOfWeek");
      expect(dayOfWeek.getSuperClasses()).toContain("schema:Enumeration");
      expect(dayOfWeek.getSuperClasses()).toContain("schema:Intangible");
      expect(dayOfWeek.getSuperClasses()).toContain("schema:Thing");
      expect(dayOfWeek.getSuperClasses()).not.toContain("schema:Event");
      const dayOfWeekFromClass = sdoAdapter.getClass("schema:DayOfWeek");
      expect(dayOfWeekFromClass.getSuperClasses({ implicit: true })).toContain("schema:Thing");
      expect(dayOfWeekFromClass.getSuperClasses({ implicit: false })).not.toContain("schema:Thing");
    });
  });

  test("getSubClasses()", async () => {
    await executeTestForEach(sdoAdapterMap, (sdoAdapter: SDOAdapter) => {
      const paymentMethod = sdoAdapter.getEnumeration("schema:PaymentMethod");
      expect(paymentMethod.getSubClasses()).toContain("schema:PaymentCard");
      expect(paymentMethod.getSubClasses({ implicit: true })).toContain("schema:PaymentCard");
      expect(paymentMethod.getSubClasses({ implicit: false })).toContain("schema:PaymentCard");
      expect(paymentMethod.getSubClasses({ implicit: true })).toContain("schema:CreditCard");
      expect(paymentMethod.getSubClasses({ implicit: false })).not.toContain("schema:CreditCard");
    });
  });

  test("isRangeOf()", async () => {
    await executeTestForEach(sdoAdapterMap, (sdoAdapter: SDOAdapter) => {
      const paymentMethod = sdoAdapter.getEnumeration("schema:PaymentMethod");
      expect(paymentMethod.isRangeOf()).toContain("schema:paymentMethod");
      expect(paymentMethod.isRangeOf({ implicit: false })).toContain("schema:paymentMethod");
      expect(paymentMethod.isRangeOf()).toContain("schema:itemReviewed");
      expect(paymentMethod.isRangeOf({ implicit: false })).not.toContain("schema:itemReviewed");
    });
  });

  test("toString()", async () => {
    await executeTestForEach(sdoAdapterMap, (sdoAdapter: SDOAdapter) => {
      const PaymentMethod = sdoAdapter.getClass("schema:PaymentMethod");
      expect(isObject(JSON.parse(PaymentMethod.toString()))).toBe(true);
    });
  });

  test("double definition", async () => {
    // when a term is defined 2 times, it should still be an enumeration in the graph
    const url1 = await SOA.constructURLSchemaVocabulary("12.0", true, commit);
    const url2 = await SOA.constructURLSchemaVocabulary("13.0", true, commit);
    const mySA = await SOA.create({
      commit: commit,
      onError: debugFuncErr,
      vocabularies: [url1, url2]
    });
    expect(mySA.getListOfEnumerations()).toContain("schema:DayOfWeek");
    expect(mySA.getListOfClasses()).not.toContain("schema:DayOfWeek");
    const ps = mySA.getTerm("schema:DayOfWeek");
    expect(ps).not.toBe(undefined);
    const ps2 = mySA.getTerm("schema:DayOfWeek", {
      termType: "Enumeration"
    });
    expect(ps2).not.toBe(undefined);
    expect(() =>
      mySA.getTerm("schema:DayOfWeek", {
        termType: "Class"
      })
    ).toThrow();
  });

  test("retrieval options and filters", async () => {
    // only SDO
    const mySA1 = await testSdoAdapter();
    // DayOfWeek is an Enumeration, therefor it can be retrieved by getEnumeration and getClass (it is in a wider sense still a class)
    const dow1a = mySA1.getEnumeration("schema:DayOfWeek"); // should work
    const dow1b = mySA1.getClass("schema:DayOfWeek");
    expect(dow1a.toJSON()).toEqual(dow1b.toJSON());
    // for filtering, it should be perceived as Enumeration (and not as Class!)
    const dow1c = mySA1.getEnumeration("schema:DayOfWeek", {
      termType: "Enumeration"
    });
    const dow1d = mySA1.getClass("schema:DayOfWeek", {
      termType: "Enumeration"
    });
    expect(dow1c.toJSON()).toEqual(dow1d.toJSON());
    expect(() => {
      mySA1.getEnumeration("schema:DayOfWeek", {
        termType: "Class"
      });
    }).toThrow();
    expect(() => {
      mySA1.getClass("schema:DayOfWeek", {
        termType: "Class"
      });
    }).toThrow();
    // for the IRI Lists, it should be only in the list of enumerations
    const enumList1 = mySA1.getListOfEnumerations();
    expect(enumList1).toContain("schema:DayOfWeek");
    const classList1 = mySA1.getListOfClasses();
    expect(classList1).not.toContain("schema:DayOfWeek");
    expect(dow1a.getName("en")).toBe("DayOfWeek");
    expect(dow1a.getName("fr")).toBeNull();

    // SDO and additional vocabulary, which -> adds data to DayOfWeek and makes PathologyTest an enumeration
    const mySA2 = await testSdoAdapter({ vocabularies: [VOC_ENUM] });
    // DayOfWeek is an Enumeration, therefor it can be retrieved by getEnumeration and getClass (it is in a wider sense still a class)
    const dow2a = mySA2.getEnumeration("schema:DayOfWeek"); // should work
    const dow2b = mySA2.getClass("schema:DayOfWeek");
    expect(dow2a.toJSON()).toEqual(dow2b.toJSON());
    // for filtering, it should be perceived as Enumeration (and not as Class!)
    const dow2c = mySA2.getEnumeration("schema:DayOfWeek", {
      termType: "Enumeration"
    });
    const dow2d = mySA2.getClass("schema:DayOfWeek", {
      termType: "Enumeration"
    });
    expect(dow2c.toJSON()).toEqual(dow2d.toJSON());
    expect(() => {
      mySA2.getEnumeration("schema:DayOfWeek", {
        termType: "Class"
      });
    }).toThrow();
    expect(() => {
      mySA2.getClass("schema:DayOfWeek", {
        termType: "Class"
      });
    }).toThrow();
    // for the IRI Lists, it should be only in the list of enumerations
    const enumList2 = mySA2.getListOfEnumerations();
    expect(enumList2).toContain("schema:DayOfWeek");
    const classList2 = mySA2.getListOfClasses();
    expect(classList2).not.toContain("schema:DayOfWeek");
    expect(dow2a.getName("en")).toBe("DayOfWeek");
    expect(dow2a.getName("fr")).toBe("Jour de la semaine");
  });

  test("converting a class into enumeration in new vocab", async () => {
    const mySA1 = await testSdoAdapter();

    expect(() => {
      const pt1a = mySA1.getClass("schema:PathologyTest", {
        termType: "Class"
      });
      expect(pt1a.getName("en")).toBe("PathologyTest");
      expect(pt1a.getName("fr")).toBeNull();
    }).not.toThrow();
    expect(() => {
      mySA1.getClass("schema:PathologyTest", {
        termType: "Enumeration"
      });
    }).toThrow();

    const mySA2 = await testSdoAdapter({ vocabularies: [VOC_ENUM] });
    expect(() => {
      mySA2.getClass("schema:PathologyTest", {
        termType: "Class"
      });
    }).toThrow();
    expect(() => {
      const pt2b = mySA2.getClass("schema:PathologyTest", {
        termType: "Enumeration"
      });
      expect(pt2b.getName("en")).toBe("PathologyTest");
      expect(pt2b.getName("fr")).toBe("Pathologie");
    }).not.toThrow();
  });

  test("getListOfEnumerations()", async () => {
    await executeTestForEach(sdoAdapterMap, (sdoAdapter: SDOAdapter) => {
      const allEnumList = sdoAdapter.getListOfEnumerations();
      expect(allEnumList.length > 40).toBeTruthy();
      expect(allEnumList.includes("schema:Hotel")).toBeFalsy(); // should NOT contain other term types
      expect(allEnumList.includes("schema:Text")).toBeFalsy(); // should NOT contain other term types
      expect(allEnumList.includes("schema:DayOfWeek")).toBeTruthy();
      expect(isOrIncludesAbsoluteIRI(allEnumList, "schema.org/DayOfWeek")).toBe(false);
      expect(isOrIncludesAbsoluteIRI(allEnumList, "example-vocab.ex/AnimalLivingEnvironment")).toBe(false);
      const allEnumListAbsolute = sdoAdapter.getListOfEnumerations({ outputFormat: "Absolute" });
      expect(allEnumList.length).toBe(allEnumListAbsolute.length);
      expect(allEnumListAbsolute.includes("schema:DayOfWeek")).toBe(false);
      expect(allEnumListAbsolute.includes("ex:AnimalLivingEnvironment")).toBe(false);
      expect(isOrIncludesAbsoluteIRI(allEnumListAbsolute, "schema.org/DayOfWeek")).toBe(true);
      expect(isOrIncludesAbsoluteIRI(allEnumListAbsolute, "example-vocab.ex/AnimalLivingEnvironment")).toBe(true);
    });
  });

  test("getAllEnumerations()", async () => {
    await executeTestForEach(sdoAdapterMap, (sdoAdapter: SDOAdapter) => {
      const allEnumerations = sdoAdapter.getAllEnumerations();
      expect(allEnumerations.length > 40).toBeTruthy();
      for (const actEnumeration of allEnumerations) {
        expect(actEnumeration.getTermTypeIRI()).toBe("schema:Enumeration");
      }
      expect(allEnumerations.find((en) => en.getIRI("Compact") === "schema:Hotel")).toBeUndefined(); // should NOT contain other term types
      expect(allEnumerations.find((en) => en.getIRI("Compact") === "schema:DayOfWeek")).toBeDefined();
    });
  });

  test("isValidSubClassOf()", async () => {
    await executeTestForEach(sdoAdapterMap, (sdoAdapter: SDOAdapter) => {
      const dayOfWeek = sdoAdapter.getEnumeration("schema:DayOfWeek");
      expect(dayOfWeek.isValidSubClassOf("schema:DayOfWeek")).toBeFalsy(); // although true in RDF, SDO-Adapter does not consider any class a subclass of itself
      expect(dayOfWeek.isValidSubClassOf("schema:Thing")).toBeTruthy();
      expect(dayOfWeek.isValidSubClassOf("Thing", true)).toBeTruthy();
      expect(dayOfWeek.isValidSubClassOf("schema:Thing", false)).toBeFalsy();
      expect(dayOfWeek.isValidSubClassOf("schema:Enumeration", true)).toBeTruthy();
      expect(dayOfWeek.isValidSubClassOf("schema:Enumeration", false)).toBeTruthy();
    });
  });

  test("isValidSuperClassOf()", async () => {
    await executeTestForEach(sdoAdapterMap, (sdoAdapter: SDOAdapter) => {
      const paymentMethod = sdoAdapter.getEnumeration("schema:PaymentMethod");
      expect(paymentMethod.isValidSuperClassOf("schema:PaymentMethod")).toBeFalsy(); // although true in RDF, SDO-Adapter does not consider any class a subclass of itself
      expect(paymentMethod.isValidSuperClassOf("schema:CreditCard")).toBeTruthy();
      expect(paymentMethod.isValidSuperClassOf("schema:CreditCard", true)).toBeTruthy();
      expect(paymentMethod.isValidSuperClassOf("schema:CreditCard", false)).toBeFalsy();
      expect(paymentMethod.isValidSuperClassOf("schema:PaymentCard", true)).toBeTruthy();
      expect(paymentMethod.isValidSuperClassOf("schema:PaymentCard", false)).toBeTruthy();
    });
  });

  test("isValidRangeOf()", async () => {
    await executeTestForEach(sdoAdapterMap, (sdoAdapter: SDOAdapter) => {
      const dayOfWeek = sdoAdapter.getEnumeration("schema:DayOfWeek");
      expect(dayOfWeek.isValidRangeOf("schema:dayOfWeek")).toBeTruthy();
      expect(dayOfWeek.isValidRangeOf("schema:dayOfWeek", true)).toBeTruthy();
      expect(dayOfWeek.isValidRangeOf("schema:dayOfWeek", false)).toBeTruthy();
      expect(dayOfWeek.isValidRangeOf("schema:name", false)).toBeFalsy();
    });
  });

  test("isValidDomainOf()", async () => {
    await executeTestForEach(sdoAdapterMap, (sdoAdapter: SDOAdapter) => {
      const dayOfWeek = sdoAdapter.getEnumeration("schema:DayOfWeek");
      expect(dayOfWeek.isValidDomainOf("schema:name")).toBeTruthy();
      expect(dayOfWeek.isValidDomainOf("name", true)).toBeTruthy();
      expect(dayOfWeek.isValidDomainOf("schema:name", false)).toBeFalsy();
      expect(dayOfWeek.isValidDomainOf("schema:dateline")).toBeFalsy();
    });
  });

  test("isValidDomainEnumerationOf()", async () => {
    await executeTestForEach(sdoAdapterMap, (sdoAdapter: SDOAdapter) => {
      const dayOfWeek = sdoAdapter.getEnumeration("schema:DayOfWeek");
      expect(dayOfWeek.isValidDomainEnumerationOf("schema:Monday")).toBeTruthy();
      expect(dayOfWeek.isValidDomainEnumerationOf("Monday", true)).toBeTruthy();
      expect(dayOfWeek.isValidDomainEnumerationOf("schema:Monday", false)).toBeTruthy();
      expect(() => {
        dayOfWeek.isValidDomainEnumerationOf("schema:dateline");
      }).toThrow();
      expect(dayOfWeek.isValidDomainEnumerationOf("schema:EventPostponed")).toBeFalsy();

      try {
        const statusEnumeration = sdoAdapter.getEnumeration("schema:StatusEnumeration");
        expect(statusEnumeration.isValidDomainEnumerationOf("schema:EventPostponed")).toBeTruthy();
        expect(statusEnumeration.isValidDomainEnumerationOf("EventPostponed", true)).toBeTruthy();
        expect(statusEnumeration.isValidDomainEnumerationOf("schema:EventPostponed", false)).toBeFalsy();
      } catch (e) {
        // StatusEnumeration is not available in early versions -  we still test the newer versions because of the inheritance
      }
      const eventStatusType = sdoAdapter.getEnumeration("schema:EventStatusType");
      expect(eventStatusType.isValidDomainEnumerationOf("schema:EventPostponed")).toBeTruthy();
      expect(eventStatusType.isValidDomainEnumerationOf("schema:EventPostponed", true)).toBeTruthy();
      expect(eventStatusType.isValidDomainEnumerationOf("schema:EventPostponed", false)).toBeTruthy();
    });
  });
});
