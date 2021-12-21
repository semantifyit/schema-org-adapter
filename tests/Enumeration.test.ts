import { SDOAdapter } from "../src/SDOAdapter";
import { SOA } from "../src/index";
import { isObject } from "../src/utilities";
import { commit, debugFunc, debugFuncErr } from "./testUtility";

/**
 *  @returns {SDOAdapter} - the initialized SDO-Adapter ready for testing.
 */
async function initAdapter() {
  const mySA = new SDOAdapter({
    commit: commit,
    onError: debugFuncErr,
  });
  const mySDOUrl = await mySA.constructURLSchemaVocabulary("latest");
  await mySA.addVocabularies([mySDOUrl]);
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
});
