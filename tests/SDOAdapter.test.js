const SDOAdapter = require('../src/SDOAdapter')
const VOC_OBJ_ZOO = require('./data/exampleExternalVocabulary')
const VOC_OBJ_SDO3_7 = require('./data/schema_3.7')
const VOC_OBJ_GWON = require('./data/graph_with_one_node')
const VOC_URL_ZOO = 'https://raw.githubusercontent.com/semantifyit/schema-org-adapter/master/tests/data/exampleExternalVocabulary.json'
const VOC_URL_SDO5_0 = 'https://raw.githubusercontent.com/schemaorg/schemaorg/master/data/releases/5.0/all-layers.jsonld'
const VOC_URL_SDO_LATEST = 'https://schema.org/version/latest/all-layers.jsonld' // expected to work in node, but not in browser
const VOC_URL_SDO5_0_DIRECT = 'https://schema.org/version/5.0/all-layers.jsonld' // expected to work in node, but not in browser

describe('SDO Adapter methods', () => {
  test('addVocabularies()', async () => {
    const mySA = new SDOAdapter()
    await mySA.addVocabularies([VOC_OBJ_SDO3_7, VOC_OBJ_GWON])
    const testClass = mySA.getClass('namespace:AwesomePerson')
    expect(testClass.getName()).toEqual('validValue')
  })

  test('getVocabularies()', async () => {
    const mySA = new SDOAdapter()
    await mySA.addVocabularies([VOC_OBJ_SDO3_7, VOC_OBJ_ZOO])
    const vocabs = mySA.getVocabularies()
    expect(Object.keys(vocabs).length).toBe(2)
    expect(vocabs.schema).not.toBe(undefined)
    expect(vocabs.ex).not.toBe(undefined)
    expect(vocabs.ex).toBe('https://example-vocab.ex/')
  })

  test('getClass()', async () => {
    const mySA = new SDOAdapter()
    await mySA.addVocabularies([VOC_URL_SDO5_0, VOC_URL_ZOO])
    const Hotel = mySA.getClass('schema:Hotel')
    expect(Hotel.getTermType()).toBe('rdfs:Class')
  })

  test('getListOfClasses()', async () => {
    const mySA = new SDOAdapter()
    await mySA.addVocabularies([VOC_OBJ_SDO3_7, VOC_OBJ_ZOO])
    const allClassesList = mySA.getListOfClasses()
    expect(allClassesList.length).toBe(733)
    expect(allClassesList.includes('schema:DayOfWeek')).toBe(false) //should NOT contain enumerations
  })

  test('getAllClasses()', async () => {
    const mySA = new SDOAdapter()
    await mySA.addVocabularies([VOC_OBJ_SDO3_7, VOC_OBJ_ZOO])
    const allClasses = mySA.getAllClasses()
    expect(allClasses.length).toBe(733)
    const allClassesZoo = mySA.getAllClasses({ fromVocabulary: 'ex' })
    expect(allClassesZoo.length).toBe(2)
    const allClassesSchema = mySA.getAllClasses({ fromVocabulary: 'schema' })
    expect(allClassesSchema.length).toBe(731)
    for (let i = 0; i < allClasses.length; i++) {
      expect(allClasses[i].getTermType()).toBe('rdfs:Class') //should NOT contain enumerations
    }
  })

  test('getProperty()', async () => {
    const mySA = new SDOAdapter()
    await mySA.addVocabularies([VOC_OBJ_SDO3_7, VOC_OBJ_ZOO])
    const address = mySA.getProperty('schema:address')
    expect(address.getTermType()).toBe('rdf:Property')
  })

  test('getListOfProperties()', async () => {
    const mySA = new SDOAdapter()
    await mySA.addVocabularies([VOC_OBJ_SDO3_7, VOC_OBJ_ZOO])
    const allPropertiesList = mySA.getListOfProperties()
    expect(allPropertiesList.length).toBe(1243)
  })

  test('getAllProperties()', async () => {
    const mySA = new SDOAdapter()
    await mySA.addVocabularies([VOC_OBJ_SDO3_7, VOC_OBJ_ZOO])
    const allProperties = mySA.getAllProperties()
    expect(allProperties.length).toBe(1243)
    const allPropertiesEx = mySA.getAllProperties({ fromVocabulary: 'ex' })
    expect(allPropertiesEx.length).toBe(2)
    const allPropertiesSchema = mySA.getAllProperties({ fromVocabulary: 'schema' })
    expect(allPropertiesSchema.length).toBe(1241)
    for (let i = 0; i < allProperties.length; i++) {
      expect(allProperties[i].getTermType()).toBe('rdf:Property')
    }
  })

  test('getDataType()', async () => {
    const mySA = new SDOAdapter()
    await mySA.addVocabularies([VOC_OBJ_SDO3_7, VOC_OBJ_ZOO])
    const Number = mySA.getDataType('schema:Number')
    expect(Number.getTermType()).toBe('schema:DataType')
  })

  test('getListOfDataTypes()', async () => {
    const mySA = new SDOAdapter()
    await mySA.addVocabularies([VOC_OBJ_SDO3_7, VOC_OBJ_ZOO])
    const allDataTypesList = mySA.getListOfDataTypes()
    expect(allDataTypesList.length).toBe(11)
  })

  test('getAllDataTypes()', async () => {
    const mySA = new SDOAdapter()
    await mySA.addVocabularies([VOC_OBJ_SDO3_7, VOC_OBJ_ZOO])
    const allDT = mySA.getAllDataTypes()
    expect(allDT.length).toBe(11)
    const allDataTypesFromEx = mySA.getAllDataTypes({ fromVocabulary: 'ex' })
    expect(allDataTypesFromEx.length).toBe(0)
    const allDataTypesFromSDO = mySA.getAllDataTypes({ fromVocabulary: 'schema' })
    expect(allDataTypesFromSDO.length).toBe(11)
    for (let i = 0; i < allDT.length; i++) {
      expect(allDT[i].getTermType()).toBe('schema:DataType')
    }
  })

  test('getEnumeration()', async () => {
    const mySA = new SDOAdapter()
    await mySA.addVocabularies([VOC_OBJ_SDO3_7, VOC_OBJ_ZOO])
    const DayOfWeek = mySA.getEnumeration('schema:DayOfWeek')
    expect(DayOfWeek.getTermType()).toBe('schema:Enumeration')
  })

  test('getListOfEnumerations()', async () => {
    const mySA = new SDOAdapter()
    await mySA.addVocabularies([VOC_OBJ_SDO3_7, VOC_OBJ_ZOO])
    const allEnumList = mySA.getListOfEnumerations()
    expect(allEnumList.length).toBe(60)
  })

  test('getAllEnumerations()', async () => {
    const mySA = new SDOAdapter()
    await mySA.addVocabularies([VOC_OBJ_SDO3_7, VOC_OBJ_ZOO])
    const allDT = mySA.getAllEnumerations()
    expect(allDT.length).toBe(60)
    for (let i = 0; i < allDT.length; i++) {
      expect(allDT[i].getTermType()).toBe('schema:Enumeration')
    }
  })

  test('getEnumerationMember()', async () => {
    const mySA = new SDOAdapter()
    await mySA.addVocabularies([VOC_OBJ_SDO3_7, VOC_OBJ_ZOO])
    const Friday = mySA.getEnumerationMember('schema:Friday')
    expect(Friday.getTermType()).toBe('soa:EnumerationMember')
  })

  test('getListOfEnumerationMembers()', async () => {
    const mySA = new SDOAdapter()
    await mySA.addVocabularies([VOC_OBJ_SDO3_7, VOC_OBJ_ZOO])
    const allEnumList = mySA.getListOfEnumerationMembers()
    expect(allEnumList.length).toBe(256)
  })

  test('getAllEnumerationMembers()', async () => {
    const mySA = new SDOAdapter()
    await mySA.addVocabularies([VOC_OBJ_SDO3_7, VOC_OBJ_ZOO])
    const allDT = mySA.getAllEnumerationMembers()
    expect(allDT.length).toBe(256)
    for (let i = 0; i < allDT.length; i++) {
      expect(allDT[i].getTermType()).toBe('soa:EnumerationMember')
    }
  })

  test('fetch vocab by URL - direct URL', async () => {
      const mySA = new SDOAdapter()
      await mySA.addVocabularies([VOC_URL_SDO5_0_DIRECT])
      const data1a = mySA.getAllProperties()
      console.log(data1a.length)
      expect(data1a.length > 1000).toEqual(true)
    }
  )
  test('fetch vocab by URL - sdo latest ', async () => {
      const mySA2 = new SDOAdapter()
      await mySA2.addVocabularies([VOC_URL_SDO_LATEST])
      const data1b = mySA2.getAllProperties()
      console.log(data1b.length)
      expect(data1b.length > 1000).toBe(true)
    }
  )

  test('construct SDO URL', async () => {
      const mySA = new SDOAdapter()
      const url = await mySA.constructSDOVocabularyURL()
      const versionPosition = 'https://raw.githubusercontent.com/schemaorg/schemaorg/master/data/releases/'.length
      console.log(url)
      expect(Number(url.substring(versionPosition, versionPosition + 3)) > 5).toBe(true)
      expect(url.includes('schema.jsonld')).toBe(true)
      const url2 = await mySA.constructSDOVocabularyURL('latest')
      console.log(url2)
      expect(Number(url2.substring(versionPosition, versionPosition + 3)) > 5).toBe(true)
      expect(url2.includes('schema.jsonld')).toBe(true)
      const url3 = await mySA.constructSDOVocabularyURL('latest', 'all-layers')
      console.log(url3)
      expect(Number(url3.substring(versionPosition, versionPosition + 3)) > 5).toBe(true)
      expect(url3.includes('all-layers.jsonld')).toBe(true)
      const url4 = await mySA.constructSDOVocabularyURL('3.9', 'all-layers')
      console.log(url4)
      expect(url4).toBe('https://raw.githubusercontent.com/schemaorg/schemaorg/master/data/releases/3.9/all-layers.jsonld')
      const url5 = await mySA.constructSDOVocabularyURL('3.9', 'auto')
      console.log(url5)
      expect(url5).toBe('https://raw.githubusercontent.com/schemaorg/schemaorg/master/data/releases/3.9/auto.jsonld')
    }
  )
  test('get lastest sdo version', async () => {
      const mySA = new SDOAdapter()
      const latestVersion = await mySA.getLatestSDOVersion()
      console.log(latestVersion)
      expect(Number(latestVersion) > 5).toBe(true)
    }
  )
})
