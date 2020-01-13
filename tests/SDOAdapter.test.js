const SDOAdapter = require("../src/SDOAdapter");
const VOC_OBJ_DACH = require('./data/dachkg_1');
const VOC_OBJ_SDO3_7 = require('./data/schema_3.7');
const VOC_OBJ_SDO5_0 = require('./data/schema_5.0');
const VOC_OBJ_GWON = require('./data/graph_with_one_node');
const VOC_URL_DACH = "https://raw.githubusercontent.com/STIInnsbruck/dachkg-schema/master/schema/dachkg_trail.json";
const VOC_URL_SDO_LATEST = "https://schema.org/version/latest/all-layers.jsonld";
const VOC_URL_SDO5_0 = "https://raw.githubusercontent.com/schemaorg/schemaorg/master/data/releases/5.0/all-layers.jsonld";
const VOC_URL_SDO5_0_shorter = "https://schema.org/version/5.0/all-layers.jsonld";
const VOC_URL_SDO5_0_http = "http://raw.githubusercontent.com/schemaorg/schemaorg/master/data/releases/5.0/all-layers.jsonld";

describe('SDO Adapter methods', () => {

    test("addVocabularies()", async () => {
        let mySA = new SDOAdapter();
        await mySA.addVocabularies([VOC_OBJ_SDO3_7, VOC_OBJ_GWON]);
    });

    test("getVocabularies()", async () => {
        let mySA = new SDOAdapter();
        await mySA.addVocabularies([VOC_OBJ_SDO3_7, VOC_OBJ_DACH]);
        let vocabs = mySA.getVocabularies();
        expect(Object.keys(vocabs).length).toBe(2);
        expect(vocabs["schema"]).not.toBe(undefined);
        expect(vocabs["dachkg"]).not.toBe(undefined);
        expect(vocabs["dachkg"]).toBe("http://dachkg.org/ontology/1.0/");
    });

    test("getClass()", async () => {
        let mySA = new SDOAdapter();
        await mySA.addVocabularies([VOC_URL_SDO5_0_http, VOC_URL_DACH]);
        let Hotel = mySA.getClass("schema:Hotel");
        expect(Hotel.getTermType()).toBe("rdfs:Class");
    });

    test("getListOfClasses()", async () => {
        let mySA = new SDOAdapter();
        await mySA.addVocabularies([VOC_OBJ_SDO3_7, VOC_OBJ_DACH]);
        let allClassesList = mySA.getListOfClasses();
        expect(allClassesList.length).toBe(732);
    });

    test("getAllClasses()", async () => {
        let mySA = new SDOAdapter();
        await mySA.addVocabularies([VOC_OBJ_SDO3_7, VOC_OBJ_DACH]);
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
        await mySA.addVocabularies([VOC_OBJ_SDO3_7, VOC_OBJ_DACH]);
        let address = mySA.getProperty("schema:address");
        expect(address.getTermType()).toBe("rdf:Property");
    });

    test("getListOfProperties()", async () => {
        let mySA = new SDOAdapter();
        await mySA.addVocabularies([VOC_OBJ_SDO3_7, VOC_OBJ_DACH]);
        let allPropertiesList = mySA.getListOfProperties();
        expect(allPropertiesList.length).toBe(1243);
    });

    test("getAllProperties()", async () => {
        let mySA = new SDOAdapter();
        await mySA.addVocabularies([VOC_OBJ_SDO3_7, VOC_OBJ_DACH]);
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
        await mySA.addVocabularies([VOC_OBJ_SDO3_7, VOC_OBJ_DACH]);
        let Number = mySA.getDataType("schema:Number");
        expect(Number.getTermType()).toBe("schema:DataType");
    });

    test("getListOfDataTypes()", async () => {
        let mySA = new SDOAdapter();
        await mySA.addVocabularies([VOC_OBJ_SDO3_7, VOC_OBJ_DACH]);
        let allDataTypesList = mySA.getListOfDataTypes();
        expect(allDataTypesList.length).toBe(11);
    });

    test("getAllDataTypes()", async () => {
        let mySA = new SDOAdapter();
        await mySA.addVocabularies([VOC_OBJ_SDO3_7, VOC_OBJ_DACH]);
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
        await mySA.addVocabularies([VOC_OBJ_SDO3_7, VOC_OBJ_DACH]);
        let DayOfWeek = mySA.getEnumeration("schema:DayOfWeek");
        expect(DayOfWeek.getTermType()).toBe("schema:Enumeration");
    });

    test("getListOfEnumerations()", async () => {
        let mySA = new SDOAdapter();
        await mySA.addVocabularies([VOC_OBJ_SDO3_7, VOC_OBJ_DACH]);
        let allEnumList = mySA.getListOfEnumerations();
        expect(allEnumList.length).toBe(59);
    });

    test("getAllEnumerations()", async () => {
        let mySA = new SDOAdapter();
        await mySA.addVocabularies([VOC_OBJ_SDO3_7, VOC_OBJ_DACH]);
        let allDT = mySA.getAllEnumerations();
        expect(allDT.length).toBe(59);
        for (let i = 0; i < allDT.length; i++) {
            expect(allDT[i].getTermType()).toBe("schema:Enumeration");
        }
    });

    test("getEnumerationMember()", async () => {
        let mySA = new SDOAdapter();
        await mySA.addVocabularies([VOC_OBJ_SDO3_7, VOC_OBJ_DACH]);
        let Friday = mySA.getEnumerationMember("schema:Friday");
        expect(Friday.getTermType()).toBe("soa:EnumerationMember");
    });

    test("getListOfEnumerationMembers()", async () => {
        let mySA = new SDOAdapter();
        await mySA.addVocabularies([VOC_OBJ_SDO3_7, VOC_OBJ_DACH]);
        let allEnumList = mySA.getListOfEnumerationMembers();
        expect(allEnumList.length).toBe(253);
    });

    test("getAllEnumerationMembers()", async () => {
        let mySA = new SDOAdapter();
        await mySA.addVocabularies([VOC_OBJ_SDO3_7, VOC_OBJ_DACH]);
        let allDT = mySA.getAllEnumerationMembers();
        expect(allDT.length).toBe(253);
        for (let i = 0; i < allDT.length; i++) {
            expect(allDT[i].getTermType()).toBe("soa:EnumerationMember");
        }
    });

    test("fetch vocab by URL - https - dachkg", async () => {
            let mySA = new SDOAdapter();
            await mySA.addVocabularies([VOC_OBJ_SDO3_7, VOC_URL_DACH]);
            let data1a = mySA.getAllProperties({"fromVocabulary": "dachkg"});
            console.log(JSON.stringify(data1a, null, 2));
            let mySAMerged = new SDOAdapter();
            await mySAMerged.addVocabularies([VOC_OBJ_SDO3_7, VOC_URL_DACH]);
            let data1b = mySAMerged.getAllProperties({"fromVocabulary": "dachkg"});
            console.log(JSON.stringify(data1b, null, 2));
            expect(data1a).toEqual(data1b);
            console.log(JSON.stringify(mySAMerged.getClass("Hotel"), null, 2));
            console.log(JSON.stringify(mySAMerged.getProperty("alcoholWarning"), null, 2));
            console.log(JSON.stringify(mySAMerged.getClass("dachkg:Trail"), null, 2));
        }
    );
    test("fetch vocab by URL - https - sdo", async () => {
            let mySA = new SDOAdapter();
            await mySA.addVocabularies([VOC_URL_SDO5_0]);
            let data1a = mySA.getAllProperties();
            console.log(data1a.length);
            let mySAMerged = new SDOAdapter();
            await mySAMerged.addVocabularies([VOC_URL_SDO5_0_http]);
            let data1b = mySAMerged.getAllProperties();
            console.log(data1b.length);
            expect(data1a[2]).toEqual(data1b[2]);
            expect(data1a[52]).toEqual(data1b[52]);
            expect(data1a[642]).toEqual(data1b[642]);
            expect(data1a[212]).toEqual(data1b[212]);
            expect(data1a[1202]).toEqual(data1b[1202]);
        }
    );
    test("fetch vocab by URL - https - shorter", async () => {
            let mySA = new SDOAdapter();
            await mySA.addVocabularies([VOC_URL_SDO5_0_shorter]);
            let data1a = mySA.getAllProperties();
            console.log(data1a.length);
            let mySAMerged = new SDOAdapter();
            await mySAMerged.addVocabularies([VOC_URL_SDO5_0_shorter]);
            let data1b = mySAMerged.getAllProperties();
            console.log(data1b.length);
            expect(data1a[2]).toEqual(data1b[2]);
            expect(data1a[52]).toEqual(data1b[52]);
            expect(data1a[642]).toEqual(data1b[642]);
            expect(data1a[212]).toEqual(data1b[212]);
            expect(data1a[1202]).toEqual(data1b[1202]);
        }
    );
    test("fetch vocab by URL - sdo latest ", async () => {
            let mySA2 = new SDOAdapter();
            await mySA2.addVocabularies([VOC_URL_SDO_LATEST]);
            let data1b = mySA2.getAllProperties();
            console.log(data1b.length);
            expect(data1b.length > 1000).toBe(true);
        }
    );

    test("construct SDO URL", async () => {
            let mySA = new SDOAdapter();
            let url = await mySA.getSDOVocabularyURL();
            let versionPosition = "https://raw.githubusercontent.com/schemaorg/schemaorg/master/data/releases/".length;
            expect(Number(url.substring(versionPosition, versionPosition + 3)) > 5).toBe(true);
            expect(url.includes("schema.jsonld")).toBe(true);
            let url2 = await mySA.getSDOVocabularyURL("latest");
            expect(Number(url2.substring(versionPosition, versionPosition + 3)) > 5).toBe(true);
            expect(url2.includes("schema.jsonld")).toBe(true);
            let url3 = await mySA.getSDOVocabularyURL("latest", "all-layers");
            expect(Number(url3.substring(versionPosition, versionPosition + 3)) > 5).toBe(true);
            expect(url3.includes("all-layers.jsonld")).toBe(true);
            let url4 = await mySA.getSDOVocabularyURL("3.9", "all-layers");
            expect(url4).toBe("https://raw.githubusercontent.com/schemaorg/schemaorg/master/data/releases/3.9/all-layers.jsonld");
            let url5 = await mySA.getSDOVocabularyURL("3.9", "auto");
            expect(url5).toBe("https://raw.githubusercontent.com/schemaorg/schemaorg/master/data/releases/3.9/auto.jsonld");
        }
    );
});
