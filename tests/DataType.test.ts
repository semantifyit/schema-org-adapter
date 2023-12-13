import { debugFunc,  testSdoAdapter } from "./testUtility";
import { isObject } from "../src/utilities/isObject";

/**
 *  Tests regarding the JS-Class for "DataType"
 */
describe("DataType methods", () => {
  test("getTermTypeLabel()", async () => {
    const mySA = await testSdoAdapter();
    const number = mySA.getDataType("schema:Number");
    expect(number.getTermTypeLabel()).toBe("DataType");
  });

  test("getTermTypeIRI()", async () => {
    const mySA = await testSdoAdapter();
    const number = mySA.getDataType("schema:Number");
    expect(number.getTermTypeIRI()).toBe("schema:DataType");
  });

  test("getSource()", async () => {
    const mySA = await testSdoAdapter();
    const CssSelectorType = mySA.getDataType("schema:CssSelectorType");
    expect(CssSelectorType.getSource()).toBe(
      "https://github.com/schemaorg/schemaorg/issues/1672"
    );
    const number = mySA.getDataType("schema:Number");
    expect(number.getSource()).toBe(null);
  });

  test("getVocabulary()", async () => {
    const mySA = await testSdoAdapter();
    const number = mySA.getDataType("schema:Number");
    expect(number.getVocabulary()).toBe("https://schema.org");
  });

  test("getIRI()", async () => {
    const mySA = await testSdoAdapter();
    const CssSelectorType = mySA.getDataType("schema:CssSelectorType");
    expect(CssSelectorType.getIRI()).toBe("https://schema.org/CssSelectorType");
    expect(CssSelectorType.getIRI(true)).toBe("schema:CssSelectorType");
    expect(CssSelectorType.getIRI()).toBe(CssSelectorType.getIRI(false));
  });

  test("getName()", async () => {
    const mySA = await testSdoAdapter();
    const number = mySA.getDataType("schema:Number");
    expect(number.getName()).toBe("Number");
    expect(number.getName("en")).toBe(number.getName());
    expect(number.getName("de")).toBe(null);
  });

  test("getDescription()", async () => {
    const mySA = await testSdoAdapter();
    const CssSelectorType = mySA.getDataType("schema:CssSelectorType");
    expect(CssSelectorType.getDescription()).toBe(
      "Text representing a CSS selector."
    );
    expect(CssSelectorType.getDescription("en")).toBe(
      "Text representing a CSS selector."
    );
    expect(CssSelectorType.getDescription("de")).toBe(null);
  });

  test("isSupersededBy()", async () => {
    const mySA = await testSdoAdapter();
    const CssSelectorType = mySA.getDataType("schema:CssSelectorType");
    expect(CssSelectorType.isSupersededBy()).toBe(null);
  });

  test("getSuperDataTypes()", async () => {
    const mySA = await testSdoAdapter();
    const float = mySA.getDataType("schema:Float");
    expect(float.getSuperDataTypes()).toContain("schema:Number");
    expect(float.getSuperDataTypes()).not.toContain("schema:Date");
  });

  test("getSubDataTypes()", async () => {
    const mySA = await testSdoAdapter();
    const text = mySA.getDataType("schema:Text");
    expect(text.getSubDataTypes()).toContain("schema:XPathType");
    expect(text.getSubDataTypes()).toContain("schema:CssSelectorType");
    expect(text.getSubDataTypes()).toContain("schema:URL");
    expect(text.getSubDataTypes()).not.toContain("schema:Integer");
  });

  test("isRangeOf()", async () => {
    const mySA = await testSdoAdapter();
    const Integer = mySA.getDataType("schema:Integer");
    expect(Integer.isRangeOf()).toContain("schema:numberOfSeasons");
    expect(Integer.isRangeOf(false)).toContain("schema:numberOfSeasons");
    expect(Integer.isRangeOf()).toContain("schema:elevation");
    expect(Integer.isRangeOf(false)).not.toContain("schema:elevation");
  });

  test("toString()", async () => {
    const mySA = await testSdoAdapter();
    const text = mySA.getDataType("schema:Text");
    debugFunc(text.toString());
    expect(isObject(JSON.parse(text.toString()))).toBe(true);
  });
});
