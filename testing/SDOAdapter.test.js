const SDOAdapter = require("../src/node/SDOAdapterNode");
const VOC_OBJ_DACH = require('../testData/dachkg_1');
const VOC_OBJ_SDO3_7 = require('../testData/schema_3.7');
const VOC_OBJ_Jan = require('../testData/testjan');

describe('SDO Adapter methods', () => {

    test("addVocabularies()", async () => {
        let mySA = new SDOAdapter();
        await mySA.addVocabularies([VOC_OBJ_SDO3_7, VOC_OBJ_Jan], null);
    });

    test("getVocabularies()", async () => {
        let mySA = new SDOAdapter();
        await mySA.addVocabularies([VOC_OBJ_SDO3_7, VOC_OBJ_DACH], null);
        let vocabs = mySA.getVocabularies();
        expect(Object.keys(vocabs).length).toBe(2);
        expect(vocabs["schema"]).not.toBe(undefined);
        expect(vocabs["dachkg"]).not.toBe(undefined);
        expect(vocabs["dachkg"]).toBe("http://dachkg.org/ontology/1.0/");
    });

    test("getClass()", async () => {
        let mySA = new SDOAdapter();
        await mySA.addVocabularies([VOC_OBJ_SDO3_7, VOC_OBJ_DACH], null);
        let Hotel = mySA.getClass("schema:Hotel");
        expect(Hotel.getTermType()).toBe("rdfs:Class");
    });

    test("getListOfClasses()", async () => {
        let mySA = new SDOAdapter();
        await mySA.addVocabularies([VOC_OBJ_SDO3_7, VOC_OBJ_DACH], null);
        let allClassesList = mySA.getListOfClasses();
        expect(allClassesList.length).toBe(732);
    });

    test("getAllClasses()", async () => {
        let mySA = new SDOAdapter();
        await mySA.addVocabularies([VOC_OBJ_SDO3_7, VOC_OBJ_DACH], null);
        let allClasses = mySA.getAllClasses();
        expect(allClasses.length).toBe(732);
        let allClassesDachKG = mySA.getAllClasses({"fromVocabulary": "dachkg"});
        expect(allClassesDachKG.length).toBe(1);
        let allClassesSchema = mySA.getAllClasses({"fromVocabulary": "schema"});
        expect(allClassesSchema.length).toBe(731);
        for (let i = 0; i < allClasses.length; i++) {
            expect(allClasses[i].getTermType()).toBe("rdfs:Class");
        }
    });

    test("getProperty()", async () => {
        let mySA = new SDOAdapter();
        await mySA.addVocabularies([VOC_OBJ_SDO3_7, VOC_OBJ_DACH], null);
        let address = mySA.getProperty("schema:address");
        expect(address.getTermType()).toBe("rdf:Property");
    });

    test("getListOfProperties()", async () => {
        let mySA = new SDOAdapter();
        await mySA.addVocabularies([VOC_OBJ_SDO3_7, VOC_OBJ_DACH], null);
        let allPropertiesList = mySA.getListOfProperties();
        expect(allPropertiesList.length).toBe(1243);
    });

    test("getAllProperties()", async () => {
        let mySA = new SDOAdapter();
        await mySA.addVocabularies([VOC_OBJ_SDO3_7, VOC_OBJ_DACH], null);
        let allProperties = mySA.getAllProperties();
        expect(allProperties.length).toBe(1243);
        let allPropertiesDachKG = mySA.getAllProperties({"fromVocabulary": "dachkg"});
        expect(allPropertiesDachKG.length).toBe(2);
        let allPropertiesSchema = mySA.getAllProperties({"fromVocabulary": "schema"});
        expect(allPropertiesSchema.length).toBe(1241);
        for (let i = 0; i < allProperties.length; i++) {
            expect(allProperties[i].getTermType()).toBe("rdf:Property");
        }
    });

    test("getDataType()", async () => {
        let mySA = new SDOAdapter();
        await mySA.addVocabularies([VOC_OBJ_SDO3_7, VOC_OBJ_DACH], null);
        let Number = mySA.getDataType("schema:Number");
        expect(Number.getTermType()).toBe("schema:DataType");
    });

    test("getListOfDataTypes()", async () => {
        let mySA = new SDOAdapter();
        await mySA.addVocabularies([VOC_OBJ_SDO3_7, VOC_OBJ_DACH], null);
        let allDataTypesList = mySA.getListOfDataTypes();
        expect(allDataTypesList.length).toBe(11);
    });

    test("getAllDataTypes()", async () => {
        let mySA = new SDOAdapter();
        await mySA.addVocabularies([VOC_OBJ_SDO3_7, VOC_OBJ_DACH], null);
        let allDT = mySA.getAllDataTypes();
        expect(allDT.length).toBe(11);
        let allDT_dachkg = mySA.getAllDataTypes({"fromVocabulary": "dachkg"});
        expect(allDT_dachkg.length).toBe(0);
        let allDT_schema = mySA.getAllDataTypes({"fromVocabulary": "schema"});
        expect(allDT_schema.length).toBe(11);
        for (let i = 0; i < allDT.length; i++) {
            expect(allDT[i].getTermType()).toBe("schema:DataType");
        }
    });

    test("getEnumeration()", async () => {
        let mySA = new SDOAdapter();
        await mySA.addVocabularies([VOC_OBJ_SDO3_7, VOC_OBJ_DACH], null);
        let DayOfWeek = mySA.getEnumeration("schema:DayOfWeek");
        expect(DayOfWeek.getTermType()).toBe("schema:Enumeration");
    });

    test("getListOfEnumerations()", async () => {
        let mySA = new SDOAdapter();
        await mySA.addVocabularies([VOC_OBJ_SDO3_7, VOC_OBJ_DACH], null);
        let allEnumList = mySA.getListOfEnumerations();
        expect(allEnumList.length).toBe(59);
    });

    test("getAllEnumerations()", async () => {
        let mySA = new SDOAdapter();
        await mySA.addVocabularies([VOC_OBJ_SDO3_7, VOC_OBJ_DACH], null);
        let allDT = mySA.getAllEnumerations();
        expect(allDT.length).toBe(59);
        for (let i = 0; i < allDT.length; i++) {
            expect(allDT[i].getTermType()).toBe("schema:Enumeration");
        }
    });

    test("getEnumerationMember()", async () => {
        let mySA = new SDOAdapter();
        await mySA.addVocabularies([VOC_OBJ_SDO3_7, VOC_OBJ_DACH], null);
        let Friday = mySA.getEnumerationMember("schema:Friday");
        expect(Friday.getTermType()).toBe("soa:EnumerationMember");
    });

    test("getListOfEnumerationMembers()", async () => {
        let mySA = new SDOAdapter();
        await mySA.addVocabularies([VOC_OBJ_SDO3_7, VOC_OBJ_DACH], null);
        let allEnumList = mySA.getListOfEnumerationMembers();
        expect(allEnumList.length).toBe(253);
    });

    test("getAllEnumerationMembers()", async () => {
        let mySA = new SDOAdapter();
        await mySA.addVocabularies([VOC_OBJ_SDO3_7, VOC_OBJ_DACH], null);
        let allDT = mySA.getAllEnumerationMembers();
        expect(allDT.length).toBe(253);
        for (let i = 0; i < allDT.length; i++) {
            expect(allDT[i].getTermType()).toBe("soa:EnumerationMember");
        }
    });
});
