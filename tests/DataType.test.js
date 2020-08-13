const SDOAdapter = require('../src/SDOAdapter');

/**
 *
 */
async function initAdapter() {
    const mySA = new SDOAdapter();
    const mySDOUrl = await mySA.constructSDOVocabularyURL('latest');
    await mySA.addVocabularies([mySDOUrl]);
    return mySA;
}

describe('DataType methods', () => {
    test('getTermType()', async() => {
        const mySA = await initAdapter();
        const number = mySA.getDataType('schema:Number');
        expect(number.getTermType()).toBe('schema:DataType');
    });

    test('getSource()', async() => {
        const mySA = await initAdapter();
        const CssSelectorType = mySA.getDataType('schema:CssSelectorType');
        expect(CssSelectorType.getSource()).toBe('https://github.com/schemaorg/schemaorg/issues/1672');
        const number = mySA.getDataType('schema:Number');
        expect(number.getSource()).toBe(null);
    });

    test('getVocabulary()', async() => {
        const mySA = await initAdapter();
        const number = mySA.getDataType('schema:Number');
        expect(number.getVocabulary()).toBe('http://schema.org');
    });

    test('getIRI()', async() => {
        const mySA = await initAdapter();
        const CssSelectorType = mySA.getDataType('schema:CssSelectorType');
        expect(CssSelectorType.getIRI()).toBe('http://schema.org/CssSelectorType');
        expect(CssSelectorType.getIRI(true)).toBe('schema:CssSelectorType');
        expect(CssSelectorType.getIRI()).toBe(CssSelectorType.getIRI(false));
    });

    test('getName()', async() => {
        const mySA = await initAdapter();
        const number = mySA.getDataType('schema:Number');
        expect(number.getName()).toBe('Number');
        expect(number.getName('en')).toBe(number.getName());
        expect(number.getName('de')).toBe(null);
    });

    test('getDescription()', async() => {
        const mySA = await initAdapter();
        const CssSelectorType = mySA.getDataType('schema:CssSelectorType');
        expect(CssSelectorType.getDescription()).toBe('Text representing a CSS selector.');
        expect(CssSelectorType.getDescription('en')).toBe('Text representing a CSS selector.');
        expect(CssSelectorType.getDescription('de')).toBe(null);
    });

    test('isSupersededBy()', async() => {
        const mySA = await initAdapter();
        const CssSelectorType = mySA.getDataType('schema:CssSelectorType');
        expect(CssSelectorType.isSupersededBy()).toBe(null);
    });

    test('getSuperDataTypes()', async() => {
        const mySA = await initAdapter();
        const float = mySA.getDataType('schema:Float');
        expect(float.getSuperDataTypes()).toContain('schema:Number');
        expect(float.getSuperDataTypes()).not.toContain('schema:Date');
    });

    test('getSubDataTypes()', async() => {
        const mySA = await initAdapter();
        const text = mySA.getDataType('schema:Text');
        expect(text.getSubDataTypes()).toContain('schema:XPathType');
        expect(text.getSubDataTypes()).toContain('schema:CssSelectorType');
        expect(text.getSubDataTypes()).toContain('schema:URL');
        expect(text.getSubDataTypes()).not.toContain('schema:Integer');
    });
});
