import {
  executeTestForEach,
  initializeSdoAdapterMap,
  isOrIncludesAbsoluteIRI,
  SdoAdapterMap
} from "../resources/utilities/testUtilities";
import { isObject } from "../../src/utilities/general/isObject";
import { SDOAdapter } from "../../src";
import { uniquifyArray } from "../../src/utilities/general/uniquifyArray";

/**
 *  Tests regarding the JS-Class for "DataType"
 */
describe("DataType tests - All schema versions", () => {
  let sdoAdapterMap: SdoAdapterMap;

  beforeAll(async () => {
    sdoAdapterMap = await initializeSdoAdapterMap();
  });

  test("getDataType()", async () => {
    await executeTestForEach(sdoAdapterMap, (sdoAdapter: SDOAdapter) => {
      const number = sdoAdapter.getDataType("schema:Number");
      expect(number).toEqual(sdoAdapter.getDataType("https://schema.org/Number"));
      expect(number).toEqual(sdoAdapter.getDataType("http://schema.org/Number"));
      expect(number).toEqual(sdoAdapter.getDataType("Number"));
    });
  });

  test("getTermTypeLabel()", async () => {
    await executeTestForEach(sdoAdapterMap, (sdoAdapter: SDOAdapter) => {
      const number = sdoAdapter.getDataType("schema:Number");
      expect(number.getTermTypeLabel()).toBe("DataType");
    });
  });

  test("getTermTypeIRI()", async () => {
    await executeTestForEach(sdoAdapterMap, (sdoAdapter: SDOAdapter) => {
      const number = sdoAdapter.getDataType("schema:Number");
      expect(number.getTermTypeIRI()).toBe("schema:DataType");
    });
  });

  test("getSource()", async () => {
    await executeTestForEach(sdoAdapterMap, (sdoAdapter: SDOAdapter) => {
      if (sdoAdapter.getListOfDataTypes().includes("schema:CssSelectorType")) {
        // is a new datatype with a source, not existent in older vocabulary versions
        const cssSelectorType = sdoAdapter.getDataType("schema:CssSelectorType");
        // eslint-disable-next-line jest/no-conditional-expect
        expect(cssSelectorType.getSource()).toBe("https://github.com/schemaorg/schemaorg/issues/1672");
      }
      const number = sdoAdapter.getDataType("schema:Number");
      expect(number.getSource()).toBe(null);
    });
  });

  test("getVocabulary()", async () => {
    await executeTestForEach(sdoAdapterMap, (sdoAdapter: SDOAdapter) => {
      const number = sdoAdapter.getDataType("schema:Number");
      expect(number.getVocabulary().includes("://schema.org")).toBeTruthy();
    });
  });

  test("getIRI()", async () => {
    await executeTestForEach(sdoAdapterMap, (sdoAdapter: SDOAdapter) => {
      const number = sdoAdapter.getDataType("schema:Number");
      expect(number.getIRI().includes("://schema.org/Number")).toBeTruthy();
      expect(number.getIRI("Compact")).toBe("schema:Number");
      expect(number.getIRI()).toBe(number.getIRI("Absolute"));
    });
  });

  test("getName()", async () => {
    await executeTestForEach(sdoAdapterMap, (sdoAdapter: SDOAdapter) => {
      const number = sdoAdapter.getDataType("schema:Number");
      expect(number.getName()).toBe("Number");
      expect(number.getName("en")).toBe(number.getName());
      expect(number.getName("de")).toBe(null);
    });
  });

  test("getDescription()", async () => {
    await executeTestForEach(sdoAdapterMap, (sdoAdapter: SDOAdapter) => {
      const text = sdoAdapter.getDataType("schema:Text");
      expect(text.getDescription()).toBe("Data type: Text.");
      expect(text.getDescription("en")).toBe("Data type: Text.");
      expect(text.getDescription("de")).toBe(null);
    });
  });

  test("isSupersededBy()", async () => {
    await executeTestForEach(sdoAdapterMap, (sdoAdapter: SDOAdapter) => {
      const text = sdoAdapter.getDataType("schema:Text");
      expect(text.isSupersededBy()).toBe(null);
    });
  });

  test("getSuperDataTypes()", async () => {
    await executeTestForEach(sdoAdapterMap, (sdoAdapter: SDOAdapter) => {
      const float = sdoAdapter.getDataType("schema:Float");
      expect(float.getSuperDataTypes()).toContain("schema:Number");
      expect(float.getSuperDataTypes()).not.toContain("schema:Date");
    });
  });

  test("getSubDataTypes()", async () => {
    await executeTestForEach(sdoAdapterMap, (sdoAdapter: SDOAdapter) => {
      const text = sdoAdapter.getDataType("schema:Text");
      expect(text.getSubDataTypes()).toContain("schema:URL");
      expect(text.getSubDataTypes()).not.toContain("schema:Integer");
    });
  });

  test("isRangeOf()", async () => {
    await executeTestForEach(sdoAdapterMap, (sdoAdapter: SDOAdapter) => {
      const integer = sdoAdapter.getDataType("schema:Integer");
      expect(integer.isRangeOf()).toContain("schema:numberOfSeasons");
      expect(integer.isRangeOf({ implicit: false })).toContain("schema:numberOfSeasons");
      expect(integer.isRangeOf()).toContain("schema:elevation");
      expect(integer.isRangeOf({ implicit: false })).not.toContain("schema:elevation");
      const integerDomainProps = integer.isRangeOf();
      expect(integerDomainProps).toHaveLength(uniquifyArray(integerDomainProps).length);
      const text = sdoAdapter.getDataType("schema:Text");
      const textDomainProps = text.isRangeOf();
      expect(textDomainProps).toHaveLength(uniquifyArray(textDomainProps).length);
    });
  });

  test("toString()", async () => {
    await executeTestForEach(sdoAdapterMap, (sdoAdapter: SDOAdapter) => {
      const text = sdoAdapter.getDataType("schema:Text");
      expect(isObject(JSON.parse(text.toString()))).toBe(true);
    });
  });

  test("getListOfDataTypes()", async () => {
    await executeTestForEach(sdoAdapterMap, (sdoAdapter: SDOAdapter) => {
      const allDataTypesList = sdoAdapter.getListOfDataTypes();
      expect(allDataTypesList.length > 8).toBeTruthy();
      expect(allDataTypesList.includes("schema:Hotel")).toBeFalsy(); // should NOT contain other term types
      expect(allDataTypesList.includes("schema:name")).toBeFalsy(); // should NOT contain other term types
      expect(allDataTypesList.includes("schema:Text")).toBeTruthy();
      expect(isOrIncludesAbsoluteIRI(allDataTypesList, "schema.org/Text")).toBeFalsy();
      const allDataTypesListAbsolute = sdoAdapter.getListOfDataTypes({ outputFormat: "Absolute" });
      expect(allDataTypesList.length).toBe(allDataTypesListAbsolute.length);
      expect(allDataTypesListAbsolute.includes("schema:Text")).toBeFalsy();
      expect(isOrIncludesAbsoluteIRI(allDataTypesListAbsolute, "schema.org/Text")).toBeTruthy();
    });
  });

  test("getAllDataTypes()", async () => {
    await executeTestForEach(sdoAdapterMap, (sdoAdapter: SDOAdapter) => {
      const allDT = sdoAdapter.getAllDataTypes();
      expect(allDT.length > 8).toBe(true);
      const allDataTypesFromEx = sdoAdapter.getAllDataTypes({
        fromVocabulary: "ex"
      });
      expect(allDataTypesFromEx.length).toBe(0);
      const allDataTypesFromSDO = sdoAdapter.getAllDataTypes({
        fromVocabulary: "schema"
      });
      expect(allDataTypesFromSDO.length > 8).toBeTruthy();
      for (const actDT of allDT) {
        expect(actDT.getTermTypeIRI()).toBe("schema:DataType");
      }
      expect(allDataTypesFromSDO.find((dt) => dt.getIRI("Compact") === "schema:Hotel")).toBeUndefined(); // should NOT contain other term types
      expect(allDataTypesFromSDO.find((dt) => dt.getIRI("Compact") === "schema:Text")).toBeDefined();
    });
  });

  test("isValidSuperDataType()", async () => {
    await executeTestForEach(sdoAdapterMap, (sdoAdapter: SDOAdapter) => {
      const text = sdoAdapter.getDataType("schema:Text");
      expect(text.isValidSuperDataTypeOf("schema:URL")).toBeTruthy();
      expect(text.isValidSuperDataTypeOf("schema:URL", false)).toBeTruthy();
      expect(text.isValidSuperDataTypeOf("schema:Number", true)).toBeFalsy();
      expect(() => {
        text.isValidSuperDataTypeOf("schema:name");
      }).toThrow();
      expect(() => {
        text.isValidSuperDataTypeOf("schema:DayOfWeek");
      }).toThrow();
    });
  });

  test("isValidSubDataTypeOf()", async () => {
    await executeTestForEach(sdoAdapterMap, (sdoAdapter: SDOAdapter) => {
      const url = sdoAdapter.getDataType("schema:URL");
      expect(url.isValidSubDataTypeOf("schema:Text")).toBeTruthy();
      expect(url.isValidSubDataTypeOf("schema:Text", false)).toBeTruthy();
      expect(url.isValidSubDataTypeOf("schema:Number", true)).toBeFalsy();
      expect(() => {
        url.isValidSubDataTypeOf("schema:name");
      }).toThrow();
      expect(() => {
        url.isValidSubDataTypeOf("schema:DayOfWeek");
      }).toThrow();
    });
  });

  test("isValidRangeOf()", async () => {
    await executeTestForEach(sdoAdapterMap, (sdoAdapter: SDOAdapter) => {
      const url = sdoAdapter.getDataType("schema:URL");
      expect(url.isValidRangeOf("schema:name")).toBeTruthy();
      expect(url.isValidRangeOf("schema:name", true)).toBeTruthy();
      expect(url.isValidRangeOf("schema:name", false)).toBeFalsy();
      expect(url.isValidRangeOf("schema:url", false)).toBeTruthy();
    });
  });
});
