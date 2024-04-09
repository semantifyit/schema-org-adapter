import {
  executeTestForEach,
  initializeSdoAdapterMap,
  isOrIncludesAbsoluteIRI,
  SdoAdapterMap
} from "../resources/utilities/testUtilities";
import { SDOAdapter } from "../../src";
import { SchemaModuleNamespaceMap } from "../../src/data/schemaModules";

/**
 *  Tests regarding the JS-Class for "Term"
 */
describe("Term tests - All schema versions", () => {
  let sdoAdapterMap: SdoAdapterMap;

  beforeAll(async () => {
    sdoAdapterMap = await initializeSdoAdapterMap();
  });

  test("schema modules", async () => {
    // checks the vocabulary of all terms and if they are in line with the expected values we have for schema modules (in the const SchemaModuleNamespaceMap)
    const vocabListGlobal = [];
    // from a schema module, or from the example external vocabulary
    const expectedModuleNamespaces = ["//example-vocab.ex", ...Object.values(SchemaModuleNamespaceMap)];
    await executeTestForEach(sdoAdapterMap, (sdoAdapter: SDOAdapter) => {
      const vocabListLocal = [];
      const terms = sdoAdapter.getAllTerms();
      for (const t of terms) {
        const vocab = t.getVocabulary();
        if (!vocabListGlobal.includes(vocab)) {
          vocabListGlobal.push(vocab);
        }
        if (!vocabListLocal.includes(vocab)) {
          vocabListLocal.push(vocab);
        }
      }
      // check if all vocabularies are as expected
      for (const v of vocabListLocal) {
        expect(expectedModuleNamespaces.find((el) => v.includes(el))).toBeTruthy();
      }
    });
    // console.log(vocabListGlobal);
  });

  test("getTerm()", async () => {
    await executeTestForEach(sdoAdapterMap, (sdoAdapter: SDOAdapter) => {
      const hospital = sdoAdapter.getClass("schema:Hospital");
      expect(hospital).toEqual(sdoAdapter.getTerm("schema:Hospital"));
      expect(hospital).toEqual(sdoAdapter.getTerm("https://schema.org/Hospital"));
      expect(hospital).toEqual(sdoAdapter.getTerm("Hospital"));
      const address = sdoAdapter.getProperty("schema:address");
      expect(address).toEqual(sdoAdapter.getTerm("schema:address"));
      expect(address).toEqual(sdoAdapter.getTerm("https://schema.org/address"));
      expect(address).toEqual(sdoAdapter.getTerm("address"));
      const numb = sdoAdapter.getDataType("schema:Number");
      expect(numb).toEqual(sdoAdapter.getTerm("schema:Number"));
      expect(numb).toEqual(sdoAdapter.getTerm("https://schema.org/Number"));
      expect(numb).toEqual(sdoAdapter.getTerm("Number"));
      const DayOfWeek = sdoAdapter.getEnumeration("schema:DayOfWeek");
      expect(DayOfWeek).toEqual(sdoAdapter.getTerm("schema:DayOfWeek"));
      expect(DayOfWeek).toEqual(sdoAdapter.getTerm("https://schema.org/DayOfWeek"));
      expect(DayOfWeek).toEqual(sdoAdapter.getTerm("DayOfWeek"));
      const Friday = sdoAdapter.getEnumerationMember("schema:Friday");
      expect(Friday).toEqual(sdoAdapter.getTerm("schema:Friday"));
      expect(Friday).toEqual(sdoAdapter.getTerm("https://schema.org/Friday"));
      expect(Friday).toEqual(sdoAdapter.getTerm("Friday"));
      expect(sdoAdapter.getTerm("schema:URL")).not.toEqual(sdoAdapter.getTerm("schema:url"));
    });
  });

  test("getListOfTerms()", async () => {
    await executeTestForEach(sdoAdapterMap, (sdoAdapter: SDOAdapter) => {
      const allTermsList = sdoAdapter.getListOfTerms();
      expect(allTermsList.length > 1000).toBe(true);
      expect(allTermsList.includes("schema:DayOfWeek")).toBe(true);
      expect(allTermsList.includes("schema:Hotel")).toBe(true);
      expect(allTermsList.includes("schema:address")).toBe(true);
      expect(allTermsList.includes("schema:Text")).toBe(true);
      expect(allTermsList.includes("schema:Monday")).toBe(true);
      expect(allTermsList.includes("ex:Tiger")).toBe(true);
      expect(isOrIncludesAbsoluteIRI(allTermsList, "schema.org/Monday")).toBe(false);
      expect(isOrIncludesAbsoluteIRI(allTermsList, "example-vocab.ex/Tiger")).toBe(false);
      const allTermsListAbsolute = sdoAdapter.getListOfTerms({ outputFormat: "Absolute" });
      expect(allTermsList.length).toBe(allTermsListAbsolute.length);
      expect(allTermsListAbsolute.includes("schema:Monday")).toBe(false);
      expect(allTermsListAbsolute.includes("ex:Tiger")).toBe(false);
      expect(isOrIncludesAbsoluteIRI(allTermsListAbsolute, "schema.org/Monday")).toBe(true);
      expect(isOrIncludesAbsoluteIRI(allTermsListAbsolute, "example-vocab.ex/Tiger")).toBe(true);
    });
  });

  test("getAllTerms()", async () => {
    await executeTestForEach(sdoAdapterMap, (sdoAdapter: SDOAdapter) => {
      const allTerms = sdoAdapter.getAllTerms();
      expect(allTerms.length > 1000).toBe(true);
      const count = {
        c: 0,
        p: 0,
        en: 0,
        enm: 0,
        dt: 0
      };
      for (const actTerm of allTerms) {
        switch (actTerm.getTermTypeIRI()) {
          case "rdfs:Class":
            count.c++;
            break;
          case "rdf:Property":
            count.p++;
            break;
          case "schema:Enumeration":
            count.en++;
            break;
          case "soa:EnumerationMember":
            count.enm++;
            break;
          case "schema:DataType":
            count.dt++;
            break;
        }
      }
      expect(count.c).toBe(sdoAdapter.getListOfClasses().length);
      expect(count.p).toBe(sdoAdapter.getListOfProperties().length);
      expect(count.en).toBe(sdoAdapter.getListOfEnumerations().length);
      expect(count.enm).toBe(sdoAdapter.getListOfEnumerationMembers().length);
      expect(count.dt).toBe(sdoAdapter.getListOfDataTypes().length);
    });
  });
});
