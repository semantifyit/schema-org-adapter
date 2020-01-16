const SDOAdapter = require('../src/SDOAdapter')
const VOC_EXAMPLE = require('./data/exampleExternalVocabulary')
const mySA = new SDOAdapter()
main()

/**
 * example usage of the library within node.js
 */
async function main () {
  const mySDOUrl = await mySA.constructSDOVocabularyURL('latest', 'all-layers')
  await mySA.addVocabularies([mySDOUrl, VOC_EXAMPLE])
  let AnimalClass = mySA.getClass('ex:Animal')
  console.log(JSON.stringify(AnimalClass.toJSON(true, null), null, 2))

  // const testProp = mySA.getProperty('schema:aspect')
  // console.log('isSuperseededBy() ' + testProp.isSupersededBy())
  //
  // const extVocClass = mySA.getClass('dachkg:Trail')
  // console.log(JSON.stringify(extVocClass.toJSON(false, null), null, 2))
  // testClass = mySA.getClass('schema:Person')
  // console.log(JSON.stringify(testClass.toJSON(false, null), null, 2))
  // const testProperty = mySA.getProperty('schema:translationOfWork')
  // console.log(JSON.stringify(testProperty.toJSON(false, null), null, 2))
  // console.log(JSON.stringify(testProperty.getName('en'), null, 2))
  // const testDataType = mySA.getDataType('schema:Number')
  // console.log(JSON.stringify(testDataType.toJSON(false, null), null, 2))
  // // let testEnumeration = mySA.getEnumeration("schema:MedicalImagingTechnique");
  // // console.log(JSON.stringify(testEnumeration.toJSON(false, null), null, 2));
  // const testEnumerationMember = mySA.getEnumerationMember('schema:Radiography')
  // console.log(JSON.stringify(testEnumerationMember.toJSON(false, null), null, 2))
}
