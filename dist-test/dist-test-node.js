const sdoAdapter = require("./../dist/sdoAdapter");
const VOC_OBJ_SDO3_7 = require('../testData/schema_3.7');
const VOC_OBJ_DACH = require('../testData/dachkg_1');
let mySA = new sdoAdapter();

mySA.addVocabularies([VOC_OBJ_SDO3_7, VOC_OBJ_DACH], onStart);

function onStart() {
    let testClass = mySA.getClass("schema:Hotel");
    console.log(testClass.getIRI());
    console.log(testClass.getName());
    console.log(testClass.getDescription("en"));
    console.log(testClass.toJSON(true));

    let testClass2 = mySA.getClass("dachkg:Trail");
    console.log(testClass2.toJSON(true));
}