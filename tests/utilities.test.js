const util = require('./../src/utilities')
const SDOAdapter = require('../src/SDOAdapter')
const VOC_OBJ_DACH = require('./data/dachkg_1')
const VOC_OBJ_SDO3_7 = require('./data/schema_3.7')

/**
 *
 */
async function initAdapter () {
  const mySA = new SDOAdapter()
  await mySA.addVocabularies([VOC_OBJ_SDO3_7, VOC_OBJ_DACH])
  return mySA
}

const testContext = {
  rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
  rdfs: 'http://www.w3.org/2000/01/rdf-schema#',
  xsd: 'http://www.w3.org/2001/XMLSchema#',
  dc: 'http://purl.org/dc/terms/',
  schema: 'http://schema.org/',
  'dach-kg': 'http://http://dachkg.org/ontology/1.0/',
  soa: 'http://schema-org-adapter.at/vocabTerms/',
  'soa:superClassOf': {
    '@id': 'soa:superClassOf',
    '@type': '@id'
  },
  'soa:superPropertyOf': {
    '@id': 'soa:superPropertyOf',
    '@type': '@id'
  },
  'soa:hasProperty': {
    '@id': 'soa:hasProperty',
    '@type': '@id'
  },
  'soa:isRangeOf': {
    '@id': 'soa:isRangeOf',
    '@type': '@id'
  },
  'soa:hasEnumerationMember': {
    '@id': 'soa:hasEnumerationMember',
    '@type': '@id'
  },
  'soa:enumerationDomainIncludes': {
    '@id': 'soa:enumerationDomainIncludes',
    '@type': '@id'
  },
  'rdfs:subClassOf': {
    '@id': 'rdfs:subClassOf',
    '@type': '@id'
  },
  'rdfs:subPropertyOf': {
    '@id': 'rdfs:subPropertyOf',
    '@type': '@id'
  },
  'schema:isPartOf': {
    '@id': 'schema:isPartOf',
    '@type': '@id'
  },
  'schema:domainIncludes': {
    '@id': 'schema:domainIncludes',
    '@type': '@id'
  },
  'schema:rangeIncludes': {
    '@id': 'schema:rangeIncludes',
    '@type': '@id'
  },
  'schema:supersededBy': {
    '@id': 'schema:supersededBy',
    '@type': '@id'
  },
  'schema:inverseOf': {
    '@id': 'schema:inverseOf',
    '@type': '@id'
  },
  'dc:source': {
    '@id': 'dc:source',
    '@type': '@id'
  }
}

describe('util tools', () => {
  test('toCompactIRI()', async () => {
    const input = 'http://schema.org/Book'
    const expectedOutcome = 'schema:Book'
    expect(util.toCompactIRI(input, testContext)).toBe(expectedOutcome)
  })
  test('toAbsoluteIRI()', async () => {
    const input = 'dach-kg:endLocation'
    const expectedOutcome = 'http://http://dachkg.org/ontology/1.0/endLocation'
    expect(util.toAbsoluteIRI(input, testContext)).toBe(expectedOutcome)
  })
  test('applyFilter()', async () => {
    const mySA = await initAdapter()
    const MedicalWebPage = mySA.getClass('schema:MedicalWebPage')
    const filter1 = null
    const filter2 = {}
    const filter3 = { termType: 'Class' }
    const filter4 = { termType: 'Property' }
    const filter5 = { isSuperseded: false }
    const filter6 = { isSuperseded: true }
    const filter7 = { termType: ['Property', 'Class'] }
    const filter8 = { termType: ['Enumeration', 'Class'] }
    const filter9 = { termType: ['Property'], fromVocabulary: ['schema'] }
    const filter10 = { termType: ['Property'], fromVocabulary: 'dachkg' }
    const filter11 = { termType: ['Property'], fromVocabulary: ['schema', 'dachkg'] }
    expect(MedicalWebPage.getProperties(true, filter1)).toContain('schema:aspect')
    expect(MedicalWebPage.getProperties(true, filter2)).toContain('schema:aspect')
    expect(MedicalWebPage.getProperties(true, filter3)).not.toContain('schema:aspect')
    expect(MedicalWebPage.getProperties(true, filter4)).toContain('schema:aspect')
    expect(MedicalWebPage.getProperties(true, filter5)).not.toContain('schema:aspect')
    expect(MedicalWebPage.getProperties(true, filter5)).toContain('schema:name')
    expect(MedicalWebPage.getProperties(true, filter6)).toContain('schema:aspect')
    expect(MedicalWebPage.getProperties(true, filter6)).not.toContain('schema:name')
    expect(mySA.getListOfProperties(filter6)).not.toContain('schema:name')
    expect(mySA.getListOfProperties(filter6)).toContain('schema:aspect')
    expect(mySA.getListOfProperties(filter4)).toContain('schema:aspect')
    expect(mySA.getListOfProperties(filter4)).toContain('schema:name')
    expect(mySA.getListOfProperties(filter1)).toContain('dachkg:endLocation')
    expect(mySA.getListOfProperties(filter7)).toContain('dachkg:endLocation')
    expect(mySA.getListOfProperties(filter8)).not.toContain('dachkg:endLocation')
    expect(mySA.getListOfProperties(filter9)).not.toContain('dachkg:endLocation')
    expect(mySA.getListOfProperties(filter9)).toContain('schema:name')
    expect(mySA.getListOfProperties(filter10)).toContain('dachkg:endLocation')
    expect(mySA.getListOfProperties(filter10)).not.toContain('schema:name')
    expect(mySA.getListOfProperties(filter11)).toContain('dachkg:endLocation')
    expect(mySA.getListOfProperties(filter11)).toContain('schema:aspect')
  })
})
