const SDOAdapter = require("../src/SDOAdapter");

const VOC_OBJ_DACH = require('../testData/dachkg_1');
const VOC_OBJ_SDO3_7 = require('../testData/schema_3.7');
const VOC_URL_SDO_LATEST = "http://schema.org/version/latest/all-layers.jsonld";

let mySA = new SDOAdapter();
mySA.addVocabularies([VOC_OBJ_SDO3_7, VOC_OBJ_DACH], onStart);

function onStart() {
    let testClass = mySA.getClass("http://schema.org/Book");
    console.log(mySA.getVocabularies());
    console.log("getIRI() "+testClass.getIRI());
    console.log("getIRI(true) "+testClass.getIRI(true));
    console.log("getName() "+testClass.getName());
    console.log('getDescription("en") '+testClass.getDescription("en"));
    console.log('getProperties(false) '+testClass.getProperties(false));
    console.log('getProperties(true) '+testClass.getProperties(true));
    console.log(testClass.toString());
}