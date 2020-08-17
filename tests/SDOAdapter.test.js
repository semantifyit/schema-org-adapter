const SDOAdapter = require('../src/SDOAdapter');
const VOC_OBJ_ZOO = require('./data/exampleExternalVocabulary');
const VOC_OBJ_SDO3_7 = require('./data/schema_3.7');
const VOC_OBJ_GWON = require('./data/graph_with_one_node');
const VOC_URL_ZOO = 'https://raw.githubusercontent.com/semantifyit/schema-org-adapter/master/tests/data/exampleExternalVocabulary.json';
const VOC_URL_SDO5_0 = 'https://raw.githubusercontent.com/schemaorg/schemaorg/main/data/releases/5.0/all-layers.jsonld';
const VOC_URL_SDO5_0_DIRECT = 'https://schema.org/version/5.0/all-layers.jsonld'; // expected to work in node, but not in browser (because of redirect)

describe('SDO Adapter methods', () => {
    test('addVocabularies()', async() => {
        const mySA = new SDOAdapter();
        await mySA.addVocabularies([VOC_OBJ_SDO3_7, VOC_OBJ_GWON]);
        const testClass = mySA.getClass('namespace:AwesomePerson');
        expect(testClass.getName()).toEqual('validValue');
    });

    test('addVocabularies() add single vocabulary', async() => {
        const mySA = new SDOAdapter();
        await mySA.addVocabularies(VOC_OBJ_SDO3_7);
        const testClass = mySA.getClass('schema:Hotel');
        expect(testClass.getName()).toEqual('Hotel');
    });

    test('addVocabularies() latest', async() => {
        const mySA = new SDOAdapter();
        await mySA.addVocabularies([await mySA.constructSDOVocabularyURL('latest'), VOC_OBJ_GWON]);
        const testClass = mySA.getClass('namespace:AwesomePerson');
        expect(testClass.getName()).toEqual('validValue');
    });

    test('getVocabularies()', async() => {
        const mySA = new SDOAdapter();
        await mySA.addVocabularies([VOC_OBJ_SDO3_7, VOC_OBJ_ZOO]);
        const vocabs = mySA.getVocabularies();
        expect(Object.keys(vocabs).length).toBe(2);
        expect(vocabs.schema).not.toBe(undefined);
        expect(vocabs.ex).not.toBe(undefined);
        expect(vocabs.ex).toBe('https://example-vocab.ex/');
    });

    test('getVocabularies() latest', async() => {
        const mySA = new SDOAdapter();
        await mySA.addVocabularies([await mySA.constructSDOVocabularyURL('latest'), VOC_OBJ_ZOO]);
        const vocabs = mySA.getVocabularies();
        expect(Object.keys(vocabs).length).toBe(2);
        expect(vocabs.schema).not.toBe(undefined);
        expect(vocabs.ex).not.toBe(undefined);
        expect(vocabs.ex).toBe('https://example-vocab.ex/');
    });

    test('getClass()', async() => {
        const mySA = new SDOAdapter();
        await mySA.addVocabularies([VOC_URL_SDO5_0, VOC_URL_ZOO]);
        const Hotel = mySA.getClass('schema:Hotel');
        expect(Hotel.getTermType()).toBe('rdfs:Class');
    });

    test('getClass() latest', async() => {
        const mySA = new SDOAdapter();
        await mySA.addVocabularies([await mySA.constructSDOVocabularyURL('latest'), VOC_URL_ZOO]);
        const Hotel = mySA.getClass('schema:Hotel');
        expect(Hotel.getTermType()).toBe('rdfs:Class');
    });

    test('getListOfClasses()', async() => {
        const mySA = new SDOAdapter();
        await mySA.addVocabularies([VOC_OBJ_SDO3_7, VOC_OBJ_ZOO]);
        const allClassesList = mySA.getListOfClasses();
        expect(allClassesList.length).toBe(733);
        expect(allClassesList.includes('schema:DayOfWeek')).toBe(false); // should NOT contain enumerations
    });

    test('getAllClasses()', async() => {
        const mySA = new SDOAdapter();
        await mySA.addVocabularies([VOC_OBJ_SDO3_7, VOC_OBJ_ZOO]);
        const allClasses = mySA.getAllClasses();
        expect(allClasses.length).toBe(733);
        const allClassesZoo = mySA.getAllClasses({ fromVocabulary: 'ex' });
        expect(allClassesZoo.length).toBe(2);
        const allClassesSchema = mySA.getAllClasses({ fromVocabulary: 'schema' });
        expect(allClassesSchema.length).toBe(731);
        for (let i = 0; i < allClasses.length; i++) {
            expect(allClasses[i].getTermType()).toBe('rdfs:Class'); // should NOT contain enumerations
        }
    });

    test('getAllClasses() latest', async() => {
        const mySA = new SDOAdapter();
        await mySA.addVocabularies([await mySA.constructSDOVocabularyURL('latest'), VOC_OBJ_ZOO]);
        const allClasses = mySA.getAllClasses();
        expect(allClasses.length > 700).toBe(true);
        const allClassesZoo = mySA.getAllClasses({ fromVocabulary: 'ex' });
        expect(allClassesZoo.length).toBe(2);
        const allClassesSchema = mySA.getAllClasses({ fromVocabulary: 'schema' });
        expect(allClassesSchema.length === allClasses.length - 2).toBe(true);
        for (let i = 0; i < allClasses.length; i++) {
            expect(allClasses[i].getTermType()).toBe('rdfs:Class'); // should NOT contain enumerations
        }
    });

    test('getProperty()', async() => {
        const mySA = new SDOAdapter();
        await mySA.addVocabularies([VOC_OBJ_SDO3_7, VOC_OBJ_ZOO]);
        const address = mySA.getProperty('schema:address');
        expect(address.getTermType()).toBe('rdf:Property');
    });

    test('getProperty() latest', async() => {
        const mySA = new SDOAdapter();
        await mySA.addVocabularies([await mySA.constructSDOVocabularyURL('latest'), VOC_OBJ_ZOO]);
        const address = mySA.getProperty('schema:address');
        expect(address.getTermType()).toBe('rdf:Property');
    });

    test('getListOfProperties()', async() => {
        const mySA = new SDOAdapter();
        await mySA.addVocabularies([VOC_OBJ_SDO3_7, VOC_OBJ_ZOO]);
        const allPropertiesList = mySA.getListOfProperties();
        expect(allPropertiesList.length).toBe(1243);
    });

    test('getListOfProperties() latest', async() => {
        const mySA = new SDOAdapter();
        await mySA.addVocabularies([await mySA.constructSDOVocabularyURL('latest'), VOC_OBJ_ZOO]);
        const allPropertiesList = mySA.getListOfProperties();
        expect(allPropertiesList.length > 1200).toBe(true);
    });

    test('getAllProperties()', async() => {
        const mySA = new SDOAdapter();
        await mySA.addVocabularies([VOC_OBJ_SDO3_7, VOC_OBJ_ZOO]);
        const allProperties = mySA.getAllProperties();
        expect(allProperties.length).toBe(1243);
        const allPropertiesEx = mySA.getAllProperties({ fromVocabulary: 'ex' });
        expect(allPropertiesEx.length).toBe(2);
        const allPropertiesSchema = mySA.getAllProperties({ fromVocabulary: 'schema' });
        expect(allPropertiesSchema.length).toBe(1241);
        for (let i = 0; i < allProperties.length; i++) {
            expect(allProperties[i].getTermType()).toBe('rdf:Property');
        }
    });

    test('getAllProperties() latest', async() => {
        const mySA = new SDOAdapter();
        await mySA.addVocabularies([await mySA.constructSDOVocabularyURL('latest'), VOC_OBJ_ZOO]);
        const allProperties = mySA.getAllProperties();
        expect(allProperties.length > 1200).toBe(true);
        const allPropertiesEx = mySA.getAllProperties({ fromVocabulary: 'ex' });
        expect(allPropertiesEx.length).toBe(2);
        const allPropertiesSchema = mySA.getAllProperties({ fromVocabulary: 'schema' });
        expect(allPropertiesSchema.length === allProperties.length - 2).toBe(true);
        for (let i = 0; i < allProperties.length; i++) {
            expect(allProperties[i].getTermType()).toBe('rdf:Property');
        }
    });

    test('getDataType()', async() => {
        const mySA = new SDOAdapter();
        await mySA.addVocabularies([VOC_OBJ_SDO3_7, VOC_OBJ_ZOO]);
        const Number = mySA.getDataType('schema:Number');
        expect(Number.getTermType()).toBe('schema:DataType');
    });

    test('getDataType() latest', async() => {
        const mySA = new SDOAdapter();
        await mySA.addVocabularies([await mySA.constructSDOVocabularyURL('latest'), VOC_OBJ_ZOO]);
        const Number = mySA.getDataType('schema:Number');
        expect(Number.getTermType()).toBe('schema:DataType');
    });

    test('getListOfDataTypes()', async() => {
        const mySA = new SDOAdapter();
        await mySA.addVocabularies([VOC_OBJ_SDO3_7, VOC_OBJ_ZOO]);
        const allDataTypesList = mySA.getListOfDataTypes();
        expect(allDataTypesList.length).toBe(11);
    });

    test('getListOfDataTypes() latest', async() => {
        const mySA = new SDOAdapter();
        await mySA.addVocabularies([await mySA.constructSDOVocabularyURL('latest'), VOC_OBJ_ZOO]);
        const allDataTypesList = mySA.getListOfDataTypes();
        expect(allDataTypesList.length > 10).toBe(true);
    });

    test('getAllDataTypes()', async() => {
        const mySA = new SDOAdapter();
        await mySA.addVocabularies([VOC_OBJ_SDO3_7, VOC_OBJ_ZOO]);
        const allDT = mySA.getAllDataTypes();
        expect(allDT.length).toBe(11);
        const allDataTypesFromEx = mySA.getAllDataTypes({ fromVocabulary: 'ex' });
        expect(allDataTypesFromEx.length).toBe(0);
        const allDataTypesFromSDO = mySA.getAllDataTypes({ fromVocabulary: 'schema' });
        expect(allDataTypesFromSDO.length).toBe(11);
        for (let i = 0; i < allDT.length; i++) {
            expect(allDT[i].getTermType()).toBe('schema:DataType');
        }
    });

    test('getAllDataTypes() latest', async() => {
        const mySA = new SDOAdapter();
        await mySA.addVocabularies([await mySA.constructSDOVocabularyURL('latest'), VOC_OBJ_ZOO]);
        const allDT = mySA.getAllDataTypes();
        expect(allDT.length > 10).toBe(true);
        const allDataTypesFromEx = mySA.getAllDataTypes({ fromVocabulary: 'ex' });
        expect(allDataTypesFromEx.length).toBe(0);
        const allDataTypesFromSDO = mySA.getAllDataTypes({ fromVocabulary: 'schema' });
        expect(allDataTypesFromSDO.length > 10).toBe(true);
        for (let i = 0; i < allDT.length; i++) {
            expect(allDT[i].getTermType()).toBe('schema:DataType');
        }
    });

    test('getEnumeration()', async() => {
        const mySA = new SDOAdapter();
        await mySA.addVocabularies([VOC_OBJ_SDO3_7, VOC_OBJ_ZOO]);
        const DayOfWeek = mySA.getEnumeration('schema:DayOfWeek');
        expect(DayOfWeek.getTermType()).toBe('schema:Enumeration');
    });

    test('getEnumeration() latest', async() => {
        const mySA = new SDOAdapter();
        await mySA.addVocabularies([await mySA.constructSDOVocabularyURL('latest'), VOC_OBJ_ZOO]);
        const DayOfWeek = mySA.getEnumeration('schema:DayOfWeek');
        expect(DayOfWeek.getTermType()).toBe('schema:Enumeration');
    });

    test('getListOfEnumerations()', async() => {
        const mySA = new SDOAdapter();
        await mySA.addVocabularies([VOC_OBJ_SDO3_7, VOC_OBJ_ZOO]);
        const allEnumList = mySA.getListOfEnumerations();
        expect(allEnumList.length).toBe(60);
    });

    test('getListOfEnumerations() latest', async() => {
        const mySA = new SDOAdapter();
        await mySA.addVocabularies([await mySA.constructSDOVocabularyURL('latest'), VOC_OBJ_ZOO]);
        const allEnumList = mySA.getListOfEnumerations();
        expect(allEnumList.length > 60).toBe(true);
    });

    test('getAllEnumerations()', async() => {
        const mySA = new SDOAdapter();
        await mySA.addVocabularies([VOC_OBJ_SDO3_7, VOC_OBJ_ZOO]);
        const allDT = mySA.getAllEnumerations();
        expect(allDT.length).toBe(60);
        for (let i = 0; i < allDT.length; i++) {
            expect(allDT[i].getTermType()).toBe('schema:Enumeration');
        }
    });

    test('getAllEnumerations() latest', async() => {
        const mySA = new SDOAdapter();
        await mySA.addVocabularies([await mySA.constructSDOVocabularyURL('latest'), VOC_OBJ_ZOO]);
        const allDT = mySA.getAllEnumerations();
        expect(allDT.length > 60).toBe(true);
        for (let i = 0; i < allDT.length; i++) {
            expect(allDT[i].getTermType()).toBe('schema:Enumeration');
        }
    });

    test('getEnumerationMember()', async() => {
        const mySA = new SDOAdapter();
        await mySA.addVocabularies([VOC_OBJ_SDO3_7, VOC_OBJ_ZOO]);
        const Friday = mySA.getEnumerationMember('schema:Friday');
        expect(Friday.getTermType()).toBe('soa:EnumerationMember');
    });

    test('getEnumerationMember() latest', async() => {
        const mySA = new SDOAdapter();
        await mySA.addVocabularies([await mySA.constructSDOVocabularyURL('latest'), VOC_OBJ_ZOO]);
        const Friday = mySA.getEnumerationMember('schema:Friday');
        expect(Friday.getTermType()).toBe('soa:EnumerationMember');
    });

    test('getListOfEnumerationMembers()', async() => {
        const mySA = new SDOAdapter();
        await mySA.addVocabularies([VOC_OBJ_SDO3_7, VOC_OBJ_ZOO]);
        const allEnumList = mySA.getListOfEnumerationMembers();
        expect(allEnumList.length).toBe(256);
    });

    test('getListOfEnumerationMembers() latest', async() => {
        const mySA = new SDOAdapter();
        await mySA.addVocabularies([await mySA.constructSDOVocabularyURL('latest'), VOC_OBJ_ZOO]);
        const allEnumList = mySA.getListOfEnumerationMembers();
        expect(allEnumList.length > 250).toBe(true);
    });

    test('getAllEnumerationMembers()', async() => {
        const mySA = new SDOAdapter();
        await mySA.addVocabularies([VOC_OBJ_SDO3_7, VOC_OBJ_ZOO]);
        const allDT = mySA.getAllEnumerationMembers();
        expect(allDT.length).toBe(256);
        for (let i = 0; i < allDT.length; i++) {
            expect(allDT[i].getTermType()).toBe('soa:EnumerationMember');
        }
    });

    test('getAllEnumerationMembers() latest', async() => {
        const mySA = new SDOAdapter();
        await mySA.addVocabularies([await mySA.constructSDOVocabularyURL('latest'), VOC_OBJ_ZOO]);
        const allDT = mySA.getAllEnumerationMembers();
        expect(allDT.length > 250).toBe(true);
        for (let i = 0; i < allDT.length; i++) {
            expect(allDT[i].getTermType()).toBe('soa:EnumerationMember');
        }
    });

    test('fetch vocab by URL - direct URL', async() => {
        const mySA = new SDOAdapter();
        await mySA.addVocabularies([VOC_URL_SDO5_0_DIRECT]);
        const data1a = mySA.getAllProperties();
        console.log(data1a.length);
        expect(data1a.length > 1000).toEqual(true);
    });

    test('construct SDO URL', async() => {
        const mySA = new SDOAdapter();
        const url = await mySA.constructSDOVocabularyURL('9.0');
        console.log(url);
        expect(url).toBe('https://raw.githubusercontent.com/schemaorg/schemaorg/main/data/releases/9.0/schemaorg-all-http.jsonld');
        const url2 = await mySA.constructSDOVocabularyURL('3.9');
        console.log(url2);
        expect(url2).toBe('https://raw.githubusercontent.com/schemaorg/schemaorg/main/data/releases/3.9/all-layers.jsonld');
    });

    test('get lastest sdo version', async() => {
        const mySA = new SDOAdapter();
        const latestVersion = await mySA.getLatestSDOVersion();
        console.log(latestVersion);
        expect(Number(latestVersion) > 5).toBe(true);
        expect(Object.keys(mySA.retrievalMemory.versionsFile.releaseLog).includes(latestVersion)).toBe(true);
    });
});
