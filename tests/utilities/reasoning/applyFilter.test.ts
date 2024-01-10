import { FilterObject } from "../../../src";
import { testSdoAdapter } from "../../resources/utilities/testUtilities";
import VOC_OBJ_ZOO from "../../resources/data/vocabularies/vocabulary-animal.json";

describe("applyFilter()", () => {
  test("applyFilter", async () => {
    const mySA = await testSdoAdapter({ vocabularies: [VOC_OBJ_ZOO] });
    const MedicalWebPage = mySA.getClass("schema:MedicalWebPage");
    const filter1 = undefined;
    const filter2 = {};
    const filter3: FilterObject = { termType: "Class" };
    const filter4: FilterObject = { termType: "Property" };
    const filter5 = { isSuperseded: false } as FilterObject;
    const filter6 = { isSuperseded: true } as FilterObject;
    const filter7 = { termType: ["Property", "Class"] } as FilterObject;
    const filter8 = { termType: ["Enumeration", "Class"] } as FilterObject;
    const filter9 = {
      termType: ["Property"],
      fromVocabulary: ["https://schema.org/"]
    } as FilterObject;
    const filter9b = {
      termType: ["Property"],
      fromVocabulary: "https://schema.org/"
    } as FilterObject;
    const filter10 = {
      termType: ["Property"],
      fromVocabulary: "ex"
    } as FilterObject;
    const filter11 = {
      termType: ["Property"],
      fromVocabulary: ["schema", "ex"]
    } as FilterObject;
    const filter13 = { termType: ["DataType"] } as FilterObject;
    expect(MedicalWebPage.getProperties({ filter: filter1 })).toContain("schema:aspect");
    expect(MedicalWebPage.getProperties({ filter: filter2 })).toContain("schema:aspect");
    expect(MedicalWebPage.getProperties({ filter: filter3 })).not.toContain("schema:aspect");
    expect(MedicalWebPage.getProperties({ filter: filter4 })).toContain("schema:aspect");
    expect(MedicalWebPage.getProperties({ filter: filter5 })).not.toContain("schema:aspect");
    expect(MedicalWebPage.getProperties({ filter: filter5 })).toContain("schema:name");
    expect(MedicalWebPage.getProperties({ filter: filter6 })).toContain("schema:aspect");
    expect(MedicalWebPage.getProperties({ filter: filter6 })).not.toContain("schema:name");
    expect(mySA.getListOfProperties({ filter: filter6 })).not.toContain("schema:name");
    expect(mySA.getListOfProperties({ filter: filter6 })).toContain("schema:aspect");
    expect(mySA.getListOfProperties({ filter: filter4 })).toContain("schema:aspect");
    expect(mySA.getListOfProperties({ filter: filter4 })).toContain("schema:name");
    expect(mySA.getListOfProperties({ filter: filter1 })).toContain("ex:animalLivingEnvironment");
    expect(mySA.getListOfProperties({ filter: filter7 })).toContain("ex:animalLivingEnvironment");
    expect(mySA.getListOfProperties({ filter: filter8 })).not.toContain("ex:animalLivingEnvironment");
    expect(mySA.getListOfProperties({ filter: filter9 })).not.toContain("ex:animalLivingEnvironment");
    expect(mySA.getListOfProperties({ filter: filter9 })).toContain("schema:name");
    expect(mySA.getListOfProperties({ filter: filter9b })).toContain("schema:name");
    expect(mySA.getListOfProperties({ filter: filter10 })).toContain("ex:animalLivingEnvironment");
    expect(mySA.getListOfProperties({ filter: filter10 })).not.toContain("schema:name");
    expect(mySA.getListOfProperties({ filter: filter11 })).toContain("ex:animalLivingEnvironment");
    expect(mySA.getListOfProperties({ filter: filter11 })).toContain("schema:aspect");
    const fakeFilter = {
      termType: ["SomeThingFalse"]
    } as unknown as FilterObject;
    expect(() => mySA.getListOfProperties({ filter: fakeFilter })).toThrow();
    expect(mySA.getListOfDataTypes({ filter: filter13 })).toContain("schema:Text");
  });
});
