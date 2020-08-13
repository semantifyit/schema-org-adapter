const SDOAdapter = require('../src/SDOAdapter');
const Graph = require('../src/Graph');
const VOC_OBJ_ZOO = require('./data/exampleExternalVocabulary');
let VOC_URL_LATEST;
let VOC_OBJ_LATEST;

/**
 * starts a SDO Adapter for a test
 */
async function initGraph() {
    const mySA = new SDOAdapter();
    VOC_URL_LATEST = await mySA.constructSDOVocabularyURL('latest');
    VOC_OBJ_LATEST = await mySA.fetchVocabularyFromURL(VOC_URL_LATEST);
    return new Graph(mySA);
}

describe('Graph methods', () => {
    test('addVocabulary()', async() => {
        const myGraph = await initGraph();
        await myGraph.addVocabulary(VOC_OBJ_LATEST);
        const Place = myGraph.getClass('schema:Thing');
        expect(Place.getSubClasses(false).length).toBe(10);
        expect(Place.getSubClasses(false)).not.toContain('ex:Tiger');
        await myGraph.addVocabulary(VOC_OBJ_ZOO);
        expect(Place.getSubClasses(false).length).toBe(11);
        expect(Place.getSubClasses(false)).toContain('ex:Animal');
    });

    test('getTerm()', async() => {
        const myGraph = await initGraph();
        await myGraph.addVocabulary(VOC_OBJ_LATEST);
        const hospital = myGraph.getClass('schema:Hospital');
        const hospital2 = myGraph.getTerm('schema:Hospital');
        expect(hospital).toEqual(hospital2);
        const address = myGraph.getProperty('schema:address');
        const address2 = myGraph.getTerm('schema:address');
        expect(address).toEqual(address2);
        const numb = myGraph.getDataType('schema:Number');
        const numb2 = myGraph.getTerm('schema:Number');
        expect(numb).toEqual(numb2);
        const DayOfWeek = myGraph.getEnumeration('schema:DayOfWeek');
        const DayOfWeek2 = myGraph.getTerm('schema:DayOfWeek');
        expect(DayOfWeek).toEqual(DayOfWeek2);
        const Friday = myGraph.getEnumerationMember('schema:Friday');
        const Friday2 = myGraph.getTerm('schema:Friday');
        expect(Friday).toEqual(Friday2);
    });

    test('discoverCompactIRI()', async() => {
        const myGraph = await initGraph();
        await myGraph.addVocabulary(VOC_OBJ_LATEST);
        expect(myGraph.discoverCompactIRI('Hotel')).toBe('schema:Hotel');
        expect(myGraph.discoverCompactIRI('schema:Hotel')).toBe('schema:Hotel');
        expect(myGraph.discoverCompactIRI('http://schema.org/Hotel')).toBe('schema:Hotel');
    });

    test('containsLabel()', async() => {
        const myGraph = await initGraph();
        await myGraph.addVocabulary(VOC_OBJ_ZOO);
        expect(myGraph.containsLabel(myGraph.classes['ex:Tiger'], 'Tiger')).toBe(true);
        expect(myGraph.containsLabel(myGraph.classes['ex:Tiger'], 'Auto')).toBe(false);
    });

    test('addGraphNode()', async() => {
        const snowTrailObjEng = {
            '@id': 'ex:SnowTrail',
            '@type': 'rdfs:Class',
            'rdfs:comment': { en: 'A path, track or unpaved lane or road for sport activities or walking IN THE SNOW.' },
            'rdfs:label': { en: 'SnowTrail' },
            'rdfs:subClassOf': [
                'schema:Place'
            ]
        };
        const snowTrailObjDe = {
            '@id': 'ex:SnowTrail',
            '@type': 'rdfs:Class',
            'rdfs:label': { de: 'Schneeroute' },
            'rdfs:subClassOf': [
                'schema:Place',
                'schema:Action'
            ]
        };
        const myGraph = await initGraph();
        await myGraph.addVocabulary(VOC_OBJ_LATEST);
        await myGraph.addVocabulary(VOC_OBJ_ZOO);
        expect(myGraph.classes['ex:SnowTrail']).toBe(undefined);
        await myGraph.addGraphNode(myGraph.classes, snowTrailObjEng);
        expect(myGraph.classes['ex:SnowTrail']).not.toBe(undefined);
        expect(myGraph.classes['ex:SnowTrail']['rdfs:label'].en).toBe('SnowTrail');
        expect(myGraph.classes['ex:SnowTrail']['rdfs:label'].de).toBe(undefined);
        expect(myGraph.classes['ex:SnowTrail']['@type']).toBe('rdfs:Class');
        expect(myGraph.classes['ex:SnowTrail']['rdfs:subClassOf'].length).toBe(1);
        await myGraph.addGraphNode(myGraph.classes, snowTrailObjDe);
        expect(myGraph.classes['ex:SnowTrail']['rdfs:label'].en).toBe('SnowTrail');
        expect(myGraph.classes['ex:SnowTrail']['rdfs:label'].de).toBe('Schneeroute');
        expect(myGraph.classes['ex:SnowTrail']['@type']).toBe('rdfs:Class');
        expect(myGraph.classes['ex:SnowTrail']['rdfs:subClassOf'].length).toBe(2);
        await myGraph.addGraphNode(myGraph.classes, snowTrailObjDe);
        expect(myGraph.classes['ex:SnowTrail']['rdfs:label'].en).toBe('SnowTrail');
        expect(myGraph.classes['ex:SnowTrail']['rdfs:label'].de).toBe('Schneeroute');
        expect(myGraph.classes['ex:SnowTrail']['@type']).toBe('rdfs:Class');
        expect(myGraph.classes['ex:SnowTrail']['rdfs:subClassOf'].length).toBe(2);
    });
});
