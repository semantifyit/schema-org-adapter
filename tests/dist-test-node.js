const SDOAdapter = require('../src/SDOAdapter');
const VOC_OBJ_ZOO = require('./data/exampleExternalVocabulary');
// const VOC_URL_ZOO = 'https://raw.githubusercontent.com/semantifyit/schema-org-adapter/master/tests/data/exampleExternalVocabulary.json'
const mySA = new SDOAdapter();
main();

/**
 * example usage of the library within node.js
 */
async function main() {
    const mySDOUrl = await mySA.constructSDOVocabularyURL('latest');
    await mySA.addVocabularies([mySDOUrl, VOC_OBJ_ZOO]);
    let testClass = mySA.getClass('http://schema.org/Person');
    console.log(mySA.getVocabularies());
    console.log('getIRI() ' + testClass.getIRI());
    console.log('getIRI(true) ' + testClass.getIRI(true));
    console.log('getName() ' + testClass.getName());
    console.log('getDescription("en") ' + testClass.getDescription('en'));
    console.log('getProperties(false) ' + testClass.getProperties(false));
    console.log('getProperties(true) ' + testClass.getProperties(true));
    console.log('getProperties(true, {}) ' + testClass.getProperties(true, {}));
    console.log(testClass.toString());
    console.log(JSON.stringify(testClass.toJSON(true, null), null, 2));

    const testProp = mySA.getProperty('schema:aspect');
    console.log('isSuperseededBy() ' + testProp.isSupersededBy());

    const extVocClass = mySA.getClass('ex:Tiger');
    console.log(JSON.stringify(extVocClass.toJSON(false, null), null, 2));
    testClass = mySA.getClass('schema:Person');
    console.log(JSON.stringify(testClass.toJSON(false, null), null, 2));
    const testProperty = mySA.getProperty('schema:translationOfWork');
    console.log(JSON.stringify(testProperty.toJSON(false, null), null, 2));
    console.log(JSON.stringify(testProperty.getName('en'), null, 2));
    const testDataType = mySA.getDataType('schema:Number');
    console.log(JSON.stringify(testDataType.toJSON(false, null), null, 2));
    let testEnumeration = mySA.getEnumeration("schema:MedicalEnumeration");
    console.log(JSON.stringify(testEnumeration.toJSON(true, null), null, 2));
    const testEnumerationMember = mySA.getEnumerationMember('schema:Radiography');
    console.log(JSON.stringify(testEnumerationMember.toJSON(false, null), null, 2));
    console.log(JSON.stringify(testEnumerationMember.toJSON(true, null), null, 2));
}
