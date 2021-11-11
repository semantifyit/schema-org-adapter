const SDOAdapter = require("../src/SDOAdapter");
const Graph = require("../src/Graph");
const VOC_OBJ_ZOO = require("./data/vocabulary-animal.json");
let VOC_URL_LATEST;
let VOC_OBJ_LATEST;
const { debugFuncErr } = require("./testUtility");

/**
 *  @returns {SDOAdapter} - the initialized SDO-Adapter ready for testing.
 */
async function initGraph() {
  const mySA = new SDOAdapter({
    commitBase: global.commitBase,
    onError: debugFuncErr,
  });
  VOC_URL_LATEST = await mySA.constructSDOVocabularyURL("latest");
  VOC_OBJ_LATEST = await SDOAdapter.fetchVocabularyFromURL(VOC_URL_LATEST);
  return new Graph(mySA);
}

/**
 *  Tests regarding the JS-Class for "Graph"
 */
describe("Graph methods", () => {
  test("addVocabulary()", async () => {
    const myGraph = await initGraph();
    await myGraph.addVocabulary(VOC_OBJ_LATEST);
    const Place = myGraph.getClass("schema:Thing");
    const placeSubClassesSize = Place.getSubClasses(false).length;
    expect(Place.getSubClasses(false)).not.toContain("ex:Tiger");
    await myGraph.addVocabulary(VOC_OBJ_ZOO);
    expect(Place.getSubClasses(false).length).toBe(placeSubClassesSize + 1);
    expect(Place.getSubClasses(false)).toContain("ex:Animal");
    await myGraph.addVocabulary(VOC_OBJ_LATEST); // Try adding same vocab again
    await myGraph.addVocabulary(VOC_OBJ_ZOO); // Try adding same vocab again
    const Place2 = myGraph.getClass("schema:Thing");
    expect(Place.getSubClasses(false).length).toBe(placeSubClassesSize + 1);
    expect(Place2.getSubClasses(false)).toContain("ex:Animal");
  });

  test("getTerm()", async () => {
    const myGraph = await initGraph();
    await myGraph.addVocabulary(VOC_OBJ_LATEST);
    const hospital = myGraph.getClass("schema:Hospital");
    const hospital2 = myGraph.getTerm("schema:Hospital");
    expect(hospital).toEqual(hospital2);
    const address = myGraph.getProperty("schema:address");
    const address2 = myGraph.getTerm("schema:address");
    expect(address).toEqual(address2);
    const numb = myGraph.getDataType("schema:Number");
    const numb2 = myGraph.getTerm("schema:Number");
    expect(numb).toEqual(numb2);
    const DayOfWeek = myGraph.getEnumeration("schema:DayOfWeek");
    const DayOfWeek2 = myGraph.getTerm("schema:DayOfWeek");
    const DayOfWeek3 = myGraph.getClass("schema:DayOfWeek");
    expect(DayOfWeek).toEqual(DayOfWeek2);
    expect(DayOfWeek).toEqual(DayOfWeek3);
    expect(DayOfWeek2).toEqual(DayOfWeek3);
    const Friday = myGraph.getEnumerationMember("schema:Friday");
    const Friday2 = myGraph.getTerm("schema:Friday");
    expect(Friday).toEqual(Friday2);
    // Fail tests
    expect(() => myGraph.getClass("schema:BS")).toThrow();
    expect(() => myGraph.getProperty("schema:BS")).toThrow();
    expect(() => myGraph.getDataType("schema:BS")).toThrow();
    expect(() => myGraph.getEnumeration("schema:BS")).toThrow();
    expect(() => myGraph.getEnumerationMember("schema:BS")).toThrow();
    expect(() => myGraph.getClass("BS")).toThrow();
    expect(() => myGraph.getProperty("BS")).toThrow();
    expect(() => myGraph.getDataType("BS")).toThrow();
    expect(() => myGraph.getEnumeration("BS")).toThrow();
    expect(() => myGraph.getEnumerationMember("BS")).toThrow();
  });

  test("discoverCompactIRI()", async () => {
    const myGraph = await initGraph();
    await myGraph.addVocabulary(VOC_OBJ_LATEST);
    // Class
    expect(myGraph.discoverCompactIRI("Hotel")).toBe("schema:Hotel");
    expect(myGraph.discoverCompactIRI("schema:Hotel")).toBe("schema:Hotel");
    expect(myGraph.discoverCompactIRI("https://schema.org/Hotel")).toBe(
      "schema:Hotel"
    );
    // Property
    expect(myGraph.discoverCompactIRI("name")).toBe("schema:name");
    expect(myGraph.discoverCompactIRI("schema:name")).toBe("schema:name");
    expect(myGraph.discoverCompactIRI("https://schema.org/name")).toBe(
      "schema:name"
    );
    // DataType
    expect(myGraph.discoverCompactIRI("Text")).toBe("schema:Text");
    expect(myGraph.discoverCompactIRI("schema:Text")).toBe("schema:Text");
    expect(myGraph.discoverCompactIRI("https://schema.org/Text")).toBe(
      "schema:Text"
    );
    // Enumeration
    expect(myGraph.discoverCompactIRI("DayOfWeek")).toBe("schema:DayOfWeek");
    expect(myGraph.discoverCompactIRI("schema:DayOfWeek")).toBe(
      "schema:DayOfWeek"
    );
    expect(myGraph.discoverCompactIRI("https://schema.org/DayOfWeek")).toBe(
      "schema:DayOfWeek"
    );
    // EnumerationMember
    expect(myGraph.discoverCompactIRI("Friday")).toBe("schema:Friday");
    expect(myGraph.discoverCompactIRI("schema:Friday")).toBe("schema:Friday");
    expect(myGraph.discoverCompactIRI("https://schema.org/Friday")).toBe(
      "schema:Friday"
    );
    // Not valid
    expect(myGraph.discoverCompactIRI("SomeBS")).toBe(null);
  });

  test("containsLabel()", async () => {
    const myGraph = await initGraph();
    await myGraph.addVocabulary(VOC_OBJ_ZOO);
    expect(myGraph.containsLabel(myGraph.classes["ex:Tiger"], "Tiger")).toBe(
      true
    );
    expect(myGraph.containsLabel(myGraph.classes["ex:Tiger"], "Auto")).toBe(
      false
    );
  });

  test("addGraphNode()", async () => {
    const snowTrailObjEng = {
      "@id": "ex:SnowTrail",
      "@type": "rdfs:Class",
      "rdfs:comment": {
        en: "A path, track or unpaved lane or road for sport activities or walking IN THE SNOW.",
      },
      "rdfs:label": { en: "SnowTrail" },
      "rdfs:subClassOf": ["schema:Place"],
    };
    const snowTrailObjDe = {
      "@id": "ex:SnowTrail",
      "@type": "rdfs:Class",
      "rdfs:label": { de: "Schneeroute" },
      "rdfs:subClassOf": ["schema:Place", "schema:Action"],
    };
    const myGraph = await initGraph();
    await myGraph.addVocabulary(VOC_OBJ_LATEST);
    await myGraph.addVocabulary(VOC_OBJ_ZOO);
    expect(myGraph.classes["ex:SnowTrail"]).toBe(undefined);
    await myGraph.addGraphNode(myGraph.classes, snowTrailObjEng);
    expect(myGraph.classes["ex:SnowTrail"]).not.toBe(undefined);
    expect(myGraph.classes["ex:SnowTrail"]["rdfs:label"].en).toBe("SnowTrail");
    expect(myGraph.classes["ex:SnowTrail"]["rdfs:label"].de).toBe(undefined);
    expect(myGraph.classes["ex:SnowTrail"]["@type"]).toBe("rdfs:Class");
    expect(myGraph.classes["ex:SnowTrail"]["rdfs:subClassOf"].length).toBe(1);
    await myGraph.addGraphNode(myGraph.classes, snowTrailObjDe);
    expect(myGraph.classes["ex:SnowTrail"]["rdfs:label"].en).toBe("SnowTrail");
    expect(myGraph.classes["ex:SnowTrail"]["rdfs:label"].de).toBe(
      "Schneeroute"
    );
    expect(myGraph.classes["ex:SnowTrail"]["@type"]).toBe("rdfs:Class");
    expect(myGraph.classes["ex:SnowTrail"]["rdfs:subClassOf"].length).toBe(2);
    await myGraph.addGraphNode(myGraph.classes, snowTrailObjDe);
    expect(myGraph.classes["ex:SnowTrail"]["rdfs:label"].en).toBe("SnowTrail");
    expect(myGraph.classes["ex:SnowTrail"]["rdfs:label"].de).toBe(
      "Schneeroute"
    );
    expect(myGraph.classes["ex:SnowTrail"]["@type"]).toBe("rdfs:Class");
    expect(myGraph.classes["ex:SnowTrail"]["rdfs:subClassOf"].length).toBe(2);
  });
});
