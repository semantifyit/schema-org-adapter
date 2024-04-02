import { SOA } from "../../../src";
import VOC_OBJ_ZOO_A2 from "../../resources/data/vocabularies/vocabulary-animal-altered-2.json";

describe("inferSuperClasses()", () => {
  // applyFilter with partial vocabulary (referenced terms are not part of the current vocabulary)
  test("inferSuperClasses", async () => {
    const mySA = await SOA.create({
      vocabularies: [VOC_OBJ_ZOO_A2]
    });
    // custom vocabulary that includes terms referencing themselves as super-entities. Our API should not include them in the result and should not cause an infinite recursion
    const c = mySA.getClass("ex:Animal");
    expect(c.getSuperClasses()).not.toContain("ex:Animal");
    const p = mySA.getProperty("ex:numberOfLegs");
    expect(p.getSuperProperties()).not.toContain("ex:numberOfLegs");
    const e = mySA.getEnumeration("ex:AnimalLivingEnvironment");
    expect(e.getSuperClasses()).not.toContain("ex:AnimalLivingEnvironment");
  });
});
