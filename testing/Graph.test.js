const SDOAdapter = require("../src/node/SDOAdapterNode");
const Graph = require("../src/Graph");
const VOC_OBJ_DACH = require('../testData/dachkg_1');
const VOC_OBJ_SDO3_7 = require('../testData/schema_3.7');

async function initGraph() {
    let mySA = new SDOAdapter();
    let myGraph = new Graph(mySA);
    return myGraph;
}

describe('Graph methods', () => {

    test("addVocabulary()", async () => {
        let myGraph = await initGraph();
        await myGraph.addVocabulary(VOC_OBJ_SDO3_7);
        let Place = myGraph.getClass("schema:Place");
        expect(Place.getSubClasses(false).length).toBe(9);
        expect(Place.getSubClasses(false)).not.toContain("dachkg:Trail");
        await myGraph.addVocabulary(VOC_OBJ_DACH);
        expect(Place.getSubClasses(false).length).toBe(10);
        expect(Place.getSubClasses(false)).toContain("dachkg:Trail");
    });

    test("getTerm()", async () => {
        let myGraph = await initGraph();
        await myGraph.addVocabulary(VOC_OBJ_SDO3_7);
        let hospital = myGraph.getClass("schema:Hospital");
        let hospital2 = myGraph.getTerm("schema:Hospital");
        expect(hospital).toEqual(hospital2);
        let address = myGraph.getProperty("schema:address");
        let address2 = myGraph.getTerm("schema:address");
        expect(address).toEqual(address2);
        let numb = myGraph.getDataType("schema:Number");
        let numb2 = myGraph.getTerm("schema:Number");
        expect(numb).toEqual(numb2);
        let DayOfWeek = myGraph.getEnumeration("schema:DayOfWeek");
        let DayOfWeek2 = myGraph.getTerm("schema:DayOfWeek");
        expect(DayOfWeek).toEqual(DayOfWeek2);
        let Friday = myGraph.getEnumerationMember("schema:Friday");
        let Friday2 = myGraph.getTerm("schema:Friday");
        expect(Friday).toEqual(Friday2);
    });

    test("discoverCompactIRI()", async () => {
        let myGraph = await initGraph();
        await myGraph.addVocabulary(VOC_OBJ_SDO3_7);
        expect(myGraph.discoverCompactIRI("Hotel")).toBe("schema:Hotel");
        expect(myGraph.discoverCompactIRI("schema:Hotel")).toBe("schema:Hotel");
        expect(myGraph.discoverCompactIRI("http://schema.org/Hotel")).toBe("schema:Hotel");
    });

    test("containsLabel()", async () => {
        let myGraph = await initGraph();
        await myGraph.addVocabulary(VOC_OBJ_DACH);
        expect(myGraph.containsLabel(myGraph.classes["dachkg:Trail"], "Trail")).toBe(true);
        expect(myGraph.containsLabel(myGraph.classes["dachkg:Trail"], "Auto")).toBe(false);
    });

    test("addGraphNode()", async () => {
        let snowTrailObjEng = {
            "@id": "dachkg:SnowTrail",
            "@type": "rdfs:Class",
            "rdfs:comment": {"en": "A path, track or unpaved lane or road for sport activities or walking IN THE SNOW."},
            "rdfs:label": {"en": "SnowTrail"},
            "rdfs:subClassOf": [
                "dachkg:Trail"
            ]
        };
        let snowTrailObjDe = {
            "@id": "dachkg:SnowTrail",
            "@type": "rdfs:Class",
            "rdfs:label": {"de": "Schneeroute"},
            "rdfs:subClassOf": [
                "dachkg:Trail",
                "schema:Hotel"
            ]
        };
        let myGraph = await initGraph();
        await myGraph.addVocabulary(VOC_OBJ_SDO3_7);
        await myGraph.addVocabulary(VOC_OBJ_DACH);
        expect(myGraph.classes["dachkg:SnowTrail"]).toBe(undefined);
        await myGraph.addGraphNode(myGraph.classes, snowTrailObjEng);
        expect(myGraph.classes["dachkg:SnowTrail"]).not.toBe(undefined);
        expect(myGraph.classes["dachkg:SnowTrail"]["rdfs:label"]["en"]).toBe("SnowTrail");
        expect(myGraph.classes["dachkg:SnowTrail"]["rdfs:label"]["de"]).toBe(undefined);
        expect(myGraph.classes["dachkg:SnowTrail"]["@type"]).toBe("rdfs:Class");
        expect(myGraph.classes["dachkg:SnowTrail"]["rdfs:subClassOf"].length).toBe(1);
        await myGraph.addGraphNode(myGraph.classes, snowTrailObjDe);
        expect(myGraph.classes["dachkg:SnowTrail"]["rdfs:label"]["en"]).toBe("SnowTrail");
        expect(myGraph.classes["dachkg:SnowTrail"]["rdfs:label"]["de"]).toBe("Schneeroute");
        expect(myGraph.classes["dachkg:SnowTrail"]["@type"]).toBe("rdfs:Class");
        expect(myGraph.classes["dachkg:SnowTrail"]["rdfs:subClassOf"].length).toBe(2);
        await myGraph.addGraphNode(myGraph.classes, snowTrailObjDe);
        expect(myGraph.classes["dachkg:SnowTrail"]["rdfs:label"]["en"]).toBe("SnowTrail");
        expect(myGraph.classes["dachkg:SnowTrail"]["rdfs:label"]["de"]).toBe("Schneeroute");
        expect(myGraph.classes["dachkg:SnowTrail"]["@type"]).toBe("rdfs:Class");
        expect(myGraph.classes["dachkg:SnowTrail"]["rdfs:subClassOf"].length).toBe(2);
    });
});
