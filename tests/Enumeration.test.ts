import { SDOAdapter } from "../src/SDOAdapter";
import { SOA } from "../src/index";
import { isObject } from "../src/utilities";
import { commit, debugFunc, debugFuncErr } from "./testUtility";
import VOC_ENUM from "./data/vocabulary-day-of-week.json";

/**
 *  @returns {SDOAdapter} - the initialized SDO-Adapter ready for testing.
 */
async function initAdapter(additionalVocabs = []) {
  const mySA = new SDOAdapter({
    commit: commit,
    onError: debugFuncErr,
  });
  const mySDOUrl = await mySA.constructURLSchemaVocabulary("latest");
  await mySA.addVocabularies([mySDOUrl, ...additionalVocabs]);
  return mySA;
}

/**
 *  Tests regarding the JS-Class for "Enumeration"
 */
describe("Enumeration methods", () => {
  test("constructor()", async () => {
    const mySA = await initAdapter();
    const DayOfWeek = mySA.getEnumeration("schema:DayOfWeek");
    expect(DayOfWeek.getTermTypeIRI()).toBe("schema:Enumeration");
    const DayOfWeekFromClass = mySA.getClass("schema:DayOfWeek");
    expect(DayOfWeekFromClass.getTermTypeIRI()).toBe("schema:Enumeration");
  });

  test("getTermTypeLabel()", async () => {
    const mySA = await initAdapter();
    const DayOfWeek = mySA.getEnumeration("schema:DayOfWeek");
    expect(DayOfWeek.getTermTypeLabel()).toBe("Enumeration");
  });

  test("getTermTypeIRI()", async () => {
    const mySA = await initAdapter();
    const DayOfWeek = mySA.getEnumeration("schema:DayOfWeek");
    expect(DayOfWeek.getTermTypeIRI()).toBe("schema:Enumeration");
  });

  test("getSource()", async () => {
    const mySA = await initAdapter();
    const DayOfWeek = mySA.getEnumeration("schema:DayOfWeek");
    expect(DayOfWeek.getSource()).toBe(
      "http://www.w3.org/wiki/WebSchemas/SchemaDotOrgSources#source_GoodRelationsClass"
    );
    const MedicalEnumeration = mySA.getEnumeration("schema:MedicalEnumeration");
    expect(MedicalEnumeration.getSource()).toBe(null);
  });

  test("getVocabulary()", async () => {
    const mySA = await initAdapter();
    const DayOfWeek = mySA.getEnumeration("schema:DayOfWeek");
    expect(DayOfWeek.getVocabulary()).toBe("https://schema.org");
    const MedicalEnumeration = mySA.getEnumeration("schema:MedicalEnumeration");
    expect(MedicalEnumeration.getVocabulary()).toBe(
      "https://health-lifesci.schema.org"
    );
  });

  test("getIRI()", async () => {
    const mySA = await initAdapter();
    const DayOfWeek = mySA.getEnumeration("schema:DayOfWeek");
    expect(DayOfWeek.getIRI()).toBe("https://schema.org/DayOfWeek");
    expect(DayOfWeek.getIRI(true)).toBe("schema:DayOfWeek");
    expect(DayOfWeek.getIRI()).toBe(DayOfWeek.getIRI(false));
  });

  test("getName()", async () => {
    const mySA = await initAdapter();
    const DayOfWeek = mySA.getEnumeration("schema:DayOfWeek");
    expect(DayOfWeek.getName()).toBe("DayOfWeek");
    expect(DayOfWeek.getName("en")).toBe(DayOfWeek.getName());
    expect(DayOfWeek.getName("de")).toBe(null);
  });

  test("getDescription()", async () => {
    const mySA = await initAdapter();
    const MedicalEnumeration = mySA.getEnumeration("schema:MedicalEnumeration");
    expect(MedicalEnumeration.getDescription()).toBe(
      "Enumerations related to health and the practice of medicine: A concept that is used to attribute a quality to another concept, as a qualifier, a collection of items or a listing of all of the elements of a set in medicine practice."
    );
    expect(MedicalEnumeration.getDescription("en")).toBe(
      "Enumerations related to health and the practice of medicine: A concept that is used to attribute a quality to another concept, as a qualifier, a collection of items or a listing of all of the elements of a set in medicine practice."
    );
    expect(MedicalEnumeration.getDescription("de")).toBe(null);
  });

  test("isSupersededBy()", async () => {
    const mySA = await initAdapter();
    const MedicalEnumeration = mySA.getEnumeration("schema:MedicalEnumeration");
    expect(MedicalEnumeration.isSupersededBy()).toBe(null);
  });

  test("getEnumerationMembers()", async () => {
    const mySA = await initAdapter();
    const DayOfWeek = mySA.getEnumeration("schema:DayOfWeek");
    expect(DayOfWeek.getEnumerationMembers(true)).toContain("schema:Monday");
    expect(DayOfWeek.getEnumerationMembers()).toContain("schema:Friday");
    expect(DayOfWeek.getEnumerationMembers()).not.toContain("schema:Thing");
    expect(DayOfWeek.getEnumerationMembers().length).toBe(
      DayOfWeek.getEnumerationMembers(true).length
    ); // DayOfWeek has no sub-Enumeration
    const MedicalEnumeration = mySA.getEnumeration("schema:MedicalEnumeration");
    expect(MedicalEnumeration.getEnumerationMembers(false).length).toBe(0);
    expect(MedicalEnumeration.getEnumerationMembers(true).length).not.toBe(0); // enumeration members of sub-classes are taken into account
    expect(MedicalEnumeration.getEnumerationMembers(false)).not.toContain(
      "schema:Radiography"
    );
    expect(MedicalEnumeration.getEnumerationMembers(true)).toContain(
      "schema:Radiography"
    );
  });

  test("getProperties()", async () => {
    const mySA = await initAdapter();
    const DayOfWeek = mySA.getEnumeration("schema:DayOfWeek");
    expect(DayOfWeek.getProperties()).toContain("schema:name");
    expect(DayOfWeek.getProperties(true)).toContain("schema:name");
    expect(DayOfWeek.getProperties(false)).not.toContain("schema:name");
    expect(DayOfWeek.getProperties(true)).not.toContain(
      "schema:accessModeSufficient"
    );
    expect(DayOfWeek.getProperties(false)).not.toContain(
      "schema:accessModeSufficient"
    );
  });

  test("getSuperClasses()", async () => {
    const mySA = await initAdapter();
    const DayOfWeek = mySA.getEnumeration("schema:DayOfWeek");
    expect(DayOfWeek.getSuperClasses()).toContain("schema:Enumeration");
    expect(DayOfWeek.getSuperClasses()).toContain("schema:Intangible");
    expect(DayOfWeek.getSuperClasses()).toContain("schema:Thing");
    expect(DayOfWeek.getSuperClasses()).not.toContain("schema:Event");
    const DayOfWeekFromClass = mySA.getClass("schema:DayOfWeek");
    expect(DayOfWeekFromClass.getSuperClasses(true)).toContain("schema:Thing");
    expect(DayOfWeekFromClass.getSuperClasses(false)).not.toContain(
      "schema:Thing"
    );
  });

  test("getSubClasses()", async () => {
    const mySA = await initAdapter();
    const PaymentMethod = mySA.getEnumeration("schema:PaymentMethod");
    expect(PaymentMethod.getSubClasses()).toContain("schema:PaymentCard");
    expect(PaymentMethod.getSubClasses(true)).toContain("schema:PaymentCard");
    expect(PaymentMethod.getSubClasses(false)).toContain("schema:PaymentCard");
    expect(PaymentMethod.getSubClasses(true)).toContain("schema:CreditCard");
    expect(PaymentMethod.getSubClasses(false)).not.toContain(
      "schema:CreditCard"
    );
  });

  test("isRangeOf()", async () => {
    const mySA = await initAdapter();
    const PaymentMethod = mySA.getEnumeration("schema:PaymentMethod");
    expect(PaymentMethod.isRangeOf()).toContain("schema:paymentMethod");
    expect(PaymentMethod.isRangeOf(false)).toContain("schema:paymentMethod");
    expect(PaymentMethod.isRangeOf()).toContain("schema:itemReviewed");
    expect(PaymentMethod.isRangeOf(false)).not.toContain("schema:itemReviewed");
  });

  test("toString()", async () => {
    const mySA = await initAdapter();
    const PaymentMethod = mySA.getClass("schema:PaymentMethod");
    debugFunc(PaymentMethod.toString());
    expect(isObject(JSON.parse(PaymentMethod.toString()))).toBe(true);
  });

  test("double definition", async () => {
    // when a term is defined 2 times, it should still be an enumeration in the graph
    const url1 = await SOA.constructURLSchemaVocabulary("12.0", true, commit);
    const url2 = await SOA.constructURLSchemaVocabulary("13.0", true, commit);
    const mySA = await SOA.create({
      commit: commit,
      onError: debugFuncErr,
      vocabularies: [url1, url2],
    });
    expect(mySA.getListOfEnumerations()).toContain("schema:DayOfWeek");
    expect(mySA.getListOfClasses()).not.toContain("schema:DayOfWeek");
    const ps = mySA.getTerm("schema:DayOfWeek");
    expect(ps).not.toBe(undefined);
    const ps2 = mySA.getTerm("schema:DayOfWeek", {
      termType: "Enumeration",
    });
    expect(ps2).not.toBe(undefined);
    expect(() =>
      mySA.getTerm("schema:DayOfWeek", {
        termType: "Class",
      })
    ).toThrow();
  });

  test("retrieval options and filters", async () => {
    // only SDO
    const mySA1 = await initAdapter([]);
    // DayOfWeek is an Enumeration, therefor it can be retrieved by getEnumeration and getClass (it is in a wider sense still a class)
    const dow1a = mySA1.getEnumeration("schema:DayOfWeek"); // should work
    const dow1b = mySA1.getClass("schema:DayOfWeek");
    expect(dow1a.toJSON()).toEqual(dow1b.toJSON());
    // for filtering, it should be perceived as Enumeration (and not as Class!)
    const dow1c = mySA1.getEnumeration("schema:DayOfWeek", {
      termType: "Enumeration",
    });
    const dow1d = mySA1.getClass("schema:DayOfWeek", {
      termType: "Enumeration",
    });
    expect(dow1c.toJSON()).toEqual(dow1d.toJSON());
    expect(() => {
      const dow1e = mySA1.getEnumeration("schema:DayOfWeek", {
        termType: "Class",
      });
    }).toThrow();
    expect(() => {
      const dow1f = mySA1.getClass("schema:DayOfWeek", {
        termType: "Class",
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
    const mySA2 = await initAdapter([VOC_ENUM]);
    // DayOfWeek is an Enumeration, therefor it can be retrieved by getEnumeration and getClass (it is in a wider sense still a class)
    const dow2a = mySA2.getEnumeration("schema:DayOfWeek"); // should work
    const dow2b = mySA2.getClass("schema:DayOfWeek");
    expect(dow2a.toJSON()).toEqual(dow2b.toJSON());
    // for filtering, it should be perceived as Enumeration (and not as Class!)
    const dow2c = mySA2.getEnumeration("schema:DayOfWeek", {
      termType: "Enumeration",
    });
    const dow2d = mySA2.getClass("schema:DayOfWeek", {
      termType: "Enumeration",
    });
    expect(dow2c.toJSON()).toEqual(dow2d.toJSON());
    expect(() => {
      const dow2e = mySA2.getEnumeration("schema:DayOfWeek", {
        termType: "Class",
      });
    }).toThrow();
    expect(() => {
      const dow2f = mySA2.getClass("schema:DayOfWeek", {
        termType: "Class",
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
    // when a term is defined 2 times, it should still be an enumeration in the graph
    const mySA1 = await initAdapter([]);

    expect(() => {
      const pt1a = mySA1.getClass("schema:PathologyTest", {
        termType: "Class",
      });
      expect(pt1a.getName("en")).toBe("PathologyTest");
      expect(pt1a.getName("fr")).toBeNull();
    }).not.toThrow();
    expect(() => {
      const pt1b = mySA1.getClass("schema:PathologyTest", {
        termType: "Enumeration",
      });
    }).toThrow();

    const mySA2 = await initAdapter([VOC_ENUM]);
    expect(() => {
      const pt2a = mySA2.getClass("schema:PathologyTest", {
        termType: "Class",
      });
    }).toThrow();
    expect(() => {
      const pt2b = mySA2.getClass("schema:PathologyTest", {
        termType: "Enumeration",
      });
      expect(pt2b.getName("en")).toBe("PathologyTest");
      expect(pt2b.getName("fr")).toBe("Pathologie");
    }).not.toThrow();
  });
});
