const SDOAdapter = require("../src/SDOAdapter");

const VOC_OBJ_DACH = require('../testData/dachkg_1');
const VOC_OBJ_SDO3_7 = require('../testData/schema_3.9');
const VOC_URL_SDO3_9 = "https://raw.githubusercontent.com/schemaorg/schemaorg/master/data/releases/3.9/all-layers.jsonld";
const VOC_URL_SDO_LATEST = "http://schema.org/version/latest/all-layers.jsonld";
const VOC_URL_DACH = "https://raw.githubusercontent.com/STIInnsbruck/dachkg-schema/master/schema/dachkg_schema.json";

let mySA = new SDOAdapter();
mySA.addVocabularies([VOC_URL_SDO_LATEST, VOC_URL_DACH], onStart);

function onStart() {
    // let testClass = mySA.getClass("http://schema.org/Person");
    // console.log(mySA.getVocabularies());
    // console.log("getIRI() " + testClass.getIRI());
    // console.log("getIRI(true) " + testClass.getIRI(true));
    // console.log("getName() " + testClass.getName());
    // console.log('getDescription("en") ' + testClass.getDescription("en"));
    // console.log('getProperties(false) ' + testClass.getProperties(false));
    // console.log('getProperties(true) ' + testClass.getProperties(true));
    // console.log('getProperties(true, {}) ' + testClass.getProperties(true, {}));
    // console.log(testClass.toString());
    // console.log(JSON.stringify(testClass.toJSON(true, null), null, 2));

    // let testProp = mySA.getProperty("schema:aspect");
    // console.log("isSuperseededBy() " + testProp.isSuperseededBy());

    let extVocClass = mySA.getClass("dachkg:Trail");
    console.log(JSON.stringify(extVocClass.toJSON(false, null), null, 2));
    let testClass = mySA.getClass("schema:Person");
    console.log(JSON.stringify(testClass.toJSON(false, null), null, 2));
    let testProperty = mySA.getProperty("schema:translationOfWork");
    console.log(JSON.stringify(testProperty.toJSON(false, null), null, 2));
    console.log(JSON.stringify(testProperty.getName("en"),null,2));
    // let testDataType = mySA.getDataType("schema:Number");
    // console.log(JSON.stringify(testDataType.toJSON(false, null), null, 2));
    // let testEnumeration = mySA.getEnumeration("schema:MedicalImagingTechnique");
    // console.log(JSON.stringify(testEnumeration.toJSON(false, null), null, 2));
    // let testEnumerationMember = mySA.getEnumerationMember("schema:Radiography");
    // console.log(JSON.stringify(testEnumerationMember.toJSON(false, null), null, 2));
}