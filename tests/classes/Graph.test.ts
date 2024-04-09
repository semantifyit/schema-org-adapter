import { Graph } from "../../src/classes/Graph";
import VOC_OBJ_ZOO from "../resources/data/vocabularies/vocabulary-animal.json";
import VOC_OBJ_ZOO_DVS from "../resources/data/vocabularies/vocabulary-animal-dvs.json";
import VOC_OBJ_ZOO_DVS2 from "../resources/data/vocabularies/vocabulary-animal-dvs-altered.json";
import VOC_SCHEMA_20 from "../resources/data/vocabularies/schema/schema-20.0.json";
import { debugFuncErr } from "../resources/utilities/testUtilities";
import { SDOAdapter } from "../../src/classes/SDOAdapter";

async function initGraph() {
  return new Graph({
    sdoAdapter: new SDOAdapter({
      onError: debugFuncErr
    })
  });
}

/**
 *  Tests regarding the JS-Class for "Graph"
 */
describe("Graph methods", () => {
  test("addVocabulary()", async () => {
    const myGraph = await initGraph();
    await myGraph.addVocabulary(VOC_SCHEMA_20);
    const Place = myGraph.getClass("schema:Thing");
    const placeSubClassesSize = Place.getSubClasses({ implicit: false }).length;
    expect(Place.getSubClasses({ implicit: false })).not.toContain("ex:Tiger");
    await myGraph.addVocabulary(VOC_OBJ_ZOO);
    expect(Place.getSubClasses({ implicit: false }).length).toBe(placeSubClassesSize + 1);
    expect(Place.getSubClasses({ implicit: false })).toContain("ex:Animal");
    const classesL = Object.keys(myGraph.classes).length;
    const propertiesL = Object.keys(myGraph.properties).length;
    const dataTypesL = Object.keys(myGraph.dataTypes).length;
    const enumerationsL = Object.keys(myGraph.enumerations).length;
    const enumerationMembersL = Object.keys(myGraph.enumerationMembers).length;
    await myGraph.addVocabulary(VOC_SCHEMA_20); // Try adding same vocab again
    await myGraph.addVocabulary(VOC_OBJ_ZOO); // Try adding same vocab again
    const Place2 = myGraph.getClass("schema:Thing");
    expect(Place.getSubClasses({ implicit: false }).length).toBe(placeSubClassesSize + 1);
    expect(Place2.getSubClasses({ implicit: false })).toContain("ex:Animal");
    const classesL2 = Object.keys(myGraph.classes).length;
    const propertiesL2 = Object.keys(myGraph.properties).length;
    const dataTypesL2 = Object.keys(myGraph.dataTypes).length;
    const enumerationsL2 = Object.keys(myGraph.enumerations).length;
    const enumerationMembersL2 = Object.keys(myGraph.enumerationMembers).length;
    expect(classesL).toBe(classesL2);
    expect(propertiesL).toBe(propertiesL2);
    expect(dataTypesL).toBe(dataTypesL2);
    expect(enumerationsL).toBe(enumerationsL2);
    expect(enumerationMembersL).toBe(enumerationMembersL2);
  });

  test("getTerm()", async () => {
    const myGraph = await initGraph();
    await myGraph.addVocabulary(VOC_SCHEMA_20);
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
    await myGraph.addVocabulary(VOC_SCHEMA_20);
    // Class
    expect(myGraph.discoverCompactIRI("Hotel")).toBe("schema:Hotel");
    expect(myGraph.discoverCompactIRI("schema:Hotel")).toBe("schema:Hotel");
    expect(myGraph.discoverCompactIRI("https://schema.org/Hotel")).toBe("schema:Hotel");
    // Property
    expect(myGraph.discoverCompactIRI("name")).toBe("schema:name");
    expect(myGraph.discoverCompactIRI("schema:name")).toBe("schema:name");
    expect(myGraph.discoverCompactIRI("https://schema.org/name")).toBe("schema:name");
    // DataType
    expect(myGraph.discoverCompactIRI("Text")).toBe("schema:Text");
    expect(myGraph.discoverCompactIRI("schema:Text")).toBe("schema:Text");
    expect(myGraph.discoverCompactIRI("https://schema.org/Text")).toBe("schema:Text");
    // Enumeration
    expect(myGraph.discoverCompactIRI("DayOfWeek")).toBe("schema:DayOfWeek");
    expect(myGraph.discoverCompactIRI("schema:DayOfWeek")).toBe("schema:DayOfWeek");
    expect(myGraph.discoverCompactIRI("https://schema.org/DayOfWeek")).toBe("schema:DayOfWeek");
    // EnumerationMember
    expect(myGraph.discoverCompactIRI("Friday")).toBe("schema:Friday");
    expect(myGraph.discoverCompactIRI("schema:Friday")).toBe("schema:Friday");
    expect(myGraph.discoverCompactIRI("https://schema.org/Friday")).toBe("schema:Friday");
    // Not valid
    expect(myGraph.discoverCompactIRI("SomeBS")).toBe(null);
  });

  test("discoverCompactIRI() advanced", async () => {
    const myGraph = await initGraph();
    await myGraph.addVocabulary(VOC_SCHEMA_20);
    await myGraph.addVocabulary(VOC_OBJ_ZOO_DVS);
    await myGraph.addVocabulary(VOC_OBJ_ZOO_DVS2);
    // Class
    expect(myGraph.discoverCompactIRI("ex2:Reptilia")).toBe("ex2:Reptilia");
    expect(myGraph.discoverCompactIRI("https://example-second-vocab.ex/Reptilia")).toBe("ex2:Reptilia");
    expect(myGraph.discoverCompactIRI("Reptilia")).toBe("ex2:Reptilia");
    expect(myGraph.discoverCompactIRI("Reptilien")).toBe("ex2:Reptilia");
    expect(myGraph.discoverCompactIRI("schematisch:Hotel")).toBe("schematisch:Hotel");
    expect(myGraph.discoverCompactIRI("Hotel")).toBe("schema:Hotel");
    expect(myGraph.discoverCompactIRI("schema")).toBe("schematisch:Schema");
    expect(myGraph.discoverCompactIRI("Tiger")).toBe("ex:Tiger");
    expect(myGraph.discoverCompactIRI("Tigre")).toBe("ex:Tiger");
    expect(myGraph.discoverCompactIRI("虎")).toBe("ex:Tiger");
    // Property with same label in different vocabularies
    expect(myGraph.discoverCompactIRI("ex:numberOfLegs")).toBe("ex:numberOfLegs");
    expect(myGraph.discoverCompactIRI("ex2:numberOfLegs")).toBe("ex2:numberOfLegs");
    expect(myGraph.discoverCompactIRI("https://example-vocab.ex/numberOfLegs")).toBe("ex:numberOfLegs");
    expect(myGraph.discoverCompactIRI("https://example-second-vocab.ex/numberOfLegs")).toBe("ex2:numberOfLegs");
    // casting by label, which is possible for both vocabularies, will end in returning the first found match, which should be the first added vocabulary
    expect(myGraph.discoverCompactIRI("numberOfLegs")).toBe("ex:numberOfLegs");
  });

  test("containsLabel()", async () => {
    const myGraph = await initGraph();
    await myGraph.addVocabulary(VOC_OBJ_ZOO);
    expect(myGraph.containsLabel(myGraph.classes["ex:Tiger"], "Tiger")).toBe(true);
    expect(myGraph.containsLabel(myGraph.classes["ex:Tiger"], "Auto")).toBe(false);
  });

  test("addGraphNode()", async () => {
    const snowTrailObjEng = {
      "@id": "ex:SnowTrail",
      "@type": "rdfs:Class",
      "rdfs:comment": {
        en: "A path, track or unpaved lane or road for sport activities or walking IN THE SNOW."
      },
      "rdfs:label": { en: "SnowTrail" },
      "rdfs:subClassOf": ["schema:Place"]
    };
    const snowTrailObjDe = {
      "@id": "ex:SnowTrail",
      "@type": "rdfs:Class",
      "rdfs:label": { de: "Schneeroute" },
      "rdfs:subClassOf": ["schema:Place", "schema:Action"]
    };
    const myGraph = await initGraph();
    await myGraph.addVocabulary(VOC_SCHEMA_20);
    await myGraph.addVocabulary(VOC_OBJ_ZOO);
    expect(myGraph.classes["ex:SnowTrail"]).toBe(undefined);
    myGraph.addGraphNode(myGraph.classes, snowTrailObjEng);
    expect(myGraph.classes["ex:SnowTrail"]).not.toBe(undefined);
    expect(myGraph.classes["ex:SnowTrail"]["rdfs:label"].en).toBe("SnowTrail");
    expect(myGraph.classes["ex:SnowTrail"]["rdfs:label"].de).toBe(undefined);
    expect(myGraph.classes["ex:SnowTrail"]["@type"]).toBe("rdfs:Class");
    expect(myGraph.classes["ex:SnowTrail"]["rdfs:subClassOf"].length).toBe(1);

    function checkGermanAndEnglishContent(myGraph: Graph) {
      expect(myGraph.classes["ex:SnowTrail"]["rdfs:label"].en).toBe("SnowTrail");
      expect(myGraph.classes["ex:SnowTrail"]["rdfs:label"].de).toBe("Schneeroute");
      expect(myGraph.classes["ex:SnowTrail"]["@type"]).toBe("rdfs:Class");
      expect(myGraph.classes["ex:SnowTrail"]["rdfs:subClassOf"]).toHaveLength(2);
    }

    // add german info, which adds information to the graph node
    myGraph.addGraphNode(myGraph.classes, snowTrailObjDe);
    checkGermanAndEnglishContent(myGraph);
    // adding the same info again should NOT change the vocabulary
    myGraph.addGraphNode(myGraph.classes, snowTrailObjDe);
    checkGermanAndEnglishContent(myGraph);
  });
});
