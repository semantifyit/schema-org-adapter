const SDOAdapter = require('../src/SDOAdapter')
const Graph = require('../src/Graph')
const VOC_OBJ_DACH = require('./data/dachkg_1')
const VOC_OBJ_SDO3_7 = require('./data/schema_3.7')

/**
 *
 */
async function initGraph () {
  const mySA = new SDOAdapter()
  return new Graph(mySA)
}

describe('Graph methods', () => {
  test('addVocabulary()', async () => {
    const myGraph = await initGraph()
    await myGraph.addVocabulary(VOC_OBJ_SDO3_7)
    const Place = myGraph.getClass('schema:Place')
    expect(Place.getSubClasses(false).length).toBe(9)
    expect(Place.getSubClasses(false)).not.toContain('dachkg:Trail')
    await myGraph.addVocabulary(VOC_OBJ_DACH)
    expect(Place.getSubClasses(false).length).toBe(10)
    expect(Place.getSubClasses(false)).toContain('dachkg:Trail')
  })

  test('getTerm()', async () => {
    const myGraph = await initGraph()
    await myGraph.addVocabulary(VOC_OBJ_SDO3_7)
    const hospital = myGraph.getClass('schema:Hospital')
    const hospital2 = myGraph.getTerm('schema:Hospital')
    expect(hospital).toEqual(hospital2)
    const address = myGraph.getProperty('schema:address')
    const address2 = myGraph.getTerm('schema:address')
    expect(address).toEqual(address2)
    const numb = myGraph.getDataType('schema:Number')
    const numb2 = myGraph.getTerm('schema:Number')
    expect(numb).toEqual(numb2)
    const DayOfWeek = myGraph.getEnumeration('schema:DayOfWeek')
    const DayOfWeek2 = myGraph.getTerm('schema:DayOfWeek')
    expect(DayOfWeek).toEqual(DayOfWeek2)
    const Friday = myGraph.getEnumerationMember('schema:Friday')
    const Friday2 = myGraph.getTerm('schema:Friday')
    expect(Friday).toEqual(Friday2)
  })

  test('discoverCompactIRI()', async () => {
    const myGraph = await initGraph()
    await myGraph.addVocabulary(VOC_OBJ_SDO3_7)
    expect(myGraph.discoverCompactIRI('Hotel')).toBe('schema:Hotel')
    expect(myGraph.discoverCompactIRI('schema:Hotel')).toBe('schema:Hotel')
    expect(myGraph.discoverCompactIRI('http://schema.org/Hotel')).toBe('schema:Hotel')
  })

  test('containsLabel()', async () => {
    const myGraph = await initGraph()
    await myGraph.addVocabulary(VOC_OBJ_DACH)
    expect(myGraph.containsLabel(myGraph.classes['dachkg:Trail'], 'Trail')).toBe(true)
    expect(myGraph.containsLabel(myGraph.classes['dachkg:Trail'], 'Auto')).toBe(false)
  })

  test('addGraphNode()', async () => {
    const snowTrailObjEng = {
      '@id': 'dachkg:SnowTrail',
      '@type': 'rdfs:Class',
      'rdfs:comment': { en: 'A path, track or unpaved lane or road for sport activities or walking IN THE SNOW.' },
      'rdfs:label': { en: 'SnowTrail' },
      'rdfs:subClassOf': [
        'dachkg:Trail'
      ]
    }
    const snowTrailObjDe = {
      '@id': 'dachkg:SnowTrail',
      '@type': 'rdfs:Class',
      'rdfs:label': { de: 'Schneeroute' },
      'rdfs:subClassOf': [
        'dachkg:Trail',
        'schema:Hotel'
      ]
    }
    const myGraph = await initGraph()
    await myGraph.addVocabulary(VOC_OBJ_SDO3_7)
    await myGraph.addVocabulary(VOC_OBJ_DACH)
    expect(myGraph.classes['dachkg:SnowTrail']).toBe(undefined)
    await myGraph.addGraphNode(myGraph.classes, snowTrailObjEng)
    expect(myGraph.classes['dachkg:SnowTrail']).not.toBe(undefined)
    expect(myGraph.classes['dachkg:SnowTrail']['rdfs:label'].en).toBe('SnowTrail')
    expect(myGraph.classes['dachkg:SnowTrail']['rdfs:label'].de).toBe(undefined)
    expect(myGraph.classes['dachkg:SnowTrail']['@type']).toBe('rdfs:Class')
    expect(myGraph.classes['dachkg:SnowTrail']['rdfs:subClassOf'].length).toBe(1)
    await myGraph.addGraphNode(myGraph.classes, snowTrailObjDe)
    expect(myGraph.classes['dachkg:SnowTrail']['rdfs:label'].en).toBe('SnowTrail')
    expect(myGraph.classes['dachkg:SnowTrail']['rdfs:label'].de).toBe('Schneeroute')
    expect(myGraph.classes['dachkg:SnowTrail']['@type']).toBe('rdfs:Class')
    expect(myGraph.classes['dachkg:SnowTrail']['rdfs:subClassOf'].length).toBe(2)
    await myGraph.addGraphNode(myGraph.classes, snowTrailObjDe)
    expect(myGraph.classes['dachkg:SnowTrail']['rdfs:label'].en).toBe('SnowTrail')
    expect(myGraph.classes['dachkg:SnowTrail']['rdfs:label'].de).toBe('Schneeroute')
    expect(myGraph.classes['dachkg:SnowTrail']['@type']).toBe('rdfs:Class')
    expect(myGraph.classes['dachkg:SnowTrail']['rdfs:subClassOf'].length).toBe(2)
  })
})
