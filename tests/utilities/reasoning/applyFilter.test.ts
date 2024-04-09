import { FilterObject, SOA } from "../../../src";
import { testSdoAdapter } from "../../resources/utilities/testUtilities";
import VOC_OBJ_ZOO from "../../resources/data/vocabularies/vocabulary-animal.json";

function checkMatches(iriList: string[], includedIris: string[], excludedIris: string[]) {
  for (const i of includedIris) {
    expect(iriList).toContain(i);
  }
  for (const e of excludedIris) {
    expect(iriList).not.toContain(e);
  }
}

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
    expect(mySA.getListOfDataTypes({ filter: filter13 })).toContain("schema:Text");

    expect(mySA.getListOfProperties({
      filter: {
        termTypeExclude: "Class"
      }
    })).toContain("schema:aspect");
    expect(mySA.getListOfProperties({
      filter: {
        termTypeExclude: ["Enumeration"]
      }
    })).toContain("schema:aspect");
    expect(mySA.getListOfProperties({
      filter: {
        termTypeExclude: ["Property"]
      }
    })).not.toContain("schema:aspect");
    expect(mySA.getListOfProperties({
      filter: {
        termTypeExclude: ["Property"]
      }
    })).toHaveLength(0);
    expect(mySA.getListOfProperties({
      filter: {
        fromVocabularyExclude: ["ex"]
      }
    })).toContain("schema:aspect");
    expect(mySA.getListOfProperties({
      filter: {
        fromVocabularyExclude: ["ex"]
      }
    })).not.toContain("ex:animalLivingEnvironment");
    expect(mySA.getListOfProperties({
      filter: {
        fromVocabularyExclude: ["schema"]
      }
    })).toContain("ex:animalLivingEnvironment");
    expect(mySA.getListOfProperties({
      filter: {
        fromVocabularyExclude: ["schema"]
      }
    })).not.toContain("schema:aspect");
  });

  // applyFilter with partial vocabulary (referenced terms are not part of the current vocabulary)
  test("applyFilter partial vocabulary", async () => {
    const mySA = await SOA.create({
      vocabularies: [VOC_OBJ_ZOO],
    });
    const enum1 = mySA.getEnumeration("ex:AnimalLivingEnvironment");
    expect(enum1.getSuperClasses()).toContain("schema:Enumeration");
    // schema:Enumeration is a Class, but this can't be known by the filterFunction since schema:Enumeration itself is not present in the external vocabulary
    expect(enum1.getSuperClasses({ filter: { termType: ["Class"] } })).not.toContain("schema:Enumeration");
  });

  // applyFilter with schemaModule filters
  test("applyFilter schema modules", async () => {
    const mySA = await testSdoAdapter({ schemaVersion: "15.0", vocabularies: [VOC_OBJ_ZOO] });
    const classIriFromCore = "schema:Hotel";
    const classIriFromAuto = "schema:Motorcycle";
    const classIriFromBib = "schema:Atlas";
    const classIriFromHealth = "schema:AnatomicalStructure";
    const classIriFromMeta = "schema:Class";
    const classIriFromPending = "schema:OfferForLease";
    const classIriFromAttic = "schema:StupidType";
    const classIriFromExternal = "ex:Tiger";

    const res1 = mySA.getListOfClasses({
      filter: {
        schemaModule: "core"
      }
    });
    const res1b = mySA.getListOfClasses({
      filter: {
        schemaModule: ["core"]
      }
    });
    const inc1 = [classIriFromCore, classIriFromExternal];
    const exc1 = [classIriFromAuto, classIriFromBib, classIriFromHealth, classIriFromMeta, classIriFromPending, classIriFromAttic];
    checkMatches(res1, inc1, exc1);
    checkMatches(res1b, inc1, exc1);

    const res2 = mySA.getListOfClasses({
      filter: {
        schemaModule: ["core", "attic", "bib"]
      }
    });
    const inc2 = [classIriFromCore, classIriFromBib, classIriFromAttic, classIriFromExternal];
    const exc2 = [classIriFromAuto, classIriFromHealth, classIriFromMeta, classIriFromPending];
    checkMatches(res2, inc2, exc2);

    const res3 = mySA.getListOfClasses({
      filter: {}
    });
    const inc3 = [classIriFromCore, classIriFromBib, classIriFromAttic, classIriFromExternal, classIriFromAuto, classIriFromHealth, classIriFromMeta, classIriFromPending];
    checkMatches(res3, inc3, []);

    const res4 = mySA.getListOfClasses({
      filter: {
        schemaModuleExclude: ["core", "attic", "bib"]
      }
    });
    const inc4 = [classIriFromAuto, classIriFromHealth, classIriFromMeta, classIriFromPending, classIriFromExternal];
    const exc4 = [classIriFromCore, classIriFromBib, classIriFromAttic];
    checkMatches(res4, inc4, exc4);
  });

  test("applyFilter invalid input check", async () => {
    const mySA = await testSdoAdapter({ schemaVersion: "15.0", vocabularies: [VOC_OBJ_ZOO] });

    expect(() => mySA.getListOfProperties({
      filter: {
        isSuperseded: "SomeThingFalse"
      } as unknown as FilterObject
    })).toThrow();

    expect(() => mySA.getListOfProperties({
      filter: {
        termType: ["SomeThingFalse"]
      } as unknown as FilterObject
    })).toThrow();

    expect(() => mySA.getListOfProperties({
      filter: {
        termType: ["Class", 42]
      } as unknown as FilterObject
    })).toThrow();

    expect(() => {
      mySA.getListOfClasses({
        filter: {
          termType: ["Class"],
          termTypeExclude: ["Enumeration"]
        }
      });
    }).toThrow();

    expect(() => {
      mySA.getListOfClasses({
        filter: {
          schemaModule: ["blabla"]
        } as unknown as FilterObject
      });
    }).toThrow();

    expect(() => {
      mySA.getListOfClasses({
        filter: {
          schemaModule: ["auto", 42]
        } as unknown as FilterObject
      });
    }).toThrow();

    expect(() => {
      mySA.getListOfClasses({
        filter: {
          schemaModule: ["auto"],
          schemaModuleExclude: ["core", "attic", "bib"]
        }
      });
    }).toThrow();

    expect(() => {
      mySA.getListOfClasses({
        filter: {
          fromVocabulary: ["schema", true]
        } as unknown as FilterObject
      });
    }).toThrow();

    expect(() => {
      mySA.getListOfClasses({
        filter: {
          fromVocabularyExclude: 42
        } as unknown as FilterObject
      });
    }).toThrow();

    expect(() => {
      mySA.getListOfClasses({
        filter: {
          fromVocabulary: ["schema"],
          fromVocabularyExclude: ["ex"]
        }
      });
    }).toThrow();
  });

  // applyFilter with schemaModule filters
  test("applyFilter defaultFilter", async () => {
    const mySA = await testSdoAdapter({
      schemaVersion: "15.0",
      vocabularies: [VOC_OBJ_ZOO],
      defaultFilter:
        {
          schemaModuleExclude: ["attic", "meta"],
          isSuperseded: false
        }
    });
    const classIriFromCore = "schema:Hotel";
    const classIriFromMeta = "schema:Class";
    const classIriFromAttic = "schema:StupidType";
    const classIriFromExternal = "ex:Tiger";
    const classIriSuperseded = "schema:Season";

    const res1 = mySA.getListOfClasses();
    const inc1 = [classIriFromCore, classIriFromExternal];
    const exc1 = [classIriSuperseded, classIriFromMeta, classIriFromAttic];
    checkMatches(res1, inc1, exc1);
    const res2 = mySA.getListOfClasses({
      filter: {
        fromVocabularyExclude: ["ex"]
      }
    });
    const inc2 = [classIriFromCore, classIriSuperseded, classIriFromMeta, classIriFromAttic];
    const exc2 = [classIriFromExternal];
    checkMatches(res2, inc2, exc2);
  });
});
