import { SDOAdapter } from "../src/SDOAdapter";
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
 *  Tests regarding the JS-Class for "EnumerationMember"
 */
describe("EnumerationMember methods", () => {
  test("getTermTypeLabel()", async () => {
    const mySA = await initAdapter();
    const Friday = mySA.getEnumerationMember("schema:Friday");
    expect(Friday.getTermTypeLabel()).toBe("EnumerationMember");
  });

  test("getTermTypeIRI()", async () => {
    const mySA = await initAdapter();
    const Friday = mySA.getEnumerationMember("schema:Friday");
    expect(Friday.getTermTypeIRI()).toBe("soa:EnumerationMember");
  });

  test("getSource()", async () => {
    const mySA = await initAdapter();
    const Friday = mySA.getEnumerationMember("schema:Friday");
    expect(Friday.getSource()).toBe(null);
  });

  test("getVocabulary()", async () => {
    const mySA = await initAdapter();
    const Friday = mySA.getEnumerationMember("schema:Friday");
    expect(Friday.getVocabulary()).toBe("https://schema.org");
    const DrivingSchoolVehicleUsage = mySA.getEnumerationMember(
      "schema:DrivingSchoolVehicleUsage"
    );
    expect(DrivingSchoolVehicleUsage.getVocabulary()).toBe(
      "https://auto.schema.org"
    );
  });

  test("getIRI()", async () => {
    const mySA = await initAdapter();
    const Friday = mySA.getEnumerationMember("schema:Friday");
    expect(Friday.getIRI()).toBe("https://schema.org/Friday");
    expect(Friday.getIRI(true)).toBe("schema:Friday");
    expect(Friday.getIRI()).toBe(Friday.getIRI(false));
  });

  test("getName()", async () => {
    const mySA = await initAdapter();
    const Friday = mySA.getEnumerationMember("schema:Friday");
    expect(Friday.getName()).toBe("Friday");
    expect(Friday.getName("en")).toBe(Friday.getName());
    expect(Friday.getName("de")).toBe(null);
  });

  test("getDescription()", async () => {
    const mySA = await initAdapter();
    const Friday = mySA.getEnumerationMember("schema:Friday");
    expect(Friday.getDescription()).toBe(
      "The day of the week between Thursday and Saturday."
    );
    expect(Friday.getDescription("en")).toBe(
      "The day of the week between Thursday and Saturday."
    );
    expect(Friday.getDescription("de")).toBe(null);
  });

  test("isSupersededBy()", async () => {
    const mySA = await initAdapter();
    const Friday = mySA.getEnumerationMember("schema:Friday");
    expect(Friday.isSupersededBy()).toBe(null);
  });

  test("getDomainEnumerations()", async () => {
    const mySA = await initAdapter();
    const Friday = mySA.getEnumerationMember("schema:Friday");
    expect(Friday.getDomainEnumerations()).toContain("schema:DayOfWeek");
    expect(Friday.getDomainEnumerations()).not.toContain("schema:Thing");
    const Radiography = mySA.getEnumerationMember("schema:Radiography");
    expect(Radiography.getDomainEnumerations()).toContain(
      "schema:MedicalImagingTechnique"
    );
    expect(Radiography.getDomainEnumerations(false)).toContain(
      "schema:MedicalSpecialty"
    );
    expect(Radiography.getDomainEnumerations(false)).not.toContain(
      "schema:MedicalEnumeration"
    );
    expect(Radiography.getDomainEnumerations(false).length).toBe(2);
    expect(Radiography.getDomainEnumerations(true).length).not.toBe(2);
    expect(Radiography.getDomainEnumerations(true)).toContain(
      "schema:MedicalEnumeration"
    );
  });

  test("toString()", async () => {
    const mySA = await initAdapter();
    const Friday = mySA.getEnumerationMember("schema:Friday");
    debugFunc(Friday.toString());
    expect(isObject(JSON.parse(Friday.toString()))).toBe(true);
  });
});
