const SDOAdapter = require("../src/SDOAdapter");
const VOC_OBJ_ZOO = require("./data/vocabulary-animal.json");
const VOC_OBJ_ZOO_NO_SCHEMA_IN_CONTEXT = require("./data/vocabulary-animal-2.json");
const VOC_OBJ_SDO3_7 = require("./data/schema-3.7.json");
const VOC_OBJ_SDO10_0 = require("./data/schema-10.0.json");
const VOC_OBJ_GWON = require("./data/graph-with-one-node.json");
const VOC_URL_ZOO =
  "https://raw.githubusercontent.com/semantifyit/schema-org-adapter/master/tests/data/vocabulary-animal.json";
const VOC_URL_SDO10_0 =
  "https://raw.githubusercontent.com/semantifyit/schemaorg/main/data/releases/10.0/schemaorg-all-https.jsonld";
const { debugFunc, debugFuncErr } = require("./testUtility");

/**
 *  Tests regarding the JS-Class for "SDOAdapter"
 */
describe("SDO Adapter methods", () => {
  test("addVocabularies()", async () => {
    const mySA = new SDOAdapter({
      commitBase: global.commitBase,
      schemaHttps: true,
      onError: debugFuncErr,
    });
    await mySA.addVocabularies([VOC_OBJ_SDO3_7, VOC_OBJ_GWON]);
    const testClass = mySA.getClass("namespace:AwesomePerson");
    expect(testClass.getName()).toEqual("validValue");
    // await mySA.addVocabularies('http://noVocab.com')
    await expect(mySA.addVocabularies("http://noVocab.com")).rejects.toEqual(
      Error(
        "The given URL http://noVocab.com did not contain a valid JSON-LD vocabulary."
      )
    );
    await expect(mySA.addVocabularies([true])).rejects.toEqual(
      Error(
        "The first argument of the function must be an Array of vocabularies or a single vocabulary (JSON-LD as Object/String)"
      )
    );
    await mySA.addVocabularies(JSON.stringify(VOC_OBJ_SDO3_7)); // try stringified version
  });

  test("addVocabularies() add single vocabulary", async () => {
    const mySA = new SDOAdapter({
      commitBase: global.commitBase,
      schemaHttps: false,
      onError: debugFuncErr,
    });
    await mySA.addVocabularies(VOC_OBJ_SDO3_7);
    const testClass = mySA.getClass("schema:Hotel");
    expect(testClass.getName()).toEqual("Hotel");
  });

  test("addVocabularies() latest", async () => {
    const mySA = new SDOAdapter({
      commitBase: global.commitBase,
      onError: debugFuncErr,
    });
    await mySA.addVocabularies([
      await mySA.constructSDOVocabularyURL("latest"),
      VOC_OBJ_GWON,
    ]);
    const testClass = mySA.getClass("namespace:AwesomePerson");
    expect(testClass.getName()).toEqual("validValue");
  });

  test("getVocabularies()", async () => {
    const mySA = new SDOAdapter({
      commitBase: global.commitBase,
      onError: debugFuncErr,
    });
    await mySA.addVocabularies([VOC_OBJ_SDO10_0, VOC_OBJ_ZOO]);
    const vocabs = mySA.getVocabularies();
    expect(Object.keys(vocabs).length).toBe(2);
    expect(vocabs.schema).not.toBe(undefined);
    expect(vocabs.ex).not.toBe(undefined);
    expect(vocabs.ex).toBe("https://example-vocab.ex/");
  });

  test("getVocabularies() latest", async () => {
    const mySA = new SDOAdapter({
      commitBase: global.commitBase,
      onError: debugFuncErr,
    });
    await mySA.addVocabularies([
      await mySA.constructSDOVocabularyURL("latest"),
      VOC_OBJ_ZOO,
    ]);
    const vocabs = mySA.getVocabularies();
    expect(Object.keys(vocabs).length).toBe(2);
    expect(vocabs.schema).not.toBe(undefined);
    expect(vocabs.ex).not.toBe(undefined);
    expect(vocabs.ex).toBe("https://example-vocab.ex/");
  });

  test("getTerm()", async () => {
    const mySA = new SDOAdapter({ schemaHttps: false, onError: debugFuncErr });
    await mySA.addVocabularies(VOC_OBJ_SDO3_7);
    const hospital = mySA.getClass("schema:Hospital");
    const hospital2 = mySA.getTerm("schema:Hospital");
    expect(hospital).toEqual(hospital2);
    const address = mySA.getProperty("schema:address");
    const address2 = mySA.getTerm("schema:address");
    expect(address).toEqual(address2);
    const numb = mySA.getDataType("schema:Number");
    const numb2 = mySA.getTerm("schema:Number");
    expect(numb).toEqual(numb2);
    const DayOfWeek = mySA.getEnumeration("schema:DayOfWeek");
    const DayOfWeek2 = mySA.getTerm("schema:DayOfWeek");
    expect(DayOfWeek).toEqual(DayOfWeek2);
    const Friday = mySA.getEnumerationMember("schema:Friday");
    const Friday2 = mySA.getTerm("schema:Friday");
    expect(Friday).toEqual(Friday2);
  });

  test("getTerm() latest", async () => {
    const mySA = new SDOAdapter({ onError: debugFuncErr });
    await mySA.addVocabularies(await mySA.constructSDOVocabularyURL("latest"));
    const hospital = mySA.getClass("schema:Hospital");
    const hospital2 = mySA.getTerm("schema:Hospital");
    expect(hospital).toEqual(hospital2);
    const address = mySA.getProperty("schema:address");
    const address2 = mySA.getTerm("schema:address");
    expect(address).toEqual(address2);
    const numb = mySA.getDataType("schema:Number");
    const numb2 = mySA.getTerm("schema:Number");
    expect(numb).toEqual(numb2);
    const DayOfWeek = mySA.getEnumeration("schema:DayOfWeek");
    const DayOfWeek2 = mySA.getTerm("schema:DayOfWeek");
    expect(DayOfWeek).toEqual(DayOfWeek2);
    const Friday = mySA.getEnumerationMember("schema:Friday");
    const Friday2 = mySA.getTerm("schema:Friday");
    expect(Friday).toEqual(Friday2);
  });

  test("getListOfTerms()", async () => {
    const mySA = new SDOAdapter({
      commitBase: global.commitBase,
      onError: debugFuncErr,
    });
    await mySA.addVocabularies([VOC_OBJ_SDO10_0, VOC_OBJ_ZOO]);
    const allTermsList = mySA.getListOfTerms();
    expect(allTermsList.length > 1000).toBe(true);
    expect(allTermsList.includes("schema:DayOfWeek")).toBe(true);
    expect(allTermsList.includes("schema:Hotel")).toBe(true);
    expect(allTermsList.includes("schema:address")).toBe(true);
    expect(allTermsList.includes("schema:Text")).toBe(true);
    expect(allTermsList.includes("schema:Monday")).toBe(true);
    expect(allTermsList.includes("ex:Tiger")).toBe(true);
  });

  test("getAllTerms()", async () => {
    const mySA = new SDOAdapter({
      commitBase: global.commitBase,
      onError: debugFuncErr,
    });
    await mySA.addVocabularies([VOC_OBJ_SDO10_0, VOC_OBJ_ZOO]);
    const allTerms = mySA.getAllTerms();
    expect(allTerms.length > 1000).toBe(true);
    let count = {
      c: 0,
      p: 0,
      en: 0,
      enm: 0,
      dt: 0,
    };
    for (const actTerm of allTerms) {
      switch (actTerm.getTermType()) {
        case "rdfs:Class":
          count.c++;
          break;
        case "rdf:Property":
          count.p++;
          break;
        case "schema:Enumeration":
          count.en++;
          break;
        case "soa:EnumerationMember":
          count.enm++;
          break;
        case "schema:DataType":
          count.dt++;
          break;
      }
    }
    expect(count.c).toBe(mySA.getListOfClasses().length);
    expect(count.p).toBe(mySA.getListOfProperties().length);
    expect(count.en).toBe(mySA.getListOfEnumerations().length);
    expect(count.enm).toBe(mySA.getListOfEnumerationMembers().length);
    expect(count.dt).toBe(mySA.getListOfDataTypes().length);
  });

  test("getAllTerms() latest", async () => {
    const mySA = new SDOAdapter({
      commitBase: global.commitBase,
      onError: debugFuncErr,
    });
    await mySA.addVocabularies([
      await mySA.constructSDOVocabularyURL("latest"),
      VOC_URL_ZOO,
    ]);
    const allTerms = mySA.getAllTerms();
    expect(allTerms.length > 1000).toBe(true);
    let count = {
      c: 0,
      p: 0,
      en: 0,
      enm: 0,
      dt: 0,
    };
    for (const actTerm of allTerms) {
      switch (actTerm.getTermType()) {
        case "rdfs:Class":
          count.c++;
          break;
        case "rdf:Property":
          count.p++;
          break;
        case "schema:Enumeration":
          count.en++;
          break;
        case "soa:EnumerationMember":
          count.enm++;
          break;
        case "schema:DataType":
          count.dt++;
          break;
      }
    }
    expect(count.c).toBe(mySA.getListOfClasses().length);
    expect(count.p).toBe(mySA.getListOfProperties().length);
    expect(count.en).toBe(mySA.getListOfEnumerations().length);
    expect(count.enm).toBe(mySA.getListOfEnumerationMembers().length);
    expect(count.dt).toBe(mySA.getListOfDataTypes().length);
  });

  test("getClass()", async () => {
    const mySA = new SDOAdapter({
      commitBase: global.commitBase,
      onError: debugFuncErr,
    });
    await mySA.addVocabularies([VOC_OBJ_SDO10_0, VOC_URL_ZOO]);
    const Hotel = mySA.getClass("schema:Hotel");
    expect(Hotel.getTermType()).toBe("rdfs:Class");
  });

  test("getClass() latest", async () => {
    const mySA = new SDOAdapter({
      commitBase: global.commitBase,
      onError: debugFuncErr,
    });
    await mySA.addVocabularies([
      await mySA.constructSDOVocabularyURL("latest"),
      VOC_URL_ZOO,
    ]);
    const Hotel = mySA.getClass("schema:Hotel");
    expect(Hotel.getTermType()).toBe("rdfs:Class");
  });

  test("getListOfClasses()", async () => {
    const mySA = new SDOAdapter({
      commitBase: global.commitBase,
      onError: debugFuncErr,
    });
    await mySA.addVocabularies([VOC_OBJ_SDO10_0, VOC_OBJ_ZOO]);
    const allClassesList = mySA.getListOfClasses();
    expect(allClassesList.length).toBe(777);
    expect(allClassesList.includes("schema:DayOfWeek")).toBe(false); // should NOT contain enumerations
  });

  test("getAllClasses()", async () => {
    const mySA = new SDOAdapter({
      commitBase: global.commitBase,
      onError: debugFuncErr,
    });
    await mySA.addVocabularies([VOC_OBJ_SDO10_0, VOC_OBJ_ZOO]);
    const allClasses = mySA.getAllClasses();
    expect(allClasses.length).toBe(777);
    const allClassesZoo = mySA.getAllClasses({ fromVocabulary: "ex" });
    expect(allClassesZoo.length).toBe(2);
    const allClassesSchema = mySA.getAllClasses({ fromVocabulary: "schema" });
    expect(allClassesSchema.length).toBe(775);
    for (const actClass of allClasses) {
      expect(actClass.getTermType()).toBe("rdfs:Class"); // should NOT contain enumerations
    }
  });

  test("getAllClasses() latest", async () => {
    const mySA = new SDOAdapter({
      commitBase: global.commitBase,
      onError: debugFuncErr,
    });
    await mySA.addVocabularies([
      await mySA.constructSDOVocabularyURL("latest"),
      VOC_OBJ_ZOO,
    ]);
    const allClasses = mySA.getAllClasses();
    expect(allClasses.length > 700).toBe(true);
    const allClassesZoo = mySA.getAllClasses({ fromVocabulary: "ex" });
    expect(allClassesZoo.length).toBe(2);
    const allClassesSchema = mySA.getAllClasses({ fromVocabulary: "schema" });
    expect(allClassesSchema.length === allClasses.length - 2).toBe(true);
    for (const actClass of allClasses) {
      expect(actClass.getTermType()).toBe("rdfs:Class"); // should NOT contain enumerations
    }
  });

  test("getProperty()", async () => {
    const mySA = new SDOAdapter({
      commitBase: global.commitBase,
      onError: debugFuncErr,
    });
    await mySA.addVocabularies([VOC_OBJ_SDO10_0, VOC_OBJ_ZOO]);
    const address = mySA.getProperty("schema:address");
    expect(address.getTermType()).toBe("rdf:Property");
  });

  test("getProperty() latest", async () => {
    const mySA = new SDOAdapter({
      commitBase: global.commitBase,
      onError: debugFuncErr,
    });
    await mySA.addVocabularies([
      await mySA.constructSDOVocabularyURL("latest"),
      VOC_OBJ_ZOO,
    ]);
    const address = mySA.getProperty("schema:address");
    expect(address.getTermType()).toBe("rdf:Property");
  });

  test("getListOfProperties()", async () => {
    const mySA = new SDOAdapter({
      commitBase: global.commitBase,
      onError: debugFuncErr,
    });
    await mySA.addVocabularies([VOC_OBJ_SDO3_7, VOC_OBJ_ZOO]);
    const allPropertiesList = mySA.getListOfProperties();
    expect(allPropertiesList.length).toBe(1243);
  });

  test("getListOfProperties() latest", async () => {
    const mySA = new SDOAdapter({
      commitBase: global.commitBase,
      onError: debugFuncErr,
    });
    await mySA.addVocabularies([
      await mySA.constructSDOVocabularyURL("latest"),
      VOC_OBJ_ZOO,
    ]);
    const allPropertiesList = mySA.getListOfProperties();
    expect(allPropertiesList.length > 1200).toBe(true);
  });

  test("getAllProperties()", async () => {
    const mySA = new SDOAdapter({
      commitBase: global.commitBase,
      onError: debugFuncErr,
    });
    await mySA.addVocabularies([VOC_OBJ_SDO10_0, VOC_OBJ_ZOO]);
    const allProperties = mySA.getAllProperties();
    expect(allProperties.length).toBe(1376);
    const allPropertiesEx = mySA.getAllProperties({ fromVocabulary: "ex" });
    expect(allPropertiesEx.length).toBe(2);
    const allPropertiesSchema = mySA.getAllProperties({
      fromVocabulary: "schema",
    });
    expect(allPropertiesSchema.length).toBe(1374);
    for (const actProperty of allProperties) {
      expect(actProperty.getTermType()).toBe("rdf:Property");
    }
  });

  test("getAllProperties() latest", async () => {
    const mySA = new SDOAdapter({
      commitBase: global.commitBase,
      onError: debugFuncErr,
    });
    await mySA.addVocabularies([
      await mySA.constructSDOVocabularyURL("latest"),
      VOC_OBJ_ZOO,
    ]);
    const allProperties = mySA.getAllProperties();
    expect(allProperties.length > 1200).toBe(true);
    const allPropertiesEx = mySA.getAllProperties({ fromVocabulary: "ex" });
    expect(allPropertiesEx.length).toBe(2);
    const allPropertiesSchema = mySA.getAllProperties({
      fromVocabulary: "schema",
    });
    expect(allPropertiesSchema.length === allProperties.length - 2).toBe(true);
    for (const actProperty of allProperties) {
      expect(actProperty.getTermType()).toBe("rdf:Property");
    }
  });

  test("getDataType()", async () => {
    const mySA = new SDOAdapter({
      commitBase: global.commitBase,
      onError: debugFuncErr,
    });
    await mySA.addVocabularies([VOC_OBJ_SDO10_0, VOC_OBJ_ZOO]);
    const Number = mySA.getDataType("schema:Number");
    expect(Number.getTermType()).toBe("schema:DataType");
  });

  test("getDataType() latest", async () => {
    const mySA = new SDOAdapter({
      commitBase: global.commitBase,
      onError: debugFuncErr,
    });
    await mySA.addVocabularies([
      await mySA.constructSDOVocabularyURL("latest"),
      VOC_OBJ_ZOO,
    ]);
    const Number = mySA.getDataType("schema:Number");
    expect(Number.getTermType()).toBe("schema:DataType");
  });

  test("getListOfDataTypes()", async () => {
    const mySA = new SDOAdapter({
      commitBase: global.commitBase,
      onError: debugFuncErr,
    });
    await mySA.addVocabularies([VOC_OBJ_SDO10_0, VOC_OBJ_ZOO]);
    const allDataTypesList = mySA.getListOfDataTypes();
    expect(allDataTypesList.length).toBe(12);
  });

  test("getListOfDataTypes() latest", async () => {
    const mySA = new SDOAdapter({
      commitBase: global.commitBase,
      onError: debugFuncErr,
    });
    await mySA.addVocabularies([
      await mySA.constructSDOVocabularyURL("latest"),
      VOC_OBJ_ZOO,
    ]);
    const allDataTypesList = mySA.getListOfDataTypes();
    expect(allDataTypesList.length > 10).toBe(true);
  });

  test("getAllDataTypes()", async () => {
    const mySA = new SDOAdapter({
      commitBase: global.commitBase,
      onError: debugFuncErr,
    });
    await mySA.addVocabularies([VOC_OBJ_SDO10_0, VOC_OBJ_ZOO]);
    const allDT = mySA.getAllDataTypes();
    expect(allDT.length).toBe(12);
    const allDataTypesFromEx = mySA.getAllDataTypes({ fromVocabulary: "ex" });
    expect(allDataTypesFromEx.length).toBe(0);
    const allDataTypesFromSDO = mySA.getAllDataTypes({
      fromVocabulary: "schema",
    });
    expect(allDataTypesFromSDO.length).toBe(12);
    for (const actDT of allDT) {
      expect(actDT.getTermType()).toBe("schema:DataType");
    }
  });

  test("getAllDataTypes() latest", async () => {
    const mySA = new SDOAdapter({
      commitBase: global.commitBase,
      onError: debugFuncErr,
    });
    await mySA.addVocabularies([
      await mySA.constructSDOVocabularyURL("latest"),
      VOC_OBJ_ZOO,
    ]);
    const allDT = mySA.getAllDataTypes();
    expect(allDT.length > 10).toBe(true);
    const allDataTypesFromEx = mySA.getAllDataTypes({ fromVocabulary: "ex" });
    expect(allDataTypesFromEx.length).toBe(0);
    const allDataTypesFromSDO = mySA.getAllDataTypes({
      fromVocabulary: "schema",
    });
    expect(allDataTypesFromSDO.length > 10).toBe(true);
    for (const actDT of allDT) {
      expect(actDT.getTermType()).toBe("schema:DataType");
    }
  });

  test("getEnumeration()", async () => {
    const mySA = new SDOAdapter({
      commitBase: global.commitBase,
      onError: debugFuncErr,
    });
    await mySA.addVocabularies([VOC_OBJ_SDO10_0, VOC_OBJ_ZOO]);
    const DayOfWeek = mySA.getEnumeration("schema:DayOfWeek");
    expect(DayOfWeek.getTermType()).toBe("schema:Enumeration");
  });

  test("getEnumeration() latest", async () => {
    const mySA = new SDOAdapter({
      commitBase: global.commitBase,
      onError: debugFuncErr,
    });
    await mySA.addVocabularies([
      await mySA.constructSDOVocabularyURL("latest"),
      VOC_OBJ_ZOO,
    ]);
    const DayOfWeek = mySA.getEnumeration("schema:DayOfWeek");
    expect(DayOfWeek.getTermType()).toBe("schema:Enumeration");
  });

  test("getListOfEnumerations()", async () => {
    const mySA = new SDOAdapter({
      commitBase: global.commitBase,
      onError: debugFuncErr,
    });
    await mySA.addVocabularies([VOC_OBJ_SDO10_0, VOC_OBJ_ZOO]);
    const allEnumList = mySA.getListOfEnumerations();
    expect(allEnumList.length).toBe(71);
  });

  test("getListOfEnumerations() latest", async () => {
    const mySA = new SDOAdapter({
      commitBase: global.commitBase,
      onError: debugFuncErr,
    });
    await mySA.addVocabularies([
      await mySA.constructSDOVocabularyURL("latest"),
      VOC_OBJ_ZOO,
    ]);
    const allEnumList = mySA.getListOfEnumerations();
    expect(allEnumList.length > 60).toBe(true);
  });

  test("getAllEnumerations()", async () => {
    const mySA = new SDOAdapter({
      commitBase: global.commitBase,
      onError: debugFuncErr,
    });
    await mySA.addVocabularies([VOC_OBJ_SDO10_0, VOC_OBJ_ZOO]);
    const allEnumerations = mySA.getAllEnumerations();
    expect(allEnumerations.length).toBe(71);
    for (const actEnumeration of allEnumerations) {
      expect(actEnumeration.getTermType()).toBe("schema:Enumeration");
    }
  });

  test("getAllEnumerations() latest", async () => {
    const mySA = new SDOAdapter({
      commitBase: global.commitBase,
      onError: debugFuncErr,
    });
    await mySA.addVocabularies([
      await mySA.constructSDOVocabularyURL("latest"),
      VOC_OBJ_ZOO,
    ]);
    const allEnumerations = mySA.getAllEnumerations();
    expect(allEnumerations.length > 60).toBe(true);
    for (const actEnumeration of allEnumerations) {
      expect(actEnumeration.getTermType()).toBe("schema:Enumeration");
    }
  });

  test("getEnumerationMember()", async () => {
    const mySA = new SDOAdapter({
      commitBase: global.commitBase,
      onError: debugFuncErr,
    });
    await mySA.addVocabularies([VOC_OBJ_SDO10_0, VOC_OBJ_ZOO]);
    const Friday = mySA.getEnumerationMember("schema:Friday");
    expect(Friday.getTermType()).toBe("soa:EnumerationMember");
  });

  test("getEnumerationMember() latest", async () => {
    const mySA = new SDOAdapter({
      commitBase: global.commitBase,
      onError: debugFuncErr,
    });
    await mySA.addVocabularies([
      await mySA.constructSDOVocabularyURL("latest"),
      VOC_OBJ_ZOO,
    ]);
    const Friday = mySA.getEnumerationMember("schema:Friday");
    expect(Friday.getTermType()).toBe("soa:EnumerationMember");
  });

  test("getListOfEnumerationMembers()", async () => {
    const mySA = new SDOAdapter({
      commitBase: global.commitBase,
      onError: debugFuncErr,
    });
    await mySA.addVocabularies([VOC_OBJ_SDO10_0, VOC_OBJ_ZOO]);
    const allEnumList = mySA.getListOfEnumerationMembers();
    expect(allEnumList.length).toBe(360);
  });

  test("getListOfEnumerationMembers() latest", async () => {
    const mySA = new SDOAdapter({
      commitBase: global.commitBase,
      onError: debugFuncErr,
    });
    await mySA.addVocabularies([
      await mySA.constructSDOVocabularyURL("latest"),
      VOC_OBJ_ZOO,
    ]);
    const allEnumList = mySA.getListOfEnumerationMembers();
    expect(allEnumList.length > 250).toBe(true);
  });

  test("getAllEnumerationMembers()", async () => {
    const mySA = new SDOAdapter({
      commitBase: global.commitBase,
      onError: debugFuncErr,
    });
    await mySA.addVocabularies([VOC_OBJ_SDO10_0, VOC_OBJ_ZOO]);
    const allEnumerationMembers = mySA.getAllEnumerationMembers();
    expect(allEnumerationMembers.length).toBe(360);
    for (const actEnumerationMember of allEnumerationMembers) {
      expect(actEnumerationMember.getTermType()).toBe("soa:EnumerationMember");
    }
  });

  test("getAllEnumerationMembers() latest", async () => {
    const mySA = new SDOAdapter({
      commitBase: global.commitBase,
      onError: debugFuncErr,
    });
    await mySA.addVocabularies([
      await mySA.constructSDOVocabularyURL("latest"),
      VOC_OBJ_ZOO,
    ]);
    const allEnumerationMembers = mySA.getAllEnumerationMembers();
    expect(allEnumerationMembers.length > 250).toBe(true);
    for (const actEnumerationMember of allEnumerationMembers) {
      expect(actEnumerationMember.getTermType()).toBe("soa:EnumerationMember");
    }
  });

  test("fetch vocab by URL - direct URL", async () => {
    const mySA = new SDOAdapter({
      commitBase: global.commitBase,
      schemaHttps: true,
      onError: debugFuncErr,
    });
    await mySA.addVocabularies([VOC_URL_SDO10_0, VOC_URL_ZOO]);
    const data1a = mySA.getAllProperties();
    debugFunc(data1a.length);
    expect(data1a.length > 1000).toEqual(true);
    const Place = mySA.getClass("schema:Thing");
    debugFunc(Place.getSubClasses(false));
    expect(Place.getSubClasses(false).length).toBe(11);
    expect(Place.getSubClasses(false)).toContain("ex:Animal");
  });

  test("construct SDO URL", async () => {
    const mySA = new SDOAdapter({
      commitBase: global.commitBase,
      onError: debugFuncErr,
    });
    const url = await mySA.constructSDOVocabularyURL("9.0");
    debugFunc(url);
    expect(url).toBe(mySA.getReleasesURI() + "9.0/schemaorg-all-https.jsonld");
    const url2 = await mySA.constructSDOVocabularyURL("3.9");
    debugFunc(url2);
    expect(url2).toBe(mySA.getReleasesURI() + "3.9/all-layers.jsonld");
  });

  test("get lastest sdo version", async () => {
    const mySA = new SDOAdapter({
      commitBase: global.commitBase,
      onError: debugFuncErr,
    });
    const latestVersion = await mySA.getLatestSDOVersion();
    debugFunc(latestVersion);
    expect(Number(latestVersion) > 5).toBe(true);
    expect(
      Object.keys(mySA.retrievalMemory.versionsFile.releaseLog).includes(
        latestVersion
      )
    ).toBe(true);
  });

  test("onError function", async () => {
    // this test should trigger the onError function, outputting invalid nodes in the schema.org vocabulary version 3.2
    let mySA = new SDOAdapter({
      commitBase: global.commitBase,
      onError: function (text) {
        debugFunc(text);
      },
    });
    const versionUrl = await mySA.constructSDOVocabularyURL("3.2");
    await mySA.addVocabularies([versionUrl]);
    // test without onError function
    mySA = new SDOAdapter({ commitBase: global.commitBase });
    await mySA.addVocabularies([versionUrl]);
    // generic test
    expect(mySA.getListOfProperties().length > 300).toBe(true);
  });

  test("equateVocabularyProtocols - schemaHttps 1", async () => {
    const mySA = new SDOAdapter({
      commitBase: global.commitBase,
      schemaHttps: true,
      onError: debugFuncErr,
    });
    const versionUrl = await mySA.constructSDOVocabularyURL("10.0"); // should get the https version
    await mySA.addVocabularies([versionUrl]);
    expect(mySA.getClass("schema:Hotel").getIRI(false)).toBe(
      "https://schema.org/Hotel"
    );
    expect(mySA.getClass("https://schema.org/Hotel").getIRI(true)).toBe(
      "schema:Hotel"
    );
    expect(mySA.getClass("https://schema.org/Hotel").getIRI(false)).toBe(
      "https://schema.org/Hotel"
    );
    expect(() => {
      mySA.getClass("http://schema.org/Hotel");
    }).toThrow();
  });

  test("equateVocabularyProtocols - schemaHttps 2", async () => {
    const mySA = new SDOAdapter({
      commitBase: global.commitBase,
      schemaHttps: false,
      onError: debugFuncErr,
    });
    const versionUrl = await mySA.constructSDOVocabularyURL("10.0"); // should get the https version
    await mySA.addVocabularies([versionUrl]);
    expect(mySA.getClass("schema:Hotel").getIRI(false)).toBe(
      "http://schema.org/Hotel"
    );
    expect(mySA.getClass("http://schema.org/Hotel").getIRI(true)).toBe(
      "schema:Hotel"
    );
    expect(mySA.getClass("http://schema.org/Hotel").getIRI(false)).toBe(
      "http://schema.org/Hotel"
    );
    expect(() => {
      mySA.getClass("https://schema.org/Hotel");
    }).toThrow();
  });

  test("equateVocabularyProtocols - schemaHttps with incompatible version", async () => {
    const mySA = new SDOAdapter({
      commitBase: global.commitBase,
      schemaHttps: true,
      onError: debugFuncErr,
    });
    const versionUrl = await mySA.constructSDOVocabularyURL("5.0"); // should get the http version (no https version available)
    await mySA.addVocabularies([versionUrl]);
    expect(mySA.getClass("schema:Hotel").getIRI(false)).toBe(
      "http://schema.org/Hotel"
    );
    expect(mySA.getClass("http://schema.org/Hotel").getIRI(true)).toBe(
      "schema:Hotel"
    );
    expect(mySA.getClass("http://schema.org/Hotel").getIRI(false)).toBe(
      "http://schema.org/Hotel"
    );
    expect(() => {
      mySA.getClass("https://schema.org/Hotel");
    }).toThrow();
  });

  test("equateVocabularyProtocols - https not equated", async () => {
    const mySA = new SDOAdapter({
      commitBase: global.commitBase,
      equateVocabularyProtocols: false,
      schemaHttps: true,
      onError: debugFuncErr,
    });
    const versionUrl = await mySA.constructSDOVocabularyURL("10.0"); // should get the https version
    await mySA.addVocabularies([versionUrl]);
    expect(mySA.getClass("schema:Hotel").getIRI(false)).toBe(
      "https://schema.org/Hotel"
    );
    expect(mySA.getClass("https://schema.org/Hotel").getIRI(true)).toBe(
      "schema:Hotel"
    );
    expect(mySA.getClass("https://schema.org/Hotel").getIRI(false)).toBe(
      "https://schema.org/Hotel"
    );
    expect(() => {
      mySA.getClass("http://schema.org/Hotel");
    }).toThrow();
    expect(() => {
      mySA.getTerm("http://schema.org/Hotel");
    }).toThrow();
    expect(() => {
      mySA.getProperty("http://schema.org/address");
    }).toThrow();
    expect(() => {
      mySA.getEnumeration("http://schema.org/DayOfWeek");
    }).toThrow();
    expect(() => {
      mySA.getEnumerationMember("http://schema.org/Monday");
    }).toThrow();
    expect(() => {
      mySA.getDataType("http://schema.org/Number");
    }).toThrow();
  });

  test("equateVocabularyProtocols - https equated", async () => {
    const mySA = new SDOAdapter({
      commitBase: global.commitBase,
      equateVocabularyProtocols: true,
      schemaHttps: true,
      onError: debugFuncErr,
    });
    const versionUrl = await mySA.constructSDOVocabularyURL("10.0"); // should get the https version
    await mySA.addVocabularies([versionUrl]);
    expect(mySA.getClass("schema:Hotel").getIRI(false)).toBe(
      "https://schema.org/Hotel"
    );
    expect(mySA.getClass("https://schema.org/Hotel").getIRI(true)).toBe(
      "schema:Hotel"
    );
    expect(mySA.getClass("http://schema.org/Hotel").getIRI(true)).toBe(
      "schema:Hotel"
    );
    expect(mySA.getClass("http://schema.org/Hotel").getIRI(false)).toBe(
      "https://schema.org/Hotel"
    );
    expect(mySA.getTerm("http://schema.org/Hotel").getIRI(false)).toBe(
      "https://schema.org/Hotel"
    );
    expect(mySA.getProperty("http://schema.org/address").getIRI(false)).toBe(
      "https://schema.org/address"
    );
    expect(
      mySA.getEnumeration("http://schema.org/DayOfWeek").getIRI(false)
    ).toBe("https://schema.org/DayOfWeek");
    expect(
      mySA.getEnumerationMember("http://schema.org/Monday").getIRI(false)
    ).toBe("https://schema.org/Monday");
    expect(mySA.getDataType("http://schema.org/Number").getIRI(false)).toBe(
      "https://schema.org/Number"
    );
  });

  test("equateVocabularyProtocols - http equated multiple vocabs", async () => {
    const mySA = new SDOAdapter({
      commitBase: global.commitBase,
      equateVocabularyProtocols: true,
      schemaHttps: false,
      onError: debugFuncErr,
    });
    const versionUrl = await mySA.constructSDOVocabularyURL("10.0"); // should get the http version
    await mySA.addVocabularies([versionUrl, VOC_OBJ_ZOO]);
    expect(mySA.getClass("ex:Animal").getIRI(false)).toBe(
      "https://example-vocab.ex/Animal"
    );
    expect(
      mySA.getClass("ex:Animal").getSuperClasses(false).includes("schema:Thing")
    ).toBe(true);
    expect(mySA.getClass("schema:Thing").getIRI(false)).toBe(
      "http://schema.org/Thing"
    );
  });

  test("equateVocabularyProtocols - http not equated multiple vocabs", async () => {
    const mySA = new SDOAdapter({
      commitBase: global.commitBase,
      equateVocabularyProtocols: false,
      schemaHttps: false,
      onError: debugFuncErr,
    });
    const versionUrl = await mySA.constructSDOVocabularyURL("10.0"); // should get the http version
    await mySA.addVocabularies([versionUrl, VOC_OBJ_ZOO]);
    expect(mySA.getClass("ex:Animal").getIRI(false)).toBe(
      "https://example-vocab.ex/Animal"
    );
    expect(
      mySA.getClass("ex:Animal").getSuperClasses(false).includes("schema:Thing")
    ).toBe(false);
    expect(mySA.getClass("schema:Thing").getIRI(false)).toBe(
      "http://schema.org/Thing"
    );
  });

  test("equateVocabularyProtocols - http equated multiple vocabs 2", async () => {
    const mySA = new SDOAdapter({
      commitBase: global.commitBase,
      equateVocabularyProtocols: true,
      schemaHttps: false,
      onError: debugFuncErr,
    });
    const versionUrl = await mySA.constructSDOVocabularyURL("10.0"); // should get the http version
    await mySA.addVocabularies([versionUrl, VOC_OBJ_ZOO_NO_SCHEMA_IN_CONTEXT]);
    expect(mySA.getClass("ex:Animal").getIRI(false)).toBe(
      "https://example-vocab.ex/Animal"
    );
    expect(
      mySA.getClass("ex:Animal").getSuperClasses(false).includes("schema:Thing")
    ).toBe(true);
    expect(mySA.getClass("schema:Thing").getIRI(false)).toBe(
      "http://schema.org/Thing"
    );
  });

  test("equateVocabularyProtocols - http not equated multiple vocabs 2", async () => {
    const mySA = new SDOAdapter({
      commitBase: global.commitBase,
      equateVocabularyProtocols: false,
      schemaHttps: false,
      onError: debugFuncErr,
    });
    const versionUrl = await mySA.constructSDOVocabularyURL("10.0"); // should get the http version
    await mySA.addVocabularies([versionUrl, VOC_OBJ_ZOO_NO_SCHEMA_IN_CONTEXT]);
    expect(mySA.getClass("ex:Animal").getIRI(false)).toBe(
      "https://example-vocab.ex/Animal"
    );
    expect(
      mySA.getClass("ex:Animal").getSuperClasses(false).includes("schema:Thing")
    ).toBe(false);
  });

  test("equateVocabularyProtocols - http equated multiple vocabs 3", async () => {
    const mySA = new SDOAdapter({
      commitBase: global.commitBase,
      equateVocabularyProtocols: true,
      schemaHttps: false,
      onError: debugFuncErr,
    });
    const versionUrl = await mySA.constructSDOVocabularyURL("10.0"); // should get the http version
    await mySA.addVocabularies([VOC_OBJ_ZOO_NO_SCHEMA_IN_CONTEXT, versionUrl]);
    expect(mySA.getClass("ex:Animal").getIRI(false)).toBe(
      "https://example-vocab.ex/Animal"
    );
    expect(
      mySA.getClass("ex:Animal").getSuperClasses(false).includes("schema:Thing")
    ).toBe(true);
    expect(mySA.getClass("schema:Thing").getIRI(false)).toBe(
      "https://schema.org/Thing"
    );
  });

  test("equateVocabularyProtocols - http not equated multiple vocabs 3", async () => {
    const mySA = new SDOAdapter({
      commitBase: global.commitBase,
      equateVocabularyProtocols: false,
      schemaHttps: false,
      onError: debugFuncErr,
    });
    const versionUrl = await mySA.constructSDOVocabularyURL("10.0"); // should get the http version
    await mySA.addVocabularies([VOC_OBJ_ZOO_NO_SCHEMA_IN_CONTEXT, versionUrl]);
    expect(mySA.getClass("ex:Animal").getIRI(false)).toBe(
      "https://example-vocab.ex/Animal"
    );
    expect(
      mySA.getClass("ex:Animal").getSuperClasses(false).includes("schema:Thing")
    ).toBe(true); // entry is in superclasses because the first vocabulary says so
    expect(() => {
      mySA.getClass("schema:Thing");
    }).toThrow(); // there is no schema:Thing because the sdo vocabulary does not use the same protocol as specified in the first vocabulary
  });

  test("getVersionFileURI()", async () => {
    const mySA = new SDOAdapter({
      onError: debugFuncErr,
    });
    expect(mySA.getVersionFileURI()).toBe(
      "https://raw.githubusercontent.com/semantifyit/schemaorg/main/versions.json"
    );
  });

  test("static getLatestVersion()", async () => {
    // static methods always take the version on commit version of semantify.it
    const latestVersion = await SDOAdapter.getLatestSDOVersion();
    debugFunc(latestVersion);
    expect(Number(latestVersion) > 5).toBe(true);
  });
});
