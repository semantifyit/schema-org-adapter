const SDOAdapter = require("../src/SDOAdapter");
const VOC_OBJ_DACH = require('../testData/dachkg_1');
const VOC_OBJ_SDO3_7 = require('../testData/schema_3.7');

async function initAdapter() {
    let mySA = new SDOAdapter();
    await mySA.addVocabularies([VOC_OBJ_SDO3_7, VOC_OBJ_DACH]);
    return mySA;
}

describe('DataType methods', () => {

    test("getTermType()", async () => {
        let mySA = await initAdapter();
        let number = mySA.getDataType("schema:Number");
        expect(number.getTermType()).toBe("schema:DataType");
    });

    test("getSource()", async () => {
        let mySA = await initAdapter();
        let CssSelectorType = mySA.getDataType("schema:CssSelectorType");
        expect(CssSelectorType.getSource()).toBe("https://github.com/schemaorg/schemaorg/issues/1672");
        let number = mySA.getDataType("schema:Number");
        expect(number.getSource()).toBe(null);
    });

    test("getVocabulary()", async () => {
        let mySA = await initAdapter();
        let number = mySA.getDataType("schema:Number");
        expect(number.getVocabulary()).toBe("http://schema.org");
    });

    test("getIRI()", async () => {
        let mySA = await initAdapter();
        let CssSelectorType = mySA.getDataType("schema:CssSelectorType");
        expect(CssSelectorType.getIRI()).toBe("http://schema.org/CssSelectorType");
        expect(CssSelectorType.getIRI(true)).toBe("schema:CssSelectorType");
        expect(CssSelectorType.getIRI()).toBe(CssSelectorType.getIRI(false));
    });

    test("getName()", async () => {
        let mySA = await initAdapter();
        let number = mySA.getDataType("schema:Number");
        expect(number.getName()).toBe("Number");
        expect(number.getName('en')).toBe(number.getName());
        expect(number.getName('de')).toBe(null);
    });

    test("getDescription()", async () => {
        let mySA = await initAdapter();
        let CssSelectorType = mySA.getDataType("schema:CssSelectorType");
        expect(CssSelectorType.getDescription()).toBe("Text representing a CSS selector.");
        expect(CssSelectorType.getDescription('en')).toBe("Text representing a CSS selector.");
        expect(CssSelectorType.getDescription('de')).toBe(null);
    });

    test("isSupersededBy()", async () => {
        let mySA = await initAdapter();
        let CssSelectorType = mySA.getDataType("schema:CssSelectorType");
        expect(CssSelectorType.isSupersededBy()).toBe(null);
    });

    test("getSuperDataTypes()", async () => {
        let mySA = await initAdapter();
        let float = mySA.getDataType("schema:Float");
        expect(float.getSuperDataTypes()).toContain("schema:Number");
        expect(float.getSuperDataTypes()).not.toContain("schema:Date");
    });

    test("getSubDataTypes()", async () => {
        let mySA = await initAdapter();
        let text = mySA.getDataType("schema:Text");
        expect(text.getSubDataTypes()).toContain("schema:XPathType");
        expect(text.getSubDataTypes()).toContain("schema:CssSelectorType");
        expect(text.getSubDataTypes()).toContain("schema:URL");
        expect(text.getSubDataTypes()).not.toContain("schema:Integer");
    });
});
